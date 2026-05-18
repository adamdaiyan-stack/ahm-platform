# ADR-002: AI Philosophy — Structured Data as Primary, AI as Interpreter

**Date:** 2026-05-18  
**Status:** Accepted  
**Author:** AHM Architecture Team  
**Supersedes:** None  
**Related:** ADR-001 (Platform Positioning), ADR-003 (DB-First Architecture)

---

## Context

AHM Platform is being built in an era of widespread AI enthusiasm. The default approach for AI-adjacent products is to treat AI as the primary capability — generating content, answering questions, producing analysis from minimal structured inputs.

This approach fails for financial intelligence platforms in several ways:
- AI systems hallucinate financial data with high confidence
- AI-generated financial analysis is difficult to audit or trace
- AI without structured inputs produces generic, not proprietary, intelligence
- A platform whose value comes primarily from AI is immediately replicable by anyone with API access

A deliberate, contrarian AI philosophy is required — one that inverts the typical assumption and treats AI as a tool in service of a structured data moat, not as the moat itself.

---

## Problem

Without a clear AI philosophy, the platform risks:

1. **Hallucinated fundamentals** — AI inventing financial metrics, earnings figures, or market data
2. **Unauditable outputs** — AI intelligence that cannot be traced to a source data point
3. **Commoditized value proposition** — "We use AI" is not a competitive advantage in 2026
4. **Regulatory exposure** — AI-generated investment commentary without human review
5. **Reputational risk** — Confidently wrong AI outputs in a financial context damage trust permanently
6. **Architecture lock-in** — Building AI as the primary layer makes the system brittle if AI capabilities degrade or change

---

## Decision

**AHM Platform's AI philosophy: AI is the interpreter of structured data, not the source of intelligence.**

This means the architecture is:

```
Structured Data (DB) → AI Processing → Interpreted Intelligence Output
```

NOT:

```
User Query → AI → Financial Intelligence Output
```

Concretely:
1. **No AI call reads from external web scraping or raw text as primary source** for financial claims
2. **All AI prompts receive structured, schema-validated DB data** as their input context
3. **AI outputs are explicitly scoped** — they interpret provided data, they do not generate primary analysis
4. **AI outputs are cached and versioned** — not regenerated on every request
5. **Human review gates apply** to all AI content that reaches users
6. **AI is never the last line of defense** — the structured data must be correct independently of AI interpretation

---

## Reasoning

### 1. The Data Moat Principle

In competitive intelligence markets, the moat is the data, not the AI. OpenAI, Anthropic, and Google all provide access to frontier AI. Nobody else has AHM's structured, normalized, PSX-specific intelligence database.

If AHM builds AI on top of proprietary structured data, the competitive advantage compounds with every new company, sector, and data point added to the database. If AHM builds AI on top of generic public data, it has no sustainable advantage.

**The proprietary data layer is the business. AI is the presentation layer.**

### 2. Hallucination Prevention Through Structural Constraints

Large language models hallucinate financial data with high confidence. This is not a solvable problem — it is a fundamental property of autoregressive models. The correct engineering response is structural constraint, not better prompting.

By passing structured DB records (e.g., all 22 `company_intelligence_blocks` for a company) as the AI's context, the platform eliminates the hallucination surface for core financial facts. The AI interprets — it does not invent.

This is how Bloomberg and Capital IQ use AI: as interpreters of their normalized data, not as generators of primary financial data.

### 3. Auditability and Governance

When an AI output can be traced to specific structured input records, it can be audited. If an AI summary says "MCB's CASA ratio is 68%," that can be verified against the DB row. If the DB row is wrong, it can be corrected and the AI output regenerated.

Unstructured AI outputs are not auditable. They become a liability in a regulated financial context.

### 4. Operational AI vs. Generative AI

The platform's AI use cases fall into two categories:

**Operational AI** (high priority, lower risk):
- Summarizing structured intelligence blocks into narrative
- Generating daily market commentary from driver readings
- Explaining "why this sector moved" from structured macro data
- Formatting research templates from structured financial data

**Generative AI** (lower priority, higher risk):
- Primary financial analysis from unstructured sources
- Investment recommendations
- Price target generation without model inputs
- Sentiment analysis from raw news text

Operational AI is heavily prioritized. Generative AI features require additional governance infrastructure before deployment.

### 5. Human + AI Collaboration Model

AI does not replace analysts — it scales their work. The correct operating model is:

```
Analyst identifies/validates intelligence → Structured DB entry
DB entry → AI generates first-draft narrative
Analyst reviews/edits narrative → Published output
```

This hybrid model produces better outputs than either pure AI or pure human generation, while maintaining quality control and regulatory defensibility.

---

## AI Governance Framework

### Constraint Levels

| Feature Type | AI Autonomy | Human Review Required |
|-------------|-------------|----------------------|
| Market summary (daily) | High — auto-publish | Spot check weekly |
| Company intelligence summary | Medium — auto-draft | Analyst review before publish |
| Research report generation | Low — AI assists, human writes | Full analyst review |
| Personalized advice | None — not permitted | N/A — prohibited |
| Price predictions | None — not permitted | N/A — prohibited |

### Mandatory Prompt Constraints

All AI prompts for the platform must include:
1. Explicit prohibition on investment recommendations
2. Explicit prohibition on price predictions
3. Instructions to cite provided structured data
4. Instructions to acknowledge uncertainty where present
5. PSX market scope constraints (do not reference non-PSX markets without explicit data)

### AI Output Validation

Before any AI output reaches production:
1. **Schema validation** — does the output conform to expected format?
2. **Data citation check** — can key claims be traced to input data?
3. **Prohibited language check** — does the output contain advisory/recommendation language?
4. **Freshness check** — is the source data current enough to support the claim?

---

## Tradeoffs

| Benefit | Cost |
|---------|------|
| Auditable, governable AI outputs | Requires rich structured data before AI adds value |
| Hallucination containment | AI cannot fill gaps where structured data is missing |
| Proprietary competitive moat | Data infrastructure investment is significant |
| Regulatory defensibility | More complex architecture than direct AI generation |
| Scalable quality | Human review bottleneck until workflows are established |

---

## Consequences

### Immediate
- `AIInsightPlaceholder` components exist throughout the UI — they are correctly placed but must wait for AI integration
- The AI integration sprint prioritizes connecting Claude/OpenAI to existing structured DB data, not building new data sources
- All AI prompt templates must be version-controlled alongside the codebase

### Medium-Term
- Every company seeded into `company_intelligence` + `company_intelligence_blocks` immediately unlocks AI summary capability
- AI content refresh pipeline must be built before AI summaries are shown to users
- `ai_summaries` table in DB must cache outputs with generation timestamp

### Long-Term
- As the structured database scales to 500+ companies, AI's value scales linearly
- The data+AI architecture becomes extremely difficult to replicate quickly
- Potential to license AI-interpreted intelligence as a B2B product

---

## Future Implications

This ADR should be revisited when:
- Retrieval Augmented Generation (RAG) from document stores is evaluated
- Real-time sentiment analysis from news feeds is proposed
- AI-generated research (without structured input) is considered
- A conversational assistant feature is built

In each case, the question to ask is: "What structured data is the AI interpreting?" If the answer is "it's reading raw text," additional governance is required.

---

*ADR-002 | Accepted | May 2026 | Review when adding generative AI features without structured inputs*
