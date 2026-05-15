"use client";
// components/ui/Table.tsx

import { useState, useMemo } from "react";

// ─── Sort helpers ────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc" | null;

/** 3-click cycle: none → asc → desc → reset */
function nextSort<K extends string>(
  activeKey: K | null,
  dir: SortDir,
  clicked: K
): [K | null, SortDir] {
  if (activeKey !== clicked) return [clicked, "asc"];
  if (dir === "asc")        return [clicked, "desc"];
  return [null, null];
}

function SortArrow({
  isActive,
  dir,
}: {
  isActive: boolean;
  dir: SortDir;
}) {
  if (!isActive)
    return <span className="ml-1 opacity-25 text-tx-disabled">↕</span>;
  return (
    <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>
  );
}

// ─── Column definition ───────────────────────────────────────────────────────

export type ColumnDef<T, K extends string = string> = {
  /** Unique key — also used as the sort key if `sortable` is true */
  key: K;
  /** Header label */
  label: string;
  /** Horizontal alignment of cell content */
  align?: "left" | "right" | "center";
  /** Whether the column is sortable (default false) */
  sortable?: boolean;
  /** Custom cell renderer — receives the row object */
  render?: (row: T) => React.ReactNode;
  /** Value extractor used for default sorting when no render is supplied */
  value?: (row: T) => string | number | null | undefined;
  /** Extra className applied to <td> */
  tdClassName?: string;
  /** Hide on small screens */
  hideOnMobile?: boolean;
};

// ─── Props ───────────────────────────────────────────────────────────────────

type TableProps<T, K extends string = string> = {
  columns: ColumnDef<T, K>[];
  rows: T[];
  /** Unique key extractor per row */
  rowKey: (row: T) => string | number;
  /** Show skeleton rows while loading */
  loading?: boolean;
  /** Message shown when rows is empty and not loading */
  emptyMessage?: string;
  /** Optional className applied to the outer wrapper div */
  className?: string;
  /** Default column to sort by on first render */
  defaultSortKey?: K;
  /** Default sort direction */
  defaultSortDir?: "asc" | "desc";
  /** Callback fired whenever sort changes */
  onSortChange?: (key: K | null, dir: SortDir) => void;
};

// ─── Skeleton row ────────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-border-theme animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <div className="h-3 rounded bg-raised w-3/4 ml-auto" />
        </td>
      ))}
    </tr>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Generic sortable data table that follows the AHM Platform design tokens.
 *
 * @example
 * const cols: ColumnDef<Company>[] = [
 *   { key: "symbol", label: "Symbol", align: "left", sortable: true, value: r => r.symbol },
 *   { key: "price",  label: "Price",  sortable: true, value: r => r.current_price,
 *     render: r => formatPrice(r.current_price) },
 * ];
 * <Table columns={cols} rows={companies} rowKey={r => r.symbol} loading={isLoading} />
 */
export default function Table<T, K extends string = string>({
  columns,
  rows,
  rowKey,
  loading        = false,
  emptyMessage   = "No data",
  className      = "",
  defaultSortKey,
  defaultSortDir = "asc",
  onSortChange,
}: TableProps<T, K>) {
  const [sortKey, setSortKey] = useState<K | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(
    defaultSortKey ? defaultSortDir : null
  );

  function handleSort(key: K) {
    const [nk, nd] = nextSort(sortKey, sortDir, key);
    setSortKey(nk);
    setSortDir(nd);
    onSortChange?.(nk, nd);
  }

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.value) return rows;

    return [...rows].sort((a, b) => {
      const av = col.value!(a) ?? "";
      const bv = col.value!(b) ?? "";
      if (typeof av === "string" && typeof bv === "string")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [rows, sortKey, sortDir, columns]);

  const alignClass: Record<string, string> = {
    left:   "text-left",
    right:  "text-right",
    center: "text-center",
  };

  return (
    <div
      className={[
        "bg-surface border border-border-theme rounded-xl overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <table className="w-full text-sm">
        {/* ── Header ── */}
        <thead>
          <tr className="border-b border-border-theme">
            {columns.map((col) => {
              const isActive = sortKey === col.key;
              const align = alignClass[col.align ?? "right"];

              if (col.sortable) {
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key as K)}
                    className={[
                      "px-5 py-3 text-xs font-mono uppercase tracking-widest select-none cursor-pointer transition-colors",
                      align,
                      isActive ? "text-tx-primary" : "text-tx-disabled hover:text-tx-secondary",
                      col.hideOnMobile ? "hidden md:table-cell" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {col.label}
                    <SortArrow isActive={isActive} dir={sortDir} />
                  </th>
                );
              }

              return (
                <th
                  key={col.key}
                  className={[
                    "px-5 py-3 text-xs font-mono uppercase tracking-widest text-tx-disabled",
                    align,
                    col.hideOnMobile ? "hidden md:table-cell" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {col.label}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center text-tx-disabled text-sm font-mono"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border-theme last:border-0 hover:bg-raised transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      "px-5 py-3",
                      alignClass[col.align ?? "right"],
                      col.hideOnMobile ? "hidden md:table-cell" : "",
                      col.tdClassName ?? "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {col.render
                      ? col.render(row)
                      : col.value
                      ? String(col.value(row) ?? "—")
                      : "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
