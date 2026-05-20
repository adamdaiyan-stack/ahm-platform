# Sprint 6 — Smoke Test Checklist
## What to check after deployment to confirm everything is live

**Supabase URL:** https://qiunhqgxsjyvcrcnfajl.supabase.co  
**Vercel URL:** Find in your Vercel dashboard → ahm-platform project  

---

## PHASE 1 — Vercel Frontend (test immediately after git push + build completes)

### 1.1 Core pages load

| URL | Expected | Pass? |
|-----|---------|-------|
| `/` | Home page loads, no build errors | |
| `/market` | Market dashboard loads with all panels | |
| `/stocks/HBL` (or any seeded symbol) | Stock page loads | |
| `/intelligence` | Conviction board page loads | |
| `/sectors/banking` | Banking sector page loads | |

### 1.2 New pages exist (Sprint 6)

| URL | Expected |
|-----|---------|
| `/intelligence` | Shows conviction board with tier columns (HIGH_CONVICTION, MODERATE, etc.) |

---

## PHASE 2 — After running migrations (check in Supabase Table Editor)

Go to: https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl/editor

### 2.1 Tables exist

Check each table appears in the left sidebar:
- [ ] `conviction_scores`
- [ ] `conviction_score_history`  
- [ ] `conviction_sub_scores`
- [ ] `ai_outputs`
- [ ] `ai_prompt_templates` (should have 8 rows immediately)
- [ ] `ai_market_snapshots`
- [ ] `ai_event_triggers`
- [ ] `alerts`
- [ ] `ai_generation_jobs`
- [ ] `ai_quality_checks`
- [ ] `sector_macro_drivers` (should have 35 rows)

### 2.2 Quick SQL verification

Run in SQL Editor:
```sql
SELECT prompt_type, is_active FROM ai_prompt_templates ORDER BY prompt_type;
-- Should return 8 rows, all is_active = true

SELECT sector_slug, COUNT(*) FROM sector_macro_drivers GROUP BY sector_slug;
-- Should return 7 rows with 5 drivers each
```

---

## PHASE 3 — After deploying Edge Functions

Go to: https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl/functions

### 3.1 Functions appear in dashboard

- [ ] fn-score-company
- [ ] fn-score-all-companies
- [ ] fn-generate-company-narrative
- [ ] fn-generate-sector-brief
- [ ] fn-generate-market-summary
- [ ] fn-generate-alert
- [ ] fn-process-event-triggers

### 3.2 Test scoring via curl

```bash
SUPABASE_URL="https://qiunhqgxsjyvcrcnfajl.supabase.co"
ANON_KEY="your-anon-key"

# Score a single company
curl -X POST "$SUPABASE_URL/functions/v1/fn-score-company" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "HBL"}'
```

**Expected response:**
```json
{
  "symbol": "HBL",
  "score": 62.4,
  "tier": "MODERATE",
  "sub_scores": { ... },
  "scored_at": "2026-05-20T..."
}
```

If you get `{"error": "Company not found: HBL"}` — the company isn't seeded in `companies` table. Use a symbol that exists.

### 3.3 Test narrative generation

```bash
curl -X POST "$SUPABASE_URL/functions/v1/fn-generate-company-narrative" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "HBL"}'
```

**Expected response:**
```json
{
  "symbol": "HBL",
  "narrative": {
    "qualityStatus": "passed",
    "fromCache": false,
    "rawText": "HBL delivered...",
    "promptTokens": 1800,
    "completionTokens": 310
  }
}
```

Call it a second time — should return `"fromCache": true, "skipped": true, "promptTokens": 0`.

---

## PHASE 4 — Frontend AI components (after generation runs)

Reload the stock and market pages — AI panels should now be populated.

### 4.1 Stock page (/stocks/HBL)

| Element | Expected |
|---------|---------|
| Conviction badge | Shows score (e.g. "62") and tier badge in green/amber/red |
| Alert strip | Shows "Intelligence Alerts" section if any alerts exist |
| "Company Intelligence" section | Shows 2 panels: "Company Narrative" + "Conviction Context" |

### 4.2 Market page (/market)

| Element | Expected |
|---------|---------|
| AI Market Intelligence panel | Shows long-form institutional brief |
| WhatsApp button | Appears, click copies short-form text to clipboard |
| Intelligence Alerts | Shows any active alerts |

### 4.3 Sector pages (/sectors/banking)

| Element | Expected |
|---------|---------|
| AI Sector Brief | Appears as first item in analytics slot |

### 4.4 Intelligence board (/intelligence)

| Element | Expected |
|---------|---------|
| Conviction columns | Companies sorted into HIGH_CONVICTION, MODERATE, WATCHLIST, MONITOR |
| Score badges | Each company card shows numerical score |

---

## PHASE 5 — Alert system smoke test

### 5.1 Manual alert trigger

Update a conviction score in the DB to trigger the upgrade/downgrade Postgres trigger:

```sql
-- In SQL Editor — temporarily bump a company's score to trigger an upgrade event
-- (This fires the fn_conviction_score_event trigger automatically)
UPDATE conviction_scores
SET composite_score = 78, tier = 'HIGH_CONVICTION'
WHERE symbol = 'HBL' AND is_current = true;
```

Then check `ai_event_triggers` table — should show a new pending row with `event_type = 'conviction_tier_upgrade'`.

Run the processor manually:
```bash
curl -X POST "$SUPABASE_URL/functions/v1/fn-process-event-triggers" \
  -H "Authorization: Bearer $ANON_KEY"
```

Then check `alerts` table — should have a new row with the alert body.

---

## PHASE 6 — Known gaps (not blockers)

These are known limitations that don't prevent testing but are real gaps:

| Gap | Impact | Fix |
|-----|--------|-----|
| Only ~20 companies seeded | Conviction board is sparse | Future data sprint |
| No live price feed | Market data is static | Pipeline sprint |
| alert_summary audience not filtered | Internal alerts show in feed | Add `.neq('audience','internal')` filter |
| Cron not wired | Alerts process only on manual trigger | Step 7 of runbook |
| peer_comparison not wired | That AI output type never generates | Future sprint |

---

## Quick reference — Supabase SQL to check state

```sql
-- How many companies have conviction scores?
SELECT COUNT(*) FROM conviction_scores WHERE is_current = true;

-- What tiers?
SELECT tier, COUNT(*) FROM conviction_scores WHERE is_current = true GROUP BY tier;

-- How many AI outputs generated?
SELECT output_type, COUNT(*) FROM ai_outputs WHERE is_current = true GROUP BY output_type;

-- Any quality failures?
SELECT output_type, quality_status, COUNT(*) FROM ai_outputs 
WHERE is_current = true GROUP BY output_type, quality_status;

-- Pending alerts?
SELECT event_type, status, COUNT(*) FROM ai_event_triggers GROUP BY event_type, status;
```
