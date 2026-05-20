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
