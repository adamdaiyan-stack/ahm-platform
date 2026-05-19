-- ============================================================
-- Migration 022: Extend financial_metrics
-- Adds missing balance sheet detail, income statement depth,
-- cash flow completeness, and audit/review infrastructure.
-- All ALTER TABLE ... ADD COLUMN IF NOT EXISTS — fully idempotent.
-- ============================================================

-- ── Missing Income Statement columns ──────────────────────────────────────────

ALTER TABLE financial_metrics
  ADD COLUMN IF NOT EXISTS revenue_from_operations  numeric,
  -- Revenue from core operations (excluding other income)
  ADD COLUMN IF NOT EXISTS other_income             numeric,
  -- Non-operating income (investment income, gains, etc.)
  ADD COLUMN IF NOT EXISTS cost_of_revenue          numeric,
  -- Direct cost (COGS / cost of sales)
  ADD COLUMN IF NOT EXISTS distribution_expense     numeric,
  ADD COLUMN IF NOT EXISTS admin_expense            numeric,
  ADD COLUMN IF NOT EXISTS operating_profit         numeric,
  -- EBIT explicitly (some companies don't disclose separately from EBITDA)
  ADD COLUMN IF NOT EXISTS depreciation_amortisation numeric,
  ADD COLUMN IF NOT EXISTS finance_cost             numeric,
  -- Interest expense / markup expense
  ADD COLUMN IF NOT EXISTS profit_before_tax        numeric,
  -- PBT
  ADD COLUMN IF NOT EXISTS tax_expense              numeric;

-- ── Missing Balance Sheet columns ─────────────────────────────────────────────

ALTER TABLE financial_metrics
  ADD COLUMN IF NOT EXISTS current_assets           numeric,
  ADD COLUMN IF NOT EXISTS cash_and_equivalents     numeric,
  ADD COLUMN IF NOT EXISTS inventories              numeric,
  ADD COLUMN IF NOT EXISTS trade_receivables        numeric,
  ADD COLUMN IF NOT EXISTS total_liabilities        numeric,
  ADD COLUMN IF NOT EXISTS current_liabilities      numeric,
  ADD COLUMN IF NOT EXISTS trade_payables           numeric,
  ADD COLUMN IF NOT EXISTS long_term_debt           numeric,
  ADD COLUMN IF NOT EXISTS net_debt                 numeric,
  -- Calculated: total_debt - cash_and_equivalents
  ADD COLUMN IF NOT EXISTS share_capital            numeric,
  ADD COLUMN IF NOT EXISTS retained_earnings        numeric,
  ADD COLUMN IF NOT EXISTS shares_outstanding       numeric,
  -- In millions of shares
  ADD COLUMN IF NOT EXISTS enterprise_value         numeric;
  -- Calculated: market_cap + net_debt

-- ── Missing Cash Flow columns ─────────────────────────────────────────────────

ALTER TABLE financial_metrics
  ADD COLUMN IF NOT EXISTS cfi                      numeric,
  -- Net cash from investing activities
  ADD COLUMN IF NOT EXISTS cff                      numeric,
  -- Net cash from financing activities
  ADD COLUMN IF NOT EXISTS dividends_paid           numeric;
  -- Cash dividends paid in period

-- ── Missing Ratio columns ──────────────────────────────────────────────────────

ALTER TABLE financial_metrics
  ADD COLUMN IF NOT EXISTS operating_margin         numeric,
  -- EBIT / Revenue * 100
  ADD COLUMN IF NOT EXISTS current_ratio            numeric,
  -- Current assets / Current liabilities
  ADD COLUMN IF NOT EXISTS net_debt_to_ebitda       numeric,
  -- Net debt / EBITDA
  ADD COLUMN IF NOT EXISTS cfo_to_pat               numeric,
  -- Cash conversion ratio: CFO / PAT
  ADD COLUMN IF NOT EXISTS fcf_margin               numeric,
  -- FCF / Revenue * 100
  ADD COLUMN IF NOT EXISTS revenue_cagr_3y          numeric,
  -- 3-year revenue CAGR (%)
  ADD COLUMN IF NOT EXISTS pat_cagr_3y              numeric,
  -- 3-year PAT CAGR (%)
  ADD COLUMN IF NOT EXISTS bvps                     numeric,
  -- Book value per share (PKR)
  ADD COLUMN IF NOT EXISTS cfps                     numeric;
  -- Cash flow per share (PKR)

-- ── Audit & Review Infrastructure ─────────────────────────────────────────────

ALTER TABLE financial_metrics
  ADD COLUMN IF NOT EXISTS is_consolidated          bool         NOT NULL DEFAULT true,
  -- true = consolidated, false = parent/unconsolidated
  ADD COLUMN IF NOT EXISTS is_ttm                   bool         NOT NULL DEFAULT false,
  -- true if this is a trailing-twelve-months computed row
  ADD COLUMN IF NOT EXISTS ttm_components           text[],
  -- For TTM rows: ['3QFY25','2QFY25','1QFY25','4QFY24']
  ADD COLUMN IF NOT EXISTS is_restated              bool         NOT NULL DEFAULT false,
  -- true if this is a restatement of a previously filed period
  ADD COLUMN IF NOT EXISTS restatement_notes        text,
  ADD COLUMN IF NOT EXISTS confidence               numeric      NOT NULL DEFAULT 1.0,
  -- Data confidence score: 1.0 = from official PSX filing, 0.8 = API, 0.6 = PDF
  ADD COLUMN IF NOT EXISTS upload_batch_id          uuid         REFERENCES financial_upload_batches(id),
  -- Which batch introduced/updated this row
  ADD COLUMN IF NOT EXISTS reviewed_by              text,
  -- Analyst who reviewed/approved this data entry
  ADD COLUMN IF NOT EXISTS reviewed_at              timestamptz;

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Symbol + period ordering (most queries)
CREATE INDEX IF NOT EXISTS fm_symbol_period_end_idx
  ON financial_metrics (symbol, period_end_date DESC);

-- All annual records (screening, peer comparison)
CREATE INDEX IF NOT EXISTS fm_period_type_end_idx
  ON financial_metrics (period_type, period_end_date DESC);

-- Find all rows for a batch
CREATE INDEX IF NOT EXISTS fm_upload_batch_idx
  ON financial_metrics (upload_batch_id)
  WHERE upload_batch_id IS NOT NULL;

-- Find low-confidence rows for review
CREATE INDEX IF NOT EXISTS fm_confidence_review_idx
  ON financial_metrics (confidence ASC, symbol)
  WHERE confidence < 1.0;

-- TTM rows
CREATE INDEX IF NOT EXISTS fm_ttm_symbol_idx
  ON financial_metrics (symbol, is_ttm, period_end_date DESC)
  WHERE is_ttm = true;

COMMENT ON TABLE financial_metrics IS
  'Primary financial statements table — flat, denormalized, analyst-friendly. '
  'One row per (symbol, period). All monetary values in PKR millions unless noted. '
  'income statement + balance sheet + cash flow in a single wide row for easy querying. '
  'For normalized line items, see financial_statement_lines. '
  'For computed ratios with peer context, see financial_ratio_snapshots. '
  'Extended by Migration 022 with full BS/IS/CF detail and audit fields.';
