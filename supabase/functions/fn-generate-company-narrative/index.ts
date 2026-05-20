// supabase/functions/fn-generate-company-narrative/index.ts
//
// Edge Function: generate (or serve cached) company_narrative + conviction_interpretation
// for a single PSX-listed company.
//
// REQUEST
//   POST /functions/v1/fn-generate-company-narrative
//   Body: { "symbol": "ENGRO" }
//   OR
//   GET  /functions/v1/fn-generate-company-narrative?symbol=ENGRO
//
// RESPONSE
//   {
//     "symbol": "ENGRO",
//     "narrative": { outputId, rawText, fromCache, skipped, qualityStatus, ... },
//     "conviction":{ outputId, rawText, fromCache, skipped, qualityStatus, ... }
//   }
//
// ARCHITECTURE
//   All Claude API calls, caching, quality checks, and DB writes are handled by
//   _shared/ai-generator.ts. This function only assembles the structured input
//   context from DB and formats the template substitutions.
//
//   The LLM receives ONLY structured outputs (conviction scores, validated metrics,
//   curated intelligence blocks) -- NOT raw financial statements.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { generate }     from '../_shared/ai-generator.ts';

// ---- Types ------------------------------------------------------------------

type SubScoreRow = {
  sub_score_key:     string;
  raw_score:         number;
  weighted_score:    number;
  weight:            number;
  confidence:        number;
  data_sources:      string[];
  calculation_notes: string[];
};

type ConvictionRow = {
  composite_score:   number;
  tier:              string;
  confidence_score:  number;
  data_completeness: number;
  scored_at:         string;
};

type IntelBlockRow = {
  block_type:   string;
  title:        string;
  body:         string;
  priority:     number;
  source_label: string | null;
};

type FinancialRatioRow = {
  metric_key: string;
  value:      number;
  period_end: string;
  unit:       string | null;
};

type CompanyRow = {
  symbol:         string;
  company_name:   string;
  sector_name:    string;
  listing_date:   string | null;
  market_cap_pkr: number | null;
};

// ---- Context assembly -------------------------------------------------------

async function assembleContext(
  db:     ReturnType<typeof createClient>,
  symbol: string,
) {
  const sym = symbol.toUpperCase();

  const [
    companyRes,
    convictionRes,
    subScoresRes,
    intelBlocksRes,
    ratiosRes,
  ] = await Promise.all([
    db.from('companies')
      .select('symbol,company_name,sector_name,listing_date,market_cap_pkr')
      .eq('symbol', sym)
      .single<CompanyRow>(),

    db.from('conviction_scores')
      .select('composite_score,tier,confidence_score,data_completeness,scored_at')
      .eq('symbol', sym)
      .eq('is_current', true)
      .single<ConvictionRow>(),

    db.from('conviction_sub_scores')
      .select('sub_score_key,raw_score,weighted_score,weight,confidence,data_sources,calculation_notes')
      .eq('symbol', sym)
      .eq('is_current', true)
      .order('weight', { ascending: false })
      .returns<SubScoreRow[]>(),

    db.from('intelligence_blocks')
      .select('block_type,title,body,priority,source_label')
      .eq('symbol', sym)
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(12)
      .returns<IntelBlockRow[]>(),

    db.from('financial_ratios')
      .select('metric_key,value,period_end,unit')
      .eq('symbol', sym)
      .in('metric_key', [
        'pe_ratio', 'pb_ratio', 'ev_ebitda', 'roe', 'roa', 'roic',
        'debt_to_equity', 'current_ratio', 'interest_cover',
        'revenue_growth_yoy', 'pat_growth_yoy', 'ebitda_margin',
        'net_margin', 'dividend_yield', 'payout_ratio',
      ])
      .order('period_end', { ascending: false })
      .limit(30)
      .returns<FinancialRatioRow[]>(),
  ]);

  return {
    company:     companyRes.data     ?? null,
    conviction:  convictionRes.data  ?? null,
    subScores:   subScoresRes.data   ?? [],
    intelBlocks: intelBlocksRes.data ?? [],
    ratios:      ratiosRes.data      ?? [],
  };
}

// ---- Substitution formatters ------------------------------------------------

function formatSubScores(rows: SubScoreRow[]): string {
  if (!rows.length) return 'No sub-score data available.';
  return rows
    .map(r => {
      const key    = r.sub_score_key.replace(/_/g, ' ');
      const weight = (r.weight * 100).toFixed(0);
      const conf   = (r.confidence * 100).toFixed(0);
      return `${key}: ${r.raw_score.toFixed(1)}/100 (weight ${weight}%, confidence ${conf}%)`;
    })
    .join('\n');
}

function formatIntelBlocks(rows: IntelBlockRow[]): string {
  if (!rows.length) return 'No intelligence blocks available.';
  return rows
    .map(r => {
      const src = r.source_label ? ` [${r.source_label}]` : '';
      return `[${r.block_type.toUpperCase()}] ${r.title}${src}\n${r.body}`;
    })
    .join('\n\n');
}

function formatRatios(rows: FinancialRatioRow[]): string {
  if (!rows.length) return 'No financial ratio data available.';
  // Deduplicate to latest period per metric
  const seen = new Set<string>();
  const deduped = rows.filter(r => {
    if (seen.has(r.metric_key)) return false;
    seen.add(r.metric_key);
    return true;
  });
  return deduped
    .map(r => {
      const unit = r.unit ? ` ${r.unit}` : '';
      const fmt  = Number.isInteger(r.value) ? r.value.toString() : r.value.toFixed(2);
      return `${r.metric_key.replace(/_/g, ' ')}: ${fmt}${unit}`;
    })
    .join('\n');
}

function buildNarrativeSubstitutions(
  ctx: Awaited<ReturnType<typeof assembleContext>>,
): Record<string, string> {
  const co  = ctx.company;
  const cvx = ctx.conviction;
  return {
    company_name:      co?.company_name    ?? 'Unknown Company',
    symbol:            co?.symbol          ?? 'N/A',
    sector:            co?.sector_name     ?? 'Unknown Sector',
    conviction_score:  cvx ? cvx.composite_score.toFixed(1) : 'N/A',
    conviction_tier:   cvx?.tier           ?? 'N/A',
    data_completeness: cvx ? (cvx.data_completeness * 100).toFixed(0) + '%' : 'N/A',
    confidence_score:  cvx ? (cvx.confidence_score * 100).toFixed(0) + '%' : 'N/A',
    sub_scores:        formatSubScores(ctx.subScores),
    intel_blocks:      formatIntelBlocks(ctx.intelBlocks),
    financial_ratios:  formatRatios(ctx.ratios),
    scored_at:         cvx?.scored_at      ?? new Date().toISOString(),
  };
}

function buildConvictionSubstitutions(
  ctx: Awaited<ReturnType<typeof assembleContext>>,
): Record<string, string> {
  const co  = ctx.company;
  const cvx = ctx.conviction;

  const top3 = [...ctx.subScores]
    .sort((a, b) => b.raw_score - a.raw_score)
    .slice(0, 3)
    .map(r => `${r.sub_score_key.replace(/_/g, ' ')}: ${r.raw_score.toFixed(1)}`)
    .join(', ');

  const bottom2 = [...ctx.subScores]
    .sort((a, b) => a.raw_score - b.raw_score)
    .slice(0, 2)
    .map(r => `${r.sub_score_key.replace(/_/g, ' ')}: ${r.raw_score.toFixed(1)}`)
    .join(', ');

  const riskBlocks = ctx.intelBlocks
    .filter(b => b.block_type === 'risk' || b.block_type === 'regulatory_risk')
    .slice(0, 3)
    .map(b => b.title)
    .join('; ') || 'None identified';

  return {
    company_name:      co?.company_name  ?? 'Unknown Company',
    symbol:            co?.symbol        ?? 'N/A',
    sector:            co?.sector_name   ?? 'Unknown Sector',
    conviction_score:  cvx ? cvx.composite_score.toFixed(1) : 'N/A',
    conviction_tier:   cvx?.tier         ?? 'N/A',
    top_sub_scores:    top3              || 'N/A',
    weak_sub_scores:   bottom2           || 'N/A',
    key_risks:         riskBlocks,
    data_completeness: cvx ? (cvx.data_completeness * 100).toFixed(0) + '%' : 'N/A',
  };
}

// ---- Input snapshot for cache change detection ------------------------------

function buildInputSnapshot(
  ctx:    Awaited<ReturnType<typeof assembleContext>>,
  symbol: string,
): Record<string, unknown> {
  return {
    symbol,
    conviction_score:   ctx.conviction?.composite_score   ?? null,
    conviction_tier:    ctx.conviction?.tier              ?? null,
    data_completeness:  ctx.conviction?.data_completeness ?? null,
    scored_at:          ctx.conviction?.scored_at         ?? null,
    sub_score_count:    ctx.subScores.length,
    sub_scores: ctx.subScores.map(r => ({
      key:   r.sub_score_key,
      score: r.raw_score,
      conf:  r.confidence,
    })),
    intel_block_count: ctx.intelBlocks.length,
    intel_block_keys:  ctx.intelBlocks.map(b => b.block_type + ':' + b.title.slice(0, 40)),
    ratio_count:       ctx.ratios.length,
    ratios: ctx.ratios.slice(0, 15).map(r => ({
      key:    r.metric_key,
      value:  r.value,
      period: r.period_end,
    })),
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
    // Parse symbol from body or query string
    let symbol = '';
    if (req.method === 'GET') {
      symbol = new URL(req.url).searchParams.get('symbol') ?? '';
    } else {
      const body = await req.json().catch(() => ({}));
      symbol = body?.symbol ?? '';
    }

    symbol = symbol.trim().toUpperCase();
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Build service-role DB client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    const db = createClient(supabaseUrl, serviceKey);

    // Assemble structured context -- the only DB reads in this function
    const ctx = await assembleContext(db, symbol);

    if (!ctx.company) {
      return new Response(
        JSON.stringify({ error: `Company not found: ${symbol}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Build input snapshot for cache change detection
    const inputSnapshot = buildInputSnapshot(ctx, symbol);

    // Generate (or serve cached) company_narrative
    const narrativeSubs   = buildNarrativeSubstitutions(ctx);
    const narrativeResult = await generate(db, {
      outputType:    'company_narrative',
      referenceKey:  symbol,
      substitutions: narrativeSubs,
      inputSnapshot,
    });

    // Generate (or serve cached) conviction_interpretation
    const convictionSubs   = buildConvictionSubstitutions(ctx);
    const convictionResult = await generate(db, {
      outputType:    'conviction_interpretation',
      referenceKey:  symbol,
      substitutions: convictionSubs,
      inputSnapshot,
    });

    // Log generation job (fire-and-forget)
    const totalTokens =
      (narrativeResult.promptTokens    + convictionResult.promptTokens) +
      (narrativeResult.completionTokens + convictionResult.completionTokens);

    await db.from('ai_generation_jobs').insert({
      function_name:         'fn-generate-company-narrative',
      reference_key:         symbol,
      output_types:          ['company_narrative', 'conviction_interpretation'],
      narrative_output_id:   narrativeResult.outputId,
      conviction_output_id:  convictionResult.outputId,
      total_tokens:          totalTokens,
      narrative_from_cache:  narrativeResult.fromCache,
      conviction_from_cache: convictionResult.fromCache,
      narrative_skipped:     narrativeResult.skipped,
      conviction_skipped:    convictionResult.skipped,
      narrative_quality:     narrativeResult.qualityStatus,
      conviction_quality:    convictionResult.qualityStatus,
      generation_ms:         narrativeResult.generationMs + convictionResult.generationMs,
    }).catch((e: Error) => console.warn('ai_generation_jobs insert failed:', e.message));

    return new Response(
      JSON.stringify({
        symbol,
        narrative: {
          outputId:         narrativeResult.outputId,
          rawText:          narrativeResult.rawText,
          fromCache:        narrativeResult.fromCache,
          skipped:          narrativeResult.skipped,
          skipReason:       narrativeResult.skipReason,
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
          skipReason:       convictionResult.skipReason,
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
