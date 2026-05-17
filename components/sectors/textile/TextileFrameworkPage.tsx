// components/sectors/textile/TextileFrameworkPage.tsx
//
// TEXTILE SECTOR — Framework Implementation
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
//     from data/sectors/textiles.ts via HtmlTab
//
//   L3 — Research Layer (institutional)
//     Live research_reports rows + structured placeholder
//
// KEY DISTINCTION FROM BANKING/CEMENT
//   Textiles is an export sector: USD-denominated revenues from Western buyers.
//   PKR depreciation is a tailwind. Western consumer cycles drive demand.
//   Value chain position (spinning vs garments) determines margin profile.

import { getCompaniesBySymbols }           from "@/services/api/companies";
import { getReportsBySector }              from "@/services/api/research";
import { getSectorBySlug, getSectorDrivers } from "@/services/api/intelligence";
import { buildSectorConfig }               from "@/lib/sector-adapter";
import { TEXTILE_SYMBOLS }       from "@/constants";
import textilesData              from "@/data/sectors/textiles";

import { SectorPageFrame }   from "@/components/sectors/framework";
import { ExpandableSection } from "@/components/sectors/framework";
import type {
  SectorFrameworkConfig,
  NavItem,
} from "@/components/sectors/framework";

// ── Static Level-1 config ─────────────────────────────────────────────────────

const TEXTILE_CONFIG: SectorFrameworkConfig = {
  slug:        "textiles",
  name:        "Textiles",
  accentColor: "#7b9fd4",
  subtitle:
    "Pakistan's textile sector is fundamentally an export business — earning in USD and EUR " +
    "from Western buyers, not in rupees from domestic consumers. It accounts for ~60% of " +
    "Pakistan's total exports (~$17B annually) and employs 40% of the industrial workforce. " +
    "Value chain position — from commodity spinning to finished garments — is the single most " +
    "structural determinant of margins, stability, and long-term competitive positioning.",
  stats: [
    { val: "~$17B",  lbl: "Annual Textile Exports" },
    { val: "~60%",   lbl: "Share of Pakistan's Total Exports" },
    { val: "$530M",  lbl: "Interloop FY24 Exports (Sector Leader)" },
    { val: "40%",    lbl: "Industrial Workforce Employed" },
    { val: "34%",    lbl: "Cotton Crop Decline FY25 (YoY)" },
  ],
  drivers: [
    {
      label:       "PKR/USD Exchange Rate",
      description:
        "Textile companies earn revenues in USD/EUR and incur costs in PKR. " +
        "PKR depreciation is a direct, mechanical earnings tailwind — more rupees per " +
        "dollar of export revenue with no operational change required. PKR stability or " +
        "appreciation reverses this benefit. ILP (90%+ USD revenue) is most exposed; " +
        "GATM's 'Ideas' domestic retail partially offsets for that company.",
      current:     "~279–283 PKR/USD · relatively stable",
      trend:       "neutral",
    },
    {
      label:       "Energy Cost vs Peers",
      description:
        "Pakistan's industrial electricity at ~15.4 cents/kWh is double Bangladesh's " +
        "~7 cents/kWh — the primary structural competitiveness gap. Gas tariff for captive " +
        "power rose to Rs4,291/mmbtu (March 2025) with 10–20% further increases scheduled " +
        "through August 2026 under IMF conditionality. RCET (energy subsidy for exporters) " +
        "was discontinued. Companies with solar or captive gas partially offset this — others " +
        "bear the full cost disadvantage.",
      current:     "Gas tariff +10–20% increases scheduled Jul 2025 – Aug 2026",
      trend:       "negative",
    },
    {
      label:       "EFS Distortion",
      description:
        "The Export Facilitation Scheme imposes 18% GST on domestically purchased cotton " +
        "while allowing imported Chinese cotton at 0%. The tax is technically refundable " +
        "but requires 6–10 months — creating a severe liquidity penalty. Result: composites " +
        "are substituting Chinese yarn for domestic cotton, and 100+ spinning mills closed " +
        "in 2025. APTMA membership halved. This is Pakistan's highest-priority textile " +
        "policy failure.",
      current:     "100+ mills closed in 2025 · APTMA membership halved",
      trend:       "negative",
    },
    {
      label:       "Western Buyer Demand",
      description:
        "Pakistan's exporters depend on EU ($3.67B) and US ($2.47B) consumer spending " +
        "on apparel and home textiles. Bangladesh's political disruption in mid-2024 diverted " +
        "orders to Pakistan — a windfall contributing to FY25 export growth. Bangladesh " +
        "normalisation will partially reverse this. EU recession risk and US consumer " +
        "pullback on discretionary apparel are the primary demand-side risks.",
      current:     "Bangladesh windfall fading · EU/US demand soft but stable",
      trend:       "watch",
    },
    {
      label:       "LTFF / ERF Rate",
      description:
        "SBP's Long-Term Financing Facility (LTFF) and Export Refinance Facility (ERF) " +
        "provide subsidised credit to exporters at ~3% below the policy rate. The 1,100bps " +
        "improvement in LTFF/ERF rates through 2024–25 (from ~16.5% to ~8%) is the single " +
        "largest positive EPS driver for leveraged textile companies — NML, GATM, and KTML " +
        "benefit most. Any rate reversal would immediately tighten working capital costs.",
      current:     "~8% LTFF/ERF · 1,100bps improvement since peak",
      trend:       "positive",
    },
    {
      label:       "Cotton Price & Supply",
      description:
        "Raw cotton is 50–60% of production cost for spinners and composites. Pakistan's " +
        "domestic cotton crop fell 34% YoY in FY25 — from ~15M bales historically to ~5–6M " +
        "bales — forcing increased import dependence. The EFS distortion compounds this: " +
        "even at similar prices, domestic cotton carries a 6–10 month refund lag. NML and " +
        "GATM are most exposed. ILP, which uses processed yarn, is relatively insulated.",
      current:     "Rs16,700/maund locally · crop at multi-decade low",
      trend:       "watch",
    },
  ],
  intelligenceSummary:
    "Pakistan's textile sector enters FY26 at an inflection point where the tailwinds and " +
    "headwinds of the past two years are beginning to rotate. The LTFF/ERF rate improvement " +
    "(1,100bps) has provided meaningful finance cost relief to leveraged composites. But " +
    "energy tariff escalation under IMF conditionality is widening Pakistan's already-severe " +
    "cost disadvantage vs Bangladesh and Vietnam. The EFS distortion is destroying the " +
    "domestic spinning supply chain at an accelerating pace — 100+ mills closed in 2025 — " +
    "with no near-term policy correction in sight. Against this structural backdrop, " +
    "value chain migration toward finished garments remains the only durable path to margin " +
    "improvement: ILP's $530M→$700M export growth trajectory and GATM's 'Ideas' domestic " +
    "retail expansion represent the two most differentiated structural stories in listed " +
    "textiles. NML's recovery from FY25's 35.1% earnings decline represents the clearest " +
    "cyclical leverage opportunity when cost inputs normalise simultaneously.",
};

// ── Navigation items ──────────────────────────────────────────────────────────
// All IDs must exactly match section element IDs.
// L1 IDs are fixed by SectorPageFrame. L2 IDs match ExpandableSection id props.
// Labels max 12 characters.

const TEXTILE_NAV: NavItem[] = [
  // L1 — always-visible sections
  { id: "sector-snapshot",     label: "Live Prices",  group: "l1" },
  { id: "sector-drivers",      label: "Key Drivers",  group: "l1" },
  { id: "sector-intelligence", label: "Intelligence", group: "l1" },
  // L2 — expandable analytics
  { id: "overview",   label: "Overview",    group: "l2" },
  { id: "economics",  label: "Economics",   group: "l2" },
  { id: "variables",  label: "Variables",   group: "l2" },
  { id: "structure",  label: "Structure",   group: "l2" },
  { id: "companies",  label: "Companies",   group: "l2" },
  { id: "peergrid",   label: "Peers",       group: "l2" },
  { id: "risks",      label: "Risks",       group: "l2" },
  { id: "monitor",    label: "Monitor",     group: "l2" },
  { id: "metrics",    label: "Metrics",     group: "l2" },
  { id: "summary",    label: "Summary",     group: "l2" },
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
  return textilesData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — async server component ───────────────────────────────────────

export default async function TextileFrameworkPage() {
  const [companies, reports, sector, drivers] = await Promise.all([
    getCompaniesBySymbols(TEXTILE_SYMBOLS),
    getReportsBySector("Textiles"),
    getSectorBySlug("textiles"),
    getSectorDrivers("textiles"),
  ]);

  const config = buildSectorConfig(sector, drivers, TEXTILE_CONFIG);

  const analyticsSlot = (
    <>
      {/* 1 — Sector Overview */}
      <ExpandableSection
        id="overview"
        label="Sector Overview — Export Business, Not Domestic Industry"
        badge="Start Here"
        defaultOpen={true}
        takeaway={
          "Pakistan's textile sector earns in USD from Western buyers — not in rupees from " +
          "domestic consumers. This single distinction separates it analytically from every " +
          "other PSX sector. PKR depreciation is a tailwind, Western consumer cycles drive " +
          "demand, and ESG credentials set in Brussels and New York are the entry ticket to " +
          "top-tier buyer relationships. The sector spans a complete production chain from " +
          "cotton ginning to finished garments — value chain position determines margin " +
          "profile more than any other single variable."
        }
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — Economics & Revenue Model */}
      <ExpandableSection
        id="economics"
        label="Revenue Model & Cost Structure"
        takeaway={
          "Revenue is earned in USD/EUR from international buyers; costs are incurred in PKR " +
          "(labour, domestic utilities, domestic inputs). Cotton is 50–60% of COGS for spinners " +
          "and composites. Energy (electricity and gas) adds 15–25%. Finance costs are " +
          "disproportionately high vs other PSX sectors. Value chain position is the structural " +
          "determinant: spinning earns 6–10% gross margin; finished garments earn 15–25%. " +
          "GATM's 'Ideas' domestic retail is the only PKR-denominated revenue buffer " +
          "among listed textile companies."
        }
      >
        <HtmlTab html={tab("economics")} />
      </ExpandableSection>

      {/* 3 — Key Variables & Earnings Sensitivity */}
      <ExpandableSection
        id="variables"
        label="Key Variables & Earnings Sensitivity"
        badge="Analytical"
        takeaway={
          "Six simultaneous variables drive textile EPS — more interacting inputs than any " +
          "other PSX sector. In order of earnings impact: (1) PKR/USD rate — mechanical " +
          "translation on all USD export revenues; (2) energy cost vs Bangladesh benchmark — " +
          "Pakistan's 2x disadvantage is the structural competitiveness gap; (3) cotton price " +
          "and EFS distortion — 50–60% of COGS for composites, compounded by 6–10 month " +
          "GST refund lag; (4) global order volumes from Western buyers; (5) LTFF/ERF " +
          "rate on leveraged working capital; (6) GSP+ status with the EU."
        }
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Value Chain & Industry Structure */}
      <ExpandableSection
        id="structure"
        label="Value Chain & Industry Structure"
        takeaway={
          "The textile value chain runs from raw cotton through ginning, spinning, weaving, " +
          "processing, stitching, and retail. Each step has different economics and " +
          "investment characteristics. The EFS distortion is accelerating Pakistan's " +
          "structural shift away from domestic spinning — 100+ mills closed in 2025 — " +
          "as composites substitute imported Chinese yarn for domestic cotton. " +
          "The irreversible direction is toward value-added finished products: " +
          "garments and home textiles over yarn and greige fabric."
        }
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="Company Profiles — ILP · NML · GATM · KTML · SAPT"
        badge="5 Companies"
        takeaway={
          "ILP (Interloop): Pakistan's largest textile exporter ($530M FY24), value-added " +
          "specialist with Nike/H&M/Adidas relationships — the only producer with US " +
          "manufacturing presence and LEED Platinum simultaneously. NML (Nishat Mills): " +
          "largest by revenue ($745.5M FY25), highest cyclical earnings leverage when all " +
          "inputs ease together. GATM (Gul Ahmed): the only listed textile company with a " +
          "national branded domestic retail chain ('Ideas'). KTML: analytically a textile " +
          "company plus a cement holding (MLCF). SAPT (Sapphire): home textiles composite."
        }
      >
        <HtmlTab html={tab("companies")} />
      </ExpandableSection>

      {/* 6 — Peer Comparison */}
      <ExpandableSection
        id="peergrid"
        label="Peer Comparison & Deep Analysis"
        badge="Comparative"
        takeaway={
          "ILP trades at a premium on structural grounds — value-added moat, Western brand " +
          "relationships, ESG certifications — and warrants a different analytical framework " +
          "from the composite peers. NML's scale produces the highest absolute operating " +
          "leverage in listed textiles. GATM's dual revenue stream (export + domestic retail) " +
          "requires two-model valuation. KTML requires NTA-adjusted valuation to separate " +
          "textile operations from MLCF's cement asset value. " +
          "P/E and P/B comparisons across these structurally different models are often " +
          "misleading without segment-level adjustment."
        }
      >
        <HtmlTab html={tab("peergrid") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Sector Risk Register */}
      <ExpandableSection
        id="risks"
        label="Sector Risk Register"
        badge="Risk"
        takeaway={
          "Eight material risks: (1) EFS distortion persistence — actively destroying the " +
          "domestic spinning supply chain; (2) energy tariff escalation — IMF-mandated " +
          "increases through August 2026 widen the Bangladesh cost gap; (3) GSP+ suspension " +
          "by the EU — would impose 9–12% tariffs on garment exports; (4) western consumer " +
          "spending weakness — EU recession or US apparel pullback; (5) cotton crop failure — " +
          "domestic production at multi-decade lows; (6) Bangladesh/Vietnam competitive " +
          "recovery; (7) finance cost reversal for leveraged composites; " +
          "(8) ESG compliance escalation by EU buyers."
        }
      >
        <HtmlTab html={tab("risks")} />
      </ExpandableSection>

      {/* 8 — Monitoring Framework */}
      <ExpandableSection
        id="monitor"
        label="Monitoring Framework & Signals"
        badge="Operational"
        takeaway={
          "Monthly: PBS textile export data (total + by category); PKR/USD rate; " +
          "Cotlook A Index (global cotton benchmark); SBP LTFF/ERF rate announcements. " +
          "Quarterly: company revenue, gross margin, cotton cost per unit, energy cost per " +
          "unit, finance cost as % of EBIT, capacity utilisation, and order visibility " +
          "commentary from management. Event-driven: EU GSP+ review milestones; " +
          "SBP policy rate decisions; gas tariff revision orders from OGRA; " +
          "APTMA lobbying outcomes on EFS correction."
        }
      >
        <HtmlTab html={tab("monitor")} />
      </ExpandableSection>

      {/* 9 — Financial Metrics & Ratios Reference */}
      <ExpandableSection
        id="metrics"
        label="Financial Metrics & Ratios Reference"
        badge="Reference"
        takeaway={
          "Core textile KPIs: export revenue in USD (constant-currency baseline), " +
          "gross margin by segment (spinning vs garments vs retail), cotton cost per unit " +
          "(COGS-derived), energy cost as % of COGS, LTFF/ERF rate vs KIBOR spread, " +
          "finance cost as % of EBIT, and capacity utilisation by production stage. " +
          "PKR/USD sensitivity analysis — how each Rs10 movement affects EPS — is " +
          "essential for any EPS forecast. ETR swings from LTFF/solar tax credits " +
          "create single-quarter EPS surprises not indicative of trend."
        }
      >
        <HtmlTab html={tab("metrics")} />
      </ExpandableSection>

      {/* 10 — Executive Summary, Interpretation & Glossary */}
      <ExpandableSection
        id="summary"
        label="Executive Summary, Interpretation & Glossary"
        badge="Full Analysis"
        takeaway={
          "ILP's trajectory — $530M FY24 toward a $700M FY26 target — is the clearest " +
          "structural growth thesis in listed textiles: value-added moat, ESG credentials, " +
          "global brand relationships. NML's recovery from FY25's 35.1% earnings decline " +
          "is the clearest cyclical leverage opportunity if cotton, energy, and finance costs " +
          "ease simultaneously. These two companies represent opposite analytical frameworks: " +
          "ILP is a growth-oriented value-added specialist; NML is a cyclical giant with " +
          "scale-driven operating leverage. Understanding which conditions favour which " +
          "business model is the central recurring question in Pakistan textile analysis."
        }
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={config}
      navItems={TEXTILE_NAV}
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
