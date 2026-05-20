// supabase/functions/fn-generate-alert/index.ts
//
// Edge Function: generate an AI alert body for a given event trigger.
// Can be called directly for manual alert generation, or used by
// fn-process-event-triggers for automated processing.
//
// REQUEST
//   POST /functions/v1/fn-generate-alert
//   Body: {
//     "event_trigger_id": "uuid",       // process existing queued event
//     // OR
//     "event_type":  "conviction_tier_upgrade",
//     "event_data":  { ... },
//     "reference_key": "MCB"
//   }
//
// RESPONSE
//   {
//     "alert": { id, title, body, severity, audience, created_at },
//     "output": { outputId, rawText, qualityStatus, ... }
//   }

import { createClient }     from 'npm:@supabase/supabase-js@2';
import { generateAlertText } from '../_shared/alert-generator.ts';

type EventTriggerRow = {
  id:            string;
  event_type:    string;
  reference_key: string;
  event_data:    Record<string, unknown>;
  priority:      number;
  status:        string;
};

const SEVERITY_MAP: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
  conviction_tier_upgrade:        'high',
  conviction_tier_downgrade:      'high',
  sector_driver_turned_negative:  'medium',
  sector_driver_turned_positive:  'medium',
  high_severity_risk_added:       'high',
  near_catalyst_added:            'medium',
  company_scored:                 'low',
};

const AUDIENCE_MAP: Record<string, 'internal' | 'retail' | 'institutional' | 'all'> = {
  conviction_tier_upgrade:        'all',
  conviction_tier_downgrade:      'institutional',
  sector_driver_turned_negative:  'all',
  sector_driver_turned_positive:  'all',
  high_severity_risk_added:       'institutional',
  near_catalyst_added:            'all',
  company_scored:                 'internal',
};

const TTL_HOURS: Record<string, number> = {
  conviction_tier_upgrade:        48,
  conviction_tier_downgrade:      48,
  sector_driver_turned_negative:  72,
  sector_driver_turned_positive:  72,
  high_severity_risk_added:       96,
  near_catalyst_added:            72,
  company_scored:                 24,
};

function buildTitle(eventType: string, eventData: Record<string, unknown>): string {
  const str = (v: unknown) => String(v ?? 'N/A');
  const num = (v: unknown) => typeof v === 'number' ? v.toFixed(0) : 'N/A';

  const titles: Record<string, () => string> = {
    conviction_tier_upgrade:        () => `${str(eventData.symbol)}: Conviction upgraded to ${str(eventData.to_tier)} (${num(eventData.to_score)})`,
    conviction_tier_downgrade:      () => `${str(eventData.symbol)}: Conviction downgraded to ${str(eventData.to_tier)} (${num(eventData.to_score)})`,
    sector_driver_turned_negative:  () => `${str(eventData.sector_slug)}: ${str(eventData.driver_name).replace(/_/g,' ')} turned negative`,
    sector_driver_turned_positive:  () => `${str(eventData.sector_slug)}: ${str(eventData.driver_name).replace(/_/g,' ')} turned positive`,
    high_severity_risk_added:       () => `High-severity risk: ${str(eventData.title)}`,
    near_catalyst_added:            () => `Near-term catalyst: ${str(eventData.title)}`,
    company_scored:                 () => `${str(eventData.symbol)}: Scored ${str(eventData.tier)} (${num(eventData.score)})`,
  };

  return (titles[eventType] ?? (() => `Intelligence event: ${eventType}`))();
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase env vars');
    const db = createClient(supabaseUrl, serviceKey);

    let eventType:    string;
    let eventData:    Record<string, unknown>;
    let referenceKey: string;
    let triggerId:    string | null = null;

    // Route 1: process existing trigger by ID
    if (body.event_trigger_id) {
      const { data: trigger, error } = await db
        .from('ai_event_triggers')
        .select('id,event_type,reference_key,event_data,priority,status')
        .eq('id', body.event_trigger_id)
        .single<EventTriggerRow>();

      if (error || !trigger) {
        return new Response(
          JSON.stringify({ error: `Event trigger not found: ${body.event_trigger_id}` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      eventType    = trigger.event_type;
      eventData    = trigger.event_data;
      referenceKey = trigger.reference_key;
      triggerId    = trigger.id;

    } else {
      // Route 2: generate directly from provided params
      if (!body.event_type || !body.event_data) {
        return new Response(
          JSON.stringify({ error: 'Provide either event_trigger_id or (event_type + event_data)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      eventType    = body.event_type;
      eventData    = body.event_data;
      referenceKey = body.reference_key ?? String(eventData.symbol ?? eventData.sector_slug ?? 'market');
    }

    // Generate alert text
    const alertText = await generateAlertText(db, eventType, eventData);

    // Build alert fields
    const title     = buildTitle(eventType, eventData);
    const severity  = SEVERITY_MAP[eventType]  ?? 'low';
    const audience  = AUDIENCE_MAP[eventType]  ?? 'internal';
    const ttlHours  = TTL_HOURS[eventType]     ?? 24;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttlHours);

    // Insert alert
    const { data: alert, error: alertErr } = await db
      .from('alerts')
      .insert({
        alert_type:       eventType,
        reference_key:    referenceKey,
        title,
        body:             alertText.rawText,
        severity,
        audience,
        event_trigger_id: triggerId,
        ai_output_id:     alertText.outputId,
        expires_at:       expiresAt.toISOString(),
        is_active:        true,
      })
      .select()
      .single();

    if (alertErr || !alert) {
      throw new Error(`Alert insert failed: ${alertErr?.message ?? 'no data'}`);
    }

    // Update trigger status if processing by ID
    if (triggerId) {
      await db.from('ai_event_triggers')
        .update({
          status:       'complete',
          alert_id:     alert.id,
          ai_output_id: alertText.outputId,
          processed_at: new Date().toISOString(),
        })
        .eq('id', triggerId);
    }

    return new Response(
      JSON.stringify({
        alert: {
          id:          alert.id,
          title:       alert.title,
          body:        alert.body,
          severity:    alert.severity,
          audience:    alert.audience,
          created_at:  alert.created_at,
        },
        output: {
          outputId:         alertText.outputId,
          rawText:          alertText.rawText,
          qualityStatus:    alertText.qualityStatus,
          fromCache:        alertText.fromCache,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fn-generate-alert] error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
