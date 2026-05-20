// supabase/functions/_shared/scoring-engine.ts
//
// Deno-compatible re-export of the pure conviction scoring engine.
// This file adapts lib/scoring/* for the Deno Edge Function runtime.
//
// IMPORTANT: Only imports pure TS modules (no Node.js APIs).
// DB queries are handled separately in each function using Deno.env.get().
//
// USAGE (from Edge Function):
//   import { computeConvictionScore } from '../_shared/scoring-engine.ts';

// ---- Types ------------------------------------------------------------------

export type ConvictionTier =
  | 'HIGH_CONVICTION'
  | 'MODERATE'
  | 'WATCHLIST'
  | 'MONITOR';

export type SubScoreResult = {
  score:      number;
  confidence: number;
  inputs:     Record<string, unknown>;
  notes:      string[];
};

export type ScoringPhase = 'phase_1' | 'phase_2';

export type SubScoreWeights = {
  phase:                    ScoringPhase;
  valuation:                number;
  profitability:            number;
  growth:                   number;
  balance_sheet:            number;
  momentum:                 number;
  macro_sensitivity:        number;
  catalyst:                 number;
  risk:                     number;
  sector_relative_strength: number;
  technical_timing:         number;
};

export type SubScores = {
  valuation:                SubScoreResult;
  profitability:            SubScoreResult;
  growth:                   SubScoreResult;
  balance_sheet:            SubScoreResult;
  momentum:                 SubScoreResult;
  macro_sensitivity:        SubScoreResult;
  catalyst:                 SubScoreResult;
  risk:                     SubScoreResult;
  sector_relative_strength: SubScoreResult;
  technical_timing:         SubScoreResult;
};

export type ScoringInputs = {
  symbol:       string;
  sector:       string;
  sector_slug:  string;

  pe_ratio:         number | null;
  pb_ratio:         number | null;
  ev_ebitda:        number | null;
  fcf_yield:        number | null;
  dividend_yield:   number | null;
  roe:              number | null;
  net_margin:       number | null;
  ebitda_margin:    number | null;
  roce:             number | null;
  eps_growth:       number | null;
  revenue_growth:   number | null;
  pat_growth:       number | null;
  eps_cagr_3y?:     number | null;
  debt_to_equity:   number | null;
  interest_cover:   number | null;
  metrics_period:   string | null;
  metrics_age_days: number;

  catalyst_count_near:   number;
  catalyst_count_medium: number;
  catalyst_count_long:   number;
  risk_count_high:       number;
  risk_count_medium:     number;
  risk_count_low:        number;

  sector_driver_positive: number;
  sector_driver_negative: number;
  sector_driver_neutral:  number;
  sector_driver_watch:    number;

  active_negative_macro_drivers: number;
  active_positive_macro_drivers: number;

  price_trend_30d: 'positive' | 'negative' | 'flat' | null;

  sector_median_pe:           number | null;
  sector_median_pb:           number | null;
  sector_median_roe:          number | null;
  sector_median_net_margin:   number | null;
  sector_median_eps_growth:   number | null;

  price_vs_200dma:  'above' | 'below' | 'at' | null;
  trend_structure:  'uptrend' | 'downtrend' | 'range' | null;
  volume_signal:    'accumulation' | 'distribution' | 'neutral' | null;
};

export type SectorPercentileRanks = {
  pe_rank:          number | null;
  pb_rank:          number | null;
  roe_rank:         number | null;
  net_margin_rank:  number | null;
  eps_growth_rank:  number | null;
  debt_eq_rank:     number | null;
  sector_size:      number;
};

export type DataConfidenceLevel = {
  multiplier: number;
  reason:     string;
};

export type ConvictionScoreResult = {
  symbol:             string;
  score:              number;
  tier:               ConvictionTier;
  sub_scores:         SubScores;
  weights_applied:    SubScoreWeights;
  data_confidence:    number;
  inputs_snapshot:    ScoringInputs;
  score_version:      string;
  scored_at:          Date;
};

// ---- Constants --------------------------------------------------------------

export const SCORING_ENGINE_VERSION = '1.0.0' as const;

export const PHASE_1_WEIGHTS: SubScoreWeights = {
  phase:                    'phase_1',
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

export const TIER_THRESHOLDS: Record<ConvictionTier, { min: number; max: number }> = {
  HIGH_CONVICTION: { min: 75, max: 100 },
  MODERATE:        { min: 55, max: 74  },
  WATCHLIST:       { min: 35, max: 54  },
  MONITOR:         { min: 0,  max: 34  },
};

export function scoreToTier(score: number): ConvictionTier {
  if (score >= 75) return 'HIGH_CONVICTION';
  if (score >= 55) return 'MODERATE';
  if (score >= 35) return 'WATCHLIST';
  return 'MONITOR';
}

// ---- Pure utility functions -------------------------------------------------

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function minMaxNormalize(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return clamp(((value - min) / (max - min)) * 100);
}

function invertedMinMaxNormalize(value: number, min: number, max: number): number {
  return 100 - minMaxNormalize(value, min, max);
}

function percentileToScore(percentileRank: number | null, invert = false): number {
  if (percentileRank === null) return 50;
  const pct = Math.max(0, Math.min(100, percentileRank));
  return invert ? clamp(100 - pct) : clamp(pct);
}

function nullSafeAvg(values: (number | null)[]): number | null {
  const defined = values.filter((v): v is number => v !== null);
  if (defined.length === 0) return null;
  return defined.reduce((a, b) => a + b, 0) / defined.length;
}

function result(score: number, confidence: number, inputs: Record<string, unknown>, notes: string[]): SubScoreResult {
  return { score: clamp(score), confidence, inputs, notes };
}

// ---- Data confidence --------------------------------------------------------

export function computeDataConfidence(inputs: ScoringInputs): DataConfidenceLevel {
  const age = inputs.metrics_age_days;
  const criticalFields: (keyof ScoringInputs)[] = [
    'pe_ratio', 'pb_ratio', 'roe', 'net_margin',
    'eps_growth', 'debt_to_equity', 'interest_cover',
  ];
  const missingCritical = criticalFields.filter(f => inputs[f] === null).length;

  if (age > 270) return { multiplier: 0.65, reason: 'Data is ' + age + ' days old -- stale beyond 270-day threshold' };
  if (missingCritical >= 3 && age > 180) return { multiplier: 0.70, reason: missingCritical + ' critical fields missing and data age ' + age + ' days' };
  if (missingCritical >= 2 || age > 180) return { multiplier: 0.75, reason: missingCritical >= 2 ? missingCritical + ' critical fields missing' : 'Data age ' + age + ' days (180-270 day range)' };
  if (missingCritical === 1 || (missingCritical === 0 && age > 90)) return { multiplier: 0.90, reason: missingCritical === 1 ? '1 critical field missing' : 'Data age ' + age + ' days (90-180 day range)' };
  return { multiplier: 1.00, reason: 'All critical fields present, data < 90 days old' };
}

// ---- Weighted composite -----------------------------------------------------

export function computeWeightedComposite(
  rawScores:               Record<string, number>,
  weights:                 Record<string, number | string>,
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

// ---- Sub-score functions ----------------------------------------------------

function valuationScore(inputs: ScoringInputs, pctRanks: SectorPercentileRanks): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = { pe_ratio: inputs.pe_ratio, pb_ratio: inputs.pb_ratio, ev_ebitda: inputs.ev_ebitda, pe_percentile: pctRanks.pe_rank, pb_percentile: pctRanks.pb_rank };

  let peScore = pctRanks.pe_rank !== null ? percentileToScore(pctRanks.pe_rank)
    : inputs.pe_ratio !== null && inputs.sector_median_pe !== null ? clamp(invertedMinMaxNormalize(inputs.pe_ratio / inputs.sector_median_pe, 0.3, 2.0))
    : inputs.pe_ratio !== null ? clamp(invertedMinMaxNormalize(inputs.pe_ratio, 5, 25)) : 50;
  notes.push('PE score: ' + peScore);

  let pbScore = pctRanks.pb_rank !== null ? percentileToScore(pctRanks.pb_rank)
    : inputs.pb_ratio !== null && inputs.sector_median_pb !== null ? clamp(invertedMinMaxNormalize(inputs.pb_ratio / inputs.sector_median_pb, 0.2, 3.0))
    : inputs.pb_ratio !== null ? clamp(invertedMinMaxNormalize(inputs.pb_ratio, 0.5, 5.0)) : 50;
  notes.push('PB score: ' + pbScore);

  const evScore = inputs.ev_ebitda !== null ? clamp(invertedMinMaxNormalize(inputs.ev_ebitda, 3, 18)) : 50;
  const composite = peScore * 0.45 + pbScore * 0.30 + evScore * 0.25;
  const missing = [inputs.pe_ratio, inputs.pb_ratio].filter(v => v === null).length;
  return result(composite, missing === 0 ? 0.95 : missing === 1 ? 0.65 : 0.40, src, notes);
}

function profitabilityScore(inputs: ScoringInputs, pctRanks: SectorPercentileRanks): SubScoreResult {
  const src: Record<string, unknown> = { roe: inputs.roe, net_margin: inputs.net_margin, roce: inputs.roce };
  const roeScore = pctRanks.roe_rank !== null ? percentileToScore(pctRanks.roe_rank) : inputs.roe !== null ? clamp(minMaxNormalize(inputs.roe, -10, 40)) : 50;
  const marginScore = pctRanks.net_margin_rank !== null ? percentileToScore(pctRanks.net_margin_rank) : inputs.net_margin !== null ? clamp(minMaxNormalize(inputs.net_margin, -5, 30)) : 50;
  const roceScore = inputs.roce !== null ? clamp(minMaxNormalize(inputs.roce, 5, 35)) : inputs.ebitda_margin !== null ? clamp(minMaxNormalize(inputs.ebitda_margin, 5, 40)) : 50;
  const composite = roeScore * 0.40 + marginScore * 0.35 + roceScore * 0.25;
  const defined = [inputs.roe, inputs.net_margin].filter(v => v !== null).length;
  return result(composite, defined / 2, src, ['ROE:' + roeScore + ' margin:' + marginScore + ' roce:' + roceScore]);
}

function growthScore(inputs: ScoringInputs): SubScoreResult {
  const src: Record<string, unknown> = { eps_growth: inputs.eps_growth, revenue_growth: inputs.revenue_growth, pat_growth: inputs.pat_growth };
  const epsScore = inputs.eps_growth !== null ? clamp(minMaxNormalize(inputs.eps_growth, -30, 60)) : 50;
  const revScore = inputs.revenue_growth !== null ? clamp(minMaxNormalize(inputs.revenue_growth, -20, 40)) : 50;
  const patScore = inputs.pat_growth !== null ? clamp(minMaxNormalize(inputs.pat_growth, -30, 60)) : 50;
  const cagr3    = inputs.eps_cagr_3y ?? null;
  const cagrScore = cagr3 !== null ? clamp(minMaxNormalize(cagr3, -15, 40)) : epsScore;
  let composite = epsScore * 0.40 + revScore * 0.25 + patScore * 0.25 + cagrScore * 0.10;
  const notes: string[] = [];
  if (inputs.pat_growth !== null && inputs.pat_growth < 0 && composite > 35) {
    composite = 35;
    notes.push('Hard floor: negative PAT growth, capped at 35');
  }
  const defined = [inputs.eps_growth, inputs.pat_growth, inputs.revenue_growth].filter(v => v !== null).length;
  return result(composite, defined / 3, src, notes);
}

function balanceSheetScore(inputs: ScoringInputs, pctRanks: SectorPercentileRanks): SubScoreResult {
  const src: Record<string, unknown> = { debt_to_equity: inputs.debt_to_equity, interest_cover: inputs.interest_cover };
  if (inputs.interest_cover !== null && inputs.interest_cover < 1.5) {
    return result(Math.min(40, clamp(minMaxNormalize(inputs.interest_cover, 0, 1.5))), 0.9, src, ['Hard floor: interest_cover ' + inputs.interest_cover + 'x < 1.5x']);
  }
  const deScore = pctRanks.debt_eq_rank !== null ? percentileToScore(pctRanks.debt_eq_rank) : inputs.debt_to_equity !== null ? clamp(invertedMinMaxNormalize(inputs.debt_to_equity, 0, 3.0)) : 50;
  const icScore = inputs.interest_cover !== null ? clamp(minMaxNormalize(inputs.interest_cover, 1.5, 10)) : 50;
  const defined = [inputs.debt_to_equity, inputs.interest_cover].filter(v => v !== null).length;
  return result(deScore * 0.55 + icScore * 0.45, defined / 2, src, ['D/E:' + deScore + ' IC:' + icScore]);
}

function momentumScore(inputs: ScoringInputs): SubScoreResult {
  const src: Record<string, unknown> = { price_trend_30d: inputs.price_trend_30d, sector_driver_positive: inputs.sector_driver_positive };
  const total = inputs.sector_driver_positive + inputs.sector_driver_negative + inputs.sector_driver_neutral + inputs.sector_driver_watch;
  const driverScore = total === 0 ? 50 : clamp(50 + ((inputs.sector_driver_positive * 1.0 + inputs.sector_driver_neutral * 0 + inputs.sector_driver_watch * -0.25 + inputs.sector_driver_negative * -1.0) / total) * 50);
  const trendScore = inputs.price_trend_30d === 'positive' ? 70 : inputs.price_trend_30d === 'negative' ? 30 : 50;
  return result(driverScore * 0.70 + trendScore * 0.30, 0.8, src, ['driver:' + driverScore + ' trend:' + trendScore]);
}

function macroSensitivityScore(inputs: ScoringInputs): SubScoreResult {
  const src: Record<string, unknown> = { active_negative_macro_drivers: inputs.active_negative_macro_drivers, active_positive_macro_drivers: inputs.active_positive_macro_drivers };
  if (inputs.active_negative_macro_drivers > 3) {
    const rawScore = clamp(50 - (inputs.active_negative_macro_drivers - 3) * 10 + inputs.active_positive_macro_drivers * 5);
    return result(Math.min(45, rawScore), 0.9, src, ['Hard cap: ' + inputs.active_negative_macro_drivers + ' negative macro drivers']);
  }
  const score = 70 - inputs.active_negative_macro_drivers * 12 + Math.min(inputs.active_positive_macro_drivers * 8, 24);
  return result(score, 0.9, src, ['macro score: ' + clamp(score)]);
}

function catalystScore(inputs: ScoringInputs): SubScoreResult {
  const src: Record<string, unknown> = { catalyst_count_near: inputs.catalyst_count_near, catalyst_count_medium: inputs.catalyst_count_medium, catalyst_count_long: inputs.catalyst_count_long };
  const weighted = inputs.catalyst_count_near * 3.0 + inputs.catalyst_count_medium * 1.5 + inputs.catalyst_count_long * 0.5;
  const capped   = Math.min(weighted, 5);
  return result(40 + (capped / 5) * 50, 1.0, src, ['weighted units: ' + weighted.toFixed(1)]);
}

function riskScore(inputs: ScoringInputs): SubScoreResult {
  const src: Record<string, unknown> = { risk_count_high: inputs.risk_count_high, risk_count_medium: inputs.risk_count_medium, risk_count_low: inputs.risk_count_low };
  if (inputs.risk_count_high >= 2) {
    return result(Math.max(10, 25 - (inputs.risk_count_high - 2) * 5), 1.0, src, ['Hard floor: ' + inputs.risk_count_high + ' high-severity risks']);
  }
  const score = 85 - (inputs.risk_count_high === 1 ? 25 : 0) - Math.min(inputs.risk_count_medium, 3) * 8 - Math.min(inputs.risk_count_low, 5) * 2;
  return result(score, 1.0, src, ['risk score: ' + clamp(score)]);
}

function sectorRelativeStrengthScore(inputs: ScoringInputs, pctRanks: SectorPercentileRanks): SubScoreResult {
  const src: Record<string, unknown> = { sector_size: pctRanks.sector_size };
  const rankScores: number[] = [];
  if (pctRanks.roe_rank !== null)        rankScores.push(percentileToScore(pctRanks.roe_rank));
  if (pctRanks.net_margin_rank !== null) rankScores.push(percentileToScore(pctRanks.net_margin_rank));
  if (pctRanks.eps_growth_rank !== null) rankScores.push(percentileToScore(pctRanks.eps_growth_rank));
  if (pctRanks.pe_rank !== null)         rankScores.push(percentileToScore(pctRanks.pe_rank));
  if (pctRanks.pb_rank !== null)         rankScores.push(percentileToScore(pctRanks.pb_rank));
  if (pctRanks.debt_eq_rank !== null)    rankScores.push(percentileToScore(pctRanks.debt_eq_rank));
  const score = rankScores.length > 0 ? rankScores.reduce((a, b) => a + b, 0) / rankScores.length : 50;
  const confidence = pctRanks.sector_size >= 5 ? 0.9 : pctRanks.sector_size >= 3 ? 0.6 : pctRanks.sector_size >= 1 ? 0.4 : 0.0;
  return result(score, confidence, src, ['sector_size: ' + pctRanks.sector_size + ' signals: ' + rankScores.length]);
}

function technicalTimingScore(inputs: ScoringInputs): SubScoreResult {
  return result(50, 0.0, { price_vs_200dma: inputs.price_vs_200dma, phase: 'phase_1' }, ['Phase 1: neutral 50']);
}

// ---- Main entry point -------------------------------------------------------

export function computeConvictionScore(
  inputs:   ScoringInputs,
  pctRanks: SectorPercentileRanks,
): ConvictionScoreResult {
  const subScores: SubScores = {
    valuation:                valuationScore(inputs, pctRanks),
    profitability:            profitabilityScore(inputs, pctRanks),
    growth:                   growthScore(inputs),
    balance_sheet:            balanceSheetScore(inputs, pctRanks),
    momentum:                 momentumScore(inputs),
    macro_sensitivity:        macroSensitivityScore(inputs),
    catalyst:                 catalystScore(inputs),
    risk:                     riskScore(inputs),
    sector_relative_strength: sectorRelativeStrengthScore(inputs, pctRanks),
    technical_timing:         technicalTimingScore(inputs),
  };

  const { multiplier: dataConfidence } = computeDataConfidence(inputs);

  const rawScores: Record<string, number> = {
    valuation:                subScores.valuation.score,
    profitability:            subScores.profitability.score,
    growth:                   subScores.growth.score,
    balance_sheet:            subScores.balance_sheet.score,
    momentum:                 subScores.momentum.score,
    macro_sensitivity:        subScores.macro_sensitivity.score,
    catalyst:                 subScores.catalyst.score,
    risk:                     subScores.risk.score,
    sector_relative_strength: subScores.sector_relative_strength.score,
    technical_timing:         subScores.technical_timing.score,
  };

  const score = computeWeightedComposite(rawScores, PHASE_1_WEIGHTS, dataConfidence);
  const tier  = scoreToTier(score);

  return {
    symbol:          inputs.symbol,
    score,
    tier,
    sub_scores:      subScores,
    weights_applied: PHASE_1_WEIGHTS,
    data_confidence: dataConfidence,
    inputs_snapshot: inputs,
    score_version:   SCORING_ENGINE_VERSION,
    scored_at:       new Date(),
  };
}
