// lib/scoring/utils.ts
//
// Shared utility functions for the conviction scoring engine.
// All functions are pure -- no side effects, no DB calls.

import type { ScoringInputs, DataConfidenceLevel } from './types';

// ── Normalization helpers ─────────────────────────────────────────────────────

/**
 * Clamp a value to [0, 100].
 */
export function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Normalize a value within a min-max range to a 0-100 score.
 * Higher value = higher score (use invertedMinMaxNormalize for inverse).
 */
export function minMaxNormalize(
  value:   number,
  min:     number,
  max:     number,
): number {
  if (max === min) return 50;
  return clamp(((value - min) / (max - min)) * 100);
}

/**
 * Normalize a value within a min-max range to a 0-100 score.
 * Lower value = higher score (e.g. P/E, D/E).
 */
export function invertedMinMaxNormalize(
  value:   number,
  min:     number,
  max:     number,
): number {
  return 100 - minMaxNormalize(value, min, max);
}

/**
 * Convert a percentile rank (0-100, where 100 = best in sector)
 * to a sub-score contribution.
 * Optionally apply a direction inversion (e.g. lower P/E = better).
 */
export function percentileToScore(
  percentileRank: number | null,
  invert: boolean = false,
): number {
  if (percentileRank === null) return 50; // neutral when no data
  const pct = Math.max(0, Math.min(100, percentileRank));
  return invert ? clamp(100 - pct) : clamp(pct);
}

// ── Confidence penalty helpers ────────────────────────────────────────────────

/**
 * Compute the data confidence multiplier.
 * Applied as a final multiplier after the weighted composite is calculated.
 *
 * Rules (in priority order):
 *   - Data age > 270 days:                              0.65
 *   - Significant fields missing AND age 180-270 days:  0.70
 *   - Multiple fields missing OR age 180-270 days:      0.75
 *   - 1-2 key fields missing AND age < 90 days:         0.85
 *   - All fields present AND age 90-180 days:           0.90
 *   - All fields present AND age < 90 days:             1.00
 */
export function computeDataConfidence(inputs: ScoringInputs): DataConfidenceLevel {
  const age = inputs.metrics_age_days;

  const criticalFields: (keyof ScoringInputs)[] = [
    'pe_ratio', 'pb_ratio', 'roe', 'net_margin',
    'eps_growth', 'debt_to_equity', 'interest_cover',
  ];
  const missingCritical = criticalFields.filter(f => inputs[f] === null).length;

  if (age > 270) {
    return { multiplier: 0.65, reason: 'Data is ' + age + ' days old -- stale beyond 270-day threshold' };
  }
  if (missingCritical >= 3 && age > 180) {
    return { multiplier: 0.70, reason: missingCritical + ' critical fields missing and data age ' + age + ' days' };
  }
  if (missingCritical >= 2 || age > 180) {
    return {
      multiplier: 0.75,
      reason: missingCritical >= 2
        ? missingCritical + ' critical fields missing'
        : 'Data age ' + age + ' days (180-270 day range)',
    };
  }
  if (missingCritical === 1 || (missingCritical === 0 && age > 90)) {
    return {
      multiplier: 0.90,
      reason: missingCritical === 1
        ? '1 critical field missing'
        : 'Data age ' + age + ' days (90-180 day range)',
    };
  }
  return { multiplier: 1.00, reason: 'All critical fields present, data < 90 days old' };
}

// ── Null-safe arithmetic ──────────────────────────────────────────────────────

/**
 * Returns the average of non-null values from an array.
 * Returns null if all values are null.
 */
export function nullSafeAvg(values: (number | null)[]): number | null {
  const defined = values.filter((v): v is number => v !== null);
  if (defined.length === 0) return null;
  return defined.reduce((a, b) => a + b, 0) / defined.length;
}

/**
 * Returns the value or a fallback if null.
 */
export function withDefault(value: number | null, fallback: number): number {
  return value ?? fallback;
}

// ── Composite score calculation ───────────────────────────────────────────────

/**
 * Apply weight set to an object of raw sub-scores (0-100) and
 * compute the weighted sum, then apply the data confidence multiplier.
 *
 * Data confidence multiplier pulls scores toward the neutral midpoint
 * rather than zeroing them out. Example: score 80, confidence 0.75
 * results in 80 * 0.75 + 50 * 0.25 = 72.5.
 */
export function computeWeightedComposite(
  rawScores: Record<string, number>,
  weights:   Record<string, number | string>,
  dataConfidenceMultiplier: number,
): number {
  let weighted = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    if (key === 'phase' || typeof weight !== 'number' || weight === 0) continue;
    const raw = rawScores[key] ?? 50;
    weighted    += raw * weight;
    totalWeight += weight;
  }

  const composite = totalWeight > 0 ? weighted / totalWeight : 50;
  const adjusted  = composite * dataConfidenceMultiplier + 50 * (1 - dataConfidenceMultiplier);
  return clamp(adjusted);
}
