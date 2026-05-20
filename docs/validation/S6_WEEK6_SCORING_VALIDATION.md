# Sprint 6 — Scoring Validation Report
## Determinism Audit, Hard Cap Verification, Weight Integrity

**Sprint:** 6, Week 6  
**Engine Version:** 1.0.0 (SCORING_ENGINE_VERSION in lib/scoring/types.ts)  
**Date:** 2026-05-20  
**Scope:** Static source audit of lib/scoring/ — no DB required for this analysis  

---

## 1. Determinism Guarantee

**Claim:** Given identical `ScoringInputs` and `SectorPercentileRanks`, `computeConvictionScore()` always produces the same result.

**Basis:**

The function `computeConvictionScore()` (lib/scoring/index.ts, line 78) is explicitly declared pure in its header comment and enforced structurally:

- It accepts only typed inputs — no hidden reads from environment, DB, time, or random number sources
- Every sub-score function it calls is also pure: no async operations, no closures over mutable state
- All arithmetic operations are deterministic: `clamp()`, `minMaxNormalize()`, `invertedMinMaxNormalize()`, `percentileToScore()` are stable functions over their inputs
- `computeWeightedComposite()` applies a fixed weight set (PHASE_1_WEIGHTS) and a deterministic multiplier from `computeDataConfidence()`
- `scored_at: new Date()` in the result is a timestamp field only — it does not affect the `score`, `tier`, or any `sub_scores` values
- `scoreToTier()` is a simple threshold comparison with no randomness

**Verdict: DETERMINISTIC ✓**

---

## 2. Hard Cap Verification

All four hard caps were verified by direct source inspection. Each cap is enforced as an early-return or post-composite overwrite within its respective sub-score function.

### Cap 1 — PAT Growth: Score cannot exceed 35 when PAT growth is negative

**Sub-score:** `growthScore()` (lib/scoring/sub-scores.ts)  
**Trigger condition:** `inputs.pat_growth !== null && inputs.pat_growth < 0`  
**Enforcement (lines 254–258):**
```typescript
// Hard floor: negative PAT growth caps score at 35
if (inputs.pat_growth !== null && inputs.pat_growth < 0 && composite > 35) {
  composite = 35;
  notes.push(`Hard floor applied: PAT growth ${inputs.pat_growth.toFixed(1)}% is negative, capping score at 35`);
}
```
**Audit trail:** The cap is logged in `notes[]` — stored in `conviction_sub_scores.notes_json`.  
**Edge case:** Cap is only applied if `composite > 35`. If a company has such poor EPS/revenue growth that the composite is already ≤ 35, no cap is needed (the note is not added). Correct.  
**Verdict: CORRECTLY IMPLEMENTED ✓**

---

### Cap 2 — Interest Cover: Balance sheet score cannot exceed 40 when interest_cover < 1.5x

**Sub-score:** `balanceSheetScore()` (lib/scoring/sub-scores.ts)  
**Trigger condition:** `inputs.interest_cover !== null && inputs.interest_cover < 1.5`  
**Enforcement (lines 282–286):**
```typescript
// Hard floor: interest_cover < 1.5x
if (inputs.interest_cover !== null && inputs.interest_cover < 1.5) {
  notes.push(`Hard floor: interest_cover ${inputs.interest_cover.toFixed(2)}x is below 1.5x threshold`);
  const icScore = clamp(minMaxNormalize(inputs.interest_cover, 0, 1.5));
  return result(Math.min(40, icScore), 0.9, src, notes);
}
```
**Behaviour:** The function early-returns before computing the D/E blend. The returned score is `Math.min(40, icScore)` where `icScore` is the linear interpolation of interest_cover within [0, 1.5]. A company with 0x cover scores 0; with 1.0x cover scores ~67 before the cap → capped at 40; with 1.49x scores ~99 before cap → capped at 40.  
**Confidence fixed at 0.90** when the cap fires, reflecting known data presence.  
**Verdict: CORRECTLY IMPLEMENTED ✓**

---

### Cap 3 — Negative Macro Drivers: Macro sensitivity score cannot exceed 45 when active_negative_macro_drivers > 3

**Sub-score:** `macroSensitivityScore()` (lib/scoring/sub-scores.ts)  
**Trigger condition:** `inputs.active_negative_macro_drivers > 3`  
**Enforcement (lines 392–401):**
```typescript
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
```
**Behaviour:** The raw score is still computed (allowing variation within the cap range — 4 negative drivers with 3 positive still scores differently from 7 drivers with 0), but the final result is `Math.min(45, rawScore)`. Positive macro drivers can partially offset, but the ceiling holds.  
**Note:** The cap fires at `> 3` (strictly greater than), meaning exactly 3 negative drivers does NOT trigger the cap. This is consistent with the architecture spec.  
**Verdict: CORRECTLY IMPLEMENTED ✓**

---

### Cap 4 — High Risk Count: Risk score cannot exceed 25 when risk_count_high >= 2

**Sub-score:** `riskScore()` (lib/scoring/sub-scores.ts)  
**Trigger condition:** `inputs.risk_count_high >= 2`  
**Enforcement (lines 480–484):**
```typescript
// Hard floor: 2+ high severity risks
if (inputs.risk_count_high >= 2) {
  notes.push(`Hard floor: ${inputs.risk_count_high} high-severity risks (>=2 threshold)`);
  // Small variation within floor range based on additional risks
  const floorScore = Math.max(10, 25 - (inputs.risk_count_high - 2) * 5);
  return result(floorScore, 1.0, src, notes);
}
```
**Behaviour:** The cap fires at `>= 2` (2 or more). The floor score is `Math.max(10, 25 - (risk_count_high - 2) * 5)`:
- 2 high risks: `25 - 0 = 25`
- 3 high risks: `25 - 5 = 20`
- 4 high risks: `25 - 10 = 15`
- 5 high risks: `25 - 15 = 10`
- 6+ high risks: `Max(10, <=10) = 10` (floor of floor)

**Confidence fixed at 1.00** — risk block data is always known (counts come directly from intelligence blocks with no nullability).  
**Verdict: CORRECTLY IMPLEMENTED ✓**

---

## 3. Sub-Score Weight Integrity

Phase 1 weights verified against PHASE_1_WEIGHTS constant (lib/scoring/types.ts, lines 68–80):

| Sub-Score                  | Phase 1 Weight | % of Total |
|----------------------------|---------------|------------|
| Valuation                  | 0.20          | 20.0%      |
| Profitability              | 0.18          | 18.0%      |
| Growth                     | 0.15          | 15.0%      |
| Balance Sheet              | 0.12          | 12.0%      |
| Momentum                   | 0.10          | 10.0%      |
| Macro Sensitivity          | 0.08          | 8.0%       |
| Catalyst                   | 0.07          | 7.0%       |
| Risk                       | 0.07          | 7.0%       |
| Sector Relative Strength   | 0.03          | 3.0%       |
| Technical Timing (Phase 1) | 0.00          | 0.0%       |
| **Total**                  | **1.00**      | **100.0%** |

**Weights sum check:** 0.20 + 0.18 + 0.15 + 0.12 + 0.10 + 0.08 + 0.07 + 0.07 + 0.03 + 0.00 = **1.00 ✓**

`computeWeightedComposite()` (lib/scoring/utils.ts, line 133) skips weights where `weight === 0` or `key === 'phase'`, then normalises by `totalWeight`. Since totalWeight = 1.00 in Phase 1, no division artefact.

**Technical Timing (weight 0.00):** Correctly excluded from Phase 1 composite. Function returns a fixed 50 with `confidence: 0.0`. It does not pull the composite score either up or down.

**Verdict: WEIGHTS VERIFIED ✓**

---

## 4. Data Confidence Multiplier

Verified against `computeDataConfidence()` (lib/scoring/utils.ts, lines 70–102).

**Critical fields checked:** pe_ratio, pb_ratio, roe, net_margin, eps_growth, debt_to_equity, interest_cover (7 fields total)

| Condition                                              | Multiplier |
|--------------------------------------------------------|-----------|
| Data age > 270 days                                    | 0.65      |
| ≥ 3 critical fields missing AND age > 180 days        | 0.70      |
| ≥ 2 critical fields missing OR age > 180 days         | 0.75      |
| 1 critical field missing OR (0 missing AND age > 90d) | 0.90      |
| All present AND age ≤ 90 days                         | 1.00      |

**Composite adjustment formula** (lib/scoring/utils.ts, line 149):
```
adjusted = composite × multiplier + 50 × (1 − multiplier)
```

This pulls uncertain scores toward the neutral midpoint (50) rather than zeroing them. Example: composite 80, multiplier 0.75 → `80 × 0.75 + 50 × 0.25 = 72.5`. This is conservative behaviour — high-conviction scores cannot be sustained on stale data alone.

**Range of adjusted scores:**
- Multiplier 1.00: full score preserved
- Multiplier 0.65: maximum possible adjusted score = `100 × 0.65 + 50 × 0.35 = 82.5` (prevents HIGH_CONVICTION tier on stale data)
- Multiplier 0.65: minimum possible adjusted score = `0 × 0.65 + 50 × 0.35 = 17.5` (MONITOR floor softened)

**Verdict: FORMULA VERIFIED ✓**

---

## 5. Conviction Tier Boundaries

Verified against `scoreToTier()` and `TIER_THRESHOLDS` (lib/scoring/types.ts, lines 26–38):

| Tier            | Score Range | `scoreToTier()` condition    |
|-----------------|-------------|------------------------------|
| HIGH_CONVICTION | 75–100      | `score >= 75`                |
| MODERATE        | 55–74       | `score >= 55`                |
| WATCHLIST       | 35–54       | `score >= 35`                |
| MONITOR         | 0–34        | `else` (catch-all)           |

Boundaries are inclusive on both sides. Score 75 → HIGH_CONVICTION. Score 74 → MODERATE.

**Impact of hard caps on tier reachability:**

When all 4 hard caps fire simultaneously, the sub-score ceilings are:
- Growth: 35 → contributes at most `35 × 0.15 = 5.25` to composite
- Balance Sheet: 40 → at most `40 × 0.12 = 4.80`
- Macro Sensitivity: 45 → at most `45 × 0.08 = 3.60`
- Risk: 25 → at most `25 × 0.07 = 1.75`

Remaining 7 sub-scores at theoretical max 100 each: `100 × (0.20 + 0.18 + 0.10 + 0.07 + 0.03) = 58.0`

Raw composite ceiling with all caps active: `58.0 + 5.25 + 4.80 + 3.60 + 1.75 = 73.4`

With multiplier 0.65 (stale data on top of all caps): `73.4 × 0.65 + 50 × 0.35 = 47.7 + 17.5 = 65.2`

**Conclusion:** A company with all 4 hard caps active can at most reach MODERATE tier. It cannot reach HIGH_CONVICTION. This is the intended protective behaviour.

---

## 6. Audit Trail Integrity

Each sub-score function builds a `notes: string[]` array explaining each scoring decision. These are stored in `conviction_sub_scores.notes_json` (JSONB column). When a hard cap fires, it is always logged:

- growthScore cap: `"Hard floor applied: PAT growth X% is negative, capping score at 35"`
- balanceSheetScore cap: `"Hard floor: interest_cover X.XXx is below 1.5x threshold"`
- macroSensitivityScore cap: `"Hard cap: N negative macro drivers active (>3 threshold)"`
- riskScore cap: `"Hard floor: N high-severity risks (>=2 threshold)"`

Any DB row in `conviction_sub_scores` where a cap-related note string is present in `notes_json` was subject to that cap. This enables post-hoc filtering without re-running the algorithm.

---

## 7. What This Audit Did NOT Cover

The following require live DB testing against actual scored companies:

| Item | Requires |
|------|---------|
| Input assembly correctness (buildScoringInputs) | DB with populated financial_ratio_snapshots |
| Peer rank accuracy (buildPeerRanks) | Multiple companies in same sector with data |
| Hard cap firing frequency in production | Scored conviction_scores rows |
| Score distribution across all companies | Full scoring run on PSX universe |
| Regression test — score does not drift between runs | Two scoring runs on same unchanged data |

These items are deferred to the live environment validation phase.

---

## Summary

| Check | Status |
|-------|--------|
| Determinism guarantee | ✓ PASS |
| Hard cap 1 — PAT growth (line 255) | ✓ PASS |
| Hard cap 2 — Interest cover (line 282) | ✓ PASS |
| Hard cap 3 — Negative macro drivers (line 392) | ✓ PASS |
| Hard cap 4 — High risk count (line 480) | ✓ PASS |
| Phase 1 weights sum to 1.00 | ✓ PASS |
| Technical timing excluded (weight 0.00) | ✓ PASS |
| Data confidence formula correct | ✓ PASS |
| Tier boundaries correctly coded | ✓ PASS |
| Audit trail logged on cap fires | ✓ PASS |
| HIGH_CONVICTION blocked when all caps active | ✓ PASS |

All static checks pass. No corrections required to lib/scoring/ code.
