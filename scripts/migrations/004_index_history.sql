-- ============================================================
-- Migration 004: index_history
-- Time-series of KSE-100 (and future indices) daily levels.
-- The market_index table is a single-row snapshot.
-- This table is the historical record.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS index_history (
  id              serial      PRIMARY KEY,
  index_symbol    text        NOT NULL DEFAULT 'KSE-100',
  -- 'KSE-100' | 'KSE-30' | 'KMI-30' | 'ALLSHR'
  market_date     date        NOT NULL,
  open            numeric,
  high            numeric,
  low             numeric,
  close           numeric     NOT NULL,
  change          numeric,
  change_percent  numeric,
  volume          bigint,
  advances        int,
  declines        int,
  unchanged       int,
  total_trades    int,
  source          text        NOT NULL DEFAULT 'dps_psx',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  UNIQUE (index_symbol, market_date)
);

CREATE INDEX IF NOT EXISTS index_history_symbol_date_idx
  ON index_history (index_symbol, market_date DESC);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_index_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS index_history_updated_at_trigger ON index_history;
CREATE TRIGGER index_history_updated_at_trigger
  BEFORE UPDATE ON index_history
  FOR EACH ROW EXECUTE FUNCTION update_index_history_updated_at();
