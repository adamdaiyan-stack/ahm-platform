// components/ai/AICompanyNarrative.tsx
//
// Server component: fetches and renders company_narrative + conviction_interpretation
// for a given symbol. Falls back gracefully when no cached output exists.
//
// USAGE
//   <AICompanyNarrative symbol="ENGRO" />
//
// ARCHITECTURE
//   Reads from ai_outputs (is_current = true) via getCachedOutput().
//   Does NOT trigger regeneration -- that is the responsibility of the Edge Function.
//   If no cached output exists, renders a tasteful "pending" state.

import { getCachedOutput } from '@/lib/ai';
import { AIOutputPanel }  from './AIOutputPanel';

type Props = {
  symbol: string;
};

export async function AICompanyNarrative({ symbol }: Props) {
  const sym = symbol.toUpperCase();

  const [narrative, conviction] = await Promise.all([
    getCachedOutput('company_narrative',        sym).catch(() => null),
    getCachedOutput('conviction_interpretation', sym).catch(() => null),
  ]);

  // Nothing generated yet — show a tasteful pending state
  if (!narrative && !conviction) {
    return (
      <div className="rounded-lg border border-border-theme bg-surface p-5">
        <p className="text-[10px] font-mono uppercase tracking-widest text-tx-disabled mb-2">
          AI Company Intelligence
        </p>
        <p className="text-sm text-tx-disabled">
          AI-generated company intelligence for {sym} will appear here once the first
          scoring run completes. Intelligence is generated automatically when conviction
          scores are updated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {narrative && (
        <AIOutputPanel
          rawText={narrative.raw_text}
          label="Company Narrative"
          qualityStatus={narrative.content?.quality_status as 'passed' | 'warning' | 'failed' ?? 'passed'}
          generatedAt={narrative.created_at}
        />
      )}
      {conviction && (
        <AIOutputPanel
          rawText={conviction.raw_text}
          label="Conviction Context"
          qualityStatus={conviction.content?.quality_status as 'passed' | 'warning' | 'failed' ?? 'passed'}
          generatedAt={conviction.created_at}
        />
      )}
    </div>
  );
}
