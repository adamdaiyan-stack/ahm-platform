-- ============================================================
-- Migration 026: ai_generation_jobs + ai_quality_checks
--
-- ai_generation_jobs:  Tracks all scheduled, queued, and
--                      completed AI generation jobs.
--                      Enables monitoring of queue depth,
--                      latency, cost, and error rates.
--
-- ai_quality_checks:   Output quality validation log.
--                      Records automated checks run on every
--                      generated output (prohibited language
--                      scan, length validation, etc.).
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── job_status enum ──────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM (
    'queued',       -- Enqueued, not yet started
    'processing',   -- Edge Function is actively working on this job
    'complete',     -- Successfully generated and cached
    'failed',       -- Generation failed (see error_message)
    'skipped',      -- Skipped because a valid cache hit was found
    'cancelled'     -- Cancelled before processing (e.g. by a higher-priority job)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── ai_generation_jobs ───────────────────────────────────────────────────────
-- Every AI generation request — scheduled, event-triggered, or on-demand —
-- is logged here before execution. Provides full operational observability.

CREATE TABLE IF NOT EXISTS ai_generation_jobs (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── What to generate ──────────────────────────────────────
  job_type            ai_output_type NOT NULL,
  -- Matches ai_outputs.output_type

  reference_key       text          NOT NULL,
  -- Symbol, sector slug, 'market', or alert compound key

  -- ── Why it was triggered ──────────────────────────────────
  trigger_reason      text          NOT NULL,
  -- 'scheduled'           → cron job (nightly scoring, weekly sector briefs, etc.)
  -- 'event_triggered'     → created by ai_event_triggers processing
  -- 'cache_miss'          → frontend request found no valid cache
  -- 'cache_invalidation'  → existing cache was invalidated, queued for regeneration
  -- 'manual'              → admin-triggered

  trigger_source_id   uuid,
  -- FK to the source that triggered this job.
  -- For event_triggered: references ai_event_triggers.id
  -- For others: NULL

  -- ── Priority ──────────────────────────────────────────────
  priority            integer       NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  -- 1 = critical: conviction tier change, high-severity risk
  -- 2 = high:     on-demand request with no cache
  -- 3 = medium:   cache invalidation regeneration
  -- 4 = low:      scheduled batch generation
  -- 5 = batch:    background pre-warming

  -- ── Processing ────────────────────────────────────────────
  status              job_status    NOT NULL DEFAULT 'queued',

  -- ── Output ────────────────────────────────────────────────
  output_id           uuid,
  -- FK → ai_outputs.id — populated on success

  -- ── Timing and cost ───────────────────────────────────────
  queued_at           timestamptz   NOT NULL DEFAULT now(),
  started_at          timestamptz,
  completed_at        timestamptz,

  -- Derived durations (set on completion):
  queue_wait_ms       integer,
  -- (started_at - queued_at) in milliseconds

  processing_ms       integer,
  -- (completed_at - started_at) in milliseconds

  total_tokens        integer,
  -- Total tokens consumed (propagated from ai_outputs)

  -- ── Error handling ────────────────────────────────────────
  error_message       text,
  retry_count         integer       NOT NULL DEFAULT 0 CHECK (retry_count <= 2),
  -- Max 2 retries. After 2 failures: status = 'failed', alert internal team.

  -- ── Model config used ─────────────────────────────────────
  model_version       text,
  prompt_version      text
);

-- Queue processing: pending jobs by priority
CREATE INDEX IF NOT EXISTS agj_queue_idx
  ON ai_generation_jobs (priority, queued_at ASC)
  WHERE status = 'queued';

-- Monitoring: jobs by type and date
CREATE INDEX IF NOT EXISTS agj_type_queued_at_idx
  ON ai_generation_jobs (job_type, queued_at DESC);

-- Error rate monitoring
CREATE INDEX IF NOT EXISTS agj_status_idx
  ON ai_generation_jobs (status, queued_at DESC);

-- Daily cost aggregation
CREATE INDEX IF NOT EXISTS agj_completed_at_idx
  ON ai_generation_jobs (completed_at DESC)
  WHERE status = 'complete';

COMMENT ON TABLE ai_generation_jobs IS
  'Operational log of all AI generation jobs. '
  'Every generation request — scheduled, event-triggered, or on-demand — '
  'is logged before execution. Monitor via: '
  'queue depth (status = queued), error rate (status = failed), '
  'cache skips (status = skipped), and avg processing_ms. '
  'Token cost summary: SUM(total_tokens) GROUP BY job_type, DATE(completed_at).';

-- ── ai_quality_checks ────────────────────────────────────────────────────────
-- Automated quality validation log for every AI-generated output.
-- Every generation triggers a quality check immediately after creation.
-- Results are stored here — failures are flagged for review.

DO $$ BEGIN
  CREATE TYPE quality_check_status AS ENUM (
    'passed',    -- All checks passed
    'warning',   -- Minor issues found (e.g. output slightly short)
    'failed'     -- Critical issues found (e.g. prohibited language detected)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS ai_quality_checks (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── What was checked ──────────────────────────────────────
  output_id           uuid          NOT NULL REFERENCES ai_outputs(id) ON DELETE CASCADE,
  job_id              uuid          REFERENCES ai_generation_jobs(id),

  -- ── Check results ─────────────────────────────────────────
  overall_status      quality_check_status NOT NULL,

  checks_run          jsonb         NOT NULL DEFAULT '[]',
  -- Array of individual check results. Each entry shape:
  -- {
  --   check_name: 'prohibited_language_scan',
  --   status: 'passed' | 'warning' | 'failed',
  --   detail: 'No prohibited terms detected',
  --   matches: []          ← populated if violations found
  -- }
  --
  -- Standard checks run on every output:
  --   'prohibited_language_scan'    → checks for Buy/Sell/Hold and variants
  --   'target_price_scan'           → checks for price target language
  --   'invented_figures_check'      → verifies numbers appear in input_snapshot
  --   'length_validation'           → output length within expected range
  --   'promotional_language_scan'   → checks for superlatives and hype language
  --   'null_data_reference_check'   → AI referenced a null/unavailable field

  violations          jsonb         NOT NULL DEFAULT '[]',
  -- Array of all failed checks (subset of checks_run where status = 'failed').
  -- Empty array = no violations.

  -- ── Resolution ────────────────────────────────────────────
  requires_review     boolean       NOT NULL DEFAULT false,
  -- Set to true when overall_status = 'failed' or a critical check fails.
  -- Triggers internal review notification.

  reviewed_at         timestamptz,
  reviewed_by         text,
  review_notes        text,

  checked_at          timestamptz   NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS aqc_output_id_idx
  ON ai_quality_checks (output_id);

CREATE INDEX IF NOT EXISTS aqc_overall_status_idx
  ON ai_quality_checks (overall_status, checked_at DESC)
  WHERE overall_status IN ('warning', 'failed');

CREATE INDEX IF NOT EXISTS aqc_requires_review_idx
  ON ai_quality_checks (requires_review, checked_at DESC)
  WHERE requires_review = true;

COMMENT ON TABLE ai_quality_checks IS
  'Automated quality validation results for every AI-generated output. '
  'Run immediately after generation by the generating Edge Function. '
  'Critical check: prohibited_language_scan must pass on 100% of outputs. '
  'Monitor via: SELECT COUNT(*), overall_status FROM ai_quality_checks '
  'WHERE checked_at > now() - interval ''7 days'' GROUP BY overall_status.';

-- ── Monitoring views ──────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW ai_job_queue_summary AS
SELECT
  job_type,
  status,
  COUNT(*)                                                        AS count,
  ROUND(AVG(processing_ms))                                       AS avg_processing_ms,
  SUM(total_tokens)                                               AS total_tokens,
  MAX(queued_at)                                                  AS latest_queued
FROM ai_generation_jobs
WHERE queued_at >= now() - interval '24 hours'
GROUP BY job_type, status
ORDER BY job_type, status;

COMMENT ON VIEW ai_job_queue_summary IS
  'Last 24-hour job summary by type and status. '
  'Quick health check for the generation pipeline.';

CREATE OR REPLACE VIEW ai_quality_summary AS
SELECT
  o.output_type,
  COUNT(*)                                            AS total_outputs,
  COUNT(*) FILTER (WHERE q.overall_status = 'passed')  AS passed,
  COUNT(*) FILTER (WHERE q.overall_status = 'warning') AS warnings,
  COUNT(*) FILTER (WHERE q.overall_status = 'failed')  AS failed,
  COUNT(*) FILTER (WHERE q.requires_review = true)     AS pending_review
FROM ai_quality_checks q
JOIN ai_outputs o ON o.id = q.output_id
WHERE q.checked_at >= now() - interval '7 days'
GROUP BY o.output_type;

COMMENT ON VIEW ai_quality_summary IS
  'Quality check pass/fail/warning rates per output type over the last 7 days. '
  'Target: 0 failed outputs, < 5% warnings.';

-- ── Update 000_run_all.sql note ───────────────────────────────────────────────
-- After running this migration, update scripts/migrations/000_run_all.sql
-- to include 023_conviction_scores.sql, 024_ai_outputs.sql,
-- 025_ai_events_alerts.sql, and 026_ai_jobs_quality.sql.
