-- ============================================================
-- Migration 024: ai_outputs + ai_prompt_templates
--
-- ai_outputs:          Versioned cache of all AI-generated content.
-- ai_prompt_templates: Versioned prompt templates loaded at
--                      runtime by Edge Functions.
--
-- Design principles:
--   - Every AI output is stored with full provenance:
--     model, prompt version, prompt hash, input hash, and
--     the complete input snapshot sent to the model.
--   - Cache invalidation is event-driven. is_current = false
--     is set by Postgres triggers on source tables, not by TTL.
--     valid_until is a backstop TTL, not the primary mechanism.
--   - Prompt templates are never hardcoded in application logic.
--     Edge Functions load the active template at runtime so
--     prompts can be updated without code deployment.
--   - All outputs preserve history: a new generation creates
--     a new row rather than overwriting the prior one.
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── output_type enum ─────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE ai_output_type AS ENUM (
    'company_narrative',         -- Full investment thesis narrative per company
    'conviction_interpretation', -- Plain-English explanation of conviction score
    'risk_summary',              -- Synthesized risk register narrative
    'catalyst_summary',          -- Near-term opportunity summary narrative
    'peer_comparison',           -- Company vs sector peers narrative
    'sector_brief',              -- Sector intelligence weekly brief
    'market_summary',            -- Daily market intelligence snapshot
    'alert_summary'              -- Event-driven alert narrative (1–2 sentences)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── ai_outputs ───────────────────────────────────────────────────────────────
-- Stores every AI-generated content item with full auditability.
-- The primary cache lookup is: output_type + reference_key + is_current = true.

CREATE TABLE IF NOT EXISTS ai_outputs (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── What was generated ────────────────────────────────────
  output_type         ai_output_type NOT NULL,
  reference_key       text          NOT NULL,
  -- For company outputs:  the symbol    (e.g. 'MCB')
  -- For sector outputs:   the slug      (e.g. 'banking')
  -- For market outputs:   'market'
  -- For alert outputs:    'symbol:alert_type' (e.g. 'HBL:high_severity_risk')

  -- ── Generated content ────────────────────────────────────
  raw_text            text          NOT NULL,
  -- The full prose output exactly as returned by the API.

  content             jsonb         NOT NULL DEFAULT '{}',
  -- Structured parsed metadata extracted from the output.
  -- Shape varies by output_type. Examples:
  --   company_narrative: { key_themes: [...], risk_headline: "...", catalyst_headline: "..." }
  --   conviction_interpretation: { interpretation: "...", score_at_generation: 72 }
  --   market_summary: { market_direction: "positive", sector_leaders: [...] }

  -- ── Provenance ────────────────────────────────────────────
  model_version       text          NOT NULL,
  -- Exact model string used: e.g. 'claude-sonnet-4-6'

  prompt_version      text          NOT NULL,
  -- Semver from ai_prompt_templates.version: e.g. '1.0.0'

  prompt_hash         text          NOT NULL,
  -- SHA-256 of the exact system_prompt + user_prompt sent.
  -- Enables exact prompt reproducibility independent of template version.

  input_hash          text          NOT NULL,
  -- SHA-256 of input_snapshot serialized as sorted JSON.
  -- Cache is considered stale when input data changes and this hash differs
  -- from the hash computed from current DB data.

  input_snapshot      jsonb         NOT NULL DEFAULT '{}',
  -- The complete structured context block sent to the model.
  -- Stored for auditability — any output can be reproduced from this.

  -- ── Cost tracking ─────────────────────────────────────────
  prompt_tokens       integer,      -- Tokens in the prompt (input)
  completion_tokens   integer,      -- Tokens in the completion (output)
  total_tokens        integer,      -- Sum (prompt + completion)
  generation_ms       integer,      -- API round-trip latency in milliseconds

  -- ── Cache lifecycle ───────────────────────────────────────
  is_current          boolean       NOT NULL DEFAULT true,
  -- True on the most recent valid output for (output_type, reference_key).
  -- Set to false by trigger or manual invalidation — never deleted.

  valid_until         timestamptz,
  -- Backstop TTL. NULL = no time-based expiry (event-driven invalidation only).
  -- Default TTLs (set by generating Edge Function):
  --   company_narrative:        72 hours
  --   conviction_interpretation: 48 hours
  --   sector_brief:             7 days
  --   market_summary:           24 hours
  --   alert_summary:            48 hours
  --   peer_comparison:          7 days

  invalidated_at      timestamptz,
  -- Set when cache is invalidated before valid_until expires.
  -- NULL means cache is still valid (or expired via valid_until).

  invalidation_reason text,
  -- 'block_update'        → intelligence block inserted/updated
  -- 'tier_change'         → conviction tier changed
  -- 'prompt_version_bump' → prompt template version incremented
  -- 'metrics_update'      → new financial period available
  -- 'manual'              → admin override
  -- 'ttl_expired'         → valid_until passed (set by cleanup job)

  created_at          timestamptz   NOT NULL DEFAULT now()
);

-- Primary cache lookup: current output for (type, key)
CREATE UNIQUE INDEX IF NOT EXISTS ai_outputs_current_idx
  ON ai_outputs (output_type, reference_key)
  WHERE is_current = true;

-- History lookup: all outputs for a (type, key) ordered by creation
CREATE INDEX IF NOT EXISTS ai_outputs_history_idx
  ON ai_outputs (output_type, reference_key, created_at DESC);

-- TTL expiry scan (nightly cleanup job)
CREATE INDEX IF NOT EXISTS ai_outputs_valid_until_idx
  ON ai_outputs (valid_until)
  WHERE valid_until IS NOT NULL AND invalidated_at IS NULL;

-- Prompt version queries (for batch invalidation on prompt bump)
CREATE INDEX IF NOT EXISTS ai_outputs_prompt_version_idx
  ON ai_outputs (output_type, prompt_version)
  WHERE is_current = true;

-- Cost analysis
CREATE INDEX IF NOT EXISTS ai_outputs_created_at_idx
  ON ai_outputs (created_at DESC);

COMMENT ON TABLE ai_outputs IS
  'Versioned cache of all AI-generated intelligence content. '
  'Never deleted — new generations create new rows. '
  'Primary cache lookup: SELECT * FROM ai_outputs '
  'WHERE output_type = $1 AND reference_key = $2 AND is_current = true LIMIT 1. '
  'Token costs tracked per row for budget monitoring.';

-- ── ai_prompt_templates ───────────────────────────────────────────────────────
-- Versioned prompt templates loaded at runtime by Edge Functions.
-- Never hardcode prompts in application code — always load from this table.
-- Only one is_active = true row per output_type at any time.

CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Identity ──────────────────────────────────────────────
  prompt_type         ai_output_type NOT NULL,
  version             text          NOT NULL,
  -- Semver: '1.0.0'
  -- Patch (1.0.x): wording improvement, no structure change
  -- Minor (1.x.0): structure change → mark old cached outputs for regeneration on next request
  -- Major (x.0.0): breaking change → immediately invalidate all cached outputs of this type

  -- ── Prompt content ────────────────────────────────────────
  system_prompt       text          NOT NULL,
  -- The system role instruction defining persona, constraints, and output format.
  -- Always begins with the invariant AHM analyst persona core.

  user_template       text          NOT NULL,
  -- User message template with {{variable}} placeholders.
  -- Edge Functions substitute values before sending to the API.

  -- ── Validation ────────────────────────────────────────────
  variables           jsonb         NOT NULL DEFAULT '[]',
  -- Array of variable names expected in user_template.
  -- Edge Function validates all variables are present before generation.
  -- Example: ["symbol", "company_name", "conviction_score", "sub_scores", "thesis_themes"]

  -- ── Model configuration ───────────────────────────────────
  model_target        text          NOT NULL DEFAULT 'claude-sonnet-4-6',
  -- Default model for this prompt type.
  -- Can be overridden per-call for A/B testing.

  max_tokens          integer       NOT NULL DEFAULT 800,
  temperature         numeric       NOT NULL DEFAULT 0.3,
  -- 0.3 for factual interpretation outputs (conviction, risk, catalyst)
  -- 0.5 for narrative outputs (company_narrative, sector_brief)
  -- 0.6 for market summaries and alert text

  -- ── Lifecycle ─────────────────────────────────────────────
  is_active           boolean       NOT NULL DEFAULT false,
  -- Set to true on the version to use for new generations.
  -- Setting a new version active should simultaneously set
  -- the prior version to inactive via the application layer.

  change_notes        text,
  -- Human-readable description of what changed in this version.

  created_at          timestamptz   NOT NULL DEFAULT now(),
  deprecated_at       timestamptz,
  -- Set when a version is superseded by a newer version.

  UNIQUE (prompt_type, version)
);

-- Active template lookup (primary access pattern)
CREATE UNIQUE INDEX IF NOT EXISTS ai_prompt_templates_active_idx
  ON ai_prompt_templates (prompt_type)
  WHERE is_active = true;

-- Version history
CREATE INDEX IF NOT EXISTS ai_prompt_templates_type_version_idx
  ON ai_prompt_templates (prompt_type, version DESC);

COMMENT ON TABLE ai_prompt_templates IS
  'Versioned AI prompt templates. Edge Functions always load the active template '
  'at runtime — never hardcode prompts in application logic. '
  'Enables prompt iteration, A/B testing, and rollback without code deployment. '
  'Active template lookup: SELECT * FROM ai_prompt_templates '
  'WHERE prompt_type = $1 AND is_active = true LIMIT 1.';

-- ── Helper view: cache hit rate by output type ────────────────────────────────
-- Used by monitoring dashboard to track caching efficiency.

CREATE OR REPLACE VIEW ai_output_cache_stats AS
SELECT
  output_type,
  COUNT(*) FILTER (WHERE is_current = true)                        AS current_count,
  COUNT(*) FILTER (WHERE is_current = true AND invalidated_at IS NULL
                   AND (valid_until IS NULL OR valid_until > now())) AS valid_cache_count,
  COUNT(*) FILTER (WHERE is_current = false)                        AS historical_count,
  SUM(total_tokens) FILTER (WHERE created_at >= now() - interval '24 hours') AS tokens_last_24h,
  ROUND(AVG(generation_ms))                                         AS avg_generation_ms,
  MAX(created_at)                                                   AS last_generated_at
FROM ai_outputs
GROUP BY output_type;

COMMENT ON VIEW ai_output_cache_stats IS
  'Cache efficiency and token cost summary per output type. '
  'Monitor daily: valid_cache_count / current_count = cache hit rate target > 70%.';
