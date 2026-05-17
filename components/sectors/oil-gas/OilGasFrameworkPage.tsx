// components/sectors/oil-gas/OilGasFrameworkPage.tsx
//
// OIL & GAS E&P SECTOR — Framework Implementation
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
//     from data/sectors/oil-gas.ts via HtmlTab
//
//   L3 — Research Layer (institutional)
//     Live research_reports rows + structured placeholder
//
// KEY DISTINCTION FROM BANKING/CEMENT/TEXTILE
//   Oil & Gas is a commodity-linked, policy-controlled sector.
//   ~70–75% of revenues come from gas priced by OGRA (government), not markets.
//   Oil revenues are Brent-linked. Circular debt (Rs3T+) is the dominant
//   risk — profits exist on paper but cash collection is structurally impaired.
//   MARI is the quality outlier; OGDC is the sovereign-discount story.

import { getCompaniesBySymbols } from "@/services/api/companies";
import { getReportsBySector }    from "@/services/api/research";
import { getSectorBySlug, getSectorDrivers } from "@/services/api/intelligence";
import { buildSectorConfig }     from "@/lib/sector-adapter";
import { OIL_GAS_SYMBOLS }       from "@/constants";
import oilGasData                from "@/data/sectors/oil-gas";

import { SectorPageFrame }   from "@/components/sectors/framework";
import { ExpandableSection } from "@/components/sectors/framework";
import type {
  SectorFrameworkConfig,
  NavItem,
} from "@/components/sectors/framework";

// ── Static Level-1 config ─────────────────────────────────────────────────────

const OIL_GAS_CONFIG: SectorFrameworkConfig = {
  slug:        "oil-gas",
  name:        "Oil & Gas",
  accentColor: "#d4a843",
  subtitle:
    "Pakistan's listed E&P sector operates at the first link in the energy chain — " +
    "locating reserves, drilling wells, and selling output at the wellhead to gas utilities " +
    "and refineries. Four companies (OGDC, PPL, MARI, POL) hold ~239 Mbbl of oil and ~19 Tcf " +
    "of gas reserves. Gas accounts for ~70–75% of sector revenues — yet gas prices are set by " +
    "OGRA policy, not markets. The defining analytical challenge: earnings are visible, but " +
    "Rs3.0T+ in circular debt means cash collection is structurally impaired.",
  stats: [
    { val: "$4.15B",   lbl: "OGDC Market Cap"              },
    { val: "Rs247B",   lbl: "4-Co Combined PAT (1H FY24)"  },
    { val: "~239 Mbbl",lbl: "Listed E&P Oil Reserves"      },
    { val: "~19 Tcf",  lbl: "Listed E&P Gas Reserves"      },
    { val: "Rs3.0T+",  lbl: "Petroleum Circular Debt"      },
  ],
  drivers: [
    {
      label:       "Brent Crude Oil Price",
      description:
        "Oil revenues are benchmarked to Dated Brent minus a quality discount. A $10/bbl " +
        "move in Brent translates to roughly Rs8–12B incremental annual revenue for OGDC " +
        "and Rs3–5B for POL at current production volumes. MARI is almost entirely gas — " +
        "minimal direct oil price sensitivity. OGDC and POL are the primary Brent proxies " +
        "in listed E&P. The relationship is direct and mechanical at the realisation level.",
      current:     "~$78–82/bbl (May 2026) · OPEC+ managing supply",
      trend:       "neutral",
    },
    {
      label:       "Gas Wellhead Price (OGRA Policy)",
      description:
        "Unlike oil, gas prices are not market-determined. OGRA issues wellhead price " +
        "notifications under a formula derived from Petroleum Concession Agreements. " +
        "PPL and MARI earn the majority of revenues from gas at OGRA-notified rates. " +
        "Price revisions are infrequent and historically lagged inflation — compressing " +
        "real returns in USD terms even as nominal rupee revenues grow. Under IMF " +
        "conditionality, the government has been revising gas prices upward — a multi-year " +
        "tailwind for gas-heavy E&Ps if the revision trajectory holds.",
      current:     "Upward revisions ongoing under IMF programme · PPL/MARI beneficiary",
      trend:       "positive",
    },
    {
      label:       "Petroleum Circular Debt",
      description:
        "Rs3.0T+ in receivables sit on E&P balance sheets — owed by gas utilities SNGPL " +
        "and SSGC, which are themselves insolvent without government transfers. This is not " +
        "an abstract accounting risk: it means cash operating flows are a fraction of " +
        "reported earnings. OGDC carries the largest absolute receivable. Any circular " +
        "debt settlement announcement — partial or full — is a significant re-rating " +
        "catalyst. Absence of settlement is the structural discount embedded in sector " +
        "valuations. This is the most important non-oil-price variable to monitor.",
      current:     "Rs3.0T+ and growing · No material settlement in FY25",
      trend:       "negative",
    },
    {
      label:       "PKR/USD Exchange Rate",
      description:
        "Oil revenues are partly USD-indexed (Brent pricing flows through in PKR at " +
        "prevailing exchange rates). Gas revenues are OGRA-notified in PKR — so gas " +
        "realisations have no automatic FX linkage. A weaker PKR means more rupee revenue " +
        "per barrel of oil produced; it does not directly lift gas revenue unless OGRA " +
        "revises wellhead prices to reflect inflation/FX. Companies with higher oil mix " +
        "(POL, OGDC's Dhodak/Toot fields) benefit most from PKR depreciation.",
      current:     "~279–283 PKR/USD · IMF anchor holding",
      trend:       "neutral",
    },
    {
      label:       "Production Decline Rate",
      description:
        "Mature E&P fields decline naturally at ~3–5% annually industry-wide without " +
        "sustained development drilling. OGDC's flagship fields (Dhodak, Toot, Qadirpur) " +
        "are in decline. PPL's Sui and Kandhkot fields are mature. MARI's Kirthar block " +
        "has the strongest near-term production outlook — making it the outlier in sector " +
        "production trajectory. Without new significant discoveries or enhanced recovery " +
        "programmes, total sector output will trend down — a structural volume headwind " +
        "that partially offsets any price or policy tailwinds.",
      current:     "~3–5% annual industry decline · MARI Kirthar holding",
      trend:       "negative",
    },
    {
      label:       "OPEC+ Policy & Global Demand Cycle",
      description:
        "Pakistan's crude oil import price and E&P export pricing benchmarks follow " +
        "global crude markets shaped by OPEC+ supply decisions, US shale output, and " +
        "China demand cycles. An OPEC+ production cut extension supports Brent above " +
        "$75/bbl — the approximate level at which OGDC and POL earnings are materially " +
        "attractive on a P/E basis. A Brent collapse toward $60 would compress E&P " +
        "earnings even if gas prices hold — illustrating the sector's partial but " +
        "meaningful dependence on global energy market conditions.",
      current:     "OPEC+ cuts extended · Middle East risk premium elevated",
      trend:       "watch",
    },
  ],
  intelligenceSummary:
    "Pakistan's E&P sector is a structurally discounted, high-yield, government-exposed " +
    "sector where the analytical work is less about finding the earnings — which are " +
    "largely visible — and more about assessing what fraction of those earnings will " +
    "actually become cash. The four listed companies collectively hold $4–5B in market " +
    "cap and report combined PAT in the hundreds of billions of rupees annually, yet " +
    "carry Rs3.0T+ in receivables from insolvent government utilities. OGDC is the " +
    "sovereign-controlled giant — 65% government-owned, largest reserves, largest " +
    "circular debt receivable, and a dividend that functions as a quasi-fiscal tool. " +
    "PPL is Balochistan-concentrated with deep gas exposure to mature fields. MARI is " +
    "the quality outlier: its Kirthar acreage is prolific, circular debt exposure is " +
    "lower relative to earnings, and its production profile is the most resilient — " +
    "which explains a consistent P/E premium vs the sector. POL is the purest " +
    "oil-price play with the smallest circular debt burden. For equity investors, the " +
    "re-rating catalyst is always the same: a credible, material circular debt " +
    "settlement. Until then, the sector trades at deep discount to fundamental value.",
};

// ── Navigation items ──────────────────────────────────────────────────────────
// All IDs must exactly match section element IDs.
// L1 IDs are fixed by SectorPageFrame. L2 IDs match ExpandableSection id props.
// Labels max 12 characters.

const OIL_GAS_NAV: NavItem[] = [
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
  return oilGasData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — async server component ───────────────────────────────────────

export default async function OilGasFrameworkPage() {
  const [companies, reports, sector, drivers] = await Promise.all([
    getCompaniesBySymbols(OIL_GAS_SYMBOLS),
    getReportsBySector("Oil & Gas"),
    getSectorBySlug("oil-gas"),
    getSectorDrivers("oil-gas"),
  ]);

  // Build fully DB-driven config — OIL_GAS_CONFIG is the typed fallback only.
  const config = buildSectorConfig(sector, drivers, OIL_GAS_CONFIG);

  const analyticsSlot = (
    <>
      {/* 1 — Sector Overview */}
      <ExpandableSection
        id="overview"
        label="Sector Overview — E&P: First Link in the Energy Chain"
        badge="Start Here"
        defaultOpen={true}
        takeaway={
          "Pakistan's E&P sector earns at the wellhead — upstream of refining and " +
          "distribution. Gas accounts for ~70–75% of listed E&P revenues, yet gas " +
          "prices are set by OGRA policy, not markets. This regulatory wedge between " +
          "global energy prices and domestic wellhead realisations is the defining " +
          "analytical fact of the sector. Understanding it separates informed E&P " +
          "analysis from naive oil-price extrapolation."
        }
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — E&P Economics */}
      <ExpandableSection
        id="economics"
        label="E&P Economics — Revenue Structure, Costs & Unit Economics"
        badge="Level 2 · Fundamentals"
        takeaway={
          "E&P unit economics operate on three linked variables: production volume, " +
          "realised price, and cost per barrel (or Mcf). Oil revenues track Dated Brent; " +
          "gas revenues track OGRA wellhead notifications. The gap between the two — and " +
          "the pace at which OGRA revises gas prices against domestic inflation — is the " +
          "structural earnings swing factor for PPL and MARI on an annual basis."
        }
      >
        <HtmlTab html={tab("economics")} />
      </ExpandableSection>

      {/* 3 — Crude Oil Sensitivity */}
      <ExpandableSection
        id="variables"
        label="Crude Oil Sensitivity — How Global Prices Flow Into Earnings"
        badge="Level 2 · Quantitative"
        takeaway={
          "A $10/bbl move in Brent crude translates to roughly Rs8–12B incremental annual " +
          "revenue for OGDC and Rs3–5B for POL at current production volumes. MARI is " +
          "almost entirely insulated from oil price moves — its Kirthar fields are " +
          "gas-dominated. The asymmetric oil exposure across the four listed companies " +
          "is the first lens for positioning around oil price views: POL then OGDC for " +
          "oil bulls; MARI for those agnostic on crude."
        }
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Sector Structure */}
      <ExpandableSection
        id="structure"
        label="Sector Structure — E&P Positioning Within Pakistan's Energy Chain"
        badge="Level 2 · Structural"
        takeaway={
          "The E&P value chain ends at the wellhead. E&P companies sell gas to SNGPL/SSGC " +
          "and crude to refineries — they do not control the downstream price consumers pay. " +
          "This structural position means E&P revenue is capped by OGRA policy (gas) or " +
          "global benchmarks (oil), while costs are entirely domestic PKR. Currency " +
          "depreciation compresses real profitability in USD terms even as nominal rupee " +
          "earnings grow — a key distinction when comparing to international E&P peers."
        }
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="The Four Listed E&P Companies — OGDC · PPL · MARI · POL"
        badge="Level 2 · Companies"
        takeaway={
          "OGDC is the sovereign-controlled giant — 65% government-owned, largest reserves, " +
          "largest circular debt receivable, lowest premium to fundamental value. PPL is " +
          "Balochistan-concentrated with multi-field gas exposure. MARI is the quality " +
          "outlier: prolific Kirthar acreage, strongest reserve life, premium valuation " +
          "justified by production resilience and lower circular debt impairment. POL is " +
          "the purest oil-price play with the smallest overall circular debt burden."
        }
      >
        <HtmlTab html={tab("companies")} />
      </ExpandableSection>

      {/* 6 — Peer Comparison */}
      <ExpandableSection
        id="peers"
        label="Peer Comparison — Valuation, Production & Receivables Analysis"
        badge="Level 2 · Comparative"
        takeaway={
          "Across the four listed E&Ps, MARI consistently trades at a significant P/E " +
          "premium to OGDC and PPL — a premium that reflects superior reserve quality, " +
          "lower circular debt exposure, and more predictable production. The discount on " +
          "OGDC is not a simple value opportunity: it embeds the very real risk that " +
          "government-owed receivables may never fully crystallise into cash. Adjusted for " +
          "circular debt impairment, OGDC's effective P/E is considerably higher than the " +
          "headline figure suggests."
        }
      >
        <HtmlTab html={tab("peers") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Risk Factors */}
      <ExpandableSection
        id="risks"
        label="Risk Factors — Circular Debt, Regulatory & Production Decline"
        badge="Level 2 · Risk"
        takeaway={
          "Circular debt is the non-negotiable risk. Rs3.0T+ in unpaid receivables sit on " +
          "E&P balance sheets — owed by SNGPL and SSGC, which are themselves insolvent " +
          "without government transfers. The risk is not write-off per se, but permanent " +
          "working capital impairment and the political economy of whether fiscal " +
          "consolidation ever frees up cash for settlement. Until a credible settlement " +
          "mechanism is in place, discount-to-fundamental-value is the equilibrium."
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
          "The two most actionable monitoring signals for E&P are: (1) Brent crude price — " +
          "read as a direct proxy for OGDC/POL quarterly earnings before any other analysis; " +
          "(2) OGRA gas price notifications — any upward revision to wellhead gas prices " +
          "flows directly to PPL and MARI PAT with minimal cost offset. Circular debt news " +
          "is structural background noise unless a material settlement package is formally " +
          "announced — in which case it becomes the dominant re-rating catalyst."
        }
      >
        <HtmlTab html={tab("monitor")} />
      </ExpandableSection>

      {/* 9 — Key Metrics */}
      <ExpandableSection
        id="metrics"
        label="Key Metrics — E&P Valuation Framework & Critical Ratios"
        badge="Level 2 · Quantitative"
        takeaway={
          "Standard E&P valuation in Pakistan uses P/E, EV/EBITDA, and NAV (Net Asset " +
          "Value of proved + probable reserves). Because circular debt distorts cash flow, " +
          "analysts adjust EBITDA for uncollected receivables — creating an 'underlying " +
          "EBITDA' that excludes accrued but unreceived revenue. Dividend yield is critical: " +
          "OGDC and PPL function as high-yield instruments for domestic institutions, and " +
          "dividend announcements are major near-term price catalysts regardless of the " +
          "underlying earnings quality."
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
          "The Oil & Gas E&P sector is a policy-regulated, commodity-linked sector where " +
          "headline earnings significantly overstate economic returns due to circular debt. " +
          "The analytical priority is cash quality, not earnings magnitude. MARI is the " +
          "exception — it behaves more like an international E&P in terms of cash " +
          "conversion. The sector requires patience for regulatory risk, tolerance for " +
          "receivable overhang, and conviction that Pakistan's energy policy will " +
          "eventually force a settlement — rewarded historically with high yields and " +
          "sharp re-rating events when debt packages are announced."
        }
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={config}
      navItems={OIL_GAS_NAV}
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
