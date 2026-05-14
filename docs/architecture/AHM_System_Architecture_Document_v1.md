```
AHM PLATFORM — SYSTEM ARCHITECTURE DOCUMENT
Version 1.0
Financial Intelligence Operating System

1. PLATFORM VISION

Mission
Build Pakistan’s leading financial intelligence and brokerage operating system
that combines:
- brokerage operations
- investment intelligence
- AI-powered research
- portfolio management
- market analytics
- client onboarding
- institutional-grade infrastructure

The platform should eventually serve:
- retail investors
- premium investors
- institutional clients
- analysts
- internal operations teams

2. CORE ARCHITECTURE PHILOSOPHY

PRIMARY PRINCIPLE
The platform is:
“data-first, intelligence-driven, frontend-simplified.”

The system must prioritize:
1. structured backend architecture
2. reusable systems
3. scalability
4. modularity
5. role-based visibility
6. AI readiness

Frontend simplicity should NOT reduce backend richness.

3. SYSTEM LAYERS

The platform consists of 6 major layers:

- Data Layer — Storage of all structured data
- API Layer — Unified data access
- Brokerage Layer — Client operations & holdings
- Research Layer — Market intelligence
- AI Layer — Summaries, chatbot, insights
- Experience Layer — Frontend dashboards/UI

4. HIGH-LEVEL SYSTEM FLOW

External Data Sources
↓
Data Ingestion Pipelines
↓
Data Normalization Layer
↓
PostgreSQL Database
↓
Backend APIs / Services
↓

```

```
AI Processing Layer
↓
Frontend Applications
↓
Role-Based User Experience

5. PRIMARY TECHNOLOGY STACK

Frontend
- Next.js
- TailwindCSS
- ShadCN
- Zustand
- TanStack Query

Backend
- Node.js
- Prisma
- PostgreSQL
- Redis

AI Layer
- OpenAI APIs
- Claude APIs
- Vector Database (future)

6. FRONTEND ARCHITECTURE

CORE PRINCIPLE
Frontend must:
- consume APIs only
- never contain business logic
- never contain market calculation logic
- remain modular and reusable

7. FOLDER STRUCTURE

src/
│
├── app/
│  ├── dashboard/
│  ├── market/
│  ├── sectors/
│  ├── research/
│  ├── portfolio/
│  ├── onboarding/
│  ├── admin/
│  └── api/
│
├── components/
│  ├── ui/
│  ├── charts/
│  ├── tables/
│  ├── cards/
│  ├── layouts/
│  ├── forms/
│  └── shared/
│
├── services/
│  ├── api/
│  ├── market/
│  ├── auth/
│  ├── portfolio/
│  └── research/

```

```
│
├── hooks/
├── store/
├── lib/
├── types/
├── constants/
├── styles/
└── docs/

8. NON-NEGOTIABLE FRONTEND RULES

- No duplicated components
- All tables must use shared table system
- All charts must use shared chart wrappers
- No hardcoded market/business logic in components
- No direct API calls inside UI components
- No new UI patterns without standardization
- Every page must have loading, error, and empty states

9. BACKEND ARCHITECTURE

CORE PRINCIPLE
Backend owns:
- business logic
- calculations
- permissions
- data normalization
- AI orchestration

Frontend only displays processed data.

10. DATABASE ARCHITECTURE

PRIMARY DATABASE
PostgreSQL

Must support:
- scalability
- analytics
- AI integration
- structured querying

11. CORE DATA DOMAINS

MARKET DOMAIN
- stocks
- sectors
- indices
- historical_prices
- announcements
- corporate_actions
- dividends
- market_summary
- volume_statistics

USER DOMAIN
- users
- profiles
- permissions
- sessions
- KYC_documents
- onboarding_status

PORTFOLIO DOMAIN

```

```
- holdings
- transactions
- realized_pnl
- unrealized_pnl
- cash_ledger
- watchlists
- alerts

RESEARCH DOMAIN
- research_reports
- sector_reports
- AI_summaries
- market_commentary
- macro_data
- sentiment_data

12. API ARCHITECTURE

All frontend communication must go through:
/services/api

API STRUCTURE
/api
/market
/sectors
/research
/portfolio
/users
/auth
/alerts

13. AUTHENTICATION ARCHITECTURE

REQUIRED FEATURES
- JWT authentication
- MFA support
- session handling
- refresh token system
- device tracking
- secure cookie storage

14. PERMISSION ARCHITECTURE

ROLE-BASED ACCESS CONTROL (RBAC)

Roles:
- Guest
- Retail Client
- Premium Client
- Institutional Client
- Analyst
- Admin

15. DATA INGESTION ARCHITECTURE

INGESTION FLOW

External Source
↓
Raw Fetch Layer
↓
Validation Layer
↓
Normalization Layer

```

```
↓
Database Storage
↓
Caching Layer
↓
Frontend/API Consumption

16. CACHING STRATEGY

REDIS USAGE
Redis should cache:
- market summaries
- frequently accessed data
- watchlists
- AI summaries
- session data

17. AI ARCHITECTURE

CORE PRINCIPLE
AI must NEVER directly read frontend UI.

AI only accesses:
- structured APIs
- normalized datasets
- approved research sources

AI RESPONSIBILITIES
- market summaries
- sector commentary
- earnings summaries
- conversational assistant
- portfolio analysis
- intelligent alerts
- predictive analytics
- report generation

18. UI/UX ARCHITECTURE PRINCIPLES

- Progressive disclosure
- Intelligence over raw data
- Every page must provide actionable insight
- Frontend simplicity, backend richness

19. PAGE PURPOSE DEFINITIONS

- Dashboard — High-level overview
- Market — Market-wide activity
- Sectors — Sector rotation/intelligence
- Research — Reports & AI insights
- Portfolio — User holdings
- Watchlist — Personalized tracking
- Onboarding — Client acquisition
- Admin — Internal management

20. PERFORMANCE STANDARDS

REQUIRED
- lazy loading
- server-side rendering where appropriate
- pagination
- optimized queries
- caching
- minimal unnecessary rerenders

```

```
21. SECURITY PRINCIPLES

REQUIRED
- encrypted sensitive data
- secure auth handling
- API validation
- RBAC enforcement
- audit logging
- rate limiting
- server-side validation

22. SCALABILITY PRINCIPLES

The platform must support future:
- mobile apps
- real-time feeds
- AI copilots
- institutional tools
- multi-region deployment
- advanced analytics

23. NON-NEGOTIABLE ENGINEERING RULES

- No feature development without architecture alignment
- No duplicated business logic
- No frontend-owned calculations
- No inconsistent component systems
- Every new feature must fit existing architecture

24. CURRENT DEVELOPMENT PRIORITIES

ACTIVE PHASE
PHASE 1 — FOUNDATION STABILIZATION

CURRENT PRIORITIES
1. Information architecture cleanup
2. Component standardization
3. Backend schema stabilization
4. Permission system setup
5. Navigation cleanup
6. Sectors page refactor

CURRENT NON-PRIORITIES
- advanced AI assistant
- predictive analytics
- over-personalization
- excessive feature expansion

25. FINAL PLATFORM OBJECTIVE

The long-term objective is to create:
“Pakistan’s first true financial intelligence operating system.”

The platform should combine:
- brokerage execution
- portfolio management
- AI-powered intelligence
- institutional-grade analytics
- retail simplicity
- scalable infrastructure

into one unified ecosystem.

```

