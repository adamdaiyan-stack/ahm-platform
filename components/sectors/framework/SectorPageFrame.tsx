// components/sectors/framework/SectorPageFrame.tsx
//
// MASTER SECTOR PAGE FRAMEWORK — three-level layout with section navigation.
//
// LAYOUT
// ──────
//   Mobile:  SectorSideNav (sticky full-width tab strip) → content (single col)
//   Desktop: SectorSideNav (sticky left sidebar 192px)   → content (flex-1)
//
//   Outer wrapper: `flex-col lg:flex-row` — no JS breakpoint logic needed.
//   SectorSideNav handles its own responsive rendering internally.
//
// LEVEL HIERARCHY
// ───────────────
//   LEVEL 1 — Retail Overview  (always visible)
//     sector-snapshot    → SectorSnapshot    (live prices)
//     sector-drivers     → SectorDrivers     (key sector variables)
//     sector-intelligence→ SectorIntelligenceSummary (editorial overview)
//
//   LEVEL 2 — Advanced Analytics  (expandable, via analyticsSlot)
//     sector-analytics   → Level 2 divider anchor
//     Individual section IDs supplied by each ExpandableSection instance.
//
//   LEVEL 3 — Research Layer  (institutional)
//     sector-research    → SectorResearchLayer
//
// SPACING STANDARDS
// ─────────────────
//   space-y-14 between all top-level content sections.
//   px-6 md:px-10 horizontal padding on the content column.
//   py-10 vertical padding on the content column.
//
// DO NOT add section-level spacing inside child components — manage it here.

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
  config:         SectorFrameworkConfig;
  snapshotData?:  SnapshotCompany[];
  reports?:       ResearchItem[];
  analyticsSlot?: React.ReactNode;
  navItems?:      NavItem[];
}

export default function SectorPageFrame({
  config,
  snapshotData  = [],
  reports       = [],
  analyticsSlot,
  navItems      = [],
}: Props) {
  return (
    <main className="flex-1 bg-base text-tx-primary">

      {/* ── Hero — always full width ─────────────────────────────── */}
      <SectorHero config={config} />

      {/* ── Nav + Content — responsive two-column layout ─────────── */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">

        {/* SectorSideNav: mobile tab strip (top) + desktop sidebar (left) */}
        {navItems.length > 0 && (
          <SectorSideNav items={navItems} accentColor={config.accentColor} />
        )}

        {/* ── Main content column ──────────────────────────────────── */}
        <div className="flex-1 min-w-0 px-6 md:px-10 py-10 space-y-14">

          {/* ══ LEVEL 1 — RETAIL OVERVIEW ══════════════════════════ */}

          {snapshotData.length > 0 && (
            <section id="sector-snapshot" className="scroll-anchor">
              <SectorSnapshot
                companies={snapshotData}
                accentColor={config.accentColor}
              />
            </section>
          )}

          {config.drivers.length > 0 && (
            <section id="sector-drivers" className="scroll-anchor">
              <SectorDrivers drivers={config.drivers} />
            </section>
          )}

          <section id="sector-intelligence" className="scroll-anchor">
            <SectorIntelligenceSummary
              summary={config.intelligenceSummary}
              accentColor={config.accentColor}
            />
          </section>

          {/* ══ LEVEL 2 — ADVANCED ANALYTICS ══════════════════════ */}
          {analyticsSlot && (
            <section id="sector-analytics" className="scroll-anchor">

              {/* Level 2 divider — visual break between overview and analytics */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-border-theme" />
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: config.accentColor }}
                  />
                  <p className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest">
                    Advanced Analytics
                  </p>
                  <span className="text-[10px] font-mono text-tx-disabled border border-border-theme rounded px-1.5 py-0.5">
                    Level 2
                  </span>
                </div>
                <div className="h-px flex-1 bg-border-theme" />
              </div>

              <div className="space-y-3">
                {analyticsSlot}
              </div>
            </section>
          )}

          {/* ══ LEVEL 3 — RESEARCH LAYER ═══════════════════════════ */}
          <section id="sector-research" className="scroll-anchor pt-4 border-t border-border-theme">
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
