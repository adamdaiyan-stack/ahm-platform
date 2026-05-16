// components/sectors/framework/SectorDrivers.tsx
// Level-1 Key Drivers grid — 4-6 macro/operational variables that move the sector.
// Server-safe.

import type { SectorDriver } from "./types";

interface Props {
  drivers: SectorDriver[];
}

const TREND_STYLES: Record<string, { dot: string; badge: string }> = {
  positive: { dot: "bg-gain",         badge: "text-gain bg-gain/10 border-gain/20" },
  negative: { dot: "bg-loss",         badge: "text-loss bg-loss/10 border-loss/20" },
  neutral:  { dot: "bg-tx-disabled",  badge: "text-tx-secondary bg-surface border-border-theme" },
  watch:    { dot: "bg-amber-400",    badge: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
};

export default function SectorDrivers({ drivers }: Props) {
  return (
    <section>
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">
        Key Drivers
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {drivers.map((d) => {
          const style = TREND_STYLES[d.trend] ?? TREND_STYLES.neutral;
          return (
            <div
              key={d.label}
              className="bg-surface border border-border-theme rounded-xl p-5"
            >
              {/* Label + trend dot */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-tx-primary uppercase tracking-wide">
                  {d.label}
                </span>
                <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
              </div>
              {/* Description */}
              <p className="text-xs text-tx-secondary leading-relaxed mb-3">
                {d.description}
              </p>
              {/* Current reading */}
              <span
                className={`inline-block text-[10px] font-mono border rounded px-2 py-0.5 ${style.badge}`}
              >
                {d.current}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
