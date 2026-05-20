// lib/ai/index.ts
//
// AI Intelligence Layer — public entry points.
//
// USAGE
//   import { getCachedOutput, writeOutput, invalidateOutput } from '@/lib/ai';
//   import { computeInputHash, loadPromptTemplate, renderTemplate } from '@/lib/ai';
//   import { runQualityChecks } from '@/lib/ai';

export type {
  AIOutput,
  AIOutputType,
  AIPromptTemplate,
  GenerationRequest,
  GenerationResult,
  InvalidationReason,
} from './types';

export { DEFAULT_TTL_HOURS } from './types';

export {
  getCachedOutput,
  getOutputHistory,
  writeOutput,
  invalidateOutput,
  invalidateByPromptVersion,
  loadPromptTemplate,
  computeInputHash,
  computePromptHash,
  renderTemplate,
} from './cache';

export {
  runQualityChecks,
  type QualityCheckResult,
  type QualityReport,
} from './quality';

export {
  formatWhatsApp,
  stripMarkdown,
  truncateToWords,
  getLatestWhatsAppSummary,
  getWhatsAppHistory,
  type WhatsAppMessage,
} from './whatsapp';

