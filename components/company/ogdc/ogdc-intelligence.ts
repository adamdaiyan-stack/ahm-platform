// components/company/ogdc/ogdc-intelligence.ts
//
// Static intelligence configuration for OGDC (Oil & Gas Development Company Limited).
// Cross-sector validation target — energy E&P vs banking framework.
// Source of truth until company_intelligence DB table is seeded.
//
// ARCHITECTURE NOTE:
//   This file proves the framework's cross-sector flexibility.
//   Same CompanyIntelligenceConfig type, same reusable components,
//   completely different intelligence domain (oil & gas vs banking).
//   No component rewrites. No sector-specific hacks.
//
// MIGRATION STATUS: Static (company_intelligence table not yet built)
// Future: seed into company_intelligence table, fetch via getCompanyIntelligence("OGDC")

import type {
  ThesisTheme,
  CompanyDriver,
  RiskItem,
  CatalystItem,
  ValuationPoint,
} from "@/components/company";

// ── Investment Thesis ─────────────────────────────────────────────────────────

export const OGDC_THESIS_SUMMARY =
  "OGDC is Pakistan's dominant oil and gas exploration and production company — a " +
  "state-owned enterprise controlling ~35–40% of Pakistan's domestic crude oil " +
  "production and ~25% of natural gas output. As a quasi-sovereign E&P company with " +
  "a low-cost production base, long reserve life, and exposure to international " +
  "commodity prices, OGDC provides a fundamentally different investment profile from " +
  "Pakistani banks. The thesis rests on three pillars: the structural energy supply " +
  "deficit in Pakistan driving pricing power, the USD-linked revenue base as a natural " +
  "PKR devaluation hedge, and one of the highest dividend yields on the PSX supported " +
  "by state ownership and dividend policy. The primary risk is the PKR 500–700B " +
  "circular debt receivable — owed by the power sector — which represents a structural " +
  "liquidity trap that constrains dividend capacity and investment in new exploration.";

export const OGDC_THESIS_THEMES: ThesisTheme[] = [
  {
    icon:  "🛢️",
    title: "Dominant E&P Position — Pakistan's Oil & Gas Backbone",
    body:
      "OGDC operates as Pakistan's largest upstream energy company — with a portfolio " +
      "of 50+ producing fields and 40+ exploration licences across Sindh, Punjab, " +
      "Balochistan, and KP. Its scale advantage in Pakistan's upstream sector means " +
      "OGDC captures the largest share of domestic production growth as new fields are " +
      "developed. The government's energy security mandate effectively protects OGDC's " +
      "operating environment from direct competition — new entrants face significantly " +
      "higher exploration risk without OGDC's legacy field economics.",
  },
  {
    icon:  "💵",
    title: "USD-Linked Revenue — Natural PKR Devaluation Hedge",
    body:
      "OGDC's oil revenues are linked to international crude prices and priced in USD, " +
      "then settled in PKR at the prevailing exchange rate. Every PKR devaluation episode " +
      "directly inflates OGDC's PKR revenue base — making it one of the strongest " +
      "natural hedges against PKR weakness on the PSX. This USD revenue linkage also " +
      "means OGDC's earnings are partially correlated with global oil market dynamics " +
      "rather than purely domestic Pakistani macro — providing genuine portfolio " +
      "diversification for PSX investors.",
  },
  {
    icon:  "⚡",
    title: "Energy Security Mandate & Pricing Advantage",
    body:
      "Pakistan faces a structural domestic energy supply deficit — gas production from " +
      "mature fields is declining while demand grows. This creates structural pricing " +
      "power for OGDC's gas output: government-set wellhead gas prices have consistently " +
      "increased over time to incentivise domestic production maintenance. OGDC's " +
      "government ownership also means it benefits from preferential regulatory treatment " +
      "in concession renewals, exploration block allocation, and gas price determination " +
      "negotiations — competitive advantages unavailable to private-sector E&P peers.",
  },
  {
    icon:  "🔍",
    title: "Exploration Upside — New Discovery Optionality",
    body:
      "OGDC's exploration portfolio represents real but unpriced optionality. Major new " +
      "discoveries in Pakistan's unexplored basins (particularly deep Indus and offshore " +
      "blocks) could add meaningfully to reserve life and production capacity. OGDC's " +
      "balance sheet — despite circular debt constraints — retains sufficient exploration " +
      "capital to pursue high-probability near-field exploration alongside frontier " +
      "prospects. A major discovery announcement has historically been a 10–30% upside " +
      "catalyst for the stock.",
  },
];

// ── Company Drivers ───────────────────────────────────────────────────────────

export const OGDC_DRIVERS: CompanyDriver[] = [
  {
    label:       "International Crude Oil Price (Brent)",
    description:
      "OGDC's oil revenue is directly linked to international crude benchmarks. " +
      "Brent crude at USD 70–80/bbl provides comfortable profitability at OGDC's " +
      "low production cost structure. Each USD 5/bbl move in Brent translates to " +
      "approximately 5–8% EPS sensitivity depending on production mix. With Pakistan's " +
      "crude price discovery partially regulated but increasingly market-linked, " +
      "oil price is OGDC's single largest external earnings variable — analogous to " +
      "the SBP policy rate for banks.",
    current:     "Brent ~USD 75–80/bbl (May 2025) — supportive range for OGDC economics",
    trend:       "neutral",
  },
  {
    label:       "Gas Production Volume & Field Decline Management",
    description:
      "Natural gas constitutes the majority of OGDC's production volume (vs crude). " +
      "Pakistan's mature gas fields face natural production decline of 5–8% per annum " +
      "without enhanced recovery investment. OGDC's ability to manage production decline " +
      "through enhanced oil recovery (EOR), well stimulation, and new well drilling " +
      "determines its production profile. Flat-to-growing production is the base case " +
      "that sustains revenue; declining production without new discoveries is the " +
      "primary structural risk to long-term earnings.",
    current:     "Production broadly stable — EOR investment ongoing to offset natural decline",
    trend:       "neutral",
  },
  {
    label:       "Circular Debt Receivable — The Liquidity Constraint",
    description:
      "OGDC is owed PKR 500–700B+ by the power sector via the inter-company circular " +
      "debt chain — a structural feature of Pakistan's energy sector financing. This " +
      "receivable suppresses OGDC's free cash flow, constrains exploration and " +
      "development capex, and limits dividend capacity below what earnings alone would " +
      "support. Government-led circular debt resolution programmes (PDC, CPPA-G " +
      "restructuring) are the primary pathway to unlocking this frozen liquidity. " +
      "Each instalment of circular debt recovery is both a cash positive and an " +
      "investment case catalyst.",
    current:     "Circular debt receivable ~PKR 500–700B · resolution pace slow but ongoing",
    trend:       "watch",
  },
  {
    label:       "PKR/USD Exchange Rate",
    description:
      "OGDC's oil revenues are settled in PKR at the prevailing exchange rate — making " +
      "PKR devaluation directly accretive to OGDC's PKR revenue and earnings. The " +
      "FY22–23 PKR devaluation from ~170 to ~300 was a significant EPS tailwind for " +
      "OGDC. As the PKR stabilises under IMF program discipline, this one-time " +
      "translation benefit diminishes. However, any future PKR weakness remains a " +
      "natural earnings upside for OGDC — one of the few PSX stocks that benefits " +
      "from local currency depreciation.",
    current:     "PKR ~280–290 (May 2025) · stable under IMF program · devaluation risk lower near-term",
    trend:       "neutral",
  },
  {
    label:       "Government Gas Pricing Policy",
    description:
      "Domestic wellhead gas prices in Pakistan are set through a government " +
      "determination framework (OGRA). Regular gas price revisions — increasing wellhead " +
      "prices to incentivise production — are directly accretive to OGDC's gas revenue. " +
      "Pakistan's energy deficit creates political pressure to maintain adequate wellhead " +
      "pricing; however, government price revision processes can be delayed, creating " +
      "revenue recognition timing risk. Gas price notification delays have historically " +
      "caused short-term earnings misses.",
    current:     "Gas wellhead prices periodically revised upward — energy affordability tension ongoing",
    trend:       "positive",
  },
  {
    label:       "Exploration Success Rate & Reserve Life",
    description:
      "OGDC's current reserve life (production reserve ratio) determines the duration " +
      "of its current earnings stream. New discoveries add reserve life and future " +
      "production optionality. OGDC's exploration programme in deep Indus, tight gas, " +
      "and frontier blocks represents optionality not captured in base-case earnings " +
      "models. A major new discovery in a high-impact well would be a re-rating event " +
      "independent of the broader commodity or macro cycle.",
    current:     "Exploration programme active · several high-impact wells in drilling stage",
    trend:       "positive",
  },
];

// ── Risks ─────────────────────────────────────────────────────────────────────

export const OGDC_RISKS: RiskItem[] = [
  {
    label:       "Circular Debt — Structural Liquidity Trap",
    description:
      "The PKR 500–700B+ receivable from the power sector is OGDC's most significant " +
      "structural risk. If circular debt continues to accumulate without resolution, " +
      "OGDC's free cash flow remains constrained — limiting exploration investment, " +
      "pressuring dividends, and creating a long-dated balance sheet liability risk. " +
      "Circular debt resolution is a government policy decision, not an OGDC operational " +
      "one — making this an external, hard-to-model risk.",
    severity:    "high",
  },
  {
    label:       "Global Oil Price Decline",
    description:
      "A sustained Brent crude price decline to USD 55–60/bbl or below would " +
      "materially compress OGDC's oil revenue. Pakistan's domestic crude pricing, " +
      "while partially regulated, tracks international benchmarks over time. An " +
      "oil price cycle similar to FY15–16 (sub-USD 40/bbl) would significantly reduce " +
      "EPS and dividend capacity. OGDC has no hedging programme — full price " +
      "exposure is the default.",
    severity:    "high",
  },
  {
    label:       "Production Decline Acceleration",
    description:
      "Pakistan's mature gas fields face natural production decline. If EOR and new " +
      "drilling programmes fail to offset this decline, OGDC's production profile " +
      "deteriorates — reducing revenue even at stable commodity prices. This is a " +
      "multi-year risk that compounds without successful exploration results to add " +
      "new reserve volumes.",
    severity:    "medium",
  },
  {
    label:       "Government Dividend Policy Risk",
    description:
      "As a majority government-owned entity, OGDC's dividend policy is partially " +
      "a function of the government's fiscal needs rather than purely commercial " +
      "considerations. In periods of fiscal stress, the government may pressure OGDC " +
      "to maintain or increase dividends (providing government revenue) even when " +
      "exploration reinvestment would be the superior capital allocation. Conversely, " +
      "circular debt obligations can suppress dividend capacity below earnings potential.",
    severity:    "low",
  },
];

// ── Catalysts ─────────────────────────────────────────────────────────────────

export const OGDC_CATALYSTS: CatalystItem[] = [
  {
    label:       "Circular Debt Resolution Programme",
    description:
      "A government-led circular debt resolution — whether through PDC bond issuance, " +
      "CPPA-G payment clearance, or power sector tariff rationalisation — would unlock " +
      "PKR hundreds of billions of frozen receivables for OGDC. Each major payment " +
      "instalment is a free cash flow event and reduces the risk discount on OGDC's " +
      "balance sheet. A credible multi-year resolution roadmap would be a significant " +
      "positive re-rating catalyst for OGDC specifically.",
    horizon:     "medium",
  },
  {
    label:       "Major New Discovery Announcement",
    description:
      "A commercial hydrocarbon discovery in any of OGDC's high-impact exploration wells " +
      "— particularly in frontier or deep plays — would add reserve life and future " +
      "production capacity not yet reflected in any earnings model. Major discoveries " +
      "have historically generated 10–30% stock price moves on announcement. " +
      "This is a binary, non-correlated catalyst independent of commodity or macro cycles.",
    horizon:     "near",
  },
  {
    label:       "Oil Price Upside Cycle",
    description:
      "If global oil markets tighten — driven by OPEC+ discipline, geopolitical supply " +
      "disruption, or demand recovery in emerging markets — Brent above USD 85–90/bbl " +
      "would materially upgrade OGDC's EPS and dividend capacity. As a full oil-price " +
      "pass-through E&P, OGDC has the highest earnings sensitivity to upside commodity " +
      "moves of any PSX stock. Each USD 10/bbl Brent increase translates to " +
      "approximately 8–12% EPS upside.",
    horizon:     "medium",
  },
  {
    label:       "PKR Devaluation Episode",
    description:
      "Any future PKR weakening cycle — should Pakistan's fiscal position deteriorate " +
      "beyond IMF program parameters — would inflate OGDC's PKR revenue proportionally. " +
      "This is a natural hedge for investors concerned about PKR risk: holding OGDC " +
      "provides an inverse correlation to PKR weakness within the PSX universe. " +
      "Not a desirable macro event, but a structural earnings uplift for OGDC holders.",
    horizon:     "long",
  },
];

// ── Valuation ─────────────────────────────────────────────────────────────────

export const OGDC_VALUATION_SUMMARY =
  "OGDC trades at a discount to E&P peers in comparable emerging markets — driven " +
  "primarily by the circular debt overhang, Pakistan country risk premium, and " +
  "limited international investor access. At 4–6x forward P/E, OGDC prices in a " +
  "significant uncertainty discount. The most compelling entry framework is " +
  "dividend yield: at 8–14% trailing yield, OGDC provides income investors a " +
  "commodity-linked, USD-revenue-backed yield that few PSX companies can match. " +
  "The re-rating catalysts are exogenous — circular debt resolution, oil price " +
  "upside, or new discoveries — rather than operational improvement, which is " +
  "already embedded in the base case.";

export const OGDC_VALUATION_HISTORICAL_RANGE =
  "OGDC P/E has ranged 4x (low oil, high circular debt) to 10x (high oil, strong earnings). " +
  "Current range of 4–6x reflects compressed earnings expectations and circular debt discount. " +
  "EV/EBITDA of 3–5x is deeply discounted vs EM E&P peers at 5–8x.";

export const OGDC_VALUATION_PEER_CONTEXT =
  "EM E&P peers (Egypt, Bangladesh, regional) trade at 5–9x P/E without equivalent " +
  "circular debt constraints. OGDC's discount to EM peers is partially structural " +
  "(Pakistan risk premium) and partially resolvable (circular debt). Resolution " +
  "of the latter would compress the gap meaningfully.";

export const OGDC_VALUATION_POINTS: ValuationPoint[] = [
  {
    metric:  "P/E Ratio",
    current: "4–6x",
    context: "Circular debt discount embedded",
    signal:  "cheap",
  },
  {
    metric:  "EV/EBITDA",
    current: "3–5x",
    context: "Deeply discounted vs EM E&P peers",
    signal:  "cheap",
  },
  {
    metric:  "Div Yield",
    current: "8–14%",
    context: "Commodity-linked, USD-revenue backed",
    signal:  "cheap",
  },
  {
    metric:  "P/B Ratio",
    current: "~0.8–1.0x",
    context: "Near-book — reserve value unpriced",
    signal:  "cheap",
  },
];

// ── Dividend commentary ───────────────────────────────────────────────────────

export const OGDC_DIVIDEND_COMMENTARY =
  "OGDC is one of Pakistan's most consistent large-cap dividend payers — driven by " +
  "its state ownership structure and the government's reliance on OGDC dividends as " +
  "a fiscal revenue source. This government dividend dependency creates an unusual " +
  "dynamic: OGDC's dividend is partially politically supported, which can maintain " +
  "payouts even when circular debt constrains free cash flow. However, the same " +
  "dependency can also cap dividend upside — as the government may prefer extraction " +
  "over reinvestment. DPS has historically ranged from Rs5–12, with both interim " +
  "and final distributions common.";

export const OGDC_DIVIDEND_YIELD_POSITIONING =
  "OGDC's dividend yield of 8–14% (at various price points) is among the highest " +
  "on the KSE-100 — and uniquely backed by USD-linked oil revenue rather than " +
  "purely domestic PKR earnings. This makes OGDC's dividend a structurally different " +
  "yield proposition than banks: it is partially protected against PKR devaluation " +
  "rather than exposed to it.";

export const OGDC_DIVIDEND_CONSISTENCY_NOTE =
  "State-owned enterprise with multi-decade dividend track record. Government reliance " +
  "on OGDC dividends as fiscal revenue provides structural payout support. Circular debt " +
  "accumulation is the primary risk to dividend sustainability — resolution unlocks " +
  "both higher dividends and exploration reinvestment simultaneously.";
