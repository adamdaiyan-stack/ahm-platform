// data/sectors/index.ts
//
// Central registry for all sector modules.
// sectorMap: slug → SectorData (used by the dynamic [sector] route to look up data)
// sectorList: ordered array (used by the /sectors index page to render cards)

import banking    from "./banking";
import auto       from "./auto";
import cement     from "./cement";
import fertiliser from "./fertiliser";
import oilGas     from "./oil-gas";
import powerIpp   from "./power-ipp";
import textiles   from "./textiles";
import monitoring from "./monitoring";

import type { SectorData } from "./types";

export const sectorMap: Record<string, SectorData> = {
  banking,
  auto,
  cement,
  fertiliser,
  "oil-gas":    oilGas,
  "power-ipp":  powerIpp,
  textiles,
  monitoring,
};

// Ordered list for the index page (monitoring is listed separately)
export const sectorList: SectorData[] = [
  banking,
  auto,
  cement,
  fertiliser,
  oilGas,
  powerIpp,
  textiles,
];
