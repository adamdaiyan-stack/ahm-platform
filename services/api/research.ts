// services/api/research.ts
// All research-layer data access — dividends, announcements, research reports.
// No business logic here; only structured DB queries.

import { supabase } from "@/lib/supabase";
import type {
  Dividend,
  Announcement,
  ResearchReport,
  ResearchReportSummary,
} from "@/types";

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

// ─── Research Reports ─────────────────────────────────────────────────────────

export async function getReportBySlug(slug: string): Promise<ResearchReport | null> {
  const { data, error } = await supabase
    .from("research_reports")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[research] getReportBySlug:", error.message);
    return null;
  }
  return data as ResearchReport;
}

export async function getPublishedReports(limit = 20): Promise<ResearchReportSummary[]> {
  const { data, error } = await supabase
    .from("research_reports")
    .select("id, slug, title, summary, ticker_symbols, sectors, tags, author, published_at, status, rating, target_price, upside")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) { console.error("[research] getPublishedReports:", error.message); return []; }
  return (data ?? []) as ResearchReportSummary[];
}

export async function getReportsByTicker(symbol: string, limit = 5): Promise<ResearchReportSummary[]> {
  const { data, error } = await supabase
    .from("research_reports")
    .select("id, slug, title, summary, ticker_symbols, sectors, tags, author, published_at, status, rating, target_price, upside")
    .eq("status", "published")
    .contains("ticker_symbols", [symbol.toUpperCase()])
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) { console.error("[research] getReportsByTicker:", error.message); return []; }
  return (data ?? []) as ResearchReportSummary[];
}

export async function getReportsBySector(sector: string, limit = 10): Promise<ResearchReportSummary[]> {
  const { data, error } = await supabase
    .from("research_reports")
    .select("id, slug, title, summary, ticker_symbols, sectors, tags, author, published_at, status, rating, target_price, upside")
    .eq("status", "published")
    .contains("sectors", [sector])
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) { console.error("[research] getReportsBySector:", error.message); return []; }
  return (data ?? []) as ResearchReportSummary[];
}
