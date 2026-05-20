// app/intelligence/page.tsx
//
// /intelligence — Conviction Board
//
// Server component: fetches conviction_board VIEW data, renders
// the interactive ConvictionBoard client component.
//
// Architecture:
//   Server fetches → passes to client for filter/search interactivity.
//   No LLM on this page. Pure deterministic scoring output.

import { Suspense } from "react";
import { getConvictionBoard } from "@/services/api/intelligence";
import { ConvictionBoard } from "@/components/intelligence/ConvictionBoard";
import { TIER_THRESHOLDS } from "@/lib/scoring";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence Board | AHM Platform",
  description: "Conviction scores for KSE-100 listed companies — algorithmic, institutional-grade.",
};

// Revalidate every 5 minutes (scoring runs nightly but may be triggered on-demand)
export const revalidate = 300;

// ---- Tier summary stat -------------------------------------------------------

function TierStat({
  label, count, color,
}: { label: string; count: number; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-2xl font-bold font-mono" style={{ color }}>{count}</span>
      <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ---- Page -------------------------------------------------------------------

export default async function IntelligencePage() {
  const rows = await getConvictionBoard();

  const highConviction = rows.filter(r => r.tier === "HIGH_CONVICTION").length;
  const moderate       = rows.filter(r => r.tier === "MODERATE").length;
  const watchlist      = rows.filter(r => r.tier === "WATCHLIST").length;
  const monitor        = rows.filter(r => r.tier === "MONITOR").length;

  const latestScored = rows.length > 0
    ? new Date(Math.max(...rows.map(r => new Date(r.scored_at).getTime())))
    : null;

  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* Header */}
      <div className="px-6 md:px-8 pt-8 pb-6 border-b border-border-theme">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-tx-disabled font-mono uppercase tracking-widest mb-1">
            AI Intelligence Engine
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-tx-primary">Conviction Board</h1>
              <p className="mt-1 text-sm text-tx-secondary max-w-xl">
                Algorithmic conviction scores for KSE-100 companies. Scores reflect
                valuation, profitability, growth, balance sheet strength, sector
                momentum, and macro sensitivity — no buy/sell signals.
              </p>
            </div>
            {latestScored && (
              <p className="text-[10px] font-mono text-tx-disabled sm:ml-auto sm:text-right shrink-0">
                Last scored<br />
                {latestScored.toLocaleDateString("en-PK", {
                  day: "2-digit", month: "short", year: "numeric",
                })}{" "}
                {latestScored.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>

          {/* Tier summary */}
          {rows.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-8">
              <TierStat label="High Conviction" count={highConviction} color="#22c55e" />
              <TierStat label="Moderate"        count={moderate}       color="#3b82f6" />
              <TierStat label="Watchlist"       count={watchlist}      color="#f59e0b" />
              <TierStat label="Monitor"         count={monitor}        color="#71717a" />
              <div className="flex flex-col gap-0.5 ml-auto self-end">
                <span className="text-[10px] font-mono text-tx-disabled uppercase tracking-widest">Thresholds</span>
                <div className="flex gap-3">
                  {(["HIGH_CONVICTION", "MODERATE", "WATCHLIST", "MONITOR"] as const).map(t => (
                    <span key={t} className="text-[10px] font-mono text-tx-disabled">
                      {TIER_THRESHOLDS[t].min}–{TIER_THRESHOLDS[t].max}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <Suspense
          fallback={
            <div className="text-tx-disabled font-mono text-sm py-12 text-center">
              Loading conviction board…
            </div>
          }
        >
          <ConvictionBoard rows={rows} />
        </Suspense>
      </div>

      {/* Architecture note */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-8">
        <div className="rounded-xl border border-border-theme bg-surface p-4">
          <p className="text-[11px] font-mono text-tx-disabled leading-relaxed">
            <span className="text-tx-secondary font-semibold">Methodology.</span>{" "}
            Conviction scores are computed by a deterministic algorithm (no LLM involvement).
            10 sub-scores are weighted and combined with a data confidence multiplier
            (0.65–1.00). Scores range 0–100 across four tiers:
            High Conviction (75+), Moderate (55–74), Watchlist (35–54), Monitor (0–34).
            This platform does not provide buy, sell, or hold recommendations.
            All outputs are for institutional research and decision-support only.
          </p>
        </div>
      </div>
    </main>
  );
}
