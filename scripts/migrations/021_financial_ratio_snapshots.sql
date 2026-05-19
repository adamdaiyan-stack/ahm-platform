-- ============================================================
-- Migration 021: financial_ratio_snapshots
-- Computed financial ratios with peer comparison context.
-- Decoupled from raw financial_metrics — ratios are derived,
-- not stored redundantly in the source table.
-- Unique per (symbol, period_key, snapshot_date).
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_ratio_snapshots (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol              text        NOT NULL REFERENCES companies(symbol),
  period_key          text        NOT NULL,
  -- Which financial period these ratios describe
  snapshot_date       date        NOT NULL,
  -- Date ratios were computed. Market-based ratios (PE, PB) use price on this date.

  period_type         text,
  -- 'annual' | 'half_year' | 'quarter' | 'ttm'
  is_ttm              bool        NOT NULL DEFAULT false,

  -- ── Market inputs at computation time ─────────────────────────────────────
  price_used          numeric,    -- Closing price used for market-based ratios (PKR)
  market_cap_used     numeric,    -- Market capitalisation (PKR millions)
  shares_outstanding  numeric,    -- Shares in issue (millions)
  enterprise_value    numeric,    -- Market cap + net debt (PKR millions)

  -- ── Valuation ratios ──────────────────────────────────────────────────────
  pe_ratio            numeric,    -- Price / EPS
  pb_ratio            numeric,    -- Price / Book value per share
  ev_ebitda           numeric,    -- Enterprise value / EBITDA
  ps_ratio            numeric,    -- Market cap / Revenue
  ev_revenue          numeric,    -- Enterprise value / Revenue
  fcf_yield           numeric,    -- FCF / Market cap * 100 (%)
  dividend_yield      numeric,    -- DPS / Price * 100 (%)

  -- ── Profitability ─────────────────────────────────────────────────────────
  gross_margin        numeric,    -- (%)
  ebitda_margin       numeric,    -- (%)
  operating_margin    numeric,    -- EBIT / Revenue (%)
  net_margin          numeric,    -- PAT / Revenue (%)
  roe                 numeric,    -- PAT / Equity (%)
  roa                 numeric,    -- PAT / Assets (%)
  roce                numeric,    -- EBIT / Capital employed (%)

  -- ── Growth (YoY unless noted) ─────────────────────────────────────────────
  revenue_growth      numeric,    -- (%)
  pat_growth          numeric,    -- (%)
  eps_growth          numeric,    -- (%)
  revenue_cagr_3y     numeric,    -- 3-year compound annual growth rate (%)
  pat_cagr_3y         numeric,    -- 3-year CAGR (%)

  -- ── Balance sheet / Leverage ──────────────────────────────────────────────
  debt_to_equity      numeric,    -- Total debt / Total equity (x)
  net_debt_to_ebitda  numeric,    -- Net debt / EBITDA (x)
  current_ratio       numeric,    -- Current assets / Current liabilities (x)
  interest_cover      numeric,    -- EBIT / Finance cost (x)

  -- ── Cash flow ─────────────────────────────────────────────────────────────
  cfo_to_pat          numeric,    -- Cash conversion: CFO / PAT (x)
  fcf_margin          numeric,    -- FCF / Revenue (%)
  capex_to_revenue    numeric,    -- Capex / Revenue (%)

  -- ── Per share ─────────────────────────────────────────────────────────────
  eps                 numeric,    -- PKR per share
  bvps                numeric,    -- Book value per share (PKR)
  cfps                numeric,    -- Cash flow per share (PKR)
  dps                 numeric,    -- Dividend per share (PKR)
  payout_ratio        numeric,    -- DPS / EPS * 100 (%)

  -- ── Banking sector ratios ─────────────────────────────────────────────────
  nim                 numeric,    -- Net interest margin (%)
  casa_ratio          numeric,    -- CASA ratio (%)
  npl_ratio           numeric,    -- NPL ratio (%)
  coverage_ratio      numeric,    -- Provision coverage (%)
  car                 numeric,    -- Capital adequacy ratio (%)
  cost_to_income      numeric,    -- Cost-to-income ratio (%)

  -- ── Peer comparison context ───────────────────────────────────────────────
  -- Populated by compute-peer-rankings.ts after ratios are computed.
  -- Structure per metric: { rank, percentile, sector_avg, sector_n, best, worst }
  -- Example:
  -- {
  --   "pe_ratio":   { "rank": 2, "percentile": 85, "sector_avg": 7.2, "sector_n": 8 },
  --   "roe":        { "rank": 1, "percentile": 100, "sector_avg": 18.4, "sector_n": 8 },
  --   "net_margin": { "rank": 3, "percentile": 65, "sector_avg": 22.1, "sector_n": 8 }
  -- }
  peer_context        jsonb,
  peer_computed_at    timestamptz,

  computed_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (symbol, period_key, snapshot_date),

  CONSTRAINT frs_period_type_check CHECK (period_type IN (
    'annual', 'half_year', 'quarter', 'ttm', NULL
  ) OR period_type IS NULL)
);

-- Latest snapshot per symbol (for stock detail page)
CREATE INDEX IF NOT EXISTS frs_symbol_snapshot_date_idx
  ON financial_ratio_snapshots (symbol, snapshot_date DESC);

-- Latest snapshot per period for a symbol (for financial history)
CREATE INDEX IF NOT EXISTS frs_symbol_period_idx
  ON financial_ratio_snapshots (symbol, period_key, snapshot_date DESC);

-- Sector comparison queries
CREATE INDEX IF NOT EXISTS frs_snapshot_date_idx
  ON financial_ratio_snapshots (snapshot_date DESC, symbol);

COMMENT ON TABLE financial_ratio_snapshots IS
  'Computed financial ratios with peer comparison context. '
  'Decoupled from financial_metrics — all ratios are derived, not duplicated. '
  'Market-based ratios (PE, PB, FCF yield) are price-dependent so snapshot_date matters. '
  'peer_context JSONB populated by compute-peer-rankings.ts after ratio computation. '
  'Use period_key + snapshot_date for point-in-time valuation analysis.';
