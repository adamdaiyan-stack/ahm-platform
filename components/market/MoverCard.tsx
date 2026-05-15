// components/market/MoverCard.tsx
// Shared card displaying a list of market movers (gainers, losers, most active).

import Link from "next/link";
import { formatPrice, formatPercent, formatVolume } from "@/lib/formatters";

export type MoverRow = {
  id:             number;
  symbol:         string;
  company_name:   string;
  sector?:        string | null;
  current_price:  number | null;
  change_percent: number | null;
  market_cap?:    number | null;
  volume?:        number | null;
};

type MoverCardProps = {
  title:    string;
  rows:     MoverRow[];
  /** "change" shows change_percent; "volume" shows volume instead */
  metric?:  "change" | "volume";
  /** Override secondary metric color (default: auto from change sign) */
  positive?: boolean;
  emptyMessage?: string;
};

/**
 * Shared market mover list card — used by Market Dashboard and Homepage.
 *
 * @example
 * <MoverCard title="Top Gainers" rows={gainers} metric="change" positive />
 * <MoverCard title="Most Active" rows={active}  metric="volume" />
 */
export default function MoverCard({
  title,
  rows,
  metric        = "change",
  positive,
  emptyMessage  = "No data yet",
}: MoverCardProps) {
  return (
    <div>
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">
        {title}
      </p>
      <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-tx-disabled text-xs font-mono">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-border-theme">
            {rows.map((row) => {
              const changeColor =
                positive === true  ? "text-gain"
                : positive === false ? "text-loss"
                : row.change_percent == null ? "text-tx-disabled"
                : row.change_percent >= 0 ? "text-gain" : "text-loss";

              return (
                <div
                  key={row.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-raised transition-colors"
                >
                  <div className="min-w-0">
                    <Link
                      href={"/stocks/" + row.symbol}
                      className="font-mono font-bold text-tx-primary hover:text-gain transition-colors text-sm"
                    >
                      {row.symbol}
                    </Link>
                    <p className="text-xs text-tx-disabled truncate max-w-36">
                      {row.company_name}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-mono text-sm text-tx-primary tabular-nums">
                      {formatPrice(row.current_price)}
                    </p>
                    <p className={"text-xs font-semibold font-mono tabular-nums " + changeColor}>
                      {metric === "volume"
                        ? formatVolume(row.volume ?? null)
                        : formatPercent(row.change_percent)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
