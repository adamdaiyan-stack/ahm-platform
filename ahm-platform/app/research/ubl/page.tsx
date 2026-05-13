import Link from "next/link";

const NOTE = {
  ticker: "UBL", company: "United Bank Limited", sector: "Banking",
  rating: "BUY", targetPrice: 310, currentPrice: 248.5, upside: 24.7,
  analyst: "AHM Research Desk", publishedDate: "May 2026",
  summary: `United Bank Limited (UBL) is one of Pakistan's largest private sector banks with an asset base exceeding PKR 4 trillion. A combination of re-pricing tailwinds from the SBP rate-cut cycle, improving CASA ratios, strong fee income growth, and an undemanding valuation (P/B ~0.7x) makes UBL our top Banking sector pick. We initiate with BUY and a 12-month price target of PKR 310, implying ~25% upside.`,
  thesis: [
    { title: "Rate Cut Beneficiary — Re-Pricing Upside", body: "As the SBP moves toward monetary easing, UBL's large government securities portfolio (~PKR 1.8 trillion) will see NIMs compress initially but the bank's high CASA ratio (>55%) provides a natural hedge. Fixed-rate long-duration bonds locked in during peak rates will continue generating superior income for 2–3 years." },
    { title: "Dividend Yield Among Best in Banking", body: "UBL has maintained a consistent dividend payout with a trailing yield of ~9–10%. The board has signalled maintaining payout ratios above 70%, and strong capital ratios (CAR ~18%) support continued distributions even through a transition in the rate cycle." },
    { title: "Fee Income and Digital Growth", body: "UBL's digital banking platform continues to scale. Fee, commission, and FX income now contribute ~22% of total revenue, reducing dependency on pure spread income. This mix improvement supports earnings resilience." },
    { title: "Valuation Discount — Re-Rating Catalyst", body: "UBL trades at ~0.7x book value vs. a sector average of ~0.9x. As NPL provisions normalise and ROE recovers to 18%+ (vs. 14% in FY24), we expect a re-rating to at least 0.9x book, unlocking significant upside." },
    { title: "Asset Quality Improving", body: "Gross NPL ratio has declined from a peak of 13.1% (FY21) to ~9.2% (FY25E), with coverage ratio at 90%+. The worst of the energy sector stress is behind UBL; the book is now heavily weighted toward government, consumer, and SME lending." },
  ],
  financials: [
    { metric: "Net Interest Income (PKR bn)",fy23: "98.4",  fy24: "121.6", fy25e: "115.2" },
    { metric: "Total Revenue (PKR bn)",      fy23: "122.1", fy24: "148.3", fy25e: "142.7" },
    { metric: "Pre-Tax Profit (PKR bn)",     fy23: "52.4",  fy24: "68.1",  fy25e: "64.8"  },
    { metric: "Net Profit (PKR bn)",         fy23: "35.8",  fy24: "44.2",  fy25e: "42.1"  },
    { metric: "EPS (PKR)",                  fy23: "29.3",  fy24: "36.1",  fy25e: "34.4"  },
    { metric: "DPS (PKR)",                  fy23: "22.0",  fy24: "26.0",  fy25e: "25.0"  },
    { metric: "Dividend Yield (%)",         fy23: "8.9%",  fy24: "10.5%", fy25e: "10.1%" },
    { metric: "P/E (x)",                    fy23: "8.5x",  fy24: "6.9x",  fy25e: "7.2x"  },
    { metric: "P/B (x)",                    fy23: "0.9x",  fy24: "0.75x", fy25e: "0.70x" },
    { metric: "ROE (%)",                    fy23: "14.1%", fy24: "16.8%", fy25e: "14.3%" },
  ],
  valuation: { method: "Gordon Growth Model + P/B Relative", coe: "18.0%", terminalROE: "16.0%", pbTarget: "0.9x", gbmValue: "315", pbValue: "304", blendedTarget: "310", notes: "Blended 50/50 GGM/P/B. Sensitivity: target range PKR 265–360 across COE 16–20% and terminal ROE 14–18%." },
  risks: [
    { label: "NIM Compression from Rate Cuts", severity: "High",   detail: "Aggressive SBP easing faster than expected would compress spreads before CASA re-pricing benefits materialise." },
    { label: "PKR Depreciation / FX Risk",      severity: "Medium", detail: "UBL has international operations. A significant PKR move affects consolidated financials and capital ratios." },
    { label: "NPL Deterioration",               severity: "Medium", detail: "Slowing economy or energy sector stress could reverse the improving NPL trend, requiring higher provisioning." },
    { label: "Regulatory / Super Tax",           severity: "Medium", detail: "Banking sector super-tax remains a drag on net profitability and could be extended beyond FY26." },
    { label: "Credit Growth Slowdown",           severity: "Low",    detail: "If private sector credit demand remains subdued, fee and volume growth expectations may need revision." },
  ],
};

const RATING_STYLE: Record<string, string> = {
  BUY:  "bg-emerald-500/15 text-gain border-emerald-500/30",
  HOLD: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  SELL: "bg-red-500/15 text-loss border-red-500/30",
};
const SEVERITY_COLOR: Record<string, string> = { High: "text-loss", Medium: "text-amber-500", Low: "text-tx-secondary" };

export default function UBLResearchNote() {
  return (
    <main className="min-h-screen bg-base text-tx-primary">
      <div className="px-8 pt-10 pb-8 border-b border-border-theme">
        <div className="max-w-4xl">
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
          <p className="text-xs text-tx-disabled font-mono mt-2">A = Actual · E = AHM Estimate · Banking financials in PKR unless stated</p>
        </section>

        <section>
          <SectionLabel>Valuation</SectionLabel>
          <div className="bg-surface border border-border-theme rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">
              <ValItem label="Method"         value={NOTE.valuation.method} />
              <ValItem label="Cost of Equity" value={NOTE.valuation.coe} />
              <ValItem label="Terminal ROE"   value={NOTE.valuation.terminalROE} />
              <ValItem label="Target (Blend)" value={"PKR " + NOTE.valuation.blendedTarget} accent />
            </div>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-border-theme">
              <ValItem label="GGM Value"  value={"PKR " + NOTE.valuation.gbmValue} />
              <ValItem label="P/B Value"  value={"PKR " + NOTE.valuation.pbValue} />
              <ValItem label="P/B Target" value={NOTE.valuation.pbTarget} />
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
              <h3 className="text-tx-primary font-bold text-lg mb-1">Trade UBL on PSX</h3>
              <p className="text-tx-secondary text-sm">Open a brokerage account and start investing in under 48 hours.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a href="https://wa.me/923001234567?text=I%20read%20the%20UBL%20research%20note%20and%20want%20to%20open%20an%20account" target="_blank" rel="noopener noreferrer"
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
