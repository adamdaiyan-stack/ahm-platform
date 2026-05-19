/**
 * scripts/utils/financial-normalizer.ts
 *
 * Maps raw financial statement labels to canonical AHM metric codes.
 * Used by ingestion pipelines, API connectors, and PDF extraction prep.
 *
 * Metric codes match the financial_metric_definitions table.
 * The canonical source of truth for all financial data in AHM.
 *
 * Usage:
 *   const code = normalizeLabel("Net Sales");          // → "REVENUE"
 *   const code = normalizeLabel("PAT");                // → "NET_INCOME"
 *   const code = normalizeLabel("NIM", "Banking");     // → "NIM"
 */

// ─── Alias Map ────────────────────────────────────────────────────────────────
// Maps every known raw label variant → canonical metric code.
// Matching is case-insensitive and trims whitespace.
// Longer/more-specific aliases should be listed before shorter ones to avoid
// ambiguous early matches (the map resolves on first match).

const ALIAS_MAP: Record<string, string> = {

  // ── REVENUE ─────────────────────────────────────────────────────────────────
  "net sales":                               "REVENUE",
  "turnover":                                "REVENUE",
  "revenue from operations":                 "REVENUE",
  "net revenue":                             "REVENUE",
  "total revenue":                           "REVENUE",
  "revenues":                                "REVENUE",
  "gross revenue":                           "REVENUE",
  "sales":                                   "REVENUE",
  "revenue from contracts with customers":   "REVENUE",
  "revenue":                                 "REVENUE",

  // ── OTHER_INCOME ────────────────────────────────────────────────────────────
  "other income":                            "OTHER_INCOME",
  "other operating income":                  "OTHER_INCOME",
  "non-operating income":                    "OTHER_INCOME",
  "finance income":                          "OTHER_INCOME",
  "investment income":                       "OTHER_INCOME",
  "income from investments":                 "OTHER_INCOME",
  "gain on disposal":                        "OTHER_INCOME",

  // ── COST_OF_REVENUE ──────────────────────────────────────────────────────────
  "cost of sales":                           "COST_OF_REVENUE",
  "cost of goods sold":                      "COST_OF_REVENUE",
  "cogs":                                    "COST_OF_REVENUE",
  "cost of products sold":                   "COST_OF_REVENUE",
  "cost of revenue":                         "COST_OF_REVENUE",
  "cost of services":                        "COST_OF_REVENUE",
  "cost of generation":                      "COST_OF_REVENUE",  // power sector

  // ── GROSS_PROFIT ─────────────────────────────────────────────────────────────
  "gross profit":                            "GROSS_PROFIT",
  "gross income":                            "GROSS_PROFIT",

  // ── DISTRIBUTION_EXPENSE ─────────────────────────────────────────────────────
  "distribution expenses":                   "DISTRIBUTION_EXPENSE",
  "distribution cost":                       "DISTRIBUTION_EXPENSE",
  "selling expenses":                        "DISTRIBUTION_EXPENSE",
  "marketing expenses":                      "DISTRIBUTION_EXPENSE",
  "selling and distribution expenses":       "DISTRIBUTION_EXPENSE",

  // ── ADMIN_EXPENSE ────────────────────────────────────────────────────────────
  "administrative expenses":                 "ADMIN_EXPENSE",
  "general and administrative":              "ADMIN_EXPENSE",
  "g&a expenses":                            "ADMIN_EXPENSE",
  "admin expenses":                          "ADMIN_EXPENSE",
  "general and administrative expenses":     "ADMIN_EXPENSE",
  "administration and general expenses":     "ADMIN_EXPENSE",

  // ── OPERATING_PROFIT ─────────────────────────────────────────────────────────
  "operating profit":                        "OPERATING_PROFIT",
  "ebit":                                    "OPERATING_PROFIT",
  "profit from operations":                  "OPERATING_PROFIT",
  "operating income":                        "OPERATING_PROFIT",
  "earnings before interest and tax":        "OPERATING_PROFIT",
  "earnings before interest & tax":          "OPERATING_PROFIT",
  "income from operations":                  "OPERATING_PROFIT",

  // ── EBITDA ────────────────────────────────────────────────────────────────────
  "ebitda":                                  "EBITDA",
  "earnings before interest, tax, depreciation and amortisation": "EBITDA",

  // ── DEPRECIATION_AMORTISATION ────────────────────────────────────────────────
  "depreciation":                            "DEPRECIATION_AMORTISATION",
  "amortisation":                            "DEPRECIATION_AMORTISATION",
  "depreciation and amortisation":           "DEPRECIATION_AMORTISATION",
  "depreciation & amortisation":             "DEPRECIATION_AMORTISATION",
  "d&a":                                     "DEPRECIATION_AMORTISATION",
  "depreciation and amortization":           "DEPRECIATION_AMORTISATION",

  // ── FINANCE_COST ─────────────────────────────────────────────────────────────
  "finance cost":                            "FINANCE_COST",
  "finance costs":                           "FINANCE_COST",
  "interest expense":                        "FINANCE_COST",
  "financial charges":                       "FINANCE_COST",
  "borrowing costs":                         "FINANCE_COST",
  "interest and markup expense":             "FINANCE_COST",
  "markup expense":                          "FINANCE_COST",
  "finance charges":                         "FINANCE_COST",

  // ── PROFIT_BEFORE_TAX ────────────────────────────────────────────────────────
  "profit before tax":                       "PROFIT_BEFORE_TAX",
  "profit before taxation":                  "PROFIT_BEFORE_TAX",
  "pbt":                                     "PROFIT_BEFORE_TAX",
  "ebt":                                     "PROFIT_BEFORE_TAX",
  "income before tax":                       "PROFIT_BEFORE_TAX",

  // ── TAX_EXPENSE ──────────────────────────────────────────────────────────────
  "tax expense":                             "TAX_EXPENSE",
  "income tax expense":                      "TAX_EXPENSE",
  "taxation":                                "TAX_EXPENSE",
  "income tax":                              "TAX_EXPENSE",
  "provision for income tax":                "TAX_EXPENSE",

  // ── NET_INCOME ───────────────────────────────────────────────────────────────
  "pat":                                     "NET_INCOME",
  "profit after tax":                        "NET_INCOME",
  "net profit":                              "NET_INCOME",
  "net income":                              "NET_INCOME",
  "profit for the period":                   "NET_INCOME",
  "profit for the year":                     "NET_INCOME",
  "net earnings":                            "NET_INCOME",
  "profit after taxation":                   "NET_INCOME",
  "profit attributable to shareholders":     "NET_INCOME",
  "profit attributable to equity holders":   "NET_INCOME",

  // ── TOTAL_ASSETS ─────────────────────────────────────────────────────────────
  "total assets":                            "TOTAL_ASSETS",
  "assets":                                  "TOTAL_ASSETS",

  // ── CURRENT_ASSETS ───────────────────────────────────────────────────────────
  "current assets":                          "CURRENT_ASSETS",
  "total current assets":                    "CURRENT_ASSETS",

  // ── CASH_AND_EQUIVALENTS ──────────────────────────────────────────────────────
  "cash and cash equivalents":               "CASH_AND_EQUIVALENTS",
  "cash and bank balances":                  "CASH_AND_EQUIVALENTS",
  "cash and short-term investments":         "CASH_AND_EQUIVALENTS",
  "liquid assets":                           "CASH_AND_EQUIVALENTS",
  "cash":                                    "CASH_AND_EQUIVALENTS",

  // ── INVENTORIES ──────────────────────────────────────────────────────────────
  "inventories":                             "INVENTORIES",
  "stock-in-trade":                          "INVENTORIES",
  "inventory":                               "INVENTORIES",
  "stocks":                                  "INVENTORIES",
  "stores and spares":                       "INVENTORIES",

  // ── TRADE_RECEIVABLES ─────────────────────────────────────────────────────────
  "trade receivables":                       "TRADE_RECEIVABLES",
  "trade debtors":                           "TRADE_RECEIVABLES",
  "debtors":                                 "TRADE_RECEIVABLES",
  "accounts receivable":                     "TRADE_RECEIVABLES",
  "trade and other receivables":             "TRADE_RECEIVABLES",

  // ── TOTAL_LIABILITIES ─────────────────────────────────────────────────────────
  "total liabilities":                       "TOTAL_LIABILITIES",
  "liabilities":                             "TOTAL_LIABILITIES",

  // ── CURRENT_LIABILITIES ───────────────────────────────────────────────────────
  "current liabilities":                     "CURRENT_LIABILITIES",
  "total current liabilities":               "CURRENT_LIABILITIES",

  // ── TRADE_PAYABLES ───────────────────────────────────────────────────────────
  "trade payables":                          "TRADE_PAYABLES",
  "trade creditors":                         "TRADE_PAYABLES",
  "accounts payable":                        "TRADE_PAYABLES",
  "trade and other payables":                "TRADE_PAYABLES",

  // ── TOTAL_DEBT ───────────────────────────────────────────────────────────────
  "total debt":                              "TOTAL_DEBT",
  "total borrowings":                        "TOTAL_DEBT",
  "borrowings":                              "TOTAL_DEBT",
  "total interest-bearing liabilities":      "TOTAL_DEBT",
  "debt":                                    "TOTAL_DEBT",

  // ── LONG_TERM_DEBT ───────────────────────────────────────────────────────────
  "long-term debt":                          "LONG_TERM_DEBT",
  "long-term borrowings":                    "LONG_TERM_DEBT",
  "non-current borrowings":                  "LONG_TERM_DEBT",
  "long term borrowings":                    "LONG_TERM_DEBT",

  // ── NET_DEBT ──────────────────────────────────────────────────────────────────
  "net debt":                                "NET_DEBT",
  "net borrowings":                          "NET_DEBT",

  // ── TOTAL_EQUITY ──────────────────────────────────────────────────────────────
  "total equity":                            "TOTAL_EQUITY",
  "shareholders equity":                     "TOTAL_EQUITY",
  "equity":                                  "TOTAL_EQUITY",
  "net assets":                              "TOTAL_EQUITY",
  "total shareholders equity":               "TOTAL_EQUITY",
  "equity attributable to shareholders":     "TOTAL_EQUITY",

  // ── SHARE_CAPITAL ─────────────────────────────────────────────────────────────
  "share capital":                           "SHARE_CAPITAL",
  "paid-up capital":                         "SHARE_CAPITAL",
  "ordinary share capital":                  "SHARE_CAPITAL",
  "paid up capital":                         "SHARE_CAPITAL",

  // ── RETAINED_EARNINGS ─────────────────────────────────────────────────────────
  "retained earnings":                       "RETAINED_EARNINGS",
  "accumulated profit":                      "RETAINED_EARNINGS",
  "unappropriated profit":                   "RETAINED_EARNINGS",
  "profit and loss account":                 "RETAINED_EARNINGS",

  // ── SHARES_OUTSTANDING ────────────────────────────────────────────────────────
  "shares outstanding":                      "SHARES_OUTSTANDING",
  "number of shares":                        "SHARES_OUTSTANDING",
  "shares in issue":                         "SHARES_OUTSTANDING",
  "paid-up shares":                          "SHARES_OUTSTANDING",

  // ── CFO ───────────────────────────────────────────────────────────────────────
  "cash from operations":                    "CFO",
  "cash flow from operations":               "CFO",
  "operating cash flow":                     "CFO",
  "net cash from operating activities":      "CFO",
  "net cash generated from operations":      "CFO",
  "cfo":                                     "CFO",

  // ── CAPEX ─────────────────────────────────────────────────────────────────────
  "capex":                                   "CAPEX",
  "capital expenditure":                     "CAPEX",
  "purchase of fixed assets":                "CAPEX",
  "acquisition of property plant and equipment": "CAPEX",
  "capital expenditures":                    "CAPEX",
  "purchase of property, plant and equipment":   "CAPEX",

  // ── FCF ───────────────────────────────────────────────────────────────────────
  "free cash flow":                          "FCF",
  "fcf":                                     "FCF",

  // ── CFI ───────────────────────────────────────────────────────────────────────
  "cash from investing":                     "CFI",
  "investing activities":                    "CFI",
  "net cash used in investing activities":   "CFI",

  // ── CFF ───────────────────────────────────────────────────────────────────────
  "cash from financing":                     "CFF",
  "financing activities":                    "CFF",
  "net cash from financing activities":      "CFF",

  // ── DIVIDENDS_PAID ────────────────────────────────────────────────────────────
  "dividends paid":                          "DIVIDENDS_PAID",
  "dividend payments":                       "DIVIDENDS_PAID",

  // ── Banking Sector Specific ────────────────────────────────────────────────────
  "net interest margin":                     "NIM",
  "nim":                                     "NIM",
  "spread":                                  "NIM",
  "casa ratio":                              "CASA_RATIO",
  "current and savings ratio":               "CASA_RATIO",
  "npl ratio":                               "NPL_RATIO",
  "non-performing loans ratio":              "NPL_RATIO",
  "infection ratio":                         "NPL_RATIO",
  "coverage ratio":                          "COVERAGE_RATIO",
  "provision coverage":                      "COVERAGE_RATIO",
  "car":                                     "CAR",
  "capital adequacy":                        "CAR",
  "capital adequacy ratio":                  "CAR",
  "cost to income ratio":                    "COST_TO_INCOME",
  "c/i ratio":                               "COST_TO_INCOME",
  "efficiency ratio":                        "COST_TO_INCOME",
  "deposit growth":                          "DEPOSIT_GROWTH",
  "advance growth":                          "ADVANCE_GROWTH",
  "loan growth":                             "ADVANCE_GROWTH",
  "net interest income":                     "NET_INTEREST_INCOME",
  "spread income":                           "NET_INTEREST_INCOME",
  "net markup income":                       "NET_INTEREST_INCOME",
  "total deposits":                          "TOTAL_DEPOSITS",
  "customer deposits":                       "TOTAL_DEPOSITS",
  "deposits":                                "TOTAL_DEPOSITS",
  "net advances":                            "NET_ADVANCES",
  "net loans":                               "NET_ADVANCES",
  "advances":                                "NET_ADVANCES",

  // ── Oil & Gas ─────────────────────────────────────────────────────────────────
  "oil production":                          "OIL_PRODUCTION_BOPD",
  "production (bopd)":                       "OIL_PRODUCTION_BOPD",
  "gas production":                          "GAS_PRODUCTION_MMCFD",
  "production (mmcfd)":                      "GAS_PRODUCTION_MMCFD",

  // ── Cement ────────────────────────────────────────────────────────────────────
  "cement sales":                            "CEMENT_DISPATCHES_MT",
  "dispatches (mt)":                         "CEMENT_DISPATCHES_MT",
  "offtake":                                 "CEMENT_DISPATCHES_MT",
  "utilisation rate":                        "UTILISATION_RATE",
  "utilization rate":                        "UTILISATION_RATE",
  "capacity utilisation":                    "UTILISATION_RATE",
  "retention price":                         "RETENTION_PRICE_PKR_BAG",
  "ex-factory price":                        "RETENTION_PRICE_PKR_BAG",
};

// ─── Normalizer ───────────────────────────────────────────────────────────────

/**
 * Normalise a raw financial label to a canonical AHM metric code.
 *
 * @param rawLabel   - Label as it appeared in the source (PSX filing, PDF, API)
 * @param sector     - Optional sector name for disambiguation
 * @returns metric_code string or null if unrecognised
 */
export function normalizeLabel(rawLabel: string, _sector?: string): string | null {
  if (!rawLabel) return null;
  const key = rawLabel.trim().toLowerCase().replace(/\s+/g, " ");
  return ALIAS_MAP[key] ?? null;
}

/**
 * Normalise a value to PKR millions given its source unit.
 */
export function normalizeValue(
  value:     number,
  valueUnit: "pkr_millions" | "pkr_thousands" | "pkr_billions" | "pkr_units" | "per_share",
): number {
  switch (valueUnit) {
    case "pkr_thousands": return value / 1_000;
    case "pkr_billions":  return value * 1_000;
    case "pkr_units":     return value / 1_000_000;
    case "per_share":     return value;              // per-share values kept as-is
    case "pkr_millions":
    default:              return value;
  }
}

/**
 * Map a metric_code to the financial_metrics column name.
 * Used when writing normalised lines into the flat financial_metrics table.
 */
export const METRIC_TO_COLUMN: Record<string, string> = {
  REVENUE:                   "revenue",
  REVENUE_FROM_OPERATIONS:   "revenue_from_operations",
  OTHER_INCOME:              "other_income",
  COST_OF_REVENUE:           "cost_of_revenue",
  GROSS_PROFIT:              "gross_profit",
  DISTRIBUTION_EXPENSE:      "distribution_expense",
  ADMIN_EXPENSE:             "admin_expense",
  OPERATING_PROFIT:          "operating_profit",
  EBITDA:                    "ebitda",
  DEPRECIATION_AMORTISATION: "depreciation_amortisation",
  FINANCE_COST:              "finance_cost",
  PROFIT_BEFORE_TAX:         "profit_before_tax",
  TAX_EXPENSE:               "tax_expense",
  NET_INCOME:                "pat",
  TOTAL_ASSETS:              "total_assets",
  CURRENT_ASSETS:            "current_assets",
  CASH_AND_EQUIVALENTS:      "cash_and_equivalents",
  INVENTORIES:               "inventories",
  TRADE_RECEIVABLES:         "trade_receivables",
  TOTAL_LIABILITIES:         "total_liabilities",
  CURRENT_LIABILITIES:       "current_liabilities",
  TRADE_PAYABLES:            "trade_payables",
  TOTAL_DEBT:                "total_debt",
  LONG_TERM_DEBT:            "long_term_debt",
  NET_DEBT:                  "net_debt",
  TOTAL_EQUITY:              "total_equity",
  SHARE_CAPITAL:             "share_capital",
  RETAINED_EARNINGS:         "retained_earnings",
  SHARES_OUTSTANDING:        "shares_outstanding",
  CFO:                       "cfo",
  CAPEX:                     "capex",
  FCF:                       "fcf",
  CFI:                       "cfi",
  CFF:                       "cff",
  DIVIDENDS_PAID:            "dividends_paid",
  EPS:                       "eps",
  BVPS:                      "bvps",
  CFPS:                      "cfps",
  DPS:                       "dps",
  NIM:                       "nim",
  CASA_RATIO:                "casa_ratio",
  NPL_RATIO:                 "npl_ratio",
  COVERAGE_RATIO:            "coverage_ratio",
  CAR:                       "car",
  COST_TO_INCOME:            "cost_to_income",
  DEPOSIT_GROWTH:            "deposit_growth",
  ADVANCE_GROWTH:            "advance_growth",
};

/**
 * Get all known aliases for a metric code (for display / search).
 */
export function getAliasesForCode(metricCode: string): string[] {
  return Object.entries(ALIAS_MAP)
    .filter(([, code]) => code === metricCode)
    .map(([label]) => label);
}

/**
 * Check if a metric code exists in the canonical taxonomy.
 */
export function isKnownMetricCode(code: string): boolean {
  return Object.values(ALIAS_MAP).includes(code);
}
