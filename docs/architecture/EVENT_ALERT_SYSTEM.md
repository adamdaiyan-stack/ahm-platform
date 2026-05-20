# AHM Platform — Event-Driven Alert System Architecture
## Sprint 6 Complete Architecture Reference

**Version:** 1.0.0  
**Sprint:** 6 (complete)  
**Date:** 2026-05-20  

---

## 1. Purpose

The event-driven alert system detects meaningful changes in the AHM intelligence layer (conviction score shifts, sector driver reversals, new high-severity risks, near-term catalysts) and generates AI-written intelligence alerts surfaced in the UI.

**Architectural principle:** Alerts are a derivative product of structured DB changes — not triggered by price movements or real-time market feeds. Every alert is grounded in data already validated by the scoring and intelligence pipeline.

---

## 2. System Overview

```
DB Change (conviction_scores, sector_drivers, intelligence_blocks)
          │
          ▼ Postgres Trigger (migration 030)
          │
    ai_event_triggers (status: 'pending')
          │
          ▼ fn-process-event-triggers (cron: */5 * * * *)
          │
    ┌─────────────────────────┐
    │  should_suppress_event() │ ← DB function
    └─────────────────────────┘
          │ not suppressed
          ▼
    _shared/alert-generator.ts
    generateAlertText() → Claude API
          │
          ▼
    alerts table (status: 'complete')
          │
          ▼
    AlertsFeed component → AlertCard UI
```

---

## 3. Event Source: Postgres Triggers

Migration 030 defines Postgres triggers on three tables. All triggers insert into `ai_event_triggers`.

### 3.1 conviction_scores (fn_conviction_score_event)

| Change | Event Type | Priority |
|---|---|---|
| INSERT (first score) | company_scored | 5 (low) |
| UPDATE where new tier > old tier | conviction_tier_upgrade | 2 (high) |
| UPDATE where new tier < old tier | conviction_tier_downgrade | 2 (high) |
| UPDATE, same tier | company_scored | 5 (low) |

Tier ordering for comparison: HIGH_CONVICTION > MODERATE > WATCHLIST > MONITOR, implemented via `tier_order()` helper function in the trigger.

### 3.2 sector_drivers (fn_sector_driver_event)

| Change | Event Type | Priority |
|---|---|---|
| UPDATE trend → 'negative' | sector_driver_turned_negative | 3 (medium) |
| UPDATE trend → 'positive' | sector_driver_turned_positive | 3 (medium) |

Only trend changes fire events (not all sector_drivers updates).

### 3.3 intelligence_blocks / sector_intelligence_blocks (fn_intel_block_event)

| Condition | Event Type | Priority |
|---|---|---|
| INSERT, block_type IN ('risk','regulatory_risk') AND priority >= 4 | high_severity_risk_added | 2 (high) |
| INSERT, block_type IN ('catalyst','event_catalyst') AND horizon = 'near' | near_catalyst_added | 3 (medium) |
| INSERT, company_intelligence_blocks, same conditions | same as above | same |

---

## 4. Event Queue: ai_event_triggers Table

Key columns:

| Column | Type | Purpose |
|---|---|---|
| event_type | text | One of 7 defined event types |
| reference_key | text | Symbol, sector_slug, or combined |
| event_data | jsonb | All relevant data for substitution builders |
| priority | integer | 1=critical (reserved), 2=high, 3=medium, 5=low |
| status | text | pending → processing → complete \| suppressed \| failed |
| retry_count | integer | Increments on failure; terminal at >= 3 |
| triggered_at | timestamptz | Set by trigger; used for suppression window |
| processed_at | timestamptz | Set on complete or final failure |
| alert_id | uuid → alerts.id | Set on complete |
| error_message | text | Set on failure |

---

## 5. Cron Processor: fn-process-event-triggers

**Schedule:** `*/5 * * * *` (every 5 minutes)  
**Batch limit:** 20 events per invocation  
**Processing order:** `priority ASC, triggered_at ASC` (highest priority, oldest first)  
**Processing mode:** Sequential (not parallel) — prevents suppression race conditions

### 5.1 Per-Event Processing Steps

1. Call `should_suppress_event(reference_key, event_type, window_hours)` via DB RPC
2. If suppressed: update status to 'suppressed', record reason, skip
3. If not suppressed: update status to 'processing'
4. Call `generateAlertText(db, event_type, event_data)` via `_shared/alert-generator.ts`
5. Insert row into `alerts` table with severity, audience, TTL, AI body
6. Update `ai_event_triggers` to status 'complete' with alert_id

### 5.2 Error Handling

On failure:
- `retry_count++`
- If `retry_count >= 3`: status = 'failed' (terminal)
- If `retry_count < 3`: status = 'pending' (re-queued for next cron)

---

## 6. Suppression Logic

### 6.1 DB Function

```sql
should_suppress_event(
  p_reference_key text,
  p_event_type    text,
  p_window_hours  integer DEFAULT 24
) RETURNS boolean
```

Returns TRUE if a 'complete' or 'processing' event of the same `(reference_key, event_type)` exists within the suppression window.

### 6.2 Suppression Windows

| Event Type | Window | Rationale |
|---|---|---|
| conviction_tier_upgrade | 24h | Daily cap on scoring noise |
| conviction_tier_downgrade | 24h | Daily cap |
| sector_driver_turned_negative | 48h | Macro doesn't flip daily |
| sector_driver_turned_positive | 48h | Same |
| high_severity_risk_added | 72h | Alert fatigue prevention |
| near_catalyst_added | 48h | Catalyst events are not hourly |
| company_scored | 168h | Routine scoring — weekly cap |

### 6.3 Scope

Suppression is scoped to `(reference_key, event_type)` — not globally per event_type. A tier upgrade for MCB does not suppress a tier upgrade for ENGRO.

Failed events (`status = 'failed'`) do NOT hold the suppression window — a failed attempt does not prevent the next attempt from processing.

---

## 7. Alert Configuration

### 7.1 Per-Event-Type Config

| Event Type | Severity | Audience | TTL |
|---|---|---|---|
| conviction_tier_upgrade | high | all | 48h |
| conviction_tier_downgrade | high | institutional | 48h |
| sector_driver_turned_negative | medium | all | 72h |
| sector_driver_turned_positive | medium | all | 72h |
| high_severity_risk_added | high | institutional | 96h |
| near_catalyst_added | medium | all | 72h |
| company_scored | low | internal | 24h |

### 7.2 Title Templates

Titles are deterministic (no AI involved):
- `{SYMBOL}: Conviction upgraded to {TIER} ({SCORE})`
- `{SYMBOL}: Conviction downgraded to {TIER} ({SCORE})`
- `{SECTOR}: {DRIVER} driver turned negative/positive`
- `High-severity risk: {TITLE}`
- `Near-term catalyst: {TITLE}`
- `{SYMBOL}: Scored {TIER} ({SCORE})`

All titles are factual descriptors — no recommendation language.

### 7.3 Body Generation

Alert bodies are generated by Claude Sonnet 4.6 via the `alert_summary` prompt template. Output constrained to 1–2 sentences, maximum 50 words. System prompt instructs: *"Do not frame it as a call to action. Do not make predictions."*

`forceRegenerate: true` is always set — alerts are never served from cache. Each alert event gets a unique `ai_outputs` row, linked via `alerts.ai_output_id`.

---

## 8. alerts Table

Key columns:

| Column | Purpose |
|---|---|
| alert_type | Matches event_type |
| reference_key | Symbol or sector_slug |
| title | Deterministic title (no AI) |
| body | AI-generated text (alert_summary) |
| severity | critical / high / medium / low |
| audience | internal / institutional / all |
| event_trigger_id | → ai_event_triggers.id |
| ai_output_id | → ai_outputs.id |
| expires_at | TTL-based expiry |
| is_active | Manual deactivation flag |
| is_read | Per-user read tracking |

---

## 9. UI Layer

### 9.1 AlertsFeed (Server Component)

Routes to appropriate service function based on `context` prop:
- `context = 'market'` → `getActiveAlerts(limit)` (all alerts)
- `context = 'sector'` → `getAlertsBySector(sectorSlug)`
- `context = 'company'` → `getAlertsBySymbol(symbol)`

All service functions filter: `is_active = true AND (expires_at IS NULL OR expires_at > now())`.

### 9.2 AlertCard

Severity dot + border colour: critical = loss (red), high = amber, medium = neutral.
Relative time display. `line-clamp-2` on body text for compact feed.

### 9.3 Wired Pages

- `/market` — AlertsFeed in right column above SectorHeatPanel
- `/stocks/[symbol]` — AlertsFeed above AICompanyNarrative

---

## 10. Manual Alert Generation

`fn-generate-alert` supports direct invocation:
```json
POST /functions/v1/fn-generate-alert
{ "event_trigger_id": "uuid" }
// OR
{ "event_type": "conviction_tier_upgrade", "event_data": {...}, "reference_key": "MCB" }
```

When invoked via `event_trigger_id`, the function re-uses the existing trigger's data. When invoked with raw `event_type + event_data`, it creates a standalone alert outside the cron queue. Both paths produce an `alerts` row with full auditability.
