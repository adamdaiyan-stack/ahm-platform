// components/sectors/framework/SectorResearchLayer.tsx
// Level-3 research placeholder — links to research_reports rows + future AI layer.
// When researchSlugs is populated, renders live report cards.
// When empty, shows a structured placeholder indicating what's coming.

import Link from "next/link";

interface ResearchItem {
  slug:        string;
  title:       string;
  rating?:     string | null;
  published_at?: string | null;
}

interface Props {
  reports:     ResearchItem[];
  accentColor: string;
}

const RATING_STYLES: Record<string, string> = {
  BUY:          "text-gain border-gain/30 bg-gain/10",
  HOLD:         "text-amber-400 border-amber-400/30 bg-amber-400/10",
  SELL:         "text-loss border-loss/30 bg-loss/10",
  "UNDER REVIEW": "text-tx-secondary border-border-theme bg-surface",
};

function fmtDate(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PK", { month: "short", year: "numeric" });
}

export default function SectorResearchLayer({ reports, accentColor }: Props) {
  return (
    <section className="mt-10 pt-10 border-t border-border-theme">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-3 w-0.5 rounded-full" style={{ background: accentColor }} />
        <p className="text-xs font-mono uppercase tracking-widest text-tx-disabled">
          Research Layer · Level 3
        </p>
        <span className="text-[10px] font-mono text-tx-disabled border border-border-theme rounded px-1.5 py-0.5 ml-auto">
          Institutional
        </span>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-3">
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
                      RATING_STYLES[r.rating] ?? ""
                    }`}
                  >
                    {r.rating}
                  </span>
                )}
                <span className="text-sm font-semibold text-tx-primary group-hover:text-gain transition-colors truncate">
                  {r.title}
                </span>
              </div>
              <span className="text-xs font-mono text-tx-disabled shrink-0">
                {fmtDate(r.published_at)} →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        // Structured placeholder when no reports yet
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Equity Research", desc: "Initiation notes, earnings previews, and stock-specific BUY/HOLD/SELL recommendations." },
            { label: "Sector Reports",  desc: "Quarterly sector-level analysis — drivers, margin trends, and key stock calls." },
            { label: "AI Summaries",    desc: "Machine-generated sector intelligence powered by AHM's structured data layer." },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface border border-border-theme rounded-xl p-5"
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: accentColor + "99" }}
              >
                {item.label}
              </p>
              <p className="text-xs text-tx-secondary leading-relaxed mb-4">{item.desc}</p>
              <span className="text-[10px] font-mono text-tx-disabled border border-border-theme rounded px-2 py-0.5">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-tx-disabled mt-6 leading-relaxed">
        Educational &amp; informational purposes only · No investment advice ·
        No buy/sell/hold recommendations · Based on publicly available secondary sources.
      </p>
    </section>
  );
}
