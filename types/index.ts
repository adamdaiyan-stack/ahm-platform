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

  // ── Sector-specific intelligence metrics ────────────────────────────────
  // NULL for companies where the metric is not applicable.
  // The rendering layer (FinancialSnapshot) detects presence and adapts.
  //
  // Banking / financial institutions
  nim:              number | null;   // Net Interest Margin %
  casa_ratio:       number | null;   // Current + Savings Accounts as % of total deposits
  npl_ratio:        number | null;   // Non-Performing Loans as % of gross advances
  coverage_ratio:   number | null;   // Provision coverage % of NPLs
  car:              number | null;   // Capital Adequacy Ratio %
  cost_to_income:   number | null;   // Operating costs as % of operating income
  deposit_growth:   number | null;   // YoY deposit growth %
  advance_growth:   number | null;   // YoY gross advances growth %
  //
  // Future sector extensions (added via ALTER TABLE as sectors are built out):
  //   Oil & Gas:  production_volume, lifting_cost, reserve_replacement_ratio
  //   Cement:     dispatch_growth, retention_price, coal_cost_per_ton
  //   Power:      circular_debt_receivable, capacity_utilization
  //   Textiles:   export_revenue_pct, ltff_rate_benefit

  // Extended IS columns (migration 022)
  revenue_from_operations:   number | null;
  other_income:              number | null;
  cost_of_revenue:           number | null;
  distribution_expense:      number | null;
  admin_expense:             number | null;
  operating_profit:          number | null;
  depreciation_amortisation: number | null;
  finance_cost:              number | null;
  profit_before_tax:         number | null;
  tax_expense:               number | null;

  // Extended BS columns (migration 022)
  current_assets:       number | null;
  cash_and_equivalents: number | null;
  inventories:          number | null;
  trade_receivables:    number | null;
  total_liabilities:    number | null;
  current_liabilities:  number | null;
  trade_payables:       number | null;
  long_term_debt:       number | null;
  net_debt:             number | null;
  share_capital:        number | null;
  retained_earnings:    number | null;
  shares_outstanding:   number | null;
  enterprise_value:     number | null;

  // Extended CF columns (migration 022)
  cfi:            number | null;
  cff:            number | null;
  dividends_paid: number | null;

  // Extended ratio columns (migration 022)
  operating_margin:    number | null;
  current_ratio:       number | null;
  net_debt_to_ebitda:  number | null;
  cfo_to_pat:          number | null;
  fcf_margin:          number | null;
  revenue_cagr_3y:     number | null;
  pat_cagr_3y:         number | null;
  bvps:                number | null;
  cfps:                number | null;

  // Audit fields (migration 022)
  is_consolidated:   boolean;
  is_ttm:            boolean;
  ttm_components:    string[] | null;
  is_restated:       boolean;
  restatement_notes: string | null;
  confidence:        number;
  upload_batch_id:   string | null;
  reviewed_by:       string | null;
  reviewed_at:       string | null;

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

// ─── Financial Ratio Snapshots ────────────────────────────────────────────────
// Computed ratios with peer comparison — from financial_ratio_snapshots table.

export type PeerContext = {
  rank:       number;
  percentile: number;
  sector_avg: number | null;
  sector_n:   number;
  best:       number | null;
  worst:      number | null;
};

export type FinancialRatioSnapshot = {
  id:                  string;
  symbol:              string;
  period_key:          string;
  snapshot_date:       string;
  period_type:         string | null;
  is_ttm:              boolean;

  // Market inputs
  price_used:          number | null;
  market_cap_used:     number | null;
  shares_outstanding:  number | null;
  enterprise_value:    number | null;

  // Valuation
  pe_ratio:            number | null;
  pb_ratio:            number | null;
  ev_ebitda:           number | null;
  ps_ratio:            number | null;
  ev_revenue:          number | null;
  fcf_yield:           number | null;
  dividend_yield:      number | null;

  // Profitability
  gross_margin:        number | null;
  ebitda_margin:       number | null;
  operating_margin:    number | null;
  net_margin:          number | null;
  roe:                 number | null;
  roa:                 number | null;
  roce:                number | null;

  // Growth
  revenue_growth:      number | null;
  pat_growth:          number | null;
  eps_growth:          number | null;
  revenue_cagr_3y:     number | null;
  pat_cagr_3y:         number | null;

  // Balance sheet / Leverage
  debt_to_equity:      number | null;
  net_debt_to_ebitda:  number | null;
  current_ratio:       number | null;
  interest_cover:      number | null;

  // Cash flow
  cfo_to_pat:          number | null;
  fcf_margin:          number | null;
  capex_to_revenue:    number | null;

  // Per share
  eps:                 number | null;
  bvps:                number | null;
  cfps:                number | null;
  dps:                 number | null;
  payout_ratio:        number | null;

  // Banking
  nim:                 number | null;
  casa_ratio:          number | null;
  npl_ratio:           number | null;
  coverage_ratio:      number | null;
  car:                 number | null;
  cost_to_income:      number | null;

  // Peer comparison
  peer_context:        Record<string, PeerContext> | null;
  peer_computed_at:    string | null;
  computed_at:         string;
};

// ─── Financial Reporting Periods ──────────────────────────────────────────────

export type FinancialReportingPeriod = {
  id:                number;
  symbol:            string;
  period_key:        string;
  period_type:       string;
  fiscal_year:       number;
  period_num:        number | null;
  period_start:      string | null;
  period_end:        string;
  is_announced:      boolean;
  announcement_date: string | null;
  is_ttm:            boolean;
  ttm_components:    string[] | null;
  display_label:     string | null;
  year_end_month:    number;
  created_at:        string;
  updated_at:        string;
};

// ─── Financial Statement Lines ─────────────────────────────────────────────────

export type FinancialStatementLine = {
  id:               string;
  symbol:           string;
  period_key:       string;
  statement_type:   string;
  metric_code:      string;
  raw_label:        string | null;
  value:            number;
  value_unit:       string;
  is_consolidated:  boolean;
  confidence:       number;
  upload_batch_id:  string | null;
  source:           string;
  notes:            string | null;
  created_at:       string;
  updated_at:       string;
};

// ─── Financial Upload Batches ─────────────────────────────────────────────────

export type FinancialUploadBatch = {
  id:               string;
  batch_name:       string;
  source_type:      string;
  source_reference: string | null;
  submitted_by:     string;
  submitted_at:     string;
  symbols_affected: string[];
  periods_affected: string[];
  records_planned:  number | null;
  records_applied:  number;
  records_failed:   number;
  status:           string;
  reviewed_by:      string | null;
  reviewed_at:      string | null;
  review_notes:     string | null;
  applied_at:       string | null;
  notes:            string | null;
  created_at:       string;
  updated_at:       string;
};

// ─── Sectors ──────────────────────────────────────────────────────────────────
export type SectorStatus = "active" | "coming_soon" | "archived";

export type SectorStatItem = {
  val: string;
  lbl: string;
};

export type Sector = {
  id:                   number;
  slug:                 string;
  name:                 string;
  db_sector_name:       string;
  accent_color:         string;
  subtitle:             string | null;
  intelligence_summary: string | null;
  volume_label:         string | null;
  stats:                SectorStatItem[] | null;
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

// ─── Market Regime ────────────────────────────────────────────────────────────
export type RegimeLabel =
  | "Bullish"
  | "Risk-On"
  | "Neutral"
  | "Defensive"
  | "Risk-Off"
  | "High Volatility";

export type MarketRegimeState = {
  id:           string;
  regime_date:  string;
  regime:       RegimeLabel;
  confidence:   number;
  inputs:       Record<string, unknown>;
  regime_note:  string | null;
  computed_by:  string;
  computed_at:  string;
  created_at:   string;
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

// ─── Company Intelligence ─────────────────────────────────────────────────────

export type CompanyIntelBlockType =
  | "thesis_theme"
  | "driver"
  | "risk"
  | "catalyst"
  | "valuation_point";

export type CompanyDriverTrend = "positive" | "negative" | "neutral" | "watch";

export type CompanyIntelScalars = {
  id:                          number;
  symbol:                      string;
  accent_color:                string;
  exchange_label:              string | null;
  peers_label:                 string | null;
  thesis_summary:              string | null;
  valuation_summary:           string | null;
  valuation_historical_range:  string | null;
  valuation_peer_context:      string | null;
  dividend_commentary:         string | null;
  dividend_yield_positioning:  string | null;
  dividend_consistency_note:   string | null;
  is_active:                   boolean;
  source:                      string;
  created_at:                  string;
  updated_at:                  string;
};

export type CompanyIntelBlock = {
  id:              string;
  symbol:          string;
  block_type:      CompanyIntelBlockType;
  sort_order:      number;
  title:           string;
  body:            string | null;
  content:         Record<string, unknown>;
  trend:           CompanyDriverTrend | null;
  severity:        "high" | "medium" | "low" | null;
  horizon:         "near" | "medium" | "long" | null;
  signal:          "cheap" | "fair" | "rich" | null;
  icon:            string | null;
  metric:          string | null;
  current_val:     string | null;
  tags:            string[];
  related_symbols: string[];
  is_active:       boolean;
  source:          string;
  created_at:      string;
  updated_at:      string;
};

// ─── AI Intelligence Infrastructure (Sprint 6) ───────────────────────────────
// Schema version: Sprint 6 — AI Intelligence Infrastructure Phase 1

// ── Conviction Scoring ────────────────────────────────────────────────────────

export type ConvictionTier =
  | 'HIGH_CONVICTION'
  | 'MODERATE'
  | 'WATCHLIST'
  | 'MONITOR';

export type SubScoreBreakdown = {
  valuation:               number;
  profitability:           number;
  growth:                  number;
  balance_sheet:           number;
  momentum:                number;
  macro_sensitivity:       number;
  catalyst:                number;
  risk:                    number;
  sector_relative_strength: number;
  technical_timing:        number;
  data_confidence_multiplier: number;
};

export type ScoringWeights = {
  phase:                    string;   // 'phase_1' | 'phase_2'
  valuation:                number;
  profitability:             number;
  growth:                    number;
  balance_sheet:             number;
  momentum:                  number;
  macro_sensitivity:         number;
  catalyst:                  number;
  risk:                      number;
  sector_relative_strength:  number;
  technical_timing:          number;
};

export type ConvictionScore = {
  id:               number;
  symbol:           string;
  score:            number;            // 0–100 composite
  tier:             ConvictionTier;
  sub_scores:       SubScoreBreakdown;
  weights_applied:  ScoringWeights;
  data_confidence:  number;            // 0.65–1.00
  inputs_snapshot:  Record<string, unknown>;
  score_version:    string;            // e.g. '1.0.0'
  is_current:       boolean;
  scored_at:        string;
  created_at:       string;
};

export type ConvictionScoreHistory = {
  id:               number;
  symbol:           string;
  score:            number;
  tier:             ConvictionTier;
  previous_score:   number | null;
  previous_tier:    ConvictionTier | null;
  tier_changed:     boolean;
  tier_direction:   'upgrade' | 'downgrade' | null;
  sub_scores:       SubScoreBreakdown;
  data_confidence:  number;
  inputs_snapshot:  Record<string, unknown>;
  score_version:    string;
  scored_at:        string;
  trigger_reason:   'scheduled' | 'block_update' | 'metrics_update' | 'manual';
};

// Conviction board row (from conviction_board view)
export type ConvictionBoardRow = {
  symbol:          string;
  company_name:    string;
  sector:          string;
  score:           number;
  tier:            ConvictionTier;
  tier_order:      number;
  data_confidence: number;
  sub_scores:      SubScoreBreakdown;
  scored_at:       string;
  score_version:   string;
};

// ── AI Outputs ────────────────────────────────────────────────────────────────

export type AIOutputType =
  | 'company_narrative'
  | 'conviction_interpretation'
  | 'risk_summary'
  | 'catalyst_summary'
  | 'peer_comparison'
  | 'sector_brief'
  | 'market_summary'
  | 'alert_summary';

export type AIOutput = {
  id:                   string;   // uuid
  output_type:          AIOutputType;
  reference_key:        string;
  raw_text:             string;
  content:              Record<string, unknown>;
  model_version:        string;
  prompt_version:       string;
  prompt_hash:          string;
  input_hash:           string;
  input_snapshot:       Record<string, unknown>;
  prompt_tokens:        number | null;
  completion_tokens:    number | null;
  total_tokens:         number | null;
  generation_ms:        number | null;
  is_current:           boolean;
  valid_until:          string | null;
  invalidated_at:       string | null;
  invalidation_reason:  string | null;
  created_at:           string;
};

export type AIPromptTemplate = {
  id:             string;   // uuid
  prompt_type:    AIOutputType;
  version:        string;
  system_prompt:  string;
  user_template:  string;
  variables:      string[];
  model_target:   string;
  max_tokens:     number;
  temperature:    number;
  is_active:      boolean;
  change_notes:   string | null;
  created_at:     string;
  deprecated_at:  string | null;
};

// ── Market Snapshots ──────────────────────────────────────────────────────────

export type SnapshotType = 'pre_market' | 'market_open' | 'market_close' | 'eod_summary';
export type SnapshotFormat = 'long' | 'short';

export type AIMarketSnapshot = {
  id:                 string;   // uuid
  snapshot_date:      string;
  snapshot_type:      SnapshotType;
  format:             SnapshotFormat;
  raw_text:           string;
  structured_content: Record<string, unknown>;
  input_snapshot:     Record<string, unknown>;
  model_version:      string;
  prompt_version:     string;
  prompt_tokens:      number | null;
  completion_tokens:  number | null;
  total_tokens:       number | null;
  generation_ms:      number | null;
  is_current:         boolean;
  generated_at:       string;
};

// ── Event Triggers and Alerts ─────────────────────────────────────────────────

export type EventTriggerStatus = 'pending' | 'processing' | 'complete' | 'suppressed' | 'failed';

export type AIEventTrigger = {
  id:                      string;   // uuid
  event_type:              string;
  reference_key:           string;
  event_data:              Record<string, unknown>;
  priority:                number;
  status:                  EventTriggerStatus;
  suppression_reason:      string | null;
  alert_id:                string | null;
  ai_output_id:            string | null;
  triggered_at:            string;
  processing_started_at:   string | null;
  processed_at:            string | null;
  error_message:           string | null;
  retry_count:             number;
};

export type AlertSeverity  = 'critical' | 'high' | 'medium' | 'low';
export type AlertAudience  = 'internal' | 'retail' | 'institutional' | 'all';

export type Alert = {
  id:                string;   // uuid
  alert_type:        string;
  reference_key:     string;
  title:             string;
  body:              string;
  severity:          AlertSeverity;
  audience:          AlertAudience;
  event_trigger_id:  string | null;
  ai_output_id:      string | null;
  triggered_at:      string;
  expires_at:        string | null;
  is_read:           boolean;
  is_active:         boolean;
  created_at:        string;
};

// ── Generation Jobs and Quality ───────────────────────────────────────────────

export type JobStatus = 'queued' | 'processing' | 'complete' | 'failed' | 'skipped' | 'cancelled';

export type AIGenerationJob = {
  id:                 string;   // uuid
  job_type:           AIOutputType;
  reference_key:      string;
  trigger_reason:     'scheduled' | 'event_triggered' | 'cache_miss' | 'cache_invalidation' | 'manual';
  trigger_source_id:  string | null;
  priority:           number;
  status:             JobStatus;
  output_id:          string | null;
  queued_at:          string;
  started_at:         string | null;
  completed_at:       string | null;
  queue_wait_ms:      number | null;
  processing_ms:      number | null;
  total_tokens:       number | null;
  error_message:      string | null;
  retry_count:        number;
  model_version:      string | null;
  prompt_version:     string | null;
};

export type QualityCheckStatus = 'passed' | 'warning' | 'failed';

export type QualityCheckRun = {
  check_name: string;
  status:     QualityCheckStatus;
  detail:     string;
  matches?:   string[];
};

export type AIQualityCheck = {
  id:              string;
  output_id:       string;
  job_id:          string | null;
  overall_status:  QualityCheckStatus;
  checks_run:      QualityCheckRun[];
  violations:      Array<Record<string, unknown>>;
  requires_review: boolean;
  reviewed_at:     string | null;
  reviewed_by:     string | null;
  review_notes:    string | null;
  checked_at:      string;
};
