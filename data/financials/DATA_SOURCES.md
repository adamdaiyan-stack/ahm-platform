# AHM Financial Data Governance — Source Policy v1.0.0

## Purpose

This document defines the authoritative rules for sourcing, entering,
validating, and maintaining financial data in the AHM intelligence platform.
All contributors must read and follow this policy before entering any data.

**Core principle: A trusted dataset is more valuable than a complete one.**
Missing data is acceptable. Inaccurate data is not.

---

## Source Hierarchy (Precedence Order)

| Tier | Source | Traceability | Allowed |
|------|--------|-------------|---------|
| 1 | Company Annual Report (audited) | Document name + page | ✓ Primary |
| 2 | Company Half-Year / Quarterly Report (reviewed) | Document name + page | ✓ Primary |
| 3 | PSX filing (company announcement / financial statement) | Filing date + PSX ref | ✓ Primary |
| 4 | SECP filing | Filing reference | ✓ Primary |
| 5 | Company investor relations presentation | Document name + date | ✓ Secondary |
| 6 | Capital Stake | Only if metric is explicitly shown, not derived | ✓ Secondary |
| 7 | Bloomberg / Reuters terminal data | Field name + pull date | ✓ Secondary |
| 8 | Press release / news article | NOT ALLOWED | ✗ |
| 9 | Analyst estimate / consensus | NOT ALLOWED | ✗ |
| 10 | Back-calculation without documentation | NOT ALLOWED | ✗ |
| 11 | Memory / general knowledge | NOT ALLOWED | ✗ |

---

## Required Audit Trail Fields (Every Row)

Every data row must include:

| Field | Required | Description |
|-------|----------|-------------|
| `source_document` | Yes | Document name e.g. "HBL Annual Report FY2024" |
| `source_url` | Recommended | URL or PSX filing link |
| `source_page` | Recommended | Page/section in document |
| `source_type` | Yes | `annual_report`, `quarterly_report`, `psx_filing`, `secp_filing`, `ir_presentation`, `capital_stake`, `terminal` |
| `is_audited` | Yes | `true` = audited financials, `false` = reviewed/unaudited |
| `entered_by` | Yes | Who entered the data |
| `verified_by` | No | Who cross-checked against source |
| `ingestion_batch` | Yes | Batch identifier e.g. `pilot_batch_1_2026_05` |
| `verification_status` | Yes | `needs_verification`, `verified`, `disputed` |
| `notes` | No | Any caveats or flags |

---

## Null Handling Policy

- **Leave blank / null** if the figure is unavailable from a primary source.
- **Do not estimate** missing values.
- **Do not interpolate** between known periods.
- **Do not carry forward** prior period figures unless explicitly annotated as such.
- Fields with no data source must be null, not zero (zero is a meaningful value).

---

## Back-Calculation Policy

Back-calculation is allowed **only** in the following documented cases:

| Metric | Allowed Derivation | Must Be Flagged |
|--------|-------------------|----------------|
| `ebitda` | PAT + tax + interest + depreciation (if all components sourced) | `is_derived: true` |
| `ebit` | EBITDA - depreciation (if sourced) | `is_derived: true` |
| `casa_deposits` | Current accounts + savings accounts (if both sourced) | `is_derived: true` |
| `net_debt` | Total debt - cash (computed by pipeline, not stored raw) | N/A |
| `shares_outstanding` | **NEVER** back-calculate as market_cap / price | FORBIDDEN |

Any back-calculation must be noted in the `notes` field.

---

## Fiscal Year Conventions (PSX)

| Sector | Fiscal Year End | Notes |
|--------|----------------|-------|
| Banking | December 31 | FY24 = Jan–Dec 2024 |
| E&P | June 30 | FY24 = Jul 2023–Jun 2024 |
| Cement | June 30 | FY24 = Jul 2023–Jun 2024 |
| Fertiliser | December 31 | FY24 = Jan–Dec 2024 |
| Power/IPP | June 30 | FY24 = Jul 2023–Jun 2024 |
| Textiles | June 30 | FY24 = Jul 2023–Jun 2024 |
| Auto | June 30 | FY24 = Jul 2023–Jun 2024 |

---

## Verification Status Workflow

```
needs_verification → verified → (optionally) disputed → re-verified
```

- All newly entered data starts at `needs_verification`.
- `verified` requires cross-check against the source document by a second reviewer.
- `disputed` if two sources contradict each other — must be resolved before scoring.

---

## Units

ALL financial statement fields (income statement, balance sheet, cash flow) are in **PKR millions**.
Per-share fields are in **PKR per share**.
Shares outstanding in **millions of shares**.

Submitting data in any other unit without annotation will result in rejection.

---

## What NOT to Do

- Do not enter EPS as total earnings. EPS = PKR per share from company filings.
- Do not enter shares as absolute count. Shares = millions.
- Do not enter market cap in the income statement fields.
- Do not enter revenue in billions unless you convert to millions first.
- Do not use the existing `financial_ratio_snapshots` data as a source — the original entries were corrupted.
- Do not assume last year's figure for a missing current-year field.

---

## Pilot Batch

The first controlled ingestion covers **10 companies** across 5 sectors.
File: `data/financials/pilot_batch_1/`
Scope: FY24 (primary), FY23 and FY22 where documents are available.
Target validation pass rate: 100% (no errors, some warnings acceptable).
