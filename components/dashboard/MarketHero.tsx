// components/dashboard/MarketHero.tsx
//
// Primary dashboard hero — KSE-100 level, change, breadth bar, market status.
// Replaces the inline hero block previously baked into app/market/page.tsx.
//
// ARCHITECTURE:
//   Pure presentational component. All data passed as props from the page.
//   No direct service calls. MarketIndex + MarketStatus come from the page layer.

import type { MarketIndex } from "@/types";
import type { MarketStatus } from "@/lib/market";
import { marketStatusClass, fmtUpdatedAt } from "@/lib/market";
import { formatPercent, formatVolume } from "@/lib/formatters";

type Props = {
  index:  MarketIndex | null;
  status: MarketStatus;
};

function BreadthBar({ advances, declines, unchanged }: {
  advances:  number | null;
  declines:  number | null;
  unchanged: number | null;
}) {
  const a = advances  ?? 0;
  const d = declines  ?? 0;
  const u = unchanged ?? 0;
  const total = a + d + u;
  if (total === 0) return null;

  const aPct = (a / total) * 100;
  const dPct = (d / total) * 100;
  const uPct = (u / total) * 100;

  return (
    <div className="flex flex-col gap-1.5 w-full md:w-72">
      {/* Bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
        <div className="rounded-l-full bg-gain transition-all"    style={{ width: aPct + "%" }} />
        <div className="bg-tx-disabled transition-all"            style={{ width: uPct + "%" }} />
        <div className="rounded-r-full bg-loss transition-all"    style={{ width: dPct + "%" }} />
      </div>
      {/* Labels */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="text-gain">&#9650; {a}</span>
        <span className="text-tx-disabled">{u}</span>
        <span className="text-loss">&#9660; {d}</span>
      </div>
    </div>
  );
}

export default function MarketHero({ index: idx, status }: Props) {
  const idxPositive = idx?.change != null && idx.change >= 0;
  const idxColor = idx?.change == null
    ? "text-tx-primary"
    : idxPositive ? "text-gain" : "text-loss";
  const idxPillClass = idx?.change == null
    ? "bg-surface text-tx-secondary border border-border-theme"
    : idxPositive
    ? "bg-emerald-500/15 text-gain border border-emerald-500/30"
    : "bg-red-500/15 text-loss border border-red-500/30";

  return (
    <div className="px-6 md:px-8 pt-10 pb-8 border-b border-border-theme">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          {/* Left: identity + level */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
                Pakistan Stock Exchange
              </p>
              <span className={
                "text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-widest " +
                marketStatusClass(status)
              }>
                {status.open ? "● " : "○ "}{status.label}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-tx-primary leading-none">
              Market Dashboard
            </h1>
            <p className="text-tx-secondary text-sm">
              KSE-100 Index &middot; Real-time overview
            </p>
          </div>

          {/* Right: level + change + breadth */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-end gap-3">
              <p className={"text-5xl font-bold tabular-nums leading-none " + idxColor}>
                {idx?.level != null
                  ? Number(idx.level).toLocaleString("en-PK", { minimumFractionDigits: 2 })
                  : "—"}
              </p>
              {idx?.change != null && (
                <span className={
                  "text-sm font-semibold px-3 py-1.5 rounded-lg tabular-nums border mb-0.5 " +
                  idxPillClass
                }>
                  {idxPositive ? "▲" : "▼"}{" "}
                  {Math.abs(Number(idx.change)).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  {" "}({formatPercent(idx.change_percent)})
                </span>
              )}
            </div>

            {/* Breadth bar */}
            <BreadthBar
              advances={idx?.advances ?? null}
              declines={idx?.declines ?? null}
              unchanged={idx?.unchanged ?? null}
            />

            <div className="flex items-center gap-3 text-xs text-tx-disabled font-mono">
              {idx?.volume != null && (
                <span>Vol: {formatVolume(idx.volume)}</span>
              )}
              <span>Updated: {fmtUpdatedAt(idx?.updated_at)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
