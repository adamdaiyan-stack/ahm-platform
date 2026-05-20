// components/sectors/power/PowerFrameworkPage.tsx
//
// POWER / IPP SECTOR — Framework Implementation
//
// Follows the official sector framework template exactly.
// Reference: docs/sectors/sector-framework-template.md
// Gold standard: components/sectors/banking/BankingFrameworkPage.tsx
//
// THREE-LEVEL STRUCTURE
//   L1 — Retail Overview  (always visible)
//     Hero stats · Live snapshot · 6 key drivers · Intelligence summary
//
//   L2 — Advanced Analytics (10 ExpandableSection blocks)
//     Each section has a standalone takeaway + full HTML content
//     from data/sectors/power-ipp.ts via HtmlTab
//
//   L3 — Research Layer (institutional)
//     Live research_reports rows + structured placeholder
//
// KEY DISTINCTION FROM OTHER SECTORS
//   Power / IPP companies do not sell electricity on a spot market — they sell
//   capacity. The defining revenue mechanism is the capacity payment: a fixed
//   monthly payment from CPPA-G (Central Power Purchasing Agency) for having
//   generation capacity available, regardless of whether the plant is dispatched.
//   This means IPP earnings are structurally more like lease receivables than
//   commodity sales — predictable in structure but impaired by circular debt.
//   Pakistan has Rs5.73T peak circular debt in the power chain (Jul 2024), making
//   receivable quality the dominant analytical variable, not generation volume.

import { getCompaniesBySymbols }           from "@/services/api/companies";
import { getReportsBySector }              from "@/services/api/research";
import { getSectorBySlug, getSectorDrivers } from "@/services/api/intelligence";
import { buildSectorConfig }               from "@/lib/sector-adapter"
import { AISectorBrief }       from '@/components/ai/AISectorBrief';
import { POWER_SYMBOLS }         from "@/constants";
import powerData                 from "@/data/sectors/power-ipp";

import { SectorPageFrame }   from "@/components/sectors/framework";
import { ExpandableSection } from "@/components/sectors/framework";
import type {
  SectorFrameworkConfig,
  NavItem,
} from "@/components/sectors/framework";

// ── Static Level-1 config ─────────────────────────────────────────────────────

const POWER_CONFIG: SectorFrameworkConfig = {
  slug:        "power-ipp",
  name:        "Power",
  accentColor: "#e8c547",
  subtitle:
    "Pakistan's listed independent power producers (IPPs) earn through a capacity " +
    "payment model — receiving fixed monthly payments from CPPA-G for available " +
    "generation capacity, independent of actual dispatch. With ~41,000 MW of installed " +
    "capacity against 12–13 GW of actual demand, the sector is structurally over-built. " +
    "The defining analytical challenge is not generation economics — it is receivable " +
    "quality: Rs5.73T in peak circular debt has made cash collection the primary " +
    "determinant of whether IPP profits translate into dividends investors actually receive.",
  stats: [
    { val: "Rs2.1T",    lbl: "Annual Capacity Payments CY2024"      },
    { val: "Rs5.73T",   lbl: "Peak Circular Debt (Jul 2024)"         },
    { val: "~41,000 MW",lbl: "Installed Capacity (vs 12–13 GW peak)" },
    { val: "Rs1.225T",  lbl: "Circular Debt Refinancing (Sep 2025)"  },
    { val: "5+ PPAs",   lbl: "Terminated or Renegotiated FY25"       },
  ],
  drivers: [
    {
      label:       "Circular Debt & Collections",
      description:
        "Circular debt is the dominant analytical variable for Pakistan's power sector. " +
        "CPPA-G (the central buyer) accumulates unpaid dues to IPPs when government " +
        "transfers are insufficient to cover capacity payments. IPPs book revenue when " +
        "invoiced — but cash arrives months or years later, if at all. HUBC, KAPCO, NPL " +
        "and NCPL all carry significant receivable balances. The Rs1.225T refinancing " +
        "announced in September 2025 provided partial relief, but the structural " +
        "imbalance between capacity cost and consumer tariff collection persists. " +
        "Any material debt settlement is a sector-wide re-rating catalyst.",
      current:     "Rs5.73T peak → Rs1.225T partial refinancing Sep 2025",
      trend:       "watch",
    },
    {
      label:       "Capacity Payment Tariff",
      description:
        "IPP capacity payments are set in Power Purchase Agreements (PPAs) and " +
        "notified by NEPRA. They are denominated in PKR but partially indexed to USD " +
        "and CPI — meaning PKR depreciation mechanically increases the rupee value of " +
        "capacity payments for FX-indexed plants. HUBC's older-generation 1,292 MW " +
        "coal plant and KAPCO's furnace-oil plant have different indexation structures. " +
        "NEPRA tariff determinations and PPA renegotiations (5+ agreements in FY25) are " +
        "the direct policy mechanism through which capacity payment levels change.",
      current:     "PPA renegotiations ongoing · NEPRA reviewing multiple tariffs",
      trend:       "negative",
    },
    {
      label:       "Fuel Cost Pass-Through",
      description:
        "Fuel costs for thermal IPPs are passed through to consumers via the tariff — " +
        "IPPs are not exposed to fuel price risk in theory. In practice, timing mismatches " +
        "between fuel cost incurrence and tariff recovery create working capital stress. " +
        "HUBC's coal plant faces this for imported coal; KAPCO faces it for furnace oil. " +
        "Hydel plants (NPL on Jhelum River) have no fuel cost — making hydel IPPs the " +
        "structurally cleanest earnings profile in the sector. The fuel cost pass-through " +
        "mechanism is also the channel through which global commodity prices indirectly " +
        "affect power sector circular debt accumulation.",
      current:     "Coal ~$95–105/t · fuel pass-through lags creating working capital stress",
      trend:       "neutral",
    },
    {
      label:       "NEPRA Tariff Determinations",
      description:
        "NEPRA (National Electric Power Regulatory Authority) sets consumer electricity " +
        "tariffs and notifies IPP-specific capacity payment rates. When NEPRA revises " +
        "tariffs upward — as under IMF conditionality in FY24–25 — it increases revenue " +
        "recovery from consumers, which theoretically reduces circular debt accumulation. " +
        "However, tariff increases also suppress electricity demand and increase theft, " +
        "creating a non-linear relationship between tariff and collection. NEPRA decisions " +
        "are the single most important policy variable to monitor for the power sector.",
      current:     "IMF-mandated tariff increases implemented · demand response elevated",
      trend:       "watch",
    },
    {
      label:       "Hydel vs Thermal Dispatch",
      description:
        "Hydel plants are dispatched first (lowest marginal cost) in Pakistan's merit " +
        "order dispatch system. During high-water years (July–September monsoon), increased " +
        "hydel availability reduces thermal plant dispatch — cutting fuel revenue but not " +
        "capacity payments. NPL (Nandipur Power, Jhelum River hydel) benefits directly " +
        "from high water flow. Thermal IPPs like HUBC and KAPCO receive capacity payments " +
        "regardless, but reduced dispatch affects their O&M recovery and cash flow timing. " +
        "The hydro season is therefore both a production variable for hydel and a " +
        "competitive displacement variable for thermal plants.",
      current:     "Monsoon season approaching · hydel dispatch expected to rise Jul–Sep",
      trend:       "neutral",
    },
    {
      label:       "PKR/USD Rate & FX Indexation",
      description:
        "Multiple IPP capacity payment agreements include partial USD indexation — " +
        "typically covering imported fuel cost components, O&M escalation, and debt " +
        "service on foreign-currency loans. PKR depreciation mechanically increases " +
        "the rupee value of the USD-indexed portion of capacity payments. This makes " +
        "FX-indexed IPPs partial beneficiaries of currency weakness — a counterintuitive " +
        "feature that distinguishes them from most domestic businesses. The degree of " +
        "FX indexation varies significantly by PPA vintage and plant type.",
      current:     "~279–283 PKR/USD · FX-indexed component supports capacity payment floor",
      trend:       "neutral",
    },
  ],
  intelligenceSummary:
    "Pakistan's power sector is a government-dependent, infrastructure-heavy industry " +
    "where capacity — not output — is the revenue basis. The four listed IPPs " +
    "(HUBC, KAPCO, NPL, NCPL) collectively invoice billions in capacity payments " +
    "annually, but the fraction that arrives as cash depends entirely on whether " +
    "CPPA-G has collected enough from distribution companies, which depends on whether " +
    "the government has made sufficient budget transfers to cover the tariff gap. " +
    "This chain of dependency — from consumer bill collection to government subsidy " +
    "to CPPA-G payment to IPP cash — is Pakistan's circular debt problem in its " +
    "operational form. HUBC is the sector anchor: largest market cap, most diversified " +
    "capacity mix (coal + hydel JV), and historically the highest-profile dividend " +
    "payer among listed IPPs. KAPCO is a mature, furnace-oil plant with declining " +
    "relevance in the merit order but attractive yield when payments arrive. NPL " +
    "is the purest hydel play — lower fuel risk, merit-order advantage, but " +
    "Jhelum River hydrology as the primary production variable. The September 2025 " +
    "Rs1.225T refinancing reduced the immediate circular debt burden, but structural " +
    "reform of the tariff differential — closing the gap between what consumers pay " +
    "and what the full cost of capacity is — remains the sector's unresolved challenge.",
};

// ── Navigation items ──────────────────────────────────────────────────────────
// All IDs must exactly match section element IDs.
// L1 IDs are fixed by SectorPageFrame. L2 IDs match ExpandableSection id props.
// Labels max 12 characters.

const POWER_NAV: NavItem[] = [
  // L1 — always-visible sections
  { id: "sector-snapshot",     label: "Live Prices",  group: "l1" },
  { id: "sector-drivers",      label: "Key Drivers",  group: "l1" },
  { id: "sector-intelligence", label: "Intelligence", group: "l1" },
  // L2 — expandable analytics
  { id: "overview",    label: "Overview",    group: "l2" },
  { id: "economics",   label: "Economics",   group: "l2" },
  { id: "variables",   label: "Sensitivity", group: "l2" },
  { id: "structure",   label: "Structure",   group: "l2" },
  { id: "companies",   label: "Companies",   group: "l2" },
  { id: "peers",       label: "Peers",       group: "l2" },
  { id: "risks",       label: "Risks",       group: "l2" },
  { id: "monitor",     label: "Monitor",     group: "l2" },
  { id: "metrics",     label: "Metrics",     group: "l2" },
  { id: "summary",     label: "Summary",     group: "l2" },
  // L3 — research layer
  { id: "sector-research", label: "Research", group: "l3" },
];

// ── HTML tab wrapper ──────────────────────────────────────────────────────────

function HtmlTab({ html }: { html: string }) {
  return (
    <div className="sector-root" style={{ background: "transparent" }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function tab(id: string): string {
  return powerData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — async server component ───────────────────────────────────────

export default async function PowerFrameworkPage() {
  const [companies, reports, sector, drivers] = await Promise.all([
    getCompaniesBySymbols(POWER_SYMBOLS),
    getReportsBySector("Power"),
    getSectorBySlug("power-ipp"),
    getSectorDrivers("power-ipp"),
  ]);

  const config = buildSectorConfig(sector, drivers, POWER_CONFIG);

  const analyticsSlot = (
    <>
      {/* AI Sector Brief — served from ai_outputs, silently absent if not generated */}
      <AISectorBrief sectorSlug="power-ipp" />

      {/* 1 — Sector Overview */}
      <ExpandableSection
        id="overview"
        label="Sector Overview — Capacity Payments, Not Electricity Sales"
        badge="Start Here"
        defaultOpen={true}
        takeaway={
          "Pakistan's IPPs do not sell electricity — they sell capacity availability. " +
          "The capacity payment model means a plant earns its contracted monthly fee " +
          "whether or not it generates a single unit of power. This transforms the " +
          "analytical lens entirely: the question is not 'how much will they generate?' " +
          "but 'will CPPA-G pay their invoices, and when?' Understanding that " +
          "distinction — capacity payment vs energy payment — is the prerequisite for " +
          "all serious power sector analysis in Pakistan."
        }
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — Economics */}
      <ExpandableSection
        id="economics"
        label="IPP Economics — Capacity Payments, Fuel Pass-Through & Fixed Cost Recovery"
        badge="Level 2 · Fundamentals"
        takeaway={
          "An IPP's income statement is structured around two components: the capacity " +
          "charge (fixed — covering debt service, return on equity, and O&M) and the " +
          "energy charge (variable — covering fuel costs, passed through to consumers). " +
          "The capacity charge is the economic value of the plant. Because it is fixed " +
          "and contractual, it looks like a bond coupon — predictable in structure but " +
          "subject to collection risk from a single counterparty (CPPA-G/government). " +
          "This bond-like profile explains why IPPs trade on yield rather than growth."
        }
      >
        <HtmlTab html={tab("economics")} />
      </ExpandableSection>

      {/* 3 — Variables & Sensitivity */}
      <ExpandableSection
        id="variables"
        label="Circular Debt Sensitivity — How Receivable Delays Flow Into Cash"
        badge="Level 2 · Quantitative"
        takeaway={
          "A 30-day increase in average receivable collection days at HUBC's scale " +
          "represents approximately Rs8–12B of additional working capital tied up in " +
          "unpaid invoices. When circular debt peaks (as at Rs5.73T in July 2024), " +
          "IPPs are effectively financing the government's inability to collect consumer " +
          "tariffs — at their own cost of capital. The financial toll is not default " +
          "risk (government eventually pays) but time value destruction: dividends " +
          "delayed by 12–24 months have materially lower present value than the " +
          "nominal earnings figures suggest."
        }
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Sector Structure */}
      <ExpandableSection
        id="structure"
        label="Sector Structure — IPPs, CPPA-G, DISCOs & the Tariff Chain"
        badge="Level 2 · Structural"
        takeaway={
          "Pakistan's power sector operates as a command-and-control chain: NEPRA sets " +
          "tariffs, CPPA-G buys all generation centrally, DISCOs distribute to consumers, " +
          "and the government subsidises the gap between what consumers pay and what the " +
          "full cost actually is. IPPs sit between CPPA-G (their sole revenue source) and " +
          "their fuel suppliers and lenders. This means IPPs have zero pricing power and " +
          "zero revenue diversification — their only lever is operating efficiency and " +
          "the contractual strength of their PPA terms."
        }
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="The Listed IPPs — HUBC · KAPCO · NPL · NCPL"
        badge="Level 2 · Companies"
        takeaway={
          "HUBC is the sector anchor — 1,292 MW coal plant plus a stake in the Hub " +
          "hydel JV, largest market cap, and the most diversified capacity profile among " +
          "listed IPPs. KAPCO is a mature furnace-oil plant (1,600 MW) with a " +
          "declining merit-order position as fuel oil loses ground to cheaper coal and " +
          "renewables — attractive yield but structural headwind. NPL (Nandipur) is the " +
          "pure hydel story: Jhelum River flow is the primary production variable with " +
          "zero fuel cost and merit-order dispatch priority. NCPL is a coal-fired " +
          "plant in Jamshoro with more recent vintage PPA terms."
        }
      >
        <HtmlTab html={tab("companies")} />
      </ExpandableSection>

      {/* 6 — Peer Comparison */}
      <ExpandableSection
        id="peers"
        label="Peer Comparison — Yield, Receivables & PPA Structure Analysis"
        badge="Level 2 · Comparative"
        takeaway={
          "IPP peer comparison is primarily a yield and receivables exercise, not a " +
          "growth analysis. HUBC historically offers the highest absolute dividend and " +
          "most reliable payout track record. KAPCO trades at an apparent yield premium " +
          "to HUBC but carries higher fuel-mix obsolescence risk. NPL's hydel profile " +
          "commands a structural premium for its zero-fuel-cost advantage. Across all " +
          "four, circular debt receivable days are the primary quality differentiator: " +
          "a lower days-outstanding profile signals superior CPPA-G payment priority " +
          "or more favourable PPA collection terms."
        }
      >
        <HtmlTab html={tab("peers") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Risk Factors */}
      <ExpandableSection
        id="risks"
        label="Risk Factors — PPA Renegotiation, Circular Debt & Regulatory Overreach"
        badge="Level 2 · Risk"
        takeaway={
          "The power sector's existential risk is PPA renegotiation by government — " +
          "demonstrated concretely in FY25 when 5+ agreements were terminated or " +
          "renegotiated, reducing capacity payments retroactively. This political risk " +
          "is structural, not episodic: the government faces permanent pressure to " +
          "reduce the capacity payment burden as it constitutes ~Rs2.1T in annual " +
          "committed outflows. Investors must price in the probability of future PPA " +
          "modifications when valuing IPP earnings streams — they are contractual but " +
          "not immune to sovereign negotiating pressure."
        }
      >
        <HtmlTab html={tab("risks")} />
      </ExpandableSection>

      {/* 8 — Monitoring Framework */}
      <ExpandableSection
        id="monitor"
        label="What to Watch — Key Signals & Monitoring Framework"
        badge="Level 2 · Tactical"
        takeaway={
          "The most actionable monitoring signals for power IPPs are: (1) CPPA-G monthly " +
          "payment releases — any acceleration in government payments directly reduces " +
          "receivable days and improves dividend visibility; (2) NEPRA tariff " +
          "determination announcements — any upward revision reduces circular debt " +
          "accumulation; (3) PPA renegotiation news — government statements on " +
          "IPP contract modifications are the highest-impact single-event risk. " +
          "Seasonal: NPL hydel production in July–September monsoon is the key " +
          "production watch window."
        }
      >
        <HtmlTab html={tab("monitor")} />
      </ExpandableSection>

      {/* 9 — Key Metrics */}
      <ExpandableSection
        id="metrics"
        label="Key Metrics — IPP Valuation Framework & Critical Ratios"
        badge="Level 2 · Quantitative"
        takeaway={
          "Power sector valuation is dominated by dividend yield and receivable quality " +
          "metrics. Analysts typically model three scenarios: (1) base case — current " +
          "CPPA-G payment pace continues; (2) upside — material circular debt settlement " +
          "accelerates cash collection and enables special dividends; (3) downside — " +
          "PPA renegotiation reduces contracted capacity payments. P/E is a secondary " +
          "metric because earnings are accrual-based and disconnect from cash. " +
          "Receivables-adjusted EPS — stripping out accrued but uncollected revenue — " +
          "is the most conservative and institutionally preferred measure."
        }
      >
        <HtmlTab html={tab("metrics")} />
      </ExpandableSection>

      {/* 10 — Summary, Interpretation & Glossary */}
      <ExpandableSection
        id="summary"
        label="Analytical Summary — Full Interpretation Guide & Glossary"
        badge="Level 2 · Synthesis"
        takeaway={
          "Pakistan's power IPP sector is a government-backed yield instrument with " +
          "sovereign collection risk. The business model is structurally sound — " +
          "contracted capacity payments, partially FX-indexed, with fuel cost " +
          "pass-through — but the counterparty (CPPA-G/government) is chronically " +
          "under-resourced to meet its obligations on schedule. The investment thesis " +
          "is not about electricity demand growth or market share; it is about the " +
          "pace and completeness of government payments over a PPA's remaining life. " +
          "HUBC is the clearest expression of this thesis: high contractual visibility, " +
          "large receivable balance, and periodic re-rating when debt settlements occur."
        }
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={config}
      navItems={POWER_NAV}
      snapshotData={companies.map((c) => ({
        symbol:         c.symbol,
        company_name:   c.company_name,
        current_price:  c.current_price,
        change_percent: c.change_percent,
      }))}
      reports={reports.map((r) => ({
        slug:         r.slug,
        title:        r.title,
        rating:       r.rating,
        published_at: r.published_at,
      }))}
      analyticsSlot={analyticsSlot}
    />
  );
}
