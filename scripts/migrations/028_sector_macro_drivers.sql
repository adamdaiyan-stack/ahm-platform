-- ============================================================
-- Migration 028: sector_macro_drivers
--
-- Stores the macro variable → sector linkage model.
-- Each row describes how one macro driver (interest rates,
-- PKR, oil prices, coal prices, etc.) affects a specific sector.
--
-- Used by:
--   - fn-generate-sector-brief   (AI context assembly)
--   - fn-generate-market-summary (macro landscape section)
--   - Sector FrameworkPages       (structured driver display)
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── direction enum ───────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE macro_impact_direction AS ENUM (
    'positive',   -- Driver currently benefits the sector
    'negative',   -- Driver currently pressures the sector
    'neutral',    -- Driver has no current directional impact
    'mixed'       -- Driver has positive impact on some metrics, negative on others
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── sector_macro_drivers ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sector_macro_drivers (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ── Identity ──────────────────────────────────────────────
  sector_slug         text          NOT NULL,
  -- Matches sectors.slug — the sector this driver affects.
  -- NULL or 'market' = market-wide driver (affects all sectors).

  macro_driver        text          NOT NULL,
  -- Human-readable name: 'interest_rates', 'pkr_depreciation',
  -- 'coal_prices', 'oil_prices', 'gas_prices', 'circular_debt',
  -- 'inflation', 'sbp_policy_rate', 'usd_pkr_rate', etc.

  driver_category     text          NOT NULL DEFAULT 'monetary',
  -- 'monetary'     — SBP rate, PIB yield, KIBOR
  -- 'fx'           — PKR/USD, PKR/EUR
  -- 'commodity'    — Oil, coal, gas, urea feedstock, cotton
  -- 'fiscal'       — Circular debt, PSO, government receivables
  -- 'regulatory'   — SECP, NEPRA, OGRA, PTA decisions
  -- 'demand'       — Inflation, purchasing power, auto affordability
  -- 'global'       — China slowdown, global commodity cycles

  -- ── Relationship description ──────────────────────────────
  relationship        text          NOT NULL,
  -- Describes the causal mechanism. Example:
  --   'Higher policy rates expand NIM on PIBs and T-bills, the dominant
  --    earning asset for large-cap banks. Each 100bps rate cut compresses
  --    sector NII within 1-2 quarters as existing PIBs mature.'

  -- ── Current state ────────────────────────────────────────
  current_direction   macro_impact_direction NOT NULL DEFAULT 'neutral',
  -- The direction of this driver's current effect on the sector.

  impact_magnitude    integer       NOT NULL DEFAULT 3 CHECK (impact_magnitude BETWEEN 1 AND 5),
  -- 1 = marginal  — minor influence, background noise
  -- 2 = moderate  — noticeable but not dominant
  -- 3 = material  — routinely cited in earnings/analyst reports
  -- 4 = high      — directly drives sector profitability
  -- 5 = critical  — existential/single biggest variable for the sector

  impact_description  text          NOT NULL,
  -- One concise sentence on the current impact. Updated as macro changes.
  -- Example: 'SBP rate cuts expected in H1 2025 will compress NIMs
  --           as PIBs re-price at lower yields.'

  -- ── Timing ────────────────────────────────────────────────
  lag_months          integer       NOT NULL DEFAULT 0 CHECK (lag_months >= 0),
  -- How many months before this driver's change flows through to earnings.
  -- 0 = immediate (prices, FX)
  -- 1-2 = short (quarterly earnings drivers)
  -- 3-6 = medium (capacity, contract re-pricing)
  -- 6+ = structural (capex decisions, long-term contracts)

  -- ── Metadata ──────────────────────────────────────────────
  tags                text[]        NOT NULL DEFAULT '{}',
  -- Free-form tags for cross-cutting queries.
  -- Examples: ['rate_sensitive', 'easing_cycle', 'nim_pressure']
  --           ['commodity_cost', 'coal', 'energy_cost']
  --           ['export', 'fx_positive', 'pkr_depreciation']

  -- ── Lifecycle ─────────────────────────────────────────────
  is_active           boolean       NOT NULL DEFAULT true,
  -- Set to false to suppress without deleting. Inactive rows are
  -- excluded from AI context assembly and sector pages.

  -- ── Timestamps ────────────────────────────────────────────
  last_reviewed_at    timestamptz   NOT NULL DEFAULT now(),
  -- When the current_direction and impact_description were last updated.
  -- Flag for review when last_reviewed_at > 30 days ago.

  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────

-- Primary lookup for AI context assembly (most common query)
CREATE INDEX IF NOT EXISTS smd_sector_active_idx
  ON sector_macro_drivers (sector_slug, is_active, impact_magnitude DESC)
  WHERE is_active = true;

-- Cross-sector query by driver name (e.g. "which sectors does oil price affect?")
CREATE INDEX IF NOT EXISTS smd_driver_idx
  ON sector_macro_drivers (macro_driver, is_active)
  WHERE is_active = true;

-- Category filter
CREATE INDEX IF NOT EXISTS smd_category_idx
  ON sector_macro_drivers (driver_category, sector_slug)
  WHERE is_active = true;

-- Uniqueness: one row per (sector, driver) combination
CREATE UNIQUE INDEX IF NOT EXISTS smd_sector_driver_unique_idx
  ON sector_macro_drivers (sector_slug, macro_driver);

-- ── Updated-at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_smd_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS smd_updated_at_trigger ON sector_macro_drivers;
CREATE TRIGGER smd_updated_at_trigger
  BEFORE UPDATE ON sector_macro_drivers
  FOR EACH ROW EXECUTE FUNCTION update_smd_updated_at();

COMMENT ON TABLE sector_macro_drivers IS
  'Macro variable to sector linkage model. '
  'Describes how each macro driver (rates, FX, commodities, circular debt) '
  'affects each PSX sector. Used by AI context assembly and sector pages. '
  'Query active drivers for a sector: '
  'SELECT * FROM sector_macro_drivers WHERE sector_slug = ''banking'' '
  'AND is_active = true ORDER BY impact_magnitude DESC;';
