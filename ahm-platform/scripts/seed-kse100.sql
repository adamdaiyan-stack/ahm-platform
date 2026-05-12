-- ============================================================
-- AHM Platform — KSE-100 Seed Data
-- Run this in the Supabase SQL Editor
-- Based on KSE-100 composition (2024-2025, secondary sources)
-- Prices/change/volume are NULL — update via your data pipeline
-- Market caps are approximate (PKR billions)
-- ============================================================

-- Step 1: Add new columns if not already present
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS eps            NUMERIC,
  ADD COLUMN IF NOT EXISTS week_52_high   NUMERIC,
  ADD COLUMN IF NOT EXISTS week_52_low    NUMERIC;

-- Step 2: Seed all KSE-100 companies
-- Uses ON CONFLICT to safely re-run without duplicates
-- Assumes symbol is UNIQUE in your companies table
-- If not: ALTER TABLE companies ADD CONSTRAINT companies_symbol_key UNIQUE (symbol);

INSERT INTO companies (symbol, company_name, sector, market_cap) VALUES

-- ── BANKING ──────────────────────────────────────────────────
('HBL',    'Habib Bank Limited',             'Banking',     1850000000000),
('UBL',    'United Bank Limited',            'Banking',     1200000000000),
('MCB',    'MCB Bank Limited',               'Banking',     1450000000000),
('MEBL',   'Meezan Bank Limited',            'Banking',     1600000000000),
('NBP',    'National Bank of Pakistan',      'Banking',      650000000000),
('ABL',    'Allied Bank Limited',            'Banking',      700000000000),
('BAFL',   'Bank Alfalah Limited',           'Banking',      580000000000),
('BAHL',   'Bank AL Habib Limited',          'Banking',      520000000000),
('BOP',    'Bank of Punjab',                 'Banking',      280000000000),
('HMB',    'Habib Metropolitan Bank',        'Banking',      320000000000),
('AKBL',   'Askari Bank Limited',            'Banking',      260000000000),
('SNBL',   'Soneri Bank Limited',            'Banking',      160000000000),
('JSBL',   'JS Bank Limited',               'Banking',      130000000000),
('FAYSAL', 'Faysal Bank Limited',            'Banking',      200000000000),

-- ── CEMENT ───────────────────────────────────────────────────
('LUCK',   'Lucky Cement Limited',           'Cement',       420000000000),
('DGKC',   'D.G. Khan Cement Company',       'Cement',       140000000000),
('MLCF',   'Maple Leaf Cement Factory',      'Cement',        90000000000),
('CHCC',   'Cherat Cement Company',          'Cement',        70000000000),
('FCCL',   'Fauji Cement Company',           'Cement',        85000000000),
('PIOC',   'Pioneer Cement Limited',         'Cement',        65000000000),
('KOHC',   'Kohat Cement Company',           'Cement',        80000000000),
('GWLC',   'Gharibwal Cement Limited',       'Cement',        45000000000),
('ACPL',   'Attock Cement Pakistan',         'Cement',        55000000000),
('POWER',  'Power Cement Limited',           'Cement',        35000000000),

-- ── FERTILISER ───────────────────────────────────────────────
('ENGRO',  'Engro Corporation Limited',      'Fertiliser',   480000000000),
('FFC',    'Fauji Fertilizer Company',       'Fertiliser',   380000000000),
('FFBL',   'Fauji Fertilizer Bin Qasim',     'Fertiliser',    80000000000),
('FATIMA', 'Fatima Fertilizer Company',      'Fertiliser',   160000000000),
('EFERT',  'Engro Fertilizers Limited',      'Fertiliser',   210000000000),

-- ── OIL & GAS E&P ────────────────────────────────────────────
('OGDC',   'Oil & Gas Dev. Company',         'Oil & Gas',   1450000000000),
('PPL',    'Pakistan Petroleum Limited',     'Oil & Gas',    680000000000),
('MARI',   'Mari Petroleum Company',         'Oil & Gas',    520000000000),
('POL',    'Pakistan Oilfields Limited',     'Oil & Gas',    270000000000),

-- ── OIL MARKETING & REFINERY ─────────────────────────────────
('PSO',    'Pakistan State Oil Company',     'Oil Marketing', 180000000000),
('APL',    'Attock Petroleum Limited',       'Oil Marketing',  95000000000),
('ATRL',   'Attock Refinery Limited',        'Oil Marketing',  75000000000),
('NRL',    'National Refinery Limited',      'Oil Marketing',  60000000000),
('PRL',    'Pakistan Refinery Limited',      'Oil Marketing',  40000000000),

-- ── POWER / IPP ──────────────────────────────────────────────
('HUBC',   'Hub Power Company',              'Power',        210000000000),
('KAPCO',  'Kot Addu Power Company',         'Power',         85000000000),
('NPL',    'Nishat Power Limited',           'Power',         30000000000),
('NCPL',   'Nishat Chunian Power',           'Power',         25000000000),
('KEL',    'K-Electric Limited',             'Power',        130000000000),
('PKGP',   'PakGen Power Limited',           'Power',         22000000000),
('SPWL',   'Saif Power Limited',             'Power',         18000000000),
('LPL',    'Lalpir Power Limited',           'Power',         16000000000),

-- ── TEXTILES ─────────────────────────────────────────────────
('ILP',    'Interloop Limited',              'Textiles',     280000000000),
('NML',    'Nishat Mills Limited',           'Textiles',     120000000000),
('NCL',    'Nishat Chunian Limited',         'Textiles',      55000000000),
('GATM',   'Gul Ahmed Textile Mills',        'Textiles',      65000000000),
('KTML',   'Kohinoor Textile Mills',         'Textiles',      40000000000),
('TREET',  'Treet Corporation Limited',      'Textiles',      25000000000),
('CRTM',   'Crescent Textile Mills',         'Textiles',      18000000000),
('CLCPS',  'Colony Textile Mills',           'Textiles',      15000000000),
('AMTEX',  'Amtex Limited',                  'Textiles',      12000000000),
('GTYR',   'General Tyre & Rubber',          'Textiles',      20000000000),

-- ── AUTOMOBILE ───────────────────────────────────────────────
('PSMC',   'Pak Suzuki Motor Company',       'Automobile',   120000000000),
('INDU',   'Indus Motor Company',            'Automobile',   250000000000),
('ATLH',   'Atlas Honda Limited',            'Automobile',   180000000000),
('HCAR',   'Honda Atlas Cars Pakistan',      'Automobile',    65000000000),
('MTL',    'Millat Tractors Limited',        'Automobile',    55000000000),
('AGTL',   'Al-Ghazi Tractors Limited',      'Automobile',    35000000000),

-- ── TECHNOLOGY ───────────────────────────────────────────────
('SYS',    'Systems Limited',               'Technology',    130000000000),
('NETSOL', 'NetSol Technologies',           'Technology',     25000000000),
('AVN',    'Avanceon Limited',              'Technology',     18000000000),
('TRG',    'TRG Pakistan Limited',          'Technology',     95000000000),

-- ── PHARMACEUTICALS ──────────────────────────────────────────
('SEARL',  'Searle Pakistan Limited',       'Pharma',         85000000000),
('AGP',    'AGP Limited',                   'Pharma',         45000000000),
('HINOPH', 'Highnoon Laboratories',         'Pharma',         35000000000),
('INIL',   'ICI Pakistan Limited',          'Pharma',         60000000000),
('FEROZ',  'Ferozsons Laboratories',        'Pharma',         18000000000),

-- ── CONSUMER / FMCG ──────────────────────────────────────────
('NESTLE', 'Nestle Pakistan Limited',       'Consumer',      320000000000),
('PAKT',   'Pakistan Tobacco Company',      'Consumer',      185000000000),
('COLG',   'Colgate-Palmolive Pakistan',    'Consumer',       75000000000),
('UNILEVER','Unilever Pakistan',            'Consumer',      310000000000),
('WAVES',  'Waves Singer Pakistan',         'Consumer',       25000000000),

-- ── CHEMICALS ────────────────────────────────────────────────
('GHGL',   'Ghani Glass Limited',           'Chemicals',      28000000000),
('LOTCHEM','Lotte Chemical Pakistan',       'Chemicals',      60000000000),
('EPCL',   'Engro Polymer & Chemicals',     'Chemicals',      75000000000),
('ILTM',   'Ismail Industries Limited',     'Chemicals',      35000000000),

-- ── INSURANCE ────────────────────────────────────────────────
('EFU',    'EFU General Insurance',         'Insurance',      65000000000),
('JLICL',  'Jubilee Life Insurance',        'Insurance',      95000000000),
('JGICL',  'Jubilee General Insurance',     'Insurance',      30000000000),
('AICL',   'Adamjee Insurance Company',     'Insurance',      25000000000),

-- ── CONGLOMERATES / OTHER ─────────────────────────────────────
('DAWH',   'Dawood Hercules Corporation',   'Conglomerate',  180000000000),
('FNEL',   'Fauji Foods Limited',           'Food',           28000000000),
('EFOODS', 'Engro Foods Limited',           'Food',          120000000000),
('UNITY',  'Unity Foods Limited',           'Food',           45000000000),
('PAEL',   'Pak Elektron Limited',          'Engineering',    65000000000),
('KCCL',   'Kohinoor Power Company',        'Engineering',    22000000000),
('MUGHAL', 'Mughal Iron & Steel',           'Steel',          55000000000),
('ISL',    'International Steels Limited',  'Steel',          45000000000),
('ASTL',   'Agha Steel Industries',         'Steel',          30000000000),
('MLPL',   'Media Times Limited',           'Media',           8000000000)

ON CONFLICT (symbol)
DO UPDATE SET
  company_name = EXCLUDED.company_name,
  sector       = EXCLUDED.sector,
  market_cap   = EXCLUDED.market_cap;

-- ============================================================
-- DONE. Next steps:
-- 1. Update current_price, change, change_percent, volume,
--    pe_ratio, dividend_yield, eps, week_52_high, week_52_low
--    for each stock with real data from your data source.
-- 2. A convenient way to do this is via a Supabase table editor
--    import (CSV upload) or a separate UPDATE script.
-- ============================================================
