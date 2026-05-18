-- ============================================================
-- Migration 005: macro_indicators + sector_macro_linkages
-- Structured time-series macro data and sector sensitivity map.
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── macro_indicators ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS macro_indicators (
  id              serial      PRIMARY KEY,
  indicator       text        NOT NULL,
  -- Monetary:    SBP_POLICY_RATE, KIBOR_1W, KIBOR_1M, KIBOR_3M, KIBOR_6M, KIBOR_1Y
  -- Inflation:   CPI_YOY_PCT, CPI_MOM_PCT, FOOD_INFLATION_YOY_PCT
  -- Currency:    PKR_USD, PKR_SAR, PKR_AED, PKR_GBP, PKR_EUR
  -- Reserves:    SBP_RESERVES_USD_BN, TOTAL_RESERVES_USD_BN
  -- Flows:       FIPI_NET_PKR_MN, LIPI_NET_PKR_MN, FIPI_CUMULATIVE_PKR_MN
  -- Commodities: COAL_USD_TON, LNG_SPOT_USD_MMBTU, CRUDE_BRENT_USD_BBL,
  --              CRUDE_WTI_USD_BBL, UREA_INT_USD_TON, DAP_INT_USD_TON,
  --              COTTON_USD_POUND
  -- Sector vol:  CEMENT_DISPATCHES_KT, AUTO_SALES_UNITS, TRACTOR_SALES_UNITS,
  --              FERTILISER_OFFTAKE_KT

  category        text        NOT NULL,
  -- 'monetary' | 'inflation' | 'currency' | 'reserves'
  -- | 'flows' | 'commodities' | 'sector_volume'

  label           text        NOT NULL,        -- Human-readable: 'SBP Policy Rate (%)'
  reading_date    date        NOT NULL,
  value           numeric     NOT NULL,
  unit            text        NOT NULL,
  -- 'percent' | 'pkr_per_usd' | 'usd_per_barrel' | 'usd_per_ton'
  -- | 'pkr_million' | 'pkr_billion' | 'kilo_tonnes' | 'units'

  frequency       text        NOT NULL DEFAULT 'monthly',
  -- 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'adhoc'

  is_estimate     boolean     DEFAULT false,   -- True for forward guidance or projections
  confidence_score numeric    DEFAULT 1.0,     -- 0.0 to 1.0: 1.0 = official source
  source          text        NOT NULL,        -- 'sbp' | 'pbs' | 'pama' | 'apcma' | 'manual'
  source_url      text,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  UNIQUE (indicator, reading_date)
);

CREATE INDEX IF NOT EXISTS macro_indicators_indicator_date_idx
  ON macro_indicators (indicator, reading_date DESC);

CREATE INDEX IF NOT EXISTS macro_indicators_category_date_idx
  ON macro_indicators (category, reading_date DESC);

-- ── sector_macro_linkages ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sector_macro_linkages (
  id                    serial  PRIMARY KEY,
  sector_slug           text    NOT NULL REFERENCES sectors(slug),
  indicator             text    NOT NULL,      -- Must match macro_indicators.indicator
  sensitivity_direction text    NOT NULL,
  -- 'positive'  → higher indicator value = sector tailwind
  -- 'negative'  → higher indicator value = sector headwind
  -- 'complex'   → non-linear (e.g. moderate rates good, extreme rates bad)
  sensitivity_strength  text    NOT NULL DEFAULT 'medium',
  -- 'high' | 'medium' | 'low'
  explanation           text    NOT NULL,      -- Used by AI for narrative context
  created_at            timestamptz DEFAULT now(),

  UNIQUE (sector_slug, indicator),
  CONSTRAINT sml_direction_check CHECK (
    sensitivity_direction IN ('positive', 'negative', 'complex')
  ),
  CONSTRAINT sml_strength_check CHECK (
    sensitivity_strength IN ('high', 'medium', 'low')
  )
);

-- ── Seed: core sector-macro linkages ──────────────────────────────────────────
-- Run only if rows don't already exist (idempotent via ON CONFLICT DO NOTHING)

INSERT INTO sector_macro_linkages
  (sector_slug, indicator, sensitivity_direction, sensitivity_strength, explanation)
VALUES
  -- Banking
  ('banking', 'SBP_POLICY_RATE',   'complex', 'high',
   'High rates boost NII via GS yields but compress NIM on the way down. Conventional banks hurt more than Islamic during easing.'),
  ('banking', 'KIBOR_3M',          'positive', 'high',
   'KIBOR determines yield on short-duration T-Bills. Rising KIBOR = higher investment income for banks.'),
  ('banking', 'CPI_YOY_PCT',       'complex', 'medium',
   'High inflation erodes real deposit base but can support nominal NII. Extreme inflation triggers SBP tightening which hurts credit.'),
  ('banking', 'PKR_USD',           'positive', 'medium',
   'PKR weakness creates FX translation gains on USD-denominated foreign assets and international operations.'),
  -- Cement
  ('cement',  'COAL_USD_TON',      'negative', 'high',
   'Coal is ~35-40% of cement variable production cost. Coal price spikes compress margins directly.'),
  ('cement',  'PKR_USD',           'negative', 'medium',
   'Imported coal priced in USD. PKR depreciation raises effective coal cost in PKR terms.'),
  ('cement',  'SBP_POLICY_RATE',   'negative', 'medium',
   'High rates depress construction activity and housing demand, reducing cement offtake.'),
  -- Oil & Gas
  ('oil-gas', 'CRUDE_BRENT_USD_BBL','positive','high',
   'Wellhead prices for OGDC, PPL, POL, and MARI are formula-linked to international crude. Higher Brent = higher revenue.'),
  ('oil-gas', 'PKR_USD',           'positive', 'high',
   'E&P revenues are USD-denominated. PKR depreciation inflates PKR revenue and PAT.'),
  ('oil-gas', 'SBP_POLICY_RATE',   'negative', 'low',
   'High rates increase cost of project finance for upstream capex. Effect is indirect and lagged.'),
  -- Fertiliser
  ('fertiliser','SBP_POLICY_RATE', 'negative', 'medium',
   'Farmer credit costs rise with rates, dampening fertiliser demand. Offtake correlates with credit availability.'),
  ('fertiliser','UREA_INT_USD_TON','complex',  'medium',
   'International urea prices benchmark domestic price support levels. Strongly regulated by GoP.'),
  -- Power / IPP
  ('power',   'PKR_USD',           'negative', 'high',
   'Capacity payments are USD-indexed. PKR weakness directly increases circular debt burden denominated in PKR.'),
  ('power',   'SBP_POLICY_RATE',   'negative', 'medium',
   'IPP debt is floating-rate. Higher KIBOR raises finance cost, reducing distributable earnings.'),
  -- Textiles
  ('textiles','PKR_USD',           'positive', 'medium',
   'Export-oriented textile mills benefit from PKR depreciation as USD export revenue converts to more PKR.'),
  ('textiles','COTTON_USD_POUND',  'negative', 'high',
   'Raw cotton is primary input. Rising cotton prices compress yarn and fabric margins.'),
  -- Automobile
  ('auto',    'SBP_POLICY_RATE',   'negative', 'high',
   'Auto financing costs rise with rates. Consumer auto demand is highly rate-sensitive.'),
  ('auto',    'PKR_USD',           'negative', 'high',
   'CKD import costs rise with PKR weakness. Assemblers pass on cost via price hikes, dampening volume.')
ON CONFLICT (sector_slug, indicator) DO NOTHING;

-- ── View: latest macro reading per indicator ──────────────────────────────────

CREATE OR REPLACE VIEW macro_latest AS
SELECT DISTINCT ON (indicator)
  indicator,
  category,
  label,
  reading_date,
  value,
  unit,
  is_estimate,
  confidence_score,
  source
FROM macro_indicators
ORDER BY indicator, reading_date DESC;

COMMENT ON VIEW macro_latest IS
  'Latest reading per macro indicator. Primary feed for AI context assembly and sector dashboards.';
