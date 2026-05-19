-- ============================================================
-- Migration 020: financial_statement_lines
-- Normalized raw line items from financial statements.
-- This is the intake layer for API/PDF ingestion — raw values
-- before they are summarized into financial_metrics.
-- Idempotent — safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_statement_lines (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol            text        NOT NULL REFERENCES companies(symbol),
  period_key        text        NOT NULL,
  -- Matches financial_reporting_periods.period_key for the symbol

  statement_type    text        NOT NULL,
  -- 'income_statement' | 'balance_sheet' | 'cash_flow'

  metric_code       text        NOT NULL REFERENCES financial_metric_definitions(metric_code),
  -- Canonical code from financial_metric_definitions

  raw_label         text,
  -- Exact label as it appeared in the source (e.g. "Net Markup Income",
  -- "Profit After Taxation", "Administrative and General Expenses")
  -- Preserved for audit and normalizer improvement.

  value             numeric     NOT NULL,
  -- The numeric value stored at the native unit of value_unit below

  value_unit        text        NOT NULL DEFAULT 'pkr_millions',
  -- 'pkr_millions'   → standard (normalize all to this before ingesting)
  -- 'pkr_thousands'  → divide by 1000 before comparing
  -- 'pkr_billions'   → multiply by 1000 before comparing
  -- 'pkr_units'      → PKR (not millions) — rare but some banks report this
  -- 'per_share'      → per-share metrics

  is_consolidated   bool        NOT NULL DEFAULT true,
  -- true = consolidated financials, false = parent-only (unconsolidated)

  confidence        numeric     NOT NULL DEFAULT 1.0,
  -- 0.0–1.0 confidence in this value:
  -- 1.0 = verified from official PSX/SECP filing
  -- 0.8 = from Capital Stake API (reliable but programmatic)
  -- 0.6 = extracted from PDF (needs review)
  -- 0.4 = OCR output (unreviewed)
  CONSTRAINT fsl_confidence_range CHECK (confidence BETWEEN 0 AND 1),

  upload_batch_id   uuid        REFERENCES financial_upload_batches(id),
  source            text        NOT NULL DEFAULT 'manual',
  -- 'manual' | 'api_capital_stake' | 'pdf_extract' | 'csv_import'

  raw_extract       jsonb,
  -- Preserved raw extraction data for debugging
  -- {page: 12, cell: "B14", ocr_text: "2,345,678"}

  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  -- One value per metric per period per company (consolidated vs unconsolidated separate)
  UNIQUE (symbol, period_key, metric_code, is_consolidated),

  CONSTRAINT fsl_statement_type_check CHECK (statement_type IN (
    'income_statement', 'balance_sheet', 'cash_flow'
  )),
  CONSTRAINT fsl_source_check CHECK (source IN (
    'manual', 'api_capital_stake', 'pdf_extract', 'csv_import'
  )),
  CONSTRAINT fsl_unit_check CHECK (value_unit IN (
    'pkr_millions', 'pkr_thousands', 'pkr_billions', 'pkr_units', 'per_share'
  ))
);

-- All lines for a symbol+period
CREATE INDEX IF NOT EXISTS fsl_symbol_period_idx
  ON financial_statement_lines (symbol, period_key, statement_type);

-- Find all lines by metric code (for cross-company analysis)
CREATE INDEX IF NOT EXISTS fsl_metric_code_idx
  ON financial_statement_lines (metric_code, symbol);

-- Find unreviewed low-confidence lines
CREATE INDEX IF NOT EXISTS fsl_confidence_review_idx
  ON financial_statement_lines (confidence ASC, created_at DESC)
  WHERE confidence < 0.8;

-- Find lines by batch
CREATE INDEX IF NOT EXISTS fsl_batch_idx
  ON financial_statement_lines (upload_batch_id)
  WHERE upload_batch_id IS NOT NULL;

COMMENT ON TABLE financial_statement_lines IS
  'Normalized raw line items from income statement, balance sheet, and cash flow. '
  'This is the intake layer — values land here first before being summarized '
  'into financial_metrics by the ingest pipeline. '
  'Each row maps one source label to one canonical metric_code. '
  'The UNIQUE constraint ensures one value per metric per period per company.';
