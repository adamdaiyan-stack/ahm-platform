// components/ai/AIMarketSnapshotClient.tsx
//
// Client component: renders the AI market snapshot card with WhatsApp copy button.
// Split from AIMarketSnapshot (server) to confine useState to the smallest boundary.

'use client';

import { useState } from 'react';

type Props = {
  paragraphs:    string[];
  dateFormatted: string;
  typeLabel:     string;
  generatedAt:   string;
  promptVersion: string;
  whatsAppText:  string | null;
  className?:    string;
};

export default function AIMarketSnapshotClient({
  paragraphs,
  dateFormatted,
  typeLabel,
  generatedAt,
  promptVersion,
  whatsAppText,
  className = '',
}: Props) {
  const [expanded,  setExpanded]  = useState(false);
  const [copied,    setCopied]    = useState(false);

  // Show first 2 paragraphs collapsed, all when expanded
  const visible = expanded ? paragraphs : paragraphs.slice(0, 2);

  async function handleCopy() {
    if (!whatsAppText) return;
    try {
      await navigator.clipboard.writeText(whatsAppText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div className={"rounded-xl border border-border-theme bg-surface overflow-hidden " + className}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-theme flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gain" />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-tx-disabled">
              AHM AI Intelligence — {typeLabel}
            </p>
            <p className="text-xs text-tx-secondary font-mono mt-0.5">{dateFormatted}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {whatsAppText && (
            <button
              onClick={handleCopy}
              className="text-[10px] font-mono text-tx-disabled hover:text-tx-primary border border-border-theme rounded px-2 py-1 transition-colors"
            >
              {copied ? 'Copied' : 'Copy WhatsApp'}
            </button>
          )}
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-[10px] font-mono text-tx-disabled hover:text-tx-primary transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {visible.map((p, i) => (
          <p key={i} className="text-sm text-tx-secondary leading-relaxed">{p}</p>
        ))}
        {!expanded && paragraphs.length > 2 && (
          <button
            onClick={() => setExpanded(true)}
            className="text-[10px] font-mono text-tx-disabled hover:text-tx-primary transition-colors"
          >
            + {paragraphs.length - 2} more paragraph{paragraphs.length - 2 > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border-theme flex items-center justify-between">
        <p className="text-[10px] font-mono text-tx-disabled">
          Generated {new Date(generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          {' · '}v{promptVersion}
        </p>
        <p className="text-[10px] font-mono text-tx-disabled">Not investment advice</p>
      </div>
    </div>
  );
}
