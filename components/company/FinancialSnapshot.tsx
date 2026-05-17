// components/company/FinancialSnapshot.tsx
//
// Financial metrics display — reads from financial_metrics DB table via props.
// Shows key metrics in a structured grid with period label and context.
// Reusable across all company intelligence pages.

import { SectionLabel } from "./InvestmentThesis";
import type { FinancialMetrics } from "@/types";

type MetricRowProps = {
  label:   string;
  value:   string | null | undefined;
  unit?:   string;
  context?: string;
  positive?: boolean;
  negative?: boolean;
};

function MetricRow({ label, value, unit, context, positive, negative }: MetricRowProps) {
  const valColor = positive ? "text-gain" : negative ? "text-loss" : "text-tx-primary";
  const display  = value != null && value !== "" ? `${value}${unit ?? ""}` : "—";
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-theme last:border-0">
      <div>
        <p className="text-xs text-tx-secondary">{label}</p>
        {context && <p className="text-xs text-tx-disabled font-mono mt-0.5">{context}</p>}
      </div>
      <p className={`text-sm font-bold font-mono tabular-nums ${valColor}`}>{display}</p>
    </div>
  );
}

function fmt(n: number | null | undefined, decimals = 2): string | null {
  if (n == null) return null;
  return n.toFixed(decimals);
}

function fmtBn(n: number | null | undefined): string | null {
  if (n == null) return null;
  if (Math.abs(n) >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (Math.abs(n) >= 1_000_000)     return (n / 1_000_000).toFixed(1) + "M";
  return n.toFixed(0);
}

type FinancialSnapshotProps = {
  latest:   FinancialMetrics | null;
  history:  FinancialMetrics[];
};

export default function FinancialSnapshot({ latest, history }: FinancialSnapshotProps) {
  const m = latest;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>Financial Snapshot</SectionLabel>
        {m && (
          <span className="text-xs font-mono text-tx-disabled bg-surface border border-border-theme px-2 py-1 rounded">
            {m.period}
          </span>
        )}
      </div>

      {!m ? (
        <div className="bg-surface border border-border-theme rounded-xl p-8 text-center">
          <p className="text-tx-disabled text-sm font-mono">Financial data not yet available</p>
          <p className="text-tx-disabled text-xs mt-1 opacity-60">Data pipeline in progress</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Income & Returns */}
          <div className="bg-surface border border-border-theme rounded-xl p-5">
            <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">
              Profitability
            </p>
            <div className="mt-3">
              <MetricRow label="EPS (PKR)"     value={fmt(m.eps)}              context="Earnings per share" />
              <MetricRow label="PAT"            value={fmtBn(m.pat)}           unit=" PKR" context="Profit after tax" />
              <MetricRow label="ROE"            value={fmt(m.roe)}             unit="%"    context="Return on equity"
                positive={m.roe != null && m.roe > 15} negative={m.roe != null && m.roe < 8} />
              <MetricRow label="Net Margin"     value={fmt(m.net_margin)}      unit="%"    context="PAT / Revenue" />
              <MetricRow label="PAT Growth"     value={fmt(m.pat_growth)}      unit="%"    context="YoY change"
                positive={m.pat_growth != null && m.pat_growth > 0}
                negative={m.pat_growth != null && m.pat_growth < 0} />
            </div>
          </div>

          {/* Valuation & Dividend */}
          <div className="bg-surface border border-border-theme rounded-xl p-5">
            <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">
              Valuation &amp; Returns
            </p>
            <div className="mt-3">
              <MetricRow label="P/E Ratio"      value={fmt(m.pe_ratio)}        unit="x"    context="Price to earnings" />
              <MetricRow label="P/B Ratio"      value={fmt(m.pb_ratio)}        unit="x"    context="Price to book" />
              <MetricRow label="DPS (PKR)"       value={fmt(m.dps)}                        context="Dividend per share" />
              <MetricRow label="Dividend Yield"  value={fmt(m.dividend_yield)}  unit="%"    context="At current price" />
              <MetricRow label="Payout Ratio"    value={fmt(m.payout_ratio)}    unit="%"    context="DPS / EPS" />
            </div>
          </div>

        </div>
      )}

      {/* History strip */}
      {history.length > 1 && (
        <div className="mt-3 bg-surface border border-border-theme rounded-xl p-4">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">EPS History</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {history.map((h) => (
              <div key={h.period} className="flex-shrink-0 text-center min-w-16">
                <p className="text-xs text-tx-disabled font-mono mb-1">{h.period}</p>
                <p className="text-sm font-bold font-mono tabular-nums text-tx-primary">
                  {h.eps != null ? h.eps.toFixed(2) : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
