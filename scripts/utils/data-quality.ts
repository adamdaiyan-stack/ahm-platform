/**
 * scripts/utils/data-quality.ts
 *
 * Validation rules and data_quality_flags writer.
 *
 * Usage:
 *   const issues = validateDailyPrice(record, prevClose);
 *   if (issues.length > 0) {
 *     await flagDataIssues(issues);
 *   }
 */

import { supabaseAdmin }        from "./supabase-admin.js";
import type { NormalizedPriceRecord } from "../connectors/dps-psx.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type IssueType =
  | "missing_data"
  | "stale_data"
  | "outlier"
  | "parse_error"
  | "source_mismatch"
  | "manual_override"
  | "suspicious_value"
  | "symbol_not_in_master"
  | "ohlc_integrity"
  | "negative_value";

export type IssueSeverity = "critical" | "warning" | "info";

export interface DataIssue {
  entityType:  string;
  entityId?:   string;
  symbol?:     string;
  marketDate?: string;
  fieldName?:  string;
  issueType:   IssueType;
  severity:    IssueSeverity;
  description: string;
  rawValue?:   unknown;
  source?:     string;
}

// ─── Validation rules ─────────────────────────────────────────────────────────

/**
 * PSX circuit breaker is 7.5% for most stocks, but upper limit
 * for daily price move can reach 30% in special situations.
 * We use 35% as the outer bound to catch genuine data errors.
 */
const MAX_PRICE_MOVE_PCT = 35;
const MIN_PRICE = 0.01;

// NormalizedPriceRecord is the canonical type — imported from the connector.
// One definition, one source of truth.

export function validateDailyPrice(
  record: NormalizedPriceRecord,
  prevClose: number | null
): DataIssue[] {
  const issues: DataIssue[] = [];
  const base = {
    entityType: "daily_price",
    entityId:   `${record.symbol}:${record.market_date}`,
    symbol:     record.symbol,
    marketDate: record.market_date,
    source:     "dps_psx",
    rawValue:   record,
  };

  // Close must be positive
  if (record.close < MIN_PRICE) {
    issues.push({
      ...base,
      fieldName:   "close",
      issueType:   "outlier",
      severity:    "critical",
      description: `Close price ${record.close} is below minimum (${MIN_PRICE}).`,
    });
  }

  // OHLC integrity
  if (record.high != null && record.low != null) {
    if (record.high < record.low) {
      issues.push({
        ...base,
        fieldName:   "high/low",
        issueType:   "ohlc_integrity",
        severity:    "critical",
        description: `High (${record.high}) is less than Low (${record.low}).`,
      });
    }
    if (record.close > record.high) {
      issues.push({
        ...base,
        fieldName:   "close/high",
        issueType:   "ohlc_integrity",
        severity:    "warning",
        description: `Close (${record.close}) exceeds High (${record.high}).`,
      });
    }
    if (record.close < record.low) {
      issues.push({
        ...base,
        fieldName:   "close/low",
        issueType:   "ohlc_integrity",
        severity:    "warning",
        description: `Close (${record.close}) is below Low (${record.low}).`,
      });
    }
  }

  // Volume must be non-negative
  if (record.volume != null && record.volume < 0) {
    issues.push({
      ...base,
      fieldName:   "volume",
      issueType:   "negative_value",
      severity:    "warning",
      description: `Volume is negative: ${record.volume}.`,
    });
  }

  // Price spike check vs previous close
  if (prevClose != null && prevClose > 0 && record.close > 0) {
    const movePct = Math.abs((record.close - prevClose) / prevClose) * 100;
    if (movePct > MAX_PRICE_MOVE_PCT) {
      issues.push({
        ...base,
        fieldName:   "close",
        issueType:   "outlier",
        severity:    "warning",
        description: `Price moved ${movePct.toFixed(1)}% vs previous close (${prevClose} → ${record.close}). Exceeds ${MAX_PRICE_MOVE_PCT}% threshold.`,
      });
    }
  }

  // Future date
  const today = new Date().toISOString().slice(0, 10);
  if (record.market_date > today) {
    issues.push({
      ...base,
      fieldName:   "market_date",
      issueType:   "suspicious_value",
      severity:    "warning",
      description: `Market date ${record.market_date} is in the future (today: ${today}).`,
    });
  }

  return issues;
}

// ─── Flag writer ──────────────────────────────────────────────────────────────

/**
 * Writes data quality issues to the data_quality_flags table.
 * Non-blocking — logs a warning if the write fails but does not throw.
 */
export async function flagDataIssues(issues: DataIssue[]): Promise<void> {
  if (issues.length === 0) return;

  const rows = issues.map((issue) => ({
    entity_type:  issue.entityType,
    entity_id:    issue.entityId ?? null,
    symbol:       issue.symbol   ?? null,
    market_date:  issue.marketDate ?? null,
    field_name:   issue.fieldName ?? null,
    issue_type:   issue.issueType,
    severity:     issue.severity,
    description:  issue.description,
    raw_value:    issue.rawValue ? JSON.parse(JSON.stringify(issue.rawValue)) : null,
    source:       issue.source   ?? null,
    status:       "open",
  }));

  const { error } = await supabaseAdmin
    .from("data_quality_flags")
    .insert(rows);

  if (error) {
    console.warn(`[data-quality] Failed to write ${rows.length} flags: ${error.message}`);
  } else {
    const criticals = issues.filter((i) => i.severity === "critical").length;
    console.log(
      `  ⚑  Flagged ${issues.length} data quality issue(s)` +
      (criticals > 0 ? ` (${criticals} critical)` : "")
    );
  }
}

/**
 * Flags a symbol as not found in the companies master table.
 */
export function missingSymbolFlag(symbol: string, source: string): DataIssue {
  return {
    entityType:  "daily_price",
    symbol,
    issueType:   "symbol_not_in_master",
    severity:    "warning",
    description: `Symbol "${symbol}" received from ${source} is not in the companies table.`,
    source,
  };
}
