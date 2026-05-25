// supabase/functions/fn-generate-company-narrative/index.ts
//
// Generates company_narrative + conviction_interpretation for a single PSX company.
// REQUEST: POST { "symbol": "HBL" }  OR  GET ?symbol=HBL

import { createClient } from 'npm:@supabase/supabase-js@2';
import { generate }     from '../_shared/ai-generator.ts';

// ---- Types (aligned to actual DB schema) ------------------------------------

type CompanyRow = {
  symbol:       string;
  company_name: string;
  sector:       string;
  market_cap:   number | null;
};

type ConvictionRow = {
  score:           number;
  tier:            string;
  data_confidence: number;
  sub_scores:      Record<string, { score: number; confidence: number; notes: string[] }>;
  inputs_snapshot: Record<string, unknown>;
  scored_at:       string;
};

type IntelBlockRow = {
  block_type:  string;
  title:       string;
  body:        string | null;
  severity:    string | null;
  horizon:     string | null;
  sort_order:  number;
  source:      string | null;
};

type RatioRow = {
  pe_ratio:       number | null;
  pb_ratio:       number | null;
  ev_ebitda:      number | null;
  roe:            number | null;
  net_margin:     number | null;
  ebitda_margin:  number | null;
  debt_to_equity: number | null;
  interest_cover: number | null;
  eps_growth:     number | null;
  revenue_growth: number | null;
  pat_growth:     number | null;
  dividend_yield: number | null;
  period_key:     string | null;
  snapshot_date:  string | null;
};

type SectorDriverRow = {
  driver_name:  string;
  trend:        string;
  description:  string | null;
};

// ---- Context assembly -------------------------------------------------------

async function assembleContext(
  db:     ReturnType<typeof createClient>,
  symbol: string,
) {
  const sym = symbol.toUpperCase();

  const [companyRes, convictionRes, blocksRes, ratioRes] = await Promise.all([
    db.from('companies')
      .select('symbol,company_name,sector,market_cap')
      .eq('symbol', sym)
      .single<CompanyRow>(),

    db.from('conviction_scores')
      .select('score,tier,data_confidence,sub_scores,inputs_snapshot,scored_at')
      .eq('symbol', sym)
      .eq('is_current', true)
      .single<ConvictionRow>(),

    db.from('company_intelligence_blocks')
      .select('block_type,title,body,severity,horizon,sort_order,source')
      .eq('symbol', sym)
      .eq('is_active', true)
      .order('sort_order', { ascending: false })
      .limit(15)
      .returns<IntelBlockRow[]>(),

    db.from('financial_ratio_snapshots')
      .select('pe_ratio,pb_ratio,ev_ebitda,roe,net_margin,ebitda_margin,debt_to_equity,interest_cover,eps_growth,revenue_growth,pat_growth,dividend_yield,period_key,snapshot_date')
      .eq('symbol', sym)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single<RatioRow>(),
  ]);

  const company = companyRes.data;

  // Sector drivers — secondary query after company fetch
  let sectorDrivers: SectorDriverRow[] = [];
  if (company?.sector) {
    const { data: sectorData } = await db
      .from('sectors')
      .select('slug')
      .eq('db_sector_name', company.sector)
      .single();
    if (sectorData?.slug) {
      const { data: drivers } = await db
        .from('sector_drivers')
        .select('driver_name,trend,description')
        .eq('sector_slug', sectorData.slug)
        .order('sort_order', { ascending: true })
        .limit(6)
        .returns<SectorDriverRow[]>();
      sectorDrivers = drivers ?? [];
    }
  }

  return {
    company,
    conviction:    convictionRes.data ?? null,
    blocks:        blocksRes.data     ?? [],
    ratio:         ratioRes.data      ?? null,
    sectorDrivers,
  };
}

// ---- Utility formatters -----------------------------------------------------

function blocksByType(blocks: IntelBlockRow[], types: string[]): string {
  const filtered = blocks.filter(b => types.includes(b.block_type));
  if (!filtered.length) return 'None on record.';
  return filtered.map(b => {
    const sev = b.severity ? ` [${b.severity.toUpperCase()}]` : '';
    const hor = b.horizon  ? ` (${b.horizon}-term)` : '';
    return `• ${b.title}${sev}${hor}\n  ${b.body ?? ''}`;
  }).join('\n');
}

function fmtRatio(val: number | null, decimals = 1, suffix = ''): string {
  return val != null ? val.toFixed(decimals) + suffix : 'n/a';
}

// ---- Substitution builders (must match ai_prompt_templates.variables) -------

function buildNarrativeSubstitutions(
  ctx:    Awaited<ReturnType<typeof assembleContext>>,
  symbol: string,
): Record<string, string> {
  const co  = ctx.company;
  const cvx = ctx.conviction;
  const sub = (cvx?.sub_scores ?? {}) as Record<string, { score: number }>;
  const ratio = ctx.ratio;

  const scoreFn = (key: string) => {
    const s = sub[key]?.score;
    return s != null ? s.toFixed(0) : 'N/A';
  };

  // Key metrics from ratio snapshot
  const metricLines: string[] = [];
  if (ratio) {
    if (ratio.pe_ratio       != null) metricLines.push(`P/E: ${fmtRatio(ratio.pe_ratio)}x`);
    if (ratio.pb_ratio       != null) metricLines.push(`P/B: ${fmtRatio(ratio.pb_ratio, 2)}x`);
    if (ratio.ev_ebitda      != null) metricLines.push(`EV/EBITDA: ${fmtRatio(ratio.ev_ebitda)}x`);
    if (ratio.roe            != null) metricLines.push(`ROE: ${fmtRatio(ratio.roe)}%`);
    if (ratio.net_margin     != null) metricLines.push(`Net Margin: ${fmtRatio(ratio.net_margin)}%`);
    if (ratio.ebitda_margin  != null) metricLines.push(`EBITDA Margin: ${fmtRatio(ratio.ebitda_margin)}%`);
    if (ratio.debt_to_equity != null) metricLines.push(`D/E: ${fmtRatio(ratio.debt_to_equity, 2)}x`);
    if (ratio.interest_cover != null) metricLines.push(`Int. Cover: ${fmtRatio(ratio.interest_cover)}x`);
    if (ratio.eps_growth     != null) metricLines.push(`EPS Growth: ${fmtRatio(ratio.eps_growth)}%`);
    if (ratio.revenue_growth != null) metricLines.push(`Revenue Growth: ${fmtRatio(ratio.revenue_growth)}%`);
    if (ratio.dividend_yield != null) metricLines.push(`Div Yield: ${fmtRatio(ratio.dividend_yield, 2)}%`);
  }

  // Sector driver summary
  const driverSummary = ctx.sectorDrivers.length
    ? ctx.sectorDrivers.map(d => {
        const sym = d.trend === 'positive' ? '+' : d.trend === 'negative' ? '-' : '~';
        return `${sym} ${d.driver_name}${d.description ? ': ' + d.description : ''}`;
      }).join('\n')
    : 'Sector driver data not available.';

  // Valuation
  const valPoints: string[] = [];
  if (ratio?.pe_ratio  != null) valPoints.push(`P/E: ${fmtRatio(ratio.pe_ratio)}x`);
  if (ratio?.pb_ratio  != null) valPoints.push(`P/B: ${fmtRatio(ratio.pb_ratio, 2)}x`);
  if (ratio?.ev_ebitda != null) valPoints.push(`EV/EBITDA: ${fmtRatio(ratio.ev_ebitda)}x`);

  return {
    symbol:            co?.symbol       ?? symbol,
    company_name:      co?.company_name ?? symbol,
    conviction_score:  cvx ? cvx.score.toFixed(0) : 'N/A',
    conviction_tier:   cvx?.tier        ?? 'N/A',
    conviction_trend:  'Not available (first score run)',
    score_valuation:   scoreFn('valuation'),
    score_profitability: scoreFn('profitability'),
    score_growth:        scoreFn('growth'),
    score_balance_sheet: scoreFn('balance_sheet'),
    score_catalyst:      scoreFn('catalyst'),
    score_risk:          scoreFn('risk'),
    thesis_summary:    blocksByType(ctx.blocks, ['thesis', 'takeaway']),
    thesis_themes:     blocksByType(ctx.blocks, ['theme', 'trend']),
    drivers:           blocksByType(ctx.blocks, ['catalyst', 'driver']),
    risks:             blocksByType(ctx.blocks, ['risk', 'regulatory_risk']),
    catalysts:         blocksByType(ctx.blocks, ['catalyst']),
    valuation_points:  valPoints.length ? valPoints.join(' | ') : 'No valuation data available.',
    valuation_summary: ratio ? `Latest period: ${ratio.period_key ?? 'N/A'}` : 'No financial data available.',
    sector:            co?.sector       ?? 'N/A',
    sector_driver_summary: driverSummary,
    metrics_period:    ratio?.period_key ?? 'N/A',
    key_metrics:       metricLines.length ? metricLines.join('\n') : 'No financial metrics available.',
  };
}

function buildConvictionSubstitutions(
  ctx:    Awaited<ReturnType<typeof assembleContext>>,
  symbol: string,
): Record<string, string> {
  const co  = ctx.company;
  const cvx = ctx.conviction;
  const sub = (cvx?.sub_scores ?? {}) as Record<string, { score: number }>;

  const scoreFn = (key: string) => {
    const s = sub[key]?.score;
    return s != null ? s.toFixed(0) : 'N/A';
  };

  // Highest / lowest sub-scores (exclude technical_timing which is always 50)
  const scoreEntries = Object.entries(sub)
    .filter(([k]) => k !== 'technical_timing')
    .map(([k, v]) => ({ name: k.replace(/_/g, ' '), score: (v as any).score ?? 50 }))
    .sort((a, b) => b.score - a.score);

  const highest = scoreEntries[0];
  const lowest  = scoreEntries[scoreEntries.length - 1];

  // Valuation signal from inputs_snapshot
  const inp = (cvx?.inputs_snapshot ?? {}) as Record<string, unknown>;
  const pe    = inp.pe_ratio as number | null;
  const medPE = inp.sector_median_pe as number | null;
  const valSignal = (() => {
    if (!pe) return 'Insufficient valuation data';
    if (!medPE) return `PE ratio: ${pe.toFixed(1)}x`;
    const ratio = pe / medPE;
    if (ratio < 0.8) return `Discount to sector median (${pe.toFixed(1)}x vs ${medPE.toFixed(1)}x sector median)`;
    if (ratio > 1.2) return `Premium to sector median (${pe.toFixed(1)}x vs ${medPE.toFixed(1)}x sector median)`;
    return `In line with sector median (${pe.toFixed(1)}x vs ${medPE.toFixed(1)}x sector median)`;
  })();

  return {
    symbol:         co?.symbol       ?? symbol,
    company_name:   co?.company_name ?? symbol,
    conviction_score: cvx ? cvx.score.toFixed(0) : 'N/A',
    conviction_tier:  cvx?.tier      ?? 'N/A',
    previous_score: 'N/A (first score run)',
    previous_tier:  'N/A',
    score_valuation:        scoreFn('valuation'),
    valuation_signal:       valSignal,
    score_profitability:    scoreFn('profitability'),
    score_growth:           scoreFn('growth'),
    score_balance_sheet:    scoreFn('balance_sheet'),
    score_catalyst:         scoreFn('catalyst'),
    score_risk:             scoreFn('risk'),
    score_sector_relative:  scoreFn('sector_relative_strength'),
    data_confidence:        cvx ? (cvx.data_confidence * 100).toFixed(0) + '%' : 'N/A',
    highest_subscore_name:  highest?.name           ?? 'N/A',
    highest_subscore_value: highest?.score.toFixed(0) ?? 'N/A',
    lowest_subscore_name:   lowest?.name            ?? 'N/A',
    lowest_subscore_value:  lowest?.score.toFixed(0) ?? 'N/A',
  };
}

function buildInputSnapshot(
  ctx:    Awaited<ReturnType<typeof assembleContext>>,
  symbol: string,
): Record<string, unknown> {
  const cvx = ctx.conviction;
  const sub = (cvx?.sub_scores ?? {}) as Record<string, { score: number }>;
  return {
    symbol,
    conviction_score:  cvx?.score          ?? null,
    conviction_tier:   cvx?.tier           ?? null,
    data_confidence:   cvx?.data_confidence ?? null,
    scored_at:         cvx?.scored_at       ?? null,
    sub_score_summary: Object.entries(sub).map(([k, v]) => ({ key: k, score: (v as any).score })),
    intel_block_count: ctx.blocks.length,
    intel_block_keys:  ctx.blocks.map((b: any) => `${b.block_type}:${b.title.slice(0, 40)}`),
    has_financial_data: !!ctx.ratio,
    metrics_period:    ctx.ratio?.period_key ?? null,
  };
}

// ---- Main handler -----------------------------------------------------------

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let symbol    = '';
    let forceFlag = false;
    if (req.method === 'GET') {
      const u = new URL(req.url);
      symbol    = u.searchParams.get('symbol') ?? '';
      forceFlag = u.searchParams.get('force') === 'true';
    } else {
      const body = await req.json().catch(() => ({}));
      symbol    = body?.symbol ?? '';
      forceFlag = body?.force  === true;
    }

    symbol = symbol.trim().toUpperCase();
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    const db = createClient(supabaseUrl, serviceKey);

    const ctx = await assembleContext(db, symbol);

    if (!ctx.company) {
      return new Response(
        JSON.stringify({ error: `Company not found: ${symbol}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const inputSnapshot = buildInputSnapshot(ctx, symbol);

    const narrativeSubs   = buildNarrativeSubstitutions(ctx, symbol);
    const narrativeResult = await generate(db, {
      outputType:      'company_narrative',
      referenceKey:    symbol,
      substitutions:   narrativeSubs,
      inputSnapshot,
      forceRegenerate: forceFlag,
    });

    const convictionSubs   = buildConvictionSubstitutions(ctx, symbol);
    const convictionResult = await generate(db, {
      outputType:      'conviction_interpretation',
      referenceKey:    symbol,
      substitutions:   convictionSubs,
      inputSnapshot,
      forceRegenerate: forceFlag,
    });

    const totalTokens =
      (narrativeResult.promptTokens    + convictionResult.promptTokens) +
      (narrativeResult.completionTokens + convictionResult.completionTokens);

    await db.from('ai_generation_jobs').insert({
      function_name:         'fn-generate-company-narrative',
      reference_key:         symbol,
      output_types:          ['company_narrative', 'conviction_interpretation'],
      total_tokens:          totalTokens,
      generation_ms:         narrativeResult.generationMs + convictionResult.generationMs,
    }).then(({ error }: { error: Error | null }) => { if (error) console.warn('ai_generation_jobs insert failed:', error.message); });

    return new Response(
      JSON.stringify({
        symbol,
        narrative: {
          outputId:         narrativeResult.outputId,
          rawText:          narrativeResult.rawText,
          fromCache:        narrativeResult.fromCache,
          skipped:          narrativeResult.skipped,
          qualityStatus:    narrativeResult.qualityStatus,
          promptTokens:     narrativeResult.promptTokens,
          completionTokens: narrativeResult.completionTokens,
          generationMs:     narrativeResult.generationMs,
        },
        conviction: {
          outputId:         convictionResult.outputId,
          rawText:          convictionResult.rawText,
          fromCache:        convictionResult.fromCache,
          skipped:          convictionResult.skipped,
          qualityStatus:    convictionResult.qualityStatus,
          promptTokens:     convictionResult.promptTokens,
          completionTokens: convictionResult.completionTokens,
          generationMs:     convictionResult.generationMs,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fn-generate-company-narrative] error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
