// components/company/RiskCatalystPanel.tsx
//
// Side-by-side risk register and catalyst panel.
// Reusable across all company intelligence pages.

import { SectionLabel } from "./InvestmentThesis";

export type RiskItem = {
  label:       string;
  description: string;
  severity?:   "high" | "medium" | "low";
};

export type CatalystItem = {
  label:       string;
  description: string;
  horizon?:    "near" | "medium" | "long";
};

type RiskCatalystPanelProps = {
  risks:     RiskItem[];
  catalysts: CatalystItem[];
};

const SEVERITY_COLOR: Record<string, string> = {
  high:   "text-loss   border-red-500/40     bg-red-500/5",
  medium: "text-amber-400 border-amber-500/40  bg-amber-500/5",
  low:    "text-tx-secondary border-border-theme bg-surface",
};

const HORIZON_COLOR: Record<string, string> = {
  near:   "text-gain   border-emerald-500/40 bg-emerald-500/5",
  medium: "text-amber-400 border-amber-500/40  bg-amber-500/5",
  long:   "text-tx-secondary border-border-theme bg-surface",
};

const HORIZON_LABEL: Record<string, string> = {
  near: "Near-term", medium: "Medium-term", long: "Long-term",
};

export default function RiskCatalystPanel({ risks, catalysts }: RiskCatalystPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Risks */}
      <section>
        <SectionLabel>Risk Register</SectionLabel>
        <div className="bg-surface border border-border-theme rounded-xl overflow-hidden divide-y divide-border-theme">
          {risks.map((r) => {
            const sev = r.severity ?? "medium";
            const cls = SEVERITY_COLOR[sev];
            return (
              <div key={r.label} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold text-tx-primary">{r.label}</p>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border flex-shrink-0 ${cls}`}>
                    {sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-tx-secondary leading-relaxed">{r.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Catalysts */}
      <section>
        <SectionLabel>Catalysts</SectionLabel>
        <div className="bg-surface border border-border-theme rounded-xl overflow-hidden divide-y divide-border-theme">
          {catalysts.map((c) => {
            const hor = c.horizon ?? "medium";
            const cls = HORIZON_COLOR[hor];
            return (
              <div key={c.label} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold text-tx-primary">{c.label}</p>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border flex-shrink-0 ${cls}`}>
                    {HORIZON_LABEL[hor]}
                  </span>
                </div>
                <p className="text-xs text-tx-secondary leading-relaxed">{c.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
