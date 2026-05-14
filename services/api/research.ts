// services/api/research.ts
// Corporate actions and announcements — dividends, filings, news.
// Expand this as the research layer grows (reports, AI summaries, macro data).

import { supabase } from "@/lib/supabase";
import type { Dividend, Announcement } from "@/types";

// ─── Dividends ────────────────────────────────────────────────────────────────
export async function getDividendsBySymbol(
  symbol: string,
  limit = 8,
): Promise<Dividend[]> {
  const { data, error } = await supabase
    .from("dividends")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .order("financial_year", { ascending: false })
    .limit(limit);
  if (error) { console.error("[research] getDividendsBySymbol:", error.message); return []; }
  return (data ?? []) as Dividend[];
}

// ─── Announcements ────────────────────────────────────────────────────────────
export async function getAnnouncementsBySymbol(
  symbol: string,
  limit = 5,
): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) { console.error("[research] getAnnouncementsBySymbol:", error.message); return []; }
  return (data ?? []) as Announcement[];
}

// ─── Convenience: all stock-page corporate data in one call ───────────────────
export type StockCorporateData = {
  dividends:     Dividend[];
  announcements: Announcement[];
};

export async function getStockCorporateData(symbol: string): Promise<StockCorporateData> {
  const [dividends, announcements] = await Promise.all([
    getDividendsBySymbol(symbol),
    getAnnouncementsBySymbol(symbol),
  ]);
  return { dividends, announcements };
}
