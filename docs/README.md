# AHM Platform — Documentation System

**Version:** 1.0  
**Established:** May 2026  
**Owner:** AHM Platform Architecture Team

---

## Purpose

This documentation system is the institutional memory of the AHM Platform. It serves three audiences simultaneously:

1. **Human engineers and analysts** — onboarding, decision context, operational reference
2. **AI development assistants** — context initialization for new sessions, architecture constraints
3. **Future contributors** — understanding why things are the way they are, not just what they are

The documents here are not decorative. Every file must earn its place by answering a question that would otherwise require reading thousands of lines of code or conversation history.

---

## Folder Structure

```
docs/
│
├── README.md                          ← This file — index and standards
│
├── AHM_MASTER_DOCUMENTATION.md       ← Monolithic reference (14-section overview)
│                                        Use for AI chat initialization
│
├── decisions/                         ← Architectural Decision Records (ADRs)
│   └── YYYY-MM-DD_decision_name.md
│
├── database/                          ← Database state snapshots
│   └── DB_STATE_[MONTH_YEAR].md
│
├── strategy/                          ← Long-horizon strategic frameworks
│   ├── DATA_STRATEGY.md
│   ├── AI_OPERATING_MODEL.md
│   ├── BROKERAGE_TRANSFORMATION_PLAN.md
│   └── MONETIZATION_ROADMAP.md
│
├── progress/                          ← Sprint logs and session continuity
│   ├── README.md                      ← Logging standards
│   └── SPRINT_[n]_[topic].md
│
├── architecture/                      ← System architecture (v1 legacy)
├── components/                        ← Component library reference (v1 legacy)
├── design/                            ← Design system reference (v1 legacy)
├── products/                          ← Product roadmap (v1 legacy)
├── rules/                             ← Coding rules reference (v1 legacy)
└── sectors/                           ← Sector framework templates
```

---

## Document Categories

### `/decisions/` — Architectural Decision Records

ADRs capture **why** a major decision was made, not just what was decided. They are permanent records — once written, they are amended, not deleted.

**When to write an ADR:**
- A technology, pattern, or approach was chosen over a concrete alternative
- A product or regulatory constraint shapes the system design
- A decision will be hard to reverse and carries long-term consequences
- A future team member would reasonably ask "why is it done this way?"

**ADR Naming:** `YYYY-MM-DD_short_description.md`  
**ADR Status field values:** `Accepted` | `Superseded` | `Deprecated` | `Proposed`

---

### `/database/` — Database State Snapshots

Point-in-time snapshots of database structure and seeded data. These are the most operationally critical documents — they tell AI assistants and engineers exactly what data exists without needing to query the live database.

**When to update:**
- After any migration that adds/removes tables or columns
- After any major seeding sprint (new companies, sectors, blocks)
- Monthly at minimum during active development

**Naming:** `DB_STATE_[MONTH_YEAR].md`  
**Do not delete old snapshots** — they serve as migration history.

---

### `/strategy/` — Strategic Frameworks

Living documents that define the long-horizon direction for major domains: data, AI, brokerage operations, monetization. These are updated quarterly or when direction materially changes.

**What belongs here:** Direction, rationale, phased plans, non-obvious constraints  
**What does NOT belong here:** Sprint tasks, implementation details, code snippets

---

### `/progress/` — Sprint Logs

Timestamped session logs that allow any future AI chat to reconstruct the current state of development without re-reading thousands of tokens of conversation history.

**Required per sprint:** What was built, what was decided, what is pending, what changed

---

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| ADRs | `YYYY-MM-DD_snake_case.md` | `2026-05-18_db_first_architecture.md` |
| DB snapshots | `DB_STATE_MON_YYYY.md` | `DB_STATE_MAY_2026.md` |
| Sprint logs | `SPRINT_NNN_topic.md` | `SPRINT_001_market_dashboard.md` |
| Strategy docs | `SCREAMING_SNAKE_CASE.md` | `DATA_STRATEGY.md` |
| All files | Lowercase + underscores (except strategy) | — |

---

## Versioning Standards

Documents follow one of two versioning models:

**Living documents** (strategy, database state, master documentation):  
- Update in-place with a changelog section at the bottom  
- Increment version number in the header  
- Note major changes in the changelog

**Immutable records** (ADRs, sprint logs):  
- Never edited after acceptance  
- If a decision changes, write a new ADR that references and supersedes the original  
- Sprint logs are sealed when the sprint ends

---

## Update Workflow

```
1. BEFORE starting a sprint:
   Read relevant sections of /docs — do not rely on memory alone.

2. DURING a sprint:
   Note decisions and discoveries that warrant documentation.

3. AFTER a sprint:
   a. Write/update sprint log in /progress/
   b. Write new ADRs if architectural decisions were made
   c. Update DB_STATE if schema or seeding changed
   d. Update AHM_MASTER_DOCUMENTATION.md Section 9/10 if feature status changed

4. MONTHLY:
   a. Review strategy docs — are they still accurate?
   b. Archive superseded ADRs
   c. Create new DB_STATE snapshot
```

---

## How AI Assistants Should Use This System

When initializing a new AI development chat, paste the following pattern:

```
CONTEXT INITIALIZATION — AHM Platform [Domain] Chat

Read the following before proceeding:
1. /docs/AHM_MASTER_DOCUMENTATION.md — Sections [X, Y, Z]
2. /docs/decisions/ — [relevant ADR filenames]
3. /docs/database/DB_STATE_MAY_2026.md — [if touching data]
4. /docs/progress/ — [last 2 sprint logs]

Current task: [specific task description]
```

**Never start a coding session by pasting raw conversation history.** Structured documentation is always more token-efficient and more reliable than conversation reconstruction.

---

## Documentation Quality Standards

Every document must meet these standards:

- **Specific over general.** "MCB's CASA ratio is 68%" not "MCB has strong deposits"
- **Reasoned over stated.** Explain why, not just what
- **Actionable.** A reader should be able to do something with the information
- **Dated.** All documents have a clear creation and last-updated date
- **Scoped.** Each document has a clear purpose and stays within it

Documents that fail these standards should be rewritten or removed. Documentation debt is as damaging as technical debt.

---

## Documentation Ownership

| Category | Primary Owner | Review Trigger |
|----------|--------------|----------------|
| ADRs | Architect/CTO | Any major system change |
| Database State | Backend Lead | Any migration or seed sprint |
| Strategy | CTO / Product Lead | Quarterly or material direction change |
| Progress Logs | Session engineer | End of every development sprint |
| Master Documentation | CTO | Monthly or after major sprints |

---

*Last updated: May 2026 | AHM Platform v1 — Documentation System Initialization*
