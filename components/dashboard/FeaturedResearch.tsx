// components/dashboard/FeaturedResearch.tsx
//
// Featured research reports strip — up to 3 published reports from the DB.
// Compact cards with: ticker symbols, title, rating badge, upside.
//
// ARCHITECTURE:
//   Accepts ResearchReportSummary[] pre-fetched at page level.
//   Shows graceful empty state if no reports published yet.

import Link from "next/link";
import type { ResearchReportSummary } from "@/types";

type Props = {
  reports: ResearchReportSummary[];
};

const RATING_STYLE: Record<string, string> = {
  BUY:          "bg-gain/10 text-gain border-gain/30",
  HOLD:         "bg-amber-400/10 text-amber-400 border-amber-400/30",
  SELL:         "bg-loss/10 text-loss border-loss/30",
  "UNDER REVIEW": "bg-surface text-tx-secondary border-border-theme",
};

function ReportCard({ report }: { report: ResearchReportSummary }) {
  const ratingClass = report.rating
    ? (RATING_STYLE[report.rating] ?? RATING_STYLE["UNDER REVIEW"])
    : "bg-surface text-tx-secondary border-border-theme";

  const upsidePositive = report.upside != null && report.upside >= 0;

  return (
    <Link
      href={"/research/" + report.slug}
      className="group flex flex-col gap-2 bg-surface border border-border-theme rounded-xl p-4 hover:bg-raised transition-all"
    >
      {/* Tickers + rating */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(report.ticker_symbols ?? []).map(t => (
            <span
              key={t}
              className="text-xs font-mono font-bold text-tx-primary bg-raised border border-border-theme px-1.5 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
          {(report.sectors ?? []).map(s => (
            <span
              key={s}
              className="text-xs font-mono text-tx-disabled px-1.5 py-0.5"
            >
              {s}
            </span>
          ))}
        </div>
        {report.rating && (
          <span className={
            "text-xs font-mono font-bold px-2 py-0.5 rounded border flex-shrink-0 " +
            ratingClass
          }>
            {report.rating}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-tx-primary leading-snug group-hover:text-tx-primary transition-colors line-clamp-2">
        {report.title}
      </p>

      {/* Upside + author */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        {report.upside != null ? (
          <span className={
            "text-xs font-mono font-bold " +
            (upsidePositive ? "text-gain" : "text-loss")
          }>
            {upsidePositive ? "+" : ""}{report.upside.toFixed(1)}% upside
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs text-tx-disabled font-mono">{report.author}</span>
      </div>
    </Link>
  );
}

export default function FeaturedResearch({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
            Research
          </p>
        </div>
        <div className="bg-surface border border-border-theme rounded-xl p-6 text-center">
          <p className="text-xs font-mono text-tx-disabled">No published reports yet</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
          Research
        </p>
        <Link
          href="/research"
          className="text-xs font-mono text-tx-disabled hover:text-tx-primary transition-colors"
        >
          All reports &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reports.slice(0, 3).map(r => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
    </section>
  );
}
