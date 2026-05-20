// components/ai/AISectorBrief.tsx
//
// Server component: fetches and renders the sector_brief AI output for a given
// sector slug. Designed to be embedded inside a SectorPageFrame analyticsSlot.
//
// USAGE (inside a FrameworkPage analyticsSlot)
//   const analyticsSlot = (
//     <>
//       <AISectorBrief sectorSlug="banking" />
//       <ExpandableSection ...>...</ExpandableSection>
//     </>
//   );
//
// ARCHITECTURE
//   Reads from ai_outputs (is_current = true, output_type = 'sector_brief').
//   Does NOT trigger regeneration.
//   Falls back to null render when no cached output exists.

import { getCachedOutput } from '@/lib/ai';
import { AIOutputPanel }  from './AIOutputPanel';

type Props = {
  sectorSlug: string;
  label?:     string;
};

export async function AISectorBrief({ sectorSlug, label = 'AI Sector Brief' }: Props) {
  const brief = await getCachedOutput('sector_brief', sectorSlug).catch(() => null);

  if (!brief) return null;  // Silently absent when not yet generated

  return (
    <AIOutputPanel
      rawText={brief.raw_text}
      label={label}
      qualityStatus={brief.content?.quality_status as 'passed' | 'warning' | 'failed' ?? 'passed'}
      generatedAt={brief.created_at}
    />
  );
}
