// components/sectors/framework/index.ts
// Barrel export for the Master Sector Page Framework.
// Import everything from here — never import directly from sub-files.

export { default as SectorPageFrame }           from "./SectorPageFrame";
export { default as SectorHero }                from "./SectorHero";
export { default as SectorSnapshot }            from "./SectorSnapshot";
export { default as SectorDrivers }             from "./SectorDrivers";
export { default as SectorIntelligenceSummary } from "./SectorIntelligenceSummary";
export { default as SectorResearchLayer }       from "./SectorResearchLayer";
export { default as ExpandableSection }         from "./ExpandableSection";
export { default as SectorSideNav }             from "./SectorSideNav";
export { default as SectionLabel }              from "./SectionLabel";

export type {
  SectorFrameworkConfig,
  SectorStat,
  SectorDriver,
  DriverTrend,
} from "./types";
export type { SnapshotCompany } from "./SectorSnapshot";
export type { NavItem }         from "./SectorSideNav";
