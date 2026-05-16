// components/sectors/banking/BankingFrameworkPage.tsx
//
// BANKING SECTOR — PILOT / GOLD-STANDARD IMPLEMENTATION
//
// This is the reference implementation of the Master Sector Page Framework.
// All future sector modules should follow this exact three-level pattern.
//
// LEVEL 1 — Retail Overview
//   Hero stats · Live stock snapshot · 6 key drivers · Intelligence summary
//
// LEVEL 2 — Advanced Analytics (expandable, zero information deleted)
//   10 ExpandableSection blocks covering all 13 original tab categories.
//   HTML content from data/sectors/banking.ts is preserved in full.
//
// LEVEL 3 — Research Layer
//   Live research_reports rows + structured placeholder for future AI layer.

import { getCompaniesBySymbols }  from "@/services/api/companies";
import { getReportsBySector }     from "@/services/api/research";
import { BANK_SYMBOLS }           from "@/constants";
import bankingData                from "@/data/sectors/banking";

import { SectorPageFrame }        from "@/components/sectors/framework";
import { ExpandableSection }      from "@/components/sectors/framework";
import type { SectorFrameworkConfig } from "@/components/sectors/framework";

// ── Static Level-1 config ────────────────────────────────────────────────────

const BANKING_CONFIG: SectorFrameworkConfig = {
  slug:        "banking",
  name:        "Banking",
  accentColor: "#5b9bd5",
  subtitle:
    "Pakistan's largest KSE-100 sector by weight. The banking sector intermediates between " +
    "depositors and borrowers, earns net interest income on the spread between asset yields and " +
    "deposit costs, and is the primary transmission mechanism for SBP monetary policy.",
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
        "The Advance-to-Deposit Ratio tax penalises banks with ADR < 50% by imposing an " +
        "additional 10% tax on income. This regime effectively forces banks toward private-sector " +
        "lending to avoid the surcharge — reshaping sector balance sheets.",
      current:     "Active — ADR < 50% = +10% tax",
      trend:       "watch",
    },
    {
      label:       "Islamic Banking Transition",
      description:
        "26th Constitutional Amendment mandates full conversion of the banking system to " +
        "Islamic principles by 2028. Creates divergent trajectories: pure-play Islamic banks " +
        "(MEBL) are structurally advantaged; conventional banks face conversion costs and " +
        "balance-sheet restructuring.",
      current:     "2028 deadline — conversion in progress",
      trend:       "watch",
    },
    {
      label:       "Super Tax",
      description:
        "10% super tax applies to banks with income exceeding PKR 500M — raising the effective " +
        "tax rate to ~53% for large banks. The primary sector-level earnings compressor. " +
        "Any reduction would directly boost sector PAT.",
      current:     "10% on income > PKR 500M",
      trend:       "negative",
    },
    {
      label:       "PKR Exchange Rate",
      description:
        "Rupee depreciation benefits banks with large FX positions and USD-denominated " +
        "assets. It also supports non-interest income through FX gains. Stability reduces " +
        "this tailwind but improves credit quality and real deposit growth.",
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

// ── Helper: wraps raw tab HTML inside .sector-root so sector.css applies ─────

function HtmlTab({ html }: { html: string }) {
  return (
    <div className="sector-root" style={{ background: "transparent" }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

// Lookup helper for banking tab content
function tab(id: string): string {
  return bankingData.tabs.find((t) => t.id === id)?.content ?? "";
}

// ── Main page — server component ─────────────────────────────────────────────

export default async function BankingFrameworkPage() {
  // Server-side data fetches (parallel)
  const [companies, reports] = await Promise.all([
    getCompaniesBySymbols(BANK_SYMBOLS),
    getReportsBySector("Banking"),
  ]);

  // ── Level-2 analytics sections ─────────────────────────────────────────────
  // Each ExpandableSection preserves ALL existing intelligence from banking.ts.
  // The overview section is open by default; all others start collapsed.

  const analyticsSlot = (
    <>
      {/* 1 — Overview & Earnings Flow */}
      <ExpandableSection
        id="overview"
        label="Sector Overview & P&L Earnings Flow"
        badge="Start Here"
        defaultOpen={true}
      >
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>

      {/* 2 — Economics & Revenue Model */}
      <ExpandableSection
        id="economics"
        label="How Banks Make Money — Revenue Model"
      >
        <HtmlTab html={tab("economics")} />
      </ExpandableSection>

      {/* 3 — Key Variables & Rate Sensitivity */}
      <ExpandableSection
        id="variables"
        label="Key Variables & Rate Sensitivity"
        badge="Analytical"
      >
        <HtmlTab html={tab("variables")} />
      </ExpandableSection>

      {/* 4 — Industry Structure */}
      <ExpandableSection
        id="structure"
        label="Industry Structure — Market Architecture"
      >
        <HtmlTab html={tab("structure")} />
      </ExpandableSection>

      {/* 5 — Company Profiles */}
      <ExpandableSection
        id="companies"
        label="Company Profiles — HBL · UBL · MEBL · MCB · NBP"
        badge="5 Banks"
      >
        <HtmlTab html={tab("companies")} />
      </ExpandableSection>

      {/* 6 — Peer Comparison */}
      <ExpandableSection
        id="peers"
        label="Peer Comparison & Deep Analysis"
        badge="Comparative"
      >
        <HtmlTab html={tab("peers") + tab("deeppeers")} />
      </ExpandableSection>

      {/* 7 — Sector Risks */}
      <ExpandableSection
        id="risks"
        label="Sector Risk Register"
        badge="Risk"
      >
        <HtmlTab html={tab("risks")} />
      </ExpandableSection>

      {/* 8 — Monitor & Signals */}
      <ExpandableSection
        id="monitor"
        label="Monitoring Framework & Signals"
        badge="Operational"
      >
        <HtmlTab html={tab("monitor")} />
      </ExpandableSection>

      {/* 9 — Metrics Reference */}
      <ExpandableSection
        id="metrics"
        label="Financial Metrics & Ratios Reference"
        badge="Reference"
      >
        <HtmlTab html={tab("metrics")} />
      </ExpandableSection>

      {/* 10 — Summary, Interpretation & Glossary */}
      <ExpandableSection
        id="summary"
        label="Executive Summary, Interpretation & Glossary"
        badge="Full Analysis"
      >
        <HtmlTab html={tab("summary") + tab("interpret") + tab("glossary")} />
      </ExpandableSection>
    </>
  );

  return (
    <SectorPageFrame
      config={BANKING_CONFIG}
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
