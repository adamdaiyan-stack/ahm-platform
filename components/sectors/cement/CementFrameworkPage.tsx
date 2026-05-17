// components/sectors/cement/CementFrameworkPage.tsx
//
// CEMENT SECTOR — Framework Implementation
//
// Follows the official sector framework template exactly.
// Reference: docs/sectors/sector-framework-template.md
// Gold standard: components/sectors/banking/BankingFrameworkPage.tsx
//
// THREE-LEVEL STRUCTURE
//   L1 — Retail Overview  (always visible)
//     Hero stats · Live snapshot · 6 key drivers · Intelligence summary
//
//   L2 — Advanced Analytics (expandable, 10 ExpandableSection blocks)
//     Each section has a takeaway (standalone 2-4 sentence insight)
//     Full HTML content from data/sectors/cement.ts via HtmlTab
//
//   L3 — Research Layer (institutional)
//     Live research_reports rows + structured placeholder
//
// NAV: sticky desktop sidebar + mobile horizontal pill strip
//   13 nav items across L1 / L2 / L3 groups

import { getCompaniesBySymbols }           from "@/services/api/companies";
import { getReportsBySector }              from "@/services/api/research";
import { getSectorBySlug, getSectorDrivers } from "@/services/api/intelligence";
import { buildSectorConfig }               from "@/lib/sector-adapter";
import { CEMENT_SYMBOLS }        from "@/constants";
import cementData                from "@/data/sectors/cement";

import { SectorPageFrame }   from "@/components/sectors/framework";
import { ExpandableSection } from "@/components/sectors/framework";
import type {
  SectorFrameworkConfig,
  NavItem,
} from "@/components/sectors/framework";

// ── Static Level-1 config ─────────────────────────────────────────────────────
// Pure serialisable data — no ReactNode. See sector-framework-template.md §4.

const CEMENT_CONFIG: SectorFrameworkConfig = {
  slug:        "cement",
  name:        "Cement",
  accentColor: "#9b8b6e",
  subtitle:
    "Pakistan is the fifth-largest cement producer globally with 86.7Mt of installed capacity. " +
    "The sector is the primary proxy for the country's construction and infrastructure cycle — " +
    "directly driven by PSDP disbursements, private housing demand, and coal cost dynamics. " +
    "Structural overcapacity keeps domestic pricing power constrained; energy management and " +
    "geographic export access are the primary earnings differentiators.",
  stats: [
    { val: "86.7 Mt",  lbl: "Total Installed Capacity FY24" },
    { val: "54–61%",   lbl: "Average Capacity Utilisation" },
    { val: "$593M",    lbl: "Combined Listed PAT FY25 (+38% YoY)" },
    { val: "~31%",     lbl: "Sector Average Gross Margin FY25" },
    { val: "$47.6/t",  lbl: "Sector Avg EV/ton (below global peers)" },
  ],
  drivers: [
    {
      label:       "Coal Cost & Supply",
      description:
        "Coal is 55–65% of direct production cost. Three sources compete: Richards Bay " +
        "($85–110/ton), Afghan coal ($93–162/ton, supply disrupted FY26), and domestic " +
        "Pakistani coal (~$93/ton). Afghan coal availability is binary — disruptions force " +
        "immediate reversion to Richards Bay. MLCF is most exposed; LUCK (South, RB-based) " +
        "is least affected.",
      current:     "Afghan supply disrupted — northern producers on Richards Bay",
      trend:       "negative",
    },
    {
      label:       "Retention Price",
      description:
        "Net price received per 50kg bag after dealer margins, freight, excise, and taxes. " +
        "This — not the retail sticker price — is the actual top-line variable. FY26 retention " +
        "prices are down ~6% YoY, the primary driver of projected ~9% sector PAT contraction " +
        "in 2QFY26 despite better dispatch volumes.",
      current:     "~Rs790–920/bag · down ~6% YoY",
      trend:       "negative",
    },
    {
      label:       "Domestic Dispatches & PSDP",
      description:
        "Monthly APCMA dispatch data provides near-real-time volume signals ahead of quarterly " +
        "results. PSDP allocation drives public-sector cement demand but actual utilisation " +
        "frequently runs 40–60% below headline allocations. Below 60% sector utilisation, " +
        "pricing discipline breaks down.",
      current:     "8MFY25 North dispatches -5.3% YoY · South exports +34.7% YoY",
      trend:       "watch",
    },
    {
      label:       "Power Source (WHR / Captive)",
      description:
        "Grid power at Rs36–38/unit vs WHR or captive power at Rs18–25/unit — roughly half " +
        "the cost. Once installed, a permanent structural margin advantage. KOHC's 30MW coal " +
        "captive power plant (FY26 commissioning) is the sector's largest near-term margin " +
        "catalyst. LUCK runs 65% renewable power at its Karachi plant.",
      current:     "KOHC CPP commissioning FY26 · LUCK 65% renewable at Karachi",
      trend:       "positive",
    },
    {
      label:       "SBP Policy Rate",
      description:
        "Rate cuts directly reduce finance costs for leveraged cement companies. MLCF is most " +
        "exposed — finance costs surged 50% in FY24. Each 100bps rate cut adds Rs0.5–2/share " +
        "for high-leverage peers. LUCK and KOHC are largely rate-insensitive due to low debt.",
      current:     "12.0% (May 2025 — easing cycle, benefit accruing to MLCF/DGKC)",
      trend:       "positive",
    },
    {
      label:       "Structural Overcapacity",
      description:
        "86.7Mt installed vs ~48–52Mt domestic demand. Utilisation at 54–61% structurally " +
        "limits pricing power. Meaningful sustained pricing power has only appeared historically " +
        "above ~75% utilisation. New capacity additions — several underway — further depress " +
        "utilisation and are an endemic multi-year sector constraint.",
      current:     "54–61% utilisation · no single producer can enforce pricing",
      trend:       "negative",
    },
  ],
  intelligenceSummary:
    "Pakistan's cement sector enters FY26 under simultaneous retention-price and input-cost " +
    "pressure — a double headwind that is driving projected ~9% sector PAT contraction despite " +
    "healthy dispatch volumes. The Afghan coal supply disruption has erased the cost advantage " +
    "that northern producers relied on, forcing reversion to Richards Bay. Against this, the " +
    "rate-easing cycle is providing meaningful relief to leveraged companies (MLCF, DGKC), " +
    "and captive power investments (KOHC's 30MW CPP, LUCK's Karachi renewables) are permanently " +
    "widening margin gaps between energy-disciplined and grid-dependent producers. " +
    "Selective value exists at current EV/ton multiples ($40–70/ton) — below global cement " +
    "peers — but a re-rating requires either retention price recovery or a structural demand " +
    "uplift from PSDP execution, neither of which has yet materialised.",
};

// ── Navigation items ──────────────────────────────────────────────────────────
// All IDs must exactly match section element IDs.
// L1 IDs are fixed by SectorPageFrame. L2 IDs match ExpandableSection id props.
// Labels max 12 characters — desktop sidebar is 192px.

const CEMENT_NAV: NavItem[] = [
  // L1 — always-visible sections
  { id: "sector-snapshot",     label: "Live Prices",  group: "l1" },
  { id: "sector-drivers",      label: "Key Drivers",  group: "l1" },
  { id: "sector-intelligence", label: "Intelligence", group: "l1" },
  // L2 — expandable analytics (matches ExpandableSection id props below)
  { id: "overview",   label: "Overview",    group: "l2" },
  { id: "economics",  label: "Economics",   group: "l2" },
  { id: "variables",  label: "Variables",   group: "l2" },
  { id: "structure",  label: "N vs S",      group: "l2" },
  { id: "companies",  label: "Companies",   group: "l2" },
  { id: "peers",      label: "Peers",       group: "l2" },
  { id: "risks",      label: "Risks",       group: "l2" },
  { id: "monitor",    label: "Monitor",     group: "l2" },
  { id: "metrics",    label: "Metrics",     group: "l2" },
  { id: "summary",    label: "Summary",     group: "l2" },
  // L3 — research layer
  { id: "sector-research", label: "Research", group: "l3" },
];

// ── HTML tab wrapper ──────────────────────────────────────────────────────────
// Applies sector.css variable scope via .sector-root class.
// Background transparent so SectorPageFrame surface shows through.

function HtmlTab({ html }: { html: string }) {
  return (
    <div className="sector-root" style={{ background: "transparent" }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function tab(id: string): string {
  return cementData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — async server component ───────────────────────────────────────

export default async function CementFrameworkPage() {
  const [companies, reports, sector, drivers] = await Promise.all([
    getCompaniesBySymbols(CEMENT_SYMBOLS),
    getReportsBySector("Cement"),
    getSectorBySlug("cement"),
    getSectorDrivers("cement"),
  ]);

  const config = buildSectorConfig(sector, drivers, CEMENT_CONFIG);

  const analyticsSlot = (
    <>
      {/* 1 — Sector Overview & Production Economics */}
      <ExpandableSection
        id="overview"
        label="Sector Overview & Production Economics"
        badge="Start Here"
        defaultOpen={true}
        takeaway={
          "Pakistan's cement sector produces Portland cement for construction, housing, and " +
          "infrastructure — with 29+ manufacturers, 86.7Mt of installed capacity, and domestic " +
          "demand of only ~48–52Mt. Structural overcapacity is permanent: utilisation at 54–61% " +
          "caps pricing power, making energy management and export geography the primary " +
          "competitive differentiators. Combined listed PAT grew 38% YoY in FY25 to $593M — " +
          "illustrating the sharp earnings leverage when cost and pricing conditions align."
        }
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — Revenue Model & Cost Structure */}
      <ExpandableSection
        id="economics"
        label="Revenue Model & Cost Structure"
        takeaway={
          "Revenue is driven by retention price (net received per bag after dealer margins, " +
          "freight, and taxes — currently Rs790–920/bag) and export USD receipts. Coal dominates " +
          "cost at 55–65% of production — the most volatile and controllable line. Electricity " +
          "adds 15–20%. The earnings leverage is high in both directions: FY25's +38% PAT and " +
          "FY26's projected -9% contraction are both driven by the same retention price and coal " +
          "cost variables moving in opposite directions."
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
          "In order of earnings impact: (1) retention price per bag — even Rs50/bag movement " +
          "produces material EPS change at scale; (2) coal source — Richards Bay vs Afghan vs " +
          "domestic differentiates by Rs1,000–2,000/ton; (3) power source — WHR/captive at " +
          "Rs18–25/unit vs grid at Rs36–38/unit is a permanent margin gap; (4) finance costs — " +
          "100bps rate cut adds Rs0.5–2/share for leveraged peers. ETR swings of 10–20pp create " +
          "quarterly EPS surprises that should not be extrapolated."
        }
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Industry Structure: North vs South */}
      <ExpandableSection
        id="structure"
        label="Industry Structure — North vs South"
        takeaway={
          "Northern market (~72% of domestic consumption): BWCL, LUCK (Pezu), DGKC, KOHC, " +
          "MLCF compete with regional pricing pressure and limited export optionality. " +
          "Southern market (~28% domestic, dominant in exports): LUCK (Karachi), PWCL, ACPL. " +
          "Port access is the dividing structural advantage — southern producers export bulk " +
          "cement competitively; northern producers face prohibitive freight costs. " +
          "LUCK is the only company with scale in both zones simultaneously."
        }
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="Company Profiles — LUCK · BWCL · DGKC · KOHC · MLCF"
        badge="5 Companies"
        takeaway={
          "LUCK: the only producer with dual-zone presence and port silos — a structural export " +
          "moat no peer has replicated. KOHC: sector-leading gross margins (38–42%) through " +
          "energy investment, not pricing power or scale. MLCF: highest earnings leverage when " +
          "Afghan coal is available and rates fall — but most exposed when both reverse. " +
          "BWCL: governance quality through British parent ownership is its distinguishing " +
          "attribute. DGKC: US low-alkali cement export deal is a unique USD-denominated niche."
        }
      >
        <HtmlTab html={tab("companies")} />
      </ExpandableSection>

      {/* 6 — Peer Comparison */}
      <ExpandableSection
        id="peers"
        label="Peer Comparison & Deep Analysis"
        badge="Comparative"
        takeaway={
          "EV/ton ranges from ~$40/ton (MLCF, most leveraged, most cyclical) to ~$70/ton (LUCK, " +
          "export moat premium) across the top five. Sector aggregate EV/ton of ~$47.6 remains " +
          "below global cement peers, sustaining analytical interest for value-oriented investors. " +
          "ROE differentials align with energy positioning — KOHC and LUCK lead on returns; " +
          "MLCF and DGKC are rate-cycle-dependent."
        }
      >
        <HtmlTab html={tab("peers") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Sector Risk Register */}
      <ExpandableSection
        id="risks"
        label="Sector Risk Register"
        badge="Risk"
        takeaway={
          "Six primary risks: (1) structural overcapacity — endemic, not cyclical, at 54–61% " +
          "utilisation; (2) Afghan coal supply disruption — binary, immediate, already " +
          "materialised in FY26; (3) retention price pressure — down ~6% YoY; (4) PSDP " +
          "disbursement shortfall — actual utilisation typically 40–60% of announced allocation; " +
          "(5) energy tariff inflation for grid-dependent plants; (6) finance cost risk for " +
          "leveraged companies if the rate cycle reverses."
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
          "Monthly: APCMA dispatch data (N/S split, company-level volumes) — most important " +
          "leading indicator, published ~10th of each month. Afghan coal border status and " +
          "Richards Bay FOB price. Quarterly: retention price derivation (revenue ÷ dispatches), " +
          "coal cost per ton, capacity utilisation, ETR, and SBP rate decisions. " +
          "Event-driven: KOHC CPP commissioning date, PSDP actual disbursement releases, " +
          "Afghan trade corridor policy changes."
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
          "Core cement KPIs: retention price (Rs/bag), dispatches (Mt), capacity utilisation " +
          "(dispatches ÷ installed), coal cost per ton (COGS-derived), gross margin, and " +
          "EV/ton (primary cross-sectional valuation metric). Finance cost as % of EBIT " +
          "distinguishes leveraged from unleveraged producers. ETR should be tracked across " +
          "multiple quarters — single-quarter spikes are not operational improvement."
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
          "Selective value exists at current EV/ton multiples — below global peers — but " +
          "re-rating requires retention price recovery or structural demand uplift from PSDP " +
          "execution. Near-term FY26 is a headwind quarter: retention prices down, Afghan coal " +
          "disrupted. The medium-term case rests on captive power commissioning (KOHC structural " +
          "margin widening), rate easing benefit (MLCF earnings normalisation), and export " +
          "volume growth (LUCK moat compounding). Energy discipline, not pricing power, " +
          "separates the leaders from the cycle-followers."
        }
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={config}
      navItems={CEMENT_NAV}
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
