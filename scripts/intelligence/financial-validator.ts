/**
 * scripts/intelligence/financial-validator.ts
 *
 * AHM Deterministic Financial Validation Layer — v1.0.0
 *
 * RULE: Invalid ratios must never enter production tables.
 * This module validates raw financial inputs BEFORE ratio computation.
 * All validation failures produce structured error reports, not exceptions.
 */

import type { FinancialStatementInputs } from './financial-definitions.js';
import { REQUIRED_INPUTS, RATIO_BOUNDS } from './financial-definitions.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  field:    string;
  code:     string;
  severity: ValidationSeverity;
  message:  string;
  value?:   unknown;
}

export interface ValidationResult {
  valid:    boolean;   // false = must not proceed to ratio computation
  errors:   ValidationIssue[];
  warnings: ValidationIssue[];
  all:      ValidationIssue[];
}

// ─── Validation Rules ─────────────────────────────────────────────────────────

function issue(
  field: string,
  code: string,
  severity: ValidationSeverity,
  message: string,
  value?: unknown,
): ValidationIssue {
  return { field, code, severity, message, value };
}

export function validateFinancialInputs(
  raw: Partial<FinancialStatementInputs>,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // ── 1. Required fields ──────────────────────────────────────────────────────
  for (const field of REQUIRED_INPUTS) {
    const val = (raw as Record<string, unknown>)[field];
    if (val === null || val === undefined || val === '') {
      issues.push(issue(field, 'REQUIRED_MISSING', 'error',
        `Required field '${field}' is missing or null.`));
    }
  }

  // ── 2. Positive price and shares ────────────────────────────────────────────
  if (raw.price !== undefined && raw.price !== null) {
    if (raw.price <= 0) {
      issues.push(issue('price', 'NON_POSITIVE_PRICE', 'error',
        `Price must be positive. Got: ${raw.price}`, raw.price));
    }
    if (raw.price > 100_000) {
      issues.push(issue('price', 'PRICE_SUSPICIOUSLY_HIGH', 'warning',
        `Price of ${raw.price} is unusually high. Verify units (should be PKR/share).`, raw.price));
    }
  }

  if (raw.shares_outstanding !== undefined && raw.shares_outstanding !== null) {
    if (raw.shares_outstanding <= 0) {
      issues.push(issue('shares_outstanding', 'NON_POSITIVE_SHARES', 'error',
        `Shares outstanding must be positive millions. Got: ${raw.shares_outstanding}`, raw.shares_outstanding));
    }
    // Flag if shares look like they were back-calculated from market_cap/price
    // (very precise decimal numbers are a sign of this)
    if (raw.shares_outstanding !== null && raw.price && raw.shares_outstanding > 0) {
      const impliedMktCap = raw.shares_outstanding * raw.price;
      // If impliedMktCap is an oddly round trillion number, likely back-calculated
      if (impliedMktCap > 0 && impliedMktCap % 50_000 === 0 && impliedMktCap > 100_000) {
        issues.push(issue('shares_outstanding', 'SHARES_LIKELY_BACKCALCULATED', 'warning',
          `shares_outstanding × price = ${impliedMktCap.toLocaleString()} PKR million (suspiciously round). ` +
          `Verify shares come from actual company filings, not market_cap / price.`,
          raw.shares_outstanding));
      }
    }
  }

  // ── 3. Revenue and PAT positivity ───────────────────────────────────────────
  if (raw.revenue !== undefined && raw.revenue !== null) {
    if (raw.revenue <= 0) {
      issues.push(issue('revenue', 'NON_POSITIVE_REVENUE', 'error',
        `Revenue must be positive PKR millions. Got: ${raw.revenue}`, raw.revenue));
    }
  }

  // PAT can be negative (loss-making company) — warn, don't error
  if (raw.pat !== undefined && raw.pat !== null) {
    if (raw.pat < -raw.revenue! * 2) {
      issues.push(issue('pat', 'PAT_EXCEEDS_2X_REVENUE', 'warning',
        `PAT of ${raw.pat}M looks implausible relative to revenue of ${raw.revenue}M.`, raw.pat));
    }
  }

  // ── 4. Balance sheet integrity ───────────────────────────────────────────────
  if (raw.total_equity !== undefined && raw.total_equity !== null) {
    if (raw.total_equity === 0) {
      issues.push(issue('total_equity', 'ZERO_EQUITY', 'error',
        `total_equity = 0 will produce invalid pb_ratio. Must be actual book equity from balance sheet.`));
    }
    if (raw.total_equity < 0) {
      issues.push(issue('total_equity', 'NEGATIVE_EQUITY', 'warning',
        `Negative equity detected (${raw.total_equity}M). pb_ratio will be negative — not meaningful. ` +
        `pb_ratio will be suppressed for this company.`, raw.total_equity));
    }
  }

  if (raw.total_assets !== undefined && raw.total_assets !== null) {
    if (raw.total_assets <= 0) {
      issues.push(issue('total_assets', 'NON_POSITIVE_ASSETS', 'error',
        `total_assets must be positive PKR millions.`, raw.total_assets));
    }
    // Equity should not exceed total assets (basic balance sheet identity)
    if (raw.total_equity && raw.total_equity > raw.total_assets * 1.05) {
      issues.push(issue('total_equity', 'EQUITY_EXCEEDS_ASSETS', 'error',
        `total_equity (${raw.total_equity}M) > total_assets (${raw.total_assets}M). ` +
        `Balance sheet identity violated. Check unit consistency.`));
    }
  }

  // ── 5. EPS consistency ───────────────────────────────────────────────────────
  if (raw.eps !== undefined && raw.eps !== null && raw.pat !== undefined && raw.pat !== null &&
      raw.shares_outstanding !== undefined && raw.shares_outstanding !== null &&
      raw.shares_outstanding > 0) {
    // EPS_computed = PAT(millions) / shares(millions) = PKR per share
    const epsComputed = raw.pat / raw.shares_outstanding;
    // Allow ±20% tolerance (differences can arise from weighted avg shares vs period-end)
    if (Math.abs(epsComputed - raw.eps) / (Math.abs(raw.eps) + 0.01) > 0.25) {
      issues.push(issue('eps', 'EPS_PAT_SHARES_INCONSISTENCY', 'warning',
        `EPS supplied (${raw.eps}) differs from PAT/shares computed (${epsComputed.toFixed(2)}) by >25%. ` +
        `Verify: PAT=${raw.pat}M, shares=${raw.shares_outstanding}M. ` +
        `Could indicate unit mismatch or weighted-avg vs period-end shares difference.`,
        { eps_supplied: raw.eps, eps_computed: epsComputed }));
    }
  }

  // ── 6. Denominator zero-guards (pre-computation) ─────────────────────────────
  const denominatorChecks: { field: string; value: number | null | undefined; label: string }[] = [
    { field: 'total_equity',     value: raw.total_equity,     label: 'PBV denominator' },
    { field: 'ebitda',           value: raw.ebitda,           label: 'EV/EBITDA denominator' },
    { field: 'interest_expense', value: raw.interest_expense, label: 'Interest cover denominator' },
    { field: 'total_deposits',   value: raw.total_deposits,   label: 'CASA ratio denominator (banking)' },
    { field: 'gross_loans',      value: raw.gross_loans,      label: 'NPL ratio denominator (banking)' },
  ];

  for (const { field, value, label } of denominatorChecks) {
    if (value !== undefined && value !== null && value === 0) {
      issues.push(issue(field, 'ZERO_DENOMINATOR', 'error',
        `${field} = 0 will produce invalid ratio (${label}). ` +
        `If this is truly zero, set to null to suppress ratio computation.`, value));
    }
  }

  // ── 7. Unit consistency checks ───────────────────────────────────────────────
  // All financial statement inputs should be PKR millions.
  // Heuristic: if revenue is < 100, it's likely in PKR billions by mistake.
  if (raw.revenue !== undefined && raw.revenue !== null && raw.revenue > 0 && raw.revenue < 10) {
    issues.push(issue('revenue', 'REVENUE_UNIT_SUSPECT', 'error',
      `Revenue of ${raw.revenue} looks like it may be in PKR billions instead of millions. ` +
      `All inputs must be in PKR millions. Expected value: ${(raw.revenue * 1000).toLocaleString()}M`,
      raw.revenue));
  }

  // ── 8. Period date plausibility ──────────────────────────────────────────────
  if (raw.period_end) {
    const periodEnd = new Date(raw.period_end);
    const now = new Date();
    if (periodEnd > now) {
      issues.push(issue('period_end', 'FUTURE_PERIOD', 'error',
        `period_end (${raw.period_end}) is in the future. Only historical periods allowed.`));
    }
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    if (periodEnd < fiveYearsAgo) {
      issues.push(issue('period_end', 'PERIOD_TOO_OLD', 'warning',
        `period_end (${raw.period_end}) is more than 5 years ago. Scores derived from this data may be stale.`));
    }
  }

  if (raw.snapshot_date) {
    const snap = new Date(raw.snapshot_date);
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (snap < thirtyDaysAgo) {
      issues.push(issue('snapshot_date', 'STALE_PRICE_SNAPSHOT', 'warning',
        `snapshot_date (${raw.snapshot_date}) is more than 30 days ago. ` +
        `Price-dependent ratios (PE, PBV, yield) reflect a stale price.`));
    }
  }

  // ── 9. Dividend sanity ───────────────────────────────────────────────────────
  if (raw.dps !== undefined && raw.dps !== null && raw.eps !== undefined && raw.eps !== null) {
    if (raw.dps > raw.eps * 2 && raw.eps > 0) {
      issues.push(issue('dps', 'DPS_EXCEEDS_2X_EPS', 'warning',
        `DPS (${raw.dps}) > 2× EPS (${raw.eps}). Payout ratio would exceed 200%. ` +
        `Verify DPS is per share in PKR (not total dividend in millions).`, raw.dps));
    }
  }

  const errors   = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  return {
    valid:    errors.length === 0,
    errors,
    warnings,
    all:      issues,
  };
}

/** Format validation result for console output */
export function formatValidationReport(
  symbol: string,
  period: string,
  result: ValidationResult,
): string {
  const lines: string[] = [];
  lines.push(`[${symbol} ${period}] Validation: ${result.valid ? '✓ PASS' : '✗ FAIL'} — ${result.errors.length} errors, ${result.warnings.length} warnings`);
  for (const e of result.errors)   lines.push(`  ✗ ERROR   [${e.code}] ${e.field}: ${e.message}`);
  for (const w of result.warnings) lines.push(`  ⚠ WARNING [${w.code}] ${w.field}: ${w.message}`);
  return lines.join('\n');
}
