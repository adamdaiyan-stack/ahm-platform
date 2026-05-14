"use client";
// components/sectors/BankingModule.tsx
// Full banking sector intelligence module — redesigned with site theme tokens.
// 7 tabs: Overview · Executive Summary · Economics · Companies · Interpretations · Monitor · Glossary

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatPrice, formatPercent, formatMarketCap } from "@/lib/formatters";

// ─── Types ────────────────────────────────────────────────────────────────────
type LiveCompany = {
  symbol: string; company_name: string; current_price: number | null;
  change_percent: number | null; market_cap: number | null;
  pe_ratio: number | null; dividend_yield: number | null; eps: number | null;
};

type EcoSection = "metrics" | "variables" | "risks";

// ─── Static company data ──────────────────────────────────────────────────────
const BANK_META: Record<string, { pat: string; casa: number; adr: number; nim: string; note: string }> = {
  HBL:  { pat: "Rs74B",   casa: 73, adr: 43, nim: "4.8%", note: "Largest by assets. Public sector + corporate focus. Lower CASA vs peers." },
  UBL:  { pat: "Rs76B",   casa: 70, adr: 45, nim: "5.1%", note: "Strong UAE remittances franchise. Balanced loan book." },
  MCB:  { pat: "Rs65B",   casa: 85, adr: 38, nim: "5.5%", note: "Best CASA ratio in sector. Lower ADR = more reliance on investment book." },
  MEBL: { pat: "Rs102B",  casa: 80, adr: 60, nim: "5.8%", note: "Meezan Bank — most profitable CY2024. Fastest-growing Islamic franchise." },
  NBP:  { pat: "Rs38B",   casa: 65, adr: 50, nim: "4.2%", note: "State-owned. Pension + government exposure. Lower efficiency." },
  ABL:  { pat: "Rs35B",   casa: 72, adr: 42, nim: "4.6%", note: "Allied Bank. Steady mid-tier performer." },
  BAFL: { pat: "Rs30B",   casa: 58, adr: 48, nim: "4.4%", note: "Bank Alfalah. Growing consumer and retail franchise." },
  BAHL: { pat: "Rs28B",   casa: 76, adr: 40, nim: "4.7%", note: "Bank Al Habib. Conservative, strong CASA, lower risk appetite." },
  BOP:  { pat: "Rs20B",   casa: 55, adr: 52, nim: "4.0%", note: "Bank of Punjab. Provincial government-linked. Higher risk profile." },
};
const BANK_SYMBOLS = Object.keys(BANK_META);

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">{children}</p>;
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"bg-surface border border-border-theme rounded-xl p-5 " + className}>{children}</div>;
}
function StatBar({ label, value, max = 100, color = "bg-gain" }: { label: string; value: number; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs font-mono text-tx-secondary w-12 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-raised rounded-full h-2">
        <div className={color + " h-2 rounded-full transition-all"} style={{ width: (value / max * 100) + "%" }} />
      </div>
      <span className="text-xs font-mono font-semibold text-tx-primary w-8 text-right">{value}%</span>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab() {
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
    { label: "NII", sub: "Yield earned − Cost paid", color: "border-gain" },
    { label: "Non-II", sub: "Fees, FX, gains", color: "border-yellow-500" },
    { label: "Costs", sub: "Staff + Admin + Tech", color: "border-orange-500" },
    { label: "PAT", sub: "After tax ~47%", color: "border-gain" },
  ];
  const share = [
    { sym: "MEBL", pct: 17, pat: "Rs102B" },
    { sym: "UBL",  pct: 13, pat: "Rs76B" },
    { sym: "HBL",  pct: 12, pat: "Rs74B" },
    { sym: "MCB",  pct: 11, pat: "Rs65B" },
    { sym: "NBP",  pct: 6,  pat: "Rs38B" },
    { sym: "Other",pct: 41, pat: "" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>What the sector does</SectionLabel>
        <p className="text-sm text-tx-secondary leading-relaxed max-w-2xl">
          Banks collect deposits, deploy them into loans and government securities, and earn the spread.
          Pakistan&apos;s listed banks earn ~70% of income from this interest spread (NII) and ~30% from fees, FX, and capital gains.
          The sector is heavily skewed toward government securities over private lending — a structural feature of Pakistan&apos;s high-rate environment.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s) => (
          <Card key={s.lbl} className="text-center">
            <p className="text-xl font-bold text-tx-primary font-mono">{s.val}</p>
            <p className="text-xs text-tx-disabled mt-1 leading-tight">{s.lbl}</p>
          </Card>
        ))}
      </div>

      {/* Earnings flow */}
      <div>
        <SectionLabel>How a bank makes money — earnings chain</SectionLabel>
        <div className="flex flex-wrap items-center gap-1">
          {flow.map((node, i) => (
            <div key={node.label} className="flex items-center gap-1">
              <div className={"bg-surface border-t-2 " + node.color + " rounded-lg px-4 py-3 min-w-28"}>
                <p className="text-xs font-bold text-tx-primary">{node.label}</p>
                <p className="text-[10px] text-tx-disabled mt-0.5 leading-tight">{node.sub}</p>
              </div>
              {i < flow.length - 1 && <span className="text-tx-disabled text-sm">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Sector profit share */}
      <div>
        <SectionLabel>Profit share — CY2024</SectionLabel>
        <div className="max-w-sm space-y-2">
          {share.map((b) => (
            <div key={b.sym} className="flex items-center gap-3">
              <span className="text-xs font-mono text-tx-secondary w-10">{b.sym}</span>
              <div className="flex-1 bg-raised rounded-full h-3">
                <div className="bg-gain/70 h-3 rounded-full" style={{ width: b.pct + "%" }} />
              </div>
              <span className="text-xs font-mono text-tx-primary w-8">{b.pct}%</span>
              {b.pat && <span className="text-xs text-tx-disabled">{b.pat}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Executive Summary ───────────────────────────────────────────────────
function SummaryTab() {
  const insights = [
    { title: "Rates falling — NII under pressure", body: "SBP cut rates from 22% to 12% in 2024–25. Banks with long-duration PIB books are repricing down. NIM compression of 150–200bps expected over 2025–26. Offset partially by higher loan growth as credit becomes affordable." },
    { title: "MEBL dominates — and is structurally different", body: "Meezan Bank runs on Islamic profit-sharing, avoiding interest. Its CASA franchise (80%+) and growing asset base made it the most profitable listed bank in CY2024. The 2028 Islamic mandate accelerates this structural advantage." },
    { title: "Government securities still the core business", body: "Banks deploy 55–65% of deposits into T-bills and PIBs rather than private loans. The ADR tax (surcharge if ADR < 50%) was meant to fix this — but most banks still choose govt securities for the risk-free returns." },
    { title: "MCB — highest quality, lowest excitement", body: "MCB's 85% CASA ratio is the best in the sector. Near-zero credit risk, low ADR, conservative management. Returns are stable but limited upside without credit expansion." },
    { title: "Effective tax rate is 50%+", body: "Banks pay 39% income tax + 10% super tax + workers' fund. This creates a structural drag on ROE versus banks in peer markets. Watch for any super tax reduction in the budget." },
  ];
  const watch = [
    "SBP policy rate decisions — each 100bps cut compresses NII by ~Rs8–12B per large bank",
    "PIB yields vs T-bill yields — duration risk in investment books",
    "ADR levels crossing 50% threshold — triggers removal of ADR tax surcharge",
    "2028 Islamic mandate — which banks are furthest along in conversion",
    "Credit quality as loan growth picks up — watch NPL ratios",
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-1 max-w-3xl">
        {insights.map((ins) => (
          <Card key={ins.title}>
            <p className="text-sm font-semibold text-tx-primary mb-1">{ins.title}</p>
            <p className="text-sm text-tx-secondary leading-relaxed">{ins.body}</p>
          </Card>
        ))}
      </div>
      <div>
        <SectionLabel>Key things to watch</SectionLabel>
        <ul className="space-y-2 max-w-2xl">
          {watch.map((w, i) => (
            <li key={i} className="flex gap-3 text-sm text-tx-secondary">
              <span className="text-gain font-bold flex-shrink-0">·</span>
              {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Tab: Economics ───────────────────────────────────────────────────────────
function EconomicsTab() {
  const [sub, setSub] = useState<EcoSection>("metrics");
  const metrics = [
    { name: "NIM", full: "Net Interest Margin", def: "NII ÷ Average earning assets. Measures how much the bank earns on every rupee deployed. Typical range: 4–6% for Pakistani banks.", val: "4–6%" },
    { name: "CASA %", full: "Current & Savings Account Ratio", def: "Low-cost deposits as % of total deposits. Higher = cheaper funding = better NIM protection when rates fall.", val: "55–85%" },
    { name: "ADR", full: "Advance-to-Deposit Ratio", def: "Loans ÷ Deposits. Under 50% triggers the ADR tax surcharge. Most banks are below this threshold.", val: "38–60%" },
    { name: "IDR", full: "Investment-to-Deposit Ratio", def: "Govts securities ÷ Deposits. High IDR (60–70%) shows banks prefer risk-free govt paper over private lending.", val: "55–70%" },
    { name: "CIR", full: "Cost-to-Income Ratio", def: "Operating expenses ÷ Total income. Lower is better. Rising as banks invest in technology and branches.", val: "50–58%" },
    { name: "ROE", full: "Return on Equity", def: "PAT ÷ Average equity. Sector ROE ~18–22% despite high tax burden. Driven by high NIM and low credit losses.", val: "18–22%" },
    { name: "NPL %", full: "Non-Performing Loans", def: "Loans in default as % of total loans. System NPL ~7–8%. Banks with low ADR have naturally low NPL.", val: "5–10%" },
    { name: "CET1", full: "Core Equity Tier 1", def: "Core capital buffer. SBP minimum is 6%. Most banks well above at 12–16%.", val: "12–16%" },
  ];
  const variables = [
    { name: "SBP Policy Rate", impact: "High", dir: "↓ falling", body: "The single most important variable. Rates fell from 22% → 12% in 2024–25. As rates fall, earning asset yields compress faster than deposit repricing for banks with a large CASA base. Short-duration books reprice in 3–6 months." },
    { name: "CASA Franchise", impact: "High", dir: "stable", body: "Banks with dominant CASA (MCB 85%, MEBL 80%) have structural funding cost advantages. CASA deposits don't reprice up when rates rise — creating NIM expansion in rate hike cycles." },
    { name: "ADR Tax Threshold", impact: "Medium", dir: "regulatory", body: "Government imposes a surcharge if ADR < 50%. Banks must weigh higher credit risk (loans) vs ADR tax cost. Most banks pay the surcharge and stay invested in govts." },
    { name: "Credit Demand", impact: "Medium", dir: "↑ rising", body: "Private sector credit growth follows economic activity and real interest rates. With rates falling, credit demand should recover in 2025–26. This will shift ADR up and reduce IDR." },
    { name: "PIB Duration", impact: "Medium", dir: "repricing", body: "Banks holding long-duration PIBs (5–10yr) at high rates will see yield compression as bonds mature. Banks that locked in high rates for longer have a temporary advantage." },
    { name: "FX Income", impact: "Low–Medium", dir: "volatile", body: "Banks earn on FX conversion, trade finance, and remittance flows. HBL and UBL benefit most from overseas remittance corridors. Volatile with PKR movements." },
  ];
  const risks = [
    { name: "NIM Compression", level: "High", body: "As SBP cuts rates, NIMs will compress. Banks with high CASA insulate better. Banks with short-duration investment books will reprice faster." },
    { name: "Islamic Mandate (2028)", level: "High", body: "SBP has mandated full Islamic banking conversion by 2028. Banks furthest from Islamic operations face restructuring risk. MEBL is the primary beneficiary." },
    { name: "Credit Quality Deterioration", level: "Medium", body: "As loan growth picks up, NPLs could rise. Historically, rapid ADR expansion has preceded credit quality cycles in Pakistan." },
    { name: "Super Tax", level: "Medium", body: "The 10% super tax was introduced in 2022 and has been maintained. Any extension or increase further depresses ROE. Removal would be a significant positive catalyst." },
    { name: "Regulatory Capital", level: "Low", body: "SBP regularly raises minimum capital requirements. Banks generally have comfortable buffers, but smaller banks face pressure." },
    { name: "PKR Volatility", level: "Low", body: "Rupee depreciation creates translation losses on foreign currency liabilities and impacts import-linked credit quality." },
  ];
  const levelColor = (l: string) => l === "High" ? "text-loss bg-loss/10" : l === "Medium" ? "text-yellow-400 bg-yellow-400/10" : "text-tx-secondary bg-surface";

  return (
    <div className="space-y-6">
      {/* Sub-tab nav */}
      <div className="flex gap-2 border-b border-border-theme pb-4">
        {(["metrics", "variables", "risks"] as EcoSection[]).map((s) => (
          <button key={s} onClick={() => setSub(s)}
            className={"px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-lg transition-all " +
              (sub === s ? "bg-tx-primary text-base font-semibold" : "text-tx-secondary hover:text-tx-primary")}>
            {s}
          </button>
        ))}
      </div>

      {sub === "metrics" && (
        <div className="grid gap-3 sm:grid-cols-2 max-w-3xl">
          {metrics.map((m) => (
            <Card key={m.name}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-bold font-mono text-tx-primary">{m.name}</span>
                  <span className="text-xs text-tx-disabled ml-2">{m.full}</span>
                </div>
                <span className="text-xs font-mono text-gain bg-gain/10 px-2 py-0.5 rounded-full">{m.val}</span>
              </div>
              <p className="text-xs text-tx-secondary leading-relaxed">{m.def}</p>
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-tx-primary">{v.name}</span>
                    <span className="text-[10px] font-mono text-tx-disabled bg-raised px-2 py-0.5 rounded-full">{v.dir}</span>
                  </div>
                  <p className="text-xs text-tx-secondary leading-relaxed">{v.body}</p>
                </div>
                <span className={"text-[10px] font-mono px-2 py-1 rounded-full flex-shrink-0 " + levelColor(v.impact)}>{v.impact}</span>
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
                  <p className="text-sm font-semibold text-tx-primary mb-1">{r.name}</p>
                  <p className="text-xs text-tx-secondary leading-relaxed">{r.body}</p>
                </div>
                <span className={"text-[10px] font-mono px-2 py-1 rounded-full flex-shrink-0 " + levelColor(r.level)}>{r.level}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Companies ───────────────────────────────────────────────────────────
function CompaniesTab() {
  const [live, setLive] = useState<LiveCompany[]>([]);
  const [selected, setSelected] = useState<string[]>(["HBL", "UBL", "MEBL"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("companies").select("symbol,company_name,current_price,change_percent,market_cap,pe_ratio,dividend_yield,eps")
      .in("symbol", BANK_SYMBOLS)
      .then(({ data }) => { if (data) setLive(data as LiveCompany[]); setLoading(false); });
  }, []);

  function toggleSelect(sym: string) {
    setSelected((prev) => prev.includes(sym) ? prev.filter((s) => s !== sym) : prev.length < 3 ? [...prev, sym] : prev);
  }

  const liveMap: Record<string, LiveCompany> = {};
  live.forEach((c) => { liveMap[c.symbol] = c; });
  const compared = selected.map((s) => ({ sym: s, meta: BANK_META[s], live: liveMap[s] })).filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Selector */}
      <div>
        <SectionLabel>Select up to 3 banks to compare</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {BANK_SYMBOLS.map((sym) => {
            const isOn = selected.includes(sym);
            const lc = liveMap[sym];
            const chg = lc?.change_percent;
            const chgColor = chg == null ? "" : chg >= 0 ? "text-gain" : "text-loss";
            return (
              <button key={sym} onClick={() => toggleSelect(sym)}
                className={"flex flex-col items-center px-4 py-3 rounded-xl border text-left transition-all min-w-20 " +
                  (isOn ? "border-gain bg-gain/10" : "border-border-theme bg-surface hover:border-tx-secondary")}>
                <span className={"text-xs font-bold font-mono " + (isOn ? "text-gain" : "text-tx-primary")}>{sym}</span>
                {lc && <span className={"text-[10px] font-mono " + chgColor}>{formatPercent(lc.change_percent)}</span>}
              </button>
            );
          })}
        </div>
        {selected.length === 3 && <p className="text-xs text-tx-disabled mt-2 font-mono">Deselect a bank to swap it</p>}
      </div>

      {/* Comparison grid */}
      {loading ? (
        <p className="text-xs text-tx-disabled font-mono">Loading live data…</p>
      ) : (
        <div>
          <SectionLabel>Comparison — live + CY2024 data</SectionLabel>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border-theme">
                  <th className="text-left text-xs font-mono text-tx-disabled py-2 pr-6 uppercase tracking-widest">Metric</th>
                  {compared.map(({ sym }) => (
                    <th key={sym} className="text-right text-xs font-mono font-bold text-tx-primary py-2 px-4 uppercase">{sym}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme">
                {[
                  { label: "Price (PKR)",    fn: (c: typeof compared[0]) => formatPrice(c.live?.current_price ?? null) },
                  { label: "Change %",       fn: (c: typeof compared[0]) => formatPercent(c.live?.change_percent ?? null) },
                  { label: "Market Cap",     fn: (c: typeof compared[0]) => formatMarketCap(c.live?.market_cap ?? null) },
                  { label: "P/E Ratio",      fn: (c: typeof compared[0]) => c.live?.pe_ratio?.toFixed(1) ?? "—" },
                  { label: "Dividend Yield", fn: (c: typeof compared[0]) => c.live?.dividend_yield ? c.live.dividend_yield.toFixed(1) + "%" : "—" },
                  { label: "PAT CY2024",     fn: (c: typeof compared[0]) => c.meta?.pat ?? "—" },
                  { label: "CASA Ratio",     fn: (c: typeof compared[0]) => c.meta ? c.meta.casa + "%" : "—" },
                  { label: "ADR",            fn: (c: typeof compared[0]) => c.meta ? c.meta.adr + "%" : "—" },
                  { label: "Est. NIM",       fn: (c: typeof compared[0]) => c.meta?.nim ?? "—" },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-surface transition-colors">
                    <td className="text-xs text-tx-disabled font-mono py-2.5 pr-6">{row.label}</td>
                    {compared.map((c) => (
                      <td key={c.sym} className="text-right text-xs font-mono text-tx-primary py-2.5 px-4 tabular-nums">
                        {row.fn(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CASA bar chart */}
      <div className="max-w-sm">
        <SectionLabel>CASA ratio by bank</SectionLabel>
        {BANK_SYMBOLS.map((sym) => (
          <StatBar key={sym} label={sym} value={BANK_META[sym].casa} color={selected.includes(sym) ? "bg-gain" : "bg-tx-disabled/40"} />
        ))}
      </div>

      {/* Bank notes */}
      <div>
        <SectionLabel>Bank profiles</SectionLabel>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BANK_SYMBOLS.map((sym) => {
            const lc = liveMap[sym];
            const meta = BANK_META[sym];
            return (
              <Link key={sym} href={"/stocks/" + sym}
                className="block bg-surface border border-border-theme rounded-xl p-4 hover:border-tx-secondary transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-tx-primary group-hover:text-gain transition-colors">{sym}</span>
                  {lc?.change_percent != null && (
                    <span className={"text-xs font-mono " + (lc.change_percent >= 0 ? "text-gain" : "text-loss")}>
                      {formatPercent(lc.change_percent)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-tx-disabled mb-2 leading-relaxed">{meta.note}</p>
                <div className="flex gap-3 text-[10px] font-mono text-tx-disabled border-t border-border-theme pt-2 mt-2">
                  <span>CASA {meta.casa}%</span>
                  <span>ADR {meta.adr}%</span>
                  <span>NIM {meta.nim}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Interpretations ─────────────────────────────────────────────────────
function InterpretTab() {
  const topics = [
    { title: "Reading a bank's quarterly results", body: "Focus on: (1) NII growth vs prior quarter — is the margin expanding or contracting? (2) Non-II — is fee income growing independent of rates? (3) CIR — are costs growing faster than income? (4) Provisioning — any uptick signals credit stress. (5) Effective tax rate — super tax surprises happen at budget time." },
    { title: "What NIM compression means", body: "When SBP cuts rates, earning asset yields fall faster than deposit costs for banks with a large CASA base (current accounts are already at ~0%). A bank with 80% CASA like MCB sees less deposit repricing — but still faces yield compression on its T-bill and PIB book as securities mature and roll at lower rates." },
    { title: "How to compare two banks: ROE vs P/B", body: "High-ROE banks (MEBL, MCB) deserve higher Price-to-Book multiples because they generate more earnings per unit of equity. A bank trading at 2x P/B with 22% ROE is cheaper than one at 1.5x P/B with 12% ROE. Use: Implied ROE = P/B × Cost of equity as a sanity check." },
    { title: "What the ADR tax means for positioning", body: "Banks below 50% ADR pay a surcharge on income from government securities. This is a deliberate policy to push banks toward private lending. Banks that increase ADR above 50% get a meaningful tax relief — watch ADR trends in quarterly disclosures as a leading indicator of earnings upgrades." },
    { title: "CASA franchise as a moat", body: "A bank that has built a dominant current and savings account base has a funding cost advantage that is very difficult to replicate. MCB and MEBL's CASA franchises took decades to build. In a falling rate environment, these banks lose NIM slower — in a rising rate environment, they gain NIM faster." },
  ];
  return (
    <div className="space-y-4 max-w-3xl">
      <SectionLabel>How to read and interpret banking sector data</SectionLabel>
      {topics.map((t) => (
        <Card key={t.title}>
          <p className="text-sm font-semibold text-tx-primary mb-2">{t.title}</p>
          <p className="text-sm text-tx-secondary leading-relaxed">{t.body}</p>
        </Card>
      ))}
    </div>
  );
}

// ─── Tab: Monitor ─────────────────────────────────────────────────────────────
function MonitorTab() {
  const indicators = [
    { name: "SBP Policy Rate", current: "12%", trend: "Falling", status: "watch", note: "Each 100bps cut compresses NII by Rs8–12B per large bank. Track MPC meeting dates." },
    { name: "6M T-Bill Yield", current: "~12–13%", trend: "Falling", status: "watch", note: "Proxy for short-duration investment book yield. Falls 4–6 weeks after SBP rate cuts." },
    { name: "System CASA Ratio", current: "~65%", trend: "Stable", status: "ok", note: "A falling system CASA ratio means funding costs are rising — negative for NIM." },
    { name: "System ADR", current: "~44%", trend: "Rising", status: "watch", note: "If system ADR crosses 50%, banks get ADR tax relief — a significant earnings tailwind." },
    { name: "System NPL Ratio", current: "~7–8%", trend: "Stable", status: "ok", note: "Watch for uptick as credit expands. Rising NPL cycle typically follows ADR expansion by 2–3 years." },
    { name: "Effective Tax Rate", current: "~52%", trend: "Stable", status: "risk", note: "Super tax and income tax combine for ~52% effective rate. Budget announcements are key risk events." },
    { name: "PIB vs T-bill Spread", current: "Narrow", trend: "Watching", status: "watch", note: "Banks locking into long PIBs at current rates benefit if rates fall further — but take duration risk." },
    { name: "Islamic Banking Share", current: "~22% of system", trend: "Rising", status: "ok", note: "Approaching 2028 mandate. Banks lagging in Islamic conversion face franchise risk." },
  ];
  const statusStyle = (s: string) => s === "ok" ? "text-gain bg-gain/10" : s === "watch" ? "text-yellow-400 bg-yellow-400/10" : "text-loss bg-loss/10";
  return (
    <div className="space-y-4 max-w-3xl">
      <SectionLabel>Key indicators to track — Pakistan banking sector</SectionLabel>
      {indicators.map((ind) => (
        <Card key={ind.name}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm font-semibold text-tx-primary">{ind.name}</p>
                <span className="text-xs font-mono text-tx-disabled">{ind.current}</span>
                <span className="text-xs text-tx-disabled">{ind.trend}</span>
              </div>
              <p className="text-xs text-tx-secondary leading-relaxed">{ind.note}</p>
            </div>
            <span className={"text-[10px] font-mono uppercase px-2 py-1 rounded-full flex-shrink-0 " + statusStyle(ind.status)}>
              {ind.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Tab: Glossary ────────────────────────────────────────────────────────────
function GlossaryTab() {
  const terms = [
    { term: "ADR", def: "Advance-to-Deposit Ratio. Loans ÷ Total deposits. Measures how much of a bank's deposits are deployed as loans. Below 50% triggers an ADR tax surcharge under current SBP policy." },
    { term: "CASA", def: "Current Account + Savings Account. Low-cost deposits that form the funding base. A higher CASA ratio means cheaper funding and better NIM resilience." },
    { term: "CET1", def: "Common Equity Tier 1. Core capital buffer measured as a % of risk-weighted assets. SBP minimum is 6%; most Pakistani banks run at 12–16%." },
    { term: "CIR", def: "Cost-to-Income Ratio. Operating expenses ÷ Total income. Lower is better. Rising in Pakistan as banks invest in technology, branches, and staff." },
    { term: "IDR", def: "Investment-to-Deposit Ratio. Government securities ÷ Total deposits. High IDR shows a bank is deploying more funds into T-bills/PIBs than loans." },
    { term: "MPC", def: "Monetary Policy Committee. SBP body that sets the policy rate 6–8 times per year. MPC announcements are the most important macro event for banking stocks." },
    { term: "MTB", def: "Market Treasury Bills. Short-term Pakistani government securities (3M, 6M, 12M). The primary short-duration instrument for bank investment books." },
    { term: "NII", def: "Net Interest Income. Interest earned on loans and investments minus interest paid on deposits. The primary revenue line for Pakistani banks (~70% of total income)." },
    { term: "NIM", def: "Net Interest Margin. NII ÷ Average earning assets. The core profitability metric — how much a bank earns on every rupee deployed." },
    { term: "NPL", def: "Non-Performing Loan. A loan in default (typically 90+ days overdue). NPL ratio = NPLs ÷ Total loans. System NPL is ~7–8%." },
    { term: "PIB", def: "Pakistan Investment Bond. Long-term government bonds (3, 5, 10, 20yr). Banks holding PIBs at peak rates benefit as rates fall — until bonds mature and roll at lower yields." },
    { term: "ROE", def: "Return on Equity. PAT ÷ Average shareholders' equity. The key profitability metric for comparing banks. Pakistani banking sector ROE: ~18–22%." },
    { term: "SBP", def: "State Bank of Pakistan. Central bank and regulator. Sets the policy rate, capital requirements, ADR rules, and the 2028 Islamic banking mandate." },
    { term: "Super Tax", def: "A 10% additional tax on banking profits introduced in 2022. Combined with 39% income tax, it pushes effective tax rates above 50% for banks." },
    { term: "Spread", def: "The difference between what a bank earns on its assets (lending rate / PIB yield) and what it pays on its liabilities (deposit rate). The fundamental source of banking profit." },
  ];
  return (
    <div className="max-w-3xl">
      <SectionLabel>Banking terminology — plain English</SectionLabel>
      <div className="space-y-1">
        {terms.map((t) => (
          <div key={t.term} className="flex gap-4 py-3 border-b border-border-theme last:border-0">
            <span className="text-xs font-bold font-mono text-tx-primary w-20 flex-shrink-0 pt-0.5">{t.term}</span>
            <p className="text-xs text-tx-secondary leading-relaxed">{t.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
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
  const [activeTab, setActiveTab] = useState("overview");
  const renderTab = () => {
    switch (activeTab) {
      case "overview":  return <OverviewTab />;
      case "summary":   return <SummaryTab />;
      case "economics": return <EconomicsTab />;
      case "companies": return <CompaniesTab />;
      case "interpret": return <InterpretTab />;
      case "monitor":   return <MonitorTab />;
      case "glossary":  return <GlossaryTab />;
      default:          return <OverviewTab />;
    }
  };
  return (
    <div className="min-h-screen bg-base text-tx-primary">
      {/* ── Hero ── */}
      <div className="px-8 pt-10 pb-8 border-b border-border-theme">
        <div className="max-w-5xl">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">
            Sector Intelligence Module · Volume III
          </p>
          <h1 className="text-4xl font-bold text-tx-primary mb-3">
            Pakistan <span className="text-gain">Banking</span> Sector
          </h1>
          <p className="text-sm text-tx-secondary max-w-2xl leading-relaxed">
            How listed commercial banks generate earnings, what drives NII and profitability,
            and how HBL, UBL, MEBL, MCB, and NBP differ structurally.
          </p>
          <p className="text-[10px] font-mono text-tx-disabled mt-4 border-t border-border-theme pt-4">
            Educational purposes only · No investment advice · No buy/sell/hold recommendations
          </p>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="border-b border-border-theme bg-base sticky top-0 z-10">
        <div className="px-8 flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={"relative px-4 py-3.5 text-xs font-mono uppercase tracking-widest transition-colors flex-shrink-0 " +
                  (isActive ? "text-tx-primary font-semibold" : "text-tx-secondary hover:text-tx-primary")}>
                {tab.label}
                {isActive && <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-gain rounded-t-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-8 py-8 max-w-6xl">
        {renderTab()}
      </div>
    </div>
  );
}
