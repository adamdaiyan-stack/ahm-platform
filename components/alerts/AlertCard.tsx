// components/alerts/AlertCard.tsx
//
// Renders a single intelligence alert.
// Compact format suitable for the market dashboard and company pages.

import type { Alert, AlertSeverity } from '@/types';

type Props = {
  alert: Alert;
};

const SEVERITY_STYLES: Record<AlertSeverity, { dot: string; border: string; label: string }> = {
  critical: {
    dot:    'bg-red-500',
    border: 'border-red-500/20',
    label:  'CRITICAL',
  },
  high: {
    dot:    'bg-loss',
    border: 'border-loss/20',
    label:  'HIGH',
  },
  medium: {
    dot:    'bg-amber-400',
    border: 'border-amber-400/20',
    label:  'MEDIUM',
  },
  low: {
    dot:    'bg-tx-disabled',
    border: 'border-border-theme',
    label:  'LOW',
  },
};

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const h    = Math.floor(diff / 3_600_000);
  const m    = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h >= 1)  return `${h}h ago`;
  return `${m}m ago`;
}

export function AlertCard({ alert }: Props) {
  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.low;

  return (
    <div className={"rounded-lg border bg-surface px-4 py-3 " + style.border}>
      <div className="flex items-start gap-3">
        {/* Severity dot */}
        <span className={"mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 " + style.dot} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono text-tx-disabled">{style.label}</span>
            <span className="text-[9px] font-mono text-tx-disabled">·</span>
            <span className="text-[9px] font-mono text-tx-disabled">{relativeTime(alert.triggered_at)}</span>
            {alert.reference_key && (
              <>
                <span className="text-[9px] font-mono text-tx-disabled">·</span>
                <span className="text-[9px] font-mono text-tx-disabled uppercase">{alert.reference_key}</span>
              </>
            )}
          </div>

          {/* Title */}
          <p className="text-xs font-medium text-tx-primary leading-snug">{alert.title}</p>

          {/* Body (truncated) */}
          {alert.body && (
            <p className="text-xs text-tx-secondary mt-1 leading-relaxed line-clamp-2">{alert.body}</p>
          )}
        </div>
      </div>
    </div>
  );
}
