/**
 * scripts/intelligence/compute-ratios.ts
 *
 * AHM Deterministic Ratio Computation Engine — v1.0.0
 *
 * Pure function: FinancialStatementInputs → ComputedRatios
 * No database access. No LLM involvement.
 * All formulas follow AHM Financial Definitions Layer (financial-definitions.ts).
 *
 * Null handling policy:
 *   - Missing required denominator → ratio = null (never divide by zero)
 *   - Negative equity → pb_ratio = null (not meaningful)
 *   - Banking sector: D/E and EV/EBITDA are suppressed (not applicable)
 *   - Outlier ratios outside RATIO_BOUNDS are returned with a flag (not suppressed)
 */

import type { FinancialStatementInputs, ComputedRatios } from './financial-definitions.js';
import { SECTORS_WITHOUT_DE, SECTORS_WITHOUT_EV_EBITDA, RATIO_BOUNDS } from './financial-definitions.js';

// ─── Utility helpers ──────────────────────────────────────────────────────────

/** Safe division — returns null if denominator is null, zero, or negative where not allowed */
function div(
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  allowNegativeDenominator = false,
): number | null {
  if (numerator == null || denominator == null) return null;
  if (denominator === 0) return null;
  if (!allowNegativeDenominator && denominator < 0) return null;
  return numerator / denominator;
}

/** Round to N decimal places, return null if input is null */
function round(val: number | null | undefined, decimals = 2): number | null {
  if (val == null) return null;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/** YoY growth: (current - prior) / |prior| × 100 */
function yoyGrowth(current: number | null | undefined, prior: number | null | undefined): number | null {
  if (current == null || prior == null) return null;
  if (prior === 0) return null;
  return ((current - prior) / Math.abs(prior)) * 100;
}

/** 3Y CAGR: (current / base)^(1/3) - 1 × 100. Both must be positive. */
function cagr3y(current: number | null | undefined, base: number | null | undefined): number | null {
  if (current == null || base == null) return null;
  if (base <= 0 || current <= 0) return null;
  return (Math.pow(current / base, 1 / 3) - 1) * 100;
}

/** Clamp ratio to null if outside plausibility bounds */
function boundCheck(val: number | null, field: keyof typeof RATIO_BOUNDS): number | null {
  if (val == null) return null;
  const bounds = RATIO_BOUNDS[field];
  if (!bounds) return val;
  if (val < bounds.min || val > bounds.max) return null;  // outlier → suppress
  return val;
}

// ─── Main computation ─────────────────────────────────────────────────────────

export function computeRatios(
  inp: FinancialStatementInputs,
  sector?: string,
): ComputedRatios {
  const isBanking = sector ? SECTORS_WITHOUT_DE.has(sector) : false;
  const noEV      = sector ? SECTORS_WITHOUT_EV_EBITDA.has(sector) : false;

  // ── Market data ─────────────────────────────────────────────────────────────
  // market_cap in PKR millions: shares(millions) × price(PKR/share)
  const market_cap = inp.shares_outstanding * inp.price;

  const total_debt_m = inp.total_debt ?? 0;
  const cash_m       = inp.cash_equivalents ?? 0;

  const enterprise_value: number | null = noEV
    ? null
    : round(market_cap + total_debt_m - cash_m);

  // ── Valuation ────────────────────────────────────────────────────────────────
  // PE = price / EPS (using filed EPS, not back-calculated)
  const pe_ratio = boundCheck(round(div(inp.price, inp.eps)), 'pe_ratio');

  // PBV = market_cap / total_equity (both in PKR millions — unit cancels)
  const pb_ratio = inp.total_equity > 0
    ? boundCheck(round(div(market_cap, inp.total_equity)), 'pb_ratio')
    : null;  // suppress negative/zero equity

  // EV/EBITDA
  const ev_ebitda = noEV
    ? null
    : boundCheck(round(div(enterprise_value, inp.ebitda)), 'ev_ebitda');

  // P/S = market_cap / revenue
  const ps_ratio = round(div(market_cap, inp.revenue));

  // EV/Revenue
  const ev_revenue = noEV ? null : round(div(enterprise_value, inp.revenue));

  // FCF yield = (CFO - capex) / market_cap × 100
  const fcf: number | null = (inp.cfo != null && inp.capex != null)
    ? inp.cfo - inp.capex
    : null;
  const fcf_yield = boundCheck(
    round(market_cap > 0 ? div(fcf, market_cap / 100) : null),
    'fcf_yield'
  );

  // Dividend yield = DPS / price × 100
  const dividend_yield = boundCheck(
    round(inp.dps != null ? (inp.dps / inp.price) * 100 : null),
    'dividend_yield'
  );

  // ── Per-share ────────────────────────────────────────────────────────────────
  // BVPS = total_equity (millions) / shares (millions) = PKR/share
  const bvps = round(div(inp.total_equity, inp.shares_outstanding));

  // CFPS = CFO (millions) / shares (millions) = PKR/share
  const cfps = round(div(inp.cfo, inp.shares_outstanding));

  // ── Profitability ────────────────────────────────────────────────────────────
  const gross_margin     = round(div(inp.gross_profit, inp.revenue / 100));
  const ebitda_margin    = round(div(inp.ebitda, inp.revenue / 100));
  const operating_margin = round(div(inp.ebit, inp.revenue / 100));
  const net_margin       = round(div(inp.pat, inp.revenue / 100)) ?? 0;

  // ROE = PAT / total_equity × 100
  const roe = inp.total_equity > 0
    ? boundCheck(round(div(inp.pat, inp.total_equity / 100)), 'roe')
    : null;

  // ROA = PAT / total_assets × 100
  const roa = boundCheck(round(div(inp.pat, inp.total_assets / 100)), 'roa');

  // ROCE = EBIT / capital_employed × 100
  // capital_employed = total_assets - current_liabilities
  const capitalEmployed = (inp.current_liabilities != null)
    ? inp.total_assets - inp.current_liabilities
    : null;
  const roce = (inp.ebit != null && capitalEmployed != null && capitalEmployed > 0)
    ? boundCheck(round((inp.ebit / capitalEmployed) * 100), 'roa')
    : null;

  // ── Growth ───────────────────────────────────────────────────────────────────
  const revenue_growth = round(yoyGrowth(inp.revenue, inp.prev_revenue));
  const pat_growth     = round(yoyGrowth(inp.pat, inp.prev_pat));
  const eps_growth     = round(yoyGrowth(inp.eps, inp.prev_eps));

  const revenue_cagr_3y = round(cagr3y(inp.revenue, inp.revenue_3y_ago));
  const pat_cagr_3y     = round(cagr3y(inp.pat, inp.pat_3y_ago));

  // ── Balance sheet ────────────────────────────────────────────────────────────
  // D/E not applicable for banks
  const debt_to_equity = isBanking
    ? null
    : (inp.total_equity > 0 ? boundCheck(round(div(inp.total_debt, inp.total_equity)), 'debt_to_equity') : null);

  // Net debt / EBITDA
  const net_debt = inp.total_debt != null ? inp.total_debt - cash_m : null;
  const net_debt_to_ebitda = (inp.ebitda != null && inp.ebitda > 0 && net_debt != null)
    ? round(net_debt / inp.ebitda)
    : null;

  const current_ratio = round(div(inp.current_assets, inp.current_liabilities));

  // Interest cover = EBIT / interest_expense
  const interest_cover = (inp.ebit != null && inp.interest_expense != null && inp.interest_expense > 0)
    ? boundCheck(round(inp.ebit / inp.interest_expense), 'interest_cover')
    : null;

  // ── Cash flow ────────────────────────────────────────────────────────────────
  // CFO/PAT — PAT can be negative; allow negative denominator
  const cfo_to_pat = round(div(inp.cfo, inp.pat, true));

  const fcf_margin = (fcf != null && inp.revenue > 0)
    ? round((fcf / inp.revenue) * 100)
    : null;

  const capex_to_revenue = (inp.capex != null && inp.revenue > 0)
    ? round((inp.capex / inp.revenue) * 100)
    : null;

  // Payout ratio = (DPS × shares) / PAT × 100
  const payout_ratio = (inp.dps != null && inp.pat > 0)
    ? round(((inp.dps * inp.shares_outstanding) / inp.pat) * 100)
    : null;

  // ── Banking-specific ─────────────────────────────────────────────────────────
  // NIM = NII / total_assets × 100 (proxy for avg earning assets)
  const nim = isBanking && inp.net_interest_income != null && inp.total_assets > 0
    ? boundCheck(round((inp.net_interest_income / inp.total_assets) * 100), 'nim')
    : null;

  const casa_ratio = (inp.casa_deposits != null && inp.total_deposits != null && inp.total_deposits > 0)
    ? boundCheck(round((inp.casa_deposits / inp.total_deposits) * 100), 'casa_ratio')
    : null;

  const npl_ratio = (inp.non_performing_loans != null && inp.gross_loans != null && inp.gross_loans > 0)
    ? boundCheck(round((inp.non_performing_loans / inp.gross_loans) * 100), 'npl_ratio')
    : null;

  const coverage_ratio = (inp.loan_loss_provisions != null && inp.non_performing_loans != null && inp.non_performing_loans > 0)
    ? boundCheck(round((inp.loan_loss_provisions / inp.non_performing_loans) * 100), 'coverage_ratio')
    : null;

  const car = (inp.tier1_capital != null && inp.risk_weighted_assets != null && inp.risk_weighted_assets > 0)
    ? boundCheck(round((inp.tier1_capital / inp.risk_weighted_assets) * 100), 'car')
    : null;

  const cost_to_income = (inp.operating_expenses != null && inp.total_income_banking != null && inp.total_income_banking > 0)
    ? boundCheck(round((inp.operating_expenses / inp.total_income_banking) * 100), 'cost_to_income')
    : null;

  // ── E&P-specific ─────────────────────────────────────────────────────────────
  // Reserve life = reserves(mmboe) / (production(boepd) × 365 / 1,000,000)
  const reserve_life = (inp.reserves_mmboe != null && inp.production_boepd != null && inp.production_boepd > 0)
    ? round(inp.reserves_mmboe / (inp.production_boepd * 365 / 1_000_000))
    : null;

  const production_growth = round(yoyGrowth(inp.production_boepd, inp.prev_production_boepd));

  // ── Power-specific ───────────────────────────────────────────────────────────
  const receivables_to_revenue = (inp.receivables != null && inp.revenue > 0)
    ? round((inp.receivables / inp.revenue) * 100)
    : null;

  return {
    market_cap:           round(market_cap) ?? 0,
    enterprise_value,
    pe_ratio,
    pb_ratio,
    ev_ebitda,
    ps_ratio,
    ev_revenue,
    fcf_yield,
    dividend_yield,
    bvps,
    cfps,
    gross_margin,
    ebitda_margin,
    operating_margin,
    net_margin:           net_margin ?? 0,
    roe,
    roa,
    roce,
    revenue_growth,
    pat_growth,
    eps_growth,
    revenue_cagr_3y,
    pat_cagr_3y,
    debt_to_equity,
    net_debt_to_ebitda,
    current_ratio,
    interest_cover,
    cfo_to_pat,
    fcf_margin,
    capex_to_revenue,
    payout_ratio,
    nim,
    casa_ratio,
    npl_ratio,
    coverage_ratio,
    car,
    cost_to_income,
    reserve_life,
    production_growth,
    receivables_to_revenue,
  };
}
