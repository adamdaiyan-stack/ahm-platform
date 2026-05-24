/**
 * scripts/pipelines/score-all-companies.ts
 *
 * Node.js CLI pipeline — runs the conviction scoring engine over every
 * active company and persists results to conviction_scores +
 * conviction_score_history.
 *
 * Architecture:
 *   Reuses lib/scoring/ (pure computation) and lib/scoring/db.ts
 *   (DB assembly helpers) — no logic duplication with the Edge Functions.
 *
 *   1. Load all companies + resolve sector slugs
 *   2. Build a per-sector data cache (1 round of shared queries per sector)
 *   3. For each company:
 *        a. buildScoringInputs()   — assembles ScoringInputs from DB
 *        b. buildPeerRanks()       — computes sector percentile ranks
 *        c. computeConvictionScore() — pure, deterministic 0–100 score
 *        d. persistScore()         — upserts conviction_scores,
 *                                    inserts conviction_score_history
 *                                    with full tier-transition tracking
 *   4. Print summary
 *
 * Usage:
 *   npm run score:companies
 *   npm run score:companies -- --symbol=HBL
 *   npm run score:companies -- --dry-run
 *
 * Exit codes:
 *   0 — all companies scored (or no errors)
 *   1 — one or more companies failed
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";

// ─── Import from lib/scoring via relative path ────────────────────────────────
// lib/scoring/db.ts uses process.env (Node.js-compatible).
// tsx resolves relative .js extensions to .ts at runtime.

import { computeConvictionScore, SCORING_ENGINE_VERSION }
  from "../../lib/scoring/index.js";
import { buildScoringInputs, buildPeerRanks }
  from "../../lib/scoring/db.js";

import type { ConvictionScoreResult } from "../../lib/scoring/types.js";

// ─── CLI flags ────────────────────────────────────────────────────────────────

const args      = process.argv.slice(2);
const dryRun    = args.includes("--dry-run");
const symbolArg = (() => {
  const f = args.find(a => a.startsWith("--symbol="));
  return f ? f.split("=")[1].toUpperCase().trim() : null;
})();

// ─── Tier ordering for direction detection ────────────────────────────────────

const TIER_ORDER: Record<string, number> = {
  HIGH_CONVICTION: 4,
  MODERATE:        3,
  WATCHLIST:       2,
  MONITOR:         1,
};

// ─── Persistence ──────────────────────────────────────────────────────────────

async function persistScore(result: ConvictionScoreResult, triggerReason = "scheduled"): Promise<void> {
  const { symbol } = result;

  // ── Look up previous current row for tier transition tracking ─────────────
  const { data: prevRow } = await supabaseAdmin
    .from("conviction_scores")
    .select("id, score, tier")
    .eq("symbol", symbol)
    .eq("is_current", true)
    .maybeSingle();

  const prevScore = (prevRow as { score: number | null } | null)?.score ?? null;
  const prevTier  = (prevRow as { tier:  string | null } | null)?.tier  ?? null;

  const tierChanged = prevTier !== null && prevTier !== result.tier;
  let tierDirection: "upgrade" | "downgrade" | null = null;
  if (tierChanged && prevTier !== null) {
    const prevOrd = TIER_ORDER[prevTier] ?? 0;
    const newOrd  = TIER_ORDER[result.tier] ?? 0;
    tierDirection = newOrd > prevOrd ? "upgrade" : "downgrade";
  }

  // ── Mark old row as historical ────────────────────────────────────────────
  if (prevRow) {
    await supabaseAdmin
      .from("conviction_scores")
      .update({ is_current: false })
      .eq("symbol", symbol)
      .eq("is_current", true);
  }

  // ── Build the score row ───────────────────────────────────────────────────
  const scoredAt = result.scored_at.toISOString();

  const scoreRow = {
    symbol:          result.symbol,
    score:           result.score,
    tier:            result.tier,
    sub_scores:      result.sub_scores as unknown as Record<string, unknown>,
    weights_applied: result.weights_applied as unknown as Record<string, unknown>,
    data_confidence: result.data_confidence,
    inputs_snapshot: result.inputs_snapshot as unknown as Record<string, unknown>,
    score_version:   result.score_version,
    is_current:      true,
    scored_at:       scoredAt,
  };

  // ── Insert new current row ────────────────────────────────────────────────
  const { error: insertErr } = await supabaseAdmin
    .from("conviction_scores")
    .insert(scoreRow);

  if (insertErr) {
    throw new Error(`conviction_scores insert failed: ${insertErr.message}`);
  }

  // ── Append to history (immutable audit log) ───────────────────────────────
  const historyRow = {
    symbol:         result.symbol,
    score:          result.score,
    tier:           result.tier,
    previous_score: prevScore,
    previous_tier:  prevTier,
    tier_changed:   tierChanged,
    tier_direction: tierDirection,
    sub_scores:     result.sub_scores as unknown as Record<string, unknown>,
    data_confidence: result.data_confidence,
    inputs_snapshot: result.inputs_snapshot as unknown as Record<string, unknown>,
    score_version:  result.score_version,
    scored_at:      scoredAt,
    trigger_reason: triggerReason,
  };

  const { error: histErr } = await supabaseAdmin
    .from("conviction_score_history")
    .insert(historyRow);

  if (histErr) {
    // Non-fatal — history insert failure should not block conviction_scores update
    console.warn(`  ⚠  conviction_score_history insert failed for ${symbol}: ${histErr.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startMs = Date.now();

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Conviction Scoring Engine  v${SCORING_ENGINE_VERSION}`);
  console.log(`  ${new Date().toISOString()}`);
  if (dryRun)    console.log(`  MODE: DRY RUN — no DB writes`);
  if (symbolArg) console.log(`  FILTER: symbol = ${symbolArg}`);
  console.log(`${"═".repeat(60)}\n`);

  // ── 1. Load companies ──────────────────────────────────────────────────────
  const { data: companies, error: compErr } = await supabaseAdmin
    .from("companies")
    .select("symbol, sector");

  if (compErr || !companies) {
    console.error(`Fatal: could not load companies: ${compErr?.message}`);
    process.exit(1);
  }

  // ── 2. Resolve sector slugs ────────────────────────────────────────────────
  const { data: sectors } = await supabaseAdmin
    .from("sectors")
    .select("slug, db_sector_name");

  const sectorSlugMap = new Map<string, string>(); // db_sector_name → slug
  for (const s of (sectors ?? [])) {
    sectorSlugMap.set(
      (s as { db_sector_name: string }).db_sector_name,
      (s as { slug: string }).slug,
    );
  }

  // ── 3. Build target list ───────────────────────────────────────────────────
  type CompanyRow = { symbol: string; sector: string };

  let targets = (companies as CompanyRow[]).filter(c => sectorSlugMap.has(c.sector));

  if (symbolArg) {
    targets = targets.filter(c => c.symbol === symbolArg);
    if (targets.length === 0) {
      console.error(`No company found for symbol "${symbolArg}" with a mapped sector.`);
      process.exit(1);
    }
  }

  console.log(`  ${targets.length} companies to score\n`);

  // ── 4. Score each company ──────────────────────────────────────────────────
  let scored  = 0;
  let failed  = 0;
  let skipped = 0;
  const failures: { symbol: string; error: string }[] = [];

  for (const company of targets) {
    const { symbol, sector } = company;
    const sectorSlug = sectorSlugMap.get(sector)!;

    try {
      // Assemble inputs (7 DB queries — sector-level data cached inside buildScoringInputs)
      const inputs   = await buildScoringInputs(symbol);
      const pctRanks = await buildPeerRanks(symbol, sectorSlug);
      const result   = computeConvictionScore(inputs, pctRanks);

      if (dryRun) {
        console.log(`  [dry] ${symbol.padEnd(12)} score=${result.score} tier=${result.tier} confidence=${(result.data_confidence * 100).toFixed(0)}%`);
        skipped++;
      } else {
        await persistScore(result, "scheduled");
        const tierStr = result.tier.replace("_", " ").toLowerCase();
        console.log(`  ✓ ${symbol.padEnd(12)} ${result.score.toString().padStart(3)} | ${tierStr.padEnd(15)} | data=${(result.data_confidence * 100).toFixed(0)}%`);
        scored++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${symbol.padEnd(12)} ${message.slice(0, 80)}`);
      failures.push({ symbol, error: message });
      failed++;
    }

    // Avoid overwhelming the DB connection pool
    await new Promise(r => setTimeout(r, 30));
  }

  // ── 5. Summary ────────────────────────────────────────────────────────────
  const durationMs = Date.now() - startMs;

  console.log(`\n${"─".repeat(60)}`);
  if (dryRun) {
    console.log(`  Dry run complete. ${targets.length} companies would be scored.`);
  } else {
    console.log(`  ${scored} scored  |  ${failed} failed  |  ${skipped} skipped`);
    console.log(`  Engine: v${SCORING_ENGINE_VERSION}  |  Duration: ${(durationMs / 1000).toFixed(1)}s`);
  }

  if (failures.length > 0) {
    console.log(`\n  Failures:`);
    failures.forEach(f => console.log(`    • ${f.symbol}: ${f.error.slice(0, 100)}`));
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
