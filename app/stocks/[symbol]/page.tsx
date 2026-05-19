import Link from "next/link";
import { getCompanyBySymbol, getCompanyPeers } from "@/services/api/companies";
import { getStockCorporateData }               from "@/services/api/research";
import { getFinancialHistory }                 from "@/services/api/fundamentals";
import { getReportsByTicker }                  from "@/services/api/research";
import { formatPrice, formatChange, formatPercent, formatVolume, formatMarketCap } from "@/lib/formatters";
import { Company, Dividend }                   from "@/types";
import { SECTOR_SLUG }                         from "@/constants";
import StatCard                                from "@/components/ui/StatCard";

// ── Company intelligence pages ────────────────────────────────────────────────
// Architecture: each symbol routes to a thin wrapper that builds a
// CompanyIntelligenceConfig and delegates to CompanyIntelligencePage.
// Adding a new company = create intelligence.ts + add routing branch below.
// No component rewrites. No layout changes. Framework is fully reusable.
import CompanyIntelligencePage, { type CompanyIntelligenceConfig } from "@/components/company/CompanyIntelligencePage";
import { getCompanyIntelligence } from "@/services/api/company-intelligence";

// Intelligence configs
import {
  UBL_THESIS_SUMMARY, UBL_THESIS_THEMES, UBL_DRIVERS, UBL_RISKS, UBL_CATALYSTS,
  UBL_VALUATION_POINTS, UBL_VALUATION_SUMMARY, UBL_VALUATION_HISTORICAL_RANGE, UBL_VALUATION_PEER_CONTEXT,
  UBL_DIVIDEND_COMMENTARY, UBL_DIVIDEND_YIELD_POSITIONING, UBL_DIVIDEND_CONSISTENCY_NOTE,
} from "@/components/company/ubl/ubl-intelligence";

import {
  HBL_THESIS_SUMMARY, HBL_THESIS_THEMES, HBL_DRIVERS, HBL_RISKS, HBL_CATALYSTS,
  HBL_VALUATION_POINTS, HBL_VALUATION_SUMMARY, HBL_VALUATION_HISTORICAL_RANGE, HBL_VALUATION_PEER_CONTEXT,
  HBL_DIVIDEND_COMMENTARY, HBL_DIVIDEND_YIELD_POSITIONING, HBL_DIVIDEND_CONSISTENCY_NOTE,
} from "@/components/company/hbl/hbl-intelligence";

import {
  MCB_THESIS_SUMMARY, MCB_THESIS_THEMES, MCB_DRIVERS, MCB_RISKS, MCB_CATALYSTS,
  MCB_VALUATION_POINTS, MCB_VALUATION_SUMMARY, MCB_VALUATION_HISTORICAL_RANGE, MCB_VALUATION_PEER_CONTEXT,
  MCB_DIVIDEND_COMMENTARY, MCB_DIVIDEND_YIELD_POSITIONING, MCB_DIVIDEND_CONSISTENCY_NOTE,
} from "@/components/company/mcb/mcb-intelligence";

import {
  OGDC_THESIS_SUMMARY, OGDC_THESIS_THEMES, OGDC_DRIVERS, OGDC_RISKS, OGDC_CATALYSTS,
  OGDC_VALUATION_POINTS, OGDC_VALUATION_SUMMARY, OGDC_VALUATION_HISTORICAL_RANGE, OGDC_VALUATION_PEER_CONTEXT,
  OGDC_DIVIDEND_COMMENTARY, OGDC_DIVIDEND_YIELD_POSITIONING, OGDC_DIVIDEND_CONSISTENCY_NOTE,
} from "@/components/company/ogdc/ogdc-intelligence";

// ── Company intelligence config registry ─────────────────────────────────────
// Adding a new company: create intelligence.ts, import above, add entry here.
// Everything else is automatic.

const COMPANY_CONFIGS: Record<string, CompanyIntelligenceConfig> = {
  UBL: {
    accentColor:              "#3b82f6",
    exchangeLabel:            "Commercial Bank",
    peersLabel:               "Banking Peers",
    thesisSummary:            UBL_THESIS_SUMMARY,
    thesisThemes:             UBL_THESIS_THEMES,
    drivers:                  UBL_DRIVERS,
    risks:                    UBL_RISKS,
    catalysts:                UBL_CATALYSTS,
    valuationPoints:          UBL_VALUATION_POINTS,
    valuationSummary:         UBL_VALUATION_SUMMARY,
    valuationHistoricalRange: UBL_VALUATION_HISTORICAL_RANGE,
    valuationPeerContext:     UBL_VALUATION_PEER_CONTEXT,
    dividendCommentary:       UBL_DIVIDEND_COMMENTARY,
    dividendYieldPositioning: UBL_DIVIDEND_YIELD_POSITIONING,
    dividendConsistencyNote:  UBL_DIVIDEND_CONSISTENCY_NOTE,
  },
  HBL: {
    accentColor:              "#16a34a",
    exchangeLabel:            "Commercial Bank",
    peersLabel:               "Banking Peers",
    thesisSummary:            HBL_THESIS_SUMMARY,
    thesisThemes:             HBL_THESIS_THEMES,
    drivers:                  HBL_DRIVERS,
    risks:                    HBL_RISKS,
    catalysts:                HBL_CATALYSTS,
    valuationPoints:          HBL_VALUATION_POINTS,
    valuationSummary:         HBL_VALUATION_SUMMARY,
    valuationHistoricalRange: HBL_VALUATION_HISTORICAL_RANGE,
    valuationPeerContext:     HBL_VALUATION_PEER_CONTEXT,
    dividendCommentary:       HBL_DIVIDEND_COMMENTARY,
    dividendYieldPositioning: HBL_DIVIDEND_YIELD_POSITIONING,
    dividendConsistencyNote:  HBL_DIVIDEND_CONSISTENCY_NOTE,
  },
  MCB: {
    accentColor:              "#be123c",
    exchangeLabel:            "Commercial Bank",
    peersLabel:               "Banking Peers",
    thesisSummary:            MCB_THESIS_SUMMARY,
    thesisThemes:             MCB_THESIS_THEMES,
    drivers:                  MCB_DRIVERS,
    risks:                    MCB_RISKS,
    catalysts:                MCB_CATALYSTS,
    valuationPoints:          MCB_VALUATION_POINTS,
    valuationSummary:         MCB_VALUATION_SUMMARY,
    valuationHistoricalRange: MCB_VALUATION_HISTORICAL_RANGE,
    valuationPeerContext:     MCB_VALUATION_PEER_CONTEXT,
    dividendCommentary:       MCB_DIVIDEND_COMMENTARY,
    dividendYieldPositioning: MCB_DIVIDEND_YIELD_POSITIONING,
    dividendConsistencyNote:  MCB_DIVIDEND_CONSISTENCY_NOTE,
  },
  OGDC: {
    accentColor:              "#d97706",
    exchangeLabel:            "Oil & Gas Exploration",
    peersLabel:               "Energy Sector Peers",
    thesisSummary:            OGDC_THESIS_SUMMARY,
    thesisThemes:             OGDC_THESIS_THEMES,
    drivers:                  OGDC_DRIVERS,
    risks:                    OGDC_RISKS,
    catalysts:                OGDC_CATALYSTS,
    valuationPoints:          OGDC_VALUATION_POINTS,
    valuationSummary:         OGDC_VALUATION_SUMMARY,
    valuationHistoricalRange: OGDC_VALUATION_HISTORICAL_RANGE,
    valuationPeerContext:     OGDC_VALUATION_PEER_CONTEXT,
    dividendCommentary:       OGDC_DIVIDEND_COMMENTARY,
    dividendYieldPositioning: OGDC_DIVIDEND_YIELD_POSITIONING,
    dividendConsistencyNote:  OGDC_DIVIDEND_CONSISTENCY_NOTE,
  },
};

type Announcement = { id: number; symbol: string; title: string | null; category: string | null; published_at: string | null; url: string | null; body?: string | null };

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const WA_BASE = "https://wa.me/923001234567";

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const sym = symbol.toUpperCase();

  const company = await getCompanyBySymbol(sym);

  if (!company) {
    return (
      <main className="min-h-screen bg-base text-tx-primary p-10">
        <p className="text-tx-secondary">Company not found: {symbol}</p>
        <Link href="/stocks" className="text-gain hover:underline mt-4 inline-block">Back to all stocks</Link>
      </main>
    );
  }

  const [peers, { dividends, announcements }, metrics, reports] = await Promise.all([
    getCompanyPeers(company.sector, sym, 6),
    getStockCorporateData(sym),
    getFinancialHistory(sym, 8),
    getReportsByTicker(sym, 4),
  ]);

  // ── Company intelligence routing ──────────────────────────────────────────
  // DB-first with static fallback.
  //
  // Priority:
  //   1. DB intelligence (company_intelligence + company_intelligence_blocks)
  //      → assembled by getCompanyIntelligence() via the service + adapter layer
  //   2. Static COMPANY_CONFIGS registry (TypeScript files) — fallback
  //   3. Generic stock page — for symbols not yet in either layer
  //
  // To add DB intelligence for a new company: seed company_intelligence +
  //   company_intelligence_blocks rows. No code changes needed.
  // To add static intelligence for a new company: add to COMPANY_CONFIGS above.

  const staticConfig = COMPANY_CONFIGS[sym] ?? null;

  // Try DB first — returns null if symbol not yet seeded
  const dbConfig = await getCompanyIntelligence(sym, staticConfig ?? undefined);

  // Resolve: DB config wins; fall back to static; fall through to generic page
  const config = dbConfig ?? staticConfig;

  if (config) {
    return (
      <CompanyIntelligencePage
        config={config}
        company={company}
        peers={peers}
        dividends={dividends}
        announcements={announcements}
        metrics={metrics}
        reports={reports}
      />
    );
  }

  const isPositive = company.change != null && company.change >= 0;
  const isNegative = company.change != null && company.change < 0;
  const hasChange  = company.change != null;
  const arrow = isPositive ? "▲" : isNegative ? "▼" : "";
  const priceColor    = hasChange ? (isPositive ? "text-gain" : "text-loss") : "text-tx-primary";
  const changePillCls = hasChange
    ? isPositive ? "bg-emerald-500/15 text-gain border border-emerald-500/30"
                 : "bg-red-500/15 text-loss border border-red-500/30"
    : "bg-surface text-tx-secondary border border-border-theme";

  const waText = encodeURIComponent("I was looking at " + sym + " on AHM Platform and want to get daily PSX updates");

  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* ── PRICE HEADER ─────────────────────────────────── */}
      <div className="px-8 pt-10 pb-8 border-b border-border-theme">
        <div className="max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-5xl font-bold tracking-tight text-tx-primary">{company.symbol}</h1>
              {SECTOR_SLUG[company.sector] ? (
                <Link
                  href={"/sectors/" + SECTOR_SLUG[company.sector]}
                  className="inline-flex items-center gap-1 text-xs font-semibold font-mono text-gain bg-gain/10 border border-gain/30 rounded-full px-3 py-1.5 hover:bg-gain/20 hover:border-gain/60 transition-all"
                >
                  {company.sector}
                  <span className="text-[10px]">↗</span>
                </Link>
              ) : (
                <span className="text-xs font-mono text-tx-disabled bg-surface border border-border-theme rounded-full px-3 py-1.5">
                  {company.sector}
                </span>
              )}
            </div>
            <p className="text-tx-secondary text-lg">{company.company_name}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                className="text-xs text-tx-disabled hover:text-tx-secondary font-mono mt-1 inline-block transition-colors">
                {company.website.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-xs text-tx-disabled uppercase tracking-widest font-mono">Last Price (PKR)</p>
            <p className={"text-5xl font-bold tabular-nums " + priceColor}>{formatPrice(company.current_price)}</p>
            <span className={"inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg tabular-nums " + changePillCls}>
              {arrow} {formatChange(company.change)} ({formatPercent(company.change_percent)})
            </span>
          </div>
        </div>
      </div>

      {/* ── KEY STATS ────────────────────────────────────── */}
      <div className="px-8 py-6 border-b border-border-theme">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 max-w-6xl">
          <StatCard label="Market Cap" value={formatMarketCap(company.market_cap)} />
          <StatCard label="Volume"     value={formatVolume(company.volume)} />
          <StatCard label="P/E Ratio"  value={company.pe_ratio       != null ? company.pe_ratio.toFixed(2)       : "—"} />
          <StatCard label="EPS (PKR)"  value={company.eps            != null ? company.eps.toFixed(2)            : "—"} />
          <StatCard label="Div Yield"  value={company.dividend_yield != null ? company.dividend_yield.toFixed(2) + "%" : "—"} />
          <StatCard label="52W High"   value={company.week_52_high   != null ? formatPrice(company.week_52_high)  : "—"} />
          <StatCard label="52W Low"    value={company.week_52_low    != null ? formatPrice(company.week_52_low)   : "—"} />
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="px-8 py-8 max-w-6xl space-y-8">

        {/* COMPANY PROFILE */}
        <section>
          <SectionLabel>Company Profile</SectionLabel>
          <div className="bg-surface border border-border-theme rounded-xl p-6">
            <p className="text-tx-secondary text-sm leading-relaxed mb-6">
              {company.description ?? company.company_name + " is listed on the Pakistan Stock Exchange under the " + company.sector + " sector."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border-theme pt-5">
              <MetaItem label="Founded"   value={company.founded_year ? String(company.founded_year) : "—"} />
              <MetaItem label="CEO"       value={company.ceo ?? "—"} />
              <MetaItem label="Employees" value={company.employees != null ? company.employees.toLocaleString() : "—"} />
              <MetaItem label="Exchange"  value="PSX (KSE)" />
            </div>
          </div>
        </section>

        {/* VALUATION RATIOS */}
        <section>
          <SectionLabel>Valuation Ratios</SectionLabel>
          <div className="bg-surface border border-border-theme rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <RatioItem label="P/E Ratio"   value={company.pe_ratio       != null ? company.pe_ratio.toFixed(2)           : "—"} />
              <RatioItem label="EPS (PKR)"   value={company.eps            != null ? company.eps.toFixed(2)                : "—"} />
              <RatioItem label="Div Yield"   value={company.dividend_yield != null ? company.dividend_yield.toFixed(2) + "%" : "—"} />
              <RatioItem label="P/B Ratio"   value="—" muted />
              <RatioItem label="ROE"         value="—" muted />
              <RatioItem label="Debt/Equity" value="—" muted />
            </div>
            <p className="text-xs text-tx-disabled font-mono mt-5">P/B · ROE · Debt/Equity — pending data pipeline</p>
          </div>
        </section>

        {/* PRICE CHART PLACEHOLDER */}
        <section>
          <SectionLabel>Price History</SectionLabel>
          <div className="bg-surface border border-border-theme rounded-xl flex flex-col items-center justify-center p-8" style={{ minHeight: "200px" }}>
            <svg width="100%" height="80" viewBox="0 0 600 80" className="mb-5 opacity-10" preserveAspectRatio="none">
              <polyline points="0,70 80,52 160,58 240,35 300,40 380,22 460,18 540,12 600,6"
                fill="none" stroke="var(--gain)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-tx-disabled text-sm font-mono">Price chart integration pending</p>
            <p className="text-tx-disabled text-xs mt-1 opacity-60">Historical OHLCV data pipeline in progress</p>
          </div>
        </section>

        {/* DIVIDENDS + ANNOUNCEMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <SectionLabel>Dividend History</SectionLabel>
            <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">
              {dividends && dividends.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-theme">
                      <th className="px-4 py-3 text-left text-xs font-mono text-tx-disabled uppercase tracking-widest">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-mono text-tx-disabled uppercase tracking-widest">Period</th>
                      <th className="px-4 py-3 text-right text-xs font-mono text-tx-disabled uppercase tracking-widest">PKR/Share</th>
                      <th className="px-4 py-3 text-right text-xs font-mono text-tx-disabled uppercase tracking-widest">Announced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividends.map((d) => (
                      <tr key={d.id} className="border-b border-border-theme hover:bg-raised transition-colors">
                        <td className="px-4 py-2.5 font-mono text-tx-primary text-xs">{d.financial_year}</td>
                        <td className="px-4 py-2.5 text-tx-secondary text-xs">{d.period ?? "—"}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-gain font-semibold tabular-nums">{Number(d.amount).toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right text-tx-disabled text-xs font-mono">{fmtDate(d.announced_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-12 text-center"><p className="text-tx-disabled text-sm font-mono">No dividend history on record</p></div>
              )}
            </div>
          </section>

          <section>
            <SectionLabel>Latest Announcements</SectionLabel>
            <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">
              {announcements && announcements.length > 0 ? (
                <div className="divide-y divide-border-theme">
                  {(announcements as Announcement[]).map((a) => (
                    <div key={a.id} className="px-4 py-4 hover:bg-raised transition-colors">
                      <div className="flex items-center gap-2 mb-1.5">
                        {a.category && <span className="text-xs font-mono text-tx-secondary bg-raised border border-border-theme px-2 py-0.5 rounded">{a.category}</span>}
                        <span className="text-xs text-tx-disabled font-mono">{fmtDate(a.published_at)}</span>
                      </div>
                      {a.url
                        ? <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-sm text-tx-secondary hover:text-tx-primary transition-colors leading-snug">{a.title}</a>
                        : <p className="text-sm text-tx-secondary leading-snug">{a.title}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center"><p className="text-tx-disabled text-sm font-mono">No announcements on record</p></div>
              )}
            </div>
          </section>
        </div>

        {/* INVESTMENT THESIS */}
        <section>
          <SectionLabel>Investment Thesis</SectionLabel>
          <PendingSection
            title={company.symbol + " — Investment Thesis"}
            description={"A structured investment thesis for " + company.company_name + " is pending AHM analyst coverage. Once published, this section will cover the core long/short rationale, key themes, and positioning context."}
            items={["Bull / bear case summary", "Thesis themes", "Analyst conviction rating"]}
          />
        </section>

        {/* KEY VALUE DRIVERS */}
        <section>
          <SectionLabel>Key Value Drivers</SectionLabel>
          <PendingSection
            title="Value Drivers"
            description="This section will highlight the 3–5 most important operational and financial levers that determine this company's intrinsic value."
            items={["Revenue growth drivers", "Margin expansion / compression levers", "Capital allocation priorities"]}
          />
        </section>

        {/* KEY RISKS */}
        <section>
          <SectionLabel>Key Risks</SectionLabel>
          <PendingSection
            title="Risk Register"
            description="A structured risk register covering macro, sector, company-specific, and regulatory risks will be populated when AHM research coverage begins."
            items={["Macro / interest rate exposure", "Sector-specific regulatory risk", "Company-specific operational risk"]}
          />
        </section>

        {/* CATALYSTS */}
        <section>
          <SectionLabel>Catalysts</SectionLabel>
          <PendingSection
            title="Upcoming Catalysts"
            description="Identifiable near-term events that could re-rate this stock — earnings dates, regulatory decisions, capacity announcements, and dividend declarations."
            items={["Earnings season dates", "Regulatory / policy decisions", "Capacity or contract announcements"]}
          />
        </section>

        {/* ANALYST NOTE */}
        <section>
          <SectionLabel>AHM Analyst Note</SectionLabel>
          <div className="bg-surface border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-mono text-amber-500/60 uppercase tracking-widest mb-1">Internal Research</p>
                <h3 className="text-tx-primary font-semibold">{company.symbol} — Coverage Note</h3>
              </div>
              <span className="text-xs font-mono text-amber-500/50 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">PENDING</span>
            </div>
            <p className="text-tx-disabled text-sm leading-relaxed border-t border-border-theme pt-4 italic">
              Analyst coverage note for {company.company_name} will be published after the next AHM research review cycle.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {["Rating", "Target Price", "Upside"].map((l) => (
                <div key={l} className="bg-raised rounded-lg p-3 text-center">
                  <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">{l}</p>
                  <p className="text-tx-disabled font-bold">—</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── WHATSAPP + OPEN ACCOUNT ──────────────────────── */}
      <div className="px-8 py-8 border-t border-border-theme">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href={WA_BASE + "?text=" + waText} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-6 py-5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gain flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.863L.057 23.886a.5.5 0 0 0 .609.61l6.101-1.526A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.511-5.188-1.402l-.373-.22-3.87.968.999-3.793-.242-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            <div className="flex-1">
              <p className="text-tx-primary font-semibold text-sm group-hover:text-gain transition-colors">Get daily PSX updates on WhatsApp</p>
              <p className="text-tx-secondary text-xs mt-0.5">Pre-market briefing · AHM picks · Top movers — free, every trading day</p>
            </div>
            <span className="text-xs font-mono text-gain opacity-0 group-hover:opacity-100 transition-opacity">Join →</span>
          </a>
          <Link href="/open-account"
            className="group flex items-center gap-4 bg-surface border border-border-theme rounded-xl px-6 py-5 hover:border-tx-secondary transition-all">
            <div className="w-8 h-8 rounded-lg bg-raised flex items-center justify-center flex-shrink-0 text-tx-primary font-bold text-sm border border-border-theme">₨</div>
            <div className="flex-1">
              <p className="text-tx-primary font-semibold text-sm group-hover:text-gain transition-colors">Open a PSX brokerage account</p>
              <p className="text-tx-secondary text-xs mt-0.5">{"Start trading " + sym + " and other KSE-100 stocks. Ready in 48 hours."}</p>
            </div>
            <span className="text-xs font-mono text-tx-disabled opacity-0 group-hover:opacity-100 transition-opacity">Start →</span>
          </Link>
        </div>
      </div>

      {/* ── SECTOR PEERS ─────────────────────────────────── */}
      {peers && peers.length > 0 && (
        <div className="px-8 py-8 border-t border-border-theme">
          <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <p className="text-xs text-tx-disabled uppercase tracking-widest font-mono">Sector Peers</p>
                {SECTOR_SLUG[company.sector] ? (
                  <Link href={"/sectors/" + SECTOR_SLUG[company.sector]}
                    className="text-xs font-mono font-semibold text-tx-primary bg-surface border border-border-theme rounded-full px-3 py-1 hover:border-tx-secondary hover:bg-raised transition-all">
                    {company.sector} ↗
                  </Link>
                ) : (
                  <span className="text-xs font-mono text-tx-secondary">{company.sector}</span>
                )}
              </div>
              <Link
                href={SECTOR_SLUG[company.sector] ? "/sectors/" + SECTOR_SLUG[company.sector] : "/stocks?sector=" + encodeURIComponent(company.sector ?? "")}
                className="text-xs font-mono text-tx-secondary hover:text-tx-primary transition-colors">
                {SECTOR_SLUG[company.sector] ? "View sector module →" : "View all " + company.sector + " stocks →"}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {peers.map((peer) => {
                const peerPos   = peer.change_percent != null && peer.change_percent >= 0;
                const peerNeg   = peer.change_percent != null && peer.change_percent < 0;
                const peerColor = peer.change_percent == null ? "text-tx-disabled" : peerPos ? "text-gain" : "text-loss";
                const peerBg    = peerPos ? "bg-emerald-500/10" : peerNeg ? "bg-red-500/10" : "bg-surface";
                return (
                  <Link key={peer.id} href={"/stocks/" + peer.symbol}
                    className="group bg-surface border border-border-theme rounded-xl p-4 hover:border-tx-secondary hover:bg-raised transition-all">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono font-bold text-tx-primary group-hover:text-gain transition-colors text-sm">{peer.symbol}</span>
                      <span className={"text-xs font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded " + peerBg + " " + peerColor}>
                        {formatPercent(peer.change_percent)}
                      </span>
                    </div>
                    <p className="text-tx-disabled text-xs truncate mb-3 leading-tight">{peer.company_name}</p>
                    <div className="space-y-1.5 border-t border-border-theme pt-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-tx-disabled font-mono">Price</span>
                        <span className="text-xs font-mono text-tx-primary font-semibold tabular-nums">{formatPrice(peer.current_price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-tx-disabled font-mono">Mkt Cap</span>
                        <span className="text-xs font-mono text-tx-secondary tabular-nums">{formatMarketCap(peer.market_cap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-tx-disabled font-mono">P/E</span>
                        <span className="text-xs font-mono text-tx-secondary tabular-nums">
                          {peer.pe_ratio != null ? peer.pe_ratio.toFixed(1) + "x" : "—"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">{children}</p>;
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-tx-secondary">{value}</p>
    </div>
  );
}

function RatioItem({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="border border-border-theme rounded-lg p-3 text-center">
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1.5">{label}</p>
      <p className={"text-base font-bold tabular-nums " + (muted ? "text-tx-disabled" : "text-tx-primary")}>{value}</p>
    </div>
  );
}

/**
 * PendingSection — structural placeholder for Investment Thesis, Key Drivers,
 * Key Risks, and Catalysts sections in the generic stock page shell.
 *
 * Renders the same layout skeleton that CompanyIntelligencePage uses for these
 * sections, so the page structure is consistent across all 90+ companies.
 * When analyst coverage is added (via COMPANY_CONFIGS or DB intelligence),
 * the page automatically routes to CompanyIntelligencePage instead.
 */
function PendingSection({ title, description, items }: {
  title:       string;
  description: string;
  items:       string[];
}) {
  return (
    <div className="bg-surface border border-border-theme rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-tx-secondary font-semibold text-sm">{title}</h3>
        <span className="text-[10px] font-mono text-tx-disabled bg-raised border border-border-theme px-2 py-0.5 rounded uppercase tracking-widest flex-shrink-0 ml-3">
          Pending Coverage
        </span>
      </div>
      <p className="text-tx-disabled text-sm leading-relaxed mb-4">{description}</p>
      <ul className="space-y-2 border-t border-border-theme pt-4">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-tx-disabled font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-border-theme flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
