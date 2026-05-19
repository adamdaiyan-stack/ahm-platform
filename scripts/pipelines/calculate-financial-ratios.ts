/**
 * scripts/pipelines/calculate-financial-ratios.ts
 *
 * Reads financial_metrics rows, computes all ratios using ratio-engine.ts,
 * and writes results to financial_ratio_snapshots.
 * Also updates companies.pe_ratio, companies.eps, companies.dividend_yield,
 * companies.pb_ratio from the latest annual metrics.
 *
 * Usage:
 *   npm run calc:ratios                         # All companies, latest period
 *   npm run calc:ratios -- --symbol=HBL         # Single company
 *   npm run calc:ratios -- --period=FY24        # Specific period for all
 *   npm run calc:ratios -- --all-periods        # All historical periods
 */

import { supabaseAdmin }    from "../utils/supabase-admin.js";
import { computeRatios,
         computeCAGR3Y,
         ratioSnapshotToDbRow } from "../utils/ratio-engine.js";
import { parsePeriodKey,
         getPriorYearPeriod }   from "../utils/period-utils.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME = "calculate_financial_ratios";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAllSymbolsWithMetrics(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("financial_metrics")
    .select("symbol")
    .order("symbol");
  if (error) throw new Error(`Failed to fetch symbols: ${error.message}`);
  return [...new Set((data ?? []).map((r: { symbol: string }) => r.symbol))];
}

async function getMetricsForSymbol(symbol: string): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabaseAdmin
    .from("financial_metrics")
    .select("*")
    .eq("symbol", symbol)
    .order("period_end_date", { ascending: false });
  if (error) throw new Error(`Failed to fetch metrics for ${symbol}: ${error.message}`);
  return (data ?? []) as Record<string, unknown>[];
}

async function getCompanyPrice(symbol: string): Promise<{ price: number | null; marketCap: number | null }> {
  const { data } = await supabaseAdmin
    .from("companies")
    .select("current_price, market_cap")
    .eq("symbol", symbol)
    .single();
  return {
    price:     (data as { current_price: number | null } | null)?.current_price ?? null,
    marketCap: (data as { market_cap: number | null } | null)?.market_cap ?? null,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args       = process.argv.slice(2);
  const symbolArg  = args.find((a) => a.startsWith("--symbol="))?.replace("--symbol=", "");
  const periodArg  = args.find((a) => a.startsWith("--period="))?.replace("--period=", "");
  const allPeriods = args.includes("--all-periods");
  const startedAt  = new Date();
  const today      = startedAt.toISOString().slice(0, 10);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Financial Ratio Calculator`);
  console.log(`  Date: ${today}`);
  if (symbolArg)  console.log(`  Symbol: ${symbolArg}`);
  if (periodArg)  console.log(`  Period: ${periodArg}`);
  if (allPeriods) console.log(`  Mode: ALL historical periods`);
  console.log(`${"═".repeat(60)}\n`);

  const symbols = symbolArg
    ? [symbolArg.toUpperCase()]
    : await getAllSymbolsWithMetrics();

  console.log(`Processing ${symbols.length} symbols...\n`);

  let totalUpserted = 0;
  let totalFailed   = 0;

  for (const symbol of symbols) {
    const allMetrics = await getMetricsForSymbol(symbol);
    if (allMetrics.length === 0) continue;

    const { price, marketCap } = await getCompanyPrice(symbol);

    // Determine which periods to process
    let periodsToProcess = allMetrics;
    if (periodArg) {
      periodsToProcess = allMetrics.filter(
        (m) => String(m.period).toUpperCase() === periodArg.toUpperCase(),
      );
    } else if (!allPeriods) {
      // Default: only latest annual and latest of each other period type
      const latestAnnual = allMetrics.find((m) => m.period_type === "annual");
      const latestHalf   = allMetrics.find((m) => m.period_type === "half_year");
      const latestQtr    = allMetrics.find((m) =>
        m.period_type === "quarter" || m.period_type === "nine_month",
      );
      periodsToProcess = [latestAnnual, latestHalf, latestQtr].filter(Boolean) as typeof allMetrics;
    }

    for (const metricsRow of periodsToProcess) {
      const periodKey  = String(metricsRow.period ?? "");
      const periodType = String(metricsRow.period_type ?? "");

      // Get prior year for growth calculations
      const priorPeriodKey = getPriorYearPeriod(periodKey);
      const priorMetrics   = priorPeriodKey
        ? allMetrics.find((m) => String(m.period).toUpperCase() === priorPeriodKey.toUpperCase())
        : null;

      // Shares outstanding
      const sharesFromMetrics = metricsRow.shares_outstanding as number | null;
      const sharesFromMarket  = marketCap && price && price > 0
        ? marketCap / price  // Approximation: market_cap (millions PKR) / price
        : null;
      const shares = sharesFromMetrics ?? sharesFromMarket ?? null;

      const market = {
        price:             price,
        marketCap:         marketCap,
        sharesOutstanding: shares,
      };

      // Compute ratios
      const ratios = computeRatios(
        metricsRow as Parameters<typeof computeRatios>[0],
        market,
        priorMetrics as Parameters<typeof computeRatios>[2],
      );

      // Try to compute 3Y CAGR if we have enough history
      const threeYearPriorKey = getPriorYearPeriod(priorPeriodKey ?? "");
      const threeYearMetrics  = threeYearPriorKey
        ? allMetrics.find((m) => String(m.period).toUpperCase() === threeYearPriorKey.toUpperCase())
        : null;

      const parsed = parsePeriodKey(periodKey);
      const isTtm  = parsed?.isTTM ?? false;

      const dbRow = {
        ...ratioSnapshotToDbRow(symbol, periodKey, periodType, today, isTtm, ratios),
        revenue_cagr_3y: computeCAGR3Y(
          metricsRow.revenue as number | null,
          threeYearMetrics?.revenue as number | null,
        ),
        pat_cagr_3y: computeCAGR3Y(
          metricsRow.pat as number | null,
          threeYearMetrics?.pat as number | null,
        ),
      };

      const { error } = await supabaseAdmin
        .from("financial_ratio_snapshots")
        .upsert(dbRow, { onConflict: "symbol,period_key,snapshot_date" });

      if (error) {
        console.error(`  ✗ ${symbol} ${periodKey}: ${error.message}`);
        totalFailed++;
      } else {
        totalUpserted++;
      }
    }

    // Update companies snapshot fields from latest annual
    const latestAnnual = allMetrics.find((m) => m.period_type === "annual");
    if (latestAnnual) {
      const epsVal           = (latestAnnual.eps as number | null) ?? null;
      const divYield         = (latestAnnual.dividend_yield as number | null) ?? null;
      const sharesFromMetrics = (latestAnnual.shares_outstanding as number | null) ?? null;

      const peRatioComputed = epsVal && price && epsVal !== 0
        ? Math.round((price / epsVal) * 100) / 100
        : null;
      const pbRatioComputed = sharesFromMetrics && marketCap
        ? Math.round((marketCap / (sharesFromMetrics * ((latestAnnual.total_equity as number | null) ?? 0) / sharesFromMetrics)) * 100) / 100
        : null;

      const updateFields: Record<string, unknown> = {};
      if (epsVal        != null) updateFields.eps           = epsVal;
      if (peRatioComputed != null) updateFields.pe_ratio    = peRatioComputed;
      if (divYield      != null) updateFields.dividend_yield = divYield;

      if (Object.keys(updateFields).length > 0) {
        await supabaseAdmin
          .from("companies")
          .update(updateFields)
          .eq("symbol", symbol);
      }
    }

    process.stdout.write(`  ✓ ${symbol} (${periodsToProcess.length} periods)\n`);
  }

  // ── Log run ──────────────────────────────────────────────────────────────────
  await supabaseAdmin.from("ingestion_runs").insert({
    pipeline_name:    PIPELINE_NAME,
    pipeline_version: "1.0.0",
    run_date:         today,
    source:           "computed",
    trigger:          "manual",
    status:           totalFailed > 0 ? "failed" : "completed",
    records_fetched:  symbols.length,
    records_upserted: totalUpserted,
    records_failed:   totalFailed,
    error_summary:    totalFailed > 0 ? `${totalFailed} ratio snapshots failed` : null,
    started_at:       startedAt.toISOString(),
    completed_at:     new Date().toISOString(),
    duration_ms:      Date.now() - startedAt.getTime(),
  });

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Done. ${totalUpserted} ratio snapshots written.`);
  if (totalFailed > 0) console.log(`  ✗ ${totalFailed} failed.`);
  console.log(`${"═".repeat(60)}\n`);

  if (totalFailed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
