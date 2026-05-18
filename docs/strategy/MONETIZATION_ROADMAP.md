# AHM Platform — Monetization Roadmap

**Version:** 1.0  
**Date:** May 2026  
**Owner:** AHM Architecture Team / Commercial Lead  
**Classification:** Internal Strategic Document  
**Review Cycle:** Quarterly

---

## Executive Summary

AHM's monetization strategy follows the same layering principle as its product development — brokerage revenue first (existing business), platform subscription second (new revenue), data/API third (scalable B2B). Each layer builds on the previous. Premature pursuit of data monetization before the platform has critical mass is a distraction. Premature subscription tiers before product depth is built will fail.

The correct sequence is: win on intelligence quality → convert clients to digital → monetize the digital relationship.

---

## 1. Monetization Philosophy

**Phase 1 principle:** Earn trust through intelligence quality before charging for intelligence access.  
**Phase 2 principle:** Monetize the client operating platform — the product people need to execute.  
**Phase 3 principle:** Monetize the data and intelligence layer as a standalone product.

The platform's economics improve at each phase because the asset being monetized (data quality, user base, proprietary intelligence) compoundingly improves.

---

## 2. Revenue Stream Architecture

```
REVENUE LAYER 1 — Brokerage (Current, Immediate)
  ├── Trade commission revenue
  ├── Account maintenance fees
  └── Margin financing spread (future)

REVENUE LAYER 2 — Platform Subscriptions (Phase 2)
  ├── Retail tier subscription
  ├── Premium tier subscription
  └── Institutional tier subscription

REVENUE LAYER 3 — Data & Intelligence (Phase 3-4)
  ├── Intelligence API access
  ├── Custom research subscriptions
  ├── Institutional data feeds
  └── White-label intelligence platform

REVENUE LAYER 4 — Financial Products (Phase 4-5)
  ├── Mutual fund distribution
  ├── IPO allocation service
  └── Wealth management referrals
```

---

## 3. Layer 1: Brokerage Revenue

### Core Brokerage Model
Traditional PSX brokerage commission revenue. This is the existing business that funds platform development.

**Commission structure:**  
Standard PSX brokerage rates apply. Competitive positioning through service quality and intelligence access, not commission discounting.

**Margin financing (future):**  
When regulatory and capital requirements are met, margin financing spreads on leveraged positions are a meaningful revenue source for active traders.

**Account fees:**  
Annual account maintenance fee for digital account holders. Justified by the intelligence platform value, not by account administration.

### Brokerage Revenue Optimization Through Platform

The platform generates brokerage revenue uplift through:
- **Higher engagement** — clients who use intelligence features trade more informed
- **New client acquisition** — platform quality attracts clients from competitors
- **Digital onboarding** — reduced account opening cost per client
- **Client retention** — platform stickiness reduces churn to competing brokers

---

## 4. Layer 2: Platform Subscription Tiers

### Tier Design Principles

Tiers must gate real value — not artificial limitations designed to upsell. Users must genuinely benefit from upgrading.

```
FREE TIER — Intelligence Preview
  → Access to market dashboard
  → Top-level sector intelligence pages
  → Research report summaries (not full text)
  → 5 company pages per month (gated after 5)
  → No portfolio features
  → Conversion target: free → paid

RETAIL TIER (PKR X/month)
  → Full company intelligence pages (all companies)
  → Full research reports
  → Portfolio dashboard (holdings, P&L)
  → Watchlist with alerts
  → WhatsApp briefings
  → Screener with full filter set

PREMIUM TIER (PKR Y/month, ~3x Retail)
  → Everything in Retail
  → AI-generated intelligence summaries
  → Conviction scoring
  → Earnings previews and post-analysis
  → Advanced screening (cross-company analytics)
  → Sector rotation analytics
  → Priority research access

INSTITUTIONAL TIER (Custom pricing)
  → Everything in Premium
  → Custom research requests
  → Portfolio-level analytics
  → API access (rate-limited)
  → Dedicated relationship manager
  → White-glove onboarding
```

### Tier Gating Strategy

The free tier must be genuinely valuable to build trust and drive organic growth. The retail tier must clearly demonstrate incremental value over free. The premium tier must save professionals meaningful research time.

**What should never be behind a paywall:**
- Basic market data (KSE-100, gainers, losers)
- Sector page existence and basic descriptions
- Platform navigation and discovery

**What should be premium:**
- Full company intelligence depth
- AI-generated summaries and scoring
- Portfolio features
- WhatsApp intelligence feeds

---

## 5. Layer 3: Data and Intelligence Monetization

### 5.1 Intelligence API

As the structured intelligence database scales to 500+ companies, the API becomes a product.

**Target customers:**
- Other Pakistani brokers who want structured intelligence without building it
- Financial media companies (news sites, apps)
- Research aggregators
- Fund managers who want programmatic access to normalized PSX data

**API product tiers:**

```
Read-only API endpoints:
  GET /api/v1/companies/{symbol}/intelligence     ← company intelligence blocks
  GET /api/v1/sectors/{slug}/drivers             ← sector drivers
  GET /api/v1/markets/index                      ← KSE-100 snapshot
  GET /api/v1/screener                           ← cross-company queries

Pricing model:
  Per-call pricing for low-volume users
  Monthly subscription for high-volume institutional
  Custom contracts for embedded/white-label usage
```

### 5.2 Custom Research Subscriptions

Institutional clients who want analyst-authored research on specific companies or sectors, delivered on a subscription basis.

**Differentiation from standard research:** Deeper, more frequent, custom-scoped to client portfolio or sector focus.

### 5.3 White-Label Intelligence Platform

The AHM Platform codebase, intelligence database, and AI layer can be white-labeled for other brokers who want to offer a superior digital experience to their clients without building it themselves.

**This is a long-term opportunity (Phase 4-5).** Requirements: platform stability, data quality at scale, legal framework for white-label agreements.

---

## 6. Layer 4: Financial Products Distribution

### Mutual Fund Distribution

SECP-regulated distribution of approved mutual funds through the platform. Distribution fee income is a recurring, low-marginal-cost revenue stream once the platform has client base.

Requirements: SECP distribution license, fund partner agreements, product suitability framework.

### IPO Allocation Service

The AHM platform and client base can be used for IPO subscription facilitation — capturing allocation fees from issuers and providing clients privileged access to IPO participation.

Requirements: CDC integration, regulatory compliance for IPO participation, issuer relationships.

---

## 7. Pricing Philosophy

### What Doesn't Work in Pakistan's Market

- **High upfront fees** — Pakistan's investor base is price-sensitive for new digital products
- **Freemium with nothing meaningful in free tier** — users won't convert if they can't experience value first
- **Annual-only subscriptions** — monthly billing required for accessibility

### What Works

- **Monthly subscriptions with annual discount** — lowers barrier, rewards commitment
- **Feature-led free tier** — users experience genuine value before paying
- **Intelligence quality as the justification** — "you pay for research quality, not software access"
- **Bundle intelligence + brokerage** — subscription waived/discounted for clients who execute through AHM

### Competitive Pricing Benchmark

PKR pricing must reflect Pakistan's economic context. Equivalent international platforms (Koyfin, Stratosphere) charge $30-50 USD/month. At 280 PKR/USD, this suggests a ceiling of PKR 8,000-14,000/month for a full institutional product. Retail pricing should be 10-20% of this ceiling.

---

## 8. Monetization Sequencing

| Phase | Revenue Streams Active | Priority |
|-------|----------------------|---------|
| Phase 1 (Now) | Brokerage commission only | Build intelligence quality |
| Phase 2 | Brokerage + Retail subscription | Convert free users to paid |
| Phase 3 | All subscription tiers + Basic API | Institutional expansion |
| Phase 4 | Full subscription + API + Fund distribution | Scale |
| Phase 5 | All layers + White-label | Platform business |

**Rule:** Do not launch Phase 2 subscription before the intelligence product is demonstrably better than free alternatives. The subscription model depends entirely on product quality.

---

## 9. Key Metrics to Track

| Metric | Phase 2 Target | Phase 3 Target |
|--------|---------------|---------------|
| Free users | 1,000+ | 10,000+ |
| Paid conversion rate | 5% | 10% |
| Retail subscribers | 50+ | 500+ |
| Premium subscribers | 10+ | 100+ |
| Institutional clients | 2-3 | 20+ |
| API customers | 0 | 5+ |
| Brokerage revenue uplift vs. baseline | 20% | 50% |
| Client acquisition through platform | 30% of new clients | 60% of new clients |

---

*MONETIZATION_ROADMAP.md | Version 1.0 | May 2026 | Review quarterly with commercial team*
