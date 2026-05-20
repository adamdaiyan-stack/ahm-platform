# Sprint 6 — Performance and Graceful Degradation Validation Report
## Cache Serving, Null Safety, Error Boundaries, Page Load Impact

**Sprint:** 6, Week 6  
**Date:** 2026-05-20  
**Scope:** Static audit of all AI server components, alert service layer, and market snapshot component

---

## 1. Graceful Degradation Strategy

The AHM Platform uses a read-only rendering model for all AI components: Next.js server components read from the cache (`ai_outputs`, `ai_market_snapshots`, `alerts`); Edge Functions write. This means:

**No AI component ever blocks page rendering on a Claude API call.** If no cached output exists, the component degrades gracefully. If the DB call fails, the component degrades to null (silent absence) rather than throwing an error that would crash the page.

---

## 2. Component-Level Degradation Audit

### 2.1 AICompanyNarrative (components/ai/AICompanyNarrative.tsx)

```typescript
const [narrative, conviction] = await Promise.all([
  getCachedOutput('company_narrative',        sym).catch(() => null),
  getCachedOutput('conviction_interpretation', sym).catch(() => null),
]);

if (!narrative && !conviction) {
  return (
    <div ...>
      <p>AI-generated company intelligence for {sym} will appear here once the first
      scoring run completes.</p>
    </div>
  );
}
```

**Degradation levels:**
1. DB error → `.catch(() => null)` → both null → renders informative pending state
2. No cached output → both null → same pending state
3. One output missing → renders the available one, silently omits the missing one
4. Both outputs present → full render

**User experience when absent:** A tasteful bordered panel with explanatory text. Not an error. Not a blank gap.

**Verdict: GRACEFUL DEGRADATION CORRECT ✓**

---

### 2.2 AISectorBrief (components/ai/AISectorBrief.tsx)

```typescript
const brief = await getCachedOutput('sector_brief', sectorSlug).catch(() => null);
if (!brief) return null;
```

**Degradation:** Silent absence — returns `null` which renders nothing. The sector page layout is not affected; the analyticsSlot simply has one fewer element.

**Verdict: GRACEFUL DEGRADATION CORRECT ✓**

---

### 2.3 AIMarketSnapshot (components/ai/AIMarketSnapshot.tsx)

```typescript
const [longRes, shortRes] = await Promise.all([
  supabase.from('ai_market_snapshots')...
    .single<MarketSnapshotRow>(),
  // ...
]);

return {
  long:  longRes.data  ?? null,
  short: shortRes.data ?? null,
};
```

The component uses `?? null` on Supabase results, handling both missing rows (PGRST116) and network errors. Downstream: the `AIMarketSnapshotClient` receives nullable props and renders a pending state when null.

**Verdict: GRACEFUL DEGRADATION CORRECT ✓**

---

### 2.4 AlertsFeed (components/alerts/AlertsFeed.tsx)

```typescript
try {
  alerts = await getActiveAlerts(limit);
} catch {
  return null; // Never break the page
}

if (!alerts.length) return null;
```

**Degradation levels:**
1. DB error → `catch` → returns null → no alerts shown, page loads normally
2. No active alerts → `!alerts.length` → returns null → clean
3. Alerts present → renders AlertCard components

**Comment in source:** `// Never break the page` — explicitly designed as a safe no-op on failure.

**Verdict: GRACEFUL DEGRADATION CORRECT ✓**

---

## 3. Alert Service Layer — Expiry Filtering Audit

From `services/api/alerts.ts`, all three alert query functions apply the same expiry and activity filters:

```typescript
.eq('is_active', true)
.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
```

**Analysis:**
- `is_active = true` filters permanently deactivated alerts (e.g., manually suppressed)
- `expires_at IS NULL` handles alerts with no expiry (no TTL set — treated as permanent)
- `expires_at > now()` filters expired alerts without requiring a background job to flip `is_active`

This is a **lazy expiry** pattern — expired rows remain in the table with `is_active = true`, but are excluded at query time. This is consistent with the lazy TTL invalidation pattern used in the AI output cache.

**Audience filtering (not yet applied):** `getActiveAlerts()` does not filter by `audience`. This means `company_scored` alerts (audience: 'internal') would appear in the market dashboard feed. This is a gap to confirm against product requirements — if internal alerts should not be shown in the public feed, a `.neq('audience', 'internal')` filter is needed.

**Verdict: EXPIRY FILTERING CORRECT ✓ (audience filtering gap noted)**

---

## 4. Performance Characteristics

### 4.1 Page Load Impact — AI Components

All AI components are Next.js server components that execute DB reads at request time. The reads are:
- Single-row lookups: `(output_type, reference_key, is_current=true)` — covered by the partial unique index `ai_outputs_current_idx`
- `Promise.all()` parallelism in AICompanyNarrative (two reads in parallel)
- `Promise.all()` parallelism in AIMarketSnapshot (two reads in parallel)

**Expected latency:** A single indexed row lookup on Supabase (< 1ms network + < 1ms DB). Two parallel lookups via `Promise.all()`: effectively the latency of the slower one.

**DB load:** Read-only, indexed, single-row per component. No table scans. No joins in the component layer.

**Verdict: READ PATTERN ACCEPTABLE FOR PRODUCTION LOAD ✓**

### 4.2 Edge Function Generation Latency

AI generation is entirely out-of-band from page rendering. No page ever waits for a Claude API call. Generation times (estimated from typical Claude Sonnet 4.6 response times):

| Output Type | Estimated Generation Time | Frequency |
|---|---|---|
| company_narrative | 3–8s | Per scoring run change (72h TTL) |
| conviction_interpretation | 1–3s | Per scoring run change (48h TTL) |
| sector_brief | 4–10s | Weekly (168h TTL) |
| market_summary (long) | 5–12s | Daily (24h TTL) |
| market_summary (short) | 2–5s | Daily (24h TTL) |
| alert_summary | 1–3s | Per event (no cache) |

**Impact on users:** Zero. All generation is async and cached.

### 4.3 Alert Processing Throughput

`fn-process-event-triggers` runs every 5 minutes, batch of 20. With sequential processing and ~3s average per alert:

- Per invocation: up to 20 × ~3s = ~60s of Claude API calls
- Edge Function time limit: 150s (Supabase Edge Functions limit)
- Remaining headroom: ~90s — sufficient for current load

**Risk trigger:** If alert volume spikes to 30+ events in a 5-minute window, the batch of 20 may not drain fast enough to prevent the queue from growing. Mitigation: increase batch limit or switch to parallel processing when volume warrants it.

---

## 5. Cache Serving — Performance Benefit

When a cached output is served (cache hit), the Edge Function returns immediately without a Claude API call:

```typescript
if (stillValid && unchanged) {
  return {
    outputId:         cached.id,
    rawText:          cached.raw_text,
    fromCache:        true,
    skipped:          true,
    promptTokens:     0,   // no API call
    completionTokens: 0,
    generationMs:     0,
  };
}
```

**Cost reduction:** Cache hits incur zero Claude API tokens. With TTLs of 48–168 hours, the vast majority of reads in steady state will be cache hits.

**Expected cache hit rate in steady state:** >95% (given 72h TTL for company_narrative and low conviction score change frequency).

---

## Summary

| Check | Status |
|-------|--------|
| AICompanyNarrative — DB error → null, no page crash | ✓ PASS |
| AICompanyNarrative — no cache → informative pending state | ✓ PASS |
| AISectorBrief — no cache → silent null | ✓ PASS |
| AIMarketSnapshot — no cache → null handled | ✓ PASS |
| AlertsFeed — DB error → null, catch block present | ✓ PASS |
| AlertsFeed — no alerts → clean null return | ✓ PASS |
| Alert expiry filtering — is_active + expires_at | ✓ PASS |
| Alert null-expiry handling (expires_at IS NULL) | ✓ PASS |
| AI components read-only — no page-blocking Claude calls | ✓ PASS |
| DB reads indexed — partial unique index on current row | ✓ PASS |
| Promise.all() parallelism in multi-read components | ✓ PASS |

**Gap requiring product decision:** `getActiveAlerts()` does not filter by `audience`. Internal-audience alerts (company_scored) may appear in the public feed. Confirm whether this is acceptable or add `.neq('audience', 'internal')` filter.
