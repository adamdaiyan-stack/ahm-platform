// components/company/DividendAnalysis.tsx
//
// Structured dividend analysis — history table + sustainability commentary.
// Reusable across all company intelligence pages.

import { SectionLabel } from "./InvestmentThesis";
import type { Dividend } from "@/types";

type DividendAnalysisProps = {
  dividends:        Dividend[];
  commentary:       string;
  yieldPositioning: string;
  consistencyNote:  string;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const TYPE_BADGE: Record<string, string> = {
  final:   "text-gain bg-emerald-500/10 border-emerald-500/30",
  interim: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  special: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  bonus:   "text-purple-400 bg-purple-500/10 border-purple-500/30",
};

export default function DividendAnalysis({
  dividends,
  commentary,
  yieldPositioning,
  consistencyNote,
}: DividendAnalysisProps) {
  return (
    <section>
      <SectionLabel>Dividend Analysis</SectionLabel>
      <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">

        {/* Commentary header */}
        <div className="p-5 border-b border-border-theme">
          <p className="text-sm text-tx-secondary leading-relaxed mb-4">{commentary}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-raised rounded-lg p-3 border border-border-theme">
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Yield Positioning</p>
              <p className="text-xs text-tx-secondary leading-snug">{yieldPositioning}</p>
            </div>
            <div className="bg-raised rounded-lg p-3 border border-border-theme">
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Consistency</p>
              <p className="text-xs text-tx-secondary leading-snug">{consistencyNote}</p>
            </div>
          </div>
        </div>

        {/* Dividend history table */}
        {dividends.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-theme bg-raised">
                  <th className="px-4 py-2.5 text-left text-xs font-mono text-tx-disabled uppercase tracking-widest">Year</th>
                  <th className="px-4 py-2.5 text-left text-xs font-mono text-tx-disabled uppercase tracking-widest">Period</th>
                  <th className="px-4 py-2.5 text-left text-xs font-mono text-tx-disabled uppercase tracking-widest">Type</th>
                  <th className="px-4 py-2.5 text-right text-xs font-mono text-tx-disabled uppercase tracking-widest">PKR/Share</th>
                  <th className="px-4 py-2.5 text-right text-xs font-mono text-tx-disabled uppercase tracking-widest hidden sm:table-cell">Announced</th>
                </tr>
              </thead>
              <tbody>
                {dividends.map((d) => {
                  const type   = (d.dividend_type ?? "final").toLowerCase();
                  const badge  = TYPE_BADGE[type] ?? TYPE_BADGE.final;
                  return (
                    <tr key={d.id} className="border-b border-border-theme hover:bg-raised transition-colors">
                      <td className="px-4 py-2.5 font-mono text-tx-primary text-xs">{d.financial_year ?? "—"}</td>
                      <td className="px-4 py-2.5 text-tx-secondary text-xs">{d.period ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${badge}`}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-gain font-bold tabular-nums">
                        {Number(d.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-tx-disabled text-xs font-mono hidden sm:table-cell">
                        {fmtDate(d.announced_date)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-tx-disabled text-sm font-mono">No dividend history on record</p>
          </div>
        )}
      </div>
    </section>
  );
}
