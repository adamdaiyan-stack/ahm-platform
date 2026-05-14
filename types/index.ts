// types/index.ts — single source of truth for the Company shape.
// Update this when you add columns to the Supabase companies table.

export type Company = {
  id: number;
  symbol: string;
  company_name: string;
  sector: string;
  market_cap: number | null;

  // Daily market data
  current_price:   number | null;
  change:          number | null;
  change_percent:  number | null;
  volume:          number | null;

  // Fundamental metrics
  pe_ratio:        number | null;
  dividend_yield:  number | null;
  eps:             number | null;
  week_52_high:    number | null;
  week_52_low:     number | null;

  // Company profile
  description:     string | null;
  ceo:             string | null;
  founded_year:    number | null;
  website:         string | null;
  employees:       number | null;
};
