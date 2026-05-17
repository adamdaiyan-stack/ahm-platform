// components/company/RelatedResearch.tsx
//
// Related research links — live DB rows + placeholder architecture.
// Reusable across all company intelligence pages.

import Link from "next/link";
import { SectionLabel } from "./InvestmentThesis";

export type ResearchItem = {
  slug:         string;
  title:        string;
  rating?:      string | null;
  published_at?: string | null;
};

type RelatedResearchProps = {
  reports: ResearchItem[];
  symbol:  string;
};

const RATING_STYLE: Record<string, string> = {
  BUY:     "text-gain   bg-emerald-500/10 border-emerald-500/30",
  SELL:    "text-loss   bg-red-500/10     border-red-500/30",
  HOLD:    "text-amber-400 bg-amber-500/10 border-amber-500/30",
  NEUTRAL: "text-tx-secondary bg-surface border-border-theme",
};

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RelatedResearch({ reports, symbol }: RelatedResearchProps) {
  return (
    <section>
      <SectionLabel>Research &amp; Coverage</SectionLabel>
      <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">

        {reports.length > 0 ? (
          <div className="divide-y divide-border-theme">
            {reports.map((r) => {
              const ratingStyle = r.rating ? (RATING_STYLE[r.rating] ?? RATING_STYLE.NEUTRAL) : null;
              return (
                <Link
                  key={r.slug}
                  href={"/research/" + r.slug}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-raised transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-tx-primary group-hover:text-gain transition-colors leading-snug mb-1 truncate">
                      {r.title}
                    </p>
                    {r.published_at && (
                      <p className="text-xs text-tx-disabled font-mono">{fmtDate(r.published_at)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {r.rating && ratingStyle && (
                      <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${ratingStyle}`}>
                        {r.rating}
                      </span>
                    )}
                    <span className="text-xs text-tx-disabled group-hover:text-tx-secondary transition-colors font-mono">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}

        {/* Placeholder / request CTA — always shown */}
        <div className="px-5 py-5 border-t border-border-theme bg-raised">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">AHM Coverage</p>
              <p className="text-sm text-tx-secondary">
                Detailed {symbol} research note — earnings model, TP, and catalyst timeline — in preparation.
              </p>
            </div>
            <Link
              href={`https://wa.me/923001234567?text=${encodeURIComponent("I want the " + symbol + " research note from AHM")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xs font-mono text-gain border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Request note →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
