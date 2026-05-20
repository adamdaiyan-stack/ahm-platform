// supabase/functions/_shared/ai-generator.ts
//
// Shared Deno-compatible AI generation utility for all narrative Edge Functions.
//
// Responsibilities:
//   - Load active prompt template from ai_prompt_templates
//   - Render template with substitution variables
//   - Call Claude API via Anthropic SDK
//   - Compute input/prompt hashes (change detection)
//   - Write output to ai_outputs (with prior row retirement)
//   - Run post-generation quality checks
//   - Log job to ai_generation_jobs

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic        from 'npm:@anthropic-ai/sdk';

// ---- Types ------------------------------------------------------------------

export type AIOutputType =
  | 'company_narrative'
  | 'conviction_interpretation'
  | 'risk_summary'
  | 'catalyst_summary'
  | 'peer_comparison'
  | 'sector_brief'
  | 'market_summary'
  | 'alert_summary';

export type PromptTemplate = {
  id:            string;
  prompt_type:   AIOutputType;
  version:       string;
  system_prompt: string;
  user_template: string;
  variables:     string[];
  model_target:  string;
  max_tokens:    number;
  temperature:   number;
};

export type GenerateOptions = {
  outputType:    AIOutputType;
  referenceKey:  string;
  substitutions: Record<string, string>;
  inputSnapshot: Record<string, unknown>;
  forceRegenerate?: boolean;
};

export type GenerateResult = {
  outputId:     string;
  rawText:      string;
  fromCache:    boolean;
  skipped:      boolean;
  skipReason?:  'input_unchanged';
  qualityStatus: 'passed' | 'warning' | 'failed';
  promptTokens:  number;
  completionTokens: number;
  generationMs:  number;
};

// Default TTL hours per output type
const TTL_HOURS: Record<AIOutputType, number> = {
  company_narrative:         72,
  conviction_interpretation: 48,
  risk_summary:              48,
  catalyst_summary:          48,
  peer_comparison:           168,
  sector_brief:              168,
  market_summary:            24,
  alert_summary:             48,
};

// ---- Hash utilities ---------------------------------------------------------

async function sha256(text: string): Promise<string> {
  const buf  = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function sortKeysDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeysDeep(v)])
    );
  }
  return obj;
}

export async function computeInputHash(data: Record<string, unknown>): Promise<string> {
  return sha256(JSON.stringify(sortKeysDeep(data)));
}

export async function computePromptHash(system: string, user: string): Promise<string> {
  return sha256(system + '\n---\n' + user);
}

// ---- Template renderer ------------------------------------------------------

export function renderTemplate(template: string, subs: Record<string, string>): string {
  let out = template;
  for (const [k, v] of Object.entries(subs)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  const unresolved = out.match(/\{\{[^}]+\}\}/g);
  if (unresolved) {
    throw new Error(`renderTemplate: unresolved variables: ${unresolved.join(', ')}`);
  }
  return out;
}

// ---- Quality checks ---------------------------------------------------------

const PROHIBITED: { name: string; re: RegExp; severity: 'failed' | 'warning' }[] = [
  { name: 'buy_sell_hold',         re: /\b(buy|sell|hold|accumulate|reduce|avoid|exit)\b/gi, severity: 'failed' },
  { name: 'price_target',          re: /\b(price target|fair value|target price|intrinsic value)\b/gi, severity: 'failed' },
  { name: 'return_prediction',     re: /\b(will return|expected return|upside potential of \d+%)\b/gi, severity: 'failed' },
  { name: 'promotional',           re: /\b(best|top pick|strong buy|outperform|conviction buy|highly recommend)\b/gi, severity: 'failed' },
  { name: 'placeholder_text',      re: /\[data unavailable\]|\[insert\]|\[tbd\]|\{\{[^}]+\}\}/gi, severity: 'failed' },
  { name: 'pkr_price_target',      re: /PKR\s+\d[\d,.]*/gi, severity: 'warning' },
];

function runQualityChecks(
  rawText: string,
): { status: 'passed' | 'warning' | 'failed'; checks: unknown[]; violations: unknown[] } {
  const checks: { check_name: string; status: string; detail: string; matches?: string[] }[] = [];

  for (const { name, re, severity } of PROHIBITED) {
    const m = rawText.match(re);
    if (m) {
      checks.push({ check_name: name, status: severity, detail: `${m.length} match(es)`, matches: [...new Set(m.map(x => x.toLowerCase()))].slice(0, 5) });
    } else {
      checks.push({ check_name: name, status: 'passed', detail: 'No matches' });
    }
  }

  const wordCount = rawText.trim().split(/\s+/).length;
  if (wordCount < 20) {
    checks.push({ check_name: 'length', status: 'warning', detail: `Only ${wordCount} words` });
  } else {
    checks.push({ check_name: 'length', status: 'passed', detail: `${wordCount} words` });
  }

  const violations = checks.filter(c => c.status !== 'passed');
  const hasFailed  = checks.some(c => c.status === 'failed');
  const hasWarning = checks.some(c => c.status === 'warning');
  const status: 'passed' | 'warning' | 'failed' = hasFailed ? 'failed' : hasWarning ? 'warning' : 'passed';

  return { status, checks, violations };
}

// ---- Main generator ---------------------------------------------------------

export async function generate(
  db:      ReturnType<typeof createClient>,
  options: GenerateOptions,
): Promise<GenerateResult> {
  const { outputType, referenceKey, substitutions, inputSnapshot, forceRegenerate = false } = options;

  // 1. Load active prompt template
  const { data: tpl, error: tplErr } = await db
    .from('ai_prompt_templates')
    .select('id,prompt_type,version,system_prompt,user_template,variables,model_target,max_tokens,temperature')
    .eq('prompt_type', outputType)
    .eq('is_active', true)
    .single<PromptTemplate>();

  if (tplErr || !tpl) {
    throw new Error(`No active prompt template for ${outputType}: ${tplErr?.message}`);
  }

  // 2. Render templates
  const userPrompt   = renderTemplate(tpl.user_template, substitutions);
  const systemPrompt = tpl.system_prompt;

  // 3. Compute hashes
  const [inputHash, promptHash] = await Promise.all([
    computeInputHash(inputSnapshot),
    computePromptHash(systemPrompt, userPrompt),
  ]);

  // 4. Check cache — skip if input unchanged and not forced
  if (!forceRegenerate) {
    const { data: cached } = await db
      .from('ai_outputs')
      .select('id,raw_text,input_hash,valid_until,content')
      .eq('output_type', outputType)
      .eq('reference_key', referenceKey)
      .eq('is_current', true)
      .single<{ id: string; raw_text: string; input_hash: string; valid_until: string | null; content: Record<string, unknown> }>();

    if (cached) {
      // TTL still valid?
      const stillValid = !cached.valid_until || new Date(cached.valid_until) > new Date();
      // Input unchanged?
      const unchanged  = cached.input_hash === inputHash;

      if (stillValid && unchanged) {
        return {
          outputId:         cached.id,
          rawText:          cached.raw_text,
          fromCache:        true,
          skipped:          true,
          skipReason:       'input_unchanged',
          qualityStatus:    'passed',
          promptTokens:     0,
          completionTokens: 0,
          generationMs:     0,
        };
      }
    }
  }

  // 5. Call Claude API
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const anthropic = new Anthropic({ apiKey });
  const t0 = Date.now();

  const response = await anthropic.messages.create({
    model:      tpl.model_target,
    max_tokens: tpl.max_tokens,
    temperature: Number(tpl.temperature),
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  });

  const generationMs = Date.now() - t0;
  const rawText      = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('');

  const promptTokens     = response.usage?.input_tokens     ?? 0;
  const completionTokens = response.usage?.output_tokens    ?? 0;
  const totalTokens      = promptTokens + completionTokens;

  // 6. Quality checks
  const quality = runQualityChecks(rawText);

  // 7. Retire prior current row
  await db
    .from('ai_outputs')
    .update({ is_current: false })
    .eq('output_type', outputType)
    .eq('reference_key', referenceKey)
    .eq('is_current', true);

  // 8. Write new output row
  const validUntilDt = new Date();
  validUntilDt.setHours(validUntilDt.getHours() + TTL_HOURS[outputType]);

  const { data: newRow, error: insertErr } = await db
    .from('ai_outputs')
    .insert({
      output_type:       outputType,
      reference_key:     referenceKey,
      raw_text:          rawText,
      content:           { quality_status: quality.status },
      model_version:     tpl.model_target,
      prompt_version:    tpl.version,
      prompt_hash:       promptHash,
      input_hash:        inputHash,
      input_snapshot:    inputSnapshot,
      prompt_tokens:     promptTokens,
      completion_tokens: completionTokens,
      total_tokens:      totalTokens,
      generation_ms:     generationMs,
      is_current:        true,
      valid_until:       validUntilDt.toISOString(),
    })
    .select('id')
    .single<{ id: string }>();

  if (insertErr || !newRow) {
    throw new Error(`ai_outputs insert failed: ${insertErr?.message}`);
  }

  // 9. Log quality check results
  await db.from('ai_quality_checks').insert({
    output_id:      newRow.id,
    overall_status: quality.status,
    checks_run:     quality.checks,
    violations:     quality.violations,
    requires_review: quality.violations.some((v: any) => v.status === 'failed'),
  }).then(({ error }: { error: Error | null }) => { if (error) console.warn('quality check log failed:', error.message); });

  return {
    outputId:         newRow.id,
    rawText,
    fromCache:        false,
    skipped:          false,
    qualityStatus:    quality.status,
    promptTokens,
    completionTokens,
    generationMs,
  };
}
