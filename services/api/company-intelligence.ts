// services/api/company-intelligence.ts
//
// Company intelligence data access — company_intelligence + company_intelligence_blocks tables.
//
// ARCHITECTURE
//   This is the service layer for structured company intelligence.
//   Components and pages must import from here — never query Supabase directly.
//
//   Data flow:
//     DB (company_intelligence + company_intelligence_blocks)
//     → Service (this file) — raw DB rows
//     → Adapter (lib/company-adapter.ts) — assembled CompanyIntelligenceConfig
//     → UI (CompanyIntelligencePage)
//
//   Static fallback:
//     If getCompanyIntelligence() returns null (symbol not yet in DB),
//     the caller falls back to the static COMPANY_CONFIGS registry.
//     Migration is progressive and non-destructive.
//
// AI-READINESS
//   Cross-company block queries (getCompanyRisksByTag, getAllCompanyCatalysts)
//   are the foundation of future AI intelligence layers — allowing the system
//   to answer queries like "what are all near-term catalysts tagged 'tax-reform'?"
//   without page-level data fetching.

import { supabase }                    from "@/lib/supabase";
import { buildCompanyConfig }           from "@/lib/company-adapter";
import type { CompanyIntelScalars, CompanyIntelBlock, CompanyIntelBlockType } from "@/types";
import type { CompanyIntelligenceConfig } from "@/components/company/CompanyIntelligencePage";

// ─── Scalar intelligence ──────────────────────────────────────────────────────

/** Scalar fields for one company — identity, thesis summary, valuation/dividend commentary. */
export async function getCompanyIntelScalars(
  symbol: string,
): Promise<CompanyIntelScalars | null> {
  const { data, error } = await supabase
    .from("company_intelligence")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .eq("is_active", true)
    .single();
  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[company-intelligence] getCompanyIntelScalars:", error.message);
    }
    return null;
  }
  return data as CompanyIntelScalars;
}

// ─── Intelligence blocks ──────────────────────────────────────────────────────

/** All active blocks for a symbol, ordered. Optionally filtered by block_type. */
export async function getCompanyIntelBlocks(
  symbol:     string,
  blockType?: CompanyIntelBlockType,
): Promise<CompanyIntelBlock[]> {
  let q = supabase
    .from("company_intelligence_blocks")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (blockType) {
    q = q.eq("block_type", blockType);
  }

  const { data, error } = await q;
  if (error) {
    console.error("[company-intelligence] getCompanyIntelBlocks:", error.message);
    return [];
  }
  return (data ?? []) as CompanyIntelBlock[];
}

/** Thesis theme blocks for a symbol. */
export async function getCompanyThesisThemes(
  symbol: string,
): Promise<CompanyIntelBlock[]> {
  return getCompanyIntelBlocks(symbol, "thesis_theme");
}

/** Driver blocks for a symbol. */
export async function getCompanyDrivers(
  symbol: string,
): Promise<CompanyIntelBlock[]> {
  return getCompanyIntelBlocks(symbol, "driver");
}

/** Risk blocks for a symbol. */
export async function getCompanyRisks(
  symbol: string,
): Promise<CompanyIntelBlock[]> {
  return getCompanyIntelBlocks(symbol, "risk");
}

/** Catalyst blocks for a symbol. */
export async function getCompanyCatalysts(
  symbol: string,
): Promise<CompanyIntelBlock[]> {
  return getCompanyIntelBlocks(symbol, "catalyst");
}

/** Valuation point blocks for a symbol. */
export async function getCompanyValuationPoints(
  symbol: string,
): Promise<CompanyIntelBlock[]> {
  return getCompanyIntelBlocks(symbol, "valuation_point");
}

// ─── Cross-company AI-ready queries ──────────────────────────────────────────
// These queries span all companies — the foundation of future AI intelligence
// layers. A query like "what risks are tagged 'circular-debt'?" returns results
// from OGDC, power companies, any company with that exposure tagged.

/** All risk blocks matching a tag — cross-company. */
export async function getCompanyRisksByTag(
  tag: string,
): Promise<CompanyIntelBlock[]> {
  const { data, error } = await supabase
    .from("company_intelligence_blocks")
    .select("*")
    .eq("block_type", "risk")
    .eq("is_active", true)
    .contains("tags", [tag])
    .order("symbol", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[company-intelligence] getCompanyRisksByTag:", error.message);
    return [];
  }
  return (data ?? []) as CompanyIntelBlock[];
}

/** All catalyst blocks optionally filtered by horizon — cross-company. */
export async function getAllCompanyCatalysts(
  horizon?: "near" | "medium" | "long",
): Promise<CompanyIntelBlock[]> {
  let q = supabase
    .from("company_intelligence_blocks")
    .select("*")
    .eq("block_type", "catalyst")
    .eq("is_active", true)
    .order("symbol", { ascending: true })
    .order("sort_order", { ascending: true });

  if (horizon) {
    q = q.eq("horizon", horizon);
  }

  const { data, error } = await q;
  if (error) {
    console.error("[company-intelligence] getAllCompanyCatalysts:", error.message);
    return [];
  }
  return (data ?? []) as CompanyIntelBlock[];
}

/** All driver blocks matching a trend direction — cross-company. */
export async function getCompanyDriversByTrend(
  trend: "positive" | "negative" | "neutral" | "watch",
): Promise<CompanyIntelBlock[]> {
  const { data, error } = await supabase
    .from("company_intelligence_blocks")
    .select("*")
    .eq("block_type", "driver")
    .eq("is_active", true)
    .eq("trend", trend)
    .order("symbol", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[company-intelligence] getCompanyDriversByTrend:", error.message);
    return [];
  }
  return (data ?? []) as CompanyIntelBlock[];
}

/** All blocks referencing a symbol (in related_symbols array) — for sector cross-links. */
export async function getBlocksReferencingSymbol(
  symbol: string,
): Promise<CompanyIntelBlock[]> {
  const { data, error } = await supabase
    .from("company_intelligence_blocks")
    .select("*")
    .eq("is_active", true)
    .contains("related_symbols", [symbol.toUpperCase()])
    .order("symbol", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[company-intelligence] getBlocksReferencingSymbol:", error.message);
    return [];
  }
  return (data ?? []) as CompanyIntelBlock[];
}

// ─── Primary entry point ──────────────────────────────────────────────────────

/**
 * Fetch the full intelligence package for a company and assemble it into
 * a CompanyIntelligenceConfig for the frontend.
 *
 * Returns null if the symbol has no DB intelligence record yet —
 * the caller should fall back to the static COMPANY_CONFIGS registry.
 *
 * This is the primary entry point for the page router.
 * Equivalent to getSectorIntelligencePackage() for the sector layer.
 */
export async function getCompanyIntelligence(
  symbol:   string,
  fallback?: CompanyIntelligenceConfig,
): Promise<CompanyIntelligenceConfig | null> {
  const sym = symbol.toUpperCase();

  const [scalars, blocks] = await Promise.all([
    getCompanyIntelScalars(sym),
    getCompanyIntelBlocks(sym),
  ]);

  if (!scalars) return null;  // Not yet in DB — use static fallback

  return buildCompanyConfig(scalars, blocks, fallback ?? null);
}
