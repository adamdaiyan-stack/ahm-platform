// components/ui/RegimeIndicator.tsx
//
// Institutional market regime badge.
// Displays the current market regime classification with a color-coded
// status dot and short contextual note.
//
// Design philosophy:
//   - Calm, institutional — no flashy gradients or animations
//   - Color signals meaning, not decoration
//   - Fits naturally in a stats strip alongside StatCard
//
// Usage:
//   <RegimeIndicator regime="Bullish" note="Broad advance, positive breadth." confidence={0.82} />

import type { RegimeLabel } from "@/types";

// ─── Regime color + label config ─────────────────────────────────────────────

type RegimeConfig = {
  dotClass:  string;   // Tailwind class for the status dot
  textClass: string;   // Tailwind class for the regime label text
  bgClass:   string;   // Tailwind class for the badge background tint
};

const REGIME_CONFIG: Record<RegimeLabel, RegimeConfig> = {
  Bullish: {
    dotClass:  "bg-gain",
    textClass: "text-gain",
    bgClass:   "bg-gain/5",
  },
  "Risk-On": {
    dotClass:  "bg-gain",
    textClass: "text-gain",
    bgClass:   "bg-gain/5",
  },
  Neutral: {
    dotClass:  "bg-tx-disabled",
    textClass: "text-tx-secondary",
    bgClass:   "bg-surface",
  },
  Defensive: {
    dotClass:  "bg-amber-400",
    textClass: "text-amber-400",
    bgClass:   "bg-amber-400/5",
  },
  "Risk-Off": {
    dotClass:  "bg-loss",
    textClass: "text-loss",
    bgClass:   "bg-loss/5",
  },
  "High Volatility": {
    dotClass:  "bg-amber-400",
    textClass: "text-amber-400",
    bgClass:   "bg-amber-400/5",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type RegimeIndicatorProps = {
  regime:      RegimeLabel;
  note?:       string;
  confidence?: number;   // 0–1
  className?:  string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegimeIndicator({
  regime,
  note,
  confidence,
  className = "",
}: RegimeIndicatorProps) {
  const cfg = REGIME_CONFIG[regime] ?? REGIME_CONFIG["Neutral"];
  const confPct = confidence != null ? Math.round(confidence * 100) : null;

  return (
    <div
      className={
        `border border-border-theme rounded-xl p-4 ${cfg.bgClass} ${className}`
      }
    >
      {/* Label row */}
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1.5">
        Market Regime
      </p>

      {/* Regime name + status dot */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${cfg.dotClass}`}
          aria-hidden="true"
        />
        <span className={`font-bold font-mono text-xl ${cfg.textClass}`}>
          {regime}
        </span>
        {confPct != null && (
          <span className="text-xs font-mono text-tx-disabled ml-auto">
            {confPct}% conf.
          </span>
        )}
      </div>

      {/* Contextual note */}
      {note && (
        <p className="text-xs text-tx-disabled font-mono mt-1.5 leading-relaxed line-clamp-2">
          {note}
        </p>
      )}
    </div>
  );
}
