// components/StockCard.tsx
//
// WHY THIS IS A COMPONENT:
// A StockCard is a reusable UI block. The stocks listing page shows many of
// them in a grid. By isolating it here, we can change the card design once
// and every card in the grid updates automatically.
//
// DATA FLOW:
// StocksPage (fetches from Supabase) → passes one Company row as props → StockCard renders it
//
// This component has NO data fetching of its own. It only receives props and
// renders them. This keeps it fast, simple, and reusable.

import Link from "next/link";
import { Company } from "@/types";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatVolume,
} from "@/lib/formatters";

type StockCardProps = {
  company: Company;
};

export default function StockCard({ company }: StockCardProps) {
  // Determine if today's move is positive, negative, or flat.
  // This drives the color of the price change badge.
  const isPositive = company.change !== null && company.change >= 0;
  const isNegative = company.change !== null && company.change < 0;
  const hasChange = company.change !== null;

  // Tailwind classes change based on direction.
  // Green for up, red for down, gray for no data.
  const changeBadgeClass = hasChange
    ? isPositive
      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
      : "bg-red-500/15 text-red-400 border border-red-500/30"
    : "bg-gray-800 text-gray-500 border border-gray-700";

  const priceClass = hasChange
    ? isPositive
      ? "text-emerald-400"
      : "text-red-400"
    : "text-white";

  const arrow = isPositive ? "▲" : isNegative ? "▼" : "";

  return (
    <Link
      href={`/stocks/${company.symbol}`}
      className="group relative flex flex-col bg-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 hover:bg-gray-900 transition-all duration-200 cursor-pointer"
    >
      {/* TOP ROW — Symbol + Sector badge */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {company.symbol}
          </h2>
          <p className="text-gray-400 text-sm mt-0.5 leading-snug line-clamp-1">
            {company.company_name}
          </p>
        </div>
        <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded-full px-2.5 py-1 shrink-0 ml-2">
          {company.sector}
        </span>
      </div>

      {/* PRICE + CHANGE BADGE */}
      <div className="flex items-end justify-between mt-1 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
            Price (PKR)
          </p>
          <p className={`text-3xl font-bold tabular-nums ${priceClass}`}>
            {formatPrice(company.current_price)}
          </p>
        </div>

        {/* Change badge — green or red pill */}
        <div className={`flex flex-col items-end gap-1`}>
          <span
            className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-lg tabular-nums ${changeBadgeClass}`}
          >
            {arrow} {formatChange(company.change)}
          </span>
          <span
            className={`text-xs font-medium tabular-nums ${
              hasChange
                ? isPositive
                  ? "text-emerald-400"
                  : "text-red-400"
                : "text-gray-500"
            }`}
          >
            {formatPercent(company.change_percent)}
          </span>
        </div>
      </div>

      {/* STATS ROW — Volume, P/E, Dividend */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
        <Stat label="Volume" value={formatVolume(company.volume)} />
        <Stat
          label="P/E"
          value={
            company.pe_ratio !== null ? company.pe_ratio.toFixed(1) : "—"
          }
        />
        <Stat
          label="Div Yield"
          value={
            company.dividend_yield !== null
              ? `${company.dividend_yield.toFixed(1)}%`
              : "—"
          }
        />
      </div>
    </Link>
  );
}

// Small internal component for the stat cells at the bottom of the card.
// Defined here because it's only used inside StockCard — no need to export it.
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-600 text-xs uppercase tracking-widest mb-0.5">
        {label}
      </span>
      <span className="text-gray-300 text-sm font-medium tabular-nums">
        {value}
      </span>
    </div>
  );
}
