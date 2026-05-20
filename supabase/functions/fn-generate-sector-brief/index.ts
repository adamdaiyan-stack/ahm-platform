// supabase/functions/fn-generate-sector-brief/index.ts
//
// Edge Function: generate (or serve cached) sector_brief for a PSX sector.
//
// REQUEST
//   POST /functions/v1/fn-generate-sector-brief
//   Body: { "sector_slug": "banking" }
//   OR
//   GET  /functions/v1/fn-generate-sector-brief?sector_slug=banking
//
// RESPONSE
//   { "sector_slug": "banking", "brief": { outputId, rawText, fromCache, ... } }
//
// CONTEXT ASSEMBLED (all structured DB inputs — LLM never sees raw financials)
//   - Sector metadata
//   - Sector drivers (from sector_drivers table)
//   - Sector macro drivers (from sector_macro_drivers table)
//   - Per-company conviction scores and tier distribution
//   - Top risks and catalysts (from sector intelligence blocks)
//   - Ratio aggregates

import { createClient } from 'npm:@supabase/supabase-js@2';
import { generate }     from '../_shared/ai-generator.ts';

// ---- Types ------------------------------------------------------------------

type SectorRow = {
  slug:        string;
  name:        string;
  description: string | null;
};

type SectorDriverRow = {
  driver_name:  string;
  trend:        string;
  description:  string | null;
  sort_order:   number;
};

type MacroDriverRow = {
  macro_driver:       string;
  driver_category:    string;
  current_direction:  string;
  impact_magnitude:   number;
  impact_description: string;
  relationship:       string;
  lag_months:         number;
};

type ConvictionRow = {
  symbol:          string;
  company_name:    string;
  composite_score: number;
  tier:            string;
};

type IntelBlockRow = {
  block_type:   string;
  title:        string;
  body:         string;
  priority:     number;
  source_label: string | null;
};

type RatioAggRow = {
  metric_key:   string;
  median_value: number | null;
  avg_value:    number;
  company_count:number;
};

// ---- Context assembly -------------------------------------------------------

async function assembleContext(db: ReturnType<typeof createClient>, sector_slug: string) {
  const slug = sector_slug.toLowerCase();

  const [
    sectorRes,
    sectorDriversRes,
    macroDriversRes,
    convictionsRes,
    intelBlocksRes,
    ratioAggsRes,
  ] = await Promise.all([
    // 1. Sector master
    db.from('sectors')
      .select('slug,name,description')
      .eq('slug', slug)
      .single<SectorRow>(),

    // 2. Sector key drivers (qualitative, from sector_drivers table)
    db.from('sector_drivers')
      .select('driver_name,trend,description,sort_order')
      .eq('sector_slug', slug)
      .order('sort_order', { ascending: true })
      .limit(8)
      .returns<SectorDriverRow[]>(),

    // 3. Macro drivers (quantitative linkage model)
    db.from('sector_macro_drivers')
      .select('macro_driver,driver_category,current_direction,impact_magnitude,impact_description,relationship,lag_months')
      .eq('sector_slug', slug)
      .eq('is_active', true)
      .order('impact_magnitude', { ascending: false })
      .returns<MacroDriverRow[]>(),

    // 4. Current conviction scores for all companies in this sector
    db.from('conviction_scores')
      .select('symbol,company_name,composite_score,tier')
      .eq('sector_slug', slug)
      .eq('is_current', true)
      .order('composite_score', { ascending: false })
      .returns<ConvictionRow[]>(),

    // 5. Sector intelligence blocks (risks, catalysts, takeaways, themes)
    db.from('sector_intelligence_blocks')
      .select('block_type,title,body,priority,source_label')
      .eq('sector_slug', slug)
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(12)
      .returns<IntelBlockRow[]>(),

    // 6. Sector ratio aggregates
    db.from('sector_ratio_aggregates')
      .select('metric_key,median_value,avg_value,company_count')
      .eq('sector_slug', slug)
      .in('metric_key', ['pe_ratio','pb_ratio','roe','roa','debt_to_equity','ebitda_margin','net_margin'])
      .returns<RatioAggRow[]>(),
  ]);

  if (!sectorRes.data) return null;

  const convictions = convictionsRes.data ?? [];

  return {
    sector:       sectorRes.data,
    drivers:      sectorDriversRes.data  ?? [],
    macroDrivers: macroDriversRes.data   ?? [],
    convictions,
    intelBlocks:  intelBlocksRes.data    ?? [],
    ratioAggs:    ratioAggsRes.data      ?? [],
  };
}

// ---- Formatters -------------------------------------------------------------

function formatSectorDrivers(rows: SectorDriverRow[]): string {
  if (!rows.length) return 'No structured sector drivers on record.';
  const TREND_SYM: Record<string, string> = {
    positive: '+', negative: '-', neutral: '~', mixed: '+/-'
  };
  return rows
    .map(r => {
      const sym  = TREND_SYM[r.trend] ?? '~';
      const desc = r.description ? ` — ${r.description}` : '';
      return `${sym} ${r.driver_name}${desc}`;
    })
    .join('\n');
}

function formatMacroDrivers(rows: MacroDriverRow[]): string {
  if (!rows.length) return 'No macro driver linkages on record for this sector.';
  const DIR_SYM: Record<string, string> = {
    positive: 'POSITIVE', negative: 'NEGATIVE', neutral: 'NEUTRAL', mixed: 'MIXED'
  };
  return rows
    .map(r => {
      const dir = DIR_SYM[r.current_direction] ?? r.current_direction.toUpperCase();
      const lag = r.lag_months > 0 ? ` (${r.lag_months}m lag)` : '';
      return (
        `[${r.macro_driver.replace(/_/g, ' ').toUpperCase()}] ` +
        `Impact: ${dir} | Magnitude: ${r.impact_magnitude}/5${lag}\n` +
        `Current: ${r.impact_description}`
      );
    })
    .join('\n\n');
}

function formatConvictionDistribution(rows: ConvictionRow[]): string {
  if (!rows.length) return 'No companies scored in this sector yet.';
  const total = rows.length;
  const avg   = (rows.reduce((s, r) => s + r.composite_score, 0) / total).toFixed(1);
  const counts: Record<string, number> = {};
  for (const r of rows) { counts[r.tier] = (counts[r.tier] ?? 0) + 1; }
  const dist = ['HIGH_CONVICTION','MODERATE','WATCHLIST','MONITOR']
    .filter(t => counts[t])
    .map(t => `${t}: ${counts[t]}`)
    .join(', ');
  return `${total} companies scored. Sector average: ${avg}/100. ${dist}`;
}

function formatTopCompanies(rows: ConvictionRow[], limit = 5): string {
  const top = rows.filter(r => r.tier === 'HIGH_CONVICTION' || r.tier === 'MODERATE').slice(0, limit);
  if (!top.length) return 'No HIGH_CONVICTION or MODERATE companies at this time.';
  return top.map(r => `${r.company_name} (${r.symbol}): ${r.composite_score.toFixed(1)} [${r.tier}]`).join('\n');
}

function formatIntelBlocks(rows: IntelBlockRow[], types: string[]): string {
  const filtered = rows.filter(r => types.includes(r.block_type));
  if (!filtered.length) return `None on record for: ${types.join(', ')}.`;
  return filtered
    .map(r => {
      const src = r.source_label ? ` [${r.source_label}]` : '';
      return `[${r.block_type.toUpperCase()}] ${r.title}${src}\n${r.body}`;
    })
    .join('\n\n');
}

function formatRatioAggs(rows: RatioAggRow[]): string {
  if (!rows.length) return 'No sector ratio aggregates available.';
  return rows
    .map(r => {
      const med = r.median_value != null ? r.median_value.toFixed(2) : 'n/a';
      return `${r.metric_key.replace(/_/g, ' ')}: median ${med}, avg ${r.avg_value.toFixed(2)} (n=${r.company_count})`;
    })
    .join('\n');
}

// ---- Input snapshot ---------------------------------------------------------

function buildInputSnapshot(
  ctx: NonNullable<Awaited<ReturnType<typeof assembleContext>>>,
  sector_slug: string,
): Record<string, unknown> {
  const total = ctx.convictions.length;
  const avg   = total ? ctx.convictions.reduce((s, r) => s + r.composite_score, 0) / total : 0;
  const counts: Record<string, number> = {};
  for (const r of ctx.convictions) { counts[r.tier] = (counts[r.tier] ?? 0) + 1; }

  return {
    sector_slug,
    company_count:        total,
    avg_conviction_score: parseFloat(avg.toFixed(2)),
    tier_distribution:    counts,
    sector_driver_count:  ctx.drivers.length,
    macro_driver_count:   ctx.macroDrivers.length,
    macro_drivers: ctx.macroDrivers.map(r => ({
      driver:    r.macro_driver,
      direction: r.current_direction,
      magnitude: r.impact_magnitude,
    })),
    intel_block_count: ctx.intelBlocks.length,
    intel_block_keys:  ctx.intelBlocks.map(b => b.block_type + ':' + b.title.slice(0, 40)),
    ratio_agg_count:   ctx.ratioAggs.length,
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
    let sector_slug = '';
    if (req.method === 'GET') {
      sector_slug = new URL(req.url).searchParams.get('sector_slug') ?? '';
    } else {
      const body  = await req.json().catch(() => ({}));
      sector_slug = body?.sector_slug ?? '';
    }

    sector_slug = sector_slug.trim().toLowerCase();
    if (!sector_slug) {
      return new Response(
        JSON.stringify({ error: 'sector_slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase env vars');
    const db = createClient(supabaseUrl, serviceKey);

    const ctx = await assembleContext(db, sector_slug);
    if (!ctx) {
      return new Response(
        JSON.stringify({ error: `Sector not found: ${sector_slug}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const inputSnapshot = buildInputSnapshot(ctx, sector_slug);

    const substitutions: Record<string, string> = {
      sector_name:             ctx.sector.name,
      sector_slug,
      sector_description:      ctx.sector.description ?? 'No description available.',
      company_count:           ctx.convictions.length.toString(),
      conviction_distribution: formatConvictionDistribution(ctx.convictions),
      top_companies:           formatTopCompanies(ctx.convictions),
      sector_drivers:          formatSectorDrivers(ctx.drivers),
      macro_drivers:           formatMacroDrivers(ctx.macroDrivers),
      risk_blocks:             formatIntelBlocks(ctx.intelBlocks, ['risk', 'regulatory_risk']),
      catalyst_blocks:         formatIntelBlocks(ctx.intelBlocks, ['catalyst', 'near_catalyst']),
      thematic_blocks:         formatIntelBlocks(ctx.intelBlocks, ['theme', 'takeaway', 'structural']),
      ratio_aggregates:        formatRatioAggs(ctx.ratioAggs),
    };

    const briefResult = await generate(db, {
      outputType:    'sector_brief',
      referenceKey:  sector_slug,
      substitutions,
      inputSnapshot,
    });

    await db.from('ai_generation_jobs').insert({
      function_name:  'fn-generate-sector-brief',
      reference_key:  sector_slug,
      output_types:   ['sector_brief'],
      total_tokens:   briefResult.promptTokens + briefResult.completionTokens,
      from_cache:     briefResult.fromCache,
      skipped:        briefResult.skipped,
      quality_status: briefResult.qualityStatus,
      generation_ms:  briefResult.generationMs,
    }).catch((e: Error) => console.warn('ai_generation_jobs insert failed:', e.message));

    return new Response(
      JSON.stringify({
        sector_slug,
        brief: {
          outputId:         briefResult.outputId,
          rawText:          briefResult.rawText,
          fromCache:        briefResult.fromCache,
          skipped:          briefResult.skipped,
          skipReason:       briefResult.skipReason,
          qualityStatus:    briefResult.qualityStatus,
          promptTokens:     briefResult.promptTokens,
          completionTokens: briefResult.completionTokens,
          generationMs:     briefResult.generationMs,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fn-generate-sector-brief] error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
