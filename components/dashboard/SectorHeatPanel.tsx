// components/dashboard/SectorHeatPanel.tsx
//
// Sector intelligence grid — merges DB sector config (accent_color, subtitle,
// intelligence_summary) with live sector performance stats (avgChange).
//
// ARCHITECTURE:
//   Accepts pre-fetched Sector[] and SectorStat[] — join done in this component
//   by matching Sector.db_sector_name === SectorStat.sector.
//   No direct DB calls here. Data flows: DB -> service -> page -> component.

import Link from "next/link";
import type { Sector, SectorStat } from "@/types";
import { formatMarketCap } from "@/lib/formatters";

type SectorCard = {
  sector:   Sector;
  stat:     SectorStat | null;
};

type Props = {
  sectors: Sector[];
  stats:   SectorStat[];
};

function fmt(n: number | null): string {
  if (n == null) return "--";
  const sign = n >= 0 ? "+" : "";
  return sign + n.toFixed(2) + "%";
}

function changeColor(n: number | null): string {
  if (n == null) return "text-tx-disabled";
  return n >= 0 ? "text-gain" : "text-loss";
}

function changeBg(n: number | null): string {
  if (n == null) return "";
  return n >= 0 ? "bg-gain/10" : "bg-loss/10";
}

export default function SectorHeatPanel({ sectors, stats }: Props) {
  // Join sectors with stats by db_sector_name
  const statMap = new Map(stats.map(s => [s.sector, s]));

  const cards: SectorCard[] = sectors.map(sector => ({
    sector,
    stat: statMap.get(sector.db_sector_name) ?? null,
  }));

  if (cards.length === 0) {
    return (
      <div className="bg-surface border border-border-theme rounded-xl p-8 text-center">
        <p className="text-tx-disabled text-xs font-mono">Sector data unavailable</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
          Sector Intelligence
        </p>
        <Link
          href="/sectors"
          className="text-xs font-mono text-tx-disabled hover:text-tx-primary transition-colors"
        >
          All sectors &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {cards.map(({ sector, stat }) => {
          const chg = stat?.avgChange ?? null;
          return (
            <Link
              key={sector.slug}
              href={"/sectors/" + sector.slug}
              className="group flex items-center gap-4 bg-surface border border-border-theme rounded-xl px-4 py-3.5 hover:bg-raised transition-all"
            >
              {/* Accent bar */}
              <span
                className="flex-shrink-0 w-0.5 h-8 rounded-full opacity-80"
                style={{ backgroundColor: sector.accent_color }}
              />

              {/* Sector name + subtitle */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-tx-primary group-hover:text-tx-primary transition-colors truncate">
                  {sector.name}
                </p>
                {sector.subtitle && (
                  <p className="text-xs text-tx-disabled truncate mt-0.5">
                    {sector.subtitle}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {stat && (
                  <span className="text-xs text-tx-disabled font-mono hidden md:block">
                    {stat.count} cos
                  </span>
                )}
                {stat?.totalMarketCap != null && stat.totalMarketCap > 0 && (
                  <span className="text-xs text-tx-disabled font-mono hidden lg:block">
                    {formatMarketCap(stat.totalMarketCap)}
                  </span>
                )}
                <span className={"text-sm font-bold font-mono tabular-nums px-2 py-1 rounded " + changeColor(chg) + " " + changeBg(chg)}>
                  {fmt(chg)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
