// components/sectors/fertiliser/FertiliserFrameworkPage.tsx
//
// FERTILISER SECTOR — Framework Implementation
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
//     from data/sectors/fertiliser.ts via HtmlTab
//
//   L3 — Research Layer (institutional)
//     Live research_reports rows + structured placeholder
//
// KEY DISTINCTION FROM OTHER SECTORS
//   Fertiliser is a gas-input, agriculture-output sector. Profitability is
//   structurally determined by one variable: the gap between the gas tariff a
//   company pays (feed gas cost) and the urea price it receives. FFC and ENGRO
//   hold preferential gas allocations at sub-market rates (Rs580/mmbtu vs
//   Rs1,597/mmbtu for SNGPL-connected peers) — this cost moat is the primary
//   source of sector earnings divergence. FFBL and FATIMA pay higher gas rates
//   and compete on phosphate/NP fertiliser rather than urea economics alone.

import { getCompaniesBySymbols }           from "@/services/api/companies";
import { getReportsBySector }              from "@/services/api/research";
import { getSectorBySlug, getSectorDrivers } from "@/services/api/intelligence";
import { buildSectorConfig }               from "@/lib/sector-adapter"
import { AISectorBrief }       from '@/components/ai/AISectorBrief';
import { FERTILISER_SYMBOLS }    from "@/constants";
import fertiliserData            from "@/data/sectors/fertiliser";

import { SectorPageFrame }   from "@/components/sectors/framework";
import { ExpandableSection } from "@/components/sectors/framework";
import type {
  SectorFrameworkConfig,
  NavItem,
} from "@/components/sectors/framework";

// ── Static Level-1 config ─────────────────────────────────────────────────────

const FERTILISER_CONFIG: SectorFrameworkConfig = {
  slug:        "fertiliser",
  name:        "Fertiliser",
  accentColor: "#52b87a",
  subtitle:
    "Pakistan's listed fertiliser sector is a gas-input, agriculture-output business. " +
    "Four companies — ENGRO, FFC, FFBL, FATIMA — collectively hold ~6.6 Mt of urea " +
    "production capacity and serve the country's 22+ million farming households. " +
    "The sector's defining structural variable is the gas tariff gap: FFC and ENGRO " +
    "hold preferential Mari gas allocations at Rs580/mmbtu vs the Rs1,597/mmbtu " +
    "SNGPL rate paid by others — a cost moat that dominates earnings divergence " +
    "across the listed peer group.",
  stats: [
    { val: "~$4.6B",    lbl: "Sector Market Cap (Sep 2025)"   },
    { val: "Rs489B",    lbl: "Sector PAT CY2024"               },
    { val: "~6.6 Mt",   lbl: "Urea Production Capacity"        },
    { val: "Rs580",     lbl: "FFC Mari Gas Rate (Rs/mmbtu)"     },
    { val: "Rs1,597",   lbl: "SNGPL Gas Rate (Rs/mmbtu)"        },
  ],
  drivers: [
    {
      label:       "Feed Gas Tariff",
      description:
        "Feed gas is the primary raw material for urea production — it accounts for " +
        "~60–70% of total manufacturing cost. The gas tariff a company pays is therefore " +
        "the most powerful determinant of its cost structure and margins. FFC and ENGRO " +
        "hold preferential Mari gas allocations at ~Rs580/mmbtu. Peers on SNGPL pay " +
        "Rs1,597/mmbtu — nearly 3x more. This ~Rs1,000/mmbtu differential translates " +
        "directly to earnings per bag of urea: it is the structural moat that makes FFC " +
        "and ENGRO Fertilisers the dominant earnings contributors in the sector.",
      current:     "FFC/ENGRO: Rs580/mmbtu · SNGPL peers: Rs1,597/mmbtu",
      trend:       "watch",
    },
    {
      label:       "Urea Retail Price",
      description:
        "Urea is sold to farmers at a retail price set partly by market forces, partly " +
        "by government intervention. When urea retail prices rise — driven by supply " +
        "shortages, import cuts, or demand spikes before Rabi and Kharif seasons — " +
        "producer margins expand. When the government caps retail prices or mandates " +
        "discounts to protect farmer economics, it directly compresses per-bag realisations " +
        "for producers. The current retail price environment and its trajectory are the " +
        "most immediate earnings variable after gas cost.",
      current:     "~Rs2,100–2,200/bag · seasonal demand pressure building",
      trend:       "neutral",
    },
    {
      label:       "Agricultural Demand (Kharif/Rabi)",
      description:
        "Fertiliser demand is structurally seasonal. The Kharif season (April–September) " +
        "and Rabi season (October–March) drive two distinct demand peaks. Total annual " +
        "urea demand is ~5.5–6.0 Mt — closely tied to cropped area, particularly wheat, " +
        "rice, cotton, and sugarcane. A strong wheat crop outlook drives Rabi offtake; " +
        "cotton and rice drive Kharif. Poor monsoons, floods, or pest infestations " +
        "(as in FY22's cotton crisis) suppress demand in affected seasons. Agricultural " +
        "credit availability is a secondary but important enabler of farm-level purchases.",
      current:     "Wheat acreage holding · Rabi offtake tracking normal",
      trend:       "positive",
    },
    {
      label:       "Urea Inventory Levels",
      description:
        "Industry inventory position is a real-time signal for margin pressure. High " +
        "inventory (>800 Kt industry-wide) indicates demand weakness or supply glut — " +
        "producers compete on price, discounts emerge, and realisations compress. Low " +
        "inventory (<400 Kt) signals a tight market where producers can hold price or " +
        "push through modest increases. Inventory is reported monthly through industry " +
        "bodies and is the fastest-moving variable for near-term price direction.",
      current:     "~450–550 Kt industry inventory · balanced-to-tight",
      trend:       "positive",
    },
    {
      label:       "GIDC (Gas Infrastructure Dev. Cess)",
      description:
        "GIDC is a government levy on industrial gas consumers — originally intended to " +
        "fund pipeline infrastructure. For fertiliser companies, accumulated GIDC " +
        "arrears represent a multi-billion rupee contingent liability. Following a " +
        "Supreme Court settlement in 2020, companies agreed to pay in installments — but " +
        "periodic renegotiation and new GIDC notifications create recurring earnings " +
        "uncertainty. Any new GIDC levy or revision to arrears payment terms immediately " +
        "affects cash outflows and net earnings for all listed producers.",
      current:     "Installment regime ongoing · periodic renegotiation risk",
      trend:       "watch",
    },
    {
      label:       "Import Policy & DAP Prices",
      description:
        "Pakistan imports ~100% of its DAP (Di-Ammonium Phosphate) requirement — making " +
        "international DAP prices and PKR/USD rate the key cost drivers for FFBL and " +
        "FATIMA's phosphate business. Global DAP prices (which track Chinese export policy " +
        "and global potash supply) set the landed import cost benchmark. When the " +
        "government restricts DAP imports or subsidises them for farmers, it materially " +
        "changes volume and margin dynamics for domestic NP/DAP producers and importers.",
      current:     "Global DAP ~$580–620/t · PKR stable · import window open",
      trend:       "neutral",
    },
  ],
  intelligenceSummary:
    "Pakistan's fertiliser sector is a structurally bifurcated industry where the single " +
    "most important analytical variable — feed gas tariff — determines which companies " +
    "generate institutional-grade returns and which are perpetually margin-constrained. " +
    "FFC is the sector's anchor: preferential Mari gas at Rs580/mmbtu, 100% urea focus, " +
    "high dividend payout ratio, and decades of consistent earnings make it the closest " +
    "thing to a bond proxy in listed equities. ENGRO Fertilisers (subsidiary of ENGRO " +
    "Corp) holds a similar gas advantage and has been investing in expanded capacity. " +
    "FFBL operates a DAP/NP plant on SNGPL gas — structurally disadvantaged on urea but " +
    "partially offset by phosphate exposure. FATIMA benefits from captive gas from its " +
    "own fields, creating a partially self-sufficient cost structure. For investors, the " +
    "key question is rarely 'will Pakistan need fertiliser?' — demand is structurally " +
    "anchored by 22+ million farming households. The question is: at what gas cost, " +
    "at what urea price, and through what policy environment will companies convert that " +
    "demand into distributable cash? FFC and ENGRO answer that question most " +
    "consistently, which is why they dominate sector market cap and dividend yield.",
};

// ── Navigation items ──────────────────────────────────────────────────────────
// All IDs must exactly match section element IDs.
// L1 IDs are fixed by SectorPageFrame. L2 IDs match ExpandableSection id props.
// Labels max 12 characters.

const FERTILISER_NAV: NavItem[] = [
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
  return fertiliserData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — async server component ───────────────────────────────────────

export default async function FertiliserFrameworkPage() {
  const [companies, reports, sector, drivers] = await Promise.all([
    getCompaniesBySymbols(FERTILISER_SYMBOLS),
    getReportsBySector("Fertiliser"),
    getSectorBySlug("fertiliser"),
    getSectorDrivers("fertiliser"),
  ]);

  const config = buildSectorConfig(sector, drivers, FERTILISER_CONFIG);

  const analyticsSlot = (
    <>
      {/* AI Sector Brief — served from ai_outputs, silently absent if not generated */}
      <AISectorBrief sectorSlug="fertiliser" />

      {/* 1 — Sector Overview */}
      <ExpandableSection
        id="overview"
        label="Sector Overview — Gas-Input, Agriculture-Output Business"
        badge="Start Here"
        defaultOpen={true}
        takeaway={
          "Pakistan's fertiliser sector converts natural gas into urea — the country's " +
          "most widely used crop nutrient. The economics are simple in structure but " +
          "policy-complex in practice: gas cost in, urea price out, with government " +
          "intervention on both ends. The ~Rs1,000/mmbtu gap between preferential " +
          "Mari gas (FFC/ENGRO) and SNGPL market gas is the single most consequential " +
          "cost variable in the sector — it drives the persistent earnings gap between " +
          "the high-quality producers and the rest."
        }
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — Economics */}
      <ExpandableSection
        id="economics"
        label="Urea Economics — Cost Structure, Margins & Per-Bag Profitability"
        badge="Level 2 · Fundamentals"
        takeaway={
          "A urea producer's per-bag margin is the spread between its gas-linked " +
          "manufacturing cost and the retail/wholesale price it realises. At FFC's " +
          "preferential gas rate, manufacturing cost per 50kg bag of urea is materially " +
          "lower than at SNGPL rates — creating a structural margin advantage that " +
          "persists regardless of urea price cycles. Understanding the per-bag economics " +
          "at each company's gas rate is the foundation of all fertiliser sector analysis."
        }
      >
        <HtmlTab html={tab("economics")} />
      </ExpandableSection>

      {/* 3 — Gas Sensitivity */}
      <ExpandableSection
        id="variables"
        label="Gas Tariff Sensitivity — How Feed Gas Cost Drives Sector Earnings"
        badge="Level 2 · Quantitative"
        takeaway={
          "A Rs100/mmbtu increase in feed gas tariff reduces urea manufacturing margin " +
          "by approximately Rs30–40 per bag at standard conversion efficiency. For a " +
          "company producing 1 Mt of urea annually (~20 million bags), this equates to " +
          "Rs600M–800M in annualised earnings impact. FFC's Rs580/mmbtu rate vs the " +
          "Rs1,597/mmbtu SNGPL rate represents a Rs42–56B annual pre-tax earnings " +
          "advantage at current production volumes — the structural number that explains " +
          "FFC's dominant market cap and dividend capacity in the sector."
        }
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Sector Structure */}
      <ExpandableSection
        id="structure"
        label="Sector Structure — Urea vs DAP, Feed Gas vs Fuel Gas, Listed vs Unlisted"
        badge="Level 2 · Structural"
        takeaway={
          "The fertiliser sector has two analytically distinct sub-segments: urea " +
          "(domestically produced, gas-dependent, demand-inelastic) and phosphate/DAP " +
          "(largely imported, globally priced, FX-sensitive). FFC and ENGRO are pure " +
          "urea plays. FFBL straddles both. FATIMA has captive gas and a diversified " +
          "product mix. The feed gas vs fuel gas distinction matters enormously: " +
          "feed gas is converted into urea molecules and should be priced separately " +
          "from fuel gas used for plant energy — a distinction with significant " +
          "regulatory and cost implications."
        }
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="The Four Listed Producers — FFC · ENGRO · FFBL · FATIMA"
        badge="Level 2 · Companies"
        takeaway={
          "FFC is the sector benchmark: preferential Mari gas, pure urea focus, 100%+ " +
          "dividend payout, and the most consistent earnings track record of any " +
          "fertiliser company in Pakistan. ENGRO Fertilisers shares the Mari gas " +
          "advantage and has been expanding capacity. FFBL operates on SNGPL gas with " +
          "a DAP/NP product mix — structurally disadvantaged on cost but partially " +
          "insulated by phosphate pricing dynamics. FATIMA's captive gas from its own " +
          "concessions gives it a partially self-determined cost structure, making it " +
          "the most distinctive structural story in listed fertilisers."
        }
      >
        <HtmlTab html={tab("companies")} />
      </ExpandableSection>

      {/* 6 — Peer Comparison */}
      <ExpandableSection
        id="peers"
        label="Peer Comparison — Valuation, Margins & Dividend Yield Analysis"
        badge="Level 2 · Comparative"
        takeaway={
          "FFC consistently trades at a P/E premium to FFBL — justified by its superior " +
          "cost structure, higher dividend payout, and more predictable earnings. The " +
          "ENGRO vs FFC comparison is more nuanced: both share the Mari gas advantage, " +
          "but ENGRO's holding company structure and diversified conglomerate exposure " +
          "introduce complexity that FFC's pure-play status avoids. For dividend-focused " +
          "investors, FFC's yield is often the most attractive in the sector on a " +
          "risk-adjusted basis; for growth-oriented investors, ENGRO's capacity " +
          "expansion story offers more upside optionality."
        }
      >
        <HtmlTab html={tab("peers") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Risk Factors */}
      <ExpandableSection
        id="risks"
        label="Risk Factors — GIDC, Policy Intervention & Demand Disruption"
        badge="Level 2 · Risk"
        takeaway={
          "The three non-negotiable risks in fertiliser are: (1) GIDC — a recurring " +
          "government levy on gas consumers with unresolved arrears and renegotiation " +
          "risk; (2) retail price caps — government intervention to protect farmer " +
          "economics directly compresses producer realisations; (3) gas supply " +
          "curtailment — any reduction in Mari or SNGPL gas availability forces " +
          "production cuts that flow directly to volume-related earnings shortfall. " +
          "Agricultural demand disruption from floods or pest crises is the fourth " +
          "risk, but it tends to be seasonal and mean-reverting."
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
          "The two most actionable monitoring signals for fertiliser are: (1) industry " +
          "monthly urea inventory data — below 400 Kt signals pricing power for " +
          "producers, above 800 Kt signals margin pressure; (2) government gas tariff " +
          "notifications — any OGRA revision to Mari or SNGPL feed gas rates flows " +
          "directly to FFC/ENGRO or FFBL/FATIMA manufacturing costs within one " +
          "quarter. Seasonal demand watch: Kharif offtake (May–August) and Rabi " +
          "offtake (November–February) are the two annual volume confirmation windows."
        }
      >
        <HtmlTab html={tab("monitor")} />
      </ExpandableSection>

      {/* 9 — Key Metrics */}
      <ExpandableSection
        id="metrics"
        label="Key Metrics — Fertiliser Valuation Framework & Critical Ratios"
        badge="Level 2 · Quantitative"
        takeaway={
          "Fertiliser sector valuation in Pakistan centres on P/E, dividend yield, and " +
          "per-bag margin analysis. Because earnings are highly sensitive to gas tariff " +
          "and urea price, analysts typically run scenario analysis across gas rate and " +
          "urea price combinations rather than relying on single-point estimates. " +
          "Dividend yield is the primary institutional valuation anchor for FFC — it is " +
          "often evaluated against T-bill rates as an alternative fixed-income proxy, " +
          "making monetary policy a secondary but meaningful sector driver."
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
          "The fertiliser sector is a policy-mediated, gas-linked, agriculture-serving " +
          "business where the analytical priority is understanding the gas tariff " +
          "structure, not forecasting demand — demand is relatively stable and " +
          "inelastic. FFC is the sector's anchor: a near-bond-proxy instrument with " +
          "high dividend visibility and low analytical complexity. The sector's " +
          "structural risk is not demand destruction — Pakistan's farming population " +
          "cannot substitute urea. The risk is policy interference on both the input " +
          "(gas pricing) and output (urea price caps) sides simultaneously."
        }
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={config}
      navItems={FERTILISER_NAV}
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
