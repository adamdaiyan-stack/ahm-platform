/**
 * scripts/validation/run-quality-checks.ts
 *
 * Proactive data quality audit.
 * Runs independently of ingestion — can be scheduled separately or
 * called on-demand to surface data integrity issues before they
 * affect intelligence outputs.
 *
 * Checks performed:
 *   1. Stale prices      — has ingestion run on every recent business day?
 *   2. Open critical flags — any unresolved critical data_quality_flags?
 *   3. Pipeline failures  — any recent ingestion_runs with failed/partial status?
 *   4. Zero-volume anomalies — suspicious number of zero-volume stocks today?
 *   5. Missing index data  — is KSE-100 index_history current?
 *   6. Regime staleness   — has market_regime_states been updated today?
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/validation/run-quality-checks.ts
 *   npx tsx --env-file=.env.local scripts/validation/run-quality-checks.ts --date=2026-05-19
 *   npx tsx --env-file=.env.local scripts/validation/run-quality-checks.ts --json
 *
 * Exit codes:
 *   0 — all checks passed (or only warnings)
 *   1 — one or more critical failures detected
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";
import { parseDateArg, isWeekend } from "../utils/date-utils.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckStatus = "PASS" | "WARN" | "FAIL";

interface CheckResult {
  check:   string;
  status:  CheckStatus;
  detail:  string;
  count?:  number;
  items?:  string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the N most recent business days before (and including) date. */
function recentBusinessDays(before: string, n: number): string[] {
  const days: string[] = [];
  const d = new Date(before + "T00:00:00");
  while (days.length < n) {
    const iso = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(iso);
    d.setDate(d.getDate() - 1);
  }
  return days;
}

// ─── Individual checks ────────────────────────────────────────────────────────

async function checkStalePrices(runDate: string): Promise<CheckResult> {
  // Look at the last 5 business days and confirm ingestion_runs succeeded for each
  const businessDays = recentBusinessDays(runDate, 5);

  const { data, error } = await supabaseAdmin
    .from("ingestion_runs")
    .select("run_date, status")
    .eq("pipeline_name", "daily_prices")
    .in("run_date", businessDays)
    .in("status", ["success", "partial"]);

  if (error) {
    return { check: "Stale Prices", status: "WARN", detail: `Could not query ingestion_runs: ${error.message}` };
  }

  type RunRow = { run_date: string; status: string };
  const successDates = new Set((data ?? [] as RunRow[]).map((r: RunRow) => r.run_date));
  const missingDates = businessDays.filter((d) => !successDates.has(d) && !isWeekend(d));

  if (missingDates.length === 0) {
    return { check: "Stale Prices", status: "PASS", detail: `All ${businessDays.length} recent business days have price data.` };
  }

  const severity: CheckStatus = missingDates.length >= 2 ? "FAIL" : "WARN";
  return {
    check:  "Stale Prices",
    status: severity,
    detail: `${missingDates.length} business day(s) missing successful price ingestion.`,
    count:  missingDates.length,
    items:  missingDates,
  };
}

async function checkOpenCriticalFlags(): Promise<CheckResult> {
  const { count, error } = await supabaseAdmin
    .from("data_quality_flags")
    .select("*", { count: "exact", head: true })
    .eq("severity", "critical")
    .eq("status", "open");

  if (error) {
    return { check: "Critical Flags", status: "WARN", detail: `Could not query data_quality_flags: ${error.message}` };
  }

  const n = count ?? 0;
  if (n === 0) return { check: "Critical Flags", status: "PASS", detail: "No open critical flags." };

  // Fetch up to 5 examples
  const { data: examples } = await supabaseAdmin
    .from("data_quality_flags")
    .select("symbol, issue_type, description, detected_at")
    .eq("severity", "critical")
    .eq("status", "open")
    .order("detected_at", { ascending: false })
    .limit(5);

  type FlagRow = { symbol: string | null; issue_type: string; description: string };
  const items = (examples ?? [] as FlagRow[]).map(
    (r: FlagRow) => `${r.symbol ?? "?"}: ${r.issue_type} — ${r.description.slice(0, 60)}`
  );

  return {
    check:  "Critical Flags",
    status: "FAIL",
    detail: `${n} open critical data quality flag(s) require attention.`,
    count:  n,
    items,
  };
}

async function checkPipelineFailures(): Promise<CheckResult> {
  // Look at last 7 days for any failed runs
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffISO = cutoff.toISOString();

  const { data, error } = await supabaseAdmin
    .from("ingestion_runs")
    .select("pipeline_name, run_date, status, error_summary")
    .in("status", ["failed"])
    .gte("started_at", cutoffISO)
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) {
    return { check: "Pipeline Failures", status: "WARN", detail: `Could not query ingestion_runs: ${error.message}` };
  }

  const failures = data ?? [];
  if (failures.length === 0) {
    return { check: "Pipeline Failures", status: "PASS", detail: "No pipeline failures in the last 7 days." };
  }

  type FailRow = { pipeline_name: string; run_date: string; error_summary: string | null };
  const items = (failures as FailRow[]).map(
    (r) => `${r.pipeline_name} [${r.run_date}]: ${(r.error_summary ?? "no detail").slice(0, 80)}`
  );

  return {
    check:  "Pipeline Failures",
    status: "FAIL",
    detail: `${failures.length} pipeline failure(s) in the last 7 days.`,
    count:  failures.length,
    items,
  };
}

async function checkZeroVolumeAnomalies(runDate: string): Promise<CheckResult> {
  // What % of stocks traded today had zero volume? If > 30%, flag it.
  const { data, error } = await supabaseAdmin
    .from("daily_prices")
    .select("symbol, volume")
    .eq("market_date", runDate);

  if (error || !data) {
    return { check: "Zero-Volume Anomalies", status: "WARN", detail: `Could not query daily_prices for ${runDate}.` };
  }

  type PRow = { symbol: string; volume: number | null };
  const all    = (data as PRow[]).length;
  if (all === 0) {
    return { check: "Zero-Volume Anomalies", status: "WARN", detail: `No price records found for ${runDate}.` };
  }

  const zeroVol = (data as PRow[]).filter((r) => (r.volume ?? 0) === 0);
  const pct     = (zeroVol.length / all) * 100;

  if (pct <= 10) {
    return { check: "Zero-Volume Anomalies", status: "PASS", detail: `${zeroVol.length}/${all} stocks (${pct.toFixed(1)}%) had zero volume — within normal range.` };
  }
  if (pct <= 30) {
    return {
      check:  "Zero-Volume Anomalies",
      status: "WARN",
      detail: `${zeroVol.length}/${all} stocks (${pct.toFixed(1)}%) had zero volume — elevated, may indicate data gap.`,
      count:  zeroVol.length,
    };
  }

  const sample = zeroVol.slice(0, 5).map((r: PRow) => r.symbol);
  return {
    check:  "Zero-Volume Anomalies",
    status: "FAIL",
    detail: `${zeroVol.length}/${all} stocks (${pct.toFixed(1)}%) had zero volume — likely a data ingestion issue.`,
    count:  zeroVol.length,
    items:  sample,
  };
}

async function checkIndexData(runDate: string): Promise<CheckResult> {
  const { data, error } = await supabaseAdmin
    .from("index_history")
    .select("close, change_percent, advances, declines")
    .eq("index_symbol", "KSE-100")
    .eq("market_date", runDate)
    .single();

  if (error || !data) {
    return {
      check:  "KSE-100 Index Data",
      status: "WARN",
      detail: `No KSE-100 index_history row found for ${runDate}. Run ingest:prices.`,
    };
  }

  type IdxRow = { close: number | null; change_percent: number | null; advances: number | null; declines: number | null };
  const row = data as IdxRow;
  const missing = [];
  if (row.close == null)          missing.push("close");
  if (row.change_percent == null) missing.push("change_percent");
  if (row.advances == null)       missing.push("advances");
  if (row.declines == null)       missing.push("declines");

  if (missing.length > 0) {
    return {
      check:  "KSE-100 Index Data",
      status: "WARN",
      detail: `KSE-100 row exists for ${runDate} but missing: ${missing.join(", ")}.`,
      items:  missing,
    };
  }

  return {
    check:  "KSE-100 Index Data",
    status: "PASS",
    detail: `KSE-100 [${runDate}]: ${row.close?.toFixed(2)} (${row.change_percent?.toFixed(2)}%) | A/D: ${row.advances}/${row.declines}`,
  };
}

async function checkRegimeStaleness(runDate: string): Promise<CheckResult> {
  const { data, error } = await supabaseAdmin
    .from("market_regime_states")
    .select("regime_date, regime, confidence")
    .order("regime_date", { ascending: false })
    .limit(1)
    .single();

  // Table might not exist yet (migration pending)
  if (error?.message?.includes("does not exist")) {
    return { check: "Market Regime", status: "WARN", detail: "market_regime_states table not yet created. Apply migration 032." };
  }

  if (error || !data) {
    return { check: "Market Regime", status: "WARN", detail: "No regime classifications found. Run build:daily-snapshots." };
  }

  type RRow = { regime_date: string; regime: string; confidence: number };
  const row = data as RRow;

  if (row.regime_date < runDate) {
    return {
      check:  "Market Regime",
      status: "WARN",
      detail: `Latest regime is from ${row.regime_date} (${row.regime}). Not yet computed for ${runDate}.`,
    };
  }

  return {
    check:  "Market Regime",
    status: "PASS",
    detail: `Regime for ${runDate}: ${row.regime} (confidence: ${Math.round(row.confidence * 100)}%)`,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const runDate = parseDateArg(args);
  const jsonOut = args.includes("--json");

  if (!jsonOut) {
    console.log(`\n${"═".repeat(60)}`);
    console.log(`  AHM Data Quality Audit`);
    console.log(`  Reference date: ${runDate}`);
    console.log(`${"═".repeat(60)}\n`);
  }

  // Run all checks in parallel
  const results = await Promise.all([
    checkStalePrices(runDate),
    checkOpenCriticalFlags(),
    checkPipelineFailures(),
    checkZeroVolumeAnomalies(runDate),
    checkIndexData(runDate),
    checkRegimeStaleness(runDate),
  ]);

  if (jsonOut) {
    console.log(JSON.stringify({ runDate, checks: results }, null, 2));
    const hasFail = results.some((r) => r.status === "FAIL");
    process.exit(hasFail ? 1 : 0);
  }

  // Human-readable output
  const icons: Record<CheckStatus, string> = { PASS: "✅", WARN: "⚠️ ", FAIL: "❌" };
  let failures = 0;

  for (const r of results) {
    console.log(`${icons[r.status]} ${r.check.padEnd(24)} ${r.detail}`);
    if (r.items && r.items.length > 0) {
      r.items.forEach((item) => console.log(`     • ${item}`));
    }
    if (r.status === "FAIL") failures++;
  }

  const passCount = results.filter((r) => r.status === "PASS").length;
  const warnCount = results.filter((r) => r.status === "WARN").length;

  console.log(`\n${"─".repeat(60)}`);
  console.log(
    `  ${passCount} passed  |  ${warnCount} warnings  |  ${failures} failed`
  );

  if (failures > 0) {
    console.log(`\n  ⚠️  ${failures} check(s) require attention before intelligence runs.`);
    process.exit(1);
  } else {
    console.log(`\n  Platform data integrity: OK`);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
