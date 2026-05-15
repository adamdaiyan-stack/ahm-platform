import Link from "next/link";
import { getMarketPageData } from "@/services/api";
import { formatPrice, formatPercent, formatVolume, formatMarketCap } from "@/lib/formatters";
import SectorTable, { type SectorRow } from "@/components/market/SectorTable";
import { getMarketStatus, fmtUpdatedAt, marketStatusClass } from "@/lib/market";
import MoverCard, { type MoverRow } from "@/components/market/MoverCard";
import StatCard from "@/components/ui/StatCard";



export default async function MarketPage() {
  const status = getMarketStatus();

  const { index, gainers, losers, active, sectors } = await getMarketPageData();

  const idx = index;
  const idxPositive = idx?.change != null && idx.change >= 0;
  const idxColor = idx?.change == null ? "text-tx-primary" : idxPositive ? "text-gain" : "text-loss";
  const idxPillClass = idx?.change == null
    ? "bg-surface text-tx-secondary border border-border-theme"
    : idxPositive ? "bg-emerald-500/15 text-gain border border-emerald-500/30"
    : "bg-red-500/15 text-loss border border-red-500/30";

  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="px-8 pt-10 pb-8 border-b border-border-theme">
        <div className="max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-2">Pakistan Stock Exchange</p>
            <h1 className="text-4xl font-bold text-tx-primary mb-1">Market Dashboard</h1>
            <p className="text-tx-secondary text-sm">KSE-100 Index · Real-time overview</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <span className={`text-xs font-mono px-3 py-1.5 rounded-full border uppercase tracking-widest ${
              marketStatusClass(status)
            }`}>
              {status.open ? "● " : "○ "}{status.label}
            </span>
            <div className="flex items-end gap-3">
              <p className={"text-5xl font-bold tabular-nums " + idxColor}>
                {idx?.level != null ? Number(idx.level).toLocaleString("en-PK", { minimumFractionDigits: 2 }) : "—"}
              </p>
              {idx?.change != null && (
                <span className={"text-sm font-semibold px-3 py-1.5 rounded-lg tabular-nums border mb-1 " + idxPillClass}>
                  {idxPositive ? "▲" : "▼"} {Math.abs(Number(idx.change)).toLocaleString("en-PK", { minimumFractionDigits: 2 })} ({formatPercent(idx.change_percent)})
                </span>
              )}
            </div>
            <p className="text-xs text-tx-disabled font-mono">Last updated: {fmtUpdatedAt(idx?.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <div className="px-8 py-5 border-b border-border-theme">
        <div className="max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard size="lg" label="Total Volume" value={idx?.volume   != null ? formatVolume(idx.volume)   : "—"} />
          <StatCard size="lg" label="Advances"     value={idx?.advances != null ? String(idx.advances)       : "—"} positive />
          <StatCard size="lg" label="Declines"     value={idx?.declines != null ? String(idx.declines)       : "—"} negative />
          <StatCard size="lg" label="Unchanged"    value={idx?.unchanged!= null ? String(idx.unchanged)      : "—"} />
        </div>
      </div>

      {/* ── THREE MOVERS ──────────────────────────────────── */}
      <div className="px-8 py-8 border-b border-border-theme">
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <MoverCard title="Top Gainers" rows={(gainers ?? []) as MoverRow[]} metric="change" positive    emptyMessage="No price data yet" />
          <MoverCard title="Top Losers"  rows={(losers  ?? []) as MoverRow[]} metric="change" positive={false} emptyMessage="No price data yet" />
          <MoverCard title="Most Active" rows={(active  ?? []) as MoverRow[]} metric="volume" emptyMessage="No volume data yet" />
        </div>
      </div>

      {/* ── SECTOR PERFORMANCE ────────────────────────────── */}
      <div className="px-8 py-8">
        <div className="max-w-6xl">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">Sector Performance</p>
          <SectorTable
            sectors={sectors.map(({ sector, avgChange, totalMarketCap, count }): SectorRow => ({
              sector, avgChange, totalMarketCap, count,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
