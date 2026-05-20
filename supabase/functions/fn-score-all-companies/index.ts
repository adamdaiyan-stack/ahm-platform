// supabase/functions/fn-score-all-companies/index.ts
//
// Edge Function: nightly cron — scores every active company.
//
// CRON SCHEDULE
//   Configured in Supabase dashboard: 0 2 * * *  (02:00 UTC = 07:00 PKT)
//   Runs after daily_prices have been ingested for the previous trading day.
//
// ARCHITECTURE
//   For each active company:
//     1. Assembles ScoringInputs (7 DB queries)
//     2. Computes SectorPercentileRanks (sector peer data)
//     3. Runs computeConvictionScore() -- pure, no DB
//     4. Upserts conviction_scores (is_current = true)
//     5. Appends conviction_score_history (immutable audit)
//
//   Processing: sequential with 50ms delay between companies.
//   Target: ~100 companies in < 60 seconds.
//   Timeout: Supabase Edge Function default 60s (upgradeable to 400s on Pro).
//
// RESPONSE
//   { "scored": 95, "failed": 2, "skipped": 3, "duration_ms": 42000 }

import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  computeConvictionScore,
  SCORING_ENGINE_VERSION,
  type ScoringInputs,
  type SectorPercentileRanks,
  type ConvictionScoreResult,
} from '../_shared/scoring-engine.ts';

// ---- Supabase client --------------------------------------------------------

function getDb() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ---- Types ------------------------------------------------------------------

type ScoringJob = {
  symbol:      string;
  sector:      string;
  sector_slug: string;
};

type ScoringResult =
  | { status: 'ok';      symbol: string; score: number; tier: string }
  | { status: 'failed';  symbol: string; error: string }
  | { status: 'skipped'; symbol: string; reason: string };

// ---- Pre-fetching (sector-level data shared across companies in same sector) -

type SectorCache = Map<string, {
  drivers:    { trend: string }[];
  macroLinks: { sensitivity_direction: string }[];
  symbols:    string[];
  peerRatios: Map<string, any>;
  medians: {
    pe:        number | null;
    pb:        number | null;
    roe:       number | null;
    netMargin: number | null;
    epsGrowth: number | null;
  };
}>;

async function buildSectorCache(
  db: ReturnType<typeof getDb>,
  jobs: ScoringJob[],
): Promise<SectorCache> {
  const cache: SectorCache = new Map();
  const uniqueSlugs = [...new Set(jobs.map(j => j.sector_slug))];

  for (const slug of uniqueSlugs) {
    const job = jobs.find(j => j.sector_slug === slug)!;

    const [driversRes, macroRes, companiesRes] = await Promise.all([
      db.from('sector_drivers').select('trend').eq('sector_slug', slug),
      db.from('sector_macro_linkages').select('sensitivity_direction').eq('sector_slug', slug),
      db.from('companies').select('symbol').eq('sector', job.sector),
    ]);

    const symbols = (companiesRes.data ?? []).map((c: any) => c.symbol);

    // Latest ratio snapshot per symbol for peer comparison
    const { data: allRatios } = await db
      .from('financial_ratio_snapshots')
      .select('symbol,pe_ratio,pb_ratio,roe,net_margin,eps_growth,debt_to_equity,snapshot_date')
      .in('symbol', symbols)
      .order('snapshot_date', { ascending: false });

    const peerRatios = new Map<string, any>();
    for (const row of (allRatios ?? [])) {
      if (!peerRatios.has(row.symbol)) peerRatios.set(row.symbol, row);
    }

    const peerRows = [...peerRatios.values()];

    cache.set(slug, {
      drivers:    driversRes.data ?? [],
      macroLinks: macroRes.data   ?? [],
      symbols,
      peerRatios,
      medians: {
        pe:        computeMedian(peerRows.map((r: any) => r.pe_ratio)),
        pb:        computeMedian(peerRows.map((r: any) => r.pb_ratio)),
        roe:       computeMedian(peerRows.map((r: any) => r.roe)),
        netMargin: computeMedian(peerRows.map((r: any) => r.net_margin)),
        epsGrowth: computeMedian(peerRows.map((r: any) => r.eps_growth)),
      },
    });
  }

  return cache;
}

// ---- Per-company scoring ----------------------------------------------------

async function scoreCompany(
  db:          ReturnType<typeof getDb>,
  job:         ScoringJob,
  sectorCache: SectorCache,
): Promise<ConvictionScoreResult> {
  const { symbol, sector, sector_slug } = job;
  const cache = sectorCache.get(sector_slug)!;

  // Latest financial ratio snapshot
  const { data: ratio } = await db
    .from('financial_ratio_snapshots')
    .select('pe_ratio,pb_ratio,ev_ebitda,fcf_yield,dividend_yield,roe,net_margin,ebitda_margin,roce,eps_growth,revenue_growth,pat_growth,pat_cagr_3y,debt_to_equity,interest_cover,period_key,snapshot_date')
    .eq('symbol', symbol)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  const metricsAgeDays = ratio?.snapshot_date
    ? Math.floor((Date.now() - new Date(ratio.snapshot_date).getTime()) / 86_400_000)
    : 365;

  // Intelligence blocks
  const { data: blocks } = await db
    .from('company_intelligence_blocks')
    .select('block_type,severity,horizon')
    .eq('symbol', symbol)
    .eq('is_active', true);

  const b = blocks ?? [];
  const catalystNear   = b.filter((x: any) => x.block_type === 'catalyst' && x.horizon === 'near').length;
  const catalystMedium = b.filter((x: any) => x.block_type === 'catalyst' && x.horizon === 'medium').length;
  const catalystLong   = b.filter((x: any) => x.block_type === 'catalyst' && x.horizon === 'long').length;
  const riskHigh   = b.filter((x: any) => x.block_type === 'risk' && x.severity === 'high').length;
  const riskMedium = b.filter((x: any) => x.block_type === 'risk' && x.severity === 'medium').length;
  const riskLow    = b.filter((x: any) => x.block_type === 'risk' && x.severity === 'low').length;

  // 30-day price trend
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 35);
  const { data: prices } = await db
    .from('daily_prices')
    .select('close,market_date')
    .eq('symbol', symbol)
    .gte('market_date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('market_date', { ascending: false });

  const priceList = prices ?? [];
  let priceTrend30d: 'positive' | 'negative' | 'flat' | null = null;
  if (priceList.length >= 2) {
    const latest = priceList[0].close;
    const oldest = priceList[priceList.length - 1].close;
    if (oldest > 0) {
      const pct = ((latest - oldest) / oldest) * 100;
      priceTrend30d = pct > 3 ? 'positive' : pct < -3 ? 'negative' : 'flat';
    }
  }

  // Sector-level data from cache
  const d = cache.drivers;
  const m = cache.macroLinks;

  const inputs: ScoringInputs = {
    symbol,
    sector,
    sector_slug,

    pe_ratio:       ratio?.pe_ratio       ?? null,
    pb_ratio:       ratio?.pb_ratio       ?? null,
    ev_ebitda:      ratio?.ev_ebitda      ?? null,
    fcf_yield:      ratio?.fcf_yield      ?? null,
    dividend_yield: ratio?.dividend_yield ?? null,
    roe:            ratio?.roe            ?? null,
    net_margin:     ratio?.net_margin     ?? null,
    ebitda_margin:  ratio?.ebitda_margin  ?? null,
    roce:           ratio?.roce           ?? null,
    eps_growth:     ratio?.eps_growth     ?? null,
    revenue_growth: ratio?.revenue_growth ?? null,
    pat_growth:     ratio?.pat_growth     ?? null,
    eps_cagr_3y:    ratio?.pat_cagr_3y    ?? null,
    debt_to_equity: ratio?.debt_to_equity ?? null,
    interest_cover: ratio?.interest_cover ?? null,
    metrics_period: ratio?.period_key     ?? null,
    metrics_age_days: metricsAgeDays,

    catalyst_count_near:   catalystNear,
    catalyst_count_medium: catalystMedium,
    catalyst_count_long:   catalystLong,
    risk_count_high:       riskHigh,
    risk_count_medium:     riskMedium,
    risk_count_low:        riskLow,

    sector_driver_positive: d.filter((x: any) => x.trend === 'positive').length,
    sector_driver_negative: d.filter((x: any) => x.trend === 'negative').length,
    sector_driver_neutral:  d.filter((x: any) => x.trend === 'neutral').length,
    sector_driver_watch:    d.filter((x: any) => x.trend === 'watch').length,

    active_negative_macro_drivers: m.filter((x: any) => x.sensitivity_direction === 'negative').length,
    active_positive_macro_drivers: m.filter((x: any) => x.sensitivity_direction === 'positive').length,

    price_trend_30d: priceTrend30d,

    sector_median_pe:         cache.medians.pe,
    sector_median_pb:         cache.medians.pb,
    sector_median_roe:        cache.medians.roe,
    sector_median_net_margin: cache.medians.netMargin,
    sector_median_eps_growth: cache.medians.epsGrowth,

    price_vs_200dma:  null,
    trend_structure:  null,
    volume_signal:    null,
  };

  // Peer ranks (computed from cached peer data)
  const peers = [...cache.peerRatios.values()];
  const pctRanks: SectorPercentileRanks = {
    pe_rank:         computePercentile(peers, symbol, 'pe_ratio',       false),
    pb_rank:         computePercentile(peers, symbol, 'pb_ratio',       false),
    roe_rank:        computePercentile(peers, symbol, 'roe',            true),
    net_margin_rank: computePercentile(peers, symbol, 'net_margin',     true),
    eps_growth_rank: computePercentile(peers, symbol, 'eps_growth',     true),
    debt_eq_rank:    computePercentile(peers, symbol, 'debt_to_equity', false),
    sector_size:     peers.length,
  };

  return computeConvictionScore(inputs, pctRanks);
}

// ---- Persistence ------------------------------------------------------------

async function persistScore(db: ReturnType<typeof getDb>, result: ConvictionScoreResult): Promise<void> {
  await db.from('conviction_scores').update({ is_current: false }).eq('symbol', result.symbol).eq('is_current', true);

  const row = {
    symbol:          result.symbol,
    score:           result.score,
    tier:            result.tier,
    sub_scores:      result.sub_scores,
    weights_applied: result.weights_applied,
    data_confidence: result.data_confidence,
    inputs_snapshot: result.inputs_snapshot,
    score_version:   result.score_version,
    is_current:      true,
    scored_at:       result.scored_at.toISOString(),
  };

  const { error: insertErr } = await db.from('conviction_scores').insert(row);
  if (insertErr) throw new Error('conviction_scores insert failed: ' + insertErr.message);

  await db.from('conviction_score_history').insert({ ...row, is_current: undefined });
}

// ---- HTTP handler -----------------------------------------------------------

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startMs = Date.now();
  const db      = getDb();

  try {
    // 1. Get all active companies with their sector slugs
    const { data: companies, error: compErr } = await db
      .from('companies')
      .select('symbol, sector');

    if (compErr) throw new Error('Failed to load companies: ' + compErr.message);

    // Resolve sector slugs
    const { data: sectors } = await db.from('sectors').select('slug, db_sector_name');
    const sectorSlugMap = new Map<string, string>(); // db_sector_name -> slug
    for (const s of (sectors ?? [])) {
      sectorSlugMap.set(s.db_sector_name, s.slug);
    }

    const jobs: ScoringJob[] = (companies ?? [])
      .filter((c: any) => sectorSlugMap.has(c.sector))
      .map((c: any) => ({
        symbol:      c.symbol,
        sector:      c.sector,
        sector_slug: sectorSlugMap.get(c.sector)!,
      }));

    console.log(`[fn-score-all-companies] ${jobs.length} companies to score`);

    // 2. Build sector-level cache (shared queries per sector)
    const sectorCache = await buildSectorCache(db, jobs);

    // 3. Score each company
    const results: ScoringResult[] = [];

    for (const job of jobs) {
      try {
        const result = await scoreCompany(db, job, sectorCache);
        await persistScore(db, result);
        results.push({ status: 'ok', symbol: job.symbol, score: result.score, tier: result.tier });
        console.log(`[ok] ${job.symbol}: ${result.score} (${result.tier})`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ status: 'failed', symbol: job.symbol, error: message });
        console.error(`[fail] ${job.symbol}: ${message}`);
      }

      // Small delay to avoid overwhelming the DB connection pool
      await new Promise(r => setTimeout(r, 50));
    }

    const scored  = results.filter(r => r.status === 'ok').length;
    const failed  = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const durationMs = Date.now() - startMs;

    console.log(`[fn-score-all-companies] done: ${scored} ok, ${failed} failed, ${skipped} skipped in ${durationMs}ms`);

    return new Response(
      JSON.stringify({
        scored,
        failed,
        skipped,
        duration_ms:   durationMs,
        score_version: SCORING_ENGINE_VERSION,
        failures:      results.filter(r => r.status === 'failed'),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fn-score-all-companies] fatal:', message);
    return new Response(
      JSON.stringify({ error: message, duration_ms: Date.now() - startMs }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

// ---- Utility functions ------------------------------------------------------

function computeMedian(values: (number | null)[]): number | null {
  const defined = values.filter((v): v is number => v !== null);
  if (defined.length === 0) return null;
  const sorted = [...defined].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function computePercentile(peers: any[], targetSymbol: string, field: string, higherIsBetter: boolean): number | null {
  const defined = peers.filter(p => p[field] !== null);
  if (defined.length === 0) return null;
  const target = defined.find((p: any) => p.symbol === targetSymbol);
  if (!target) return null;
  const sorted = [...defined].sort((a: any, b: any) => a[field] - b[field]);
  const idx = sorted.findIndex((p: any) => p.symbol === targetSymbol);
  const pct = higherIsBetter
    ? (idx / (sorted.length - 1)) * 100
    : ((sorted.length - 1 - idx) / (sorted.length - 1)) * 100;
  return Math.round(pct);
}
