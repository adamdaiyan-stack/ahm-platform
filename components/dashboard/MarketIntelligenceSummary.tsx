// components/dashboard/MarketIntelligenceSummary.tsx
//
// Editorial market intelligence narrative block.
// Displays 3-4 curated market observations in a readable, institutional style.
//
// DATA MODEL:
//   Currently seeded from MARKET_OBSERVATIONS static config below.
//   Future: replace static seed with DB query (market_intelligence_blocks table)
//   or AI-generated summaries. The component contract is stable — data shape
//   will not change when the source changes.
//
// ARCHITECTURE:
//   Static seed -> DB migration path mirrors sector/company intelligence pattern.
//   Add a market_intelligence table, seed observations, fetch via service layer.

export type MarketObservation = {
  tag:     string;          // short category label e.g. "Banking", "Macro", "Oil & Gas"
  text:    string;          // one-sentence intelligence observation
  trend:   "positive" | "negative" | "neutral" | "watch";
  accent?: string;          // optional CSS color override (defaults to trend color)
};

// ── Static seed — replace with DB fetch when market_intelligence table exists ──
export const MARKET_OBSERVATIONS: MarketObservation[] = [
  {
    tag:   "Monetary Policy",
    text:  "SBP rate-cut cycle continues — 12.0% policy rate (May 2025) with further easing expected as inflation moderates toward 5-7% target range.",
    trend: "watch",
  },
  {
    tag:   "Banking",
    text:  "Banking sector NIM under pressure from rate cuts, partially offset by improving ADR trajectory as private-sector credit demand recovers.",
    trend: "watch",
  },
  {
    tag:   "Oil & Gas",
    text:  "OGDC and E&P sector supported by stable crude above $70 — PKR strength providing partial offset to volumetric growth recovery.",
    trend: "neutral",
  },
  {
    tag:   "Macro",
    text:  "Pakistan macro stabilisation continues — IMF program on track, reserves rebuilding, fiscal consolidation underway ahead of FY26 budget.",
    trend: "positive",
  },
];

const TREND_STYLES: Record<MarketObservation["trend"], { dot: string; tag: string }> = {
  positive: { dot: "bg-gain",           tag: "text-gain border-gain/30 bg-gain/10" },
  negative: { dot: "bg-loss",           tag: "text-loss border-loss/30 bg-loss/10" },
  watch:    { dot: "bg-amber-400",      tag: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
  neutral:  { dot: "bg-tx-disabled",    tag: "text-tx-secondary border-border-theme bg-surface" },
};

type Props = {
  observations?: MarketObservation[];
};

export default function MarketIntelligenceSummary({
  observations = MARKET_OBSERVATIONS,
}: Props) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
          Market Intelligence
        </p>
        <span className="text-xs font-mono text-tx-disabled opacity-50">
          Editorial — updated daily
        </span>
      </div>

      <div className="bg-surface border border-border-theme rounded-xl divide-y divide-border-theme">
        {observations.map((obs, i) => {
          const s = TREND_STYLES[obs.trend];
          return (
            <div key={i} className="flex items-start gap-4 px-5 py-4">
              <span className={"mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full " + s.dot} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={"text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-widest " + s.tag}>
                    {obs.tag}
                  </span>
                </div>
                <p className="text-sm text-tx-primary leading-relaxed">
                  {obs.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
