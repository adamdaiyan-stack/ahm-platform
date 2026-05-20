# Sprint 6 — AI Output Quality Validation Report
## Prohibited Language Audit, Template Compliance, Quality Gate Coverage

**Sprint:** 6, Week 6  
**Date:** 2026-05-20  
**Scope:** Static audit of all prompt templates (027_seed_prompt_templates.sql), Edge Function substitution builders, and quality gate implementation (lib/ai/quality.ts, supabase/functions/_shared/ai-generator.ts)

---

## 1. Audit Methodology

Two complementary checks were performed:

**A. Static source scan:** All Edge Function TypeScript files were scanned with a Python regex tool matching the same 6 pattern families used by the runtime quality gate. Lines that are pattern *definitions* (inside regex literals, in the quality checker code itself) were excluded from findings.

**B. Template content review:** The full text of all 8 prompt templates (system_prompt + user_template fields) in migration 027 was manually reviewed for prohibited language, recommendation framing, price target language, invented figures, and promotional tone.

---

## 2. Static Source Scan Results

Files scanned:
- `supabase/functions/_shared/ai-generator.ts`
- `supabase/functions/_shared/alert-generator.ts`
- `supabase/functions/fn-generate-company-narrative/index.ts`
- `supabase/functions/fn-generate-sector-brief/index.ts`
- `supabase/functions/fn-generate-market-summary/index.ts`
- `lib/ai/quality.ts`
- `lib/ai/cache.ts`
- `lib/ai/whatsapp.ts`

**Findings summary:**

| File | Status | Notes |
|------|--------|-------|
| ai-generator.ts | CLEAN | Matches found only inside pattern-definition regex literals (lines 119–121) |
| alert-generator.ts | CLEAN | No prohibited terms in substitution builders or output strings |
| fn-generate-company-narrative/index.ts | CLEAN | No prohibited terms in context assembler or substitution formatters |
| fn-generate-sector-brief/index.ts | CLEAN | No prohibited terms |
| fn-generate-market-summary/index.ts | CLEAN | No prohibited terms |
| lib/ai/quality.ts | CLEAN | Matches found only inside PROHIBITED_PATTERNS array definitions (correct) |
| lib/ai/cache.ts | CLEAN | No prohibited terms |
| lib/ai/whatsapp.ts | CLEAN | No prohibited terms |

**False positive clarification:** The scanner found pattern strings in `ai-generator.ts` lines 119–121 and `quality.ts` lines 35, 40, 45, 55 — these are the scanner's own regex definitions (the list of things to detect), not instances of prohibited language being used. Both files are clean.

**Verdict: ALL FILES CLEAN ✓**

---

## 3. Prompt Template Audit — System Prompts

All 8 output types share an identical system prompt structure. The HARD CONSTRAINTS block is present and correctly worded in every template:

```
HARD CONSTRAINTS — NEVER VIOLATE:
1. You interpret structured data. You never generate conclusions from raw market prices 
   or financial statements directly.
2. Never use the words Buy, Sell, Hold, Accumulate, or any recommendation language.
3. Never state a price target. Never make return predictions.
4. Never invent financial figures. Every number cited must appear in your structured 
   context input.
5. Write in institutional prose. No bullet points in output. No promotional language.
6. If a data field shows null or unavailable, acknowledge the gap rather than estimate.
```

**Coverage matrix — hard constraint wording per template:**

| Template | Buy/Sell/Hold | No Price Target | No Invented Figures | Institutional Prose | Null Handling |
|----------|:---:|:---:|:---:|:---:|:---:|
| company_narrative | ✓ | ✓ | ✓ | ✓ | ✓ |
| conviction_interpretation | ✓ | ✓ | ✓ | ✓ | ✓ |
| risk_summary | ✓ | ✓ | ✓ | ✓ | ✓ |
| catalyst_summary | ✓ | ✓ | ✓ | ✓ | ✓ |
| peer_comparison | ✓ | ✓ | ✓ | ✓ | ✓ |
| sector_brief | ✓ | ✓ | ✓ | ✓ | ✓ |
| market_summary | ✓ | ✓ | ✓ | ✓ | ✓ |
| alert_summary | ✓ | ✓ | ✓ | ✓ | ✓ |

**Verdict: SYSTEM PROMPTS FULLY COMPLIANT ✓**

---

## 4. Prompt Template Audit — User Templates

Each template's user_template was reviewed for framing that could elicit prohibited output.

### 4.1 company_narrative
Instructs: *"Write as a senior analyst explaining this company to a portfolio manager"*. No recommendation framing. Substitutions passed: conviction score (numerical), sub-scores, intel blocks, financial ratios. No price target fields. No return projection fields.

**Verdict: COMPLIANT ✓**

### 4.2 conviction_interpretation
Instructs: *"Write a 2-sentence institutional interpretation of what this score means and why it sits at this level. Do not use the word 'conviction' in your output — describe the underlying quality instead."* Explicitly suppresses the word "conviction" from output, preventing language like "high conviction buy." Substitutions are numerical scores only.

**Verdict: COMPLIANT ✓**

### 4.3 risk_summary
Instructs: *"Note if risks are structural or cyclical in nature. Do not soften or overstate — write with the clarity of an institutional research note."* No directional framing. No action language.

**Verdict: COMPLIANT ✓**

### 4.4 catalyst_summary
Instructs: *"Do not frame catalysts as trading triggers — frame them as developments that would validate or invalidate the investment thesis."* Explicitly converts catalyst language from action-triggering to thesis-analytical.

**Verdict: COMPLIANT ✓**

### 4.5 peer_comparison
Instructs: *"Explain what premium or discount [company] trades at relative to sector peers, and what fundamental factors justify that positioning."* Relative valuation framing only — no absolute price targets.

**Verdict: COMPLIANT ✓**

### 4.6 sector_brief
Instructs: *"Conclude with what investors should monitor over the next 4–8 weeks."* Monitoring language, not action language.

**Verdict: COMPLIANT ✓**

### 4.7 market_summary
The `{{format}}` substitution drives either LONG (4 paragraphs) or SHORT (3–4 sentences) output. SHORT format explicitly noted as *"Plain text only — no markdown."* No price level targets. The market data substitutions (KSE-100 level, volume) are descriptive inputs, not outputs to be extrapolated.

**Verdict: COMPLIANT ✓**

### 4.8 alert_summary
Instructs: *"Do not frame it as a call to action. Do not make predictions."* Maximum 50 words. Substitutions: event_type, reference_display, event_data_summary, severity — all factual/descriptive.

**Verdict: COMPLIANT ✓**

---

## 5. Quality Gate Implementation Audit

### 5.1 Pattern Coverage (lib/ai/quality.ts)

Six pattern families are checked at runtime against every generated output:

| Pattern Name | Regex | Severity | Coverage |
|---|---|---|---|
| buy_sell_hold | `\b(buy\|sell\|hold\|accumulate\|reduce\|avoid\|exit\|enter)\b` | failed | 8 verbs |
| price_target | `\b(price target\|fair value\|target price\|intrinsic value\|upside of\|downside of)\b` | failed | 6 phrases |
| return_prediction | `\b(will return\|expected return\|return of \d\|gain of \d\|upside potential of \d+%)\b` | failed | 5 patterns |
| pkr_price_target | `PKR\s+\d[\d,.]*` | warning | PKR amounts (context-reviewed) |
| promotional_superlatives | `\b(best\|top pick\|strong buy\|outperform\|conviction buy\|highly recommend)\b` | failed | 6 phrases |
| placeholder_text | `\[data unavailable\]\|\[insert\]\|\[tbd\]\|\[placeholder\]\|{{[^}]+}}` | failed | Unrendered templates |

**pkr_price_target exception:** Correctly configured as `warning` rather than `failed`. PKR amounts appear legitimately in conviction_interpretation context (e.g., "market cap of PKR 350bn"). This requires human review, not automatic rejection.

### 5.2 Length Bounds Audit

Checked against LENGTH_BOUNDS in lib/ai/quality.ts:

| Output Type | Min Words | Max Words | System Prompt Instruction | Aligned? |
|---|---|---|---|---|
| company_narrative | 200 | 1200 | "200–280 words" | ✓ (prompt tighter than bound) |
| conviction_interpretation | 50 | 350 | "exactly 2 sentences" | ✓ |
| risk_summary | 80 | 500 | "80–140 words" | ✓ |
| catalyst_summary | 80 | 500 | "80–140 words" | ✓ |
| peer_comparison | 100 | 700 | "120–180 words" | ✓ |
| sector_brief | 200 | 1500 | "200–280 words" | ✓ |
| market_summary | 150 | 1800 | "250–350 words (long)" | ✓ |
| alert_summary | 20 | 250 | "maximum 50 words" | ✓ |

**Note:** The quality gate bounds are wider than the system prompt instructions in all cases. This is intentional — the gate catches extreme failures (too short = incomplete, too long = runaway generation) while the system prompt enforces the tighter stylistic target.

### 5.3 Overall Status Logic

From lib/ai/quality.ts lines 140–143:
```typescript
const overall_status: 'passed' | 'warning' | 'failed' =
  hasFailed  ? 'failed'  :
  hasWarning ? 'warning' :
  'passed';
```

`requires_review` is set to `true` when overall_status is `failed` OR when a `pkr_price_target` warning fires — regardless of whether any other check failed. This correctly flags PKR amounts for human review without blocking the output.

### 5.4 Quality Gate Position in Generation Pipeline

From `supabase/functions/_shared/ai-generator.ts`: Quality checks run **after** the Claude API call and **before** the output is written to `ai_outputs`. The `quality_status` field is written with each row. A `failed` output is still stored (for auditability) but the quality flag ensures it is not silently served as if it passed.

**Verdict: QUALITY GATE CORRECTLY IMPLEMENTED ✓**

---

## 6. What the Runtime Gate Cannot Catch

The following require human review of actual generated outputs (not addressable by static audit):

| Gap | Reason |
|-----|--------|
| Subtle directional framing ("the stock faces headwinds that suggest caution") | Pattern matching cannot detect implied tone |
| Invented figures that look plausible (hallucinated ratios) | Requires cross-checking AI output against input snapshot |
| Excessively promotional tone without trigger words | "Best positioned to benefit" won't fire buy_sell_hold |
| PKR amounts that are price targets vs context ratios | Requires human judgment — correctly flagged as warning, not auto-failed |

These gaps are by design. The quality gate catches hard violations. Tone and invented-figure detection require periodic human review of `ai_outputs` rows with `quality_status = 'passed'`.

---

## Summary

| Check | Status |
|-------|--------|
| Static source scan — 8 files | ✓ ALL CLEAN |
| System prompt hard constraints — 8 templates | ✓ ALL PRESENT |
| User template framing review — 8 templates | ✓ ALL COMPLIANT |
| Quality gate pattern coverage | ✓ 6 PATTERN FAMILIES |
| Length bounds vs system prompt alignment | ✓ ALIGNED (gate wider than prompt) |
| pkr_price_target as warning not failed | ✓ CORRECTLY TIERED |
| requires_review logic | ✓ CORRECTLY WIRED |
| Quality gate position in pipeline | ✓ POST-GENERATION, PRE-WRITE |

No corrections required. Periodic human review of `ai_outputs` recommended for subtle tone drift.
