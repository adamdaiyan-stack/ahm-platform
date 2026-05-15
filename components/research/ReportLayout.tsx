"use client";
// components/research/ReportLayout.tsx
// Reusable renderer for structured research_reports content.
// Handles: header, thesis, financials table, valuation, risks.
// All data comes from the DB — zero hardcoded content here.

import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import type { ResearchReport, RiskSeverity } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RATING_STYLE: Record<string, string> = {
  "BUY":          "bg-emerald-500/15 text-gain border-emerald-500/30",
  "HOLD":         "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "SELL":         "bg-red-500/15 text-loss border-red-500/30",
  "UNDER REVIEW": "bg-tx-disabled/15 text-tx-secondary border-border-theme",
};

const SEVERITY_COLOR: Record<RiskSeverity, string> = {
  High:   "text-loss",
  Medium: "text-amber-500",
  Low:    "text-tx-secondary",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "long", year: "numeric",
  });
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-mono uppercase tracking-widest text-tx-disabled mb-5 pb-3 border-b border-border-theme">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportLayout({ report }: { report: ResearchReport }) {
  const { content, ticker_symbols } = report;
  const primaryTicker = ticker_symbols?.[0] ?? null;

  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* ── Report Header ── */}
      <div className="px-6 md:px-8 pt-10 pb-8 border-b border-border-theme">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Research", href: "/research" },
              { label: "Equity Note" },
            ]}
          />

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {report.rating && (
              <span className={[
                "text-xs font-mono font-bold px-3 py-1.5 rounded border uppercase tracking-widest",
                RATING_STYLE[report.rating] ?? "",
              ].join(" ")}>
                {report.rating}
              </span>
            )}
            {primaryTicker && (
              <Link
                href={`/stocks/${primaryTicker}`}
                className="text-xs font-mono px-3 py-1.5 rounded border border-border-theme text-tx-secondary hover:text-tx-primary hover:border-tx-secondary transition-colors"
              >
                {primaryTicker} ↗
              </Link>
            )}
            {report.sectors.map((s) => (
              <span key={s} className="text-xs font-mono text-tx-disabled">{s}</span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-tx-primary mb-2 leading-tight">{report.title}</h1>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-xs font-mono text-tx-disabled">{report.author}</span>
            <span className="text-tx-disabled text-xs">·</span>
            <span className="text-xs font-mono text-tx-disabled">{fmtDate(report.published_at)}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 space-y-2">

        {/* Valuation strip */}
        {(report.target_price || report.current_price || report.upside) && (
          <div className="flex gap-6 flex-wrap mb-10 bg-surface border border-border-theme rounded-xl px-6 py-5">
            {report.current_price && (
              <div>
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Current Price</p>
                <p className="text-2xl font-bold tabular-nums">PKR {report.current_price.toFixed(2)}</p>
              </div>
            )}
            {report.target_price && (
              <div>
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Price Target</p>
                <p className="text-2xl font-bold text-gain tabular-nums">PKR {report.target_price.toFixed(2)}</p>
              </div>
            )}
            {report.upside && (
              <div>
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Upside</p>
                <p className="text-2xl font-bold text-gain tabular-nums">+{report.upside.toFixed(1)}%</p>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {report.summary && (
          <Section title="Investment Summary">
            <p className="text-tx-secondary text-sm leading-relaxed">{report.summary}</p>
          </Section>
        )}

        {/* Investment Thesis */}
        {content?.thesis && content.thesis.length > 0 && (
          <Section title="Investment Thesis">
            <div className="space-y-5">
              {content.thesis.map((point, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs font-mono text-tx-disabled w-5 pt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-tx-primary mb-1">{point.title}</h3>
                    <p className="text-tx-secondary text-sm leading-relaxed">{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Financials */}
        {content?.financials && content.financials.length > 0 && (
          <Section title="Financial Summary">
            <div className="overflow-x-auto rounded-xl border border-border-theme">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-theme bg-raised">
                    {["", "FY23", "FY24", "FY25E"].map((h) => (
                      <th key={h} className={[
                        "px-5 py-3 text-xs font-mono uppercase tracking-widest text-tx-disabled whitespace-nowrap",
                        h === "" ? "text-left" : "text-right",
                      ].join(" ")}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.financials.map((row, i) => (
                    <tr key={i} className="border-b border-border-theme last:border-0 hover:bg-raised transition-colors">
                      <td className="px-5 py-3 text-tx-secondary text-xs font-mono whitespace-nowrap">{row.metric}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums text-tx-primary text-sm">{row.fy23 ?? "—"}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums text-tx-primary text-sm">{row.fy24 ?? "—"}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums text-gain   text-sm">{row.fy25e ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* Valuation */}
        {content?.valuation && (
          <Section title="Valuation">
            <div className="bg-surface border border-border-theme rounded-xl px-6 py-5 space-y-3">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Method</p>
                  <p className="text-sm text-tx-primary font-medium">{content.valuation.method}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Blended Target</p>
                  <p className="text-sm font-bold text-gain">PKR {content.valuation.blendedTarget}</p>
                </div>
              </div>
              <p className="text-xs text-tx-secondary leading-relaxed border-t border-border-theme pt-3">
                {content.valuation.notes}
              </p>
            </div>
          </Section>
        )}

        {/* Risks */}
        {content?.risks && content.risks.length > 0 && (
          <Section title="Key Risks">
            <div className="space-y-3">
              {content.risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-4 bg-surface border border-border-theme rounded-xl px-5 py-4">
                  <span className={["text-xs font-mono font-bold w-16 flex-shrink-0 pt-0.5", SEVERITY_COLOR[risk.severity]].join(" ")}>
                    {risk.severity}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-tx-primary mb-1">{risk.label}</p>
                    <p className="text-xs text-tx-secondary leading-relaxed">{risk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* AI Summary (future-ready placeholder) */}
        {report.ai_summary && (
          <Section title="AI Summary">
            <div className="bg-raised border border-border-theme rounded-xl px-5 py-4">
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-2">AI Generated</p>
              <p className="text-sm text-tx-secondary leading-relaxed">{report.ai_summary}</p>
            </div>
          </Section>
        )}

        {/* Disclaimer */}
        <div className="border-t border-border-theme pt-8 mt-10">
          <p className="text-xs text-tx-disabled leading-relaxed max-w-2xl">
            This research note is published by AHM Securities for informational purposes only. It does not constitute investment advice.
            Investors should conduct their own due diligence before making any investment decisions. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </main>
  );
}
