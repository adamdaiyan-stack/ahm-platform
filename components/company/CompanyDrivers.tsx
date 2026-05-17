// components/company/CompanyDrivers.tsx
//
// Company-level key driver cards — company-specific, not sector-level.
// These are the variables that directly move EPS for this company.
// Reusable across all company intelligence pages.

import { SectionLabel } from "./InvestmentThesis";

export type CompanyDriver = {
  label:       string;
  description: string;
  current:     string;
  trend:       "positive" | "negative" | "neutral" | "watch";
};

type CompanyDriversProps = {
  drivers: CompanyDriver[];
};

const TREND_CONFIG = {
  positive: { dot: "bg-emerald-500",  badge: "text-gain   bg-emerald-500/10 border-emerald-500/30", label: "Positive" },
  negative: { dot: "bg-red-500",      badge: "text-loss   bg-red-500/10     border-red-500/30",     label: "Negative" },
  neutral:  { dot: "bg-tx-secondary", badge: "text-tx-secondary bg-surface  border-border-theme",   label: "Neutral"  },
  watch:    { dot: "bg-amber-500",    badge: "text-amber-400 bg-amber-500/10 border-amber-500/30",  label: "Watch"    },
} as const;

export default function CompanyDrivers({ drivers }: CompanyDriversProps) {
  return (
    <section>
      <SectionLabel>Key Value Drivers</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {drivers.map((d) => {
          const cfg = TREND_CONFIG[d.trend];
          return (
            <div
              key={d.label}
              className="bg-surface border border-border-theme rounded-xl p-5 hover:border-tx-secondary transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <p className="text-sm font-semibold text-tx-primary">{d.label}</p>
                </div>
                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border flex-shrink-0 ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-tx-secondary leading-relaxed mb-3">{d.description}</p>
              <div className="border-t border-border-theme pt-3">
                <p className="text-xs text-tx-disabled font-mono uppercase tracking-widest mb-1">Current</p>
                <p className="text-xs text-tx-secondary font-medium">{d.current}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
