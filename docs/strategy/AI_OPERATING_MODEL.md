# AHM Platform — AI Operating Model

**Version:** 1.0  
**Date:** May 2026  
**Owner:** AHM Architecture Team  
**Classification:** Internal Strategic Document  
**Review Cycle:** Quarterly  
**Related:** ADR-002 (AI Philosophy), DATA_STRATEGY.md

---

## Executive Summary

AHM's AI operating model is built on a single inversion of the default assumption: **the human analyst is not a bottleneck to be eliminated — they are the quality ceiling to be amplified.**

Every AI feature is designed to scale what analysts produce, not replace what analysts do. The result is an organization that produces institutional-quality intelligence at software scale, with human judgment governing every output that reaches users.

---

## 1. Operating Model: Human + AI, Not AI Instead of Human

### The Correct Hierarchy

```
Human analysts     ← own quality, own decisions
    ↑
AI systems         ← scale throughput, surface patterns, draft narratives
    ↑
Structured data    ← the substrate that constrains and enables AI
```

AI operates within a structure that humans defined and humans validate. The system fails safely — if AI produces a poor output, a human review gate catches it before it reaches users.

### What Humans Own

- Investment thesis origination and validation
- Risk identification and severity assessment
- Catalyst identification and horizon estimation
- Sector intelligence framework design
- Final approval of all AI-generated content that reaches users
- Data source selection and verification
- Exception handling for unusual market conditions

### What AI Handles

- First-draft narrative generation from structured blocks
- Daily market commentary from macro driver readings
- Pattern detection across large structured datasets (e.g., "all companies where 3+ drivers turned negative this month")
- Report structure generation from analyst inputs
- WhatsApp briefing formatting and scheduling
- Screening queries articulated in natural language

---

## 2. Intelligence Generation Workflow

### Company Intelligence Lifecycle

```
Phase 1 — Data Foundation
  Analyst: populates financial_metrics with verified data from PSX filings
  Analyst: populates company_intelligence_blocks with thesis, drivers, risks, catalysts
  System: validates completeness (22 blocks, no missing required fields)

Phase 2 — AI First Draft
  Trigger: new company seeded OR quarterly refresh
  AI: receives all 22 blocks + financial_metrics as context
  AI: generates narrative summary for thesis, drivers, valuation sections
  AI output: stored in ai_summaries table with generation timestamp

Phase 3 — Human Review
  Analyst: reviews AI summary against source blocks
  Analyst: edits for accuracy, tone, PSX-specific context
  Analyst: approves for publication (sets is_active = true)

Phase 4 — Display
  AIInsightCard: renders approved summary with "AI-generated | Reviewed [date]" label
  Stale content (>7 days for dynamic sections, >30 days for thesis) triggers refresh flag
```

### Market Commentary Lifecycle (Daily)

```
0630 PKT — Data Refresh
  System: fetches latest macro_data (SBP rate, PKR, oil)
  System: calculates overnight changes in global indices
  System: pulls latest KSE-100 snapshot

0700 PKT — AI Processing
  AI: receives structured driver readings + market context
  AI: generates 150-word market narrative (what's driving the open)
  AI: generates sector-specific commentary for 2-3 notable sectors
  AI: formats WhatsApp briefing

0730 PKT — Human Review
  Analyst: reviews AI output (5-minute process for correct day)
  Analyst: corrects any errors, adds breaking news context
  Analyst: approves via dashboard action

0800 PKT — Distribution
  System: publishes to MarketIntelligenceSummary on dashboard
  System: sends WhatsApp briefing to subscribers
  System: caches output in ai_summaries with review timestamp
```

---

## 3. AI Feature Inventory

### Phase 3 (Next Phase — AI Activation)

| Feature | AI Role | Human Role | Risk Level |
|---------|---------|-----------|-----------|
| Company intelligence summary | Draft narrative from 22 blocks | Review and approve | Low |
| Daily market commentary | Generate from driver readings | Review before publish | Low |
| "Why did this sector move?" | Explain from event + driver data | Spot check | Medium |
| Research report assistance | Draft structure, fill template | Write, edit, publish | Low |
| WhatsApp briefing | Format and schedule | Approve content | Low |

### Phase 4 (Future — Advanced AI)

| Feature | AI Role | Human Role | Risk Level |
|---------|---------|-----------|-----------|
| Conviction scoring | Aggregate signals into score | Methodology design + audit | Medium |
| Portfolio analysis | Identify concentration, gaps | User interaction | Medium |
| Conversational assistant | Answer PSX questions from DB | Constrained to DB, no general web | Medium |
| Earnings preview | Draft preview from block data | Review | Medium |
| Sector rotation signals | Pattern detection across sectors | Signal design + review | Medium |

### Never (Prohibited)

| Feature | Reason |
|---------|--------|
| Automated investment recommendations | Regulatory and ethical (ADR-005) |
| Price predictions | AI cannot predict markets; liability surface |
| Unsourced financial data generation | Hallucination risk without structured inputs |
| Personalized suitability assessment | Requires advisory license |
| News sentiment from unstructured web | Quality and bias control insufficient |

---

## 4. AI Governance Framework

### Constraint Levels

Every AI feature operates at one of four constraint levels:

**Level 1 — Fully Automated** (Low stakes, reversible, no regulatory exposure)
- Market data formatting
- Number rounding and display
- WhatsApp message structure

**Level 2 — Automated with Spot Check** (Regular outputs, human review weekly)
- Daily market commentary
- Sector brief formatting

**Level 3 — Human Review Before Publish** (Per-output review required)
- Company intelligence summaries
- Research report AI assistance
- Conviction score methodology outputs

**Level 4 — Human Authored, AI Assisted** (AI is a tool, human is the author)
- Research reports
- Strategic sector analysis
- Earnings analysis

No AI output moves to a lower constraint level without a documented decision and monitoring period.

### Mandatory System Prompt Constraints

All AI calls to any model (Claude, OpenAI, or other) that produce user-facing content must include:

```
SYSTEM CONSTRAINTS (embed in every system prompt):

1. You are producing financial intelligence for a Pakistan Stock Exchange platform.
2. You must not issue investment recommendations, buy/sell/hold directives, 
   or suitability assessments under any circumstances.
3. You must not generate price predictions or guarantee future performance.
4. You must only make factual claims that are directly traceable to the 
   structured data provided to you in this context.
5. When uncertainty exists, use conditional framing: "if X materializes," 
   "subject to," "historically has."
6. All analysis is scoped to PSX-listed companies and Pakistan macro context 
   unless explicitly instructed otherwise.
7. Financial figures must include units (PKR billions, %, basis points).
8. Use analyst-appropriate language: NIM, CASA, NPL, ETR, ADR, WACC — 
   do not explain these terms unless asked.
```

### AI Output Audit Trail

Every AI-generated content item must be stored with:
```sql
ai_summaries (
  id              uuid PRIMARY KEY,
  symbol          text,           -- NULL for market-level content
  sector_slug     text,           -- NULL for company-level content
  content_type    text,           -- "company_summary" | "market_commentary" | "sector_brief" | etc.
  model           text,           -- "claude-opus-4-6" | "gpt-4o" | etc.
  model_version   text,
  prompt_hash     text,           -- hash of the prompt template version
  input_data_hash text,           -- hash of the structured data fed to AI
  raw_output      text,           -- original AI output before edits
  edited_output   text,           -- output after analyst review/edit
  reviewer_id     text,           -- who reviewed it
  reviewed_at     timestamptz,
  is_published    boolean,
  generated_at    timestamptz DEFAULT now()
)
```

This audit trail enables:
- Detecting when AI behavior changed (model upgrade effects)
- Identifying systematic errors (all summaries of a certain type have same issue)
- Regulatory audit if ever required
- Measuring human edit distance (how much did analysts change AI output?)

---

## 5. Hallucination Prevention Architecture

Hallucination is not a prompt engineering problem to be solved — it is a structural constraint to be managed.

### Primary Defense: Structured Input Constraints

AI cannot hallucinate data that isn't in its context if it is instructed to cite only provided data. The defense is architectural:

```
What AI receives: 22 structured blocks with specific data points
What AI is told: "make claims only from the data above"
What AI cannot do: invent CASA ratios, NPL figures, or market events not in the input
```

### Secondary Defense: Schema Validation

AI output for structured sections (e.g., conviction score breakdown) must conform to a JSON schema before storage:

```typescript
const convictionScoreSchema = z.object({
  score: z.number().min(0).max(100),
  driver_score: z.number().min(0).max(100),
  risk_score: z.number().min(0).max(100),
  catalyst_score: z.number().min(0).max(100),
  valuation_score: z.number().min(0).max(100),
  methodology_version: z.string(),
  key_factors: z.array(z.string()).max(5),
  disclaimer: z.string()
});
```

If the output fails schema validation, it is not stored or displayed.

### Tertiary Defense: Human Review

Any AI output above Level 1 automation requires human review before reaching users. This is the final defense against confident, schema-valid, but factually incorrect outputs.

---

## 6. AI Orchestration Architecture (Phase 3)

### Planned Orchestration Flow

```
Trigger (scheduled or event-driven)
    ↓
Data fetch from structured DB (typed query functions)
    ↓
Context assembly (select relevant blocks, financial data, macro readings)
    ↓
Prompt construction (template + data + constraints)
    ↓
AI model call (Claude or OpenAI — abstracted behind interface)
    ↓
Output validation (schema check, prohibited language check)
    ↓
Storage (ai_summaries table with full audit trail)
    ↓
Review queue (analyst dashboard)
    ↓
Publication (is_published = true, displayed on platform)
```

### Model Abstraction Layer

The platform must not be tightly coupled to a single AI provider. The planned interface:

```typescript
interface AIProvider {
  generate(prompt: string, context: StructuredContext, options: GenerationOptions): Promise<AIOutput>
}

// Implementations:
class ClaudeProvider implements AIProvider { ... }
class OpenAIProvider implements AIProvider { ... }

// Usage:
const provider = config.aiProvider === 'claude' ? new ClaudeProvider() : new OpenAIProvider();
const output = await provider.generate(prompt, context, options);
```

This enables:
- A/B testing between models
- Fallback if one provider has an outage
- Cost optimization by routing different content types to different models

---

## 7. Long-Term AI Scaling Vision

### Near Term (Phase 3): Analyst Augmentation
- AI drafts, humans approve
- 10x throughput increase for intelligence content production
- Coverage expansion from 4 companies to 50+ without proportional headcount

### Medium Term (Phase 4): Intelligent Monitoring
- Automated alerts when company driver profiles change materially
- Scheduled conviction score refreshes
- "Analyst brief" — morning summary of what changed overnight in the structured database

### Long Term (Phase 5): Platform Intelligence Layer
- Conversational assistant with DB-constrained knowledge
- Personalized intelligence feeds based on user portfolio
- Cross-company pattern detection at scale
- Potential: API product selling AI-interpreted PSX intelligence to institutional clients

---

*AI_OPERATING_MODEL.md | Version 1.0 | May 2026 | Review quarterly*
