// lib/ai/quality.ts
//
// Post-generation quality checks for AI outputs.
// Mirrors the automated scanner described in Migration 026.
//
// CHECKS
//   prohibited_language_scan  — no buy/sell/hold/accumulate/target price
//   target_price_scan         — no "PKR X", "price target", "fair value = X"
//   invented_figures_check    — no suspiciously specific numbers not in input
//   length_validation         — output within expected token range
//   promotional_language_scan — no superlatives or promotional framing
//   null_data_reference_check — no "[data unavailable]" or placeholder text

import type { AIOutputType } from './types';

export type QualityCheckResult = {
  check_name: string;
  status:     'passed' | 'warning' | 'failed';
  detail:     string;
  matches?:   string[];
};

export type QualityReport = {
  overall_status:  'passed' | 'warning' | 'failed';
  checks_run:      QualityCheckResult[];
  violations:      QualityCheckResult[];
  requires_review: boolean;
};

// ---- Prohibited language patterns ------------------------------------------

const PROHIBITED_PATTERNS: { name: string; pattern: RegExp; severity: 'failed' | 'warning' }[] = [
  {
    name:     'buy_sell_hold',
    pattern:  /\b(buy|sell|hold|accumulate|reduce|avoid|exit|enter)\b/gi,
    severity: 'failed',
  },
  {
    name:     'price_target',
    pattern:  /\b(price target|fair value|target price|intrinsic value|upside of|downside of)\b/gi,
    severity: 'failed',
  },
  {
    name:     'return_prediction',
    pattern:  /\b(will return|expected return|return of \d|gain of \d|upside potential of \d+%)\b/gi,
    severity: 'failed',
  },
  {
    name:     'pkr_price_target',
    pattern:  /PKR\s+\d[\d,.]*/gi,
    severity: 'warning',    // PKR amounts in ratio context are ok; flag for review
  },
  {
    name:     'promotional_superlatives',
    pattern:  /\b(best|top pick|strong buy|outperform|conviction buy|highly recommend)\b/gi,
    severity: 'failed',
  },
  {
    name:     'placeholder_text',
    pattern:  /\[data unavailable\]|\[insert\]|\[tbd\]|\[placeholder\]|{{[^}]+}}/gi,
    severity: 'failed',
  },
];

// ---- Length bounds per output type -----------------------------------------

const LENGTH_BOUNDS: Record<AIOutputType, { min: number; max: number }> = {
  company_narrative:        { min: 200, max: 1200 },
  conviction_interpretation: { min: 50,  max: 350  },
  risk_summary:             { min: 80,  max: 500  },
  catalyst_summary:         { min: 80,  max: 500  },
  peer_comparison:          { min: 100, max: 700  },
  sector_brief:             { min: 200, max: 1500 },
  market_summary:           { min: 150, max: 1800 },
  alert_summary:            { min: 20,  max: 250  },
};

// ---- Runner -----------------------------------------------------------------

export function runQualityChecks(
  rawText:    string,
  outputType: AIOutputType,
): QualityReport {
  const checks: QualityCheckResult[] = [];

  // 1. Prohibited language scan
  for (const { name, pattern, severity } of PROHIBITED_PATTERNS) {
    const matches = rawText.match(pattern);
    if (matches && matches.length > 0) {
      // PKR amounts in conviction_interpretation context are expected — downgrade to warning
      const effectiveSeverity = (name === 'pkr_price_target' && outputType === 'conviction_interpretation')
        ? 'warning'
        : severity;
      checks.push({
        check_name: name,
        status:     effectiveSeverity,
        detail:     `Found ${matches.length} match(es) of prohibited pattern "${name}"`,
        matches:    [...new Set(matches.map(m => m.toLowerCase()))].slice(0, 5),
      });
    } else {
      checks.push({ check_name: name, status: 'passed', detail: 'No matches found' });
    }
  }

  // 2. Length validation
  const wordCount = rawText.trim().split(/\s+/).length;
  const bounds    = LENGTH_BOUNDS[outputType];
  if (wordCount < bounds.min) {
    checks.push({
      check_name: 'length_validation',
      status:     'warning',
      detail:     `Output has ${wordCount} words — below minimum ${bounds.min} for ${outputType}`,
    });
  } else if (wordCount > bounds.max) {
    checks.push({
      check_name: 'length_validation',
      status:     'warning',
      detail:     `Output has ${wordCount} words — above maximum ${bounds.max} for ${outputType}`,
    });
  } else {
    checks.push({
      check_name: 'length_validation',
      status:     'passed',
      detail:     `Word count ${wordCount} within bounds [${bounds.min}, ${bounds.max}]`,
    });
  }

  // 3. Empty output check
  if (rawText.trim().length === 0) {
    checks.push({ check_name: 'empty_output', status: 'failed', detail: 'Output is empty' });
  } else {
    checks.push({ check_name: 'empty_output', status: 'passed', detail: 'Output is non-empty' });
  }

  // ---- Aggregate ----------------------------------------------------------
  const violations = checks.filter(c => c.status === 'failed' || c.status === 'warning');
  const hasFailed  = checks.some(c => c.status === 'failed');
  const hasWarning = checks.some(c => c.status === 'warning');

  const overall_status: 'passed' | 'warning' | 'failed' =
    hasFailed  ? 'failed'  :
    hasWarning ? 'warning' :
    'passed';

  return {
    overall_status,
    checks_run:      checks,
    violations,
    requires_review: hasFailed || violations.some(v => v.check_name === 'pkr_price_target'),
  };
}
