import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatVolume,
  formatMarketCap,
} from "@/lib/formatters";
import { Company } from "@/types";

const SECTOR_TO_SLUG: Record<string, string> = {
  "Banking":          "banking",
  "Automobile":       "auto",
  "Auto":             "auto",
  "Cement":           "cement",
  "Fertiliser":       "fertiliser",
  "Fertilizer":       "fertiliser",
  "Oil & Gas":        "oil-gas",
  "Oil and Gas":      "oil-gas",
  "E&P":              "oil-gas",
  "Power":            "power-ipp",
  "Power Generation": "power-ipp",
  "IPP":              "power-ipp",
  "Textiles":         "textiles",
  "Textile":          "textiles",
};

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .single<Company>();

  if (!company) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <p className="text-gray-400">Company not found: {symbol}</p>
        <Link href="/stocks" className="text-emerald-400 hover:underline mt-4 inline-block">
          Back to all stocks
        </Link>
      </main>
    );
  }

  const sectorSlug = SECTOR_TO_SLUG[company.sector] ?? null;
  const isPositive = company.change !== null && company.change >= 0;
  const isNegative = company.change !== null && company.change < 0;
  const hasChange = company.change !== null;
  const arrow = isPositive ? "▲" : isNegative ? "▼" : "";

  const priceColor = hasChange
    ? isPositive ? "text-emerald-400" : "text-red-400"
    : "text-white";

  const changePillClass = hasChange
    ? isPositive
      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
      : "bg-red-500/15 text-red-400 border border-red-500/30"
    : "bg-gray-800 text-gray-400 border border-gray-700";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 px-8 py-4">
        <Link href="/stocks" className="text-sm text-gray-500 hover:text-white transition-colors">
          All Stocks
        </Link>
      </div>

      <div className="px-8 pt-10 pb-8 border-b border-gray-800">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 max-w-5xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-5xl font-bold tracking-tight">{company.symbol}</h1>
              <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded-full px-3 py-1.5">
                {company.sector}
              </span>
            </div>
            <p className="text-gray-400 text-lg">{company.company_name}</p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-xs text-gray-600 uppercase tracking-widest">Last Price (PKR)</p>
            <p className={`text-5xl font-bold tabular-nums ${priceColor}`}>
              {formatPrice(company.current_price)}
            </p>
            <span className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg tabular-nums ${changePillClass}`}>
              {arrow} {formatChange(company.change)} ({formatPercent(company.change_percent)})
            </span>
          </div>
        </div>
      </div>

      {sectorSlug && (
        <div className="px-8 py-5 border-b border-gray-800">
          <Link
            href={`/sectors/${sectorSlug}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/20 hover:border-blue-500/40 rounded-lg px-4 py-2 bg-blue-500/5 hover:bg-blue-500/10"
          >
            Open {company.sector} Sector Intelligence Module
          </Link>
        </div>
      )}

      <div className="px-8 py-10 max-w-5xl">
        <h2 className="text-xs text-gray-600 uppercase tracking-widest mb-6">Key Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Market Cap" value={formatMarketCap(company.market_cap)} />
          <StatCard label="Volume" value={formatVolume(company.volume)} />
          <StatCard label="P/E Ratio" value={company.pe_ratio !== null ? company.pe_ratio.toFixed(2) : "—"} />
          <StatCard label="Dividend Yield" value={company.dividend_yield !== null ? `${company.dividend_yield.toFixed(2)}%` : "—"} />
          <StatCard label="Sector" value={company.sector} />
          <StatCard label="Symbol" value={company.symbol} />
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-white text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
