// components/company/FinancialSnapshot.tsx
//
// Financial metrics display — reads from financial_metrics DB table via props.
// Shows key metrics in a structured grid with period label and context.
// Reusable across all company intelligence pages.

import { SectionLabel } from "./InvestmentThesis";
import type { FinancialMetrics } from "@/types";
import ChartWrapper from "@/components/ui/charts/ChartWrapper";
import FinancialBarChart from "@/components/ui/charts/FinancialBarChart";
import FinancialLineChart from "@/components/ui/charts/FinancialLineChart";
import type { MetricConfig } from "@/components/ui/charts/FinancialLineChart";

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

  // Banking metric signal flags — computed outside JSX to avoid TSX parser ambiguity
  const hasBanking = m != null && (m.nim != null || m.casa_ratio != null);
  const b = m ? {
    nimPos:  m.nim            != null && m.nim            > 6.5,
    nimNeg:  m.nim            != null && m.nim            < 4.5,
    casaPos: m.casa_ratio     != null && m.casa_ratio     > 55,
    casaNeg: m.casa_ratio     != null && m.casa_ratio     < 40,
    nplPos:  m.npl_ratio      != null && m.npl_ratio      < 6,
    nplNeg:  m.npl_ratio      != null && m.npl_ratio      > 9,
    covPos:  m.coverage_ratio != null && m.coverage_ratio > 90,
    covNeg:  m.coverage_ratio != null && m.coverage_ratio < 80,
    carPos:  m.car            != null && m.car            > 17,
    carNeg:  m.car            != null && m.car            < 13,
    ctiPos:  m.cost_to_income != null && m.cost_to_income < 42,
    ctiNeg:  m.cost_to_income != null && m.cost_to_income > 55,
    depPos:  m.deposit_growth != null && m.deposit_growth > 10,
    depNeg:  m.deposit_growth != null && m.deposit_growth < 0,
    advPos:  m.advance_growth != null && m.advance_growth > 10,
    advNeg:  m.advance_growth != null && m.advance_growth < 0,
  } : null;

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
              <MetricRow label="EPS (PKR)"  value={fmt(m.eps)}       context="Earnings per share" />
              <MetricRow label="PAT"        value={fmtBn(m.pat)}     unit=" PKR" context="Profit after tax" />
              <MetricRow label="ROE"        value={fmt(m.roe)}       unit="%"    context="Return on equity"
                positive={m.roe != null && m.roe > 15} negative={m.roe != null && m.roe < 8} />
              <MetricRow label="Net Margin" value={fmt(m.net_margin)} unit="%"   context="PAT / Revenue" />
              <MetricRow label="PAT Growth" value={fmt(m.pat_growth)} unit="%"   context="YoY change"
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
              <MetricRow label="P/E Ratio"     value={fmt(m.pe_ratio)}       unit="x" context="Price to earnings" />
              <MetricRow label="P/B Ratio"     value={fmt(m.pb_ratio)}       unit="x" context="Price to book" />
              <MetricRow label="DPS (PKR)"     value={fmt(m.dps)}                     context="Dividend per share" />
              <MetricRow label="Div Yield"     value={fmt(m.dividend_yield)} unit="%" context="At current price" />
              <MetricRow label="Payout Ratio"  value={fmt(m.payout_ratio)}   unit="%" context="DPS / EPS" />
            </div>
          </div>
        </div>
      )}

      {/* Banking Intelligence Panel — data-presence-driven, no hardcoded sector checks */}
      {hasBanking && m && b && (
        <div className="mt-4 bg-surface border border-border-theme rounded-xl p-5">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">
            Banking Intelligence
          </p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left column — margin & quality */}
            <div>
              <MetricRow label="Net Interest Margin" value={fmt(m.nim)}            unit="%" context="Spread on interest-earning assets"    positive={b.nimPos}  negative={b.nimNeg}  />
              <MetricRow label="CASA Ratio"          value={fmt(m.casa_ratio)}     unit="%" context="Low-cost deposits as % of total"      positive={b.casaPos} negative={b.casaNeg} />
              <MetricRow label="NPL Ratio"           value={fmt(m.npl_ratio)}      unit="%" context="Non-performing loans / gross advances" positive={b.nplPos}  negative={b.nplNeg}  />
              <MetricRow label="Coverage Ratio"      value={fmt(m.coverage_ratio)} unit="%" context="Provision coverage of NPLs"           positive={b.covPos}  negative={b.covNeg}  />
            </div>
            {/* Right column — capital & growth */}
            <div>
              <MetricRow label="CAR"            value={fmt(m.car)}            unit="%" context="Capital Adequacy Ratio (min 11.5%)"  positive={b.carPos} negative={b.carNeg} />
              <MetricRow label="Cost-to-Income" value={fmt(m.cost_to_income)} unit="%" context="Operating efficiency ratio"          positive={b.ctiPos} negative={b.ctiNeg} />
              <MetricRow label="Deposit Growth" value={fmt(m.deposit_growth)} unit="%" context="YoY growth in total deposits"        positive={b.depPos} negative={b.depNeg} />
              <MetricRow label="Advance Growth" value={fmt(m.advance_growth)} unit="%" context="YoY growth in gross advances"        positive={b.advPos} negative={b.advNeg} />
            </div>
          </div>
        </div>
      )}

      {/* Financial Trends — charts shown when ≥3 periods of data are available */}
      {history.length >= 3 && (() => {
        const fmtBnChart = (v: number) => {
          const abs = Math.abs(v);
          if (abs >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B";
          if (abs >= 1_000_000)     return (v / 1_000_000).toFixed(1) + "M";
          return v.toFixed(0);
        };

        const hasRevenue = history.some((h) => h.revenue != null);
        const hasPAT     = history.some((h) => h.pat     != null);
        const hasEPS     = history.some((h) => h.eps     != null);
        const hasMargins = history.some((h) => h.net_margin != null || h.gross_margin != null || h.ebitda_margin != null);
        const hasROE     = history.some((h) => h.roe != null);
        const hasNIM     = history.some((h) => h.nim != null);

        // Build margin/return metrics dynamically — only include series that have data
        const ratioMetrics: MetricConfig[] = [];
        if (history.some((h) => h.gross_margin  != null)) ratioMetrics.push({ key: "gross_margin",  label: "Gross" });
        if (history.some((h) => h.ebitda_margin != null)) ratioMetrics.push({ key: "ebitda_margin", label: "EBITDA" });
        if (history.some((h) => h.net_margin    != null)) ratioMetrics.push({ key: "net_margin",    label: "Net" });
        if (ratioMetrics.length === 0 && hasROE)          ratioMetrics.push({ key: "roe", label: "ROE" });

        const showAnyBar  = hasRevenue || hasPAT || hasEPS;
        const showAnyLine = ratioMetrics.length > 0 || hasNIM;

        if (!showAnyBar && !showAnyLine) return null;

        return (
          <div className="mt-4 space-y-4">
            {/* Revenue & PAT bars */}
            {(hasRevenue || hasPAT) && (
              <div className="bg-surface border border-border-theme rounded-xl p-5">
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">
                  Revenue &amp; Profit History
                </p>
                <div className={`grid gap-4 ${hasRevenue && hasPAT ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                  {hasRevenue && (
                    <div>
                      <p className="text-xs text-tx-disabled font-mono mb-2">Revenue</p>
                      <ChartWrapper height={160} empty={!hasRevenue}>
                        <FinancialBarChart
                          data={history}
                          metric="revenue"
                          label="Revenue"
                          formatter={fmtBnChart}
                        />
                      </ChartWrapper>
                    </div>
                  )}
                  {hasPAT && (
                    <div>
                      <p className="text-xs text-tx-disabled font-mono mb-2">PAT (Profit After Tax)</p>
                      <ChartWrapper height={160} empty={!hasPAT}>
                        <FinancialBarChart
                          data={history}
                          metric="pat"
                          label="PAT"
                          formatter={fmtBnChart}
                        />
                      </ChartWrapper>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EPS bar */}
            {hasEPS && (
              <div className="bg-surface border border-border-theme rounded-xl p-5">
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">
                  EPS Trend
                </p>
                <ChartWrapper height={160} empty={!hasEPS}>
                  <FinancialBarChart
                    data={history}
                    metric="eps"
                    label="EPS (PKR)"
                    formatter={(v) => "PKR " + v.toFixed(2)}
                  />
                </ChartWrapper>
              </div>
            )}

            {/* Margin / ratio lines */}
            {(ratioMetrics.length > 0 || hasNIM) && (
              <div className="bg-surface border border-border-theme rounded-xl p-5">
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">
                  {hasNIM ? "Margin & Banking Ratios" : "Margin Trends"}
                </p>
                <div className={`grid gap-4 ${(ratioMetrics.length > 0 && hasNIM) ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                  {ratioMetrics.length > 0 && (
                    <div>
                      {ratioMetrics.length > 1 && (
                        <p className="text-xs text-tx-disabled font-mono mb-2">Margins</p>
                      )}
                      <ChartWrapper height={160} empty={ratioMetrics.length === 0}>
                        <FinancialLineChart
                          data={history}
                          metrics={ratioMetrics}
                          unit="%"
                        />
                      </ChartWrapper>
                    </div>
                  )}
                  {hasNIM && (
                    <div>
                      <p className="text-xs text-tx-disabled font-mono mb-2">Net Interest Margin</p>
                      <ChartWrapper height={160} empty={!hasNIM}>
                        <FinancialLineChart
                          data={history}
                          metrics={[{ key: "nim", label: "NIM", color: "#3b82f6" }]}
                          unit="%"
                        />
                      </ChartWrapper>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
