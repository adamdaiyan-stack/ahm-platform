"use client";

import { SECTOR_SLUG } from "@/constants";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Company } from "@/types";
import { formatPrice, formatChange, formatPercent, formatVolume, formatMarketCap } from "@/lib/formatters";
import Table, { type ColumnDef } from "@/components/ui/Table";

// ─── Types ───────────────────────────────────────────────────────────────────

type SortKey = keyof Pick<Company,
  "symbol"|"company_name"|"sector"|"current_price"|"change"|"change_percent"|
  "market_cap"|"pe_ratio"|"dividend_yield"|"volume"|"eps">;
type SortDir      = "asc" | "desc";
type ChangeFilter = "all" | "gainers" | "losers";
type PEFilter     = "all" | "under10" | "10to20" | "over20";
type DivFilter    = "all" | "5plus"   | "8plus"  | "10plus";
type CapFilter    = "all" | "large"   | "mid"    | "small";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSectors(companies: Company[]): string[] {
  const set = new Set(companies.map((c) => c.sector));
  return ["All", ...Array.from(set).sort()];
}

// ─── Filter pills ─────────────────────────────────────────────────────────────

function FilterPills<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-mono text-tx-disabled uppercase tracking-widest w-16 flex-shrink-0">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={
            "text-xs font-mono px-2.5 py-1 rounded-full border transition-all " +
            (value === o.value
              ? "bg-tx-primary text-base border-tx-primary"
              : "text-tx-secondary border-border-theme hover:border-tx-secondary hover:text-tx-primary")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

function buildColumns(): ColumnDef<Company, SortKey>[] {
  return [
    {
      key: "symbol", label: "Symbol", align: "left", sortable: true,
      render: (c) => (
        <Link
          href={"/stocks/" + c.symbol}
          className="font-mono font-bold text-tx-primary hover:text-gain transition-colors text-sm tracking-wide"
        >
          {c.symbol}
        </Link>
      ),
    },
    {
      key: "company_name", label: "Company", align: "left", sortable: true,
      tdClassName: "max-w-48",
      render: (c) => (
        <Link
          href={"/stocks/" + c.symbol}
          className="text-tx-secondary text-xs leading-tight hover:text-tx-primary transition-colors"
        >
          {c.company_name}
        </Link>
      ),
    },
    {
      key: "sector", label: "Sector", align: "left", sortable: true,
      render: (c) =>
        SECTOR_SLUG[c.sector] ? (
          <Link
            href={"/sectors/" + SECTOR_SLUG[c.sector]}
            className="text-xs font-mono text-tx-secondary hover:text-tx-primary hover:underline transition-colors"
          >
            {c.sector} ↗
          </Link>
        ) : (
          <span className="text-xs text-tx-disabled font-mono">{c.sector}</span>
        ),
    },
    {
      key: "current_price", label: "Price", sortable: true,
      render: (c) => (
        <span className={"font-mono text-sm font-semibold tabular-nums " +
          (c.current_price !== null ? "text-tx-primary" : "text-tx-disabled")}>
          {formatPrice(c.current_price)}
        </span>
      ),
    },
    {
      key: "change", label: "Chg", sortable: true,
      render: (c) => (
        <span className={"font-mono text-xs tabular-nums " +
          (c.change === null ? "text-tx-disabled" : c.change >= 0 ? "text-gain" : "text-loss")}>
          {formatChange(c.change)}
        </span>
      ),
    },
    {
      key: "change_percent", label: "Chg %", sortable: true,
      render: (c) => (
        <span className={"font-mono text-xs tabular-nums " +
          (c.change_percent === null ? "text-tx-disabled" : c.change_percent >= 0 ? "text-gain" : "text-loss")}>
          {formatPercent(c.change_percent)}
        </span>
      ),
    },
    {
      key: "market_cap", label: "Mkt Cap", sortable: true,
      render: (c) => (
        <span className="font-mono text-xs text-tx-secondary tabular-nums">
          {formatMarketCap(c.market_cap)}
        </span>
      ),
    },
    {
      key: "pe_ratio", label: "P/E", sortable: true,
      render: (c) => (
        <span className="font-mono text-xs text-tx-secondary tabular-nums">
          {c.pe_ratio != null ? c.pe_ratio.toFixed(1) : "—"}
        </span>
      ),
    },
    {
      key: "dividend_yield", label: "Div %", sortable: true,
      render: (c) => (
        <span className="font-mono text-xs text-tx-secondary tabular-nums">
          {c.dividend_yield != null ? c.dividend_yield.toFixed(1) + "%" : "—"}
        </span>
      ),
    },
    {
      key: "eps", label: "EPS", sortable: true, hideOnMobile: true,
      render: (c) => (
        <span className="font-mono text-xs text-tx-secondary tabular-nums">
          {c.eps != null ? c.eps.toFixed(2) : "—"}
        </span>
      ),
    },
    {
      key: "volume", label: "Volume", sortable: true, hideOnMobile: true,
      render: (c) => (
        <span className="font-mono text-xs text-tx-secondary tabular-nums">
          {formatVolume(c.volume)}
        </span>
      ),
    },
  ];
}

const COLUMNS = buildColumns();

// ─── Component ───────────────────────────────────────────────────────────────

export default function StocksScreener({ companies }: { companies: Company[] }) {
  const searchParams = useSearchParams();

  const [search,       setSearch]       = useState("");
  const [sector,       setSector]       = useState("All");
  const [sortKey,      setSortKey]      = useState<SortKey>("market_cap");
  const [sortDir,      setSortDir]      = useState<SortDir>("desc");
  const [showFilters,  setShowFilters]  = useState(false);
  const [changeFilter, setChangeFilter] = useState<ChangeFilter>("all");
  const [peFilter,     setPeFilter]     = useState<PEFilter>("all");
  const [divFilter,    setDivFilter]    = useState<DivFilter>("all");
  const [capFilter,    setCapFilter]    = useState<CapFilter>("all");

  useEffect(() => {
    const s = searchParams.get("sector");
    if (s) { setSector(s); setShowFilters(true); }
  }, [searchParams]);

  const sectors         = useMemo(() => getSectors(companies), [companies]);
  const hasActiveFilters = changeFilter !== "all" || peFilter !== "all" || divFilter !== "all" || capFilter !== "all";

  function resetFilters() {
    setChangeFilter("all"); setPeFilter("all"); setDivFilter("all"); setCapFilter("all");
  }

  // Filter + sort in one pass — Table receives pre-processed rows (controlled mode)
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = companies.filter((c) => {
      if (sector !== "All" && c.sector !== sector) return false;
      if (q && !c.symbol.toLowerCase().includes(q) && !c.company_name.toLowerCase().includes(q)) return false;
      if (changeFilter === "gainers" && (c.change_percent == null || c.change_percent <= 0)) return false;
      if (changeFilter === "losers"  && (c.change_percent == null || c.change_percent >= 0)) return false;
      if (peFilter === "under10" && (c.pe_ratio == null || c.pe_ratio >= 10))  return false;
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
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return result;
  }, [companies, search, sector, sortKey, sortDir, changeFilter, peFilter, divFilter, capFilter]);

  function handleSortChange(key: SortKey | null, dir: "asc" | "desc" | null) {
    if (!key || !dir) return;
    setSortKey(key);
    setSortDir(dir);
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Toolbar ── */}
      <div className="px-8 py-4 border-b border-border-theme flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol or company name…"
            className="flex-1 max-w-sm bg-surface border border-border-theme rounded-lg px-4 py-2 text-sm text-tx-primary placeholder-tx-disabled focus:outline-none focus:border-tx-secondary"
          />
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={
              "text-xs font-mono px-3 py-2 rounded-lg border transition-all " +
              (showFilters || hasActiveFilters
                ? "bg-tx-primary text-base border-tx-primary"
                : "text-tx-secondary border-border-theme hover:border-tx-secondary hover:text-tx-primary")
            }
          >
            {hasActiveFilters ? "Filters ●" : "Filters"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-mono text-tx-disabled hover:text-tx-secondary transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Sector pills */}
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={
                "text-xs font-mono px-3 py-1.5 rounded-full border transition-all " +
                (sector === s
                  ? "bg-tx-primary text-base border-tx-primary"
                  : "text-tx-secondary border-border-theme hover:border-tx-secondary hover:text-tx-primary")
              }
            >
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
          <p className="text-xs text-tx-disabled font-mono opacity-50">
            Source: PSX · Prices indicative · Not real-time
          </p>
        </div>
      </div>

      {/* ── Table (controlled sort — StocksScreener owns state + pre-sorts rows) ── */}
      <div className="flex-1">
        <Table<Company, SortKey>
          columns={COLUMNS}
          rows={filtered}
          rowKey={(c) => c.id}
          emptyMessage="No companies match your filters"
          className="rounded-none border-0 border-t border-border-theme"
          minWidth={900}
          controlledSortKey={sortKey}
          controlledSortDir={sortDir}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
}
