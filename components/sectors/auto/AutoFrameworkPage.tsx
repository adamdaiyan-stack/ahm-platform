// components/sectors/auto/AutoFrameworkPage.tsx
//
// AUTOMOBILE SECTOR — Framework Implementation
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
//     from data/sectors/auto.ts via HtmlTab
//
//   L3 — Research Layer (institutional)
//     Live research_reports rows + structured placeholder
//
// KEY DISTINCTION FROM OTHER SECTORS
//   Automobile is Pakistan's most consumer-cyclical listed sector. Demand is
//   driven by three variables moving simultaneously: interest rates (auto
//   financing cost), PKR purchasing power (real income), and FX rate (imported
//   parts cost). At 94% household car ownership gap, latent demand is enormous —
//   but effective demand is highly financing-rate sensitive. ATLH (motorcycles)
//   is structurally different from PSMC/INDU/HCAR (passenger cars): motorcycles
//   are largely cash purchases, serving lower-income transport needs, with volume
//   cycles that diverge from car market cycles. The sector is assembler-dominant
//   with high localisation mandates but persistent FX sensitivity on imported CBUs,
//   kits, and components.

import { getCompaniesBySymbols }           from "@/services/api/companies";
import { getReportsBySector }              from "@/services/api/research";
import { getSectorBySlug, getSectorDrivers } from "@/services/api/intelligence";
import { buildSectorConfig }               from "@/lib/sector-adapter";
import { AUTO_SYMBOLS }          from "@/constants";
import autoData                  from "@/data/sectors/auto";

import { SectorPageFrame }   from "@/components/sectors/framework";
import { ExpandableSection } from "@/components/sectors/framework";
import type {
  SectorFrameworkConfig,
  NavItem,
} from "@/components/sectors/framework";

// ── Static Level-1 config ─────────────────────────────────────────────────────

const AUTO_CONFIG: SectorFrameworkConfig = {
  slug:        "auto",
  name:        "Automobile",
  accentColor: "#e07b54",
  subtitle:
    "Pakistan's listed automobile sector spans passenger car assemblers (PSMC, INDU, HCAR) " +
    "and the country's dominant motorcycle producer (ATLH). Car sales reached 173,781 units " +
    "in CY25 (+40% YoY) following a sharp recovery from the FY23 financing crunch. With 94% " +
    "of Pakistani households still without a car, latent demand is structurally enormous — " +
    "but effective demand is acutely sensitive to auto financing rates, purchasing power, " +
    "and the PKR/USD rate that determines the cost of imported parts and kits.",
  stats: [
    { val: "173,781",  lbl: "Cars Sold CY25 (+40% YoY)"       },
    { val: "1.5M+",    lbl: "ATLH Motorcycle Capacity/yr"      },
    { val: "46.7%",    lbl: "PSMC Market Share (Cars)"          },
    { val: "65%+",     lbl: "ATLH Motorcycle Market Share"      },
    { val: "94%",      lbl: "Households Without a Car"          },
  ],
  drivers: [
    {
      label:       "Auto Financing Rates",
      description:
        "Auto financing is the dominant demand lever for passenger cars. At SBP policy " +
        "rates above 20% (as in FY23–24), the monthly payment on a Rs4–5M vehicle " +
        "becomes unaffordable for the vast majority of middle-class buyers — leading to " +
        "booking cancellations, volume collapse, and inventory accumulation. As rates " +
        "decline, affordability recovers sharply: the CY25 +40% YoY recovery was directly " +
        "enabled by rate cuts from 22% to ~13–15%. Each 100bps cut in the SBP policy rate " +
        "is a meaningful demand catalyst for the car assemblers. ATLH motorcycles are " +
        "largely cash purchases and are far less sensitive to financing rates.",
      current:     "SBP policy rate ~12–13% · financing conditions improving",
      trend:       "positive",
    },
    {
      label:       "PKR/USD Exchange Rate",
      description:
        "Pakistan's auto assemblers source imported parts, semi-knocked-down (SKD) kits, " +
        "and fully-built units (CBUs) in USD/JPY. PKR depreciation directly increases " +
        "the rupee cost of these inputs, which assemblers pass through to ex-factory " +
        "prices — compressing real affordability even if nominal prices are raised. " +
        "A 10% PKR depreciation typically results in a 6–8% ex-factory price increase " +
        "across model ranges, reducing effective demand at the margin. INDU (Honda) and " +
        "HCAR (Honda Cars) have particularly high imported component intensity; " +
        "PSMC (Suzuki) and ATLH (Atlas Honda motorcycles) have higher localisation.",
      current:     "~279–283 PKR/USD · relatively stable · cost pressures easing",
      trend:       "neutral",
    },
    {
      label:       "Consumer Purchasing Power",
      description:
        "Real wages and consumer confidence are the macro backdrop for vehicle demand. " +
        "Pakistan's CPI inflation peaked at 38% in May 2023, destroying real purchasing " +
        "power across income segments. As inflation declines (toward 8–12% range in " +
        "FY26) and nominal wages recover, discretionary vehicle purchases gradually " +
        "return. The used-car market competes directly with new vehicles: when new car " +
        "premiums over invoice price disappeared (as in FY24 following the booking " +
        "crisis), used car prices also corrected — improving new car affordability " +
        "further. Income recovery at the middle class is the structural driver.",
      current:     "CPI declining · real income recovering · consumer confidence improving",
      trend:       "positive",
    },
    {
      label:       "Localisation & Parts Cost",
      description:
        "Government localisation policy mandates minimum domestic content thresholds " +
        "for assembled vehicles. Higher localisation reduces FX exposure and cost " +
        "volatility, but requires significant investment in vendor development. ATLH " +
        "has among the highest localisation in the sector for its motorcycle range. " +
        "PSMC's Suzuki models have reasonable localisation for their volume segments. " +
        "New entrants (MG, Changan, DFSK) have low initial localisation, making them " +
        "more vulnerable to PKR depreciation but more competitive on features per " +
        "rupee on launch. The localisation trajectory over a model's life cycle is " +
        "a key medium-term margin expansion driver.",
      current:     "ATLH ~70%+ local content · PSMC ~50–65% · new entrants <30%",
      trend:       "neutral",
    },
    {
      label:       "Government Tax & Regulatory Policy",
      description:
        "Auto sector earnings are acutely sensitive to government tax decisions. " +
        "Federal excise duty (FED), customs duty on parts, advance tax on vehicle " +
        "purchases, withholding tax structures, and sector-specific policy schemes " +
        "(Green Vehicle Policy, EV incentives) all directly affect ex-factory prices " +
        "and demand volumes. The FY24 budget introduced additional tax measures that " +
        "suppressed premium segment demand. Import duty relaxation on CBUs periodically " +
        "introduces competitive pressure from grey market and official imports. " +
        "Budget season is the single highest-risk regulatory event for the sector annually.",
      current:     "FY26 budget watch · EV policy framework under development",
      trend:       "watch",
    },
    {
      label:       "Inventory & Booking Cycle",
      description:
        "Pakistan's auto market historically operated on advance booking with waiting " +
        "periods of 3–12 months — assemblers collected cash upfront and manufactured " +
        "to order. This changed in FY23 when rate hikes and affordability crisis caused " +
        "booking cancellations and dealers accumulated unwanted inventory. The recovery " +
        "in CY24–25 has normalised booking cycles, but dealer inventory levels remain " +
        "a leading indicator: rising dealer stock signals demand softness; depleted " +
        "stock signals production constraints or demand surge. PSMC's monthly dispatch " +
        "data is the most closely watched real-time volume indicator for the sector.",
      current:     "Booking cycles normalised · PSMC dispatches tracking +35–40% YoY",
      trend:       "positive",
    },
  ],
  intelligenceSummary:
    "Pakistan's automobile sector is the country's most interest-rate-sensitive listed " +
    "industry — a direct transmission mechanism between SBP monetary policy and " +
    "consumer balance sheets. The CY25 recovery (+40% car sales YoY) is the most " +
    "visible evidence of what happens when the financing rate crunch reverses: latent " +
    "demand, backed by 94% household car ownership gap, converts rapidly to actual " +
    "purchases once monthly payments become manageable again. PSMC (Pak Suzuki) is " +
    "the volume anchor — nearly half the passenger car market, high localisation, " +
    "and the most direct exposure to mass-market consumer affordability. INDU (Indus " +
    "Motor, Toyota) operates in the premium segment with structurally higher per-unit " +
    "margins and a loyal corporate/upper-income customer base less sensitive to " +
    "financing rates. HCAR (Honda Cars) sits between the two in positioning. ATLH " +
    "(Atlas Honda) is structurally different: motorcycles are cash purchases serving " +
    "transport needs for tens of millions of lower-income households — the volume " +
    "cycle here is driven by rural income (crop prices, remittances) rather than " +
    "urban financing rates. ATLH's 65%+ motorcycle market share and 1.5M+ annual " +
    "capacity make it a near-monopoly play on Pakistan's two-wheeler market. The " +
    "framework question for equity investors: is this a rate-cut recovery trade " +
    "(buy PSMC/INDU on early rate cuts, sell when financing normalises) or a " +
    "structural consumer penetration story (buy ATLH for demographic compounding " +
    "over a 5-year horizon)? The answer differs by company and time horizon.",
};

// ── Navigation items ──────────────────────────────────────────────────────────
// All IDs must exactly match section element IDs.
// L1 IDs are fixed by SectorPageFrame. L2 IDs match ExpandableSection id props.
// Labels max 12 characters.
// Note: peer tab in this dataset is "peergrid" (same as textiles).

const AUTO_NAV: NavItem[] = [
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
  { id: "peergrid",    label: "Peers",       group: "l2" },
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
  return autoData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — async server component ───────────────────────────────────────

export default async function AutoFrameworkPage() {
  const [companies, reports, sector, drivers] = await Promise.all([
    getCompaniesBySymbols(AUTO_SYMBOLS),
    getReportsBySector("Automobile"),
    getSectorBySlug("auto"),
    getSectorDrivers("auto"),
  ]);

  const config = buildSectorConfig(sector, drivers, AUTO_CONFIG);

  const analyticsSlot = (
    <>
      {/* 1 — Sector Overview */}
      <ExpandableSection
        id="overview"
        label="Sector Overview — Volume-Driven, Financing-Sensitive Consumer Industry"
        badge="Start Here"
        defaultOpen={true}
        takeaway={
          "Pakistan's automobile sector is the most direct listed-equity proxy for " +
          "consumer financing conditions and SBP monetary policy. When rates rise " +
          "above ~18%, car demand collapses — as in FY23. When rates fall toward " +
          "12–15%, latent demand converts rapidly — as in CY25 (+40% YoY). " +
          "94% of Pakistani households do not own a car: the demand ceiling is " +
          "structurally enormous. The constraint is never 'will people want cars?' " +
          "— it is 'can they afford the monthly financing payment at today's rate?'"
        }
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — Economics */}
      <ExpandableSection
        id="economics"
        label="Assembler Economics — Revenue per Unit, Margin Structure & Cost Pass-Through"
        badge="Level 2 · Fundamentals"
        takeaway={
          "Auto assembler unit economics are driven by three levers: ex-factory price " +
          "(set by assembler and passed to dealers), input cost (imported parts at PKR/USD " +
          "rate + local vendor components), and volume (fixed cost absorption). Margin " +
          "improvement in a recovery cycle is non-linear: as volumes recover from trough, " +
          "fixed cost absorption improves faster than variable costs rise — creating " +
          "operating leverage. PSMC's mass-market volume model means it has the highest " +
          "sensitivity to this leverage effect; INDU's premium positioning provides " +
          "higher per-unit margin stability but less operating leverage upside."
        }
      >
        <HtmlTab html={tab("economics")} />
      </ExpandableSection>

      {/* 3 — Interest Rate & Financing Sensitivity */}
      <ExpandableSection
        id="variables"
        label="Rate & FX Sensitivity — How Financing Costs Drive Volume Cycles"
        badge="Level 2 · Quantitative"
        takeaway={
          "A 100bps reduction in the SBP policy rate reduces the monthly payment on a " +
          "5-year auto loan by approximately Rs2,000–3,500 depending on loan size — a " +
          "meaningful improvement for a buyer stretching to afford a Rs3–5M vehicle. " +
          "Cumulative 900bps of rate cuts from the FY24 peak (22%) to FY26 (~13%) " +
          "represents the primary mechanical explanation for the CY25 volume recovery. " +
          "The rate sensitivity is asymmetric: demand falls faster on the way up " +
          "(booking cancellations are immediate) than it recovers on the way down " +
          "(buyer confidence takes time to rebuild)."
        }
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Sector Structure */}
      <ExpandableSection
        id="structure"
        label="Sector Structure — Assemblers, Vendors, Financing & the Distribution Chain"
        badge="Level 2 · Structural"
        takeaway={
          "Pakistan's auto industry is an assembler-dominant, vendor-supported " +
          "manufacturing ecosystem. Assemblers source from ~200–300 domestic vendors " +
          "for localised components and import CBU/SKD kits from parent OEMs " +
          "(Suzuki Japan, Toyota Japan, Honda Japan). The dealer network controls " +
          "last-mile distribution and financing facilitation — dealer health is a " +
          "leading indicator of sector recovery. The motorcycle sub-sector (ATLH) " +
          "operates on a structurally different demand basis: cash-purchase dominated, " +
          "lower per-unit ASP, rural income driven, and with a vendor ecosystem " +
          "that is more mature and localised than the car segment."
        }
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="The Four Listed Automakers — PSMC · INDU · ATLH · HCAR"
        badge="Level 2 · Companies"
        takeaway={
          "PSMC (Pak Suzuki) holds ~47% of the passenger car market — the volume " +
          "leader with the highest mass-market exposure and most direct correlation " +
          "to financing-rate cycles. INDU (Indus Motor, Toyota) commands the premium " +
          "segment with Corolla and Fortuner — higher ASP, more stable per-unit " +
          "margins, and a corporate/institutional customer base less sensitive to " +
          "rate cycles. ATLH (Atlas Honda) dominates motorcycles with 65%+ share " +
          "and 1.5M+ annual capacity — structurally a different business to car " +
          "assemblers. HCAR (Honda Cars) competes with PSMC and INDU across " +
          "multiple segments with City, Civic, and BR-V."
        }
      >
        <HtmlTab html={tab("companies")} />
      </ExpandableSection>

      {/* 6 — Peer Comparison */}
      <ExpandableSection
        id="peergrid"
        label="Peer Comparison — Volume, Margin & Valuation Across Listed Assemblers"
        badge="Level 2 · Comparative"
        takeaway={
          "Auto sector peer comparison is primarily a volume trajectory and margin " +
          "recovery analysis during rate cycles. PSMC's P/E expands sharply at the " +
          "trough of a volume cycle (low earnings on high fixed costs) and compresses " +
          "at the peak — making cycle timing the core valuation challenge. INDU " +
          "typically trades at a structural P/E premium for its margin stability and " +
          "Toyota brand loyalty. ATLH commands a premium for its motorcycle monopoly " +
          "characteristics: dominant share, recurring demand, limited substitution risk. " +
          "Cross-sector comparison to other consumer discretionary businesses " +
          "is less relevant than the rate-cycle timing framework."
        }
      >
        <HtmlTab html={tab("peergrid") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Risk Factors */}
      <ExpandableSection
        id="risks"
        label="Risk Factors — Rate Reversal, FX Shock & New Entrant Competition"
        badge="Level 2 · Risk"
        takeaway={
          "The three primary risks for auto assemblers are: (1) rate reversal — any " +
          "SBP rate increase above 18% rapidly depresses financing demand and triggers " +
          "booking cancellations; (2) PKR depreciation shock — a sharp devaluation " +
          "forces ex-factory price increases that compress affordability before income " +
          "adjustments catch up; (3) new entrant competitive pressure — Chinese OEMs " +
          "(Changan, MG, DFSK) are gaining share in segments previously dominated by " +
          "Japanese assemblers, introducing pricing pressure that squeezes margin " +
          "in mid-size and crossover categories where PSMC and HCAR compete."
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
          "The most actionable monitoring signals for automobile sector are: (1) PSMC " +
          "monthly dispatch data — the real-time volume barometer for the car market; " +
          "(2) SBP MPC decisions — each rate cut is a near-term earnings catalyst; " +
          "(3) ATLH quarterly motorcycle volumes — the rural income and lower-middle " +
          "class consumption health signal. Budget season (May–June) is the highest " +
          "regulatory risk window: FED changes and duty structures announced in the " +
          "federal budget have immediate ex-factory price implications that shift " +
          "near-term demand and booking patterns."
        }
      >
        <HtmlTab html={tab("monitor")} />
      </ExpandableSection>

      {/* 9 — Key Metrics */}
      <ExpandableSection
        id="metrics"
        label="Key Metrics — Auto Sector Valuation Framework & Critical Ratios"
        badge="Level 2 · Quantitative"
        takeaway={
          "Auto sector valuation is dominated by P/E and EV/EBITDA on a through-cycle " +
          "basis. Because earnings are highly cyclical (zero or minimal earnings at " +
          "volume trough; peak earnings at recovery), analysts typically use normalised " +
          "earnings estimates rather than trailing multiples. Volume market share, " +
          "revenue per unit (ASP trend), and gross margin per unit are the three " +
          "operating metrics that drive earnings forecasts. For ATLH, motorcycle unit " +
          "volumes and ASP growth (driven by model mix toward higher-cc bikes) are " +
          "the primary drivers of a more stable, less cyclical earnings model."
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
          "Pakistan's automobile sector is ultimately a consumer finance story wearing " +
          "a manufacturing company's clothes. The business model — assemble vehicles " +
          "from mostly-imported kits, sell through dealers to financing-dependent " +
          "buyers — means the income statement reflects monetary policy transmission " +
          "as much as operational performance. The investment framework is: identify " +
          "where in the rate cycle we are, size the demand recovery trajectory, and " +
          "discount the operating leverage that comes from volume recovery against " +
          "fixed cost bases. ATLH is the exception — its motorcycle business is " +
          "genuinely structural, not cyclical, and deserves a different valuation lens."
        }
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={config}
      navItems={AUTO_NAV}
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
