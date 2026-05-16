// components/sectors/framework/SectorIntelligenceSummary.tsx
//
// LEVEL 1 — INTELLIGENCE SUMMARY
// Institutional-style editorial overview of the sector's current state.
// Designed as an AI-ready slot — currently static editorial text.
// Future: dynamically populated by the AHM Intelligence Engine.
//
// Server-safe.

import SectionLabel from "./SectionLabel";

interface Props {
  summary:     string;
  accentColor: string;
  label?:      string;
}

export default function SectorIntelligenceSummary({
  summary,
  accentColor,
  label = "Sector Intelligence",
}: Props) {
  return (
    <div>
      <SectionLabel label={label} />

      {/* Intelligence card — accent border signals institutional content */}
      <div
        className="rounded-xl border p-6"
        style={{
          borderColor: accentColor + "40",
          background:  accentColor + "08",
        }}
      >
        {/* Accent rule + label */}
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="h-3.5 w-0.5 rounded-full shrink-0"
            style={{ background: accentColor }}
          />
          <p
            className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            AHM Intelligence
          </p>
        </div>

        {/* Summary text — larger weight for readability */}
        <p className="text-[13px] text-tx-primary leading-relaxed font-medium">
          {summary}
        </p>

        {/* Disclaimer */}
        <p className="text-[10px] font-mono text-tx-disabled mt-4 pt-3 border-t border-border-theme">
          Editorial summary · For informational purposes only · Not investment advice
        </p>
      </div>
    </div>
  );
}
