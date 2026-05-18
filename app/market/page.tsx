// app/market/page.tsx
//
// Market Intelligence Dashboard — transformed from basic data shell to
// layered intelligence command centre.
//
// LAYOUT
//   [MarketHero]           — full width — KSE-100 level, change, breadth bar
//   [Stats Strip]          — full width — volume, advances, declines, unchanged
//   [2-col grid]
//     Left  (60%):  MarketIntelligenceSummary + MarketDriversPanel + FeaturedResearch
//     Right (40%):  SectorHeatPanel + MoversPanel
//   [SpotlightCard]        — full width bottom — featured intelligence focus
//
// DATA FLOW
//   All data fetched server-side via service layer.
//   Components receive pre-fetched data — no direct Supabase calls in components.
//   Static seeds in MarketIntelligenceSummary, MarketDriversPanel, SpotlightCard
//   are structured identically to future DB-backed shapes (drop-in migration).

import { getMarketPageData }    from "@/services/api";
import { getAllSectors }         from "@/services/api";
import { getPublishedReports }  from "@/services/api";
import { getMarketStatus }      from "@/lib/market";
import { formatVolume }         from "@/lib/formatters";
import StatCard                 from "@/components/ui/StatCard";

// Dashboard components
import MarketHero               from "@/components/dashboard/MarketHero";
import MarketIntelligenceSummary from "@/components/dashboard/MarketIntelligenceSummary";
import SectorHeatPanel          from "@/components/dashboard/SectorHeatPanel";
import MoversPanel              from "@/components/dashboard/MoversPanel";
import MarketDriversPanel       from "@/components/dashboard/MarketDriversPanel";
import SpotlightCard            from "@/components/dashboard/SpotlightCard";
import FeaturedResearch         from "@/components/dashboard/FeaturedResearch";

export default async function MarketPage() {
  const status = getMarketStatus();

  // Parallel data fetch — all independent
  const [{ index, gainers, losers, active, sectors: sectorStats }, sectors, reports] =
    await Promise.all([
      getMarketPageData(),
      getAllSectors(),
      getPublishedReports(3),
    ]);

  const idx = index;

  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <MarketHero index={idx} status={status} />

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <div className="px-6 md:px-8 py-5 border-b border-border-theme">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            size="lg"
            label="Total Volume"
            value={idx?.volume   != null ? formatVolume(idx.volume) : "—"}
          />
          <StatCard
            size="lg"
            label="Advances"
            value={idx?.advances != null ? String(idx.advances) : "—"}
            positive
          />
          <StatCard
            size="lg"
            label="Declines"
            value={idx?.declines != null ? String(idx.declines) : "—"}
            negative
          />
          <StatCard
            size="lg"
            label="Unchanged"
            value={idx?.unchanged != null ? String(idx.unchanged) : "—"}
          />
        </div>
      </div>

      {/* ── MAIN INTELLIGENCE GRID ───────────────────────────────────── */}
      <div className="px-6 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── LEFT COLUMN (3/5) — narrative + drivers + research ── */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              <MarketIntelligenceSummary />
              <MarketDriversPanel />
              <FeaturedResearch reports={reports} />
            </div>

            {/* ── RIGHT COLUMN (2/5) — sectors + movers ─────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <SectorHeatPanel sectors={sectors} stats={sectorStats} />
              <MoversPanel gainers={gainers} losers={losers} />
            </div>

          </div>
        </div>
      </div>

      {/* ── SPOTLIGHT ────────────────────────────────────────────────── */}
      <div className="px-6 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
              Today&rsquo;s Spotlight
            </p>
          </div>
          <SpotlightCard />
        </div>
      </div>

    </main>
  );
}
