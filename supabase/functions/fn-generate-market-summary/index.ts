// supabase/functions/fn-generate-market-summary/index.ts
//
// Generates market intelligence snapshots for the PSX.
// REQUEST: POST { "snapshot_type": "eod_summary" }

import { createClient } from 'npm:@supabase/supabase-js@2';
import { generate }     from '../_shared/ai-generator.ts';

type SnapshotType = 'pre_market' | 'market_open' | 'market_close' | 'eod_summary';

const VALID_TYPES = new Set<string>(['pre_market', 'market_open', 'market_close', 'eod_summary']);

// ---- Context assembly -------------------------------------------------------

async function assembleMarketContext(db: ReturnType<typeof createClient>) {
  const [indexRes, convRes, companiesRes, macroRes, alertsRes] = await Promise.all([
    // KSE-100 from market_index table
    db.from('market_index')
      .select('index_name,level,change,change_percent,volume,advances,declines,unchanged')
      .limit(1)
      .returns<{ index_name: string; level: number; change: number; change_percent: number; volume: number | null; advances: number | null; declines: number | null; unchanged: number | null }[]>(),

    // All current conviction scores
    db.from('conviction_scores')
      .select('symbol,score,tier')
      .eq('is_current', true)
      .order('score', { ascending: false })
      .returns<{ symbol: string; score: number; tier: string }[]>(),

    // Companies for sector mapping and notable movers
    db.from('companies')
      .select('symbol,company_name,sector,change_percent')
      .not('change_percent', 'is', null)
      .order('change_percent', { ascending: false })
      .returns<{ symbol: string; company_name: string; sector: string; change_percent: number }[]>(),

    // Active macro drivers (all sectors)
    db.from('sector_macro_drivers')
      .select('sector_slug,macro_driver,current_direction,impact_magnitude,impact_description')
      .eq('is_active', true)
      .in('current_direction', ['negative', 'positive'])
      .gte('impact_magnitude', 3)
      .order('impact_magnitude', { ascending: false })
      .limit(10)
      .returns<{ sector_slug: string; macro_driver: string; current_direction: string; impact_magnitude: number; impact_description: string }[]>(),

    // Active alerts
    db.from('alerts')
      .select('title,body,severity')
      .eq('is_active', true)
      .order('severity')
      .limit(5)
      .returns<{ title: string; body: string | null; severity: string }[]>(),
  ]);

  const companies    = companiesRes.data ?? [];
  const convictions  = convRes.data      ?? [];

  // Build company lookup for sector mapping
  const companyMap = new Map<string, { company_name: string; sector: string; change_percent: number }>();
  for (const co of companies) companyMap.set(co.symbol, co);

  // Build sector performance from conviction scores + company sector info
  const sectorMap = new Map<string, { sector: string; scores: number[]; tiers: Record<string, number> }>();
  for (const cv of convictions) {
    const co = companyMap.get(cv.symbol);
    if (!co) continue;
    const entry = sectorMap.get(co.sector) ?? { sector: co.sector, scores: [], tiers: {} };
    entry.scores.push(cv.score);
    entry.tiers[cv.tier] = (entry.tiers[cv.tier] ?? 0) + 1;
    sectorMap.set(co.sector, entry);
  }
  const sectors = [...sectorMap.values()]
    .map(s => ({
      sector:       s.sector,
      avg_score:    s.scores.length ? s.scores.reduce((a, b) => a + b, 0) / s.scores.length : 0,
      company_count:s.scores.length,
      tiers:        s.tiers,
    }))
    .sort((a, b) => b.avg_score - a.avg_score);

  return {
    index:      indexRes.data?.[0]   ?? null,
    convictions,
    companies,
    companyMap,
    sectors,
    macroDrivers: macroRes.data     ?? [],
    alerts:       alertsRes.data    ?? [],
  };
}

// ---- Formatters -------------------------------------------------------------

function fmtSectorTable(sectors: { sector: string; avg_score: number; company_count: number; tiers: Record<string, number> }[]): string {
  if (!sectors.length) return 'No sector data available.';
  return sectors.map(s => {
    const hc  = s.tiers['HIGH_CONVICTION'] ?? 0;
    const mod = s.tiers['MODERATE']        ?? 0;
    return `${s.sector}: avg ${s.avg_score.toFixed(1)}/100 | HC:${hc} MOD:${mod} (n=${s.company_count})`;
  }).join('\n');
}

function fmtNotableMovers(companies: { symbol: string; company_name: string; change_percent: number }[]): string {
  const movers = companies.filter(c => Math.abs(c.change_percent) > 2);
  if (!movers.length) return 'No notable movers (>2% threshold) today.';
  const top = movers.slice(0, 6);
  return top.map(c => {
    const dir = c.change_percent >= 0 ? '+' : '';
    return `${c.company_name} (${c.symbol}): ${dir}${c.change_percent.toFixed(2)}%`;
  }).join('\n');
}

function fmtMacroContext(rows: { sector_slug: string; macro_driver: string; current_direction: string; impact_magnitude: number; impact_description: string }[]): string {
  if (!rows.length) return 'No active macro drivers with material impact at this time.';
  const positives = rows.filter(r => r.current_direction === 'positive');
  const negatives = rows.filter(r => r.current_direction === 'negative');
  const lines: string[] = [];
  if (positives.length) {
    lines.push('Tailwinds:');
    for (const r of positives.slice(0, 4)) {
      lines.push(`  + ${r.macro_driver.replace(/_/g, ' ')} [${r.sector_slug}] (${r.impact_magnitude}/5): ${r.impact_description}`);
    }
  }
  if (negatives.length) {
    lines.push('Headwinds:');
    for (const r of negatives.slice(0, 4)) {
      lines.push(`  - ${r.macro_driver.replace(/_/g, ' ')} [${r.sector_slug}] (${r.impact_magnitude}/5): ${r.impact_description}`);
    }
  }
  return lines.join('\n');
}

// ---- Write to ai_market_snapshots -------------------------------------------

async function writeMarketSnapshot(
  db: ReturnType<typeof createClient>,
  snapshot_date: string,
  snapshot_type: SnapshotType,
  format: 'long' | 'short',
  rawText: string,
  promptTokens: number,
  completionTokens: number,
  generationMs: number,
  inputSnapshot: Record<string, unknown>,
  structuredContent: Record<string, unknown>,
): Promise<void> {
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
    model_version:      'claude-sonnet-4-6',
    prompt_version:     'v1.0.0',
    prompt_tokens:      promptTokens,
    completion_tokens:  completionTokens,
    total_tokens:       promptTokens + completionTokens,
    generation_ms:      generationMs,
    is_current:         true,
  }).then(({ error }: { error: Error | null }) => {
    if (error) console.error('ai_market_snapshots insert error:', error.message);
  });
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
    let snapshot_type_raw = 'eod_summary';
    if (req.method === 'GET') {
      snapshot_type_raw = new URL(req.url).searchParams.get('snapshot_type') ?? 'eod_summary';
    } else {
      const body = await req.json().catch(() => ({}));
      snapshot_type_raw = body?.snapshot_type ?? 'eod_summary';
    }

    if (!VALID_TYPES.has(snapshot_type_raw)) {
      return new Response(
        JSON.stringify({ error: `Invalid snapshot_type. Use: ${[...VALID_TYPES].join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const snapshot_type = snapshot_type_raw as SnapshotType;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase env vars');
    const db = createClient(supabaseUrl, serviceKey);

    const ctx   = await assembleMarketContext(db);
    const today = new Date().toISOString().slice(0, 10);
    const idx   = ctx.index;

    const total   = ctx.convictions.length;
    const tiers: Record<string, number> = {};
    for (const c of ctx.convictions) { tiers[c.tier] = (tiers[c.tier] ?? 0) + 1; }

    const inputSnapshot: Record<string, unknown> = {
      snapshot_date:  today,
      snapshot_type,
      kse100_level:   idx?.level         ?? null,
      kse100_change:  idx?.change_percent ?? null,
      total_companies: total,
      tier_distribution: tiers,
      sector_count:   ctx.sectors.length,
      macro_driver_count: ctx.macroDrivers.length,
    };

    // Substitutions aligned to market_summary template variables
    const baseSubstitutions: Record<string, string> = {
      snapshot_date: today,
      snapshot_type:
      kse100_level:   idx ? idx.level.toLocaleString() : 'N/A',
      kse100_change_pct: idx ? (idx.change_percent >= 0 ? '+' : '') + idx.change_percent.toFixed(2) : 'N/A',
      market_volume:  idx?.volume ? (idx.volume / 1e9).toFixed(2) + 'B' : 'N/A',
      advances:       idx?.advances?.toString()  ?? 'N/A',
      declines:       idx?.declines?.toString()  ?? 'N/A',
      unchanged:      idx?.unchanged?.toString() ?? 'N/A',
      sector_performance_table: fmtSectorTable(ctx.sectors),
      notable_movers: fmtNotableMovers(ctx.companies),
      macro_context:  fmtMacroContext(ctx.macroDrivers),
      conviction_changes: 'First scoring run — no prior scores to compare against.',
      active_risk_alerts: ctx.alerts.length
        ? ctx.alerts.map(a => `[${a.severity.toUpperCase()}] ${a.title}: ${a.body ?? ''}`).join('\n')
        : 'No active risk alerts at this time.',
      upcoming_events: 'Earnings calendar not yet populated.',
    };

    // Long-form
    const longResult = await generate(db, {
      outputType:    'market_summary',
      referenceKey:  `market:${today}:${snapshot_type}:long`,
      substitutions: { ...baseSubstitutions, format: 'LONG' },
      inputSnapshot,
    });

    // Short-form (WhatsApp)
    const shortResult = await generate(db, {
      outputType:    'alert_summary',
      referenceKey:  `market:${today}:${snapshot_type}:short`,
      substitutions: {
        event_type:         'market_summary',
        reference_display:  `PSX Market — ${today}`,
        event_data_summary: `${idx ? 'KSE-100: ' + idx.level.toLocaleString() + ' (' + (idx.change_percent >= 0 ? '+' : '') + idx.change_percent.toFixed(2) + '%)' : 'Index N/A'}. ${total} companies scored. Avg score: ${total ? (ctx.convictions.reduce((s, c) => s + c.score, 0) / total).toFixed(1) : 'N/A'}. Top sector: ${ctx.sectors[0]?.sector ?? 'N/A'}.`,
        severity:           'info',
        format:             'SHORT',
      },
      inputSnapshot,
    });

    const structuredContent: Record<string, unknown> = {
      kse100_level:      idx?.level         ?? null,
      kse100_change_pct: idx?.change_percent ?? null,
      market_breadth: { advances: idx?.advances, declines: idx?.declines, unchanged: idx?.unchanged },
      conviction_distribution: tiers,
      sector_leaders: ctx.sectors.slice(0, 3).map(s => s.sector),
      quality_status: { long: longResult.qualityStatus, short: shortResult.qualityStatus },
    };

    if (!longResult.fromCache && !longResult.skipped) {
      await writeMarketSnapshot(db, today, snapshot_type, 'long', longResult.rawText, longResult.promptTokens, longResult.completionTokens, longResult.generationMs, inputSnapshot, structuredContent);
    }
    if (!shortResult.fromCache && !shortResult.skipped) {
      await writeMarketSnapshot(db, today, snapshot_type, 'short', shortResult.rawText, shortResult.promptTokens, shortResult.completionTokens, shortResult.generationMs, inputSnapshot, structuredContent);
    }

    await db.from('ai_generation_jobs').insert({
      function_name: 'fn-generate-market-summary',
      reference_key: `market:${today}:${snapshot_type}`,
      output_types:  ['market_summary', 'alert_summary'],
      total_tokens:  longResult.promptTokens + longResult.completionTokens + shortResult.promptTokens + shortResult.completionTokens,
      generation_ms: longResult.generationMs + shortResult.generationMs,
    }).then(({ error }: { error: Error | null }) => { if (error) console.warn('ai_generation_jobs insert failed:', error.message); });

    return new Response(
      JSON.stringify({
        snapshot_date: today,
        snapshot_type,
        long:  { qualityStatus: longResult.qualityStatus,  fromCache: longResult.fromCache,  rawText: longResult.rawText,  promptTokens: longResult.promptTokens,  completionTokens: longResult.completionTokens,  generationMs: longResult.generationMs },
        short: { qualityStatus: shortResult.qualityStatus, fromCache: shortResult.fromCache, rawText: shortResult.rawText, promptTokens: shortResult.promptTokens, completionTokens: shortResult.completionTokens, generationMs: shortResult.generationMs },
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
