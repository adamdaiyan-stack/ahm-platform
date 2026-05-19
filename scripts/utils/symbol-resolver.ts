/**
 * scripts/utils/symbol-resolver.ts
 *
 * Resolves any PSX symbol variant → canonical symbol in the companies master.
 *
 * Three resolution layers (applied in order):
 *   1. Static alias map  — known renames/legacy tickers hardcoded here
 *   2. DB aliases column — companies.aliases[] populated over time
 *   3. PSX suffix strip  — XD, XB, XR, XN, NC, IM, FUT trading suffixes
 *
 * Usage:
 *   const resolver = await SymbolResolver.build();
 *   resolver.resolve("FAYSAL");   // → "FABL"
 *   resolver.resolve("HBLXD");    // → "HBL"
 *   resolver.resolve("UNKNOWN");  // → "UNKNOWN" (pass-through, logged)
 *
 * Pipelines that call this:
 *   - ingest-daily-prices.ts    (already handles PSX suffixes inline — will delegate here)
 *   - ingest-announcements.ts   (symbol in announcement HTML may be legacy)
 *   - normalize-corporate-actions.ts
 *
 * Design notes:
 *   - Build once per pipeline run (single DB round-trip)
 *   - All resolution is case-insensitive on input (auto-uppercased)
 *   - Unknown symbols are passed through unchanged; callers decide whether to flag them
 */

import { supabaseAdmin } from "./supabase-admin.js";

// ─── Static alias map ─────────────────────────────────────────────────────────
//
// Format: { "OLD_OR_ALTERNATE": "CANONICAL" }
//
// Add entries here whenever:
//   a) A company changes its PSX ticker (rename, merger, demerger)
//   b) A data source uses a non-standard symbol label
//   c) A scraper returns a legacy symbol the DB doesn't know about
//
// Entries are checked FIRST, before DB aliases and suffix stripping.
// Keep sorted alphabetically by key for easy auditing.

const STATIC_ALIASES: Record<string, string> = {
  // Faysal Bank: PSX ticker is FABL — some sources still use the old FAYSAL code
  FAYSAL: "FABL",

  // Hub Power: some older data sources use HUBC; canonical is HUBCO
  // HUBC: "HUBCO",   // Uncomment if confirmed from a real data source

  // Add future renames below:
  // OLD_SYMBOL: "NEW_SYMBOL",
};

// ─── PSX trading suffixes ─────────────────────────────────────────────────────
//
// PSX appends these to the base symbol on certain trading days.
// See ingest-daily-prices.ts for the full explanation.
// Order matters: longer suffixes must be checked before shorter ones to
// avoid stripping "FUT" from a symbol that ends in "IM" then "FUT".

const PSX_SUFFIXES = ["FUT", "XD", "XB", "XR", "XN", "NC", "IM"] as const;

// ─── Resolver class ───────────────────────────────────────────────────────────

export class SymbolResolver {
  /** canonical symbol set (all uppercase) */
  private readonly knownSymbols: Set<string>;
  /** alias → canonical, built from DB aliases + static map */
  private readonly aliasMap: Map<string, string>;

  private constructor(knownSymbols: Set<string>, aliasMap: Map<string, string>) {
    this.knownSymbols = knownSymbols;
    this.aliasMap     = aliasMap;
  }

  /**
   * Build a resolver by loading the companies master from Supabase.
   * Call once per pipeline run.
   */
  static async build(): Promise<SymbolResolver> {
    const { data, error } = await supabaseAdmin
      .from("companies")
      .select("symbol, aliases");

    if (error) {
      throw new Error(`SymbolResolver: failed to load companies master: ${error.message}`);
    }

    const rows = (data ?? []) as { symbol: string; aliases: string[] | null }[];

    const knownSymbols = new Set<string>(rows.map((r) => r.symbol));

    // Build alias map: DB aliases first, then override with static map
    const aliasMap = new Map<string, string>();

    for (const row of rows) {
      for (const alias of row.aliases ?? []) {
        aliasMap.set(alias.toUpperCase(), row.symbol);
      }
    }

    // Static aliases win over DB aliases (they represent confirmed renames)
    for (const [alias, canonical] of Object.entries(STATIC_ALIASES)) {
      aliasMap.set(alias.toUpperCase(), canonical);
    }

    return new SymbolResolver(knownSymbols, aliasMap);
  }

  /**
   * Resolve a raw symbol string → canonical PSX symbol.
   *
   * Returns the input unchanged if no match is found (caller decides whether
   * to treat unknown symbols as an error).
   */
  resolve(raw: string): string {
    const upper = raw.trim().toUpperCase();

    // Layer 1: already canonical
    if (this.knownSymbols.has(upper)) return upper;

    // Layer 2: alias map (covers static + DB aliases)
    const fromAlias = this.aliasMap.get(upper);
    if (fromAlias) return fromAlias;

    // Layer 3: PSX trading suffix stripping
    for (const suffix of PSX_SUFFIXES) {
      if (upper.endsWith(suffix)) {
        const base = upper.slice(0, -suffix.length);
        if (base.length > 0 && this.knownSymbols.has(base)) return base;
        // Also check alias map for the base
        const baseAlias = this.aliasMap.get(base);
        if (baseAlias) return baseAlias;
      }
    }

    // Unresolved: pass through
    return upper;
  }

  /**
   * Resolve and report whether the result is a known canonical symbol.
   * Useful for pipelines that need to distinguish "resolved" from "unknown".
   */
  resolveWithStatus(raw: string): { canonical: string; known: boolean; changed: boolean } {
    const canonical = this.resolve(raw);
    return {
      canonical,
      known:   this.knownSymbols.has(canonical),
      changed: canonical !== raw.trim().toUpperCase(),
    };
  }

  /** Returns the full set of known canonical symbols. */
  getKnownSymbols(): Set<string> {
    return new Set(this.knownSymbols);
  }

  /** Returns the number of known canonical symbols. */
  get size(): number {
    return this.knownSymbols.size;
  }
}
