// services/api/financials.ts
//
// Financial ratio snapshots, peer comparison, and period registry.
// Components must import from here — never call supabase directly.
// For raw financial_metrics, use services/api/fundamentals.ts.

import { supabase } from "@/lib/supabase";
import type {
  FinancialRatioSnapshot,
  FinancialReportingPeriod,
  FinancialStatementLine,
  PeerContext,
} from "@/types";

// ─── Ratio Snapshots ─────────────────────────────────────────────────────────

/** Latest ratio snapshot for a symbol (any period, most recent snapshot date). */
export async function getLatestRatioSnapshot(
  symbol: string,
): Promise<FinancialRatioSnapshot | null> {
  const { data, error } = await supabase
    .from("financial_ratio_snapshots")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[financials] getLatestRatioSnapshot:", error.message);
    return null;
  }
  return data as FinancialRatioSnapshot;
}

/** Latest annual ratio snapshot for a symbol. */
export async function getLatestAnnualRatioSnapshot(
  symbol: string,
): Promise<FinancialRatioSnapshot | null> {
  const { data, error } = await supabase
    .from("financial_ratio_snapshots")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .eq("period_type", "annual")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[financials] getLatestAnnualRatioSnapshot:", error.message);
    return null;
  }
  return data as FinancialRatioSnapshot;
}

/** Historical ratio snapshots for a symbol — one per period, latest snapshot only. */
export async function getRatioHistory(
  symbol: string,
  limit = 6,
): Promise<FinancialRatioSnapshot[]> {
  const { data, error } = await supabase
    .from("financial_ratio_snapshots")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .eq("period_type", "annual")
    .order("snapshot_date", { ascending: false })
    .limit(limit);
  if (error) { console.error("[financials] getRatioHistory:", error.message); return []; }
  return (data ?? []) as FinancialRatioSnapshot[];
}

/** Ratio snapshots for a set of symbols on a given date — for peer comparison tables. */
export async function getRatioSnapshotsForPeers(
  symbols:      string[],
  periodType:   string = "annual",
  snapshotDate: string | null = null,
): Promise<FinancialRatioSnapshot[]> {
  if (symbols.length === 0) return [];

  let query = supabase
    .from("financial_ratio_snapshots")
    .select("*")
    .in("symbol", symbols.map((s) => s.toUpperCase()))
    .eq("period_type", periodType)
    .order("snapshot_date", { ascending: false });

  if (snapshotDate) {
    query = query.eq("snapshot_date", snapshotDate);
  }

  const { data, error } = await query.limit(symbols.length * 3);
  if (error) { console.error("[financials] getRatioSnapshotsForPeers:", error.message); return []; }

  // Deduplicate: keep only latest snapshot per symbol
  const seen = new Set<string>();
  const deduped: FinancialRatioSnapshot[] = [];
  for (const row of (data ?? []) as FinancialRatioSnapshot[]) {
    if (!seen.has(row.symbol)) {
      seen.add(row.symbol);
      deduped.push(row);
    }
  }
  return deduped;
}

// ─── Peer Context ─────────────────────────────────────────────────────────────

/** Extract peer context for a specific metric from a ratio snapshot. */
export function getPeerContextForMetric(
  snapshot:  FinancialRatioSnapshot | null,
  metricKey: string,
): PeerContext | null {
  if (!snapshot?.peer_context) return null;
  const ctx = (snapshot.peer_context as Record<string, PeerContext>)[metricKey];
  return ctx ?? null;
}

// ─── Reporting Periods ────────────────────────────────────────────────────────

/** All reporting periods for a symbol, newest first. */
export async function getReportingPeriods(
  symbol: string,
  limit = 20,
): Promise<FinancialReportingPeriod[]> {
  const { data, error } = await supabase
    .from("financial_reporting_periods")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .order("period_end", { ascending: false })
    .limit(limit);
  if (error) { console.error("[financials] getReportingPeriods:", error.message); return []; }
  return (data ?? []) as FinancialReportingPeriod[];
}

// ─── Statement Lines ──────────────────────────────────────────────────────────

/** Normalized statement lines for a symbol + period. */
export async function getStatementLines(
  symbol:    string,
  periodKey: string,
  statementType?: "income_statement" | "balance_sheet" | "cash_flow",
): Promise<FinancialStatementLine[]> {
  let query = supabase
    .from("financial_statement_lines")
    .select("*, financial_metric_definitions(display_name, unit_type)")
    .eq("symbol", symbol.toUpperCase())
    .eq("period_key", periodKey.toUpperCase())
    .order("metric_code");

  if (statementType) {
    query = query.eq("statement_type", statementType);
  }

  const { data, error } = await query;
  if (error) { console.error("[financials] getStatementLines:", error.message); return []; }
  return (data ?? []) as FinancialStatementLine[];
}

// ─── Convenience: everything the stock financial tab needs ────────────────────

export type StockFinancialData = {
  latestRatios:   FinancialRatioSnapshot | null;
  ratioHistory:   FinancialRatioSnapshot[];
  periods:        FinancialReportingPeriod[];
};

export async function getStockFinancialData(symbol: string): Promise<StockFinancialData> {
  const [latestRatios, ratioHistory, periods] = await Promise.all([
    getLatestAnnualRatioSnapshot(symbol),
    getRatioHistory(symbol, 5),
    getReportingPeriods(symbol, 10),
  ]);
  return { latestRatios, ratioHistory, periods };
}
