// components/dashboard/MarketDriversPanel.tsx
//
// Structured macro intelligence panel — key market drivers with current readings.
// Covers: SBP policy rate, PKR/USD, Brent crude, global market context.
//
// DATA MODEL:
//   Static seed below. Same migration pattern as MarketIntelligenceSummary:
//   future DB table (market_drivers) can supply rows; component contract is stable.
//
// ARCHITECTURE:
//   Pure presentational — no service calls. Seed data is editorial.
//   Future: getMarketDrivers() service call feeds MARKET_DRIVERS at page level.

export type MarketDriver = {
  label:   string;                          // e.g. "SBP Policy Rate"
  reading: string;                          // e.g. "12.0%"
  note:    string;                          // one-line context
  trend:   "positive" | "negative" | "neutral" | "watch";
};

// ── Static seed — editorial, updated manually or via future DB migration ───────
export const MARKET_DRIVERS: MarketDriver[] = [
  {
    label:   "SBP Policy Rate",
    reading: "12.0%",
    note:    "Easing cycle in progress — further cuts expected as CPI approaches 5-7% target.",
    trend:   "watch",
  },
  {
    label:   "PKR / USD",
    reading: "~278",
    note:    "Interbank rate stable; SBP defending range as reserves rebuild toward $10B target.",
    trend:   "neutral",
  },
  {
    label:   "Brent Crude",
    reading: "~$72/bbl",
    note:    "Above $70 floor supportive for OGDC and E&P sector; PSO import cost manageable.",
    trend:   "neutral",
  },
  {
    label:   "IMF Programme",
    reading: "On track",
    note:    "FY26 budget review upcoming — fiscal consolidation path intact ahead of tranche.",
    trend:   "positive",
  },
  {
    label:   "Banking ETR",
    reading: "~53%",
    note:    "Super tax persists — Federal Budget is primary re-rating catalyst for the sector.",
    trend:   "watch",
  },
  {
    label:   "Foreign Flows",
    reading: "Cautious",
    note:    "FIPI net sellers YTD; domestic institutions and retail driving market momentum.",
    trend:   "watch",
  },
];

const TREND_DOT: Record<MarketDriver["trend"], string> = {
  positive: "bg-gain",
  negative: "bg-loss",
  watch:    "bg-amber-400",
  neutral:  "bg-tx-disabled",
};

const TREND_READING: Record<MarketDriver["trend"], string> = {
  positive: "text-gain",
  negative: "text-loss",
  watch:    "text-amber-400",
  neutral:  "text-tx-primary",
};

type Props = {
  drivers?: MarketDriver[];
};

export default function MarketDriversPanel({
  drivers = MARKET_DRIVERS,
}: Props) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
          Market Drivers
        </p>
        <span className="text-xs font-mono text-tx-disabled opacity-50">
          Key macro variables
        </span>
      </div>

      <div className="bg-surface border border-border-theme rounded-xl divide-y divide-border-theme">
        {drivers.map((d, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-3.5">
            {/* Trend dot */}
            <span className={"mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full " + TREND_DOT[d.trend]} />

            {/* Label + note */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono font-bold text-tx-secondary uppercase tracking-wide mb-0.5">
                {d.label}
              </p>
              <p className="text-sm text-tx-primary leading-relaxed">
                {d.note}
              </p>
            </div>

            {/* Reading */}
            <span className={"text-sm font-mono font-bold flex-shrink-0 " + TREND_READING[d.trend]}>
              {d.reading}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
