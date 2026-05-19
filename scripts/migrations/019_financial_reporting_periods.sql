-- ============================================================
-- Migration 019: financial_reporting_periods
-- Canonical reporting period registry per company.
-- Source of truth for which periods exist, their date boundaries,
-- announcement status, and TTM composition.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_reporting_periods (
  id                serial      PRIMARY KEY,
  symbol            text        NOT NULL REFERENCES companies(symbol),
  period_key        text        NOT NULL,
  -- Canonical string: 'FY25', '1HFY25', '1QFY25', '3QFY25', 'TTM_FY25Q3'
  -- Convention: FY = annual, 1H/2H = half-year, 1Q/2Q/3Q/4Q = quarterly
  -- TTM = trailing twelve months (assembles four quarters)

  period_type       text        NOT NULL,
  -- 'annual'     → full fiscal year
  -- 'half_year'  → H1 or H2
  -- 'quarter'    → Q1, Q2, Q3, or Q4
  -- 'nine_month' → 9M (Pakistani companies rarely report separately, but some do)
  -- 'ttm'        → trailing twelve months (computed)
  -- 'custom'     → non-standard (edge cases)

  fiscal_year       int         NOT NULL,
  -- The fiscal year number: 2025 for FY25
  period_num        int,
  -- For quarters: 1–4. For half-years: 1–2. NULL for annual/ttm.

  period_start      date,
  period_end        date        NOT NULL,
  -- These define the actual calendar dates.
  -- For a Jun year-end company: FY25 → 2024-07-01 to 2025-06-30
  -- For a Dec year-end bank:    FY25 → 2025-01-01 to 2025-12-31

  is_announced      bool        NOT NULL DEFAULT false,
  announcement_date date,
  -- Date results were officially announced (board meeting / PSX filing date)

  is_ttm            bool        NOT NULL DEFAULT false,
  ttm_components    text[],
  -- For TTM rows: ['3QFY25','2QFY25','1QFY25','4QFY24'] in order newest-first

  display_label     text,
  -- Human-readable: '3Q FY2025', 'H1 FY2025', 'FY 2024'

  year_end_month    int         NOT NULL DEFAULT 6,
  -- Company's fiscal year end month: 6 = June, 12 = December, 9 = September
  -- Used to infer date boundaries if period_start/end not set

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (symbol, period_key),

  CONSTRAINT frp_period_type_check CHECK (period_type IN (
    'annual', 'half_year', 'quarter', 'nine_month', 'ttm', 'custom'
  )),
  CONSTRAINT frp_fiscal_year_check CHECK (fiscal_year BETWEEN 2000 AND 2050),
  CONSTRAINT frp_period_num_check CHECK (
    period_num IS NULL
    OR (period_type = 'quarter'   AND period_num BETWEEN 1 AND 4)
    OR (period_type = 'half_year' AND period_num BETWEEN 1 AND 2)
  ),
  CONSTRAINT frp_year_end_month_check CHECK (year_end_month BETWEEN 1 AND 12)
);

-- Retrieve all periods for a symbol ordered newest-first
CREATE INDEX IF NOT EXISTS frp_symbol_period_end_idx
  ON financial_reporting_periods (symbol, period_end DESC);

-- Find all announced periods for completeness checks
CREATE INDEX IF NOT EXISTS frp_announced_idx
  ON financial_reporting_periods (is_announced, period_end DESC)
  WHERE is_announced = true;

-- Find TTM periods for a symbol
CREATE INDEX IF NOT EXISTS frp_ttm_idx
  ON financial_reporting_periods (symbol, is_ttm)
  WHERE is_ttm = true;

COMMENT ON TABLE financial_reporting_periods IS
  'Canonical reporting period registry per company. '
  'Handles Pakistani fiscal year differences (Jun, Dec, Sep year-ends). '
  'Supports FY, H1/H2, Q1-Q4, nine-month, and TTM periods. '
  'period_end is the authoritative date — use it for chronological ordering. '
  'TTM rows are computed from four quarterly periods; ttm_components lists them.';
