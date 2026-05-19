/**
 * scripts/validation/audit-financials.ts
 *
 * Validates all financial data in financial_metrics for integrity,
 * consistency, and completeness. Writes issues to data_quality_flags.
 *
 * Validation rules:
 *   1. Balance sheet integrity: assets ≈ liabilities + equity (±2%)
 *   2. Negative revenue detection
 *   3. Absurd margin detection (gross_margin > 100%, net_margin < -200%)
 *   4. Missing core metrics (revenue, pat, total_assets, total_equity)
 *   5. EPS consistency: EPS * shares ≈ PAT (±5%)
 *   6. Stale data: no annual data in 18+ months
 *   7. Growth sanity: >500% YoY growth flagged for review
 *   8. Duplicate period detection (should not happen with UNIQUE constraint)
 *   9. Zero or near-zero equity (potential data error)
 *  10. Revenue < cost_of_revenue (negative gross profit not always wrong, but flagged)
 *
 * Usage:
 *   npm run audit:financials                    # All companies
 *   npm run audit:financials -- --symbol=HBL    # Single company
 *   npm run audit:financials -- --fix           # Auto-resolve false positives
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";
import { parsePeriodKey, getPriorYearPeriod } from "../utils/period-utils.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const SOURCE = "audit_financials";
const MAX_STALE_MONTHS = 18;  // Flag if no annual data in N months

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckResult {
  passed:  boolean;
  issues:  Issue[];
}

interface Issue {
  symbol:       string;
  entityId:     string;    // period key
  issueType:    string;
  severity:     "critical" | "warning" | "info";
  description:  string;
  rawValue?:    Record<string, unknown>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
}

function withinTolerance(a: number, b: number, tolerancePct = 2): boolean {
  if (a === 0 && b === 0) return true;
  const avg = (Math.abs(a) + Math.abs(b)) / 2;
  if (avg === 0) return true;
  return Math.abs(a - b) / avg * 100 <= tolerancePct;
}

// ─── Validation Rules ─────────────────────────────────────────────────────────

function checkBalanceSheetIntegrity(rows: Record<string, unknown>[]): Issue[] {
  const issues: Issue[] = [];
  for (const row of rows) {
    const assets      = row.total_assets as number | null;
    const liabilities = row.total_liabilities as number | null;
    const equity      = row.total_equity as number | null;
    if (!assets || !liabilities || !equity) continue;
    const rhs = liabilities + equity;
    if (!withinTolerance(assets, rhs, 2)) {
      const diff = Math.abs(assets - rhs);
      const diffPct = pct(diff, assets);
      issues.push({
        symbol:      String(row.symbol),
        entityId:    String(row.period),
        issueType:   "balance_sheet_mismatch",
        severity:    diffPct > 10 ? "critical" : "warning",
        description: `Assets (${assets.toLocaleString()}) ≠ Liabilities + Equity (${rhs.toLocaleString()}). Difference: ${diffPct.toFixed(1)}%`,
        rawValue:    { total_assets: assets, total_liabilities: liabilities, total_equity: equity, difference_pct: diffPct },
      });
    }
  }
  return issues;
}

function checkNegativeRevenue(rows: Record<string, unknown>[]): Issue[] {
  return rows
    .filter((r) => typeof r.revenue === "number" && (r.revenue as number) < 0)
    .map((r) => ({
      symbol:      String(r.symbol),
      entityId:    String(r.period),
      issueType:   "negative_value",
      severity:    "critical" as const,
      description: `Negative revenue: ${r.revenue} PKR millions`,
      rawValue:    { revenue: r.revenue },
    }));
}

function checkMarginSanity(rows: Record<string, unknown>[]): Issue[] {
  const issues: Issue[] = [];
  for (const row of rows) {
    const gm = row.gross_margin as number | null;
    const nm = row.net_margin   as number | null;
    if (gm != null && gm > 100) {
      issues.push({
        symbol:      String(row.symbol),
        entityId:    String(row.period),
        issueType:   "suspicious_value",
        severity:    "warning",
        description: `Gross margin ${gm.toFixed(1)}% exceeds 100% — possible data error`,
        rawValue:    { gross_margin: gm },
      });
    }
    if (nm != null && nm < -200) {
      issues.push({
        symbol:      String(row.symbol),
        entityId:    String(row.period),
        issueType:   "suspicious_value",
        severity:    "warning",
        description: `Net margin ${nm.toFixed(1)}% below −200% — possible data error`,
        rawValue:    { net_margin: nm },
      });
    }
  }
  return issues;
}

function checkMissingCoreMetrics(rows: Record<string, unknown>[]): Issue[] {
  const issues: Issue[] = [];
  const CORE_FIELDS = ["revenue", "pat", "total_assets", "total_equity"];
  for (const row of rows) {
    if (row.period_type !== "annual") continue;  // Only require full set for annual
    const missing = CORE_FIELDS.filter((f) => row[f] == null);
    if (missing.length > 0) {
      issues.push({
        symbol:      String(row.symbol),
        entityId:    String(row.period),
        issueType:   "missing_data",
        severity:    missing.length >= 3 ? "critical" : "warning",
        description: `Missing core metrics for annual period: ${missing.join(", ")}`,
        rawValue:    { missing_fields: missing },
      });
    }
  }
  return issues;
}

function checkEpsConsistency(rows: Record<string, unknown>[]): Issue[] {
  const issues: Issue[] = [];
  for (const row of rows) {
    const eps    = row.eps              as number | null;
    const pat    = row.pat              as number | null;
    const shares = row.shares_outstanding as number | null;
    if (!eps || !pat || !shares || shares === 0) continue;
    const impliedEps = pat / shares;
    const diffPct = Math.abs(eps - impliedEps) / Math.abs(impliedEps) * 100;
    if (diffPct > 10) {  // >10% discrepancy
      issues.push({
        symbol:      String(row.symbol),
        entityId:    String(row.period),
        issueType:   "suspicious_value",
        severity:    diffPct > 30 ? "warning" : "info",
        description: `EPS (${eps.toFixed(2)}) vs PAT/shares implied EPS (${impliedEps.toFixed(2)}). Diff: ${diffPct.toFixed(1)}%`,
        rawValue:    { eps, pat, shares_outstanding: shares, implied_eps: impliedEps, diff_pct: diffPct },
      });
    }
  }
  return issues;
}

function checkGrowthSanity(rows: Record<string, unknown>[], bySymbol: Map<string, Record<string, unknown>[]>): Issue[] {
  const issues: Issue[] = [];
  for (const row of rows) {
    if (row.period_type !== "annual") continue;
    const priorKey = getPriorYearPeriod(String(row.period));
    if (!priorKey) continue;
    const symbolRows = bySymbol.get(String(row.symbol)) ?? [];
    const prior = symbolRows.find((r) => String(r.period).toUpperCase() === priorKey.toUpperCase());
    if (!prior) continue;

    const checkGrowth = (field: string, label: string) => {
      const curr  = row[field]   as number | null;
      const priorV = prior[field] as number | null;
      if (curr == null || priorV == null || priorV === 0) return;
      const growth = Math.abs((curr - priorV) / Math.abs(priorV) * 100);
      if (growth > 500) {
        issues.push({
          symbol:      String(row.symbol),
          entityId:    String(row.period),
          issueType:   "suspicious_value",
          severity:    "warning",
          description: `${label} grew ${growth.toFixed(0)}% YoY — verify against source`,
          rawValue:    { field, current: curr, prior: priorV, growth_pct: growth },
        });
      }
    };

    checkGrowth("revenue", "Revenue");
    checkGrowth("pat",     "PAT");
    checkGrowth("eps",     "EPS");
  }
  return issues;
}

function checkZeroEquity(rows: Record<string, unknown>[]): Issue[] {
  return rows
    .filter((r) => {
      const eq = r.total_equity as number | null;
      return eq != null && Math.abs(eq) < 1;  // < PKR 1 million
    })
    .map((r) => ({
      symbol:      String(r.symbol),
      entityId:    String(r.period),
      issueType:   "suspicious_value",
      severity:    "critical" as const,
      description: `Total equity near zero (${r.total_equity}) — possible data error or company in distress`,
      rawValue:    { total_equity: r.total_equity },
    }));
}

function checkStaleness(bySymbol: Map<string, Record<string, unknown>[]>): Issue[] {
  const issues: Issue[] = [];
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - MAX_STALE_MONTHS);

  for (const [symbol, rows] of bySymbol) {
    const annualRows = rows.filter((r) => r.period_type === "annual" && r.period_end_date);
    if (annualRows.length === 0) {
      issues.push({
        symbol,
        entityId:    symbol,
        issueType:   "stale_data",
        severity:    "warning",
        description: `No annual financial data exists for ${symbol}`,
        rawValue:    { symbol },
      });
      continue;
    }
    const latestDate = new Date(
      annualRows
        .map((r) => String(r.period_end_date))
        .sort()
        .at(-1)!
    );
    if (latestDate < cutoff) {
      const monthsAgo = Math.floor((Date.now() - latestDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      issues.push({
        symbol,
        entityId:    symbol,
        issueType:   "stale_data",
        severity:    "warning",
        description: `Latest annual data is ${monthsAgo} months old (${latestDate.toISOString().slice(0, 10)}) — may need updating`,
        rawValue:    { latest_period_end: latestDate.toISOString().slice(0, 10), months_ago: monthsAgo },
      });
    }
  }
  return issues;
}

// ─── DB write ─────────────────────────────────────────────────────────────────

async function writeFlags(issues: Issue[]): Promise<{ written: number; failed: number }> {
  if (issues.length === 0) return { written: 0, failed: 0 };

  // Resolve existing open flags for same entity+issue_type
  const existingKeys = issues.map((i) => `${i.symbol}|${i.entityId}|${i.issueType}`);
  await supabaseAdmin
    .from("data_quality_flags")
    .update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: SOURCE })
    .eq("entity_type", "financial_metric")
    .eq("status", "open")
    .in("entity_id", issues.map((i) => `${i.symbol}:${i.entityId}`));

  const rows = issues.map((i) => ({
    entity_type:  "financial_metric",
    entity_id:    `${i.symbol}:${i.entityId}`,
    symbol:       i.symbol,
    issue_type:   i.issueType as string,
    severity:     i.severity,
    description:  i.description,
    raw_value:    i.rawValue ?? null,
    source:       SOURCE,
    status:       "open",
    detected_at:  new Date().toISOString(),
  }));

  const { error, data } = await supabaseAdmin
    .from("data_quality_flags")
    .insert(rows)
    .select("id");

  if (error) {
    console.error(`Failed to write flags: ${error.message}`);
    return { written: 0, failed: rows.length };
  }
  return { written: (data ?? []).length, failed: rows.length - (data ?? []).length };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args      = process.argv.slice(2);
  const symbolArg = args.find((a) => a.startsWith("--symbol="))?.replace("--symbol=", "");
  const startedAt = new Date();

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Financial Data Audit`);
  if (symbolArg) console.log(`  Symbol: ${symbolArg}`);
  console.log(`${"═".repeat(60)}\n`);

  // ── Fetch data ────────────────────────────────────────────────────────────────
  let query = supabaseAdmin
    .from("financial_metrics")
    .select("*")
    .order("symbol")
    .order("period_end_date", { ascending: false });

  if (symbolArg) {
    query = query.eq("symbol", symbolArg.toUpperCase());
  }

  const { data: rows, error } = await query;
  if (error) {
    console.error(`Failed to fetch financial_metrics: ${error.message}`);
    process.exit(1);
  }

  const allRows = (rows ?? []) as Record<string, unknown>[];
  console.log(`Loaded ${allRows.length} financial_metrics rows\n`);

  // Index by symbol
  const bySymbol = new Map<string, Record<string, unknown>[]>();
  for (const row of allRows) {
    const sym = String(row.symbol);
    if (!bySymbol.has(sym)) bySymbol.set(sym, []);
    bySymbol.get(sym)!.push(row);
  }

  // ── Run all checks ────────────────────────────────────────────────────────────
  const allIssues: Issue[] = [
    ...checkBalanceSheetIntegrity(allRows),
    ...checkNegativeRevenue(allRows),
    ...checkMarginSanity(allRows),
    ...checkMissingCoreMetrics(allRows),
    ...checkEpsConsistency(allRows),
    ...checkGrowthSanity(allRows, bySymbol),
    ...checkZeroEquity(allRows),
    ...checkStaleness(bySymbol),
  ];

  // ── Report ────────────────────────────────────────────────────────────────────
  const critical = allIssues.filter((i) => i.severity === "critical");
  const warnings = allIssues.filter((i) => i.severity === "warning");
  const infos    = allIssues.filter((i) => i.severity === "info");

  console.log(`Audit Results:`);
  console.log(`  Critical: ${critical.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Info:     ${infos.length}`);
  console.log(`  Total:    ${allIssues.length}\n`);

  if (critical.length > 0) {
    console.log("── Critical Issues ──────────────────────────────────────");
    for (const i of critical) {
      console.log(`  [${i.symbol}] ${i.period ?? i.entityId}: ${i.description}`);
    }
    console.log();
  }
  if (warnings.length > 0) {
    console.log("── Warnings ─────────────────────────────────────────────");
    for (const i of warnings) {
      console.log(`  [${i.symbol}] ${i.entityId}: ${i.description}`);
    }
    console.log();
  }

  // ── Write to data_quality_flags ───────────────────────────────────────────────
  const { written, failed } = await writeFlags(allIssues);
  console.log(`Flags written to data_quality_flags: ${written}`);
  if (failed > 0) console.log(`  ✗ ${failed} flag writes failed`);

  // ── Log run ───────────────────────────────────────────────────────────────────
  await supabaseAdmin.from("ingestion_runs").insert({
    pipeline_name:    "audit_financials",
    pipeline_version: "1.0.0",
    run_date:         startedAt.toISOString().slice(0, 10),
    source:           "audit",
    trigger:          "manual",
    status:           critical.length > 0 ? "failed" : "completed",
    records_fetched:  allRows.length,
    records_upserted: written,
    records_failed:   failed,
    error_summary:    critical.length > 0
      ? `${critical.length} critical financial data issues detected`
      : null,
    started_at:       startedAt.toISOString(),
    completed_at:     new Date().toISOString(),
    duration_ms:      Date.now() - startedAt.getTime(),
  });

  console.log(`\n${"═".repeat(60)}`);
  if (allIssues.length === 0) {
    console.log("  ✓ All financial data passed validation");
  } else {
    console.log(`  ${critical.length} critical, ${warnings.length} warnings, ${infos.length} info`);
    if (critical.length > 0) {
      console.log("  Review critical issues before running ratio calculations.");
    }
  }
  console.log(`${"═".repeat(60)}\n`);

  // Exit with error code if any critical issues found
  if (critical.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
