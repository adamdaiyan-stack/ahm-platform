-- ============================================================
-- Migration 003: daily_prices — production indexes
-- The daily_prices table already exists. This migration adds
-- the indexes needed for production query performance.
-- Safe to run multiple times (IF NOT EXISTS).
-- ============================================================

-- Primary query pattern: symbol + date (most common)
CREATE UNIQUE INDEX IF NOT EXISTS daily_prices_symbol_date_idx
  ON daily_prices (symbol, market_date DESC);

-- Cross-symbol date lookups (breadth, sector calculations)
CREATE INDEX IF NOT EXISTS daily_prices_date_idx
  ON daily_prices (market_date DESC);

-- Source tracking for reconciliation
CREATE INDEX IF NOT EXISTS daily_prices_source_idx
  ON daily_prices (source, market_date DESC);

-- Add columns if not yet present (safe ALTER)
ALTER TABLE daily_prices
  ADD COLUMN IF NOT EXISTS adjusted_close        numeric,
  ADD COLUMN IF NOT EXISTS cumulative_adj_factor  numeric DEFAULT 1.0;

COMMENT ON COLUMN daily_prices.adjusted_close IS
  'Close price adjusted for corporate actions (dividends, splits, bonus issues). '
  'Populated by the corporate actions engine. NULL until first CA processed.';

COMMENT ON COLUMN daily_prices.cumulative_adj_factor IS
  'Product of all adjustment factors applied to this row. '
  'adjusted_close = close * cumulative_adj_factor';
