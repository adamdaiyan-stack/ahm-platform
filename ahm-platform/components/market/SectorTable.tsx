"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { formatMarketCap } from "@/lib/formatters";

export type SectorRow = {
  sector: string;
  avgChange: number | null;
  totalMarketCap: number;
  count: number;
};

type SortCol = "sector" | "avgChange" | "count" | "totalMarketCap" | null;
type SortDir = "asc" | "desc" | null;

/** 3-click cycle per column: none → asc → desc → reset to none */
function nextSort(
  col: SortCol,
  dir: SortDir,
  clicked: NonNullable<SortCol>
): [SortCol, SortDir] {
  if (col !== clicked) return [clicked, "asc"];   // new column → ascending
  if (dir === "asc")   return [clicked, "desc"];  // same column → descending
  return [null, null];                             // third click  → reset
}

const POS_BG = "rgba(21,128,61,0.12)";   // #15803D @ 12%
const NEG_BG = "rgba(185,28,28,0.12)";   // #B91C1C @ 12%

function SortArrow({
  col,
  activeCol,
  dir,
}: {
  col: NonNullable<SortCol>;
  activeCol: SortCol;
  dir: SortDir;
}) {
  if (activeCol !== col)
    return <span className="ml-1 opacity-25 text-tx-disabled">↕</span>;
  return (
    <span className="ml-1" style={{ color: "inherit" }}>
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );
}

export default function SectorTable({ sectors }: { sectors: SectorRow[] }) {
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function handleSort(col: NonNullable<SortCol>) {
    const [c, d] = nextSort(sortCol, sortDir, col);
    setSortCol(c);
    setSortDir(d);
  }

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return sectors; // default order (server-side market-cap sort)
    return [...sectors].sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      switch (sortCol) {
        case "sector":         av = a.sector;                       bv = b.sector;                       break;
        case "avgChange":      av = a.avgChange ?? -Infinity;       bv = b.avgChange ?? -Infinity;       break;
        case "count":          av = a.count;                        bv = b.count;                        break;
        case "totalMarketCap": av = a.totalMarketCap;               bv = b.totalMarketCap;               break;
        default:               return 0;
      }
      if (typeof av === "string" && typeof bv === "string")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [sectors, sortCol, sortDir]);

  const TH = ({
    col,
    children,
    align = "right",
  }: {
    col: NonNullable<SortCol>;
    children: React.ReactNode;
    align?: "left" | "right";
  }) => (
    <th
      onClick={() => handleSort(col)}
      className={`px-5 py-3 text-xs font-mono uppercase tracking-widest select-none
        cursor-pointer transition-colors
        ${sortCol === col ? "text-tx-primary" : "text-tx-disabled hover:text-tx-secondary"}
        ${align === "left" ? "text-left" : "text-right"}`}
    >
      {children}
      <SortArrow col={col} activeCol={sortCol} dir={sortDir} />
    </th>
  );

  return (
    <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-theme">
            <TH col="sector" align="left">Sector</TH>
            <TH col="avgChange">Avg Chg %</TH>
            <TH col="count">Stocks</TH>
            <TH col="totalMarketCap">Market Cap</TH>
            <th className="px-5 py-3 text-right text-xs font-mono text-tx-disabled uppercase tracking-widest hidden md:table-cell">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => {
            const isPos = s.avgChange != null && s.avgChange > 0;
            const isNeg = s.avgChange != null && s.avgChange < 0;
            const chgColor = s.avgChange == null
              ? "text-tx-disabled"
              : isPos ? "text-gain" : "text-loss";
            const chgBg = isPos ? POS_BG : isNeg ? NEG_BG : undefined;

            return (
              <tr
                key={s.sector}
                className="border-b border-border-theme last:border-0 hover:bg-raised transition-colors"
              >
                <td className="px-5 py-3 font-medium text-tx-primary">{s.sector}</td>

                {/* Avg Chg % — color-tinted background */}
                <td
                  className={"px-5 py-3 text-right font-mono text-sm tabular-nums font-semibold " + chgColor}
                  style={chgBg ? { backgroundColor: chgBg } : undefined}
                >
                  {s.avgChange != null
                    ? (s.avgChange >= 0 ? "+" : "") + s.avgChange.toFixed(2) + "%"
                    : "—"}
                </td>

                <td className="px-5 py-3 text-right text-tx-secondary font-mono text-sm tabular-nums">
                  {s.count}
                </td>
                <td className="px-5 py-3 text-right text-tx-secondary font-mono text-sm tabular-nums">
                  {s.totalMarketCap > 0 ? formatMarketCap(s.totalMarketCap) : "—"}
                </td>
                <td className="px-5 py-3 text-right hidden md:table-cell">
                  <Link
                    href={"/stocks?sector=" + encodeURIComponent(s.sector)}
                    className="text-xs font-mono text-tx-disabled hover:text-tx-primary transition-colors"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
