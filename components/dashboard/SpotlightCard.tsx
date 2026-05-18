// components/dashboard/SpotlightCard.tsx
//
// "Today's spotlight" — one featured intelligence insight per session.
// Could be a sector thesis, a company catalyst, or a macro observation.
//
// DATA MODEL:
//   Static seed below. Future: DB record (market_spotlight table) or
//   AI-selected from company/sector intelligence blocks.
//
// ARCHITECTURE:
//   Standalone section card. Accepts optional props for overrides.
//   Accent color drives the left border treatment.

import Link from "next/link";

export type Spotlight = {
  eyebrow:     string;                // e.g. "Banking · Spotlight"
  title:       string;                // headline
  body:        string;                // 1-2 sentence elaboration
  accentColor: string;                // CSS color for left border
  cta?: {
    label: string;
    href:  string;
  };
};

// ── Static seed — editorial ────────────────────────────────────────────────────
export const DEFAULT_SPOTLIGHT: Spotlight = {
  eyebrow:     "Banking · Rate Cycle",
  title:       "The ETR re-rating window",
  body:
    "With SBP rate cuts compressing NIM across the sector, the Federal Budget " +
    "ETR reduction is the highest-magnitude near-term catalyst. MCB — with the " +
    "sector's highest pre-tax earnings quality — has the most EPS leverage from " +
    "any super-tax relief.",
  accentColor: "#be123c",
  cta:         { label: "MCB intelligence →", href: "/stocks/MCB" },
};

type Props = {
  spotlight?: Spotlight;
};

export default function SpotlightCard({ spotlight = DEFAULT_SPOTLIGHT }: Props) {
  return (
    <div
      className="relative bg-surface border border-border-theme rounded-xl px-6 py-5 overflow-hidden"
      style={{ borderLeftColor: spotlight.accentColor, borderLeftWidth: "3px" }}
    >
      {/* Subtle glow in top-right corner */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-5 pointer-events-none"
        style={{ backgroundColor: spotlight.accentColor }}
      />

      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-2">
        {spotlight.eyebrow}
      </p>
      <h3 className="text-lg font-bold text-tx-primary mb-2 leading-snug">
        {spotlight.title}
      </h3>
      <p className="text-sm text-tx-secondary leading-relaxed mb-4">
        {spotlight.body}
      </p>
      {spotlight.cta && (
        <Link
          href={spotlight.cta.href}
          className="text-xs font-mono font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
          style={{ color: spotlight.accentColor }}
        >
          {spotlight.cta.label}
        </Link>
      )}
    </div>
  );
}
