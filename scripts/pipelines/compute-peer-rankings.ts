/**
 * scripts/pipelines/compute-peer-rankings.ts
 *
 * Computes sector-relative peer rankings for every symbol in
 * financial_ratio_snapshots and writes them into the peer_context JSONB column.
 *
 * For each metric, each company gets:
 *   - rank:        Position within its sector (1 = best)
 *   - percentile:  0–100, where 100 = best in sector
 *   - sector_avg:  Simple average across the sector
 *   - sector_n:    Number of companies with data for this metric
 *   - best:        Best value in sector
 *   - worst:       Worst value in sector
 *
 * "Best" direction is metric-specific:
 *   - High is better: ROE, margins, current_ratio, coverage_ratio, etc.
 *   - Low is better:  PE ratio, NPL ratio, D/E, cost_to_income, etc.
 *
 * Usage:
 *   npm run compute:peers                      # Latest snapshot date
 *   npm run compute:peers -- --date=2026-05-19 # Specific date
 *   npm run compute:peers -- --period=FY24     # Specific period
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME = "compute_peer_rankings";

// ── Metrics to rank, with direction ─────────────────────────────────────────
// 'higher_better' → rank 1 = highest value
// 'lower_better'  → rank 1 = lowest value
const RANKED_METRICS: Array<{ key: string; direction: "higher_better" | "lower_better" }> = [
  // Valuation (lower PE is better for value; higher yield is better)
  { key: "pe_ratio",          direction: "lower_better"  },
  { key: "pb_ratio",          direction: "lower_better"  },
  { key: "ev_ebitda",         direction: "lower_better"  },
  { key: "ps_ratio",          direction: "lower_better"  },
  { key: "dividend_yield",    direction: "higher_better" },
  { key: "fcf_yield",         direction: "higher_better" },

  // Profitability (higher is better)
  { key: "gross_margin",      direction: "higher_better" },
  { key: "ebitda_margin",     direction: "higher_better" },
  { key: "operating_margin",  direction: "higher_better" },
  { key: "net_margin",        direction: "higher_better" },
  { key: "roe",               direction: "higher_better" },
  { key: "roa",               direction: "higher_better" },
  { key: "roce",              direction: "higher_better" },

  // Growth (higher is better)
  { key: "revenue_growth",    direction: "higher_better" },
  { key: "pat_growth",        direction: "higher_better" },
  { key: "eps_growth",        direction: "higher_better" },
  { key: "revenue_cagr_3y",   direction: "higher_better" },
  { key: "pat_cagr_3y",       direction: "higher_better" },

  // Leverage (lower is better, except current_ratio and interest_cover)
  { key: "debt_to_equity",    direction: "lower_better"  },
  { key: "net_debt_to_ebitda",direction: "lower_better"  },
  { key: "current_ratio",     direction: "higher_better" },
  { key: "interest_cover",    direction: "higher_better" },

  // Cash flow (higher is better)
  { key: "cfo_to_pat",        direction: "higher_better" },
  { key: "fcf_margin",        direction: "higher_better" },

  // Banking (higher is better except NPL, cost_to_income)
  { key: "nim",               direction: "higher_better" },
  { key: "casa_ratio",        direction: "higher_better" },
  { key: "npl_ratio",         direction: "lower_better"  },
  { key: "coverage_ratio",    direction: "higher_better" },
  { key: "car",               direction: "higher_better" },
  { key: "cost_to_income",    direction: "lower_better"  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface RatioRow {
  id:     string;
  symbol: string;
  sector: string | null;
  [key: string]: unknown;
}

interface MetricContext {
  rank:       number;
  percentile: number;
  sector_avg: number | null;
  sector_n:   number;
  best:       number | null;
  worst:      number | null;
}

// ─── Computation ──────────────────────────────────────────────────────────────

function computeSectorRankings(
  rows:      RatioRow[],
  metricKey: string,
  direction: "higher_better" | "lower_better",
): Map<string, MetricContext> {
  // Filter to rows with valid (non-null, non-NaN, finite) values
  const valid = rows.filter((r) => {
    const v = r[metricKey];
    return v != null && typeof v === "number" && isFinite(v);
  });

  if (valid.length === 0) return new Map();

  const values = valid.map((r) => r[metricKey] as number);
  const sectorAvg = values.reduce((s, v) => s + v, 0) / values.length;
  const best  = direction === "higher_better" ? Math.max(...values) : Math.min(...values);
  const worst = direction === "higher_better" ? Math.min(...values) : Math.max(...values);

  // Sort: for higher_better → descending, lower_better → ascending
  const sorted = [...valid].sort((a, b) => {
    const av = a[metricKey] as number;
    const bv = b[metricKey] as number;
    return direction === "higher_better" ? bv - av : av - bv;
  });

  const result = new Map<string, MetricContext>();
  sorted.forEach((row, idx) => {
    const rank       = idx + 1;
    const n          = sorted.length;
    const percentile = n === 1 ? 100 : Math.round(((n - rank) / (n - 1)) * 100);
    result.set(row.symbol, {
      rank,
      percentile,
      sector_avg: Math.round(sectorAvg * 100) / 100,
      sector_n:   n,
      best:       Math.round(best * 100) / 100,
      worst:      Math.round(worst * 100) / 100,
    });
  });

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args      = process.argv.slice(2);
  const dateArg   = args.find((a) => a.startsWith("--date="))?.replace("--date=", "");
  const periodArg = args.find((a) => a.startsWith("--period="))?.replace("--period=", "");
  const startedAt = new Date();
  const today     = startedAt.toISOString().slice(0, 10);
  const targetDate = dateArg ?? today;

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Peer Ranking Computation`);
  console.log(`  Snapshot Date: ${targetDate}`);
  if (periodArg) console.log(`  Period: ${periodArg}`);
  console.log(`${"═".repeat(60)}\n`);

  // ── Fetch ratio snapshots for target date ────────────────────────────────────
  let query = supabaseAdmin
    .from("financial_ratio_snapshots")
    .select(`
      id, symbol, period_key, period_type, snapshot_date,
      pe_ratio, pb_ratio, ev_ebitda, ps_ratio, dividend_yield, fcf_yield,
      gross_margin, ebitda_margin, operating_margin, net_margin,
      roe, roa, roce,
      revenue_growth, pat_growth, eps_growth, revenue_cagr_3y, pat_cagr_3y,
      debt_to_equity, net_debt_to_ebitda, current_ratio, interest_cover,
      cfo_to_pat, fcf_margin,
      nim, casa_ratio, npl_ratio, coverage_ratio, car, cost_to_income
    `)
    .eq("snapshot_date", targetDate);

  if (periodArg) {
    query = query.eq("period_key", periodArg.toUpperCase());
  } else {
    // Default: only annual periods for clearest peer comparison
    query = query.eq("period_type", "annual");
  }

  const { data: snapshots, error: snapErr } = await query;
  if (snapErr) {
    console.error(`Failed to fetch snapshots: ${snapErr.message}`);
    process.exit(1);
  }
  if (!snapshots || snapshots.length === 0) {
    console.log("No ratio snapshots found for target date. Run calculate-financial-ratios first.\n");
    process.exit(0);
  }

  console.log(`Loaded ${snapshots.length} ratio snapshots\n`);

  // ── Join with companies to get sector ───────────────────────────────────────
  const symbols = [...new Set((snapshots as RatioRow[]).map((r) => r.symbol))];
  const { data: companies } = await supabaseAdmin
    .from("companies")
    .select("symbol, sector")
    .in("symbol", symbols);

  const sectorMap = new Map<string, string>();
  for (const co of (companies ?? [])) {
    sectorMap.set(co.symbol, co.sector ?? "Unknown");
  }

  const rowsWithSector: RatioRow[] = (snapshots as RatioRow[]).map((r) => ({
    ...r,
    sector: sectorMap.get(r.symbol) ?? "Unknown",
  }));

  // ── Group by sector ──────────────────────────────────────────────────────────
  const bySector = new Map<string, RatioRow[]>();
  for (const row of rowsWithSector) {
    const s = row.sector ?? "Unknown";
    if (!bySector.has(s)) bySector.set(s, []);
    bySector.get(s)!.push(row);
  }

  console.log(`Sectors: ${[...bySector.keys()].join(", ")}\n`);

  // ── Compute rankings per sector ──────────────────────────────────────────────
  // peer_context structure: { metric_key: MetricContext }
  const peerContextMap = new Map<string, Record<string, MetricContext>>();
  // keyed by snapshot id

  for (const [sector, sectorRows] of bySector) {
    console.log(`  ${sector}: ${sectorRows.length} companies`);

    for (const { key, direction } of RANKED_METRICS) {
      const rankings = computeSectorRankings(sectorRows, key, direction);
      for (const [symbol, context] of rankings) {
        const row = sectorRows.find((r) => r.symbol === symbol);
        if (!row) continue;
        const id = row.id as string;
        if (!peerContextMap.has(id)) peerContextMap.set(id, {});
        peerContextMap.get(id)![key] = context;
      }
    }
  }

  // ── Write peer_context back to financial_ratio_snapshots ─────────────────────
  let updated = 0, failed = 0;
  const now = new Date().toISOString();

  for (const [snapshotId, peerContext] of peerContextMap) {
    const { error } = await supabaseAdmin
      .from("financial_ratio_snapshots")
      .update({ peer_context: peerContext, peer_computed_at: now })
      .eq("id", snapshotId);

    if (error) {
      console.error(`  ✗ Failed to update snapshot ${snapshotId}: ${error.message}`);
      failed++;
    } else {
      updated++;
    }
  }

  // ── Log run ───────────────────────────────────────────────────────────────────
  await supabaseAdmin.from("ingestion_runs").insert({
    pipeline_name:    PIPELINE_NAME,
    pipeline_version: "1.0.0",
    run_date:         today,
    source:           "computed",
    trigger:          "manual",
    status:           failed > 0 ? "failed" : "completed",
    records_fetched:  snapshots.length,
    records_upserted: updated,
    records_failed:   failed,
    error_summary:    failed > 0 ? `${failed} peer context updates failed` : null,
    started_at:       startedAt.toISOString(),
    completed_at:     now,
    duration_ms:      Date.now() - startedAt.getTime(),
  });

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Done. Peer context written for ${updated} snapshots.`);
  if (failed > 0) console.log(`  ✗ ${failed} failed.`);
  console.log(`${"═".repeat(60)}\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
