// services/api/intelligence.ts
//
// Sector intelligence data access — sectors, drivers, intelligence blocks.
// This is the service layer for the structured intelligence infrastructure
// introduced in Financial Intelligence Infrastructure Phase 1.
//
// Components must import from here — never call supabase directly.
//
// ARCHITECTURE NOTE
//   These functions are the bridge between the DB-normalised intelligence layer
//   and the frontend FrameworkPage components. As sector data migrates from
//   hardcoded TS configs into the DB, these functions become the single source
//   of truth for sector identity, drivers, and intelligence blocks.

import { supabase } from "@/lib/supabase";
import type { Sector, SectorDriver, SectorIntelBlock, DriverTrend } from "@/types";

// ─── Sectors ──────────────────────────────────────────────────────────────────

/** All active sectors ordered by sort_order. */
export async function getAllSectors(): Promise<Sector[]> {
  const { data, error } = await supabase
    .from("sectors")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) { console.error("[intelligence] getAllSectors:", error.message); return []; }
  return (data ?? []) as Sector[];
}

/** Single sector by URL slug. */
export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  const { data, error } = await supabase
    .from("sectors")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[intelligence] getSectorBySlug:", error.message);
    return null;
  }
  return data as Sector;
}

/** Sector by DB sector name (e.g. "Oil & Gas" as stored on companies.sector). */
export async function getSectorByDbName(dbName: string): Promise<Sector | null> {
  const { data, error } = await supabase
    .from("sectors")
    .select("*")
    .eq("db_sector_name", dbName)
    .single();
  if (error) {
    if (error.code !== "PGRST116") console.error("[intelligence] getSectorByDbName:", error.message);
    return null;
  }
  return data as Sector;
}

// ─── Sector Drivers ───────────────────────────────────────────────────────────

/** All drivers for a sector, ordered. */
export async function getSectorDrivers(sectorSlug: string): Promise<SectorDriver[]> {
  const { data, error } = await supabase
    .from("sector_drivers")
    .select("*")
    .eq("sector_slug", sectorSlug)
    .order("sort_order", { ascending: true });
  if (error) { console.error("[intelligence] getSectorDrivers:", error.message); return []; }
  return (data ?? []) as SectorDriver[];
}

/** Drivers filtered by trend direction — useful for dashboard alerts. */
export async function getDriversByTrend(trend: DriverTrend): Promise<SectorDriver[]> {
  const { data, error } = await supabase
    .from("sector_drivers")
    .select("*")
    .eq("trend", trend)
    .order("sector_slug", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) { console.error("[intelligence] getDriversByTrend:", error.message); return []; }
  return (data ?? []) as SectorDriver[];
}

// ─── Sector Intelligence Blocks ──────────────────────────────────────────────

/** All active intelligence blocks for a sector. */
export async function getSectorIntelBlocks(sectorSlug: string): Promise<SectorIntelBlock[]> {
  const { data, error } = await supabase
    .from("sector_intelligence_blocks")
    .select("*")
    .eq("sector_slug", sectorSlug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) { console.error("[intelligence] getSectorIntelBlocks:", error.message); return []; }
  return (data ?? []) as SectorIntelBlock[];
}

/** Intelligence blocks filtered by type. */
export async function getSectorIntelBlocksByType(
  sectorSlug: string,
  blockType: SectorIntelBlock["block_type"],
): Promise<SectorIntelBlock[]> {
  const { data, error } = await supabase
    .from("sector_intelligence_blocks")
    .select("*")
    .eq("sector_slug", sectorSlug)
    .eq("block_type", blockType)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) { console.error("[intelligence] getSectorIntelBlocksByType:", error.message); return []; }
  return (data ?? []) as SectorIntelBlock[];
}

/** All risk blocks for a sector — used in risk summary panels. */
export async function getSectorRiskBlocks(sectorSlug: string): Promise<SectorIntelBlock[]> {
  return getSectorIntelBlocksByType(sectorSlug, "risk");
}

/** All takeaway blocks for a sector — used for quick-scan digest. */
export async function getSectorTakeaways(sectorSlug: string): Promise<SectorIntelBlock[]> {
  return getSectorIntelBlocksByType(sectorSlug, "takeaway");
}

/** Blocks referencing a specific ticker symbol — for stock detail pages. */
export async function getIntelBlocksBySymbol(symbol: string): Promise<SectorIntelBlock[]> {
  const { data, error } = await supabase
    .from("sector_intelligence_blocks")
    .select("*")
    .contains("related_symbols", [symbol.toUpperCase()])
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) { console.error("[intelligence] getIntelBlocksBySymbol:", error.message); return []; }
  return (data ?? []) as SectorIntelBlock[];
}

/** Blocks matching a tag — for cross-sector thematic queries (e.g. "circular-debt"). */
export async function getIntelBlocksByTag(tag: string): Promise<SectorIntelBlock[]> {
  const { data, error } = await supabase
    .from("sector_intelligence_blocks")
    .select("*")
    .contains("tags", [tag])
    .eq("is_active", true)
    .order("sector_slug", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) { console.error("[intelligence] getIntelBlocksByTag:", error.message); return []; }
  return (data ?? []) as SectorIntelBlock[];
}

// ─── Convenience: full sector intelligence package ───────────────────────────

export type SectorIntelligencePackage = {
  sector:  Sector | null;
  drivers: SectorDriver[];
  blocks:  SectorIntelBlock[];
};

/**
 * Single call that fetches everything needed to render a sector intelligence page.
 * As the migration from hardcoded FrameworkPage configs progresses, this becomes
 * the primary data source for sector pages.
 */
export async function getSectorIntelligencePackage(
  slug: string,
): Promise<SectorIntelligencePackage> {
  const [sector, drivers, blocks] = await Promise.all([
    getSectorBySlug(slug),
    getSectorDrivers(slug),
    getSectorIntelBlocks(slug),
  ]);
  return { sector, drivers, blocks };
}

// ---- Conviction Board -------------------------------------------------------

export type ConvictionBoardRow = {
  symbol:          string;
  company_name:    string;
  sector:          string;
  score:           number;
  tier:            'HIGH_CONVICTION' | 'MODERATE' | 'WATCHLIST' | 'MONITOR';
  tier_order:      number;
  data_confidence: number;
  sub_scores:      Record<string, { score: number; confidence: number }>;
  scored_at:       string;
  score_version:   string;
};

/**
 * All current conviction scores, ordered by score descending.
 * Reads from the conviction_board VIEW (conviction_scores JOIN companies WHERE is_current).
 */
export async function getConvictionBoard(): Promise<ConvictionBoardRow[]> {
  const { data, error } = await supabase
    .from('conviction_board')
    .select('symbol,company_name,sector,score,tier,tier_order,data_confidence,sub_scores,scored_at,score_version');
  if (error) { console.error('[intelligence] getConvictionBoard:', error.message); return []; }
  return (data ?? []) as ConvictionBoardRow[];
}

/**
 * Conviction score for a single symbol (current only).
 * Returns null if the company has not been scored yet.
 */
export async function getConvictionScore(symbol: string): Promise<ConvictionBoardRow | null> {
  const { data, error } = await supabase
    .from('conviction_board')
    .select('symbol,company_name,sector,score,tier,tier_order,data_confidence,sub_scores,scored_at,score_version')
    .eq('symbol', symbol.toUpperCase())
    .single();
  if (error) {
    if (error.code !== 'PGRST116') console.error('[intelligence] getConvictionScore:', error.message);
    return null;
  }
  return data as ConvictionBoardRow;
}
