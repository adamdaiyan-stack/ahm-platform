// lib/scoring/sub-scores.ts
//
// All 11 sub-score functions for the Conviction Scoring Engine.
//
// ARCHITECTURE
//   Each function is PURE -- no DB calls, no side effects.
//   Inputs come from ScoringInputs (pre-assembled from DB by buildScoringInputs).
//   Each function returns a SubScoreResult with:
//     - score:      0-100 (before weighting)
//     - confidence: 0-1  (data availability for this sub-score)
//     - inputs:     source values used (stored in inputs_snapshot)
//     - notes:      audit trail explaining the score
//
// SECTOR ADJUSTMENTS
//   Sub-scores that use valuation or profitability metrics accept
//   SectorPercentileRanks for sector-relative normalization.
//   This prevents cross-sector apples-to-oranges comparisons.

import {
  clamp,
  invertedMinMaxNormalize,
  minMaxNormalize,
  percentileToScore,
  nullSafeAvg,
  withDefault,
} from './utils';

import type {
  ScoringInputs,
  SectorPercentileRanks,
  SubScoreResult,
} from './types';

// ---- Helper: build a SubScoreResult ----------------------------------------

function result(
  score:      number,
  confidence: number,
  inputs:     Record<string, unknown>,
  notes:      string[],
): SubScoreResult {
  return { score: clamp(score), confidence, inputs, notes };
}

// ---- 1. Valuation Score -----------------------------------------------------
// Lower valuation relative to sector peers = higher score.
// Blends three signals: P/E vs sector peer percentile (45%),
// P/B vs sector peer percentile (30%), EV/EBITDA absolute (25%).
// Confidence penalty if pe_ratio or pb_ratio is null.

export function valuationScore(
  inputs:   ScoringInputs,
  pctRanks: SectorPercentileRanks,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    pe_ratio:         inputs.pe_ratio,
    pb_ratio:         inputs.pb_ratio,
    ev_ebitda:        inputs.ev_ebitda,
    sector_median_pe: inputs.sector_median_pe,
    sector_median_pb: inputs.sector_median_pb,
    pe_percentile:    pctRanks.pe_rank,
    pb_percentile:    pctRanks.pb_rank,
  };

  // P/E component (inverted: lower P/E = better, higher score)
  let peScore: number;
  if (pctRanks.pe_rank !== null) {
    // Sector percentile already accounts for direction: pe_rank 100 = cheapest in sector
    peScore = percentileToScore(pctRanks.pe_rank);
    notes.push(`P/E sector percentile ${pctRanks.pe_rank.toFixed(0)} -> score ${peScore.toFixed(0)}`);
  } else if (inputs.pe_ratio !== null && inputs.sector_median_pe !== null) {
    // Fallback: ratio vs sector median
    const relPE = inputs.pe_ratio / inputs.sector_median_pe;
    // relPE < 1 = cheaper than median; map 0.3-2.0 range
    peScore = clamp(invertedMinMaxNormalize(relPE, 0.3, 2.0));
    notes.push(`P/E ${inputs.pe_ratio.toFixed(1)}x vs sector median ${inputs.sector_median_pe.toFixed(1)}x -> score ${peScore.toFixed(0)}`);
  } else if (inputs.pe_ratio !== null) {
    // Absolute fallback: PSX market typically 6-18x
    peScore = clamp(invertedMinMaxNormalize(inputs.pe_ratio, 5, 25));
    notes.push(`P/E ${inputs.pe_ratio.toFixed(1)}x absolute (no sector median) -> score ${peScore.toFixed(0)}`);
  } else {
    peScore = 50;
    notes.push('P/E: no data, neutral 50');
  }

  // P/B component (inverted: lower P/B = better)
  let pbScore: number;
  if (pctRanks.pb_rank !== null) {
    pbScore = percentileToScore(pctRanks.pb_rank);
    notes.push(`P/B sector percentile ${pctRanks.pb_rank.toFixed(0)} -> score ${pbScore.toFixed(0)}`);
  } else if (inputs.pb_ratio !== null && inputs.sector_median_pb !== null) {
    const relPB = inputs.pb_ratio / inputs.sector_median_pb;
    pbScore = clamp(invertedMinMaxNormalize(relPB, 0.2, 3.0));
    notes.push(`P/B ${inputs.pb_ratio.toFixed(1)}x vs sector median ${inputs.sector_median_pb.toFixed(1)}x -> score ${pbScore.toFixed(0)}`);
  } else if (inputs.pb_ratio !== null) {
    pbScore = clamp(invertedMinMaxNormalize(inputs.pb_ratio, 0.5, 5.0));
    notes.push(`P/B ${inputs.pb_ratio.toFixed(1)}x absolute -> score ${pbScore.toFixed(0)}`);
  } else {
    pbScore = 50;
    notes.push('P/B: no data, neutral 50');
  }

  // EV/EBITDA component (absolute; lower = better; typical PSX range 4-15x)
  let evScore: number;
  if (inputs.ev_ebitda !== null) {
    evScore = clamp(invertedMinMaxNormalize(inputs.ev_ebitda, 3, 18));
    notes.push(`EV/EBITDA ${inputs.ev_ebitda.toFixed(1)}x -> score ${evScore.toFixed(0)}`);
  } else {
    evScore = 50;
    notes.push('EV/EBITDA: no data, neutral 50');
  }

  const composite = peScore * 0.45 + pbScore * 0.30 + evScore * 0.25;

  const missingKeyFields = [inputs.pe_ratio, inputs.pb_ratio].filter(v => v === null).length;
  const confidence = missingKeyFields === 0 ? 0.95 : missingKeyFields === 1 ? 0.65 : 0.40;

  if (missingKeyFields > 0) {
    notes.push(`Confidence reduced: ${missingKeyFields} key valuation field(s) missing`);
  }

  return result(composite, confidence, src, notes);
}

// ---- 2. Profitability Score --------------------------------------------------
// Higher ROE, net margin, ROCE relative to sector peers = higher score.
// Blends: ROE percentile (40%), net margin percentile (35%), ROCE absolute (25%).

export function profitabilityScore(
  inputs:   ScoringInputs,
  pctRanks: SectorPercentileRanks,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    roe:               inputs.roe,
    net_margin:        inputs.net_margin,
    ebitda_margin:     inputs.ebitda_margin,
    roce:              inputs.roce,
    sector_median_roe: inputs.sector_median_roe,
    roe_percentile:    pctRanks.roe_rank,
    margin_percentile: pctRanks.net_margin_rank,
  };

  // ROE component
  let roeScore: number;
  if (pctRanks.roe_rank !== null) {
    roeScore = percentileToScore(pctRanks.roe_rank);
    notes.push(`ROE sector percentile ${pctRanks.roe_rank.toFixed(0)} -> score ${roeScore.toFixed(0)}`);
  } else if (inputs.roe !== null) {
    // Absolute: PSX typical range -10% to 40%
    roeScore = clamp(minMaxNormalize(inputs.roe, -10, 40));
    notes.push(`ROE ${inputs.roe.toFixed(1)}% absolute -> score ${roeScore.toFixed(0)}`);
  } else {
    roeScore = 50;
    notes.push('ROE: no data, neutral 50');
  }

  // Net margin component
  let marginScore: number;
  if (pctRanks.net_margin_rank !== null) {
    marginScore = percentileToScore(pctRanks.net_margin_rank);
    notes.push(`Net margin sector percentile ${pctRanks.net_margin_rank.toFixed(0)} -> score ${marginScore.toFixed(0)}`);
  } else if (inputs.net_margin !== null) {
    // Absolute: PSX typical range -5% to 30%
    marginScore = clamp(minMaxNormalize(inputs.net_margin, -5, 30));
    notes.push(`Net margin ${inputs.net_margin.toFixed(1)}% absolute -> score ${marginScore.toFixed(0)}`);
  } else {
    marginScore = 50;
    notes.push('Net margin: no data, neutral 50');
  }

  // ROCE component (absolute; higher is better; PSX typical 5-35%)
  let roceScore: number;
  if (inputs.roce !== null) {
    roceScore = clamp(minMaxNormalize(inputs.roce, 5, 35));
    notes.push(`ROCE ${inputs.roce.toFixed(1)}% -> score ${roceScore.toFixed(0)}`);
  } else if (inputs.ebitda_margin !== null) {
    // Substitute EBITDA margin if ROCE absent
    roceScore = clamp(minMaxNormalize(inputs.ebitda_margin, 5, 40));
    notes.push(`EBITDA margin ${inputs.ebitda_margin.toFixed(1)}% substituted for ROCE -> score ${roceScore.toFixed(0)}`);
  } else {
    roceScore = 50;
    notes.push('ROCE/EBITDA margin: no data, neutral 50');
  }

  const composite = roeScore * 0.40 + marginScore * 0.35 + roceScore * 0.25;

  const defined = [inputs.roe, inputs.net_margin].filter(v => v !== null).length;
  const confidence = defined / 2;

  return result(composite, confidence, src, notes);
}

// ---- 3. Growth Score --------------------------------------------------------
// EPS growth, revenue growth, PAT growth -- rewards acceleration and consistency.
// Hard floor: score cannot exceed 35 if PAT growth is negative.

export function growthScore(
  inputs: ScoringInputs,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    eps_growth:     inputs.eps_growth,
    revenue_growth: inputs.revenue_growth,
    pat_growth:     inputs.pat_growth,
    eps_cagr_3y:    inputs.eps_cagr_3y ?? null,
  };

  // EPS growth (primary signal: 40%)
  // Range: -30% to +60%; PSX high-growth co's often 20-50% in good years
  let epsScore: number;
  if (inputs.eps_growth !== null) {
    epsScore = clamp(minMaxNormalize(inputs.eps_growth, -30, 60));
    notes.push(`EPS growth ${inputs.eps_growth.toFixed(1)}% -> score ${epsScore.toFixed(0)}`);
  } else {
    epsScore = 50;
    notes.push('EPS growth: no data, neutral 50');
  }

  // Revenue growth (25%)
  let revScore: number;
  if (inputs.revenue_growth !== null) {
    revScore = clamp(minMaxNormalize(inputs.revenue_growth, -20, 40));
    notes.push(`Revenue growth ${inputs.revenue_growth.toFixed(1)}% -> score ${revScore.toFixed(0)}`);
  } else {
    revScore = 50;
    notes.push('Revenue growth: no data, neutral 50');
  }

  // PAT growth (25%)
  let patScore: number;
  if (inputs.pat_growth !== null) {
    patScore = clamp(minMaxNormalize(inputs.pat_growth, -30, 60));
    notes.push(`PAT growth ${inputs.pat_growth.toFixed(1)}% -> score ${patScore.toFixed(0)}`);
  } else {
    patScore = 50;
    notes.push('PAT growth: no data, neutral 50');
  }

  // 3-year EPS CAGR (10%) -- rewards sustained compounding
  let cagr3Score: number;
  const cagr3 = inputs.eps_cagr_3y ?? null;
  if (cagr3 !== null) {
    cagr3Score = clamp(minMaxNormalize(cagr3, -15, 40));
    notes.push(`3Y EPS CAGR ${cagr3.toFixed(1)}% -> score ${cagr3Score.toFixed(0)}`);
  } else {
    cagr3Score = epsScore; // mirror current EPS growth if CAGR absent
    notes.push('3Y EPS CAGR: no data, mirroring EPS growth score');
  }

  let composite = epsScore * 0.40 + revScore * 0.25 + patScore * 0.25 + cagr3Score * 0.10;

  // Hard floor: negative PAT growth caps score at 35
  if (inputs.pat_growth !== null && inputs.pat_growth < 0 && composite > 35) {
    composite = 35;
    notes.push(`Hard floor applied: PAT growth ${inputs.pat_growth.toFixed(1)}% is negative, capping score at 35`);
  }

  const defined = [inputs.eps_growth, inputs.pat_growth, inputs.revenue_growth].filter(v => v !== null).length;
  const confidence = defined / 3;

  return result(composite, confidence, src, notes);
}

// ---- 4. Balance Sheet Score -------------------------------------------------
// Lower leverage + higher interest cover = higher score.
// Hard floor: interest_cover < 1.5x caps score at 40.

export function balanceSheetScore(
  inputs:   ScoringInputs,
  pctRanks: SectorPercentileRanks,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    debt_to_equity: inputs.debt_to_equity,
    interest_cover: inputs.interest_cover,
    de_percentile:  pctRanks.debt_eq_rank,
  };

  // Hard floor: interest_cover < 1.5x
  if (inputs.interest_cover !== null && inputs.interest_cover < 1.5) {
    notes.push(`Hard floor: interest_cover ${inputs.interest_cover.toFixed(2)}x is below 1.5x threshold`);
    const icScore = clamp(minMaxNormalize(inputs.interest_cover, 0, 1.5));
    return result(Math.min(40, icScore), 0.9, src, notes);
  }

  // Debt-to-equity component (inverted: lower D/E = better)
  let deScore: number;
  if (pctRanks.debt_eq_rank !== null) {
    deScore = percentileToScore(pctRanks.debt_eq_rank);
    notes.push(`D/E sector percentile ${pctRanks.debt_eq_rank.toFixed(0)} -> score ${deScore.toFixed(0)}`);
  } else if (inputs.debt_to_equity !== null) {
    // PSX typical 0-3x; above 3x is highly leveraged
    deScore = clamp(invertedMinMaxNormalize(inputs.debt_to_equity, 0, 3.0));
    notes.push(`D/E ${inputs.debt_to_equity.toFixed(2)}x absolute -> score ${deScore.toFixed(0)}`);
  } else {
    deScore = 50;
    notes.push('D/E: no data, neutral 50');
  }

  // Interest cover component (higher = better; floor enforced above)
  let icScore: number;
  if (inputs.interest_cover !== null) {
    // Map 1.5x (minimum safe) to 10x+ (very strong) -> 0-100
    icScore = clamp(minMaxNormalize(inputs.interest_cover, 1.5, 10));
    notes.push(`Interest cover ${inputs.interest_cover.toFixed(2)}x -> score ${icScore.toFixed(0)}`);
  } else {
    icScore = 50;
    notes.push('Interest cover: no data, neutral 50');
  }

  const composite = deScore * 0.55 + icScore * 0.45;

  const defined = [inputs.debt_to_equity, inputs.interest_cover].filter(v => v !== null).length;
  const confidence = defined / 2;

  return result(composite, confidence, src, notes);
}

// ---- 5. Momentum Score ------------------------------------------------------
// Sector driver trend distribution + 30-day price trend direction.
// Intentionally lowest-weighted active sub-score to avoid chasing momentum.

export function momentumScore(
  inputs: ScoringInputs,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    sector_driver_positive: inputs.sector_driver_positive,
    sector_driver_negative: inputs.sector_driver_negative,
    sector_driver_neutral:  inputs.sector_driver_neutral,
    sector_driver_watch:    inputs.sector_driver_watch,
    price_trend_30d:        inputs.price_trend_30d,
  };

  // Sector driver sentiment score (70% weight)
  const totalDrivers = inputs.sector_driver_positive
    + inputs.sector_driver_negative
    + inputs.sector_driver_neutral
    + inputs.sector_driver_watch;

  let driverScore: number;
  if (totalDrivers === 0) {
    driverScore = 50;
    notes.push('No sector drivers recorded, neutral 50');
  } else {
    // Net sentiment = (positive - negative) / total, mapped -1 to +1 -> 0 to 100
    // Watch counts as -0.25 (slight negative signal)
    const netSentiment = (
      inputs.sector_driver_positive * 1.0
      + inputs.sector_driver_neutral * 0.0
      + inputs.sector_driver_watch * (-0.25)
      + inputs.sector_driver_negative * (-1.0)
    ) / totalDrivers;
    driverScore = clamp(50 + netSentiment * 50);
    notes.push(
      `Sector drivers: +${inputs.sector_driver_positive} =${inputs.sector_driver_neutral} `
      + `~${inputs.sector_driver_watch} -${inputs.sector_driver_negative} `
      + `-> net sentiment ${netSentiment.toFixed(2)}, score ${driverScore.toFixed(0)}`
    );
  }

  // 30-day price trend (30% weight)
  let trendScore: number;
  switch (inputs.price_trend_30d) {
    case 'positive': trendScore = 70; notes.push('30d price trend: positive (70)'); break;
    case 'negative': trendScore = 30; notes.push('30d price trend: negative (30)'); break;
    case 'flat':     trendScore = 50; notes.push('30d price trend: flat (50)');     break;
    default:         trendScore = 50; notes.push('30d price trend: no data (50)');  break;
  }

  const composite = driverScore * 0.70 + trendScore * 0.30;

  return result(composite, 0.8, src, notes);
}

// ---- 6. Macro Sensitivity Score ---------------------------------------------
// Higher score = LESS sensitive to adverse macro conditions (better positioned).
// Override: > 3 negative macro drivers active caps at 45.

export function macroSensitivityScore(
  inputs: ScoringInputs,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    active_negative_macro_drivers: inputs.active_negative_macro_drivers,
    active_positive_macro_drivers: inputs.active_positive_macro_drivers,
  };

  // Hard cap: > 3 negative macro drivers active
  if (inputs.active_negative_macro_drivers > 3) {
    notes.push(
      `Hard cap: ${inputs.active_negative_macro_drivers} negative macro drivers active (>3 threshold)`
    );
    // Still compute, but apply cap
    const rawScore = clamp(50
      - (inputs.active_negative_macro_drivers - 3) * 10
      + inputs.active_positive_macro_drivers * 5
    );
    return result(Math.min(45, rawScore), 0.9, src, notes);
  }

  // Base score 70 (neutral-positive -- most sectors have moderate macro resilience)
  let score = 70;

  // Each negative driver reduces score by 12 points
  score -= inputs.active_negative_macro_drivers * 12;
  if (inputs.active_negative_macro_drivers > 0) {
    notes.push(`${inputs.active_negative_macro_drivers} negative macro driver(s): -${inputs.active_negative_macro_drivers * 12} points`);
  }

  // Each positive driver adds 8 points (capped at +24 to avoid inflation)
  const positiveBonus = Math.min(inputs.active_positive_macro_drivers * 8, 24);
  score += positiveBonus;
  if (inputs.active_positive_macro_drivers > 0) {
    notes.push(`${inputs.active_positive_macro_drivers} positive macro driver(s): +${positiveBonus} points`);
  }

  notes.push(`Final macro sensitivity score: ${clamp(score)}`);

  return result(score, 0.9, src, notes);
}

// ---- 7. Catalyst Score ------------------------------------------------------
// Near-horizon catalysts weighted 3x, medium 1.5x, long 0.5x.
// Ceiling at 5 weighted catalyst units (diminishing returns beyond).
// Base score is 40; each weighted catalyst unit adds ~12 points.

export function catalystScore(
  inputs: ScoringInputs,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    catalyst_count_near:   inputs.catalyst_count_near,
    catalyst_count_medium: inputs.catalyst_count_medium,
    catalyst_count_long:   inputs.catalyst_count_long,
  };

  const weightedUnits =
    inputs.catalyst_count_near   * 3.0
    + inputs.catalyst_count_medium * 1.5
    + inputs.catalyst_count_long   * 0.5;

  notes.push(
    `Catalyst counts: near=${inputs.catalyst_count_near} `
    + `medium=${inputs.catalyst_count_medium} `
    + `long=${inputs.catalyst_count_long} `
    + `-> weighted units=${weightedUnits.toFixed(1)}`
  );

  // Map 0-5 weighted units to 40-90 score (cap beyond 5 units)
  const cappedUnits = Math.min(weightedUnits, 5);
  const score = 40 + (cappedUnits / 5) * 50;

  if (weightedUnits > 5) {
    notes.push(`Weighted units capped at 5 (diminishing returns beyond)`);
  }

  notes.push(`Catalyst score: ${clamp(score).toFixed(0)}`);

  return result(score, 1.0, src, notes);
}

// ---- 8. Risk Score (inverted) -----------------------------------------------
// High penalty for high-severity risks. Inverted: lower risk exposure = higher score.
// Hard floor: 2+ high-severity risks caps score at 25.

export function riskScore(
  inputs: ScoringInputs,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    risk_count_high:   inputs.risk_count_high,
    risk_count_medium: inputs.risk_count_medium,
    risk_count_low:    inputs.risk_count_low,
  };

  // Hard floor: 2+ high severity risks
  if (inputs.risk_count_high >= 2) {
    notes.push(`Hard floor: ${inputs.risk_count_high} high-severity risks (>=2 threshold)`);
    // Small variation within floor range based on additional risks
    const floorScore = Math.max(10, 25 - (inputs.risk_count_high - 2) * 5);
    return result(floorScore, 1.0, src, notes);
  }

  // Penalty model: start from 85 (clean company) and subtract
  //   High risk:   -25 points
  //   Medium risk: -8 points each (cap at 3 medium risks for scoring)
  //   Low risk:    -2 points each (cap at 5 low risks for scoring)
  let score = 85;

  if (inputs.risk_count_high === 1) {
    score -= 25;
    notes.push('1 high-severity risk: -25 points');
  }

  const mediumPenalty = Math.min(inputs.risk_count_medium, 3) * 8;
  score -= mediumPenalty;
  if (inputs.risk_count_medium > 0) {
    notes.push(`${inputs.risk_count_medium} medium-severity risk(s): -${mediumPenalty} points`);
  }

  const lowPenalty = Math.min(inputs.risk_count_low, 5) * 2;
  score -= lowPenalty;
  if (inputs.risk_count_low > 0) {
    notes.push(`${inputs.risk_count_low} low-severity risk(s): -${lowPenalty} points`);
  }

  notes.push(`Risk score: ${clamp(score)}`);

  return result(score, 1.0, src, notes);
}

// ---- 9. Sector Relative Strength Score --------------------------------------
// Ranks company within sector on 5 key percentile ranks.
// Average of available ranks. Low sector_size reduces confidence.

export function sectorRelativeStrengthScore(
  inputs:   ScoringInputs,
  pctRanks: SectorPercentileRanks,
): SubScoreResult {
  const notes: string[] = [];
  const src: Record<string, unknown> = {
    sector_size:     pctRanks.sector_size,
    roe_rank:        pctRanks.roe_rank,
    margin_rank:     pctRanks.net_margin_rank,
    eps_growth_rank: pctRanks.eps_growth_rank,
    pe_rank:         pctRanks.pe_rank,
    pb_rank:         pctRanks.pb_rank,
    de_rank:         pctRanks.debt_eq_rank,
  };

  // Collect available rank scores
  const rankScores: number[] = [];

  if (pctRanks.roe_rank !== null) {
    rankScores.push(percentileToScore(pctRanks.roe_rank));
    notes.push(`ROE rank ${pctRanks.roe_rank.toFixed(0)} -> ${percentileToScore(pctRanks.roe_rank)}`);
  }
  if (pctRanks.net_margin_rank !== null) {
    rankScores.push(percentileToScore(pctRanks.net_margin_rank));
    notes.push(`Margin rank ${pctRanks.net_margin_rank.toFixed(0)} -> ${percentileToScore(pctRanks.net_margin_rank)}`);
  }
  if (pctRanks.eps_growth_rank !== null) {
    rankScores.push(percentileToScore(pctRanks.eps_growth_rank));
    notes.push(`EPS growth rank ${pctRanks.eps_growth_rank.toFixed(0)} -> ${percentileToScore(pctRanks.eps_growth_rank)}`);
  }
  if (pctRanks.pe_rank !== null) {
    // pe_rank already inverted (100 = cheapest)
    rankScores.push(percentileToScore(pctRanks.pe_rank));
    notes.push(`P/E rank ${pctRanks.pe_rank.toFixed(0)} -> ${percentileToScore(pctRanks.pe_rank)}`);
  }
  if (pctRanks.pb_rank !== null) {
    rankScores.push(percentileToScore(pctRanks.pb_rank));
    notes.push(`P/B rank ${pctRanks.pb_rank.toFixed(0)} -> ${percentileToScore(pctRanks.pb_rank)}`);
  }
  if (pctRanks.debt_eq_rank !== null) {
    rankScores.push(percentileToScore(pctRanks.debt_eq_rank));
    notes.push(`D/E rank ${pctRanks.debt_eq_rank.toFixed(0)} -> ${percentileToScore(pctRanks.debt_eq_rank)}`);
  }

  const score = rankScores.length > 0
    ? rankScores.reduce((a, b) => a + b, 0) / rankScores.length
    : 50;

  notes.push(
    `Sector size: ${pctRanks.sector_size} companies; `
    + `${rankScores.length} rank signals available; `
    + `composite: ${clamp(score)}`
  );

  // Confidence degrades sharply with small sectors
  const confidence = pctRanks.sector_size >= 5
    ? 0.9
    : pctRanks.sector_size >= 3
      ? 0.6
      : pctRanks.sector_size >= 1
        ? 0.4
        : 0.0;

  return result(score, confidence, src, notes);
}

// ---- 10. Technical Timing Score ---------------------------------------------
// PHASE 1: Always returns 50 (neutral). Weight is 0.00 in PHASE_1_WEIGHTS.
// PHASE 2: Will use price_vs_200dma, trend_structure, volume_signal.
// Architecture is reserved -- activating Phase 2 requires updating this function
// and changing the weight to 0.10 in PHASE_2_WEIGHTS.

export function technicalTimingScore(
  inputs: ScoringInputs,
): SubScoreResult {
  const src: Record<string, unknown> = {
    price_vs_200dma: inputs.price_vs_200dma,  // null in Phase 1
    trend_structure: inputs.trend_structure,   // null in Phase 1
    volume_signal:   inputs.volume_signal,     // null in Phase 1
    phase:           'phase_1',
  };

  return result(
    50,
    0.0,
    src,
    ['Phase 1: technical timing score defaults to 50 (neutral). Will be implemented in Phase 2.'],
  );
}
