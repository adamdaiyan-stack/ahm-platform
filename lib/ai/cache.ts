// lib/ai/cache.ts
//
// AI output cache service layer.
// All reads and writes to the ai_outputs table go through here.
//
// ARCHITECTURE
//   - getCachedOutput()     reads the current cached output (is_current = true)
//   - writeOutput()         persists a new LLM output and marks prior as historical
//   - invalidateOutput()    marks is_current = false with a reason
//   - computeInputHash()    deterministic SHA-256 of input snapshot (change detection)
//   - loadPromptTemplate()  fetches the active template for an output type
//
// These functions use the public Supabase client (server component safe)
// because they are called from Next.js server components and API routes.
// Edge Functions use the Deno-native equivalent in supabase/functions/_shared/.

import { createHash } from 'crypto';
import { supabase }   from '@/lib/supabase';
import type {
  AIOutput,
  AIOutputType,
  AIPromptTemplate,
  InvalidationReason,
  DEFAULT_TTL_HOURS,
} from './types';
import { DEFAULT_TTL_HOURS as TTL_MAP } from './types';

// ---- Hash utilities ---------------------------------------------------------

/**
 * Deterministic SHA-256 of a JSON-serialisable object.
 * Keys are sorted recursively so insertion order doesn't affect the hash.
 */
export function computeInputHash(data: Record<string, unknown>): string {
  const sorted = JSON.stringify(sortKeysDeep(data));
  return createHash('sha256').update(sorted).digest('hex');
}

function sortKeysDeep(obj: unknown): unknown {
  if (Array.isArray(obj))              return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeysDeep(v)])
    );
  }
  return obj;
}

/**
 * SHA-256 of the concatenated system_prompt + user_prompt string.
 * Used to detect prompt changes independent of template version.
 */
export function computePromptHash(systemPrompt: string, userPrompt: string): string {
  return createHash('sha256').update(systemPrompt + '\n---\n' + userPrompt).digest('hex');
}

// ---- TTL helpers ------------------------------------------------------------

function validUntil(outputType: AIOutputType): string {
  const hours = TTL_MAP[outputType];
  const dt    = new Date();
  dt.setHours(dt.getHours() + hours);
  return dt.toISOString();
}

// ---- Read -------------------------------------------------------------------

/**
 * Returns the current cached AI output for (outputType, referenceKey).
 * Returns null if no current output exists or if it has expired.
 *
 * NOTE: TTL expiry check is done in-process here to avoid stale reads.
 * The nightly cleanup job also sets is_current = false for expired rows.
 */
export async function getCachedOutput(
  outputType:   AIOutputType,
  referenceKey: string,
): Promise<AIOutput | null> {
  const { data, error } = await supabase
    .from('ai_outputs')
    .select('*')
    .eq('output_type', outputType)
    .eq('reference_key', referenceKey)
    .eq('is_current', true)
    .single<AIOutput>();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[ai/cache] getCachedOutput error:', error.message);
    }
    return null;
  }

  // Check TTL expiry in-process
  if (data.valid_until && new Date(data.valid_until) < new Date()) {
    // Expired — invalidate lazily so the caller triggers regeneration
    await invalidateOutput(outputType, referenceKey, 'ttl_expired').catch(() => {});
    return null;
  }

  return data;
}

/**
 * Returns all historical outputs for (outputType, referenceKey), newest first.
 * Used for audit / history UI.
 */
export async function getOutputHistory(
  outputType:   AIOutputType,
  referenceKey: string,
  limit = 10,
): Promise<AIOutput[]> {
  const { data, error } = await supabase
    .from('ai_outputs')
    .select('*')
    .eq('output_type', outputType)
    .eq('reference_key', referenceKey)
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<AIOutput[]>();

  if (error) { console.error('[ai/cache] getOutputHistory error:', error.message); return []; }
  return data ?? [];
}

// ---- Write ------------------------------------------------------------------

export type WriteOutputParams = {
  outputType:       AIOutputType;
  referenceKey:     string;
  rawText:          string;
  content:          Record<string, unknown>;
  modelVersion:     string;
  promptVersion:    string;
  promptHash:       string;
  inputHash:        string;
  inputSnapshot:    Record<string, unknown>;
  promptTokens?:    number;
  completionTokens?: number;
  totalTokens?:     number;
  generationMs?:    number;
};

/**
 * Persist a newly generated AI output.
 * Marks the previous current row as historical, then inserts the new row.
 * Returns the newly inserted AIOutput row.
 */
export async function writeOutput(params: WriteOutputParams): Promise<AIOutput> {
  // Mark prior current row as historical
  await supabase
    .from('ai_outputs')
    .update({ is_current: false })
    .eq('output_type', params.outputType)
    .eq('reference_key', params.referenceKey)
    .eq('is_current', true);

  const row = {
    output_type:       params.outputType,
    reference_key:     params.referenceKey,
    raw_text:          params.rawText,
    content:           params.content,
    model_version:     params.modelVersion,
    prompt_version:    params.promptVersion,
    prompt_hash:       params.promptHash,
    input_hash:        params.inputHash,
    input_snapshot:    params.inputSnapshot,
    prompt_tokens:     params.promptTokens    ?? null,
    completion_tokens: params.completionTokens ?? null,
    total_tokens:      params.totalTokens      ?? null,
    generation_ms:     params.generationMs     ?? null,
    is_current:        true,
    valid_until:       validUntil(params.outputType),
  };

  const { data, error } = await supabase
    .from('ai_outputs')
    .insert(row)
    .select()
    .single<AIOutput>();

  if (error || !data) {
    throw new Error('[ai/cache] writeOutput insert failed: ' + (error?.message ?? 'no data'));
  }

  return data;
}

// ---- Invalidate -------------------------------------------------------------

/**
 * Mark the current output for (outputType, referenceKey) as stale.
 * Sets is_current = false and records the invalidation reason + timestamp.
 */
export async function invalidateOutput(
  outputType:   AIOutputType,
  referenceKey: string,
  reason:       InvalidationReason,
): Promise<void> {
  const { error } = await supabase
    .from('ai_outputs')
    .update({
      is_current:           false,
      invalidated_at:       new Date().toISOString(),
      invalidation_reason:  reason,
    })
    .eq('output_type', outputType)
    .eq('reference_key', referenceKey)
    .eq('is_current', true);

  if (error) {
    console.error('[ai/cache] invalidateOutput error:', error.message);
  }
}

/**
 * Batch-invalidate all current outputs of a given type when a prompt version bumps.
 */
export async function invalidateByPromptVersion(
  outputType:    AIOutputType,
  promptVersion: string,
): Promise<number> {
  const { data, error } = await supabase
    .from('ai_outputs')
    .update({
      is_current:          false,
      invalidated_at:      new Date().toISOString(),
      invalidation_reason: 'prompt_version_bump',
    })
    .eq('output_type', outputType)
    .eq('prompt_version', promptVersion)
    .eq('is_current', true)
    .select('id')
    .returns<{ id: string }[]>();

  if (error) { console.error('[ai/cache] invalidateByPromptVersion error:', error.message); return 0; }
  return (data ?? []).length;
}

// ---- Prompt template --------------------------------------------------------

/**
 * Load the active prompt template for an output type.
 * Throws if no active template is found (misconfiguration).
 */
export async function loadPromptTemplate(
  outputType: AIOutputType,
): Promise<AIPromptTemplate> {
  const { data, error } = await supabase
    .from('ai_prompt_templates')
    .select('*')
    .eq('prompt_type', outputType)
    .eq('is_active', true)
    .single<AIPromptTemplate>();

  if (error || !data) {
    throw new Error(
      `[ai/cache] No active prompt template found for output_type "${outputType}". ` +
      'Check ai_prompt_templates table — exactly one row must have is_active = true.'
    );
  }

  return data;
}

/**
 * Substitute {{variable}} placeholders in a template string.
 * Throws if any declared variable is missing from the substitution map.
 */
export function renderTemplate(
  template:      string,
  substitutions: Record<string, string>,
): string {
  let rendered = template;
  for (const [key, value] of Object.entries(substitutions)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value);
  }
  // Check for unreplaced placeholders
  const unreplaced = rendered.match(/\{\{[^}]+\}\}/g);
  if (unreplaced) {
    throw new Error(
      `[ai/cache] renderTemplate: unreplaced variables: ${unreplaced.join(', ')}`
    );
  }
  return rendered;
}
