-- ============================================================
-- Migration 007: earnings_calendar
-- Tracks result dates, estimates, actuals, and EPS surprise.
-- The platform's catalyst tracking system anchors here.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS earnings_calendar (
  id                   serial      PRIMARY KEY,
  symbol               text        NOT NULL REFERENCES companies(symbol),
  period               text        NOT NULL,   -- 'FY25', '1HFY25', '1QFY25', '3QFY25'
  period_type          text        NOT NULL,   -- 'annual' | 'half_year' | 'quarter'
  period_end_date      date,

  -- ── Timing ────────────────────────────────────────────────
  expected_date        date,       -- Best estimate for announcement (pre-results)
  board_meeting_date   date,       -- BOM date when results are formally approved
  actual_date          date,       -- Date results were published on PSX

  -- ── Status ────────────────────────────────────────────────
  status               text        NOT NULL DEFAULT 'expected',
  -- 'expected' | 'confirmed' | 'announced' | 'delayed' | 'cancelled'

  -- ── Pre-result estimates ─────────────────────────────────
  eps_estimate         numeric,    -- Analyst consensus EPS estimate
  pat_estimate         numeric,    -- PKR millions
  revenue_estimate     numeric,    -- PKR millions
  dps_estimate         numeric,    -- Expected dividend per share

  -- ── Actuals (populated after announcement) ───────────────
  eps_actual           numeric,
  pat_actual           numeric,    -- PKR millions
  revenue_actual       numeric,    -- PKR millions
  dps_actual           numeric,

  -- ── Surprise (computed columns) ──────────────────────────
  eps_surprise_pct     numeric GENERATED ALWAYS AS (
    CASE
      WHEN eps_estimate IS NOT NULL AND eps_estimate != 0 AND eps_actual IS NOT NULL
      THEN ROUND(((eps_actual - eps_estimate) / ABS(eps_estimate)) * 100, 2)
      ELSE NULL
    END
  ) STORED,

  pat_surprise_pct     numeric GENERATED ALWAYS AS (
    CASE
      WHEN pat_estimate IS NOT NULL AND pat_estimate != 0 AND pat_actual IS NOT NULL
      THEN ROUND(((pat_actual - pat_estimate) / ABS(pat_estimate)) * 100, 2)
      ELSE NULL
    END
  ) STORED,

  -- ── AI context fields ─────────────────────────────────────
  quality_notes        text,       -- e.g. "One-time gain of PKR 2.3B included"
  guidance_text        text,       -- Management guidance extracted from results
  conference_call_notes text,

  source               text        NOT NULL DEFAULT 'manual',
  announcement_url     text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now(),

  UNIQUE (symbol, period),
  CONSTRAINT ec_period_type_check CHECK (period_type IN ('annual', 'half_year', 'quarter')),
  CONSTRAINT ec_status_check CHECK (status IN (
    'expected', 'confirmed', 'announced', 'delayed', 'cancelled'
  ))
);

-- Upcoming results
CREATE INDEX IF NOT EXISTS ec_expected_date_upcoming_idx
  ON earnings_calendar (expected_date ASC)
  WHERE status IN ('expected', 'confirmed') AND expected_date >= CURRENT_DATE;

-- Symbol history
CREATE INDEX IF NOT EXISTS ec_symbol_period_idx
  ON earnings_calendar (symbol, period_end_date DESC);

-- Biggest surprises (for AI / research highlight)
CREATE INDEX IF NOT EXISTS ec_surprise_magnitude_idx
  ON earnings_calendar (ABS(eps_surprise_pct) DESC NULLS LAST)
  WHERE eps_surprise_pct IS NOT NULL;
