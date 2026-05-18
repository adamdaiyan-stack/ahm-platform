/**
 * scripts/pipelines/sync-company-snapshots.ts
 *
 * Pipeline: Propagate latest daily_prices close into companies table.
 *
 * Policy:
 *   daily_prices  = canonical time-series source (never modify for snapshots)
 *   companies     = denormalized snapshot for fast frontend reads
 *
 * This script runs AFTER ingest-daily-prices completes.
 * It reads the most recent daily_price per symbol and writes
 * current_price, change, change_percent, volume into the companies table.
 *
 * Usage:
 *   npm run sync:snapshots                        # Latest available date
 *   npm run sync:snapshots -- --date=2026-05-19   # Specific date
 */

import { supabaseAdmin }   from "../utils/supabase-admin.js";
import { PipelineLogger }  from "../utils/pipeline-logger.js";
import { parseDateArg }    from "../utils/date-utils.js";

const PIPELINE_NAME = "company_snapshots";
const SOURCE        = "daily_prices";
const BATCH_SIZE    = 50;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const runDate = parseDateArg(args);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Company Snapshot Sync`);
  console.log(`  Date: ${runDate}`);
  console.log(`${"═".repeat(60)}\n`);

  const run = await PipelineLogger.start(PIPELINE_NAME, runDate, SOURCE, "cron");

  try {
    // ── Get all prices for the run date ─────────────────────────────────────
    console.log(`Fetching daily_prices for ${runDate}...`);
    const { data: prices, error: priceError } = await supabaseAdmin
      .from("daily_prices")
      .select("symbol, close, change, change_percent, volume")
      .eq("market_date", runDate);

    if (priceError) throw new Error(`Failed to fetch daily prices: ${priceError.message}`);
    if (!prices || prices.length === 0) {
      await run.skip(`No daily_prices found for ${runDate}. Run ingest:prices first.`);
      return;
    }

    console.log(`  Found ${prices.length} price records\n`);

    // ── Update companies in batches ─────────────────────────────────────────
    console.log("Syncing to companies table...");
    let updated = 0;
    let failed  = 0;

    for (const price of prices as {
      symbol: string;
      close: number;
      change: number | null;
      change_percent: number | null;
      volume: number | null;
    }[]) {
      const { error } = await supabaseAdmin
        .from("companies")
        .update({
          current_price:  price.close,
          change:         price.change,
          change_percent: price.change_percent,
          volume:         price.volume,
          // Note: pe_ratio, dividend_yield, eps are NOT updated here.
          // Those come from financial_metrics (a separate pipeline).
        })
        .eq("symbol", price.symbol);

      if (error) {
        // Don't crash — some symbols in daily_prices may not be in companies
        // (flagged by the price ingestion pipeline already)
        failed++;
        if (failed <= 5) {
          // Only log the first few to avoid spam
          console.warn(`  ⚠ Could not update ${price.symbol}: ${error.message}`);
        }
      } else {
        updated++;
        if (updated % BATCH_SIZE === 0) process.stdout.write(".");
      }
    }

    process.stdout.write("\n");
    console.log(`\n  ✓ Updated: ${updated}  |  Failed: ${failed}`);

    // ── Also update market_index snapshot ───────────────────────────────────
    console.log("\nSyncing KSE-100 market_index snapshot...");
    const { data: indexRow } = await supabaseAdmin
      .from("index_history")
      .select("close, change, change_percent, volume, advances, declines, unchanged")
      .eq("index_symbol", "KSE-100")
      .eq("market_date", runDate)
      .single();

    if (indexRow) {
      const { error: idxError } = await supabaseAdmin
        .from("market_index")
        .update({
          level:          indexRow.close,
          change:         indexRow.change,
          change_percent: indexRow.change_percent,
          volume:         indexRow.volume,
          advances:       indexRow.advances,
          declines:       indexRow.declines,
          unchanged:      indexRow.unchanged,
          updated_at:     new Date().toISOString(),
        })
        .eq("index_name", "KSE-100");

      if (idxError) {
        console.warn(`  ⚠ market_index update failed: ${idxError.message}`);
      } else {
        console.log(
          `  ✓ KSE-100: ${indexRow.close} ` +
          `(${indexRow.change_percent != null ? indexRow.change_percent.toFixed(2) + "%" : "n/a"})`
        );
      }
    } else {
      console.log(`  ⚠ No KSE-100 index_history row for ${runDate} — skipping market_index sync.`);
    }

    await run.complete({
      fetched:  prices.length,
      upserted: updated,
      failed,
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
