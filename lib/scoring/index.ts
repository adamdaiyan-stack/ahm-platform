// lib/scoring/index.ts
//
// Conviction Scoring Engine — public entry points.
//
// USAGE
//   import { computeConvictionScore, buildScoringInputs } from '@/lib/scoring';
//
//   const inputs = await buildScoringInputs(symbol);
//   const result = computeConvictionScore(inputs);
//
// ARCHITECTURE
//   This module is the algorithmic core of the AI Intelligence Engine.
//   It reads structured DB data and produces deterministic conviction scores.
//   No LLM. No external API calls. Pure computation.
//
//   Data flow:
//     DB (financial_ratio_snapshots, company_intelligence_blocks,
//         sector_drivers, sector_macro_linkages, daily_prices)
//     → buildScoringInputs()   — assembles ScoringInputs from DB
//     → buildPeerRanks()       — computes sector percentile ranks
//     → computeConvictionScore() — runs all 11 sub-scores + composite
//     → DB (conviction_scores, conviction_score_history) — stored by Edge Function

import {
  valuationScore,
  profitabilityScore,
  growthScore,
  balanceSheetScore,
  momentumScore,
  macroSensitivityScore,
  catalystScore,
  riskScore,
  sectorRelativeStrengthScore,
  technicalTimingScore,
} from './sub-scores';

import {
  computeDataConfidence,
  computeWeightedComposite,
} from './utils';

import {
  SCORING_ENGINE_VERSION,
  PHASE_1_WEIGHTS,
  scoreToTier,
  type ScoringInputs,
  type SectorPercentileRanks,
  type ConvictionScoreResult,
  type SubScores,
} from './types';

import {
  buildScoringInputs as dbBuildScoringInputs,
  buildPeerRanks as dbBuildPeerRanks,
} from './db';

export type {
  ScoringInputs,
  SectorPercentileRanks,
  ConvictionScoreResult,
  SubScores,
  ConvictionTier,
  SubScoreResult,
  SubScoreWeights,
  ScoringPhase,
} from './types';

export { SCORING_ENGINE_VERSION, PHASE_1_WEIGHTS, PHASE_2_WEIGHTS, scoreToTier, TIER_THRESHOLDS } from './types';
export { computeDataConfidence, computeWeightedComposite } from './utils';

// ── computeConvictionScore ────────────────────────────────────────────────────
// Main entry point. Takes pre-assembled ScoringInputs and SectorPercentileRanks
// and returns a fully computed ConvictionScoreResult.
//
// This function is PURE — no DB calls, no async operations.
// The caller (Edge Function or service) is responsible for assembling inputs.

export function computeConvictionScore(
  inputs:   ScoringInputs,
  pctRanks: SectorPercentileRanks,
): ConvictionScoreResult {

  // ── Run all sub-scores ─────────────────────────────────────
  const subScores: SubScores = {
    valuation:              valuationScore(inputs, pctRanks),
    profitability:          profitabilityScore(inputs, pctRanks),
    growth:                 growthScore(inputs),
    balance_sheet:          balanceSheetScore(inputs, pctRanks),
    momentum:               momentumScore(inputs),
    macro_sensitivity:      macroSensitivityScore(inputs),
    catalyst:               catalystScore(inputs),
    risk:                   riskScore(inputs),
    sector_relative_strength: sectorRelativeStrengthScore(inputs, pctRanks),
    technical_timing:       technicalTimingScore(inputs),
  };

  // ── Compute data confidence ────────────────────────────────
  const { multiplier: dataConfidence } = computeDataConfidence(inputs);

  // ── Build raw score map for composite calculation ──────────
  const rawScores: Record<string, number> = {
    valuation:              subScores.valuation.score,
    profitability:          subScores.profitability.score,
    growth:                 subScores.growth.score,
    balance_sheet:          subScores.balance_sheet.score,
    momentum:               subScores.momentum.score,
    macro_sensitivity:      subScores.macro_sensitivity.score,
    catalyst:               subScores.catalyst.score,
    risk:                   subScores.risk.score,
    sector_relative_strength: subScores.sector_relative_strength.score,
    technical_timing:       subScores.technical_timing.score,
  };

  // ── Compute weighted composite ─────────────────────────────
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

// ── buildScoringInputs ────────────────────────────────────────────────────────
// Assembles ScoringInputs from DB queries for a given symbol.
// Queries: financial_ratio_snapshots, company_intelligence_blocks,
//          sector_drivers, sector_macro_linkages, daily_prices, sectors, companies.
// Delegates to lib/scoring/db.ts — pure computation stays in index.ts.

export async function buildScoringInputs(symbol: string): Promise<ScoringInputs> {
  return dbBuildScoringInputs(symbol);
}

// ── buildPeerRanks ────────────────────────────────────────────────────────────
// Computes sector percentile ranks for a symbol across 6 key metrics:
// P/E, P/B, ROE, net margin, EPS growth, D/E.
// Each rank is a 0-100 percentile where 100 = best in sector.
// Direction is metric-aware: lower P/E = rank 100, higher ROE = rank 100.

export async function buildPeerRanks(
  symbol:     string,
  sectorSlug: string,
): Promise<SectorPercentileRanks> {
  return dbBuildPeerRanks(symbol, sectorSlug);
}
