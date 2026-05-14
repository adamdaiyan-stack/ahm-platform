import Link from "next/link";
import AHMLogo from "@/components/ui/AHMLogo";

const NOTE = {
  ticker: "HUBC", company: "Hub Power Company Limited", sector: "Power / IPP",
  rating: "BUY", targetPrice: 182, currentPrice: 147.9, upside: 23.1,
  analyst: "AHM Research Desk", publishedDate: "May 2025",
  summary: `Hub Power Company (HUBC) remains one of the most compelling dividend plays on the KSE-100. Despite persistent circular debt headwinds, HUBC's capacity payment structure — backed by sovereign guarantees under long-term Power Purchase Agreements (PPAs) — provides robust earnings visibility through FY2030. We initiate with a BUY and a 12-month target price of PKR 182, implying 23% upside from current levels.`,
  thesis: [
    { title: "Capacity Payment Security", body: "HUBC earns capacity payments regardless of actual electricity dispatched, underpinned by government-backed PPAs. This creates a quasi-fixed-income revenue stream even during periods of low national demand." },
    { title: "Attractive Dividend Yield", body: "HUBC has paid a consistent dividend for over a decade, with the trailing yield at ~10.4% — among the highest in the PSX Power sector. Free cash flow conversion is high given the capital-light nature of post-commissioning IPP operations." },
    { title: "Thal Nova Expansion", body: "HUBC's 330MW coal plant (Thal Nova) adds incremental cash flows and diversifies the generation mix. Once fully operational at peak dispatch, Thal Nova could add PKR 8–10 per share to annual earnings." },
    { title: "Circular Debt — Priced In", body: "Circular debt receivables (~PKR 60bn outstanding) are a known risk and largely reflected in the current valuation discount. Ongoing government settlement plans and IMF-linked energy sector reforms reduce tail risk over the medium term." },
    { title: "SBP Rate Cut Tailwind", body: "As Pakistan's policy rate normalises from peak levels, discount rates applied to HUBC's DCF compress — mechanically driving target price upward. Each 100bps cut adds approximately PKR 8–10 to our fair value estimate." },
  ],
  financials: [
    { metric: "Revenue (PKR bn)",   fy23: "89.4",  fy24: "102.1", fy25e: "108.6" },
    { metric: "EBITDA (PKR bn)",    fy23: "28.6",  fy24: "32.4",  fy25e: "35.1"  },
    { metric: "Net Profit (PKR bn)",fy23: "14.2",  fy24: "15.8",  fy25e: "17.3"  },
    { metric: "EPS (PKR)",         fy23: "12.40", fy24: "13.81", fy25e: "15.12" },
    { metric: "DPS (PKR)",         fy23: "11.50", fy24: "12.50", fy25e: "13.50" },
    { metric: "Dividend Yield (%)",fy23: "7.8%",  fy24: "8.5%",  fy25e: "9.1%"  },
    { metric: "P/E (x)",           fy23: "11.9x", fy24: "10.7x", fy25e: "9.8x"  },
    { metric: "EV/EBITDA (x)",     fy23: "8.4x",  fy24: "7.6x",  fy25e: "7.1x"  },
    { metric: "EBITDA Margin (%)", fy23: "32.0%", fy24: "31.7%", fy25e: "32.3%" },
    { metric: "Net Debt (PKR bn)", fy23: "42.1",  fy24: "38.7",  fy25e: "34.2"  },
  ],
  valuation: { method: "DCF + Dividend Discount Model", wacc: "16.5%", terminalGrowth: "3.0%", dcfValue: "188", ddmValue: "176", blendedTarget: "182", notes: "Blended 60/40 DCF/DDM weighting. Sensitivity: target range PKR 155–210 across WACC 14–19% and terminal growth 2–4%." },
  risks: [
    { label: "Circular Debt Escalation", severity: "High",   detail: "If government receivable settlements stall, HUBC's cash flows could be delayed, pressuring dividend cover." },
    { label: "PKR Depreciation",          severity: "Medium", detail: "O&M costs partially USD-linked. A sharp PKR devaluation could squeeze margins despite capacity payment indexation." },
    { label: "Policy / Regulatory Risk",  severity: "Medium", detail: "PPA renegotiation pressure from NEPRA or government could reduce effective tariff rates at re-contracting." },
    { label: "Coal Price Volatility",     severity: "Low",    detail: "Thal Nova's fuel cost is passed through under the PPA, limiting net exposure — but procurement delays could reduce dispatch." },
    { label: "Dispatch Risk",             severity: "Low",    detail: "Capacity payments are fixed, but variable profit from energy payments depends on actual dispatch levels." },
  ],
};

const RATING_STYLE: Record<string, string> = {
  BUY:  "bg-emerald-500/15 text-gain border-emerald-500/30",
  HOLD: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  SELL: "bg-red-500/15 text-loss border-red-500/30",
};
const SEVERITY_COLOR: Record<string, string> = { High: "text-loss", Medium: "text-amber-500", Low: "text-tx-secondary" };

export default function HUBCResearchNote() {
  return (
    <main className="min-h-screen bg-base text-tx-primary">
      <div className="px-8 pt-10 pb-8 border-b border-border-theme">
        <div className="max-w-4xl flex justify-between items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-tx-disabled mb-6">
              <Link href="/research" className="hover:text-tx-secondary transition-colors">Research</Link>
              <span>/</span><span className="text-tx-secondary">Equity Note</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className={"text-xs font-mono font-bold px-3 py-1.5 rounded border uppercase tracking-widest " + RATING_STYLE[NOTE.rating]}>{NOTE.rating}</span>
              <Link href={"/stocks/" + NOTE.ticker} className="text-xs font-mono px-3 py-1.5 rounded border border-border-theme text-tx-secondary hover:text-tx-primary hover:border-tx-secondary transition-colors">{NOTE.ticker} ↗</Link>
              <span className="text-xs font-mono text-tx-disabled">{NOTE.sector}</span>
            </div>
            <h1 className="text-3xl font-bold text-tx-primary mb-2">{NOTE.company}</h1>
            <p className="text-tx-secondary text-sm mb-6">{NOTE.analyst} · Published {NOTE.publishedDate}</p>
            <div className="flex flex-wrap gap-6 items-end">
              <div><p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Current Price</p><p className="text-2xl font-bold tabular-nums text-tx-primary">PKR {NOTE.currentPrice.toFixed(2)}</p></div>
              <div><p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Target Price</p><p className="text-2xl font-bold text-gain tabular-nums">PKR {NOTE.targetPrice.toFixed(2)}</p></div>
              <div><p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">Upside</p><p className="text-2xl font-bold text-gain tabular-nums">+{NOTE.upside.toFixed(1)}%</p></div>
            </div>
          </div>
          {/* Letterhead logo */}
          <AHMLogo height={36} className="flex-shrink-0 opacity-75 mt-1 hidden sm:block" />
        </div>
      </div>

      <div className="px-8 py-10 max-w-4xl space-y-12">
        <section>
          <SectionLabel>Executive Summary</SectionLabel>
          <p className="text-tx-secondary leading-relaxed text-sm">{NOTE.summary}</p>
        </section>

        <section>
          <SectionLabel>Investment Thesis</SectionLabel>
          <div className="space-y-4">
            {NOTE.thesis.map((point, i) => (
              <div key={i} className="flex gap-4">
                <span className="flex-shrink-0 mt-0.5 inline-flex w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-gain text-xs font-mono font-bold items-center justify-center">{i + 1}</span>
                <div>
                  <p className="text-tx-primary font-semibold text-sm mb-1">{point.title}</p>
                  <p className="text-tx-secondary text-sm leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Financial Summary</SectionLabel>
          <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-theme">
                  <th className="px-5 py-3 text-left text-xs font-mono text-tx-disabled uppercase tracking-widest">Metric</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-tx-disabled uppercase tracking-widest">FY23A</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-tx-disabled uppercase tracking-widest">FY24A</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-gain uppercase tracking-widest">FY25E</th>
                </tr>
              </thead>
              <tbody>
                {NOTE.financials.map((row, i) => (
                  <tr key={i} className="border-b border-border-theme hover:bg-raised transition-colors">
                    <td className="px-5 py-2.5 text-tx-secondary text-xs font-mono">{row.metric}</td>
                    <td className="px-5 py-2.5 text-right text-tx-primary font-mono text-xs tabular-nums">{row.fy23}</td>
                    <td className="px-5 py-2.5 text-right text-tx-primary font-mono text-xs tabular-nums">{row.fy24}</td>
                    <td className="px-5 py-2.5 text-right text-gain font-mono text-xs tabular-nums">{row.fy25e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-tx-disabled font-mono mt-2">A = Actual · E = AHM Estimate · All figures PKR unless stated</p>
        </section>

        <section>
          <SectionLabel>Valuation</SectionLabel>
          <div className="bg-surface border border-border-theme rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">
              <ValItem label="Method"          value={NOTE.valuation.method} />
              <ValItem label="WACC"            value={NOTE.valuation.wacc} />
              <ValItem label="Terminal Growth" value={NOTE.valuation.terminalGrowth} />
              <ValItem label="Target (Blend)"  value={"PKR " + NOTE.valuation.blendedTarget} accent />
            </div>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-border-theme">
              <ValItem label="DCF Value" value={"PKR " + NOTE.valuation.dcfValue} />
              <ValItem label="DDM Value" value={"PKR " + NOTE.valuation.ddmValue} />
            </div>
            <p className="text-xs text-tx-disabled font-mono mt-4 leading-relaxed">{NOTE.valuation.notes}</p>
          </div>
        </section>

        <section>
          <SectionLabel>Key Risks</SectionLabel>
          <div className="space-y-3">
            {NOTE.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-4 bg-surface border border-border-theme rounded-xl px-5 py-4">
                <span className={"text-xs font-mono font-bold uppercase flex-shrink-0 pt-0.5 " + SEVERITY_COLOR[risk.severity]}>{risk.severity}</span>
                <div>
                  <p className="text-tx-primary text-sm font-semibold mb-1">{risk.label}</p>
                  <p className="text-tx-secondary text-xs leading-relaxed">{risk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-emerald-500/20 rounded-xl p-6 bg-emerald-500/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-gain/60 uppercase tracking-widest mb-1">Ready to Invest?</p>
              <h3 className="text-tx-primary font-bold text-lg mb-1">Trade HUBC on PSX</h3>
              <p className="text-tx-secondary text-sm">Open a brokerage account and start investing in under 48 hours.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a href="https://wa.me/923001234567?text=I%20read%20the%20HUBC%20research%20note%20and%20want%20to%20open%20an%20account" target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono px-4 py-2.5 rounded-lg bg-emerald-500/15 text-gain border border-emerald-500/30 hover:bg-emerald-500/25 transition-all uppercase tracking-widest">WhatsApp Us</a>
              <Link href="/open-account" className="text-xs font-mono px-4 py-2.5 rounded-lg bg-tx-primary text-base hover:opacity-90 transition-opacity font-bold uppercase tracking-widest">Open Account →</Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border-theme pt-8">
          <p className="text-xs text-tx-disabled leading-relaxed font-mono">
            DISCLAIMER — This research note is produced by AHM Platform for informational purposes only. It does not constitute financial advice, a solicitation, or an offer to buy or sell any security. Estimates and target prices are forward-looking and subject to change without notice. Past performance is not indicative of future results. Always conduct your own due diligence and consult a licensed financial advisor before making investment decisions. Data sourced from PSX, SECP filings, and company announcements.
          </p>
        </section>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-border-theme" />
      <p className="text-xs font-mono text-tx-secondary uppercase tracking-widest">{children}</p>
    </div>
  );
}
function ValItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">{label}</p>
      <p className={"text-sm font-bold font-mono tabular-nums " + (accent ? "text-gain" : "text-tx-primary")}>{value}</p>
    </div>
  );
}
