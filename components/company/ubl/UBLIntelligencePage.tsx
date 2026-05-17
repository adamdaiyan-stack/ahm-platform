// components/company/ubl/UBLIntelligencePage.tsx
//
// UBL Company Intelligence Page — thin wrapper around CompanyIntelligencePage.
//
// ARCHITECTURE
//   This file is intentionally minimal.
//   All page layout and component wiring lives in CompanyIntelligencePage.
//   This file only:
//     1. Imports the UBL static intelligence config
//     2. Builds the UBL CompanyIntelligenceConfig
//     3. Delegates to CompanyIntelligencePage
//
//   To add a new company: copy this pattern, create a new intelligence file,
//   and wire a new config. No component changes required.

import CompanyIntelligencePage, { type CompanyIntelligenceConfig } from "@/components/company/CompanyIntelligencePage";

import {
  UBL_THESIS_SUMMARY,
  UBL_THESIS_THEMES,
  UBL_DRIVERS,
  UBL_RISKS,
  UBL_CATALYSTS,
  UBL_VALUATION_SUMMARY,
  UBL_VALUATION_HISTORICAL_RANGE,
  UBL_VALUATION_PEER_CONTEXT,
  UBL_VALUATION_POINTS,
  UBL_DIVIDEND_COMMENTARY,
  UBL_DIVIDEND_YIELD_POSITIONING,
  UBL_DIVIDEND_CONSISTENCY_NOTE,
} from "./ubl-intelligence";

import type { Company, CompanyPeer, Dividend, FinancialMetrics, ResearchReportSummary } from "@/types";

type Announcement = {
  id:           number;
  symbol:       string;
  title:        string | null;
  category:     string | null;
  published_at: string | null;
  url:          string | null;
  body?:        string | null;
};

type UBLIntelligencePageProps = {
  company:       Company;
  peers:         CompanyPeer[];
  dividends:     Dividend[];
  announcements: Announcement[];
  metrics:       FinancialMetrics[];
  reports:       ResearchReportSummary[];
};

const UBL_CONFIG: CompanyIntelligenceConfig = {
  accentColor:              "#3b82f6",
  exchangeLabel:            "Commercial Bank",
  peersLabel:               "Banking Peers",

  thesisSummary:            UBL_THESIS_SUMMARY,
  thesisThemes:             UBL_THESIS_THEMES,

  drivers:                  UBL_DRIVERS,

  risks:                    UBL_RISKS,
  catalysts:                UBL_CATALYSTS,

  valuationPoints:          UBL_VALUATION_POINTS,
  valuationSummary:         UBL_VALUATION_SUMMARY,
  valuationHistoricalRange: UBL_VALUATION_HISTORICAL_RANGE,
  valuationPeerContext:     UBL_VALUATION_PEER_CONTEXT,

  dividendCommentary:        UBL_DIVIDEND_COMMENTARY,
  dividendYieldPositioning:  UBL_DIVIDEND_YIELD_POSITIONING,
  dividendConsistencyNote:   UBL_DIVIDEND_CONSISTENCY_NOTE,
};

export default function UBLIntelligencePage(props: UBLIntelligencePageProps) {
  return <CompanyIntelligencePage config={UBL_CONFIG} {...props} />;
}
