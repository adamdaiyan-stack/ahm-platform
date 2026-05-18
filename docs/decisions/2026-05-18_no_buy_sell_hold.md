# ADR-005: No Platform-Level Buy/Sell/Hold Recommendations

**Date:** 2026-05-18  
**Status:** Accepted  
**Author:** AHM Architecture Team  
**Supersedes:** None  
**Related:** ADR-001 (Platform Positioning), ADR-002 (AI Philosophy)

---

## Context

The most common expectation users bring to a financial platform is: "tell me what to buy." This is the dominant mental model of retail financial media — stock tips, buy/sell signals, analyst ratings, target prices with explicit directional guidance.

Building a platform that meets this expectation is straightforward. Building a platform that deliberately does not meet this expectation — and creates more value through that refusal — requires a principled, documented decision.

This ADR establishes why AHM Platform does not issue platform-level buy/sell/hold recommendations, and how this shapes product, AI, and content decisions.

---

## Problem

Issuing platform-level investment recommendations creates multiple compounding problems:

### Regulatory Problem
Pakistan's SECP requires licensing for entities providing personalized investment advice. "Investment adviser" registration under the Securities Act carries compliance obligations — disclosures, conflict of interest management, suitability assessments, recordkeeping — that a digital platform cannot casually absorb.

Platforms that issue recommendations without this licensing operate in regulatory grey areas. At scale, this creates enforcement risk. More importantly, it creates the wrong product if AHM's competitive advantage is intelligence quality, not tip volume.

### Trust Problem
Investment tip platforms lose credibility when recommendations fail. All recommendations fail sometimes — market conditions change, theses are wrong, black swans occur. A platform whose value proposition is "we tell you what to buy" is only as credible as its last correct call.

Intelligence platforms operate on a different trust model: "we gave you the best available structured analysis; your decision was informed." This relationship survives bad market outcomes because the failure mode is different — the data was honest, the analysis was sound, the market did something unexpected.

### AI Governance Problem
Asking AI to generate investment recommendations is the highest-risk AI use case in financial services. A recommendation carries an implied guarantee that intelligence does not. When AI generates a recommendation that loses money, the liability question is unambiguous. When AI generates intelligence that a user uses to make an informed decision, the accountability structure is different.

By prohibiting recommendation language in AI outputs at the architecture level, the platform eliminates this liability surface.

### Differentiation Problem
Every broker in Pakistan offers stock tips via WhatsApp. The tip market is saturated and commoditized. The intelligence market — structured, contextual, institutional-quality analysis — is empty.

Competing on tips means competing on last week's performance against dozens of established voices. Competing on intelligence means building a category that nobody else in Pakistan has attempted.

---

## Decision

**AHM Platform does not issue platform-level buy/sell/hold recommendations.**

This applies to:
- All UI copy on company and sector intelligence pages
- All AI-generated summaries and insights
- All dashboard intelligence panels
- All automated market commentary
- All WhatsApp broadcast content

**Exceptions (permitted with explicit disclosure):**
- Research reports authored by named, licensed analysts may carry analyst ratings (BUY/HOLD/SELL) as disclosed analyst opinions, with standard disclaimers
- Conviction scoring, when built, is framed as analytical signal with methodology disclosure — not as a recommendation

---

## What "No Recommendation" Means in Practice

### Language That Is Prohibited
- "You should buy [X]"
- "[X] is a buy"
- "We recommend [X]"
- "Accumulate [X] at current prices"
- "[X] is a strong buy"
- "Exit [X] before the results"
- "Consider trimming [X]"

### Language That Is Permitted
- "[X]'s combination of CASA leadership and cost efficiency supports premium valuation"
- "Near-term catalyst: Federal Budget ETR relief would be ~12-14% EPS-accretive"
- "Key risk: NIM compression through the rate-cut cycle is the primary earnings headwind"
- "Valuation signal: current P/E is at the lower end of the historical 4-10x range"
- "Driver to watch: CASA ratio trajectory — any sustained decline below 65% would signal moat erosion"

The permitted language conveys structured analytical context. The reader can assess whether it supports their own buy/sell/hold decision — AHM does not make that assessment for them.

### Conviction Scoring (Future Feature)
When conviction scoring is built, the correct framing is:

```
Conviction Score: 78/100 (High)
Methodology: Aggregated driver trends, risk severity, catalyst proximity, valuation signal
Interpretation: High conviction = strong alignment between thesis, current drivers, and valuation
This score is an analytical tool, not an investment recommendation.
```

Not:
```
Strong Buy  ←— THIS IS PROHIBITED AT PLATFORM LEVEL
```

---

## How This Shapes Architecture

### Component Architecture
No component in the platform UI renders "BUY," "SELL," or "HOLD" at the platform level. The `signal` field in `company_intelligence_blocks` for valuation points uses: `cheap | fair | rich` — these are valuation descriptors, not recommendations.

### AI Prompt Architecture
All AI prompt templates for the platform include this constraint in the system prompt:

```
You are an intelligence analyst for a financial data platform. Your outputs are 
intelligence summaries, not investment recommendations. You must not:
- Use language that tells users to buy, sell, or hold any security
- Generate price predictions
- Issue suitability assessments
- Make guarantees about future performance

You must:
- Describe what the data shows
- Explain drivers, risks, and catalysts
- Use conditional framing where uncertainty exists ("if X materializes...")
- Cite specific structured data points provided to you
```

### Research Report Architecture
Research reports authored by licensed analysts may carry analyst ratings. These are explicitly labeled as "analyst opinion" with standard SECP-compliant disclaimers, not as "platform recommendation." The technical distinction is implemented in the `research_reports` schema:

```sql
rating text,  -- "BUY"|"HOLD"|"SELL"|"UNDER REVIEW" — analyst opinion field
-- No "platform_recommendation" field exists — by design
```

---

## Tradeoffs

| Benefit | Cost |
|---------|------|
| Regulatory defensibility | Some retail users expect and prefer explicit recommendations |
| Sustainable trust model | Value proposition requires more user education |
| AI governance simplification | AI prompts require explicit constraint enforcement |
| Category differentiation | Slower initial engagement from tip-seeking users |
| Long-term brand integrity | Short-term appeal to retail tip audience is sacrificed |

---

## Consequences

### Immediate
- Copywriting guidelines must explicitly prohibit recommendation language
- AI prompt templates must be version-controlled with this constraint embedded
- Research report disclaimers must be reviewed by legal before publication

### Medium-Term
- User education content ("how to use intelligence to make decisions") becomes a product priority
- The intelligence framework (thesis → drivers → risks → catalysts → valuation) needs to be explained to users
- WhatsApp content guidelines must specify intelligence framing, not recommendation framing

### Long-Term
- If AHM obtains investment advisory licensing, a recommendation layer can be added on top of the intelligence foundation
- The no-recommendation constraint becomes a trust differentiator as AI-powered tip platforms proliferate and face regulatory scrutiny
- Intelligence-first positioning creates durable institutional credibility that tip-based platforms cannot achieve

---

## Monitoring

The following signals indicate this ADR is being violated:

- User research or support tickets indicating users believe the platform "recommends" stocks
- AI outputs containing "buy," "sell," "recommend," or "you should" language
- Marketing copy that implies guaranteed returns or directional calls
- Platform UI copy that states or implies a directional recommendation

If any of these signals emerge, the ADR is not being upheld and remediation is required before feature scaling.

---

*ADR-005 | Accepted | May 2026 | Review if advisory licensing is obtained or product strategy pivots*
