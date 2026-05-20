// supabase/functions/_shared/alert-generator.ts
//
// Shared Deno-compatible alert text generator.
// Called by fn-process-event-triggers and fn-generate-alert.
//
// Builds template substitutions from event_data and calls generate()
// from ai-generator.ts with output_type='alert_summary'.
//
// RULES ENFORCED (via quality checks in ai-generator.ts)
//   - No Buy/Sell/Hold language
//   - No price targets
//   - No return predictions
//   - No promotional language
//   - 20-250 word output (alert_summary bounds)
//   - Institutional tone

import { createClient } from 'npm:@supabase/supabase-js@2';
import { generate }     from './ai-generator.ts';

export type AlertTextResult = {
  outputId:      string;
  rawText:       string;
  qualityStatus: 'passed' | 'warning' | 'failed';
  fromCache:     boolean;
  skipped:       boolean;
};

// ---- Substitution builders per event type -----------------------------------

function buildSubstitutions(
  eventType: string,
  eventData: Record<string, unknown>,
): Record<string, string> {
  const str = (v: unknown) => String(v ?? 'N/A');
  const num = (v: unknown, dec = 1) => typeof v === 'number' ? v.toFixed(dec) : 'N/A';

  switch (eventType) {
    case 'conviction_tier_upgrade':
      return {
        event_type:    'conviction tier upgrade',
        symbol:        str(eventData.symbol),
        from_tier:     str(eventData.from_tier),
        to_tier:       str(eventData.to_tier),
        from_score:    num(eventData.from_score, 0),
        to_score:      num(eventData.to_score, 0),
        data_context:  `Conviction score moved from ${num(eventData.from_score, 0)} (${str(eventData.from_tier)}) to ${num(eventData.to_score, 0)} (${str(eventData.to_tier)}). Data confidence: ${typeof eventData.data_confidence === 'number' ? (eventData.data_confidence * 100).toFixed(0) + '%' : 'N/A'}.`,
      };

    case 'conviction_tier_downgrade':
      return {
        event_type:    'conviction tier downgrade',
        symbol:        str(eventData.symbol),
        from_tier:     str(eventData.from_tier),
        to_tier:       str(eventData.to_tier),
        from_score:    num(eventData.from_score, 0),
        to_score:      num(eventData.to_score, 0),
        data_context:  `Conviction score moved from ${num(eventData.from_score, 0)} (${str(eventData.from_tier)}) to ${num(eventData.to_score, 0)} (${str(eventData.to_tier)}). Data confidence: ${typeof eventData.data_confidence === 'number' ? (eventData.data_confidence * 100).toFixed(0) + '%' : 'N/A'}.`,
      };

    case 'sector_driver_turned_negative':
      return {
        event_type:    'sector driver deterioration',
        sector_slug:   str(eventData.sector_slug),
        driver_name:   str(eventData.driver_name).replace(/_/g, ' '),
        driver_type:   str(eventData.driver_type),
        old_trend:     str(eventData.old_trend),
        description:   str(eventData.description),
        data_context:  `The ${str(eventData.driver_name).replace(/_/g, ' ')} driver for the ${str(eventData.sector_slug)} sector has shifted to a negative trend from ${str(eventData.old_trend)}.`,
      };

    case 'sector_driver_turned_positive':
      return {
        event_type:    'sector driver recovery',
        sector_slug:   str(eventData.sector_slug),
        driver_name:   str(eventData.driver_name).replace(/_/g, ' '),
        driver_type:   str(eventData.driver_type),
        old_trend:     str(eventData.old_trend),
        description:   str(eventData.description),
        data_context:  `The ${str(eventData.driver_name).replace(/_/g, ' ')} driver for the ${str(eventData.sector_slug)} sector has shifted to a positive trend from ${str(eventData.old_trend)}.`,
      };

    case 'high_severity_risk_added': {
      const scope = eventData.symbol ? `company ${str(eventData.symbol)}` : `sector ${str(eventData.sector_slug)}`;
      return {
        event_type:    'high severity risk flagged',
        reference_key: str(eventData.symbol ?? eventData.sector_slug),
        risk_title:    str(eventData.title),
        risk_body:     str(eventData.body),
        scope,
        data_context:  `A high-severity risk has been flagged for ${scope}: "${str(eventData.title)}". Priority level: ${str(eventData.priority)}/5.`,
      };
    }

    case 'near_catalyst_added': {
      const scope = eventData.symbol ? `company ${str(eventData.symbol)}` : `sector ${str(eventData.sector_slug)}`;
      return {
        event_type:      'near-term catalyst identified',
        reference_key:   str(eventData.symbol ?? eventData.sector_slug),
        catalyst_title:  str(eventData.title),
        catalyst_body:   str(eventData.body),
        scope,
        data_context:    `A near-term catalyst has been identified for ${scope}: "${str(eventData.title)}".`,
      };
    }

    case 'company_scored':
      return {
        event_type:    'company conviction scored',
        symbol:        str(eventData.symbol),
        score:         num(eventData.score, 0),
        tier:          str(eventData.tier),
        data_context:  `${str(eventData.symbol)} has been scored with a conviction level of ${num(eventData.score, 0)} (${str(eventData.tier)}).`,
      };

    default:
      return {
        event_type:    eventType.replace(/_/g, ' '),
        reference_key: str(eventData.symbol ?? eventData.sector_slug ?? 'unknown'),
        data_context:  JSON.stringify(eventData).slice(0, 300),
      };
  }
}

// ---- Input snapshot for cache -----------------------------------------------

function buildInputSnapshot(
  eventType: string,
  eventData: Record<string, unknown>,
): Record<string, unknown> {
  return {
    event_type:    eventType,
    reference_key: eventData.symbol ?? eventData.sector_slug ?? 'unknown',
    event_hash:    JSON.stringify({ eventType, ...eventData }),
    generated_at:  new Date().toISOString().slice(0, 16), // minute-level granularity
  };
}

// ---- Main export ------------------------------------------------------------

export async function generateAlertText(
  db:        ReturnType<typeof createClient>,
  eventType: string,
  eventData: Record<string, unknown>,
): Promise<AlertTextResult> {
  const substitutions  = buildSubstitutions(eventType, eventData);
  const inputSnapshot  = buildInputSnapshot(eventType, eventData);

  // reference_key for cache: event_type + reference_key + minute
  // This ensures each unique event gets its own output row
  const referenceKey = [
    eventType,
    String(eventData.symbol ?? eventData.sector_slug ?? 'market'),
    new Date().toISOString().slice(0, 16).replace(':', '-'),
  ].join(':');

  const result = await generate(db, {
    outputType:    'alert_summary',
    referenceKey,
    substitutions,
    inputSnapshot,
    forceRegenerate: true, // alerts are always fresh — never serve cache
  });

  return {
    outputId:      result.outputId,
    rawText:       result.rawText,
    qualityStatus: result.qualityStatus,
    fromCache:     result.fromCache,
    skipped:       result.skipped,
  };
}
