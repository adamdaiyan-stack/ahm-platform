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
