# Sprint 6 — Cache and Hash Validation Report
## Input Hash Determinism, TTL Consistency, Cache Hit Logic, DB Constraints

**Sprint:** 6, Week 6  
**Date:** 2026-05-20  
**Scope:** Static audit of lib/ai/cache.ts, lib/ai/types.ts, supabase/functions/_shared/ai-generator.ts, and migration 024_ai_outputs.sql

---

## 1. Input Hash Algorithm

The input hash is used for cache change detection: if the current cached row's `input_hash` matches the computed hash of the new input snapshot, and the TTL is still valid, generation is skipped.

### Algorithm (identical in both layers)

Both the Next.js layer (`lib/ai/cache.ts`, `computeInputHash()`) and the Deno Edge Function layer (`supabase/functions/_shared/ai-generator.ts`, `computeInputHash()`) implement the same algorithm:

```
sortKeysDeep(inputSnapshot)        -- recursive, lexicographic key sort
→ JSON.stringify(sorted)           -- canonical JSON with no insertion-order variance
→ SHA-256(canonical_json)          -- hex-encoded digest
```

`sortKeysDeep()` is implemented identically in both layers:
- Arrays: recursively sort each element's children (array order preserved, sub-object keys sorted)
- Objects: `Object.entries().sort([a],[b] => a.localeCompare(b)).map([k,v] => [k, sortKeysDeep(v)])`
- Primitives: returned as-is

**Cross-layer consistency note:** The Next.js layer uses Node.js `crypto.createHash('sha256')`. The Deno layer uses Web Crypto API `crypto.subtle.digest('SHA-256', ...)`. Both produce identical hex-encoded SHA-256 digests given the same input string.

**Verdict: INPUT HASH DETERMINISTIC AND CROSS-LAYER CONSISTENT ✓**

---

## 2. Prompt Hash

`computePromptHash(systemPrompt, userPrompt)` applies SHA-256 to `systemPrompt + '\n---\n' + userPrompt`. This is stored in `ai_outputs.prompt_hash` for audit purposes.

The prompt hash is **not** used in cache hit logic — it is stored only. Cache hits are determined by `input_hash` alone. This is intentional: a prompt version bump requires explicit `invalidateByPromptVersion()` to clear the cache. Without calling this, old outputs generated with the prior prompt template continue to be served until their TTL expires.

**Known behaviour:** If a prompt is updated to v1.1.0 but `invalidateByPromptVersion()` is not called, the old output continues to be served until TTL expiry. To force immediate regeneration after a prompt update, `invalidateByPromptVersion(outputType, oldVersion)` must be called as part of the deployment procedure.

**Verdict: PROMPT HASH STORED CORRECTLY — INVALIDATION IS MANUAL ✓ (documented)**

---

## 3. Cache Hit Logic

### Edge Function Layer (ai-generator.ts, lines 186–214)

```typescript
if (!forceRegenerate) {
  const { data: cached } = await db
    .from('ai_outputs')
    .select('id,raw_text,input_hash,valid_until,content')
    .eq('output_type', outputType)
    .eq('reference_key', referenceKey)
    .eq('is_current', true)
    .single();

  if (cached) {
    const stillValid = !cached.valid_until || new Date(cached.valid_until) > new Date();
    const unchanged  = cached.input_hash === inputHash;

    if (stillValid && unchanged) {
      return { ..., fromCache: true, skipped: true, skipReason: 'input_unchanged' };
    }
  }
}
```

**Logic analysis:**

| Condition | Outcome |
|-----------|---------|
| No `is_current` row found | → Generate (cache miss) |
| `is_current` row found, TTL expired, input unchanged | → Generate (TTL miss) |
| `is_current` row found, TTL valid, input changed | → Generate (input changed) |
| `is_current` row found, TTL valid, input unchanged | → Serve from cache (hit) |
| `forceRegenerate = true` | → Always generate, skip cache check entirely |

**Verdict: CACHE HIT LOGIC CORRECT ✓**

### Next.js Layer (lib/ai/cache.ts, getCachedOutput())

```typescript
const { data, error } = await supabase
  .from('ai_outputs')
  .select('*')
  .eq('output_type', outputType)
  .eq('reference_key', referenceKey)
  .eq('is_current', true)
  .single();

// In-process TTL check
if (data.valid_until && new Date(data.valid_until) < new Date()) {
  await invalidateOutput(outputType, referenceKey, 'ttl_expired').catch(() => {});
  return null;
}
```

The Next.js layer reads the cache directly without computing input hashes — it just returns whatever the current row is. The regeneration decision is made by the Edge Function. This is the correct pattern: Next.js reads, Edge Functions write.

**Lazy invalidation:** When an expired row is found in Next.js context, `invalidateOutput()` is called to set `is_current = false` before returning `null`. This ensures the DB stays consistent without requiring a background job to catch every case.

**Verdict: NEXT.JS READ LAYER CORRECT ✓**

---

## 4. TTL Values — Dual-Layer Consistency

TTL values are defined in two places:
- `lib/ai/types.ts` → `DEFAULT_TTL_HOURS` (used by Next.js layer for `writeOutput()`)
- `supabase/functions/_shared/ai-generator.ts` → `TTL_HOURS` (used by Edge Functions)

**Comparison result (verified by script):**

| Output Type | lib/ai/types.ts | ai-generator.ts | Match |
|---|---|---|---|
| company_narrative | 72h | 72h | ✓ |
| conviction_interpretation | 48h | 48h | ✓ |
| risk_summary | 48h | 48h | ✓ |
| catalyst_summary | 48h | 48h | ✓ |
| peer_comparison | 168h | 168h | ✓ |
| sector_brief | 168h | 168h | ✓ |
| market_summary | 24h | 24h | ✓ |
| alert_summary | 48h | 48h | ✓ |

**Verdict: TTL VALUES CONSISTENT ACROSS BOTH LAYERS ✓**

---

## 5. Row Retirement Logic

When a new output is generated, the prior `is_current = true` row is retired before inserting the new one. In the Edge Function layer (ai-generator.ts, lines 246–251):

```typescript
await db
  .from('ai_outputs')
  .update({ is_current: false })
  .eq('output_type', outputType)
  .eq('reference_key', referenceKey)
  .eq('is_current', true);
```

Then the new row is inserted with `is_current: true`.

**Verdict: RETIREMENT LOGIC CORRECT ✓**

---

## 6. Database Constraint — Single Current Row Guarantee

Migration 024_ai_outputs.sql defines:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS ai_outputs_current_idx
  ON ai_outputs (output_type, reference_key)
  WHERE is_current = true;
```

This partial unique index enforces at the DB level that only one row per `(output_type, reference_key)` pair can have `is_current = true`. This is the critical safety constraint that prevents the following race condition:

**Without the constraint:** Two concurrent Edge Function invocations for the same symbol could both pass the cache check (neither sees the other's write), both retire the current row, and both insert `is_current = true` — leaving two current rows.

**With the constraint:** The second insert fails with a unique constraint violation. The first writer wins; the second raises an error and can retry.

**Verdict: CONCURRENCY SAFETY ENFORCED AT DB LEVEL ✓**

---

## 7. Prompt Template Constraint — Single Active Template

Migration 024_ai_outputs.sql also defines:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS ai_prompt_templates_active_idx
  ON ai_prompt_templates (prompt_type)
  WHERE is_active = true;
```

This ensures only one active template per `prompt_type` at any time. When deploying a new template version, the prior version must be set `is_active = false` before or in the same transaction as the new version being set `is_active = true`. The seed migration uses `ON CONFLICT (prompt_type, version) DO NOTHING`, which is safe for re-runs.

**Verdict: TEMPLATE UNIQUENESS ENFORCED AT DB LEVEL ✓**

---

## 8. Alert Summary forceRegenerate

`alert-generator.ts` always sets `forceRegenerate: true` when calling `generate()`. This means:

- The cache check (step 4 in the generator) is bypassed entirely
- A new Claude API call is made for every alert event
- A new `ai_outputs` row is inserted, with the prior row retired
- The `reference_key` includes a minute-level timestamp: `eventType:symbol:2026-05-20T14-32`

**Why forceRegenerate:** Alerts are triggered by discrete events. The same symbol may have multiple alerts within a single TTL window (e.g., a tier upgrade and a new high-severity risk in the same day). If cache were used, the second alert would serve the first alert's text. Using `forceRegenerate` with a timestamped reference key ensures each event gets its own fresh, accurate output row.

**Trade-off:** Every alert event costs one Claude API call. For the current alert volume, this is acceptable. If alert volume grows significantly, a batch-generation pattern should be considered.

**Verdict: ALERT CACHE BYPASS CORRECTLY DESIGNED ✓**

---

## 9. renderTemplate Safety

`renderTemplate()` in both layers throws if any `{{variable}}` placeholder remains after substitution:

```typescript
const unresolved = out.match(/\{\{[^}]+\}\}/g);
if (unresolved) {
  throw new Error(`renderTemplate: unresolved variables: ${unresolved.join(', ')}`);
}
```

This prevents partial renders from reaching the Claude API — a template with unresolved placeholders would produce confused or hallucinated output that might fabricate figures for the missing context.

**Verdict: TEMPLATE SAFETY CHECK CORRECTLY IMPLEMENTED ✓**

---

## Summary

| Check | Status |
|-------|--------|
| Input hash algorithm — deterministic | ✓ PASS |
| Input hash — cross-layer consistent (Node vs Web Crypto) | ✓ PASS |
| Prompt hash stored for audit | ✓ PASS |
| Prompt hash NOT used in cache hit logic | ✓ PASS (by design) |
| Cache hit logic — dual-condition (TTL + input_hash) | ✓ PASS |
| Cache bypass — forceRegenerate for alerts | ✓ PASS |
| TTL values — 8 types, both layers identical | ✓ PASS (all match) |
| Row retirement before insert | ✓ PASS |
| DB partial unique index — single current row | ✓ PASS |
| DB partial unique index — single active template | ✓ PASS |
| renderTemplate — throws on unresolved placeholders | ✓ PASS |
| Lazy TTL invalidation in Next.js layer | ✓ PASS |

**Known gap requiring operational discipline:** Prompt version bumps require calling `invalidateByPromptVersion()` to force regeneration. This is not automated. Recommend adding this to the deployment runbook.
