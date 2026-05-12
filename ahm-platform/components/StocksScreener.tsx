"use client";
// components/StocksScreener.tsx
//
// The full interactive stock screener.
// Receives ALL companies as a prop (fetched server-side in stocks/page.tsx).
// All filtering, sorting, and searching happens in memory — no re-fetching.
//
// WHY CLIENT COMPONENT:
// Search input, sector pills, sort arrows all require useState.
// But the data itself never changes — it was fetched on the server once.
//
// URL PARAMS:
// Reads ?sector=Banking on mount so sector pages can deep-link here pre-filtered.

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Company } from "@/types";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatVolume,
  formatMarketCap,
} from "@/lib/formatters";

type SortKey = keyof Pick<
  Company,
  | "symbol"
  | "company_name"
  | "sector"
  | "current_price"
  | "change"
  | "change_percent"
  | "market_cap"
  | "pe_ratio"
  | "dividend_yield"
  | "volume"
  | "eps"
>;
type SortDir = "asc" | "desc";

// All unique sectors derived from the data
function getSectors(companies: Company[]): string[] {
  const set = new Set(companies.map((c) => c.sector));
  return ["All", ...Array.from(set).sort()];
}

export default function StocksScreener({ companies }: { companies: Company[] }) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Read ?sector= param on first render to pre-filter from sector pages
  useEffect(() => {
    const s = searchParams.get("sector");
    if (s) setSector(s);
  }, [searchParams]);

  const sectors = useMemo(() => getSectors(companies), [companies]);

  // Filter + sort in one pass
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = companies.filter((c) => {
      const matchesSector = sector === "All" || c.sector === sector;
      const matchesSearch =
        !q ||
        c.symbol.toLowerCase().includes(q) ||
        c.company_name.toLowerCase().includes(q);
      return matchesSector && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? (sortDir === "asc" ? Infinity : -Infinity);
      const bv = b[sortKey] ?? (sortDir === "asc" ? Infinity : -Infinity);
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });

    return result;
  }, [companies, search, sector, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── TOOLBAR ── */}
      <div className="px-8 py-4 border-b border-gray-800 flex flex-col gap-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search symbol or company name..."
          className="w-full max-w-sm bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
        />

        {/* Sector pills */}
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
                sector === s
                  ? "bg-white text-black border-white"
                  : "text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-600 font-mono">
          {filtered.length} of {companies.length} companies
          {sector !== "All" && ` · ${sector}`}
          {search && ` · "${search}"`}
        </p>
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm border-collapse" style={{ minWidth: "900px" }}>
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950">
              <Th label="Symbol"   sortKey="symbol"         current={sortKey} dir={sortDir} onSort={toggleSort} />
              <Th label="Company"  sortKey="company_name"   current={sortKey} dir={sortDir} onSort={toggleSort} wide />
              <Th label="Sector"   sortKey="sector"         current={sortKey} dir={sortDir} onSort={toggleSort} />
              <Th label="Price"    sortKey="current_price"  current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Chg"      sortKey="change"         current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Chg %"    sortKey="change_percent" current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Mkt Cap"  sortKey="market_cap"     current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="P/E"      sortKey="pe_ratio"       current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Div %"    sortKey="dividend_yield" current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="EPS"      sortKey="eps"            current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Volume"   sortKey="volume"         current={sortKey} dir={sortDir} onSort={toggleSort} right />
            </tr>
          </thead>
          <tbody>
            {filtered.map((company) => (
              <Row key={company.id} company={company} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center text-gray-600 py-16 text-sm font-mono">
                  No companies match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── TABLE HEADER CELL ──────────────────────────────────────────

function Th({
  label,
  sortKey,
  current,
  dir,
  onSort,
  right,
  wide,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
  right?: boolean;
  wide?: boolean;
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`
        px-4 py-3 font-mono text-xs uppercase tracking-widest cursor-pointer select-none
        whitespace-nowrap border-b border-gray-800
        ${right ? "text-right" : "text-left"}
        ${wide ? "min-w-48" : ""}
        ${active ? "text-white" : "text-gray-600 hover:text-gray-400"}
      `}
    >
      {label}
      {active && (
        <span className="ml-1 text-gray-400">{dir === "asc" ? "↑" : "↓"}</span>
      )}
    </th>
  );
}

// ── TABLE ROW ─────────────────────────────────────────────────

function Row({ company }: { company: Company }) {
  const isPos = company.change !== null && company.change >= 0;
  const isNeg = company.change !== null && company.change < 0;
  const changeColor = company.change === null
    ? "text-gray-600"
    : isPos ? "text-emerald-400" : "text-red-400";

  return (
    <tr className="border-b border-gray-900 hover:bg-gray-950 transition-colors group">
      {/* Symbol — links to stock detail */}
      <td className="px-4 py-3">
        <Link
          href={`/stocks/${company.symbol}`}
          className="font-mono font-bold text-white hover:text-emerald-400 transition-colors text-sm tracking-wide"
        >
          {company.symbol}
        </Link>
      </td>

      {/* Company name */}
      <td className="px-4 py-3 text-gray-400 text-xs leading-tight max-w-48">
        <Link href={`/stocks/${company.symbol}`} className="hover:text-white transition-colors">
          {company.company_name}
        </Link>
      </td>

      {/* Sector */}
      <td className="px-4 py-3">
        <span className="text-xs text-gray-600 font-mono">{company.sector}</span>
      </td>

      {/* Price */}
      <td className={`px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums ${
        company.current_price !== null ? "text-white" : "text-gray-700"
      }`}>
        {formatPrice(company.current_price)}
      </td>

      {/* Change (abs) */}
      <td className={`px-4 py-3 text-right font-mono text-xs tabular-nums ${changeColor}`}>
        {formatChange(company.change)}
      </td>

      {/* Change % */}
      <td className={`px-4 py-3 text-right font-mono text-xs tabular-nums ${changeColor}`}>
        {formatPercent(company.change_percent)}
      </td>

      {/* Market Cap */}
      <td className="px-4 py-3 text-right font-mono text-xs text-gray-400 tabular-nums">
        {formatMarketCap(company.market_cap)}
      </td>

      {/* P/E */}
      <td className="px-4 py-3 text-right font-mono text-xs text-gray-400 tabular-nums">
        {company.pe_ratio != null ? company.pe_ratio.toFixed(1) : "—"}
      </td>

      {/* Div Yield */}
      <td className="px-4 py-3 text-right font-mono text-xs text-gray-400 tabular-nums">
        {company.dividend_yield != null ? `${company.dividend_yield.toFixed(1)}%` : "—"}
      </td>

      {/* EPS */}
      <td className="px-4 py-3 text-right font-mono text-xs text-gray-400 tabular-nums">
        {company.eps != null ? company.eps.toFixed(2) : "—"}
      </td>

      {/* Volume */}
      <td className="px-4 py-3 text-right font-mono text-xs text-gray-400 tabular-nums">
        {formatVolume(company.volume)}
      </td>
    </tr>
  );
}
