// components/company/ubl/UBLIntelligencePage.tsx
//
// UBL Company Intelligence Page — the reference implementation.
//
// ARCHITECTURE
//   This page assembles reusable company intelligence components
//   with UBL-specific static config (ubl-intelligence.ts) and
//   live DB data (financial_metrics, dividends, announcements, peers).
//
//   Pattern is identical to SectorFrameworkPage pattern:
//     Static config (ubl-intelligence.ts) = emergency fallback
//     DB data (financial_metrics, dividends) = primary source
//
//   Future: seed a company_intelligence table and replace static
//   config with getSectorBySlug-equivalent for companies.
//
// DATA FLOW
//   Page receives company + peers + dividends + announcements + metrics
//   All fetched in the parent [symbol]/page.tsx via Promise.all
//   No direct DB access inside this component.

import Link from "next/link";

import {
  InvestmentThesis,
  CompanyDrivers,
  RiskCatalystPanel,
  FinancialSnapshot,
  DividendAnalysis,
  ValuationSummary,
  RelatedResearch,
  AIInsightPlaceholder,
  SectionLabel,
} from "@/components/company";

import {
  UBL_THESIS_SUMMARY,
  UBL_THESIS_THEMES,
  UBL_DRIVERS,
  UBL_RISKS,
  UBL_CATALYSTS,
  UBL_VALUATION_SUMMARY,
  UBL_VALUATION_HISTORICAL_RANGE,
  UBL_VALUATION_PEER_CONTEXT,
  UBL_VALUATION_POINTS,
  UBL_DIVIDEND_COMMENTARY,
  UBL_DIVIDEND_YIELD_POSITIONING,
  UBL_DIVIDEND_CONSISTENCY_NOTE,
} from "./ubl-intelligence";

import {
  formatPrice,
  formatChange,
  formatPercent,
  formatMarketCap,
  formatVolume,
} from "@/lib/formatters";

import { SECTOR_SLUG } from "@/constants";
import type { Company, CompanyPeer, Dividend, FinancialMetrics, ResearchReportSummary, Announcement } from "@/types";

type UBLIntelligencePageProps = {
  company:       Company;
  peers:         CompanyPeer[];
  dividends:     Dividend[];
  announcements: Announcement[];
  metrics:       FinancialMetrics[];
  reports:       ResearchReportSummary[];
};

const UBL_ACCENT = "#3b82f6";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function UBLIntelligencePage({
  company,
  peers,
  dividends,
  announcements,
  metrics,
  reports,
}: UBLIntelligencePageProps) {
  const isPositive  = company.change != null && company.change >= 0;
  const isNegative  = company.change != null && company.change < 0;
  const hasChange   = company.change != null;
  const arrow       = isPositive ? "▲" : isNegative ? "▼" : "";
  const priceColor  = hasChange ? (isPositive ? "text-gain" : "text-loss") : "text-tx-primary";
  const changePill  = hasChange
    ? isPositive
      ? "bg-emerald-500/15 text-gain border border-emerald-500/30"
      : "bg-red-500/15 text-loss border border-red-500/30"
    : "bg-surface text-tx-secondary border border-border-theme";

  const latestMetrics  = metrics.find((m) => m.period_type === "annual") ?? metrics[0] ?? null;
  const sectorSlug     = SECTOR_SLUG[company.sector];
  const waText         = encodeURIComponent("I was looking at UBL on AHM Platform and want to get daily PSX updates");

  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div
        className="border-b border-border-theme"
        style={{ borderTop: `3px solid ${UBL_ACCENT}` }}
      >
        {/* Accent stripe */}
        <div
          className="h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, ${UBL_ACCENT}80, transparent)` }}
        />

        {/* Company identity + price */}
        <div className="px-6 md:px-8 pt-8 pb-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left — identity */}
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-3 text-xs font-mono text-tx-disabled">
                <Link href="/stocks" className="hover:text-tx-secondary transition-colors">Stocks</Link>
                <span>/</span>
                <span className="text-tx-secondary">{company.symbol}</span>
              </div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-tx-primary">
                  {company.symbol}
                </h1>
                {sectorSlug ? (
                  <Link
                    href={"/sectors/" + sectorSlug}
                    className="inline-flex items-center gap-1 text-xs font-semibold font-mono px-3 py-1.5 rounded-full border transition-all hover:opacity-80"
                    style={{ color: UBL_ACCENT, backgroundColor: UBL_ACCENT + "15", borderColor: UBL_ACCENT + "40" }}
                  >
                    {company.sector} ↗
                  </Link>
                ) : (
                  <span className="text-xs font-mono text-tx-disabled bg-surface border border-border-theme rounded-full px-3 py-1.5">
                    {company.sector}
                  </span>
                )}
              </div>
              <p className="text-tx-secondary text-lg mb-0.5">{company.company_name}</p>
              <p className="text-xs text-tx-disabled font-mono">PSX: KSE-100 · Commercial Bank</p>
            </div>

            {/* Right — price */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <p className="text-xs text-tx-disabled uppercase tracking-widest font-mono">Last Price (PKR)</p>
              <p className={"text-5xl font-bold tabular-nums " + priceColor}>
                {formatPrice(company.current_price)}
              </p>
              <span className={"inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg tabular-nums " + changePill}>
                {arrow} {formatChange(company.change)} ({formatPercent(company.change_percent)})
              </span>
            </div>
          </div>
        </div>

        {/* Key stats strip */}
        <div className="px-6 md:px-8 pb-6">
          <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {[
              { label: "Market Cap",  value: formatMarketCap(company.market_cap) },
              { label: "Volume",      value: formatVolume(company.volume) },
              { label: "P/E Ratio",   value: company.pe_ratio       != null ? company.pe_ratio.toFixed(1) + "x"       : "—" },
              { label: "EPS (PKR)",   value: company.eps            != null ? company.eps.toFixed(2)                  : "—" },
              { label: "Div Yield",   value: company.dividend_yield != null ? company.dividend_yield.toFixed(1) + "%" : "—" },
              { label: "52W High",    value: formatPrice(company.week_52_high) },
              { label: "52W Low",     value: formatPrice(company.week_52_low) },
            ].map((s) => (
              <div key={s.label} className="bg-surface border border-border-theme rounded-xl p-3 md:p-4">
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1.5 leading-tight">
                  {s.label}
                </p>
                <p className="text-sm font-bold tabular-nums font-mono text-tx-primary">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="px-6 md:px-8 py-8 max-w-6xl mx-auto space-y-10">

        {/* 1 — Investment Thesis */}
        <InvestmentThesis
          summary={UBL_THESIS_SUMMARY}
          themes={UBL_THESIS_THEMES}
          accentColor={UBL_ACCENT}
        />

        {/* 2 — Key Drivers */}
        <CompanyDrivers drivers={UBL_DRIVERS} />

        {/* 3 — Risks & Catalysts */}
        <RiskCatalystPanel risks={UBL_RISKS} catalysts={UBL_CATALYSTS} />

        {/* 4 — Financial Snapshot */}
        <FinancialSnapshot latest={latestMetrics} history={metrics} />

        {/* 5 — Dividend Analysis + Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DividendAnalysis
            dividends={dividends}
            commentary={UBL_DIVIDEND_COMMENTARY}
            yieldPositioning={UBL_DIVIDEND_YIELD_POSITIONING}
            consistencyNote={UBL_DIVIDEND_CONSISTENCY_NOTE}
          />

          {/* Announcements sidebar */}
          <section>
            <SectionLabel>Latest Announcements</SectionLabel>
            <div className="bg-surface border border-border-theme rounded-xl overflow-hidden h-full">
              {announcements.length > 0 ? (
                <div className="divide-y divide-border-theme">
                  {announcements.map((a) => (
                    <div key={a.id} className="px-4 py-4 hover:bg-raised transition-colors">
                      <div className="flex items-center gap-2 mb-1.5">
                        {a.category && (
                          <span className="text-xs font-mono text-tx-secondary bg-raised border border-border-theme px-2 py-0.5 rounded">
                            {a.category}
                          </span>
                        )}
                        <span className="text-xs text-tx-disabled font-mono">{fmtDate(a.published_at)}</span>
                      </div>
                      {a.url
                        ? <a href={a.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-tx-secondary hover:text-tx-primary transition-colors leading-snug">
                            {a.title}
                          </a>
                        : <p className="text-sm text-tx-secondary leading-snug">{a.title}</p>
                      }
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-tx-disabled text-sm font-mono">No announcements on record</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 6 — Valuation Summary */}
        <ValuationSummary
          points={UBL_VALUATION_POINTS}
          summary={UBL_VALUATION_SUMMARY}
          historicalRange={UBL_VALUATION_HISTORICAL_RANGE}
          peerContext={UBL_VALUATION_PEER_CONTEXT}
        />

        {/* 7 — Related Research + AI Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RelatedResearch reports={reports} symbol="UBL" />
          <AIInsightPlaceholder symbol="UBL" companyName="United Bank Limited" />
        </div>

        {/* 8 — Price chart placeholder */}
        <section>
          <SectionLabel>Price History</SectionLabel>
          <div className="bg-surface border border-border-theme rounded-xl flex flex-col items-center justify-center p-8" style={{ minHeight: "180px" }}>
            <svg width="100%" height="64" viewBox="0 0 600 64" className="mb-4 opacity-15" preserveAspectRatio="none">
              <polyline
                points="0,58 80,44 160,48 240,30 300,34 380,18 460,14 540,8 600,4"
                fill="none" stroke={UBL_ACCENT} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <p className="text-tx-disabled text-sm font-mono">Price chart — OHLCV pipeline in progress</p>
          </div>
        </section>

      </div>

      {/* ── ACTIONS STRIP ────────────────────────────────────────────────── */}
      <div className="px-6 md:px-8 py-8 border-t border-border-theme">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={"https://wa.me/923001234567?text=" + waText}
            target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-6 py-5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-gain flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.863L.057 23.886a.5.5 0 0 0 .609.61l6.101-1.526A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.511-5.188-1.402l-.373-.22-3.87.968.999-3.793-.242-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            <div className="flex-1">
              <p className="text-tx-primary font-semibold text-sm group-hover:text-gain transition-colors">Get daily PSX updates on WhatsApp</p>
              <p className="text-tx-secondary text-xs mt-0.5">Pre-market briefing · AHM picks · Top movers — free, every trading day</p>
            </div>
            <span className="text-xs font-mono text-gain opacity-0 group-hover:opacity-100 transition-opacity">Join →</span>
          </a>
          <Link
            href="/open-account"
            className="group flex items-center gap-4 bg-surface border border-border-theme rounded-xl px-6 py-5 hover:border-tx-secondary transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-raised flex items-center justify-center flex-shrink-0 text-tx-primary font-bold text-sm border border-border-theme">₨</div>
            <div className="flex-1">
              <p className="text-tx-primary font-semibold text-sm group-hover:text-gain transition-colors">Open a PSX brokerage account</p>
              <p className="text-tx-secondary text-xs mt-0.5">Start trading UBL and other KSE-100 stocks. Ready in 48 hours.</p>
            </div>
            <span className="text-xs font-mono text-tx-disabled opacity-0 group-hover:opacity-100 transition-opacity">Start →</span>
          </Link>
        </div>
      </div>

      {/* ── SECTOR PEERS ─────────────────────────────────────────────────── */}
      {peers.length > 0 && (
        <div className="px-6 md:px-8 py-8 border-t border-border-theme">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel>Banking Peers</SectionLabel>
              {sectorSlug && (
                <Link
                  href={"/sectors/" + sectorSlug}
                  className="text-xs font-mono text-tx-secondary hover:text-tx-primary transition-colors"
                >
                  View Banking sector →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {peers.map((peer) => {
                const pPos   = peer.change_percent != null && peer.change_percent >= 0;
                const pNeg   = peer.change_percent != null && peer.change_percent < 0;
                const pColor = peer.change_percent == null ? "text-tx-disabled" : pPos ? "text-gain" : "text-loss";
                const pBg    = pPos ? "bg-emerald-500/10" : pNeg ? "bg-red-500/10" : "bg-surface";
                return (
                  <Link
                    key={peer.id}
                    href={"/stocks/" + peer.symbol}
                    className="group bg-surface border border-border-theme rounded-xl p-4 hover:border-tx-secondary hover:bg-raised transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono font-bold text-tx-primary group-hover:text-gain transition-colors text-sm">
                        {peer.symbol}
                      </span>
                      <span className={"text-xs font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded " + pBg + " " + pColor}>
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
