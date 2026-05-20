-- ============================================================
-- Migration 031: financial_ratio_snapshots — audit trail + period_end
--
-- Adds:
--   1. period_end — the financial period end date (was written by
--      ingest-financial-data.ts but missing from the table DDL).
--   2. Audit trail columns matching DATA_SOURCES.md policy:
--      source_document, source_url, source_page, source_type,
--      is_audited, entered_by, verified_by, ingestion_batch,
--      verification_status, notes.
--
-- All ADD COLUMN IF NOT EXISTS — fully idempotent.
-- ============================================================

-- ── Financial period ──────────────────────────────────────────────────────────

ALTER TABLE financial_ratio_snapshots
  ADD COLUMN IF NOT EXISTS period_end date;
  -- End date of the financial reporting period (e.g. 2024-12-31 for FY24)

-- ── Audit trail — source provenance ──────────────────────────────────────────

ALTER TABLE financial_ratio_snapshots
  ADD COLUMN IF NOT EXISTS source_document      text,
  -- e.g. "HBL Annual Report 2024", "PSX Notice 2024-03-15"
  ADD COLUMN IF NOT EXISTS source_url           text,
  -- Direct URL to the source document (annual report page, PSX filing, etc.)
  ADD COLUMN IF NOT EXISTS source_page          text,
  -- Page or section reference within the document (e.g. "p.82", "Note 14")
  ADD COLUMN IF NOT EXISTS source_type          text,
  -- Tier classification: 'annual_report' | 'half_year_report' | 'quarterly_report'
  --   | 'psx_notice' | 'secp_filing' | 'bloomberg_terminal' | 'analyst_model'
  --   | 'api_provider' | 'management_accounts' | 'press_release' | 'web_scrape'
  ADD COLUMN IF NOT EXISTS is_audited           boolean NOT NULL DEFAULT false,
  -- true = data comes from audited financial statements
  ADD COLUMN IF NOT EXISTS entered_by           text,
  -- Who entered/uploaded this data (analyst username or pipeline name)
  ADD COLUMN IF NOT EXISTS verified_by          text,
  -- Who independently verified this data (null = not yet verified)
  ADD COLUMN IF NOT EXISTS ingestion_batch      text,
  -- Batch identifier for traceability (e.g. 'pilot_batch_1_2026_05')
  ADD COLUMN IF NOT EXISTS verification_status  text NOT NULL DEFAULT 'needs_verification',
  -- Workflow state: 'needs_verification' | 'verified' | 'disputed' | 're-verified'
  ADD COLUMN IF NOT EXISTS notes                text;
  -- Free-text notes: data quality observations, restatements, methodology flags

-- ── Constraint on verification_status ─────────────────────────────────────────

ALTER TABLE financial_ratio_snapshots
  DROP CONSTRAINT IF EXISTS frs_verification_status_check;

ALTER TABLE financial_ratio_snapshots
  ADD CONSTRAINT frs_verification_status_check CHECK (
    verification_status IN (
      'needs_verification', 'verified', 'disputed', 're-verified'
    )
  );

-- ── Constraint on source_type ─────────────────────────────────────────────────

ALTER TABLE financial_ratio_snapshots
  DROP CONSTRAINT IF EXISTS frs_source_type_check;

ALTER TABLE financial_ratio_snapshots
  ADD CONSTRAINT frs_source_type_check CHECK (
    source_type IS NULL OR source_type IN (
      'annual_report', 'half_year_report', 'quarterly_report',
      'psx_notice', 'secp_filing', 'bloomberg_terminal',
      'analyst_model', 'api_provider', 'management_accounts',
      'press_release', 'web_scrape'
    )
  );

-- ── Indexes for audit queries ─────────────────────────────────────────────────

-- Find all unverified rows
CREATE INDEX IF NOT EXISTS frs_verification_status_idx
  ON financial_ratio_snapshots (verification_status, symbol)
  WHERE verification_status != 'verified';

-- Find all rows from a given ingestion batch
CREATE INDEX IF NOT EXISTS frs_ingestion_batch_idx
  ON financial_ratio_snapshots (ingestion_batch)
  WHERE ingestion_batch IS NOT NULL;

-- Find all unaudited rows (data quality monitoring)
CREATE INDEX IF NOT EXISTS frs_is_audited_idx
  ON financial_ratio_snapshots (is_audited, symbol)
  WHERE is_audited = false;

COMMENT ON COLUMN financial_ratio_snapshots.source_document IS
  'Human-readable name of the source document (e.g. "HBL Annual Report 2024"). '
  'Required for any row not sourced from an automated API pipeline.';

COMMENT ON COLUMN financial_ratio_snapshots.is_audited IS
  'True only when data comes from audited financial statements published by '
  'the company or SECP. API/scraped data defaults to false.';

COMMENT ON COLUMN financial_ratio_snapshots.verification_status IS
  'Workflow state per DATA_SOURCES.md: needs_verification → verified → disputed → re-verified. '
  'Only ''verified'' rows should be used for public-facing analytics.';

COMMENT ON COLUMN financial_ratio_snapshots.ingestion_batch IS
  'Batch identifier linking this row to a specific ingestion run, '
  'for traceability and bulk rollback. Format: <name>_<YYYY_MM>.';
