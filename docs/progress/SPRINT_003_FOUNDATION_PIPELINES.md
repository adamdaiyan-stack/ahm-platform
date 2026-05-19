# Sprint 003 — Foundation Pipelines: Implementation Roadmap

**Date:** May 2026  
**Sprint Goal:** Production-ready PSX data infrastructure — reliable, monitored, and reconciled  
**Priority:** Reliability > sophistication  
**Source of truth:** AHM_Data_Pipeline_Architecture_v1.md + live DB audit

---

## 1. Current State Audit

### What Sprint 001 + 002 delivered

| Area | Status |
|------|--------|
| Schema (21 tables) | ✅ All core tables in DB |
| Price ingestion pipeline | ✅ Working — daily-prices.yml runs at 4:45 PM PKT |
| Symbol normalization (XD/XB/XR suffixes) | ✅ Fixed |
| Company snapshot sync | ✅ sync-company-snapshots.ts |
| Daily snapshots (AI context) | ✅ build-daily-snapshots.ts |
| ingestion_runs logging | ✅ PipelineLogger operational |
| data_quality_flags writing | ✅ flagDataIssues() working |
| Announcements connector | ⚠️ Built — URL parsing bug being fixed |
| Event classifier | ✅ 20/20 test cases pass |
| Announcement parser | ✅ Dividend, bonus, split, rights extraction |
| Corporate actions normalization pipeline | ✅ normalize-corporate-actions.ts |
| announcements_raw table + views | ✅ Applied (migration 010a/b/c) |
| GitHub Actions (prices) | ✅ daily-prices.yml |

### What is NOT done yet (Sprint 003 scope)

| Gap | Risk | Effort |
|-----|------|--------|
| `pipeline_alerts` table not in DB | Medium | 5 min |
| DB functions not created (sync_snapshot, breadth, reconcile) | Medium | 30 min |
| Views not created (sector_performance, macro_latest, ttm_yield) | Medium | 20 min |
| `daily_prices.adjusted_close` columns not added | Medium | 10 min |
| KSE-100 index_history ingestion — endpoint returns 404 | **HIGH** | 2-4 hrs |
| Macro ingestion pipeline (SBP/KIBOR/CPI/FX) | Medium | 4-6 hrs |
| `sector_macro_linkages` table empty (not seeded) | Medium | 1 hr |
| `macro_indicators` table empty | Medium | 1 hr |
| `earnings_calendar` table empty | Medium | 2 hrs |
| Reconciliation pipeline | Medium | 2-3 hrs |
| Announcements GitHub Actions workflow | Low | 30 min |
| OHLC validation flags noise (~360/run) | Medium | 30 min |
| Companies table — only 4 with financial intelligence | Medium | ongoing |

---

## 2. Migration Order

Run in this exact sequence. Each is idempotent (safe to re-run).

```
M-011  pipeline_alerts table                           [NOT APPLIED]
M-012  DB views: sector_performance_today, macro_latest, ttm_dividend_yield
M-013  DB functions: sync_company_snapshot(), compute_market_breadth(),
                     reconcile_daily_prices()
M-014  ALTER daily_prices ADD adjusted_close, cumulative_adj_factor
M-015  ALTER earnings_calendar ADD related_intel_block_ids uuid[]
```

Migrations 001–010 are all applied. Apply 011–015 before any script work.

---

## 3. Dependency Order

Work items ordered by dependency. Each item unblocks the next group.

### Group A — Schema Completion (apply before any Group B work)
```
A1. Apply M-011 pipeline_alerts               → unblocks alert integration
A2. Apply M-012 views                         → unblocks frontend sector performance
A3. Apply M-013 DB functions                  → unblocks reconciliation pipeline
A4. Apply M-014 adjusted_close columns        → unblocks corporate actions engine
A5. Apply M-015 earnings_calendar column      → unblocks earnings tagging
```

### Group B — Data Quality Fixes (can run after schema)
```
B1. Fix OHLC validation — skip when volume=0  → reduces noise, reveals real issues
B2. Fix announcements connector URL parsing   → currently in progress ✅
B3. Find KSE-100 correct endpoint             → unblocks index_history ingestion
```

### Group C — Ingestion Pipelines (depends on B)
```
C1. KSE-100 index_history pipeline            → depends on B3
C2. Announcements GitHub Actions workflow     → depends on B2
C3. Macro ingestion pipeline (SBP/KIBOR/FX)  → depends on A2 (macro_latest view)
C4. Reconciliation pipeline                   → depends on A3 (reconcile function)
```

### Group D — Data Seeding (can run in parallel with C)
```
D1. Seed sector_macro_linkages (8 sectors × key indicators)
D2. Seed macro_indicators — current values (manual: SBP rate, KIBOR, PKR/USD)
D3. Seed earnings_calendar — next result season for top 30 companies
```

### Group E — Operational Monitoring (depends on A1)
```
E1. Pipeline alerts integration into existing pipelines
E2. GitHub Actions Slack webhook (activate commented-out notify-on-failure)
E3. Alert thresholds — stale data detection, missing price detection
```

---

## 4. Highest-Risk Implementation Areas

### RISK-1: Announcements Connector Returns 0 Records [ACTIVE]
**Probability:** Confirmed bug  
**Impact:** Entire corporate actions pipeline blocked  
**Root cause:** `extractDocumentId` only matched double-quoted absolute URLs. PSX HTML uses relative URLs and/or single-quoted hrefs.  
**Fix in progress:** regex updated to handle all four href/URL combinations. Table detection rewritten to use column header matching instead of fragile `id="announcements"` anchor.  
**Validation:** Run `npm run debug:announcements -- HBL` — must return >0 records.

### RISK-2: KSE-100 Index Endpoint Returns 404
**Probability:** Confirmed (404 on `/market-summary`)  
**Impact:** `index_history` table has no data. No KSE-100 chart. No market breadth. Frontend shows "—" for index level.  
**Mitigation needed:**
1. Inspect `dps.psx.com.pk` browser network tab to find the actual market summary endpoint
2. Possible alternative: market-watch page parses index level alongside prices
3. The `market_index` table's single row needs daily updates  
**Owner:** Must be investigated before C1 can start.

### RISK-3: PSX Page Structure Changes Break Parser
**Probability:** Medium (PSX has updated its site before)  
**Impact:** Total ingestion failure — all pipelines silently return 0 records  
**Mitigation:**
- `ingestion_runs` catches failures within one trading day
- `debug:connector` and `debug:announcements` scripts for rapid diagnosis
- Add integration test that asserts fetched_count > 0 after each run

### RISK-4: OHLC Validation Flag Noise Masks Real Issues
**Probability:** Confirmed — 360 flags per price run  
**Impact:** `data_quality_flags` table filled with false positives from suspended/zero-volume stocks. Real issues invisible.  
**Root cause:** Stocks with volume=0 have open=high=low=close (identical values) which triggers OHLC checks.  
**Fix:** Skip OHLC integrity checks when `volume == 0`. These are suspended stocks, not data errors.

### RISK-5: data_quality_flags Filling Without Resolution Workflow
**Probability:** High (no one is clearing them)  
**Impact:** Table grows unbounded. No analyst workflow to review and resolve.  
**Mitigation:** Add a weekly query/report to surface unresolved critical flags. Add auto-resolve logic for known-benign patterns.

---

## 5. Quickest Production Wins

In order of effort vs. impact:

| Win | Effort | Impact |
|-----|--------|--------|
| Fix OHLC validation for zero-volume days | 15 min | Eliminates 360 false-positive flags per run |
| Apply pipeline_alerts migration | 5 min | Enables monitoring infrastructure |
| Create DB views (sector_performance, macro_latest, ttm_yield) | 20 min | Frontend sector performance + dividend yield go live |
| Create reconciliation SQL function | 20 min | Can detect missing prices same day |
| Add adjusted_close to daily_prices | 5 min | Corporate actions engine can start computing |
| Seed macro_indicators current values (manual) | 30 min | AI macro context becomes non-empty |
| Seed sector_macro_linkages | 45 min | AI sector analysis unlocked |
| Create announcements GitHub Actions workflow | 30 min | Announcements auto-run daily |
| Activate Slack webhook in daily-prices.yml | 10 min | Immediate failure alerting |

---

## 6. Areas Requiring Immediate Refactoring

### R1: OHLC Validation Threshold (data-quality.ts)
**File:** `scripts/utils/data-quality.ts`  
**Problem:** Validates OHLC integrity unconditionally. Zero-volume days (suspended stocks) have all four OHLCV values identical, which triggers "Close above High" false positives.  
**Fix:**
```typescript
// Add to validateDailyPrice() before OHLC checks:
if (record.volume === 0) {
  return issues; // Suspended stock — no OHLC to validate
}
```

### R2: KSE-100 Market Summary Endpoint
**File:** `scripts/pipelines/ingest-daily-prices.ts` and `scripts/connectors/dps-psx.ts`  
**Problem:** `/market-summary` returns 404. The KSE-100 index level is never written to `market_index` or `index_history`.  
**Fix:** Investigate correct endpoint. Likely the market-watch page includes index level. Extract it there and write to both tables.

### R3: GitHub Actions Missing Announcements Workflow
**File:** `.github/workflows/` — only `daily-prices.yml` exists  
**Problem:** Announcements pipeline never runs automatically. Corporate actions depend on daily announcements.  
**Fix:** Add `.github/workflows/daily-events.yml` to run `pipeline:events` after prices complete (or as separate cron).

### R4: Pipeline Logger — ingestion_runs records_failed Not Propagated from Batch Errors
**File:** `scripts/pipelines/ingest-announcements.ts`  
**Problem:** The `run.complete()` call may receive incorrect counts when batch upsert errors occur mid-batch.  
**Fix:** Track upsert errors per symbol, not per batch. Currently batch failures count the whole batch as failed.

### R5: build-daily-snapshots.ts — Missing Technical Signal Computation
**File:** `scripts/pipelines/build-daily-snapshots.ts`  
**Problem:** Architecture doc specifies MA-20, MA-50, MA-200, RSI-14, price vs MA-50 in `daily_snapshots`. These require rolling window calculations over `daily_prices`.  
**Status:** Check whether build-daily-snapshots.ts computes these or leaves them null.  
**Impact:** If null, the AI context table is incomplete — narrative generation will lack technical context.

---

## 7. Implementation Tickets (Ordered)

### Ticket S003-01: Fix OHLC Validation False Positives
**Priority:** P0 — do this first, unblocks data quality visibility  
**File:** `scripts/utils/data-quality.ts`  
**Change:** Skip OHLC checks when `volume === 0`

### Ticket S003-02: Apply Migration 011 — pipeline_alerts
**Priority:** P0  
**Action:** Apply SQL for `pipeline_alerts` table to Supabase

### Ticket S003-03: Apply Migrations 012–015 (Views + Functions)
**Priority:** P1  
**Action:** Create sector_performance_today view, macro_latest view, ttm_dividend_yield view, sync_company_snapshot function, compute_market_breadth function, reconcile_daily_prices function, add adjusted_close columns

### Ticket S003-04: Investigate and Fix KSE-100 Endpoint
**Priority:** P1 — blocks index_history, market breadth, frontend index display  
**Action:** Browser devtools on dps.psx.com.pk → find market index endpoint → update connector → write to index_history + market_index

### Ticket S003-05: Create Announcements GitHub Actions Workflow
**Priority:** P1  
**File:** `.github/workflows/daily-events.yml`  
**Schedule:** After prices complete (trigger on daily-prices workflow completion) OR separate cron at 6 PM PKT  
**Steps:** ingest:announcements → normalize:corp-actions

### Ticket S003-06: Seed sector_macro_linkages
**Priority:** P1 — AI macro context is empty without this  
**Action:** Write SQL to seed all 8 sectors × key macro indicators (SBP rate, KIBOR, PKR/USD, commodity prices)  
**Source:** AHM_Data_Pipeline_Architecture_v1.md §5.2 has the seed examples

### Ticket S003-07: Seed macro_indicators — Current Values
**Priority:** P1  
**Action:** Manual SQL seed with current readings:
- SBP_POLICY_RATE: 12% (verify current rate)
- KIBOR_3M, KIBOR_6M: current readings from sbp.org.pk
- PKR_USD: current rate
- SBP_RESERVES_USD_BN: current
**Source:** sbp.org.pk/statistics

### Ticket S003-08: Build Reconciliation Pipeline
**Priority:** P2  
**New file:** `scripts/pipelines/reconcile-daily-prices.ts`  
**Function:** Run `reconcile_daily_prices(today)` → write gaps to `data_quality_flags` + `pipeline_alerts`  
**Add to:** daily-prices.yml as Step 4

### Ticket S003-09: Build Macro Ingestion Pipeline
**Priority:** P2  
**New files:**
- `scripts/connectors/sbp-website.ts` — KIBOR + FX + reserves scraper
- `scripts/pipelines/ingest-macro.ts` — orchestrator
- `.github/workflows/daily-macro.yml` — cron at 6 PM PKT
**Scrape targets:** sbp.org.pk/statistics/kibor, sbp.org.pk/statistics/exchange-rates

### Ticket S003-10: Activate Slack Failure Notifications
**Priority:** P2  
**File:** `.github/workflows/daily-prices.yml`  
**Action:** Uncomment the `notify-on-failure` job. Add `SLACK_WEBHOOK_URL` to GitHub secrets.

### Ticket S003-11: Seed Earnings Calendar — Current Season
**Priority:** P2  
**Action:** Manual seed of `earnings_calendar` for result dates of top 30 companies (FY25/1HFY26)  
**Source:** PSX announcements + company IR pages

### Ticket S003-12: Verify build-daily-snapshots.ts Technical Signals
**Priority:** P2  
**Action:** Read the script, confirm MA-20/50/200 and RSI-14 are computed. If not, add rolling window queries against `daily_prices`.

---

## 8. What Sprint 003 Does NOT Include

Consistent with the sprint brief:

- ❌ AI narrative generation
- ❌ Frontend features or UI changes
- ❌ Prediction or conviction scoring
- ❌ pgvector embeddings (infrastructure exists, activation is Phase 2)
- ❌ Python AI microservice
- ❌ Intraday data
- ❌ External institutional API

---

## 9. Definition of Done

Sprint 003 is complete when:

- [ ] `pipeline_alerts` table live
- [ ] `sector_performance_today`, `macro_latest`, `ttm_dividend_yield` views live
- [ ] `reconcile_daily_prices()` DB function created and called daily
- [ ] `daily_prices.adjusted_close` and `cumulative_adj_factor` columns added
- [ ] Announcements connector returns > 0 records for HBL
- [ ] `npm run pipeline:events` completes without errors and writes rows to `announcements_raw`
- [ ] Announcements GitHub Actions workflow running daily
- [ ] KSE-100 index level writing to `index_history` and `market_index` daily
- [ ] `sector_macro_linkages` seeded for all 7 sectors
- [ ] `macro_indicators` seeded with current SBP rate, KIBOR, PKR/USD
- [ ] OHLC validation false positives eliminated (< 10 flags per run, down from 360)
- [ ] `data_quality_flags` unresolved critical count visible in daily ops check
- [ ] Every pipeline run writes to `ingestion_runs` with correct status

---

*Sprint 003 Roadmap — AHM Intelligence Platform*  
*Produced from live DB audit + architecture doc cross-reference — May 2026*
