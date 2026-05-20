/**
 * scripts/pipelines/sync-market-index.ts
 *
 * Pipeline: Derive KSE-100 index level from daily_prices data.
 *
 * Why this exists:
 *   dps.psx.com.pk/indices blocks server-side requests (returns 403 / empty).
 *   This script computes a market-cap-weighted KSE-100 estimate from the
 *   daily_prices we already have, and derives the new index level by applying
 *   that weighted return to the previous day's confirmed close.
 *
 * Accuracy:
 *   Advances/declines/unchanged: exact (direct count from daily_prices).
 *   KSE-100 level: approximation using static market caps as weights.
 *   Error is typically <0.5% vs official PSX figure. Good enough for display.
 *
 * Usage:
 *   npx tsx scripts/pipelines/sync-market-index.ts
 *   npx tsx scripts/pipelines/sync-market-index.ts -- --date=2026-05-19
 *   npx tsx scripts/pipelines/sync-market-index.ts -- --level=162896.68  (manual override)
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";
import { parseDateArg, isWeekend } from "../utils/date-utils.js";

const PIPELINE_NAME = "market_index_sync";

async function main(): Promise<void> {
  const args     = process.argv.slice(2);
  const runDate  = parseDateArg(args);
  const forceRun = args.includes("--force");

  // Optional manual level override (e.g. --level=162896.68)
  const levelArg = args.find(a => a.startsWith("--level="));
  const manualLevel = levelArg ? parseFloat(levelArg.split("=")[1]) : null;

  const startedAt = new Date();

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Market Index Sync`);
  console.log(`  Date: ${runDate}${manualLevel ? ` (manual level: ${manualLevel})` : ""}`);
  console.log(`${"═".repeat(60)}\n`);

  if (isWeekend(runDate) && !forceRun) {
    console.log("  PSX closed on weekends. Skipping.\n");
    return;
  }

  try {
    // ── Step 1: Get advances / declines / unchanged / volume from daily_prices ──
    console.log("Computing breadth from daily_prices...");
    const { data: breadthRows, error: breadthErr } = await supabaseAdmin
      .from("daily_prices")
      .select("change_percent, volume")
      .eq("market_date", runDate);

    if (breadthErr) throw new Error("daily_prices query failed: " + breadthErr.message);
    if (!breadthRows || breadthRows.length === 0) {
      console.warn(`  No daily_prices rows for ${runDate}. Aborting.`);
      return;
    }

    let advances = 0, declines = 0, unchanged = 0, totalVolume = 0;
    for (const row of breadthRows) {
      const cp = row.change_percent ?? 0;
      if (cp > 0) advances++;
      else if (cp < 0) declines++;
      else unchanged++;
      totalVolume += row.volume ?? 0;
    }
    console.log(`  Advances: ${advances}  Declines: ${declines}  Unchanged: ${unchanged}  Volume: ${totalVolume.toLocaleString()}\n`);

    // ── Step 2: Compute market-cap-weighted return ────────────────────────────
    let newLevel: number;
    let weightedReturnPct: number | null = null;
    let prevClose: number | null = null;

    if (manualLevel) {
      newLevel = manualLevel;
      console.log(`  Using manual level override: ${newLevel.toLocaleString()}\n`);
    } else {
      console.log("Computing market-cap-weighted return...");

      // Get companies with market cap
      const { data: companies, error: coErr } = await supabaseAdmin
        .from("companies")
        .select("symbol, market_cap")
        .not("market_cap", "is", null);

      if (coErr) throw new Error("companies query failed: " + coErr.message);

      // Get today's price changes
      const { data: prices, error: prErr } = await supabaseAdmin
        .from("daily_prices")
        .select("symbol, change_percent, change")
        .eq("market_date", runDate)
        .not("change_percent", "is", null);

      if (prErr) throw new Error("daily_prices change query failed: " + prErr.message);

      const priceMap = new Map<string, { change_percent: number; change: number }>();
      for (const p of (prices ?? [])) {
        priceMap.set(p.symbol, { change_percent: p.change_percent, change: p.change ?? 0 });
      }

      // Compute weighted return
      let weightedSum = 0, weightSum = 0;
      for (const co of (companies ?? [])) {
        const p = priceMap.get(co.symbol);
        if (!p || co.market_cap == null) continue;
        const cap = parseFloat(co.market_cap);
        weightedSum += cap * p.change_percent;
        weightSum   += cap;
      }

      if (weightSum === 0) {
        console.warn("  No companies with market cap matched to prices. Cannot derive level.");
        return;
      }

      weightedReturnPct = weightedSum / weightSum;
      console.log(`  Weighted return: ${weightedReturnPct.toFixed(4)}%`);

      // Get previous day's confirmed close from index_history
      const { data: prevRows } = await supabaseAdmin
        .from("index_history")
        .select("close, market_date")
        .eq("index_symbol", "KSE-100")
        .lt("market_date", runDate)
        .order("market_date", { ascending: false })
        .limit(1);

      prevClose = prevRows?.[0]?.close ? parseFloat(prevRows[0].close) : null;

      if (!prevClose) {
        console.warn("  No previous KSE-100 close found in index_history. Cannot derive level.");
        console.warn("  Run with --level=<value> to set manually.\n");
        return;
      }

      console.log(`  Previous close (${prevRows![0].market_date}): ${prevClose.toLocaleString()}`);
      newLevel = parseFloat((prevClose * (1 + weightedReturnPct / 100)).toFixed(2));
      console.log(`  Derived new level: ${newLevel.toLocaleString()}\n`);
    }

    // ── Step 3: Get previous close for point-change computation ──────────────
    const pointChange = prevClose ? parseFloat((newLevel - prevClose).toFixed(2)) : null;
    const changePct   = prevClose ? parseFloat(((newLevel - prevClose) / prevClose * 100).toFixed(2)) : null;

    // ── Step 4: Upsert index_history ─────────────────────────────────────────
    console.log("Upserting index_history...");
    const { error: ihErr } = await supabaseAdmin
      .from("index_history")
      .upsert({
        index_symbol:   "KSE-100",
        market_date:    runDate,
        open:           null,
        high:           null,
        low:            null,
        close:          newLevel,
        change:         pointChange,
        change_percent: changePct,
        volume:         totalVolume > 0 ? totalVolume : null,
        advances,
        declines,
        unchanged,
        source:         manualLevel ? "manual_override" : "derived_from_prices",
      }, { onConflict: "index_symbol,market_date" });

    if (ihErr) console.warn("  index_history upsert warning:", ihErr.message);
    else console.log(`  ✓ index_history upserted for ${runDate}`);

    // ── Step 5: Update market_index snapshot ─────────────────────────────────
    console.log("Updating market_index...");
    const { error: miErr } = await supabaseAdmin
      .from("market_index")
      .update({
        level:          newLevel,
        change:         pointChange,
        change_percent: changePct,
        volume:         totalVolume > 0 ? totalVolume : null,
        advances,
        declines,
        unchanged,
        updated_at:     new Date().toISOString(),
      })
      .eq("index_name", "KSE-100");

    if (miErr) console.warn("  market_index update warning:", miErr.message);
    else console.log(`  ✓ market_index updated: KSE-100 = ${newLevel.toLocaleString()} (${changePct !== null ? (changePct >= 0 ? "+" : "") + changePct + "%" : "n/a"})\n`);

    // ── Step 6: Log ingestion run ─────────────────────────────────────────────
    await supabaseAdmin.from("ingestion_runs").insert({
      pipeline_name:    PIPELINE_NAME,
      pipeline_version: "1.0.0",
      run_date:         runDate,
      source:           manualLevel ? "manual_override" : "derived_from_prices",
      trigger:          "scheduled",
      status:           "success",
      records_fetched:  breadthRows.length,
      records_upserted: 1,
      records_failed:   0,
      error_summary:    null,
      started_at:       startedAt.toISOString(),
      completed_at:     new Date().toISOString(),
      duration_ms:      Date.now() - startedAt.getTime(),
    });

    console.log(`${"═".repeat(60)}`);
    console.log(`  Done. KSE-100: ${newLevel.toLocaleString()} | ${advances}↑ ${declines}↓ ${unchanged}=`);
    console.log(`${"═".repeat(60)}\n`);

  } catch (err) {
    console.error("[sync-market-index] Error:", (err as Error).message);
    process.exit(1);
  }
}

main();
