// components/sectors/banking/BankingFrameworkPage.tsx
//
// BANKING SECTOR — PILOT / GOLD-STANDARD IMPLEMENTATION
//
// Three-level framework with sticky navigation + progressive disclosure:
//
// LEVEL 1 — Retail Overview (always visible)
//   Hero stats · Live stock snapshot · 6 key drivers · Intelligence summary
//
// LEVEL 2 — Advanced Analytics (expandable)
//   10 ExpandableSection blocks, each with:
//   - A "takeaway" — always-visible key insight (readable without expanding)
//   - Full HTML content from data/sectors/banking.ts (expandable on demand)
//
// LEVEL 3 — Research Layer (institutional)
//   Live research_reports rows + structured placeholder for future AI layer.
//
// NAV: sticky sidebar (desktop) + horizontal tab strip (mobile)
//   Drives IntersectionObserver-based active highlighting.

import { getCompaniesBySymbols } from "@/services/api/companies";
import { getReportsBySector }    from "@/services/api/research";
import { BANK_SYMBOLS }          from "@/constants";
import bankingData               from "@/data/sectors/banking";

import { SectorPageFrame }       from "@/components/sectors/framework";
import { ExpandableSection }     from "@/components/sectors/framework";
import type {
  SectorFrameworkConfig,
  NavItem,
} from "@/components/sectors/framework";

// ── Static Level-1 config ─────────────────────────────────────────────────────

const BANKING_CONFIG: SectorFrameworkConfig = {
  slug:        "banking",
  name:        "Banking",
  accentColor: "#5b9bd5",
  subtitle:
    "Pakistan's largest KSE-100 sector by weight. Commercial banks intermediate between " +
    "depositors and borrowers, earn net interest income on the spread between asset yields and " +
    "deposit costs, and are the primary transmission mechanism for SBP monetary policy.",
  stats: [
    { val: "Rs594.6B", lbl: "Listed Sector PAT CY2024 (+5% YoY)" },
    { val: "Rs1.84T",  lbl: "Net Interest Income CY2024" },
    { val: "~53%",     lbl: "Effective Tax Rate 1Q2025" },
    { val: "Rs30.78T", lbl: "Total System Deposits (Aug 2024)" },
    { val: "2028",     lbl: "Islamic Banking Mandate Deadline" },
  ],
  drivers: [
    {
      label:       "SBP Policy Rate",
      description:
        "The primary lever for sector NII. Each 100bps rate cut compresses NIM and reduces " +
        "returns on PIBs/MTBs — the dominant earning asset. Rate trajectory is the single most " +
        "important variable for banking sector earnings.",
      current:     "12.0% (May 2025 — easing cycle)",
      trend:       "watch",
    },
    {
      label:       "CASA Ratio",
      description:
        "Current + Savings Account deposits as a % of total deposits. Higher CASA = lower " +
        "funding cost = wider NIM. MEBL leads on CASA among the Big 5; Islamic banks structurally " +
        "benefit from non-remunerative current accounts.",
      current:     "~50–55% system average",
      trend:       "neutral",
    },
    {
      label:       "ADR Tax Architecture",
      description:
        "Banks with ADR below 50% face an additional 10% tax surcharge on income. This regime " +
        "forces banks toward private-sector lending — reshaping earning asset mix from government " +
        "securities toward loans.",
      current:     "Active — ADR < 50% = +10% tax",
      trend:       "watch",
    },
    {
      label:       "Islamic Banking Transition",
      description:
        "26th Constitutional Amendment mandates full conversion by 2028. Pure-play Islamic banks " +
        "(MEBL) are structurally advantaged. Conventional banks face conversion capex and " +
        "balance-sheet restructuring over the next 3 years.",
      current:     "2028 deadline — conversion in progress",
      trend:       "watch",
    },
    {
      label:       "Super Tax",
      description:
        "10% super tax on income exceeding PKR 500M raises the effective tax rate to ~53% for " +
        "large banks. The primary sector-level earnings compressor. Any policy relief would be " +
        "immediately accretive to sector PAT.",
      current:     "10% on income > PKR 500M",
      trend:       "negative",
    },
    {
      label:       "PKR Exchange Rate",
      description:
        "PKR stability reduces FX-gain tailwind but improves credit quality and real deposit " +
        "growth. Banks with large USD-asset books (HBL International) benefit from depreciation " +
        "episodes through translation gains.",
      current:     "~279–283 PKR/USD (stable)",
      trend:       "neutral",
    },
  ],
  intelligenceSummary:
    "Pakistan's banking sector enters mid-2025 in a rate-easing environment that will compress " +
    "NIM over 4–6 quarters, but improving credit demand, rising ADR, and non-interest income " +
    "diversification provide partial offsets. The Islamic banking transition is the decade's " +
    "defining structural shift — MEBL is structurally advantaged while conventional banks face " +
    "conversion capex and balance-sheet drag. The ~53% ETR remains the primary sector-level " +
    "earnings compressor; any policy relief would be immediately accretive. Near-term watch: " +
    "ADR tax compliance, SBP rate decisions, and banks' ability to grow private-sector lending " +
    "as government borrowing slows.",
};

// ── Section navigation items ──────────────────────────────────────────────────
// IDs must match: L1 section IDs in SectorPageFrame + ExpandableSection id props.

const BANKING_NAV: NavItem[] = [
  // L1 — always-visible sections
  { id: "sector-snapshot",     label: "Live Prices",  group: "l1" },
  { id: "sector-drivers",      label: "Key Drivers",  group: "l1" },
  { id: "sector-intelligence", label: "Intelligence", group: "l1" },
  // L2 — expandable analytics
  { id: "overview",   label: "P&L Model",   group: "l2" },
  { id: "economics",  label: "Economics",   group: "l2" },
  { id: "variables",  label: "Variables",   group: "l2" },
  { id: "structure",  label: "Structure",   group: "l2" },
  { id: "companies",  label: "Companies",   group: "l2" },
  { id: "peers",      label: "Peers",       group: "l2" },
  { id: "risks",      label: "Risks",       group: "l2" },
  { id: "monitor",    label: "Monitor",     group: "l2" },
  { id: "metrics",    label: "Metrics",     group: "l2" },
  { id: "summary",    label: "Summary",     group: "l2" },
  // L3 — research
  { id: "sector-research", label: "Research", group: "l3" },
];

// ── HTML tab wrapper — applies sector.css inside .sector-root ─────────────────

function HtmlTab({ html }: { html: string }) {
  return (
    <div className="sector-root" style={{ background: "transparent" }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function tab(id: string): string {
  return bankingData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — async server component ────────────────────────────────────────

export default async function BankingFrameworkPage() {
  const [companies, reports] = await Promise.all([
    getCompaniesBySymbols(BANK_SYMBOLS),
    getReportsBySector("Banking"),
  ]);

  const analyticsSlot = (
    <>
      {/* 1 — Overview & P&L Earnings Flow */}
      <ExpandableSection
        id="overview"
        label="Sector Overview & P&L Earnings Flow"
        badge="Start Here"
        defaultOpen={true}
        takeaway={
          "Banking earns the spread between what it pays depositors and what it receives on loans " +
          "and government securities. NII is ~70–75% of total income. The Big 5 banks — MEBL, " +
          "UBL, MCB, HBL, NBP — account for ~55% of sector PAT; sector aggregate CY2024: Rs594.6B."
        }
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — Economics & Revenue Model */}
      <ExpandableSection
        id="economics"
        label="How Banks Make Money — Revenue Model"
        takeaway={
          "NII dominates (~72%) and is directly tied to the rate cycle. " +
          "Non-interest income (fees, FX, capital gains ~28%) provides diversification but " +
          "cannot fully offset NIM compression in an easing cycle. Rising opex (25–30% YoY) " +
          "is the secondary earnings drag."
        }
      >
        <HtmlTab html={tab("economics")} />
      </ExpandableSection>

      {/* 3 — Key Variables & Rate Sensitivity */}
      <ExpandableSection
        id="variables"
        label="Key Variables & Rate Sensitivity"
        badge="Analytical"
        takeaway={
          "SBP policy rate is the single dominant earnings lever — each 100bps cut reduces " +
          "sector NII within 1–2 quarters as PIB yields reprice. Banks with high CASA ratios " +
          "(MEBL leads) feel rate cuts less acutely. ADR and IDR ratios signal balance-sheet " +
          "positioning between lending and government securities."
        }
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Industry Structure */}
      <ExpandableSection
        id="structure"
        label="Industry Structure — Market Architecture"
        takeaway={
          "Pakistan has 34 scheduled banks; 14 are PSX-listed. The Big 5 dominate PAT. " +
          "The Islamic banking mandate (2028) is reshaping the competitive landscape — " +
          "MEBL and other Islamic banks are structurally advantaged while conventional " +
          "banks bear conversion costs and balance-sheet restructuring."
        }
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="Company Profiles — HBL · UBL · MEBL · MCB · NBP"
        badge="5 Banks"
        takeaway={
          "MEBL leads on PAT, CASA, and Islamic positioning — warranting its premium P/B. " +
          "MCB leads on ROE efficiency. HBL has the largest international franchise. " +
          "UBL offers strong dividend yield with improving ADR. " +
          "NBP's CY2024 PAT fell ~50% YoY — a provisioning-driven outlier."
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
          "P/B multiples range from ~0.6x (NBP, deep discount) to ~1.5x (MEBL, premium) " +
          "across the Big 5. Sector aggregate P/B below 1x signals compressed valuations " +
          "relative to long-run history. ROE differentials (MCB highest, NBP lowest) explain " +
          "much of the valuation dispersion."
        }
      >
        <HtmlTab html={tab("peers") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Sector Risks */}
      <ExpandableSection
        id="risks"
        label="Sector Risk Register"
        badge="Risk"
        takeaway={
          "Three primary near-term risks: (1) NIM compression as SBP cuts rates — directly " +
          "reduces NII on Rs30T+ PIB/MTB portfolio; (2) Super tax at ~53% ETR — perennial " +
          "earnings floor constraint; (3) Islamic conversion capex and structural disruption " +
          "for conventional banks through 2028. Credit risk remains manageable at current NPL levels."
        }
      >
        <HtmlTab html={tab("risks")} />
      </ExpandableSection>

      {/* 8 — Monitor & Signals */}
      <ExpandableSection
        id="monitor"
        label="Monitoring Framework & Signals"
        badge="Operational"
        takeaway={
          "Key monthly signals: SBP MPC rate decisions, NFIS deposit/advance aggregates " +
          "(CASA trend), system-wide ADR disclosure. Quarterly: bank-level NIM, " +
          "cost-to-income ratio, provisioning charge, and advances growth. " +
          "Annual: full PAT and dividend declarations."
        }
      >
        <HtmlTab html={tab("monitor")} />
      </ExpandableSection>

      {/* 9 — Metrics Reference */}
      <ExpandableSection
        id="metrics"
        label="Financial Metrics & Ratios Reference"
        badge="Reference"
        takeaway={
          "Core banking KPIs: NIM (net interest margin), CASA ratio, ADR " +
          "(advance-to-deposit), IDR (investment-to-deposit), ETR, ROE, and P/B. " +
          "Cost-to-income ratio measures operational efficiency. " +
          "Provisioning coverage signals credit quality and NPL management."
        }
      >
        <HtmlTab html={tab("metrics")} />
      </ExpandableSection>

      {/* 10 — Summary, Interpretation & Glossary */}
      <ExpandableSection
        id="summary"
        label="Executive Summary, Interpretation & Glossary"
        badge="Full Analysis"
        takeaway={
          "The sector offers selective value at compressed P/B multiples. " +
          "Rate easing creates near-term NIM headwind but accelerates private credit demand — " +
          "a partial offset. MEBL is the structural long through the Islamic transition. " +
          "Conventional banks require patience through 2025–26 conversion drag. " +
          "Dividend income remains the primary return driver for large-cap bank positions."
        }
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={BANKING_CONFIG}
      navItems={BANKING_NAV}
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
