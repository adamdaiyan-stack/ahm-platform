// components/sectors/framework/SectorSnapshot.tsx
//
// LEVEL 1 — LIVE SECTOR SNAPSHOT
// Top stocks in the sector with current price + daily move.
// Receives pre-fetched company data from the parent server component.
// Server-safe — no client fetch required.

import Link          from "next/link";
import SectionLabel  from "./SectionLabel";

export type SnapshotCompany = {
  symbol:         string;
  company_name:   string;
  current_price:  number | null;
  change_percent: number | null;
};

interface Props {
  companies:   SnapshotCompany[];
  accentColor: string;
}

export default function SectorSnapshot({ companies, accentColor }: Props) {
  if (!companies.length) return null;

  return (
    <div>
      <SectionLabel label="Live Prices" badge="Real-time" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {companies.map((co) => {
          const chg   = co.change_percent;
          const isPos = chg != null && chg > 0;
          const isNeg = chg != null && chg < 0;

          const changeColor = chg == null
            ? "text-tx-disabled"
            : isPos ? "text-gain" : isNeg ? "text-loss" : "text-tx-secondary";

          const borderClass = chg == null
            ? "border-border-theme"
            : isPos ? "border-gain/20" : isNeg ? "border-loss/20" : "border-border-theme";

          return (
            <Link
              key={co.symbol}
              href={`/stocks/${co.symbol}`}
              className={`group bg-surface border rounded-xl px-4 py-4 hover:border-tx-secondary transition-all ${borderClass}`}
            >
              <p
                className="text-[11px] font-mono font-bold mb-0.5 tracking-wide"
                style={{ color: accentColor }}
              >
                {co.symbol}
              </p>
              <p className="text-[11px] text-tx-disabled truncate mb-3 leading-snug">
                {co.company_name}
              </p>
              <p className="text-sm font-bold text-tx-primary tabular-nums">
                {co.current_price != null
                  ? `Rs${co.current_price.toFixed(2)}`
                  : "—"}
              </p>
              <p className={`text-[11px] font-mono tabular-nums mt-0.5 ${changeColor}`}>
                {chg == null
                  ? "—"
                  : `${isPos ? "+" : ""}${chg.toFixed(2)}%`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
