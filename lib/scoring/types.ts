// lib/scoring/types.ts
//
// Type definitions for the Conviction Scoring Engine.
//
// ARCHITECTURE
//   The scoring engine is purely algorithmic — no LLM involvement.
//   All types here represent deterministic scoring inputs and outputs.
//   The LLM layer (services/api/intelligence.ts) reads conviction_scores
//   and interprets them — it never produces them.
//
// VERSIONING
//   SCORING_ENGINE_VERSION must be incremented whenever any sub-score
//   calculation logic changes. This ensures conviction_score_history
//   rows are always traceable to the exact algorithm that produced them.

export const SCORING_ENGINE_VERSION = '1.0.0' as const;

// ── Conviction tiers ─────────────────────────────────────────────────────────

export type ConvictionTier =
  | 'HIGH_CONVICTION'
  | 'MODERATE'
  | 'WATCHLIST'
  | 'MONITOR';

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

// ── Sub-score result ─────────────────────────────────────────────────────────
// Every sub-score function returns this shape.

export type SubScoreResult = {
  score:       number;          // 0–100 before weighting
  confidence:  number;          // 0–1 — how much data was available for this sub-score
  inputs:      Record<string, unknown>;  // Source values used — stored in inputs_snapshot
  notes:       string[];        // Audit trail: why the score is what it is
};

// ── Weight sets ──────────────────────────────────────────────────────────────

export type ScoringPhase = 'phase_1' | 'phase_2';

export type SubScoreWeights = {
  phase:                 ScoringPhase;
  valuation:             number;
  profitability:         number;
  growth:                number;
  balance_sheet:         number;
  momentum:              number;
  macro_sensitivity:     number;
  catalyst:              number;
  risk:                  number;
  sector_relative_strength: number;
  technical_timing:      number;   // 0 in phase_1, 0.10 in phase_2
};

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
  technical_timing:         0.00,   // Not active until Phase 2
};

export const PHASE_2_WEIGHTS: SubScoreWeights = {
  phase:                    'phase_2',
  valuation:                0.17,
  profitability:            0.15,
  growth:                   0.13,
  balance_sheet:            0.10,
  momentum:                 0.08,
  macro_sensitivity:        0.07,
  catalyst:                 0.06,
  risk:                     0.06,
  sector_relative_strength: 0.08,
  technical_timing:         0.10,   // Activated in Phase 2
};

// ── Full sub-score collection ────────────────────────────────────────────────

export type SubScores = {
  valuation:              SubScoreResult;
  profitability:          SubScoreResult;
  growth:                 SubScoreResult;
  balance_sheet:          SubScoreResult;
  momentum:               SubScoreResult;
  macro_sensitivity:      SubScoreResult;
  catalyst:               SubScoreResult;
  risk:                   SubScoreResult;
  sector_relative_strength: SubScoreResult;
  technical_timing:       SubScoreResult;
};

// ── Scoring inputs ───────────────────────────────────────────────────────────
// Assembled by buildScoringInputs() from DB queries before scoring runs.

export type ScoringInputs = {
  symbol:       string;
  sector:       string;
  sector_slug:  string;

  // From financial_ratio_snapshots or financial_metrics (latest period)
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
  metrics_period:   string | null;      // e.g. 'FY25'
  metrics_age_days: number;             // Days since metrics_period ended

  // From company_intelligence_blocks
  catalyst_count_near:   number;
  catalyst_count_medium: number;
  catalyst_count_long:   number;
  risk_count_high:       number;
  risk_count_medium:     number;
  risk_count_low:        number;

  // From sector_drivers (for the company's sector)
  sector_driver_positive: number;
  sector_driver_negative: number;
  sector_driver_neutral:  number;
  sector_driver_watch:    number;

  // From sector_macro_linkages (negative direction active linkages)
  active_negative_macro_drivers: number;
  active_positive_macro_drivers: number;

  // From daily_prices (30-day trend)
  price_trend_30d: 'positive' | 'negative' | 'flat' | null;

  // Peer metrics (from financial_ratio_snapshots aggregated by sector)
  sector_median_pe:           number | null;
  sector_median_pb:           number | null;
  sector_median_roe:          number | null;
  sector_median_net_margin:   number | null;
  sector_median_eps_growth:   number | null;

  // Technical (Phase 2 — null until technical_indicators populated)
  price_vs_200dma:  'above' | 'below' | 'at' | null;
  trend_structure:  'uptrend' | 'downtrend' | 'range' | null;
  volume_signal:    'accumulation' | 'distribution' | 'neutral' | null;
};

// ── Final conviction result ───────────────────────────────────────────────────

export type ConvictionScoreResult = {
  symbol:             string;
  score:              number;              // 0–100, rounded integer
  tier:               ConvictionTier;
  sub_scores:         SubScores;
  weights_applied:    SubScoreWeights;
  data_confidence:    number;              // 0.65–1.00
  inputs_snapshot:    ScoringInputs;
  score_version:      string;              // SCORING_ENGINE_VERSION
  scored_at:          Date;
};

// ── Data confidence computation ───────────────────────────────────────────────

export type DataConfidenceLevel = {
  multiplier:   number;   // 0.65–1.00
  reason:       string;
};

// ── Scoring context (passed to each sub-score function) ───────────────────────
// Includes pre-computed peer percentile ranks for sector normalization.

export type SectorPercentileRanks = {
  pe_rank:          number | null;    // 0–100: lower P/E = higher rank
  pb_rank:          number | null;
  roe_rank:         number | null;    // higher ROE = higher rank
  net_margin_rank:  number | null;
  eps_growth_rank:  number | null;
  debt_eq_rank:     number | null;    // lower D/E = higher rank
  sector_size:      number;           // Total companies in sector with data
};
