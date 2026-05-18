// lib/company-adapter.ts
//
// Adapter: DB rows → CompanyIntelligenceConfig
//
// ARCHITECTURE
//   This adapter is the bridge between the database intelligence layer
//   and the frontend CompanyIntelligencePage contract.
//
//   Input:  CompanyIntelScalars (1 row from company_intelligence)
//           CompanyIntelBlock[] (N rows from company_intelligence_blocks)
//           CompanyIntelligenceConfig | null (static fallback)
//
//   Output: CompanyIntelligenceConfig (the frontend contract)
//
//   Pattern mirrors buildSectorConfig() in lib/sector-adapter.ts:
//     DB row → adapter → frontend prop
//     If DB field is null → fall back to static config field → fallback default
//
// FALLBACK STRATEGY
//   Fields present in DB → used directly.
//   Fields missing in DB (null) → static fallback value if provided.
//   Entire block type missing from DB → static fallback array if provided.
//   This allows PARTIAL DB migrations: only thesis seeded? Thesis comes from DB,
//   risks/catalysts still come from static config. No frontend changes needed.
//
// MIGRATION STATUS: Active — UBL seeded. HBL/MCB/OGDC remain on static fallback.
// Future: as each company is seeded into DB, static fallback becomes unreachable.

import type { CompanyIntelScalars, CompanyIntelBlock } from "@/types";
import type { CompanyIntelligenceConfig } from "@/components/company/CompanyIntelligencePage";
import type { ThesisTheme, CompanyDriver, RiskItem, CatalystItem, ValuationPoint } from "@/components/company";

// ─── Block → component type mappers ──────────────────────────────────────────

function toThesisTheme(b: CompanyIntelBlock): ThesisTheme {
  return {
    icon:  b.icon  ?? "📌",
    title: b.title,
    body:  b.body  ?? "",
  };
}

function toCompanyDriver(b: CompanyIntelBlock): CompanyDriver {
  return {
    label:       b.title,
    description: b.body ?? "",
    current:     b.current_val ?? "",
    trend:       b.trend ?? "neutral",
  };
}

function toRiskItem(b: CompanyIntelBlock): RiskItem {
  return {
    label:       b.title,
    description: b.body ?? "",
    severity:    b.severity ?? "medium",
  };
}

function toCatalystItem(b: CompanyIntelBlock): CatalystItem {
  return {
    label:       b.title,
    description: b.body ?? "",
    horizon:     b.horizon ?? "medium",
  };
}

function toValuationPoint(b: CompanyIntelBlock): ValuationPoint {
  return {
    metric:  b.metric  ?? b.title,
    current: b.current_val ?? "—",
    context: b.body   ?? "",
    signal:  b.signal ?? "fair",
  };
}

// ─── Block type grouping ──────────────────────────────────────────────────────

function byType(blocks: CompanyIntelBlock[], type: string): CompanyIntelBlock[] {
  return blocks
    .filter((b) => b.block_type === type && b.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

// ─── Main adapter ─────────────────────────────────────────────────────────────

/**
 * Assemble DB rows into the CompanyIntelligenceConfig frontend contract.
 *
 * Progressive fallback at every field:
 *   DB value present → use DB value
 *   DB value null    → use fallback config value
 *   No fallback      → use safe empty default
 *
 * This means a company can be PARTIALLY seeded into the DB and the page
 * will render correctly — mixing DB intelligence with static fallback
 * for any fields not yet migrated.
 */
export function buildCompanyConfig(
  scalars:  CompanyIntelScalars,
  blocks:   CompanyIntelBlock[],
  fallback: CompanyIntelligenceConfig | null,
): CompanyIntelligenceConfig {

  // ── Thesis themes ───────────────────────────────────────────
  const dbThesisThemes = byType(blocks, "thesis_theme").map(toThesisTheme);
  const thesisThemes   = dbThesisThemes.length > 0
    ? dbThesisThemes
    : fallback?.thesisThemes ?? [];

  // ── Drivers ─────────────────────────────────────────────────
  const dbDrivers = byType(blocks, "driver").map(toCompanyDriver);
  const drivers   = dbDrivers.length > 0
    ? dbDrivers
    : fallback?.drivers ?? [];

  // ── Risks ────────────────────────────────────────────────────
  const dbRisks = byType(blocks, "risk").map(toRiskItem);
  const risks   = dbRisks.length > 0
    ? dbRisks
    : fallback?.risks ?? [];

  // ── Catalysts ────────────────────────────────────────────────
  const dbCatalysts = byType(blocks, "catalyst").map(toCatalystItem);
  const catalysts   = dbCatalysts.length > 0
    ? dbCatalysts
    : fallback?.catalysts ?? [];

  // ── Valuation points ─────────────────────────────────────────
  const dbValuationPoints = byType(blocks, "valuation_point").map(toValuationPoint);
  const valuationPoints   = dbValuationPoints.length > 0
    ? dbValuationPoints
    : fallback?.valuationPoints ?? [];

  return {
    // Visual identity — DB always wins; no fallback needed (required field)
    accentColor:    scalars.accent_color,
    exchangeLabel:  scalars.exchange_label ?? fallback?.exchangeLabel,
    peersLabel:     scalars.peers_label    ?? fallback?.peersLabel,

    // Thesis
    thesisSummary:  scalars.thesis_summary ?? fallback?.thesisSummary ?? "",
    thesisThemes,

    // Drivers / Risks / Catalysts
    drivers,
    risks,
    catalysts,

    // Valuation
    valuationPoints,
    valuationSummary:         scalars.valuation_summary          ?? fallback?.valuationSummary         ?? "",
    valuationHistoricalRange: scalars.valuation_historical_range ?? fallback?.valuationHistoricalRange,
    valuationPeerContext:     scalars.valuation_peer_context     ?? fallback?.valuationPeerContext,

    // Dividend
    dividendCommentary:       scalars.dividend_commentary        ?? fallback?.dividendCommentary        ?? "",
    dividendYieldPositioning: scalars.dividend_yield_positioning ?? fallback?.dividendYieldPositioning  ?? "",
    dividendConsistencyNote:  scalars.dividend_consistency_note  ?? fallback?.dividendConsistencyNote   ?? "",
  };
}
