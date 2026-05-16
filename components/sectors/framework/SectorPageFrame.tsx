// components/sectors/framework/SectorPageFrame.tsx
//
// MASTER SECTOR PAGE FRAMEWORK — canonical three-level layout wrapper.
//
// LEVEL 1 — Retail Overview  (always visible)
//   Hero → Snapshot → Key Drivers → Intelligence Summary
//
// LEVEL 2 — Advanced Analytics  (composed by each sector page via `analyticsSlot`)
//   The slot pattern is used here so the sector page can pass fully-rendered
//   ExpandableSection trees without storing ReactNode inside the config object.
//
// LEVEL 3 — Research Layer  (institutional, live reports + future AI slot)
//
// Usage: sector pages compose ExpandableSection blocks and pass them as
// `analyticsSlot`. See BankingFrameworkPage for the reference implementation.

import SectorHero                  from "./SectorHero";
import SectorDrivers               from "./SectorDrivers";
import SectorIntelligenceSummary   from "./SectorIntelligenceSummary";
import SectorResearchLayer         from "./SectorResearchLayer";
import SectorSnapshot, { type SnapshotCompany } from "./SectorSnapshot";
import type { SectorFrameworkConfig } from "./types";

interface ResearchItem {
  slug:         string;
  title:        string;
  rating?:      string | null;
  published_at?: string | null;
}

interface Props {
  config:        SectorFrameworkConfig;
  snapshotData?: SnapshotCompany[];
  reports?:      ResearchItem[];
  // Level 2 slot — sector page passes pre-composed ExpandableSection tree
  analyticsSlot?: React.ReactNode;
}

export default function SectorPageFrame({
  config,
  snapshotData   = [],
  reports        = [],
  analyticsSlot,
}: Props) {
  return (
    <main className="flex-1 bg-base text-tx-primary">

      {/* ══ LEVEL 1 — RETAIL OVERVIEW ══════════════════════════════ */}
      <SectorHero config={config} />

      <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto space-y-10">

        {/* Live sector snapshot */}
        {snapshotData.length > 0 && (
          <SectorSnapshot
            companies={snapshotData}
            accentColor={config.accentColor}
          />
        )}

        {/* Key drivers grid */}
        {config.drivers.length > 0 && (
          <SectorDrivers drivers={config.drivers} />
        )}

        {/* Intelligence summary — AI-ready editorial slot */}
        <SectorIntelligenceSummary
          summary={config.intelligenceSummary}
          accentColor={config.accentColor}
        />

        {/* ══ LEVEL 2 — ADVANCED ANALYTICS ══════════════════════════ */}
        {analyticsSlot && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border-theme" />
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest shrink-0">
                Advanced Analytics · Level 2
              </p>
              <div className="h-px flex-1 bg-border-theme" />
            </div>
            <div className="space-y-3">{analyticsSlot}</div>
          </section>
        )}

        {/* ══ LEVEL 3 — RESEARCH LAYER ═══════════════════════════════ */}
        <SectorResearchLayer
          reports={reports}
          accentColor={config.accentColor}
        />

      </div>
    </main>
  );
}
