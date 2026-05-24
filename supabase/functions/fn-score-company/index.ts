// supabase/functions/fn-score-company/index.ts
//
// Edge Function: score a single company on demand.
//
// USAGE
//   POST /functions/v1/fn-score-company
//   Body: { "symbol": "HBL" }
//
//   GET  /functions/v1/fn-score-company?symbol=HBL
//
// RESPONSE
//   {
//     "symbol": "HBL",
//     "score": 72,
//     "tier": "MODERATE",
//     "data_confidence": 0.9,
//     "scored_at": "2026-05-20T..."
//   }
//
// ARCHITECTURE
//   1. Assembles ScoringInputs from DB (7 query groups)
//   2. Computes SectorPercentileRanks
//   3. Runs computeConvictionScore() -- pure, no DB
//   4. Upserts conviction_scores (is_current = true)
//   5. Appends conviction_score_history (immutable audit row)
//
// Authorization: requires service-role key in Authorization header.

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

// ---- DB query helpers -------------------------------------------------------

async function assembleInputs(db: ReturnType<typeof getDb>, symbol: string): Promise<ScoringInputs> {
  // 1. Company + sector slug
  const { data: company, error: compErr } = await db
    .from('companies').select('symbol, sector').eq('symbol', symbol).single();
  if (compErr || !company) throw new Error(`Company not found: ${symbol}`);

  const { data: sector, error: secErr } = await db
    .from('sectors').select('slug, db_sector_name').eq('db_sector_name', company.sector).single();
  if (secErr || !sector) throw new Error(`Sector not found for: ${company.sector}`);

  const sectorSlug = sector.slug as string;

  // 2. Latest financial ratio snapshot
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

  // 3. Intelligence blocks (catalysts + risks)
  const { data: blocks } = await db
    .from('company_intelligence_blocks')
    .select('block_type,severity,horizon,is_active')
    .eq('symbol', symbol)
    .eq('is_active', true);

  const b = blocks ?? [];
  const catalystNear   = b.filter((x: any) => x.block_type === 'catalyst' && x.horizon === 'near').length;
  const catalystMedium = b.filter((x: any) => x.block_type === 'catalyst' && x.horizon === 'medium').length;
  const catalystLong   = b.filter((x: any) => x.block_type === 'catalyst' && x.horizon === 'long').length;
  const riskHigh   = b.filter((x: any) => x.block_type === 'risk' && x.severity === 'high').length;
  const riskMedium = b.filter((x: any) => x.block_type === 'risk' && x.severity === 'medium').length;
  const riskLow    = b.filter((x: any) => x.block_type === 'risk' && x.severity === 'low').length;

  // 4. Sector drivers
  const { data: drivers } = await db
    .from('sector_drivers').select('trend').eq('sector_slug', sectorSlug);
  const d = drivers ?? [];
  const driverPositive = d.filter((x: any) => x.trend === 'positive').length;
  const driverNegative = d.filter((x: any) => x.trend === 'negative').length;
  const driverNeutral  = d.filter((x: any) => x.trend === 'neutral').length;
  const driverWatch    = d.filter((x: any) => x.trend === 'watch').length;

  // 5. Macro linkages (static sensitivity counts -- Phase 1)
  const { data: macroLinks } = await db
    .from('sector_macro_linkages').select('sensitivity_direction').eq('sector_slug', sectorSlug);
  const m = macroLinks ?? [];
  const activeNegMacro = m.filter((x: any) => x.sensitivity_direction === 'negative').length;
  const activePoseMacro = m.filter((x: any) => x.sensitivity_direction === 'positive').length;

  // 6. 30-day price trend
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

  // 7. Sector peer medians
  const { data: sectorCompanies } = await db
    .from('companies').select('symbol').eq('sector', company.sector);
  const sectorSymbols = (sectorCompanies ?? []).map((c: any) => c.symbol);

  let sectorMedianPe: number | null = null;
  let sectorMedianPb: number | null = null;
  let sectorMedianRoe: number | null = null;
  let sectorMedianNetMargin: number | null = null;
  let sectorMedianEpsGrowth: number | null = null;

  if (sectorSymbols.length > 0) {
    const { data: peerRatios } = await db
      .from('financial_ratio_snapshots')
      .select('symbol,pe_ratio,pb_ratio,roe,net_margin,eps_growth,snapshot_date')
      .in('symbol', sectorSymbols)
      .order('snapshot_date', { ascending: false });

    const latestBySymbol = new Map<string, any>();
    for (const row of (peerRatios ?? [])) {
      if (!latestBySymbol.has(row.symbol)) latestBySymbol.set(row.symbol, row);
    }
    const peerRows = [...latestBySymbol.values()];

    sectorMedianPe          = computeMedian(peerRows.map((r: any) => r.pe_ratio));
    sectorMedianPb          = computeMedian(peerRows.map((r: any) => r.pb_ratio));
    sectorMedianRoe         = computeMedian(peerRows.map((r: any) => r.roe));
    sectorMedianNetMargin   = computeMedian(peerRows.map((r: any) => r.net_margin));
    sectorMedianEpsGrowth   = computeMedian(peerRows.map((r: any) => r.eps_growth));
  }

  return {
    symbol,
    sector:      company.sector,
    sector_slug: sectorSlug,

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

    sector_driver_positive: driverPositive,
    sector_driver_negative: driverNegative,
    sector_driver_neutral:  driverNeutral,
    sector_driver_watch:    driverWatch,

    active_negative_macro_drivers: activeNegMacro,
    active_positive_macro_drivers: activePoseMacro,

    price_trend_30d: priceTrend30d,

    sector_median_pe:         sectorMedianPe,
    sector_median_pb:         sectorMedianPb,
    sector_median_roe:        sectorMedianRoe,
    sector_median_net_margin: sectorMedianNetMargin,
    sector_median_eps_growth: sectorMedianEpsGrowth,

    price_vs_200dma:  null,
    trend_structure:  null,
    volume_signal:    null,
  };
}

async function assemblePeerRanks(db: ReturnType<typeof getDb>, symbol: string, sectorSlug: string): Promise<SectorPercentileRanks> {
  const { data: sector } = await db.from('sectors').select('db_sector_name').eq('slug', sectorSlug).single();
  if (!sector) return nullRanks(0);

  const { data: sectorCompanies } = await db.from('companies').select('symbol').eq('sector', sector.db_sector_name);
  const symbols = (sectorCompanies ?? []).map((c: any) => c.symbol);
  if (symbols.length < 2) return nullRanks(symbols.length);

  const { data: allRatios } = await db
    .from('financial_ratio_snapshots')
    .select('symbol,pe_ratio,pb_ratio,roe,net_margin,eps_growth,debt_to_equity,snapshot_date')
    .in('symbol', symbols)
    .order('snapshot_date', { ascending: false });

  const latestBySymbol = new Map<string, any>();
  for (const row of (allRatios ?? [])) {
    if (!latestBySymbol.has(row.symbol)) latestBySymbol.set(row.symbol, row);
  }
  const peers = [...latestBySymbol.values()];
  if (peers.length < 2) return nullRanks(peers.length);

  return {
    pe_rank:         computePercentile(peers, symbol, 'pe_ratio',       false),
    pb_rank:         computePercentile(peers, symbol, 'pb_ratio',       false),
    roe_rank:        computePercentile(peers, symbol, 'roe',            true),
    net_margin_rank: computePercentile(peers, symbol, 'net_margin',     true),
    eps_growth_rank: computePercentile(peers, symbol, 'eps_growth',     true),
    debt_eq_rank:    computePercentile(peers, symbol, 'debt_to_equity', false),
    sector_size:     peers.length,
  };
}

// ---- Tier ordering (for upgrade / downgrade detection) ----------------------

const TIER_ORDER: Record<string, number> = {
  HIGH_CONVICTION: 4,
  MODERATE:        3,
  WATCHLIST:       2,
  MONITOR:         1,
};

// ---- Persistence ------------------------------------------------------------

async function persistScore(
  db:            ReturnType<typeof getDb>,
  result:        ConvictionScoreResult,
  triggerReason: string = 'scheduled',
): Promise<void> {
  const { symbol } = result;

  // Query previous current row for tier-transition tracking
  const { data: prevRow } = await db
    .from('conviction_scores')
    .select('score, tier')
    .eq('symbol', symbol)
    .eq('is_current', true)
    .maybeSingle();

  const prevScore = (prevRow as any)?.score ?? null;
  const prevTier  = (prevRow as any)?.tier  ?? null;

  const tierChanged = prevTier !== null && prevTier !== result.tier;
  let tierDirection: 'upgrade' | 'downgrade' | null = null;
  if (tierChanged && prevTier !== null) {
    const prevOrd = TIER_ORDER[prevTier] ?? 0;
    const newOrd  = TIER_ORDER[result.tier] ?? 0;
    tierDirection = newOrd > prevOrd ? 'upgrade' : 'downgrade';
  }

  // Mark old row as historical
  if (prevRow) {
    await db
      .from('conviction_scores')
      .update({ is_current: false })
      .eq('symbol', symbol)
      .eq('is_current', true);
  }

  const scoredAt = result.scored_at.toISOString();

  const scoreRow = {
    symbol:          result.symbol,
    score:           result.score,
    tier:            result.tier,
    sub_scores:      result.sub_scores,
    weights_applied: result.weights_applied,
    data_confidence: result.data_confidence,
    inputs_snapshot: result.inputs_snapshot,
    score_version:   result.score_version,
    is_current:      true,
    scored_at:       scoredAt,
  };

  // Insert new current row
  await db.from('conviction_scores').insert(scoreRow);

  // Append to history with full tier-transition context (immutable audit log)
  await db.from('conviction_score_history').insert({
    symbol:          result.symbol,
    score:           result.score,
    tier:            result.tier,
    previous_score:  prevScore,
    previous_tier:   prevTier,
    tier_changed:    tierChanged,
    tier_direction:  tierDirection,
    sub_scores:      result.sub_scores,
    data_confidence: result.data_confidence,
    inputs_snapshot: result.inputs_snapshot,
    score_version:   result.score_version,
    scored_at:       scoredAt,
    trigger_reason:  triggerReason,
  });
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

  try {
    // Parse symbol from body or query param
    let symbol: string | null = null;

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      symbol = body?.symbol ?? null;
    } else {
      const url = new URL(req.url);
      symbol = url.searchParams.get('symbol');
    }

    if (!symbol || typeof symbol !== 'string') {
      return new Response(
        JSON.stringify({ error: 'symbol is required (body JSON or ?symbol= query param)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const sym = symbol.toUpperCase().trim();
    const db  = getDb();

    // Assemble inputs first (sector_slug required for peer ranks)
    const inputs   = await assembleInputs(db, sym);
    const pctRanks = await assemblePeerRanks(db, sym, inputs.sector_slug);
    const result   = computeConvictionScore(inputs, pctRanks);

    await persistScore(db, result);

    return new Response(
      JSON.stringify({
        symbol:          result.symbol,
        score:           result.score,
        tier:            result.tier,
        data_confidence: result.data_confidence,
        score_version:   result.score_version,
        scored_at:       result.scored_at.toISOString(),
        sub_scores: Object.fromEntries(
          Object.entries(result.sub_scores).map(([k, v]) => [k, { score: v.score, confidence: v.confidence }])
        ),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fn-score-company] error:', message);
    return new Response(
      JSON.stringify({ error: message }),
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

function nullRanks(sectorSize: number): SectorPercentileRanks {
  return { pe_rank: null, pb_rank: null, roe_rank: null, net_margin_rank: null, eps_growth_rank: null, debt_eq_rank: null, sector_size: sectorSize };
}
