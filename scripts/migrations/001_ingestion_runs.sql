-- ============================================================
-- Migration 001: ingestion_runs
-- Tracks every pipeline execution — success, partial, or failed.
-- This is the operational heartbeat of the data layer.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_name     text        NOT NULL,
  -- 'daily_prices' | 'index_history' | 'macro_sbp' | 'macro_pbs'
  -- | 'corporate_actions' | 'earnings_calendar' | 'company_snapshots'
  -- | 'daily_snapshots'
  pipeline_version  text        NOT NULL DEFAULT '1.0',
  run_date          date        NOT NULL,        -- Business date this run covers
  source            text        NOT NULL,        -- 'dps_psx' | 'sbp' | 'analyst' | 'manual'
  trigger           text        NOT NULL DEFAULT 'cron',
  -- 'cron' | 'manual' | 'retry' | 'backfill'
  status            text        NOT NULL DEFAULT 'running',
  -- 'running' | 'success' | 'partial' | 'failed' | 'skipped'
  records_fetched   int         DEFAULT 0,
  records_upserted  int         DEFAULT 0,
  records_skipped   int         DEFAULT 0,
  records_failed    int         DEFAULT 0,
  symbols_failed    text[]      DEFAULT '{}',
  error_summary     text,
  errors            jsonb,                       -- Per-symbol or structured error detail
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  duration_ms       int,                         -- Set by pipeline on completion

  CONSTRAINT ingestion_runs_status_check CHECK (
    status IN ('running', 'success', 'partial', 'failed', 'skipped')
  )
);

-- Fast lookup: what ran on a given date?
CREATE INDEX IF NOT EXISTS ingestion_runs_pipeline_date_idx
  ON ingestion_runs (pipeline_name, run_date DESC);

-- Fast lookup: what failed recently?
CREATE INDEX IF NOT EXISTS ingestion_runs_status_idx
  ON ingestion_runs (status, started_at DESC)
  WHERE status IN ('failed', 'partial');
