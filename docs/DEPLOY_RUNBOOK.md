# Sprint 6 — Deployment Runbook
## Step-by-step guide to deploy all Sprint 6 work to production

**Date:** 2026-05-20  
**Supabase Project:** qiunhqgxsjyvcrcnfajl  
**Supabase URL:** https://qiunhqgxsjyvcrcnfajl.supabase.co  
**Vercel:** Auto-deploys from git push to main  

---

## Prerequisites

Before starting, make sure you have:
- [ ] Access to the AHM git repository (GitHub)
- [ ] Supabase dashboard access: https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl
- [ ] Supabase CLI installed (`npm install -g supabase` or already installed)
- [ ] Your `ANTHROPIC_API_KEY` from console.anthropic.com
- [ ] Node.js available in terminal

---

## STEP 1 — Commit and push Sprint 6 to git (triggers Vercel)

Run these commands in the `C:\ahm-platform` directory (close VS Code first if it's open, or use a separate terminal):

```bash
cd C:\ahm-platform

# If you get a "index.lock" error, delete the lock file first:
# del .git\index.lock    (Windows)
# rm .git/index.lock      (Mac/Linux)

git add -A

git commit -m "feat(sprint6): AI Intelligence Layer, conviction scoring, alerts system

- lib/scoring/: conviction scoring engine (11 sub-scores, 4 hard caps, v1.0.0)
- lib/ai/: caching layer, quality gate, WhatsApp formatter
- supabase/functions/: 7 Edge Functions (score, narrative, sector, market, alerts)
- components/ai/: AICompanyNarrative, AISectorBrief, AIMarketSnapshot
- components/alerts/: AlertsFeed, AlertCard
- services/api/alerts.ts
- app/intelligence/: conviction board page
- Migrations 023-030: conviction_scores, ai_outputs, events, alerts, macro_drivers
- docs/validation/: 6 validation reports
- docs/architecture/: AI layer, event system, scoring engine docs"

git push origin main
```

**Expected:** Vercel detects the push and starts a new deployment. Go to https://vercel.com/dashboard and watch the build. It takes 2-3 minutes.

**If the TypeScript build fails on Vercel:** Run `npx tsc --noEmit` locally to catch any issues first. It should pass (we verified 0 errors).

---

## STEP 2 — Apply DB Migrations (Supabase SQL Editor)

1. Open: https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl/sql/new

2. Open the file: `C:\ahm-platform\docs\DEPLOY_MIGRATIONS.sql`

3. Copy the entire contents and paste into the SQL editor

4. Click **Run** (or press Ctrl+Enter)

5. Scroll to the bottom — you should see the verification queries run. Check:
   - **11 tables** listed in the first result
   - **8 prompt templates** listed in the second result (all is_active = true)
   - **7 sector rows** with 5 drivers each in the third result
   - **4 triggers** listed in the fourth result

**If you get a "relation already exists" error:** The migration uses IF NOT EXISTS throughout — it should be safe to re-run. If a specific error blocks you, paste it and we'll fix it.

---

## STEP 3 — Deploy Edge Functions to Supabase

Run these commands in terminal **from the `C:\ahm-platform` directory**:

```bash
cd C:\ahm-platform

# Login to Supabase CLI (opens browser — authenticate with your Supabase account)
npx supabase login

# Link to your project
npx supabase link --project-ref qiunhqgxsjyvcrcnfajl

# Deploy all 7 Edge Functions
npx supabase functions deploy fn-score-company
npx supabase functions deploy fn-score-all-companies
npx supabase functions deploy fn-generate-company-narrative
npx supabase functions deploy fn-generate-sector-brief
npx supabase functions deploy fn-generate-market-summary
npx supabase functions deploy fn-generate-alert
npx supabase functions deploy fn-process-event-triggers

# Each deploy takes ~15-30 seconds
```

**Expected output for each:** `Deployed Function fn-xxx`

---

## STEP 4 — Set the ANTHROPIC_API_KEY Secret

The Edge Functions need your Anthropic API key to call Claude. Set it via Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl/settings/functions
2. Click **Add new secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: your key from https://console.anthropic.com/settings/keys

**OR via CLI:**
```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

---

## STEP 5 — First Scoring Run (populate conviction_scores)

The conviction scoring Edge Function needs to run to populate scores for all companies. Run:

```bash
# Replace YOUR_ANON_KEY with the value from Supabase dashboard → Settings → API
SUPABASE_URL="https://qiunhqgxsjyvcrcnfajl.supabase.co"
ANON_KEY="your-anon-key-here"

curl -X POST "$SUPABASE_URL/functions/v1/fn-score-all-companies" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json"
```

**Expected:** JSON response with `scored: N, failed: 0, errors: []`  
**Note:** This scores all companies in the `companies` table. Currently ~20 companies seeded.

---

## STEP 6 — First AI Generation Run

After scoring, trigger narrative generation for all seeded companies:

```bash
# Replace with your actual anon key
SUPABASE_URL="https://qiunhqgxsjyvcrcnfajl.supabase.co"
ANON_KEY="your-anon-key-here"

# Generate narratives for seeded companies
for SYMBOL in ENGRO HBL UBL MCB BAFL OGDC PPL; do
  echo "Generating narrative for $SYMBOL..."
  curl -s -X POST "$SUPABASE_URL/functions/v1/fn-generate-company-narrative" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"symbol\": \"$SYMBOL\"}" | python3 -c "import sys,json; r=json.load(sys.stdin); print(r.get('symbol','?'), '-', r.get('narrative',{}).get('qualityStatus','?'))"
  sleep 2
done

# Generate sector briefs for all 7 sectors
for SECTOR in banking oil-gas fertiliser cement power textile automobile; do
  echo "Generating sector brief for $SECTOR..."
  curl -s -X POST "$SUPABASE_URL/functions/v1/fn-generate-sector-brief" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"sector_slug\": \"$SECTOR\"}" | python3 -c "import sys,json; r=json.load(sys.stdin); print(r.get('sector_slug','?'), '-', r.get('qualityStatus','?'))"
  sleep 2
done

# Generate market summary (eod_summary)
curl -s -X POST "$SUPABASE_URL/functions/v1/fn-generate-market-summary" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"snapshot_type": "eod_summary"}' | python3 -c "import sys,json; r=json.load(sys.stdin); print('market summary -', r.get('status','?'))"
```

**Expected:** Each returns qualityStatus: "passed" or "warning". First run takes 5-10s per company (Claude API call).

---

## STEP 7 — Wire Event Processing Cron

The alert processor (`fn-process-event-triggers`) needs to run every 5 minutes. Set this up in Supabase:

1. Go to: https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl/database/hooks
2. Or use the Supabase cron extension (pg_cron):

```sql
-- Run in SQL Editor
SELECT cron.schedule(
  'process-event-triggers',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://qiunhqgxsjyvcrcnfajl.supabase.co/functions/v1/fn-process-event-triggers',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

Replace `YOUR_SERVICE_ROLE_KEY` with the service role key from Supabase → Settings → API.

**Alternative:** Use Supabase Edge Function Schedules in the dashboard (if available on your plan).

---

## Deployment Checklist

- [ ] Step 1: `git push` complete — Vercel build passing
- [ ] Step 2: Migrations applied — 11 tables, 8 templates, 35 macro drivers, 4 triggers
- [ ] Step 3: All 7 Edge Functions deployed
- [ ] Step 4: ANTHROPIC_API_KEY set in Supabase secrets
- [ ] Step 5: fn-score-all-companies ran successfully
- [ ] Step 6: Narratives generated for seeded companies
- [ ] Step 7: Event processing cron wired up

---

## Where to find your keys

| Key | Location |
|-----|---------|
| Supabase Anon Key | https://supabase.com/dashboard/project/qiunhqgxsjyvcrcnfajl/settings/api |
| Supabase Service Role Key | Same page (keep secret — server use only) |
| Anthropic API Key | https://console.anthropic.com/settings/keys |
| Vercel Dashboard | https://vercel.com/dashboard |
