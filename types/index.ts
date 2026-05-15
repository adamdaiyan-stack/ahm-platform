// types/index.ts
// Single source of truth for all database-backed types.
// Update when columns are added to Supabase tables.

// ─── Companies ────────────────────────────────────────────────────────────────
export type Company = {
  id: number;
  symbol: string;
  company_name: string;
  sector: string;
  market_cap: number | null;

  // Daily market data
  current_price:  number | null;
  change:         number | null;
  change_percent: number | null;
  volume:         number | null;

  // Fundamentals
  pe_ratio:       number | null;
  dividend_yield: number | null;
  eps:            number | null;
  week_52_high:   number | null;
  week_52_low:    number | null;

  // Profile
  description:    string | null;
  ceo:            string | null;
  founded_year:   number | null;
  website:        string | null;
  employees:      number | null;
};

// Lightweight shape used in movers / peer lists (not full Company)
export type CompanyMover = Pick<
  Company,
  "id" | "symbol" | "company_name" | "sector" | "current_price" | "change_percent" | "market_cap"
>;

export type CompanyActive = Pick<
  Company,
  "id" | "symbol" | "company_name" | "sector" | "current_price" | "change_percent" | "volume"
>;

export type CompanyPeer = Pick<
  Company,
  "id" | "symbol" | "company_name" | "current_price" | "change_percent" | "market_cap" | "pe_ratio"
>;

// ─── Market Index ─────────────────────────────────────────────────────────────
export type MarketIndex = {
  index_name:     string;
  level:          number | null;
  change:         number | null;
  change_percent: number | null;
  volume:         number | null;
  advances:       number | null;
  declines:       number | null;
  unchanged:      number | null;
  updated_at:     string;
};

// ─── Sector Stats (computed, not a DB table) ──────────────────────────────────
export type SectorStat = {
  sector:        string;
  avgChange:     number | null;
  totalMarketCap: number;
  count:          number;
};

// ─── Dividends ────────────────────────────────────────────────────────────────
export type Dividend = {
  id:             number;
  symbol:         string;
  financial_year: string | null;
  period:         string | null;
  dividend_type:  string | null;
  amount:         number | null;
  announced_date: string | null;
  book_closure:   string | null;
  record_date:    string | null;
  payment_date:   string | null;
};

// ─── Announcements ────────────────────────────────────────────────────────────
export type Announcement = {
  id:           number;
  symbol:       string;
  title:        string | null;
  body:         string | null;
  category:     string | null;
  published_at: string | null;
  url:          string | null;
};

// ─── Research Reports ─────────────────────────────────────────────────────────
export type ReportStatus  = "draft" | "published" | "archived";
export type ReportRating  = "BUY" | "HOLD" | "SELL" | "UNDER REVIEW";
export type RiskSeverity  = "High" | "Medium" | "Low";

export type ReportThesisPoint = { title: string; body: string; };
export type ReportFinancialRow = { metric: string; fy23?: string; fy24?: string; fy25e?: string; [key: string]: string | undefined; };
export type ReportValuation = { method: string; blendedTarget: string; notes: string; [key: string]: string; };
export type ReportRisk = { label: string; severity: RiskSeverity; detail: string; };
export type ReportContent = { thesis: ReportThesisPoint[]; financials: ReportFinancialRow[]; valuation: ReportValuation; risks: ReportRisk[]; };

export type ResearchReport = {
  id: string; slug: string; title: string; summary: string | null;
  content: ReportContent | null; ticker_symbols: string[]; sectors: string[];
  tags: string[]; author: string; published_at: string | null;
  status: ReportStatus; rating: ReportRating | null;
  target_price: number | null; current_price: number | null; upside: number | null;
  ai_summary: string | null; featured_image: string | null; related_slugs: string[];
  seo_title: string | null; seo_description: string | null;
  view_count: number; created_at: string; updated_at: string;
};

export type ResearchReportSummary = Pick<ResearchReport,
  | "id" | "slug" | "title" | "summary" | "ticker_symbols"
  | "sectors" | "tags" | "author" | "published_at"
  | "status" | "rating" | "target_price" | "upside"
>;
