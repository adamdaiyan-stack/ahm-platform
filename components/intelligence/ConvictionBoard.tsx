"use client";

// components/intelligence/ConvictionBoard.tsx
//
// Client component: interactive conviction board with tier filter tabs,
// score bars, and expandable sub-score breakdown.

import { useState } from "react";
import Link from "next/link";
import type { ConvictionBoardRow } from "@/services/api/intelligence";
import { ConvictionBadge } from "./ConvictionBadge";
import type { ConvictionTier } from "@/lib/scoring";

// ---- Types ------------------------------------------------------------------

type Props = {
  rows: ConvictionBoardRow[];
};

type TierFilter = "ALL" | ConvictionTier;

// ---- Constants --------------------------------------------------------------

const TIER_ORDER: ConvictionTier[] = [
  "HIGH_CONVICTION",
  "MODERATE",
  "WATCHLIST",
  "MONITOR",
];

const TIER_LABELS: Record<ConvictionTier, string> = {
  HIGH_CONVICTION: "High Conviction",
  MODERATE:        "Moderate",
  WATCHLIST:       "Watchlist",
  MONITOR:         "Monitor",
};

const SUB_SCORE_LABELS: Record<string, string> = {
  valuation:                "Valuation",
  profitability:            "Profitability",
  growth:                   "Growth",
  balance_sheet:            "Balance Sheet",
  momentum:                 "Momentum",
  macro_sensitivity:        "Macro",
  catalyst:                 "Catalysts",
  risk:                     "Risk",
  sector_relative_strength: "Sector Strength",
  technical_timing:         "Technical",
};

const SUB_SCORE_WEIGHTS: Record<string, number> = {
  valuation:                0.20,
  profitability:            0.18,
  growth:                   0.15,
  balance_sheet:            0.12,
  momentum:                 0.10,
  macro_sensitivity:        0.08,
  catalyst:                 0.07,
  risk:                     0.07,
  sector_relative_strength: 0.03,
  technical_timing:         0.00,
};

// ---- Score bar --------------------------------------------------------------

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct   = Math.min(100, Math.max(0, (score / max) * 100));
  const color = score >= 75 ? "#22c55e" : score >= 55 ? "#3b82f6" : score >= 35 ? "#f59e0b" : "#71717a";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono text-tx-primary w-6 text-right">{score}</span>
    </div>
  );
}

// ---- Data confidence indicator ----------------------------------------------

function ConfidenceIndicator({ multiplier }: { multiplier: number }) {
  const pct   = Math.round(multiplier * 100);
  const color = pct >= 90 ? "text-emerald-400" : pct >= 75 ? "text-amber-400" : "text-red-400";
  return (
    <span className={`text-[10px] font-mono ${color}`}>{pct}%</span>
  );
}

// ---- Sub-score breakdown row ------------------------------------------------

function SubScoreBreakdown({ subScores }: { subScores: Record<string, { score: number; confidence: number }> }) {
  const activeKeys = Object.keys(SUB_SCORE_WEIGHTS).filter(k => SUB_SCORE_WEIGHTS[k] > 0);

  return (
    <div className="bg-surface rounded-lg p-4 mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {activeKeys.map(key => {
        const sub = subScores[key];
        if (!sub) return null;
        const weight = SUB_SCORE_WEIGHTS[key];
        return (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-tx-secondary uppercase tracking-widest">
                {SUB_SCORE_LABELS[key] ?? key}
              </span>
              <span className="text-[10px] font-mono text-tx-disabled">{Math.round(weight * 100)}%</span>
            </div>
            <ScoreBar score={sub.score} />
            {sub.confidence < 0.7 && (
              <span className="text-[9px] font-mono text-amber-400">low data</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- Row --------------------------------------------------------------------

function BoardRow({ row }: { row: ConvictionBoardRow }) {
  const [expanded, setExpanded] = useState(false);
  const hasSubScores = row.sub_scores && Object.keys(row.sub_scores).length > 0;

  return (
    <div className="border-b border-border-theme last:border-b-0">
      {/* Main row */}
      <div className="flex items-center gap-4 px-4 py-3 hover:bg-surface/50 transition-colors">

        {/* Symbol + name */}
        <div className="w-28 flex-shrink-0">
          <Link
            href={`/stocks/${row.symbol}`}
            className="text-sm font-mono font-semibold text-tx-primary hover:text-emerald-400 transition-colors"
          >
            {row.symbol}
          </Link>
          <div className="text-[10px] text-tx-disabled truncate max-w-[112px]">{row.company_name}</div>
        </div>

        {/* Sector */}
        <div className="hidden sm:block w-24 flex-shrink-0">
          <span className="text-[10px] font-mono text-tx-secondary">{row.sector}</span>
        </div>

        {/* Score bar */}
        <div className="flex-1 min-w-0">
          <ScoreBar score={row.score} />
        </div>

        {/* Tier badge */}
        <div className="hidden md:block flex-shrink-0">
          <ConvictionBadge tier={row.tier} score={row.score} size="sm" />
        </div>

        {/* Data confidence */}
        <div className="hidden lg:flex flex-col items-end flex-shrink-0 w-12">
          <span className="text-[9px] text-tx-disabled font-mono">data</span>
          <ConfidenceIndicator multiplier={row.data_confidence} />
        </div>

        {/* Scored at */}
        <div className="hidden xl:block w-20 flex-shrink-0 text-right">
          <span className="text-[10px] font-mono text-tx-disabled">
            {new Date(row.scored_at).toLocaleDateString("en-PK", { day: "2-digit", month: "short" })}
          </span>
        </div>

        {/* Expand toggle */}
        {hasSubScores && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-tx-disabled hover:text-tx-primary transition-colors flex-shrink-0"
            aria-label={expanded ? "Collapse sub-scores" : "Expand sub-scores"}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>

      {/* Sub-score breakdown */}
      {expanded && hasSubScores && (
        <div className="px-4 pb-3">
          <SubScoreBreakdown subScores={row.sub_scores} />
        </div>
      )}
    </div>
  );
}

// ---- Tier tab button --------------------------------------------------------

function TierTab({
  label, count, active, onClick,
}: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
        active
          ? "bg-tx-primary text-base font-semibold"
          : "text-tx-secondary hover:text-tx-primary hover:bg-surface"
      }`}
    >
      {label}
      <span className={`text-[10px] px-1 rounded ${active ? "bg-base/20" : "bg-surface text-tx-disabled"}`}>
        {count}
      </span>
    </button>
  );
}

// ---- Main component ---------------------------------------------------------

export function ConvictionBoard({ rows }: Props) {
  const [activeFilter, setActiveFilter] = useState<TierFilter>("ALL");
  const [search, setSearch] = useState("");

  // Count per tier
  const counts: Record<TierFilter, number> = {
    ALL:              rows.length,
    HIGH_CONVICTION:  rows.filter(r => r.tier === "HIGH_CONVICTION").length,
    MODERATE:         rows.filter(r => r.tier === "MODERATE").length,
    WATCHLIST:        rows.filter(r => r.tier === "WATCHLIST").length,
    MONITOR:          rows.filter(r => r.tier === "MONITOR").length,
  };

  // Filter rows
  const filtered = rows.filter(r => {
    const matchesTier   = activeFilter === "ALL" || r.tier === activeFilter;
    const matchesSearch = !search
      || r.symbol.toUpperCase().includes(search.toUpperCase())
      || r.company_name.toLowerCase().includes(search.toLowerCase())
      || r.sector.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4">

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Tier filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <TierTab
            label="All"
            count={counts.ALL}
            active={activeFilter === "ALL"}
            onClick={() => setActiveFilter("ALL")}
          />
          {TIER_ORDER.map(tier => (
            <TierTab
              key={tier}
              label={TIER_LABELS[tier]}
              count={counts[tier]}
              active={activeFilter === tier}
              onClick={() => setActiveFilter(tier)}
            />
          ))}
        </div>

        {/* Search */}
        <div className="sm:ml-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search symbol or sector…"
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface border border-border-theme text-tx-primary placeholder:text-tx-disabled focus:outline-none focus:border-emerald-500/50 w-52"
          />
        </div>
      </div>

      {/* Board table */}
      <div className="rounded-xl border border-border-theme overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-2 bg-surface border-b border-border-theme">
          <div className="w-28 flex-shrink-0">
            <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest">Symbol</span>
          </div>
          <div className="hidden sm:block w-24 flex-shrink-0">
            <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest">Sector</span>
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest">Conviction Score</span>
          </div>
          <div className="hidden md:block w-32 flex-shrink-0">
            <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest">Tier</span>
          </div>
          <div className="hidden lg:block w-12 flex-shrink-0">
            <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest text-right block">Data</span>
          </div>
          <div className="hidden xl:block w-20 flex-shrink-0">
            <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest text-right block">Scored</span>
          </div>
          <div className="w-5 flex-shrink-0" /> {/* expand toggle spacer */}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-tx-disabled font-mono text-sm">
            {rows.length === 0
              ? "No companies have been scored yet. Run fn-score-all-companies to populate."
              : "No results match your filter."}
          </div>
        ) : (
          filtered.map(row => <BoardRow key={row.symbol} row={row} />)
        )}
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <p className="text-[10px] font-mono text-tx-disabled text-right">
          {filtered.length} of {rows.length} companies &mdash; scores updated nightly at 07:00 PKT
        </p>
      )}
    </div>
  );
}
