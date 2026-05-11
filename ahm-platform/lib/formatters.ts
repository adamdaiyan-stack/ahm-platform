// lib/formatters.ts
//
// WHY THIS FILE EXISTS:
// Formatting logic (turning 4200000 into "4.2M") is pure utility code —
// no React, no UI, no database. Keeping it in lib/ means:
//   1. It can be used in any component or page without importing React
//   2. It's easy to unit test in isolation
//   3. Components stay focused on layout, not number crunching
//
// All functions return a string ready to drop into JSX.

/**
 * Formats a PKR price to 2 decimal places.
 * e.g. 48.5 → "48.50"   |   null → "—"
 */
export function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return value.toFixed(2);
}

/**
 * Formats a percentage change with a + or - sign.
 * e.g. 2.64 → "+2.64%"  |  -1.3 → "-1.30%"  |  null → "—"
 */
export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Formats a raw change value with a + or - sign.
 * e.g. 1.25 → "+1.25"   |  -0.80 → "-0.80"  |  null → "—"
 */
export function formatChange(value: number | null): string {
  if (value === null || value === undefined) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

/**
 * Abbreviates large volume numbers into readable form.
 * e.g. 4200000 → "4.2M"  |  850000 → "850K"  |  null → "—"
 */
export function formatVolume(value: number | null): string {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

/**
 * Formats a market cap into billions/millions shorthand.
 * e.g. 85000000000 → "85.0B"  |  null → "—"
 */
export function formatMarketCap(value: number | null): string {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000_000) return `PKR ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(0)}M`;
  return `PKR ${value.toLocaleString()}`;
}
