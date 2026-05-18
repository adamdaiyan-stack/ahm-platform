# AHM Intelligence Platform — Data Pipeline Architecture
**Version:** 1.0  
**Classification:** Internal Engineering Reference  
**Status:** Sprint Active  
**Audience:** Backend engineers, data engineers, AI infrastructure architects

---

## Executive Summary

The AHM platform has a well-designed query and service layer but lacks the production data infrastructure that powers it. This document defines the complete architecture for ingestion, normalization, monitoring, macro intelligence, corporate actions, earnings tracking, AI readiness, and technology selection.

The design principle throughout is **institutional depth at startup operational cost**. Every table, every pipeline, every architectural decision is made with two constraints in mind simultaneously: it must work reliably today with one engineer, and it must scale to an institutional intelligence API without a full rewrite.

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Market Data Pipeline](#2-market-data-pipeline)
3. [Data Source Architecture](#3-data-source-architecture)
4. [Pipeline Infrastructure Layer](#4-pipeline-infrastructure-layer)
5. [Macro Intelligence Layer](#5-macro-intelligence-layer)
6. [Corporate Actions Engine](#6-corporate-actions-engine)
7. [Earnings & Catalyst Infrastructure](#7-earnings--catalyst-infrastructure)
8. [AI-Ready Data Architecture](#8-ai-ready-data-architecture)
9. [Technology Decisions](#9-technology-decisions)
10. [Implementation Order](#10-implementation-order)
11. [MVP vs Future State](#11-mvp-vs-future-state)
12. [Risk Analysis](#12-risk-analysis)
13. [Scalability Analysis](#13-scalability-analysis)
14. [Infrastructure Cost Model](#14-infrastructure-cost-model)

---

## 1. System Architecture Overview

### 1.1 Layered Data Architecture

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 0 — EXTERNAL DATA SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DPS PSX          SBP Website        PBS (CPI)
  PSX Announcements  Company IR Pages   SECP Filings
  Manual Analyst Entry                 FX / KIBOR Feeds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 1 — INGESTION LAYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  scripts/pipelines/
  ├── prices/        (daily OHLCV, index level)
  ├── fundamentals/  (quarterly results, annual financials)
  ├── macro/         (SBP rate, KIBOR, CPI, FX)
  ├── corporate/     (announcements, dividends, actions)
  └── earnings/      (result dates, actual vs estimate)

  Runtime: GitHub Actions cron (MVP) → Trigger.dev (Phase 2)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 2 — VALIDATION & NORMALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  lib/pipeline/
  ├── validators.ts    (price bounds, null guards, type coercion)
  ├── normalizers.ts   (symbol mapping, period labeling, unit conversion)
  └── reconcilers.ts   (cross-source consistency checks)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 3 — STORAGE (Supabase PostgreSQL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Core Market Data:
    daily_prices         index_history
    companies (snapshot)

  Fundamentals:
    financial_metrics    earnings_calendar

  Intelligence:
    sectors              sector_drivers
    sector_intelligence_blocks
    company_intelligence company_intelligence_blocks

  Research:
    research_reports     dividends
    announcements

  Corporate Actions:
    corporate_actions

  Macro:
    macro_indicators     sector_macro_linkages

  Operations:
    ingestion_runs       pipeline_alerts
    data_quality_flags

  AI Layer:
    daily_snapshots      intelligence_embeddings (future)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 4 — DERIVED DATA WORKERS (post-ingestion)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  After each price ingestion run:
  → compute_movers()       (top gainers / losers / active)
  → compute_sector_heat()  (sector avg change, total market cap)
  → compute_breadth()      (advances / declines / unchanged)
  → sync_company_snapshot() (propagate latest close into companies)
  → compute_daily_snapshot() (daily_snapshots row per symbol)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 5 — API & SERVICE LAYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  services/api/*.ts (existing, well-structured)
  Future: Python FastAPI microservice for AI/analytics workloads

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 6 — AI PROCESSING (Phase 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Narrative generation    Anomaly detection
  Conviction scoring      Sector summaries
  Semantic search         Catalyst clustering

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYER 7 — FRONTEND & API CONSUMERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Next.js (existing)      Future: External API (institutional)
```

### 1.2 Core Data Principles

Every datapoint in the system must carry:

| Field | Purpose |
|---|---|
| `source` | Where the data came from (e.g. `dps_psx`, `sbp_manual`, `analyst`) |
| `created_at` | When we ingested it |
| `updated_at` | When it was last modified |
| `is_estimate` | Whether it is actual or a forecast |

Every pipeline run must be:
- **Idempotent** — running it twice produces the same result, never duplicates
- **Retry-safe** — partial failures leave no dirty state
- **Logged** — every run writes to `ingestion_runs`
- **Validated** — records that fail validation write to `data_quality_flags`

---

## 2. Market Data Pipeline

### 2.1 Daily Price Ingestion Flow

```
4:30 PM PKT (after PSX close)
         │
         ▼
[GitHub Actions cron triggers]
         │
         ▼
scripts/pipelines/prices/run-daily.ts
         │
         ├── 1. Check today is a trading day
         │        (skip weekends, PSX holidays)
         │
         ├── 2. Fetch EOD data from DPS PSX
         │        dps.psx.com.pk/market-statistics
         │        → raw CSV / HTML table
         │
         ├── 3. Parse & validate each record
         │        price bounds check (±30% vs previous close)
         │        volume > 0
         │        OHLC integrity (high ≥ open, close ≥ low)
         │        symbol in companies master
         │
         ├── 4. Upsert into daily_prices
         │        ON CONFLICT (symbol, market_date) DO UPDATE
         │
         ├── 5. Upsert KSE-100 index into index_history
         │
         ├── 6. Run derived workers (sync_company_snapshot,
         │        compute_sector_heat, compute_breadth)
         │
         ├── 7. Write ingestion_runs row (success/partial/failed)
         │
         └── 8. Fire pipeline_alerts on anomalies or failures
```

### 2.2 `daily_prices` Table (existing — add indexes)

The table schema already exists. The following indexes are required for production performance:

```sql
-- Primary lookup: symbol + date (most common query pattern)
CREATE UNIQUE INDEX IF NOT EXISTS daily_prices_symbol_date_idx
  ON daily_prices (symbol, market_date DESC);

-- Date-only lookups (breadth calculations across all symbols for a day)
CREATE INDEX IF NOT EXISTS daily_prices_date_idx
  ON daily_prices (market_date DESC);

-- Source tracking for reconciliation
CREATE INDEX IF NOT EXISTS daily_prices_source_idx
  ON daily_prices (source, market_date DESC);
```

### 2.3 `index_history` Table (new)

```sql
CREATE TABLE index_history (
  id           serial PRIMARY KEY,
  index_name   text NOT NULL DEFAULT 'KSE-100',
  market_date  date NOT NULL,
  open         numeric,
  high         numeric,
  low          numeric,
  close        numeric NOT NULL,
  volume       bigint,
  advances     int,
  declines     int,
  unchanged    int,
  source       text NOT NULL,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (index_name, market_date)
);

CREATE INDEX index_history_name_date_idx ON index_history (index_name, market_date DESC);
```

**Why this matters:** Without index history, you cannot calculate beta, draw a KSE-100 chart, or compute alpha for any stock. It must be populated alongside daily_prices from day one.

### 2.4 Derived Workers (post-ingestion SQL functions)

These run after each successful price ingestion. They are SQL functions invoked by the pipeline script.

```sql
-- sync_company_snapshot: propagates latest close into companies table
CREATE OR REPLACE FUNCTION sync_company_snapshot(p_date date)
RETURNS void AS $$
  UPDATE companies c
  SET
    current_price   = dp.close,
    change          = dp.change,
    change_percent  = dp.change_percent,
    volume          = dp.volume,
    updated_at      = now()
  FROM daily_prices dp
  WHERE dp.symbol = c.symbol
    AND dp.market_date = p_date;
$$ LANGUAGE sql;

-- compute_market_breadth: updates market_index row
CREATE OR REPLACE FUNCTION compute_market_breadth(p_date date)
RETURNS void AS $$
  UPDATE market_index
  SET
    advances   = (SELECT COUNT(*) FROM daily_prices WHERE market_date = p_date AND change_percent > 0),
    declines   = (SELECT COUNT(*) FROM daily_prices WHERE market_date = p_date AND change_percent < 0),
    unchanged  = (SELECT COUNT(*) FROM daily_prices WHERE market_date = p_date AND change_percent = 0),
    updated_at = now()
  WHERE index_name = 'KSE-100';
$$ LANGUAGE sql;
```

### 2.5 Intraday-Ready Architecture

The current schema supports intraday without modification — just add a `market_time` column to `daily_prices` and a `tick_prices` table for later:

```sql
-- Future: tick data table (not for MVP — reserve the design)
-- CREATE TABLE tick_prices (
--   id          bigserial PRIMARY KEY,
--   symbol      text NOT NULL,
--   recorded_at timestamptz NOT NULL,
--   price       numeric NOT NULL,
--   volume      int,
--   trade_type  text  -- 'normal', 'crossed', 'negotiated'
-- );
-- PARTITION BY RANGE (recorded_at)
```

For intraday-ready daily data (Phase 2), the cleanest approach is a separate `intraday_ohlcv` table with 5-minute bars. This is kept entirely separate from `daily_prices` to avoid schema pollution at the MVP stage.

### 2.6 Movers & Sector Calculations

The current `getSectorPerformance()` function in `services/api/market.ts` fetches all companies and computes averages in TypeScript. At current PSX scale (~500 companies) this is acceptable. The production design should move this to:

1. A DB view for read performance:

```sql
CREATE OR REPLACE VIEW sector_performance_today AS
SELECT
  sector,
  COUNT(*)                                     AS company_count,
  AVG(change_percent)                          AS avg_change_pct,
  SUM(CASE WHEN change_percent > 0 THEN 1 ELSE 0 END) AS advances,
  SUM(CASE WHEN change_percent < 0 THEN 1 ELSE 0 END) AS declines,
  SUM(market_cap)                              AS total_market_cap
FROM companies
WHERE change_percent IS NOT NULL
GROUP BY sector
ORDER BY total_market_cap DESC;
```

2. Eventually materialized and refreshed post-ingestion rather than computed on every page request.

---

## 3. Data Source Architecture

### 3.1 Market Price Data

#### Option A: DPS PSX (Recommended for MVP)

- **URL:** `dps.psx.com.pk` — Pakistan Stock Exchange's official data portal
- **Coverage:** All listed securities, EOD OHLCV, index levels, market statistics
- **Format:** Structured table / downloadable CSV (market statistics page)
- **Latency:** Available ~30 minutes after market close
- **Cost:** Free
- **Reliability:** High — official exchange source
- **Legal risk:** Low — public market data, but no formal API terms. Build with user-agent headers and rate limiting.
- **Operational complexity:** Medium — requires HTML parsing, no structured API
- **Fragility:** Medium — page structure changes will break parser; add integration tests

**Recommended:** Use DPS PSX as the authoritative price source for MVP. Build the parser as a standalone module with a clear interface so the source can be swapped without touching the pipeline logic.

#### Option B: Yahoo Finance / Investing.com (Supplement)

- **Coverage:** Major PSX tickers only (~50-100 stocks with reliable data)
- **Cost:** Free (scraping), paid for bulk API
- **Legal risk:** Medium — scraping violates Yahoo's terms. Use the `yfinance` Python library for research/validation only, not production.
- **Use case:** Cross-validation of DPS PSX data during initial setup, not primary source

#### Option C: Paid Data Vendors (Future)

- **Refinitiv/LSEG, Bloomberg:** Authoritative, expensive (USD 10K-50K/year), not justified at current scale
- **Local Pakistani vendors:** Invest in Pakistan Research (IPR), AKD Securities data feeds — explore once platform has revenue
- **Migration path:** The `source` column on every price record means you can switch sources without schema changes. Build the ingestion interface contract cleanly, swap the implementation.

#### Decision Matrix

| Criterion | DPS PSX | Yahoo Finance | Paid Vendor |
|---|---|---|---|
| Authoritative | ✅ Official | ❌ Derived | ✅ |
| Cost | Free | Free | $$$  |
| PSX coverage | 100% | ~20% | 100% |
| Legal risk | Low | Medium | None |
| API stability | Medium | Low | High |
| Recommended phase | MVP | Supplement | Phase 3+ |

### 3.2 Financial Statements (Fundamentals)

No automated source exists for PSX quarterly and annual financials. The options are:

**Tier 1 (MVP): Analyst-curated normalized entry**
- Analyst reads quarterly results PDF from company IR page or PSX announcements
- Enters data into a structured template (a simple web form or spreadsheet upload)
- This is the correct approach for the first 20-30 companies and cannot be bypassed
- Estimated time: 30-45 minutes per company per quarter
- **This is your competitive moat** — no automated system has clean PSX financials

**Tier 2 (Phase 2): Structured PDF extraction**
- Build a Python pipeline that downloads results PDFs from PSX announcements
- Uses Claude API (document understanding) or GPT-4V to extract key metrics
- Output goes into a review queue — analyst validates before it hits the DB
- Reduces curation time from 45 minutes to 10 minutes per company
- The `source` field distinguishes `analyst_manual` from `ai_extracted_reviewed`

**Tier 3 (Future): SECP XBRL parsing**
- SECP is moving toward XBRL-tagged financial reporting (structured XML)
- When available, this enables fully automated ingestion with high confidence
- Design for this from the start — the schema already supports it

**Practical rule:** Never auto-populate `financial_metrics` without analyst review. Errors in EPS, PAT, or P/E compound through AI narratives and investor decisions. The confidence level (`source` + `notes`) must be explicit on every row.

### 3.3 Corporate Actions

**Source:** PSX publishes all corporate action announcements on its website and via its announcement system. This is the authoritative source.

- Dividends: PSX announcements → parse `dividend_cash` / `dividend_stock` actions
- Rights issues: PSX announcements + company circular
- Bonus shares: PSX announcements
- Book closure dates: PSX calendar

**Approach for MVP:** Manual entry from PSX announcements. Corporate actions are low frequency (~500-800 per year across all listed companies) but high value. Build the `corporate_actions` table now; populate manually at first.

**Phase 2:** Scrape PSX announcements feed to detect new corporate actions and queue them for analyst review/confirmation before they go live.

### 3.4 Macro Indicators

| Indicator | Source | Frequency | Method |
|---|---|---|---|
| SBP Policy Rate | sbp.org.pk | Per MPC meeting (6-8x/year) | Manual entry on announcement |
| KIBOR (1W, 1M, 3M, 6M) | sbp.org.pk/statistics | Daily | Automated scrape |
| CPI YoY | pbs.gov.pk | Monthly | Automated scrape on release |
| PKR/USD | sbp.org.pk/statistics | Daily | Automated scrape |
| Foreign Reserves | sbp.org.pk | Weekly | Automated scrape |
| FIPI Net Flow | PSX | Daily | Automated scrape |
| LIPI Net Flow | PSX | Daily | Automated scrape |
| Commodity Prices (Coal, LNG, Urea) | World Bank, Bloomberg | Weekly | Manual entry or free API |
| Cement Dispatches | APCMA website | Monthly | Manual entry |
| Auto Sales (PAMA) | pama.org.pk | Monthly | Manual entry |

**Design insight:** The macro indicators that move sector models the most (SBP rate, KIBOR, PKR/USD) are all on the SBP website and automatable. The sector-specific ones (cement dispatches, auto sales) are manually entered monthly — low frequency makes manual acceptable.

---

## 4. Pipeline Infrastructure Layer

### 4.1 `ingestion_runs` Table

The operational nervous system. Every pipeline execution, successful or not, writes here.

```sql
CREATE TABLE ingestion_runs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_name     text NOT NULL,        -- 'daily_prices', 'macro_sbp', 'financial_metrics'
  pipeline_version  text NOT NULL DEFAULT '1.0',
  run_date          date NOT NULL,        -- The business date this run covers
  source            text NOT NULL,        -- 'dps_psx', 'sbp_manual', 'analyst_entry'
  status            text NOT NULL DEFAULT 'running',
                    -- 'running' | 'success' | 'partial' | 'failed' | 'skipped'
  trigger           text NOT NULL DEFAULT 'cron',
                    -- 'cron' | 'manual' | 'retry' | 'backfill'
  records_attempted int DEFAULT 0,
  records_upserted  int DEFAULT 0,
  records_skipped   int DEFAULT 0,
  records_failed    int DEFAULT 0,
  symbols_failed    text[] DEFAULT '{}',
  error_summary     text,
  error_detail      jsonb,               -- Full error stack / per-symbol errors
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  CONSTRAINT valid_status CHECK (status IN ('running','success','partial','failed','skipped'))
);

CREATE INDEX ingestion_runs_pipeline_date_idx
  ON ingestion_runs (pipeline_name, run_date DESC);

CREATE INDEX ingestion_runs_status_idx
  ON ingestion_runs (status, started_at DESC)
  WHERE status IN ('failed', 'partial');  -- Partial index — only failures need fast lookup
```

### 4.2 `data_quality_flags` Table

```sql
CREATE TABLE data_quality_flags (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol        text,                   -- NULL for market-level flags
  market_date   date,
  flag_type     text NOT NULL,
  -- price_spike | missing_volume | stale_data | negative_eps |
  -- ohlc_invalid | volume_zero | symbol_not_in_master |
  -- reconciliation_mismatch | manual_review_required
  severity      text NOT NULL,          -- 'critical' | 'warning' | 'info'
  pipeline      text,                   -- Which pipeline raised this flag
  description   text NOT NULL,
  raw_value     jsonb,                  -- The offending record
  is_resolved   boolean DEFAULT false,
  resolved_at   timestamptz,
  resolved_by   text,                   -- 'auto' | analyst name
  resolution_note text,
  created_at    timestamptz DEFAULT now(),
  CONSTRAINT valid_severity CHECK (severity IN ('critical','warning','info'))
);

CREATE INDEX dqf_symbol_date_idx ON data_quality_flags (symbol, market_date DESC);
CREATE INDEX dqf_unresolved_idx  ON data_quality_flags (is_resolved, severity)
  WHERE is_resolved = false;
```

### 4.3 `pipeline_alerts` Table

```sql
CREATE TABLE pipeline_alerts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type   text NOT NULL,
  -- 'ingestion_failure' | 'data_stale' | 'price_anomaly' |
  -- 'reconciliation_fail' | 'missing_trading_day' | 'macro_not_updated'
  severity     text NOT NULL,           -- 'critical' | 'warning' | 'info'
  pipeline     text,
  symbol       text,
  market_date  date,
  message      text NOT NULL,
  detail       jsonb,
  notified     boolean DEFAULT false,   -- Sent to notification channel (Slack/email)?
  is_resolved  boolean DEFAULT false,
  resolved_at  timestamptz,
  created_at   timestamptz DEFAULT now()
);
```

### 4.4 Validation Rules Engine

Built as TypeScript functions in `lib/pipeline/validators.ts`:

```typescript
// Price validity
const MAX_DAILY_MOVE_PCT = 30;  // PSX circuit breaker limit
const MIN_PRICE = 0.01;

export function validateDailyPrice(record: RawPriceRecord, prevClose: number | null): ValidationResult {
  const errors: string[] = [];

  if (record.close <= MIN_PRICE) errors.push('close_below_minimum');
  if (record.high < record.low)  errors.push('high_below_low');
  if (record.high < record.close) errors.push('close_above_high');
  if (record.low  > record.close) errors.push('close_below_low');

  if (prevClose && record.close > 0) {
    const changePct = Math.abs((record.close - prevClose) / prevClose) * 100;
    if (changePct > MAX_DAILY_MOVE_PCT) errors.push(`price_spike:${changePct.toFixed(1)}%`);
  }

  return { valid: errors.length === 0, errors };
}

// Symbol normalization
export function normalizeSymbol(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}
```

### 4.5 Retry & Dead-Letter Strategy

**MVP approach (GitHub Actions):**
- Failed pipelines are re-triggered manually by observing the Actions failure notification
- The `trigger = 'retry'` flag on `ingestion_runs` distinguishes manual re-runs
- For partial failures (some symbols succeeded, some failed): the ON CONFLICT upsert means a retry is safe — only failed symbols need to re-run, but running all symbols again is equally safe

**Phase 2 (Trigger.dev):**
- Automatic retry with exponential backoff (3 attempts, 5/15/60 minute delays)
- Dead-letter queue: failures after 3 attempts write to `pipeline_alerts` with `severity = 'critical'`
- Alert delivery: Slack webhook (one message per critical failure, not per symbol)

### 4.6 Reconciliation System

A daily reconciliation job runs after ingestion to detect consistency issues:

```sql
-- Reconciliation query: symbols in companies master with no price for today
CREATE OR REPLACE FUNCTION reconcile_daily_prices(p_date date)
RETURNS TABLE(symbol text, issue text) AS $$
  SELECT c.symbol, 'missing_daily_price' AS issue
  FROM companies c
  WHERE NOT EXISTS (
    SELECT 1 FROM daily_prices dp
    WHERE dp.symbol = c.symbol AND dp.market_date = p_date
  )
  AND c.sector IS NOT NULL  -- Active companies only
  UNION ALL
  -- Symbols with suspiciously identical prices to previous day
  SELECT dp.symbol, 'identical_to_previous' AS issue
  FROM daily_prices dp
  JOIN daily_prices dp_prev
    ON dp.symbol = dp_prev.symbol
    AND dp_prev.market_date = p_date - 1
  WHERE dp.market_date = p_date
    AND dp.close = dp_prev.close
    AND dp.volume = dp_prev.volume;
$$ LANGUAGE sql;
```

---

## 5. Macro Intelligence Layer

### 5.1 `macro_indicators` Table

```sql
CREATE TABLE macro_indicators (
  id              serial PRIMARY KEY,
  indicator_code  text NOT NULL,
  -- Monetary: SBP_POLICY_RATE, KIBOR_1W, KIBOR_1M, KIBOR_3M, KIBOR_6M, KIBOR_1Y
  -- Inflation: CPI_YOY_PCT, CPI_MOM_PCT, PPI_YOY_PCT, FOOD_INFLATION_PCT
  -- Currency:  PKR_USD, PKR_SAR, PKR_AED, PKR_GBP
  -- Reserves:  SBP_RESERVES_USD_BN, TOTAL_RESERVES_USD_BN
  -- Flows:     FIPI_NET_PKR_MN, LIPI_NET_PKR_MN
  -- Commodities: COAL_PRICE_USD_TON, LNG_SPOT_USD_MMBTU, CRUDE_BRENT_USD_BBL,
  --              UREA_INT_USD_TON, DAP_INT_USD_TON, COTTON_USD_POUND
  -- Sector:    CEMENT_DISPATCHES_KT, AUTO_SALES_UNITS, TELECOM_SUBS_MN

  category        text NOT NULL,
  -- 'monetary' | 'inflation' | 'currency' | 'reserves' | 'flows'
  -- | 'commodities' | 'sector_volume'

  label           text NOT NULL,          -- Human-readable: 'SBP Policy Rate'
  reading_date    date NOT NULL,
  value           numeric NOT NULL,
  unit            text NOT NULL,          -- 'percent' | 'pkr_per_usd' | 'usd_per_barrel'
                                          -- | 'pkr_million' | 'pkr_billion' | 'kilo_tonnes'
  frequency       text NOT NULL,          -- 'daily' | 'weekly' | 'monthly' | 'quarterly'
  is_estimate     boolean DEFAULT false,  -- True for forward guidance
  source          text NOT NULL,          -- 'sbp', 'pbs', 'pama', 'apcma', 'manual'
  source_url      text,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (indicator_code, reading_date)
);

-- Indexes for time-series and AI queries
CREATE INDEX macro_indicators_code_date_idx
  ON macro_indicators (indicator_code, reading_date DESC);

CREATE INDEX macro_indicators_category_date_idx
  ON macro_indicators (category, reading_date DESC);
```

### 5.2 `sector_macro_linkages` Table

Maps which macro indicators drive which sectors, and in which direction. This is what allows the AI layer to generate contextually accurate sector narratives.

```sql
CREATE TABLE sector_macro_linkages (
  id              serial PRIMARY KEY,
  sector_slug     text NOT NULL REFERENCES sectors(slug),
  indicator_code  text NOT NULL,
  relationship    text NOT NULL,
  -- 'positive'  → higher indicator value = sector tailwind
  -- 'negative'  → higher indicator value = sector headwind
  -- 'complex'   → non-linear, context-dependent
  sensitivity     text NOT NULL DEFAULT 'medium',
  -- 'high' | 'medium' | 'low' — how quickly sector responds to changes
  transmission    text,
  -- How the indicator affects the sector (for AI context):
  -- e.g. "Higher KIBOR directly raises funding cost for banks investing in MTBs"
  description     text NOT NULL,
  UNIQUE (sector_slug, indicator_code)
);

-- Seed examples:
-- ('banking', 'SBP_POLICY_RATE',   'complex',  'high', 'SBP rate drives NIM...')
-- ('banking', 'KIBOR_3M',          'positive', 'high', 'KIBOR determines yields on short-term GS holdings...')
-- ('cement',  'COAL_PRICE_USD_TON','negative', 'high', 'Coal is ~35% of cement production cost...')
-- ('oil-gas', 'CRUDE_BRENT_USD_BBL','positive','high', 'Wellhead prices for OGDC/PPL/POL linked to Brent...')
-- ('power',   'PKR_USD',           'negative', 'high', 'IPP dollar-denominated capacity payments worsen circular debt...')
-- ('textiles','PKR_USD',           'positive', 'medium','PKR depreciation improves export competitiveness...')
```

### 5.3 AI-Ready Macro Context Query

This view is what the AI layer will call to get the current macro regime for any sector analysis:

```sql
CREATE OR REPLACE VIEW macro_latest AS
SELECT DISTINCT ON (indicator_code)
  indicator_code,
  category,
  label,
  reading_date,
  value,
  unit,
  is_estimate,
  source
FROM macro_indicators
ORDER BY indicator_code, reading_date DESC;

-- Example AI query: "Give me all macro indicators that affect banking"
-- SELECT ml.*, sml.relationship, sml.description, sml.sensitivity
-- FROM sector_macro_linkages sml
-- JOIN macro_latest ml ON ml.indicator_code = sml.indicator_code
-- WHERE sml.sector_slug = 'banking';
```

### 5.4 Macro Scenario Engine (Future)

The `is_estimate` flag and the sector linkage table set up a scenario analysis capability. A future feature ("stress test") could allow analysts to input hypothetical macro values and see projected sector impact ratings — all derived from the structured linkage data already in the DB.

---

## 6. Corporate Actions Engine

### 6.1 `corporate_actions` Table

```sql
CREATE TABLE corporate_actions (
  id                  serial PRIMARY KEY,
  symbol              text NOT NULL REFERENCES companies(symbol),
  action_type         text NOT NULL,
  -- 'cash_dividend'   → regular cash payout
  -- 'stock_dividend'  → dividend paid in shares
  -- 'bonus_shares'    → free bonus issue (e.g. 20% bonus)
  -- 'rights_issue'    → new shares offered to existing holders
  -- 'stock_split'     → increases share count, reduces par value
  -- 'reverse_split'   → decreases share count
  -- 'merger_acquisition' → M&A event
  -- 'delisting'       → company removed from exchange

  -- Timing fields
  announced_date       date,
  board_meeting_date   date,
  book_closure_start   date,
  book_closure_end     date,
  record_date          date,
  ex_date              date,           -- First day trading ex-entitlement
  payment_date         date,

  -- Financial parameters
  face_value           numeric,        -- PKR face value per share
  cash_amount          numeric,        -- Per share payout (cash dividends)
  ratio                numeric,        -- Bonus/rights ratio (e.g. 0.20 = 1 for every 5)
  rights_price         numeric,        -- Subscription price for rights
  split_factor         numeric,        -- e.g. 0.5 for 2-for-1 split

  -- Price adjustment
  adjustment_factor    numeric,
  -- Calculated as: (price_before_ex - entitlement_value) / price_before_ex
  -- For cash dividend: 1 - (dividend / prev_close)
  -- For bonus: shares_held / (shares_held + bonus_shares)
  -- Applied to ALL historical prices before ex_date to make series comparable

  -- Context
  financial_year       text,           -- 'FY25'
  period               text,           -- 'Final', 'Interim', '1H', 'Special'
  status               text DEFAULT 'announced',
  -- 'announced' | 'confirmed' | 'completed' | 'cancelled'

  source               text NOT NULL,
  announcement_url     text,
  notes                text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

CREATE INDEX ca_symbol_exdate_idx ON corporate_actions (symbol, ex_date DESC);
CREATE INDEX ca_exdate_idx        ON corporate_actions (ex_date DESC);
CREATE INDEX ca_status_idx        ON corporate_actions (status)
  WHERE status != 'completed';
```

### 6.2 Adjustment Factor Logic

The adjustment factor is the key that makes historical price charts institutionally valid.

```
CASH DIVIDEND ADJUSTMENT FACTOR
  factor = (close_before_ex - dividend_per_share) / close_before_ex
  Applied: multiply all prices BEFORE ex_date by this factor

BONUS ISSUE ADJUSTMENT FACTOR
  factor = original_shares / (original_shares + bonus_shares)
  Example: 20% bonus → factor = 100 / 120 = 0.8333
  Applied: multiply all prices BEFORE bonus ex_date by 0.8333

RIGHTS ISSUE ADJUSTMENT FACTOR
  factor = (close_before + rights_ratio × rights_price) / (1 + rights_ratio) / close_before
  This is more complex and requires close_before_ex to compute.

CUMULATIVE ADJUSTMENT
  For a stock with multiple corporate actions in its history, apply each
  adjustment factor chronologically. Never apply out of order.
```

The `daily_prices` table should add an `adjusted_close` column populated by this engine:

```sql
ALTER TABLE daily_prices ADD COLUMN IF NOT EXISTS adjusted_close numeric;
ALTER TABLE daily_prices ADD COLUMN IF NOT EXISTS cumulative_adj_factor numeric DEFAULT 1.0;
```

### 6.3 Dividend Yield Framework

With corporate_actions properly populated, dividend yield calculations become institutional-grade:

```sql
-- Trailing twelve-month dividend yield for all companies
CREATE OR REPLACE VIEW ttm_dividend_yield AS
SELECT
  ca.symbol,
  SUM(ca.cash_amount) AS ttm_dps,
  c.current_price,
  ROUND((SUM(ca.cash_amount) / NULLIF(c.current_price, 0)) * 100, 2) AS dividend_yield_pct
FROM corporate_actions ca
JOIN companies c ON c.symbol = ca.symbol
WHERE ca.action_type = 'cash_dividend'
  AND ca.ex_date >= CURRENT_DATE - INTERVAL '12 months'
  AND ca.status = 'completed'
GROUP BY ca.symbol, c.current_price;
```

---

## 7. Earnings & Catalyst Infrastructure

### 7.1 `earnings_calendar` Table

```sql
CREATE TABLE earnings_calendar (
  id                  serial PRIMARY KEY,
  symbol              text NOT NULL REFERENCES companies(symbol),
  period              text NOT NULL,       -- 'FY25', '1HFY25', '1QFY25', '3QFY25'
  period_type         text NOT NULL,       -- 'annual' | 'half_year' | 'quarter'
  period_end_date     date,

  -- Timing
  expected_date       date,               -- Best estimate for result announcement
  board_meeting_date  date,               -- BOM date when results approved
  actual_date         date,               -- When results were published

  -- Status lifecycle
  status              text DEFAULT 'expected',
  -- 'expected' | 'confirmed' | 'announced' | 'delayed' | 'cancelled'

  -- Pre-result estimates (analyst consensus or single-analyst estimate)
  eps_estimate        numeric,
  pat_estimate        numeric,            -- PKR millions
  revenue_estimate    numeric,            -- PKR millions
  dps_estimate        numeric,

  -- Actuals (populated after result announcement)
  eps_actual          numeric,
  pat_actual          numeric,
  revenue_actual      numeric,
  dps_actual          numeric,

  -- Surprise calculations (computed columns)
  eps_surprise_pct    numeric GENERATED ALWAYS AS (
    CASE WHEN eps_estimate IS NOT NULL AND eps_estimate != 0
    THEN ROUND(((eps_actual - eps_estimate) / ABS(eps_estimate)) * 100, 2)
    ELSE NULL END
  ) STORED,

  pat_surprise_pct    numeric GENERATED ALWAYS AS (
    CASE WHEN pat_estimate IS NOT NULL AND pat_estimate != 0
    THEN ROUND(((pat_actual - pat_estimate) / ABS(pat_estimate)) * 100, 2)
    ELSE NULL END
  ) STORED,

  -- Quality & guidance (for AI)
  quality_notes       text,               -- "One-time gain of PKR 2.3B included"
  guidance_text       text,               -- Management commentary extracted
  conference_call_notes text,

  source              text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),
  UNIQUE (symbol, period)
);

CREATE INDEX ec_symbol_period_idx  ON earnings_calendar (symbol, period_end_date DESC);
CREATE INDEX ec_expected_date_idx  ON earnings_calendar (expected_date)
  WHERE status IN ('expected', 'confirmed');
CREATE INDEX ec_surprise_idx       ON earnings_calendar (ABS(eps_surprise_pct) DESC)
  WHERE eps_surprise_pct IS NOT NULL;
```

### 7.2 Catalyst Tagging System

The `company_intelligence_blocks` table already supports catalysts with `block_type = 'catalyst'` and `horizon` (near/medium/long). The earnings calendar connects to this system:

```sql
-- Link earnings results to intelligence blocks
ALTER TABLE earnings_calendar
  ADD COLUMN IF NOT EXISTS related_intel_block_ids uuid[];
-- After a result, analyst tags which catalyst blocks were triggered,
-- delayed, or invalidated. The AI layer uses this to update conviction scores.
```

### 7.3 Earnings-Driven Alert Logic

Post-result workflow:

```
Result announced on PSX
         │
         ▼
Analyst updates earnings_calendar
  → sets actual EPS/PAT
  → eps_surprise_pct computed automatically
         │
         ▼
If |eps_surprise_pct| > 15%:
  → auto-create data_quality_flag with flag_type = 'earnings_surprise'
  → pipeline_alert with context
         │
         ▼
AI layer generates updated conviction narrative
  (reads: earnings_calendar + financial_metrics + company_intelligence_blocks)
```

---

## 8. AI-Ready Data Architecture

### 8.1 Design Philosophy

The AI layer must consume **structured rows**, not prose. Every AI insight must be traceable to a specific DB record. No hallucination path should exist. This is achieved by:

1. **Structured inputs only:** AI receives typed JSON assembled from DB queries, not free-text scraped content.
2. **Source attribution on every row:** AI outputs can cite the source record that produced the insight.
3. **Audit trail:** Every AI-generated insight stored in the DB links to the records that generated it.

### 8.2 `daily_snapshots` Table (AI Context Row)

One row per company per day — a denormalized context package that the AI layer can consume without joining 6 tables:

```sql
CREATE TABLE daily_snapshots (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol                   text NOT NULL,
  snapshot_date            date NOT NULL,

  -- Price context
  close                    numeric,
  change_pct               numeric,
  volume                   bigint,
  week_52_high             numeric,
  week_52_low              numeric,
  pct_from_52w_high        numeric,  -- (close - 52w_high) / 52w_high * 100

  -- Technical signals (computed by pipeline)
  ma_20                    numeric,
  ma_50                    numeric,
  ma_200                   numeric,
  rsi_14                   numeric,
  price_vs_ma50_pct        numeric,

  -- Fundamental snapshot (from latest financial_metrics)
  pe_ratio                 numeric,
  pb_ratio                 numeric,
  ev_ebitda                numeric,
  eps_ttm                  numeric,
  roe                      numeric,
  net_margin               numeric,
  dividend_yield           numeric,

  -- Market context (sector and index for relative performance)
  sector                   text,
  sector_avg_change_pct    numeric,
  kse100_change_pct        numeric,
  relative_performance_pct numeric,  -- stock change - index change

  -- Macro context (snapshot of key macro at this date)
  sbp_policy_rate          numeric,
  kibor_3m                 numeric,
  pkr_usd                  numeric,

  UNIQUE (symbol, snapshot_date)
);

CREATE INDEX ds_symbol_date_idx ON daily_snapshots (symbol, snapshot_date DESC);
CREATE INDEX ds_date_idx        ON daily_snapshots (snapshot_date DESC);
```

This table is the primary feed for:
- Anomaly detection (is today's pattern unusual?)
- Narrative generation ("HBL is trading at 5.8x P/E, 12% below its 50-day MA, while the banking sector rose 1.2% today")
- Time-series AI analysis
- Conviction scoring inputs

### 8.3 pgvector — Embeddings Strategy

Supabase includes the `pgvector` extension. Enable it once and the entire intelligence layer becomes semantically searchable without an external vector database.

```sql
-- Enable extension (one-time, in Supabase SQL editor)
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings table
CREATE TABLE intelligence_embeddings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table    text NOT NULL,        -- 'sector_intelligence_blocks' | 'company_intelligence_blocks' | 'research_reports'
  source_id       text NOT NULL,        -- The UUID/ID from the source table
  content_hash    text NOT NULL,        -- SHA-256 of content — skip re-embedding if unchanged
  embedding       vector(1536),         -- OpenAI text-embedding-3-small dimensions
  model           text NOT NULL DEFAULT 'text-embedding-3-small',
  created_at      timestamptz DEFAULT now(),
  UNIQUE (source_table, source_id)
);

CREATE INDEX embeddings_vector_idx ON intelligence_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

**What gets embedded:**
- Every `sector_intelligence_blocks` row (title + body)
- Every `company_intelligence_blocks` row (title + body)
- Every `research_reports` summary
- Every `announcements` body (Phase 2)

**What this enables:**
- "Find all intelligence blocks related to circular debt" → semantic search, not keyword match
- "Which company risks are most similar to OGDC's liquidity risk?" → vector similarity
- "Summarize sector risks that mention government receivables" → RAG-based narrative

### 8.4 AI Context Assembly Pattern

When the AI layer needs to generate a narrative or analysis, it assembles a structured context object — never a raw string:

```typescript
// lib/ai/context-builder.ts

export type AICompanyContext = {
  company:         Company;
  latestMetrics:   FinancialMetrics | null;
  priceHistory:    DailyPrice[];          // Last 30 days
  todaySnapshot:   DailySnapshot | null;
  intelBlocks:     CompanyIntelBlock[];   // Thesis, drivers, risks, catalysts
  recentEarnings:  EarningsCalendar[];    // Last 2 periods
  macroContext:    MacroLatest[];         // Relevant macro indicators for sector
  sectorLinkages:  SectorMacroLinkage[]; // How macro drives this sector
};

export async function buildCompanyAIContext(symbol: string): Promise<AICompanyContext> {
  // All queries run in parallel
  const [company, metrics, prices, snapshot, blocks, earnings, macroLinkages] =
    await Promise.all([
      getCompanyBySymbol(symbol),
      getLatestAnnualMetrics(symbol),
      getPriceHistory(symbol, 30),
      getTodaySnapshot(symbol),
      getCompanyIntelBlocks(symbol),
      getEarningsHistory(symbol, 4),
      getSectorMacroContext(symbol),
    ]);

  return { company, latestMetrics: metrics, priceHistory: prices,
           todaySnapshot: snapshot, intelBlocks: blocks,
           recentEarnings: earnings, macroContext: macroLinkages.macro,
           sectorLinkages: macroLinkages.linkages };
}
```

This context object is then serialized to JSON and passed to the AI model. The AI has full structured access to everything it needs and nothing it doesn't.

### 8.5 Intelligence Graph Concepts (Future Phase)

As the platform scales, relationships between entities form an intelligence graph:

```
Company → Sector → Macro Indicators → Other Sectors
Company → Peers (same sector)
Company → Shared catalysts (e.g. "SBP rate cut" affects ALL banks)
Company → Corporate action → Price adjustment
Research report → Multiple companies
Earnings surprise → Catalyst block resolved/updated
```

PostgreSQL's foreign key system already models this. The `related_symbols` array on intelligence blocks, the `ticker_symbols` array on research reports, and the sector linkage table are the beginning of this graph. When the platform is ready for a proper graph layer, Neo4j or Apache AGE (Postgres extension) can be added without redesigning the relational schema.

---

## 9. Technology Decisions

### 9.1 Database — PostgreSQL (Supabase) ✅

**Decision: Stay with Supabase PostgreSQL. No TimescaleDB. Add pgvector.**

**TimescaleDB is not needed at PSX scale:**
- ~500 companies × 252 trading days = ~126,000 rows/year in `daily_prices`
- 10 years of history = 1.26M rows. This is trivially small for standard PostgreSQL.
- TimescaleDB adds operational complexity with hypertables, chunk management, and retention policies.
- Proper indexing on `(symbol, market_date DESC)` makes PostgreSQL just as fast for this workload.
- Revisit at 50M+ rows / intraday tick data.

**pgvector: Add now (zero operational cost, massive future value)**
- Ships with Supabase, enabled with one SQL command
- Enables semantic search over all intelligence blocks without external infrastructure
- Embedding ~3,000 blocks at launch costs ~$0.01

### 9.2 Scheduling

| Phase | Tool | Rationale |
|---|---|---|
| **MVP** | GitHub Actions cron | Free, version-controlled, visual failure UI, no additional infrastructure |
| **Phase 2** | Trigger.dev | Automatic retries, observability, job queuing, generous free tier |
| **Future** | Temporal | Full workflow orchestration for complex multi-step pipelines |

**Avoid:** Supabase pg_cron for HTTP-based ingestion (it runs SQL, not Node.js scripts). Supabase Edge Functions for long-running scraping tasks (60s timeout limit).

**GitHub Actions cron schedule (MVP):**
```yaml
# .github/workflows/daily-prices.yml
on:
  schedule:
    - cron: '30 11 * * 1-5'  # 4:30 PM PKT = 11:30 UTC, weekdays only
```

### 9.3 Queue System

**MVP: No queue needed.**
The ingestion scripts process 500 symbols sequentially in ~30 seconds. No queue overhead is justified.

**Phase 2: Trigger.dev** provides job queuing natively when scheduling complexity increases.

**Future: BullMQ + Upstash Redis** if you need parallel ingestion workers, priority queues, or rate-limited external API calls. Do not add this before the need is real.

### 9.4 API Layer

**Decision: Hybrid architecture**

| Layer | Technology | Purpose |
|---|---|---|
| **UI queries** | Next.js API routes + Supabase client | Serving frontend — already built, keep |
| **AI/analytics** | Python FastAPI microservice | Claude/GPT calls, Pandas computation, embedding generation |
| **External API (future)** | FastAPI | Institutional data API for third-party clients |

The Python service is separate from the Next.js app. It runs on Railway and communicates with the same Supabase database. This allows the AI layer to use the full Python ML/data science ecosystem (Pandas, NumPy, LangChain, sentence-transformers) without polluting the TypeScript codebase.

### 9.5 Hosting

| Component | MVP | Phase 2 | Future |
|---|---|---|---|
| Frontend | Vercel ✅ | Vercel | Vercel |
| Database | Supabase ✅ | Supabase | Supabase / dedicated PG |
| Pipeline scripts | GitHub Actions | Railway worker | Railway / AWS ECS |
| AI service | - | Railway (Python) | Railway / AWS Lambda |
| File storage | Supabase Storage | Supabase Storage | Cloudflare R2 |

**Why Railway for pipelines (Phase 2):** Simple deployment, persistent workers, cheap ($5-20/month), excellent Node.js and Python support, no Kubernetes complexity.

**Why not AWS now:** Operational overhead of EC2, ECS, S3, RDS, Lambda, IAM is not justified until you have a team and meaningful revenue. Every AWS service that Supabase + Railway + Vercel replaces is a service you don't have to operate.

### 9.6 Caching Strategy

```
Request → Next.js ISR cache (60s for market pages)
                │
                └─ Miss → Supabase connection pool (pgBouncer, built-in)
                                │
                                └─ Query → PostgreSQL
```

**MVP:** Next.js ISR (Incremental Static Regeneration) with 60-second revalidation for market pages. This means most users hit a cached page, not the database.

**Phase 2:** Upstash Redis ($0 free tier, then pay-per-use) for:
- KSE-100 index snapshot (update every 60 seconds during market hours)
- Top movers list (update every 5 minutes during market hours)
- Sector performance cache

Do not add Redis until you have measurable database load. Premature caching is a maintenance burden.

### 9.7 Final Recommended Stack Summary

```
PRODUCTION STACK — AHM INTELLIGENCE PLATFORM

Runtime Language:   TypeScript (Node.js 22) — pipelines + API
AI/Analytics:       Python 3.11 — AI service (Phase 2)
Database:           Supabase PostgreSQL (with pgvector)
Frontend:           Next.js on Vercel
Pipeline scheduler: GitHub Actions cron (MVP) → Trigger.dev (Phase 2)
Pipeline runtime:   GitHub Actions (MVP) → Railway worker (Phase 2)
AI hosting:         Railway (Phase 2)
Object storage:     Supabase Storage (documents, PDFs)
Queue:              None (MVP) → Trigger.dev / BullMQ+Upstash (Phase 2)
Cache:              Next.js ISR (MVP) → Upstash Redis (Phase 2)
Monitoring:         ingestion_runs table + GitHub Actions UI (MVP)
                    → Trigger.dev dashboard + pipeline_alerts (Phase 2)
Embeddings:         pgvector (Supabase extension, zero cost)
Embedding model:    OpenAI text-embedding-3-small (~$0.02/1M tokens)
LLM:                Claude API (narrative generation, PDF extraction)
```

---

## 10. Implementation Order

### Phase 0 — Schema Foundation (Week 1)

Apply the following migrations in order. Each is independent and safe to apply to the live database.

```
Migration 001: CREATE TABLE index_history
Migration 002: CREATE TABLE ingestion_runs
Migration 003: CREATE TABLE data_quality_flags
Migration 004: CREATE TABLE pipeline_alerts
Migration 005: CREATE TABLE macro_indicators
Migration 006: CREATE TABLE sector_macro_linkages
Migration 007: CREATE TABLE corporate_actions (replaces/extends dividends)
Migration 008: CREATE TABLE earnings_calendar
Migration 009: CREATE TABLE daily_snapshots
Migration 010: Add indexes to daily_prices
Migration 011: ALTER TABLE daily_prices ADD adjusted_close, cumulative_adj_factor
Migration 012: CREATE VIEW sector_performance_today
Migration 013: CREATE VIEW macro_latest
Migration 014: CREATE VIEW ttm_dividend_yield
Migration 015: CREATE EXTENSION vector (pgvector)
Migration 016: CREATE TABLE intelligence_embeddings
Migration 017: CREATE FUNCTION sync_company_snapshot
Migration 018: CREATE FUNCTION compute_market_breadth
Migration 019: CREATE FUNCTION reconcile_daily_prices
```

### Phase 1 — Price Pipeline (Weeks 1–2)

1. Build `scripts/pipelines/prices/dps-psx-scraper.ts`
2. Build `lib/pipeline/validators.ts` and `lib/pipeline/normalizers.ts`
3. Build `scripts/pipelines/prices/run-daily.ts` (orchestrator)
4. Set up GitHub Actions workflow (`.github/workflows/daily-prices.yml`)
5. Backfill `daily_prices` for last 90 days
6. Backfill `index_history` for last 90 days
7. Run `sync_company_snapshot()` — companies table now has real data
8. Validate: all service layer queries return real data

### Phase 2 — Macro & Corporate Actions (Weeks 2–3)

1. Build `scripts/pipelines/macro/sbp-scraper.ts` (policy rate, KIBOR, reserves, FX)
2. Seed `sector_macro_linkages` for all 8 sectors
3. Seed `corporate_actions` for last 2 years (manual, priority: banking sector)
4. Seed `earnings_calendar` for next 2 result seasons
5. Build `scripts/pipelines/macro/run-daily.ts`

### Phase 3 — Financial Metrics Workflow (Week 3)

1. Build structured data entry template for analyst financial metrics input
2. Validate `financial_metrics` has source and period data for top 30 companies
3. Build `financial_metrics` validation rules
4. Ensure all company intelligence pages have real fundamentals data

### Phase 4 — Derived Workers & Monitoring (Week 4)

1. `daily_snapshots` computation worker (runs post price ingestion)
2. Full reconciliation job
3. `pipeline_alerts` → Slack webhook notification
4. Sector performance view integrated into frontend

### Phase 5 — AI Infrastructure (Month 2)

1. Enable pgvector, create `intelligence_embeddings` table
2. Embed all existing intelligence blocks (~500 rows, ~$0.001 cost)
3. Build semantic search API endpoint
4. Build `buildCompanyAIContext()` function
5. First AI narrative generation integration (stock detail page)

---

## 11. MVP vs Future State

### MVP (Deliverable in 4 weeks)

| Capability | Included |
|---|---|
| Daily OHLCV ingestion (DPS PSX) | ✅ |
| KSE-100 index history | ✅ |
| Company snapshot sync | ✅ |
| ingestion_runs monitoring | ✅ |
| data_quality_flags | ✅ |
| Macro indicators (manual entry first) | ✅ |
| Corporate actions (manual, banking sector) | ✅ |
| Earnings calendar | ✅ |
| Sector performance view | ✅ |
| GitHub Actions scheduling | ✅ |

### Future State (Months 2–6)

| Capability | Phase |
|---|---|
| Adjusted price history (corporate actions) | Phase 2 |
| Automated macro scrapers | Phase 2 |
| PDF financial extraction (AI-assisted) | Phase 2 |
| pgvector semantic search | Phase 2 |
| daily_snapshots + technical signals | Phase 2 |
| AI narrative generation | Phase 2 |
| Trigger.dev pipeline orchestration | Phase 2 |
| Python AI microservice | Phase 3 |
| Intraday data | Phase 3 |
| External institutional API | Phase 4 |
| Real-time data feed | Phase 4 |

---

## 12. Risk Analysis

### Data Source Risks

**R1: DPS PSX page structure changes** (Probability: Medium, Impact: High)
- Mitigation: Build parser behind a clean interface contract. Write integration tests that alert on parse failures. The `ingestion_runs` table will catch failures within one trading day.

**R2: Manual data entry errors in financial_metrics** (Probability: High, Impact: Medium)
- Mitigation: Build validation rules that flag statistical outliers. Require `notes` field for unusual values. Analyst review step before data goes live.

**R3: Corporate actions missed** (Probability: Medium, Impact: High for charting)
- Mitigation: Cross-check dividend yields against financial_metrics DPS field. Outlier detection on price series will surface unadjusted splits.

**R4: Stale macro data** (Probability: Low, Impact: Medium)
- Mitigation: `pipeline_alerts` with `alert_type = 'macro_not_updated'` when an indicator has not been updated within its expected frequency window.

### Infrastructure Risks

**R5: Supabase free tier limits** (Probability: Low initially, Impact: Medium later)
- Mitigation: Monitor row counts and storage. At 1 year of daily prices for 500 companies = ~126K rows. Well within free tier. Paid tier ($25/month) extends this substantially.

**R6: GitHub Actions minutes limit** (Probability: Low, Impact: Low)
- Mitigation: Free tier provides 2,000 minutes/month. Price ingestion takes ~2 minutes/day × 22 days = 44 minutes. Well within limits.

**R7: AI hallucinations in narrative layer** (Probability: High without design, Impact: Critical)
- Mitigation: AI layer only consumes structured JSON context objects assembled from DB records. No web scraping or unstructured text feeds into AI prompts. Every AI output is tagged with the source records used.

---

## 13. Scalability Analysis

### Current capacity

The current architecture handles:
- 500 companies × 252 days/year = 126K rows/year in `daily_prices`
- ~50 financial metrics periods per company = 25K rows total
- ~1,000 intelligence blocks across all sectors and companies

This is comfortably within Supabase's free tier and would not stress a single PostgreSQL instance at any scale.

### 10x Scale (5,000 companies, 10 years of history)

- `daily_prices`: 12.6M rows — PostgreSQL handles this comfortably with proper indexing
- No schema changes required
- Consider partial indexes on active symbols

### 100x Scale (institutional tick data)

At tick-level granularity for all PSX symbols during market hours:
- ~50 symbols × 6 ticks/minute × 360 minutes/day = ~108K ticks/day = ~27M rows/year
- This is where TimescaleDB or a purpose-built time-series DB (QuestDB, InfluxDB) becomes worth considering
- The current design does not preclude this — a separate `tick_prices` table with different storage characteristics can be added without touching any existing schema

### Institutional API Scale

When the platform serves external API consumers:
- Add read replicas via Supabase (available on paid plans)
- Promote the Python AI microservice to a proper API gateway
- Upstash Redis cache in front of frequently-accessed endpoints (market snapshot, index history)
- The `daily_snapshots` table is specifically designed for this — it is a pre-computed, low-join read target for any API client

---

## 14. Infrastructure Cost Model

### MVP Monthly Costs (Month 1–3)

| Component | Cost |
|---|---|
| Supabase (free tier) | $0 |
| Vercel (free tier) | $0 |
| GitHub Actions (free tier) | $0 |
| OpenAI embeddings (initial) | ~$0.01 one-time |
| **Total** | **~$0/month** |

### Phase 2 Monthly Costs (Month 3–6)

| Component | Cost |
|---|---|
| Supabase Pro | $25/month |
| Railway (pipeline worker + AI service) | $15–30/month |
| Vercel Pro (if needed) | $20/month |
| Trigger.dev (free tier likely sufficient) | $0–20/month |
| OpenAI / Claude API (AI narratives) | $10–50/month |
| **Total** | **~$70–150/month** |

### Institutional Scale (Year 2+)

| Component | Cost |
|---|---|
| Supabase Team | $599/month |
| Railway (multiple workers) | $100–200/month |
| AI API costs (higher volume) | $200–500/month |
| CDN / Cloudflare | $20/month |
| **Total** | **~$1,000–1,500/month** |

This is the cost structure of a production institutional intelligence platform — comparable to what Bloomberg charges ~$24,000/year per terminal. The operating cost is orders of magnitude lower.

---

*Document version 1.0 — AHM Intelligence Platform Data Pipeline Architecture Sprint*  
*All schema SQL is idempotent and safe to apply to existing Supabase instance.*  
*Migration scripts should be applied in numbered order.*
