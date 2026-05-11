// types/index.ts
//
// WHY THIS FILE EXISTS:
// TypeScript types are contracts — they describe the shape of your data.
// If we define the Company type inside StockCard.tsx, and then need the
// same type in the detail page, we'd have to copy it. Two copies = two
// places to update when the database changes. One file = one source of truth.
//
// HOW TO USE:
// import { Company } from "@/types";
// Then use `Company` as your type annotation anywhere in the project.

export type Company = {
  id: number;
  symbol: string;
  company_name: string;
  sector: string;
  market_cap: number | null;

  // --- Market data fields ---
  // These come from the same `companies` table row.
  // null means the value hasn't been populated yet in the database.
  current_price: number | null;
  change: number | null;         // absolute PKR change e.g. +1.25 or -0.80
  change_percent: number | null; // percentage change e.g. +2.64 or -1.30
  volume: number | null;         // shares traded today
  pe_ratio: number | null;       // price-to-earnings ratio
  dividend_yield: number | null; // annual dividend yield as a percentage
};
