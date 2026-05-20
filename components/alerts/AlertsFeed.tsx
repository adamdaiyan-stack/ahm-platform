// components/alerts/AlertsFeed.tsx
//
// Server component: renders the active alerts notification strip.
// Silently absent when no active alerts exist.
//
// USAGE
//   <AlertsFeed />                              — market dashboard (all alerts)
//   <AlertsFeed referenceKey="MCB" limit={5} /> — company page (symbol-specific)
//   <AlertsFeed referenceKey="banking" limit={4} /> — sector page

import { getActiveAlerts, getAlertsBySymbol, getAlertsBySector } from '@/services/api/alerts';
import { AlertCard } from './AlertCard';
import type { Alert } from '@/types';

type Props = {
  referenceKey?: string;  // symbol, sector_slug, or undefined for all
  context?:      'market' | 'company' | 'sector';
  limit?:        number;
  className?:    string;
};

export async function AlertsFeed({
  referenceKey,
  context = 'market',
  limit   = 10,
  className = '',
}: Props) {
  let alerts: Alert[] = [];

  try {
    if (!referenceKey || context === 'market') {
      alerts = await getActiveAlerts(limit);
    } else if (context === 'sector') {
      alerts = await getAlertsBySector(referenceKey);
    } else {
      alerts = await getAlertsBySymbol(referenceKey);
    }
  } catch {
    return null; // Never break the page
  }

  if (!alerts.length) return null;

  return (
    <div className={"space-y-2 " + className}>
      <p className="text-[10px] font-mono uppercase tracking-widest text-tx-disabled mb-3">
        Intelligence Alerts
        <span className="ml-2 text-tx-disabled bg-surface border border-border-theme rounded-full px-1.5 py-0.5">
          {alerts.length}
        </span>
      </p>
      {alerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
