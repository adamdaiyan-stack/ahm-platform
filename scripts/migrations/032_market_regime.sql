-- ============================================================
-- Migration 032: market_regime_states
--
-- One row per trading date — the computed market regime
-- classification for that day.
--
-- Regime labels:
--   Bullish        — broad advance, positive breadth, volume expanding
--   Neutral        — mixed signals, no clear directional bias
--   Defensive      — narrow advance or decline concentrated in defensives
--   High Volatility— large intraday/daily swings, unstable breadth
--   Risk-On        — risk assets leading, cyclicals outperforming
--   Risk-Off       — flight to safety, defensives/cash outperforming
--
-- Inputs snapshot stores the raw signals used so regime decisions
-- can be audited and the engine retrained over time.
--
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS market_regime_states (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  regime_date     date        NOT NULL UNIQUE,

  -- ── Classification output ──────────────────────────────────
  regime          text        NOT NULL,
  -- 'Bullish' | 'Neutral' | 'Defensive' | 'High Volatility' | 'Risk-On' | 'Risk-Off'

  confidence      numeric     NOT NULL DEFAULT 0,
  -- 0.0–1.0: how strongly the signals align to this regime

  -- ── Signal inputs (stored for auditability + future ML) ───
  inputs          jsonb       NOT NULL DEFAULT '{}',
  -- {
  --   kse100_change_pct:      number,   -- index daily return
  --   advance_decline_ratio:  number,   -- advances / declines
  --   breadth_pct:            number,   -- (advances / total) * 100
  --   participation_pct:      number,   -- stocks with volume > 30d avg
  --   volume_vs_avg:          number,   -- today's volume / 30d avg volume
  --   volatility_regime:      string,   -- 'low' | 'normal' | 'elevated' | 'extreme'
  --   sector_breadth:         number,   -- sectors advancing / total sectors
  -- }

  -- ── Descriptive context ────────────────────────────────────
  regime_note     text,
  -- Short human-readable rationale for this classification

  computed_by     text        NOT NULL DEFAULT 'pipeline',
  -- 'pipeline' | 'manual'

  computed_at     timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT mrs_regime_check CHECK (
    regime IN ('Bullish', 'Neutral', 'Defensive', 'High Volatility', 'Risk-On', 'Risk-Off')
  ),
  CONSTRAINT mrs_confidence_check CHECK (
    confidence >= 0 AND confidence <= 1
  )
);

-- Fast lookup: latest regime
CREATE INDEX IF NOT EXISTS mrs_date_idx
  ON market_regime_states (regime_date DESC);

-- History: all days with a given regime label
CREATE INDEX IF NOT EXISTS mrs_regime_label_idx
  ON market_regime_states (regime, regime_date DESC);

COMMENT ON TABLE market_regime_states IS
  'One market regime classification per trading date. '
  'Computed by scripts/utils/market-regime.ts after daily price ingestion. '
  'Feeds RegimeIndicator component, AI context assembly, and future conviction scoring.';
