// components/sectors/framework/types.ts
// Shared type definitions for the Master Sector Page Framework.
// Every sector module that adopts the new framework must conform to SectorFrameworkConfig.
//
// NOTE: analyticsSections (Level 2) are NOT in the config — they are composed directly
// by each sector page. This avoids ReactNode in serialised config objects (RSC boundary).

export type SectorStat = {
  val: string;   // e.g. "Rs594.6B"
  lbl: string;   // e.g. "Listed Sector PAT CY2024"
};

export type DriverTrend = "positive" | "negative" | "neutral" | "watch";

export type SectorDriver = {
  label:       string;       // e.g. "SBP Policy Rate"
  description: string;       // Why this variable matters
  current:     string;       // Current reading / status string
  trend:       DriverTrend;  // Colour signal for the dot
};

// Top-level config object — contains only serialisable data (no ReactNode).
// Passed from sector page → SectorPageFrame → Level-1 components.
export type SectorFrameworkConfig = {
  slug:                string;
  name:                string;        // e.g. "Banking"
  accentColor:         string;        // Hex — accent stripe + labels
  subtitle:            string;        // Hero paragraph
  stats:               SectorStat[];  // Up to 5 hero stats
  drivers:             SectorDriver[];// 4–6 key drivers
  intelligenceSummary: string;        // Editorial paragraph (AI-ready slot)
};
