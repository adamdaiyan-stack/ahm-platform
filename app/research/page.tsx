// app/research/page.tsx
// Research index — live reports fetched from research_reports table.
// Static "coming soon" sections remain for categories not yet in DB.

import Link from "next/link";
import type { Metadata } from "next";
import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import { getPublishedReports } from "@/services/api";

export const metadata: Metadata = {
  title: "Research | AHM Securities",
  description: "Equity notes, sector reports, and market intelligence from AHM Research Desk.",
};

const RATING_STYLES: Record<string, string> = {
  BUY:            "bg-emerald-500/15 text-gain border-emerald-500/30",
  HOLD:           "bg-amber-500/15  text-amber-500 border-amber-500/30",
  SELL:           "bg-red-500/15    text-loss    border-red-500/30",
  "UNDER REVIEW": "bg-tx-disabled/15 text-tx-secondary border-border-theme",
};

const CATEGORIES = [
  { label: "Macro",         title: "Pakistan Macro Outlook",   desc: "Interest rates, inflation, currency, current account, and fiscal position." },
  { label: "Sector Reports",title: "Sector Deep Dives",        desc: "Quarterly sector-level analysis — drivers, risks, and key stock calls." },
  { label: "Earnings",      title: "Earnings Calendar",        desc: "Upcoming result dates, consensus estimates, and post-result commentary." },
];

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PK", { month: "short", year: "numeric" });
}

export default async function ResearchPage() {
  const reports = await getPublishedReports(20);

  return (
    <main className="flex-1 bg-base text-tx-primary">
      <div className="border-b border-border-theme py-10">
        <PageContainer>
          <SectionTitle
            eyebrow="Research"
            title="AHM Research"
            subtitle="Macro analysis, sector reports, stock coverage, and earnings intelligence."
          />
        </PageContainer>
      </div>

      <PageContainer className="py-10">

        {/* ── Live Reports ── */}
        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">Stock Coverage</p>
        {reports.length > 0 ? (
          <div className="space-y-3 mb-12">
            {reports.map((report) => (
              <Link
                key={report.slug}
                href={`/research/${report.slug}`}
                className="group flex items-start justify-between gap-6 bg-surface border border-border-theme rounded-xl p-6 hover:border-tx-secondary transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {report.rating && (
                      <span className={[
                        "text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase tracking-widest",
                        RATING_STYLES[report.rating] ?? "",
                      ].join(" ")}>
                        {report.rating}
                      </span>
                    )}
                    {report.ticker_symbols.map((t) => (
                      <span key={t} className="text-xs font-mono font-bold text-tx-primary">{t}</span>
                    ))}
                    {report.sectors.map((s) => (
                      <span key={s} className="text-xs text-tx-disabled font-mono">{s}</span>
                    ))}
                    <span className="text-xs text-tx-disabled font-mono ml-auto">{fmtDate(report.published_at)}</span>
                  </div>
                  <h2 className="text-base font-bold text-tx-primary mb-1 group-hover:text-gain transition-colors truncate">
                    {report.title}
                  </h2>
                  {report.summary && (
                    <p className="text-tx-secondary text-xs leading-relaxed line-clamp-2">{report.summary}</p>
                  )}
                </div>
                {report.target_price && (
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Target</p>
                    <p className="text-lg font-bold text-gain tabular-nums">PKR {report.target_price}</p>
                    {report.upside && (
                      <p className="text-xs text-gain font-mono">+{report.upside}%</p>
                    )}
                                   <p className="text-xs text-tx-disabled font-mono mt-1 group-hover:text-tx-secondary transition-colors">Read →</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mb-12 bg-surface border border-border-theme rounded-xl p-10 text-center text-tx-disabled text-sm font-mono">
            No published reports yet
          </div>
        )}

        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">More Research</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="bg-surface border border-border-theme rounded-xl p-6">
              <p className="text-xs font-mono text-amber-500/60 uppercase tracking-widest mb-2">{c.label}</p>
              <h2 className="text-base font-bold text-tx-primary mb-2">{c.title}</h2>
              <p className="text-tx-secondary text-xs leading-relaxed mb-4">{c.desc}</p>
              <span className="text-xs font-mono text-tx-disabled bg-raised border border-border-theme px-2 py-1 rounded">Coming soon</span>
            </div>
          ))}
        </div>
      </PageContainer>
    </main>
  );
}
