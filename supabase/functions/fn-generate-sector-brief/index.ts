// supabase/functions/fn-generate-sector-brief/index.ts
//
// Generates a sector_brief for a PSX sector.
// REQUEST: POST { "sector_slug": "banking" }  OR  GET ?sector_slug=banking

import { createClient } from 'npm:@supabase/supabase-js@2';
import { generate }     from '../_shared/ai-generator.ts';

// ---- Types ------------------------------------------------------------------

type SectorRow = {
  slug:           string;
  name:           string;
  subtitle:       string | null;
  db_sector_name: string;
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
  lag_months:         number;
};

type ConvictionRow = {
  symbol: string;
  score:  number;
  tier:   string;
};

type IntelBlockRow = {
  block_type:   string;
  title:        string;
  body:         string | null;
  priority:     number | null;
  source_label: string | null;
};

type RatioRow = {
  symbol:         string;
  pe_ratio:       number | null;
  pb_ratio:       number | null;
  roe:            number | null;
  net_margin:     number | null;
  debt_to_equity: number | null;
  period_key:     string | null;
};

// ---- Context assembly -------------------------------------------------------

async function assembleContext(db: ReturnType<typeof createClient>, sector_slug: string) {
  const slug = sector_slug.toLowerCase();

  // First get sector to resolve db_sector_name
  const { data: sector } = await db
    .from('sectors')
    .select('slug,name,subtitle,db_sector_name')
    .eq('slug', slug)
    .single<SectorRow>();

  if (!sector) return null;

  // Parallel queries
  const [sectorDriversRes, macroDriversRes, intelBlocksRes, companiesRes] = await Promise.all([
    db.from('sector_drivers')
      .select('driver_name,trend,description,sort_order')
      .eq('sector_slug', slug)
      .order('sort_order', { ascending: true })
      .limit(8)
      .returns<SectorDriverRow[]>(),

    db.from('sector_macro_drivers')
      .select('macro_driver,driver_category,current_direction,impact_magnitude,impact_description,lag_months')
      .eq('sector_slug', slug)
      .eq('is_active', true)
      .order('impact_magnitude', { ascending: false })
      .limit(8)
      .returns<MacroDriverRow[]>(),

    db.from('sector_intelligence_blocks')
      .select('block_type,title,body,priority,source_label')
      .eq('sector_slug', slug)
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(12)
      .returns<IntelBlockRow[]>(),

    db.from('companies')
      .select('symbol')
      .eq('sector', sector.db_sector_name)
      .returns<{ symbol: string }[]>(),
  ]);

  const symbols = (companiesRes.data ?? []).map(c => c.symbol);

  // Get conviction scores + ratio snapshots for companies in this sector
  const [convRes, ratioRes] = await Promise.all([
    symbols.length
      ? db.from('conviction_scores')
          .select('symbol,score,tier')
          .in('symbol', symbols)
          .eq('is_current', true)
          .returns<ConvictionRow[]>()
      : Promise.resolve({ data: [] as ConvictionRow[] }),

    symbols.length
      ? db.from('financial_ratio_snapshots')
          .select('symbol,pe_ratio,pb_ratio,roe,net_margin,debt_to_equity,period_key')
          .in('symbol', symbols)
          .order('snapshot_date', { ascending: false })
          .returns<RatioRow[]>()
      : Promise.resolve({ data: [] as RatioRow[] }),
  ]);

  // Latest ratio per symbol
  const latestRatios = new Map<string, RatioRow>();
  for (const r of (ratioRes.data ?? [])) {
    if (!latestRatios.has(r.symbol)) latestRatios.set(r.symbol, r);
  }

  return {
    sector,
    drivers:      sectorDriversRes.data ?? [],
    macroDrivers: macroDriversRes.data  ?? [],
    intelBlocks:  intelBlocksRes.data   ?? [],
    convictions:  convRes.data          ?? [],
    ratios:       [...latestRatios.values()],
  };
}

// ---- Formatters -------------------------------------------------------------

function formatSectorDrivers(rows: SectorDriverRow[]): string {
  if (!rows.length) return 'No structured sector drivers on record.';
  const SYM: Record<string, string> = { positive: '+', negative: '-', neutral: '~', mixed: '+/-' };
  return rows.map(r => {
    const sym  = SYM[r.trend] ?? '~';
    const desc = r.description ? ` — ${r.description}` : '';
    return `${sym} ${r.driver_name}${desc}`;
  }).join('\n');
}

function formatMacroDrivers(rows: MacroDriverRow[]): string {
  if (!rows.length) return 'No macro driver linkages on record for this sector.';
  const DIR: Record<string, string> = { positive: 'POSITIVE', negative: 'NEGATIVE', neutral: 'NEUTRAL', mixed: 'MIXED' };
  return rows.map(r => {
    const dir = DIR[r.current_direction] ?? r.current_direction.toUpperCase();
    const lag = r.lag_months > 0 ? ` (${r.lag_months}m lag)` : '';
    return `[${r.macro_driver.replace(/_/g, ' ').toUpperCase()}] ${dir} | Magnitude: ${r.impact_magnitude}/5${lag}\n${r.impact_description}`;
  }).join('\n\n');
}

function formatConvictionDistribution(rows: ConvictionRow[]): string {
  if (!rows.length) return 'No companies scored in this sector yet.';
  const total = rows.length;
  const avg   = (rows.reduce((s, r) => s + r.score, 0) / total).toFixed(1);
  const counts: Record<string, number> = {};
  for (const r of rows) { counts[r.tier] = (counts[r.tier] ?? 0) + 1; }
  const dist = ['HIGH_CONVICTION', 'MODERATE', 'WATCHLIST', 'MONITOR']
    .filter(t => counts[t])
    .map(t => `${t}: ${counts[t]}`)
    .join(', ');
  return `${total} companies scored. Sector average: ${avg}/100. ${dist}`;
}

function formatRatioAggs(rows: RatioRow[]): string {
  if (!rows.length) return 'No sector ratio data available.';
  const avg = (field: string) => {
    const vals = rows.filter(r => (r as any)[field] != null).map(r => (r as any)[field] as number);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 'n/a';
  };
  return [
    `P/E (avg): ${avg('pe_ratio')}x`,
    `P/B (avg): ${avg('pb_ratio')}x`,
    `ROE (avg): ${avg('roe')}%`,
    `Net Margin (avg): ${avg('net_margin')}%`,
    `D/E (avg): ${avg('debt_to_equity')}x`,
  ].join('\n');
}

function formatIntelBlocks(rows: IntelBlockRow[], types: string[]): string {
  const filtered = rows.filter(r => types.includes(r.block_type));
  if (!filtered.length) return `None on record for: ${types.join(', ')}.`;
  return filtered.slice(0, 5).map(r => {
    const src = r.source_label ? ` [${r.source_label}]` : '';
    return `• ${r.title}${src}\n  ${r.body ?? ''}`;
  }).join('\n');
}

// ---- Input snapshot ---------------------------------------------------------

function buildInputSnapshot(
  ctx: NonNullable<Awaited<ReturnType<typeof assembleContext>>>,
  sector_slug: string,
): Record<string, unknown> {
  const total = ctx.convictions.length;
  const avg   = total ? ctx.convictions.reduce((s, r) => s + r.score, 0) / total : 0;
  const counts: Record<string, number> = {};
  for (const r of ctx.convictions) { counts[r.tier] = (counts[r.tier] ?? 0) + 1; }
  return {
    sector_slug,
    company_count:        total,
    avg_conviction_score: parseFloat(avg.toFixed(2)),
    tier_distribution:    counts,
    sector_driver_count:  ctx.drivers.length,
    macro_driver_count:   ctx.macroDrivers.length,
    intel_block_count:    ctx.intelBlocks.length,
    ratio_company_count:  ctx.ratios.length,
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
      const body = await req.json().catch(() => ({}));
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

    const inputSnapshot  = buildInputSnapshot(ctx, sector_slug);
    const convictions    = ctx.convictions;
    const total          = convictions.length;
    const avgScore       = total ? convictions.reduce((s, r) => s + r.score, 0) / total : 0;
    const periods        = [...new Set(ctx.ratios.filter(r => r.period_key).map(r => r.period_key!))];

    const substitutions: Record<string, string> = {
      sector_name:           ctx.sector.name,
      sector_slug,
      sector_conviction_score: total ? avgScore.toFixed(1) + '/100' : 'N/A',
      macro_drivers_active:  formatMacroDrivers(ctx.macroDrivers),
      sector_drivers:        formatSectorDrivers(ctx.drivers),
      sector_aggregates:     formatRatioAggs(ctx.ratios),
      metrics_period:        periods[0] ?? 'N/A',
      conviction_distribution: formatConvictionDistribution(convictions),
      top_sector_catalysts:  formatIntelBlocks(ctx.intelBlocks, ['catalyst']),
      top_sector_risks:      formatIntelBlocks(ctx.intelBlocks, ['risk', 'regulatory_risk']),
    };

    const result = await generate(db, {
      outputType:    'sector_brief',
      referenceKey:  sector_slug,
      substitutions,
      inputSnapshot,
    });

    await db.from('ai_generation_jobs').insert({
      function_name: 'fn-generate-sector-brief',
      reference_key: sector_slug,
      output_types:  ['sector_brief'],
      total_tokens:  result.promptTokens + result.completionTokens,
      generation_ms: result.generationMs,
    }).then(({ error }: { error: Error | null }) => { if (error) console.warn('ai_generation_jobs insert failed:', error.message); });

    return new Response(
      JSON.stringify({
        sector_slug,
        qualityStatus:    result.qualityStatus,
        fromCache:        result.fromCache,
        skipped:          result.skipped,
        rawText:          result.rawText,
        promptTokens:     result.promptTokens,
        completionTokens: result.completionTokens,
        generationMs:     result.generationMs,
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
