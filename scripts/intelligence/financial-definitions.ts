/**
 * scripts/intelligence/financial-definitions.ts
 *
 * AHM Financial Definitions Layer — v1.0.0
 *
 * CANONICAL formula definitions for all financial ratios used across the platform.
 * ALL ratio computations must reference these definitions.
 * LLMs must never compute ratios — this layer is the single source of truth.
 *
 * Unit standards:
 *   All financial statement inputs: PKR millions
 *   All per-share metrics: PKR per share
 *   All ratios: unitless (unless annotated %)
 *   All percentages: expressed as 0–100 (not 0–1)
 *   Price: PKR per share (absolute)
 *   Market cap: PKR millions (= shares_millions × price)
 */

// ─── Input Types ──────────────────────────────────────────────────────────────

/** Raw financial statement inputs — all PKR millions unless noted */
export interface FinancialStatementInputs {
  // Identity
  symbol:       string;
  period_key:   string;   // e.g. "FY24", "FY23", "9MFY25"
  period_type:  'annual' | 'half_year' | 'quarter' | 'ttm';
  period_end:   string;   // ISO date of period end e.g. "2024-06-30"
  is_ttm:       boolean;

  // Market data (at snapshot date)
  price:        number;   // PKR per share
  snapshot_date: string;  // ISO date when price was observed

  // Shares (millions)
  shares_outstanding: number;  // actual float in millions — NOT back-calculated

  // Income Statement (PKR millions)
  revenue:          number;
  gross_profit:     number | null;
  ebitda:           number | null;
  ebit:             number | null;   // operating profit
  interest_expense: number | null;
  pat:              number;           // profit after tax
  eps:              number;           // PKR per share — from company filings

  // Balance Sheet (PKR millions)
  total_assets:     number;
  total_equity:     number;          // shareholders' equity (book value)
  total_debt:       number | null;   // interest-bearing debt only
  cash_equivalents: number | null;
  current_assets:   number | null;
  current_liabilities: number | null;

  // Cash Flow (PKR millions)
  cfo:   number | null;   // cash from operations
  capex: number | null;   // capital expenditure (positive number)

  // Dividends
  dps: number | null;     // PKR per share

  // Prior period (for growth computation)
  prev_revenue:  number | null;
  prev_pat:      number | null;
  prev_eps:      number | null;

  // 3Y prior (for CAGR — FY21 if current is FY24)
  revenue_3y_ago: number | null;
  pat_3y_ago:     number | null;
  eps_3y_ago:     number | null;

  // Banking-specific (PKR millions unless noted)
  net_interest_income:  number | null;
  total_deposits:       number | null;
  casa_deposits:        number | null;   // current + savings
  gross_loans:          number | null;
  non_performing_loans: number | null;
  loan_loss_provisions: number | null;
  tier1_capital:        number | null;
  risk_weighted_assets: number | null;
  total_income_banking: number | null;   // NII + non-interest income
  operating_expenses:   number | null;

  // E&P-specific
  production_boepd:        number | null;  // barrels of oil equivalent per day
  reserves_mmboe:          number | null;  // proven + probable reserves
  prev_production_boepd:   number | null;

  // Power/IPP-specific
  installed_capacity_mw:   number | null;
  receivables:             number | null;  // PKR millions
}

// ─── Output Type ─────────────────────────────────────────────────────────────

/** Computed ratios — all unitless unless annotated */
export interface ComputedRatios {
  // Market data
  market_cap:       number;   // PKR millions
  enterprise_value: number | null;  // PKR millions

  // Valuation
  pe_ratio:         number | null;
  pb_ratio:         number | null;   // price / BVPS = mktcap / total_equity
  ev_ebitda:        number | null;
  ps_ratio:         number | null;
  ev_revenue:       number | null;
  fcf_yield:        number | null;   // %
  dividend_yield:   number | null;   // %

  // Per-share
  bvps:  number | null;   // PKR
  cfps:  number | null;   // PKR

  // Profitability
  gross_margin:     number | null;   // %
  ebitda_margin:    number | null;   // %
  operating_margin: number | null;   // %
  net_margin:       number;          // %
  roe:              number | null;   // %  (PAT / avg_equity — uses period-end equity as proxy)
  roa:              number | null;   // %
  roce:             number | null;   // %

  // Growth (YoY %)
  revenue_growth:  number | null;
  pat_growth:      number | null;
  eps_growth:      number | null;

  // 3Y CAGRs (%)
  revenue_cagr_3y: number | null;
  pat_cagr_3y:     number | null;

  // Balance sheet
  debt_to_equity:    number | null;
  net_debt_to_ebitda: number | null;
  current_ratio:     number | null;
  interest_cover:    number | null;  // EBIT / interest_expense

  // Cash flow
  cfo_to_pat:      number | null;
  fcf_margin:      number | null;   // %
  capex_to_revenue: number | null;  // %
  payout_ratio:    number | null;   // %

  // Banking-specific
  nim:            number | null;   // %  net interest margin
  casa_ratio:     number | null;   // %
  npl_ratio:      number | null;   // %
  coverage_ratio: number | null;   // %
  car:            number | null;   // %  capital adequacy ratio
  cost_to_income: number | null;   // %

  // E&P-specific
  reserve_life:        number | null;  // years
  production_growth:   number | null;  // %

  // Power-specific
  receivables_to_revenue: number | null;  // %
}

// ─── Canonical Formula Definitions (documentation) ───────────────────────────

/**
 * AHM CANONICAL FORMULA REFERENCE
 * =================================
 * These formulas are the institutional standard for this platform.
 * Any deviation requires explicit approval and versioning.
 *
 * VALUATION
 *   PE           = price / EPS
 *                  (use TTM EPS where available; latest annual otherwise)
 *   PBV          = market_cap / total_equity
 *                  (NOT price / bvps — avoids share-count errors)
 *                  (for banks: total_equity = shareholders' equity per balance sheet)
 *   EV/EBITDA    = enterprise_value / EBITDA
 *                  enterprise_value = market_cap + total_debt - cash
 *                  (for banks: EV/EBITDA not computed — not meaningful)
 *   P/S          = market_cap / revenue
 *   FCF yield    = (CFO - capex) / market_cap × 100
 *   Div yield    = DPS / price × 100
 *
 * PROFITABILITY
 *   Gross margin  = gross_profit / revenue × 100
 *   EBITDA margin = EBITDA / revenue × 100
 *   Op margin     = EBIT / revenue × 100
 *   Net margin    = PAT / revenue × 100
 *   ROE           = PAT / total_equity × 100   (period-end equity)
 *   ROA           = PAT / total_assets × 100
 *   ROCE          = EBIT / (total_assets - current_liabilities) × 100
 *
 * GROWTH
 *   YoY growth   = (current - prior) / |prior| × 100
 *                  (absolute denominator to handle sign changes correctly)
 *   3Y CAGR      = (current / value_3y_ago)^(1/3) - 1 × 100
 *                  (only computed if both endpoints are positive)
 *
 * BALANCE SHEET
 *   D/E          = total_debt / total_equity
 *                  (for banks: not applicable — use CAR instead)
 *   Net debt/EBITDA = (total_debt - cash) / EBITDA
 *   Current ratio  = current_assets / current_liabilities
 *   Interest cover = EBIT / interest_expense
 *
 * CASH FLOW
 *   CFO/PAT      = CFO / PAT
 *   FCF margin   = (CFO - capex) / revenue × 100
 *   Capex/rev    = capex / revenue × 100
 *   Payout ratio = (DPS × shares) / PAT × 100
 *
 * BANKING
 *   NIM          = net_interest_income / avg_earning_assets × 100
 *                  (proxy: net_interest_income / total_assets × 100 if avg not available)
 *   CASA ratio   = casa_deposits / total_deposits × 100
 *   NPL ratio    = non_performing_loans / gross_loans × 100
 *   Coverage     = loan_loss_provisions / non_performing_loans × 100
 *   CAR          = tier1_capital / risk_weighted_assets × 100
 *   Cost/income  = operating_expenses / total_income_banking × 100
 *
 * E&P
 *   Reserve life = reserves_mmboe / (production_boepd × 365 / 1_000_000)
 *   Prod growth  = (current_prod - prev_prod) / prev_prod × 100
 */

// ─── Validation Thresholds ────────────────────────────────────────────────────

/** Outlier detection thresholds — ratios outside these are flagged as suspicious */
export const RATIO_BOUNDS = {
  pe_ratio:         { min: 0,    max: 200  },
  pb_ratio:         { min: 0,    max: 30   },
  ev_ebitda:        { min: 0,    max: 60   },
  ps_ratio:         { min: 0,    max: 50   },
  fcf_yield:        { min: -50,  max: 100  },
  dividend_yield:   { min: 0,    max: 50   },
  net_margin:       { min: -100, max: 100  },
  roe:              { min: -100, max: 200  },
  roa:              { min: -50,  max: 50   },
  debt_to_equity:   { min: 0,    max: 20   },
  interest_cover:   { min: -20,  max: 200  },
  nim:              { min: 0,    max: 20   },
  casa_ratio:       { min: 0,    max: 100  },
  npl_ratio:        { min: 0,    max: 50   },
  car:              { min: 0,    max: 50   },
  cost_to_income:   { min: 0,    max: 150  },
} as const;

/** Sectors where D/E ratio is not applicable */
export const SECTORS_WITHOUT_DE = new Set(['Banking', 'Insurance']);

/** Sectors where EV/EBITDA is not applicable */
export const SECTORS_WITHOUT_EV_EBITDA = new Set(['Banking', 'Insurance']);

/** Required inputs — missing any of these produces an incomplete snapshot */
export const REQUIRED_INPUTS: (keyof FinancialStatementInputs)[] = [
  'symbol', 'period_key', 'period_type', 'period_end', 'snapshot_date',
  'price', 'shares_outstanding', 'revenue', 'pat', 'eps',
  'total_assets', 'total_equity',
];

export const SCORING_ENGINE_DEFINITIONS_VERSION = '1.0.0';
