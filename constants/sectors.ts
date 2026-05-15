// constants/sectors.ts
// Single source of truth for sector name → URL slug mapping.
// DB stores sector names exactly as the keys below (e.g. "Oil & Gas", "Automobile").
// URL slugs correspond to /sectors/[sector] route segments.

/** Maps DB sector name → URL slug for /sectors/[sector] routes. */
export const SECTOR_SLUG: Record<string, string> = {
  "Banking":    "banking",
  "Automobile": "auto",
  "Cement":     "cement",
  "Fertiliser": "fertiliser",
  "Oil & Gas":  "oil-gas",
  "Power":      "power-ipp",
  "Textiles":   "textiles",
};

/** Reverse map: URL slug → DB sector name. */
export const SLUG_TO_SECTOR: Record<string, string> = Object.fromEntries(
  Object.entries(SECTOR_SLUG).map(([name, slug]) => [slug, name])
);

/** All sector names that have a dedicated intelligence module. */
export const SECTOR_NAMES = Object.keys(SECTOR_SLUG) as string[];

/** All sector URL slugs. */
export const SECTOR_SLUGS = Object.values(SECTOR_SLUG) as string[];
