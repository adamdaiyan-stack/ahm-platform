// components/sectors/framework/SectorResearchLayer.tsx
//
// LEVEL 3 — RESEARCH LAYER
// Links to live research_reports rows + structured placeholder for future AI layer.
// When reports are available, renders live report cards.
// When empty, renders a structured "coming soon" placeholder.
//
// NOTE: outer section spacing is managed by SectorPageFrame space-y-16.
// This component owns only its internal layout.
// Server-safe.

import Link         from "next/link";
import SectionLabel from "./SectionLabel";

interface ResearchItem {
  slug:          string;
  title:         string;
  rating?:       string | null;
  published_at?: string | null;
}

interface Props {
  reports:     ResearchItem[];
  accentColor: string;
}

const RATING_STYLES: Record<string, string> = {
  BUY:            "text-gain border-gain/30 bg-gain/10",
  HOLD:           "text-amber-400 border-amber-400/30 bg-amber-400/10",
  SELL:           "text-loss border-loss/30 bg-loss/10",
  "UNDER REVIEW": "text-tx-secondary border-border-theme bg-surface",
};

function fmtDate(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "short",
    year:  "numeric",
  });
}

export default function SectorResearchLayer({ reports, accentColor }: Props) {
  return (
    <div>
      <SectionLabel label="Research Layer" badge="Level 3 · Institutional" />

      {reports.length > 0 ? (
        <div className="space-y-2">
          {reports.map((r) => (
            <Link
              key={r.slug}
              href={`/research/${r.slug}`}
              className="flex items-center justify-between gap-4 bg-surface border border-border-theme rounded-xl px-5 py-4 hover:border-tx-secondary transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {r.rating && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                      RATING_STYLES[r.rating] ?? "text-tx-secondary border-border-theme"
                    }`}
                  >
                    {r.rating}
                  </span>
                )}
                <span className="text-sm text-tx-primary group-hover:text-tx-primary transition-colors truncate">
                  {r.title}
                </span>
              </div>
              <span className="text-[11px] font-mono text-tx-disabled shrink-0">
                {fmtDate(r.published_at)} →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        // Placeholder — shown until research reports are available
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: "Equity Research",
              desc:  "Initiation notes, earnings previews, and BUY / HOLD / SELL recommendations on listed banking stocks.",
            },
            {
              label: "Sector Reports",
              desc:  "Quarterly sector-level analysis covering NIM trends, ADR movement, and key stock calls.",
            },
            {
              label: "AI Summaries",
              desc:  "Machine-generated sector intelligence, powered by AHM's structured financial data layer.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface border border-border-theme rounded-xl p-5"
            >
              <p
                className="text-[10px] font-mono uppercase tracking-widest mb-2"
                style={{ color: accentColor + "99" }}
              >
                {item.label}
              </p>
              <p className="text-[12px] text-tx-secondary leading-relaxed mb-4">
                {item.desc}
              </p>
              <span className="text-[10px] font-mono text-tx-disabled border border-border-theme rounded px-2 py-0.5">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Legal disclaimer */}
      <p className="text-[11px] font-mono text-tx-disabled mt-5 leading-relaxed">
        Educational and informational purposes only · No investment advice ·
        No buy / sell / hold recommendations · Based on publicly available secondary sources.
      </p>
    </div>
  );
}
