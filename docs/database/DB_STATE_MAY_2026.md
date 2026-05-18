# AHM Platform — Database State Snapshot

**Date:** May 2026  
**Database:** Supabase PostgreSQL  
**Project ID:** `qiunhqgxsjyvcrcnfajl`  
**Schema Version:** Company Intelligence DB Architecture Phase (Sprint 8-10)  
**Status:** Active development — Phase 1 intelligence infrastructure complete

---

> This document is the source of truth for what exists in the database as of May 2026.
> Update this document after every migration or major seeding sprint.
> AI assistants must read this before writing any data-related code.

---

## Table Inventory

| Table | Rows (approx) | Purpose | Status |
|-------|--------------|---------|--------|
| `companies` | ~20 seeded | PSX company registry | Partial — needs full PSX universe |
| `market_index` | 1 | KSE-100 snapshot | Active |
| `daily_prices` | varies | OHLCV time-series | Partial seeding |
| `financial_metrics` | ~16 | Period fundamentals | 4 companies × 2-3 periods |
| `sectors` | 7 | Sector registry | Complete — all 7 seeded |
| `sector_drivers` | ~42 | Sector macro drivers | Complete — 6 per sector |
| `sector_intelligence_blocks` | varies | Sector intel items | Seeded for all 7 sectors |
| `dividends` | partial | Dividend history | Partial |
| `announcements` | partial | PSX announcements | Partial |
| `research_reports` | 2 | Equity research | UBL + HUBC published |
| `company_intelligence` | 4 | Company intelligence scalars | UBL, HBL, MCB, OGDC |
| `company_intelligence_blocks` | 88 | Intelligence items | 22 × 4 companies |

---

## Detailed Table States

### `companies`

**Purpose:** Master PSX company registry. One row per listed company.

**Key columns:**
- `symbol` (UNIQUE) — PSX ticker
- `sector` — must match `sectors.db_sector_name` for sector join to work
- `current_price`, `change`, `change_percent` — convenience snapshot (canonical: `daily_prices`)
- `pe_ratio`, `dividend_yield`, `eps` — convenience snapshot (canonical: `financial_metrics`)

**Seeding status:**
- Primary banking sector companies seeded: UBL, HBL, MCB, BAFL
- Primary oil & gas seeded: OGDC, PPL (verify)
- Full PSX universe NOT seeded — large gap
- Market cap data partially populated

**Gap / Action Required:**
- Seed remaining PSX large-cap universe (~150+ companies minimum for screener to be useful)
- Automate price snapshot updates from daily_prices into companies table
- Validate sector field values match sectors.db_sector_name exactly

---

### `market_index`

**Purpose:** KSE-100 and other index snapshots. One row per index, overwritten on each update.

**Seeded rows:** KSE-100 (1 row)

**Columns of note:**
- `level`, `change`, `change_percent` — index value
- `advances`, `declines`, `unchanged` — breadth data (powers the MarketHero breadth bar)
- `volume` — total market volume
- `updated_at` — when this snapshot was last refreshed

**Gap / Action Required:**
- This is a static snapshot — needs live feed or daily update automation
- KSE-30 index could be added as a second row when required

---

### `daily_prices`

**Purpose:** Time-series OHLCV. One row per symbol per trading day.

**Unique constraint:** `(symbol, market_date)`

**Seeding status:** Partial. A few companies have historical price rows. Not systematically populated.

**Gap / Action Required:**
- This is the most critical data gap for Phase 2 features (charts, technical signals, performance)
- Requires a data ingestion pipeline — either PSX data API integration or scraping
- Historical data (2 years minimum) needed for valuation charts, relative performance
- Priority: **HIGH** for Phase 2

---

### `financial_metrics`

**Purpose:** Period-based fundamental data. One row per symbol per period.

**Unique constraint:** `(symbol, period, period_type)`

**Seeded companies and periods:**

| Symbol | Periods | Sector Metrics |
|--------|---------|----------------|
| UBL | FY23, FY24 | Banking (nim, casa_ratio, npl_ratio, coverage_ratio, car, cost_to_income, deposit_growth, advance_growth) |
| HBL | FY23, FY24 | Banking (full banking metrics seeded) |
| MCB | FY23, FY24 | Banking (full banking metrics seeded) |
| BAFL | FY23, FY24 | Banking (full banking metrics seeded) |
| OGDC | FY23, FY24 | Standard (no sector-specific metrics) |

**Banking metric columns** (added via migration Sprint 7):
- `nim` — Net Interest Margin %
- `casa_ratio` — Current + Savings Accounts %
- `npl_ratio` — Non-Performing Loans %
- `coverage_ratio` — Provision coverage %
- `car` — Capital Adequacy Ratio %
- `cost_to_income` — Operating efficiency ratio %
- `deposit_growth` — YoY growth %
- `advance_growth` — YoY growth %

**Future sector columns planned:**
```sql
-- Oil & Gas (not yet added)
-- production_volume, lifting_cost, reserve_replacement_ratio

-- Cement (not yet added)
-- dispatch_growth, retention_price, coal_cost_per_ton

-- Power (not yet added)
-- circular_debt_receivable, capacity_utilization

-- Textiles (not yet added)
-- export_revenue_pct, ltff_rate_benefit
```

**Gap / Action Required:**
- Seed ENGRO, LUCK, PSO, MARI, PPL, FCCL minimum
- Add 1HFY25 data for all seeded companies
- Plan Oil & Gas metric columns (ALTER TABLE when OGDC sector page gets full financial expansion)

---

### `sectors`

**Purpose:** Sector registry with intelligence metadata and UI configuration.

**Status: Complete — all 7 sectors seeded**

| Slug | DB Sector Name | Accent Color | Stats | Subtitle | Intel Summary |
|------|---------------|-------------|-------|---------|--------------|
| `banking` | Commercial Banks | #1d4ed8 | ✓ | ✓ | ✓ |
| `oil-gas` | Oil & Gas | #854d0e | ✓ | ✓ | ✓ |
| `fertiliser` | Fertilizer | #15803d | ✓ | ✓ | ✓ |
| `cement` | Cement | #44403c | ✓ | ✓ | ✓ |
| `power` | Power Generation | #7c3aed | ✓ | ✓ | ✓ |
| `textile` | Textile Composite | #0e7490 | ✓ | ✓ | ✓ |
| `automobile` | Automobile Assembler | #9f1239 | ✓ | ✓ | ✓ |

**`stats` JSONB field format:**
```json
[
  { "val": "68%", "lbl": "Avg CASA" },
  { "val": "53%", "lbl": "ETR" }
]
```

---

### `sector_drivers`

**Purpose:** Key macro drivers per sector. 6 drivers per sector = 42 rows total.

**Status: Complete — 6 drivers seeded for all 7 sectors**

**Driver trend values:** `positive` | `negative` | `neutral` | `watch`

**Query pattern:**
```sql
SELECT * FROM sector_drivers
WHERE sector_slug = 'banking'
ORDER BY sort_order;
```

---

### `sector_intelligence_blocks`

**Purpose:** Normalized intelligence items for sector pages.

**Block types in use:**
- `takeaway` — key insight bullets
- `risk` — identified sector risks
- `driver_analysis` — detailed driver analysis
- `valuation` — sector valuation context
- `trend_summary` — sector trend summaries
- `company_note` — company-specific notes within sector context

**Status:** Blocks seeded for all 7 sectors. Counts vary by sector.

---

### `company_intelligence`

**Purpose:** Scalar intelligence fields per company. One row per company.

**Status: 4 companies seeded**

| ID | Symbol | Accent Color | Exchange Label | Thesis Summary | Valuation | Dividend |
|----|--------|-------------|----------------|---------------|-----------|---------|
| 1 | UBL | #1d4ed8 | Commercial Bank | ✓ | ✓ | ✓ |
| 2 | HBL | #16a34a | Commercial Bank | ✓ | ✓ | ✓ |
| 3 | MCB | #be123c | Commercial Bank | ✓ | ✓ | ✓ |
| 4 | OGDC | #854d0e | Oil & Gas Exploration | ✓ | ✓ | ✓ |

**Idempotent insert pattern:**
```sql
INSERT INTO company_intelligence (...) VALUES (...)
ON CONFLICT (symbol) DO UPDATE SET ...;
```

---

### `company_intelligence_blocks`

**Purpose:** 22 normalized intelligence blocks per company. The core structured intelligence store.

**Status: 22 blocks × 4 companies = 88 total rows**

**Block type distribution per company (standard):**

| block_type | Count | Signal Field |
|------------|-------|-------------|
| `thesis_theme` | 4 | `icon` (emoji) |
| `driver` | 6 | `trend` + `current_val` |
| `risk` | 4 | `severity` |
| `catalyst` | 4 | `horizon` |
| `valuation_point` | 4 | `signal` + `metric` + `current_val` |
| **Total** | **22** | |

**Critical column order for INSERT statements:**
```sql
INSERT INTO company_intelligence_blocks (
  symbol, block_type, sort_order, title, body, content,
  icon, trend, severity, horizon, signal, metric, current_val,
  tags, related_symbols, source
) VALUES (...)
```

**Validation query:**
```sql
SELECT symbol, block_type, COUNT(*) as cnt
FROM company_intelligence_blocks
GROUP BY symbol, block_type
ORDER BY symbol, block_type;
```

Expected output: 4 rows per symbol (one per block_type), with counts 4, 6, 4, 4, 4.

---

### `research_reports`

**Purpose:** Equity research reports with structured JSONB content.

**Status: 2 reports published**

| Slug | Title | Symbols | Status | Rating |
|------|-------|---------|--------|--------|
| `ubl-fy24-results` | (UBL FY24 analysis) | UBL | published | (varies) |
| `hubc-capacity-thesis` | (HUBC thesis) | HUBC | published | (varies) |

**Content JSONB structure:**
```typescript
ReportContent = {
  thesis:    ReportThesisPoint[],   // { title, body }[]
  financials: ReportFinancialRow[], // { metric, fy23?, fy24?, fy25e? }[]
  valuation:  ReportValuation,      // { method, blendedTarget, notes }
  risks:      ReportRisk[],         // { label, severity, detail }[]
}
```

---

## Service Layer Structure

```
services/api/
├── index.ts                    ← Barrel export — always import from here
├── companies.ts                ← getCompaniesBySector(), getCompanyBySymbol()
├── market.ts                   ← getKSE100Index(), getTopGainers(), getSectorPerformance(), getMarketPageData()
├── intelligence.ts             ← getAllSectors(), getSectorBySlug(), getSectorDrivers(), getIntelBlocks()
├── company-intelligence.ts     ← getCompanyIntelScalars(), getCompanyIntelBlocks(), getCompanyIntelligence()
├── fundamentals.ts             ← getFinancialMetrics(), getLatestMetrics()
├── prices.ts                   ← getPriceHistory(), getLatestPrice()
└── research.ts                 ← getPublishedReports(), getReportBySlug(), getDividends(), getAnnouncements()
```

**Key function signatures:**
```typescript
getCompanyIntelligence(symbol: string, fallback?: CompanyIntelligenceConfig): Promise<CompanyIntelligenceConfig | null>
getAllSectors(): Promise<Sector[]>
getSectorPerformance(): Promise<SectorStat[]>
getMarketPageData(): Promise<MarketPageData>
getPublishedReports(limit?: number): Promise<ResearchReportSummary[]>
```

---

## Adapter Architecture

Two adapters normalize DB rows into component-ready shapes:

### `lib/sector-adapter.ts`
```typescript
buildSectorConfig(
  sector: Sector,
  drivers: SectorDriver[],
  blocks: SectorIntelBlock[],
  fallback?: SectorConfig
): SectorConfig
```

### `lib/company-adapter.ts`
```typescript
buildCompanyConfig(
  scalars: CompanyIntelScalars,
  blocks: CompanyIntelBlock[],
  fallback?: CompanyIntelligenceConfig
): CompanyIntelligenceConfig
```

Used in `getCompanyIntelligence()` which implements DB-first + static fallback:
```typescript
const dbConfig = await getCompanyIntelligence(sym, staticFallback);
const config = dbConfig ?? staticConfig; // static fallback if DB returns null
```

---

## Current Ingestion Limitations

| Limitation | Impact | Resolution Path |
|-----------|--------|----------------|
| No automated price feed | daily_prices not auto-updating | Build PSX data scraper or integrate data provider |
| Manual intelligence seeding | 4 companies fully seeded, 500+ gap | Build bulk seeding scripts |
| No real-time market_index updates | KSE-100 snapshot is static | Scheduled task to refresh from PSX feed |
| No dividend calendar automation | dividends table is manual | PSX announcement parser |
| No financial_metrics automation | Period data requires manual entry | PSX filing parser or data provider |

---

## Future Planned Tables

| Table | Purpose | Priority | Phase |
|-------|---------|----------|-------|
| `users` | Auth profiles, preferences | High | Phase 2 |
| `portfolios` | Holdings, transactions | High | Phase 2 |
| `watchlists` | Saved stock lists | Medium | Phase 2 |
| `alerts` | Price and event alerts | Medium | Phase 2 |
| `kyc_documents` | Account opening | High | Phase 2 |
| `ai_summaries` | Cached AI outputs with timestamp | High | Phase 3 |
| `market_drivers` | DB-backed dashboard drivers | Medium | Phase 3 |
| `market_spotlight` | Featured daily intelligence | Medium | Phase 3 |
| `macro_data` | SBP rate history, PKR, oil time-series | High | Phase 3 |
| `sentiment_data` | News/social sentiment scores | Low | Phase 4 |
| `conviction_scores` | AI-computed per-company scores | Medium | Phase 4 |

---

## AI Readiness Assessment

| Capability | Status | Notes |
|-----------|--------|-------|
| Company intelligence summary generation | Ready | 4 companies with 22-block structured data |
| Sector intelligence narrative | Ready | 7 sectors with drivers + blocks |
| Market driver interpretation | Partially ready | Static seeds exist, need macro_data table for live readings |
| Cross-company screening queries | Limited | Only 4 companies fully seeded |
| Portfolio-level AI analysis | Not ready | No portfolios table |
| Real-time news analysis | Not ready | No news ingestion pipeline |
| Historical comparison | Not ready | daily_prices not sufficiently populated |

**Verdict:** AI intelligence summaries for the 4 seeded companies and 7 sectors can be activated immediately. Broader AI capabilities require data infrastructure investment.

---

## Technical Debt

| Item | Severity | Action |
|------|----------|--------|
| `companies` table incomplete | High | Seed full PSX large-cap universe |
| `daily_prices` not automated | High | Build ingestion pipeline |
| Static fallback TS files still exist | Low | Delete after DB validated in all envs |
| `data/sectors/` legacy folder | Medium | Audit and deprecate |
| No DB indexes on `company_intelligence_blocks(symbol, block_type)` | Medium | Add index for query performance at scale |
| `financial_metrics` only 5 companies | High | Systematic seeding required |

---

## Scaling Observations

At current scale (4 companies, 7 sectors), PostgreSQL handles all queries trivially. Scaling projections:

| Scale | companies table | blocks table | Query impact |
|-------|----------------|-------------|-------------|
| Current | ~20 rows | 88 rows | Negligible |
| 50 companies | 50 rows | 1,100 rows | Negligible |
| 200 companies | 200 rows | 4,400 rows | Negligible |
| 500 companies | 500 rows | 11,000 rows | Add index on (symbol, block_type) |
| 500 + historical pricing | 500 × 1,000 days = 500k rows | — | Partition daily_prices by year |

PostgreSQL with proper indexing handles the intelligence layer at full PSX scale without architectural changes. The query patterns (per-company or per-sector fetches) are low-cardinality by design.

---

*DB State Snapshot — May 2026 | Update after every migration or major seeding sprint*
