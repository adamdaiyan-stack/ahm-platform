"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCompaniesBySymbols } from "@/services/api/companies";
import { formatPrice, formatPercent, formatMarketCap } from "@/lib/formatters";

type Mode = "summary" | "research";
type EcoSub = "metrics" | "variables" | "risks";
type LiveCo = { symbol: string; company_name: string; current_price: number | null; change_percent: number | null; market_cap: number | null; pe_ratio: number | null; dividend_yield: number | null; eps: number | null };

// ── Static company profiles ────────────────────────────────────────────────
const PROFILES = [
  {
    sym: "HBL", name: "Habib Bank Limited",
    pat: "Rs74B", casa: 73, adr: 43, nim: "4.8%",
    tagline: "Largest by assets, widest network, international income.",
    meta: [["Assets","Rs6.1T"],["Branches","1,700+ domestic, 55 intl"],["PAT CY2024","Rs74B (flat)"],["EPS","Rs38 · Div Rs16.5"],["H1 2025","PAT Rs34.4B (+19% YoY)"]],
    strength: "Largest branch and ATM network plus 55 international branches — widest distribution moat of any listed bank. Overseas operations (Africa, Middle East) generate USD-denominated fee, remittance, and trade-finance income no domestic-only peer replicates at scale.",
    weakness: "Scale means high opex — managing 1,700+ branches is expensive. ETR of 52%+ among the highest in sector, structurally compressing PAT relative to pre-tax income.",
    diff: "International presence. HBL's overseas operations in Africa, the Middle East, and beyond create earnings diversification structurally unavailable to any other listed Pakistani bank.",
    risk: "SBP policy rate (NII repricing on large asset base) and ETR changes. International credit quality adds a variable absent from purely domestic peers.",
    tags: ["Largest Network","International Ops","AKFED Owned"],
  },
  {
    sym: "UBL", name: "United Bank Limited",
    pat: "Rs76B", casa: 70, adr: 45, nim: "5.1%",
    tagline: "Highest dividend, fastest NII growth, proactive Islamic pivot.",
    meta: [["Assets","~Rs3.5T"],["PAT CY2024","Rs75.7B (+34% YoY)"],["EPS","Rs61 · Div Rs44"],["1Q2025 PAT","Rs36.1B (+124% YoY)"],["Islamic","Converting KPK + Balochistan"]],
    strength: "Combination of high dividend payout (Rs44/share), strong PAT growth, and proactive Islamic conversion — the bank most actively repositioning for post-2028 while delivering near-term earnings growth.",
    weakness: "NII grew 200% YoY in 1Q2025 — partly repricing-driven. High base effects make 2026 YoY comparisons challenging. Islamic conversion carries execution and customer retention risk.",
    diff: "Rs44/share dividend — highest absolute payout of any listed bank in CY2024 — combined with the most accelerated Islamic conversion programme among large conventionals.",
    risk: "SBP policy rate (large PIB portfolio). Islamic conversion pace and execution quality. ADR management as rate normalisation changes the investment return calculus.",
    tags: ["Highest Dividend","Islamic Pivot","PAT +34% CY24"],
  },
  {
    sym: "MEBL", name: "Meezan Bank Limited",
    pat: "Rs102B", casa: 80, adr: 60, nim: "5.8%",
    tagline: "Most profitable CY2024. Islamic leader. 2028 mandate beneficiary.",
    meta: [["Assets","~Rs2.5T"],["Islamic Mkt Share","~35%"],["PAT CY2024","Rs101.5B (record)"],["EPS","Rs57 · Div Rs28"],["1Q2025","PAT Rs22.4B (–12% YoY, high base)"]],
    strength: "35% Islamic banking market share built over 22 years — primary beneficiary of the 2028 Islamic mandate. No conventional bank can replicate this Shariah governance credibility and product depth overnight.",
    weakness: "CY2024 record PAT (Rs101.5B) set an extremely high comparison base. More exposed than peers to GIS yield compression as rates fall. Deposit base is rate-sensitive.",
    diff: "The 2028 Islamic mandate. Every conventional bank must transition; MEBL has a 22-year head start. Its Shariah governance board, product suite, and depositor loyalty create a structural tailwind with no expiry date.",
    risk: "GIS yield levels (Islamic equivalent of PIB yields). Increasing competition as all conventional banks convert Islamic windows to full operations by 2028.",
    tags: ["Most Profitable 2024","Islamic Leader","2028 Mandate Beneficiary"],
  },
  {
    sym: "MCB", name: "MCB Bank Limited",
    pat: "Rs58B", casa: 85, adr: 38, nim: "5.5%",
    tagline: "Best CASA ratio. Most conservative credit. Most stable NIM.",
    meta: [["Assets","~Rs2.8T"],["Branches","1,100+ domestic, 8 overseas"],["PAT CY2024","Rs57.6B (–3% YoY)"],["EPS","Rs48 · Div Rs36"],["Fee Income","Rs24.78B (+10% YoY)"]],
    strength: "Highest CASA ratio of any large listed private bank — a sticky low-cost deposit franchise built over three decades that structurally compresses funding costs below peers. Conservative credit culture produces consistently lower NPL ratios.",
    weakness: "EPS declined in CY2024 despite stable pre-tax income — higher taxes and opex eroding PAT. Nishat Group concentration creates affiliated credit exposure risk.",
    diff: "CASA quality and credit discipline. MCB's combination of high CASA and consistently low NPLs creates the most stable, predictable NIM profile in the sector across cycles.",
    risk: "CASA retention in competitive Islamic savings rate environment. ETR movement on Rs118B+ pre-tax income is a direct PAT lever.",
    tags: ["Nishat Group","Highest CASA","Lowest NPL"],
  },
  {
    sym: "NBP", name: "National Bank of Pakistan",
    pat: "Rs27B", casa: 65, adr: 50, nim: "4.2%",
    tagline: "State-owned. SBP fiscal agent. Highest headline NII growth in 1Q25.",
    meta: [["Assets","~Rs3.5T"],["Ownership","Government majority"],["PAT CY2024","Rs26.8B (–50%, one-time charge)"],["EPS","Rs12 · Div Rs8 (first since 2016)"],["1Q2025 NII","+139% YoY"]],
    strength: "Government treasury agent functions — pension disbursements, utility bill collections, government salaries — create a captive deposit base and fee stream no private bank can replicate in its coverage regions.",
    weakness: "Legacy credit portfolio with elevated NPLs. Large workforce relative to peer scale creates operational inefficiency. Government ownership constrains commercial discipline.",
    diff: "Role as SBP fiscal agent is unique — deposit flows and fee income tied to state financial operations creates an entirely different business mix from any private bank.",
    risk: "One-time exceptional charges (pension, court verdicts, provisioning reversals) create extreme quarter-level EPS volatility. Normalised earnings are the only analytically meaningful basis.",
    tags: ["State-Owned","SBP Fiscal Agent","NII +139% 1Q25"],
  },
  {
    sym: "ABL", name: "Allied Bank Limited",
    pat: "Rs35B", casa: 72, adr: 42, nim: "4.6%",
    tagline: "Steady mid-tier performer with improving fee income.",
    meta: [["PAT CY2024","~Rs35B"],["CASA","~72%"],["ADR","~42%"]],
    strength: "Consistent mid-tier profitability. Well-diversified loan book with relatively controlled NPLs.",
    weakness: "Lower brand recognition vs big 5 makes CASA accumulation slower. Less international diversification.",
    diff: "Allied Group backing provides corporate banking relationships and cross-group business referrals.",
    risk: "NIM compression in falling rate cycle. ADR tax below 50% threshold.",
    tags: ["Mid-Tier","Stable"],
  },
  {
    sym: "BAFL", name: "Bank Alfalah Limited",
    pat: "Rs30B", casa: 58, adr: 48, nim: "4.4%",
    tagline: "Growing consumer and retail franchise. Abu Dhabi Group backed.",
    meta: [["PAT CY2024","~Rs30B"],["CASA","~58%"],["ADR","~48%"]],
    strength: "Abu Dhabi Group ownership brings international capital and governance standards. Growing consumer banking footprint.",
    weakness: "Lower CASA ratio than peers means higher funding cost. ADR near the 50% threshold.",
    diff: "UAE-linked ownership and consumer focus differentiates from corporate-heavy peers.",
    risk: "CASA franchise less defensive in falling rate environment than MCB or MEBL.",
    tags: ["Abu Dhabi Group","Consumer Focus"],
  },
  {
    sym: "BAHL", name: "Bank AL Habib Limited",
    pat: "Rs28B", casa: 76, adr: 40, nim: "4.7%",
    tagline: "Conservative. Strong CASA. Lower risk appetite.",
    meta: [["PAT CY2024","~Rs28B"],["CASA","~76%"],["ADR","~40%"]],
    strength: "Strong CASA ratio and conservative credit culture have produced stable, low-volatility earnings over multiple cycles.",
    weakness: "Low ADR means large underweight to private lending — missing credit cycle upside as rates fall.",
    diff: "Habib family governance and conservative management creates low credit risk and stable dividend track record.",
    risk: "NIM compression as investment book yields fall. Low loan growth limits upside in credit expansion cycle.",
    tags: ["Conservative","Strong CASA","Family Governed"],
  },
  {
    sym: "BOP", name: "Bank of Punjab",
    pat: "Rs20B", casa: 55, adr: 52, nim: "4.0%",
    tagline: "Provincial government-linked. Higher risk, higher potential volatility.",
    meta: [["PAT CY2024","~Rs20B"],["CASA","~55%"],["ADR","~52%"]],
    strength: "Punjab government backing creates captive government deposits and public sector business. ADR above 50% avoids ADR tax surcharge.",
    weakness: "Lowest CASA ratio of major listed banks — higher funding cost. Higher NPL risk from SME and government-linked lending.",
    diff: "Only major listed bank with provincial government backing — access to Punjab government accounts and PESCO/utility related flows.",
    risk: "Credit quality — higher SME and government-linked exposure creates elevated NPL risk. Lower CASA makes it most sensitive to deposit cost increases.",
    tags: ["Punjab Govt Link","Highest ADR Risk"],
  },
];

const BANK_SYMBOLS = PROFILES.map((p) => p.sym);

// ── Shared UI ──────────────────────────────────────────────────────────────
function SL({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">{children}</p>;
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"bg-surface border border-border-theme rounded-xl p-5 " + className}>{children}</div>;
}
function Badge({ label, level }: { label: string; level: "high" | "medium" | "low" | "ok" | "watch" | "risk" }) {
  const s = {
    high: "text-loss bg-loss/10", medium: "text-yellow-400 bg-yellow-400/10",
    low: "text-tx-secondary bg-surface border border-border-theme",
    ok: "text-gain bg-gain/10", watch: "text-yellow-400 bg-yellow-400/10", risk: "text-loss bg-loss/10",
  }[level];
  return <span className={"text-[10px] font-mono uppercase px-2 py-0.5 rounded-full " + s}>{label}</span>;
}
function Bar({ label, value, highlight }: { label: string; value: number; highlight: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs font-mono text-tx-secondary w-12 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-raised rounded-full h-2">
        <div className={"h-2 rounded-full transition-all " + (highlight ? "bg-gain" : "bg-tx-disabled/40")} style={{ width: value + "%" }} />
      </div>
      <span className="text-xs font-mono font-semibold text-tx-primary w-8 text-right">{value}%</span>
    </div>
  );
}

// ── Overview ───────────────────────────────────────────────────────────────
function OverviewTab({ mode }: { mode: Mode }) {
  const stats = [
    { val: "Rs595B", lbl: "Sector PAT CY2024" },
    { val: "Rs1.84T", lbl: "Net Interest Income" },
    { val: "~53%", lbl: "Effective Tax Rate" },
    { val: "Rs30.8T", lbl: "System Deposits" },
    { val: "2028", lbl: "Islamic Mandate Deadline" },
  ];
  const flow = [
    { label: "Deposits", sub: "CASA + Term", color: "border-blue-500" },
    { label: "Deployment", sub: "Loans + Govt Securities", color: "border-violet-500" },
    { label: "NII", sub: "Yield − Cost", color: "border-green-500" },
    { label: "Non-II", sub: "Fees + FX", color: "border-yellow-500" },
    { label: "Provisions", sub: "Credit losses", color: "border-orange-500" },
    { label: "Tax ~53%", sub: "Income + Super Tax", color: "border-red-500" },
    { label: "PAT", sub: "Net profit", color: "border-gain" },
  ];
  const structure = [
    { type: "Private Banks", count: "20", note: "HBL, UBL, MCB, MEBL, ABL, BAFL, BAHL, BOP + others" },
    { type: "Public Sector", count: "5", note: "NBP, First Women Bank, Zarai Taraqiati, Industrial Dev. Bank, SME Bank" },
    { type: "Foreign Banks", count: "5", note: "Standard Chartered, Citibank, Deutsche, Industrial & Commercial Bank of China, others" },
    { type: "Specialised", count: "4", note: "Development finance institutions — PAIR, ZTBL, IDBP, SME" },
  ];
  const incomeSplit = [
    { label: "Net Interest Income", pct: 72, color: "bg-blue-500" },
    { label: "Fee & Commission", pct: 14, color: "bg-violet-500" },
    { label: "FX Income", pct: 8, color: "bg-yellow-500" },
    { label: "Capital Gains", pct: 6, color: "bg-orange-400" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <SL>What the sector does</SL>
        <p className="text-sm text-tx-secondary leading-relaxed max-w-2xl">
          Banks collect deposits, deploy them into loans and government securities, and earn the spread.
          Pakistan&apos;s listed banks earn ~70% of income from this interest spread (NII) and ~30% from fees, FX, and capital gains.
          The sector is heavily skewed toward government securities over private lending — a structural feature of Pakistan&apos;s high-rate environment that the ADR tax policy has failed to fully reverse.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s) => (
          <Card key={s.lbl} className="text-center">
            <p className="text-xl font-bold text-tx-primary font-mono">{s.val}</p>
            <p className="text-xs text-tx-disabled mt-1 leading-tight">{s.lbl}</p>
          </Card>
        ))}
      </div>

      <div>
        <SL>Earnings chain — how a bank converts deposits into profit</SL>
        <div className="flex flex-wrap items-start gap-1">
          {flow.map((node, i) => (
            <div key={node.label} className="flex items-center gap-1">
              <div className={"bg-surface border-t-2 " + node.color + " rounded-lg px-4 py-3 min-w-24"}>
                <p className="text-xs font-bold text-tx-primary">{node.label}</p>
                <p className="text-[10px] text-tx-disabled mt-0.5 leading-tight">{node.sub}</p>
              </div>
              {i < flow.length - 1 && <span className="text-tx-disabled text-sm">→</span>}
            </div>
          ))}
        </div>
      </div>

      {mode === "research" && (
        <>
          <div>
            <SL>Income composition — sector average</SL>
            <div className="space-y-2 max-w-sm">
              {incomeSplit.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-tx-secondary w-36 flex-shrink-0">{s.label}</span>
                  <div className="flex-1 bg-raised rounded-full h-3">
                    <div className={s.color + " h-3 rounded-full"} style={{ width: s.pct + "%" }} />
                  </div>
                  <span className="text-xs font-mono text-tx-primary w-8">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SL>Industry structure — Pakistan scheduled banks</SL>
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              {structure.map((s) => (
                <Card key={s.type}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold font-mono text-tx-primary">{s.count}</span>
                    <span className="text-sm font-semibold text-tx-primary">{s.type}</span>
                  </div>
                  <p className="text-xs text-tx-secondary">{s.note}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <SL>PAT market share — CY2024 (top 5)</SL>
            <div className="space-y-2 max-w-sm">
              {[["MEBL",17,"Rs102B"],["UBL",13,"Rs76B"],["HBL",12,"Rs74B"],["MCB",10,"Rs58B"],["NBP",5,"Rs27B"],["Others",43,""]].map(([sym,pct,pat]) => (
                <div key={sym} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-tx-secondary w-12">{sym}</span>
                  <div className="flex-1 bg-raised rounded-full h-3">
                    <div className="bg-gain/70 h-3 rounded-full" style={{ width: (Number(pct)) + "%" }} />
                  </div>
                  <span className="text-xs font-mono text-tx-primary w-8">{pct}%</span>
                  {pat && <span className="text-xs text-tx-disabled">{pat}</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Executive Summary ──────────────────────────────────────────────────────
function SummaryTab({ mode }: { mode: Mode }) {
  const insights = [
    { title: "Rates falling — NIM under pressure", body: "SBP cut rates from 22% to 12% in 2024–25. Banks with long-duration PIB books are repricing down. NIM compression of 150–200bps expected over 2025–26. Partially offset by loan growth as private credit becomes affordable." },
    { title: "MEBL dominates — structurally different", body: "Meezan Bank runs on Islamic profit-sharing. Its CASA franchise (80%+) and growing asset base made it the most profitable listed bank in CY2024 at Rs101.5B PAT. The 2028 Islamic mandate accelerates this structural advantage." },
    { title: "Government securities still the core business", body: "Banks deploy 55–65% of deposits into T-bills and PIBs. The ADR tax (surcharge if ADR < 50%) was meant to fix this — but most banks still choose govt securities for risk-free returns. ADR for most large banks is 38–50%." },
    { title: "MCB — highest quality, lowest excitement", body: "MCB's 85% CASA ratio is the best in the sector. Near-zero credit risk, low ADR, conservative management. Returns are stable and predictable but limited upside without credit expansion." },
    { title: "Effective tax rate exceeds 50%", body: "Banks pay 39% income tax + 10% super tax + workers' welfare fund. Each rupee of pre-tax profit results in less than Rs0.50 of PAT. Super tax reduction would be a major positive catalyst." },
  ];
  const watch = [
    { item: "SBP policy rate decisions", detail: "Each 100bps cut compresses NII by ~Rs8–12B per large bank. Track MPC meeting dates and inflation trajectory." },
    { item: "PIB yields vs T-bill yields", detail: "Duration risk in investment books. Banks that locked in high-rate long-duration PIBs benefit until maturity, then face yield cliff." },
    { item: "ADR crossing 50%", detail: "If system ADR crosses 50%, banks get ADR tax relief — a significant earnings tailwind. Currently ~44% system-wide." },
    { item: "2028 Islamic mandate", detail: "Which banks are furthest along in conversion? MEBL is the beneficiary. HBL, MCB furthest from full conversion." },
    { item: "Credit quality in next upcycle", detail: "As loan growth picks up, watch NPL ratios. Historically, rapid ADR expansion has preceded credit quality cycles by 2–3 years." },
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 max-w-3xl">
        {insights.map((ins) => (
          <Card key={ins.title}>
            <p className="text-sm font-semibold text-tx-primary mb-1.5">{ins.title}</p>
            <p className="text-sm text-tx-secondary leading-relaxed">{ins.body}</p>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl">
        <SL>Key things to watch</SL>
        <div className="space-y-3">
          {watch.map((w) => (
            <div key={w.item} className={mode === "research" ? "border-l-2 border-gain/40 pl-4 py-1" : "flex gap-3 items-start"}>
              {mode === "summary" && <span className="text-gain font-bold flex-shrink-0 mt-0.5">·</span>}
              <div>
                <p className="text-sm font-semibold text-tx-primary">{w.item}</p>
                {mode === "research" && <p className="text-xs text-tx-secondary mt-0.5 leading-relaxed">{w.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Economics ──────────────────────────────────────────────────────────────
function EconomicsTab({ mode }: { mode: Mode }) {
  const [sub, setSub] = useState<EcoSub>("metrics");
  const metrics = [
    { name: "NIM", full: "Net Interest Margin", val: "4–6%", def: "NII ÷ Average earning assets. Measures earnings on every rupee deployed.", detail: "Computed as Net Interest Income divided by average interest-earning assets. Pakistani banking NIMs compressed sharply in 2024–25 as SBP began rate cuts. Banks with shorter-duration investment books (mostly T-bills) reprice faster — initially hurting NIM but with less duration risk. Banks with long-duration PIBs locked in at peak rates enjoy temporarily higher NIM until those bonds mature." },
    { name: "CASA%", full: "Current & Savings Account Ratio", val: "55–85%", def: "Low-cost deposits as % of total. Higher = cheaper funding = better NIM protection.", detail: "Current accounts pay zero interest; savings accounts pay SBP-mandated minimum (currently 150bps below policy rate). A bank with 85% CASA like MCB funds itself very cheaply — its cost of funds is structurally 200–300bps below a bank with 55% CASA. In a falling rate environment, CASA-heavy banks see slower NIM compression because their deposit cost doesn't rise — but their asset yields still fall." },
    { name: "ADR", full: "Advance-to-Deposit Ratio", val: "38–60%", def: "Loans ÷ Deposits. Below 50% triggers ADR tax surcharge.", detail: "Most listed banks run ADR of 38–52%. The government imposes a 10bps surcharge on income earned from government securities for each bank with ADR below 50% — a penalty meant to incentivise private sector lending. Most banks calculate it's still more profitable to pay the ADR surcharge and hold govt securities rather than take on credit risk. MEBL is unique at 60% ADR — above the threshold, no surcharge." },
    { name: "IDR", full: "Investment-to-Deposit Ratio", val: "55–70%", def: "Govt securities ÷ Deposits. High IDR = preference for risk-free govt paper.", detail: "System IDR of 55–70% reflects the structural preference for T-bills and PIBs over private loans. This creates interest rate risk — when rates fall, high-IDR banks face yield compression across a large portion of their balance sheet. Banks with shorter-duration T-bill books reprice faster; banks with long-duration PIBs have a temporary advantage but face a larger cliff when bonds mature." },
    { name: "CIR", full: "Cost-to-Income Ratio", val: "48–65%", def: "Operating expenses ÷ Total income. Lower is better.", detail: "MCB runs the sector's most efficient CIR (~48%). NBP runs the least efficient (~65%) due to legacy workforce size. CIR is rising sector-wide as banks invest heavily in technology (digital banking platforms), branch expansion, and staff upgrades. Rising opex is less of a concern when total income is growing, but becomes a drag when NII compresses in a rate-cut cycle." },
    { name: "ROE", full: "Return on Equity", val: "18–22%", def: "PAT ÷ Average equity. Key profitability comparison metric.", detail: "Sector ROE of 18–22% is competitive for an emerging market bank sector, despite the 50%+ tax burden. The high ROE is sustained by high NIMs (vs developed market peers), low credit losses (heavy govt securities bias = no credit risk), and leverage. MEBL and MCB have the highest ROEs; NBP has the lowest." },
    { name: "NPL%", full: "Non-Performing Loans", val: "5–10%", def: "Loans in default as % of total loans. System NPL ~7–8%.", detail: "System NPL ratio of 7–8% is moderate. Banks with low ADR (MCB 38%, HBL 43%) have naturally lower NPL exposure — fewer loans means fewer defaults. NBP has the highest NPL legacy. In the next credit expansion cycle (as rates fall and ADR rises), NPL ratios will be a key metric to watch — particularly for banks growing ADR the fastest." },
    { name: "CET1", full: "Core Equity Tier 1", val: "12–16%", def: "Core capital buffer. SBP minimum 6%. Most banks run 12–16%.", detail: "Pakistan's banks are well-capitalised relative to regulatory minimums. Surplus capital above minimum requirements provides dividend capacity and growth headroom. Banks with large capital buffers (MCB, MEBL) can sustain high dividend payouts while supporting balance sheet growth." },
  ];
  const variables = [
    { name: "SBP Policy Rate", impact: "High" as const, dir: "↓ Falling (22% → 12%)", def: "The single most important variable.", body: "Rates fell from 22% to 12% in 2024–25. As rates fall, earning asset yields compress faster than deposit repricing for banks with large CASA bases (current accounts already at ~0%). A bank with 80% CASA like MCB sees minimal deposit repricing but still faces PIB/T-bill yield compression. Each 100bps rate cut reduces NII by Rs8–12B per large bank." },
    { name: "CASA Franchise", impact: "High" as const, dir: "Stable", def: "Banks with dominant CASA have a structural funding cost advantage.", body: "CASA deposits don't reprice up when rates rise — creating NIM expansion in rate hike cycles. In falling rate cycles, CASA-heavy banks also insulate better because deposit costs can't fall much (already near zero). MCB (85% CASA), MEBL (80%), BAHL (76%) have the most resilient funding structures. Building CASA takes decades — it cannot be quickly replicated." },
    { name: "ADR Tax Architecture", impact: "Medium" as const, dir: "Regulatory", def: "Government penalty for low private lending.", body: "Banks with ADR below 50% pay a surcharge on income from govt securities. This creates a perverse incentive: banks calculate it's often still profitable to pay the surcharge than to take on private credit risk. The 50% threshold is a binary trigger — banks approaching it have a strong incentive to either push ADR above it (earnings tailwind) or stay well below (avoid partial compliance risk)." },
    { name: "Private Credit Demand", impact: "Medium" as const, dir: "↑ Rising", def: "As rates fall, private credit becomes more affordable.", body: "With SBP policy rate falling from 22% to 12%, the effective lending rate (policy rate + spread) drops from ~26% to ~16%. At these levels, private sector credit demand begins to recover — particularly for working capital, consumer loans, and SME credit. This will push system ADR higher, which reduces the IDR, changes the income mix, and introduces credit risk into balance sheets that have been largely credit-risk-free." },
    { name: "PIB Duration Risk", impact: "Medium" as const, dir: "Repricing", def: "Banks holding long-duration bonds at high rates face a yield cliff at maturity.", body: "Banks that locked into 5–10 year PIBs at 20–22% yields enjoy above-market returns until maturity. But when those bonds mature and need to be reinvested at current market rates (12–15%), there is a step-change compression in investment book yield. Banks with short-duration T-bill books (3–12M) have already repriced most of their investment books lower — less residual benefit but also less cliff risk." },
    { name: "FX & Remittance Income", impact: "Low-Med" as const, dir: "Volatile", def: "Banks earn on FX conversion, trade finance, and remittances.", body: "HBL (55 international branches), UBL, and MCB benefit most from overseas remittance corridors. Pakistan receives $30B+ annually in remittances — a significant FX income source for banks with overseas operations. PKR movements create both FX translation gains and losses. This income is genuinely non-interest rate driven — providing earnings diversification in a rate-compression environment." },
  ];
  const risks = [
    { name: "NIM Compression", level: "High" as const, body: "As SBP continues rate cuts, NIMs will compress sector-wide. Banks with high CASA insulate better (lower deposit repricing exposure). Banks with short-duration investment books have already repriced lower and face less residual cliff risk. The compression will be most acute in 2025–26 as long-duration PIBs mature and reinvest at lower rates." },
    { name: "Islamic Banking Mandate (2028)", level: "High" as const, body: "SBP has mandated full Islamic banking conversion by 2028. Banks furthest from Islamic operations (HBL, MCB) face the most restructuring risk. This means retraining staff, converting product suites, adjusting profit-sharing pools, and potentially losing rate-sensitive depositors to MEBL during the transition. MEBL is the structural beneficiary." },
    { name: "Credit Quality Cycle", level: "Medium" as const, body: "As loan growth picks up (ADR rising), NPLs historically follow 2–3 years later. Banks that rapidly expand credit in the early part of a rate-cut cycle often face elevated provisioning in the mid-cycle. Watch banks with the fastest ADR growth — they are building the next NPL cycle." },
    { name: "Super Tax Extension/Increase", level: "Medium" as const, body: "The 10% super tax was introduced in 2022 as a temporary measure and has been extended. Each additional year of super tax reduces PAT by ~10% on the banking sector collectively. Any government decision to increase or expand the super tax would be a significant negative catalyst. Conversely, removal or reduction would be a major positive." },
    { name: "Regulatory Capital Requirements", level: "Low" as const, body: "SBP periodically raises minimum capital requirements. Most large banks comfortably exceed minimums, but smaller banks face pressure. MCB and MEBL have the largest surplus capital buffers. Capital adequacy is not a near-term risk for the top 5 listed banks." },
    { name: "PKR Volatility", level: "Low" as const, body: "Rupee depreciation creates translation losses on foreign currency liabilities and affects import-linked credit quality. With reserves stabilising and the IMF programme on track, PKR volatility risk is reduced vs 2022–23 levels but remains a background risk." },
  ];
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border-theme pb-4">
        {(["metrics","variables","risks"] as EcoSub[]).map((s) => (
          <button key={s} onClick={() => setSub(s)}
            className={"px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-lg transition-all " +
              (sub === s ? "bg-tx-primary text-base font-semibold" : "text-tx-secondary hover:text-tx-primary")}>
            {s}
          </button>
        ))}
      </div>

      {sub === "metrics" && (
        <div className="grid gap-3 sm:grid-cols-2 max-w-4xl">
          {metrics.map((m) => (
            <Card key={m.name}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-bold font-mono text-tx-primary">{m.name}</span>
                  <span className="text-xs text-tx-disabled ml-2">{m.full}</span>
                </div>
                <span className="text-xs font-mono text-gain bg-gain/10 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">{m.val}</span>
              </div>
              <p className="text-xs text-tx-secondary leading-relaxed">{mode === "research" ? m.detail : m.def}</p>
            </Card>
          ))}
        </div>
      )}

      {sub === "variables" && (
        <div className="space-y-3 max-w-3xl">
          {variables.map((v) => (
            <Card key={v.name}>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-tx-primary">{v.name}</span>
                    <span className="text-[10px] font-mono text-tx-disabled bg-raised px-2 py-0.5 rounded-full">{v.dir}</span>
                  </div>
                  <p className="text-xs text-tx-secondary leading-relaxed">{mode === "research" ? v.body : v.def}</p>
                </div>
                <Badge label={v.impact} level={v.impact === "High" ? "high" : v.impact === "Medium" ? "medium" : "low"} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {sub === "risks" && (
        <div className="space-y-3 max-w-3xl">
          {risks.map((r) => (
            <Card key={r.name}>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-tx-primary mb-1.5">{r.name}</p>
                  <p className="text-xs text-tx-secondary leading-relaxed">{r.body}</p>
                </div>
                <Badge label={r.level} level={r.level === "High" ? "high" : r.level === "Medium" ? "medium" : "low"} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Companies ──────────────────────────────────────────────────────────────
function CompaniesTab({ mode }: { mode: Mode }) {
  const [live, setLive] = useState<LiveCo[]>([]);
  const [selected, setSelected] = useState<string[]>(["HBL","UBL","MEBL"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompaniesBySymbols(BANK_SYMBOLS)
      .then((data) => { setLive(data as LiveCo[]); setLoading(false); });
  }, []);

  const liveMap: Record<string, LiveCo> = {};
  live.forEach((c) => { liveMap[c.symbol] = c; });
  const compared = selected.map((s) => ({ sym: s, p: PROFILES.find((x) => x.sym === s)!, lc: liveMap[s] })).filter((c) => c.p);

  function toggle(sym: string) {
    setSelected((prev) => prev.includes(sym) ? prev.filter((s) => s !== sym) : prev.length < 3 ? [...prev, sym] : prev);
  }

  return (
    <div className="space-y-8">
      {/* Selector chips */}
      <div>
        <SL>Select up to 3 banks to compare</SL>
        <div className="flex flex-wrap gap-2">
          {PROFILES.map(({ sym }) => {
            const on = selected.includes(sym);
            const lc = liveMap[sym];
            return (
              <button key={sym} onClick={() => toggle(sym)}
                className={"flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all " +
                  (on ? "border-gain bg-gain/10" : "border-border-theme bg-surface hover:border-tx-secondary")}>
                <span className={"text-xs font-bold font-mono " + (on ? "text-gain" : "text-tx-primary")}>{sym}</span>
                {lc?.change_percent != null && (
                  <span className={"text-[10px] font-mono " + (lc.change_percent >= 0 ? "text-gain" : "text-loss")}>
                    {formatPercent(lc.change_percent)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selected.length === 3 && <p className="text-[10px] font-mono text-tx-disabled mt-2">Deselect to swap</p>}
      </div>

      {/* Comparison table */}
      {loading ? <p className="text-xs text-tx-disabled font-mono">Loading live data…</p> : compared.length > 0 && (
        <div>
          <SL>Comparison — live market + CY2024 data</SL>
          <div className="overflow-x-auto">
            <table className="border-collapse w-full">
              <thead>
                <tr className="border-b border-border-theme">
                  <th className="text-left text-xs font-mono text-tx-disabled py-2 pr-8 uppercase tracking-widest">Metric</th>
                  {compared.map(({ sym }) => (
                    <th key={sym} className="text-right text-xs font-mono font-bold text-tx-primary py-2 px-4 uppercase">{sym}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme">
                {[
                  { label: "Price (PKR)",    fn: (c: typeof compared[0]) => formatPrice(c.lc?.current_price ?? null) },
                  { label: "Change %",       fn: (c: typeof compared[0]) => formatPercent(c.lc?.change_percent ?? null) },
                  { label: "Market Cap",     fn: (c: typeof compared[0]) => formatMarketCap(c.lc?.market_cap ?? null) },
                  { label: "P/E Ratio",      fn: (c: typeof compared[0]) => c.lc?.pe_ratio?.toFixed(1) ?? "—" },
                  { label: "Div. Yield",     fn: (c: typeof compared[0]) => c.lc?.dividend_yield ? c.lc.dividend_yield.toFixed(1)+"%" : "—" },
                  { label: "PAT CY2024",     fn: (c: typeof compared[0]) => c.p?.pat ?? "—" },
                  { label: "CASA Ratio",     fn: (c: typeof compared[0]) => c.p ? c.p.casa+"%" : "—" },
                  { label: "ADR",            fn: (c: typeof compared[0]) => c.p ? c.p.adr+"%" : "—" },
                  { label: "Est. NIM",       fn: (c: typeof compared[0]) => c.p?.nim ?? "—" },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-surface transition-colors">
                    <td className="text-xs text-tx-disabled font-mono py-2.5 pr-8">{row.label}</td>
                    {compared.map((c) => (
                      <td key={c.sym} className="text-right text-xs font-mono text-tx-primary py-2.5 px-4 tabular-nums">{row.fn(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CASA bar */}
      <div className="max-w-xs">
        <SL>CASA ratio by bank</SL>
        {PROFILES.map(({ sym, casa }) => <Bar key={sym} label={sym} value={casa} highlight={selected.includes(sym)} />)}
      </div>

      {/* Bank profiles */}
      <div>
        <SL>Bank profiles</SL>
        {mode === "summary" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROFILES.map(({ sym, name, tagline, casa, adr, nim }) => {
              const lc = liveMap[sym];
              return (
                <Link key={sym} href={"/stocks/"+sym}
                  className="block bg-surface border border-border-theme rounded-xl p-4 hover:border-tx-secondary transition-all group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono font-bold text-tx-primary group-hover:text-gain transition-colors">{sym}</span>
                    {lc?.change_percent != null && (
                      <span className={"text-xs font-mono "+(lc.change_percent>=0?"text-gain":"text-loss")}>{formatPercent(lc.change_percent)}</span>
                    )}
                  </div>
                  <p className="text-xs text-tx-secondary mb-3 leading-relaxed">{tagline}</p>
                  <div className="flex gap-3 text-[10px] font-mono text-tx-disabled border-t border-border-theme pt-2">
                    <span>CASA {casa}%</span><span>ADR {adr}%</span><span>NIM {nim}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {PROFILES.map(({ sym, name, tagline, meta, strength, weakness, diff, risk, tags }) => {
              const lc = liveMap[sym];
              return (
                <Card key={sym}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Link href={"/stocks/"+sym} className="font-mono font-bold text-lg text-tx-primary hover:text-gain transition-colors">{sym} ↗</Link>
                        <span className="text-sm text-tx-secondary">{name}</span>
                      </div>
                      <p className="text-xs text-tx-disabled italic">{tagline}</p>
                    </div>
                    {lc?.change_percent != null && (
                      <span className={"text-sm font-mono font-semibold "+(lc.change_percent>=0?"text-gain":"text-loss")}>{formatPercent(lc.change_percent)}</span>
                    )}
                  </div>
                  {/* Meta table */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {meta.map(([k,v]) => (
                      <div key={k} className="bg-base rounded-lg px-3 py-2">
                        <p className="text-[10px] font-mono text-tx-disabled uppercase">{k}</p>
                        <p className="text-xs font-semibold text-tx-primary mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  {/* 4-grid analysis */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    {[["Structural Strength","text-gain border-gain/30",strength],["Structural Weakness","text-loss border-loss/30",weakness],["Key Differentiator","text-blue-400 border-blue-400/30",diff],["Main Risk/Sensitivity","text-yellow-400 border-yellow-400/30",risk]].map(([label,cls,body]) => (
                      <div key={label} className={"border rounded-lg p-3 "+cls.split(" ")[1]}>
                        <p className={"text-[10px] font-mono uppercase font-bold mb-1 "+cls.split(" ")[0]}>{label}</p>
                        <p className="text-xs text-tx-secondary leading-relaxed">{body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => <span key={t} className="text-[10px] font-mono text-tx-disabled bg-raised border border-border-theme px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Interpretations ────────────────────────────────────────────────────────
function InterpretTab({ mode }: { mode: Mode }) {
  const topics = [
    { title: "Reading a bank's quarterly results", short: "Focus on NII growth, CIR, provisioning, and effective tax rate.", long: "Focus on: (1) NII growth vs prior quarter — is the margin expanding or contracting? (2) Non-II — is fee income growing independent of rates? (3) CIR — are costs growing faster than income? (4) Provisioning — any uptick signals credit stress. (5) Effective tax rate — super tax surprises happen at budget time. In Pakistan, pre-tax profit is often the cleaner metric; PAT can be distorted by one-time tax items." },
    { title: "What NIM compression means in practice", short: "Earning asset yields fall faster than deposit costs for CASA-heavy banks.", long: "When SBP cuts rates, earning asset yields fall faster than deposit costs for banks with large CASA bases (current accounts are already at ~0%). A bank with 80% CASA like MCB sees less deposit repricing — but still faces yield compression on its T-bill and PIB book as securities mature and roll at lower rates. Practically: every 100bps rate cut reduces system NII by Rs80–120B (Rs8–12B per large bank)." },
    { title: "How to compare two banks: ROE vs P/B", short: "High-ROE banks deserve higher P/B multiples.", long: "High-ROE banks (MEBL, MCB) deserve higher Price-to-Book multiples because they generate more earnings per unit of equity. A bank trading at 2x P/B with 22% ROE is cheaper than one at 1.5x P/B with 12% ROE. Use: Implied ROE = P/B × Cost of equity as a sanity check. In Pakistan, cost of equity is ~15–18% given country risk premium, so a bank trading at 1.2x P/B with 20% ROE is undervalued on this basis." },
    { title: "What the ADR tax means for positioning", short: "ADR crossing 50% triggers meaningful tax relief — a hidden earnings catalyst.", long: "Banks below 50% ADR pay a surcharge on income from government securities. This is deliberate policy to push banks toward private lending. Banks that increase ADR above 50% get meaningful tax relief — watch ADR trends in quarterly disclosures as a leading indicator of earnings upgrades. A bank moving from 48% to 52% ADR could see a 3–5% PAT uplift purely from the ADR tax removal, independent of any change in loan yield." },
    { title: "CASA franchise as a structural moat", short: "CASA is a multi-decade advantage that cannot be replicated quickly.", long: "A bank that has built a dominant current and savings account base has a funding cost advantage that is very difficult to replicate. MCB and MEBL's CASA franchises took decades to build through: branch network expansion, payroll banking relationships, corporate current accounts, and brand trust. In a falling rate environment, these banks lose NIM slower — in a rising rate environment, they gain NIM faster. This asymmetry compounds across every rate cycle." },
    { title: "The 2028 Islamic mandate — what it means for positioning", short: "MEBL is the clear beneficiary; all other banks face mandatory structural change.", long: "SBP's mandate for complete Islamic banking conversion by 2028 means: (1) All banks must convert to Islamic profit-sharing structures by 2028. (2) MEBL has 22 years of head start — it's the only bank that doesn't need to change anything. (3) Converting banks risk deposit outflows to MEBL during transition as customers seek established Islamic credibility. (4) Staff retraining, product redesign, and Shariah governance boards are expensive one-time costs. Position: long MEBL on mandate tailwind; monitor HBL and MCB conversion progress as a risk factor." },
  ];
  return (
    <div className="space-y-4 max-w-3xl">
      <SL>How to read and interpret banking sector data</SL>
      {topics.map((t) => (
        <Card key={t.title}>
          <p className="text-sm font-semibold text-tx-primary mb-1.5">{t.title}</p>
          <p className="text-sm text-tx-secondary leading-relaxed">{mode === "research" ? t.long : t.short}</p>
        </Card>
      ))}
    </div>
  );
}

// ── Monitor ────────────────────────────────────────────────────────────────
function MonitorTab({ mode }: { mode: Mode }) {
  const inds = [
    { name: "SBP Policy Rate", cur: "12%", trend: "Falling", status: "watch" as const, note: "Each 100bps cut compresses NII by Rs8–12B per large bank.", detail: "Track MPC meeting dates (published by SBP). The rate fell from 22% (peak, June 2023) to 12% (May 2025). Further cuts likely in H2 2025 if inflation remains subdued. Watch: headline CPI, core CPI, and SBP's forward guidance language." },
    { name: "6M T-Bill Yield", cur: "~12–13%", trend: "Falling", status: "watch" as const, note: "Proxy for short-duration investment book yield.", detail: "Leads SBP rate by 4–6 weeks. When 6M T-bill yield falls, banks with large short-duration investment books see immediate NII impact. Banks with long-duration PIBs are insulated temporarily. Check SBP's weekly T-bill auction results." },
    { name: "System CASA Ratio", cur: "~65%", trend: "Stable", status: "ok" as const, note: "Falling system CASA = rising funding costs = negative for NIM.", detail: "Monitor quarterly banking statistics from SBP. A falling CASA ratio means banks are relying more on expensive term deposits — this increases funding costs and compresses NIM. Bank-level CASA disclosures come with each quarterly result." },
    { name: "System ADR", cur: "~44%", trend: "Rising", status: "watch" as const, note: "ADR crossing 50% triggers ADR tax relief — a sector-wide earnings catalyst.", detail: "Quarterly SBP banking statistics. Each listed bank discloses its ADR separately. Watch for banks approaching 50% — they face a binary incentive shift. If the system ADR crosses 50% on aggregate, interpret this as increasing credit risk exposure in the coming cycle." },
    { name: "System NPL Ratio", cur: "~7–8%", trend: "Stable", status: "ok" as const, note: "Watch for uptick as credit expands in rate-cut cycle.", detail: "NPL ratios are a lagging indicator — they rise 2–3 years after rapid ADR expansion. Current system NPL of ~7–8% is manageable. Watch banks growing ADR fastest for early NPL deterioration signals." },
    { name: "Effective Tax Rate", cur: "~52%", trend: "Stable", status: "risk" as const, note: "Super tax + income tax = 50%+ drag. Budget announcements are key risk events.", detail: "Super tax introduced in Finance Act 2022. Has been renewed each year. Budget season (June–July) is the primary risk event. Reduction or removal of super tax would be a +10% PAT catalyst sector-wide. Any increase would be a corresponding negative." },
    { name: "PIB vs T-Bill Spread", cur: "Narrow", trend: "Watching", status: "watch" as const, note: "Banks with long-duration PIBs have a temporary NIM advantage — but face yield cliff at maturity.", detail: "When long-dated PIBs yield significantly more than short T-bills, banks have incentive to lock into duration. Currently, the spread is narrow as the market has priced in rate cuts. PIBs that mature in 2025–27 will reinvest at lower rates — track PIB maturity schedules in bank annual reports." },
    { name: "Islamic Banking Share", cur: "~22% of system", trend: "Rising", status: "ok" as const, note: "2028 mandate approach accelerates Islamic conversion. MEBL is the primary beneficiary.", detail: "SBP publishes Islamic Banking Bulletin quarterly. Track MEBL's market share of Islamic deposits — if it's growing, it confirms the mandate tailwind. Watch conventional banks' Islamic window growth — this is the competitive threat to MEBL." },
  ];
  return (
    <div className="space-y-4 max-w-3xl">
      <SL>Key indicators to monitor — Pakistan banking sector</SL>
      {inds.map((ind) => (
        <Card key={ind.name}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-tx-primary">{ind.name}</p>
                <span className="text-xs font-mono text-tx-disabled">{ind.cur}</span>
                <span className="text-xs text-tx-disabled">{ind.trend}</span>
              </div>
              <p className="text-xs text-tx-secondary leading-relaxed">{mode === "research" ? ind.detail : ind.note}</p>
            </div>
            <Badge label={ind.status} level={ind.status} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── Glossary ───────────────────────────────────────────────────────────────
function GlossaryTab() {
  const [q, setQ] = useState("");
  const terms = [
    { term: "ADR", def: "Advance-to-Deposit Ratio. Loans ÷ Total deposits. Below 50% triggers an ADR tax surcharge. Most large listed banks are at 38–52%." },
    { term: "CASA", def: "Current Account + Savings Account. Low-cost deposits that form the funding base. Higher CASA = cheaper funding = better NIM resilience. MCB 85%, MEBL 80%." },
    { term: "CET1", def: "Common Equity Tier 1. Core capital buffer as % of risk-weighted assets. SBP minimum 6%; most Pakistani banks run 12–16%." },
    { term: "CIR", def: "Cost-to-Income Ratio. Operating expenses ÷ Total income. Lower is better. Range: MCB ~48% (best) to NBP ~65% (least efficient)." },
    { term: "GIS", def: "Government Islamic Securities. Islamic equivalent of PIBs — Sukuk issued by government. MEBL's primary investment instrument (equivalent to T-bills/PIBs for Islamic banks)." },
    { term: "IDR", def: "Investment-to-Deposit Ratio. Government securities ÷ Total deposits. High IDR (55–70%) shows banks prefer risk-free govt paper over private lending." },
    { term: "MPC", def: "Monetary Policy Committee. SBP body that sets the policy rate 6–8 times per year. Each decision is the most important macro event for banking stocks." },
    { term: "MTB", def: "Market Treasury Bill. Short-term Pakistani government security (3M, 6M, 12M). Primary short-duration instrument for bank investment books." },
    { term: "NII", def: "Net Interest Income. Interest earned minus interest paid. The primary revenue line for Pakistani banks (~70% of total income)." },
    { term: "NIM", def: "Net Interest Margin. NII ÷ Average earning assets. Core profitability metric — how much a bank earns on every rupee deployed. Sector range: 4–6%." },
    { term: "NPL", def: "Non-Performing Loan. A loan in default (typically 90+ days overdue). System NPL ratio ~7–8%. Lagging indicator — rises 2–3 years after rapid ADR expansion." },
    { term: "PIB", def: "Pakistan Investment Bond. Long-term government bonds (3, 5, 10, 20yr). Banks holding peak-rate PIBs benefit until maturity, then face yield compression on reinvestment." },
    { term: "ROE", def: "Return on Equity. PAT ÷ Average shareholders' equity. Sector ROE ~18–22% despite high tax burden. MEBL and MCB have the highest sector ROEs." },
    { term: "SBP", def: "State Bank of Pakistan. Central bank and regulator. Sets policy rate, capital requirements, ADR rules, and the 2028 Islamic banking mandate." },
    { term: "Spread", def: "Difference between earning asset yield and funding cost. The fundamental source of banking profit. Compressed by rate cuts; widened by CASA franchise dominance." },
    { term: "Super Tax", def: "10% additional tax on banking profits (Finance Act 2022, renewed annually). Combined with 39% income tax, pushes effective tax rate above 50%." },
    { term: "Sukuk", def: "Islamic bonds — structured to be Shariah-compliant (no interest). The instrument used by Islamic banks and in GIS issuances. MEBL's investment portfolio is entirely in Sukuk and GIS." },
  ];
  const filtered = terms.filter((t) => !q || t.term.toLowerCase().includes(q.toLowerCase()) || t.def.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms…"
          className="w-full sm:w-72 px-4 py-2 text-sm bg-surface border border-border-theme rounded-lg text-tx-primary placeholder:text-tx-disabled focus:outline-none focus:border-tx-secondary font-mono" />
      </div>
      <div className="space-y-0">
        {filtered.map((t) => (
          <div key={t.term} className="flex gap-4 py-3 border-b border-border-theme last:border-0">
            <span className="text-xs font-bold font-mono text-tx-primary w-20 flex-shrink-0 pt-0.5">{t.term}</span>
            <p className="text-xs text-tx-secondary leading-relaxed">{t.def}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-xs text-tx-disabled font-mono py-4">No terms match &ldquo;{q}&rdquo;</p>}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "summary",   label: "Executive Summary" },
  { id: "economics", label: "Economics" },
  { id: "companies", label: "Companies" },
  { id: "interpret", label: "Interpretations" },
  { id: "monitor",   label: "Monitor" },
  { id: "glossary",  label: "Glossary" },
];

export default function BankingModule() {
  const [tab, setTab] = useState("overview");
  const [mode, setMode] = useState<Mode>("summary");

  const renderTab = () => {
    switch (tab) {
      case "overview":  return <OverviewTab mode={mode} />;
      case "summary":   return <SummaryTab mode={mode} />;
      case "economics": return <EconomicsTab mode={mode} />;
      case "companies": return <CompaniesTab mode={mode} />;
      case "interpret": return <InterpretTab mode={mode} />;
      case "monitor":   return <MonitorTab mode={mode} />;
      case "glossary":  return <GlossaryTab />;
      default:          return <OverviewTab mode={mode} />;
    }
  };

  return (
    <div className="min-h-screen bg-base text-tx-primary">
      {/* Hero */}
      <div className="px-8 pt-10 pb-8 border-b border-border-theme">
        <div className="max-w-5xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">Sector Intelligence · Volume III</p>
            <h1 className="text-4xl font-bold text-tx-primary mb-2">Pakistan <span className="text-gain">Banking</span> Sector</h1>
            <p className="text-sm text-tx-secondary max-w-2xl leading-relaxed">
              How listed commercial banks generate earnings, what drives NII and profitability,
              and how HBL, UBL, MEBL, MCB, and NBP differ structurally.
            </p>
            <p className="text-[10px] font-mono text-tx-disabled mt-3">Educational purposes only · No investment advice · No buy/sell/hold recommendations</p>
          </div>
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-surface border border-border-theme rounded-lg p-1 self-start sm:self-auto flex-shrink-0">
            {(["summary","research"] as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={"px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all " +
                  (mode === m ? "bg-tx-primary text-base font-semibold" : "text-tx-secondary hover:text-tx-primary")}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-border-theme bg-base sticky top-0 z-10">
        <div className="px-8 flex overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={"relative px-4 py-3.5 text-xs font-mono uppercase tracking-widest transition-colors flex-shrink-0 " +
                (tab === id ? "text-tx-primary font-semibold" : "text-tx-secondary hover:text-tx-primary")}>
              {label}
              {tab === id && <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-gain rounded-t-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-6xl">
        {renderTab()}
      </div>
    </div>
  );
}
