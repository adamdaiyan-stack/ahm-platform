# Sprint 6 — Alert System Validation Report
## Suppression Logic, Retry Behaviour, Alert Config Consistency, Wording Audit

**Sprint:** 6, Week 6  
**Date:** 2026-05-20  
**Scope:** Static audit of fn-process-event-triggers/index.ts, fn-generate-alert/index.ts, _shared/alert-generator.ts, migration 025_ai_events_alerts.sql (should_suppress_event), and migration 030_event_trigger_postgres_triggers.sql

---

## 1. Event Trigger Pipeline Overview

```
DB Postgres triggers (migration 030)
  → ai_event_triggers table (status: 'pending')
  → fn-process-event-triggers (cron: */5 * * * *)
      → should_suppress_event() [DB function]
      → _shared/alert-generator.ts → generateAlertText()
      → alerts table (status: 'complete')
```

Alerts can also be generated on demand via `fn-generate-alert` (POST with event_trigger_id or event_type + event_data), bypassing the cron queue.

---

## 2. Suppression Logic Audit

### 2.1 DB Function: should_suppress_event()

```sql
SELECT EXISTS (
  SELECT 1
  FROM ai_event_triggers
  WHERE reference_key = p_reference_key
    AND event_type    = p_event_type
    AND status        IN ('complete', 'processing')
    AND triggered_at  > now() - (p_window_hours || ' hours')::interval
);
```

**Logic analysis:**

- Suppression is checked per `(reference_key, event_type)` pair — not globally per event_type. A tier upgrade for MCB does not suppress a tier upgrade for ENGRO.
- Both `'complete'` and `'processing'` statuses are counted. A currently-processing event prevents a duplicate from running concurrently.
- The suppression window is time-based (`triggered_at > now() - window`), using the event creation time rather than the processing time. This is conservative — an event queued but not yet processed still holds the suppression window.
- `'suppressed'` and `'failed'` status rows do NOT hold the suppression window. A previously failed alert attempt does not prevent the next attempt.
- `'pending'` status does NOT hold the window. Multiple pending events for the same (reference_key, event_type) can queue up, but only the first to reach 'processing' will suppress subsequent ones.

**Suppression window values (fn-process-event-triggers):**

| Event Type | Window |
|---|---|
| conviction_tier_upgrade | 24h |
| conviction_tier_downgrade | 24h |
| sector_driver_turned_negative | 48h |
| sector_driver_turned_positive | 48h |
| high_severity_risk_added | 72h |
| near_catalyst_added | 48h |
| company_scored | 168h (7 days) |
| Default (unknown types) | 24h |

**Rationale:**
- Tier changes: 24h — frequent re-scoring could trigger many tier changes; daily cap is sufficient
- Sector driver shifts: 48h — macro drivers don't flip rapidly; 48h prevents alert fatigue
- High-severity risks: 72h — high-priority but rarely new information within 72h
- company_scored: 168h — routine scoring events are low value; weekly cap prevents noise
- Near-term catalysts: 48h — catalysts are time-sensitive but not hourly-relevant

**Verdict: SUPPRESSION LOGIC CORRECTLY IMPLEMENTED ✓**

### 2.2 Suppression Race Condition

`fn-process-event-triggers` processes events **sequentially** (not with `Promise.all()`), per the comment on line 273: *"Process sequentially (not parallel — avoids duplicate suppression races)"*.

Without sequential processing: two concurrent cron invocations could both call `isSuppressed()` before either updates the status to `'processing'`, allowing both to proceed with generation.

With sequential processing: within a single invocation, events are processed one-by-one. `processEvent()` immediately marks the event as `'processing'` before generating the alert. The `should_suppress_event()` function counts `'processing'` rows, so any subsequent check within the same invocation window would correctly suppress.

**Residual race:** Two simultaneous invocations of `fn-process-event-triggers` (e.g., a manual trigger while cron is running) could each pick up the same pending event and both mark it as `'processing'`. This is an acceptable gap — the alert body would be generated twice with slightly different timestamps in the reference key, resulting in two alert rows. Impact is low; both alerts have the same content.

**Verdict: SEQUENTIAL PROCESSING CORRECTLY IMPLEMENTED ✓ (residual race risk noted)**

---

## 3. Retry Logic Audit

From fn-process-event-triggers `processEvent()` error handler (lines 214–228):

```typescript
const newRetryCount = event.retry_count + 1;
const isFinal = newRetryCount >= 3;

await db.from('ai_event_triggers')
  .update({
    status:        isFinal ? 'failed' : 'pending',
    retry_count:   newRetryCount,
    error_message: message,
    processed_at:  isFinal ? new Date().toISOString() : null,
  })
  .eq('id', event.id);
```

**Retry state machine:**

| Attempt | retry_count after | status |
|---|---|---|
| 1st failure | 1 | `pending` (re-queued) |
| 2nd failure | 2 | `pending` (re-queued) |
| 3rd failure | 3 | `failed` (terminal) |

- Failed events are re-set to `pending` after each non-terminal failure. The cron will pick them up in the next run (within 5 minutes).
- The `isFinal` condition fires at `retry_count >= 3` (strictly: `newRetryCount >= 3`, meaning 3 or more failures). Terminal after the 3rd failure.
- On terminal failure: `processed_at` is set, `status = 'failed'`. The event is permanently excluded from future cron processing (query filters `status = 'pending'`).
- `error_message` is updated on each failure for audit visibility.

**Verdict: RETRY LOGIC CORRECTLY IMPLEMENTED (3 max retries, terminal at >= 3) ✓**

---

## 4. Priority Ordering Audit

Events are fetched ordered by `priority ASC, triggered_at ASC` (lines 256–258):

```typescript
.order('priority', { ascending: true })   // 1 = highest priority first
.order('triggered_at', { ascending: true }) // oldest first within same priority
```

Priority values assigned by Postgres triggers (migration 030):

| Event Type | Priority |
|---|---|
| conviction_tier_upgrade | 2 (high) |
| conviction_tier_downgrade | 2 (high) |
| high_severity_risk_added | 2 (high) |
| sector_driver_turned_negative | 3 (medium) |
| sector_driver_turned_positive | 3 (medium) |
| near_catalyst_added | 3 (medium) |
| company_scored | 5 (low batch) |

**Analysis:** Priority 1 (critical) is reserved for future use. Current highest is 2. Within the same priority, older events are processed first (FIFO), preventing event starvation.

**Batch limit:** 20 events per invocation. At 7 event types and a 5-minute cron, steady-state throughput is 4 events per minute (limited by Claude API call time per alert). This is conservative for current PSX universe size (~100–300 companies, 7 sectors).

**Verdict: PRIORITY ORDERING CORRECT ✓**

---

## 5. Alert Configuration Consistency Audit

The alert severity, audience, and TTL are defined in two places:
- `fn-process-event-triggers/index.ts` → `getAlertConfig()` inline config
- `fn-generate-alert/index.ts` → `SEVERITY_MAP`, `AUDIENCE_MAP`, `TTL_HOURS`

**Comparison result (verified by script — all 7 event types × 3 attributes = 21 checks):**

| Event Type | Severity | Audience | TTL | Status |
|---|---|---|---|---|
| conviction_tier_upgrade | high | all | 48h | ✓ ALL MATCH |
| conviction_tier_downgrade | high | institutional | 48h | ✓ ALL MATCH |
| sector_driver_turned_negative | medium | all | 72h | ✓ ALL MATCH |
| sector_driver_turned_positive | medium | all | 72h | ✓ ALL MATCH |
| high_severity_risk_added | high | institutional | 96h | ✓ ALL MATCH |
| near_catalyst_added | medium | all | 72h | ✓ ALL MATCH |
| company_scored | low | internal | 24h | ✓ ALL MATCH |

**Verdict: CONFIG CONSISTENT ACROSS BOTH FUNCTIONS ✓**

---

## 6. Alert Title Wording Audit

Title templates verified against the no-recommendation-language rule:

| Event Type | Title Template |
|---|---|
| conviction_tier_upgrade | `{SYMBOL}: Conviction upgraded to {TIER} ({SCORE})` |
| conviction_tier_downgrade | `{SYMBOL}: Conviction downgraded to {TIER} ({SCORE})` |
| sector_driver_turned_negative | `{SECTOR}: {DRIVER} driver turned negative` |
| sector_driver_turned_positive | `{SECTOR}: {DRIVER} driver turned positive` |
| high_severity_risk_added | `High-severity risk: {TITLE}` |
| near_catalyst_added | `Near-term catalyst: {TITLE}` |
| company_scored | `{SYMBOL}: Scored {TIER} ({SCORE})` |

**Compliance check:**
- No "Buy", "Sell", "Hold", "Accumulate" in any title template
- No price targets in title templates
- "Conviction upgraded/downgraded" uses tier name (HIGH_CONVICTION, MODERATE, etc.) not directional advice
- "Driver turned negative/positive" describes a factual state change, not a trading signal
- "High-severity risk" and "Near-term catalyst" are category labels, not recommendations

**Verdict: TITLE TEMPLATES COMPLIANT ✓**

---

## 7. Alert Body Wording (alert_summary template)

The alert body is generated via `alert_summary` prompt template. Verified in the AI quality audit (S6_WEEK6_AI_OUTPUT_QUALITY.md). Key constraint from system prompt: *"Do not frame it as a call to action. Do not make predictions."*

The `event_data_summary` substitution fed to the template contains only factual data (score values, tier names, driver names, risk titles) — no directional language from the substitution builders in `alert-generator.ts`.

**Verdict: ALERT BODY WORDING ARCHITECTURE COMPLIANT ✓**

---

## 8. Alert Status Lifecycle

Alert records in the `alerts` table have `is_active = true` on creation. The `expires_at` field is set using the TTL from the alert config. Expired alerts are not automatically deactivated — the API layer in `services/api/alerts.ts` should filter by `expires_at > now()` or `is_active = true`.

**Verification:** `getActiveAlerts()` in services/api/alerts.ts should confirm this filter is applied. (Noted for live DB validation.)

**Alert-to-event linkage:** `alerts.event_trigger_id` → `ai_event_triggers.id` and `alerts.ai_output_id` → `ai_outputs.id` provide full audit traceability for any alert back to its originating Postgres trigger event and the AI generation output.

---

## Summary

| Check | Status |
|-------|--------|
| Suppression function — per (reference_key, event_type) scoping | ✓ PASS |
| Suppression includes 'processing' status (concurrent protection) | ✓ PASS |
| Failed events do not hold suppression window | ✓ PASS |
| Sequential processing — avoids suppression race | ✓ PASS |
| Retry cap at 3 attempts, terminal status = 'failed' | ✓ PASS |
| Priority ordering — 1=highest, FIFO within priority | ✓ PASS |
| Severity map — processor vs alerter consistent (7 types) | ✓ PASS |
| Audience map — processor vs alerter consistent (7 types) | ✓ PASS |
| TTL hours — processor vs alerter consistent (7 types) | ✓ PASS |
| Title templates — no prohibited recommendation language | ✓ PASS |
| Alert body — system prompt prohibits action framing | ✓ PASS |
| Audit trail — event → ai_output → alert linkage | ✓ PASS |

**Residual gap:** Simultaneous cron invocations can process the same event twice (dual 'processing' race). Low-impact but noted. Mitigation: add a DB-level status transition check (UPDATE ... WHERE status = 'pending' RETURNING id) before generation.

**Deferred to live validation:** Confirm `getActiveAlerts()` filters by `expires_at` or `is_active`, and that `company_scored` alerts (audience: 'internal') are not surfaced in the retail/all-audience alert feed.
