# Sprint 001 — Market Dashboard Transformation + Company Intelligence DB Migration

**Date:** May 2026 (multi-session sprint)  
**Duration:** ~4 sessions across 2 conversation threads  
**Status:** Complete  
**Next Sprint:** SPRINT_002 — Company intelligence expansion + chart infrastructure

---

## 1. What Was Built

### Market Intelligence Dashboard
- `components/dashboard/MarketHero.tsx` — KSE-100 hero: level, change, breadth bar (advances/declines/unchanged), market status pill. Production-ready.
- `components/dashboard/MarketIntelligenceSummary.tsx` — 4 editorial market observations with trend dot + tag pill. Static seed, DB-ready. Production-ready.
- `components/dashboard/SectorHeatPanel.tsx` — DB-driven sector grid. Joins Sector[] + SectorStat[] by db_sector_name. Accent colors, market cap, avg change badge. Production-ready.
- `components/dashboard/MoversPanel.tsx` — Top 3 gainers + top 3 losers in compact side-by-side layout. Not a table. Production-ready.
- `components/dashboard/MarketDriversPanel.tsx` — 6 macro drivers with readings and trend signals. Static seed, DB-ready. Production-ready.
- `components/dashboard/SpotlightCard.tsx` — Featured intelligence spotlight with accent border and CTA. Currently spotlights MCB ETR thesis. Production-ready.
- `components/dashboard/FeaturedResearch.tsx` — Up to 3 published research reports from DB. Handles empty state. Production-ready.
- `app/market/page.tsx` — Full dashboard assembly: parallel data fetch (Promise.all), 2-column intelligence grid (lg:col-span-3 / lg:col-span-2), full-width hero and spotlight. Production-ready.

### Company Intelligence DB Migration (HBL + MCB)
- `components/company/hbl/hbl-intelligence.ts` — Updated to FALLBACK-ONLY status
- `components/company/mcb/mcb-intelligence.ts` — Updated to FALLBACK-ONLY status
- Supabase: HBL seeded — `company_intelligence` (id=2) + 22 `company_intelligence_blocks`
- Supabase: MCB seeded — `company_intelligence` (id=3) + 22 `company_intelligence_blocks`
- Routing: All symbols now use DB-first universal routing in `app/stocks/[symbol]/page.tsx`

### TypeScript Infrastructure
- `types/index.ts` — Fixed truncation on Linux mount, added missing `trend` field to `CompanyIntelBlock`
- `lib/company-adapter.ts` — Fixed `current` field: `b.current_val ?? ""` (was `?? undefined`, type error)

### Documentation System (This Sprint)
- `docs/README.md` — Documentation system index, standards, naming conventions
- `docs/AHM_MASTER_DOCUMENTATION.md` — 14-section master reference (2,102 lines)
- `docs/decisions/2026-05-18_platform_positioning.md` — ADR-001
- `docs/decisions/2026-05-18_ai_philosophy.md` — ADR-002
- `docs/decisions/2026-05-18_db_first_architecture.md` — ADR-003
- `docs/decisions/2026-05-18_frontend_design_language.md` — ADR-004
- `docs/decisions/2026-05-18_no_buy_sell_hold.md` — ADR-005
- `docs/database/DB_STATE_MAY_2026.md` — Full DB state snapshot
- `docs/strategy/DATA_STRATEGY.md` — Data moat strategy
- `docs/strategy/AI_OPERATING_MODEL.md` — Human+AI operating model
- `docs/strategy/BROKERAGE_TRANSFORMATION_PLAN.md` — Digitization roadmap
- `docs/strategy/MONETIZATION_ROADMAP.md` — Revenue strategy
- `docs/progress/README.md` — Sprint logging standards

---

## 2. Database Changes

### New Rows Added

| Table | Symbol/Key | Rows Added | Notes |
|-------|-----------|-----------|-------|
| `company_intelligence` | HBL | 1 row | id=2, accent=#16a34a |
| `company_intelligence` | MCB | 1 row | id=3, accent=#be123c |
| `company_intelligence_blocks` | HBL | 22 rows | 4+6+4+4+4 standard distribution |
| `company_intelligence_blocks` | MCB | 22 rows | 4+6+4+4+4 standard distribution |

### Schema Changes

None this sprint. `types/index.ts` had the `trend` field restored (it was missing due to truncation in a prior session — not a new field).

### Current DB Summary

```
company_intelligence:      4 rows (UBL, HBL, MCB, OGDC)
company_intelligence_blocks: 88 rows (22 × 4)
sectors:                   7 rows (all active)
sector_drivers:            ~42 rows (6 per sector)
research_reports:          2 rows (published)
financial_metrics:         ~16 rows (5 companies × 2-3 periods)
```

Validation query run and confirmed: each company has 4 thesis_theme, 6 driver, 4 risk, 4 catalyst, 4 valuation_point blocks.

---

## 3. Architectural Decisions Made

**DECISION: Static seeds use DB-ready structure**  
MarketIntelligenceSummary, MarketDriversPanel, and SpotlightCard use static TypeScript seeds with the same shape as future DB rows. This is not technical debt — it is intentional. The component contract is stable; the data source migration is a service-layer swap.

**DECISION: Dashboard layout is 2-column (lg:col-span-3 + lg:col-span-2)**  
Intelligence content (narrative, drivers, research) on the left 60%. Structured data (sectors, movers) on the right 40%. Stacks to single column below lg: breakpoint.

**DECISION: HBL and MCB static fallback files retained**  
`hbl-intelligence.ts` and `mcb-intelligence.ts` are marked FALLBACK-ONLY and retained until DB seeding is validated across all deployment environments. Do not delete.

**DECISION: Universal DB-first routing for all symbols**  
All symbols in `[symbol]/page.tsx` go through `getCompanyIntelligence(sym, staticFallback)`. DB is tried first; static fallback is used if DB returns null. No symbol-specific routing logic.

---

## 4. Blockers and Discoveries

**DISCOVERY: Linux mount sync lag**  
Files written via the Write/Edit tools (Windows path) may not be immediately visible in bash (Linux mount). Pattern: write critical files via `bash cat > /path << 'ENDOFFILE'` to avoid sync lag during TypeScript compilation.

**DISCOVERY: Unicode characters in file headers cause truncation**  
Box-drawing characters (╔ ║ ╚) in comment headers caused Linux mount to truncate files mid-line. Resolution: rewrite affected files via bash with plain ASCII headers.

**DISCOVERY: SQL column order is critical for company_intelligence_blocks**  
Multiple SQL errors from incorrect column ordering. Confirmed column order:  
`symbol, block_type, sort_order, title, body, content, icon, trend, severity, horizon, signal, metric, current_val, tags, related_symbols, source`

**DISCOVERY: Supabase project ID**  
Correct project ID: `qiunhqgxsjyvcrcnfajl` (not the initial wrong ID used in early SQL calls).

---

## 5. TypeScript Status

- Run: `cd /sessions/.../mnt/ahm-platform && npx tsc --noEmit`
- Result: **CLEAN — 0 errors**
- Verified: After all sprint work completed

---

## 6. What Is Pending (Next Sprint Inputs)

| Task | Context | Priority |
|------|---------|---------|
| Seed ENGRO company intelligence | Use MCB 22-block SQL as template. ENGRO is fertiliser sector. | High |
| Seed LUCK (Lucky Cement) company intelligence | Cement sector. | Medium |
| Seed PSO company intelligence | Oil & Gas sector. | Medium |
| Build price/volume chart component | No charting library integrated. TradingView Lightweight Charts recommended. | High |
| Build valuation history chart (P/E over time) | Requires financial_metrics time-series data for multiple periods. | Medium |
| Migrate MarketDriversPanel to DB | Create `market_drivers` table, seed 6 rows, update service layer. | Medium (Phase 3) |
| Wire AIInsightPlaceholder to live AI | Connect Claude API to company intelligence blocks for UBL/HBL/MCB. | Medium (Phase 3) |
| Add 1HFY25 financial_metrics for all 4 companies | UBL, HBL, MCB, OGDC need current-year partial data. | Medium |
| Seed companies table with PSX large-cap universe | ~150 companies needed for screener to be useful. | High |

---

## 7. Context for Next AI Session

**Project phase:** Phase 1 intelligence infrastructure is COMPLETE.

**What exists and works:**
- 7 sectors: fully DB-driven with drivers, intel blocks, stats, subtitles
- 4 companies: UBL, HBL, MCB, OGDC — fully DB-driven with 22 intelligence blocks each
- Market dashboard: transformed with 7 intelligence components in 2-column layout
- Research system: 2 published reports, dynamic renderer working
- Documentation system: ADRs, DB state, strategy docs, master reference all written
- TypeScript: clean (0 errors)
- Deployment: Vercel on main branch, auto-deploy on push

**What is the most important gap:**  
No price charts exist anywhere on the platform. This is the single largest credibility gap — a financial intelligence platform without price history visualization will feel incomplete to users. Chart infrastructure should be the next frontend sprint.

**What should NOT be touched:**
- `hbl-intelligence.ts` and `mcb-intelligence.ts` — fallback only, do not modify
- `company_intelligence_blocks` for UBL/HBL/MCB/OGDC — live data, use ON CONFLICT not DELETE
- `types/index.ts` — source of truth, any changes must be careful (full file, not append)

**Immediate next task options (in priority order):**
1. Chart infrastructure sprint — install charting library, build shared chart wrapper, wire to daily_prices
2. Company expansion sprint — seed ENGRO, LUCK, PSO intelligence
3. Phase 2 foundation sprint — auth system, user profiles, portfolio tables

---

*Sprint 001 — Complete | May 2026*
