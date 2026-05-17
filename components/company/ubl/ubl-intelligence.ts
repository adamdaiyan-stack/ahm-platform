// components/company/ubl/ubl-intelligence.ts
//
// Static intelligence configuration for UBL (United Bank Limited).
// Follows the same fallback-first pattern as sector static configs.
// Source of truth until company_intelligence DB table is seeded.
//
// MIGRATION STATUS: Static (company_intelligence table not yet built)
// Future: seed this content into a company_intelligence table and
//         fetch via getCompanyIntelligence("UBL") in the page.

import type {
  ThesisTheme,
  CompanyDriver,
  RiskItem,
  CatalystItem,
  ValuationPoint,
} from "@/components/company";

// ── Investment Thesis ─────────────────────────────────────────────────────────

export const UBL_THESIS_SUMMARY =
  "UBL is Pakistan's third-largest bank by assets — a rate-sensitive, high-CASA franchise " +
  "with a multi-decade dividend track record and an emerging Islamic banking platform. " +
  "In the current rate-easing cycle, near-term NIM compression is the primary headwind; " +
  "the medium-term thesis rests on private-sector credit recovery, payout growth, and " +
  "re-rating as the 53% effective tax rate normalises. UBL is best positioned as a " +
  "dividend compounder and rate-cycle recovery play, not a growth story.";

export const UBL_THESIS_THEMES: ThesisTheme[] = [
  {
    icon:  "🏦",
    title: "CASA Franchise & Low-Cost Funding",
    body:
      "UBL's CASA ratio of ~55–60% is one of the strongest in the sector, providing a " +
      "structural cost-of-funds advantage that persists across rate cycles. A large, " +
      "sticky current and savings account base means UBL does not need to aggressively " +
      "reprice liabilities upward when competition for deposits intensifies. This " +
      "structural moat partially buffers NIM compression in a rate-cut cycle.",
  },
  {
    icon:  "📈",
    title: "Rate Sensitivity & Earnings Leverage",
    body:
      "As a large commercial bank, UBL's earnings are materially exposed to SBP policy " +
      "rate movements. The easing cycle from 22% (Jan 2024) toward ~12% (May 2025) will " +
      "compress NIM by an estimated 150–200bps over 4–6 quarters. However, volume recovery " +
      "in private-sector lending — enabled by lower rates — provides a partial demand-side " +
      "offset. The rate inflection point is the key timing variable for position entry.",
  },
  {
    icon:  "💰",
    title: "Dividend Profile & Payout Consistency",
    body:
      "UBL has maintained consistent dividend payouts across multiple economic cycles, " +
      "including the challenging FY23–24 high-rate, high-tax environment. Historical " +
      "dividend yield has ranged from 8–14% at various price points. With a strong capital " +
      "position and improving advance-to-deposit dynamics, dividend sustainability appears " +
      "intact. Any ETR reduction in the Federal Budget would immediately free up payout " +
      "capacity and provide earnings upside.",
  },
  {
    icon:  "☪️",
    title: "Islamic Banking Optionality (UBL Ameen)",
    body:
      "UBL Ameen — the Islamic banking window — is one of the sector's larger Islamic " +
      "platforms. As Pakistan's Islamic banking penetration grows toward 30%+ of total " +
      "banking assets (from ~22% in 2024), UBL's established Islamic franchise provides " +
      "optionality without the full conversion capex of standalone Islamic banks. MEBL " +
      "is the structural beneficiary of full Islamic conversion; UBL Ameen captures " +
      "incremental Islamic deposit share with lower structural disruption.",
  },
];

// ── Company Drivers ───────────────────────────────────────────────────────────

export const UBL_DRIVERS: CompanyDriver[] = [
  {
    label:       "SBP Policy Rate",
    description:
      "The SBP policy rate is UBL's single most important near-term earnings variable. " +
      "Rate cuts reduce returns on the government securities portfolio and compress asset " +
      "yields faster than liability costs reprice. UBL's large fixed-income portfolio means " +
      "yield-on-earning-assets falls immediately when rates move. The magnitude of NIM " +
      "compression determines whether UBL's FY26 EPS is flat, down, or recovers with " +
      "volume. Each 100bps cut is estimated to reduce NIM by ~20–30bps on an annualised basis.",
    current:     "12.0% (May 2025) — easing cycle ongoing, rate path critical",
    trend:       "watch",
  },
  {
    label:       "CASA Ratio & Deposit Franchise",
    description:
      "UBL's CASA ratio (~55–60%) reflects the quality of its retail and corporate " +
      "deposit franchise. Current accounts (zero-cost) and savings accounts (low-cost) " +
      "reduce UBL's blended cost of funds relative to peers dependent on time deposits. " +
      "Growth in CASA — particularly current accounts — is structurally accretive to NIM " +
      "independent of the rate cycle. CASA maintenance through the rate-cut cycle is the " +
      "defensive moat thesis.",
    current:     "CASA ~55–60% · structural cost-of-funds advantage maintained",
    trend:       "positive",
  },
  {
    label:       "Net Interest Margin (NIM)",
    description:
      "NIM is the spread between earning-asset yields and cost-of-funding — the core " +
      "revenue engine for UBL. NIM peaked in the high-rate environment of FY24 and is " +
      "now compressing as SBP cuts rates. The pace of NIM compression depends on the " +
      "rate path, asset repricing speed, and UBL's ability to grow private-sector advances " +
      "at higher spreads. A stable or recovering NIM in FY26–27 would be the primary " +
      "positive earnings re-rating catalyst.",
    current:     "NIM compression underway — rate-cut cycle headwind, monitoring quarterly",
    trend:       "watch",
  },
  {
    label:       "Asset Quality & Provisioning",
    description:
      "UBL's NPL ratio and provisioning requirements are monitored closely as a risk to " +
      "earnings quality. The high-rate environment of FY23–24 increased financial stress " +
      "for corporate borrowers — any deterioration in large-ticket loan books would " +
      "require higher specific provisions. UBL's exposure to consumer financing, SME, " +
      "and corporate segments each carry different credit risk profiles. NPL coverage " +
      "adequacy is a key metric for balance sheet strength assessment.",
    current:     "NPL coverage adequate · no material stress signals as of last reporting",
    trend:       "neutral",
  },
  {
    label:       "ADR Tax Compliance",
    description:
      "Pakistan's Advance-to-Deposit Ratio (ADR) tax framework imposes additional tax " +
      "on banks with ADR below 50%. With private-sector credit demand suppressed in FY24, " +
      "UBL — like peers — faced ADR compliance risk. As the rate-cut cycle stimulates " +
      "borrowing demand, ADR improvement reduces tax burden and is directly EPS-accretive. " +
      "ADR trajectory is both a demand indicator and a tax-efficiency signal.",
    current:     "ADR below optimal threshold — rate cuts expected to drive private credit recovery",
    trend:       "watch",
  },
  {
    label:       "International Operations",
    description:
      "UBL has international operations in the UK, UAE, and other markets. The " +
      "international book provides diversification from Pakistan-specific macro risk and " +
      "contributes foreign currency earnings. The UK operations were historically a " +
      "significant part of UBL's profit mix. Remittance flows through UBL's network " +
      "provide recurring fee income and deposit float. International P&L is monitored " +
      "separately and can be a source of positive earnings surprise in periods of strong " +
      "remittance flows.",
    current:     "International operations stable · remittance flows supporting fee income",
    trend:       "neutral",
  },
];

// ── Risks ─────────────────────────────────────────────────────────────────────

export const UBL_RISKS: RiskItem[] = [
  {
    label:       "NIM Compression Cycle",
    description:
      "The SBP rate-cut cycle will compress NIM for 4–6 quarters. If cuts are faster or " +
      "deeper than expected, EPS pressure intensifies. Private-sector lending recovery " +
      "is the only material offset — a slow credit recovery compounds the NIM headwind.",
    severity:    "high",
  },
  {
    label:       "53% Effective Tax Rate",
    description:
      "Pakistan's banking sector ETR of ~53% is among the highest in the EM banking " +
      "universe — including the super tax, income tax, and ADR-linked levies. This " +
      "structurally suppresses ROE and P/E multiples. No near-term policy relief is " +
      "signalled, making this a persistent earnings compressor.",
    severity:    "medium",
  },
  {
    label:       "Provisioning Spike Risk",
    description:
      "A deterioration in corporate or consumer loan portfolios — triggered by recession " +
      "or sector-specific stress — could require material additional provisions. UBL's " +
      "exposure to cyclical sectors (textiles, construction) is a watch item.",
    severity:    "medium",
  },
  {
    label:       "Regulatory & Policy Risk",
    description:
      "Banking sector policy changes — minimum deposit rate revisions, new ADR " +
      "frameworks, capital adequacy changes, or SBP conduct requirements — can " +
      "affect earnings and operating models with limited notice. PSX banks operate " +
      "in a tightly regulated environment where regulatory risk is non-trivial.",
    severity:    "low",
  },
];

// ── Catalysts ─────────────────────────────────────────────────────────────────

export const UBL_CATALYSTS: CatalystItem[] = [
  {
    label:       "ETR Reduction in Federal Budget",
    description:
      "Any reduction in banking sector tax — including super tax phase-out or " +
      "ADR threshold adjustment — would be immediately accretive to EPS. A 5ppt ETR " +
      "reduction translates to ~10–12% EPS upside for a bank like UBL. This is the " +
      "highest-probability near-term re-rating catalyst.",
    horizon:     "near",
  },
  {
    label:       "Private-Sector Credit Recovery",
    description:
      "As the SBP rate-cut cycle lowers borrowing costs, suppressed private-sector " +
      "credit demand recovers. UBL's large corporate and retail banking franchise is " +
      "well-positioned to capture volume growth. ADR improvement simultaneously " +
      "reduces the ADR tax burden, creating a double earnings benefit.",
    horizon:     "medium",
  },
  {
    label:       "Dividend Upside / Special Payouts",
    description:
      "UBL's strong capital position and consistent earnings support the possibility " +
      "of dividend upside — either through a higher payout ratio or a special dividend " +
      "in years of above-consensus earnings. Dividend surprise is a historical positive " +
      "price catalyst for Pakistani bank stocks.",
    horizon:     "near",
  },
  {
    label:       "Sector Re-rating on Tax Reform",
    description:
      "A structural reduction in banking sector ETR — requiring political will and " +
      "budget space — would re-rate the entire banking sector upward. UBL, as one of " +
      "the largest banks, would be a primary beneficiary. This is a medium-probability, " +
      "high-magnitude catalyst.",
    horizon:     "long",
  },
];

// ── Valuation ─────────────────────────────────────────────────────────────────

export const UBL_VALUATION_SUMMARY =
  "UBL trades at a meaningful discount to intrinsic value — driven primarily by the " +
  "53% ETR overhang and near-term NIM compression concerns rather than structural " +
  "franchise weakness. At 4–6x forward P/E and 8–12% dividend yield (at various price " +
  "points), UBL offers one of the most attractive risk-adjusted yield profiles among " +
  "large-cap PSX stocks. The re-rating catalyst is tax reform or a faster-than-expected " +
  "private credit recovery. Without those, valuation stays range-bound.";

export const UBL_VALUATION_HISTORICAL_RANGE =
  "P/E has historically ranged 3x (FY23 stress) to 8x (FY21 recovery). " +
  "Current mid-cycle P/E of 4–6x suggests reasonable but not compelling entry. " +
  "P/B has ranged 0.6x–1.2x; current ~0.9x is near book value.";

export const UBL_VALUATION_PEER_CONTEXT =
  "Pakistani bank peers (HBL, MCB, BAFL) trade at similar P/E multiples — the 53% ETR " +
  "is a sector-wide discount, not UBL-specific. MCB commands a slight P/E premium " +
  "for higher ROE; BAFL trades at discount for balance-sheet concerns.";

export const UBL_VALUATION_POINTS: ValuationPoint[] = [
  {
    metric:  "P/E Ratio",
    current: "4–6x",
    context: "Forward earnings estimate",
    signal:  "cheap",
  },
  {
    metric:  "P/B Ratio",
    current: "~0.9x",
    context: "Price to book value",
    signal:  "fair",
  },
  {
    metric:  "Div Yield",
    current: "8–12%",
    context: "At range of price levels",
    signal:  "cheap",
  },
  {
    metric:  "ROE",
    current: "~15–20%",
    context: "Return on equity (pre-ETR full)",
    signal:  "fair",
  },
];

// ── Dividend commentary ───────────────────────────────────────────────────────

export const UBL_DIVIDEND_COMMENTARY =
  "UBL has maintained a consistent dividend payout across multiple economic cycles, " +
  "including the high-rate, high-tax environment of FY23–24. The dividend per share " +
  "has historically ranged from Rs14–28, providing a predictable income stream for " +
  "yield-oriented investors. Payout ratio sustainability is supported by UBL's strong " +
  "capital adequacy — CAR comfortably above SBP minimums — leaving headroom for " +
  "maintained or increased payouts even as EPS faces near-term rate pressure.";

export const UBL_DIVIDEND_YIELD_POSITIONING =
  "At Rs8–12% trailing yield (depending on price entry), UBL offers a materially " +
  "higher yield than PSX fixed-income alternatives. This yield premium is the primary " +
  "anchor for dividend-focused institutional positioning in the stock.";

export const UBL_DIVIDEND_CONSISTENCY_NOTE =
  "Multi-decade dividend track record. Maintained payouts through FY20 COVID, FY22 " +
  "floods, and the FY23 financing crunch. No dividend omission in the past 10 years.";
