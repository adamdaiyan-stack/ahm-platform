// components/intelligence/ConvictionBadge.tsx
//
// Tier badge used on the conviction board and stock detail pages.

import type { ConvictionTier } from "@/lib/scoring";

type Props = {
  tier:  ConvictionTier;
  score: number;
  size?: "sm" | "md";
};

const TIER_CONFIG: Record<ConvictionTier, { label: string; classes: string }> = {
  HIGH_CONVICTION: {
    label:   "High Conviction",
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  MODERATE: {
    label:   "Moderate",
    classes: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  WATCHLIST: {
    label:   "Watchlist",
    classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  MONITOR: {
    label:   "Monitor",
    classes: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

export function ConvictionBadge({ tier, score, size = "md" }: Props) {
  const cfg     = TIER_CONFIG[tier];
  const sizeClx = size === "sm"
    ? "text-[10px] px-1.5 py-0.5 gap-1"
    : "text-xs px-2 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold uppercase tracking-widest rounded border ${sizeClx} ${cfg.classes}`}
    >
      <span>{score}</span>
      <span className="opacity-60">|</span>
      <span>{cfg.label}</span>
    </span>
  );
}
