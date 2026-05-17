// lib/sector-adapter.ts
//
// Shared adapter: DB types → SectorFrameworkConfig
//
// This is the single, canonical boundary between the database intelligence
// layer and the frontend framework component interface. Every sector page
// that is DB-driven must go through this adapter — never directly construct
// a SectorFrameworkConfig from raw DB rows in a page component.
//
// ADAPTER CONTRACT
//   Input:  Sector (DB row) + SectorDriver[] (DB rows) + SectorFrameworkConfig (fallback)
//   Output: SectorFrameworkConfig (framework interface — unchanged)
//
// FALLBACK STRATEGY
//   Any null/empty DB field falls back to the corresponding value in the
//   static fallback config. The page never breaks if a DB value is missing.
//
// MIGRATION STATUS — COMPLETE (all 7 sectors fully DB-driven)
//
//   All sectors now have the following fields seeded in the sectors table:
//     name · accentColor · subtitle · intelligenceSummary · stats (JSONB)
//   All sectors have 6 rows seeded in sector_drivers table.
//
//   Sector        subtitle  intel_summary  stats  drivers
//   ─────────     ────────  ─────────────  ─────  ───────
//   banking       ✓ DB      ✓ DB           ✓ DB   ✓ DB
//   cement        ✓ DB      ✓ DB           ✓ DB   ✓ DB
//   oil-gas       ✓ DB      ✓ DB           ✓ DB   ✓ DB
//   fertiliser    ✓ DB      ✓ DB           ✓ DB   ✓ DB
//   power-ipp     ✓ DB      ✓ DB           ✓ DB   ✓ DB
//   textiles      ✓ DB      ✓ DB           ✓ DB   ✓ DB
//   auto          ✓ DB      ✓ DB           ✓ DB   ✓ DB
//
// FALLBACK ROLE (static configs in each FrameworkPage)
//   Static fallback configs (BANKING_CONFIG, CEMENT_CONFIG, etc.) are retained
//   for emergency fallback ONLY. They are NOT the primary source of truth.
//   They activate only if:
//     - Supabase is unreachable
//     - getSectorBySlug() returns null
//     - A DB field is null or missing
//   Do NOT remove them until production stability is fully validated.

import type { Sector, SectorDriver as DbSectorDriver } from "@/types";
import type { SectorFrameworkConfig } from "@/components/sectors/framework";

// ── Driver adapter ────────────────────────────────────────────────────────────

function adaptDrivers(
  rows:     DbSectorDriver[],
  fallback: SectorFrameworkConfig["drivers"],
): SectorFrameworkConfig["drivers"] {
  if (rows.length === 0) return fallback;
  return rows.map((r) => ({
    label:       r.label,
    description: r.description,
    current:     r.current_reading ?? "",
    trend:       r.trend,
  }));
}

// ── Stats adapter ─────────────────────────────────────────────────────────────

function adaptStats(
  dbStats:  Sector["stats"],
  fallback: SectorFrameworkConfig["stats"],
): SectorFrameworkConfig["stats"] {
  if (!dbStats || dbStats.length === 0) return fallback;
  // DB shape { val, lbl } matches SectorStat exactly
  return dbStats as SectorFrameworkConfig["stats"];
}

// ── Primary adapter ───────────────────────────────────────────────────────────

/**
 * Builds a SectorFrameworkConfig from DB data, falling back field-by-field
 * to the static config for any value that is null, empty, or missing.
 *
 * Usage in a FrameworkPage:
 *
 * ```ts
 * const [sector, drivers] = await Promise.all([
 *   getSectorBySlug(slug),
 *   getSectorDrivers(slug),
 * ]);
 * const config = buildSectorConfig(sector, drivers, STATIC_FALLBACK);
 * ```
 */
export function buildSectorConfig(
  sector:   Sector | null,
  drivers:  DbSectorDriver[],
  fallback: SectorFrameworkConfig,
): SectorFrameworkConfig {
  if (!sector) {
    // DB unavailable — use full static fallback with whatever drivers we got
    return {
      ...fallback,
      drivers: adaptDrivers(drivers, fallback.drivers),
    };
  }

  return {
    slug:                sector.slug,
    name:                sector.name             || fallback.name,
    accentColor:         sector.accent_color     || fallback.accentColor,
    subtitle:            sector.subtitle         ?? fallback.subtitle,
    stats:               adaptStats(sector.stats, fallback.stats),
    drivers:             adaptDrivers(drivers, fallback.drivers),
    intelligenceSummary: sector.intelligence_summary ?? fallback.intelligenceSummary,
  };
}
