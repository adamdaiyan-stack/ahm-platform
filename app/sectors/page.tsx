// app/sectors/page.tsx
// Sectors index — intelligence-first layout per Sprint 1 brief.
// Answers: which sectors matter today, why they're moving, which stocks drive them.

import Link from "next/link";
import { sectorList } from "@/data/sectors";
import { getSectorPerformance } from "@/services/api/market";
import { SECTOR_SLUG, SLUG_TO_SECTOR } from "@/constants";

export default async function SectorsPage() {
  // Live sector performance from DB
  const perfRows = await getSectorPerformance();
  const perfMap  = Object.fromEntries(perfRows.map((r) => [r.sector, r]));

  // Sort sectors by absolute avg change (most active first)
  const sorted = [...sectorList].sort((a, b) => {
    const pa = perfMap[a.name];
    const pb = perfMap[b.name];
    const aa = pa?.avgChange != null ? Math.abs(pa.avgChange) : -1;
    const ab = pb?.avgChange != null ? Math.abs(pb.avgChange) : -1;
    return ab - aa;
  });

  const topMover = sorted[0];

  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div className="px-8 pt-12 pb-8 border-b border-border-theme">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-tx-disabled font-mono uppercase tracking-widest mb-3">
            PSX · Sector Intelligence
          </p>
          <h1 className="text-4xl font-bold text-tx-primary mb-3">
            Pakistan Market Sectors
          </h1>
          <p className="text-tx-secondary text-sm max-w-xl leading-relaxed">
            Deep-dive intelligence modules ranked by today&apos;s activity —
            economics, key variables, company profiles, and monitoring frameworks.
          </p>
        </div>
      </div>

      {/* ── LIVE SECTOR PERFORMANCE STRIP ─────────────── */}
      <div className="border-b border-border-theme">
        <div className="max-w-6xl mx-auto px-8 py-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {sorted.map((sector) => {
              const perf     = perfMap[sector.name];
              const chg      = perf?.avgChange ?? null;
              const isPos    = chg != null && chg > 0;
              const isNeg    = chg != null && chg < 0;
              const chgColor = chg == null ? "text-tx-disabled"
                : isPos ? "text-gain" : "text-loss";
              const slug = SECTOR_SLUG[sector.name];
              return (
                <Link
                  key={sector.slug}
                  href={slug ? "/sectors/" + slug : "#"}
                  className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg border border-border-theme bg-surface hover:bg-raised transition-colors flex-shrink-0"
                >
                  <span className="text-xs font-mono font-semibold text-tx-primary whitespace-nowrap">
                    {sector.name}
                  </span>
                  <span className={"text-xs font-mono font-bold tabular-nums " + chgColor}>
                    {chg != null ? (isPos ? "+" : "") + chg.toFixed(2) + "%" : "—"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTOR GRID ───────────────────────────────── */}
      <div className="px-8 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((sector, idx) => {
            const perf     = perfMap[sector.name];
            const chg      = perf?.avgChange ?? null;
            const isPos    = chg != null && chg > 0;
            const isNeg    = chg != null && chg < 0;
            const chgColor = chg == null ? "text-tx-disabled"
              : isPos ? "text-gain" : "text-loss";
            const chgBg    = isPos
              ? "rgba(21,128,61,0.08)"
              : isNeg ? "rgba(185,28,28,0.08)" : "transparent";
            const dbSector = sector.name;
            const slug     = SECTOR_SLUG[dbSector];
            const isLeader = idx === 0 && chg != null;

            return (
              <div
                key={sector.slug}
                className={
                  "group bg-surface border rounded-xl flex flex-col transition-all " +
                  (isLeader
                    ? "border-border-theme ring-1 ring-inset ring-white/5"
                    : "border-border-theme hover:border-tx-secondary")
                }
              >
                {/* Top row — accent + live change */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-8 rounded-full flex-shrink-0"
                      style={{ background: sector.accentColor }}
                    />
                    <div>
                      {isLeader && (
                        <p className="text-[9px] font-mono uppercase tracking-widest text-tx-disabled mb-0.5">
                          Most Active
                        </p>
                      )}
                      <h2 className="text-base font-bold text-tx-primary leading-none">
                        {sector.name}
                      </h2>
                      <p className="text-[10px] text-tx-disabled font-mono mt-0.5">
                        {sector.volume}
                      </p>
                    </div>
                  </div>

                  {/* Live change badge */}
                  {chg != null && (
                    <div
                      className={"rounded-lg px-3 py-1.5 text-sm font-bold font-mono tabular-nums " + chgColor}
                      style={{ backgroundColor: chgBg }}
                    >
                      {isPos ? "+" : ""}{chg.toFixed(2)}%
                    </div>
                  )}
                </div>

                {/* Sector description */}
                <p className="text-tx-secondary text-xs leading-relaxed px-5 pb-4 line-clamp-2">
                  {sector.subtitle}
                </p>

                {/* Key stats — 2 from sector data */}
                <div className="border-t border-border-theme mx-5" />
                <div className="grid grid-cols-2 gap-px bg-border-theme mx-5 mt-4 rounded-lg overflow-hidden">
                  {sector.stats.slice(0, 2).map((s, i) => (
                    <div key={i} className="bg-surface px-3 py-2.5">
                      <p
                        className="text-sm font-bold tabular-nums font-mono"
                        style={{ color: sector.accentColor }}
                      >
                        {s.val}
                      </p>
                      <p className="text-[10px] text-tx-disabled font-mono leading-tight mt-0.5">
                        {s.lbl}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Live market stats row */}
                {perf && (
                  <div className="flex gap-4 px-5 py-3">
                    <div>
                      <p className="text-[9px] font-mono uppercase text-tx-disabled tracking-widest">Stocks</p>
                      <p className="text-xs font-mono font-semibold text-tx-secondary tabular-nums">{perf.count}</p>
                    </div>
                    {perf.totalMarketCap > 0 && (
                      <div>
                        <p className="text-[9px] font-mono uppercase text-tx-disabled tracking-widest">Mkt Cap</p>
                        <p className="text-xs font-mono font-semibold text-tx-secondary tabular-nums">
                          {perf.totalMarketCap >= 1e12
                            ? (perf.totalMarketCap / 1e12).toFixed(1) + "T"
                            : (perf.totalMarketCap / 1e9).toFixed(0) + "B"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex gap-2 px-5 pb-5 mt-auto pt-2 border-t border-border-theme">
                  <Link
                    href={slug ? "/sectors/" + slug : "#"}
                    className="flex-1 text-center text-xs font-mono font-semibold px-3 py-2 rounded-lg border transition-all hover:opacity-90"
                    style={{
                      borderColor:     sector.accentColor + "55",
                      color:           sector.accentColor,
                      backgroundColor: sector.accentColor + "14",
                    }}
                  >
                    Intelligence →
                  </Link>
                  <Link
                    href={"/stocks?sector=" + encodeURIComponent(dbSector)}
                    className="text-xs font-mono font-semibold px-3 py-2 rounded-lg border border-border-theme bg-raised text-tx-primary hover:bg-surface hover:border-tx-secondary transition-all whitespace-nowrap"
                  >
                    Stocks →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </main>
  );
}
