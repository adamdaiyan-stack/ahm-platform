/**
 * scripts/pipelines/ingest-daily-prices.ts
 *
 * Pipeline: Fetch PSX EOD prices → validate → upsert into daily_prices + index_history.
 *
 * Usage:
 *   npm run ingest:prices                   # Uses today's PKT date
 *   npm run ingest:prices -- --date=2026-05-19  # Specific date (backfill)
 *   npm run ingest:prices -- --force        # Run even on weekends (for backfill)
 *
 * What this script does:
 *   1. Determines the run date (today PKT or --date argument)
 *   2. Skips weekends unless --force is passed
 *   3. Opens an ingestion_runs log row
 *   4. Fetches data from DPS PSX connector
 *   5. Validates each record (price bounds, OHLC integrity)
 *   6. Upserts valid records into daily_prices
 *   7. Upserts index data into index_history
 *   8. Writes data_quality_flags for any invalid records
 *   9. Closes the ingestion_runs row with final status
 *
 * The pipeline is IDEMPOTENT — running it twice on the same date is safe.
 * ON CONFLICT upsert means re-runs update existing rows, never duplicate.
 */

import { DPSPSXConnector, NormalizedPriceRecord } from "../connectors/dps-psx.js";
import { PipelineLogger }                          from "../utils/pipeline-logger.js";
import { validateDailyPrice, flagDataIssues,
         missingSymbolFlag, DataIssue }            from "../utils/data-quality.js";
import { supabaseAdmin }                           from "../utils/supabase-admin.js";
import { parseDateArg, isWeekend }                 from "../utils/date-utils.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME = "daily_prices";
const SOURCE        = "dps_psx";

// ─── PSX Symbol Normalisation ─────────────────────────────────────────────────
//
// PSX appends trading suffixes to symbols on certain days:
//   XD  — ex-dividend       (e.g. BAFLXD  → BAFL)
//   XB  — ex-bonus          (e.g. HBLXB   → HBL)
//   XR  — ex-rights         (e.g. UCLXR   → UCL)
//   XN  — ex-rights new     (e.g. ENGXN   → ENG)
//   NC  — odd-lot / no cert (e.g. AMTEXNC → AMTEX)
//   IM  — interim / rights  (e.g. MCBIM   → MCB)
//   FUT — futures contract  (stripped entirely)
//
// This does NOT affect symbols whose base name legitimately ends with
// these letters — we only strip when the stripped version is in the
// companies master (see normalizePSXSymbol below).

const PSX_SUFFIXES = ["XD", "XB", "XR", "XN", "NC", "IM", "FUT"] as const;

/**
 * Strips a known PSX trading suffix from a symbol if the resulting
 * base symbol exists in the companies master. Falls back to the
 * original symbol if no match is found.
 */
function normalizePSXSymbol(raw: string, knownSymbols: Set<string>): string {
  if (knownSymbols.has(raw)) return raw; // already a clean match
  for (const suffix of PSX_SUFFIXES) {
    if (raw.endsWith(suffix)) {
      const base = raw.slice(0, -suffix.length);
      if (base.length > 0 && knownSymbols.has(base)) return base;
    }
  }
  return raw; // no match — keep original, will be flagged as missing
}

/** Upsert in batches to avoid hitting Supabase request size limits */
const BATCH_SIZE = 50;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getKnownSymbols(): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("symbol");

  if (error) throw new Error(`Failed to load companies master: ${error.message}`);
  return new Set((data ?? []).map((r: { symbol: string }) => r.symbol));
}

async function getPreviousCloses(
  symbols: string[],
  beforeDate: string
): Promise<Map<string, number>> {
  if (symbols.length === 0) return new Map();

  // Get the most recent close for each symbol before the run date
  const { data, error } = await supabaseAdmin
    .from("daily_prices")
    .select("symbol, close, market_date")
    .in("symbol", symbols)
    .lt("market_date", beforeDate)
    .order("market_date", { ascending: false });

  if (error) {
    console.warn(`[ingest] Could not fetch previous closes: ${error.message}`);
    return new Map();
  }

  // Take the most recent for each symbol
  const map = new Map<string, number>();
  for (const row of (data ?? []) as { symbol: string; close: number }[]) {
    if (!map.has(row.symbol)) {
      map.set(row.symbol, row.close);
    }
  }
  return map;
}

async function upsertPrices(records: NormalizedPriceRecord[]): Promise<{
  upserted: number;
  failed: number;
  errors: unknown[];
}> {
  let upserted = 0;
  let failed   = 0;
  const errors: unknown[] = [];

  // Process in batches
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);

    const rows = batch.map((r) => ({
      symbol:         r.symbol,
      market_date:    r.market_date,
      open:           r.open,
      high:           r.high,
      low:            r.low,
      close:          r.close,
      change:         r.change,
      change_percent: r.change_percent,
      volume:         r.volume,
      source:         r.source,
    }));

    const { error } = await supabaseAdmin
      .from("daily_prices")
      .upsert(rows, {
        onConflict: "symbol,market_date",
        ignoreDuplicates: false,  // We WANT to update if data changes
      });

    if (error) {
      console.error(`[ingest] Batch upsert error (records ${i}–${i + batch.length}): ${error.message}`);
      failed  += batch.length;
      errors.push({ batch: i, error: error.message });
    } else {
      upserted += batch.length;
      process.stdout.write(".");  // Progress indicator
    }
  }

  process.stdout.write("\n");
  return { upserted, failed, errors };
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const runDate = parseDateArg(args);
  const force   = args.includes("--force");

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Price Ingestion Pipeline`);
  console.log(`  Date: ${runDate}  |  Source: ${SOURCE}`);
  console.log(`${"═".repeat(60)}\n`);

  // Skip weekends unless forced
  if (isWeekend(runDate) && !force) {
    const trigger = args.includes("--manual") ? "manual" : "cron";
    const run = await PipelineLogger.start(PIPELINE_NAME, runDate, SOURCE, trigger);
    await run.skip(`${runDate} is a weekend. PSX is closed. Pass --force to override.`);
    return;
  }

  // Open log row
  const trigger = args.includes("--manual") ? "manual"
                : args.includes("--backfill") ? "backfill"
                : "cron";
  const run = await PipelineLogger.start(PIPELINE_NAME, runDate, SOURCE, trigger);

  try {
    // ── Step 1: Load known symbols ──────────────────────────────────────────
    console.log("Loading companies master...");
    const knownSymbols = await getKnownSymbols();
    console.log(`  ${knownSymbols.size} known symbols\n`);

    // ── Step 2: Fetch from PSX ──────────────────────────────────────────────
    console.log("Fetching from DPS PSX...");
    const { prices: rawPrices, indices } = await DPSPSXConnector.fetch(runDate);
    console.log(`  Fetched ${rawPrices.length} security records, ${indices.length} index records\n`);

    // ── Step 3: Validate & filter ───────────────────────────────────────────
    console.log("Validating records...");
    const symbolList = rawPrices.map((r) => r.symbol);
    const prevCloses = await getPreviousCloses(symbolList, runDate);

    const validRecords:   NormalizedPriceRecord[] = [];
    const invalidRecords: NormalizedPriceRecord[] = [];
    const allIssues:      DataIssue[]             = [];

    for (const record of rawPrices) {
      // Normalise PSX trading suffixes (XD, XB, XR, NC, IM, FUT, etc.)
      const normalizedSymbol = normalizePSXSymbol(record.symbol, knownSymbols);
      if (normalizedSymbol !== record.symbol) {
        // Mutate the record in-place — downstream code uses record.symbol
        (record as { symbol: string }).symbol = normalizedSymbol;
      }

      // Check symbol is in master
      if (!knownSymbols.has(record.symbol)) {
        allIssues.push(missingSymbolFlag(record.symbol, SOURCE));
        // Don't skip — still ingest the price, symbol master may be incomplete
        // The flag will alert the analyst to add the symbol
      }

      const prevClose = prevCloses.get(record.symbol) ?? null;
      const issues    = validateDailyPrice(record, prevClose);

      if (issues.some((i) => i.severity === "critical")) {
        // Critical issues skip the record entirely
        invalidRecords.push(record);
        allIssues.push(...issues);
        console.warn(`  ⚠ Skipping ${record.symbol}: ${issues.map((i) => i.description).join("; ")}`);
      } else {
        // Warnings are flagged but record is still ingested
        if (issues.length > 0) allIssues.push(...issues);
        validRecords.push(record);
      }
    }

    console.log(
      `  Valid: ${validRecords.length}  |  ` +
      `Skipped (critical): ${invalidRecords.length}  |  ` +
      `Issues flagged: ${allIssues.length}\n`
    );

    // ── Step 4: Upsert prices ───────────────────────────────────────────────
    console.log(`Upserting ${validRecords.length} records into daily_prices...`);
    const { upserted, failed, errors: upsertErrors } = await upsertPrices(validRecords);
    console.log(`  ✓ Upserted: ${upserted}  |  Failed: ${failed}\n`);

    // ── Step 5: Upsert index history ────────────────────────────────────────
    if (indices.length > 0) {
      console.log("Upserting index history...");
      for (const idx of indices) {
        const { error } = await supabaseAdmin
          .from("index_history")
          .upsert({
            index_symbol:   idx.index_symbol,
            market_date:    idx.market_date,
            open:           idx.open,
            high:           idx.high,
            low:            idx.low,
            close:          idx.close,
            change:         idx.change,
            change_percent: idx.change_percent,
            volume:         idx.volume,
            advances:       idx.advances,
            declines:       idx.declines,
            unchanged:      idx.unchanged,
            source:         idx.source,
          }, { onConflict: "index_symbol,market_date" });

        if (error) {
          console.error(`  Index upsert error: ${error.message}`);
        } else {
          console.log(`  ✓ ${idx.index_symbol}: ${idx.close} (${idx.change_percent?.toFixed(2)}%)\n`);
        }
      }
    }

    // ── Step 6: Write data quality flags ────────────────────────────────────
    if (allIssues.length > 0) {
      await flagDataIssues(allIssues);
    }

    // ── Step 7: Close log row ────────────────────────────────────────────────
    const symbolsFailed = invalidRecords.map((r) => r.symbol);
    await run.complete({
      fetched:       rawPrices.length,
      upserted,
      skipped:       invalidRecords.length,
      failed,
      symbolsFailed: [...symbolsFailed, ...allIssues
        .filter((i) => i.severity === "critical" && i.symbol)
        .map((i) => i.symbol!)],
      errors: upsertErrors.length > 0 ? upsertErrors : undefined,
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
