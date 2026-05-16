// components/sectors/framework/SectorIntelligenceSummary.tsx
// Level-1 intelligence summary block — institutional-style concise editorial.
// Designed as an AI-ready slot: currently static text, future = API-generated summary.
// Server-safe.

interface Props {
  summary:     string;
  accentColor: string;
  label?:      string;  // defaults to "Intelligence Summary"
}

export default function SectorIntelligenceSummary({
  summary,
  accentColor,
  label = "Intelligence Summary",
}: Props) {
  return (
    <section
      className="rounded-xl border p-6"
      style={{ borderColor: accentColor + "40", background: accentColor + "08" }}
    >
      {/* Label strip */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-3 w-0.5 rounded-full" style={{ background: accentColor }} />
        <p
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {label}
        </p>
        <span className="text-[10px] font-mono text-tx-disabled border border-border-theme rounded px-1.5 py-0.5 ml-auto">
          AI-Ready
        </span>
      </div>

      {/* Summary text */}
      <p className="text-sm text-tx-primary leading-relaxed font-medium">{summary}</p>

      {/* Future AI slot indicator */}
      <p className="text-[10px] font-mono text-tx-disabled mt-3 pt-3 border-t border-border-theme">
        This section will be dynamically populated by the AHM Intelligence Engine.
        Currently displays editorial summary.
      </p>
    </section>
  );
}
