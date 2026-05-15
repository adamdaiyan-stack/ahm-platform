"use client";

import { SECTOR_SLUG } from "@/constants";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Company } from "@/types";
import { formatPrice, formatChange, formatPercent, formatVolume, formatMarketCap } from "@/lib/formatters";



type SortKey = keyof Pick<Company,
  "symbol"|"company_name"|"sector"|"current_price"|"change"|"change_percent"|
  "market_cap"|"pe_ratio"|"dividend_yield"|"volume"|"eps">;
type SortDir = "asc" | "desc";

function getSectors(companies: Company[]): string[] {
  const set = new Set(companies.map((c) => c.sector));
  return ["All", ...Array.from(set).sort()];
}

function FilterPills<T extends string>({ label, options, value, onChange }: {
  label: string; options: { label: string; value: T }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-mono text-tx-disabled uppercase tracking-widest w-16 flex-shrink-0">{label}</span>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={"text-xs font-mono px-2.5 py-1 rounded-full border transition-all " + (
            value === o.value
              ? "bg-tx-primary text-base border-tx-primary"
              : "text-tx-secondary border-border-theme hover:border-tx-secondary hover:text-tx-primary"
          )}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

type ChangeFilter = "all" | "gainers" | "losers";
type PEFilter    = "all" | "under10" | "10to20" | "over20";
type DivFilter   = "all" | "5plus"   | "8plus"  | "10plus";
type CapFilter   = "all" | "large"   | "mid"    | "small";

export default function StocksScreener({ companies }: { companies: Company[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch]               = useState("");
  const [sector, setSector]               = useState("All");
  const [sortKey, setSortKey]             = useState<SortKey>("market_cap");
  const [sortDir, setSortDir]             = useState<SortDir>("desc");
  const [showFilters, setShowFilters]     = useState(false);
  const [changeFilter, setChangeFilter]   = useState<ChangeFilter>("all");
  const [peFilter, setPeFilter]           = useState<PEFilter>("all");
  const [divFilter, setDivFilter]         = useState<DivFilter>("all");
  const [capFilter, setCapFilter]         = useState<CapFilter>("all");

  useEffect(() => {
    const s = searchParams.get("sector");
    if (s) { setSector(s); setShowFilters(true); }
  }, [searchParams]);

  const sectors = useMemo(() => getSectors(companies), [companies]);
  const hasActiveFilters = changeFilter !== "all" || peFilter !== "all" || divFilter !== "all" || capFilter !== "all";

  function resetFilters() { setChangeFilter("all"); setPeFilter("all"); setDivFilter("all"); setCapFilter("all"); }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = companies.filter((c) => {
      if (sector !== "All" && c.sector !== sector) return false;
      if (q && !c.symbol.toLowerCase().includes(q) && !c.company_name.toLowerCase().includes(q)) return false;
      if (changeFilter === "gainers" && (c.change_percent == null || c.change_percent <= 0)) return false;
      if (changeFilter === "losers"  && (c.change_percent == null || c.change_percent >= 0)) return false;
      if (peFilter === "under10" && (c.pe_ratio == null || c.pe_ratio >= 10)) return false;
      if (peFilter === "10to20"  && (c.pe_ratio == null || c.pe_ratio < 10 || c.pe_ratio > 20)) return false;
      if (peFilter === "over20"  && (c.pe_ratio == null || c.pe_ratio <= 20)) return false;
      if (divFilter === "5plus"  && (c.dividend_yield == null || c.dividend_yield < 5))  return false;
      if (divFilter === "8plus"  && (c.dividend_yield == null || c.dividend_yield < 8))  return false;
      if (divFilter === "10plus" && (c.dividend_yield == null || c.dividend_yield < 10)) return false;
      if (capFilter === "large"  && (c.market_cap == null || c.market_cap < 100_000_000_000))  return false;
      if (capFilter === "mid"    && (c.market_cap == null || c.market_cap < 20_000_000_000 || c.market_cap >= 100_000_000_000)) return false;
      if (capFilter === "small"  && (c.market_cap == null || c.market_cap >= 20_000_000_000)) return false;
      return true;
    });
    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? (sortDir === "asc" ? Infinity : -Infinity);
      const bv = b[sortKey] ?? (sortDir === "asc" ? Infinity : -Infinity);
      if (typeof av === "string" && typeof bv === "string")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [companies, search, sector, sortKey, sortDir, changeFilter, peFilter, divFilter, capFilter]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── TOOLBAR ───────────────────────────────────── */}
      <div className="px-8 py-4 border-b border-border-theme flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol or company name…"
            className="flex-1 max-w-sm bg-surface border border-border-theme rounded-lg px-4 py-2 text-sm text-tx-primary placeholder-tx-disabled focus:outline-none focus:border-tx-secondary" />
          <button onClick={() => setShowFilters((v) => !v)}
            className={"text-xs font-mono px-3 py-2 rounded-lg border transition-all " + (
              showFilters || hasActiveFilters
                ? "bg-tx-primary text-base border-tx-primary"
                : "text-tx-secondary border-border-theme hover:border-tx-secondary hover:text-tx-primary"
            )}>
            {hasActiveFilters ? "Filters ●" : "Filters"}
          </button>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-xs font-mono text-tx-disabled hover:text-tx-secondary transition-colors">Reset</button>
          )}
        </div>

        {/* Sector pills */}
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button key={s} onClick={() => setSector(s)}
              className={"text-xs font-mono px-3 py-1.5 rounded-full border transition-all " + (
                sector === s
                  ? "bg-tx-primary text-base border-tx-primary"
                  : "text-tx-secondary border-border-theme hover:border-tx-secondary hover:text-tx-primary"
              )}>
              {s}
            </button>
          ))}
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="flex flex-col gap-2 pt-2 border-t border-border-theme">
            <FilterPills label="Move" value={changeFilter} onChange={setChangeFilter}
              options={[{ label: "All", value: "all" }, { label: "Gainers", value: "gainers" }, { label: "Losers", value: "losers" }]} />
            <FilterPills label="P/E" value={peFilter} onChange={setPeFilter}
              options={[{ label: "All", value: "all" }, { label: "< 10", value: "under10" }, { label: "10–20", value: "10to20" }, { label: "> 20", value: "over20" }]} />
            <FilterPills label="Div" value={divFilter} onChange={setDivFilter}
              options={[{ label: "All", value: "all" }, { label: "5%+", value: "5plus" }, { label: "8%+", value: "8plus" }, { label: "10%+", value: "10plus" }]} />
            <FilterPills label="Cap" value={capFilter} onChange={setCapFilter}
              options={[{ label: "All", value: "all" }, { label: "Large (>100B)", value: "large" }, { label: "Mid (20–100B)", value: "mid" }, { label: "Small (<20B)", value: "small" }]} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-tx-disabled font-mono">
            {filtered.length} of {companies.length} companies
            {sector !== "All" && " · " + sector}
            {search && " · \"" + search + "\""}
          </p>
          <p className="text-xs text-tx-disabled font-mono opacity-50">Source: PSX · Prices indicative · Not real-time</p>
        </div>
      </div>

      {/* ── TABLE ─────────────────────────────────────── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm border-collapse" style={{ minWidth: "900px" }}>
          <thead>
            <tr className="border-b border-border-theme bg-surface">
              <Th label="Symbol"  sortKey="symbol"         current={sortKey} dir={sortDir} onSort={toggleSort} />
              <Th label="Company" sortKey="company_name"   current={sortKey} dir={sortDir} onSort={toggleSort} wide />
              <Th label="Sector"  sortKey="sector"         current={sortKey} dir={sortDir} onSort={toggleSort} />
              <Th label="Price"   sortKey="current_price"  current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Chg"     sortKey="change"         current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Chg %"   sortKey="change_percent" current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Mkt Cap" sortKey="market_cap"     current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="P/E"     sortKey="pe_ratio"       current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Div %"   sortKey="dividend_yield" current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="EPS"     sortKey="eps"            current={sortKey} dir={sortDir} onSort={toggleSort} right />
              <Th label="Volume"  sortKey="volume"         current={sortKey} dir={sortDir} onSort={toggleSort} right />
            </tr>
          </thead>
          <tbody>
            {filtered.map((company) => <Row key={company.id} company={company} />)}
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="text-center text-tx-disabled py-16 text-sm font-mono">No companies match your filters</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ label, sortKey, current, dir, onSort, right, wide }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir;
  onSort: (k: SortKey) => void; right?: boolean; wide?: boolean;
}) {
  const active = current === sortKey;
  return (
    <th onClick={() => onSort(sortKey)}
      className={"px-4 py-3 font-mono text-xs uppercase tracking-widest cursor-pointer select-none whitespace-nowrap border-b border-border-theme " +
        (right ? "text-right " : "text-left ") + (wide ? "min-w-48 " : "") +
        (active ? "text-tx-primary" : "text-tx-disabled hover:text-tx-secondary")}>
      {label}{active && <span className="ml-1 text-tx-secondary">{dir === "asc" ? "↑" : "↓"}</span>}
    </th>
  );
}

function Row({ company }: { company: Company }) {
  const changeColor = company.change === null ? "text-tx-disabled" : company.change >= 0 ? "text-gain" : "text-loss";
  return (
    <tr className="border-b border-border-theme hover:bg-surface transition-colors">
      <td className="px-4 py-3">
        <Link href={"/stocks/" + company.symbol} className="font-mono font-bold text-tx-primary hover:text-gain transition-colors text-sm tracking-wide">
          {company.symbol}
        </Link>
      </td>
      <td className="px-4 py-3 text-tx-secondary text-xs leading-tight max-w-48">
        <Link href={"/stocks/" + company.symbol} className="hover:text-tx-primary transition-colors">{company.company_name}</Link>
      </td>
      <td className="px-4 py-3">
        {SECTOR_SLUG[company.sector] ? (
          <Link
            href={"/sectors/" + SECTOR_SLUG[company.sector]}
            className="text-xs font-mono text-tx-secondary hover:text-tx-primary hover:underline transition-colors"
          >
            {company.sector} ↗
          </Link>
        ) : (
          <span className="text-xs text-tx-disabled font-mono">{company.sector}</span>
        )}
      </td>
      <td className={"px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums " + (company.current_price !== null ? "text-tx-primary" : "text-tx-disabled")}>
        {formatPrice(company.current_price)}
      </td>
      <td className={"px-4 py-3 text-right font-mono text-xs tabular-nums " + changeColor}>{formatChange(company.change)}</td>
      <td className={"px-4 py-3 text-right font-mono text-xs tabular-nums " + changeColor}>{formatPercent(company.change_percent)}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-tx-secondary tabular-nums">{formatMarketCap(company.market_cap)}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-tx-secondary tabular-nums">{company.pe_ratio != null ? company.pe_ratio.toFixed(1) : "—"}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-tx-secondary tabular-nums">{company.dividend_yield != null ? company.dividend_yield.toFixed(1) + "%" : "—"}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-tx-secondary tabular-nums">{company.eps != null ? company.eps.toFixed(2) : "—"}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-tx-secondary tabular-nums">{formatVolume(company.volume)}</td>
    </tr>
  );
}
