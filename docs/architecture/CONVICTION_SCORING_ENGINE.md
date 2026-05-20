# AHM Platform — Conviction Scoring Engine Architecture
## Sprint 6 Complete Architecture Reference

**Version:** 1.0.0  
**Engine Version:** SCORING_ENGINE_VERSION = '1.0.0'  
**Sprint:** 6 (complete)  
**Date:** 2026-05-20  

---

## 1. Purpose

The Conviction Scoring Engine produces a 0–100 conviction score for each PSX-listed company in the AHM system. The score is:
- **Deterministic:** Same inputs always produce the same output
- **Transparent:** Every sub-score, weight, and adjustment is logged with a notes trail
- **Bounded:** Four hard caps prevent inflated scores when structural risk conditions exist
- **Versioned:** Engine version is stored with every scored row — score history is always traceable to the exact algorithm

**What the score is NOT:**
- Not a buy/sell/hold recommendation
- Not a price target
- Not a return prediction
- Not a market timing signal

The conviction tier (HIGH_CONVICTION / MODERATE / WATCHLIST / MONITOR) describes relative positioning within the scoring framework — not an investment directive.

---

## 2. Architecture

```
DB (financial_ratio_snapshots, company_intelligence_blocks,
    sector_drivers, sector_macro_linkages, daily_prices,
    sectors, companies)
          │
          ▼ buildScoringInputs(symbol)  [lib/scoring/db.ts]
          │
    ScoringInputs  ──────────────────────────────────┐
          │                                           │
          ▼ buildPeerRanks(symbol, sectorSlug)        │
    SectorPercentileRanks                             │
          │                                           │
          └──────────┬────────────────────────────────┘
                     ▼
          computeConvictionScore(inputs, pctRanks)
          [lib/scoring/index.ts — PURE FUNCTION]
                     │
          ┌──────────▼───────────┐
          │  10 sub-score fns    │  [lib/scoring/sub-scores.ts]
          │  computeDataConfidence│  [lib/scoring/utils.ts]
          │  computeWeightedComposite│
          └──────────────────────┘
                     │
          ConvictionScoreResult
                     │
                     ▼
    DB (conviction_scores, conviction_sub_scores)
    Written by Edge Function fn-score-company
```

---

## 3. Phase 1 Sub-Score Weights

10 sub-scores, each 0–100 before weighting. Weights applied via `PHASE_1_WEIGHTS`:

| Sub-Score | Weight | Key Signals |
|---|---|---|
| Valuation | 20% | P/E (sector percentile), P/B, EV/EBITDA |
| Profitability | 18% | ROE (sector percentile), Net margin, ROCE |
| Growth | 15% | EPS growth, Revenue growth, PAT growth, 3Y EPS CAGR |
| Balance Sheet | 12% | Debt/Equity (sector percentile), Interest cover |
| Momentum | 10% | Sector driver sentiment, 30-day price trend |
| Macro Sensitivity | 8% | Active negative/positive macro drivers |
| Catalyst | 7% | Near/medium/long horizon catalysts (3x/1.5x/0.5x weighted) |
| Risk | 7% | High/medium/low severity risk counts (inverted) |
| Sector Relative Strength | 3% | Average of 6 sector percentile ranks |
| Technical Timing | 0% | Phase 1: always neutral 50, excluded from composite |

**Weights sum: 1.00 (verified)**

Technical Timing is reserved for Phase 2. Its function returns 50 with `confidence: 0.0`.

---

## 4. Hard Caps

Four hard caps prevent inflated scoring in the presence of known structural weaknesses. All caps are logged in the sub-score notes trail.

### Cap 1 — PAT Growth (growthScore, line 255)
**Trigger:** `pat_growth < 0`  
**Effect:** Growth sub-score capped at **35**  
**Rationale:** Negative earnings growth is a fundamental headwind; cannot score well on growth

### Cap 2 — Interest Cover (balanceSheetScore, line 282)
**Trigger:** `interest_cover < 1.5x`  
**Effect:** Balance sheet sub-score capped at **40** (computed from linear interpolation within [0, 1.5x])  
**Rationale:** A company struggling to cover its interest expense has a constrained balance sheet

### Cap 3 — Negative Macro Drivers (macroSensitivityScore, line 392)
**Trigger:** `active_negative_macro_drivers > 3`  
**Effect:** Macro sensitivity sub-score capped at **45**  
**Rationale:** Severe macro headwinds override positive positioning within that dimension

### Cap 4 — High Risk Count (riskScore, line 480)
**Trigger:** `risk_count_high >= 2`  
**Effect:** Risk sub-score capped at **25** (decreasing by 5 per additional high risk, floor of 10)  
**Rationale:** Two or more high-severity risks represent material, undiversifiable risk exposure

**Combined cap impact:** A company with all 4 caps active has a maximum composite score of ~73 — preventing HIGH_CONVICTION tier.

---

## 5. Data Confidence Multiplier

After computing the weighted composite, a data confidence multiplier is applied that pulls uncertain scores toward the neutral midpoint (50):

```
adjusted = composite × multiplier + 50 × (1 − multiplier)
```

| Condition | Multiplier |
|---|---|
| Data age > 270 days | 0.65 |
| ≥3 critical fields missing AND age > 180 days | 0.70 |
| ≥2 critical fields missing OR age > 180 days | 0.75 |
| 1 critical field missing OR age 90–180 days | 0.90 |
| All fields present, age < 90 days | 1.00 |

Critical fields: pe_ratio, pb_ratio, roe, net_margin, eps_growth, debt_to_equity, interest_cover (7 fields).

**Effect at multiplier 0.65:** Maximum achievable adjusted score = 82.5 (prevents HIGH_CONVICTION on stale data alone).

---

## 6. Conviction Tiers

| Tier | Score Range | Description |
|---|---|---|
| HIGH_CONVICTION | 75–100 | Strong multi-factor positioning |
| MODERATE | 55–74 | Positive but with notable constraints |
| WATCHLIST | 35–54 | Mixed signals — monitoring warranted |
| MONITOR | 0–34 | Material weaknesses or insufficient data |

---

## 7. Sector Normalisation

Several sub-scores use sector percentile ranks to compare a company against its sector peers rather than absolute thresholds. This prevents cross-sector distortion (e.g. a bank with PE 8x is not cheap by the same standard as a tech company with PE 8x).

`buildPeerRanks()` computes 6 percentile ranks:
- pe_rank (0=most expensive, 100=cheapest in sector)
- pb_rank
- roe_rank (0=lowest, 100=highest)
- net_margin_rank
- eps_growth_rank
- debt_eq_rank (0=most leveraged, 100=least leveraged)

`sectorRelativeStrengthScore` uses all available ranks and degrades confidence when sector_size < 5 companies.

---

## 8. Audit Trail

Every scored row in `conviction_sub_scores` contains:
- `raw_score`: 0–100 sub-score before weighting
- `weighted_score`: raw_score × weight
- `confidence`: 0–1 data availability confidence for this sub-score
- `notes_json`: array of strings explaining each scoring decision step-by-step
- `data_sources`: which DB fields contributed

When a hard cap fires, the cap is documented in `notes_json`:
- e.g. `"Hard floor applied: PAT growth -12.3% is negative, capping score at 35"`

This enables post-hoc audit of any company's score without re-running the algorithm.

---

## 9. Versioning

`SCORING_ENGINE_VERSION = '1.0.0'` is stored in every `conviction_scores` row and `conviction_score_history` row. If any sub-score calculation changes, the version must be incremented. Historical rows tagged with prior versions remain in the DB and are traceable to the exact algorithm that produced them.

---

## 10. File Map

```
lib/scoring/
  types.ts        — ScoringInputs, SectorPercentileRanks, ConvictionScoreResult,
                    SubScoreWeights, PHASE_1_WEIGHTS, PHASE_2_WEIGHTS,
                    TIER_THRESHOLDS, scoreToTier, SCORING_ENGINE_VERSION
  sub-scores.ts   — 10 sub-score functions (all pure)
  utils.ts        — clamp, minMaxNormalize, invertedMinMaxNormalize, percentileToScore,
                    computeDataConfidence, computeWeightedComposite
  db.ts           — buildScoringInputs, buildPeerRanks (DB reads)
  index.ts        — computeConvictionScore (pure entry point),
                    buildScoringInputs, buildPeerRanks (async DB delegates)

supabase/functions/
  fn-score-company/index.ts        — scores a single symbol
  fn-score-all-companies/index.ts  — batch scores all active companies
```

---

## 11. Phase 2 Roadmap

Phase 2 activates the Technical Timing sub-score by:
1. Populating `daily_prices.price_vs_200dma`, `trend_structure`, `volume_signal`
2. Updating `technicalTimingScore()` to compute from these fields
3. Switching from `PHASE_1_WEIGHTS` to `PHASE_2_WEIGHTS` (technical timing: 0.00 → 0.10)
4. Incrementing `SCORING_ENGINE_VERSION` to '2.0.0'

`PHASE_2_WEIGHTS` are already defined in `types.ts` and will shift weights modestly across all sub-scores when activated.
