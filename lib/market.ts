// lib/market.ts — shared market utility functions (no business logic, pure helpers)

export type MarketStatus = {
  label: string;
  open:  boolean;
  pre:   boolean;
};

/**
 * Returns current PSX market session status based on Pakistan Standard Time.
 * PSX trading hours: Mon–Fri, 09:45 AM – 03:30 PM PKT.
 * Pre-market: 09:00 – 09:45 AM PKT.
 */
export function getMarketStatus(): MarketStatus {
  const pkt  = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
  const day  = pkt.getDay(); // 0 = Sun, 6 = Sat
  const mins = pkt.getHours() * 60 + pkt.getMinutes();

  if (day === 0 || day === 6)              return { label: "Closed — Weekend",  open: false, pre: false };
  if (mins >= 540  && mins < 585)          return { label: "Pre-Market",         open: false, pre: true  };
  if (mins >= 585  && mins < 930)          return { label: "Market Open",         open: true,  pre: false };
  return                                          { label: "Market Closed",        open: false, pre: false };
}

/**
 * Formats an ISO timestamp to a human-readable PKT string.
 * e.g. "14 May 2026, 03:30 PM PKT"
 */
export function fmtUpdatedAt(iso: string | null | undefined): string {
  if (!iso) return "—";
  return (
    new Date(iso).toLocaleString("en-PK", {
      timeZone:  "Asia/Karachi",
      day:       "2-digit",
      month:     "short",
      year:      "numeric",
      hour:      "2-digit",
      minute:    "2-digit",
      hour12:    true,
    }) + " PKT"
  );
}

/**
 * Returns Tailwind className for market status badge.
 */
export function marketStatusClass(status: MarketStatus): string {
  if (status.open) return "bg-emerald-500/15 text-gain border-emerald-500/30";
  if (status.pre)  return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  return "bg-surface text-tx-secondary border-border-theme";
}
