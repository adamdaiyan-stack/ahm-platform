// supabase/functions/fn-generate-market-summary/index.ts
//
// Edge Function: generate market-level AI snapshots for the PSX.
// Generates both LONG form (institutional brief) and SHORT form (WhatsApp digest).
// Writes both to ai_market_snapshots.
//
// REQUEST
//   POST /functions/v1/fn-generate-market-summary
//   Body: { "snapshot_type": "eod_summary" }
//   OR
//   GET  /functions/v1/fn-generate-market-summary?snapshot_type=eod_summary
//
// SNAPSHOT TYPES
//   pre_market   — 08:30 PKT, before market opens
//   market_open  — 10:00 PKT, after first 30 min of trading
//   market_close — 15:30 PKT, market close snapshot
//   eod_summary  — 18:00 PKT, full institutional EOD brief
//
// SCHEMA
//   ai_market_snapshots: id, snapshot_date, snapshot_type, format,
//                        raw_text, structured_content, input_snapshot,
//                        model_version, prompt_version, prompt_tokens,
//                        completion_tokens, total_tokens, generation_ms,
//                        is_current, generated_at

import { createClient } from 'npm:@supabase/supabase-js@2';
import { generate }     from '../_shared/ai-generator.ts';

// ---- Types ------------------------------------------------------------------

type SnapshotType = 'pre_market' | 'market_open' | 'market_close' | 'eod_summary';

type ConvictionRow = {
  symbol:          string;
  company_name:    string;
  sector_slug:     string;
  sector_name:     string;
  composite_score: number;
  tier:            string;
};

type MacroDriverRow = {
  sector_slug:        string | null;
  macro_driver:       string;
  driver_category:    string;
  current_direction:  string;
  impact_magnitude:   number;
  impact_description: string;
};

type IntelBlockRow = {
  block_type:   string;
  title:        string;
  body:         string;
  priority:     number;
  sector_slug:  string | null;
};

type IndexRow = {
  index_code:     string;
  close_price:    number;
  change_percent: number;
  volume:         number | null;
  advances:       number | null;
  declines:       number | null;
  unchanged:      number | null;
  date:           string;
};

// ---- Context assembly -------------------------------------------------------

async function assembleMarketContext(db: ReturnType<typeof createClient>) {
  const [
    indexRes,
    convRes,
    macroRes,
    intelRes,
  ] = await Promise.all([
    // 1. Latest KSE-100 index snapshot
    db.from('index_history')
      .select('index_code,close_price,change_percent,volume,advances,declines,unchanged,date')
      .eq('index_code', 'KSE100')
      .order('date', { ascending: false })
      .limit(1)
      .returns<IndexRow[]>(),

    // 2. All current conviction scores (for market-wide distribution)
    db.from('conviction_scores')
      .select('symbol,company_name,sector_slug,sector_name,composite_score,tier')
      .eq('is_current', true)
      .order('composite_score', { ascending: false })
      .returns<ConvictionRow[]>(),

    // 3. Active macro drivers (market-wide: NULL or 'market', plus top sector drivers)
    db.from('sector_macro_drivers')
      .select('sector_slug,macro_driver,driver_category,current_direction,impact_magnitude,impact_description')
      .eq('is_active', true)
      .in('current_direction', ['negative', 'positive'])
      .gte('impact_magnitude', 3)
      .order('impact_magnitude', { ascending: false })
      .limit(15)
      .returns<MacroDriverRow[]>(),

    // 4. Top market-level intelligence blocks
    db.from('sector_intelligence_blocks')
      .select('block_type,title,body,priority,sector_slug')
      .eq('is_active', true)
      .in('block_type', ['risk', 'catalyst', 'theme', 'takeaway'])
      .or('sector_slug.is.null,sector_slug.eq.market')
      .order('priority', { ascending: false })
      .limit(8)
      .returns<IntelBlockRow[]>(),
  ]);

  const companies = convRes.data ?? [];

  // Build sector summaries in-process
  type SectorSummary = {
    sector_name:     string;
    company_count:   number;
    avg_score:       number;
    high_conviction: number;
    moderate:        number;
  };
  const sectorMap = new Map<string, SectorSummary>();
  for (const co of companies) {
    const e = sectorMap.get(co.sector_slug) ?? {
      sector_name:     co.sector_name,
      company_count:   0,
      avg_score:       0,
      high_conviction: 0,
      moderate:        0,
    };
    e.company_count++;
    e.avg_score += co.composite_score;
    if (co.tier === 'HIGH_CONVICTION') e.high_conviction++;
    else if (co.tier === 'MODERATE')   e.moderate++;
    sectorMap.set(co.sector_slug, e);
  }
  const sectors = [...sectorMap.values()].map(s => ({
    ...s,
    avg_score: s.company_count ? s.avg_score / s.company_count : 0,
  })).sort((a, b) => b.avg_score - a.avg_score);

  return {
    index:       indexRes.data?.[0]  ?? null,
    companies,
    sectors,
    macroDrivers:macroRes.data  ?? [],
    intelBlocks: intelRes.data  ?? [],
  };
}

// ---- Formatters -------------------------------------------------------------

function formatIndexSummary(idx: IndexRow | null): string {
  if (!idx) return 'Market index data not available.';
  const dir = idx.change_percent >= 0 ? 'up' : 'down';
  const abs = Math.abs(idx.change_percent).toFixed(2);
  const vol = idx.volume ? (idx.volume / 1e9).toFixed(2) + 'B shares' : 'volume n/a';
  const breadth = (idx.advances && idx.declines)
    ? `Breadth: ${idx.advances} advances, ${idx.declines} declines, ${idx.unchanged ?? 0} unchanged.`
    : '';
  return `KSE-100 at ${idx.close_price.toLocaleString()} — ${dir} ${abs}%. ${vol}. ${breadth}`.trim();
}

function formatMarketOverview(companies: ConvictionRow[]): string {
  if (!companies.length) return 'No scored companies.';
  const total = companies.length;
  const avg   = (companies.reduce((s, c) => s + c.composite_score, 0) / total).toFixed(1);
  const tiers: Record<string, number> = {};
  for (const c of companies) { tiers[c.tier] = (tiers[c.tier] ?? 0) + 1; }
  const dist = ['HIGH_CONVICTION','MODERATE','WATCHLIST','MONITOR']
    .filter(t => tiers[t])
    .map(t => `${t}: ${tiers[t]}`)
    .join(', ');
  return `${total} companies scored. Average conviction: ${avg}/100. ${dist}`;
}

function formatSectorLeaders(sectors: ReturnType<typeof assembleMarketContext> extends Promise<infer T> ? T['sectors'] : never): string {
  if (!sectors.length) return 'No sector data.';
  return sectors.slice(0, 5)
    .map(s => `${s.sector_name}: avg ${s.avg_score.toFixed(1)} | HC:${s.high_conviction} MOD:${s.moderate} (n=${s.company_count})`)
    .join('\n');
}

function formatTopHighConviction(companies: ConvictionRow[], limit = 6): string {
  const hc = companies.filter(c => c.tier === 'HIGH_CONVICTION').slice(0, limit);
  if (!hc.length) return 'No HIGH_CONVICTION companies at this time.';
  return hc.map(c => `${c.company_name} (${c.symbol}) — ${c.sector_name}: ${c.composite_score.toFixed(1)}`).join('\n');
}

function formatMacroLandscape(rows: MacroDriverRow[]): string {
  if (!rows.length) return 'No macro drivers with material impact at this time.';
  const positives = rows.filter(r => r.current_direction === 'positive');
  const negatives = rows.filter(r => r.current_direction === 'negative');
  const lines: string[] = [];
  if (positives.length) {
    lines.push('Market Tailwinds:');
    for (const r of positives.slice(0, 4)) {
      const sec = r.sector_slug ? ` [${r.sector_slug}]` : ' [market]';
      lines.push(`  + ${r.macro_driver.replace(/_/g, ' ')}${sec} (${r.impact_magnitude}/5): ${r.impact_description}`);
    }
  }
  if (negatives.length) {
    lines.push('Market Headwinds:');
    for (const r of negatives.slice(0, 4)) {
      const sec = r.sector_slug ? ` [${r.sector_slug}]` : ' [market]';
      lines.push(`  - ${r.macro_driver.replace(/_/g, ' ')}${sec} (${r.impact_magnitude}/5): ${r.impact_description}`);
    }
  }
  return lines.join('\n');
}

function formatIntelBlocks(rows: IntelBlockRow[]): string {
  if (!rows.length) return 'No market-level intelligence blocks available.';
  return rows
    .map(r => {
      const sec = r.sector_slug ? ` [${r.sector_slug}]` : '';
      return `[${r.block_type.toUpperCase()}]${sec} ${r.title}\n${r.body}`;
    })
    .join('\n\n');
}

// ---- Input snapshot ---------------------------------------------------------

function buildInputSnapshot(
  ctx:           Awaited<ReturnType<typeof assembleMarketContext>>,
  snapshot_type: SnapshotType,
): Record<string, unknown> {
  const total = ctx.companies.length;
  const avg   = total ? ctx.companies.reduce((s, c) => s + c.composite_score, 0) / total : 0;
  const tiers: Record<string, number> = {};
  for (const c of ctx.companies) { tiers[c.tier] = (tiers[c.tier] ?? 0) + 1; }

  return {
    snapshot_date:  new Date().toISOString().slice(0, 10),
    snapshot_type,
    kse100_close:   ctx.index?.close_price    ?? null,
    kse100_change:  ctx.index?.change_percent ?? null,
    total_companies:total,
    average_score:  parseFloat(avg.toFixed(2)),
    tier_distribution: tiers,
    sector_count:   ctx.sectors.length,
    sector_summaries: ctx.sectors.map(s => ({
      sector:       s.sector_name,
      avg:          parseFloat(s.avg_score.toFixed(2)),
      hc:           s.high_conviction,
    })),
    macro_driver_count: ctx.macroDrivers.length,
    macro_headwinds:    ctx.macroDrivers.filter(r => r.current_direction === 'negative').map(r => r.macro_driver),
    macro_tailwinds:    ctx.macroDrivers.filter(r => r.current_direction === 'positive').map(r => r.macro_driver),
    intel_block_count:  ctx.intelBlocks.length,
  };
}

// ---- ai_market_snapshots write helper ---------------------------------------

async function writeMarketSnapshot(
  db:            ReturnType<typeof createClient>,
  snapshot_date: string,
  snapshot_type: SnapshotType,
  format:        'long' | 'short',
  rawText:       string,
  modelVersion:  string,
  promptVersion: string,
  promptTokens:  number,
  completionTokens: number,
  generationMs:  number,
  inputSnapshot: Record<string, unknown>,
  structuredContent: Record<string, unknown>,
): Promise<void> {
  // Retire prior current row for this (date, type, format)
  await db.from('ai_market_snapshots')
    .update({ is_current: false })
    .eq('snapshot_date', snapshot_date)
    .eq('snapshot_type', snapshot_type)
    .eq('format', format)
    .eq('is_current', true);

  await db.from('ai_market_snapshots').insert({
    snapshot_date,
    snapshot_type,
    format,
    raw_text:           rawText,
    structured_content: structuredContent,
    input_snapshot:     inputSnapshot,
    model_version:      modelVersion,
    prompt_version:     promptVersion,
    prompt_tokens:      promptTokens,
    completion_tokens:  completionTokens,
    total_tokens:       promptTokens + completionTokens,
    generation_ms:      generationMs,
    is_current:         true,
  }).then(({ error }) => {
    if (error) console.error('ai_market_snapshots insert error:', error.message);
  });
}

// ---- Main handler -----------------------------------------------------------

const VALID_SNAPSHOT_TYPES = new Set<string>([
  'pre_market', 'market_open', 'market_close', 'eod_summary',
]);

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let snapshot_type_raw = 'eod_summary';
    if (req.method === 'GET') {
      snapshot_type_raw = new URL(req.url).searchParams.get('snapshot_type') ?? 'eod_summary';
    } else {
      const body = await req.json().catch(() => ({}));
      snapshot_type_raw = body?.snapshot_type ?? 'eod_summary';
    }

    if (!VALID_SNAPSHOT_TYPES.has(snapshot_type_raw)) {
      return new Response(
        JSON.stringify({ error: `Invalid snapshot_type: ${snapshot_type_raw}. Use: pre_market, market_open, market_close, eod_summary` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const snapshot_type = snapshot_type_raw as SnapshotType;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase env vars');
    const db = createClient(supabaseUrl, serviceKey);

    // Assemble context
    const ctx           = await assembleMarketContext(db);
    const inputSnapshot = buildInputSnapshot(ctx, snapshot_type);
    const today         = new Date().toISOString().slice(0, 10);

    // Base substitutions (shared between long and short templates)
    const baseSubstitutions: Record<string, string> = {
      snapshot_type,
      snapshot_date:      today,
      index_summary:      formatIndexSummary(ctx.index),
      market_overview:    formatMarketOverview(ctx.companies),
      sector_leaders:     formatSectorLeaders(ctx.sectors),
      top_high_conviction:formatTopHighConviction(ctx.companies),
      macro_landscape:    formatMacroLandscape(ctx.macroDrivers),
      intel_blocks:       formatIntelBlocks(ctx.intelBlocks),
      total_companies:    ctx.companies.length.toString(),
    };

    // ── Long-form generation (institutional brief) ─────────────────────────
    const longReferenceKey = `market:${today}:${snapshot_type}:long`;
    const longResult = await generate(db, {
      outputType:    'market_summary',
      referenceKey:  longReferenceKey,
      substitutions: { ...baseSubstitutions, output_format: 'long' },
      inputSnapshot,
    });

    // ── Short-form generation (WhatsApp digest) ────────────────────────────
    // Uses a short word count — ai_outputs quality check enforces 150-200 words
    const shortSubstitutions: Record<string, string> = {
      snapshot_type,
      snapshot_date: today,
      index_summary: formatIndexSummary(ctx.index),
      market_overview: formatMarketOverview(ctx.companies),
      // Shorter macro block for WhatsApp
      macro_highlights: ctx.macroDrivers
        .slice(0, 3)
        .map(r => `${r.current_direction === 'positive' ? '+' : '-'} ${r.macro_driver.replace(/_/g, ' ')}: ${r.impact_description}`)
        .join('\n') || 'No active macro flags.',
      output_format: 'short',
    };

    const shortReferenceKey = `market:${today}:${snapshot_type}:short`;
    const shortResult = await generate(db, {
      outputType:    'alert_summary',  // alert_summary TTL = 48h, word limit 20-250 matches WhatsApp
      referenceKey:  shortReferenceKey,
      substitutions: shortSubstitutions,
      inputSnapshot,
    });

    // Build structured_content for ai_market_snapshots
    const tiers: Record<string, number> = {};
    for (const c of ctx.companies) { tiers[c.tier] = (tiers[c.tier] ?? 0) + 1; }

    const structuredContent: Record<string, unknown> = {
      kse100_level:      ctx.index?.close_price    ?? null,
      kse100_change_pct: ctx.index?.change_percent ?? null,
      market_breadth: {
        advances:  ctx.index?.advances  ?? null,
        declines:  ctx.index?.declines  ?? null,
        unchanged: ctx.index?.unchanged ?? null,
      },
      conviction_distribution: tiers,
      sector_leaders: ctx.sectors.slice(0, 3).map(s => s.sector_name),
      sector_laggards: [...ctx.sectors].reverse().slice(0, 2).map(s => s.sector_name),
      top_hc_companies: ctx.companies
        .filter(c => c.tier === 'HIGH_CONVICTION')
        .slice(0, 5)
        .map(c => ({ symbol: c.symbol, score: c.composite_score })),
      macro_flags: ctx.macroDrivers
        .filter(r => r.impact_magnitude >= 4)
        .map(r => `${r.current_direction}: ${r.macro_driver} (${r.sector_slug ?? 'market'})`),
      quality_status: {
        long:  longResult.qualityStatus,
        short: shortResult.qualityStatus,
      },
    };

    // ── Write to ai_market_snapshots ──────────────────────────────────────
    if (!longResult.fromCache && !longResult.skipped) {
      await writeMarketSnapshot(
        db, today, snapshot_type, 'long',
        longResult.rawText,
        'claude-sonnet-4-6',
        'v1.0.0',
        longResult.promptTokens,
        longResult.completionTokens,
        longResult.generationMs,
        inputSnapshot,
        structuredContent,
      );
    }

    if (!shortResult.fromCache && !shortResult.skipped) {
      await writeMarketSnapshot(
        db, today, snapshot_type, 'short',
        shortResult.rawText,
        'claude-sonnet-4-6',
        'v1.0.0',
        shortResult.promptTokens,
        shortResult.completionTokens,
        shortResult.generationMs,
        inputSnapshot,
        structuredContent,
      );
    }

    // ── Log job ──────────────────────────────────────────────────────────
    await db.from('ai_generation_jobs').insert({
      function_name:   'fn-generate-market-summary',
      reference_key:   `market:${today}:${snapshot_type}`,
      output_types:    ['market_summary', 'alert_summary'],
      total_tokens:    longResult.promptTokens + longResult.completionTokens +
                       shortResult.promptTokens + shortResult.completionTokens,
      long_from_cache: longResult.fromCache,
      short_from_cache:shortResult.fromCache,
      long_quality:    longResult.qualityStatus,
      short_quality:   shortResult.qualityStatus,
      generation_ms:   longResult.generationMs + shortResult.generationMs,
    }).catch((e: Error) => console.warn('ai_generation_jobs insert failed:', e.message));

    return new Response(
      JSON.stringify({
        snapshot_date: today,
        snapshot_type,
        long: {
          outputId:         longResult.outputId,
          rawText:          longResult.rawText,
          fromCache:        longResult.fromCache,
          skipped:          longResult.skipped,
          qualityStatus:    longResult.qualityStatus,
          promptTokens:     longResult.promptTokens,
          completionTokens: longResult.completionTokens,
          generationMs:     longResult.generationMs,
        },
        short: {
          outputId:         shortResult.outputId,
          rawText:          shortResult.rawText,
          fromCache:        shortResult.fromCache,
          skipped:          shortResult.skipped,
          qualityStatus:    shortResult.qualityStatus,
          promptTokens:     shortResult.promptTokens,
          completionTokens: shortResult.completionTokens,
          generationMs:     shortResult.generationMs,
        },
        structuredContent,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fn-generate-market-summary] error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
