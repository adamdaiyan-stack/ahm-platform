/**
 * scripts/pipelines/build-daily-snapshots.ts
 *
 * Pipeline: Build precomputed AI context rows in daily_snapshots.
 *
 * Runs AFTER ingest-daily-prices completes.
 * Creates one row per company per trading day with denormalized context
 * for fast AI queries and analytics without multi-table joins.
 *
 * Also computes and persists:
 *   - Sector-level aggregates (top movers, breadth, participation)
 *   - Market regime classification (via market-regime.ts)
 *
 * Usage:
 *   npm run build:daily-snapshots                        # Today
 *   npm run build:daily-snapshots -- --date=2026-05-19   # Specific date
 */

import { supabaseAdmin }            from "../utils/supabase-admin.js";
import { PipelineLogger }           from "../utils/pipeline-logger.js";
import { parseDateArg }             from "../utils/date-utils.js";
import { computeAndPersistRegime }  from "../utils/market-regime.js";

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

// ─── Sector aggregate helpers ─────────────────────────────────────────────────

interface SectorAggregate {
  sector:           string;
  stockCount:       number;
  avgChangePct:     number | null;
  advancingCount:   number;
  decliningCount:   number;
  breadthPct:       number;          // advancing / total with data
  participationPct: number;          // stocks with volume > 0
  topMovers:        string[];        // top 3 symbols by change_percent (ascending order)
  bottomMovers:     string[];        // bottom 3 symbols by change_percent
  totalVolume:      number;
}

function computeSectorAggregates(
  prices: PriceRow[],
  companies: CompanyRow[]
): Map<string, SectorAggregate> {
  const symbolSector = new Map<string, string | null>(
    companies.map((c) => [c.symbol, c.sector])
  );

  // Group prices by sector
  const bySector: Record<string, PriceRow[]> = {};
  for (const p of prices) {
    const sector = symbolSector.get(p.symbol);
    if (!sector) continue;
    if (!bySector[sector]) bySector[sector] = [];
    bySector[sector].push(p);
  }

  const result = new Map<string, SectorAggregate>();

  for (const [sector, rows] of Object.entries(bySector)) {
    const withChange    = rows.filter((r) => r.change_percent != null);
    const withVolume    = rows.filter((r) => (r.volume ?? 0) > 0);
    const advancing     = withChange.filter((r) => (r.change_percent ?? 0) > 0);
    const declining     = withChange.filter((r) => (r.change_percent ?? 0) < 0);

    const avgChangePct = withChange.length > 0
      ? withChange.reduce((s, r) => s + (r.change_percent ?? 0), 0) / withChange.length
      : null;

    const breadthPct = withChange.length > 0
      ? (advancing.length / withChange.length) * 100
      : 0;

    const participationPct = rows.length > 0
      ? (withVolume.length / rows.length) * 100
      : 0;

    // Top 3 gainers (sorted desc) — symbol tickers only
    const sortedDesc = [...withChange].sort(
      (a, b) => (b.change_percent ?? 0) - (a.change_percent ?? 0)
    );
    const topMovers    = sortedDesc.slice(0, 3).map((r) => r.symbol);
    const bottomMovers = sortedDesc.slice(-3).reverse().map((r) => r.symbol);

    const totalVolume = rows.reduce((s, r) => s + (r.volume ?? 0), 0);

    result.set(sector, {
      sector,
      stockCount:       rows.length,
      avgChangePct:     avgChangePct != null ? Number(avgChangePct.toFixed(4)) : null,
      advancingCount:   advancing.length,
      decliningCount:   declining.length,
      breadthPct:       Number(breadthPct.toFixed(2)),
      participationPct: Number(participationPct.toFixed(2)),
      topMovers,
      bottomMovers,
      totalVolume,
    });
  }

  return result;
}

// ─── Supporting data fetchers ─────────────────────────────────────────────────

async function getKSEChangePercent(marketDate: string): Promise<number | null> {
  const { data } = await supabaseAdmin
    .from("index_history")
    .select("change_percent")
    .eq("index_symbol", "KSE-100")
    .eq("market_date", marketDate)
    .single();
  return (data as { change_percent: number | null } | null)?.change_percent ?? null;
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

    const allPrices = prices as PriceRow[];
    const priceMap  = new Map(allPrices.map((p) => [p.symbol, p]));
    const symbols   = [...priceMap.keys()];
    console.log(`  ${symbols.length} symbols with prices\n`);

    // ── Fetch supporting data in parallel ──────────────────────────────────
    console.log("Fetching supporting data...");
    const [companies, fundamentals, kseChangePct] = await Promise.all([
      supabaseAdmin
        .from("companies")
        .select("symbol, sector, market_cap, pe_ratio, dividend_yield, week_52_high, week_52_low")
        .in("symbol", symbols)
        .then((r) => (r.data ?? []) as CompanyRow[]),
      getLatestFundamentals(symbols),
      getKSEChangePercent(runDate),
    ]);

    const companyMap = new Map(companies.map((c) => [c.symbol, c]));
    console.log(`  Companies: ${companies.length} | KSE-100: ${kseChangePct?.toFixed(2) ?? "—"}%\n`);

    // ── Compute sector aggregates ──────────────────────────────────────────
    console.log("Computing sector aggregates...");
    const sectorAggregates = computeSectorAggregates(allPrices, companies);
    for (const [sector, agg] of sectorAggregates) {
      const sign = (agg.avgChangePct ?? 0) >= 0 ? "+" : "";
      console.log(
        `  ${sector.padEnd(20)} ${sign}${(agg.avgChangePct ?? 0).toFixed(2)}% ` +
        `| breadth ${agg.breadthPct.toFixed(0)}% ` +
        `| top: ${agg.topMovers.join(", ")}`
      );
    }
    console.log();

    // ── Compute sector market cap ranks ────────────────────────────────────
    const sectorRanks = new Map<string, Map<string, number>>();
    for (const company of companies) {
      if (!company.sector || !company.market_cap) continue;
      if (!sectorRanks.has(company.sector)) sectorRanks.set(company.sector, new Map());
    }
    for (const [sector, rankMap] of sectorRanks) {
      const sorted = companies
        .filter((c) => c.sector === sector && c.market_cap != null)
        .sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0));
      sorted.forEach((c, i) => rankMap.set(c.symbol, i + 1));
    }

    // ── Build per-company snapshot rows ────────────────────────────────────
    console.log("Building snapshot rows...");
    const snapshotRows = [];

    for (const symbol of symbols) {
      const price   = priceMap.get(symbol)!;
      const company = companyMap.get(symbol);
      const funds   = fundamentals.get(symbol);

      const sector       = company?.sector ?? null;
      const sectorAgg    = sector ? sectorAggregates.get(sector) : undefined;
      const sectorAvgChg = sectorAgg?.avgChangePct ?? null;

      const relPerf = price.change_percent != null && kseChangePct != null
        ? Number((price.change_percent - kseChangePct).toFixed(4))
        : null;

      const w52h         = company?.week_52_high ?? null;
      const pctFrom52wHigh = w52h && price.close
        ? Number(((price.close - w52h) / w52h * 100).toFixed(2))
        : null;

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

    // ── Upsert per-company snapshots in batches ────────────────────────────
    console.log(`\nUpserting ${snapshotRows.length} snapshot rows...`);
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

    // ── Compute and persist market regime ──────────────────────────────────
    console.log("\nClassifying market regime...");
    const regimeState = await computeAndPersistRegime(runDate);

    // ── Log sector aggregates to console for ops visibility ───────────────
    console.log("\nSector summary:");
    for (const [, agg] of sectorAggregates) {
      console.log(
        `  ${agg.sector.padEnd(20)} ` +
        `adv:${agg.advancingCount} dec:${agg.decliningCount} ` +
        `vol:${(agg.totalVolume / 1_000_000).toFixed(0)}M`
      );
    }

    // ── Complete pipeline log ──────────────────────────────────────────────
    await run.complete({
      fetched:  symbols.length,
      upserted,
      failed,
      errorSummary: failed > 0 ? `${failed} snapshot rows failed to upsert` : undefined,
      errors: regimeState
        ? { regime: regimeState.regime, confidence: regimeState.confidence }
        : undefined,
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
