# AHM Platform — AI Intelligence Layer Architecture
## Sprint 6 Complete Architecture Reference

**Version:** 1.0.0  
**Sprint:** 6 (complete)  
**Date:** 2026-05-20  

---

## 1. Purpose and Scope

The AI Intelligence Layer generates, caches, and serves institutional-grade analytical prose derived from structured scoring outputs and curated intelligence blocks. It wraps Claude Sonnet 4.6 in a strictly controlled pipeline that enforces:

- No Buy/Sell/Hold or recommendation language in any output
- No price targets or return predictions
- No invented financial figures (LLM receives only validated DB data)
- Deterministic caching with SHA-256 change detection
- Full auditability of every generation (prompt version, input hash, token counts, quality checks)

**What the AI layer is NOT:**
- Not a chatbot or interactive assistant
- Not a research engine that reads raw financial statements
- Not a price prediction system

---

## 2. Data Flow

```
DB (conviction_scores, conviction_sub_scores,
    intelligence_blocks, sector_drivers,
    sector_macro_drivers, financial_ratios)
          │
          ▼
    Edge Function (assembleContext)
          │
          ▼
    _shared/ai-generator.ts
    ┌─────────────────────────────────────────┐
    │ 1. Load active prompt template           │
    │ 2. Render template ({{substitutions}})  │
    │ 3. Compute input_hash (SHA-256)         │
    │ 4. Cache check (is_current + TTL)       │
    │ 5. Claude Sonnet 4.6 API call           │
    │ 6. Quality checks (6 pattern families)  │
    │ 7. Retire prior row (is_current=false)  │
    │ 8. Insert new ai_outputs row            │
    │ 9. Log to ai_quality_checks             │
    └─────────────────────────────────────────┘
          │
          ▼
    ai_outputs (Postgres)
          │
          ▼
    Next.js Server Components
    (getCachedOutput → render)
```

---

## 3. Output Types and Ownership

| Output Type | Edge Function | TTL | Reference Key |
|---|---|---|---|
| company_narrative | fn-generate-company-narrative | 72h | symbol (e.g. "ENGRO") |
| conviction_interpretation | fn-generate-company-narrative | 48h | symbol |
| risk_summary | (future) | 48h | symbol |
| catalyst_summary | (future) | 48h | symbol |
| peer_comparison | (future) | 168h | symbol |
| sector_brief | fn-generate-sector-brief | 168h | sector_slug |
| market_summary | fn-generate-market-summary | 24h | snapshot_type:date |
| alert_summary | fn-generate-alert / fn-process-event-triggers | 48h (no cache) | event:symbol:timestamp |

---

## 4. Caching Architecture

### 4.1 Cache Key

Each output is uniquely identified by `(output_type, reference_key)`. The DB partial unique index on `ai_outputs` enforces a single `is_current = true` row per key:

```sql
CREATE UNIQUE INDEX ai_outputs_current_idx
  ON ai_outputs (output_type, reference_key)
  WHERE is_current = true;
```

### 4.2 Cache Hit Logic

A cache hit requires BOTH conditions to be true:
1. `valid_until > now()` (TTL not expired)
2. `input_hash == computeInputHash(currentInputSnapshot)` (data unchanged)

If either fails, generation proceeds and the prior row is retired.

### 4.3 Input Hash

SHA-256 of `JSON.stringify(sortKeysDeep(inputSnapshot))`. Keys are sorted recursively so insertion order does not affect the hash. The same algorithm is implemented in both Node.js (lib/ai/cache.ts) and Deno (ai-generator.ts) using their respective crypto APIs, producing identical digests.

### 4.4 Row Lifecycle

```
[pending]      → Edge Function assembles context
[active]       → is_current=true, valid_until in future, quality_status=passed|warning|failed
[cache-hit]    → served from DB, no API call, promptTokens=0
[ttl-expired]  → is_current set to false by lazy invalidation; next read triggers regeneration
[superseded]   → is_current=false, replaced by newer generation (input changed)
[invalidated]  → is_current=false, invalidation_reason set (prompt_version_bump, manual, etc.)
```

Historical rows are never deleted — they form the full audit trail.

---

## 5. Prompt Template System

### 5.1 Storage

Templates live in `ai_prompt_templates` (Postgres). The DB enforces one active template per output type:

```sql
CREATE UNIQUE INDEX ai_prompt_templates_active_idx
  ON ai_prompt_templates (prompt_type)
  WHERE is_active = true;
```

### 5.2 Template Structure

Every template has:
- `system_prompt`: Analyst persona + 6 hard constraints (never Buy/Sell/Hold, no price targets, etc.)
- `user_template`: Context injection using `{{variable}}` placeholders
- `variables`: JSON array of expected substitution keys
- `model_target`, `max_tokens`, `temperature`: per-type generation config
- `version`: semver (e.g. "1.0.0") — must increment on any change

### 5.3 Template Updates

1. INSERT new row with bumped version and `is_active = true`
2. UPDATE prior version to `is_active = false, deprecated_at = now()`
3. Call `invalidateByPromptVersion(outputType, oldVersion)` to force regeneration

**Warning:** Skipping step 3 means old outputs continue to be served until TTL expiry.

### 5.4 Variable Safety

`renderTemplate()` throws `Error` if any `{{variable}}` placeholder remains unreplaced after substitution. This prevents partial-context prompts from reaching Claude.

---

## 6. Quality Gate

All generated text passes through `runQualityChecks()` before being stored:

| Pattern | Type | Action |
|---|---|---|
| buy_sell_hold | Regex (8 verbs) | failed |
| price_target | Regex (6 phrases) | failed |
| return_prediction | Regex (5 patterns) | failed |
| promotional_superlatives | Regex (6 phrases) | failed |
| placeholder_text | Regex (unrendered `{{var}}`) | failed |
| pkr_price_target | Regex (PKR + digits) | warning |
| length | Word count vs bounds | warning |

Results are stored in `ai_quality_checks` (linked to `ai_outputs.id`) and in `ai_outputs.content.quality_status`. A `failed` output is stored for auditability but should be regenerated.

---

## 7. Market Snapshots

Market summaries use a separate table `ai_market_snapshots` (migration 025) rather than `ai_outputs`, because they have additional dimensions: `snapshot_date` and `format` (long/short).

`fn-generate-market-summary` generates both long and short forms for each snapshot_type (pre_market, market_open, market_close, eod_summary). Each write retires the prior `is_current` row for that `(snapshot_date, snapshot_type, format)` tuple before inserting the new one.

---

## 8. AI Layer File Map

```
lib/ai/
  types.ts          — AIOutputType, AIOutput, AIPromptTemplate, DEFAULT_TTL_HOURS
  cache.ts          — getCachedOutput, writeOutput, invalidateOutput, loadPromptTemplate,
                      computeInputHash, computePromptHash, renderTemplate
  quality.ts        — runQualityChecks, QualityReport, PROHIBITED_PATTERNS, LENGTH_BOUNDS
  whatsapp.ts       — formatWhatsApp, getLatestWhatsAppSummary, getWhatsAppHistory
  index.ts          — barrel export

supabase/functions/
  _shared/ai-generator.ts    — Deno generate() — core generation pipeline
  _shared/alert-generator.ts — generateAlertText() — alert-specific substitution + generate()
  fn-generate-company-narrative/index.ts
  fn-generate-sector-brief/index.ts
  fn-generate-market-summary/index.ts
  fn-generate-alert/index.ts
  fn-process-event-triggers/index.ts

components/ai/
  AIOutputPanel.tsx          — base UI for any AI text output
  AICompanyNarrative.tsx     — company_narrative + conviction_interpretation
  AISectorBrief.tsx          — sector_brief
  AIMarketSnapshot.tsx       — market snapshot (server component)
  AIMarketSnapshotClient.tsx — expand/collapse + WhatsApp copy (client component)

components/alerts/
  AlertsFeed.tsx     — server component, alert query routing
  AlertCard.tsx      — single alert card with severity styling
  index.ts           — barrel export

services/api/
  alerts.ts    — getActiveAlerts, getAlertsBySymbol, getAlertsBySector,
                 getUnreadAlertCount, markAlertRead, markAllReadForKey
```

---

## 9. Deno / Node.js Coexistence

The AI layer spans two runtimes:
- **Next.js (Node.js):** `lib/ai/`, `services/api/`, `components/ai/` — uses Node.js `crypto`, `@/` path aliases, `import from`
- **Supabase Edge Functions (Deno):** `supabase/functions/` — uses Web Crypto API, `npm:` imports, `Deno.env.get()`

`tsconfig.json` excludes `supabase/` from TypeScript compilation. Edge Functions are self-contained — no shared code with the Next.js layer (types are re-declared inline). The hash algorithms are identical in both environments.
