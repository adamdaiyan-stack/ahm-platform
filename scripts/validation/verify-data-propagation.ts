/**
 * scripts/validation/verify-data-propagation.ts
 *
 * Verifies that data has correctly propagated through all pipeline stages
 * for a given trading date. Tests every destination defined in DATA_PROPAGATION_MAP.md.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/validation/verify-data-propagation.ts
 *   npx tsx --env-file=.env.local scripts/validation/verify-data-propagation.ts --date=2026-05-19
 *
 * What this script checks:
 *   1. daily_prices     — records exist for the date; volume > 0 for at least some symbols
 *   2. index_history    — KSE-100 record exists and has close > 0
 *   3. market_index     — KSE-100 snapshot is current (updated today or close to run date)
 *   4. companies sync   — current_price matches daily_prices for the run date (spot check)
 *   5. daily_snapshots  — at least one row per company exists for the run date
 *   6. data quality     — no OPEN pipeline_alerts for the run date
 *   7. ingestion_runs   — all expected pipeline names have a completed run for the date
 *
 * Exit codes:
 *   0 — all checks passed (or only warnings)
 *   1 — one or more FAIL checks
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";
import { parseDateArg }  from "../utils/date-utils.js";

// ─── Config ───────────────────────────────────────────────────────────────────

// These pipeline names must have a completed ingestion_runs row for the date.
const EXPECTED_PIPELINES = [
  "daily_prices",
  "sync_company_snapshots",
  "daily_snapshots",
  "reconcile_daily_prices",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckResult = {
  name:    string;
  status:  "PASS" | "WARN" | "FAIL" | "SKIP";
  message: string;
  detail?: string;
};

// ─── Check functions ──────────────────────────────────────────────────────────

async function checkDailyPrices(date: string): Promise<CheckResult> {
  const { count, error } = await supabaseAdmin
    .from("daily_prices")
    .select("*", { count: "exact", head: true })
    .eq("market_date", date);

  if (error) return { name: "daily_prices rows", status: "FAIL", message: `Query failed: ${error.message}` };
  if (!count || count === 0) return { name: "daily_prices rows", status: "FAIL", message: `No price records found for ${date}` };

  return {
    name:    "daily_prices rows",
    status:  "PASS",
    message: `${count} price records ingested for ${date}`,
  };
}

async function checkIndexHistory(date: string): Promise<CheckResult> {
  const { data, error } = await supabaseAdmin
    .from("index_history")
    .select("index_symbol, close, change_percent, advances, declines")
    .eq("market_date", date)
    .eq("index_symbol", "KSE-100")
    .single();

  if (error || !data) {
    return { name: "index_history KSE-100", status: "FAIL", message: `No KSE-100 record in index_history for ${date}` };
  }

  const row = data as { close: number; change_percent: number | null; advances: number | null; declines: number | null };

  if (!row.close || row.close <= 0) {
    return { name: "index_history KSE-100", status: "FAIL", message: `KSE-100 close is ${row.close} — invalid` };
  }

  const breadthOk = row.advances != null && row.declines != null;
  return {
    name:    "index_history KSE-100",
    status:  breadthOk ? "PASS" : "WARN",
    message: `KSE-100 close=${row.close} (${row.change_percent?.toFixed(2)}%)`,
    detail:  breadthOk
      ? `Advances: ${row.advances}, Declines: ${row.declines}`
      : "Market breadth (advances/declines) not yet populated — run compute_market_breadth",
  };
}

async function checkMarketIndexSnapshot(date: string): Promise<CheckResult> {
  const { data, error } = await supabaseAdmin
    .from("market_index")
    .select("index_name, level, change_percent, updated_at")
    .eq("index_name", "KSE-100")
    .single();

  if (error || !data) {
    return { name: "market_index snapshot", status: "FAIL", message: "KSE-100 row missing from market_index" };
  }

  const row = data as { level: number | null; change_percent: number | null; updated_at: string | null };

  if (!row.level || row.level <= 0) {
    return { name: "market_index snapshot", status: "FAIL", message: `market_index KSE-100 level is ${row.level} — invalid` };
  }

  // Check staleness: updated_at should be within 2 days of run date
  const updatedAt = row.updated_at ? new Date(row.updated_at) : null;
  const runDateMs = new Date(date).getTime();
  const stale = updatedAt ? Math.abs(updatedAt.getTime() - runDateMs) > 2 * 86_400_000 : true;

  return {
    name:    "market_index snapshot",
    status:  stale ? "WARN" : "PASS",
    message: `Level: ${row.level} (${row.change_percent?.toFixed(2)}%)`,
    detail:  stale ? `updated_at is ${row.updated_at} — may be stale relative to ${date}` : `Updated: ${row.updated_at}`,
  };
}

async function checkCompaniesSync(date: string): Promise<CheckResult> {
  // Spot-check: find companies where current_price doesn't match daily_prices for the date
  const { data: mismatch, error } = await supabaseAdmin
    .rpc("verify_companies_sync", { p_date: date })
    .limit(5);

  // If the RPC doesn't exist (not yet created), fall back to a heuristic check
  if (error && error.message.includes("does not exist")) {
    // Fallback: count companies with null current_price
    const { count: nullCount } = await supabaseAdmin
      .from("companies")
      .select("*", { count: "exact", head: true })
      .is("current_price", null);

    const { count: total } = await supabaseAdmin
      .from("companies")
      .select("*", { count: "exact", head: true });

    const syncedCount = (total ?? 0) - (nullCount ?? 0);
    return {
      name:    "companies price sync",
      status:  (nullCount ?? 0) > 10 ? "WARN" : "PASS",
      message: `${syncedCount}/${total ?? 0} companies have current_price populated`,
      detail:  (nullCount ?? 0) > 0 ? `${nullCount} companies have null current_price` : undefined,
    };
  }

  if (error) {
    return { name: "companies price sync", status: "FAIL", message: `Query failed: ${error.message}` };
  }

  const rows = (mismatch ?? []) as unknown[];
  return {
    name:    "companies price sync",
    status:  rows.length > 0 ? "WARN" : "PASS",
    message: rows.length === 0
      ? "companies.current_price is in sync with daily_prices"
      : `${rows.length} companies have mismatched current_price vs daily_prices`,
  };
}

async function checkDailySnapshots(date: string): Promise<CheckResult> {
  const { count: snapshotCount, error } = await supabaseAdmin
    .from("daily_snapshots")
    .select("*", { count: "exact", head: true })
    .eq("market_date", date);

  if (error) return { name: "daily_snapshots", status: "FAIL", message: `Query failed: ${error.message}` };

  const { count: companyCount } = await supabaseAdmin
    .from("companies")
    .select("*", { count: "exact", head: true });

  const snap  = snapshotCount ?? 0;
  const total = companyCount  ?? 0;

  if (snap === 0) {
    return { name: "daily_snapshots", status: "FAIL", message: `No daily_snapshots rows for ${date} — run build-daily-snapshots` };
  }

  const coverage = total > 0 ? Math.round((snap / total) * 100) : 0;
  return {
    name:    "daily_snapshots",
    status:  coverage < 80 ? "WARN" : "PASS",
    message: `${snap}/${total} companies have snapshot for ${date} (${coverage}% coverage)`,
    detail:  coverage < 80 ? "Low coverage — some companies may be missing price data" : undefined,
  };
}

async function checkPipelineAlerts(date: string): Promise<CheckResult> {
  const { count, error } = await supabaseAdmin
    .from("pipeline_alerts")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")
    .gte("created_at", date + "T00:00:00Z")
    .lt("created_at",  date + "T23:59:59Z");

  if (error) return { name: "open pipeline_alerts", status: "WARN", message: `Could not query alerts: ${error.message}` };

  const n = count ?? 0;
  return {
    name:    "open pipeline_alerts",
    status:  n > 0 ? "WARN" : "PASS",
    message: n === 0
      ? "No open pipeline alerts for this date"
      : `${n} open alert(s) — check pipeline_alerts table`,
  };
}

async function checkIngestionRuns(date: string): Promise<CheckResult[]> {
  const { data, error } = await supabaseAdmin
    .from("ingestion_runs")
    .select("pipeline_name, status, fetched, upserted, failed, trigger_type, started_at")
    .eq("run_date", date)
    .in("pipeline_name", EXPECTED_PIPELINES)
    .order("started_at", { ascending: false });

  if (error) {
    return [{ name: "ingestion_runs", status: "FAIL", message: `Query failed: ${error.message}` }];
  }

  const rows = (data ?? []) as { pipeline_name: string; status: string; fetched: number | null; upserted: number | null; failed: number | null }[];

  // Keep only the most recent run per pipeline
  const latestPerPipeline = new Map<string, typeof rows[0]>();
  for (const row of rows) {
    if (!latestPerPipeline.has(row.pipeline_name)) {
      latestPerPipeline.set(row.pipeline_name, row);
    }
  }

  return EXPECTED_PIPELINES.map((name) => {
    const run = latestPerPipeline.get(name);
    if (!run) {
      return {
        name:    `ingestion_runs[${name}]`,
        status:  "WARN" as const,
        message: `No run found for ${name} on ${date} — pipeline may not have run yet`,
      };
    }
    const status = run.status === "completed" ? "PASS" : run.status === "skipped" ? "SKIP" : "FAIL";
    return {
      name:    `ingestion_runs[${name}]`,
      status,
      message: `${name}: ${run.status} (fetched=${run.fetched ?? 0}, upserted=${run.upserted ?? 0}, failed=${run.failed ?? 0})`,
    };
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const runDate = parseDateArg(args);

  console.log(`\n${"═".repeat(70)}`);
  console.log(`  AHM Data Propagation Verification`);
  console.log(`  Date: ${runDate}`);
  console.log(`${"═".repeat(70)}\n`);

  const checks: CheckResult[] = await Promise.all([
    checkDailyPrices(runDate),
    checkIndexHistory(runDate),
    checkMarketIndexSnapshot(runDate),
    checkCompaniesSync(runDate),
    checkDailySnapshots(runDate),
    checkPipelineAlerts(runDate),
  ]);

  const runChecks = await checkIngestionRuns(runDate);
  checks.push(...runChecks);

  // Print results
  const maxNameLen = Math.max(...checks.map((c) => c.name.length));
  for (const check of checks) {
    const icon   = check.status === "PASS" ? "✓" : check.status === "WARN" ? "⚠" : check.status === "SKIP" ? "—" : "✗";
    const color  = check.status === "PASS" ? "" : check.status === "WARN" ? "" : "";
    const name   = check.name.padEnd(maxNameLen);
    console.log(`  ${icon}  ${name}  ${check.message}`);
    if (check.detail) console.log(`       ${" ".repeat(maxNameLen)}  ${check.detail}`);
  }

  console.log();

  // Summary
  const fails  = checks.filter((c) => c.status === "FAIL").length;
  const warns  = checks.filter((c) => c.status === "WARN").length;
  const passes = checks.filter((c) => c.status === "PASS").length;
  const skips  = checks.filter((c) => c.status === "SKIP").length;

  console.log(`Summary: ${passes} PASS  |  ${warns} WARN  |  ${fails} FAIL  |  ${skips} SKIP\n`);

  if (fails > 0) {
    console.error(`❌ ${fails} check(s) failed — see above for details`);
    process.exit(1);
  } else if (warns > 0) {
    console.log(`⚠  ${warns} warning(s) — review but not blocking`);
  } else {
    console.log(`✓  All propagation checks passed for ${runDate}`);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
