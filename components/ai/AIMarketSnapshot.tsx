// components/ai/AIMarketSnapshot.tsx
//
// Server component: fetches and renders the latest AI market snapshot.
// Shows the long-form institutional brief on the /market dashboard.
// Includes a copy-ready WhatsApp message block (client-side copy button).
//
// Silently renders nothing if no snapshot has been generated yet.
// Never breaks page rendering.

import { supabase }            from '@/lib/supabase';
import { formatWhatsApp }      from '@/lib/ai/whatsapp';
import AIMarketSnapshotClient  from './AIMarketSnapshotClient';

type MarketSnapshotRow = {
  id:                 string;
  snapshot_date:      string;
  snapshot_type:      string;
  format:             string;
  raw_text:           string;
  structured_content: Record<string, unknown>;
  generated_at:       string;
  model_version:      string;
  prompt_version:     string;
};

async function fetchLatestSnapshot(
  snapshotType: string = 'eod_summary',
): Promise<{ long: MarketSnapshotRow | null; short: MarketSnapshotRow | null }> {
  const today = new Date().toISOString().slice(0, 10);

  const [longRes, shortRes] = await Promise.all([
    supabase
      .from('ai_market_snapshots')
      .select('id,snapshot_date,snapshot_type,format,raw_text,structured_content,generated_at,model_version,prompt_version')
      .eq('snapshot_date', today)
      .eq('snapshot_type', snapshotType)
      .eq('format', 'long')
      .eq('is_current', true)
      .single<MarketSnapshotRow>(),

    supabase
      .from('ai_market_snapshots')
      .select('id,snapshot_date,snapshot_type,format,raw_text,structured_content,generated_at,model_version,prompt_version')
      .eq('snapshot_date', today)
      .eq('snapshot_type', snapshotType)
      .eq('format', 'short')
      .eq('is_current', true)
      .single<MarketSnapshotRow>(),
  ]);

  return {
    long:  longRes.data  ?? null,
    short: shortRes.data ?? null,
  };
}

type Props = {
  snapshotType?: string;
  className?:    string;
};

export async function AIMarketSnapshot({ snapshotType = 'eod_summary', className = '' }: Props) {
  const { long, short } = await fetchLatestSnapshot(snapshotType).catch(() => ({ long: null, short: null }));

  // Nothing generated yet — silent absence
  if (!long && !short) return null;

  const snapshot = long ?? short!;
  const paragraphs = snapshot.raw_text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const dateFormatted = new Date(snapshot.snapshot_date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const TYPE_LABEL: Record<string, string> = {
    pre_market:   'Pre-Market',
    market_open:  'Market Open',
    market_close: 'Market Close',
    eod_summary:  'End of Day',
  };
  const typeLabel = TYPE_LABEL[snapshot.snapshot_type] ?? snapshot.snapshot_type;

  // Build WhatsApp copy text from short form
  const whatsAppText = short
    ? formatWhatsApp(short.raw_text, short.snapshot_date, short.snapshot_type).text
    : null;

  return (
    <AIMarketSnapshotClient
      paragraphs={paragraphs}
      dateFormatted={dateFormatted}
      typeLabel={typeLabel}
      generatedAt={snapshot.generated_at}
      promptVersion={snapshot.prompt_version}
      whatsAppText={whatsAppText}
      className={className}
    />
  );
}
