// components/ai/AIOutputPanel.tsx
//
// Base UI component for rendering a cached AI text output.
// Intentionally minimal — no Markdown rendering, plain paragraphs.
// Receives pre-fetched rawText so it can be used in server or client components.
//
// PROPS
//   rawText      — the LLM-generated text from ai_outputs.raw_text
//   label        — small eyebrow label above the content
//   qualityStatus — 'passed' | 'warning' | 'failed' — shown as status dot
//   promptedAt   — ISO timestamp of generation (shown in footer)
//   className    — optional extra class on the outer container

import type { AIOutput } from '@/lib/ai';

type Props = {
  rawText:       string;
  label:         string;
  qualityStatus?: 'passed' | 'warning' | 'failed';
  generatedAt?:  string;
  className?:    string;
};

const STATUS_DOT: Record<'passed' | 'warning' | 'failed', string> = {
  passed:  'bg-gain',
  warning: 'bg-amber-400',
  failed:  'bg-loss',
};

export function AIOutputPanel({ rawText, label, qualityStatus = 'passed', generatedAt, className = '' }: Props) {
  // Split into paragraphs on double newlines
  const paragraphs = rawText
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const dotCls = STATUS_DOT[qualityStatus];

  return (
    <div className={"rounded-lg border border-border-theme bg-surface p-5 space-y-4 " + className}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-tx-disabled">{label}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={"w-1.5 h-1.5 rounded-full " + dotCls} />
          <span className="text-[10px] font-mono text-tx-disabled">AI</span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-tx-secondary leading-relaxed">{p}</p>
        ))}
      </div>

      {/* Footer */}
      {generatedAt && (
        <p className="text-[10px] font-mono text-tx-disabled pt-1 border-t border-border-theme">
          Generated {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' · '}
          <span className="text-tx-disabled">AHM AI Intelligence — not investment advice</span>
        </p>
      )}
    </div>
  );
}
