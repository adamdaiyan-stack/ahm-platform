import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  formatPrice,
  formatPercent,
  formatVolume,
  formatMarketCap,
} from "@/lib/formatters";

// ── Market status (PSX: Mon–Fri 09:30–15:30 PKT = UTC+5) ──────
function getMarketStatus(): { label: string; open: boolean; pre: boolean } {
  const now = new Date();
  const pkt = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
  const day = pkt.getDay(); // 0=Sun, 6=Sat
  const h = pkt.getHours();
  const m = pkt.getMinutes();
  const mins = h * 60 + m;

  if (day === 0 || day === 6) return { label: "Closed — Weekend", open: false, pre: false };
  if (mins >= 9 * 60 && mins < 9 * 60 + 30) return { label: "Pre-Market", open: false, pre: true };
  if (mins >= 9 * 60 + 30 && mins < 15 * 60 + 30) return { label: "Market Open", open: true, pre: false };
  return { label: "Market Closed", open: false, pre: false };
}

function fmtUpdated(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }) + " PKT";
}

export default async function MarketPage() {
  const status = getMarketStatus();

  const [
    { data: index },
    { data: gainers },
    { data: losers },
    { data: active },
    { data: sectorRaw },
  ] = await Promise.all([
    supabase
      .from("market_index")
      .select("*")
      .eq("index_name", "KSE-100")
      .single(),

    supabase
      .from("companies")
      .select("id, symbol, company_name, sector, current_price, change_percent, market_cap")
      .not("change_percent", "is", null)
      .order("change_percent", { ascending: false })
      .limit(5),

    supabase
      .from("companies")
      .select("id, symbol, company_name, sector, current_price, change_percent, market_cap")
      .not("change_percent", "is", null)
      .order("change_percent", { ascending: true })
      .limit(5),

    supabase
      .from("companies")
      .select("id, symbol, company_name, sector, current_price, change_percent, volume")
      .not("volume", "is", null)
      .order("volume", { ascending: false })
      .limit(5),

    supabase
      .from("companies")
      .select("sector, change_percent, market_cap"),
  ]);

  // Aggregate sector performance client-side
  type SectorStat = {
    sector: string;
    avgChange: number | null;
    totalMarketCap: number;
    count: number;
    withChange: number;
  };

  const sectorMap: Record<string, SectorStat> = {};
  for (const row of sectorRaw ?? []) {
    if (!sectorMap[row.sector]) {
      sectorMap[row.sector] = {
        sector: row.sector,
        avgChange: null,
        totalMarketCap: 0,
        count: 0,
        withChange: 0,
      };
    }
    const s = sectorMap[row.sector];
    s.count += 1;
    if (row.market_cap) s.totalMarketCap += Number(row.market_cap);
    if (row.change_percent != null) {
      s.avgChange = (s.avgChange ?? 0) + Number(row.change_percent);
      s.withChange += 1;
    }
  }

  const sectors = Object.values(sectorMap)
    .map((s) => ({
      ...s,
      avgChange:
        s.withChange > 0 && s.avgChange != null
          ? s.avgChange / s.withChange
          : null,
    }))
    .sort((a, b) => (b.totalMarketCap ?? 0) - (a.totalMarketCap ?? 0));

  const idx = index as {
    level: number | null;
    change: number | null;
    change_percent: number | null;
    volume: number | null;
    advances: number | null;
    declines: number | null;
    unchanged: number | null;
    updated_at: string;
  } | null;

  const idxPositive = idx?.change != null && idx.change >= 0;
  const idxColor = idx?.change == null ? "text-white" : idxPositive ? "text-emerald-400" : "text-red-400";
  const idxPill = idx?.change == null
    ? "bg-gray-800 text-gray-400 border border-gray-700"
    : idxPositive
    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
    : "bg-red-500/15 text-red-400 border border-red-500/30";

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── HERO: KSE-100 ──────────────────────────────────── */}
      <div className="px-8 pt-10 pb-8 border-b border-gray-800">
        <div className="max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-2">
              Pakistan Stock Exchange
            </p>
            <h1 className="text-4xl font-bold text-white mb-1">Market Dashboard</h1>
            <p className="text-gray-500 text-sm">
              KSE-100 Index · Real-time overview
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {/* Market status badge */}
            <span className={`text-xs font-mono px-3 py-1.5 rounded-full border uppercase tracking-widest ${
              status.open
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : status.pre
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-gray-800 text-gray-500 border-gray-700"
            }`}>
              {status.open ? "● " : "○ "}{status.label}
            </span>

            {/* KSE-100 level */}
            <div className="flex items-end gap-3">
              <p className={`text-5xl font-bold tabular-nums ${idxColor}`}>
                {idx?.level != null ? Number(idx.level).toLocaleString("en-PK", { minimumFractionDigits: 2 }) : "—"}
              </p>
              {idx?.change != null && (
                <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg tabular-nums border mb-1 ${idxPill}`}>
                  {idxPositive ? "▲" : "▼"} {Math.abs(Number(idx.change)).toLocaleString("en-PK", { minimumFractionDigits: 2 })} ({formatPercent(idx.change_percent)})
                </span>
              )}
            </div>

            <p className="text-xs text-gray-700 font-mono">
              Last updated: {fmtUpdated(idx?.updated_at ?? null)}
            </p>
          </div>
        </div>
      </div>

      {/* ── BREADCRUMB STATS ───────────────────────────────── */}
      <div className="px-8 py-5 border-b border-gray-800">
        <div className="max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-3">
          <IndexStat label="Total Volume"   value={idx?.volume != null ? formatVolume(idx.volume) : "—"} />
          <IndexStat label="Advances"        value={idx?.advances != null ? String(idx.advances) : "—"} positive />
          <IndexStat label="Declines"        value={idx?.declines != null ? String(idx.declines) : "—"} negative />
          <IndexStat label="Unchanged"       value={idx?.unchanged != null ? String(idx.unchanged) : "—"} />
        </div>
      </div>

      {/* ── THREE MOVERS COLUMNS ───────────────────────────── */}
      <div className="px-8 py-8 border-b border-gray-800">
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TOP GAINERS */}
          <div>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">
              Top Gainers
            </p>
            <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
              {gainers && gainers.length > 0 ? (
                <MoverList rows={gainers} positive />
              ) : (
                <EmptyMover label="No price data yet" />
              )}
            </div>
          </div>

          {/* TOP LOSERS */}
          <div>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">
              Top Losers
            </p>
            <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
              {losers && losers.length > 0 ? (
                <MoverList rows={losers} positive={false} />
              ) : (
                <EmptyMover label="No price data yet" />
              )}
            </div>
          </div>

          {/* MOST ACTIVE */}
          <div>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">
              Most Active
            </p>
            <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
              {active && active.length > 0 ? (
                <div className="divide-y divide-gray-900">
                  {active.map((row) => (
                    <div key={row.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-900 transition-colors">
                      <div>
                        <Link href={`/stocks/${row.symbol}`} className="font-mono font-bold text-white hover:text-emerald-400 transition-colors text-sm">
                          {row.symbol}
                        </Link>
                        <p className="text-xs text-gray-600 truncate max-w-28">{row.company_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-white tabular-nums">{formatPrice(row.current_price)}</p>
                        <p className="text-xs text-gray-500 font-mono tabular-nums">{formatVolume(row.volume)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyMover label="No volume data yet" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTOR PERFORMANCE ─────────────────────────────── */}
      <div className="px-8 py-8">
        <div className="max-w-6xl">
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">
            Sector Performance
          </p>
          <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-left text-xs font-mono text-gray-600 uppercase tracking-widest">Sector</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest">Avg Chg %</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest">Stocks</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest">Market Cap</th>
                  <th className="px-5 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest hidden md:table-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((s) => {
                  const pos = s.avgChange != null && s.avgChange >= 0;
                  const chgColor = s.avgChange == null ? "text-gray-600" : pos ? "text-emerald-400" : "text-red-400";
                  return (
                    <tr key={s.sector} className="border-b border-gray-900 hover:bg-gray-900 transition-colors">
                      <td className="px-5 py-3 font-medium text-white">{s.sector}</td>
                      <td className={`px-5 py-3 text-right font-mono text-sm tabular-nums ${chgColor}`}>
                        {s.avgChange != null ? `${s.avgChange >= 0 ? "+" : ""}${s.avgChange.toFixed(2)}%` : "—"}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-400 font-mono text-sm tabular-nums">{s.count}</td>
                      <td className="px-5 py-3 text-right text-gray-400 font-mono text-sm tabular-nums">
                        {s.totalMarketCap > 0 ? formatMarketCap(s.totalMarketCap) : "—"}
                      </td>
                      <td className="px-5 py-3 text-right hidden md:table-cell">
                        <Link
                          href={`/stocks?sector=${encodeURIComponent(s.sector)}`}
                          className="text-xs font-mono text-gray-600 hover:text-white transition-colors"
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
        </div>
      </div>
    </main>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────

function IndexStat({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  const color = positive ? "text-emerald-400" : negative ? "text-red-400" : "text-white";
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3">
      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

type MoverRow = {
  id: number;
  symbol: string;
  company_name: string;
  sector: string;
  current_price: number | null;
  change_percent: number | null;
  market_cap?: number | null;
};

function MoverList({ rows, positive }: { rows: MoverRow[]; positive: boolean }) {
  return (
    <div className="divide-y divide-gray-900">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-900 transition-colors">
          <div>
            <Link
              href={`/stocks/${row.symbol}`}
              className="font-mono font-bold text-white hover:text-emerald-400 transition-colors text-sm"
            >
              {row.symbol}
            </Link>
            <p className="text-xs text-gray-600 truncate max-w-28">{row.company_name}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm text-white tabular-nums">
              {formatPrice(row.current_price)}
            </p>
            <p className={`text-xs font-semibold font-mono tabular-nums ${positive ? "text-emerald-400" : "text-red-400"}`}>
              {formatPercent(row.change_percent)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyMover({ label }: { label: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-gray-700 text-xs font-mono">{label}</p>
    </div>
  );
}
