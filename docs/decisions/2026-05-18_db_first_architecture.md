# ADR-003: DB-First Architecture — Normalized Intelligence Over Static Configs

**Date:** 2026-05-18  
**Status:** Accepted  
**Author:** AHM Architecture Team  
**Supersedes:** Pre-DB static TypeScript configuration approach  
**Related:** ADR-002 (AI Philosophy)

---

## Context

The AHM Platform's intelligence layer began as static TypeScript configuration files — hardcoded objects containing investment theses, drivers, risks, catalysts, and valuation data per company and sector. This approach was correct for rapid prototyping but was recognized early as architecturally unsustainable.

By Sprint 8-10 (May 2026), the platform had migrated four companies (UBL, HBL, MCB, OGDC) and seven sectors from static TypeScript configs to a normalized relational database. The architecture established during this migration defines how all intelligence data will be structured going forward.

This ADR documents why the DB-first approach was chosen, what it replaced, and what architectural patterns it establishes permanently.

---

## Problem

Static TypeScript configuration files for financial intelligence created the following structural problems:

### 1. AI Unreadability
Hardcoded TS objects cannot be queried, filtered, or aggregated by an AI system without loading entire file trees. A database can respond to structured queries — "give me all near-horizon catalysts for banking sector companies" — in milliseconds. A TS file cannot.

### 2. Update Latency
Updating a company's driver readings requires a code change, a TypeScript compilation, a git commit, and a Vercel deployment. For financial data that should be updated weekly, this is unacceptable. A database row update takes seconds.

### 3. No Cross-Company Querying
"Show me all companies with NPL ratio < 6% and CASA ratio > 60%" is a trivial SQL query against normalized tables. Against static TS configs, it requires loading and parsing every company file in JavaScript.

### 4. Duplication Risk
Static configs duplicate structure (same fields, same types) across dozens of files, with no enforcement of consistency. The database enforces schema consistency as a constraint.

### 5. Scale Ceiling
50 companies in static TS files is manageable. 500 companies is not. The database scales horizontally; the file system does not.

### 6. Fallback Strategy Gap
Static configs provided no graceful degradation path. The DB-first architecture maintains static files as explicit fallbacks — the system degrades gracefully when the DB is unavailable.

---

## Decision

**All company and sector intelligence data lives in the PostgreSQL database as the primary source of truth.**

Static TypeScript configuration files are retained only as explicit fallbacks for local development environments without DB access. They are not maintained as feature-parity alternatives to DB data.

The architecture follows a strict data flow:

```
PostgreSQL (Supabase)
    ↓
services/api/*.ts          [typed query functions, error-handled]
    ↓
app/*/page.tsx             [server components — fetch and pass as props]
    ↓
lib/sector-adapter.ts      [DB rows → SectorConfig]
lib/company-adapter.ts     [DB rows → CompanyIntelligenceConfig]
    ↓
components/**/*.tsx        [pure display — no DB calls, no business logic]
```

---

## Key Architectural Patterns Established

### Pattern 1: Normalized Intelligence Blocks

Intelligence data is stored as normalized rows, not JSONB blobs.

```sql
-- company_intelligence_blocks
-- One row per intelligence item, block_type discriminates:
-- thesis_theme | driver | risk | catalyst | valuation_point
--
-- Signal fields are nullable — only applicable fields are non-null:
-- trend       → drivers
-- severity    → risks
-- horizon     → catalysts
-- signal      → valuation_point
-- icon        → thesis_theme
```

**Why normalized over JSONB:**
- SQL queries can filter on `block_type`, `severity`, `horizon`, `trend` without JSON parsing
- AI can receive exactly the block types it needs via targeted queries
- Adding a new signal field is an `ALTER TABLE`, not a schema redesign
- Indexes on signal fields enable screening queries at scale

### Pattern 2: Scalar + Blocks Separation

Company intelligence is split into two tables:

`company_intelligence` — scalar fields (one per company): thesis summary, valuation commentary, dividend commentary, accent color, exchange label

`company_intelligence_blocks` — normalized items (22 per company): 4 thesis themes, 6 drivers, 4 risks, 4 catalysts, 4 valuation points

**Why separate:**  
Scalar fields are always needed (for page headers, summaries). Blocks are needed in bulk (for full intelligence pages) or by type (for AI queries). Separating them enables efficient partial fetches.

### Pattern 3: Service Layer Isolation

No component ever imports `@/lib/supabase` directly. All database access goes through typed service functions in `/services/api/`.

This pattern:
- Creates a testable boundary between business logic and UI
- Enables database query optimization without touching components
- Produces typed return values that TypeScript enforces throughout the stack
- Allows the database layer to be swapped without component changes

### Pattern 4: Adapter Functions

Raw DB rows do not reach component props directly. Adapter functions in `/lib/` transform DB records into the shape components expect.

```typescript
// lib/company-adapter.ts
buildCompanyConfig(scalars, blocks, fallback?) → CompanyIntelligenceConfig

// lib/sector-adapter.ts
buildSectorConfig(sector, drivers, blocks, fallback?) → SectorConfig
```

This pattern:
- Keeps component props stable even when DB schema evolves
- Centralizes data transformation logic in one testable place
- Makes the fallback (static config) pluggable at the adapter layer

### Pattern 5: DB-First with Static Fallback

```typescript
// app/stocks/[symbol]/page.tsx
const staticConfig = COMPANY_CONFIGS[sym] ?? null;
const dbConfig = await getCompanyIntelligence(sym, staticConfig ?? undefined);
const config = dbConfig ?? staticConfig;
```

DB is tried first. If it returns null (company not seeded, DB unavailable), the static fallback is used. This enables:
- Incremental migration — companies can be added to DB without removing static configs
- Local development — devs without DB access get the static fallback
- Graceful degradation — DB outages do not break the UI

---

## Reasoning

### Why Not Pure Static Files Forever?
Static files cannot support AI queries, screening features, cross-company analytics, or weekly content updates. They are a prototyping tool, not a production architecture.

### Why Not Pure JSONB?
JSONB is flexible but defeats the purpose of normalization. Filtering on `blocks->>'horizon' = 'near'` is significantly slower and less type-safe than `WHERE horizon = 'near'` on a normalized column. Normalization also enforces data consistency that JSONB cannot.

### Why Not GraphQL or a Separate Backend?
The current scale (Next.js + Supabase direct) is appropriate for Phase 1-2. Supabase provides a typed PostgreSQL client that covers all current query patterns. A separate backend layer adds complexity without benefit at current scale. Revisit at Phase 3+ when real-time features, complex business logic, or multi-region requirements emerge.

### Why Supabase Over Raw PostgreSQL + Prisma?
Supabase provides hosted PostgreSQL, a typed JS client, row-level security, real-time capabilities, and auth infrastructure in one managed service. The operational overhead of managing Postgres + Prisma + auth separately is not justified at current scale.

---

## Tradeoffs

| Benefit | Cost |
|---------|------|
| AI-queryable intelligence at scale | Initial seeding investment per company/sector |
| Schema-enforced data consistency | Migration discipline required for schema changes |
| Sub-millisecond cross-company queries | Service layer adds one abstraction layer |
| Graceful fallback to static configs | Static configs must be maintained during transition |
| AI integration is straightforward | No intelligence until data is seeded |

---

## Consequences

### Immediate
- Every new company or sector requires a DB seeding sprint, not just a TS file
- The 22-block standard per company must be maintained consistently
- TypeScript types in `types/index.ts` are the single source of truth — must be updated when DB schema changes

### Medium-Term
- Screening features (e.g., "all companies with near-horizon catalysts + cheap valuation") become trivial SQL queries
- AI intelligence summaries can be generated on demand from structured DB inputs
- New signal fields (e.g., `esg_flag`, `liquidity_tier`) can be added via ALTER TABLE with zero component changes

### Long-Term
- The normalized intelligence database becomes a proprietary data asset that grows more valuable with every seeded company
- Potential to offer API access to structured intelligence as a B2B product
- The architecture supports multi-tenant use (e.g., different intelligence sets per client tier)

---

## Migration Status (May 2026)

| Entity | Status | DB Seeded | Static Fallback |
|--------|--------|-----------|-----------------|
| UBL | DB Primary | ✓ 22 blocks | `ubl-intelligence.ts` |
| HBL | DB Primary | ✓ 22 blocks | `hbl-intelligence.ts` |
| MCB | DB Primary | ✓ 22 blocks | `mcb-intelligence.ts` |
| OGDC | DB Primary | ✓ blocks | `ogdc-intelligence.ts` |
| Banking sector | DB Primary | ✓ full | `data/sectors/banking.ts` |
| Oil & Gas sector | DB Primary | ✓ full | `data/sectors/oil-gas.ts` |
| All 7 sectors | DB Primary | ✓ full | Legacy TS files |

---

*ADR-003 | Accepted | May 2026 | Review if database provider changes or scale requires different architecture*
