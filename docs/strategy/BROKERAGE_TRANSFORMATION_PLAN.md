# AHM Platform — Brokerage Transformation Plan

**Version:** 1.0  
**Date:** May 2026  
**Owner:** AHM Architecture Team / Operations Lead  
**Classification:** Internal Strategic Document  
**Review Cycle:** Quarterly

---

## Executive Summary

AHM Securities operates as a traditional PSX brokerage — client relationships are managed through phone calls and WhatsApp, account opening is paper-based, portfolio reporting is manual, and research is distributed as PDF attachments. This document defines the transformation roadmap from manual operations to a digitally-native brokerage operating system.

The transformation is not a technology deployment — it is a fundamental redesign of how AHM Securities operates, with technology as the enabler.

---

## 1. Current State Diagnosis

### What Exists Today

| Operational Area | Current State | Limitation |
|----------------|--------------|-----------|
| Client communication | WhatsApp + phone | No structure, no logging, no CRM |
| Account opening | Paper KYC, manual processing | Days-to-weeks, error-prone |
| Portfolio reporting | Manual statement generation | Low frequency, backward-looking |
| Research distribution | PDF via WhatsApp/email | No engagement tracking, no personalization |
| Order management | Phone/WhatsApp instructions | No audit trail automation |
| Client intelligence | None | Cannot segment or target clients |
| Operations workflow | Manual spreadsheets | No automation, no escalation logic |

### What This Costs

- **Time:** Operations staff spend hours on tasks that should take minutes
- **Quality:** Manual processes create errors and inconsistency
- **Scale:** Growth requires proportional headcount increases
- **Insight:** No data on client behavior means no intelligence for operations
- **Trust:** Professional clients expect digital infrastructure, not WhatsApp

---

## 2. Transformation Philosophy

### The Right Sequence

Transformation must happen in the correct sequence. Automating a broken process makes it fail faster, not better.

```
Step 1: Digitize — make existing processes digital before automating them
Step 2: Standardize — once digital, enforce consistent process
Step 3: Automate — once standardized, automate the repetitive
Step 4: Intelligize — once automated, apply AI to generate insight
```

Do not skip steps. Attempting AI-driven client intelligence before basic CRM exists will produce nothing.

### What to Protect

Not everything should be automated. Some human touchpoints have strategic value:

- Senior analyst calls for institutional clients → preserve
- Relationship manager check-ins for HNW clients → preserve
- Complex investment discussions → preserve
- Exception handling for non-standard situations → preserve

Automation should eliminate repetitive, low-value tasks to free capacity for these high-value interactions.

---

## 3. Phase 2: Client Operating Platform (Current Priority)

### 3.1 Digital Account Opening

**Current:** Paper-based, 3-7 days, requires branch visit  
**Target:** Digital, 24-hour, mobile-enabled

```
Digital Account Opening Flow:
  Step 1 — Identity verification
    CNIC scan + liveness check (OCR + ML)
    NADRA verification API integration
  
  Step 2 — KYC collection
    Income source declaration
    PEP/sanctions screening
    Risk tolerance questionnaire
  
  Step 3 — Document submission
    Digital signature
    Bank account verification
    Selfie with CNIC
  
  Step 4 — Compliance review
    Automated pre-screening
    Compliance officer review queue
    Approval/rejection notification
  
  Step 5 — Account activation
    CDC sub-account creation
    Login credential delivery
    Welcome onboarding sequence

Database tables required:
  kyc_documents — document storage with status
  onboarding_applications — application state machine
  compliance_reviews — reviewer notes and decisions
```

**Integration dependencies:** NADRA API, CDC API, banking partner for payment

### 3.2 Portfolio Dashboard

**Current:** Manual statements, no real-time visibility  
**Target:** Real-time portfolio view with P&L, allocation, history

```
Portfolio Dashboard features:
  Holdings view
    → Quantity, average cost, current price, unrealized P&L
    → Allocation by sector, asset class
    → Cost basis history per position
  
  Transaction history
    → All buys, sells, dividends, corporate actions
    → Exportable for tax purposes
  
  Performance analysis
    → Portfolio vs. KSE-100 comparison
    → Sector exposure analysis
    → Dividend income tracking
  
  Watchlist
    → User-saved stocks with price alerts
    → Linked to intelligence pages for context

Database tables required:
  portfolios — master portfolio per client
  holdings — current positions
  transactions — full trade history
  cash_ledger — PKR cash movements
  alerts — price and event notifications
```

### 3.3 WhatsApp Operations Automation

WhatsApp is the primary client communication channel for Pakistani investors and must be treated as first-class infrastructure, not an afterthought.

**Current:** Ad-hoc manual messaging  
**Target:** Structured, automated, personalized WhatsApp operations

```
Automated WhatsApp workflows:
  
  Daily Market Briefing (0800 PKT)
    → Pre-market intelligence briefing
    → PSX Morning Dashboard output
    → Personalized if portfolio data available
  
  Portfolio Alerts (real-time)
    → Price alerts (user-configured)
    → Dividend announcement alerts
    → Result announcement alerts for held stocks
  
  Account Notifications
    → Trade confirmation (automated)
    → Funds transfer notifications
    → Statement delivery
  
  Research Distribution
    → New research report notifications
    → Sector intelligence updates
    → Earnings preview notifications

Technology: WhatsApp Business API
Integration: Must be connected to the main platform database
Personalization: For authenticated clients, content is portfolio-aware
```

---

## 4. Phase 3: Operations Intelligence

### 4.1 Client Intelligence Dashboard

**For operations and relationship managers, not for clients.**

```
Internal client intelligence features:
  
  Portfolio exposure analytics
    → Sector concentration across client base
    → Risk exposure by client segment
    → Revenue analysis per account
  
  Client behavior patterns
    → Login frequency, feature usage
    → Research consumption patterns
    → Trading frequency and ticket sizes
  
  Compliance monitoring
    → Unusual trading patterns
    → Alert thresholds for regulatory reporting
    → Audit trail access
  
  Relationship management
    → Client tier classification (retail/premium/HNW)
    → Last interaction tracking
    → Upcoming catalyst calendar per client portfolio
```

### 4.2 Operations Automation

```
Automated operations workflows:
  
  End of day processing
    → Portfolio valuation update (from daily_prices)
    → Unrealized P&L recalculation
    → Client statement generation
  
  Corporate action processing
    → Dividend detection from PSX announcements
    → Automated entitlement calculation
    → Cash ledger credit
  
  Compliance automation
    → Trade confirmations logged
    → Suspicious activity pattern detection
    → Regulatory report generation (monthly/quarterly)
  
  Client communication automation
    → Inactivity alerts (client hasn't logged in for X days)
    → Margin call notifications (if margin financing built)
    → Document expiry reminders (KYC renewal)
```

---

## 5. Phase 4: AI-Enhanced Brokerage

### 5.1 AI Client Service

```
Client-facing AI (constrained):
  
  "Why is my portfolio down?"
    → AI analyzes holdings vs. today's market movements
    → Identifies which positions drove P&L
    → Links to relevant intelligence pages
  
  "What's happening in banking?"
    → AI summarizes latest sector intelligence
    → Links to full sector page
    → No investment advice framing
  
  "Show me MCB research"
    → Routes to MCB intelligence page
    → Surfaces latest AI summary and analyst research
```

### 5.2 AI Operations Assistance

```
Internal AI tools:
  
  Research drafting assistant
    → Analyst inputs key findings
    → AI generates report structure
    → Analyst reviews, edits, publishes
  
  Client briefing generator
    → RM inputs client portfolio + context
    → AI generates personalized portfolio brief
    → RM reviews before sending
  
  Compliance screening
    → AI flags unusual patterns for human review
    → Not a replacement for compliance officer judgment
```

---

## 6. Technology Requirements for Transformation

| Component | Requirement | Priority |
|-----------|------------|---------|
| Supabase Auth | User authentication system | Phase 2 |
| Supabase Storage | KYC document storage | Phase 2 |
| WhatsApp Business API | Automated messaging | Phase 2 |
| NADRA API | CNIC verification | Phase 2 |
| CDC API | Sub-account management | Phase 2 |
| Redis | Session caching, real-time alerts | Phase 2 |
| Payment gateway | Account funding | Phase 2 |
| WebSockets (Supabase Realtime) | Real-time portfolio updates | Phase 3 |
| AI API (Claude/OpenAI) | Intelligence generation | Phase 3 |

---

## 7. Transformation Risks

| Risk | Mitigation |
|------|-----------|
| Regulatory compliance during digitization | SECP/PSX digital brokerage requirements must be mapped before Phase 2 build |
| Data privacy (KYC documents) | Supabase Storage with RLS, encrypted at rest, access logging |
| Client resistance to digital onboarding | Hybrid model — digital preferred, manual supported |
| CDC integration complexity | Early API discovery, relationship with CDC for testing access |
| WhatsApp API rate limits and compliance | Business API tier, proper opt-in/out management |
| Operational continuity during transition | Parallel run period — new digital + old manual simultaneously |

---

*BROKERAGE_TRANSFORMATION_PLAN.md | Version 1.0 | May 2026 | Review quarterly*
