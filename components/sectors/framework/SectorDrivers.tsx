// components/sectors/framework/SectorDrivers.tsx
//
// LEVEL 1 — KEY SECTOR DRIVERS
// 4-6 macro or structural variables that define sector earnings.
// Each card shows: label, description, current reading, trend signal.
//
// Trend signals use text badges (not just dots) for scannability.
// Server-safe.

import type { SectorDriver } from "./types";
import SectionLabel          from "./SectionLabel";

interface Props {
  drivers: SectorDriver[];
}

// ── Trend badge config ─────────────────────────────────────────────────────
// Text + color for each trend signal. Text badges are more readable than
// dots alone — especially useful when scanning 6 cards quickly.

const TREND_CONFIG: Record<string, { dot: string; text: string; badge: string }> = {
  positive: {
    dot:   "bg-gain",
    text:  "Positive",
    badge: "text-gain border-gain/30 bg-gain/10",
  },
  negative: {
    dot:   "bg-loss",
    text:  "Headwind",
    badge: "text-loss border-loss/30 bg-loss/10",
  },
  neutral: {
    dot:   "bg-tx-disabled",
    text:  "Neutral",
    badge: "text-tx-secondary border-border-theme bg-surface",
  },
  watch: {
    dot:   "bg-amber-400",
    text:  "Watch",
    badge: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  },
};

export default function SectorDrivers({ drivers }: Props) {
  return (
    <div>
      <SectionLabel label="Key Sector Drivers" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {drivers.map((d) => {
          const cfg = TREND_CONFIG[d.trend] ?? TREND_CONFIG.neutral;
          return (
            <div
              key={d.label}
              className="bg-surface border border-border-theme rounded-xl p-5 flex flex-col"
            >
              {/* Header: label + trend dot */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold text-tx-primary uppercase tracking-wide leading-snug">
                  {d.label}
                </span>
                <span className={`shrink-0 text-[10px] font-mono border rounded px-1.5 py-0.5 ${cfg.badge}`}>
                  {cfg.text}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-tx-secondary leading-relaxed flex-1 mb-3">
                {d.description}
              </p>

              {/* Current reading */}
              <div className="flex items-center gap-1.5 pt-3 border-t border-border-theme">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                <span className="text-[11px] font-mono text-tx-secondary">
                  {d.current}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
