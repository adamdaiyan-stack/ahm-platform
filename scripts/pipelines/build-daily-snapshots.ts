/**
 * scripts/pipelines/build-daily-snapshots.ts
 *
 * Pipeline: Build precomputed AI context rows in daily_snapshots.
 *
 * Runs AFTER sync-company-snapshots completes.
 * Creates one row per company per trading day with denormalized context
 * for fast AI queries and analytics without multi-table joins.
 *
 * MVP: Populates core price + fundamental fields.
 * Phase 2 will add: technical signals, macro context, relative strength.
 *
 * Usage:
 *   npm run build:daily-snapshots                        # Today
 *   npm run build:daily-snapshots -- --date=2026-05-19   # Specific date
 */

import { supabaseAdmin }  from "../utils/supabase-admin.js";
import { PipelineLogger } from "../utils/pipeline-logger.js";
import { parseDateArg }   from "../utils/date-utils.js";

const PIPELINE_NAME = "daily_snapshots";
const SOURCE        = "pipeline";
const BATCH_SIZE    = 50;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PriceRow {
  symbol:         string;
  close:          number;
  change_percent: number | null;
  volume:         number | null;
}

interface CompanyRow {
  symbol:         string;
  sector:         string | null;
  market_cap:     number | null;
  pe_ratio:       number | null;
  dividend_yield: number | null;
  week_52_high:   number | null;
  week_52_low:    number | null;
}

interface FinancialRow {
  symbol:     string;
  eps:        number | null;
  roe:        number | null;
  net_margin: number | null;
  pb_ratio:   number | null;
  ev_ebitda:  number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getKSEChangePercent(marketDate: string): Promise<number | null> {
  const { data } = await supabaseAdmin
    .from("index_history")
    .select("change_percent")
    .eq("index_symbol", "KSE-100")
    .eq("market_date", marketDate)
    .single();
  return (data as { change_percent: number | null } | null)?.change_percent ?? null;
}

async function getSectorAverages(
  marketDate: string
): Promise<Map<string, number | null>> {
  const { data } = await supabaseAdmin
    .from("daily_prices")
    .select("symbol, change_percent")
    .eq("market_date", marketDate);

  if (!data) return new Map();

  // Get sector for each symbol from companies
  const { data: companies } = await supabaseAdmin
    .from("companies")
    .select("symbol, sector");

  if (!companies) return new Map();

  const symbolSector = new Map(
    (companies as { symbol: string; sector: string | null }[])
      .map((c) => [c.symbol, c.sector])
  );

  // Compute average change_pct per sector
  const sectorSums: Record<string, { sum: number; count: number }> = {};
  for (const row of data as PriceRow[]) {
    const sector = symbolSector.get(row.symbol);
    if (!sector || row.change_percent == null) continue;
    if (!sectorSums[sector]) sectorSums[sector] = { sum: 0, count: 0 };
    sectorSums[sector].sum   += row.change_percent;
    sectorSums[sector].count += 1;
  }

  const result = new Map<string, number | null>();
  for (const [sector, { sum, count }] of Object.entries(sectorSums)) {
    result.set(sector, count > 0 ? sum / count : null);
  }
  return result;
}

async function getLatestFundamentals(
  symbols: string[]
): Promise<Map<string, FinancialRow>> {
  if (symbols.length === 0) return new Map();

  const { data } = await supabaseAdmin
    .from("financial_metrics")
    .select("symbol, eps, roe, net_margin, pb_ratio, ev_ebitda, period_end_date")
    .in("symbol", symbols)
    .eq("period_type", "annual")
    .order("period_end_date", { ascending: false });

  const map = new Map<string, FinancialRow>();
  for (const row of (data ?? []) as (FinancialRow & { period_end_date: string })[]) {
    if (!map.has(row.symbol)) map.set(row.symbol, row);
  }
  return map;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const runDate = parseDateArg(args);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Daily Snapshots Builder`);
  console.log(`  Date: ${runDate}`);
  console.log(`${"═".repeat(60)}\n`);

  const run = await PipelineLogger.start(PIPELINE_NAME, runDate, SOURCE, "cron");

  try {
    // ── Fetch price data for this date ─────────────────────────────────────
    console.log(`Fetching daily_prices for ${runDate}...`);
    const { data: prices, error: priceErr } = await supabaseAdmin
      .from("daily_prices")
      .select("symbol, close, change_percent, volume")
      .eq("market_date", runDate);

    if (priceErr) throw new Error(`daily_prices fetch failed: ${priceErr.message}`);
    if (!prices || prices.length === 0) {
      await run.skip(`No prices for ${runDate}. Run ingest:prices first.`);
      return;
    }

    const priceMap = new Map(
      (prices as PriceRow[]).map((p) => [p.symbol, p])
    );
    const symbols = [...priceMap.keys()];
    console.log(`  ${symbols.length} symbols with prices\n`);

    // ── Fetch supporting data in parallel ──────────────────────────────────
    console.log("Fetching supporting data...");
    const [companies, fundamentals, kseChangePct, sectorAvgs] = await Promise.all([
      supabaseAdmin
        .from("companies")
        .select("symbol, sector, market_cap, pe_ratio, dividend_yield, week_52_high, week_52_low")
        .in("symbol", symbols)
        .then((r) => (r.data ?? []) as CompanyRow[]),
      getLatestFundamentals(symbols),
      getKSEChangePercent(runDate),
      getSectorAverages(runDate),
    ]);

    const companyMap = new Map(companies.map((c) => [c.symbol, c]));

    // ── Compute sector market cap ranks ────────────────────────────────────
    // Sort companies within each sector by market_cap for ranking
    const sectorRanks = new Map<string, Map<string, number>>();
    for (const company of companies) {
      if (!company.sector || !company.market_cap) continue;
      if (!sectorRanks.has(company.sector)) {
        sectorRanks.set(company.sector, new Map());
      }
    }
    // Rank by market_cap descending within sector
    for (const [sector, rankMap] of sectorRanks) {
      const sectorCompanies = companies
        .filter((c) => c.sector === sector && c.market_cap != null)
        .sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0));
      sectorCompanies.forEach((c, i) => rankMap.set(c.symbol, i + 1));
    }

    // ── Build snapshot rows ────────────────────────────────────────────────
    console.log("\nBuilding snapshot rows...");
    const snapshotRows = [];

    for (const symbol of symbols) {
      const price   = priceMap.get(symbol)!;
      const company = companyMap.get(symbol);
      const funds   = fundamentals.get(symbol);

      const sector         = company?.sector ?? null;
      const sectorAvgChg   = sector ? (sectorAvgs.get(sector) ?? null) : null;
      const relPerf        = price.change_percent != null && kseChangePct != null
        ? Number((price.change_percent - kseChangePct).toFixed(4))
        : null;

      // 52w high/low pct
      const w52h = company?.week_52_high ?? null;
      const pctFrom52wHigh = w52h && price.close
        ? Number(((price.close - w52h) / w52h * 100).toFixed(2))
        : null;

      // Sector rank
      const sectorRank = sector
        ? (sectorRanks.get(sector)?.get(symbol) ?? null)
        : null;

      snapshotRows.push({
        symbol,
        snapshot_date:            runDate,
        close:                    price.close,
        change_percent:           price.change_percent,
        volume:                   price.volume,
        market_cap:               company?.market_cap ?? null,

        // Fundamentals
        pe_ratio:                 company?.pe_ratio ?? null,
        pb_ratio:                 funds?.pb_ratio ?? null,
        ev_ebitda:                funds?.ev_ebitda ?? null,
        eps_ttm:                  funds?.eps ?? null,
        roe:                      funds?.roe ?? null,
        net_margin:               funds?.net_margin ?? null,
        dividend_yield:           company?.dividend_yield ?? null,

        // 52w position
        week_52_high:             company?.week_52_high ?? null,
        week_52_low:              company?.week_52_low  ?? null,
        pct_from_52w_high:        pctFrom52wHigh,

        // Market context
        sector,
        sector_rank:              sectorRank,
        market_rank:              null,  // Phase 2: rank across all companies
        sector_avg_change_pct:    sectorAvgChg ? Number(sectorAvgChg.toFixed(4)) : null,
        kse100_change_pct:        kseChangePct,
        relative_performance_pct: relPerf,

        // Technical (Phase 2 — leave null)
        ma_20: null, ma_50: null, ma_200: null, rsi_14: null,
        relative_strength_30d: null, relative_strength_90d: null,
        volatility_30d: null,

        // AI context (Phase 2 — leave null)
        macro_context: null, technical_context: null,
        valuation_context: null, latest_catalyst_summary: null,
        latest_risk_summary: null,

        source: SOURCE,
      });
    }

    // ── Upsert in batches ──────────────────────────────────────────────────
    console.log(`Upserting ${snapshotRows.length} snapshot rows...`);
    let upserted = 0;
    let failed   = 0;

    for (let i = 0; i < snapshotRows.length; i += BATCH_SIZE) {
      const batch = snapshotRows.slice(i, i + BATCH_SIZE);
      const { error } = await supabaseAdmin
        .from("daily_snapshots")
        .upsert(batch, { onConflict: "symbol,snapshot_date" });

      if (error) {
        console.error(`  Batch ${i} upsert error: ${error.message}`);
        failed += batch.length;
      } else {
        upserted += batch.length;
        process.stdout.write(".");
      }
    }

    process.stdout.write("\n");
    console.log(`\n  ✓ Upserted: ${upserted}  |  Failed: ${failed}`);

    await run.complete({ fetched: symbols.length, upserted, failed });

  } catch (err) {
    await run.fail(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
