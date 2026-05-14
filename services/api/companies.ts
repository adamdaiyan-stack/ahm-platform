// services/api/companies.ts
// All company/stock queries.
// Components must import from here, never call supabase directly.

import { supabase } from "@/lib/supabase";
import type { Company, CompanyMover, CompanyPeer } from "@/types";

// ─── Full screener list ───────────────────────────────────────────────────────
export async function getAllCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("market_cap", { ascending: false });
  if (error) { console.error("[companies] getAllCompanies:", error.message); return []; }
  return (data ?? []) as Company[];
}

// ─── Single company ───────────────────────────────────────────────────────────
export async function getCompanyBySymbol(symbol: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .single<Company>();
  if (error) { console.error("[companies] getCompanyBySymbol:", error.message); return null; }
  return data;
}

// ─── Peers (same sector, excluding self) ─────────────────────────────────────
export async function getCompanyPeers(
  sector: string,
  excludeSymbol: string,
  limit = 6,
): Promise<CompanyPeer[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, symbol, company_name, current_price, change_percent, market_cap, pe_ratio")
    .eq("sector", sector)
    .neq("symbol", excludeSymbol.toUpperCase())
    .order("market_cap", { ascending: false })
    .limit(limit);
  if (error) { console.error("[companies] getCompanyPeers:", error.message); return []; }
  return (data ?? []) as CompanyPeer[];
}

// ─── Multiple symbols (e.g. sector comparison tool) ───────────────────────────
export async function getCompaniesBySymbols(symbols: string[]): Promise<Company[]> {
  if (symbols.length === 0) return [];
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .in("symbol", symbols.map((s) => s.toUpperCase()));
  if (error) { console.error("[companies] getCompaniesBySymbols:", error.message); return []; }
  return (data ?? []) as Company[];
}

// ─── Homepage hero — top movers snapshot ─────────────────────────────────────
export async function getHomepageMovers(limit = 5): Promise<CompanyMover[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, symbol, company_name, sector, current_price, change_percent, market_cap")
    .not("change_percent", "is", null)
    .order("market_cap", { ascending: false })
    .limit(limit);
  if (error) { console.error("[companies] getHomepageMovers:", error.message); return []; }
  return (data ?? []) as CompanyMover[];
}
