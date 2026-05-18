# AHM PLATFORM — MASTER PROJECT DOCUMENTATION
**Version:** 2.0 — Post-Sprint Audit
**Date:** May 2026
**Classification:** Internal — AI Development Operating Manual
**Purpose:** Permanent continuity document for all future AI development sessions

---

> This document is the single source of truth for AHM Platform architecture,
> product philosophy, technical decisions, and development workflow.
> Every future AI chat session should be initialized with the relevant sections of this file.

---

## TABLE OF CONTENTS

1. Executive Project Overview
2. Core Platform Philosophy
3. Current Tech Stack
4. Current Application Structure
5. Database Architecture
6. AI Research Engine
7. UI/UX Design System
8. Competitor Analysis
9. Current Completed Work
10. Current Roadmap
11. Specialized Chat Structure
12. Master Development Rules
13. Risks & Warnings
14. Next Action Plan

---

---

# SECTION 1 — EXECUTIVE PROJECT OVERVIEW

## 1.1 What Is AHM Platform?

AHM Platform is Pakistan's first institutional-grade financial intelligence and brokerage operating system, purpose-built for the Pakistan Stock Exchange (PSX). It combines:

- **Market intelligence** — real-time and structured data across all PSX-listed companies
- **Sector intelligence** — deep-dive framework pages for every major PSX sector
- **Company intelligence** — per-company investment thesis, drivers, risks, catalysts, valuation
- **Research layer** — equity research reports, AI-assisted summaries, macro commentary
- **Brokerage infrastructure** — client onboarding, KYC, portfolio management (roadmap)
- **AI research engine** — structured intelligence generation and narrative production

The platform is operated by AHM Securities (or the AHM brand group) and serves both retail and institutional investors in the Pakistani capital market.

## 1.2 Company Vision

> "Build Pakistan's leading financial intelligence operating system — combining institutional-grade research quality with the accessibility of a consumer product."

AHM's differentiation is not technology for its own sake. It is **structured financial intelligence** delivered through a premium, clean interface — something that has never existed in Pakistan's retail brokerage market.

The long-term vision is to become:
- Pakistan's most trusted financial intelligence platform
- The infrastructure layer for next-generation brokerage operations
- The data-rich backbone that powers AI-driven investment decision support

## 1.3 Long-Term Strategic Direction

**Phase 1 (Current):** Intelligence platform — structured sector and company intelligence, clean UX, DB-driven content, research publication system.

**Phase 2:** Client operating platform — authentication, digital account opening, KYC, portfolio dashboards, holdings, P&L visibility.

**Phase 3:** AI intelligence layer — AI-generated summaries, sector commentary, earnings analysis, macro interpretation, conversational assistant.

**Phase 4:** Advanced intelligence — predictive analytics, personalized feeds, AI-driven conviction scoring, institutional analytics tools.

**Phase 5:** Full brokerage ecosystem — execution integration, automated alerts, AI copilots, multi-product financial operating system.

## 1.4 Target Users

| Tier | User Type | What They Need |
|------|-----------|----------------|
| Guest | Market observer | Public intelligence, research snippets, onboarding CTA |
| Retail Client | PSX retail investor | Holdings, watchlists, intelligence, alerts, basic research |
| Premium Client | Active investor | Advanced research, AI summaries, deeper analytics, screeners |
| Institutional Client | Fund managers, HNWIs | Institutional dashboards, proprietary research, advanced screening |
| Analyst | Internal research team | Content management, report authoring, data tools |
| Admin | Operations team | Client management, onboarding workflows, system admin |

## 1.5 Retail vs Institutional Positioning

AHM occupies a deliberate middle position:

**Retail accessibility** — Clean, mobile-friendly interface. WhatsApp distribution. Simple language. Onboarding that does not intimidate.

**Institutional quality** — Research depth equivalent to sell-side equity notes. Structured data. Conviction framing. No noise, no indicator spam. Clean signal.

This is not "dumbed-down Bloomberg." It is "institutionally-structured intelligence made accessible." The design language, information hierarchy, and content quality all signal premium — without requiring users to be CFA charterholders to use the platform.

## 1.6 AI Intelligence Philosophy

**Core principle:** AI is not the moat. Structured data is the moat. AI is the interpreter.

The platform's AI strategy is:
1. Build the richest, most structured financial data layer for PSX that has ever existed
2. Use AI to interpret, summarize, and narrate that structured data
3. Never expose raw unstructured data to AI — feed it normalized, schema-consistent inputs
4. AI output must always be traceable to a source data point — no hallucinated fundamentals

AI roles in the platform:
- Summarizing structured intelligence blocks into natural language
- Generating daily market narrative from structured driver readings
- Explaining "why the market moved" from macro data inputs
- Answering user questions via a constrained financial assistant
- Generating conviction scores from structured thesis/risk/catalyst data

AI is explicitly **not** used for:
- Direct buy/sell recommendations
- Predictions about price movements
- Unstructured web scraping as the basis for investment claims
- Replacing analyst judgment on new thesis origination

## 1.7 Competitive Differentiation

| Dimension | AHM | Typical PSX Brokers |
|-----------|-----|---------------------|
| Data structure | Normalized, DB-driven intelligence | Flat PDFs and WhatsApp blasts |
| Company intelligence | Structured thesis, drivers, risks, catalysts | None |
| Sector intelligence | Deep framework pages, DB-backed | Basic sector lists |
| Design quality | Institutional-premium dark UI | Generic Bootstrap / outdated |
| AI integration | Structured intelligence + AI interpretation | None |
| Research publishing | Dynamic DB-backed reports | Static PDFs |
| Mobile experience | Mobile-first responsive | Often non-existent |
| WhatsApp distribution | Integrated, branded | Ad hoc |

## 1.8 Regulatory Positioning

**Current stance:** The platform is positioned as a **decision-support and intelligence system**, not an investment advisory service.

This is deliberate and legally important:
- The platform does NOT issue buy/sell/hold recommendations
- Research reports show rating/upside only as analyst opinions with full disclosure
- AI outputs are framed as intelligence summaries, not investment advice
- The SECP/PSX regulatory framework for digital brokerage and investment advisory must be respected in all future feature development

**Assumption:** AHM is either a registered broker or is developing toward SECP registration. All advisory-adjacent features must be reviewed against applicable regulations before launch.

## 1.9 Revenue Model Ideas

**Near-term (Brokerage-embedded):**
- Brokerage commission on trades executed through the platform
- Account opening fee / annual maintenance fee
- Premium subscription tier (advanced research, AI access)

**Medium-term (Platform monetization):**
- Institutional data subscriptions
- White-label intelligence feed for other brokers
- Premium research report access
- WhatsApp broadcast premium tier

**Long-term:**
- Margin financing (regulatory-dependent)
- IPO allocation access
- Mutual fund distribution
- Institutional order flow analytics

## 1.10 Product Ecosystem Vision

The long-term product is not a website. It is an **operating system for Pakistani capital market participation**:

```
AHM ECOSYSTEM
├── Intelligence Platform (web)   — Market + sector + company intelligence
├── Brokerage Platform (web/app) — Account, portfolio, execution
├── Research Hub                  — Reports, AI summaries, macro
├── WhatsApp Channel              — Daily intelligence distribution
├── Mobile App (future)           — Portfolio + alerts + intelligence
├── Institutional Terminal (future) — Advanced screening + analytics
└── API Layer (future)            — Data feeds for third-party consumption
```

---

---

# SECTION 2 — CORE PLATFORM PHILOSOPHY

## 2.1 No Direct Buy/Sell/Hold Recommendations (Non-Negotiable)

The platform **does not** issue buy, sell, or hold recommendations to retail users at the platform level.

**Why:** Regulatory risk (SECP investment advisory licensing). More importantly, it is philosophically wrong — the platform's job is to give users better information to make their own decisions, not to make decisions for them.

**How it manifests in the product:**
- Intelligence pages show "thesis themes," "drivers," "risks," "catalysts" — not recommendations
- Valuation pages show signal tags (cheap/fair/rich) as analyst positioning context, not directives
- Research reports may carry analyst ratings (BUY/HOLD/SELL) as disclosed analyst opinions
- AI summaries are framed as intelligence, not advice

**Exception:** Research reports authored by licensed analysts may carry ratings with full disclosure. This is different from the platform-level intelligence system.

## 2.2 Intelligence + Decision-Support Framework

AHM is a **decision-support system**, not an execution-advice system.

The platform gives users:
- Structured understanding of what drives a company or sector
- Clear articulation of risks and catalysts
- Historical context and valuation framing
- Macro integration showing how external factors affect individual holdings
- AI-assisted interpretation of complex data

It does NOT give users:
- "Buy this now"
- "The price will go to X"
- Personalized portfolio recommendations (without proper regulatory licensing)

## 2.3 Fundamental Analysis for Selection, Technical for Entry

**Investment framework:**
1. Fundamental analysis identifies WHAT to own (quality, value, thesis)
2. Technical analysis identifies WHEN to enter/exit (timing, momentum, levels)

The platform currently focuses on fundamental intelligence (Phase 1/2). Technical analysis tooling (charts, indicators, level-watching) is a future layer that sits on top of the fundamental foundation.

**Rule:** Fundamental intelligence pages should never be cluttered with technical indicators. They serve different purposes and serve different mental models.

## 2.4 No Retail-Style Indicator Spam

The platform must not become a TradingView clone with RSI, MACD, Bollinger Bands, and 14 overlapping indicators.

**What to avoid:**
- Indicator-heavy chart pages with no contextual narrative
- "This stock is oversold per RSI" without fundamental context
- Color-coded buy/sell signal algorithms as the primary intelligence
- Gamified scoring systems that feel like mobile trading apps

**What to build instead:**
- Clean price + volume charts with key event overlays (earnings, dividends, policy changes)
- Valuation charts (P/E, P/B over time vs. historical range)
- Relative performance vs. sector/index charts
- Charts that tell stories, not charts that display calculations

## 2.5 Institutional-Quality Intelligence Standard

Every piece of intelligence on the platform must meet a standard that a sell-side analyst would not be embarrassed to publish.

This means:
- Specific numbers with sourcing (not "strong growth" — "revenue grew 18% YoY in FY24")
- Honest risk disclosure (not just upside)
- Contextual framing (not just data points but what they mean)
- Sector-specific metrics (not just generic P/E for every sector)
- Thesis coherence (if you own it for reason X, the risk section should address X)

## 2.6 Contextual Intelligence Framework

Intelligence is context-dependent. The same data point means different things in different environments.

The platform's intelligence system is designed around this principle:
- Each company has an investment thesis (structural reasons to own)
- Each thesis is supported by specific drivers (monitored variables)
- Each driver has a current reading and trend signal
- Risks are specific and quantified, not generic boilerplate
- Catalysts are time-specific with horizon tagging (near/medium/long)

This framework (thesis → drivers → risks → catalysts → valuation) is the core intelligence model. Every company and sector uses it.

## 2.7 PSX-Specific Intelligence Layer

The platform is built for PSX, not for global equity markets. This means:

**PSX-specific intelligence elements:**
- SBP policy rate as the primary macro driver for banking sector
- PKR/USD exchange rate as a material input for many sectors
- Pakistan's 53% banking ETR as a key earnings suppressor
- ADR (Advance-to-Deposit Ratio) tax mechanics for banks
- OGDCL production volumes, circular debt for E&P/Power
- WAPDA circular debt for power sector
- Urea offtake, gas allocation for fertilisers
- CBI/SECP regulatory announcements as catalysts
- Federal Budget as the single highest-magnitude annual catalyst

These PSX-specific factors must be present in all intelligence content. Generic global financial templates do not apply without significant localization.

## 2.8 Clean Premium UX Philosophy

The UI must communicate: "This is serious. This is institutional. This is trustworthy."

**How:**
- Dark theme (near-black backgrounds, elevated surface cards)
- Minimal decoration — data is the decoration
- Consistent spacing and typography hierarchy
- Monospace fonts for numbers and codes (financial terminal feel)
- Color used only to communicate meaning (green = gain, red = loss, amber = watch)
- No gradients that don't serve information hierarchy
- No animations that don't serve user understanding
- Empty states that are informative, not apologetic

## 2.9 WhatsApp-Friendly Information Delivery

WhatsApp is Pakistan's primary communication channel. AHM's distribution strategy includes a WhatsApp-native intelligence feed.

**Principles for WhatsApp content:**
- Maximum 3-4 key bullet points per company/sector update
- Numbers with context ("MCB P/E 6x — 20% below 5yr avg" not just "P/E 6x")
- Emoji-sparingly as visual dividers, not decoration
- Clear CTA linking back to platform for depth
- Daily pre-market briefing format (morning dashboard)
- No information overload — one key insight per message

The platform's PSX Morning Dashboard skill automates this workflow.

---

---

# SECTION 3 — CURRENT TECH STACK

## 3.1 Frontend

| Technology | Role | Notes |
|------------|------|-------|
| **Next.js 14+** (App Router) | Framework | Server components, file-based routing, RSC-first |
| **TypeScript** | Language | Strict mode, all files typed |
| **Tailwind CSS** | Styling | CSS variable-based theme system |
| **CSS Variables** | Theming | `--color-base`, `--color-surface`, `--color-raised`, `--color-tx-primary`, etc. |
| **React** | UI library | Server + client components |
| No Zustand yet | State management | Planned for Phase 2 client features |
| No TanStack Query yet | Data fetching | RSC handles server fetching; client-side fetching is future |

**CSS Variable Theme System (implemented):**
```css
--color-base        /* page background */
--color-surface     /* card / panel background */
--color-raised      /* hover / elevated surface */
--color-border-theme
--color-tx-primary  /* primary text */
--color-tx-secondary
--color-tx-disabled
--color-gain        /* positive/green */
--color-loss        /* negative/red */
```

## 3.2 Backend / Data Layer

| Technology | Role | Notes |
|------------|------|-------|
| **Supabase** | BaaS / PostgreSQL host | Primary DB, auth (future), storage |
| **PostgreSQL** | Database | Via Supabase |
| **Supabase JS SDK** | DB client | `@supabase/supabase-js` — server-side only |
| No separate Node.js API | Backend | Next.js server components + API routes serve this role currently |
| No Prisma | ORM | Direct Supabase queries via service layer |
| No Redis | Cache | Planned for Phase 2+ |

## 3.3 Service Layer (Custom — Built)

All Supabase calls are encapsulated in `/services/api/`:

```
services/api/
├── index.ts          — barrel export (all services re-exported here)
├── companies.ts      — companies table queries
├── market.ts         — market_index, movers, sector performance
├── intelligence.ts   — sectors, sector_drivers, sector_intelligence_blocks
├── company-intelligence.ts — company_intelligence + blocks
├── fundamentals.ts   — financial_metrics queries
├── prices.ts         — daily_prices time-series
└── research.ts       — dividends, announcements, research_reports
```

**Rule:** Components NEVER import from `@/lib/supabase` directly. They use `@/services/api` only.

## 3.4 Adapter Layer (Custom — Built)

Two adapter libraries normalize DB rows into component-ready config objects:

- `lib/sector-adapter.ts` — DB sector rows → `SectorConfig` (used by all 7 sector pages)
- `lib/company-adapter.ts` — DB company_intelligence rows → `CompanyIntelligenceConfig`

## 3.5 Hosting & Deployment

| Service | Role |
|---------|------|
| **Vercel** | Frontend hosting + deployment |
| **Supabase** | Database + BaaS hosting |
| **GitHub** | Version control (integrated with Vercel for auto-deploy on push to main) |

Deployment pipeline: `git push origin main` → Vercel auto-deploys.

## 3.6 Charting

Currently **no charting library is integrated** for production pages. Chart infrastructure is planned but not yet built. The platform currently shows data in structured cards, tables, and stat widgets rather than charts.

Planned charting approach:
- Shared chart wrapper components in `/components/charts/`
- Single charting library (TradingView Lightweight Charts or Recharts — decision pending)
- All charts must use CSS variable theming to match the design system

## 3.7 AI Integrations

| Integration | Status |
|-------------|--------|
| **Claude API** | Used for development assistance (this workflow). Not yet integrated into platform runtime. |
| **OpenAI API** | Planned for Phase 3 AI layer |
| **Vector DB** | Planned for semantic search / RAG — no decision made yet |

**AIInsightPlaceholder** component exists in `/components/company/AIInsightPlaceholder.tsx` — a UI placeholder for where AI-generated summaries will render once the AI layer is built.

## 3.8 Tooling

| Tool | Role |
|------|------|
| `tsc --noEmit` | TypeScript validation (run before every commit) |
| Vercel CLI | Deployment (via GitHub integration) |
| Supabase Dashboard | DB management, SQL editor, migrations |
| Claude Code / Cowork | AI-assisted development (this session) |
| PSX Morning Dashboard skill | Automated WhatsApp briefing generation |

## 3.9 Future Planned Technologies

| Technology | Purpose | Phase |
|------------|---------|-------|
| Redis | Caching market data, AI summaries | Phase 2+ |
| Zustand | Client-side state (watchlists, auth) | Phase 2 |
| TanStack Query | Client-side data fetching | Phase 2 |
| TradingView Lightweight Charts | Price/volume charting | Phase 2-3 |
| OpenAI / Claude API (runtime) | AI summaries, chatbot | Phase 3 |
| Vector DB (Pinecone / pgvector) | Semantic search, RAG | Phase 3-4 |
| Mobile App (React Native) | Mobile platform | Phase 4-5 |
| WebSockets / Supabase Realtime | Real-time price feeds | Phase 3+ |

---

---

# SECTION 4 — CURRENT APPLICATION STRUCTURE

## 4.1 Top-Level Folder Structure

```
C:\ahm-platform\
├── app/                        — Next.js App Router pages
│   ├── layout.tsx              — Root layout (nav, footer)
│   ├── page.tsx                — Homepage (hub page)
│   ├── market/
│   │   └── page.tsx            — Market Intelligence Dashboard
│   ├── stocks/
│   │   ├── page.tsx            — Stock Screener
│   │   └── [symbol]/
│   │       └── page.tsx        — Dynamic company intelligence page
│   ├── sectors/
│   │   ├── layout.tsx          — Sectors shared layout
│   │   ├── page.tsx            — Sectors index page
│   │   └── [slug]/
│   │       └── page.tsx        — Dynamic sector framework page
│   ├── research/
│   │   ├── page.tsx            — Research hub index
│   │   └── [slug]/
│   │       └── page.tsx        — Dynamic research report renderer
│   ├── learn/
│   │   └── page.tsx            — Learning hub
│   └── open-account/
│       └── page.tsx            — Account opening CTA / lead capture
│
├── components/
│   ├── ui/                     — Shared primitive components
│   ├── layout/                 — Header, Footer, PageContainer
│   ├── market/                 — Market-specific components (MoverCard, SectorTable)
│   ├── dashboard/              — Market dashboard intelligence components (NEW)
│   ├── sectors/                — Sector framework components (SectorShell, BankingModule)
│   ├── company/                — Company intelligence components
│   └── research/               — Research report components
│
├── services/api/               — All Supabase data access (barrel-exported)
├── lib/                        — Pure utility functions and adapters
├── types/                      — TypeScript type definitions (single source of truth)
├── constants/                  — Sector lists, company lists, static config
├── data/sectors/               — Legacy static sector data (being migrated to DB)
├── docs/                       — Project documentation
└── middleware.ts               — Route protection skeleton
```

## 4.2 App Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Homepage — hub with navigation tiles + KSE-100 snapshot | Production |
| `/market` | Market Intelligence Dashboard — KSE-100, sectors, movers, intelligence | Production (transformed Sprint) |
| `/stocks` | Stock Screener — all PSX companies filterable table | Production |
| `/stocks/[symbol]` | Company Intelligence Page — thesis, drivers, risks, catalysts, valuation | Production (DB-first for UBL, HBL, MCB, OGDC) |
| `/sectors` | Sectors Index — all 7 sectors with intelligence summaries | Production |
| `/sectors/[slug]` | Sector Framework Page — deep intelligence for one sector | Production (7 sectors) |
| `/research` | Research Hub — published reports index | Production |
| `/research/[slug]` | Research Report — full dynamic report renderer | Production |
| `/learn` | Learning Hub — financial education content | Placeholder |
| `/open-account` | Account Opening / Lead Capture | Placeholder / CTA |

## 4.3 Components Architecture

### `/components/ui/` — Primitive Shared Components

| Component | Purpose |
|-----------|---------|
| `StatCard` | Single-metric display card with label/value/trend |
| `Card` | Generic content card with border/surface styling |
| `Badge` | Status/label badge with variant styles |
| `Table` | Shared sortable/filterable data table |
| `Breadcrumb` | Navigation breadcrumb trail |
| `SectionTitle` | Consistent section heading with optional eyebrow |
| `WhatsAppBanner` | Sitewide WhatsApp CTA capture banner |
| `AHMLogo` | SVG logo component |

### `/components/dashboard/` — Market Dashboard Intelligence (NEW - Sprint Built)

| Component | Purpose | Data Source |
|-----------|---------|-------------|
| `MarketHero` | KSE-100 level, change, breadth bar, status | Props: MarketIndex + MarketStatus |
| `MarketIntelligenceSummary` | 4 editorial market observations with trend tags | Static seed (DB-ready) |
| `SectorHeatPanel` | Sector grid with accent, market cap, avg change | Props: Sector[] + SectorStat[] |
| `MoversPanel` | Top 3 gainers + top 3 losers compact | Props: CompanyMover[] + CompanyMover[] |
| `MarketDriversPanel` | 6 macro drivers with readings and trend signals | Static seed (DB-ready) |
| `SpotlightCard` | Featured intelligence spotlight with CTA | Static seed (DB-ready) |
| `FeaturedResearch` | Up to 3 published reports from DB | Props: ResearchReportSummary[] |

### `/components/company/` — Company Intelligence Framework

| Component | Purpose |
|-----------|---------|
| `CompanyIntelligencePage` | Master assembly page — orchestrates all below |
| `InvestmentThesis` | Thesis summary + theme cards (4 themes per company) |
| `CompanyDrivers` | Driver cards with trend signals and current readings |
| `RiskCatalystPanel` | Risks (severity badges) + Catalysts (horizon badges) |
| `ValuationSummary` | Valuation metrics with signal tags + commentary |
| `FinancialSnapshot` | Period-based financial metrics table (sector-adaptive) |
| `DividendAnalysis` | Dividend history, commentary, yield positioning |
| `RelatedResearch` | Research reports related to this company |
| `AIInsightPlaceholder` | Future AI summary placeholder UI |

### `/components/sectors/` — Sector Framework

| Component | Purpose |
|-----------|---------|
| `SectorShell` | Generic sector page wrapper — header, drivers, intel blocks |
| `BankingModule` | Banking-specific intelligence module |

## 4.4 Data Flow Architecture

```
DB (Supabase)
     ↓
services/api/*.ts          (query functions — typed, error-handled)
     ↓
app/*/page.tsx             (server components — fetch + pass as props)
     ↓
lib/sector-adapter.ts      (DB rows → SectorConfig)
lib/company-adapter.ts     (DB rows → CompanyIntelligenceConfig)
     ↓
components/**/*.tsx        (pure display — no business logic, no DB calls)
```

**Rule:** Server components handle data fetching. Components receive typed props. No component calls Supabase directly.

## 4.5 Company Intelligence Routing

`app/stocks/[symbol]/page.tsx` implements DB-first routing with static fallback:

```typescript
// Universal DB-first pattern (all symbols)
const sym = params.symbol.toUpperCase();
const staticConfig = COMPANY_CONFIGS[sym] ?? null;
const dbConfig = await getCompanyIntelligence(sym, staticConfig ?? undefined);
const config = dbConfig ?? staticConfig;
```

- If DB has intelligence for `sym` → uses DB (UBL, HBL, MCB, OGDC currently seeded)
- If DB returns null → falls back to static TypeScript config (if exists)
- If neither → shows graceful "no intelligence" state

---

---

# SECTION 5 — DATABASE ARCHITECTURE

## 5.1 Database Overview

**Database:** PostgreSQL hosted on Supabase
**Project ID:** `qiunhqgxsjyvcrcnfajl`

All tables use Supabase's default `public` schema.

## 5.2 Core Tables

### `companies`
Primary company registry. One row per PSX-listed company.

```sql
companies (
  id              serial PRIMARY KEY,
  symbol          text UNIQUE NOT NULL,
  company_name    text NOT NULL,
  sector          text NOT NULL,          -- matches sectors.db_sector_name
  market_cap      numeric,

  -- Market snapshot (denormalized convenience — canonical is daily_prices)
  current_price   numeric,
  change          numeric,
  change_percent  numeric,
  volume          bigint,

  -- Fundamental snapshot (denormalized — canonical is financial_metrics)
  pe_ratio        numeric,
  dividend_yield  numeric,
  eps             numeric,
  week_52_high    numeric,
  week_52_low     numeric,

  -- Profile
  description     text,
  ceo             text,
  founded_year    int,
  website         text,
  employees       int
)
```

### `daily_prices`
Time-series OHLCV price data. One row per symbol per trading day.

```sql
daily_prices (
  id              serial PRIMARY KEY,
  symbol          text NOT NULL,
  market_date     date NOT NULL,
  open            numeric,
  high            numeric,
  low             numeric,
  close           numeric NOT NULL,
  volume          bigint,
  change          numeric,
  change_percent  numeric,
  vwap            numeric,
  trades          int,
  source          text NOT NULL,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (symbol, market_date)
)
```

### `market_index`
Index-level summary (KSE-100 and others). One row per index.

```sql
market_index (
  index_name      text PRIMARY KEY,
  level           numeric,
  change          numeric,
  change_percent  numeric,
  volume          bigint,
  advances        int,
  declines        int,
  unchanged       int,
  updated_at      timestamptz
)
```

### `financial_metrics`
Period-based fundamentals. One row per symbol per period.

```sql
financial_metrics (
  id              serial PRIMARY KEY,
  symbol          text NOT NULL,
  period          text NOT NULL,      -- e.g. "FY24", "1HFY25", "Q3FY24"
  period_type     text NOT NULL,      -- "annual" | "half_year" | "quarter" | "custom"
  period_end_date date,

  -- Income statement
  revenue         numeric,
  gross_profit    numeric,
  ebitda          numeric,
  ebit            numeric,
  pat             numeric,
  eps             numeric,

  -- Balance sheet
  total_assets    numeric,
  total_equity    numeric,
  total_debt      numeric,
  book_value      numeric,

  -- Valuation multiples
  pe_ratio        numeric,
  pb_ratio        numeric,
  ev_ebitda       numeric,
  ps_ratio        numeric,

  -- Profitability ratios
  gross_margin    numeric,
  ebitda_margin   numeric,
  net_margin      numeric,
  roe             numeric,
  roa             numeric,
  roce            numeric,

  -- Dividend metrics
  dps             numeric,
  dividend_yield  numeric,
  payout_ratio    numeric,

  -- Cash flow
  cfo             numeric,
  capex           numeric,
  fcf             numeric,

  -- Debt metrics
  debt_to_equity  numeric,
  interest_cover  numeric,

  -- Growth metrics
  revenue_growth  numeric,
  pat_growth      numeric,
  eps_growth      numeric,

  -- Banking-sector metrics (NULL for non-banking companies)
  nim             numeric,     -- Net Interest Margin %
  casa_ratio      numeric,     -- CASA as % of deposits
  npl_ratio       numeric,     -- Non-Performing Loans %
  coverage_ratio  numeric,     -- Provision coverage %
  car             numeric,     -- Capital Adequacy Ratio %
  cost_to_income  numeric,     -- Cost-to-income ratio %
  deposit_growth  numeric,     -- YoY deposit growth %
  advance_growth  numeric,     -- YoY advances growth %

  source          text NOT NULL,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (symbol, period, period_type)
)
```

**Extensibility model:** Future sector columns (cement dispatch, oil production, etc.) are added via `ALTER TABLE` as sectors are built out. The `FinancialSnapshot` component detects presence of non-null sector-specific fields and renders them automatically.

### `sectors`
Sector registry with intelligence metadata.

```sql
sectors (
  id                    serial PRIMARY KEY,
  slug                  text UNIQUE NOT NULL,   -- URL slug e.g. "banking"
  name                  text NOT NULL,          -- Display name e.g. "Banking"
  db_sector_name        text NOT NULL,          -- Matches companies.sector
  accent_color          text NOT NULL,          -- CSS hex for UI theming
  subtitle              text,
  intelligence_summary  text,                   -- One-paragraph sector overview
  volume_label          text,
  stats                 jsonb,                  -- SectorStatItem[] for hero stats strip
  status                text DEFAULT 'active',  -- "active" | "coming_soon" | "archived"
  sort_order            int DEFAULT 0,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
)
```

**Seeded sectors:** Banking, Oil & Gas, Fertiliser, Cement, Power/IPP, Textile, Automobile (7 total)

### `sector_drivers`
Key macro/sector drivers per sector. Many rows per sector.

```sql
sector_drivers (
  id              serial PRIMARY KEY,
  sector_slug     text NOT NULL REFERENCES sectors(slug),
  sort_order      int DEFAULT 0,
  label           text NOT NULL,
  description     text NOT NULL,
  current_reading text,
  trend           text NOT NULL,    -- "positive" | "negative" | "neutral" | "watch"
  updated_at      timestamptz DEFAULT now()
)
```

### `sector_intelligence_blocks`
Normalized intelligence items for sector pages.

```sql
sector_intelligence_blocks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_slug     text NOT NULL REFERENCES sectors(slug),
  block_type      text NOT NULL,    -- "takeaway" | "risk" | "driver_analysis" | etc.
  title           text NOT NULL,
  body            text,
  content         jsonb DEFAULT '{}',
  related_symbols text[] DEFAULT '{}',
  tags            text[] DEFAULT '{}',
  severity        text,             -- "critical" | "high" | "medium" | "low"
  trend           text,
  sort_order      int DEFAULT 0,
  is_active       boolean DEFAULT true,
  valid_from      timestamptz,
  valid_until     timestamptz,
  source          text NOT NULL,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)
```

### `company_intelligence`
Scalar intelligence fields per company. One row per company.

```sql
company_intelligence (
  id                          serial PRIMARY KEY,
  symbol                      text UNIQUE NOT NULL,
  accent_color                text NOT NULL,         -- CSS hex for UI theming
  exchange_label              text,                  -- e.g. "Commercial Bank"
  peers_label                 text,                  -- e.g. "Banking Peers"
  thesis_summary              text,
  valuation_summary           text,
  valuation_historical_range  text,
  valuation_peer_context      text,
  dividend_commentary         text,
  dividend_yield_positioning  text,
  dividend_consistency_note   text,
  is_active                   boolean DEFAULT true,
  source                      text NOT NULL,
  created_at                  timestamptz DEFAULT now(),
  updated_at                  timestamptz DEFAULT now()
)
```

**Seeded companies:** UBL (id=1), HBL (id=2), MCB (id=3), OGDC (id=4)

### `company_intelligence_blocks`
Normalized intelligence items for company pages. Many rows per company.

```sql
company_intelligence_blocks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol          text NOT NULL,
  block_type      text NOT NULL,
  -- "thesis_theme" | "driver" | "risk" | "catalyst" | "valuation_point"
  sort_order      int DEFAULT 0,

  -- Core content
  title           text NOT NULL,
  body            text,
  content         jsonb DEFAULT '{}',

  -- Signal fields (only applicable fields are non-null per block_type)
  trend           text,   -- drivers: "positive"|"negative"|"neutral"|"watch"
  severity        text,   -- risks: "high"|"medium"|"low"
  horizon         text,   -- catalysts: "near"|"medium"|"long"
  signal          text,   -- valuation_point: "cheap"|"fair"|"rich"
  icon            text,   -- thesis_theme: emoji character
  metric          text,   -- valuation_point: metric label e.g. "P/E Ratio"
  current_val     text,   -- drivers: current reading string

  tags            text[] DEFAULT '{}',
  related_symbols text[] DEFAULT '{}',
  is_active       boolean DEFAULT true,
  source          text NOT NULL,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)
```

**Block counts:** 22 blocks per company (4 thesis themes + 6 drivers + 4 risks + 4 catalysts + 4 valuation points)

### `dividends`
Dividend history per company.

```sql
dividends (
  id              serial PRIMARY KEY,
  symbol          text NOT NULL,
  financial_year  text,
  period          text,
  dividend_type   text,    -- "interim" | "final" | "special" | "bonus"
  amount          numeric,
  announced_date  date,
  book_closure    date,
  record_date     date,
  payment_date    date
)
```

### `announcements`
PSX company announcements.

```sql
announcements (
  id              serial PRIMARY KEY,
  symbol          text NOT NULL,
  title           text,
  body            text,
  category        text,
  published_at    timestamptz,
  url             text
)
```

### `research_reports`
Equity research reports with full structured content.

```sql
research_reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  summary         text,
  content         jsonb,        -- ReportContent: {thesis, financials, valuation, risks}
  ticker_symbols  text[] DEFAULT '{}',
  sectors         text[] DEFAULT '{}',
  tags            text[] DEFAULT '{}',
  author          text NOT NULL,
  published_at    timestamptz,
  status          text DEFAULT 'draft',   -- "draft"|"published"|"archived"
  rating          text,                   -- "BUY"|"HOLD"|"SELL"|"UNDER REVIEW"
  target_price    numeric,
  current_price   numeric,
  upside          numeric,
  ai_summary      text,
  featured_image  text,
  related_slugs   text[] DEFAULT '{}',
  seo_title       text,
  seo_description text,
  view_count      int DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)
```

**Seeded reports:** UBL (published), HUBC (published)

## 5.3 Table Relationships

```
companies (symbol)
    ├── daily_prices (symbol FK)
    ├── financial_metrics (symbol FK)
    ├── dividends (symbol FK)
    ├── announcements (symbol FK)
    ├── company_intelligence (symbol UNIQUE)
    └── company_intelligence_blocks (symbol FK)

sectors (slug)
    ├── sector_drivers (sector_slug FK)
    └── sector_intelligence_blocks (sector_slug FK)

companies.sector ←→ sectors.db_sector_name   (logical join, no FK)
```

## 5.4 Future Database Plans

| Table | Purpose | Phase |
|-------|---------|-------|
| `users` | Authentication and profiles | Phase 2 |
| `portfolios` | Holdings, transactions, P&L | Phase 2 |
| `watchlists` | User-saved stock lists | Phase 2 |
| `alerts` | Price and event alerts | Phase 2 |
| `kyc_documents` | Account opening documents | Phase 2 |
| `ai_summaries` | Cached AI-generated content | Phase 3 |
| `market_drivers` | Dashboard-level macro drivers (DB-backed) | Phase 3 |
| `market_spotlight` | Featured daily intelligence | Phase 3 |
| `macro_data` | SBP rate, PKR, oil, etc. time-series | Phase 3 |
| `sentiment_data` | News sentiment, social signals | Phase 4 |
| `conviction_scores` | Per-company AI-computed conviction scores | Phase 4 |

---

---

# SECTION 6 — AI RESEARCH ENGINE

## 6.1 Current AI Integration State

**Current status:** AI is used at DEVELOPMENT TIME (this workflow, Claude Code/Cowork) but is NOT yet integrated into the RUNTIME platform.

The `AIInsightPlaceholder` component is a UI stub that marks where runtime AI will appear.

## 6.2 Planned AI Intelligence Workflow

```
Step 1 — Data Ingestion
  External sources → raw data → normalization → DB tables

Step 2 — Structured Intelligence
  DB tables → company_intelligence (scalars + blocks)
  DB tables → sector_intelligence (drivers + blocks)
  DB tables → financial_metrics (period fundamentals)

Step 3 — AI Processing
  Structured DB data → AI summarization prompt
  AI receives: thesis, drivers, risks, catalysts, financial metrics
  AI outputs: natural language summaries, conviction assessments, alerts

Step 4 — AI Output Storage
  AI summaries → ai_summaries table (cached, timestamped)
  AI alerts → alerts table

Step 5 — Frontend Consumption
  AI summary fields rendered in CompanyIntelligencePage
  AIInsightPlaceholder replaced with AIInsightCard (future)
```

## 6.3 Intelligence Block Structure (Core AI Input)

The company_intelligence_blocks schema is the primary AI input contract.

Each company has 22 structured blocks across 5 types:

| Block Type | Count | Key Fields |
|------------|-------|-----------|
| `thesis_theme` | 4 | icon, title, body |
| `driver` | 6 | title, body, trend, current_val |
| `risk` | 4 | title, body, severity |
| `catalyst` | 4 | title, body, horizon |
| `valuation_point` | 4 | metric, current_val, signal |

AI receives this structured data and can:
- Generate investment thesis summaries
- Assess conviction level (based on driver trends vs. risks)
- Flag catalyst proximity (near vs. long horizon)
- Compare valuation signals across peers

## 6.4 Scoring Logic (Planned — Not Yet Built)

**Conviction Score Framework:**

```
Conviction Score = f(
  driver_trend_aggregate,   // % of drivers with positive/negative trends
  risk_severity_count,      // weighted count of high/medium/low risks
  catalyst_proximity,       // near-term catalysts increase conviction
  valuation_signal,         // cheap = higher conviction at same thesis
  financial_trajectory      // EPS/ROE trend direction
)

Output: 0-100 score with:
  0-30  = Low conviction / avoid
  31-60 = Neutral / watch
  61-80 = Moderate conviction / accumulate on dips
  81-100 = High conviction / core holding
```

**Important:** Conviction scores are analytical outputs, NOT investment recommendations. They represent structured intelligence assessments.

## 6.5 Narrative Generation Framework (Planned)

AI narrative generation will follow structured prompts:

**Daily Market Narrative Prompt:**
```
Given: KSE-100 movement, top gainers/losers, sector performance, macro driver readings
Produce: 150-word market summary explaining WHY the market moved
Format: structured narrative with key drivers highlighted
Constraint: cite specific data points, no price predictions
```

**Company Intelligence Summary Prompt:**
```
Given: company_intelligence scalars + 22 structured blocks + recent financial_metrics
Produce: 200-word investment thesis summary in analyst voice
Format: opening thesis, 3 key structural advantages, 2 key risks, valuation assessment
Constraint: PSX-specific language, no buy/sell directives
```

**Sector Intelligence Summary Prompt:**
```
Given: sector drivers + intelligence blocks + YTD price performance
Produce: 150-word sector outlook narrative
Format: current state, primary risk, primary opportunity, key variable to monitor
Constraint: macro-linked, sector-specific metrics included
```

## 6.6 Catalyst Engine (Planned)

A structured system to track and alert on catalyst proximity:

```
CatalystMonitor:
  - horizon: "near" (0-3 months) | "medium" (3-12 months) | "long" (12m+)
  - status: "pending" | "triggered" | "missed" | "resolved"
  - trigger_event: e.g. "Federal Budget announced", "Earnings release"
  - impact_direction: "positive" | "negative" | "neutral"

Alert Logic:
  - Budget date approaching → flag all ETR-sensitive companies (banks)
  - Earnings season → flag companies with near-horizon catalyst "earnings recovery"
  - SBP policy meeting → flag rate-sensitive sectors (banking, power)
```

## 6.7 Risk Engine (Planned)

Risk monitoring beyond static risk blocks:

```
DynamicRisk:
  - base risk (from company_intelligence_blocks, severity-tagged)
  - dynamic risk flag (triggered by macro data changes)
  
  Examples:
  - SBP rate rises unexpectedly → flag banking NIM compression risk as "elevated"
  - PKR devalues >5% in 30 days → flag import-cost risk for cement/auto
  - Oil >$90 → flag refining margin risk for PSO / OMCs
```

## 6.8 Technical Analysis Framework (Future)

Technical analysis will be a **separate layer** that sits on top of fundamental intelligence:

```
TechLayer (operates on daily_prices table):
  - Support / resistance level detection
  - Moving average crossovers (50d, 200d)
  - RSI / momentum signals
  - Volume anomaly detection
  - Relative performance vs. sector/index

Output format:
  - NOT raw indicator values to the user
  - Translated signals: "Trading at 200-day MA support with above-avg volume"
  - Always paired with fundamental context
```

## 6.9 PSX Morning Dashboard (Built — Automated)

A Cowork skill that generates daily pre-market briefings:

**Content:**
1. Global markets overnight (US futures, Asian markets)
2. Commodity prices (Brent, HH Gas, Urea)
3. PKR/USD spot
4. PSX previous session summary
5. FIPI/LIPI foreign flow data
6. Key corporate announcements
7. Trade ideas / sector highlights for the session

**Distribution:** WhatsApp channel (automated via skill trigger)

---

---

# SECTION 7 — UI/UX DESIGN SYSTEM

## 7.1 Visual Identity Philosophy

AHM's visual language communicates: **precision, trust, and institutional seriousness.**

The three inspirations held in simultaneous balance:
- **Bloomberg** — data density, information hierarchy, terminal credibility
- **Linear** — clean surfaces, whitespace as a feature, modern dark theme
- **Stripe Dashboard** — structured cards, clear data relationships, developer elegance

What it must NEVER look like:
- A retail trading app (bright greens, gamified confetti)
- A basic brokerage site (Bootstrap tables, white backgrounds, 2015 aesthetics)
- A data dump (raw tables with no context)

## 7.2 Color System

```css
/* Base palette — all via CSS variables */

/* Surfaces */
--color-base:           #0d0e11    /* Page background — near-black */
--color-surface:        #141519    /* Card background */
--color-raised:         #1a1b1f    /* Hover / elevated element */

/* Borders */
--color-border-theme:   #1e2026    /* Subtle dividers */

/* Text */
--color-tx-primary:     #f0f2f5    /* Primary content */
--color-tx-secondary:   #8b909a    /* Secondary / labels */
--color-tx-disabled:    #4a5060    /* Disabled / metadata */

/* Semantic */
--color-gain:           #22c55e    /* Positive / green */
--color-loss:           #ef4444    /* Negative / red */
```

**Sector accent colors (per sectors table):**
- Banking: `#1d4ed8` (blue)
- Oil & Gas: `#854d0e` (amber/brown)
- Fertiliser: `#15803d` (green)
- Cement: `#44403c` (stone)
- Power: `#7c3aed` (violet)
- Textile: `#0e7490` (teal)
- Automobile: `#9f1239` (rose)

**Company accent colors (per company_intelligence table):**
- UBL: `#1d4ed8`
- HBL: `#16a34a`
- MCB: `#be123c`
- OGDC: `#854d0e`

## 7.3 Typography System

```
Font hierarchy:
  Page titles:     text-4xl font-bold (text-tx-primary)
  Section headers: text-xl font-bold (text-tx-primary)
  Card titles:     text-sm font-semibold (text-tx-primary)
  Body text:       text-sm (text-tx-primary / text-tx-secondary)
  Labels:          text-xs font-mono uppercase tracking-widest (text-tx-disabled)
  Data values:     font-mono tabular-nums (tx-primary with semantic color)

Monospace usage:
  - All numeric data values
  - Ticker symbols
  - Market status labels
  - Metric labels in cards
  - Price and percentage displays
```

**Rule:** Ticker symbols are ALWAYS monospace. Data values are ALWAYS tabular-nums.

## 7.4 Institutional Design Language

**Section headers:** `text-xs font-mono text-tx-disabled uppercase tracking-widest` — this is the "Bloomberg eyebrow" style used for all section labels across the platform.

**Accent bars:** Left border colored with sector/company accent color — used on intelligence cards, spotlight cards, and sector headers.

**Dividers:** `divide-y divide-border-theme` within card lists — clean minimal separation without heavy visual weight.

**Status pills:** Rounded-full badges with semantic background/border/text color triads.

**Trend signals:** Consistent dot + badge pattern: colored dot indicating trend, text label confirming it.

## 7.5 Card Design Patterns

```
Standard card:
  bg-surface border border-border-theme rounded-xl p-5

Section header pattern:
  text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4

Intelligence item row:
  flex items-start gap-4 px-5 py-4
  [colored dot] [label + body] [signal value]

Hover state:
  hover:bg-raised transition-colors
```

## 7.6 Dashboard Philosophy

Every dashboard section answers ONE question. Users should not need to read every section — they should be able to scan and immediately identify what's relevant.

**Information hierarchy on Market Dashboard:**
1. KSE-100 level + change (immediate answer: is market up or down?)
2. Breadth bar (follow-up: is it broad or narrow?)
3. Intelligence summary (context: what's driving it?)
4. Drivers panel (variables: what to watch?)
5. Sector heat (rotation: where is money moving?)
6. Movers (specifics: who is leading/lagging?)
7. Research (depth: what do analysts say?)
8. Spotlight (focus: what's the one thing to know today?)

## 7.7 Mobile Philosophy

The platform is mobile-responsive but NOT mobile-first in its design language. It is **desktop-primary, mobile-capable**.

Mobile behavior:
- Single-column stacking below `lg:` breakpoint
- Market cap and secondary stats hidden on mobile (`hidden md:block`)
- Accent bars remain visible on all screen sizes
- Touch targets are at least 44px (met via generous padding)
- Monospace text remains readable at mobile scale (minimum text-xs = 12px)

**Rule:** No feature should break on mobile. But mobile is not the target optimization — desktop is.

## 7.8 WhatsApp Design Philosophy

WhatsApp intelligence has its own format constraints:
- Plain text only (no HTML)
- Maximum 5-6 lines per block before visual fatigue
- Numbers must be self-explanatory (include units and context)
- Structure: headline → 3 bullets → CTA link
- No tables, no graphs — descriptive text replaces visual elements

---

---

# SECTION 8 — COMPETITOR ANALYSIS

## 8.1 Finqalab

**What they do:** Analytics platform for PSX — data, charts, screeners, fundamental data.

**Strengths:**
- Established PSX data aggregation
- Screener tools
- Financial data history

**Weaknesses:**
- Design feels dated/utilitarian
- No intelligence narrative layer (raw data, no interpretation)
- No AI layer
- No sector intelligence framework
- Weak mobile experience
- No institutional positioning

**AHM Differentiation:** AHM offers structured intelligence (thesis, drivers, risks) vs. raw data tables. Design and UX are a generation ahead.

## 8.2 Fasset

**What they do:** Digital asset / crypto investment platform with PSX access growing.

**Strengths:**
- Mobile-first consumer app
- Slick retail UX
- Crypto audience crossover

**Weaknesses:**
- Not focused on PSX fundamental intelligence
- Consumer/gamified positioning (opposite of AHM)
- No institutional credibility
- No research layer

**AHM Differentiation:** Different market entirely — Fasset serves crypto/retail; AHM serves PSX fundamental investors.

## 8.3 Alphagen

**What they do:** PSX-focused quant analytics and algorithmic insights.

**Strengths:**
- Quantitative approach
- Data-driven signals
- Unique quant positioning

**Weaknesses:**
- Highly technical — not accessible to most retail investors
- Limited narrative/intelligence layer
- No brokerage integration

**AHM Differentiation:** AHM bridges institutional intelligence quality with retail accessibility. Alphagen is expert-only.

## 8.4 Investify

**What they do:** Digital investment platform for Pakistan (mutual funds focus).

**Strengths:**
- Regulated mutual fund distribution
- Clean mobile experience
- Robo-advisory positioning

**Weaknesses:**
- No PSX direct equity intelligence
- No company-level research
- Limited to managed fund products

**AHM Differentiation:** AHM is direct equity intelligence + future brokerage. Different product entirely.

## 8.5 Stockify

**What they do:** PSX data and analytics platform.

**Strengths:**
- PSX-specific data
- Some screener functionality

**Weaknesses:**
- Basic UI/UX
- No intelligence narrative
- No AI layer
- Limited depth of analysis

**AHM Differentiation:** Quality of intelligence, depth of analysis, and design quality are materially superior.

## 8.6 SCS Capital / Topline Securities / Arif Habib etc. (Traditional Brokers)

**What they do:** Full-service PSX brokers with research departments.

**Strengths:**
- Licensed, regulated
- Established client relationships
- In-house research teams
- Execution infrastructure

**Weaknesses:**
- Research delivered via PDF or email — not searchable, not interactive
- No digital-first intelligence platform
- Archaic client portals
- WhatsApp-based communication is ad-hoc, not structured
- No AI integration
- No structured data layer

**AHM Differentiation:** AHM delivers what traditional brokers' research teams produce, but in a structured, searchable, interactive, AI-ready format. The goal is to be the platform that makes traditional broker research look primitive.

## 8.7 Strategic Opportunity

The PSX market is served by either:
1. Raw data tools (Finqalab, Stockify) — data without interpretation
2. Traditional brokers — interpretation without digital infrastructure
3. Consumer apps (Fasset) — execution without intelligence depth

**AHM sits at the intersection of all three — structured intelligence + premium digital platform + future brokerage execution.**

This gap is the strategic opportunity. No current player is executing it well.

---

---

# SECTION 9 — CURRENT COMPLETED WORK

## 9.1 Foundation Layer (Complete — Production Ready)

| Feature | Status | Notes |
|---------|--------|-------|
| CSS variable theme system | Complete | Dark theme, all semantic colors |
| Shared UI components | Complete | StatCard, Card, Badge, Table, Breadcrumb, SectionTitle, WhatsAppBanner |
| Service layer | Complete | All services in `/services/api/`, barrel-exported |
| TypeScript types | Complete | `types/index.ts` — single source of truth, 400 lines |
| Formatter library | Complete | `lib/formatters.ts` — price, %, volume, market cap |
| Market status utility | Complete | `lib/market.ts` — PST timezone, session detection |
| Sector adapter | Complete | `lib/sector-adapter.ts` — DB rows → SectorConfig |
| Company adapter | Complete | `lib/company-adapter.ts` — DB rows → CompanyIntelligenceConfig |
| Route protection skeleton | Complete | `middleware.ts` — RBAC skeleton built |

## 9.2 Market Dashboard (Complete — Transformed Sprint)

| Component | Status | Notes |
|-----------|--------|-------|
| MarketHero | Complete | Breadth bar, status pill, formatted level |
| MarketIntelligenceSummary | Complete | 4 editorial observations, static seed (DB-ready) |
| SectorHeatPanel | Complete | DB-driven, accent colors, market cap, avg change |
| MoversPanel | Complete | Top 3 gainers + top 3 losers, compact |
| MarketDriversPanel | Complete | 6 macro drivers, static seed (DB-ready) |
| SpotlightCard | Complete | Featured MCB ETR thesis, static seed (DB-ready) |
| FeaturedResearch | Complete | Live from DB, up to 3 reports |
| app/market/page.tsx | Complete | 2-column intelligence layout, parallel fetch |

## 9.3 Sector Intelligence (Complete — 7 Sectors)

| Sector | Status | DB Seeded | Notes |
|--------|--------|-----------|-------|
| Banking | Complete | ✓ Full | Drivers, intel blocks, stats, subtitles |
| Oil & Gas | Complete | ✓ Full | Drivers, intel blocks, stats, subtitles |
| Fertiliser | Complete | ✓ Full | Drivers, intel blocks, stats, subtitles |
| Cement | Complete | ✓ Full | Drivers, intel blocks, stats, subtitles |
| Power/IPP | Complete | ✓ Full | Drivers, intel blocks, stats, subtitles |
| Textile | Complete | ✓ Full | Drivers, intel blocks, stats, subtitles |
| Automobile | Complete | ✓ Full | Drivers, intel blocks, stats, subtitles |

## 9.4 Company Intelligence Pages (Complete — 4 Companies, DB-Primary)

| Company | DB Seeded | Intelligence | Financials | Notes |
|---------|-----------|-------------|-----------|-------|
| UBL | ✓ Scalars + 22 blocks | Full | FY23 + FY24 | DB primary + banking metrics |
| HBL | ✓ Scalars + 22 blocks | Full | FY23 + FY24 | DB primary + banking metrics |
| MCB | ✓ Scalars + 22 blocks | Full | FY23 + FY24 | DB primary + banking metrics |
| OGDC | ✓ Scalars + blocks | Full | FY24 + FY23 | DB primary |

**Static fallbacks exist for:** HBL (`hbl-intelligence.ts`), MCB (`mcb-intelligence.ts`)
**Static configs exist for:** BAFL, and others in `constants/banking.ts`

## 9.5 Research System (Functional — 2 Reports Published)

| Feature | Status | Notes |
|---------|--------|-------|
| Research reports DB table | Complete | Full schema with JSONB content |
| `research_reports` service | Complete | `getPublishedReports`, `getReportsByTicker`, etc. |
| Report dynamic renderer | Complete | `app/research/[slug]/page.tsx` |
| Report index page | Complete | `app/research/page.tsx` |
| UBL research report | Published | DB seeded, accessible |
| HUBC research report | Published | DB seeded, accessible |

## 9.6 Authentication (Skeleton — Not Live)

| Feature | Status |
|---------|--------|
| `lib/auth.ts` | Skeleton built |
| `lib/rbac.ts` | RBAC logic skeleton |
| `middleware.ts` | Route protection skeleton |
| `types/auth.ts` | Auth types defined |
| Supabase Auth | Not yet wired to UI |

## 9.7 Placeholder / Partial Work

| Feature | Status | Notes |
|---------|--------|-------|
| `app/learn/page.tsx` | Placeholder | Content structure needs building |
| `app/open-account/page.tsx` | Placeholder | Lead capture CTA exists but no backend |
| `AIInsightPlaceholder.tsx` | UI placeholder | Renders "AI Intelligence — Coming Soon" |
| Charts | Not started | No charting library integrated yet |
| Mobile app | Not started | Web only currently |
| Portfolio dashboard | Not started | Phase 2 |
| WhatsApp backend | Partial | PSX Morning Dashboard skill exists but needs scheduling |

## 9.8 Technical Debt Items

| Item | Priority | Notes |
|------|----------|-------|
| `data/sectors/` folder | Low | Legacy static data — being replaced by DB |
| `components_tmp_StockCard.tsx` | Low | Temp file in root — should be cleaned up |
| Static fallback files (`hbl-intelligence.ts`, `mcb-intelligence.ts`) | Low | Retained until DB validated in all environments |
| Duplicate sector data in `constants/` vs DB | Medium | Constants still used for some displays |

---

---

# SECTION 10 — CURRENT ROADMAP

## 10.1 Immediate Priorities (Next 2 Weeks)

### Frontend
- [ ] Add more companies to company_intelligence DB (BAFL, ENGRO, LUCK, PSO minimum)
- [ ] Build chart infrastructure — price history chart for company pages
- [ ] Add `/learn` page content structure
- [ ] Polish `/open-account` with working lead capture form

### Backend
- [ ] Seed financial_metrics for BAFL, ENGRO (existing static configs need DB seeding)
- [ ] Implement daily_prices seeding pipeline (manual or automated)
- [ ] Seed companies table with full PSX universe (all listed companies)

### AI
- [ ] Wire AIInsightPlaceholder to actual Claude API call for UBL/HBL/MCB
- [ ] Build AI summary generation function in services layer
- [ ] Cache AI summaries in DB (ai_summaries table)

### Research
- [ ] Publish 2-3 more research reports (MCB, OGDC, ENGRO minimum)
- [ ] Add sector reports (not just company reports)

## 10.2 Next Sprint Priorities (2–6 Weeks)

### Frontend
- [ ] Price/volume chart component (using TradingView Lightweight Charts)
- [ ] Valuation history chart (P/E, P/B over time)
- [ ] Stock screener filters (sector, P/E range, dividend yield, market cap)
- [ ] Watchlist UI (client-side for now, without auth)
- [ ] WhatsApp share buttons on intelligence cards

### Backend
- [ ] Auth system — Supabase Auth wired to UI
- [ ] User profiles table + basic RBAC
- [ ] Price data ingestion pipeline (PSX scraper or data provider integration)
- [ ] Dividend calendar from PSX feed

### AI
- [ ] Replace static seeds in MarketIntelligenceSummary with DB query
- [ ] Replace static seeds in MarketDriversPanel with DB macro_data table
- [ ] AI market narrative generation (daily)
- [ ] AI company insight generation (weekly refresh)

### Infrastructure
- [ ] Set up scheduled tasks for daily price updates
- [ ] Set up daily AI intelligence refresh pipeline
- [ ] Performance audit (Vercel Analytics)

## 10.3 Medium-Term Roadmap (Phase 2 — 2-4 Months)

### Client Operating Platform
- [ ] Full authentication (Supabase Auth: email + magic link)
- [ ] Digital account opening flow (KYC, document upload)
- [ ] Portfolio dashboard (holdings, P&L, allocation)
- [ ] Watchlist with alerts
- [ ] Notifications system (price alerts, dividend announcements)

### Intelligence Expansion
- [ ] All 50+ PSX large-cap companies with full intelligence
- [ ] Sector reports in research hub
- [ ] Macro intelligence dashboard (SBP rate calendar, economic data)
- [ ] Earnings calendar with pre/post analysis

### AI Layer
- [ ] Conversational assistant (constrained to PSX intelligence data)
- [ ] AI conviction scoring (per company, auto-refreshed)
- [ ] AI sector rotation commentary (weekly)
- [ ] "Why did this stock move?" AI explanations

## 10.4 Long-Term Roadmap (Phase 3-5 — 4+ Months)

### Advanced Intelligence
- [ ] Technical analysis layer (charts with AI-translated signals)
- [ ] Predictive analytics (with appropriate disclaimers)
- [ ] Personalized intelligence feeds
- [ ] Institutional dashboard tier

### Brokerage Integration
- [ ] Trade execution integration (API)
- [ ] Order management
- [ ] Settlement and custody
- [ ] Margin financing (regulatory clearance required)

### Platform Expansion
- [ ] React Native mobile app
- [ ] Real-time WebSocket price feeds
- [ ] API product for institutional clients
- [ ] White-label intelligence feeds

---

---

# SECTION 11 — SPECIALIZED CHAT STRUCTURE

## 11.1 Why Modular Chats?

One mega-chat accumulates 100k+ tokens of context, making AI responses slower, more expensive, and eventually context-limited. Modular specialized chats allow:

- Each chat to be initialized with ONLY the context it needs
- Faster, more focused AI responses
- Easier continuity when one chat runs out of context
- Parallel workstreams without interference
- Cleaner audit trails per domain

## 11.2 Recommended Chat Structure

---

### CHAT 1 — MASTER STRATEGY CHAT

**Purpose:** Product vision, strategic decisions, roadmap prioritization, architecture decisions.

**What belongs here:**
- "Should we add X feature?"
- "How should we position against Y competitor?"
- "What's the priority order for Phase 2?"
- Revenue model discussions
- Regulatory and compliance questions
- High-level architecture decisions

**What should NOT go here:**
- Code writing
- Debugging
- Specific component implementation
- Database query writing

**Context to paste:**
- This document, Section 1 (Executive Overview)
- This document, Section 2 (Philosophy)
- This document, Section 10 (Roadmap)
- Current sprint status summary

---

### CHAT 2 — FRONTEND CHAT

**Purpose:** All UI component development, page implementation, design system enforcement.

**What belongs here:**
- Building new components
- Implementing new pages
- Refactoring existing UI
- Responsive design issues
- Tailwind class decisions

**What should NOT go here:**
- Database schema changes
- Service layer (keep in Backend Chat)
- Major architecture decisions

**Context to paste:**
```
You are working on the AHM Platform — a PSX financial intelligence platform.
Stack: Next.js 14 App Router, TypeScript, Tailwind CSS with CSS variables.
Rules:
  - Never call Supabase directly in components
  - Import from @/services/api only
  - Import types from @/types
  - Use CSS variables: bg-base, bg-surface, bg-raised, border-border-theme
  - Use text-tx-primary, text-tx-secondary, text-tx-disabled for text
  - Use text-gain (green) and text-loss (red) for financial color
  - Section labels: text-xs font-mono text-tx-disabled uppercase tracking-widest
  - Ticker symbols: font-mono
  - Numbers: tabular-nums font-mono
  - Mobile: stack below lg: breakpoint
  - No direct buy/sell/hold recommendations in UI text
```
Include relevant component list (Section 4.3) and task list.

---

### CHAT 3 — BACKEND / DATA CHAT

**Purpose:** Supabase schema, service layer, data seeding, database migrations.

**What belongs here:**
- Writing new service functions in `/services/api/`
- Database migrations (new tables, columns)
- Seeding data (company intelligence, sector data, financial metrics)
- Adapter layer changes
- TypeScript type definitions (types/index.ts)

**What should NOT go here:**
- Frontend component building
- Design decisions

**Context to paste:**
```
AHM Platform — Backend/Data context
Database: Supabase PostgreSQL, project ID: qiunhqgxsjyvcrcnfajl
Service layer: /services/api/*.ts — barrel exported from index.ts
Adapter layer: /lib/sector-adapter.ts, /lib/company-adapter.ts
Types: /types/index.ts — single source of truth
Rules:
  - All queries in services/api, never in components
  - Use ON CONFLICT DO UPDATE for all inserts (idempotency)
  - Column order for company_intelligence_blocks inserts:
    symbol, block_type, sort_order, title, body, content,
    icon, trend, severity, horizon, signal, metric, current_val,
    tags, related_symbols, source
  - Always ARRAY[]::text[] for empty arrays in SQL
  - Run tsc --noEmit after every change
```
Include Section 5 (DB Architecture) and current seeding status.

---

### CHAT 4 — AI ENGINE CHAT

**Purpose:** AI integration, prompt engineering, scoring logic, narrative generation, automation.

**What belongs here:**
- AI summary generation architecture
- Prompt design for market intelligence
- Conviction scoring algorithm
- AI output caching strategy
- Automation pipeline design

**What should NOT go here:**
- Frontend implementation (that goes to Frontend Chat)
- Database schema (that goes to Backend Chat unless AI-specific tables)

**Context to paste:**
- This document, Section 6 (AI Research Engine)
- Intelligence block schema (Section 5, company_intelligence_blocks)
- Platform philosophy (no buy/sell/hold) from Section 2
- Example data: a sample 22-block company intelligence set

---

### CHAT 5 — DEBUGGING CHAT

**Purpose:** Diagnosing and fixing TypeScript errors, runtime errors, build failures, data issues.

**What belongs here:**
- `tsc --noEmit` error resolution
- Supabase query errors
- Vercel build failures
- Component prop type mismatches
- Data not rendering correctly

**What should NOT go here:**
- New feature building (move to Frontend or Backend Chat)

**Context to paste:**
```
AHM Platform debugging context.
Stack: Next.js 14 App Router, TypeScript strict, Supabase, Tailwind.
Work dir: C:\ahm-platform
Linux mount (bash): /sessions/.../mnt/ahm-platform/
CRITICAL: tsc runs on Linux mount — files written via bash are immediately available.
Files written via Write tool go to Windows path — bash may lag by seconds.
Use: cd /sessions/.../mnt/ahm-platform && npx tsc --noEmit
```
Include the specific error message and relevant file contents.

---

### CHAT 6 — DESIGN CHAT

**Purpose:** Visual design decisions, UX patterns, information hierarchy, design system evolution.

**What belongs here:**
- "How should the conviction score badge look?"
- "What's the right layout for a mobile portfolio view?"
- "Should we add animations to the breadth bar?"
- New color palette decisions
- Typography decisions
- Component visual design (before implementation)

**What should NOT go here:**
- Code implementation (that goes to Frontend Chat)

**Context to paste:**
- This document, Section 7 (UI/UX Design System)
- CSS variable list
- Existing component patterns

---

### CHAT 7 — AUTOMATION CHAT

**Purpose:** Data ingestion pipelines, scheduled tasks, PSX Morning Dashboard, WhatsApp delivery.

**What belongs here:**
- Price data scraping/ingestion pipeline design
- Daily AI intelligence refresh automation
- PSX Morning Dashboard skill configuration
- Alert delivery systems
- Scheduled task setup

**What should NOT go here:**
- Manual data seeding (that's Backend Chat)
- Frontend automation

**Context to paste:**
- Current PSX Morning Dashboard skill configuration
- Service layer functions available for data access
- Scheduled tasks tool documentation

---

### CHAT 8 — DATA ENGINEERING CHAT

**Purpose:** Large-scale data operations — seeding 100s of companies, historical price data loading, financial data normalization.

**What belongs here:**
- Bulk company seeding scripts
- Historical financial data processing
- Data quality and validation
- Schema migrations for scale
- Data source integration (Bloomberg, PSX API, financial data providers)

**What should NOT go here:**
- Single-company intelligence writing (that's Backend Chat)
- Application code

**Context to paste:**
- Database schema (Section 5)
- Service layer structure (Section 3.3)
- Current data completeness status

---

---

# SECTION 12 — MASTER DEVELOPMENT RULES

These rules apply to ALL future AI chats working on the AHM Platform. They are NON-NEGOTIABLE.

## 12.1 Architecture Rules

1. **No Supabase calls in components.** All data access goes through `/services/api/`. Period.
2. **No business logic in components.** Components receive typed props. They display, nothing else.
3. **No new component patterns without checking existing.** Before creating a new component, check if an existing one can be extended.
4. **Adapter pattern is mandatory for DB→UI.** Raw DB rows never reach component props — they go through adapter functions.
5. **Types are centralized.** All types live in `types/index.ts`. No local type redefinitions.
6. **Services are barrel-exported.** Import from `@/services/api`, never from `@/services/api/companies.ts` directly.
7. **TypeScript check before every commit.** `cd C:\ahm-platform && npx tsc --noEmit` must return zero errors.

## 12.2 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Component files | PascalCase | `MarketHero.tsx` |
| Service files | kebab-case | `company-intelligence.ts` |
| Type names | PascalCase | `CompanyIntelBlock` |
| DB column names | snake_case | `current_val` |
| CSS variables | kebab-case with prefix | `--color-tx-primary` |
| Tailwind classes | As-is (no custom names) | `text-tx-primary` |
| Service functions | camelCase verb+noun | `getCompanyIntelligence` |
| Constants | SCREAMING_SNAKE_CASE | `MCB_THESIS_SUMMARY` |
| URL slugs | kebab-case | `/sectors/oil-gas` |
| DB slugs | kebab-case | `oil-gas`, `banking` |

## 12.3 UI Standards

1. **Section labels always:** `text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4`
2. **Cards always:** `bg-surface border border-border-theme rounded-xl`
3. **Ticker symbols always:** `font-mono font-bold` with border pill
4. **Numbers always:** `tabular-nums font-mono`
5. **Positive values always:** `text-gain` — NEVER `text-green-500` or hardcoded colors
6. **Negative values always:** `text-loss` — NEVER `text-red-500`
7. **No hardcoded hex colors in className.** Use CSS variables or Tailwind utility classes
8. **Hover states always:** `hover:bg-raised transition-colors`
9. **Empty states always:** Provide an informative message, never nothing
10. **Loading states:** Use skeleton patterns (Phase 2 — implement before auth)

## 12.4 Data Standards

1. **All SQL inserts must be idempotent.** Use `ON CONFLICT ... DO UPDATE SET` or `DELETE + INSERT` patterns
2. **Empty arrays in SQL always cast:** `ARRAY[]::text[]` not `ARRAY[]`
3. **Timestamps always use timestamptz**, not timestamp without timezone
4. **Financial metrics are stored in original units** (PKR millions for Pakistani companies unless stated)
5. **Percentages stored as decimals** where possible (0.18 not 18 for 18%) OR as percentage directly with column name suffix `_pct` — be consistent per column
6. **NULL means not applicable**, not zero. Zero and null are different.
7. **Source field mandatory** on all intelligence tables — tracks data provenance

## 12.5 AI Output Standards

1. **AI summaries never make price predictions.** "The stock may reach X" is prohibited.
2. **AI summaries never issue buy/sell/hold directives.** "You should buy" is prohibited.
3. **AI summaries always cite data.** "Revenue grew 18% YoY (FY24)" not "strong growth"
4. **AI uses institutional language.** "NIM compression" not "banks making less money"
5. **AI acknowledges uncertainty.** "If X materializes..." not "X will happen"
6. **AI summaries are timestamped and versioned** — never serve stale AI output as current
7. **AI inputs are structured.** AI never reads free-text descriptions as primary inputs — it reads normalized schema data

## 12.6 Performance Standards

1. **Server components for all data-fetching pages.** No client-side data fetching unless interactivity requires it.
2. **Parallel fetching mandatory** where independent queries can be parallelized: `Promise.all([...])`
3. **Supabase queries are specific** — never `SELECT *` in production queries, always name columns
4. **Pagination for large result sets** — never `.limit(1000)` without considering performance
5. **Images optimized** — use Next.js `<Image>` component, not raw `<img>`
6. **No inline styles** except for dynamic accent colors from DB — use Tailwind

## 12.7 Scalability Standards

1. **New sectors follow the same DB pattern** as existing 7 sectors — no bespoke per-sector code
2. **New companies follow the DB-first pattern** — company_intelligence + 22 blocks
3. **New dashboard sections are extractable components** — not baked into page.tsx
4. **Static seeds are structured identically to their future DB shape** — drop-in migration, not rewrite
5. **Intelligence blocks are normalized** — not JSONB blobs with changing schemas

## 12.8 Git / Deployment Standards

1. **TypeScript clean before push.** Never push with tsc errors.
2. **Meaningful commit messages.** `feat: [sprint name] — [short description]` format
3. **One logical push per sprint completion.** Not per-file commits in development.
4. **Verify on Vercel** after push — check deployment succeeded before closing the session

---

---

# SECTION 13 — RISKS & WARNINGS

## 13.1 Architectural Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Static seed drift | Medium | Static seeds exist for dashboard panels (drivers, observations). If not migrated to DB, they become stale and incorrect. **Mitigation:** Schedule DB migration of MarketDriversPanel and MarketIntelligenceSummary seeds within 2 sprints. |
| Growing constants folder | Medium | `constants/` folder still has sector data that partially duplicates DB. **Mitigation:** Audit and deprecate after full DB validation. |
| Missing chart infrastructure | High | Company pages have no price charts. For credibility as a financial platform, this is a significant gap. **Mitigation:** Prioritize chart component in next sprint. |
| Service layer barrel fragility | Low | All services re-exported from `services/api/index.ts`. Adding a new service file requires updating index.ts. **Mitigation:** Document this rule — it's a known convention. |

## 13.2 Scalability Concerns

| Concern | Notes |
|---------|-------|
| Seeding 500+ companies manually | Currently 4 companies are fully seeded. Scaling to the full PSX universe (500+ listed companies) requires automation, not manual SQL. A bulk seeding strategy must be designed. |
| `financial_metrics` rows per company | 2-3 periods per company × 500 companies = 1000-1500 rows — acceptable. At 5 years × quarterly = 20 rows per company × 500 = 10,000 rows — fine for PostgreSQL. |
| AI token costs at scale | If generating AI summaries for 500 companies + 7 sectors + daily market narrative, monthly API costs could be material. Cache aggressively. |
| `company_intelligence_blocks` at scale | 22 rows × 500 companies = 11,000 rows — trivially handled by PostgreSQL with proper indexing on `(symbol, block_type)`. |

## 13.3 Technical Debt

| Item | Priority | Action Required |
|------|----------|-----------------|
| `components_tmp_StockCard.tsx` in root | Low | Delete — it's a leftover temp file |
| `data/sectors/` legacy folder | Medium | Audit which files are still used vs. superseded by DB |
| Static fallback ts files (HBL, MCB) | Low | Delete once DB seeding validated in all environments |
| Duplicate company data between `constants/` and DB | Medium | Plan deprecation of constants after full DB coverage |
| No error boundary components | Medium | Add React error boundaries to prevent full-page crashes |
| No loading skeleton components | Medium | Required before auth/client features launch |

## 13.4 Hallucination Risks (AI-Specific)

| Risk | Mitigation |
|------|-----------|
| AI inventing financial metrics | NEVER feed AI free-text prompts asking for financial data. Always provide structured DB data as the AI's source material. |
| AI recommending buy/sell | System prompts for all AI features must explicitly prohibit investment advice language. |
| Stale AI summaries served as current | Every AI-generated output must be timestamped. UI must display "Generated on [date]" prominently. Never display AI content > 7 days old without a refresh. |
| AI citing non-PSX data for PSX analysis | AI prompts must be explicitly scoped to PSX context. Use system prompts to constrain market scope. |

## 13.5 Compliance Risks

| Risk | Severity | Notes |
|------|----------|-------|
| Investment advisory without license | HIGH | The platform must not cross from "decision support" to "investment advice" without SECP advisory licensing. Every AI-generated output and every research report must include appropriate disclaimers. |
| Research reports implying guaranteed returns | HIGH | Research reports must carry standard disclaimers. Target prices are analytical estimates, not guarantees. |
| User data handling (KYC) | HIGH (Phase 2) | When account opening / KYC is built, full SECP/PMEX data protection compliance is required. Do not build this without legal review. |
| WhatsApp distribution compliance | Medium | Mass financial communications via WhatsApp may require specific disclaimers under SECP communications rules. Review before scaling. |

## 13.6 Deployment Risks

| Risk | Mitigation |
|------|-----------|
| Vercel environment variables not set | Supabase URL and key must be set in Vercel dashboard, not just in .env.local |
| Build fails on Vercel but passes locally | Always check Vercel deployment log after push. TypeScript clean locally ≠ TypeScript clean on Vercel (edge cases with module resolution). |
| DB migration not applied | SQL migrations run in Supabase dashboard — they do not auto-run with code push. Document migration state. |

## 13.7 Data Integrity Risks

| Risk | Mitigation |
|------|-----------|
| Financial data accuracy | All seeded financial data must be sourced from official PSX filings / audited accounts. Do not use estimated or inferred numbers without labeling. |
| Price data staleness | The market snapshot on companies table is convenience data. Real-time accuracy requires a live data feed — the current state is acceptable for a pre-launch intelligence platform, but not for a trading application. |
| Block count drift | If company_intelligence_blocks are deleted/added without maintaining the standard 22-block structure, components may render incomplete intelligence. Build a validation query: `SELECT symbol, COUNT(*) FROM company_intelligence_blocks GROUP BY symbol`. |

---

---

# SECTION 14 — NEXT ACTION PLAN

## 14.1 How to Transition Away From This Mega-Chat

**Step 1 — Save this document.**
This file is at `C:\ahm-platform\docs\AHM_MASTER_DOCUMENTATION.md`.
Push it to GitHub with: `git add -A && git commit -m "docs: master project documentation v2.0" && git push origin main`

**Step 2 — Create specialized chats immediately.**
Do NOT continue adding new features to this chat. Start the new chats below.

**Step 3 — For each new chat, use this initialization ritual:**
```
Context: AHM Platform — [domain] Chat
Read: C:\ahm-platform\docs\AHM_MASTER_DOCUMENTATION.md (Sections [X, Y, Z])
Current task: [describe specific task]
```

## 14.2 Which Chats to Create First

| Priority | Chat | Why First |
|----------|------|-----------|
| 1 | **FRONTEND CHAT** | Most active development — charts, company pages, screener |
| 2 | **BACKEND CHAT** | Data seeding for more companies, DB macro_data table |
| 3 | **AI ENGINE CHAT** | Wire AIInsightPlaceholder to real Claude API |
| 4 | **AUTOMATION CHAT** | Set up daily price data + AI refresh schedules |

## 14.3 What Documents to Save

| Document | Location | Purpose |
|----------|----------|---------|
| This master doc | `docs/AHM_MASTER_DOCUMENTATION.md` | Primary context for all chats |
| Architecture doc | `docs/architecture/AHM_System_Architecture_Document_v1.md` | Technical reference (already exists) |
| Design system | `docs/design/AHM_Design_System_Document_v1.md` | Design reference (already exists) |
| Component library | `docs/components/AHM_Component_Library_Document_v1.md` | Component reference (already exists) |
| Rules | `docs/rules/AHM_Project_Rules_v1.md` | Quick rules reference (already exists) |
| DB state snapshot | `docs/database/DB_STATE_[date].md` | Create this now — documents what's seeded |

**Recommended immediate action:** Create `docs/database/DB_STATE_MAY_2026.md` documenting exactly which companies, sectors, and blocks are seeded, with row counts. This becomes critical reference for future data engineering chats.

## 14.4 Context Reuse Strategy

**For Frontend Chat — paste this block:**
```
AHM Platform Frontend Context
Stack: Next.js 14 App Router, TypeScript, Tailwind CSS + CSS variables
Theme: bg-base, bg-surface, bg-raised, text-tx-primary, text-tx-secondary, text-tx-disabled, text-gain, text-loss, border-border-theme
Components: See /components/ directory — check before creating new
Services: Import from @/services/api ONLY — never import supabase directly
Types: Import from @/types
Rules: No business logic in components. No direct DB calls. Mobile-responsive (lg: breakpoint for 2-col).
Intelligence block pattern: See components/company/ and components/dashboard/ for established patterns.
```

**For Backend Chat — paste this block:**
```
AHM Platform Backend Context
DB: Supabase PostgreSQL, project: qiunhqgxsjyvcrcnfajl
Service layer: /services/api/ — all functions typed, error-handled
Types: /types/index.ts — single source of truth
Critical SQL rules:
  - ON CONFLICT for all inserts
  - ARRAY[]::text[] for empty arrays
  - company_intelligence_blocks column order: symbol, block_type, sort_order, title, body, content, icon, trend, severity, horizon, signal, metric, current_val, tags, related_symbols, source
  - Validate with tsc --noEmit after every type change
```

## 14.5 How to Maintain Continuity Without Token Overload

**Rule 1 — Start every session with the task, not the history.**
Don't paste old conversation. Paste the relevant documentation sections + current task.

**Rule 2 — End every session with a summary.**
Before the session ends, ask the AI: "Summarize the decisions made and work completed in under 200 words." Save this as a session note.

**Rule 3 — Update this master document after major sprints.**
After every 2-3 sprint sessions, update the relevant sections of this document (specifically Section 9 — Completed Work and Section 10 — Roadmap).

**Rule 4 — DB state is the most important context.**
For backend/data chats, the DB state document is more valuable than conversation history. Always have an up-to-date `DB_STATE.md`.

**Rule 5 — Component list is the most important context for frontend chats.**
Always paste the current component inventory (Section 4.3 of this doc) at the start of frontend sessions. It prevents duplicate component creation.

**Rule 6 — Never start a code-writing session without TypeScript clean.**
Before starting a new sprint in any code-writing chat: run `tsc --noEmit`, confirm clean, then proceed.

---

## 14.6 The Transition Checklist

Before closing this mega-chat:

- [ ] Push `AHM_MASTER_DOCUMENTATION.md` to GitHub
- [ ] Create `docs/database/DB_STATE_MAY_2026.md` with row counts
- [ ] Run `tsc --noEmit` — confirm zero errors
- [ ] Run `git push origin main` — confirm Vercel build success
- [ ] Note current task list state (Section 9/10)
- [ ] Create first specialized chat (Frontend Chat recommended)
- [ ] Paste Section 3.1-3.3 + Section 4 + Section 12.1-12.6 into new Frontend Chat

---

---

*Document generated: May 2026 | AHM Platform v1 — Post-Intelligence Sprint*
*Status: Living document — update after each major sprint*
*Owner: AHM Platform Development Team*

