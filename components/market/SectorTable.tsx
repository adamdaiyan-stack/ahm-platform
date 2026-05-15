// components/market/SectorTable.tsx
import Link from "next/link";
import Table, { type ColumnDef } from "@/components/ui/Table";
import { formatMarketCap } from "@/lib/formatters";

export type SectorRow = {
  sector: string;
  avgChange: number | null;
  totalMarketCap: number;
  count: number;
};

const POS_BG = "rgba(21,128,61,0.12)";
const NEG_BG = "rgba(185,28,28,0.12)";

const COLUMNS: ColumnDef<SectorRow>[] = [
  {
    key:      "sector",
    label:    "Sector",
    align:    "left",
    sortable: true,
    value:    (r) => r.sector,
    render:   (r) => (
      <span className="font-medium text-tx-primary">{r.sector}</span>
    ),
  },
  {
    key:      "avgChange",
    label:    "Avg Chg %",
    sortable: true,
    value:    (r) => r.avgChange ?? -Infinity,
    render:   (r) => {
      const isPos = r.avgChange != null && r.avgChange > 0;
      const isNeg = r.avgChange != null && r.avgChange < 0;
      const color = r.avgChange == null ? "text-tx-disabled"
        : isPos ? "text-gain" : "text-loss";
      const bg = isPos ? POS_BG : isNeg ? NEG_BG : undefined;
      return (
        <span
          className={"block text-right font-mono text-sm tabular-nums font-semibold " + color}
          style={bg ? { backgroundColor: bg, margin: "-0.75rem -1.25rem", padding: "0.75rem 1.25rem" } : undefined}
        >
          {r.avgChange != null
            ? (r.avgChange >= 0 ? "+" : "") + r.avgChange.toFixed(2) + "%"
            : "—"}
        </span>
      );
    },
  },
  {
    key:      "count",
    label:    "Stocks",
    sortable: true,
    value:    (r) => r.count,
    render:   (r) => (
      <span className="text-tx-secondary font-mono text-sm tabular-nums">{r.count}</span>
    ),
  },
  {
    key:      "totalMarketCap",
    label:    "Market Cap",
    sortable: true,
    value:    (r) => r.totalMarketCap,
    render:   (r) => (
      <span className="text-tx-secondary font-mono text-sm tabular-nums">
        {r.totalMarketCap > 0 ? formatMarketCap(r.totalMarketCap) : "—"}
      </span>
    ),
    hideOnMobile: false,
  },
  {
    key:    "action",
    label:  "Action",
    render: (r) => (
      <Link
        href={"/stocks?sector=" + encodeURIComponent(r.sector)}
        className="text-xs font-mono text-tx-disabled hover:text-tx-primary transition-colors"
      >
        View →
      </Link>
    ),
    hideOnMobile: true,
  },
];

export default function SectorTable({ sectors }: { sectors: SectorRow[] }) {
  return (
    <Table<SectorRow>
      columns={COLUMNS}
      rows={sectors}
      rowKey={(r) => r.sector}
      defaultSortKey="totalMarketCap"
      defaultSortDir="desc"
      emptyMessage="No sector data"
    />
  );
}
