-- ============================================================
-- Migration 006: corporate_actions
-- Tracks all corporate events affecting share price and capital structure.
-- Required for adjusted price history and dividend yield calculations.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS corporate_actions (
  id                   serial      PRIMARY KEY,
  symbol               text        NOT NULL REFERENCES companies(symbol),
  action_type          text        NOT NULL,
  -- 'cash_dividend'    → regular cash payout per share
  -- 'stock_dividend'   → dividend paid in shares (treated as bonus)
  -- 'bonus_shares'     → free bonus issue (e.g. 20% = 1 for every 5)
  -- 'rights_issue'     → new shares offered to existing holders at a set price
  -- 'stock_split'      → share count increases, par value decreases
  -- 'reverse_split'    → share count decreases, par value increases
  -- 'merger_acquisition' → M&A event affecting share structure

  -- ── Timing ─────────────────────────────────────────────────
  announced_date       date,
  board_meeting_date   date,
  book_closure_start   date,
  book_closure_end     date,
  record_date          date,
  ex_date              date,        -- First day stock trades ex-entitlement
  payment_date         date,

  -- ── Financial parameters ──────────────────────────────────
  cash_dividend        numeric,     -- PKR per share (cash dividends only)
  bonus_percent        numeric,     -- Bonus percentage (e.g. 20 for 20%)
  rights_ratio         numeric,     -- Rights ratio (e.g. 0.25 = 1 share per 4 held)
  rights_price         numeric,     -- PKR subscription price for rights
  split_ratio          numeric,     -- e.g. 2.0 for 2-for-1 split
  face_value           numeric,     -- PKR face value per share

  -- ── Price adjustment ─────────────────────────────────────
  -- Calculated after ex_date is known and previous close is available.
  -- Formula varies by action_type (see corporate actions engine docs).
  adjustment_factor    numeric,     -- Multiply historical prices by this factor

  -- ── Context ──────────────────────────────────────────────
  financial_year       text,        -- 'FY25'
  period               text,        -- 'Final', 'Interim', '1H', '3Q', 'Special'
  status               text        NOT NULL DEFAULT 'announced',
  -- 'announced' | 'confirmed' | 'completed' | 'cancelled'
  source               text        NOT NULL DEFAULT 'manual',
  announcement_url     text,
  notes                text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now(),

  CONSTRAINT ca_action_type_check CHECK (action_type IN (
    'cash_dividend', 'stock_dividend', 'bonus_shares',
    'rights_issue', 'stock_split', 'reverse_split', 'merger_acquisition'
  )),
  CONSTRAINT ca_status_check CHECK (status IN (
    'announced', 'confirmed', 'completed', 'cancelled'
  ))
);

CREATE INDEX IF NOT EXISTS ca_symbol_exdate_idx
  ON corporate_actions (symbol, ex_date DESC);

CREATE INDEX IF NOT EXISTS ca_exdate_upcoming_idx
  ON corporate_actions (ex_date ASC)
  WHERE status IN ('announced', 'confirmed') AND ex_date >= CURRENT_DATE;

-- View: trailing 12-month dividend yield
CREATE OR REPLACE VIEW ttm_dividend_yield AS
SELECT
  ca.symbol,
  ROUND(SUM(ca.cash_dividend), 2)                                      AS ttm_dps,
  c.current_price,
  ROUND((SUM(ca.cash_dividend) / NULLIF(c.current_price, 0)) * 100, 2) AS yield_pct
FROM corporate_actions ca
JOIN companies c ON c.symbol = ca.symbol
WHERE ca.action_type = 'cash_dividend'
  AND ca.status      = 'completed'
  AND ca.ex_date    >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY ca.symbol, c.current_price;

COMMENT ON VIEW ttm_dividend_yield IS
  'Trailing 12-month dividend yield computed from completed cash dividend corporate actions.';
