# AHM Platform — Data Strategy

**Version:** 1.0  
**Date:** May 2026  
**Owner:** AHM Architecture Team  
**Classification:** Internal Strategic Document  
**Review Cycle:** Quarterly

---

## Executive Summary

Data is AHM Platform's primary competitive moat. AI is the interpretation layer. The UI is the delivery mechanism. In that hierarchy, data is the only irreplaceable asset — AI models are commoditized, UIs are replicable, but a structured, normalized, PSX-specific financial intelligence database built over years is not.

This document defines how AHM thinks about data: what to collect, how to structure it, how to validate it, how to use it, and how it compounds into a durable competitive advantage.

---

## 1. The Data Moat Thesis

### Why Data Is the Moat

Every competitor with access to frontier AI models can produce generic financial commentary. No competitor can produce AHM's normalized, PSX-specific intelligence if they don't have the data infrastructure to generate it.

The value of AHM's data compounds with:
- **Coverage depth** — 22 structured intelligence blocks per company vs. a one-paragraph description
- **PSX specificity** — CASA ratios, ADR mechanics, ETR analysis, SBP policy integration
- **Temporal richness** — historical financial metrics, historical price data, dividend history, earnings event annotations
- **Cross-entity relationships** — sector membership, peer comparisons, supply chain linkages
- **Verification quality** — human-curated intelligence, not scraped noise

The gap between AHM's structured data and what competitors have is not a technology gap — it is a data investment gap. Every company seeded, every block written, every financial metric verified is a compounding advantage.

### The Three Data Layers

```
Layer 1 — Market Data (commodity)
  Prices, volumes, indices
  Available from PSX data feeds, Bloomberg, Refinitiv
  Low differentiation — everyone can access it
  High operational importance — powers basic platform functionality

Layer 2 — Fundamental Data (semi-proprietary)
  Financial statements, earnings, dividends, announcements
  Available from PSX filings, financial data providers
  Moderate differentiation — depends on structure and coverage
  Core platform intelligence layer

Layer 3 — Structured Intelligence (proprietary)
  Investment thesis, drivers, risks, catalysts, valuation context
  AHM-originated, analyst-curated, normalized to schema
  Maximum differentiation — not available elsewhere
  The primary competitive asset
```

AHM invests primarily in Layer 3, uses Layer 2 as the factual foundation for Layer 3, and sources Layer 1 through pipelines.

---

## 2. PSX Data Ecosystem

### What Makes PSX Data Unique

PSX is a market with characteristics that generic financial data products handle poorly:

- **ETR complexity** — Pakistan's ~53% banking effective tax rate is a critical earnings variable with no equivalent in international markets. It requires custom data fields and PSX-specific analytical frameworks.
- **SBP policy centrality** — The SBP policy rate is the single largest driver of banking and power sector economics. Rate history, policy meeting cadence, and forward guidance must be tracked with PSX-specific context.
- **PKR volatility** — Exchange rate movements affect import-cost sectors (cement, autos) and export-earning sectors (textiles) very differently. PKR/USD history at granular frequency is operationally important.
- **Circular debt** — Pakistan's power sector circular debt is a structural, ongoing variable with no international equivalent. E&P and power company valuations require this context.
- **ADR mechanics** — The Advance-to-Deposit Ratio tax framework for banks is entirely PSX-specific. Without it, banking analysis is materially incomplete.
- **Federal Budget as catalyst** — Pakistan's annual Federal Budget is the single highest-magnitude financial catalyst for multiple sectors simultaneously. This event requires dedicated tracking infrastructure.

### PSX-Specific Data Fields Implemented

| Data Point | Location | Notes |
|-----------|---------|-------|
| Banking ETR (~53%) | `company_intelligence_blocks.body` for driver blocks | Embedded in driver analysis |
| SBP Policy Rate | `sector_drivers.current_reading` | Updated per SBP announcement |
| CASA ratio | `financial_metrics.casa_ratio` | Banking-specific column |
| ADR context | `company_intelligence_blocks` for banking drivers | Narrative + analysis |
| NPL ratio | `financial_metrics.npl_ratio` | Banking-specific column |
| CAR | `financial_metrics.car` | Banking-specific column |

### PSX-Specific Data Fields Planned

| Data Point | Planned Location | Priority |
|-----------|----------------|----------|
| SBP rate history | `macro_data` table | High — needed for AI context |
| PKR/USD history | `macro_data` table | High — powers multi-sector analysis |
| Brent crude history | `macro_data` table | High — Oil & Gas + Power |
| Federal Budget dates | `macro_data` table | Medium — catalyst calendar |
| Circular debt quantum | `macro_data` table | Medium — Power/E&P context |
| PSX settlement data | `daily_prices` extension | Low |

---

## 3. Normalization Architecture

### The Block Model

AHM's core intelligence is stored in a normalized block model rather than JSONB blobs or free-text fields. This is a deliberate architectural investment.

```sql
-- Each intelligence block is a typed, queryable row
company_intelligence_blocks (
  block_type    -- thesis_theme | driver | risk | catalyst | valuation_point
  trend         -- positive | negative | neutral | watch (drivers)
  severity      -- high | medium | low (risks)
  horizon       -- near | medium | long (catalysts)
  signal        -- cheap | fair | rich (valuation)
  tags          -- text[] for cross-entity queries
  related_symbols -- text[] for multi-company items
)
```

This model enables queries that JSONB or flat text cannot:
```sql
-- All companies with near-horizon catalysts and cheap valuation
SELECT DISTINCT cib.symbol
FROM company_intelligence_blocks cib
WHERE cib.block_type = 'catalyst' AND cib.horizon = 'near'
  AND cib.symbol IN (
    SELECT symbol FROM company_intelligence_blocks
    WHERE block_type = 'valuation_point' AND signal = 'cheap'
  );
```

### Extensibility Principle

New data fields are added via `ALTER TABLE`, not schema redesigns. The pattern is:

1. Identify a new sector-specific metric (e.g., cement dispatch growth)
2. Add nullable column to `financial_metrics`: `dispatch_growth numeric`
3. The `FinancialSnapshot` component detects non-null presence and renders automatically
4. No component changes required for new metrics to appear

This principle — schema extensibility with zero component changes — is the foundation for scaling to all PSX sectors without exponential engineering cost.

---

## 4. Historical Storage Strategy

### Retention Policy

| Data Type | Retention | Reason |
|-----------|---------|--------|
| Daily prices (OHLCV) | 10+ years | Charting, statistical analysis, valuation comparisons |
| Financial metrics (annual) | 10+ years | Long-term trend analysis, crisis cycle comparison |
| Financial metrics (quarterly) | 5+ years | Earnings trend, seasonality |
| Market index snapshots | 10+ years | Historical context for intelligence narratives |
| Macro data (rates, FX) | 10+ years | Rate cycle analysis, correlation modeling |
| AI summaries | 2 years rolling | Audit trail, change tracking |
| Research reports | Permanent | Institutional archive |
| Sector intelligence blocks | Permanent (with version history) | Strategic asset |
| Company intelligence blocks | Permanent (with version history) | Strategic asset |

### Versioning Intelligence Data

Company and sector intelligence blocks will require versioning as thesis and market views evolve. Current implementation: blocks are updated in-place. Planned: add `valid_from` / `valid_until` timestamps (sector_intelligence_blocks already has these columns) and implement soft-delete versioning.

---

## 5. Event Classification System

### Planned Event Types

Financial intelligence is event-driven. The data architecture must capture, classify, and link events to affected entities.

```
Event taxonomy:
  MACRO
    → SBP_RATE_CHANGE         impact: Banking, Power sectors
    → FEDERAL_BUDGET          impact: Banking ETR, fertiliser subsidy, power tariff
    → IMF_REVIEW              impact: PKR, macro stability sentiment
    → PKR_MOVE (>2%)          impact: Import sectors (Cement, Auto), Export sectors (Textiles)
    → OIL_PRICE_MOVE (>5%)   impact: OGDC, PPL, PSO, IPPs

  CORPORATE
    → EARNINGS_RELEASE        impact: Specific company
    → DIVIDEND_ANNOUNCEMENT   impact: Specific company
    → RIGHTS_ISSUE            impact: Specific company
    → MANAGEMENT_CHANGE       impact: Specific company
    → REGULATORY_ACTION       impact: Specific company / sector

  SECTOR
    → PRICE_NOTIFICATION      impact: Cement, Fertiliser, OMCs
    → TARIFF_REVISION         impact: Power/IPP
    → QUOTA_ALLOCATION        impact: Fertiliser, Textiles
    → ADR_THRESHOLD_CHANGE    impact: Banking sector
```

Future `events` table design:
```sql
CREATE TABLE market_events (
  id            uuid PRIMARY KEY,
  event_type    text NOT NULL,        -- from taxonomy above
  event_date    date NOT NULL,
  title         text NOT NULL,
  description   text,
  impact_sectors text[] DEFAULT '{}',
  impact_symbols text[] DEFAULT '{}',
  magnitude     text,                 -- "high" | "medium" | "low"
  direction     text,                 -- "positive" | "negative" | "neutral" | "mixed"
  source_url    text,
  created_at    timestamptz DEFAULT now()
);
```

---

## 6. Confidence and Verification Systems

### Data Quality Tiers

| Tier | Source | Verification | Use Case |
|------|--------|-------------|---------|
| Tier 1 — Verified | Audited financials, official PSX filings | Human reviewed | Financial metrics, published reports |
| Tier 2 — Curated | Analyst-written intelligence, research team | Human authored | Company/sector intelligence blocks |
| Tier 3 — Derived | Calculated from Tier 1 data | Formula-verified | Ratios, growth rates, yield calculations |
| Tier 4 — Inferred | AI interpretation of Tier 1/2 | Human spot-checked | AI summaries, narrative blocks |
| Tier 5 — Unverified | Scraped, unchecked | Not used in production | — |

### Verification Workflow (Planned)

```
New financial metric enters system:
  1. Analyst enters from primary source (PSX filing, SECP disclosure)
  2. Source URL is recorded in financial_metrics.source
  3. Notes field captures any exceptions or adjustments
  4. Second analyst spot-checks against source (for Tier 1 data)
  5. Row is marked with reviewer_id when verified

New intelligence block enters system:
  1. Analyst writes block from research process
  2. Block linked to supporting financial_metrics rows where applicable
  3. Block is reviewed against current market data before publication
  4. Senior analyst approves before setting is_active = true
```

---

## 7. AI-Ready Data Design

The database is designed from the ground up to serve as AI context, not just as a UI data source.

### Principles for AI-Ready Tables

1. **Atomic blocks over long strings** — intelligence blocks are short, typed items, not essays. AI context windows are finite — atomic blocks are more efficient than long free-text.

2. **Signal fields for filtering** — AI prompts can request only relevant blocks: "give me all near-horizon catalysts with trend=positive" without parsing free text.

3. **Relational links** — `related_symbols` and `tags` arrays enable AI to fetch connected entities when analyzing a company (its sector peers, related macro drivers).

4. **Temporal fields** — `valid_from` / `valid_until` on intelligence blocks allow AI to filter to currently valid intelligence, avoiding stale context injection.

5. **Source traceability** — every row has a `source` field, enabling AI to cite sources in its outputs.

### AI Query Patterns (Implemented and Planned)

```typescript
// Current — implemented
getCompanyIntelligence(symbol)     // All 22 blocks for one company
getSectorDrivers(slug)             // All drivers for one sector
getAllSectors()                    // Full sector registry

// Planned — for AI engine
getNearHorizonCatalysts()          // All companies with horizon='near' catalysts
getCompaniesWithCheapValuation()   // All with signal='cheap' valuation blocks
getDriversByTrend('positive')      // Companies with improving driver profiles
getMacroDriverReadings()           // Current readings for AI market narrative
```

---

## 8. Long-Term Data Advantages

### The Compounding Effect

Year 1 — 50 companies seeded, 2 years of financials: useful screener, basic intelligence
Year 2 — 200 companies, 5 years of financials, full event history: meaningful cross-company analysis
Year 3 — Full PSX universe, 10 years of data, AI-curated intelligence: unique analytical capability

By Year 3, the dataset cannot be replicated quickly. The combination of coverage depth, analytical structure, and temporal richness becomes a moat that requires years of investment to match.

### Proprietary Dataset Opportunities

As the dataset matures, it enables products that don't exist in the PSX market today:
- **Sector rotation indicators** based on normalized driver readings across sectors
- **Earnings quality scoring** from structured financial data patterns
- **Catalyst proximity alerts** — "MCB has 3 near-horizon catalysts aligning"
- **Peer valuation divergence signals** — "OGDC trading at 40% discount to PPL on EV/EBITDA"
- **Historical cycle analysis** — "last time banking CASA was this elevated, sector returned X%"

None of these are possible without a structured, normalized, long-history dataset. All of them require exactly what AHM is building.

---

## 9. Institutional Data Quality Standards

Every data point in the system must meet these standards:

**Accuracy:** Sourced from primary sources (PSX filings, SBP publications, audited accounts). Estimates clearly labeled.

**Completeness:** Required fields are non-null. Missing data is explicit null, never zeroed-out.

**Consistency:** Same metric means the same calculation across all companies. Net margin is always PAT/Revenue, not EBITDA/Revenue.

**Timeliness:** Financial data is updated within 48 hours of PSX filing publication.

**Traceability:** Every row has a `source` field. Every derived calculation has a formula documented.

**Versioning:** Historical values preserved. Updates create new rows (financial_metrics) or version old rows (intelligence blocks).

---

*DATA_STRATEGY.md | Version 1.0 | May 2026 | Review quarterly*
