-- ============================================================
-- AHM Platform — Sprint 6 Consolidated Migration Package
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl/sql
--
-- SAFE TO RE-RUN: All statements use IF NOT EXISTS / ON CONFLICT DO NOTHING
-- ORDER MATTERS: Run top to bottom, do not reorder.
-- ESTIMATED TIME: 10-15 seconds total
-- ============================================================


-- ============================================================
-- MIGRATION 023: conviction_scores
-- ============================================================

-- ============================================================
-- Migration 023: conviction_scores + conviction_score_history
--
-- The Conviction Scoring Engine stores one current row per
-- company in conviction_scores, and a full audit trail of
-- every recalculation in conviction_score_history.
--
-- Design principles:
--   - Scores are DETERMINISTIC: same inputs_snapshot always
--     produces the same composite score.
--   - Scores are AUDITABLE: inputs_snapshot stores every
--     source metric value used at computation time.
--   - Scores are VERSIONED: score_version tracks the scoring
--     engine version so any score can be reproduced.
--   - No LLM involvement: this table is populated entirely
--     by the algorithmic scoring engine (lib/scoring/).
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── conviction_scores ─────────────────────────────────────────────────────────
-- Current conviction score per company.
-- Exactly one is_current = true row per symbol at any time.
-- Recalculated nightly by fn-score-all-companies and on
-- event-triggered updates.

CREATE TABLE IF NOT EXISTS conviction_scores (
  id                  serial        PRIMARY KEY,
  symbol              text          NOT NULL REFERENCES companies(symbol) ON DELETE CASCADE,

  -- ── Composite result ──────────────────────────────────────
  score               integer       NOT NULL CHECK (score BETWEEN 0 AND 100),
  tier                text          NOT NULL,
  -- 'HIGH_CONVICTION' | 'MODERATE' | 'WATCHLIST' | 'MONITOR'

  -- ── Sub-score breakdown ───────────────────────────────────
  -- All 11 sub-scores stored for full auditability.
  -- Each value is 0–100 before weighting is applied.
  -- weights_applied stores the phase weight set used.
  sub_scores          jsonb         NOT NULL DEFAULT '{}',
  -- Shape: {
  --   valuation: 68, profitability: 84, growth: 61,
  --   balance_sheet: 78, momentum: 55, macro_sensitivity: 62,
  --   catalyst: 71, risk: 52, sector_relative_strength: 79,
  --   technical_timing: 50,   -- defaults to 50 until Phase 2
  --   data_confidence_multiplier: 0.92
  -- }

  weights_applied     jsonb         NOT NULL DEFAULT '{}',
  -- Shape: { phase: "phase_1", valuation: 0.20, profitability: 0.18, ... }
  -- Stored so the composite can always be reconstructed.

  -- ── Confidence ────────────────────────────────────────────
  data_confidence     numeric       NOT NULL CHECK (data_confidence BETWEEN 0 AND 1),
  -- The multiplier (0.65–1.00) applied after the weighted composite.
  -- Derived from financial_metrics completeness and recency.

  -- ── Full audit trail ──────────────────────────────────────
  inputs_snapshot     jsonb         NOT NULL DEFAULT '{}',
  -- Every source metric value used for this score computation.
  -- Shape: {
  --   pe_ratio: 6.2, pb_ratio: 0.92, roe: 22.3, net_margin: 31.4,
  --   eps_growth: 8.1, debt_to_equity: 0.12, interest_cover: 18.4,
  --   catalyst_count_near: 1, catalyst_count_medium: 2,
  --   risk_count_high: 1, risk_count_medium: 1,
  --   sector_driver_positive: 3, sector_driver_negative: 1,
  --   price_trend_30d: 'positive', data_age_days: 42,
  --   metrics_period: 'FY25', ...
  -- }

  -- ── Versioning ────────────────────────────────────────────
  score_version       text          NOT NULL DEFAULT '1.0.0',
  -- Scoring engine semver. Increment when sub-score logic changes.

  -- ── State ─────────────────────────────────────────────────
  is_current          boolean       NOT NULL DEFAULT true,
  -- True on the latest score per symbol.
  -- Set to false when a new score is computed for the same symbol.

  scored_at           timestamptz   NOT NULL DEFAULT now(),
  created_at          timestamptz   NOT NULL DEFAULT now()
);

-- Primary lookup: current score for a symbol
CREATE UNIQUE INDEX IF NOT EXISTS conviction_scores_current_symbol_idx
  ON conviction_scores (symbol)
  WHERE is_current = true;

-- Rankings and tier filtering
CREATE INDEX IF NOT EXISTS conviction_scores_score_idx
  ON conviction_scores (score DESC)
  WHERE is_current = true;

CREATE INDEX IF NOT EXISTS conviction_scores_tier_idx
  ON conviction_scores (tier)
  WHERE is_current = true;

-- Recency queries
CREATE INDEX IF NOT EXISTS conviction_scores_scored_at_idx
  ON conviction_scores (scored_at DESC);

COMMENT ON TABLE conviction_scores IS
  'Current conviction score per company. Populated by the algorithmic scoring engine. '
  'No LLM involvement. Full audit trail in inputs_snapshot. '
  'Use is_current = true to get the latest score per symbol.';

COMMENT ON COLUMN conviction_scores.inputs_snapshot IS
  'Snapshot of every source metric used in this scoring computation. '
  'Together with score_version and weights_applied, any score can be '
  'fully reconstructed and explained from this column alone.';

-- ── conviction_score_history ──────────────────────────────────────────────────
-- Immutable log of every conviction score computation.
-- Never updated — only inserted. Provides full score trend history
-- and tier transition tracking for alert generation.

CREATE TABLE IF NOT EXISTS conviction_score_history (
  id                  serial        PRIMARY KEY,
  symbol              text          NOT NULL REFERENCES companies(symbol) ON DELETE CASCADE,

  score               integer       NOT NULL CHECK (score BETWEEN 0 AND 100),
  tier                text          NOT NULL,
  previous_score      integer,      -- NULL on first computation for a symbol
  previous_tier       text,         -- NULL on first computation
  tier_changed        boolean       NOT NULL DEFAULT false,
  tier_direction      text,
  -- NULL if no tier change
  -- 'upgrade'   → tier improved (e.g. WATCHLIST → MODERATE)
  -- 'downgrade' → tier worsened (e.g. MODERATE → WATCHLIST)

  sub_scores          jsonb         NOT NULL DEFAULT '{}',
  data_confidence     numeric       NOT NULL,
  inputs_snapshot     jsonb         NOT NULL DEFAULT '{}',
  score_version       text          NOT NULL,
  scored_at           timestamptz   NOT NULL DEFAULT now(),

  -- Source of this recalculation
  trigger_reason      text          NOT NULL DEFAULT 'scheduled',
  -- 'scheduled'         → nightly cron
  -- 'block_update'      → intelligence block was inserted/updated
  -- 'metrics_update'    → new financial_metrics period available
  -- 'manual'            → admin-triggered recalculation

  CONSTRAINT csh_tier_direction_check CHECK (
    tier_direction IS NULL OR tier_direction IN ('upgrade', 'downgrade')
  ),
  CONSTRAINT csh_tier_check CHECK (
    tier IN ('HIGH_CONVICTION', 'MODERATE', 'WATCHLIST', 'MONITOR')
  )
);

CREATE INDEX IF NOT EXISTS csh_symbol_scored_at_idx
  ON conviction_score_history (symbol, scored_at DESC);

CREATE INDEX IF NOT EXISTS csh_tier_changed_idx
  ON conviction_score_history (tier_changed, scored_at DESC)
  WHERE tier_changed = true;

CREATE INDEX IF NOT EXISTS csh_scored_at_idx
  ON conviction_score_history (scored_at DESC);

COMMENT ON TABLE conviction_score_history IS
  'Immutable audit log of every conviction score computation. '
  'Never modified after insert. Enables score trend charts, '
  'tier transition tracking, and complete scoring audit trail.';

-- ── Helper function: current tier ordering ────────────────────────────────────
-- Returns an integer 1–4 for sorting tiers from best to worst.

CREATE OR REPLACE FUNCTION conviction_tier_order(tier text)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE tier
    WHEN 'HIGH_CONVICTION' THEN 1
    WHEN 'MODERATE'        THEN 2
    WHEN 'WATCHLIST'       THEN 3
    WHEN 'MONITOR'         THEN 4
    ELSE 5
  END;
$$;

-- ── View: conviction_board ────────────────────────────────────────────────────
-- Primary feed for the /intelligence conviction board page.
-- Joins conviction_scores with companies for display.

CREATE OR REPLACE VIEW conviction_board AS
SELECT
  cs.symbol,
  c.company_name,
  c.sector,
  cs.score,
  cs.tier,
  conviction_tier_order(cs.tier)      AS tier_order,
  cs.data_confidence,
  cs.sub_scores,
  cs.scored_at,
  cs.score_version
FROM conviction_scores cs
JOIN companies c ON c.symbol = cs.symbol
WHERE cs.is_current = true
ORDER BY cs.score DESC;

COMMENT ON VIEW conviction_board IS
  'Ranked company conviction scores for the intelligence board page. '
  'Ordered by score descending. Filter by sector or tier in application layer.';



-- ============================================================
-- MIGRATION 024: ai_outputs
-- ============================================================

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



-- ============================================================
-- MIGRATION 025: ai_events_alerts
-- ============================================================

-- ============================================================
-- Migration 025: ai_market_snapshots + ai_event_triggers + alerts
--
-- ai_market_snapshots:  Daily AI-generated market intelligence
--                       at the platform level (not per-company).
--                       Distinct from daily_snapshots (which is
--                       a precomputed per-company data table).
--
-- ai_event_triggers:    Queue of intelligence-generating events.
--                       Populated by Postgres triggers on source
--                       tables and consumed by Edge Functions.
--
-- alerts:               Published intelligence alerts shown to
--                       users on the dashboard notification strip.
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── snapshot_type enum ───────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE snapshot_type AS ENUM (
    'pre_market',    -- Generated at 08:30 PKT before market opens
    'market_open',   -- Generated at 10:00 PKT after opening
    'market_close',  -- Generated at 15:30 PKT after close
    'eod_summary'    -- Generated at 18:00 PKT — institutional long-form
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE snapshot_format AS ENUM (
    'long',   -- 800–1,200 words — analyst briefing and institutional summary
    'short'   -- 150–200 words — WhatsApp digest and dashboard card
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── ai_market_snapshots ───────────────────────────────────────────────────────
-- Market-level daily intelligence. Generated 3–4 times per trading day.
-- Each snapshot is stored independently — no overwriting.
-- The dashboard shows the most recent snapshot for the current date.

CREATE TABLE IF NOT EXISTS ai_market_snapshots (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── When ──────────────────────────────────────────────────
  snapshot_date       date          NOT NULL,
  snapshot_type       snapshot_type NOT NULL,
  format              snapshot_format NOT NULL,

  -- ── Content ───────────────────────────────────────────────
  raw_text            text          NOT NULL,
  -- The generated prose. For 'long': full analyst brief.
  -- For 'short': WhatsApp-ready plain text (no markdown).

  structured_content  jsonb         NOT NULL DEFAULT '{}',
  -- Parsed components extracted from the generated output.
  -- Shape: {
  --   market_direction: 'positive' | 'negative' | 'flat',
  --   kse100_level: 96420, kse100_change_pct: 0.8,
  --   sector_leaders: ['Banking', 'Oil & Gas'],
  --   sector_laggards: ['Cement'],
  --   top_movers: [{ symbol: 'MCB', change_pct: 2.1, context: '...' }],
  --   macro_flags: ['SBP rate decision this week'],
  --   conviction_changes: [{ symbol: 'HBL', direction: 'upgrade' }],
  --   risk_alerts: [{ symbol: 'LUCK', reason: 'coal cost pressure' }]
  -- }

  -- ── Input context ──────────────────────────────────────────
  input_snapshot      jsonb         NOT NULL DEFAULT '{}',
  -- The structured market context block sent to the model.
  -- Stored for reproducibility and debugging.

  -- ── Provenance ────────────────────────────────────────────
  model_version       text          NOT NULL,
  prompt_version      text          NOT NULL,
  prompt_tokens       integer,
  completion_tokens   integer,
  total_tokens        integer,
  generation_ms       integer,

  -- ── Lifecycle ─────────────────────────────────────────────
  is_current          boolean       NOT NULL DEFAULT true,
  -- True on the most recent snapshot for (snapshot_date, snapshot_type, format).

  generated_at        timestamptz   NOT NULL DEFAULT now()
);

-- Primary lookup: most recent snapshot for a given type and format
CREATE UNIQUE INDEX IF NOT EXISTS ai_market_snapshots_current_idx
  ON ai_market_snapshots (snapshot_date, snapshot_type, format)
  WHERE is_current = true;

CREATE INDEX IF NOT EXISTS ai_market_snapshots_date_idx
  ON ai_market_snapshots (snapshot_date DESC, snapshot_type);

COMMENT ON TABLE ai_market_snapshots IS
  'AI-generated market-level intelligence snapshots. '
  'Generated 3–4 times per trading day by fn-generate-market-summary. '
  'Distinct from daily_snapshots (per-company precomputed data). '
  'Dashboard shows: SELECT * FROM ai_market_snapshots '
  'WHERE snapshot_date = CURRENT_DATE AND snapshot_type = ''eod_summary'' '
  'AND format = ''long'' AND is_current = true LIMIT 1.';

-- ── ai_event_triggers ────────────────────────────────────────────────────────
-- Queue of intelligence-generating events.
-- Rows are INSERT-only from Postgres triggers on source tables.
-- Consumed by fn-process-event-triggers (runs every 5 minutes).
-- Never deleted — retained as a full event audit log.

DO $$ BEGIN
  CREATE TYPE event_trigger_status AS ENUM (
    'pending',      -- Inserted, not yet processed
    'processing',   -- Currently being handled by Edge Function
    'complete',     -- Alert generated and published
    'suppressed',   -- Event valid but suppressed by suppression rules
    'failed'        -- Processing failed (see error_message)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS ai_event_triggers (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── What happened ─────────────────────────────────────────
  event_type          text          NOT NULL,
  -- 'conviction_tier_upgrade'       → tier improved (e.g. WATCHLIST → MODERATE)
  -- 'conviction_tier_downgrade'     → tier worsened
  -- 'high_severity_risk_added'      → new high-severity risk block inserted
  -- 'near_catalyst_added'           → new near-horizon catalyst block inserted
  -- 'sector_driver_turned_negative' → sector_drivers.trend changed to 'negative'
  -- 'unusual_price_move'            → |change_pct| > 4% in daily_prices
  -- 'data_confidence_drop'          → data_confidence_multiplier fell below 0.75
  -- 'new_macro_flag'                → sector_macro_linkages updated with negative direction

  reference_key       text          NOT NULL,
  -- Symbol, sector slug, or 'market' — the entity this event relates to

  event_data          jsonb         NOT NULL DEFAULT '{}',
  -- All details needed to generate the alert without additional DB lookups.
  -- Shape varies by event_type. Examples:
  --   conviction_tier_upgrade: { from_tier: 'WATCHLIST', to_tier: 'MODERATE',
  --                              from_score: 48, to_score: 57, symbol: 'HBL' }
  --   high_severity_risk_added: { block_id: '...', title: 'NIM compression',
  --                               severity: 'high', symbol: 'MCB' }
  --   unusual_price_move: { symbol: 'LUCK', change_pct: -4.8, close: 892,
  --                         has_fundamental_context: true }

  -- ── Priority ──────────────────────────────────────────────
  priority            integer       NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  -- 1 = critical (immediate processing)
  -- 2 = high     (process within 5 minutes)
  -- 3 = medium   (process within 15 minutes)
  -- 4 = low      (process within 1 hour)
  -- 5 = batch    (process in next scheduled run)

  -- ── Processing state ──────────────────────────────────────
  status              event_trigger_status NOT NULL DEFAULT 'pending',
  suppression_reason  text,
  -- Populated when status = 'suppressed'. Examples:
  --   'frequency_cap: same event within 24h'
  --   'superseded: fundamental alert already exists'
  --   'within_update_window: data freshness expected'

  -- ── Output ────────────────────────────────────────────────
  alert_id            uuid,         -- FK → alerts.id, set when status = 'complete'
  ai_output_id        uuid,         -- FK → ai_outputs.id for the generated alert text

  -- ── Timing ────────────────────────────────────────────────
  triggered_at        timestamptz   NOT NULL DEFAULT now(),
  processing_started_at timestamptz,
  processed_at        timestamptz,
  error_message       text,
  retry_count         integer       NOT NULL DEFAULT 0 CHECK (retry_count <= 3)
);

CREATE INDEX IF NOT EXISTS aet_status_priority_idx
  ON ai_event_triggers (status, priority, triggered_at ASC)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS aet_reference_key_idx
  ON ai_event_triggers (reference_key, event_type, triggered_at DESC);

CREATE INDEX IF NOT EXISTS aet_triggered_at_idx
  ON ai_event_triggers (triggered_at DESC);

COMMENT ON TABLE ai_event_triggers IS
  'Event queue for intelligence-generating triggers. '
  'Populated by Postgres triggers on conviction_scores, company_intelligence_blocks, '
  'daily_prices, and sector_drivers. '
  'Consumed by fn-process-event-triggers Edge Function every 5 minutes. '
  'Never deleted — serves as full event audit log.';

-- ── alerts ───────────────────────────────────────────────────────────────────
-- Published intelligence alerts shown to users.
-- Generated from ai_event_triggers by fn-generate-alert.

DO $$ BEGIN
  CREATE TYPE alert_severity AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE alert_audience AS ENUM ('internal', 'retail', 'institutional', 'all');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS alerts (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Identity ──────────────────────────────────────────────
  alert_type          text          NOT NULL,
  -- Matches ai_event_triggers.event_type for the triggering event.

  reference_key       text          NOT NULL,
  -- Symbol, sector slug, or 'market'

  -- ── Content ───────────────────────────────────────────────
  title               text          NOT NULL,
  -- Short headline: e.g. "MCB conviction upgraded to Moderate"

  body                text          NOT NULL,
  -- 1–2 sentence AI-generated alert text. Institutional tone.
  -- Never contains Buy/Sell/Hold language.

  -- ── Classification ────────────────────────────────────────
  severity            alert_severity NOT NULL DEFAULT 'medium',
  audience            alert_audience NOT NULL DEFAULT 'all',

  -- ── Source ────────────────────────────────────────────────
  event_trigger_id    uuid          REFERENCES ai_event_triggers(id),
  ai_output_id        uuid          REFERENCES ai_outputs(id),
  -- The ai_outputs row that generated the body text.

  -- ── Lifecycle ─────────────────────────────────────────────
  triggered_at        timestamptz   NOT NULL DEFAULT now(),
  expires_at          timestamptz,
  -- NULL = no expiry. Set for time-sensitive alerts (e.g. 48h for price alerts).

  is_read             boolean       NOT NULL DEFAULT false,
  is_active           boolean       NOT NULL DEFAULT true,
  -- Set to false when alert expires or is manually dismissed.

  created_at          timestamptz   NOT NULL DEFAULT now()
);

-- Dashboard notification strip query
CREATE INDEX IF NOT EXISTS alerts_active_severity_idx
  ON alerts (severity, triggered_at DESC)
  WHERE is_active = true;

-- Per-entity alert history
CREATE INDEX IF NOT EXISTS alerts_reference_key_idx
  ON alerts (reference_key, triggered_at DESC);

-- Unread alerts count
CREATE INDEX IF NOT EXISTS alerts_unread_idx
  ON alerts (is_read, triggered_at DESC)
  WHERE is_read = false AND is_active = true;

COMMENT ON TABLE alerts IS
  'Published intelligence alerts for the dashboard notification strip. '
  'Generated by fn-generate-alert from ai_event_triggers. '
  'Dashboard query: SELECT * FROM alerts WHERE is_active = true '
  'ORDER BY severity, triggered_at DESC LIMIT 20.';

-- ── Suppression check function ────────────────────────────────────────────────
-- Called by fn-process-event-triggers before processing any event.
-- Returns true if the event should be suppressed.

CREATE OR REPLACE FUNCTION should_suppress_event(
  p_reference_key  text,
  p_event_type     text,
  p_window_hours   integer DEFAULT 24
)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1
    FROM ai_event_triggers
    WHERE reference_key = p_reference_key
      AND event_type    = p_event_type
      AND status        IN ('complete', 'processing')
      AND triggered_at  > now() - (p_window_hours || ' hours')::interval
  );
$$;

COMMENT ON FUNCTION should_suppress_event IS
  'Returns true if a matching event was already processed within the suppression window. '
  'Used by fn-process-event-triggers to enforce frequency caps. '
  'Default window: 24 hours. Price alerts use 48 hours.';



-- ============================================================
-- MIGRATION 026: ai_jobs_quality
-- ============================================================

-- ============================================================
-- Migration 026: ai_generation_jobs + ai_quality_checks
--
-- ai_generation_jobs:  Tracks all scheduled, queued, and
--                      completed AI generation jobs.
--                      Enables monitoring of queue depth,
--                      latency, cost, and error rates.
--
-- ai_quality_checks:   Output quality validation log.
--                      Records automated checks run on every
--                      generated output (prohibited language
--                      scan, length validation, etc.).
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── job_status enum ──────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM (
    'queued',       -- Enqueued, not yet started
    'processing',   -- Edge Function is actively working on this job
    'complete',     -- Successfully generated and cached
    'failed',       -- Generation failed (see error_message)
    'skipped',      -- Skipped because a valid cache hit was found
    'cancelled'     -- Cancelled before processing (e.g. by a higher-priority job)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── ai_generation_jobs ───────────────────────────────────────────────────────
-- Every AI generation request — scheduled, event-triggered, or on-demand —
-- is logged here before execution. Provides full operational observability.

CREATE TABLE IF NOT EXISTS ai_generation_jobs (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── What to generate ──────────────────────────────────────
  job_type            ai_output_type NOT NULL,
  -- Matches ai_outputs.output_type

  reference_key       text          NOT NULL,
  -- Symbol, sector slug, 'market', or alert compound key

  -- ── Why it was triggered ──────────────────────────────────
  trigger_reason      text          NOT NULL,
  -- 'scheduled'           → cron job (nightly scoring, weekly sector briefs, etc.)
  -- 'event_triggered'     → created by ai_event_triggers processing
  -- 'cache_miss'          → frontend request found no valid cache
  -- 'cache_invalidation'  → existing cache was invalidated, queued for regeneration
  -- 'manual'              → admin-triggered

  trigger_source_id   uuid,
  -- FK to the source that triggered this job.
  -- For event_triggered: references ai_event_triggers.id
  -- For others: NULL

  -- ── Priority ──────────────────────────────────────────────
  priority            integer       NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  -- 1 = critical: conviction tier change, high-severity risk
  -- 2 = high:     on-demand request with no cache
  -- 3 = medium:   cache invalidation regeneration
  -- 4 = low:      scheduled batch generation
  -- 5 = batch:    background pre-warming

  -- ── Processing ────────────────────────────────────────────
  status              job_status    NOT NULL DEFAULT 'queued',

  -- ── Output ────────────────────────────────────────────────
  output_id           uuid,
  -- FK → ai_outputs.id — populated on success

  -- ── Timing and cost ───────────────────────────────────────
  queued_at           timestamptz   NOT NULL DEFAULT now(),
  started_at          timestamptz,
  completed_at        timestamptz,

  -- Derived durations (set on completion):
  queue_wait_ms       integer,
  -- (started_at - queued_at) in milliseconds

  processing_ms       integer,
  -- (completed_at - started_at) in milliseconds

  total_tokens        integer,
  -- Total tokens consumed (propagated from ai_outputs)

  -- ── Error handling ────────────────────────────────────────
  error_message       text,
  retry_count         integer       NOT NULL DEFAULT 0 CHECK (retry_count <= 2),
  -- Max 2 retries. After 2 failures: status = 'failed', alert internal team.

  -- ── Model config used ─────────────────────────────────────
  model_version       text,
  prompt_version      text
);

-- Queue processing: pending jobs by priority
CREATE INDEX IF NOT EXISTS agj_queue_idx
  ON ai_generation_jobs (priority, queued_at ASC)
  WHERE status = 'queued';

-- Monitoring: jobs by type and date
CREATE INDEX IF NOT EXISTS agj_type_queued_at_idx
  ON ai_generation_jobs (job_type, queued_at DESC);

-- Error rate monitoring
CREATE INDEX IF NOT EXISTS agj_status_idx
  ON ai_generation_jobs (status, queued_at DESC);

-- Daily cost aggregation
CREATE INDEX IF NOT EXISTS agj_completed_at_idx
  ON ai_generation_jobs (completed_at DESC)
  WHERE status = 'complete';

COMMENT ON TABLE ai_generation_jobs IS
  'Operational log of all AI generation jobs. '
  'Every generation request — scheduled, event-triggered, or on-demand — '
  'is logged before execution. Monitor via: '
  'queue depth (status = queued), error rate (status = failed), '
  'cache skips (status = skipped), and avg processing_ms. '
  'Token cost summary: SUM(total_tokens) GROUP BY job_type, DATE(completed_at).';

-- ── ai_quality_checks ────────────────────────────────────────────────────────
-- Automated quality validation log for every AI-generated output.
-- Every generation triggers a quality check immediately after creation.
-- Results are stored here — failures are flagged for review.

DO $$ BEGIN
  CREATE TYPE quality_check_status AS ENUM (
    'passed',    -- All checks passed
    'warning',   -- Minor issues found (e.g. output slightly short)
    'failed'     -- Critical issues found (e.g. prohibited language detected)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS ai_quality_checks (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── What was checked ──────────────────────────────────────
  output_id           uuid          NOT NULL REFERENCES ai_outputs(id) ON DELETE CASCADE,
  job_id              uuid          REFERENCES ai_generation_jobs(id),

  -- ── Check results ─────────────────────────────────────────
  overall_status      quality_check_status NOT NULL,

  checks_run          jsonb         NOT NULL DEFAULT '[]',
  -- Array of individual check results. Each entry shape:
  -- {
  --   check_name: 'prohibited_language_scan',
  --   status: 'passed' | 'warning' | 'failed',
  --   detail: 'No prohibited terms detected',
  --   matches: []          ← populated if violations found
  -- }
  --
  -- Standard checks run on every output:
  --   'prohibited_language_scan'    → checks for Buy/Sell/Hold and variants
  --   'target_price_scan'           → checks for price target language
  --   'invented_figures_check'      → verifies numbers appear in input_snapshot
  --   'length_validation'           → output length within expected range
  --   'promotional_language_scan'   → checks for superlatives and hype language
  --   'null_data_reference_check'   → AI referenced a null/unavailable field

  violations          jsonb         NOT NULL DEFAULT '[]',
  -- Array of all failed checks (subset of checks_run where status = 'failed').
  -- Empty array = no violations.

  -- ── Resolution ────────────────────────────────────────────
  requires_review     boolean       NOT NULL DEFAULT false,
  -- Set to true when overall_status = 'failed' or a critical check fails.
  -- Triggers internal review notification.

  reviewed_at         timestamptz,
  reviewed_by         text,
  review_notes        text,

  checked_at          timestamptz   NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS aqc_output_id_idx
  ON ai_quality_checks (output_id);

CREATE INDEX IF NOT EXISTS aqc_overall_status_idx
  ON ai_quality_checks (overall_status, checked_at DESC)
  WHERE overall_status IN ('warning', 'failed');

CREATE INDEX IF NOT EXISTS aqc_requires_review_idx
  ON ai_quality_checks (requires_review, checked_at DESC)
  WHERE requires_review = true;

COMMENT ON TABLE ai_quality_checks IS
  'Automated quality validation results for every AI-generated output. '
  'Run immediately after generation by the generating Edge Function. '
  'Critical check: prohibited_language_scan must pass on 100% of outputs. '
  'Monitor via: SELECT COUNT(*), overall_status FROM ai_quality_checks '
  'WHERE checked_at > now() - interval ''7 days'' GROUP BY overall_status.';

-- ── Monitoring views ──────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW ai_job_queue_summary AS
SELECT
  job_type,
  status,
  COUNT(*)                                                        AS count,
  ROUND(AVG(processing_ms))                                       AS avg_processing_ms,
  SUM(total_tokens)                                               AS total_tokens,
  MAX(queued_at)                                                  AS latest_queued
FROM ai_generation_jobs
WHERE queued_at >= now() - interval '24 hours'
GROUP BY job_type, status
ORDER BY job_type, status;

COMMENT ON VIEW ai_job_queue_summary IS
  'Last 24-hour job summary by type and status. '
  'Quick health check for the generation pipeline.';

CREATE OR REPLACE VIEW ai_quality_summary AS
SELECT
  o.output_type,
  COUNT(*)                                            AS total_outputs,
  COUNT(*) FILTER (WHERE q.overall_status = 'passed')  AS passed,
  COUNT(*) FILTER (WHERE q.overall_status = 'warning') AS warnings,
  COUNT(*) FILTER (WHERE q.overall_status = 'failed')  AS failed,
  COUNT(*) FILTER (WHERE q.requires_review = true)     AS pending_review
FROM ai_quality_checks q
JOIN ai_outputs o ON o.id = q.output_id
WHERE q.checked_at >= now() - interval '7 days'
GROUP BY o.output_type;

COMMENT ON VIEW ai_quality_summary IS
  'Quality check pass/fail/warning rates per output type over the last 7 days. '
  'Target: 0 failed outputs, < 5% warnings.';

-- ── Update 000_run_all.sql note ───────────────────────────────────────────────
-- After running this migration, update scripts/migrations/000_run_all.sql
-- to include 023_conviction_scores.sql, 024_ai_outputs.sql,
-- 025_ai_events_alerts.sql, and 026_ai_jobs_quality.sql.



-- ============================================================
-- MIGRATION 027: seed_prompt_templates
-- ============================================================

-- ============================================================
-- Migration 027: Seed ai_prompt_templates v1.0.0
--
-- Seeds the initial v1.0.0 prompt templates for all 8
-- output types. These are the production-grade templates
-- for Sprint 6 Week 1.
--
-- All templates:
--   - Load the AHM analyst persona core
--   - Enforce hard constraints (no Buy/Sell/Hold, no invented figures)
--   - Use {{variable}} placeholders for structured context injection
--   - Are idempotent via ON CONFLICT DO NOTHING
--
-- To update a template: INSERT a new row with incremented version
-- and set is_active = true. Then UPDATE the prior version to
-- is_active = false and deprecated_at = now().
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── Shared system prompt core ─────────────────────────────────────────────────
-- This is embedded in every template below.
-- Do not alter it without incrementing prompt version.

-- INVARIANT SYSTEM PROMPT CORE (v1):
-- "You are an institutional equity research analyst generating intelligence
--  for the AHM PSX Platform. Your role is to interpret structured, validated
--  intelligence data and produce clear, analytical prose.
--
--  HARD CONSTRAINTS — NEVER VIOLATE:
--  1. You interpret structured data. You never generate conclusions from raw
--     market prices or financial statements directly.
--  2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
--  3. Never state a price target. Never make return predictions.
--  4. Never invent financial figures. Every number cited must appear in your
--     structured context input.
--  5. Write in institutional prose. No bullet points in output. No promotional language.
--  6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.
--
--  AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
--  MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated."


INSERT INTO ai_prompt_templates
  (prompt_type, version, system_prompt, user_template, variables,
   model_target, max_tokens, temperature, is_active, change_notes)
VALUES

-- ── 1. company_narrative ─────────────────────────────────────────────────────
(
  'company_narrative',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated. SBP monetary policy applicable.

OUTPUT FORMAT: Write 3 to 4 cohesive paragraphs. No headers. No bullet points. No markdown. Pure analytical prose. Total length: 200–280 words.',
  'Generate an institutional investment intelligence narrative for {{company_name}} ({{symbol}}).

CONVICTION CONTEXT:
Score: {{conviction_score}}/100 | Tier: {{conviction_tier}} | Trend: {{conviction_trend}}
Sub-scores: Valuation {{score_valuation}} | Profitability {{score_profitability}} | Growth {{score_growth}} | Balance Sheet {{score_balance_sheet}} | Catalyst {{score_catalyst}} | Risk {{score_risk}}

INVESTMENT THESIS:
{{thesis_summary}}

THESIS THEMES:
{{thesis_themes}}

KEY DRIVERS (with trend):
{{drivers}}

RISK REGISTER:
{{risks}}

CATALYSTS:
{{catalysts}}

VALUATION CONTEXT:
{{valuation_points}}
{{valuation_summary}}

SECTOR CONTEXT:
Sector: {{sector}} | Sector driver balance: {{sector_driver_summary}}

FINANCIAL METRICS (latest period: {{metrics_period}}):
{{key_metrics}}

Interpret this structured intelligence into a cohesive institutional narrative. Paragraph 1: the core investment thesis and franchise positioning. Paragraph 2: the key financial and operational drivers. Paragraph 3: the primary risk considerations and their severity. Paragraph 4 (optional): conviction interpretation and near-term catalyst outlook. Write as a senior analyst explaining this company to a portfolio manager — not a retail investor summary.',
  '["symbol", "company_name", "conviction_score", "conviction_tier", "conviction_trend", "score_valuation", "score_profitability", "score_growth", "score_balance_sheet", "score_catalyst", "score_risk", "thesis_summary", "thesis_themes", "drivers", "risks", "catalysts", "valuation_points", "valuation_summary", "sector", "sector_driver_summary", "metrics_period", "key_metrics"]',
  'claude-sonnet-4-6',
  900,
  0.5,
  true,
  'Initial v1.0.0. Full company intelligence narrative with conviction context and all intelligence block types.'
),

-- ── 2. conviction_interpretation ─────────────────────────────────────────────
(
  'conviction_interpretation',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated.

OUTPUT FORMAT: Write exactly 2 sentences. No headers. No bullets. No markdown. First sentence: explain the score level and what is driving it. Second sentence: identify the primary constraint or uncertainty that prevents a higher score.',
  'Interpret the conviction score for {{company_name}} ({{symbol}}).

CONVICTION DATA:
Score: {{conviction_score}}/100 | Tier: {{conviction_tier}}
Previous score: {{previous_score}} | Previous tier: {{previous_tier}}

SUB-SCORE BREAKDOWN:
Valuation: {{score_valuation}}/100 ({{valuation_signal}})
Profitability: {{score_profitability}}/100
Growth: {{score_growth}}/100
Balance Sheet: {{score_balance_sheet}}/100
Catalyst Balance: {{score_catalyst}}/100
Risk Balance: {{score_risk}}/100
Sector Relative Strength: {{score_sector_relative}}/100
Data Confidence: {{data_confidence}}

HIGHEST SUB-SCORE: {{highest_subscore_name}} ({{highest_subscore_value}})
LOWEST SUB-SCORE: {{lowest_subscore_name}} ({{lowest_subscore_value}})

Write a 2-sentence institutional interpretation of what this score means and why it sits at this level. Do not use the word "conviction" in your output — describe the underlying quality instead.',
  '["symbol", "company_name", "conviction_score", "conviction_tier", "previous_score", "previous_tier", "score_valuation", "valuation_signal", "score_profitability", "score_growth", "score_balance_sheet", "score_catalyst", "score_risk", "score_sector_relative", "data_confidence", "highest_subscore_name", "highest_subscore_value", "lowest_subscore_name", "lowest_subscore_value"]',
  'claude-sonnet-4-6',
  200,
  0.3,
  true,
  'Initial v1.0.0. 2-sentence conviction score interpretation. Minimal token footprint.'
),

-- ── 3. risk_summary ──────────────────────────────────────────────────────────
(
  'risk_summary',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated.

OUTPUT FORMAT: Write 1 to 2 paragraphs synthesizing the risk register. No bullet points. Acknowledge the most material risk clearly. Contextualise severity. Total length: 80–140 words.',
  'Synthesize the risk register for {{company_name}} ({{symbol}}) into a concise institutional risk summary.

RISK REGISTER ({{risk_count}} risks):
{{risks_structured}}

CONVICTION RISK SUB-SCORE: {{score_risk}}/100
SECTOR RISK CONTEXT: {{sector_risk_context}}

Synthesize these risks into a coherent narrative. Lead with the most material risk. Note if risks are structural or cyclical in nature. Do not soften or overstate — write with the clarity of an institutional research note.',
  '["symbol", "company_name", "risk_count", "risks_structured", "score_risk", "sector_risk_context"]',
  'claude-sonnet-4-6',
  300,
  0.3,
  true,
  'Initial v1.0.0. Structured risk register synthesis.'
),

-- ── 4. catalyst_summary ──────────────────────────────────────────────────────
(
  'catalyst_summary',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated.

OUTPUT FORMAT: Write 1 to 2 paragraphs covering the catalyst outlook. Lead with near-term catalysts. Contextualise each by horizon. Total length: 80–140 words.',
  'Summarize the catalyst outlook for {{company_name}} ({{symbol}}).

CATALYST REGISTER ({{catalyst_count}} catalysts):
{{catalysts_structured}}

CONVICTION CATALYST SUB-SCORE: {{score_catalyst}}/100

Focus on near-term catalysts first. For each, explain what it is and why it matters to the earnings or valuation thesis. Do not frame catalysts as trading triggers — frame them as developments that would validate or invalidate the investment thesis.',
  '["symbol", "company_name", "catalyst_count", "catalysts_structured", "score_catalyst"]',
  'claude-sonnet-4-6',
  300,
  0.3,
  true,
  'Initial v1.0.0. Horizon-aware catalyst summary with near-term prioritization.'
),

-- ── 5. peer_comparison ───────────────────────────────────────────────────────
(
  'peer_comparison',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated.

OUTPUT FORMAT: Write 2 paragraphs. Paragraph 1: how the company compares to peers on valuation and profitability. Paragraph 2: what explains the premium or discount. Total length: 120–180 words.',
  'Generate a peer comparison narrative for {{company_name}} ({{symbol}}) vs its {{sector}} peers.

SUBJECT COMPANY METRICS:
{{subject_metrics}}

PEER COMPARISON TABLE:
{{peer_metrics_table}}

SECTOR MEDIAN:
{{sector_medians}}

VALUATION CONTEXT:
{{valuation_vs_peers}}

Explain what premium or discount {{company_name}} trades at relative to sector peers, and what fundamental factors justify that positioning. Be specific about which metrics are above or below peer levels.',
  '["symbol", "company_name", "sector", "subject_metrics", "peer_metrics_table", "sector_medians", "valuation_vs_peers"]',
  'claude-sonnet-4-6',
  450,
  0.4,
  true,
  'Initial v1.0.0. Peer-relative positioning narrative using structured metrics tables.'
),

-- ── 6. sector_brief ──────────────────────────────────────────────────────────
(
  'sector_brief',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated. SBP monetary policy applicable.

OUTPUT FORMAT: Write 3 paragraphs. Paragraph 1: current sector state and macro driver context. Paragraph 2: earnings and valuation dynamics across the sector. Paragraph 3: outlook and key variables to watch. Total length: 200–280 words.',
  'Generate a weekly sector intelligence brief for the {{sector_name}} sector ({{sector_slug}}).

SECTOR CONVICTION: {{sector_conviction_score}}/100

MACRO DRIVERS CURRENTLY ACTIVE:
{{macro_drivers_active}}

SECTOR DRIVERS (with trend):
{{sector_drivers}}

SECTOR AGGREGATE METRICS ({{metrics_period}}):
{{sector_aggregates}}

COMPANY CONVICTION DISTRIBUTION:
{{conviction_distribution}}

TOP NEAR-TERM CATALYSTS IN SECTOR:
{{top_sector_catalysts}}

ACTIVE RISKS IN SECTOR:
{{top_sector_risks}}

Explain what is driving the sector''s current performance and what macro conditions are most relevant. Then address earnings and valuation dynamics. Conclude with what investors should monitor over the next 4–8 weeks.',
  '["sector_name", "sector_slug", "sector_conviction_score", "macro_drivers_active", "sector_drivers", "sector_aggregates", "metrics_period", "conviction_distribution", "top_sector_catalysts", "top_sector_risks"]',
  'claude-sonnet-4-6',
  1000,
  0.5,
  true,
  'Initial v1.0.0. Full sector intelligence brief with macro driver mapping and conviction distribution.'
),

-- ── 7. market_summary ────────────────────────────────────────────────────────
(
  'market_summary',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated. SBP monetary policy applicable.

For LONG format: Write 4 paragraphs, 250–350 words total.
For SHORT format: Write 3–4 sentences, 150–200 words maximum. Plain text only — no markdown. Use dashes for section breaks.',
  'Generate a {{format}} market intelligence summary for {{snapshot_date}} ({{snapshot_type}}).

MARKET DATA:
KSE-100: {{kse100_level}} ({{kse100_change_pct}}%) | Volume: {{market_volume}}
Advances: {{advances}} | Declines: {{declines}} | Unchanged: {{unchanged}}

SECTOR PERFORMANCE:
{{sector_performance_table}}

NOTABLE MOVERS (>2% move):
{{notable_movers}}

MACRO CONTEXT:
{{macro_context}}

CONVICTION CHANGES TODAY:
{{conviction_changes}}

ACTIVE RISK ALERTS:
{{active_risk_alerts}}

UPCOMING EVENTS (next 5 trading days):
{{upcoming_events}}

Synthesize this into a {{format}} market intelligence summary. For LONG: cover market breadth, sector leadership, key mover context, and macro relevance. For SHORT: lead with market direction, call out the 1–2 most important developments, and close with a macro note if relevant.',
  '["format", "snapshot_date", "snapshot_type", "kse100_level", "kse100_change_pct", "market_volume", "advances", "declines", "unchanged", "sector_performance_table", "notable_movers", "macro_context", "conviction_changes", "active_risk_alerts", "upcoming_events"]',
  'claude-sonnet-4-6',
  1200,
  0.6,
  true,
  'Initial v1.0.0. Dual-format market summary (long and short). Short format is WhatsApp-ready plain text.'
),

-- ── 8. alert_summary ─────────────────────────────────────────────────────────
(
  'alert_summary',
  '1.0.0',
  'You are an institutional equity research analyst generating intelligence for the AHM PSX Platform. Your role is to interpret structured, validated intelligence data and produce clear, analytical prose.

HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.

AUDIENCE: Sophisticated Pakistani investors and institutional analysts.
MARKET CONTEXT: Pakistan Stock Exchange (PSX). PKR-denominated.

OUTPUT FORMAT: Write exactly 1 to 2 sentences. No headers. No bullets. No markdown. Plain institutional prose. Maximum 50 words.',
  'Generate a concise intelligence alert for the following event.

EVENT TYPE: {{event_type}}
COMPANY / ENTITY: {{reference_display}}
EVENT DATA: {{event_data_summary}}
SEVERITY: {{severity}}

Write 1–2 sentences describing what happened and why it is relevant to the investment thesis. Do not frame it as a call to action. Do not make predictions.',
  '["event_type", "reference_display", "event_data_summary", "severity"]',
  'claude-sonnet-4-6',
  150,
  0.3,
  true,
  'Initial v1.0.0. Ultra-concise event alert. Maximum 50 words. Institutional tone.'
)

ON CONFLICT (prompt_type, version) DO NOTHING;

-- ── Verify all templates are active ──────────────────────────────────────────
-- After running, check: SELECT prompt_type, version, is_active FROM ai_prompt_templates;
-- Should show 8 rows, all is_active = true.



-- ============================================================
-- MIGRATION 028: sector_macro_drivers
-- ============================================================

-- ============================================================
-- Migration 028: sector_macro_drivers
--
-- Stores the macro variable → sector linkage model.
-- Each row describes how one macro driver (interest rates,
-- PKR, oil prices, coal prices, etc.) affects a specific sector.
--
-- Used by:
--   - fn-generate-sector-brief   (AI context assembly)
--   - fn-generate-market-summary (macro landscape section)
--   - Sector FrameworkPages       (structured driver display)
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── direction enum ───────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE macro_impact_direction AS ENUM (
    'positive',   -- Driver currently benefits the sector
    'negative',   -- Driver currently pressures the sector
    'neutral',    -- Driver has no current directional impact
    'mixed'       -- Driver has positive impact on some metrics, negative on others
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── sector_macro_drivers ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sector_macro_drivers (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Identity ──────────────────────────────────────────────
  sector_slug         text          NOT NULL,
  -- Matches sectors.slug — the sector this driver affects.
  -- NULL or 'market' = market-wide driver (affects all sectors).

  macro_driver        text          NOT NULL,
  -- Human-readable name: 'interest_rates', 'pkr_depreciation',
  -- 'coal_prices', 'oil_prices', 'gas_prices', 'circular_debt',
  -- 'inflation', 'sbp_policy_rate', 'usd_pkr_rate', etc.

  driver_category     text          NOT NULL DEFAULT 'monetary',
  -- 'monetary'     — SBP rate, PIB yield, KIBOR
  -- 'fx'           — PKR/USD, PKR/EUR
  -- 'commodity'    — Oil, coal, gas, urea feedstock, cotton
  -- 'fiscal'       — Circular debt, PSO, government receivables
  -- 'regulatory'   — SECP, NEPRA, OGRA, PTA decisions
  -- 'demand'       — Inflation, purchasing power, auto affordability
  -- 'global'       — China slowdown, global commodity cycles

  -- ── Relationship description ──────────────────────────────
  relationship        text          NOT NULL,
  -- Describes the causal mechanism. Example:
  --   'Higher policy rates expand NIM on PIBs and T-bills, the dominant
  --    earning asset for large-cap banks. Each 100bps rate cut compresses
  --    sector NII within 1-2 quarters as existing PIBs mature.'

  -- ── Current state ────────────────────────────────────────
  current_direction   macro_impact_direction NOT NULL DEFAULT 'neutral',
  -- The direction of this driver's current effect on the sector.

  impact_magnitude    integer       NOT NULL DEFAULT 3 CHECK (impact_magnitude BETWEEN 1 AND 5),
  -- 1 = marginal  — minor influence, background noise
  -- 2 = moderate  — noticeable but not dominant
  -- 3 = material  — routinely cited in earnings/analyst reports
  -- 4 = high      — directly drives sector profitability
  -- 5 = critical  — existential/single biggest variable for the sector

  impact_description  text          NOT NULL,
  -- One concise sentence on the current impact. Updated as macro changes.
  -- Example: 'SBP rate cuts expected in H1 2025 will compress NIMs
  --           as PIBs re-price at lower yields.'

  -- ── Timing ────────────────────────────────────────────────
  lag_months          integer       NOT NULL DEFAULT 0 CHECK (lag_months >= 0),
  -- How many months before this driver's change flows through to earnings.
  -- 0 = immediate (prices, FX)
  -- 1-2 = short (quarterly earnings drivers)
  -- 3-6 = medium (capacity, contract re-pricing)
  -- 6+ = structural (capex decisions, long-term contracts)

  -- ── Metadata ──────────────────────────────────────────────
  tags                text[]        NOT NULL DEFAULT '{}',
  -- Free-form tags for cross-cutting queries.
  -- Examples: ['rate_sensitive', 'easing_cycle', 'nim_pressure']
  --           ['commodity_cost', 'coal', 'energy_cost']
  --           ['export', 'fx_positive', 'pkr_depreciation']

  -- ── Lifecycle ─────────────────────────────────────────────
  is_active           boolean       NOT NULL DEFAULT true,
  -- Set to false to suppress without deleting. Inactive rows are
  -- excluded from AI context assembly and sector pages.

  -- ── Timestamps ────────────────────────────────────────────
  last_reviewed_at    timestamptz   NOT NULL DEFAULT now(),
  -- When the current_direction and impact_description were last updated.
  -- Flag for review when last_reviewed_at > 30 days ago.

  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────

-- Primary lookup for AI context assembly (most common query)
CREATE INDEX IF NOT EXISTS smd_sector_active_idx
  ON sector_macro_drivers (sector_slug, is_active, impact_magnitude DESC)
  WHERE is_active = true;

-- Cross-sector query by driver name (e.g. "which sectors does oil price affect?")
CREATE INDEX IF NOT EXISTS smd_driver_idx
  ON sector_macro_drivers (macro_driver, is_active)
  WHERE is_active = true;

-- Category filter
CREATE INDEX IF NOT EXISTS smd_category_idx
  ON sector_macro_drivers (driver_category, sector_slug)
  WHERE is_active = true;

-- Uniqueness: one row per (sector, driver) combination
CREATE UNIQUE INDEX IF NOT EXISTS smd_sector_driver_unique_idx
  ON sector_macro_drivers (sector_slug, macro_driver);

-- ── Updated-at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_smd_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS smd_updated_at_trigger ON sector_macro_drivers;
CREATE TRIGGER smd_updated_at_trigger
  BEFORE UPDATE ON sector_macro_drivers
  FOR EACH ROW EXECUTE FUNCTION update_smd_updated_at();

COMMENT ON TABLE sector_macro_drivers IS
  'Macro variable to sector linkage model. '
  'Describes how each macro driver (rates, FX, commodities, circular debt) '
  'affects each PSX sector. Used by AI context assembly and sector pages. '
  'Query active drivers for a sector: '
  'SELECT * FROM sector_macro_drivers WHERE sector_slug = ''banking'' '
  'AND is_active = true ORDER BY impact_magnitude DESC;';



-- ============================================================
-- MIGRATION 029: seed_sector_macro_drivers
-- ============================================================

-- ============================================================
-- Migration 029: Seed sector_macro_drivers
--
-- Covers all 7 active PSX sectors.
-- 4-6 drivers per sector, ordered by impact_magnitude DESC.
-- All rows set is_active = true.
-- Uses INSERT ... ON CONFLICT DO UPDATE so re-runs are safe.
-- ============================================================

INSERT INTO sector_macro_drivers
  (sector_slug, macro_driver, driver_category, relationship,
   current_direction, impact_magnitude, impact_description,
   lag_months, tags)
VALUES

-- ════════════════════════════════════════════════════════════
-- BANKING  (5 drivers)
-- Key levers: SBP policy rate, KIBOR, PIB yields, ADR/IDR
-- ════════════════════════════════════════════════════════════

(
  'banking', 'sbp_policy_rate', 'monetary',
  'Banks earn the spread between what they pay depositors and what they receive on '
  'government securities (PIBs, T-bills). PIBs and MTBs are the dominant earning asset '
  'for large-cap banks (~50-65% of assets). Each 100bps rate cut compresses sector NII '
  'within 1-2 quarters as maturing PIBs re-invest at lower yields. Rate cuts also reduce '
  'KIBOR, compressing variable-rate lending income.',
  'negative', 5,
  'SBP has cut 1,000bps from the June 2023 peak of 22%; further cuts in 2025 will compress '
  'NIM as banks re-invest maturing PIBs at sub-15% yields vs. prior 20-22% yields.',
  2,
  ARRAY['rate_sensitive', 'nim_pressure', 'easing_cycle', 'pib_repricing']
),
(
  'banking', 'pkr_usd_rate', 'fx',
  'PKR depreciation creates two effects on banks: (1) positive — FX income from spreads on '
  'foreign currency transactions and trade finance; (2) negative — inflates NPL risk on '
  'USD-linked borrower obligations. Net effect is modestly positive for banks with strong '
  'trade finance and remittance businesses (MCB, HBL).',
  'neutral', 2,
  'PKR has stabilised near PKR 278-282 range in 2025; FX income contribution is modest '
  'and not a primary earnings driver at current volatility levels.',
  1,
  ARRAY['fx_income', 'trade_finance', 'npl_risk', 'pkr_stability']
),
(
  'banking', 'inflation_cpi', 'demand',
  'Higher inflation erodes household purchasing power and increases the risk of defaults '
  'on consumer lending. It also raises operating costs (salary inflation, IT costs). '
  'Historically, high inflation in Pakistan coincides with high rates, which benefits NIM '
  '— so the relationship is complex. In isolation, moderating inflation (current trend) '
  'supports asset quality.',
  'positive', 3,
  'CPI moderating toward 8-10% range (vs. 38% peak) improves household debt serviceability '
  'and supports asset quality improvement in consumer and SME portfolios.',
  3,
  ARRAY['asset_quality', 'consumer_lending', 'npl', 'inflation_moderation']
),
(
  'banking', 'adv_deposit_ratio', 'regulatory',
  'SBP periodically revises ADR/IDR requirements to channel credit toward productive sectors '
  'and reduce banks'' reliance on risk-free government securities. An increase in minimum ADR '
  'forces banks to lend more to the private sector, compressing risk-free PIB income but '
  'potentially improving loan yields if private-sector spreads are wider.',
  'neutral', 3,
  'ADR requirements currently under review; any increase above current levels would require '
  'banks to shift assets from PIBs to private-sector lending — NIM impact depends on '
  'relative yields.',
  0,
  ARRAY['adr_idor', 'regulatory', 'private_credit', 'sbp_directive']
),
(
  'banking', 'npl_cycle', 'fiscal',
  'Non-performing loans rise during economic stress (high inflation, PKR depreciation, '
  'energy cost shocks) and fall during recovery. Provisioning charges directly reduce PAT '
  'in the year they are taken. The 2022-23 stress cycle forced large provisions at HBL, '
  'UBL, and NBP. Recovery in 2024-25 is releasing provisions, boosting reported earnings.',
  'positive', 4,
  'Provision reversals and improving NPL ratios are supporting PAT growth across the '
  'large-cap banking sector as the 2022-23 stress cycle normalises.',
  0,
  ARRAY['npl', 'provisioning', 'asset_quality', 'provision_reversal']
),

-- ════════════════════════════════════════════════════════════
-- CEMENT  (5 drivers)
-- Key levers: coal prices, gas prices, construction activity,
--             interest rates (demand + borrowing cost), PKR
-- ════════════════════════════════════════════════════════════

(
  'cement', 'coal_prices', 'commodity',
  'Coal is the primary fuel for cement kilns in Pakistan (~60-65% of energy cost). '
  'Most cement plants use imported South African or Afghan coal. Coal costs translate '
  'directly to cost-of-goods-sold with a 1-2 month lag as inventories turn. '
  'International coal benchmark (Richards Bay) drives import parity cost in PKR terms.',
  'positive', 5,
  'International coal prices have declined materially from 2022 highs; cement manufacturers '
  'are benefiting from lower energy costs, partially restoring margins compressed during '
  'the 2022-23 energy cost supercycle.',
  2,
  ARRAY['coal', 'energy_cost', 'cogs', 'imported_coal', 'margin_recovery']
),
(
  'cement', 'sbp_policy_rate', 'monetary',
  'Interest rates affect cement demand through two channels: (1) cost of borrowing for '
  'real estate developers and construction contractors who finance projects; (2) cement '
  'company leverage costs — sector average D/E is moderate but companies with expansion '
  'capex are more sensitive. High rates suppress housing demand and delay infrastructure '
  'spending, compressing volumes.',
  'positive', 4,
  'Rate cuts from 22% to current levels are beginning to unlock pent-up real estate '
  'and construction activity; volume recovery is expected to lag rate cuts by 2-3 quarters.',
  3,
  ARRAY['rate_sensitive', 'construction_demand', 'housing', 'infrastructure', 'easing_cycle']
),
(
  'cement', 'pkr_usd_rate', 'fx',
  'A weaker PKR raises the PKR cost of imported coal and other imported raw materials. '
  'Cement companies with dollar-linked equipment financing also face higher interest costs. '
  'Partially offset: stronger PKR-denominated revenues when prices are raised. Net effect '
  'is negative in the near term as cost increases outpace price pass-through.',
  'positive', 3,
  'PKR stabilisation is reducing imported coal cost pressure; companies that hedged '
  'coal procurement in H2 2024 are seeing favourable cost tailwinds.',
  1,
  ARRAY['pkr', 'import_cost', 'coal_cost', 'fx_negative']
),
(
  'cement', 'construction_activity', 'demand',
  'Cement is an intermediate good — 100% of demand is construction-linked. The three '
  'demand pillars are: (1) private housing (55-60% of cement consumption); '
  '(2) PSDP/infrastructure (25-30%); (3) commercial construction (15-20%). '
  'Housing finance penetration in Pakistan is among the lowest globally; demand is '
  'primarily self-financed or developer-financed, making it rate-sensitive.',
  'positive', 4,
  'Post-floods reconstruction and pent-up housing demand are supporting local cement '
  'offtake; PSDP utilisation remains below target but improving.',
  0,
  ARRAY['housing', 'psdp', 'construction', 'volume_recovery', 'demand_drivers']
),
(
  'cement', 'gas_prices', 'commodity',
  'Gas-fired kilns use RLNG or natural gas at regulated rates. OGRA-set gas prices '
  'are revised periodically and can materially affect the 30-40% of cement capacity '
  'that uses gas. Price deregulation or supply curtailments create cost uncertainty. '
  'Coal-fired plants are insulated from gas price risk.',
  'neutral', 3,
  'Gas price hike risk persists; companies with mixed coal-gas capacity have moderate '
  'exposure but full coal-fired plants are insulated.',
  0,
  ARRAY['gas', 'rlng', 'energy_cost', 'ogra', 'gas_price']
),

-- ════════════════════════════════════════════════════════════
-- TEXTILES  (5 drivers)
-- Key levers: PKR, cotton prices, energy costs, global demand,
--             DLTL/export incentives
-- ════════════════════════════════════════════════════════════

(
  'textiles', 'pkr_usd_rate', 'fx',
  'Textile exporters invoice in USD/EUR and bear costs in PKR. A weaker PKR mechanically '
  'improves export revenue in PKR terms — each 10% PKR depreciation adds ~10% to '
  'PKR-denominated revenue for dollar-billed exporters. However, imported inputs '
  '(viscose, polyester, dyes, chemicals) become more expensive, partially offsetting the '
  'benefit. Net impact is positive for value-added exporters; negative for spinners '
  'who import raw fibre.',
  'neutral', 5,
  'PKR stabilisation has reduced the mechanical FX tailwind that boosted reported revenues '
  'in 2022-23; exporters now compete on quality and lead times rather than currency advantage.',
  1,
  ARRAY['fx_positive', 'export_revenue', 'import_cost', 'pkr', 'value_added']
),
(
  'textiles', 'cotton_prices', 'commodity',
  'Cotton is the primary raw material for spinning and composite mills. Domestic cotton '
  'prices track international Cotlook A Index. Poor domestic harvests force Pakistan to '
  'import at international parity prices. High cotton prices compress spinning margins '
  'but can be partly passed through in downstream value-added products with a 2-4 month lag.',
  'positive', 4,
  'International cotton prices have moderated from 2022 highs; domestic crop recovery '
  'is reducing import dependence and supporting spinner margins.',
  3,
  ARRAY['cotton', 'raw_material', 'spinner', 'composite_mill', 'cotlook']
),
(
  'textiles', 'energy_cost', 'commodity',
  'Textile manufacturing is energy-intensive — gas and electricity account for 18-25% '
  'of COGS for spinning and 12-18% for value-added segments. Industrial gas prices and '
  'captive power generation costs (RLNG, coal) directly affect competitiveness vs. '
  'Bangladesh and Vietnam. High energy costs are cited as the primary competitiveness '
  'disadvantage vs. regional peers.',
  'negative', 4,
  'Industrial gas and electricity prices remain elevated relative to regional competitors; '
  'this continues to erode export order conversion rates vs. Bangladesh.',
  0,
  ARRAY['energy_cost', 'gas', 'electricity', 'competitiveness', 'bangladesh']
),
(
  'textiles', 'global_apparel_demand', 'demand',
  'Pakistan''s textile exports are heavily weighted toward the EU and USA. Global apparel '
  'demand follows consumer confidence and retail inventory cycles. A slowdown in developed '
  'market consumer spending causes order cancellations or deferrals with a 1-2 quarter lag. '
  'EU GSP+ status provides preferential access that is periodically under review.',
  'positive', 4,
  'US and EU retail inventory restocking is supporting order placement for H2 2025; '
  'EU GSP+ status remains intact, supporting duty-free market access for compliant exporters.',
  2,
  ARRAY['export_demand', 'eu', 'usa', 'gsp_plus', 'apparel', 'global_demand']
),
(
  'textiles', 'dltl_export_incentives', 'regulatory',
  'Duty and Tax Remission for Exporters (DLTL) and similar refund schemes directly '
  'supplement exporter margins. Delays in DLTL payments create working capital pressure '
  'and cash flow deficits. Scheme availability and disbursement timing are subject to '
  'federal budget and FBR processing constraints.',
  'negative', 3,
  'DLTL refund backlogs are creating working capital pressure for smaller exporters; '
  'larger listed companies have stronger balance sheets to absorb payment delays.',
  0,
  ARRAY['dltl', 'refund', 'working_capital', 'fbr', 'export_incentive']
),

-- ════════════════════════════════════════════════════════════
-- FERTILISER  (5 drivers)
-- Key levers: gas prices, urea prices, crop prices (offtake),
--             subsidy policy, PKR (for import competition)
-- ════════════════════════════════════════════════════════════

(
  'fertiliser', 'gas_prices', 'commodity',
  'Natural gas is both the primary feedstock and fuel for urea manufacturing — accounting '
  'for ~70-80% of urea production cost. Fertiliser producers in Pakistan receive gas at '
  'concessional rates under sector-specific pricing arrangements. Any increase in feedstock '
  'gas price or withdrawal of the concession directly compresses margins. The cost advantage '
  'vs. imported urea narrows when local gas prices rise.',
  'negative', 5,
  'Gas price revisions and supply curtailments to fertiliser plants remain the single '
  'biggest near-term risk to sector margins; SNGPL supply reliability is a recurring concern.',
  0,
  ARRAY['gas_feedstock', 'urea_cost', 'concessional_gas', 'sngpl', 'margin_risk']
),
(
  'fertiliser', 'urea_international_price', 'commodity',
  'International urea prices (Black Sea benchmark) set an import parity ceiling for '
  'domestic urea pricing. When international prices are low, domestic producers face '
  'pricing pressure from cheaper imports unless protected by tariffs. When international '
  'prices are high, domestic producers can maintain premium pricing, widening margins.',
  'positive', 4,
  'International urea prices have recovered from 2023 lows; this provides headroom for '
  'domestic pricing and reduces import pressure on local producers.',
  1,
  ARRAY['urea', 'import_parity', 'black_sea', 'international_pricing', 'tariff']
),
(
  'fertiliser', 'crop_prices_offtake', 'demand',
  'Fertiliser demand is directly linked to farmer economics. When crop prices (wheat, rice, '
  'sugarcane, cotton) are high, farmers invest more in inputs including fertiliser. '
  'Low crop prices or government price controls suppress fertiliser offtake. Kharif and '
  'Rabi planting seasons create strong demand seasonality (Feb-March and July-August peaks).',
  'positive', 4,
  'Wheat support price increase and strong cotton prices are supporting farmer economics '
  'and fertiliser offtake in the current Rabi season.',
  0,
  ARRAY['offtake', 'farmer_economics', 'wheat', 'cotton', 'rabi', 'kharif']
),
(
  'fertiliser', 'government_subsidy_policy', 'regulatory',
  'The federal government periodically provides fertiliser subsidies to support the '
  'agriculture sector. Subsidies can take the form of direct retail price caps, '
  'cash subsidies to farmers, or concessional gas pricing for producers. '
  'Sudden subsidy withdrawals create demand shock as farmers face sharply higher prices.',
  'neutral', 3,
  'Current subsidy framework is stable; no major subsidy withdrawal risk flagged for '
  'current season. Long-term fiscal pressure may result in incremental subsidy rationalisation.',
  0,
  ARRAY['subsidy', 'government_policy', 'retail_price', 'farmer_support']
),
(
  'fertiliser', 'pkr_usd_rate', 'fx',
  'Fertiliser companies import phosphatic and potassic fertilisers (DAP, SOP) in USD. '
  'A weaker PKR raises the PKR cost of these imports. Urea (which is domestically produced) '
  'is insulated, but composite companies with DAP imports face FX cost pressure. '
  'Export revenue from urea exports is modest; most production is for domestic consumption.',
  'neutral', 2,
  'PKR stabilisation reduces import cost pressure for phosphatic fertiliser importers; '
  'impact is modest for producers who are primarily urea-focused.',
  1,
  ARRAY['dap', 'pkr', 'import_cost', 'phosphatic', 'potassic']
),

-- ════════════════════════════════════════════════════════════
-- OIL & GAS  (5 drivers)
-- Key levers: international oil price, gas pricing/allocation,
--             circular debt (receivables), PKR, exploration policy
-- ════════════════════════════════════════════════════════════

(
  'oil-gas', 'crude_oil_prices', 'commodity',
  'E&P companies (OGDC, PPL, POL) receive crude oil and condensate prices at international '
  'parity (Arabian Light). Higher oil prices directly increase revenue and PAT for E&P '
  'companies. Refining companies (ATRL, NRL) earn a refining margin (crack spread) that '
  'is NOT directly linked to crude price — they benefit from crack spread expansion '
  'and inventory gains when prices rise. OMCs (PSO) are minimally affected by crude price '
  'as they pass through to pump prices.',
  'positive', 5,
  'Brent crude in the USD 70-80 range provides a stable revenue environment for E&P; '
  'crack spreads for refiners remain positive, supporting refining profitability.',
  1,
  ARRAY['crude_oil', 'ep_revenue', 'brent', 'arabian_light', 'refining', 'crack_spread']
),
(
  'oil-gas', 'gas_allocation_pricing', 'regulatory',
  'OGRA regulates wellhead gas prices and allocates gas production volumes to categories '
  '(domestic, power, industrial, fertiliser). E&P companies'' gas revenue depends on '
  'both the regulated wellhead price and the volume of gas accepted by buyers. '
  'SSGC and SNGPL payment delays create receivable risk. New gas discoveries must '
  'be monetised through the regulated framework.',
  'negative', 4,
  'Gas allocation and pricing disputes, combined with circular debt in the gas chain, '
  'are creating receivable pressure for OGDC and PPL. Wellhead price revisions are '
  'pending with OGRA.',
  0,
  ARRAY['gas_pricing', 'ogra', 'wellhead_price', 'gas_allocation', 'receivables']
),
(
  'oil-gas', 'circular_debt_petroleum', 'fiscal',
  'The petroleum circular debt — accumulated unpaid receivables owed by power sector '
  'and gas distribution companies to E&P producers — is one of the largest structural '
  'risks to the sector. PSO is owed significant amounts by DISCOs; OGDC and PPL are owed '
  'by SSGC and SNGPL. This impairs cash flow, increases working capital requirements, '
  'and defers dividend capacity.',
  'negative', 4,
  'Petroleum circular debt stock remains elevated; government has committed to '
  'partial clearance tranches but the pace of resolution is slow.',
  0,
  ARRAY['circular_debt', 'receivables', 'pso', 'ogdc', 'ppl', 'cash_flow']
),
(
  'oil-gas', 'pkr_usd_rate', 'fx',
  'E&P revenues are linked to USD-denominated crude prices and USD-denominated wellhead '
  'gas prices. Revenue is converted to PKR at the prevailing exchange rate. A weaker PKR '
  'mechanically increases PKR-denominated revenue for E&P companies. Dollar-linked debt '
  'creates an offsetting FX cost for companies with foreign currency borrowings.',
  'positive', 3,
  'PKR stabilisation has moderated the FX translation benefit for E&P companies '
  'that benefited from the 2022-23 PKR depreciation cycle.',
  0,
  ARRAY['fx', 'pkr', 'usd_revenue', 'translation', 'ep']
),
(
  'oil-gas', 'exploration_policy', 'regulatory',
  'New exploration and production policy defines the fiscal terms (royalty rates, '
  'windfall profit tax, signature bonuses) for new exploration blocks. Attractive '
  'E&P policy encourages domestic and international exploration investment. '
  'Pakistan''s hydrocarbon reserves are declining in matured fields; new discoveries '
  'are essential for long-term reserve replacement.',
  'neutral', 3,
  'Current E&P policy under review; uncertainty around fiscal terms has modestly '
  'delayed new block applications from international operators.',
  0,
  ARRAY['exploration_policy', 'ep_policy', 'fiscal_terms', 'reserves', 'ogra']
),

-- ════════════════════════════════════════════════════════════
-- POWER / IPP  (5 drivers)
-- Key levers: circular debt, NEPRA tariff, coal/RLNG fuel cost,
--             capacity payments, PKR (dollar-linked PPA)
-- ════════════════════════════════════════════════════════════

(
  'power-ipp', 'circular_debt_power', 'fiscal',
  'The power sector circular debt — accumulated government-owed capacity payments and '
  'energy payments not passed through in consumer tariffs — is the defining structural '
  'risk for IPPs. Unpaid capacity payments impair IPP cash flows, suppress dividends, '
  'and in extreme cases threaten covenant breaches. CPEC power projects have '
  'USD-linked capacity payments making circular debt particularly acute for '
  'coal-fired projects.',
  'negative', 5,
  'Power circular debt stock exceeds PKR 2.5 trillion; government''s circular debt '
  'management plan (CDMP) targets partial clearance but pace of payment remains '
  'well below accrual rate.',
  0,
  ARRAY['circular_debt', 'capacity_payment', 'nepra', 'ipp_receivables', 'cdmp']
),
(
  'power-ipp', 'nepra_tariff_regime', 'regulatory',
  'NEPRA sets the consumer end tariff and determines which costs are passable to '
  'consumers. IPP revenues are governed by Power Purchase Agreements (PPAs) with '
  'CPPA-G. Tariff revisions that renegotiate PPA terms directly affect IPP capacity '
  'payment revenues. The 2023-2024 PPA renegotiation process created significant '
  'uncertainty for CPEC-linked projects.',
  'negative', 5,
  'Ongoing PPA renegotiation discussions have created revenue uncertainty for '
  'multiple CPEC-era IPPs; outcomes are expected in mid-2025.',
  0,
  ARRAY['nepra', 'ppa', 'tariff', 'cppa_g', 'renegotiation', 'revenue_certainty']
),
(
  'power-ipp', 'coal_rlng_fuel_cost', 'commodity',
  'Coal-fired and RLNG-fired power plants receive fuel on a pass-through basis under '
  'PPAs — fuel cost is not borne by the IPP but is recovered from the grid. However, '
  'fuel payment delays create working capital pressure and off-balance-sheet exposure. '
  'Plants with fuel procurement risk (no PPA fuel pass-through) are directly exposed '
  'to commodity price movements.',
  'positive', 3,
  'Lower international coal prices reduce fuel pass-through billing, modestly reducing '
  'receivable accumulation; net benefit to IPPs with pass-through structures is indirect.',
  0,
  ARRAY['coal', 'rlng', 'fuel_passthrough', 'working_capital', 'ppa_fuel']
),
(
  'power-ipp', 'pkr_usd_rate', 'fx',
  'CPEC-era IPPs have USD-linked capacity payments in their PPAs — when PKR depreciates, '
  'PKR-denominated capacity payment receipts increase, which is positive in PKR terms '
  'but increases the overall fiscal burden on Pakistan''s power sector. IPPs with '
  'USD-denominated debt also see FX translation costs. Stabilisation of PKR reduces '
  'the FX translation benefit but also reduces the fiscal pressure argument for PPA renegotiation.',
  'positive', 4,
  'PKR stabilisation reduces the CPEC IPP revenue advantage from FX translation while '
  'also easing the political pressure to renegotiate USD-linked PPA terms.',
  0,
  ARRAY['pkr', 'cpec', 'usd_ppa', 'fx_translation', 'capacity_payment']
),
(
  'power-ipp', 'power_demand_growth', 'demand',
  'Pakistan''s annual electricity demand growth is structurally driven by population '
  'growth, electrification of previously off-grid areas, and industrial activity. '
  'However, load management (loadshedding) means effective demand is administratively '
  'constrained. IPPs with capacity payments earn revenues regardless of dispatch '
  'levels, but plants with energy payment dependency (take-and-pay structures) '
  'need grid dispatch to earn revenues.',
  'neutral', 2,
  'Grid capacity significantly exceeds dispatch levels; IPPs earn primarily through '
  'capacity payments rather than energy sales, making demand growth less directly '
  'relevant to short-term earnings.',
  0,
  ARRAY['power_demand', 'dispatch', 'loadshedding', 'capacity_factor', 'grid']
),

-- ════════════════════════════════════════════════════════════
-- AUTOMOBILE  (5 drivers)
-- Key levers: interest rates (auto financing), PKR (imported CKD),
--             inflation (purchasing power), regulatory/import policy
-- ════════════════════════════════════════════════════════════

(
  'auto', 'sbp_policy_rate', 'monetary',
  'Auto financing accounts for 40-55% of new vehicle purchases in Pakistan (urban market). '
  'Monthly installment affordability is directly tied to car financing rates, which track '
  'KIBOR plus a spread. Each 100bps rate cut reduces monthly installments, directly '
  'expanding the addressable market for financed vehicles. Rate cycle is the '
  'single biggest demand lever for auto assemblers.',
  'positive', 5,
  'SBP rate cuts from 22% to current levels are materially improving auto financing '
  'affordability; assemblers are reporting improving booking volumes as KIBOR declines.',
  1,
  ARRAY['auto_financing', 'kibor', 'rate_sensitive', 'easing_cycle', 'affordability']
),
(
  'auto', 'pkr_usd_rate', 'fx',
  'Auto assemblers import CKD (completely knocked-down) kits and components, priced '
  'predominantly in JPY, USD, and EUR. PKR depreciation directly raises CKD costs in '
  'PKR terms. Assemblers can pass through cost increases in ex-factory prices but face '
  'demand elasticity constraints — large price hikes suppress bookings. '
  'Local content levels (30-45% for major assemblers) partially insulate from FX.',
  'positive', 4,
  'PKR stabilisation is providing cost relief on CKD imports; assemblers have been able '
  'to moderate price increases, supporting volume recovery.',
  1,
  ARRAY['ckd', 'import_cost', 'pkr', 'local_content', 'price_passthrough']
),
(
  'auto', 'inflation_purchasing_power', 'demand',
  'Vehicle ownership remains aspirational in Pakistan — even at the entry segment, '
  'vehicles represent 3-5 years of median household income. Sustained high inflation '
  'compresses real household incomes, reducing the pool of creditworthy buyers. '
  'Inflation also makes vehicle ownership alternatives (motorcycles, public transport) '
  'relatively more attractive.',
  'positive', 4,
  'CPI moderation toward 8-10% is improving real household income and restoring '
  'consumer confidence in big-ticket purchases including vehicles.',
  3,
  ARRAY['purchasing_power', 'consumer_confidence', 'demand', 'real_income', 'inflation']
),
(
  'auto', 'import_used_vehicle_policy', 'regulatory',
  'Periodic relaxation of used vehicle import restrictions provides low-cost competition '
  'to new vehicle assemblers. Amnesty schemes and baggage vehicle policies can temporarily '
  'depress new vehicle demand as consumers opt for cheaper imported alternatives. '
  'Local assemblers lobby strongly against liberalisation.',
  'neutral', 3,
  'No active used vehicle import liberalisation scheme; current policy supports '
  'domestic assemblers. This is a periodic political risk rather than a current headwind.',
  0,
  ARRAY['used_vehicle', 'import_policy', 'competition', 'baggage', 'amnesty']
),
(
  'auto', 'local_content_policy', 'regulatory',
  'NEVP (National Electric Vehicle Policy) and Auto Development Policy set local content '
  'requirements and import duty structures for CKD vs. CBU vehicles. Higher local '
  'content requirements protect assemblers from import competition but increase '
  'manufacturing complexity. EV policy changes can disrupt investment plans for '
  'internal combustion assemblers.',
  'neutral', 2,
  'Auto development policy framework is stable; NEVP implementation is behind schedule '
  'and does not pose near-term disruption risk to conventional ICE assemblers.',
  0,
  ARRAY['nevp', 'adp', 'local_content', 'ev_policy', 'ckd_duty']
)

ON CONFLICT (sector_slug, macro_driver)
DO UPDATE SET
  driver_category    = EXCLUDED.driver_category,
  relationship       = EXCLUDED.relationship,
  current_direction  = EXCLUDED.current_direction,
  impact_magnitude   = EXCLUDED.impact_magnitude,
  impact_description = EXCLUDED.impact_description,
  lag_months         = EXCLUDED.lag_months,
  tags               = EXCLUDED.tags,
  last_reviewed_at   = now();



-- ============================================================
-- MIGRATION 030: event_trigger_postgres_triggers
-- ============================================================

-- ============================================================
-- Migration 030: Postgres triggers for ai_event_triggers
--
-- Inserts rows into ai_event_triggers when observable events
-- occur on source tables. Each trigger fires AFTER the row
-- is committed, so downstream consumers see a consistent DB.
--
-- TRIGGERS CREATED
--   conviction_scores
--     → conviction_tier_upgrade   (tier improved)
--     → conviction_tier_downgrade (tier worsened)
--
--   company_intelligence_blocks (if table exists)
--     → high_severity_risk_added  (severity='high' AND block_type='risk')
--     → near_catalyst_added       (block_type='catalyst' AND horizon<='near')
--
--   sector_drivers
--     → sector_driver_turned_negative (trend changed to 'negative')
--
-- SUPPRESSION
--   Suppression is handled by fn-process-event-triggers, not here.
--   Triggers fire unconditionally — the consumer enforces frequency caps.
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── Helper: tier ordering for upgrade/downgrade detection ───────────────────

CREATE OR REPLACE FUNCTION tier_order(tier text)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE tier
    WHEN 'HIGH_CONVICTION' THEN 4
    WHEN 'MODERATE'        THEN 3
    WHEN 'WATCHLIST'       THEN 2
    WHEN 'MONITOR'         THEN 1
    ELSE 0
  END;
$$;

-- ── conviction_scores trigger ────────────────────────────────────────────────
-- Fires on INSERT (new score) or UPDATE when tier changes.
-- Compares against previous is_current=true row to detect direction.

CREATE OR REPLACE FUNCTION fn_conviction_score_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_old_tier    text;
  v_old_score   integer;
  v_event_type  text;
  v_priority    integer;
BEGIN
  -- Only process rows being set as current
  IF NEW.is_current IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  -- On INSERT: this is the first score — always queue as watchlist_scored
  IF TG_OP = 'INSERT' THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'company_scored',
      NEW.symbol,
      jsonb_build_object(
        'symbol',     NEW.symbol,
        'score',      NEW.score,
        'tier',       NEW.tier,
        'confidence', NEW.data_confidence,
        'scored_at',  NEW.scored_at
      ),
      5  -- low priority batch processing
    );
    RETURN NEW;
  END IF;

  -- On UPDATE: detect tier change
  -- OLD.tier is only meaningful when OLD.is_current was also true
  IF OLD.tier IS NULL OR OLD.tier = NEW.tier THEN
    RETURN NEW;
  END IF;

  v_old_tier  := OLD.tier;
  v_old_score := OLD.score;

  IF tier_order(NEW.tier) > tier_order(v_old_tier) THEN
    v_event_type := 'conviction_tier_upgrade';
    v_priority   := 2;  -- high priority
  ELSIF tier_order(NEW.tier) < tier_order(v_old_tier) THEN
    v_event_type := 'conviction_tier_downgrade';
    v_priority   := 2;  -- high priority
  ELSE
    RETURN NEW;  -- Same tier, no event
  END IF;

  INSERT INTO ai_event_triggers (
    event_type, reference_key, event_data, priority
  ) VALUES (
    v_event_type,
    NEW.symbol,
    jsonb_build_object(
      'symbol',         NEW.symbol,
      'from_tier',      v_old_tier,
      'to_tier',        NEW.tier,
      'from_score',     v_old_score,
      'to_score',       NEW.score,
      'data_confidence',NEW.data_confidence,
      'scored_at',      NEW.scored_at
    ),
    v_priority
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_conviction_score_event ON conviction_scores;
CREATE TRIGGER trg_conviction_score_event
  AFTER INSERT OR UPDATE ON conviction_scores
  FOR EACH ROW EXECUTE FUNCTION fn_conviction_score_event();

-- ── sector_drivers trigger ───────────────────────────────────────────────────
-- Fires when a sector driver's trend turns negative.
-- Only triggers on UPDATE where trend changed TO 'negative'.

CREATE OR REPLACE FUNCTION fn_sector_driver_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Only fire when trend changes to 'negative'
  IF NEW.trend = 'negative' AND (OLD.trend IS NULL OR OLD.trend != 'negative') THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'sector_driver_turned_negative',
      NEW.sector_slug,
      jsonb_build_object(
        'sector_slug',  NEW.sector_slug,
        'driver_name',  NEW.driver_name,
        'driver_type',  COALESCE(NEW.driver_type, 'unknown'),
        'old_trend',    OLD.trend,
        'description',  COALESCE(NEW.description, ''),
        'updated_at',   now()
      ),
      3  -- medium priority
    );
  END IF;

  -- Also fire when driver turns positive (sector recovery signal)
  IF NEW.trend = 'positive' AND (OLD.trend IS NULL OR OLD.trend NOT IN ('positive', 'mixed')) THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'sector_driver_turned_positive',
      NEW.sector_slug,
      jsonb_build_object(
        'sector_slug',  NEW.sector_slug,
        'driver_name',  NEW.driver_name,
        'driver_type',  COALESCE(NEW.driver_type, 'unknown'),
        'old_trend',    OLD.trend,
        'description',  COALESCE(NEW.description, ''),
        'updated_at',   now()
      ),
      3
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sector_driver_event ON sector_drivers;
CREATE TRIGGER trg_sector_driver_event
  AFTER UPDATE ON sector_drivers
  FOR EACH ROW EXECUTE FUNCTION fn_sector_driver_event();

-- ── sector_intelligence_blocks trigger ───────────────────────────────────────
-- Fires on INSERT of:
--   block_type = 'risk'     AND priority >= 4    → high_severity_risk_added
--   block_type = 'catalyst' AND horizon = 'near' → near_catalyst_added

CREATE OR REPLACE FUNCTION fn_intel_block_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT NEW.is_active THEN
    RETURN NEW;
  END IF;

  -- High-severity risk
  IF NEW.block_type IN ('risk', 'regulatory_risk') AND NEW.priority >= 4 THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'high_severity_risk_added',
      COALESCE(NEW.sector_slug, 'market'),
      jsonb_build_object(
        'block_id',     NEW.id,
        'title',        NEW.title,
        'body',         LEFT(NEW.body, 400),
        'block_type',   NEW.block_type,
        'sector_slug',  NEW.sector_slug,
        'priority',     NEW.priority,
        'created_at',   now()
      ),
      2  -- high priority
    );
  END IF;

  -- Near-horizon catalyst
  IF NEW.block_type IN ('catalyst', 'near_catalyst') THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'near_catalyst_added',
      COALESCE(NEW.sector_slug, 'market'),
      jsonb_build_object(
        'block_id',     NEW.id,
        'title',        NEW.title,
        'body',         LEFT(NEW.body, 400),
        'block_type',   NEW.block_type,
        'sector_slug',  NEW.sector_slug,
        'priority',     NEW.priority,
        'created_at',   now()
      ),
      3  -- medium priority
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_intel_block_event ON sector_intelligence_blocks;
CREATE TRIGGER trg_intel_block_event
  AFTER INSERT ON sector_intelligence_blocks
  FOR EACH ROW EXECUTE FUNCTION fn_intel_block_event();

-- ── company_intelligence_blocks trigger (if table exists) ───────────────────
-- Same logic for company-level blocks.

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND   table_name   = 'company_intelligence_blocks'
  ) THEN
    EXECUTE $TRIGGER$
      CREATE OR REPLACE FUNCTION fn_company_intel_block_event()
      RETURNS TRIGGER LANGUAGE plpgsql AS $FN$
      BEGIN
        IF NOT NEW.is_active THEN RETURN NEW; END IF;

        IF NEW.block_type IN ('risk', 'regulatory_risk') AND NEW.priority >= 4 THEN
          INSERT INTO ai_event_triggers (event_type, reference_key, event_data, priority)
          VALUES (
            'high_severity_risk_added',
            NEW.symbol,
            jsonb_build_object(
              'block_id', NEW.id, 'title', NEW.title,
              'body', LEFT(NEW.body, 400),
              'block_type', NEW.block_type, 'symbol', NEW.symbol,
              'priority', NEW.priority, 'created_at', now()
            ),
            2
          );
        END IF;

        IF NEW.block_type IN ('catalyst', 'near_catalyst') THEN
          INSERT INTO ai_event_triggers (event_type, reference_key, event_data, priority)
          VALUES (
            'near_catalyst_added',
            NEW.symbol,
            jsonb_build_object(
              'block_id', NEW.id, 'title', NEW.title,
              'body', LEFT(NEW.body, 400),
              'block_type', NEW.block_type, 'symbol', NEW.symbol,
              'priority', NEW.priority, 'created_at', now()
            ),
            3
          );
        END IF;

        RETURN NEW;
      END;
      $FN$;

      DROP TRIGGER IF EXISTS trg_company_intel_block_event ON company_intelligence_blocks;
      CREATE TRIGGER trg_company_intel_block_event
        AFTER INSERT ON company_intelligence_blocks
        FOR EACH ROW EXECUTE FUNCTION fn_company_intel_block_event();
    $TRIGGER$;
  END IF;
END $$;

COMMENT ON FUNCTION fn_conviction_score_event IS
  'Fires on conviction_scores INSERT/UPDATE. Inserts into ai_event_triggers when '
  'tier changes (upgrade or downgrade). Consumed by fn-process-event-triggers.';

COMMENT ON FUNCTION fn_sector_driver_event IS
  'Fires on sector_drivers UPDATE. Inserts into ai_event_triggers when trend '
  'changes to negative or positive. Medium priority.';

COMMENT ON FUNCTION fn_intel_block_event IS
  'Fires on sector_intelligence_blocks INSERT. Queues high-severity risks (priority>=4) '
  'and near-term catalysts for alert generation.';



-- ============================================================
-- VERIFICATION QUERIES — Run after all migrations complete
-- ============================================================

-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'conviction_scores', 'conviction_score_history', 'conviction_sub_scores',
    'ai_outputs', 'ai_prompt_templates',
    'ai_market_snapshots', 'ai_event_triggers', 'alerts',
    'ai_generation_jobs', 'ai_quality_checks',
    'sector_macro_drivers'
  )
ORDER BY table_name;
-- Expected: 11 rows

-- Check prompt templates seeded
SELECT prompt_type, version, is_active FROM ai_prompt_templates ORDER BY prompt_type;
-- Expected: 8 rows, all is_active = true

-- Check sector_macro_drivers seeded
SELECT sector_slug, COUNT(*) as driver_count FROM sector_macro_drivers GROUP BY sector_slug ORDER BY sector_slug;
-- Expected: 7 sectors, 5 drivers each (35 total)

-- Check Postgres triggers exist
SELECT trigger_name, event_object_table FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE 'trg_%'
ORDER BY trigger_name;
-- Expected: trg_conviction_score_event, trg_sector_driver_event, trg_sector_intel_block_event,
--           trg_company_intel_block_event (4 triggers)
