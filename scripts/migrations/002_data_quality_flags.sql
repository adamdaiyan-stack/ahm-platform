-- ============================================================
-- Migration 002: data_quality_flags
-- Tracks stale, missing, suspicious, or invalid data points.
-- Every pipeline writes here when it encounters a bad record.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS data_quality_flags (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type   text        NOT NULL,    -- 'daily_price' | 'company' | 'financial_metric' | 'macro'
  entity_id     text,                    -- The ID or composite key of the flagged record
  symbol        text,                    -- NULL for non-symbol flags (e.g. macro, index)
  market_date   date,                    -- The date the flag relates to
  field_name    text,                    -- Which field has the issue (e.g. 'close', 'volume')
  issue_type    text        NOT NULL,
  -- 'missing_data'        → expected record not found
  -- 'stale_data'          → data not updated within expected window
  -- 'outlier'             → value outside plausible range
  -- 'parse_error'         → failed to parse source data
  -- 'source_mismatch'     → data differs across sources
  -- 'manual_override'     → analyst manually corrected a value
  -- 'suspicious_value'    → passes basic checks but looks unusual
  -- 'symbol_not_in_master'→ received symbol not in companies table
  -- 'ohlc_integrity'      → high < low or close outside OHLC range
  -- 'negative_value'      → unexpected negative (e.g. negative volume)
  severity      text        NOT NULL DEFAULT 'warning',
  -- 'critical' | 'warning' | 'info'
  description   text        NOT NULL,
  raw_value     jsonb,                   -- The offending raw record for debugging
  source        text,                    -- Which pipeline raised this flag
  detected_at   timestamptz NOT NULL DEFAULT now(),
  resolved_at   timestamptz,
  resolved_by   text,                    -- 'auto' | analyst name | pipeline name
  resolution_note text,
  status        text        NOT NULL DEFAULT 'open',
  -- 'open' | 'resolved' | 'ignored'

  CONSTRAINT dqf_severity_check CHECK (severity IN ('critical', 'warning', 'info')),
  CONSTRAINT dqf_status_check   CHECK (status   IN ('open', 'resolved', 'ignored')),
  CONSTRAINT dqf_issue_type_check CHECK (issue_type IN (
    'missing_data', 'stale_data', 'outlier', 'parse_error',
    'source_mismatch', 'manual_override', 'suspicious_value',
    'symbol_not_in_master', 'ohlc_integrity', 'negative_value'
  ))
);

-- Find all open flags for a symbol
CREATE INDEX IF NOT EXISTS dqf_symbol_date_idx
  ON data_quality_flags (symbol, market_date DESC)
  WHERE symbol IS NOT NULL;

-- Dashboard: all unresolved flags by severity
CREATE INDEX IF NOT EXISTS dqf_open_severity_idx
  ON data_quality_flags (severity, detected_at DESC)
  WHERE status = 'open';
