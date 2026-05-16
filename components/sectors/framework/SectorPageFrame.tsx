// components/sectors/framework/SectorPageFrame.tsx
//
// MASTER SECTOR PAGE FRAMEWORK — three-level layout with section navigation.
//
// LAYOUT
// ──────
//   Mobile:  SectorSideNav (full-width sticky tab strip) → main content (single col)
//   Desktop: SectorSideNav (sticky left sidebar 192px)   → main content (flex-1)
//
//   The outer wrapper uses `flex-col lg:flex-row` so the nav naturally becomes
//   a top bar on mobile and a left column on desktop without JS breakpoint logic.
//
// LEVEL 1 — Retail Overview  (always visible)
//   #sector-snapshot    → SectorSnapshot
//   #sector-drivers     → SectorDrivers
//   #sector-intelligence→ SectorIntelligenceSummary
//
// LEVEL 2 — Advanced Analytics  (expandable, via `analyticsSlot`)
//   #sector-analytics   → section divider anchor
//   Individual sections have their own IDs from ExpandableSection.
//
// LEVEL 3 — Research Layer  (institutional)
//   #sector-research    → SectorResearchLayer

import SectorHero                from "./SectorHero";
import SectorDrivers             from "./SectorDrivers";
import SectorIntelligenceSummary from "./SectorIntelligenceSummary";
import SectorResearchLayer       from "./SectorResearchLayer";
import SectorSideNav, { type NavItem } from "./SectorSideNav";
import SectorSnapshot, { type SnapshotCompany } from "./SectorSnapshot";
import type { SectorFrameworkConfig } from "./types";

interface ResearchItem {
  slug:          string;
  title:         string;
  rating?:       string | null;
  published_at?: string | null;
}

interface Props {
  config:        SectorFrameworkConfig;
  snapshotData?: SnapshotCompany[];
  reports?:      ResearchItem[];
  analyticsSlot?: React.ReactNode;
  navItems?:     NavItem[];
}

export default function SectorPageFrame({
  config,
  snapshotData   = [],
  reports        = [],
  analyticsSlot,
  navItems       = [],
}: Props) {
  return (
    <main className="flex-1 bg-base text-tx-primary">

      {/* ── Hero — always full width ────────────────────────────── */}
      <SectorHero config={config} />

      {/* ── Nav + Content — responsive two-column layout ─────────── */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">

        {/* SectorSideNav renders mobile tab strip + desktop sidebar */}
        {navItems.length > 0 && (
          <SectorSideNav items={navItems} accentColor={config.accentColor} />
        )}

        {/* ── Main content column ──────────────────────────────── */}
        <div className="flex-1 min-w-0 px-6 md:px-10 py-10 space-y-16">

          {/* ══ LEVEL 1 — RETAIL OVERVIEW ══════════════════════════ */}

          {/* Live sector snapshot */}
          {snapshotData.length > 0 && (
            <section id="sector-snapshot" className="scroll-anchor">
              <SectorSnapshot
                companies={snapshotData}
                accentColor={config.accentColor}
              />
            </section>
          )}

          {/* Key drivers */}
          {config.drivers.length > 0 && (
            <section id="sector-drivers" className="scroll-anchor">
              <SectorDrivers drivers={config.drivers} />
            </section>
          )}

          {/* Intelligence summary */}
          <section id="sector-intelligence" className="scroll-anchor">
            <SectorIntelligenceSummary
              summary={config.intelligenceSummary}
              accentColor={config.accentColor}
            />
          </section>

          {/* ══ LEVEL 2 — ADVANCED ANALYTICS ══════════════════════ */}
          {analyticsSlot && (
            <section id="sector-analytics" className="scroll-anchor">
              <div className="flex items-center gap-4 mb-7">
                <div className="h-px flex-1 bg-border-theme" />
                <p className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest shrink-0">
                  Advanced Analytics · Level 2
                </p>
                <div className="h-px flex-1 bg-border-theme" />
              </div>
              <div className="space-y-4">{analyticsSlot}</div>
            </section>
          )}

          {/* ══ LEVEL 3 — RESEARCH LAYER ════════════════════════════ */}
          <section id="sector-research" className="scroll-anchor">
            <SectorResearchLayer
              reports={reports}
              accentColor={config.accentColor}
            />
          </section>

        </div>
      </div>
    </main>
  );
}
