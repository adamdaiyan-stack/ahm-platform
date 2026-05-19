-- ============================================================
-- Migration 010: announcements_raw + catalyst_events view
--
-- announcements_raw is the canonical store for all PSX company
-- announcements. Each row is one announcement as published on
-- dps.psx.com.pk/company/{SYMBOL}.
--
-- The document_id (from PSX's PDF URL) is the stable unique key —
-- idempotent upserts use (symbol, document_id).
--
-- Classification is deterministic (regex-based) and stored inline.
-- No separate classification table needed.
--
-- The catalyst_events view surfaces actionable, high-importance
-- events for the AI and frontend layers without any extra storage.
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ─── Main table ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements_raw (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Source identity ───────────────────────────────────────
  symbol               text        NOT NULL,
  document_id          text        NOT NULL,    -- PSX doc ID from PDF URL (e.g. '276542')
  document_url         text,                   -- https://dps.psx.com.pk/download/document/{id}.pdf

  -- ── Raw data ──────────────────────────────────────────────
  announcement_date    date        NOT NULL,
  title                text        NOT NULL,
  raw_category         text        NOT NULL,    -- 'financial_results' | 'board_meetings' | 'others'
  source               text        NOT NULL DEFAULT 'dps_psx',

  -- ── Classification (deterministic, regex-based) ───────────
  event_type           text,
  -- Possible values:
  --   financial_results       — EPS, PAT, revenue result announcement
  --   quarterly_report        — Transmission of quarterly filing
  --   annual_report           — Transmission of annual report
  --   board_meeting           — Board meeting notice or outcome
  --   agm                     — Annual General Meeting
  --   egm                     — Extraordinary General Meeting
  --   cash_dividend           — Cash dividend declaration
  --   bonus_shares            — Bonus share issue
  --   stock_split             — Sub-division of shares
  --   reverse_split           — Consolidation of shares
  --   rights_issue            — Rights share offering
  --   book_closure            — Book closure notice
  --   dividend_paid           — Confirmation of dividend credit
  --   material_notice         — Material information disclosure
  --   merger_acquisition      — M&A event
  --   newspaper_clipping      — Derivative clipping of another announcement
  --   regulatory_filing       — SECP/CDC/NCCPL routine filing
  --   unclassified            — Could not classify

  importance_score     smallint,               -- 1 (lowest) → 5 (highest)
  catalyst_direction   text,                   -- 'bullish' | 'bearish' | 'neutral' | null
  is_price_sensitive   boolean     DEFAULT false,
  classification_confidence text  DEFAULT 'low',  -- 'high' | 'medium' | 'low'

  -- ── Structured extraction (from title, regex-parsed) ──────
  -- Populated by announcement-parser.ts for financial/dividend events.
  structured_data      jsonb,
  -- Examples:
  --   cash_dividend:   { "cash_dividend": 7.5, "period": "Final", "financial_year": "FY25" }
  --   bonus_shares:    { "bonus_percent": 10 }
  --   stock_split:     { "split_ratio": 2.0 }
  --   financial_results: { "period": "Q1 FY26", "period_type": "quarter" }
  --   board_meeting:   { "board_meeting_date": "2026-04-14" }

  -- ── Corporate action linkage ──────────────────────────────
  -- Set after normalize-corporate-actions.ts runs.
  corporate_action_id  int         REFERENCES corporate_actions(id) ON DELETE SET NULL,
  needs_corporate_action boolean   DEFAULT false,
  -- True for events that should generate or update a corporate_actions row:
  -- cash_dividend, bonus_shares, stock_split, rights_issue.

  -- ── AI readiness ──────────────────────────────────────────
  ai_summary           text,       -- Short LLM-generated or template summary (Phase 2)
  embedding_id         uuid        REFERENCES intelligence_embeddings(id) ON DELETE SET NULL,
  -- Linked to intelligence_embeddings when embedding is generated.

  -- ── Provenance ────────────────────────────────────────────
  fetched_at           timestamptz DEFAULT now(),
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now(),

  -- Idempotency: one row per PSX document
  CONSTRAINT ann_symbol_docid_unique UNIQUE (symbol, document_id),

  CONSTRAINT ann_raw_category_check CHECK (raw_category IN (
    'financial_results', 'board_meetings', 'others'
  )),
  CONSTRAINT ann_importance_score_check CHECK (
    importance_score IS NULL OR (importance_score BETWEEN 1 AND 5)
  ),
  CONSTRAINT ann_catalyst_direction_check CHECK (
    catalyst_direction IS NULL OR catalyst_direction IN ('bullish', 'bearish', 'neutral')
  ),
  CONSTRAINT ann_confidence_check CHECK (
    classification_confidence IN ('high', 'medium', 'low')
  )
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

-- Primary lookup: announcements for a symbol, newest first
CREATE INDEX IF NOT EXISTS ann_symbol_date_idx
  ON announcements_raw (symbol, announcement_date DESC);

-- Event feed: recent high-importance events across all symbols
CREATE INDEX IF NOT EXISTS ann_importance_date_idx
  ON announcements_raw (importance_score DESC, announcement_date DESC)
  WHERE importance_score >= 4;

-- Unprocessed corporate action events (for normalization pipeline)
CREATE INDEX IF NOT EXISTS ann_needs_ca_idx
  ON announcements_raw (announcement_date DESC)
  WHERE needs_corporate_action = true AND corporate_action_id IS NULL;

-- Event type queries (e.g., all dividends, all board meetings)
CREATE INDEX IF NOT EXISTS ann_event_type_date_idx
  ON announcements_raw (event_type, announcement_date DESC)
  WHERE event_type IS NOT NULL;

-- Price-sensitive filter (for alerts, AI)
CREATE INDEX IF NOT EXISTS ann_price_sensitive_idx
  ON announcements_raw (announcement_date DESC)
  WHERE is_price_sensitive = true;

-- ─── catalyst_events view ─────────────────────────────────────────────────────
--
-- A clean read-only view for the AI and frontend:
-- High-importance, classified events joined with company context.
-- No extra storage. Derived entirely from announcements_raw + companies.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW catalyst_events AS
SELECT
  a.id,
  a.symbol,
  c.company_name,
  c.sector,
  a.announcement_date,
  a.event_type,
  a.title,
  a.importance_score,
  a.catalyst_direction,
  a.is_price_sensitive,
  a.structured_data,
  a.document_url,
  a.ai_summary,
  a.classification_confidence,
  -- Days since announcement (for recency ranking)
  (CURRENT_DATE - a.announcement_date)::int AS days_ago
FROM announcements_raw a
JOIN companies c ON c.symbol = a.symbol
WHERE
  a.importance_score >= 3
  AND a.event_type IS NOT NULL
  AND a.event_type != 'newspaper_clipping'
ORDER BY a.announcement_date DESC, a.importance_score DESC;

COMMENT ON VIEW catalyst_events IS
  'High-importance classified PSX announcements joined with company context. '
  'Primary interface for AI catalyst queries and frontend event feeds. '
  'Importance >= 3, excludes derivative newspaper clippings.';

-- ─── upcoming_events view ─────────────────────────────────────────────────────
--
-- Cross-joins announcements with corporate_actions to surface
-- upcoming ex-dates, board meetings, and book closures.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW upcoming_events AS
SELECT
  'corporate_action'        AS source_type,
  ca.symbol,
  c.company_name,
  c.sector,
  ca.action_type            AS event_type,
  COALESCE(ca.ex_date, ca.board_meeting_date, ca.book_closure_start) AS event_date,
  ca.cash_dividend,
  ca.bonus_percent,
  ca.rights_ratio,
  ca.rights_price,
  NULL::text                AS title,
  NULL::text                AS document_url
FROM corporate_actions ca
JOIN companies c ON c.symbol = ca.symbol
WHERE
  ca.status IN ('announced', 'confirmed')
  AND COALESCE(ca.ex_date, ca.board_meeting_date, ca.book_closure_start) >= CURRENT_DATE

UNION ALL

SELECT
  'announcement'            AS source_type,
  a.symbol,
  c.company_name,
  c.sector,
  a.event_type,
  a.announcement_date       AS event_date,
  (a.structured_data->>'cash_dividend')::numeric AS cash_dividend,
  (a.structured_data->>'bonus_percent')::numeric AS bonus_percent,
  NULL::numeric             AS rights_ratio,
  NULL::numeric             AS rights_price,
  a.title,
  a.document_url
FROM announcements_raw a
JOIN companies c ON c.symbol = a.symbol
WHERE
  a.event_type IN ('board_meeting', 'agm', 'egm')
  AND a.announcement_date >= CURRENT_DATE - INTERVAL '14 days'

ORDER BY event_date ASC NULLS LAST;

COMMENT ON VIEW upcoming_events IS
  'Union of upcoming corporate actions (from corporate_actions table) '
  'and recent board meeting / AGM announcements. Event calendar feed.';
