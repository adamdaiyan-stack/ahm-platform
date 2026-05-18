# AHM Platform — Progress Tracking System

**Version:** 1.0  
**Date:** May 2026  
**Purpose:** Sprint logging standards, continuity framework, AI session handoff protocol

---

## Why Structured Progress Tracking Matters

AHM Platform is developed in AI-assisted sessions. Each session has a context limit. Without structured progress tracking, every new session either:
1. Wastes the first 20% of its context window reconstructing history, or
2. Misses critical context and makes decisions inconsistent with prior work

Structured sprint logs solve this: a new session reads the last 1-2 logs and has full operational context in under 500 tokens.

---

## File Naming Convention

```
SPRINT_NNN_topic_descriptor.md

Examples:
  SPRINT_001_market_dashboard_transformation.md
  SPRINT_002_company_intelligence_hbl_mcb.md
  SPRINT_003_auth_portfolio_phase2.md
  SPRINT_010_ai_summaries_activation.md
```

Sprint numbers are sequential and never reused. If a topic spans multiple sprints, use the same descriptor with sequential numbers.

---

## Sprint Log Template

Every sprint log must contain all seven sections below. Sections that don't apply for a given sprint receive "N/A — not applicable this sprint."

---

```markdown
# Sprint NNN — [Descriptor]

**Date:** YYYY-MM-DD  
**Duration:** [e.g., 2 hours / 1 session / multi-day]  
**Status:** Complete | In Progress | Blocked  
**Next Sprint:** SPRINT_[N+1]_[next topic]

---

## 1. What Was Built

List every file created or meaningfully modified. For each:
- File path
- What changed (one sentence)
- Production-ready? (Yes / Needs testing / Placeholder)

Example:
- `components/dashboard/MarketHero.tsx` — KSE-100 hero with breadth bar (Production-ready)
- `app/market/page.tsx` — Full 2-column intelligence dashboard layout (Production-ready)
- `docs/strategy/DATA_STRATEGY.md` — New strategic document (Complete)

---

## 2. Database Changes

List every table, column, or row that changed.

Example:
- MIGRATION: Added `company_intelligence` table (22 rows seeded for UBL, HBL, MCB)
- SEED: 22 × 4 = 88 rows inserted into `company_intelligence_blocks`
- UPDATE: `sectors` table — added `intelligence_summary` for all 7 sectors
- NO CHANGE: All other tables unchanged

If no DB changes: "No database changes this sprint."

---

## 3. Architectural Decisions Made

Any decision that affects how the system works or is structured. Even if not formalized as an ADR.

Format: Decision | Reasoning | Implications

Example:
- DECISION: MarketDriversPanel uses static seed, not DB
  REASON: `market_drivers` table not yet created; static seed is DB-ready (same shape)
  IMPLICATIONS: Must migrate to DB in next sprint or Phase 2

---

## 4. Blockers and Discoveries

What went wrong, what was surprising, what requires follow-up.

Example:
- DISCOVERY: Linux mount sync lag causes Edit tool writes to not immediately visible in bash
  RESOLUTION: Write critical files via bash cat > instead of Edit tool
  STATUS: Resolved — documented as pattern for all future sessions

- BLOCKER: Supabase project ID was wrong — first 3 SQL calls failed
  RESOLUTION: Called list_projects, identified correct ID: qiunhqgxsjyvcrcnfajl
  STATUS: Resolved — correct ID documented in DB_STATE

---

## 5. TypeScript Status

Result of most recent tsc --noEmit run.

Example:
- Run: `cd /sessions/.../mnt/ahm-platform && npx tsc --noEmit`
- Result: CLEAN — 0 errors
- Last clean check: 2026-05-18 after completing sprint

---

## 6. What Is Pending (Next Sprint Inputs)

Clear, specific tasks that the next sprint should pick up. Not vague — each item should be actionable in isolation.

Format: task | context | priority

Example:
- TASK: Seed ENGRO into company_intelligence + 22 blocks
  CONTEXT: Static config exists in ogdc-intelligence.ts as reference
  PRIORITY: High — needed for sectors page company coverage

- TASK: Build price/volume chart component
  CONTEXT: No charting library integrated yet; consider TradingView Lightweight Charts
  PRIORITY: High — credibility gap for company pages without charts

---

## 7. Context for Next AI Session

The most important section. Write this as if briefing a new AI assistant who has never seen this project.

Include:
- What phase is the project in?
- What is the single most important thing to know right now?
- What should NOT be changed or touched?
- What is the immediate next task?

Example:
> Phase 1 intelligence infrastructure is complete. The platform has:
> 7 sectors fully DB-driven, 4 companies fully DB-driven (UBL, HBL, MCB, OGDC),
> a transformed market dashboard with 7 intelligence components,
> and full strategic documentation in /docs/.
>
> MOST IMPORTANT: TypeScript is currently clean. Run tsc --noEmit before any changes
> and do not push if it fails.
>
> DO NOT TOUCH: hbl-intelligence.ts and mcb-intelligence.ts are fallback-only.
> Do not modify their content — they must match DB data exactly.
>
> IMMEDIATE NEXT TASK: Seed ENGRO company intelligence (use MCB as seeding template).
```

---

## Documentation Update Checklist

Run this checklist at the end of every sprint:

```
□ Sprint log written and saved to /docs/progress/
□ DB_STATE updated if any DB changes were made
□ New ADR written if an architectural decision was made
□ AHM_MASTER_DOCUMENTATION.md Section 9 updated if feature status changed
□ AHM_MASTER_DOCUMENTATION.md Section 10 updated if roadmap changed
□ TypeScript clean — tsc --noEmit passes
□ git add -A && git commit -m "..." && git push origin main
□ Vercel deployment verified successful
```

---

## How AI Sessions Should Consume Progress Logs

### Session Initialization Protocol

When starting a new AI development session, paste this block (adjust paths as needed):

```
AHM Platform — Session Initialization

Read before proceeding:
1. /docs/AHM_MASTER_DOCUMENTATION.md — Sections 3, 4, 5, 12 (architecture + rules)
2. /docs/database/DB_STATE_MAY_2026.md — (current DB state)
3. /docs/progress/SPRINT_[LAST].md — Section 6 (pending tasks) + Section 7 (context)

Current task: [SPECIFIC TASK DESCRIPTION]

CRITICAL RULES (from ADRs):
- Never call Supabase directly in components — use @/services/api
- Run tsc --noEmit before every commit
- No buy/sell/hold language in any UI or AI output
- All SQL inserts must be idempotent (ON CONFLICT DO UPDATE)
- Column order for company_intelligence_blocks: symbol, block_type, sort_order,
  title, body, content, icon, trend, severity, horizon, signal, metric,
  current_val, tags, related_symbols, source
```

### Token Efficiency Guidelines

- Never paste full conversation history — paste structured docs instead
- For frontend sessions: paste Section 3.1 (stack) + Section 4.3 (components) + Section 12.3 (UI rules)
- For backend sessions: paste Section 5 (full DB) + Section 3.3 (service layer) + Section 12.4 (data rules)
- For AI sessions: paste ADR-002 (AI philosophy) + Section 6 (AI engine) + DATA_STRATEGY.md
- For debugging: paste the specific error + the specific file + Section 12 rules

---

## Example Sprint Log: SPRINT_001

Below is a complete example sprint log for reference:

---

```markdown
# Sprint 001 — Market Intelligence Dashboard Transformation

**Date:** 2026-05-17 to 2026-05-18  
**Duration:** 2 sessions  
**Status:** Complete  
**Next Sprint:** SPRINT_002_company_intelligence_expansion

---

## 1. What Was Built

- `components/dashboard/MarketHero.tsx` — KSE-100 level, breadth bar, status pill (Production-ready)
- `components/dashboard/MarketIntelligenceSummary.tsx` — 4 editorial observations, static seed (Production-ready)
- `components/dashboard/SectorHeatPanel.tsx` — DB-driven sector grid with accent colors (Production-ready)
- `components/dashboard/MoversPanel.tsx` — Top 3 gainers/losers compact (Production-ready)
- `components/dashboard/MarketDriversPanel.tsx` — 6 macro drivers, static seed (Production-ready)
- `components/dashboard/SpotlightCard.tsx` — Featured intelligence spotlight (Production-ready)
- `components/dashboard/FeaturedResearch.tsx` — Live from DB, up to 3 reports (Production-ready)
- `app/market/page.tsx` — Full 2-column intelligence layout, parallel fetch (Production-ready)

---

## 2. Database Changes

No new migrations. FeaturedResearch reads from existing `research_reports` table.
SectorHeatPanel reads from existing `sectors` table.

---

## 3. Architectural Decisions Made

- DECISION: MarketIntelligenceSummary and MarketDriversPanel use static seeds
  REASON: No `market_intelligence` or `market_drivers` DB table yet
  IMPLICATIONS: Static seeds are structured identically to future DB shape — migrate when table is created

- DECISION: 2-column layout (3/5 + 2/5) stacks to single column below lg: breakpoint
  REASON: Desktop-primary design; mobile stack is acceptable for intelligence content
  IMPLICATIONS: All dashboard components are full-width on mobile

---

## 4. Blockers and Discoveries

- DISCOVERY: SectorHeatPanel joins Sector[] with SectorStat[] by db_sector_name
  CONTEXT: getSectorPerformance() returns SectorStat with sector name string, not slug
  RESOLUTION: Join logic in SectorHeatPanel via find() on db_sector_name

---

## 5. TypeScript Status

- Result: CLEAN — 0 errors (verified 2026-05-18)

---

## 6. What Is Pending

- TASK: Seed ENGRO company intelligence (22 blocks)
  PRIORITY: High
- TASK: Build price/volume chart component
  PRIORITY: High — credibility gap
- TASK: Migrate MarketDriversPanel static seed to DB (macro_data table)
  PRIORITY: Medium — Phase 3 item

---

## 7. Context for Next AI Session

Phase 1 market dashboard transformation is complete. The /market page now has a 
full intelligence layout with 7 components. TypeScript is clean. All components 
are production-ready. Static seeds in MarketIntelligenceSummary and MarketDriversPanel 
are structured for future DB migration but are not connected to DB yet.

IMMEDIATE NEXT: Company intelligence expansion — seed ENGRO as next company.
Reference: use MCB seeding SQL as the template (22 blocks, same column order).
DO NOT: modify existing company_intelligence rows for UBL/HBL/MCB/OGDC — they are live.
```

---

---

*docs/progress/README.md | Version 1.0 | May 2026*
