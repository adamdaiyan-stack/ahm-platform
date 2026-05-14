// services/api/market.ts
// All market-level data queries — index, movers, sector performance.
// Components must import from here, never call supabase directly.

import { supabase } from "@/lib/supabase";
import type { MarketIndex, CompanyMover, CompanyActive, SectorStat } from "@/types";

// ─── KSE-100 Index ────────────────────────────────────────────────────────────
export async function getKSE100Index(): Promise<MarketIndex | null> {
  const { data, error } = await supabase
    .from("market_index")
    .select("*")
    .eq("index_name", "KSE-100")
    .single();
  if (error) { console.error("[market] getKSE100Index:", error.message); return null; }
  return data as MarketIndex;
}

// ─── Movers ───────────────────────────────────────────────────────────────────
export async function getTopGainers(limit = 5): Promise<CompanyMover[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, symbol, company_name, sector, current_price, change_percent, market_cap")
    .not("change_percent", "is", null)
    .order("change_percent", { ascending: false })
    .limit(limit);
  if (error) { console.error("[market] getTopGainers:", error.message); return []; }
  return (data ?? []) as CompanyMover[];
}

export async function getTopLosers(limit = 5): Promise<CompanyMover[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, symbol, company_name, sector, current_price, change_percent, market_cap")
    .not("change_percent", "is", null)
    .order("change_percent", { ascending: true })
    .limit(limit);
  if (error) { console.error("[market] getTopLosers:", error.message); return []; }
  return (data ?? []) as CompanyMover[];
}

export async function getMostActive(limit = 5): Promise<CompanyActive[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, symbol, company_name, sector, current_price, change_percent, volume")
    .not("volume", "is", null)
    .order("volume", { ascending: false })
    .limit(limit);
  if (error) { console.error("[market] getMostActive:", error.message); return []; }
  return (data ?? []) as CompanyActive[];
}

// ─── Sector Performance ───────────────────────────────────────────────────────
// Fetches raw sector rows and computes avg change + total market cap per sector.
export async function getSectorPerformance(): Promise<SectorStat[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("sector, change_percent, market_cap");
  if (error) { console.error("[market] getSectorPerformance:", error.message); return []; }

  type RawRow = { sector: string; change_percent: number | null; market_cap: number | null };
  type Acc = { sector: string; totalChange: number; withChange: number; totalMarketCap: number; count: number };

  const acc: Record<string, Acc> = {};
  for (const row of (data ?? []) as RawRow[]) {
    if (!acc[row.sector]) {
      acc[row.sector] = { sector: row.sector, totalChange: 0, withChange: 0, totalMarketCap: 0, count: 0 };
    }
    const s = acc[row.sector];
    s.count += 1;
    if (row.market_cap) s.totalMarketCap += Number(row.market_cap);
    if (row.change_percent != null) { s.totalChange += Number(row.change_percent); s.withChange += 1; }
  }

  return Object.values(acc)
    .map(({ sector, totalChange, withChange, totalMarketCap, count }): SectorStat => ({
      sector,
      avgChange: withChange > 0 ? totalChange / withChange : null,
      totalMarketCap,
      count,
    }))
    .sort((a, b) => b.totalMarketCap - a.totalMarketCap);
}

// ─── Convenience: everything the market page needs in one call ─────────────────
export type MarketPageData = {
  index:   MarketIndex | null;
  gainers: CompanyMover[];
  losers:  CompanyMover[];
  active:  CompanyActive[];
  sectors: SectorStat[];
};

export async function getMarketPageData(): Promise<MarketPageData> {
  const [index, gainers, losers, active, sectors] = await Promise.all([
    getKSE100Index(),
    getTopGainers(5),
    getTopLosers(5),
    getMostActive(5),
    getSectorPerformance(),
  ]);
  return { index, gainers, losers, active, sectors };
}
