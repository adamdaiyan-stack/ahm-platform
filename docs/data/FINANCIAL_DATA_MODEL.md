# AHM Platform — Financial Data Model

> Sprint 004 · Last updated: 2026-05-19

---

## Overview

The financial data layer spans six database tables and six TypeScript service modules. It is designed around three principles:

1. **Manual-first ingestion** — all data enters through a reviewed batch workflow; no autonomous scraping
2. **Normalized taxonomy** — every raw PSX label maps to a canonical metric code before storage
3. **Computed separation** — raw line items, derived ratios, and peer rankings live in separate tables

---

## Database Schema

### `financial_upload_batches` (migration 017)

Audit trail for every ingestion event. No financial data is written without a corresponding batch record.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `batch_name` | text | Human label for the batch |
| `source_type` | enum | `manual`, `api_capital_stake`, `pdf_extract`, `csv_import` |
| `submitted_by` | text | User/system that created the batch |
| `symbols_affected` | text[] | All symbols touched |
| `periods_affected` | text[] | Period keys in the batch |
| `status` | enum | `draft` → `submitted` → `approved` → `applied` (or `rejected`) |
| `reviewed_by` | text | Nullable — set on approval/rejection |
| `applied_at` | timestamptz | Set when rows are committed to financial tables |

---

### `financial_metric_definitions` (migration 018)

Canonical taxonomy: ~60 metric codes, each with display metadata, aliases, and sector applicability.

| Column | Type | Notes |
|---|---|---|
| `metric_code` | text PK | e.g. `REVENUE`, `NET_INCOME`, `NIM` |
| `display_name` | text | Human label for UI |
| `statement_type` | text | `income_statement`, `balance_sheet`, `cash_flow`, `ratio`, `per_share` |
| `unit_type` | text | `pkr_millions`, `ratio`, `percentage`, `count` |
| `aliases` | text[] | Raw PSX labels that map to this code |
| `sector_specific` | boolean | True for banking, cement, O&G-only metrics |
| `applicable_sectors` | text[] | Null = universal |
| `formula` | text | Derivation note (non-executable) |

**Seeded codes by statement type:**

- Income: `REVENUE`, `GROSS_PROFIT`, `EBITDA`, `OPERATING_PROFIT`, `FINANCE_COST`, `TAX_EXPENSE`, `NET_INCOME`
- Balance sheet: `TOTAL_ASSETS`, `TOTAL_EQUITY`, `NET_DEBT`, `SHARES_OUTSTANDING`, `CASH_AND_EQUIVALENTS`
- Cash flow: `CFO`, `CFI`, `CFF`, `CAPEX`, `FCF`, `DIVIDENDS_PAID`
- Ratios: `PE_RATIO`, `PB_RATIO`, `EV_EBITDA`, `ROE`, `ROA`, `GROSS_MARGIN`, `NET_MARGIN`, `DEBT_TO_EQUITY`
- Per share: `EPS`, `BVPS`, `DPS`, `CFPS`, `PAYOUT_RATIO`
- Banking: `NIM`, `NPL_RATIO`, `COVERAGE_RATIO`, `CASA_RATIO`, `NET_ADVANCES`, `NET_INVESTMENTS`
- Sector-specific: `OIL_PRODUCTION_BOPD`, `GAS_PRODUCTION_MMCFD`, `CEMENT_DISPATCHES_MT`, `UTILISATION_RATE`

---

### `financial_reporting_periods` (migration 019)

Period registry per company. One row per (symbol, period_key). Handles the heterogeneous Pakistani fiscal calendar.

| Column | Type | Notes |
|---|---|---|
| `symbol` | text | FK → companies |
| `period_key` | text | `FY25`, `1HFY25`, `3QFY25`, `TTM_3QFY25` |
| `period_type` | enum | `annual`, `half_year`, `quarter`, `nine_month`, `ttm`, `custom` |
| `fiscal_year` | integer | e.g. `2025` |
| `period_num` | integer | Null for annual; 1/2/3/4 for H/Q |
| `period_start` | date | |
| `period_end` | date | |
| `year_end_month` | integer | Default 6 (June); banks use 12 (December) |
| `is_announced` | boolean | True once result posted on PSX |
| `ttm_components` | text[] | For TTM rows: the 4 quarter keys assembled |

**Period key format:**

```
FY25           → Annual, fiscal year ending June 2025
1HFY25         → First half, ending December 2024
3QFY25         → Nine months, ending March 2025
TTM_3QFY25     → Trailing twelve months assembled from 4 quarters ending 3QFY25
```

**Pakistani fiscal year notes:**
- Standard (most companies): July–June year-end (month 6)
- Banks (HBL, MCB, UBL, ABL, BAFL, BAHL, FABL, MEBL, SNBL, AKBL, BOP, BOK, SILK, NBP, SCB, HMBL, JSBL, SMBL, MYBL, BIPL, FAYSAL): January–December year-end (month 12)
- A small number use September or March year-ends

The `inferYearEndMonth(symbol)` utility in `scripts/utils/period-utils.ts` handles this automatically.

---

### `financial_statement_lines` (migration 020)

Normalized raw line items. One row per (symbol, period_key, metric_code, is_consolidated). Preserves the exact source label for traceability.

| Column | Type | Notes |
|---|---|---|
| `symbol` | text | |
| `period_key` | text | FK → financial_reporting_periods |
| `metric_code` | text | FK → financial_metric_definitions |
| `raw_label` | text | Exact string from source document |
| `value` | numeric | In `value_unit` denomination |
| `value_unit` | text | `pkr_millions` (default), `pkr_thousands`, `pkr_billions`, `pkr_units` |
| `is_consolidated` | boolean | True for group accounts; false for standalone |
| `confidence` | numeric | 0–1 confidence score (1.0 = manually verified) |
| `upload_batch_id` | uuid | FK → financial_upload_batches |

The normalizer (`scripts/utils/financial-normalizer.ts`) maps `raw_label` → `metric_code` via a ~120-entry alias map and converts all values to PKR millions for consistency.

---

### `financial_ratio_snapshots` (migration 021)

Computed ratios, one row per (symbol, period_key, snapshot_date). Snapshots are immutable — recomputing creates a new row; the latest is used in queries.

**Valuation ratios:** `pe_ratio`, `pb_ratio`, `ev_ebitda`, `price_to_sales`, `price_to_fcf`

**Profitability:** `gross_margin`, `operating_margin`, `net_margin`, `ebitda_margin`, `roe`, `roa`, `roce`

**Growth (YoY %):** `revenue_growth`, `pat_growth`, `eps_growth`

**3-year CAGR:** `revenue_cagr_3y`, `pat_cagr_3y`

**Leverage:** `debt_to_equity`, `net_debt_to_ebitda`, `interest_coverage`

**Cash flow:** `cfo_to_pat`, `fcf_margin`, `capex_to_revenue`

**Per share:** `eps`, `bvps`, `dps`, `cfps`, `payout_ratio`, `dividend_yield`

**Banking-specific:** `nim`, `npl_ratio`, `coverage_ratio`, `casa_ratio`, `cost_to_income`

**Peer context (JSONB):**
```json
{
  "roe": {
    "rank": 2,
    "percentile": 87.5,
    "sector_avg": 18.4,
    "sector_n": 8,
    "best": 24.1,
    "worst": 9.2
  }
}
```

---

### `financial_metrics` (migrations 001 + 022)

Wide flat table — the primary analyst-facing working table. Migration 022 extended it with 35 new columns covering the full income statement, balance sheet, cash flow, and computed ratios. Used by `getFinancialHistory()` and the stock page's financial history table.

Key columns added in migration 022: `revenue_from_operations`, `cost_of_revenue`, `operating_profit`, `finance_cost`, `profit_before_tax`, `tax_expense`, `current_assets`, `cash_and_equivalents`, `inventories`, `trade_receivables`, `total_liabilities`, `current_liabilities`, `long_term_debt`, `net_debt`, `share_capital`, `retained_earnings`, `shares_outstanding`, `enterprise_value`, `cfi`, `cff`, `dividends_paid`, `operating_margin`, `current_ratio`, `net_debt_to_ebitda`, `cfo_to_pat`, `fcf_margin`, `revenue_cagr_3y`, `pat_cagr_3y`, `bvps`, `cfps`.

Audit columns: `is_consolidated`, `is_ttm`, `ttm_components`, `is_restated`, `restatement_notes`, `confidence`, `upload_batch_id`, `reviewed_by`, `reviewed_at`.

---

## TypeScript Types (`types/index.ts`)

| Type | Description |
|---|---|
| `FinancialMetrics` | Full row from `financial_metrics` (including all 022 columns) |
| `FinancialMetricsSummary` | Pick of the 10 most-used fields |
| `PeerContext` | `{ rank, percentile, sector_avg, sector_n, best, worst }` |
| `FinancialRatioSnapshot` | Full row from `financial_ratio_snapshots` including `peer_context` |
| `FinancialReportingPeriod` | Row from `financial_reporting_periods` |
| `FinancialStatementLine` | Row from `financial_statement_lines` |
| `FinancialUploadBatch` | Row from `financial_upload_batches` |

---

## Service Layer (`services/api/financials.ts`)

All components import from here — never call Supabase directly.

```typescript
getLatestRatioSnapshot(symbol)          // Most recent snapshot, any period type
getLatestAnnualRatioSnapshot(symbol)    // Most recent annual snapshot
getRatioHistory(symbol, limit?)         // Up to N annual snapshots, newest first
getRatioSnapshotsForPeers(symbols, periodType?, snapshotDate?)  // Peer table queries
getPeerContextForMetric(snapshot, metricKey)  // Extract one metric's peer context
getReportingPeriods(symbol, limit?)     // Period registry, newest first
getStatementLines(symbol, periodKey, statementType?)  // Normalized line items
getStockFinancialData(symbol)           // Aggregator: latestRatios + ratioHistory + periods
```

---

## Script Utilities

### `scripts/utils/period-utils.ts`

- `parsePeriodKey(key)` — parses `FY25` / `1HFY25` / `TTM_3QFY25` into structured object
- `getPeriodDates(parsed, yearEndMonth)` — returns `{periodStart, periodEnd}` as Dates
- `getTTMComponents(latestPeriodKey)` — returns the 4 quarter keys for a TTM period
- `getPriorYearPeriod(periodKey)` — `FY25 → FY24`, `3QFY25 → 3QFY24`
- `inferYearEndMonth(symbol)` — returns 6 or 12 based on symbol's fiscal calendar

### `scripts/utils/financial-normalizer.ts`

- `normalizeLabel(rawLabel, sector?)` — maps PSX raw label to canonical metric code
- `normalizeValue(value, valueUnit)` — converts to PKR millions
- `METRIC_TO_COLUMN` — maps metric code to `financial_metrics` column name

### `scripts/utils/ratio-engine.ts`

- `computeRatios(metrics, market, prior?)` — computes full `RatioSnapshot` from inputs
- `computeCAGR3Y(current, threeYearsAgo)` — `(end/start)^(1/3) - 1` as percentage
- `ratioSnapshotToDbRow(...)` — maps computed ratios to DB insert shape
- All arithmetic uses null-safe `div()` / `pct()` helpers — never produces NaN or Infinity

---

## Pipeline Scripts

| Script | Command | Description |
|---|---|---|
| `ingest-financials.ts` | `npm run ingest:financials` | Dry run; add `--apply` to commit |
| `calculate-financial-ratios.ts` | `npm run calc:ratios` | Computes ratios from `financial_metrics` |
| `compute-peer-rankings.ts` | `npm run compute:peers` | Updates `peer_context` JSONB in ratio snapshots |
| `audit-financials.ts` | `npm run audit:financials` | 8-rule validation; writes to `data_quality_flags` |

**Full pipeline:**
```bash
npm run pipeline:financials  # audit → calc:ratios → compute:peers
```

**Ingesting a new batch:**
```bash
# 1. Dry run first — review output
npm run ingest:financials -- --file=data/hbl-fy25.json

# 2. Apply after review
npm run ingest:financials:apply -- --file=data/hbl-fy25.json

# 3. Recompute ratios for affected symbol
npm run calc:ratios -- --symbol=HBL

# 4. Update peer rankings
npm run compute:peers
```

---

## Validation Rules (`audit-financials.ts`)

| Rule | Severity | Condition |
|---|---|---|
| Balance sheet equation | critical | `|assets - (liabilities + equity)| / assets > 2%` |
| Negative revenue | critical | `revenue < 0` |
| Margin sanity | warning | `gross_margin > 100%` or `net_margin < -200%` |
| Missing core metrics | critical/warning | Annual period lacks revenue, PAT, total_assets, total_equity |
| EPS consistency | warning | Reported EPS vs `PAT / shares` discrepancy > 10% |
| Growth sanity | warning | YoY revenue or PAT growth > 500% |
| Zero equity | critical | `total_equity < PKR 1M` |
| Stale data | warning | No annual data ingested in 18+ months |

Flags are written to `data_quality_flags` with `entity_type = 'financial_metric'` and `entity_id = '{symbol}:{period}'`.

---

## Peer Comparison Architecture

`compute-peer-rankings.ts` reads all `financial_ratio_snapshots` for a given period type (default: annual), groups by sector, then for each of 25+ metrics computes:

- **rank** within sector (1 = best)
- **percentile** (0–100)
- **sector_avg** (mean, excluding nulls)
- **sector_n** (number of peers with data)
- **best** and **worst** values in sector

Metric direction is explicit:
- `higher_better`: ROE, margins, coverage_ratio, CASA ratio, revenue growth
- `lower_better`: PE ratio, NPL ratio, cost_to_income, debt_to_equity

Results are stored as a JSONB blob on each snapshot row (`peer_context`). The UI reads this via `getPeerContextForMetric()`.

---

## Data Flow

```
PSX Financial Disclosure (PDF / manual entry)
        ↓
financial_upload_batches  (audit record created)
        ↓
financial-normalizer.ts   (raw label → metric_code, value → PKR millions)
        ↓
financial_statement_lines  (normalized raw items)
financial_metrics          (wide working table — upserted)
financial_reporting_periods (period registry — upserted)
        ↓
ratio-engine.ts            (metrics + market price → ratios)
        ↓
financial_ratio_snapshots  (immutable computed snapshot)
        ↓
compute-peer-rankings.ts   (sector grouping → rank/percentile)
        ↓
financial_ratio_snapshots.peer_context  (JSONB updated)
        ↓
services/api/financials.ts  (read layer for UI)
        ↓
app/stocks/[symbol]/page.tsx  (Valuation & Profitability + Financial Statements)
```

---

## Remaining Gaps & Recommended Next Sprint

1. **No real data ingested yet** — only the HBL FY24 illustrative sample in `ingest-financials.ts`. The first real-data task is sourcing and ingesting FY24/FY25 annual results for the KSE-100.

2. **PDF extraction not built** — deliberately excluded. When ready, it slots in as a new `source_type = 'pdf_extract'` batch with the same normalizer pipeline.

3. **Capital Stake API integration** — the API contract must explicitly permit persistent storage and historical backfill retention before integration begins.

4. **TTM assembly not automated** — `getTTMComponents()` exists but no pipeline auto-assembles TTM rows from quarterly data yet.

5. **Statement lines not surfaced in UI** — `financial_statement_lines` is queryable via `getStatementLines()` but no UI component reads it. A full income statement / balance sheet tab is the logical next step.

6. **Peer context UI** — `peer_context` JSONB is computed and stored but the stock page doesn't yet show sector rank/percentile. A small peer ranking bar component would complete the loop.
