// services/api/prices.ts
//
// Time-series price data access — daily_prices table.
// Components must import from here — never call supabase directly.

import { supabase } from "@/lib/supabase";
import type { DailyPrice } from "@/types";

/** Last N trading sessions for a symbol (default 30). */
export async function getPriceHistory(
  symbol:  string,
  days   = 30,
): Promise<DailyPrice[]> {
  const { data, error } = await supabase
    .from("daily_prices")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .order("market_date", { ascending: false })
    .limit(days);
  if (error) { console.error("[prices] getPriceHistory:", error.message); return []; }
  // Return chronological order for chart consumers
  return ((data ?? []) as DailyPrice[]).reverse();
}

/** Most recent single price record for a symbol. */
export async function getLatestPrice(symbol: string): Promise<DailyPrice | null> {
  const { data, error } = await supabase
    .from("daily_prices")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .order("market_date", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[prices] getLatestPrice:", error.message);
    return null;
  }
  return data as DailyPrice;
}

/** Latest prices for multiple symbols — for sector snapshot comparison. */
export async function getLatestPricesForSymbols(
  symbols: string[],
): Promise<DailyPrice[]> {
  if (symbols.length === 0) return [];
  // Get the latest market_date in the table first
  const { data: latestDate } = await supabase
    .from("daily_prices")
    .select("market_date")
    .in("symbol", symbols.map((s) => s.toUpperCase()))
    .order("market_date", { ascending: false })
    .limit(1)
    .single();
  if (!latestDate) return [];

  const { data, error } = await supabase
    .from("daily_prices")
    .select("*")
    .in("symbol", symbols.map((s) => s.toUpperCase()))
    .eq("market_date", latestDate.market_date);
  if (error) { console.error("[prices] getLatestPricesForSymbols:", error.message); return []; }
  return (data ?? []) as DailyPrice[];
}

/** Price range for a symbol between two dates. */
export async function getPriceRange(
  symbol:    string,
  fromDate:  string,   // ISO date: "2025-01-01"
  toDate:    string,   // ISO date: "2025-12-31"
): Promise<DailyPrice[]> {
  const { data, error } = await supabase
    .from("daily_prices")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .gte("market_date", fromDate)
    .lte("market_date", toDate)
    .order("market_date", { ascending: true });
  if (error) { console.error("[prices] getPriceRange:", error.message); return []; }
  return (data ?? []) as DailyPrice[];
}
