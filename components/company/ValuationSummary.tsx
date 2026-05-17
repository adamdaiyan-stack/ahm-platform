// components/company/ValuationSummary.tsx
//
// Structured valuation overview — metric grid, historical range, peer context.
// Reusable across all company intelligence pages.

import { SectionLabel } from "./InvestmentThesis";

export type ValuationPoint = {
  metric:    string;
  current:   string;
  context:   string;
  signal?:   "cheap" | "fair" | "rich";
};

type ValuationSummaryProps = {
  points:          ValuationPoint[];
  summary:         string;
  historicalRange?: string;
  peerContext?:     string;
};

const SIGNAL_STYLE: Record<string, string> = {
  cheap: "text-gain   bg-emerald-500/10 border-emerald-500/30",
  fair:  "text-amber-400 bg-amber-500/10 border-amber-500/30",
  rich:  "text-loss   bg-red-500/10     border-red-500/30",
};
const SIGNAL_LABEL: Record<string, string> = {
  cheap: "Discounted", fair: "Fair Value", rich: "Premium",
};

export default function ValuationSummary({
  points,
  summary,
  historicalRange,
  peerContext,
}: ValuationSummaryProps) {
  return (
    <section>
      <SectionLabel>Valuation Summary</SectionLabel>
      <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">

        {/* Metric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-border-theme border-b border-border-theme">
          {points.map((pt) => {
            const sig = pt.signal ?? "fair";
            const cls = SIGNAL_STYLE[sig];
            return (
              <div key={pt.metric} className="p-5">
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-2">{pt.metric}</p>
                <p className="text-xl font-bold font-mono tabular-nums text-tx-primary mb-1">{pt.current}</p>
                <p className="text-xs text-tx-disabled mb-2">{pt.context}</p>
                {pt.signal && (
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${cls}`}>
                    {SIGNAL_LABEL[sig]}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Commentary */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-tx-secondary leading-relaxed">{summary}</p>
          {(historicalRange || peerContext) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {historicalRange && (
                <div className="bg-raised rounded-lg p-3 border border-border-theme">
                  <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Historical Range</p>
                  <p className="text-xs text-tx-secondary leading-snug">{historicalRange}</p>
                </div>
              )}
              {peerContext && (
                <div className="bg-raised rounded-lg p-3 border border-border-theme">
                  <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Peer Context</p>
                  <p className="text-xs text-tx-secondary leading-snug">{peerContext}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
