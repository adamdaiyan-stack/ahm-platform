/**
 * scripts/utils/market-regime.ts
 *
 * Market regime classification engine.
 *
 * Reads the raw market signals for a given trading date and returns
 * a typed RegimeState with one of six regime labels.
 *
 * Regime labels:
 *   Bullish        — broad advance, positive breadth, expanding volume
 *   Risk-On        — strong advance but narrower / cyclical-led
 *   Neutral        — mixed signals, no clear directional bias
 *   Defensive      — narrow advance or decline concentrated in defensives
 *   Risk-Off       — broad selling, flight from risk assets
 *   High Volatility— large swings, unstable breadth regardless of direction
 *
 * Algorithm:
 *   The classifier uses a simple rule-based scoring approach.
 *   Each signal contributes a weighted vote. Signals are:
 *     - KSE-100 daily change %           (direction + magnitude)
 *     - Advance / decline ratio          (breadth direction)
 *     - Breadth %                        (breadth strength)
 *     - Volume vs 30-day average         (participation conviction)
 *     - Sector breadth                   (how many sectors participate)
 *     - Realized volatility signal       (intraday range vs history)
 *
 *   High Volatility overrides other regimes when volatility is extreme.
 *
 * Usage (from build-daily-snapshots.ts or standalone):
 *   const signals = await fetchRegimeSignals(runDate);
 *   const regime  = classifyMarketRegime(signals);
 *   await persistRegime(runDate, regime);
 */

import { supabaseAdmin } from "./supabase-admin.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegimeLabel =
  | "Bullish"
  | "Risk-On"
  | "Neutral"
  | "Defensive"
  | "Risk-Off"
  | "High Volatility";

export type VolatilityLevel = "low" | "normal" | "elevated" | "extreme";

export interface RegimeSignals {
  /** KSE-100 daily return % (positive = up, negative = down) */
  kse100ChangePct:     number | null;
  /** advances / declines (null if no breadth data) */
  advanceDeclineRatio: number | null;
  /** (advances / (advances + declines + unchanged)) * 100 */
  breadthPct:          number | null;
  /** % of tracked stocks whose volume exceeded their 30-day average */
  participationPct:    number | null;
  /** Today's total market volume / 30-day rolling average volume */
  volumeVsAvg:         number | null;
  /** Sectors with positive average change / total sectors tracked */
  sectorBreadth:       number | null;
  /** Realized volatility classification for context */
  volatilityLevel:     VolatilityLevel;
}

export interface RegimeState {
  regime:     RegimeLabel;
  confidence: number;          // 0.0 – 1.0
  inputs:     RegimeSignals;
  note:       string;          // Human-readable rationale
}

// ─── Signal fetcher ───────────────────────────────────────────────────────────

/**
 * Fetches all signals needed for regime classification for a given date.
 * Reads from: index_history (KSE-100 breadth), daily_prices, companies.
 */
export async function fetchRegimeSignals(
  marketDate: string
): Promise<RegimeSignals> {

  // ── KSE-100 index row (change_pct, advances, declines, unchanged) ──────────
  const { data: indexRow } = await supabaseAdmin
    .from("index_history")
    .select("change_percent, advances, declines, unchanged, volume")
    .eq("index_symbol", "KSE-100")
    .eq("market_date", marketDate)
    .single();

  const kse100ChangePct = (indexRow as { change_percent: number | null } | null)
    ?.change_percent ?? null;
  const advances  = (indexRow as { advances: number | null } | null)?.advances  ?? null;
  const declines  = (indexRow as { declines: number | null } | null)?.declines  ?? null;
  const unchanged = (indexRow as { unchanged: number | null } | null)?.unchanged ?? null;

  // Advance / decline ratio
  const advanceDeclineRatio =
    advances != null && declines != null && declines > 0
      ? Number((advances / declines).toFixed(3))
      : null;

  // Breadth % = advances / total participants
  const total = (advances ?? 0) + (declines ?? 0) + (unchanged ?? 0);
  const breadthPct = total > 0 && advances != null
    ? Number(((advances / total) * 100).toFixed(2))
    : null;

  // ── Single price fetch: symbol + change_percent + volume for this date ───────
  // Used for sector breadth, volume computation, and participation rate.
  const { data: priceRows } = await supabaseAdmin
    .from("daily_prices")
    .select("symbol, change_percent, volume")
    .eq("market_date", marketDate);

  type PRow = { symbol: string; change_percent: number | null; volume: number | null };
  const typedPriceRows = (priceRows ?? []) as PRow[];

  const { data: companyRows } = await supabaseAdmin
    .from("companies")
    .select("symbol, sector");

  // ── Sector breadth (how many sectors positive today) ──────────────────────
  let sectorBreadth: number | null = null;
  if (typedPriceRows.length > 0 && companyRows) {
    type CRow = { symbol: string; sector: string | null };

    const sectorMap = new Map<string, string | null>(
      (companyRows as CRow[]).map((c) => [c.symbol, c.sector])
    );

    const sectorChanges: Record<string, number[]> = {};
    for (const row of typedPriceRows) {
      const sector = sectorMap.get(row.symbol);
      if (!sector || row.change_percent == null) continue;
      if (!sectorChanges[sector]) sectorChanges[sector] = [];
      sectorChanges[sector].push(row.change_percent);
    }

    const sectors = Object.entries(sectorChanges);
    const positiveSectors = sectors.filter(
      ([, changes]) => changes.reduce((s, v) => s + v, 0) / changes.length > 0
    );

    sectorBreadth = sectors.length > 0
      ? Number((positiveSectors.length / sectors.length).toFixed(3))
      : null;
  }

  // ── Volume vs 30-day average ───────────────────────────────────────────────
  // Compute total market volume today vs avg of prior 30 trading days
  const todayVolume = typedPriceRows.reduce((sum, r) => sum + (r.volume ?? 0), 0);

  // 30-day historical average: get 30 recent dates before today
  const { data: histVolRows } = await supabaseAdmin
    .from("daily_prices")
    .select("market_date, volume")
    .lt("market_date", marketDate)
    .order("market_date", { ascending: false });

  type VolRow = { market_date: string; volume: number | null };
  let volumeVsAvg: number | null = null;

  if (histVolRows && histVolRows.length > 0) {
    // Group by date, sum volume per date, take last 30 dates
    const dateVols: Record<string, number> = {};
    for (const row of histVolRows as VolRow[]) {
      if (!dateVols[row.market_date]) dateVols[row.market_date] = 0;
      dateVols[row.market_date] += row.volume ?? 0;
    }

    const sortedDates = Object.keys(dateVols).sort().reverse().slice(0, 30);
    if (sortedDates.length > 0 && todayVolume > 0) {
      const avgVol = sortedDates.reduce((s, d) => s + dateVols[d], 0) / sortedDates.length;
      volumeVsAvg = avgVol > 0
        ? Number((todayVolume / avgVol).toFixed(3))
        : null;
    }
  }

  // ── Participation % (stocks trading above their 30-day avg volume) ─────────
  // For speed at MVP: use a simpler proxy — % of stocks with volume > 0
  // Phase 2 can compute a proper per-symbol 30-day avg
  let participationPct: number | null = null;
  if (typedPriceRows.length > 0) {
    const all    = typedPriceRows.length;
    const active = typedPriceRows.filter((r) => (r.volume ?? 0) > 0).length;
    participationPct = all > 0
      ? Number(((active / all) * 100).toFixed(2))
      : null;
  }

  // ── Volatility level (from KSE-100 change magnitude as proxy) ────────────
  // Phase 2: compute from realized volatility in daily_snapshots
  const absChg = Math.abs(kse100ChangePct ?? 0);
  const volatilityLevel: VolatilityLevel =
    absChg >= 3.0 ? "extreme" :
    absChg >= 1.5 ? "elevated" :
    absChg >= 0.5 ? "normal"   : "low";

  return {
    kse100ChangePct,
    advanceDeclineRatio,
    breadthPct,
    participationPct,
    volumeVsAvg,
    sectorBreadth,
    volatilityLevel,
  };
}

// ─── Classifier ───────────────────────────────────────────────────────────────

/**
 * Classifies market regime from raw signals.
 * Rule-based scoring — each signal contributes a directional vote.
 * High Volatility is checked first as an override condition.
 */
export function classifyMarketRegime(signals: RegimeSignals): RegimeState {
  const {
    kse100ChangePct,
    advanceDeclineRatio,
    breadthPct,
    participationPct,
    volumeVsAvg,
    sectorBreadth,
    volatilityLevel,
  } = signals;

  // ── Override: High Volatility ────────────────────────────────────────────
  if (volatilityLevel === "extreme") {
    return {
      regime:     "High Volatility",
      confidence: 0.85,
      inputs:     signals,
      note:       `KSE-100 moved ${Math.abs(kse100ChangePct ?? 0).toFixed(2)}% — extreme intraday volatility. Regime: High Volatility.`,
    };
  }

  // ── Score: sum of directional signals (positive = bullish, negative = bearish) ──
  let score    = 0;
  let maxScore = 0;
  const notes: string[] = [];

  // Signal 1: KSE-100 direction + magnitude (weight: 3)
  if (kse100ChangePct != null) {
    const w = 3;
    maxScore += w;
    if (kse100ChangePct > 0.5) {
      score += w;
      notes.push(`KSE-100 +${kse100ChangePct.toFixed(2)}%`);
    } else if (kse100ChangePct < -0.5) {
      score -= w;
      notes.push(`KSE-100 ${kse100ChangePct.toFixed(2)}%`);
    } else {
      notes.push(`KSE-100 flat (${kse100ChangePct.toFixed(2)}%)`);
    }
  }

  // Signal 2: Advance / decline ratio (weight: 2)
  if (advanceDeclineRatio != null) {
    const w = 2;
    maxScore += w;
    if (advanceDeclineRatio > 1.5) {
      score += w;
      notes.push(`A/D ratio ${advanceDeclineRatio.toFixed(2)} (positive breadth)`);
    } else if (advanceDeclineRatio < 0.7) {
      score -= w;
      notes.push(`A/D ratio ${advanceDeclineRatio.toFixed(2)} (negative breadth)`);
    } else {
      notes.push(`A/D ratio ${advanceDeclineRatio.toFixed(2)} (mixed)`);
    }
  }

  // Signal 3: Breadth % (weight: 2)
  if (breadthPct != null) {
    const w = 2;
    maxScore += w;
    if (breadthPct > 60) {
      score += w;
      notes.push(`${breadthPct.toFixed(0)}% stocks advancing (broad)`);
    } else if (breadthPct < 40) {
      score -= w;
      notes.push(`${breadthPct.toFixed(0)}% stocks advancing (narrow)`);
    }
  }

  // Signal 4: Sector breadth (weight: 2)
  if (sectorBreadth != null) {
    const w = 2;
    maxScore += w;
    if (sectorBreadth > 0.65) {
      score += w;
      notes.push(`${Math.round(sectorBreadth * 100)}% sectors positive`);
    } else if (sectorBreadth < 0.35) {
      score -= w;
      notes.push(`only ${Math.round(sectorBreadth * 100)}% sectors positive`);
    }
  }

  // Signal 5: Volume vs avg (weight: 1 — conviction amplifier, not direction)
  if (volumeVsAvg != null) {
    const w = 1;
    maxScore += w;
    if (volumeVsAvg > 1.2) {
      // High volume amplifies the directional score
      score += score > 0 ? w : -w;
      notes.push(`volume ${volumeVsAvg.toFixed(2)}x avg (conviction)`);
    } else if (volumeVsAvg < 0.7) {
      notes.push(`volume ${volumeVsAvg.toFixed(2)}x avg (low conviction)`);
    }
  }

  // ── Map score → regime label ──────────────────────────────────────────────
  const normScore = maxScore > 0 ? score / maxScore : 0; // -1.0 to +1.0
  const confidence = Math.min(1, Math.abs(normScore) + 0.2); // floor at 0.2

  let regime: RegimeLabel;
  let note: string;

  if (normScore >= 0.55) {
    regime = "Bullish";
    note   = `Strong broad advance. ${notes.slice(0, 3).join(", ")}.`;
  } else if (normScore >= 0.25) {
    // Positive but not broad — Risk-On
    regime = "Risk-On";
    note   = `Market advancing but not broad-based. ${notes.slice(0, 3).join(", ")}.`;
  } else if (normScore <= -0.55) {
    regime = "Risk-Off";
    note   = `Broad selling. ${notes.slice(0, 3).join(", ")}.`;
  } else if (normScore <= -0.25) {
    // Negative but narrow — Defensive
    regime = "Defensive";
    note   = `Selective selling with defensive rotation. ${notes.slice(0, 3).join(", ")}.`;
  } else if (volatilityLevel === "elevated") {
    regime = "High Volatility";
    note   = `Elevated volatility with mixed signals. ${notes.slice(0, 2).join(", ")}.`;
  } else {
    regime = "Neutral";
    note   = `Mixed signals — no clear directional bias. ${notes.slice(0, 2).join(", ")}.`;
  }

  return { regime, confidence: Number(confidence.toFixed(2)), inputs: signals, note };
}

// ─── Persist ─────────────────────────────────────────────────────────────────

/**
 * Upserts a regime classification into market_regime_states.
 * Idempotent — re-running for the same date overwrites the row.
 */
export async function persistRegime(
  marketDate: string,
  state: RegimeState
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("market_regime_states")
    .upsert(
      {
        regime_date:  marketDate,
        regime:       state.regime,
        confidence:   state.confidence,
        inputs:       state.inputs as unknown as Record<string, unknown>,
        regime_note:  state.note,
        computed_by:  "pipeline",
        computed_at:  new Date().toISOString(),
      },
      { onConflict: "regime_date" }
    );

  if (error) {
    console.warn(`[market-regime] Failed to persist regime for ${marketDate}: ${error.message}`);
  } else {
    console.log(
      `  ✓ Regime [${marketDate}]: ${state.regime} (confidence: ${(state.confidence * 100).toFixed(0)}%)`
    );
    console.log(`    ${state.note}`);
  }
}

/**
 * Convenience: fetch signals, classify, and persist in one call.
 * Called from build-daily-snapshots.ts after price data is confirmed present.
 */
export async function computeAndPersistRegime(marketDate: string): Promise<RegimeState> {
  const signals = await fetchRegimeSignals(marketDate);
  const state   = classifyMarketRegime(signals);
  await persistRegime(marketDate, state);
  return state;
}
