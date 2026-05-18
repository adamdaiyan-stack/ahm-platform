-- ============================================================
-- Migration 008: daily_snapshots
-- Precomputed daily intelligence context row per company.
-- This is the AI context layer — one row per company per day,
-- no joins needed for common intelligence queries.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_snapshots (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol                   text        NOT NULL,
  snapshot_date            date        NOT NULL,

  -- ── Price ─────────────────────────────────────────────────
  close                    numeric,
  change_percent           numeric,
  volume                   bigint,
  market_cap               numeric,

  -- ── Fundamentals (from latest financial_metrics) ─────────
  pe_ratio                 numeric,
  pb_ratio                 numeric,
  ev_ebitda                numeric,
  eps_ttm                  numeric,
  roe                      numeric,
  net_margin               numeric,
  dividend_yield           numeric,

  -- ── Relative position ─────────────────────────────────────
  week_52_high             numeric,
  week_52_low              numeric,
  pct_from_52w_high        numeric,    -- (close - 52w_high) / 52w_high * 100

  -- ── Market context ────────────────────────────────────────
  sector                   text,
  sector_rank              int,        -- Rank by market cap within sector (1 = largest)
  market_rank              int,        -- Rank by market cap across all companies
  sector_avg_change_pct    numeric,    -- Average change for the sector that day
  kse100_change_pct        numeric,    -- KSE-100 index return that day
  relative_performance_pct numeric,    -- stock change_pct - kse100_change_pct

  -- ── Technical signals (Phase 2 — leave NULL for MVP) ─────
  ma_20                    numeric,
  ma_50                    numeric,
  ma_200                   numeric,
  rsi_14                   numeric,
  relative_strength_30d    numeric,    -- Stock 30d return vs index 30d return
  relative_strength_90d    numeric,
  volatility_30d           numeric,    -- 30-day realized volatility (annualized %)

  -- ── Structured context for AI (Phase 2) ──────────────────
  macro_context            jsonb,      -- Snapshot of key macro indicators this date
  technical_context        jsonb,      -- Technical signal summary
  valuation_context        jsonb,      -- Valuation vs history and peers
  latest_catalyst_summary  text,       -- Most recent catalyst block body
  latest_risk_summary      text,       -- Most recent risk block body

  source                   text        NOT NULL DEFAULT 'pipeline',
  created_at               timestamptz DEFAULT now(),
  updated_at               timestamptz DEFAULT now(),

  UNIQUE (symbol, snapshot_date)
);

CREATE INDEX IF NOT EXISTS ds_symbol_date_idx
  ON daily_snapshots (symbol, snapshot_date DESC);

CREATE INDEX IF NOT EXISTS ds_date_sector_idx
  ON daily_snapshots (snapshot_date DESC, sector);

COMMENT ON TABLE daily_snapshots IS
  'One precomputed row per company per trading day. '
  'This is the primary feed for AI context assembly and time-series analysis. '
  'Built by scripts/pipelines/build-daily-snapshots.ts after price ingestion completes.';
