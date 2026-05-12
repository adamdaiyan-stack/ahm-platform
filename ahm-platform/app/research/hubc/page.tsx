// app/research/hubc/page.tsx
// AHM Research Note — Hub Power Company Limited (HUBC)
// Sample research note — for demonstration only

import Link from "next/link";

const NOTE = {
  ticker: "HUBC",
  company: "Hub Power Company Limited",
  sector: "Power / IPP",
  rating: "BUY",
  targetPrice: 182,
  currentPrice: 147.9,
  upside: 23.1,
  analyst: "AHM Research Desk",
  publishedDate: "May 2025",
  updatedDate: "May 2025",

  summary: `Hub Power Company (HUBC) remains one of the most compelling dividend plays on the KSE-100. Despite persistent circular debt headwinds, HUBC's capacity payment structure — backed by sovereign guarantees under long-term Power Purchase Agreements (PPAs) — provides robust earnings visibility through FY2030. We initiate with a BUY and a 12-month target price of PKR 182, implying 23% upside from current levels.`,

  thesis: [
    {
      title: "Capacity Payment Security",
      body: "HUBC earns capacity payments regardless of actual electricity dispatched, underpinned by government-backed PPAs. This creates a quasi-fixed-income revenue stream even during periods of low national demand.",
    },
    {
      title: "Attractive Dividend Yield",
      body: "HUBC has paid a consistent dividend for over a decade, with the trailing yield at ~10.4% — among the highest in the PSX Power sector. Free cash flow conversion is high given the capital-light nature of post-commissioning IPP operations.",
    },
    {
      title: "Thal Nova Expansion",
      body: "HUBC's 330MW coal plant (Thal Nova) adds incremental cash flows and diversifies the generation mix. Once fully operational at peak dispatch, Thal Nova could add PKR 8–10 per share to annual earnings.",
    },
    {
      title: "Circular Debt — Priced In",
      body: "Circular debt receivables (~PKR 60bn outstanding) are a known risk and largely reflected in the current valuation discount. Ongoing government settlement plans and IMF-linked energy sector reforms reduce tail risk over the medium term.",
    },
    {
      title: "SBP Rate Cut Tailwind",
      body: "As Pakistan's policy rate normalises from peak levels, discount rates applied to HUBC's DCF compress — mechanically driving target price upward. Each 100bps cut adds approximately PKR 8–10 to our fair value estimate.",
    },
  ],

  financials: [
    { metric: "Revenue (PKR bn)",        fy23: "89.4",  fy24: "102.1", fy25e: "108.6" },
    { metric: "EBITDA (PKR bn)",          fy23: "28.6",  fy24: "32.4",  fy25e: "35.1"  },
    { metric: "Net Profit (PKR bn)",      fy23: "14.2",  fy24: "15.8",  fy25e: "17.3"  },
    { metric: "EPS (PKR)",               fy23: "12.40", fy24: "13.81", fy25e: "15.12" },
    { metric: "DPS (PKR)",               fy23: "11.50", fy24: "12.50", fy25e: "13.50" },
    { metric: "Dividend Yield (%)",      fy23: "7.8%",  fy24: "8.5%",  fy25e: "9.1%"  },
    { metric: "P/E (x)",                 fy23: "11.9x", fy24: "10.7x", fy25e: "9.8x"  },
    { metric: "EV/EBITDA (x)",           fy23: "8.4x",  fy24: "7.6x",  fy25e: "7.1x"  },
    { metric: "EBITDA Margin (%)",       fy23: "32.0%", fy24: "31.7%", fy25e: "32.3%" },
    { metric: "Net Debt (PKR bn)",       fy23: "42.1",  fy24: "38.7",  fy25e: "34.2"  },
  ],

  valuation: {
    method: "DCF + Dividend Discount Model",
    wacc: "16.5%",
    terminalGrowth: "3.0%",
    dcfValue: "188",
    ddmValue: "176",
    blendedTarget: "182",
    notes: "Blended 60/40 DCF/DDM weighting. Sensitivity: target range PKR 155–210 across WACC 14–19% and terminal growth 2–4%.",
  },

  risks: [
    { label: "Circular Debt Escalation", severity: "High", detail: "If government receivable settlements stall, HUBC's cash flows could be delayed, pressuring dividend cover." },
    { label: "PKR Depreciation", severity: "Medium", detail: "O&M costs partially USD-linked. A sharp PKR devaluation could squeeze margins despite capacity payment indexation." },
    { label: "Policy / Regulatory Risk", severity: "Medium", detail: "PPA renegotiation pressure from NEPRA or government could reduce effective tariff rates at re-contracting." },
    { label: "Coal Price Volatility", severity: "Low", detail: "Thal Nova's fuel cost is passed through under the PPA, limiting net exposure — but procurement delays could reduce dispatch." },
    { label: "Dispatch Risk", severity: "Low", detail: "Capacity payments are fixed, but variable profit contribution from energy payments depends on actual dispatch levels." },
  ],
};

const RATING_STYLES: Record<string, string> = {
  BUY:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  HOLD: "bg-amber-500/15  text-amber-400  border-amber-500/30",
  SELL: "bg-red-500/15    text-red-400    border-red-500/30",
};

const SEVERITY_STYLES: Record<string, string> = {
  High:   "text-red-400",
  Medium: "text-amber-400",
  Low:    "text-gray-500",
};

export default function HUBCResearchNote() {
  const ratingStyle = RATING_STYLES[NOTE.rating] ?? RATING_STYLES["HOLD"];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="px-8 pt-10 pb-8 border-b border-gray-800">
        <div className="max-w-4xl">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-6">
            <Link href="/research" className="hover:text-gray-400 transition-colors">Research</Link>
            <span>/</span>
            <span className="text-gray-500">Equity Note</span>
          </div>

          {/* Rating + ticker row */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded border uppercase tracking-widest ${ratingStyle}`}>
              {NOTE.rating}
            </span>
            <Link
              href={`/stocks/${NOTE.ticker}`}
              className="text-xs font-mono px-3 py-1.5 rounded border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors"
            >
              {NOTE.ticker} ↗
            </Link>
            <span className="text-xs font-mono text-gray-700">{NOTE.sector}</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{NOTE.company}</h1>
          <p className="text-gray-500 text-sm mb-6">
            {NOTE.analyst} · Published {NOTE.publishedDate}
          </p>

          {/* Price summary strip */}
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">Current Price</p>
              <p className="text-2xl font-bold tabular-nums">PKR {NOTE.currentPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">Target Price</p>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">PKR {NOTE.targetPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">Upside</p>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">+{NOTE.upside.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-10 max-w-4xl space-y-12">

        {/* ── EXECUTIVE SUMMARY ───────────────────────────── */}
        <section>
          <SectionLabel>Executive Summary</SectionLabel>
          <p className="text-gray-300 leading-relaxed text-sm">{NOTE.summary}</p>
        </section>

        {/* ── INVESTMENT THESIS ───────────────────────────── */}
        <section>
          <SectionLabel>Investment Thesis</SectionLabel>
          <div className="space-y-4">
            {NOTE.thesis.map((point, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="inline-block w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center leading-none" style={{lineHeight:"20px", textAlign:"center"}}>
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{point.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FINANCIAL SUMMARY ───────────────────────────── */}
        <section>
          <SectionLabel>Financial Summary</SectionLabel>
          <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-left text-xs font-mono text-gray-600 uppercase tracking-widest">Metric</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest">FY23A</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest">FY24A</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-emerald-700 uppercase tracking-widest">FY25E</th>
                </tr>
              </thead>
              <tbody>
                {NOTE.financials.map((row, i) => (
                  <tr key={i} className="border-b border-gray-900 hover:bg-gray-900 transition-colors">
                    <td className="px-5 py-2.5 text-gray-400 text-xs font-mono">{row.metric}</td>
                    <td className="px-5 py-2.5 text-right text-white font-mono text-xs tabular-nums">{row.fy23}</td>
                    <td className="px-5 py-2.5 text-right text-white font-mono text-xs tabular-nums">{row.fy24}</td>
                    <td className="px-5 py-2.5 text-right text-emerald-400 font-mono text-xs tabular-nums">{row.fy25e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-700 font-mono mt-2">A = Actual · E = AHM Estimate · All figures PKR unless stated</p>
        </section>

        {/* ── VALUATION ───────────────────────────────────── */}
        <section>
          <SectionLabel>Valuation</SectionLabel>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">
              <ValItem label="Method"          value={NOTE.valuation.method} />
              <ValItem label="WACC"            value={NOTE.valuation.wacc} />
              <ValItem label="Terminal Growth" value={NOTE.valuation.terminalGrowth} />
              <ValItem label="Target (Blend)"  value={`PKR ${NOTE.valuation.blendedTarget}`} accent />
            </div>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-800">
              <ValItem label="DCF Value"  value={`PKR ${NOTE.valuation.dcfValue}`} />
              <ValItem label="DDM Value"  value={`PKR ${NOTE.valuation.ddmValue}`} />
            </div>
            <p className="text-xs text-gray-600 font-mono mt-4 leading-relaxed">{NOTE.valuation.notes}</p>
          </div>
        </section>

        {/* ── KEY RISKS ───────────────────────────────────── */}
        <section>
          <SectionLabel>Key Risks</SectionLabel>
          <div className="space-y-3">
            {NOTE.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-4 bg-gray-950 border border-gray-900 rounded-xl px-5 py-4">
                <div className="flex-shrink-0 pt-0.5">
                  <span className={`text-xs font-mono font-bold uppercase ${SEVERITY_STYLES[risk.severity]}`}>
                    {risk.severity}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-1">{risk.label}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{risk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DISCLAIMER ──────────────────────────────────── */}
        <section className="border-t border-gray-900 pt-8">
          <p className="text-xs text-gray-700 leading-relaxed font-mono">
            DISCLAIMER — This research note is produced by AHM Platform for informational purposes only.
            It does not constitute financial advice, a solicitation, or an offer to buy or sell any security.
            Estimates and target prices are forward-looking and subject to change without notice.
            Past performance is not indicative of future results. Always conduct your own due diligence
            and consult a licensed financial advisor before making investment decisions.
            Data sourced from PSX, SECP filings, and company announcements.
          </p>
        </section>

      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-gray-700" />
      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{children}</p>
    </div>
  );
}

function ValItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-bold font-mono tabular-nums ${accent ? "text-emerald-400" : "text-white"}`}>{value}</p>
    </div>
  );
}
