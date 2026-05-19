/**
 * scripts/utils/ratio-engine.ts
 *
 * Computes all financial ratios from raw financial_metrics values and
 * current market price data. Produces a RatioSnapshot suitable for
 * inserting into financial_ratio_snapshots.
 *
 * All arithmetic is null-safe: if any input is null/undefined/zero
 * where a denominator is required, the ratio returns null.
 *
 * All monetary values expected in PKR millions.
 * All percentages returned as absolute (e.g. 23.4 = 23.4%, not 0.234).
 * All ratios returned as absolute values (e.g. 2.3 = 2.3x).
 */

import type { FinancialMetrics } from "../../types/index.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MarketInputs {
  price:            number | null;
  marketCap:        number | null;   // PKR millions
  sharesOutstanding: number | null;  // millions of shares
}

export interface RatioSnapshot {
  // Market inputs captured
  priceUsed:         number | null;
  marketCapUsed:     number | null;
  sharesOutstanding: number | null;
  enterpriseValue:   number | null;

  // Valuation
  peRatio:     number | null;
  pbRatio:     number | null;
  evEbitda:    number | null;
  psRatio:     number | null;
  evRevenue:   number | null;
  fcfYield:    number | null;
  dividendYield: number | null;

  // Profitability
  grossMargin:     number | null;
  ebitdaMargin:    number | null;
  operatingMargin: number | null;
  netMargin:       number | null;
  roe:             number | null;
  roa:             number | null;
  roce:            number | null;

  // Growth (YoY vs prior)
  revenueGrowth: number | null;
  patGrowth:     number | null;
  epsGrowth:     number | null;

  // Balance sheet / Leverage
  debtToEquity:    number | null;
  netDebtToEbitda: number | null;
  currentRatio:    number | null;
  interestCover:   number | null;

  // Cash flow
  cfoToPat:       number | null;
  fcfMargin:      number | null;
  capexToRevenue: number | null;

  // Per share
  eps:         number | null;
  bvps:        number | null;
  cfps:        number | null;
  dps:         number | null;
  payoutRatio: number | null;

  // Banking
  nim:           number | null;
  casaRatio:     number | null;
  nplRatio:      number | null;
  coverageRatio: number | null;
  car:           number | null;
  costToIncome:  number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safe division — returns null if denominator is null, undefined, or zero. */
function div(
  numerator:   number | null | undefined,
  denominator: number | null | undefined,
): number | null {
  if (numerator == null || denominator == null || denominator === 0) return null;
  return numerator / denominator;
}

/** Round to N decimal places. Returns null if value is null. */
function round(value: number | null | undefined, places = 2): number | null {
  if (value == null) return null;
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}

/** Percentage: numerator / denominator * 100, rounded to 2dp. */
function pct(
  numerator:   number | null | undefined,
  denominator: number | null | undefined,
): number | null {
  const r = div(numerator, denominator);
  return r == null ? null : round(r * 100);
}

/** YoY growth %: (current - prior) / |prior| * 100. */
function yoyGrowth(
  current: number | null | undefined,
  prior:   number | null | undefined,
): number | null {
  if (current == null || prior == null || prior === 0) return null;
  return round(((current - prior) / Math.abs(prior)) * 100);
}

// ─── Main ratio computation ───────────────────────────────────────────────────

/**
 * Compute all ratios for a financial period.
 *
 * @param metrics  - financial_metrics row for the period
 * @param market   - Current market inputs (price, market cap, shares)
 * @param prior    - Prior year financial_metrics (for growth ratios). Optional.
 */
export function computeRatios(
  metrics: Partial<FinancialMetrics>,
  market:  MarketInputs,
  prior?:  Partial<FinancialMetrics> | null,
): RatioSnapshot {

  // ── Resolve shares outstanding ──────────────────────────────────────────────
  const shares = (metrics.shares_outstanding ?? null) || market.sharesOutstanding;

  // ── Enterprise value ────────────────────────────────────────────────────────
  // EV = Market cap + Net debt
  // Net debt = Total debt - Cash
  const netDebt = metrics.net_debt
    ?? (metrics.total_debt != null && metrics.cash_and_equivalents != null
        ? metrics.total_debt - metrics.cash_and_equivalents
        : null);
  const ev = market.marketCap != null && netDebt != null
    ? market.marketCap + netDebt
    : market.marketCap ?? null;

  // ── Per-share denominators ───────────────────────────────────────────────────
  const epsVal  = metrics.eps ?? div(metrics.pat, shares);
  const bvpsVal = metrics.bvps ?? div(metrics.total_equity, shares);
  const cfpsVal = metrics.cfps ?? div(metrics.cfo, shares);

  // ── FCF ──────────────────────────────────────────────────────────────────────
  const fcf = metrics.fcf
    ?? (metrics.cfo != null && metrics.capex != null
        ? metrics.cfo - Math.abs(metrics.capex)
        : null);

  // ── EBIT for leverage / coverage ────────────────────────────────────────────
  const ebit = metrics.operating_profit ?? metrics.ebit ?? null;

  // ── Capital employed (for ROCE) ─────────────────────────────────────────────
  const capitalEmployed = metrics.total_assets != null && metrics.current_liabilities != null
    ? metrics.total_assets - metrics.current_liabilities
    : null;

  // ── Valuation ───────────────────────────────────────────────────────────────
  const peRatio = round(div(market.price, epsVal));
  const pbRatio = round(div(market.price, bvpsVal));
  const evEbitda = round(div(ev, metrics.ebitda));
  const psRatio  = round(div(market.marketCap, metrics.revenue));
  const evRevenue = round(div(ev, metrics.revenue));
  const fcfYield = pct(fcf, market.marketCap);
  const dividendYield = market.price && metrics.dps
    ? round((metrics.dps / market.price) * 100)
    : null;

  // ── Profitability ───────────────────────────────────────────────────────────
  const grossMargin     = pct(metrics.gross_profit, metrics.revenue);
  const ebitdaMargin    = pct(metrics.ebitda, metrics.revenue);
  const operatingMargin = pct(ebit ?? metrics.operating_profit, metrics.revenue);
  const netMargin       = pct(metrics.pat, metrics.revenue);
  const roe             = pct(metrics.pat, metrics.total_equity);
  const roa             = pct(metrics.pat, metrics.total_assets);
  const roce            = pct(ebit, capitalEmployed);

  // ── Growth ──────────────────────────────────────────────────────────────────
  const revenueGrowth = yoyGrowth(metrics.revenue, prior?.revenue);
  const patGrowth     = yoyGrowth(metrics.pat, prior?.pat);
  const epsGrowth     = yoyGrowth(epsVal, prior?.eps ?? div(prior?.pat, shares));

  // ── Leverage ────────────────────────────────────────────────────────────────
  const debtToEquity    = round(div(metrics.total_debt, metrics.total_equity));
  const netDebtToEbitda = round(div(netDebt, metrics.ebitda));
  const currentRatio    = round(div(metrics.current_assets, metrics.current_liabilities));
  const interestCover   = round(div(ebit, metrics.finance_cost));

  // ── Cash flow ───────────────────────────────────────────────────────────────
  const cfoToPat       = round(div(metrics.cfo, metrics.pat));
  const fcfMargin      = pct(fcf, metrics.revenue);
  const capexToRevenue = pct(
    metrics.capex != null ? Math.abs(metrics.capex) : null,
    metrics.revenue,
  );

  // ── Per share ───────────────────────────────────────────────────────────────
  const payoutRatio = pct(metrics.dps, epsVal);

  // ── Banking ─────────────────────────────────────────────────────────────────
  const nim          = metrics.nim          ?? null;
  const casaRatio    = metrics.casa_ratio   ?? null;
  const nplRatio     = metrics.npl_ratio    ?? null;
  const coverageRatio = metrics.coverage_ratio ?? null;
  const car          = metrics.car          ?? null;
  const costToIncome = metrics.cost_to_income ?? null;

  return {
    priceUsed:         market.price,
    marketCapUsed:     market.marketCap,
    sharesOutstanding: shares,
    enterpriseValue:   round(ev),
    peRatio,
    pbRatio,
    evEbitda,
    psRatio,
    evRevenue,
    fcfYield,
    dividendYield,
    grossMargin,
    ebitdaMargin,
    operatingMargin,
    netMargin,
    roe,
    roa,
    roce,
    revenueGrowth,
    patGrowth,
    epsGrowth,
    debtToEquity,
    netDebtToEbitda,
    currentRatio,
    interestCover,
    cfoToPat,
    fcfMargin,
    capexToRevenue,
    eps:          round(epsVal),
    bvps:         round(bvpsVal),
    cfps:         round(cfpsVal),
    dps:          metrics.dps ?? null,
    payoutRatio,
    nim,
    casaRatio,
    nplRatio,
    coverageRatio,
    car,
    costToIncome,
  };
}

/**
 * Compute 3-year CAGR: (end / start)^(1/3) - 1, expressed as %.
 * Returns null if either value is null or non-positive.
 */
export function computeCAGR3Y(
  currentValue: number | null | undefined,
  threeYearsAgo: number | null | undefined,
): number | null {
  if (currentValue == null || threeYearsAgo == null) return null;
  if (threeYearsAgo <= 0 || currentValue <= 0) return null;
  const cagr = Math.pow(currentValue / threeYearsAgo, 1 / 3) - 1;
  return round(cagr * 100);
}

/**
 * Map a RatioSnapshot to the financial_ratio_snapshots DB columns object.
 */
export function ratioSnapshotToDbRow(
  symbol:      string,
  periodKey:   string,
  periodType:  string | null,
  snapshotDate: string,
  isTtm:       boolean,
  ratios:      RatioSnapshot,
): Record<string, unknown> {
  return {
    symbol,
    period_key:         periodKey,
    period_type:        periodType,
    snapshot_date:      snapshotDate,
    is_ttm:             isTtm,
    price_used:         ratios.priceUsed,
    market_cap_used:    ratios.marketCapUsed,
    shares_outstanding: ratios.sharesOutstanding,
    enterprise_value:   ratios.enterpriseValue,
    pe_ratio:           ratios.peRatio,
    pb_ratio:           ratios.pbRatio,
    ev_ebitda:          ratios.evEbitda,
    ps_ratio:           ratios.psRatio,
    ev_revenue:         ratios.evRevenue,
    fcf_yield:          ratios.fcfYield,
    dividend_yield:     ratios.dividendYield,
    gross_margin:       ratios.grossMargin,
    ebitda_margin:      ratios.ebitdaMargin,
    operating_margin:   ratios.operatingMargin,
    net_margin:         ratios.netMargin,
    roe:                ratios.roe,
    roa:                ratios.roa,
    roce:               ratios.roce,
    revenue_growth:     ratios.revenueGrowth,
    pat_growth:         ratios.patGrowth,
    eps_growth:         ratios.epsGrowth,
    debt_to_equity:     ratios.debtToEquity,
    net_debt_to_ebitda: ratios.netDebtToEbitda,
    current_ratio:      ratios.currentRatio,
    interest_cover:     ratios.interestCover,
    cfo_to_pat:         ratios.cfoToPat,
    fcf_margin:         ratios.fcfMargin,
    capex_to_revenue:   ratios.capexToRevenue,
    eps:                ratios.eps,
    bvps:               ratios.bvps,
    cfps:               ratios.cfps,
    dps:                ratios.dps,
    payout_ratio:       ratios.payoutRatio,
    nim:                ratios.nim,
    casa_ratio:         ratios.casaRatio,
    npl_ratio:          ratios.nplRatio,
    coverage_ratio:     ratios.coverageRatio,
    car:                ratios.car,
    cost_to_income:     ratios.costToIncome,
    computed_at:        new Date().toISOString(),
  };
}
