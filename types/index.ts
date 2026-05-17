// types/index.ts
// Single source of truth for all database-backed types.
// Update when columns are added to Supabase tables.
// Schema version: Sprint — Financial Intelligence Infrastructure Phase 1

// ─── Companies ────────────────────────────────────────────────────────────────
export type Company = {
  id:             number;
  symbol:         string;
  company_name:   string;
  sector:         string;
  market_cap:     number | null;

  // Daily market snapshot (canonical record is daily_prices; this is convenience)
  current_price:  number | null;
  change:         number | null;
  change_percent: number | null;
  volume:         number | null;

  // Fundamental snapshot (canonical record is financial_metrics; this is convenience)
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

// ─── Daily Prices (time-series) ───────────────────────────────────────────────
export type DailyPrice = {
  id:             number;
  symbol:         string;
  market_date:    string;   // ISO date string
  open:           number | null;
  high:           number | null;
  low:            number | null;
  close:          number;
  volume:         number | null;
  change:         number | null;
  change_percent: number | null;
  vwap:           number | null;
  trades:         number | null;
  source:         string;
  created_at:     string;
};

// ─── Financial Metrics (period-based fundamentals) ───────────────────────────
export type PeriodType = "annual" | "half_year" | "quarter" | "custom";

export type FinancialMetrics = {
  id:             number;
  symbol:         string;
  period:         string;       // e.g. "FY24", "1HFY25"
  period_type:    PeriodType;
  period_end_date: string | null;

  // Income
  revenue:        number | null;
  gross_profit:   number | null;
  ebitda:         number | null;
  ebit:           number | null;
  pat:            number | null;
  eps:            number | null;

  // Balance sheet
  total_assets:   number | null;
  total_equity:   number | null;
  total_debt:     number | null;
  book_value:     number | null;

  // Valuation
  pe_ratio:       number | null;
  pb_ratio:       number | null;
  ev_ebitda:      number | null;
  ps_ratio:       number | null;

  // Profitability
  gross_margin:   number | null;
  ebitda_margin:  number | null;
  net_margin:     number | null;
  roe:            number | null;
  roa:            number | null;
  roce:           number | null;

  // Dividend
  dps:            number | null;
  dividend_yield: number | null;
  payout_ratio:   number | null;

  // Cash flow
  cfo:            number | null;
  capex:          number | null;
  fcf:            number | null;

  // Debt
  debt_to_equity: number | null;
  interest_cover: number | null;

  // Growth
  revenue_growth: number | null;
  pat_growth:     number | null;
  eps_growth:     number | null;

  source:         string;
  notes:          string | null;
  created_at:     string;
  updated_at:     string;
};

// Lightweight shape for screener/comparison tables
export type FinancialMetricsSummary = Pick<FinancialMetrics,
  | "symbol" | "period" | "period_type"
  | "pat" | "eps" | "pe_ratio" | "pb_ratio"
  | "roe" | "net_margin" | "dps" | "dividend_yield"
  | "revenue_growth" | "pat_growth"
>;

// ─── Sectors ──────────────────────────────────────────────────────────────────
export type SectorStatus = "active" | "coming_soon" | "archived";

export type Sector = {
  id:                   number;
  slug:                 string;
  name:                 string;
  db_sector_name:       string;
  accent_color:         string;
  subtitle:             string | null;
  intelligence_summary: string | null;
  volume_label:         string | null;
  status:               SectorStatus;
  sort_order:           number;
  created_at:           string;
  updated_at:           string;
};

// ─── Sector Drivers ───────────────────────────────────────────────────────────
export type DriverTrend = "positive" | "negative" | "neutral" | "watch";

export type SectorDriver = {
  id:              number;
  sector_slug:     string;
  sort_order:      number;
  label:           string;
  description:     string;
  current_reading: string | null;
  trend:           DriverTrend;
  updated_at:      string;
};

// ─── Sector Intelligence Blocks ──────────────────────────────────────────────
export type IntelBlockType =
  | "takeaway"
  | "risk"
  | "driver_analysis"
  | "valuation"
  | "trend_summary"
  | "margin_analysis"
  | "company_note"
  | "macro_link"
  | "ai_insight"
  | "custom";

export type IntelBlockSeverity = "critical" | "high" | "medium" | "low";

export type SectorIntelBlock = {
  id:              string;   // uuid
  sector_slug:     string;
  block_type:      IntelBlockType;
  title:           string;
  body:            string | null;
  content:         Record<string, unknown>;
  related_symbols: string[];
  tags:            string[];
  severity:        IntelBlockSeverity | null;
  trend:           DriverTrend | null;
  sort_order:      number;
  is_active:       boolean;
  valid_from:      string | null;
  valid_until:     string | null;
  source:          string;
  created_at:      string;
  updated_at:      string;
};

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
  sector:         string;
  avgChange:      number | null;
  totalMarketCap: number;
  count:          number;
};

// ─── Dividends ────────────────────────────────────────────────────────────────
export type Dividend = {
  id:             number;
  symbol:         string;
  financial_year: string | null;
  period:         string | null;
  dividend_type:  string | null;    // 'interim', 'final', 'special', 'bonus'
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

export type ReportThesisPoint   = { title: string; body: string; };
export type ReportFinancialRow  = { metric: string; fy23?: string; fy24?: string; fy25e?: string; [key: string]: string | undefined; };
export type ReportValuation     = { method: string; blendedTarget: string; notes: string; [key: string]: string; };
export type ReportRisk          = { label: string; severity: RiskSeverity; detail: string; };
export type ReportContent       = { thesis: ReportThesisPoint[]; financials: ReportFinancialRow[]; valuation: ReportValuation; risks: ReportRisk[]; };

export type ResearchReport = {
  id:               string;
  slug:             string;
  title:            string;
  summary:          string | null;
  content:          ReportContent | null;
  ticker_symbols:   string[];
  sectors:          string[];
  tags:             string[];
  author:           string;
  published_at:     string | null;
  status:           ReportStatus;
  rating:           ReportRating | null;
  target_price:     number | null;
  current_price:    number | null;
  upside:           number | null;
  ai_summary:       string | null;
  featured_image:   string | null;
  related_slugs:    string[];
  seo_title:        string | null;
  seo_description:  string | null;
  view_count:       number;
  created_at:       string;
  updated_at:       string;
};

export type ResearchReportSummary = Pick<ResearchReport,
  | "id" | "slug" | "title" | "summary" | "ticker_symbols"
  | "sectors" | "tags" | "author" | "published_at"
  | "status" | "rating" | "target_price" | "upside"
>;
