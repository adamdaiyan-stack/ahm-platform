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

function SortArrow({ isActive, dir }: { isActive: boolean; dir: SortDir }) {
  if (!isActive)
    return <span className="ml-1 opacity-25 text-tx-disabled">↕</span>;
  return <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>;
}

// ─── Column definition ───────────────────────────────────────────────────────

export type ColumnDef<T, K extends string = string> = {
  /** Unique key — also used as the sort key when sortable */
  key: K;
  /** Header label */
  label: string;
  /** Horizontal alignment (default: right) */
  align?: "left" | "right" | "center";
  /** Whether clicking the header triggers a sort */
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (row: T) => React.ReactNode;
  /** Value extractor used for internal sort (uncontrolled mode only) */
  value?: (row: T) => string | number | null | undefined;
  /** Extra className on <td> */
  tdClassName?: string;
  /** Hide column on mobile */
  hideOnMobile?: boolean;
};

// ─── Props ───────────────────────────────────────────────────────────────────

type TableProps<T, K extends string = string> = {
  columns: ColumnDef<T, K>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  /** className on the outer wrapper div */
  className?: string;
  /** min-width on the inner <table> element — useful for wide horizontal-scroll tables */
  minWidth?: number;

  // ── Uncontrolled sort (Table manages its own sort state) ──
  /** Initial sort column key */
  defaultSortKey?: K;
  /** Initial sort direction (default: "asc") */
  defaultSortDir?: "asc" | "desc";

  // ── Controlled sort (caller owns sort state; rows must arrive pre-sorted) ──
  /**
   * When provided, Table displays sort arrows based on this value and
   * calls onSortChange on header click instead of managing internal state.
   * Rows are NOT re-sorted internally — the caller must pass pre-sorted rows.
   */
  controlledSortKey?: K | null;
  controlledSortDir?: "asc" | "desc" | null;

  /** Fired on every header click (both controlled and uncontrolled modes) */
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
 * Generic sortable data table using AHM Platform design tokens.
 *
 * **Uncontrolled sort** (default): Table manages its own sort state.
 * Pass `defaultSortKey` / `defaultSortDir` for initial order; `value` extractors
 * on columns to enable internal sorting.
 *
 * **Controlled sort**: Pass `controlledSortKey` + `controlledSortDir` + `onSortChange`.
 * Table displays sort arrows based on the controlled values and fires `onSortChange`
 * on header click. Rows are NOT re-sorted internally — pass pre-sorted rows.
 *
 * @example Uncontrolled
 * const cols: ColumnDef<Company>[] = [
 *   { key: "symbol", label: "Symbol", align: "left", sortable: true, value: r => r.symbol },
 *   { key: "price",  label: "Price",  sortable: true, value: r => r.current_price,
 *     render: r => formatPrice(r.current_price) },
 * ];
 * <Table columns={cols} rows={companies} rowKey={r => r.symbol} defaultSortKey="price" defaultSortDir="desc" />
 *
 * @example Controlled (caller manages state + pre-sorts rows)
 * <Table columns={cols} rows={sortedRows} rowKey={r => r.id}
 *   controlledSortKey={sortKey} controlledSortDir={sortDir}
 *   onSortChange={(k, d) => { setSortKey(k); setSortDir(d); }} />
 */
export default function Table<T, K extends string = string>({
  columns,
  rows,
  rowKey,
  loading          = false,
  emptyMessage     = "No data",
  className        = "",
  minWidth,
  defaultSortKey,
  defaultSortDir   = "asc",
  controlledSortKey,
  controlledSortDir,
  onSortChange,
}: TableProps<T, K>) {
  const isControlled = controlledSortKey !== undefined;

  // ── Internal sort state (uncontrolled mode only) ──
  const [internalSortKey, setInternalSortKey] = useState<K | null>(defaultSortKey ?? null);
  const [internalSortDir, setInternalSortDir] = useState<SortDir>(
    defaultSortKey ? defaultSortDir : null
  );

  // Active sort values (controlled takes precedence)
  const activeSortKey = isControlled ? controlledSortKey ?? null : internalSortKey;
  const activeSortDir = isControlled ? controlledSortDir ?? null : internalSortDir;

  function handleSort(key: K) {
    if (isControlled) {
      // In controlled mode: fire callback, don't touch internal state
      // Use a 2-click toggle (asc → desc → asc) matching most screener UX
      const nextDir: "asc" | "desc" =
        activeSortKey === key && activeSortDir === "asc" ? "desc" : "asc";
      onSortChange?.(key, nextDir);
    } else {
      // In uncontrolled mode: 3-click cycle with reset
      const [nk, nd] = nextSort(internalSortKey, internalSortDir, key);
      setInternalSortKey(nk);
      setInternalSortDir(nd);
      onSortChange?.(nk, nd);
    }
  }

  // ── Internal sort (uncontrolled mode only; controlled mode passes pre-sorted rows) ──
  const displayRows = useMemo(() => {
    if (isControlled) return rows; // caller pre-sorts
    if (!activeSortKey || !activeSortDir) return rows;
    const col = columns.find((c) => c.key === activeSortKey);
    if (!col?.value) return rows;
    return [...rows].sort((a, b) => {
      const av = col.value!(a) ?? "";
      const bv = col.value!(b) ?? "";
      if (typeof av === "string" && typeof bv === "string")
        return activeSortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return activeSortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [rows, activeSortKey, activeSortDir, columns, isControlled]);

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
      <div className={minWidth ? "overflow-x-auto" : undefined}>
        <table
          className="w-full text-sm"
          style={minWidth ? { minWidth } : undefined}
        >
          {/* ── Header ── */}
          <thead>
            <tr className="border-b border-border-theme">
              {columns.map((col) => {
                const isActive = activeSortKey === col.key;
                const align = alignClass[col.align ?? "right"];

                if (col.sortable) {
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key as K)}
                      className={[
                        "px-5 py-3 text-xs font-mono uppercase tracking-widest select-none cursor-pointer transition-colors whitespace-nowrap",
                        align,
                        isActive ? "text-tx-primary" : "text-tx-disabled hover:text-tx-secondary",
                        col.hideOnMobile ? "hidden md:table-cell" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {col.label}
                      <SortArrow isActive={isActive} dir={activeSortDir} />
                    </th>
                  );
                }

                return (
                  <th
                    key={col.key}
                    className={[
                      "px-5 py-3 text-xs font-mono uppercase tracking-widest text-tx-disabled whitespace-nowrap",
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
            ) : displayRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-tx-disabled text-sm font-mono"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayRows.map((row) => (
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
    </div>
  );
}
