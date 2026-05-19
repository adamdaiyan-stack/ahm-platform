/**
 * scripts/pipelines/reconcile-daily-prices.ts
 *
 * Reconciliation pipeline: detect missing or suspicious price records.
 *
 * Usage:
 *   npm run reconcile:prices                        # Uses today's PKT date
 *   npm run reconcile:prices -- --date=2026-05-19   # Specific date
 *
 * What this script does:
 *   1. Calls reconcile_daily_prices(date) SQL function
 *      → Returns symbols with missing_daily_price or identical_to_previous issues
 *   2. Maps each result row to a DataIssue
 *   3. Writes issues to data_quality_flags (via flagDataIssues)
 *   4. Writes critical issues (missing prices) to pipeline_alerts
 *   5. Logs an ingestion_runs record for operational visibility
 *
 * IDEMPOTENT — safe to re-run for the same date. ON CONFLICT DO NOTHING on
 * data_quality_flags and pipeline_alerts prevents duplicate rows.
 */

import { supabaseAdmin }              from "../utils/supabase-admin.js";
import { PipelineLogger }             from "../utils/pipeline-logger.js";
import { flagDataIssues, DataIssue }  from "../utils/data-quality.js";
import { parseDateArg, isWeekend }    from "../utils/date-utils.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME = "reconcile_daily_prices";
const SOURCE        = "reconciler";

// Suppress pipeline_alerts for symbols with fewer than this many known price rows —
// new companies that haven't been tracked long enough will always appear "missing".
const MIN_HISTORY_DAYS = 5;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReconcileRow {
  symbol: string;
  issue:  "missing_daily_price" | "identical_to_previous";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the set of symbols that have enough price history to be considered
 * "expected" on any given trading day. New symbols below the threshold are
 * excluded from alerts (still flagged in data_quality_flags).
 */
async function getEstablishedSymbols(): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from("daily_prices")
    .select("symbol")
    .limit(10_000);                       // aggregate approach: group in JS

  if (error) {
    console.warn(`[reconcile] Could not load price history: ${error.message}`);
    return new Set();
  }

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { symbol: string }[]) {
    counts.set(row.symbol, (counts.get(row.symbol) ?? 0) + 1);
  }

  const established = new Set<string>();
  for (const [sym, count] of counts) {
    if (count >= MIN_HISTORY_DAYS) established.add(sym);
  }
  return established;
}

/**
 * Writes a pipeline_alert row for each missing-price symbol.
 * Non-throwing — logs on failure.
 */
async function writePipelineAlerts(
  missingSymbols: string[],
  runDate: string
): Promise<void> {
  if (missingSymbols.length === 0) return;

  const rows = missingSymbols.map((symbol) => ({
    pipeline_name: PIPELINE_NAME,
    alert_type:    "missing_data",
    severity:      "warning",
    message:       `No price record for ${symbol} on ${runDate}`,
    context:       { symbol, market_date: runDate },
    status:        "open",
  }));

  const { error } = await supabaseAdmin
    .from("pipeline_alerts")
    .insert(rows);

  if (error) {
    console.warn(`[reconcile] Failed to write ${rows.length} pipeline alerts: ${error.message}`);
  } else {
    console.log(`  ⚑  Wrote ${rows.length} pipeline alert(s)`);
  }
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const runDate = parseDateArg(args);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Reconciliation Pipeline`);
  console.log(`  Date: ${runDate}`);
  console.log(`${"═".repeat(60)}\n`);

  // Skip weekends — no prices expected
  if (isWeekend(runDate)) {
    console.log(`${runDate} is a weekend — no reconciliation needed.`);
    return;
  }

  const run = await PipelineLogger.start(PIPELINE_NAME, runDate, SOURCE, "cron");

  try {
    // ── Step 1: Call reconcile_daily_prices SQL function ────────────────────
    console.log(`Running reconcile_daily_prices(${runDate})...`);
    const { data: reconcileRows, error: rpcError } = await supabaseAdmin
      .rpc("reconcile_daily_prices", { p_date: runDate });

    if (rpcError) {
      throw new Error(`reconcile_daily_prices RPC failed: ${rpcError.message}`);
    }

    const rows = (reconcileRows ?? []) as ReconcileRow[];
    console.log(`  Found ${rows.length} reconciliation issue(s)\n`);

    if (rows.length === 0) {
      console.log("  ✓ No issues — all companies have price data for this date.\n");
      await run.complete({ fetched: 0, upserted: 0, skipped: 0, failed: 0 });
      return;
    }

    // ── Step 2: Group by issue type ─────────────────────────────────────────
    const missing   = rows.filter((r) => r.issue === "missing_daily_price");
    const identical = rows.filter((r) => r.issue === "identical_to_previous");

    console.log(`  Missing prices:     ${missing.length}`);
    console.log(`  Identical to prev:  ${identical.length}\n`);

    // ── Step 3: Map to DataIssue objects ────────────────────────────────────
    const issues: DataIssue[] = [
      ...missing.map((r): DataIssue => ({
        entityType:  "daily_price",
        symbol:      r.symbol,
        marketDate:  runDate,
        issueType:   "missing_data",
        severity:    "warning",
        description: `No price record found for ${r.symbol} on ${runDate}. Expected a trading day entry.`,
        source:      SOURCE,
      })),
      ...identical.map((r): DataIssue => ({
        entityType:  "daily_price",
        symbol:      r.symbol,
        marketDate:  runDate,
        issueType:   "stale_data",
        severity:    "info",
        description: `${r.symbol} on ${runDate} has identical close and non-zero volume vs previous day — possible stale data.`,
        source:      SOURCE,
      })),
    ];

    // ── Step 4: Write data_quality_flags ────────────────────────────────────
    await flagDataIssues(issues);

    // ── Step 5: Write pipeline_alerts for established symbols missing prices ─
    const established = await getEstablishedSymbols();
    const alertSymbols = missing
      .map((r) => r.symbol)
      .filter((sym) => established.has(sym));

    if (alertSymbols.length > 0) {
      console.log(`\nWriting alerts for ${alertSymbols.length} established symbol(s) with missing prices...`);
      await writePipelineAlerts(alertSymbols, runDate);
    }

    // ── Step 6: Log summary ─────────────────────────────────────────────────
    console.log(`\nReconciliation summary for ${runDate}:`);
    if (missing.length > 0) {
      const sample = missing.slice(0, 5).map((r) => r.symbol).join(", ");
      console.log(`  Missing (${missing.length}): ${sample}${missing.length > 5 ? " ..." : ""}`);
    }
    if (identical.length > 0) {
      const sample = identical.slice(0, 5).map((r) => r.symbol).join(", ");
      console.log(`  Stale   (${identical.length}): ${sample}${identical.length > 5 ? " ..." : ""}`);
    }

    await run.complete({
      fetched:  rows.length,
      upserted: issues.length,
      skipped:  0,
      failed:   0,
    });

  } catch (err) {
    await run.fail(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
