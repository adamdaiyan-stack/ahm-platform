// lib/ai/types.ts
//
// Types for the AI output caching layer.
// Mirrors the ai_outputs and ai_prompt_templates DB schema exactly.

// ---- Enums ------------------------------------------------------------------

export type AIOutputType =
  | 'company_narrative'
  | 'conviction_interpretation'
  | 'risk_summary'
  | 'catalyst_summary'
  | 'peer_comparison'
  | 'sector_brief'
  | 'market_summary'
  | 'alert_summary';

// ---- ai_outputs row ---------------------------------------------------------

export type AIOutput = {
  id:                   string;
  output_type:          AIOutputType;
  reference_key:        string;
  raw_text:             string;
  content:              Record<string, unknown>;
  model_version:        string;
  prompt_version:       string;
  prompt_hash:          string;
  input_hash:           string;
  input_snapshot:       Record<string, unknown>;
  prompt_tokens:        number | null;
  completion_tokens:    number | null;
  total_tokens:         number | null;
  generation_ms:        number | null;
  is_current:           boolean;
  valid_until:          string | null;
  invalidated_at:       string | null;
  invalidation_reason:  string | null;
  created_at:           string;
};

// ---- ai_prompt_templates row ------------------------------------------------

export type AIPromptTemplate = {
  id:            string;
  prompt_type:   AIOutputType;
  version:       string;
  system_prompt: string;
  user_template: string;
  variables:     string[];
  model_target:  string;
  max_tokens:    number;
  temperature:   number;
  is_active:     boolean;
  change_notes:  string | null;
  deprecated_at: string | null;
  created_at:    string;
  updated_at:    string;
};

// ---- Generation request/response shapes ------------------------------------

export type GenerationRequest = {
  outputType:    AIOutputType;
  referenceKey:  string;
  inputSnapshot: Record<string, unknown>;
  // If provided, skip generation when input hash matches the cached row's input_hash
  forceRegenerate?: boolean;
};

export type GenerationResult = {
  output:       AIOutput;
  fromCache:    boolean;
  skippedReason?: 'input_unchanged' | 'ttl_valid';
};

// ---- Invalidation reasons ---------------------------------------------------

export type InvalidationReason =
  | 'block_update'
  | 'tier_change'
  | 'prompt_version_bump'
  | 'metrics_update'
  | 'manual'
  | 'ttl_expired';

// ---- Default TTLs (hours) per output type -----------------------------------

export const DEFAULT_TTL_HOURS: Record<AIOutputType, number> = {
  company_narrative:        72,
  conviction_interpretation: 48,
  risk_summary:             48,
  catalyst_summary:         48,
  peer_comparison:          168,   // 7 days
  sector_brief:             168,   // 7 days
  market_summary:           24,
  alert_summary:            48,
};
