// supabase/functions/fn-process-event-triggers/index.ts
//
// Edge Function: processes pending rows from ai_event_triggers.
// Intended to run every 5 minutes via Supabase cron.
//
// SCHEDULE
//   Cron: */5 * * * *   (every 5 minutes)
//   HTTP: POST /functions/v1/fn-process-event-triggers  (manual trigger)
//
// PROCESSING ORDER
//   1. Fetch pending events ordered by priority ASC, triggered_at ASC
//      (priority 1 = critical first)
//   2. For each event:
//      a. Check suppression via should_suppress_event()
//      b. Mark status = 'processing'
//      c. Call fn-generate-alert inline (no HTTP round-trip)
//      d. Mark status = 'complete' with alert_id
//      e. On error: increment retry_count, mark 'failed' if >= 3
//   3. Return job summary
//
// SUPPRESSION WINDOWS (enforced here, not in DB triggers)
//   - conviction_tier_upgrade/downgrade : 24h
//   - sector_driver_turned_negative     : 48h
//   - high_severity_risk_added          : 72h (avoid alert fatigue)
//   - near_catalyst_added               : 48h
//   - company_scored                    : 168h (suppress routine re-score noise)
//
// BATCH LIMIT
//   Processes max 20 events per invocation to stay within Edge Function
//   memory and execution time limits. Remaining events are picked up
//   in the next cron cycle.

import { createClient }     from 'npm:@supabase/supabase-js@2';
import { generateAlertText } from '../_shared/alert-generator.ts';

// ---- Types ------------------------------------------------------------------

type EventTriggerRow = {
  id:           string;
  event_type:   string;
  reference_key:string;
  event_data:   Record<string, unknown>;
  priority:     number;
  status:       string;
  retry_count:  number;
};

// ---- Suppression windows (hours) --------------------------------------------

const SUPPRESSION_HOURS: Record<string, number> = {
  conviction_tier_upgrade:        24,
  conviction_tier_downgrade:      24,
  sector_driver_turned_negative:  48,
  sector_driver_turned_positive:  48,
  high_severity_risk_added:       72,
  near_catalyst_added:            48,
  company_scored:                 168,   // 7 days — suppress routine noise
};

// ---- Alert config per event type --------------------------------------------

type AlertConfig = {
  severity: 'critical' | 'high' | 'medium' | 'low';
  audience: 'internal' | 'retail' | 'institutional' | 'all';
  ttlHours: number;
  buildTitle: (data: Record<string, unknown>) => string;
};

function getAlertConfig(eventType: string): AlertConfig {
  const configs: Record<string, AlertConfig> = {
    conviction_tier_upgrade: {
      severity: 'high',
      audience: 'all',
      ttlHours: 48,
      buildTitle: d => `${d.symbol}: Conviction upgraded to ${d.to_tier}`,
    },
    conviction_tier_downgrade: {
      severity: 'high',
      audience: 'institutional',
      ttlHours: 48,
      buildTitle: d => `${d.symbol}: Conviction downgraded to ${d.to_tier}`,
    },
    sector_driver_turned_negative: {
      severity: 'medium',
      audience: 'all',
      ttlHours: 72,
      buildTitle: d => `${d.sector_slug}: ${d.driver_name} driver turned negative`,
    },
    sector_driver_turned_positive: {
      severity: 'medium',
      audience: 'all',
      ttlHours: 72,
      buildTitle: d => `${d.sector_slug}: ${d.driver_name} driver turned positive`,
    },
    high_severity_risk_added: {
      severity: 'high',
      audience: 'institutional',
      ttlHours: 96,
      buildTitle: d => `High-severity risk flagged: ${d.title}`,
    },
    near_catalyst_added: {
      severity: 'medium',
      audience: 'all',
      ttlHours: 72,
      buildTitle: d => `Near-term catalyst identified: ${d.title}`,
    },
    company_scored: {
      severity: 'low',
      audience: 'internal',
      ttlHours: 24,
      buildTitle: d => `${d.symbol} conviction scored: ${d.tier} (${d.score})`,
    },
  };

  return configs[eventType] ?? {
    severity: 'low',
    audience: 'internal',
    ttlHours: 24,
    buildTitle: d => `Intelligence event: ${eventType} for ${d.symbol ?? d.sector_slug ?? 'unknown'}`,
  };
}

// ---- Suppression check ------------------------------------------------------

async function isSuppressed(
  db:           ReturnType<typeof createClient>,
  referenceKey: string,
  eventType:    string,
): Promise<boolean> {
  const windowHours = SUPPRESSION_HOURS[eventType] ?? 24;

  const { data } = await db
    .rpc('should_suppress_event', {
      p_reference_key: referenceKey,
      p_event_type:    eventType,
      p_window_hours:  windowHours,
    });

  return !!data;
}

// ---- Process single event ---------------------------------------------------

async function processEvent(
  db:    ReturnType<typeof createClient>,
  event: EventTriggerRow,
): Promise<{ success: boolean; alertId?: string; suppressed?: boolean; error?: string }> {
  // 1. Check suppression
  const suppressed = await isSuppressed(db, event.reference_key, event.event_type);
  if (suppressed) {
    await db.from('ai_event_triggers')
      .update({
        status:              'suppressed',
        suppression_reason:  `frequency_cap: ${SUPPRESSION_HOURS[event.event_type] ?? 24}h window`,
        processed_at:        new Date().toISOString(),
      })
      .eq('id', event.id);
    return { success: true, suppressed: true };
  }

  // 2. Mark as processing
  await db.from('ai_event_triggers')
    .update({
      status:                 'processing',
      processing_started_at:  new Date().toISOString(),
    })
    .eq('id', event.id);

  try {
    // 3. Generate alert text
    const alertText = await generateAlertText(db, event.event_type, event.event_data);

    // 4. Compute alert config
    const config = getAlertConfig(event.event_type);
    const title  = config.buildTitle(event.event_data);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + config.ttlHours);

    // 5. Insert alert
    const { data: alertRow, error: alertErr } = await db
      .from('alerts')
      .insert({
        alert_type:       event.event_type,
        reference_key:    event.reference_key,
        title,
        body:             alertText.rawText,
        severity:         config.severity,
        audience:         config.audience,
        event_trigger_id: event.id,
        ai_output_id:     alertText.outputId,
        expires_at:       expiresAt.toISOString(),
        is_active:        true,
      })
      .select('id')
      .single<{ id: string }>();

    if (alertErr || !alertRow) {
      throw new Error(`Alert insert failed: ${alertErr?.message ?? 'no data'}`);
    }

    // 6. Mark event complete
    await db.from('ai_event_triggers')
      .update({
        status:       'complete',
        alert_id:     alertRow.id,
        ai_output_id: alertText.outputId,
        processed_at: new Date().toISOString(),
      })
      .eq('id', event.id);

    return { success: true, alertId: alertRow.id };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const newRetryCount = event.retry_count + 1;
    const isFinal = newRetryCount >= 3;

    await db.from('ai_event_triggers')
      .update({
        status:        isFinal ? 'failed' : 'pending',
        retry_count:   newRetryCount,
        error_message: message,
        processed_at:  isFinal ? new Date().toISOString() : null,
      })
      .eq('id', event.id);

    return { success: false, error: message };
  }
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

  const t0 = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase env vars');
    const db = createClient(supabaseUrl, serviceKey);

    // Fetch pending events in priority order (max 20 per run)
    const { data: events, error: fetchErr } = await db
      .from('ai_event_triggers')
      .select('id,event_type,reference_key,event_data,priority,status,retry_count')
      .eq('status', 'pending')
      .order('priority', { ascending: true })
      .order('triggered_at', { ascending: true })
      .limit(20)
      .returns<EventTriggerRow[]>();

    if (fetchErr) throw new Error(`Failed to fetch events: ${fetchErr.message}`);

    const pending = events ?? [];

    if (pending.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No pending events' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Process sequentially (not parallel — avoids duplicate suppression races)
    let completed  = 0;
    let suppressed = 0;
    let failed     = 0;
    const errors: string[] = [];

    for (const event of pending) {
      const result = await processEvent(db, event);
      if (result.suppressed)       suppressed++;
      else if (result.success)     completed++;
      else {
        failed++;
        if (result.error) errors.push(`${event.event_type}:${event.reference_key} — ${result.error}`);
      }
    }

    const durationMs = Date.now() - t0;

    return new Response(
      JSON.stringify({
        processed:   pending.length,
        completed,
        suppressed,
        failed,
        duration_ms: durationMs,
        errors:      errors.length ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fn-process-event-triggers] error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
