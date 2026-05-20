// lib/scoring/db.ts
//
// Database query helpers for the Conviction Scoring Engine.
// Called by buildScoringInputs() and buildPeerRanks() in index.ts.
//
// ARCHITECTURE
//   These are the ONLY async functions in the scoring module.
//   All query results feed into pure computeConvictionScore().
//   No scoring logic lives here -- only data assembly.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ScoringInputs, SectorPercentileRanks } from './types';

// ---- Supabase admin client -------------------------------------------------
// Use service-role key so Edge Functions can run server-side without RLS.
// The SUPABASE_SERVICE_ROLE_KEY is only available server-side.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminClient = SupabaseClient<any, any, any>;

function getSupabaseAdmin(): AdminClient {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase env vars not configured (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// ---- Raw DB row types ------------------------------------------------------

type CompanyRow = {
  symbol:  string;
  sector:  string;
};

type SectorRow = {
  slug:           string;
  db_sector_name: string;
};

type RatioRow = {
  pe_ratio:       number | null;
  pb_ratio:       number | null;
  ev_ebitda:      number | null;
  fcf_yield:      number | null;
  dividend_yield: number | null;
  roe:            number | null;
  net_margin:     number | null;
  ebitda_margin:  number | null;
  roce:           number | null;
  eps_growth:     number | null;
  revenue_growth: number | null;
  pat_growth:     number | null;
  pat_cagr_3y:    number | null;
  debt_to_equity: number | null;
  interest_cover: number | null;
  period_key:     string | null;
  snapshot_date:  string;
};

type IntelBlockRow = {
  block_type: string;
  severity:   string | null;
  horizon:    string | null;
  is_active:  boolean;
};

type SectorDriverRow = {
  trend: string;
};

type MacroLinkageRow = {
  sensitivity_direction: string;
};

type DailyPriceRow = {
  close:       number;
  market_date: string;
};

// ---- Price trend helper ----------------------------------------------------

function computePriceTrend30d(
  prices: DailyPriceRow[],
): 'positive' | 'negative' | 'flat' | null {
  // prices should be ordered DESC by market_date; we want oldest and newest
  if (prices.length < 2) return null;

  const latest = prices[0].close;
  const oldest = prices[prices.length - 1].close;

  if (oldest === 0) return null;

  const changePct = ((latest - oldest) / oldest) * 100;

  if (changePct > 3)  return 'positive';
  if (changePct < -3) return 'negative';
  return 'flat';
}

// ---- Sector median helpers --------------------------------------------------

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// ---- buildScoringInputs ----------------------------------------------------

export async function buildScoringInputs(symbol: string): Promise<ScoringInputs> {
  const db  = getSupabaseAdmin();
  const sym = symbol.toUpperCase();

  // ---- 1. Company row (sector name) ----------------------------------------
  const { data: companyData, error: companyErr } = await db
    .from('companies')
    .select('symbol, sector')
    .eq('symbol', sym)
    .single<CompanyRow>();

  if (companyErr || !companyData) {
    throw new Error(`buildScoringInputs: company not found for symbol ${sym}: ${companyErr?.message}`);
  }

  // ---- 2. Resolve sector slug ----------------------------------------------
  const { data: sectorData, error: sectorErr } = await db
    .from('sectors')
    .select('slug, db_sector_name')
    .eq('db_sector_name', companyData.sector)
    .single<SectorRow>();

  if (sectorErr || !sectorData) {
    throw new Error(`buildScoringInputs: sector slug not found for sector "${companyData.sector}": ${sectorErr?.message}`);
  }

  const sectorSlug = sectorData.slug;

  // ---- 3. Latest financial ratio snapshot ----------------------------------
  const { data: ratioData } = await db
    .from('financial_ratio_snapshots')
    .select([
      'pe_ratio', 'pb_ratio', 'ev_ebitda', 'fcf_yield', 'dividend_yield',
      'roe', 'net_margin', 'ebitda_margin', 'roce',
      'eps_growth', 'revenue_growth', 'pat_growth', 'pat_cagr_3y',
      'debt_to_equity', 'interest_cover',
      'period_key', 'snapshot_date',
    ].join(', '))
    .eq('symbol', sym)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single<RatioRow>();

  // Compute metrics age in days
  const metricsAgeDays = ratioData?.snapshot_date
    ? Math.floor((Date.now() - new Date(ratioData.snapshot_date).getTime()) / 86_400_000)
    : 365; // conservative fallback: assume very stale if no data

  // ---- 4. Intelligence blocks (catalysts + risks) -------------------------
  const { data: intelData } = await db
    .from('company_intelligence_blocks')
    .select('block_type, severity, horizon, is_active')
    .eq('symbol', sym)
    .eq('is_active', true)
    .returns<IntelBlockRow[]>();

  const blocks = intelData ?? [];

  const catalystNear   = blocks.filter(b => b.block_type === 'catalyst' && b.horizon === 'near').length;
  const catalystMedium = blocks.filter(b => b.block_type === 'catalyst' && b.horizon === 'medium').length;
  const catalystLong   = blocks.filter(b => b.block_type === 'catalyst' && b.horizon === 'long').length;

  const riskHigh   = blocks.filter(b => b.block_type === 'risk' && b.severity === 'high').length;
  const riskMedium = blocks.filter(b => b.block_type === 'risk' && b.severity === 'medium').length;
  const riskLow    = blocks.filter(b => b.block_type === 'risk' && b.severity === 'low').length;

  // ---- 5. Sector drivers (trend distribution) ------------------------------
  const { data: driversData } = await db
    .from('sector_drivers')
    .select('trend')
    .eq('sector_slug', sectorSlug)
    .returns<SectorDriverRow[]>();

  const drivers = driversData ?? [];
  const driverPositive = drivers.filter(d => d.trend === 'positive').length;
  const driverNegative = drivers.filter(d => d.trend === 'negative').length;
  const driverNeutral  = drivers.filter(d => d.trend === 'neutral').length;
  const driverWatch    = drivers.filter(d => d.trend === 'watch').length;

  // ---- 6. Macro linkages (structural sensitivities for sector) -------------
  // Phase 1: count static linkages by direction.
  // Phase 2: intersect with latest macro_indicators readings to flag
  //          linkages where current conditions are adverse/favorable.
  const { data: macroData } = await db
    .from('sector_macro_linkages')
    .select('sensitivity_direction')
    .eq('sector_slug', sectorSlug)
    .returns<MacroLinkageRow[]>();

  const macroLinks = macroData ?? [];
  const activeNegativeMacro = macroLinks.filter(
    m => m.sensitivity_direction === 'negative'
  ).length;
  const activePositiveMacro = macroLinks.filter(
    m => m.sensitivity_direction === 'positive'
  ).length;

  // ---- 7. 30-day price trend -----------------------------------------------
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 35); // buffer for weekends/holidays

  const { data: pricesData } = await db
    .from('daily_prices')
    .select('close, market_date')
    .eq('symbol', sym)
    .gte('market_date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('market_date', { ascending: false })
    .returns<DailyPriceRow[]>();

  const priceTrend30d = computePriceTrend30d(pricesData ?? []);

  // ---- 8. Sector peer medians (for valuation context) ----------------------
  // Get latest ratio snapshot for every company in the sector,
  // then compute median per metric.
  const { data: peerRatiosData } = await db
    .from('financial_ratio_snapshots')
    .select('symbol, pe_ratio, pb_ratio, roe, net_margin, eps_growth, snapshot_date')
    .in(
      'symbol',
      // Subquery equivalent: get all symbols in the same sector
      // Supabase doesn't support subqueries directly, so we query companies first
      await getSectorSymbols(db, companyData.sector),
    )
    .order('snapshot_date', { ascending: false });

  type PeerRatioRow = {
    symbol: string;
    pe_ratio: number | null;
    pb_ratio: number | null;
    roe: number | null;
    net_margin: number | null;
    eps_growth: number | null;
    snapshot_date: string;
  };

  // Keep only the latest snapshot per symbol
  const latestBySymbol = new Map<string, PeerRatioRow>();
  for (const row of ((peerRatiosData ?? []) as PeerRatioRow[])) {
    if (!latestBySymbol.has(row.symbol)) {
      latestBySymbol.set(row.symbol, row);
    }
  }

  const peerRows = [...latestBySymbol.values()];

  const sectorMedianPe  = median(peerRows.map(r => r.pe_ratio).filter((v): v is number => v !== null));
  const sectorMedianPb  = median(peerRows.map(r => r.pb_ratio).filter((v): v is number => v !== null));
  const sectorMedianRoe = median(peerRows.map(r => r.roe).filter((v): v is number => v !== null));
  const sectorMedianNetMargin  = median(peerRows.map(r => r.net_margin).filter((v): v is number => v !== null));
  const sectorMedianEpsGrowth  = median(peerRows.map(r => r.eps_growth).filter((v): v is number => v !== null));

  // ---- Assemble ScoringInputs ----------------------------------------------
  return {
    symbol: sym,
    sector: companyData.sector,
    sector_slug: sectorSlug,

    pe_ratio:       ratioData?.pe_ratio       ?? null,
    pb_ratio:       ratioData?.pb_ratio       ?? null,
    ev_ebitda:      ratioData?.ev_ebitda      ?? null,
    fcf_yield:      ratioData?.fcf_yield      ?? null,
    dividend_yield: ratioData?.dividend_yield ?? null,
    roe:            ratioData?.roe            ?? null,
    net_margin:     ratioData?.net_margin     ?? null,
    ebitda_margin:  ratioData?.ebitda_margin  ?? null,
    roce:           ratioData?.roce           ?? null,
    eps_growth:     ratioData?.eps_growth     ?? null,
    revenue_growth: ratioData?.revenue_growth ?? null,
    pat_growth:     ratioData?.pat_growth     ?? null,
    eps_cagr_3y:    ratioData?.pat_cagr_3y    ?? null,  // using PAT CAGR as proxy
    debt_to_equity: ratioData?.debt_to_equity ?? null,
    interest_cover: ratioData?.interest_cover ?? null,
    metrics_period: ratioData?.period_key     ?? null,
    metrics_age_days: metricsAgeDays,

    catalyst_count_near:   catalystNear,
    catalyst_count_medium: catalystMedium,
    catalyst_count_long:   catalystLong,
    risk_count_high:       riskHigh,
    risk_count_medium:     riskMedium,
    risk_count_low:        riskLow,

    sector_driver_positive: driverPositive,
    sector_driver_negative: driverNegative,
    sector_driver_neutral:  driverNeutral,
    sector_driver_watch:    driverWatch,

    active_negative_macro_drivers: activeNegativeMacro,
    active_positive_macro_drivers: activePositiveMacro,

    price_trend_30d: priceTrend30d,

    sector_median_pe:         sectorMedianPe,
    sector_median_pb:         sectorMedianPb,
    sector_median_roe:        sectorMedianRoe,
    sector_median_net_margin: sectorMedianNetMargin,
    sector_median_eps_growth: sectorMedianEpsGrowth,

    // Phase 2 technical fields -- null until Phase 2
    price_vs_200dma:  null,
    trend_structure:  null,
    volume_signal:    null,
  };
}

// ---- buildPeerRanks ---------------------------------------------------------

export async function buildPeerRanks(
  symbol:     string,
  sectorSlug: string,
): Promise<SectorPercentileRanks> {
  const db  = getSupabaseAdmin();
  const sym = symbol.toUpperCase();

  // Resolve sector db_sector_name from slug
  const { data: sectorData } = await db
    .from('sectors')
    .select('db_sector_name')
    .eq('slug', sectorSlug)
    .single<{ db_sector_name: string }>();

  if (!sectorData) {
    return nullRanks(0);
  }

  const sectorSymbols = await getSectorSymbols(db, sectorData.db_sector_name);

  if (sectorSymbols.length < 2) {
    return nullRanks(sectorSymbols.length);
  }

  // Fetch latest ratio snapshot per sector company
  const { data: allRatios } = await db
    .from('financial_ratio_snapshots')
    .select('symbol, pe_ratio, pb_ratio, roe, net_margin, eps_growth, debt_to_equity, snapshot_date')
    .in('symbol', sectorSymbols)
    .order('snapshot_date', { ascending: false });

  // Keep only the latest snapshot per symbol
  const latestBySymbol = new Map<string, {
    symbol: string;
    pe_ratio: number | null;
    pb_ratio: number | null;
    roe: number | null;
    net_margin: number | null;
    eps_growth: number | null;
    debt_to_equity: number | null;
    snapshot_date: string;
  }>();

  for (const row of (allRatios ?? [])) {
    if (!latestBySymbol.has(row.symbol)) {
      latestBySymbol.set(row.symbol, row);
    }
  }

  const peers = [...latestBySymbol.values()];
  const sectorSize = peers.length;

  if (sectorSize < 2) {
    return nullRanks(sectorSize);
  }

  // ---- Percentile rank computation ----------------------------------------
  // For each metric, rank all companies (including the target),
  // then express target's rank as a 0-100 percentile.
  // Direction convention:
  //   pe_ratio:       lower is better  (percentile 100 = cheapest)
  //   pb_ratio:       lower is better
  //   roe:            higher is better (percentile 100 = best ROE)
  //   net_margin:     higher is better
  //   eps_growth:     higher is better
  //   debt_to_equity: lower is better

  function computePercentile(
    values: { symbol: string; v: number | null }[],
    targetSymbol: string,
    higherIsBetter: boolean,
  ): number | null {
    const defined = values.filter((x): x is { symbol: string; v: number } => x.v !== null);
    if (defined.length === 0) return null;

    const target = defined.find(x => x.symbol === targetSymbol);
    if (!target) return null;

    // Sort ascending; for higher-is-better, more values below target = higher rank
    const sorted = [...defined].sort((a, b) => a.v - b.v);
    const targetIdx = sorted.findIndex(x => x.symbol === targetSymbol);

    let percentile: number;
    if (higherIsBetter) {
      // Fraction of companies BELOW the target
      percentile = (targetIdx / (sorted.length - 1)) * 100;
    } else {
      // Inverted: fraction of companies ABOVE the target (lower is better)
      percentile = ((sorted.length - 1 - targetIdx) / (sorted.length - 1)) * 100;
    }

    return Math.round(percentile);
  }

  const peVals  = peers.map(p => ({ symbol: p.symbol, v: p.pe_ratio }));
  const pbVals  = peers.map(p => ({ symbol: p.symbol, v: p.pb_ratio }));
  const roeVals = peers.map(p => ({ symbol: p.symbol, v: p.roe }));
  const nmVals  = peers.map(p => ({ symbol: p.symbol, v: p.net_margin }));
  const epsVals = peers.map(p => ({ symbol: p.symbol, v: p.eps_growth }));
  const deVals  = peers.map(p => ({ symbol: p.symbol, v: p.debt_to_equity }));

  return {
    pe_rank:         computePercentile(peVals,  sym, false), // lower P/E = better
    pb_rank:         computePercentile(pbVals,  sym, false), // lower P/B = better
    roe_rank:        computePercentile(roeVals, sym, true),  // higher ROE = better
    net_margin_rank: computePercentile(nmVals,  sym, true),  // higher margin = better
    eps_growth_rank: computePercentile(epsVals, sym, true),  // higher growth = better
    debt_eq_rank:    computePercentile(deVals,  sym, false), // lower D/E = better
    sector_size:     sectorSize,
  };
}

// ---- Helpers ----------------------------------------------------------------

async function getSectorSymbols(
  db: AdminClient,
  dbSectorName: string,
): Promise<string[]> {
  const { data } = await db
    .from('companies')
    .select('symbol')
    .eq('sector', dbSectorName)
    .returns<{ symbol: string }[]>();

  return (data ?? []).map(r => r.symbol);
}

function nullRanks(sectorSize: number): SectorPercentileRanks {
  return {
    pe_rank:         null,
    pb_rank:         null,
    roe_rank:        null,
    net_margin_rank: null,
    eps_growth_rank: null,
    debt_eq_rank:    null,
    sector_size:     sectorSize,
  };
}
    .returns<{ symbol: string }[]>();

  return (data ?? []).map(r => r.symbol);
}

function nullRanks(sectorSize: number): SectorPercentileRanks {
  return {
    pe_rank:         null,
    pb_rank:         null,
    roe_rank:        null,
    net_margin_rank: null,
    eps_growth_rank: null,
    debt_eq_rank:    null,
    sector_size:     sectorSize,
  };
}
