# AHM Platform — Data Propagation Map

> **Purpose:** Defines every data type, its authoritative source, and all destinations it must reach before the platform can be considered "current" for that trading day. Use this document to debug stale data, validate pipelines, and plan new data additions.

---

## Pipeline execution order (daily, Mon–Fri)

```
04:45 PM PKT  →  daily-prices.yml (GitHub Actions)
                    Step 1: ingest-daily-prices.ts
                    Step 2: sync-company-snapshots.ts
                    Step 3: build-daily-snapshots.ts
                    Step 4: reconcile-daily-prices.ts

06:00 PM PKT  →  daily-events.yml (GitHub Actions)
                    Step 1: ingest-announcements.ts
                    Step 2: normalize-corporate-actions.ts
```

---

## Data type registry

### 1. EOD Price Data

| Field | Source | Canonical Table | Downstream Destinations |
|-------|--------|----------------|------------------------|
| open, high, low, close, volume | DPS PSX scraper | `daily_prices` | `companies` (snapshot), `daily_snapshots`, `index_history` |
| change, change_percent | Computed from previous close | `daily_prices` | `companies`, `daily_snapshots` |

**Propagation chain:**
```
DPS PSX HTML
  → ingest-daily-prices.ts
      → daily_prices (canonical, OHLCV per symbol per date)
          → sync-company-snapshots.ts
              → companies.current_price / change / change_percent / volume
          → build-daily-snapshots.ts
              → daily_snapshots (denormalized AI context row)
          → reconcile-daily-prices.ts
              → data_quality_flags (missing / stale detection)
              → pipeline_alerts (for established symbols with missing prices)
```

**Verification query:**
```sql
-- Check price propagated to companies for today
SELECT c.symbol, dp.close AS daily_close, c.current_price AS snapshot_price
FROM daily_prices dp
JOIN companies c ON c.symbol = dp.symbol
WHERE dp.market_date = CURRENT_DATE
  AND dp.close IS DISTINCT FROM c.current_price
LIMIT 20;
```

---

### 2. Index Data (KSE-100, KSE-30, KMI-All-Share, KMI-30)

| Field | Source | Canonical Table | Downstream Destinations |
|-------|--------|----------------|------------------------|
| level (close), change, change_percent | DPS PSX /indices | `index_history` | `market_index` (snapshot) |
| advances, declines, unchanged | compute_market_breadth() SQL | `index_history` | `market_index` |

**Propagation chain:**
```
DPS PSX /indices HTML
  → ingest-daily-prices.ts (parseIndicesHTML)
      → index_history (one row per index per date)
          → market_index UPDATE (level, change, change_percent, updated_at)
          → compute_market_breadth(p_date) SQL function
              → index_history UPDATE (advances, declines, unchanged, volume)
              → market_index UPDATE (advances, declines, unchanged)
      → sync-company-snapshots.ts
          → market_index (level sync from index_history for run date)
```

**Verification query:**
```sql
-- Check market_index is current and not stale
SELECT index_name, level, change_percent, advances, declines, unchanged, updated_at
FROM market_index
WHERE index_name = 'KSE-100';
```

---

### 3. Company Snapshot Fields

| Field | Source | Canonical Table | Set by |
|-------|--------|----------------|--------|
| current_price, change, change_percent, volume | daily_prices for run date | `companies` | sync-company-snapshots.ts |
| market_cap, pe_ratio, dividend_yield, eps | Manual / financial pipeline | `companies` | Not yet automated |
| week_52_high, week_52_low | Not yet computed | `companies` | Pending: SQL function over daily_prices |
| sector, company_name, description | Manual / seed data | `companies` | companies master |

**Note:** `week_52_high` and `week_52_low` are pending a SQL function that computes rolling 52-week range from `daily_prices`. Currently these display "—" on all stock pages.

---

### 4. Daily Snapshots (AI Context)

| Field | Source | Canonical Table |
|-------|--------|----------------|
| close_price, change_percent | daily_prices | `daily_snapshots` |
| market_cap, pe_ratio, dividend_yield | companies | `daily_snapshots` |
| eps, roe, net_margin, pb_ratio, ev_ebitda | financial_history | `daily_snapshots` |
| kse100_change_pct | index_history | `daily_snapshots` |
| sector_avg_change_pct | Computed from daily_prices + companies | `daily_snapshots` |
| relative_strength | Computed: company change vs KSE-100 | `daily_snapshots` |

**Propagation chain:**
```
daily_prices + companies + financial_history + index_history
  → build-daily-snapshots.ts
      → daily_snapshots (one row per company per trading day)
```

---

### 5. Announcements & Corporate Actions

| Data Type | Source | Canonical Table | Downstream |
|-----------|--------|----------------|------------|
| PSX announcements | DPS PSX /cmsa/announcements | `announcements_raw` | `catalyst_events` (view) |
| Corporate actions (dividends, rights, bonuses) | announcements_raw + classifier | `corporate_actions` | `companies.dividend_yield` (via sync) |

**Propagation chain:**
```
DPS PSX announcements HTML
  → ingest-announcements.ts
      → announcements_raw (raw HTML + metadata)
          → normalize-corporate-actions.ts
              → corporate_actions (structured: cash_dividend, bonus_ratio, rights_ratio)
```

---

### 6. Macro Indicators

| Indicator | Source | Table | Frequency |
|-----------|--------|-------|-----------|
| SBP_POLICY_RATE | SBP website (manual) | `macro_indicators` | 6-weekly |
| KIBOR_3M | SBP website (manual) | `macro_indicators` | Daily (manual update) |
| CPI_YOY | PBS website (manual) | `macro_indicators` | Monthly |
| PKR_USD | SBP website (manual) | `macro_indicators` | Daily (manual update) |
| FX_RESERVES | SBP weekly release | `macro_indicators` | Weekly |
| BRENT_OIL | ICE (manual) | `macro_indicators` | Daily (manual update) |

**Consumed by:** `macro_latest` view → sector framework pages, AI context

---

## Data quality monitoring

All pipeline runs log to `ingestion_runs`. Data issues log to `data_quality_flags`. Critical issues create `pipeline_alerts` rows.

**Check for open alerts:**
```sql
SELECT pipeline_name, alert_type, severity, message, created_at
FROM pipeline_alerts
WHERE status = 'open'
ORDER BY created_at DESC
LIMIT 20;
```

**Check recent pipeline runs:**
```sql
SELECT pipeline_name, run_date, status, fetched, upserted, failed, trigger_type, started_at
FROM ingestion_runs
ORDER BY started_at DESC
LIMIT 10;
```

---

## Known gaps (as of 2026-05-19)

| Gap | Impact | Resolution |
|-----|--------|------------|
| `week_52_high` / `week_52_low` not computed | Shows "—" on all stock pages | Needs SQL function over daily_prices rolling 12 months |
| `pb_ratio`, `roe`, `debt_equity` not in companies | Shows "—" in Valuation Ratios | Needs financial data pipeline |
| macro_indicators updated manually | Stale data risk | Needs scraper for SBP / PBS |
| `companies.aliases` column empty | Symbol resolver relies only on static map | Populate from PSX company directory |
| Announcements pipeline not fully automated | May miss corporate actions | daily-events.yml runs but needs validation |
