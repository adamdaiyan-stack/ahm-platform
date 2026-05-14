// data/sectors/types.ts
//
// Defines the shape of a sector intelligence module.
// Each sector file (banking.ts, auto.ts, etc.) exports one object of this type.

export type StatItem = {
  val: string;   // e.g. "Rs594.6B"
  lbl: string;   // e.g. "Listed Sector PAT CY2024"
};

export type TabDef = {
  id: string;     // e.g. "overview" — used as the key in tab state
  label: string;  // e.g. "Overview" — shown in the tab button
  content: string; // raw HTML string, injected via dangerouslySetInnerHTML
};

export type SectorData = {
  slug: string;         // URL slug, e.g. "banking" → /sectors/banking
  name: string;         // Display name, e.g. "Banking"
  volume: string;       // e.g. "Sector Intelligence Module · Volume III"
  subtitle: string;     // Hero description paragraph
  accentColor: string;  // Hex color for the sector accent (used in index cards)
  stats: StatItem[];    // Hero stat strip (up to 5)
  tabs: TabDef[];       // All 13 tabs in order
};
