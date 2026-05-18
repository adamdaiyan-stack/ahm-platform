// components/dashboard/MoversPanel.tsx
//
// Curated movers panel — top gainers and top losers side by side.
// Intentionally compact: 3 rows per column, symbol + name + change badge.
// NOT a full data table. This is a quick-scan intelligence widget.
//
// ARCHITECTURE:
//   Server component. Data pre-fetched at page level and passed as props.
//   Uses CompanyMover[] shape (id, symbol, company_name, sector,
//   current_price, change_percent, market_cap).

import Link from "next/link";
import type { CompanyMover } from "@/types";
import { formatPrice, formatPercent } from "@/lib/formatters";

type Props = {
  gainers: CompanyMover[];
  losers:  CompanyMover[];
};

function MoverRow({ row, positive }: { row: CompanyMover; positive: boolean }) {
  const chg = row.change_percent;
  const pct = chg != null ? formatPercent(chg) : "—";
  const pillClass = positive
    ? "bg-gain/10 text-gain border border-gain/20"
    : "bg-loss/10 text-loss border border-loss/20";

  return (
    <Link
      href={"/stocks/" + row.symbol}
      className="flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-raised rounded-lg transition-colors group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-xs font-mono font-bold text-tx-primary bg-surface border border-border-theme px-1.5 py-0.5 rounded flex-shrink-0">
          {row.symbol}
        </span>
        <span className="text-xs text-tx-secondary truncate group-hover:text-tx-primary transition-colors">
          {row.company_name}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {row.current_price != null && (
          <span className="text-xs font-mono text-tx-disabled hidden sm:block">
            {formatPrice(row.current_price)}
          </span>
        )}
        <span className={"text-xs font-mono font-bold px-2 py-0.5 rounded " + pillClass}>
          {positive ? "▲" : "▼"} {pct}
        </span>
      </div>
    </Link>
  );
}

function MoverColumn({
  title,
  rows,
  positive,
  emptyText,
}: {
  title:     string;
  rows:      CompanyMover[];
  positive:  boolean;
  emptyText: string;
}) {
  const dotClass = positive ? "bg-gain" : "bg-loss";
  const titleClass = positive ? "text-gain" : "text-loss";
  const topN = rows.slice(0, 3);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2 px-3">
        <span className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + dotClass} />
        <p className={"text-xs font-mono font-bold uppercase tracking-widest " + titleClass}>
          {title}
        </p>
      </div>
      {topN.length === 0 ? (
        <p className="text-xs text-tx-disabled px-3 py-4">{emptyText}</p>
      ) : (
        <div>
          {topN.map(row => (
            <MoverRow key={row.id} row={row} positive={positive} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MoversPanel({ gainers, losers }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
          Notable Movers
        </p>
        <Link
          href="/stocks"
          className="text-xs font-mono text-tx-disabled hover:text-tx-primary transition-colors"
        >
          Full screener &rarr;
        </Link>
      </div>

      <div className="bg-surface border border-border-theme rounded-xl p-3">
        <div className="flex gap-3">
          <MoverColumn
            title="Gainers"
            rows={gainers}
            positive={true}
            emptyText="No gainer data"
          />
          <div className="w-px bg-border-theme flex-shrink-0" />
          <MoverColumn
            title="Losers"
            rows={losers}
            positive={false}
            emptyText="No loser data"
          />
        </div>
      </div>
    </section>
  );
}
