-- ============================================================
-- Migration 017: financial_upload_batches
-- Audit trail for all financial data ingestion — manual entry,
-- API ingestion, PDF extraction, CSV imports.
-- Every batch of financial data is traceable to a source.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_upload_batches (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name        text        NOT NULL,
  source_type       text        NOT NULL DEFAULT 'manual',
  -- 'manual'           → analyst-entered via admin tool or script
  -- 'api_capital_stake'→ Capital Stake API ingestion
  -- 'pdf_extract'      → semi-automated PDF parsing
  -- 'csv_import'       → spreadsheet/CSV upload
  source_reference  text,         -- URL, filename, API run ID, etc.
  submitted_by      text        NOT NULL DEFAULT 'analyst',
  submitted_at      timestamptz NOT NULL DEFAULT now(),
  symbols_affected  text[]      NOT NULL DEFAULT '{}',
  periods_affected  text[]      NOT NULL DEFAULT '{}',
  records_planned   int,          -- Expected number of records
  records_applied   int         NOT NULL DEFAULT 0,
  records_failed    int         NOT NULL DEFAULT 0,
  status            text        NOT NULL DEFAULT 'draft',
  -- 'draft'     → batch created but not yet submitted
  -- 'submitted' → submitted for review
  -- 'approved'  → reviewer approved
  -- 'rejected'  → reviewer rejected
  -- 'applied'   → data written to financial_metrics
  reviewed_by       text,
  reviewed_at       timestamptz,
  review_notes      text,
  applied_at        timestamptz,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fub_source_type_check CHECK (source_type IN (
    'manual', 'api_capital_stake', 'pdf_extract', 'csv_import'
  )),
  CONSTRAINT fub_status_check CHECK (status IN (
    'draft', 'submitted', 'approved', 'rejected', 'applied'
  ))
);

-- Find all pending batches for review
CREATE INDEX IF NOT EXISTS fub_status_submitted_at_idx
  ON financial_upload_batches (status, submitted_at DESC)
  WHERE status IN ('submitted', 'approved');

-- Find batches by symbol
CREATE INDEX IF NOT EXISTS fub_symbols_idx
  ON financial_upload_batches USING GIN (symbols_affected);

COMMENT ON TABLE financial_upload_batches IS
  'Audit trail for all financial data ingestion batches. '
  'Every write to financial_metrics should reference a batch_id from here. '
  'Enables review workflow, rollback capability, and source tracking.';
