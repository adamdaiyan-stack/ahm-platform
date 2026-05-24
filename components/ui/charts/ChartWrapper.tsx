// components/ui/charts/ChartWrapper.tsx
//
// Two exports:
//   1. useChartColors() — hook that resolves CSS vars to hex at runtime,
//      re-reads on data-theme toggle. Import in every Recharts chart component.
//   2. default ChartWrapper — outer shell: fixed-height div, loading state,
//      empty state. Wrap every chart surface with this before rendering.
//
// RULES:
//   - Charts must NOT hardcode hex values — always derive from useChartColors().
//   - ChartWrapper does NOT use ResponsiveContainer — each chart handles its own.
//   - Server-safe: defaults to dark theme values during SSR to avoid hydration mismatch.

'use client';

import { useState, useEffect } from 'react';

// ─── Color contract ───────────────────────────────────────────────────────────

export type ChartColors = {
  textPrimary:   string;
  textSecondary: string;
  bgRaised:      string;
  bgBorder:      string;
  gain:          string;
  loss:          string;
};

/** Dark-theme fallbacks — used during SSR and before first paint. */
const DARK_DEFAULTS: ChartColors = {
  textPrimary:   '#E6EDF3',
  textSecondary: '#8B949E',
  bgRaised:      '#1C2128',
  bgBorder:      '#30363D',
  gain:          '#22c55e',
  loss:          '#ef4444',
};

function readCSSColors(): ChartColors {
  const s = getComputedStyle(document.documentElement);
  const v = (k: string, fallback: string) =>
    s.getPropertyValue(k).trim() || fallback;
  return {
    textPrimary:   v('--text-primary',   DARK_DEFAULTS.textPrimary),
    textSecondary: v('--text-secondary', DARK_DEFAULTS.textSecondary),
    bgRaised:      v('--bg-raised',      DARK_DEFAULTS.bgRaised),
    bgBorder:      v('--bg-border',      DARK_DEFAULTS.bgBorder),
    gain:          v('--gain',           DARK_DEFAULTS.gain),
    loss:          v('--loss',           DARK_DEFAULTS.loss),
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Resolves AHM CSS vars to concrete color strings at runtime.
 * Re-evaluates whenever data-theme changes (light/dark toggle).
 *
 * Call at the top of every Recharts chart component:
 *   const colors = useChartColors();
 */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(DARK_DEFAULTS);

  useEffect(() => {
    // Hydrate immediately with real CSS values
    setColors(readCSSColors());

    // Re-read when theme toggles
    const observer = new MutationObserver(() => setColors(readCSSColors()));
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

// ─── Wrapper component ────────────────────────────────────────────────────────

type ChartWrapperProps = {
  children:        React.ReactNode;
  /** Outer container height in px (default 260). Chart fills this via height="100%". */
  height?:         number;
  /** Show spinner instead of chart while data loads. */
  loading?:        boolean;
  /** Show empty state instead of chart when dataset is empty. */
  empty?:          boolean;
  emptyMessage?:   string;
  emptySubMessage?: string;
  className?:      string;
};

export default function ChartWrapper({
  children,
  height         = 260,
  loading        = false,
  empty          = false,
  emptyMessage   = 'No data available',
  emptySubMessage,
  className      = '',
}: ChartWrapperProps) {

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className={`bg-surface border border-border-theme rounded-xl flex flex-col items-center justify-center gap-2 ${className}`}
        style={{ height }}
      >
        <div className="w-5 h-5 border-2 border-tx-disabled border-t-tx-secondary rounded-full animate-spin" />
        <p className="text-xs text-tx-disabled font-mono">Loading</p>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (empty) {
    return (
      <div
        className={`bg-surface border border-border-theme rounded-xl flex flex-col items-center justify-center gap-1.5 ${className}`}
        style={{ height }}
      >
        <p className="text-sm text-tx-disabled font-mono">{emptyMessage}</p>
        {emptySubMessage && (
          <p className="text-xs text-tx-disabled font-mono opacity-60">{emptySubMessage}</p>
        )}
      </div>
    );
  }

  // ── Chart container — explicit height so ResponsiveContainer height="100%" works ──
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      {children}
    </div>
  );
}
