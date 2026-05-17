// components/company/index.ts
// Barrel export for all reusable company intelligence components.
// Import from "@/components/company" in page files.

export { default as InvestmentThesis }     from "./InvestmentThesis";
export { default as CompanyDrivers }       from "./CompanyDrivers";
export { default as RiskCatalystPanel }    from "./RiskCatalystPanel";
export { default as FinancialSnapshot }    from "./FinancialSnapshot";
export { default as DividendAnalysis }     from "./DividendAnalysis";
export { default as ValuationSummary }     from "./ValuationSummary";
export { default as RelatedResearch }      from "./RelatedResearch";
export { default as AIInsightPlaceholder } from "./AIInsightPlaceholder";
export { SectionLabel }                    from "./InvestmentThesis";

export type { ThesisTheme }    from "./InvestmentThesis";
export type { CompanyDriver }  from "./CompanyDrivers";
export type { RiskItem, CatalystItem }  from "./RiskCatalystPanel";
export type { ValuationPoint } from "./ValuationSummary";
export type { ResearchItem }   from "./RelatedResearch";
