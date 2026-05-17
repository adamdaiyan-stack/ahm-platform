// services/api/fundamentals.ts
//
// Period-based financial metrics access — financial_metrics table.
// Components must import from here — never call supabase directly.

import { supabase } from "@/lib/supabase";
import type { FinancialMetrics, FinancialMetricsSummary, PeriodType } from "@/types";

/** All periods for a symbol, most recent first. */
export async function getFinancialHistory(
  symbol: string,
  limit   = 8,
): Promise<FinancialMetrics[]> {
  const { data, error } = await supabase
    .from("financial_metrics")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .order("period_end_date", { ascending: false })
    .limit(limit);
  if (error) { console.error("[fundamentals] getFinancialHistory:", error.message); return []; }
  return (data ?? []) as FinancialMetrics[];
}

/** Single period for a symbol — e.g. ("UBL", "FY24"). */
export async function getMetricsForPeriod(
  symbol: string,
  period: string,
): Promise<FinancialMetrics | null> {
  const { data, error } = await supabase
    .from("financial_metrics")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .eq("period", period)
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[fundamentals] getMetricsForPeriod:", error.message);
    return null;
  }
  return data as FinancialMetrics;
}

/** Latest annual metrics for a symbol (most recent annual period). */
export async function getLatestAnnualMetrics(
  symbol: string,
): Promise<FinancialMetrics | null> {
  const { data, error } = await supabase
    .from("financial_metrics")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .eq("period_type", "annual" satisfies PeriodType)
    .order("period_end_date", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[fundamentals] getLatestAnnualMetrics:", error.message);
    return null;
  }
  return data as FinancialMetrics;
}

/** Summary metrics for multiple symbols — for sector comparison tables. */
export async function getMetricsSummaryForSymbols(
  symbols: string[],
  period:  string,
): Promise<FinancialMetricsSummary[]> {
  if (symbols.length === 0) return [];
  const { data, error } = await supabase
    .from("financial_metrics")
    .select(
      "symbol, period, period_type, pat, eps, pe_ratio, pb_ratio, roe, net_margin, dps, dividend_yield, revenue_growth, pat_growth"
    )
    .in("symbol", symbols.map((s) => s.toUpperCase()))
    .eq("period", period);
  if (error) { console.error("[fundamentals] getMetricsSummaryForSymbols:", error.message); return []; }
  return (data ?? []) as FinancialMetricsSummary[];
}
