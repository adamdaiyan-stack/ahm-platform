-- ============================================================
-- Migration 018: financial_metric_definitions
-- Canonical financial metric taxonomy for AHM.
-- Maps raw source labels to normalized metric codes.
-- Seeded with the full PSX-relevant metric universe.
-- Safe to run multiple times (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_metric_definitions (
  metric_code        text        PRIMARY KEY,
  -- Canonical code — uppercase snake_case. e.g. REVENUE, NET_INCOME, GROSS_MARGIN
  display_name       text        NOT NULL,
  description        text,
  statement_type     text        NOT NULL,
  -- 'income_statement' | 'balance_sheet' | 'cash_flow' | 'ratio' | 'per_share' | 'sector_specific'
  unit_type          text        NOT NULL DEFAULT 'monetary_pkr_millions',
  -- 'monetary_pkr_millions' → PKR in millions (standard for PSX)
  -- 'percentage'            → expressed as %, e.g. 23.5 means 23.5%
  -- 'ratio'                 → dimensionless ratio, e.g. 2.3x
  -- 'per_share_pkr'         → PKR per share (EPS, DPS, BVPS)
  -- 'count'                 → integer count (employees, days)
  -- 'barrels_boe'           → for oil & gas production metrics
  -- 'megawatts'             → for power sector capacity
  aliases            text[]      NOT NULL DEFAULT '{}',
  -- Common alternate names used in PSX filings
  sector_specific    bool        NOT NULL DEFAULT false,
  applicable_sectors text[]      DEFAULT NULL,
  -- NULL = universal; ['Banking', 'Insurance'] = sector-specific
  formula            text        DEFAULT NULL,
  -- For computed metrics: e.g. 'NET_INCOME / REVENUE * 100'
  is_active          bool        NOT NULL DEFAULT true,
  sort_order         int         NOT NULL DEFAULT 0,
  created_at         timestamptz DEFAULT now(),

  CONSTRAINT fmd_statement_type_check CHECK (statement_type IN (
    'income_statement', 'balance_sheet', 'cash_flow',
    'ratio', 'per_share', 'sector_specific'
  )),
  CONSTRAINT fmd_unit_type_check CHECK (unit_type IN (
    'monetary_pkr_millions', 'percentage', 'ratio',
    'per_share_pkr', 'count', 'barrels_boe', 'megawatts'
  ))
);

CREATE INDEX IF NOT EXISTS fmd_statement_type_idx
  ON financial_metric_definitions (statement_type, sort_order);

CREATE INDEX IF NOT EXISTS fmd_aliases_idx
  ON financial_metric_definitions USING GIN (aliases);

-- ── Income Statement ──────────────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type, aliases, sort_order)
VALUES
  ('REVENUE', 'Revenue', 'Total revenue from core operations before any deductions',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Net Sales','Turnover','Revenue from Operations','Sales','Net Revenue',
         'Total Revenue','Revenue from Contracts with Customers','Gross Revenue'],
   10),

  ('REVENUE_FROM_OPERATIONS', 'Revenue from Operations', 'Operating revenue excluding other income',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Revenue from Operations','Net Sales','Turnover'],
   11),

  ('OTHER_INCOME', 'Other Income', 'Non-operating income — gains, investment income, etc.',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Other Income','Other Operating Income','Non-operating Income','Finance Income','Investment Income'],
   12),

  ('COST_OF_REVENUE', 'Cost of Revenue', 'Direct cost of goods sold or services rendered',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Cost of Sales','Cost of Goods Sold','COGS','Cost of Revenue',
         'Cost of Products Sold','Cost of Services'],
   20),

  ('GROSS_PROFIT', 'Gross Profit', 'Revenue minus cost of revenue',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Gross Profit','Gross Margin (PKR)','Gross Income'],
   30),

  ('DISTRIBUTION_EXPENSE', 'Distribution Expenses', 'Selling, marketing and distribution costs',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Distribution Expenses','Distribution Cost','Selling Expenses','Marketing Expenses'],
   40),

  ('ADMIN_EXPENSE', 'Administrative Expenses', 'General and administrative overhead',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Administrative Expenses','General and Administrative','G&A Expenses','Admin Expenses'],
   41),

  ('OPERATING_PROFIT', 'Operating Profit', 'Profit from operations before finance costs and tax (EBIT)',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Operating Profit','EBIT','Profit from Operations','Operating Income',
         'Earnings Before Interest and Tax'],
   50),

  ('EBITDA', 'EBITDA', 'Earnings before interest, tax, depreciation and amortisation',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['EBITDA'],
   51),

  ('DEPRECIATION_AMORTISATION', 'Depreciation & Amortisation', 'D&A charges in the period',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Depreciation','Amortisation','Depreciation and Amortisation','D&A'],
   52),

  ('FINANCE_COST', 'Finance Costs', 'Interest expense and other financing charges',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Finance Cost','Finance Costs','Interest Expense','Financial Charges',
         'Borrowing Costs','Interest and Markup Expense'],
   60),

  ('PROFIT_BEFORE_TAX', 'Profit Before Tax', 'Profit before income tax (PBT)',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['PBT','Profit Before Tax','Profit Before Taxation','EBT'],
   70),

  ('TAX_EXPENSE', 'Income Tax Expense', 'Total income tax provision for the period',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['Tax Expense','Income Tax Expense','Taxation','Income Tax'],
   80),

  ('NET_INCOME', 'Net Income (PAT)', 'Profit after tax attributable to equity holders',
   'income_statement', 'monetary_pkr_millions',
   ARRAY['PAT','Net Profit','Profit After Tax','Net Income','Profit for the Period',
         'Net Earnings','Profit After Taxation','Profit Attributable to Shareholders'],
   90)
ON CONFLICT (metric_code) DO NOTHING;

-- ── Balance Sheet ─────────────────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type, aliases, sort_order)
VALUES
  ('TOTAL_ASSETS', 'Total Assets', 'Total assets of the company',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Total Assets','Assets'],
   110),

  ('CURRENT_ASSETS', 'Current Assets', 'Assets expected to be liquidated within one year',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Current Assets','Total Current Assets'],
   111),

  ('CASH_AND_EQUIVALENTS', 'Cash & Equivalents', 'Cash, bank balances and short-term investments',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Cash and Cash Equivalents','Cash and Bank Balances','Cash','Liquid Assets',
         'Cash and Short-term Investments'],
   112),

  ('INVENTORIES', 'Inventories', 'Stock in trade, raw materials and work in progress',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Inventories','Stock-in-Trade','Inventory','Stocks'],
   113),

  ('TRADE_RECEIVABLES', 'Trade Receivables', 'Debtors and trade receivables',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Trade Receivables','Trade Debtors','Debtors','Accounts Receivable',
         'Trade and Other Receivables'],
   114),

  ('TOTAL_LIABILITIES', 'Total Liabilities', 'Total of all liabilities',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Total Liabilities','Liabilities'],
   120),

  ('CURRENT_LIABILITIES', 'Current Liabilities', 'Liabilities due within one year',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Current Liabilities','Total Current Liabilities'],
   121),

  ('TRADE_PAYABLES', 'Trade Payables', 'Creditors and trade payables',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Trade Payables','Trade Creditors','Accounts Payable','Trade and Other Payables'],
   122),

  ('TOTAL_DEBT', 'Total Debt', 'Total interest-bearing debt (short + long term)',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Total Debt','Total Borrowings','Long-term Borrowings','Borrowings',
         'Total Interest-bearing Liabilities','Debt'],
   130),

  ('LONG_TERM_DEBT', 'Long-term Debt', 'Long-term interest-bearing debt',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Long-term Debt','Long-term Borrowings','Non-current Borrowings'],
   131),

  ('NET_DEBT', 'Net Debt', 'Total debt minus cash and equivalents',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Net Debt','Net Borrowings'],
   132),

  ('TOTAL_EQUITY', 'Total Equity', 'Shareholders equity including retained earnings and reserves',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Total Equity','Shareholders Equity','Equity','Net Assets',
         'Total Shareholders Equity','Equity Attributable to Shareholders'],
   140),

  ('SHARE_CAPITAL', 'Share Capital', 'Paid-up share capital',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Share Capital','Paid-up Capital','Ordinary Share Capital'],
   141),

  ('RETAINED_EARNINGS', 'Retained Earnings', 'Accumulated undistributed profits',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Retained Earnings','Accumulated Profit','Unappropriated Profit'],
   142),

  ('SHARES_OUTSTANDING', 'Shares Outstanding', 'Number of shares in issue (millions)',
   'balance_sheet', 'monetary_pkr_millions',
   ARRAY['Shares Outstanding','Number of Shares','Shares in Issue','Paid-up Shares'],
   150)
ON CONFLICT (metric_code) DO NOTHING;

-- ── Cash Flow Statement ───────────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type, aliases, sort_order)
VALUES
  ('CFO', 'Operating Cash Flow', 'Net cash generated from operating activities',
   'cash_flow', 'monetary_pkr_millions',
   ARRAY['Cash from Operations','Cash Flow from Operations','Operating Cash Flow',
         'Net Cash from Operating Activities','CFO'],
   210),

  ('CAPEX', 'Capital Expenditure', 'Cash spent on fixed assets and intangibles',
   'cash_flow', 'monetary_pkr_millions',
   ARRAY['CAPEX','Capital Expenditure','Purchase of Fixed Assets',
         'Acquisition of Property Plant and Equipment','Capital Expenditures'],
   220),

  ('FCF', 'Free Cash Flow', 'Operating cash flow minus capital expenditure',
   'cash_flow', 'monetary_pkr_millions',
   ARRAY['Free Cash Flow','FCF'],
   230),

  ('CFI', 'Investing Cash Flow', 'Net cash from investing activities',
   'cash_flow', 'monetary_pkr_millions',
   ARRAY['Cash from Investing','Investing Activities','Net Cash Used in Investing Activities'],
   240),

  ('CFF', 'Financing Cash Flow', 'Net cash from financing activities',
   'cash_flow', 'monetary_pkr_millions',
   ARRAY['Cash from Financing','Financing Activities','Net Cash from Financing Activities'],
   250),

  ('DIVIDENDS_PAID', 'Dividends Paid', 'Cash dividends paid to shareholders',
   'cash_flow', 'monetary_pkr_millions',
   ARRAY['Dividends Paid','Dividend Payments'],
   260)
ON CONFLICT (metric_code) DO NOTHING;

-- ── Ratios ────────────────────────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type, formula, sort_order)
VALUES
  ('PE_RATIO',    'P/E Ratio',        'Market price / Earnings per share', 'ratio', 'ratio', 'price / EPS', 310),
  ('PB_RATIO',    'P/B Ratio',        'Market price / Book value per share', 'ratio', 'ratio', 'price / BVPS', 311),
  ('EV_EBITDA',   'EV/EBITDA',        'Enterprise value / EBITDA', 'ratio', 'ratio', 'EV / EBITDA', 312),
  ('PS_RATIO',    'P/S Ratio',        'Market cap / Revenue', 'ratio', 'ratio', 'MARKET_CAP / REVENUE', 313),
  ('GROSS_MARGIN','Gross Margin',     'Gross profit as % of revenue', 'ratio', 'percentage', 'GROSS_PROFIT / REVENUE * 100', 320),
  ('EBITDA_MARGIN','EBITDA Margin',   'EBITDA as % of revenue', 'ratio', 'percentage', 'EBITDA / REVENUE * 100', 321),
  ('OPERATING_MARGIN','Operating Margin','EBIT as % of revenue', 'ratio', 'percentage', 'OPERATING_PROFIT / REVENUE * 100', 322),
  ('NET_MARGIN',  'Net Margin',       'PAT as % of revenue', 'ratio', 'percentage', 'NET_INCOME / REVENUE * 100', 323),
  ('ROE',         'Return on Equity', 'PAT / Average total equity * 100', 'ratio', 'percentage', 'NET_INCOME / TOTAL_EQUITY * 100', 330),
  ('ROA',         'Return on Assets', 'PAT / Average total assets * 100', 'ratio', 'percentage', 'NET_INCOME / TOTAL_ASSETS * 100', 331),
  ('ROCE',        'Return on Capital Employed', 'EBIT / Capital employed * 100', 'ratio', 'percentage', 'OPERATING_PROFIT / (TOTAL_ASSETS - CURRENT_LIABILITIES) * 100', 332),
  ('DEBT_TO_EQUITY','Debt/Equity',    'Total debt / Total equity', 'ratio', 'ratio', 'TOTAL_DEBT / TOTAL_EQUITY', 340),
  ('NET_DEBT_TO_EBITDA','Net Debt/EBITDA','Net debt / EBITDA', 'ratio', 'ratio', 'NET_DEBT / EBITDA', 341),
  ('CURRENT_RATIO','Current Ratio',  'Current assets / Current liabilities', 'ratio', 'ratio', 'CURRENT_ASSETS / CURRENT_LIABILITIES', 342),
  ('INTEREST_COVER','Interest Cover', 'EBIT / Finance cost', 'ratio', 'ratio', 'OPERATING_PROFIT / FINANCE_COST', 343),
  ('REVENUE_GROWTH','Revenue Growth', 'YoY revenue growth %', 'ratio', 'percentage', '(REVENUE_t - REVENUE_t-1) / REVENUE_t-1 * 100', 350),
  ('PAT_GROWTH',  'PAT Growth',      'YoY PAT growth %', 'ratio', 'percentage', '(NET_INCOME_t - NET_INCOME_t-1) / ABS(NET_INCOME_t-1) * 100', 351),
  ('EPS_GROWTH',  'EPS Growth',      'YoY EPS growth %', 'ratio', 'percentage', '(EPS_t - EPS_t-1) / ABS(EPS_t-1) * 100', 352),
  ('CFO_TO_PAT',  'Cash Conversion', 'Operating cash flow / PAT', 'ratio', 'ratio', 'CFO / NET_INCOME', 360),
  ('FCF_YIELD',   'FCF Yield',       'FCF / Market cap * 100', 'ratio', 'percentage', 'FCF / MARKET_CAP * 100', 361),
  ('FCF_MARGIN',  'FCF Margin',      'FCF / Revenue * 100', 'ratio', 'percentage', 'FCF / REVENUE * 100', 362)
ON CONFLICT (metric_code) DO NOTHING;

-- ── Per Share ─────────────────────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type, formula, sort_order)
VALUES
  ('EPS',  'Earnings Per Share', 'PAT / shares outstanding', 'per_share', 'per_share_pkr', 'NET_INCOME / SHARES_OUTSTANDING', 410),
  ('BVPS', 'Book Value Per Share', 'Total equity / shares outstanding', 'per_share', 'per_share_pkr', 'TOTAL_EQUITY / SHARES_OUTSTANDING', 411),
  ('CFPS', 'Cash Flow Per Share', 'CFO / shares outstanding', 'per_share', 'per_share_pkr', 'CFO / SHARES_OUTSTANDING', 412),
  ('DPS',  'Dividend Per Share', 'Total dividends / shares outstanding', 'per_share', 'per_share_pkr', 'DIVIDENDS_PAID / SHARES_OUTSTANDING', 413),
  ('DIVIDEND_YIELD',  'Dividend Yield', 'DPS / price * 100', 'per_share', 'percentage', 'DPS / PRICE * 100', 414),
  ('PAYOUT_RATIO', 'Payout Ratio', 'DPS / EPS * 100', 'per_share', 'percentage', 'DPS / EPS * 100', 415)
ON CONFLICT (metric_code) DO NOTHING;

-- ── Banking Sector Specific ───────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type,
   aliases, sector_specific, applicable_sectors, sort_order)
VALUES
  ('NIM', 'Net Interest Margin', 'Net interest income / Average earning assets * 100',
   'sector_specific', 'percentage',
   ARRAY['Net Interest Margin','NIM','Spread'],
   true, ARRAY['Banking', 'Investment Banks & Securities'], 510),

  ('CASA_RATIO', 'CASA Ratio', 'Current + savings deposits / total deposits * 100',
   'sector_specific', 'percentage',
   ARRAY['CASA Ratio','Current and Savings Ratio'],
   true, ARRAY['Banking'], 511),

  ('NPL_RATIO', 'NPL Ratio', 'Non-performing loans / gross advances * 100',
   'sector_specific', 'percentage',
   ARRAY['NPL Ratio','Non-Performing Loans Ratio','Infection Ratio'],
   true, ARRAY['Banking'], 512),

  ('COVERAGE_RATIO', 'Coverage Ratio', 'Specific provisions / NPLs * 100',
   'sector_specific', 'percentage',
   ARRAY['Coverage Ratio','Provision Coverage'],
   true, ARRAY['Banking'], 513),

  ('CAR', 'Capital Adequacy Ratio', 'Regulatory capital / Risk-weighted assets * 100',
   'sector_specific', 'percentage',
   ARRAY['CAR','Capital Adequacy'],
   true, ARRAY['Banking'], 514),

  ('COST_TO_INCOME', 'Cost-to-Income Ratio', 'Operating expenses / Net income (banking) * 100',
   'sector_specific', 'percentage',
   ARRAY['Cost to Income Ratio','C/I Ratio','Efficiency Ratio'],
   true, ARRAY['Banking'], 515),

  ('DEPOSIT_GROWTH', 'Deposit Growth', 'YoY growth in total deposits',
   'sector_specific', 'percentage',
   ARRAY['Deposit Growth'],
   true, ARRAY['Banking'], 516),

  ('ADVANCE_GROWTH', 'Advance Growth', 'YoY growth in net advances / loans',
   'sector_specific', 'percentage',
   ARRAY['Advance Growth','Loan Growth'],
   true, ARRAY['Banking'], 517),

  ('NET_INTEREST_INCOME', 'Net Interest Income', 'Interest earned minus interest expensed',
   'sector_specific', 'monetary_pkr_millions',
   ARRAY['Net Interest Income','Spread Income','Net Markup Income'],
   true, ARRAY['Banking', 'Investment Banks & Securities'], 518),

  ('TOTAL_DEPOSITS', 'Total Deposits', 'Customer deposits held by the bank',
   'sector_specific', 'monetary_pkr_millions',
   ARRAY['Total Deposits','Customer Deposits','Deposits'],
   true, ARRAY['Banking'], 519),

  ('NET_ADVANCES', 'Net Advances', 'Net loans and advances (after provisions)',
   'sector_specific', 'monetary_pkr_millions',
   ARRAY['Net Advances','Net Loans','Advances'],
   true, ARRAY['Banking'], 520)
ON CONFLICT (metric_code) DO NOTHING;

-- ── Oil & Gas Sector Specific ─────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type,
   aliases, sector_specific, applicable_sectors, sort_order)
VALUES
  ('OIL_PRODUCTION_BOPD', 'Oil Production (BOPD)',
   'Crude oil production in barrels of oil per day',
   'sector_specific', 'barrels_boe',
   ARRAY['Oil Production','Production (BOPD)'],
   true, ARRAY['Oil & Gas Exploration', 'Oil & Gas Marketing & Distribution'], 610),

  ('GAS_PRODUCTION_MMCFD', 'Gas Production (MMCFD)',
   'Natural gas production in million cubic feet per day',
   'sector_specific', 'barrels_boe',
   ARRAY['Gas Production','Production (MMCFD)'],
   true, ARRAY['Oil & Gas Exploration'], 611),

  ('ROYALTIES', 'Royalties', 'Royalty payments on oil and gas production',
   'sector_specific', 'monetary_pkr_millions',
   ARRAY['Royalties','Government Levies'],
   true, ARRAY['Oil & Gas Exploration'], 612)
ON CONFLICT (metric_code) DO NOTHING;

-- ── Cement Sector Specific ────────────────────────────────────────────────────

INSERT INTO financial_metric_definitions
  (metric_code, display_name, description, statement_type, unit_type,
   aliases, sector_specific, applicable_sectors, sort_order)
VALUES
  ('CEMENT_DISPATCHES_MT', 'Cement Dispatches (MT)',
   'Total cement dispatches in metric tonnes',
   'sector_specific', 'count',
   ARRAY['Cement Sales','Dispatches (MT)','Offtake'],
   true, ARRAY['Cement'], 710),

  ('UTILISATION_RATE', 'Plant Utilisation Rate',
   'Actual production / installed capacity * 100',
   'sector_specific', 'percentage',
   ARRAY['Utilisation Rate','Capacity Utilisation'],
   true, ARRAY['Cement'], 711),

  ('RETENTION_PRICE_PKR_BAG', 'Retention Price (PKR/Bag)',
   'Ex-factory cement price per 50kg bag',
   'sector_specific', 'per_share_pkr',
   ARRAY['Retention Price','Ex-factory Price'],
   true, ARRAY['Cement'], 712)
ON CONFLICT (metric_code) DO NOTHING;

COMMENT ON TABLE financial_metric_definitions IS
  'Canonical financial metric taxonomy for AHM. '
  'Maps raw labels from PSX filings to normalized metric_codes. '
  'Seeded with ~60 metrics covering all PSX sectors. '
  'Add sector-specific metrics as new sectors are onboarded.';
