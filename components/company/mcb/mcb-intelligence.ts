// components/company/mcb/mcb-intelligence.ts
//
// Static intelligence configuration for MCB Bank Limited.
//
// MIGRATION STATUS: FALLBACK-ONLY
// DB is now the PRIMARY intelligence source for MCB.
// Seeded: company_intelligence (1 row) + company_intelligence_blocks (22 rows)
// This file is retained as a static fallback only — used by getCompanyIntelligence()
// if the DB query fails or returns null (e.g. during local dev without DB access).
// DO NOT delete until DB seeding is validated across all environments.

import type {
  ThesisTheme,
  CompanyDriver,
  RiskItem,
  CatalystItem,
  ValuationPoint,
} from "@/components/company";

// -- Investment Thesis ---------------------------------------------------------

export const MCB_THESIS_SUMMARY =
  "MCB Bank is Pakistan's highest-quality banking franchise — defined by the " +
  "sector's strongest CASA ratio (~68%), lowest cost-to-income ratio (~38%), and " +
  "cleanest loan book (NPL ratio ~5% vs sector ~8%). These structural advantages " +
  "translate to the sector's most consistent ROE and the only banking P/E premium " +
  "that has historically persisted across rate cycles. MCB's thesis is not about " +
  "recovery or transformation — it is about compounding at premium returns with a " +
  "best-in-class cost franchise. In the current easing cycle, MCB's lower NIM " +
  "sensitivity (less rate-sensitive loan book composition) and superior cost efficiency " +
  "make it the most defensive banking holding. The re-rating catalyst — ETR relief — " +
  "would be disproportionately accretive given MCB's highest pre-tax ROE in the sector.";

export const MCB_THESIS_THEMES: ThesisTheme[] = [
  {
    icon:  "🏆",
    title: "Best-in-Class CASA — 68% Low-Cost Funding Dominance",
    body:
      "MCB's CASA ratio of ~68% is the highest in the Pakistani banking sector — " +
      "a structural advantage built over decades of sticky retail and corporate " +
      "relationships. Current accounts (zero-cost) represent an unusually high " +
      "proportion of MCB's deposit base — providing a cost-of-funds floor that " +
      "competitors cannot match without equivalent franchise investment. This CASA " +
      "dominance means MCB's NIM compression in a rate-cut cycle is structurally " +
      "less severe than peers relying on time deposits for funding.",
  },
  {
    icon:  "⚙️",
    title: "Cost Efficiency Leader — C/I Ratio ~38%",
    body:
      "MCB's cost-to-income ratio of ~38% is the sector's best — roughly 10-15ppts " +
      "below HBL (~51%) and UBL (~47%). This efficiency is not the result of " +
      "underinvestment — MCB maintains a full branch network and has invested in " +
      "digital channels. It reflects tightly controlled operating expenses relative to " +
      "revenue generation. Superior cost efficiency means more earnings survive to the " +
      "bottom line at every revenue level — making MCB the highest-margin banking " +
      "franchise in Pakistan.",
  },
  {
    icon:  "🛡️",
    title: "Cleanest Loan Book — Conservative Credit Culture",
    body:
      "MCB's NPL ratio (~5%) is materially below sector average (~8%). This reflects " +
      "decades of conservative credit underwriting — MCB has historically preferred " +
      "quality over volume growth. A clean loan book means lower provisioning requirements, " +
      "higher earnings quality, and greater balance sheet flexibility in stressed " +
      "environments. The trade-off: MCB grows advances more slowly than peers in " +
      "credit boom cycles. The benefit: MCB suffers significantly less in credit bust " +
      "cycles when peers face aggressive provisioning.",
  },
  {
    icon:  "💎",
    title: "Consistent ROE Premium — Compounding Quality",
    body:
      "MCB's combination of superior CASA, lowest costs, and clean loan book produces " +
      "the sector's highest sustainable ROE — typically 20-25% pre-super-tax, " +
      "~18-22% at current ETR levels. This ROE premium has historically justified " +
      "MCB's sector-leading P/B and P/E multiples. For long-term holders, MCB's " +
      "compounding quality — consistent earnings, reliable dividends, and protected " +
      "downside — makes it the reference holding in any PSX banking portfolio.",
  },
];

// -- Company Drivers ----------------------------------------------------------

export const MCB_DRIVERS: CompanyDriver[] = [
  {
    label:       "SBP Policy Rate — CASA Buffer on NIM",
    description:
      "MCB's ~68% CASA ratio means its liability repricing in a rate-cut cycle is " +
      "materially slower than peers. When the SBP cuts rates, MCB's current account " +
      "balances remain zero-cost — they do not reprice lower (they are already at zero). " +
      "This means MCB's cost of funds is more stable in an easing cycle, providing " +
      "a structural NIM compression buffer vs HBL and UBL. The key variable to monitor " +
      "is MCB's yield-on-earning-assets vs its unusually low funding cost.",
    current:     "12.0% (May 2025) — NIM compression less severe than peers due to CASA buffer",
    trend:       "positive",
  },
  {
    label:       "CASA Ratio — Structural Cost Moat",
    description:
      "MCB's ~68% CASA — consistently the sector's highest — is not a temporary " +
      "phenomenon but a decades-long franchise outcome. The stickiness of MCB's " +
      "current account base (driven by its corporate transaction banking relationships " +
      "and retail penetration in Punjab) is the foundational competitive advantage. " +
      "CASA trajectory above 65% is a sign that the moat is being maintained; " +
      "any sustained decline would be a structural warning signal.",
    current:     "CASA ~68% — sector's highest · strong corporate transaction banking anchor",
    trend:       "positive",
  },
  {
    label:       "Cost-to-Income Ratio — Operating Efficiency",
    description:
      "MCB's C/I of ~38% is the operating excellence metric that distinguishes it " +
      "from all PSX banking peers. Maintenance of sub-40% C/I as revenue grows — " +
      "without sacrificing digital investment or branch quality — would validate that " +
      "MCB is in positive operating leverage territory. Any sustained C/I deterioration " +
      "above 43-44% would signal cost discipline erosion and would compress the premium " +
      "multiple partially.",
    current:     "C/I ~38% — sector's best · positive operating leverage as revenue recovers",
    trend:       "positive",
  },
  {
    label:       "Credit Volume & Advance Growth",
    description:
      "MCB's conservative credit culture has historically meant below-sector advance " +
      "growth. In a private credit recovery cycle (FY26+), MCB is unlikely to be the " +
      "growth leader — but it will capture quality credit at better spread. The trade-off " +
      "is intentional: MCB prioritises credit quality over volume. Any decision to " +
      "accelerate advance growth — if driven by ADR tax optimisation — must be monitored " +
      "for credit quality dilution.",
    current:     "Advance growth moderate — deliberate quality-over-volume credit culture",
    trend:       "neutral",
  },
  {
    label:       "Asset Quality & NPL Coverage",
    description:
      "MCB's NPL ratio (~5%) is the sector's cleanest. Coverage ratio (~95%) is also " +
      "sector-leading, meaning existing NPLs are almost fully provisioned. This " +
      "provides two benefits: earnings quality (low provisioning drag) and balance " +
      "sheet strength (minimal hidden credit risk). Asset quality maintenance is the " +
      "key variable to monitor as MCB incrementally grows its advance book in the " +
      "credit recovery cycle.",
    current:     "NPL ratio ~5% · coverage ~95% · cleanest loan book in the sector",
    trend:       "positive",
  },
  {
    label:       "Effective Tax Rate — 53% Sector-Wide Overhang",
    description:
      "Pakistan's ~53% banking ETR suppresses MCB's ROE from a pre-tax ~22-25% to a " +
      "post-tax ~18-20%. This is the single most significant suppressor of MCB's " +
      "P/E and P/B multiples vs international banking peers. ETR reduction is the " +
      "highest-magnitude re-rating catalyst for MCB specifically — given that MCB has " +
      "the highest pre-tax earnings quality among PSX banks. A 5ppt ETR cut would " +
      "translate to ~12-14% EPS uplift — larger in percentage than peers at equal ETR.",
    current:     "ETR ~53% — primary re-rating overhang; Federal Budget relief remains the key variable",
    trend:       "watch",
  },
];

// -- Risks --------------------------------------------------------------------

export const MCB_RISKS: RiskItem[] = [
  {
    label:       "ETR Persistence — Structural ROE Cap",
    description:
      "The 53% effective tax rate is the primary structural risk to MCB's investment " +
      "case. Without ETR relief, MCB's post-tax ROE is capped at ~18-20% regardless of " +
      "operating performance — a lower level than the 25%+ achievable in a normalised " +
      "tax environment. Long-term persistence of the super tax would permanently " +
      "reduce MCB's compounding return profile.",
    severity:    "high",
  },
  {
    label:       "CASA Erosion Risk — Digital Disruption",
    description:
      "MCB's primary competitive advantage is its CASA ratio. A structural decline in " +
      "CASA — driven by digital wallet substitution of current accounts, mobile banking " +
      "competition, or corporate cash management migration — would erode MCB's cost-of-funds " +
      "advantage and compress NIM. This is a slow-moving structural risk, not an " +
      "immediate threat, but the direction of CASA over 3-5 years is a critical " +
      "monitoring variable.",
    severity:    "medium",
  },
  {
    label:       "Volume Growth Underperformance in Credit Recovery",
    description:
      "MCB's conservative credit culture, while producing the cleanest loan book, " +
      "means it may underperform sector advance growth in the credit recovery cycle. " +
      "If private credit rebounds strongly and competitors capture disproportionate " +
      "volume, MCB's earnings growth could lag peers despite its superior margins. " +
      "This is a relative performance risk, not a balance sheet risk.",
    severity:    "low",
  },
  {
    label:       "Concentration in Punjab / Domestic Economy",
    description:
      "Unlike HBL, MCB has minimal international operations — making it almost entirely " +
      "dependent on Pakistan's domestic macro environment. A prolonged economic slowdown, " +
      "PKR devaluation cycle, or structural tax changes that do not apply to international " +
      "operations would disproportionately impact MCB vs internationally diversified peers.",
    severity:    "low",
  },
];

// -- Catalysts ----------------------------------------------------------------

export const MCB_CATALYSTS: CatalystItem[] = [
  {
    label:       "Federal Budget ETR Relief — Highest EPS Leverage",
    description:
      "Given MCB's highest pre-tax earnings quality in the sector, any banking ETR " +
      "reduction (super tax phase-out or ADR threshold adjustment) has the largest " +
      "proportional EPS uplift for MCB. A 5ppt ETR cut translates to ~12-14% post-tax " +
      "EPS improvement — more than any other PSX bank on a percentage basis. This " +
      "remains the highest-magnitude near-term re-rating catalyst.",
    horizon:     "near",
  },
  {
    label:       "Positive Operating Leverage in Revenue Recovery",
    description:
      "As SBP rate cuts stabilise and private credit volumes recover, MCB's revenue " +
      "base expands. Given a fixed-ish cost base (C/I ~38%), revenue recovery falls " +
      "almost entirely to the bottom line — creating highly convex earnings upside. " +
      "This positive operating leverage is a medium-term earnings acceleration driver " +
      "that would naturally re-rate MCB's P/E upward.",
    horizon:     "medium",
  },
  {
    label:       "Dividend Upside — Highest Payout Capacity",
    description:
      "MCB's capital position (CAR >20%) is the strongest in the sector — providing " +
      "the most headroom for dividend upside or special payouts. As earnings recover, " +
      "MCB's dividend per share has historically moved first and largest among PSX " +
      "banks. A special dividend announcement would be a near-term price catalyst, " +
      "particularly for institutional yield-focused investors.",
    horizon:     "near",
  },
  {
    label:       "Sector Multiple Re-rating — Quality Premium Expansion",
    description:
      "A macro-stabilisation scenario (inflation under control, PKR stable, fiscal " +
      "consolidation continuing) would re-rate the entire PSX banking sector. MCB, " +
      "as the sector's quality benchmark, would lead the re-rating. Any narrowing " +
      "of the discount between MCB's intrinsic value and its traded multiple — " +
      "whether through ETR relief or earnings recovery — creates compounding return " +
      "for holders.",
    horizon:     "long",
  },
];

// -- Valuation ----------------------------------------------------------------

export const MCB_VALUATION_SUMMARY =
  "MCB commands the sector's highest P/E multiple — justified by its superior CASA, " +
  "lowest C/I, and cleanest loan book. At 5-7x forward P/E, MCB is not cheap on an " +
  "absolute basis — but relative to its ROE, growth prospects, and quality metrics, " +
  "the premium is rational. The most compelling entry signal is not price alone but " +
  "the combination of depressed ETR expectations and a forward EPS trough — when " +
  "both resolve, MCB re-rates rapidly. At 8-12% dividend yield (at various price " +
  "levels), MCB provides income investors a high-quality yield anchor with re-rating " +
  "optionality attached.";

export const MCB_VALUATION_HISTORICAL_RANGE =
  "MCB P/E has ranged 4x (peak stress) to 10x (recovery peaks). " +
  "P/B of 1.0-1.5x reflects consistent ROE premium vs sector. " +
  "Current multiples compress toward the lower end of the range — ETR is the primary distortion.";

export const MCB_VALUATION_PEER_CONTEXT =
  "MCB's P/E premium over HBL and UBL (typically +25-40%) reflects the CASA, C/I, " +
  "and NPL quality gap. This premium has persisted across rate cycles. The premium " +
  "is rational as long as MCB maintains CASA above 65% and C/I below 42%.";

export const MCB_VALUATION_POINTS: ValuationPoint[] = [
  {
    metric:  "P/E Ratio",
    current: "5-7x",
    context: "Sector premium — justified by ROE",
    signal:  "fair",
  },
  {
    metric:  "P/B Ratio",
    current: "~1.1-1.3x",
    context: "Premium to book — reflects ROE quality",
    signal:  "fair",
  },
  {
    metric:  "Div Yield",
    current: "8-12%",
    context: "High yield, highest payout capacity",
    signal:  "cheap",
  },
  {
    metric:  "ROE",
    current: "~18-22%",
    context: "Sector-highest — suppressed only by ETR",
    signal:  "cheap",
  },
];

// -- Dividend commentary ------------------------------------------------------

export const MCB_DIVIDEND_COMMENTARY =
  "MCB is Pakistan's most reliable large-cap dividend payer — with an unbroken " +
  "dividend history spanning multiple economic cycles, currency crises, and political " +
  "transitions. The combination of sector-leading ROE, lowest C/I, and strongest CAR " +
  "(>20%) means MCB's dividend payout capacity is structurally the highest in the " +
  "banking sector. DPS has historically ranged from Rs20-35, with consistent interim " +
  "and final dividend announcements. MCB's dividend discipline — maintaining payouts " +
  "even in compressed earnings years — reflects board confidence in earnings normalisation.";

export const MCB_DIVIDEND_YIELD_POSITIONING =
  "MCB's dividend yield of 8-12% (at various price points) — combined with its " +
  "quality premium multiple — makes it the most attractive risk-adjusted income " +
  "holding in the PSX banking sector. Unlike some peers, MCB's dividend is not " +
  "a yield-trap signal — it reflects genuine earnings quality and capital surplus.";

export const MCB_DIVIDEND_CONSISTENCY_NOTE =
  "Unbroken dividend history across all economic stress periods in the past two decades. " +
  "One of only two PSX large-caps to have maintained dividends through the IMF " +
  "program of FY23-24. CAR >20% provides exceptional dividend sustainability buffer.";
