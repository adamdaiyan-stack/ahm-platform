// lib/ai/whatsapp.ts
//
// WhatsApp output utility for AHM daily broadcast messages.
//
// PURPOSE
//   Formats ai_market_snapshots short-form text into a copy-ready WhatsApp message.
//   Does NOT automate sending. Only generates the formatted copy block.
//
// USAGE
//   import { formatWhatsApp, getLatestWhatsAppSummary } from '@/lib/ai/whatsapp';
//
// FORMAT RULES
//   - 150-200 words max
//   - Plain text only — no markdown, no asterisks for bold, no tables
//   - AHM header: "AHM Intelligence | {date}"
//   - AHM footer: "---\nAHM Research | Not investment advice"
//   - No Buy/Sell/Hold language
//   - No target prices or return forecasts

import { supabase } from '@/lib/supabase';

// ---- Types ------------------------------------------------------------------

export type WhatsAppMessage = {
  text:          string;   // The copy-ready message block
  wordCount:     number;
  snapshotDate:  string;
  snapshotType:  string;
  generatedAt:   string;
};

// ---- Formatters -------------------------------------------------------------

/**
 * Strips markdown from raw text and formats for WhatsApp.
 * - Removes **bold**, *italic*, _underline_, # headers
 * - Collapses multiple blank lines
 * - Truncates to maxWords
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')     // **bold**, *italic*, ***both***
    .replace(/_([^_]+)_/g, '$1')                   // _underline_
    .replace(/^#{1,6}\s+/gm, '')                   // # headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')       // [link text](url) -> link text
    .replace(/`{1,3}[^`]*`{1,3}/g, '')             // `code`
    .replace(/^\s*[-*+]\s+/gm, '- ')               // normalise bullet points
    .replace(/\n{3,}/g, '\n\n')                     // collapse excess blank lines
    .trim();
}

/**
 * Truncates text to approximately maxWords, breaking at a sentence boundary.
 */
export function truncateToWords(text: string, maxWords = 180): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;

  // Find the last sentence boundary within maxWords
  const truncated = words.slice(0, maxWords).join(' ');
  const lastPeriod = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?'),
  );

  return lastPeriod > truncated.length * 0.7
    ? truncated.slice(0, lastPeriod + 1)
    : truncated + '...';
}

/**
 * Formats a raw AI output text block into a WhatsApp-ready message.
 * Adds AHM header and footer.
 */
export function formatWhatsApp(
  rawText:      string,
  snapshotDate: string,
  snapshotType: string,
): WhatsAppMessage {
  const DATE_LABEL: Record<string, string> = {
    pre_market:   'Pre-Market',
    market_open:  'Market Open',
    market_close: 'Market Close',
    eod_summary:  'End of Day',
  };

  const typeLabel  = DATE_LABEL[snapshotType] ?? snapshotType;
  const dateFormatted = new Date(snapshotDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const cleaned   = stripMarkdown(rawText);
  const body      = truncateToWords(cleaned, 180);
  const wordCount = body.split(/\s+/).length;

  const header  = `AHM Intelligence | ${typeLabel} | ${dateFormatted}`;
  const footer  = `---\nAHM Research | Not investment advice`;
  const message = `${header}\n\n${body}\n\n${footer}`;

  return {
    text:         message,
    wordCount,
    snapshotDate,
    snapshotType,
    generatedAt:  new Date().toISOString(),
  };
}

// ---- DB fetch ---------------------------------------------------------------

type MarketSnapshotRow = {
  id:            string;
  snapshot_date: string;
  snapshot_type: string;
  format:        string;
  raw_text:      string;
  generated_at:  string;
};

/**
 * Fetches the most recent short-form market snapshot and formats it for WhatsApp.
 * Returns null if no snapshot exists yet.
 *
 * @param snapshotType - defaults to 'eod_summary'; pass 'market_close' for intraday
 * @param date         - defaults to today (YYYY-MM-DD); pass specific date for historical
 */
export async function getLatestWhatsAppSummary(
  snapshotType: string = 'eod_summary',
  date?: string,
): Promise<WhatsAppMessage | null> {
  const targetDate = date ?? new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('ai_market_snapshots')
    .select('id,snapshot_date,snapshot_type,format,raw_text,generated_at')
    .eq('snapshot_date', targetDate)
    .eq('snapshot_type', snapshotType)
    .eq('format', 'short')
    .eq('is_current', true)
    .single<MarketSnapshotRow>();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[ai/whatsapp] getLatestWhatsAppSummary:', error.message);
    }
    return null;
  }

  if (!data) return null;

  return formatWhatsApp(data.raw_text, data.snapshot_date, data.snapshot_type);
}

/**
 * Fetches a list of short-form snapshots for a date range.
 * Returns formatted WhatsApp messages ordered by generated_at DESC.
 */
export async function getWhatsAppHistory(
  fromDate: string,
  toDate:   string,
  snapshotType: string = 'eod_summary',
): Promise<WhatsAppMessage[]> {
  const { data, error } = await supabase
    .from('ai_market_snapshots')
    .select('id,snapshot_date,snapshot_type,format,raw_text,generated_at')
    .eq('snapshot_type', snapshotType)
    .eq('format', 'short')
    .eq('is_current', true)
    .gte('snapshot_date', fromDate)
    .lte('snapshot_date', toDate)
    .order('snapshot_date', { ascending: false })
    .returns<MarketSnapshotRow[]>();

  if (error) {
    console.error('[ai/whatsapp] getWhatsAppHistory:', error.message);
    return [];
  }

  return (data ?? []).map(row =>
    formatWhatsApp(row.raw_text, row.snapshot_date, row.snapshot_type)
  );
}
