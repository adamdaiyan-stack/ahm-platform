// components/company/hbl/hbl-intelligence.ts
//
// Static intelligence configuration for HBL (Habib Bank Limited).
// Follows the same pattern as ubl-intelligence.ts.
// Source of truth until company_intelligence DB table is seeded.
//
// MIGRATION STATUS: Static (company_intelligence table not yet built)
// Future: seed into company_intelligence table, fetch via getCompanyIntelligence("HBL")

import type {
  ThesisTheme,
  CompanyDriver,
  RiskItem,
  CatalystItem,
  ValuationPoint,
} from "@/components/company";

// ── Investment Thesis ─────────────────────────────────────────────────────────

export const HBL_THESIS_SUMMARY =
  "HBL is Pakistan's largest commercial bank by assets — a franchise with unrivalled " +
  "geographic reach (over 1,700 branches) and the deepest international network among " +
  "Pakistani banks (120+ countries, 50+ international offices). HBL's investment thesis " +
  "is anchored on three pillars: its CASA-funded balance sheet regaining NIM traction as " +
  "the rate cycle stabilises, its international operations providing structural earnings " +
  "diversification, and its aggressive digital transformation (HBL Konnect) expanding " +
  "low-cost deposit penetration. At sub-6x forward P/E, HBL offers a franchise discount " +
  "that narrows as macro clarity improves. The primary near-term risk is NIM compression " +
  "through the SBP easing cycle; the medium-term catalyst is private credit recovery.";

export const HBL_THESIS_THEMES: ThesisTheme[] = [
  {
    icon:  "🌍",
    title: "Pakistan's Largest Bank — Unrivalled Franchise Scale",
    body:
      "HBL's network of 1,700+ domestic branches and presence in 120+ countries gives it " +
      "an addressable market and distribution moat that no domestic competitor can replicate " +
      "at current cost. This scale advantage translates to sticky CASA, deep corporate " +
      "relationships, and consistent government/institutional business flows. Scale also " +
      "provides cost absorption in periods of macro stress — HBL's operating leverage " +
      "benefits from revenue recovery disproportionately.",
  },
  {
    icon:  "📡",
    title: "International Franchise & Remittance Monetisation",
    body:
      "HBL's international operations — spanning the UK, UAE, Bahrain, China, and " +
      "emerging markets — are a structural earnings diversifier unavailable to purely " +
      "domestic peers. Pakistan's annual remittance inflows (~USD 27B) flow significantly " +
      "through HBL's international network, generating fee income, deposit float, and " +
      "FX revenue. As Pakistan formalises remittance channels (Roshan Digital Account, " +
      "NRSP), HBL's established global infrastructure is competitively advantaged.",
  },
  {
    icon:  "📱",
    title: "Digital Transformation — HBL Konnect & Branchless Banking",
    body:
      "HBL Konnect is Pakistan's largest branchless banking platform by transaction volume. " +
      "The digital strategy targets unbanked and underbanked segments — reducing the marginal " +
      "cost of CASA acquisition over time. Investment in digital infrastructure also " +
      "improves cost efficiency: digital transaction shift reduces branch operating cost. " +
      "Long-term, a successful digital franchise reduces the cost disadvantage vs smaller, " +
      "more agile fintech competitors.",
  },
  {
    icon:  "💼",
    title: "Corporate Banking & Trade Finance Depth",
    body:
      "HBL's corporate banking franchise — built over decades of relationships with " +
      "Pakistan's largest industrial, commodity, and infrastructure groups — positions " +
      "it as the primary transaction banker for large-ticket lending. As private-sector " +
      "credit recovery materialises, HBL's pipeline of large corporate mandates, project " +
      "finance, and trade finance deals gives it first-mover advantage in volume recovery. " +
      "Corporate fee income (trade, custody, FX) also provides non-interest revenue buffer.",
  },
];

// ── Company Drivers ───────────────────────────────────────────────────────────

export const HBL_DRIVERS: CompanyDriver[] = [
  {
    label:       "SBP Policy Rate & NIM Trajectory",
    description:
      "HBL's largest single earnings variable is the SBP policy rate. As Pakistan's " +
      "biggest bank, HBL holds the largest absolute PKR government securities portfolio — " +
      "making it the most exposed to yield compression in an easing cycle. NIM peaked " +
      "in FY24 and will compress over the next 4–6 quarters. However, as the largest " +
      "lender, HBL captures the earliest and largest volume upside when private credit " +
      "demand recovers, providing a natural offset.",
    current:     "12.0% (May 2025) — easing cycle compressing NIM, volume recovery pending",
    trend:       "watch",
  },
  {
    label:       "International Operations Profitability",
    description:
      "HBL's international book is a critical differentiator from domestic peers. " +
      "Performance in the UK, UAE, and other markets is driven by local macro conditions, " +
      "credit quality, and FX translation effects. Strong remittance inflows are a " +
      "recurring positive for HBL's international fee income. The NYDFS compliance " +
      "episode (2017) has now been resolved — the international franchise is rebuilding " +
      "its risk profile and expanding cautiously. International profitability trend is " +
      "a secondary but important earnings monitor.",
    current:     "International operations stable; UAE and UK contributing to fee income diversification",
    trend:       "positive",
  },
  {
    label:       "CASA Ratio & Cost of Funds",
    description:
      "HBL's CASA ratio (~52–55%) is lower than MCB (~68%) but supported by an unmatched " +
      "branch network and HBL Konnect's branchless penetration. The direction of CASA " +
      "improvement matters more than the absolute level — meaningful CASA growth reduces " +
      "cost of funds and structurally improves NIM. Digital channel investment is the " +
      "primary CASA growth lever for the next 3–5 years.",
    current:     "CASA ~52–55% · improvement trajectory via digital and branch network",
    trend:       "positive",
  },
  {
    label:       "Asset Quality & Provisioning Cycle",
    description:
      "HBL's NPL ratio is slightly elevated vs MCB given its larger exposure to " +
      "corporate, SME, and consumer segments that felt stress in the FY23–24 high-rate " +
      "environment. Provisioning adequacy and NPL resolution are key earnings quality " +
      "monitors. A rate-cut cycle improving borrower debt-service capacity would reduce " +
      "new NPL formation — a positive for HBL's provisioning trajectory from FY26 onward.",
    current:     "NPL ratio ~8% · provisioning adequate · monitoring corporate book in rate-cut cycle",
    trend:       "neutral",
  },
  {
    label:       "ADR Compliance & Private Credit Recovery",
    description:
      "Pakistan's ADR tax framework penalises banks with low advance-to-deposit ratios. " +
      "HBL, given its large deposit base, faces ADR compliance risk when private credit " +
      "demand is suppressed. As the rate cycle turns and corporate/consumer borrowing " +
      "recovers, ADR improvement is both an EPS-accretive tax efficiency and a signal of " +
      "underlying business momentum. HBL's corporate banking depth means it is well " +
      "positioned to capture early credit recovery.",
    current:     "ADR below optimal — rate cuts expected to stimulate private sector borrowing",
    trend:       "watch",
  },
  {
    label:       "Effective Tax Rate (53% Sector-Wide)",
    description:
      "Pakistan's 53% banking ETR — a combined super tax, income tax, and ADR levy — " +
      "uniformly suppresses ROE across the sector. For HBL, the ETR headwind is " +
      "compounded by its larger absolute profit base. Any budget-driven ETR reduction " +
      "would have a proportionally larger absolute earnings impact for HBL vs smaller " +
      "peers. The super tax trajectory is a key earnings variable for FY26 budget planning.",
    current:     "ETR ~53% — sector-wide headwind; Federal Budget ETR relief remains key catalyst",
    trend:       "watch",
  },
];

// ── Risks ─────────────────────────────────────────────────────────────────────

export const HBL_RISKS: RiskItem[] = [
  {
    label:       "NIM Compression from Rate Easing",
    description:
      "As Pakistan's largest bank with the biggest government securities portfolio, " +
      "HBL faces the largest absolute NIM compression in the current rate-cut cycle. " +
      "If the SBP cuts faster or deeper than expected, and private credit recovery lags, " +
      "EPS pressure in FY25–26 could be more severe than sector consensus.",
    severity:    "high",
  },
  {
    label:       "International Operations Execution Risk",
    description:
      "HBL's international network is both an asset and a complexity. Regulatory " +
      "developments in key markets (UK FCA, UAE CBUAE), credit quality in international " +
      "portfolios, and FX translation risk are ongoing variables. A repeat of the " +
      "NYDFS-style compliance event — though unlikely given enhanced controls — would " +
      "be disproportionately damaging given HBL's brand exposure.",
    severity:    "medium",
  },
  {
    label:       "53% Effective Tax Rate Persistence",
    description:
      "The sector-wide ETR of ~53% structurally suppresses HBL's ROE below the " +
      "pre-super-tax level. If the Federal Budget does not provide any ETR relief in " +
      "FY26, HBL's earnings recovery from volume and NIM improvement will be partially " +
      "absorbed by the tax line. This is a persistent overhang with no near-term " +
      "resolution visible.",
    severity:    "medium",
  },
  {
    label:       "Digital Competition & Fintech Displacement",
    description:
      "Pakistan's mobile wallet and fintech landscape is growing — Easypaisa, JazzCash, " +
      "and neobank entrants are competing directly for low-value retail deposits and " +
      "transaction volumes that have historically been HBL's base. The risk is gradual " +
      "erosion of CASA in the sub-50,000 retail segment — a long-term structural pressure " +
      "that HBL's Konnect platform is designed to counter.",
    severity:    "low",
  },
];

// ── Catalysts ─────────────────────────────────────────────────────────────────

export const HBL_CATALYSTS: CatalystItem[] = [
  {
    label:       "Private Credit Recovery & ADR Improvement",
    description:
      "As SBP rate cuts reach borrowers (typically 2–4 quarter lag), private sector " +
      "credit demand recovers. HBL, as the largest lender, captures the largest absolute " +
      "volume uplift. ADR improvement simultaneously reduces the tax penalty — creating " +
      "a double earnings tailwind. This is the central medium-term recovery catalyst.",
    horizon:     "medium",
  },
  {
    label:       "ETR Reduction — Federal Budget",
    description:
      "Any reduction in banking sector super tax or effective tax rate in the annual " +
      "Federal Budget is immediately accretive to EPS. HBL's scale means a 5ppt ETR " +
      "reduction translates to the largest absolute PKR EPS uplift in the sector. " +
      "This remains the highest-probability near-term re-rating trigger.",
    horizon:     "near",
  },
  {
    label:       "Remittance Formalisation & Roshan Account Growth",
    description:
      "As Pakistan continues to formalise overseas worker remittances through the " +
      "Roshan Digital Account and regulated channels, HBL's international infrastructure " +
      "captures a growing share. Each dollar formalised through HBL generates FX fee " +
      "income, deposit float, and relationship value. This is a structural secular " +
      "growth driver independent of the domestic rate cycle.",
    horizon:     "medium",
  },
  {
    label:       "Digital CASA Growth Accelerating",
    description:
      "If HBL Konnect's branchless banking penetration accelerates — driven by biometric " +
      "SIM-linked account opening and smartphone banking adoption — CASA from digital " +
      "channels could structurally reduce HBL's cost of funds. This is a longer-dated " +
      "structural catalyst that would re-rate HBL closer to MCB's premium multiple.",
    horizon:     "long",
  },
];

// ── Valuation ─────────────────────────────────────────────────────────────────

export const HBL_VALUATION_SUMMARY =
  "HBL trades at a modest discount to sector peers (MCB, UBL) — reflecting its larger " +
  "NIM sensitivity, slightly elevated NPL ratio, and historical governance perception " +
  "gap relative to MCB. At 4–6x forward P/E, the stock prices in significant earnings " +
  "headwinds. A recovery in credit volume, stabilisation of international operations, " +
  "and any ETR relief would rapidly compress this discount. The dividend yield — " +
  "typically 8–12% — provides a meaningful total-return floor while investors wait for " +
  "earnings recovery. HBL is best positioned as a value recovery play with franchise " +
  "upside, not a stable-growth compounder.";

export const HBL_VALUATION_HISTORICAL_RANGE =
  "HBL P/E has historically ranged 3x (crisis periods) to 8x (recovery peaks). " +
  "Current 4–5x reflects compressed near-term earnings expectations. " +
  "P/B of ~0.8–0.9x trades below MCB (~1.2x) — the franchise discount vs highest-ROE peer.";

export const HBL_VALUATION_PEER_CONTEXT =
  "MCB commands a ~30–40% P/E premium for superior ROE and CASA. UBL trades roughly " +
  "in line. HBL's discount is a function of size complexity, international execution " +
  "risk, and NIM sensitivity — catalysts above would close this gap meaningfully.";

export const HBL_VALUATION_POINTS: ValuationPoint[] = [
  {
    metric:  "P/E Ratio",
    current: "4–6x",
    context: "Forward earnings estimate",
    signal:  "cheap",
  },
  {
    metric:  "P/B Ratio",
    current: "~0.8–0.9x",
    context: "Below-book franchise discount",
    signal:  "cheap",
  },
  {
    metric:  "Div Yield",
    current: "8–12%",
    context: "At range of price levels",
    signal:  "cheap",
  },
  {
    metric:  "ROE",
    current: "~14–18%",
    context: "Suppressed by 53% ETR",
    signal:  "fair",
  },
];

// ── Dividend commentary ───────────────────────────────────────────────────────

export const HBL_DIVIDEND_COMMENTARY =
  "HBL has maintained a consistent dividend payout history, with DPS ranging from " +
  "Rs10–25 across economic cycles. Despite the challenging FY23–24 rate-and-tax " +
  "environment, HBL continued paying dividends — supported by its capital adequacy " +
  "position (CAR above SBP minimums). HBL's sheer balance sheet size means even a " +
  "modest payout ratio generates meaningful absolute dividend income for shareholders. " +
  "As earnings recover with private credit growth and potential ETR relief, " +
  "dividend per share growth is a natural follow-on.";

export const HBL_DIVIDEND_YIELD_POSITIONING =
  "HBL's dividend yield of 8–12% (depending on price) is competitive within the " +
  "banking sector and compares favourably to PSX fixed-income equivalents. The yield " +
  "is partially capped by the 53% ETR — which reduces net distributable earnings — " +
  "but remains attractive on a risk-adjusted basis for dividend-seeking investors.";

export const HBL_DIVIDEND_CONSISTENCY_NOTE =
  "Consistent dividend payer across multiple economic cycles including FY20 COVID " +
  "disruption, FY22 floods, and FY23 financing pressure. No omission in the past " +
  "decade. International earnings provide a non-PKR income buffer that supports " +
  "dividend sustainability in PKR devaluation episodes.";
