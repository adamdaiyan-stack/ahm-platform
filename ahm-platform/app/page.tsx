import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatPercent, formatVolume, formatMarketCap, formatPrice } from "@/lib/formatters";

// PSX hours: Mon–Fri 09:30–15:30 PKT (UTC+5)
function getMarketStatus() {
  const pkt = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
  const day = pkt.getDay();
  const mins = pkt.getHours() * 60 + pkt.getMinutes();
  if (day === 0 || day === 6) return { label: "Closed — Weekend", open: false, pre: false };
  if (mins >= 570 && mins < 585) return { label: "Pre-Market", open: false, pre: true };
  if (mins >= 585 && mins < 930) return { label: "Market Open", open: true, pre: false };
  return { label: "Market Closed", open: false, pre: false };
}

const MODULES = [
  { href: "/market",  accent: "violet", title: "Market Dashboard",    desc: "KSE-100 index, top gainers, losers, most active, and sector heatmap." },
  { href: "/stocks",  accent: "emerald", title: "Stock Screener",     desc: "Browse all listed companies — price, P/E, dividend yield, volume." },
  { href: "/sectors", accent: "blue",   title: "Sector Intelligence", desc: "Deep-dive modules for Banking, Oil & Gas, Power, Cement, and more." },
  { href: "/research",accent: "amber",  title: "Research",            desc: "Equity notes, macro outlook, sector reports, and earnings calendar." },
  { href: "/learn",   accent: "gray",   title: "Learn",               desc: "PSX basics, financial statements, valuation, and sector analysis." },
];

const ACCENT: Record<string, { bar: string; text: string; border: string; glow: string }> = {
  violet: { bar: "bg-violet-500", text: "text-violet-400", border: "hover:border-violet-500/30", glow: "group-hover:text-violet-400" },
  emerald:{ bar: "bg-emerald-500",text: "text-emerald-400",border: "hover:border-emerald-500/30",glow: "group-hover:text-emerald-400"},
  blue:   { bar: "bg-blue-500",   text: "text-blue-400",   border: "hover:border-blue-500/30",   glow: "group-hover:text-blue-400"  },
  amber:  { bar: "bg-amber-500",  text: "text-amber-400",  border: "hover:border-amber-500/30",  glow: "group-hover:text-amber-400" },
  gray:   { bar: "bg-gray-500",   text: "text-gray-400",   border: "hover:border-gray-600/30",   glow: "group-hover:text-gray-300"  },
};

export default async function Home() {
  const status = getMarketStatus();

  const [
    { data: idx },
    { data: gainers },
    { data: losers },
  ] = await Promise.all([
    supabase.from("market_index").select("*").eq("index_name", "KSE-100").single(),
    supabase.from("companies")
      .select("id, symbol, company_name, sector, current_price, change_percent")
      .not("change_percent", "is", null)
      .order("change_percent", { ascending: false })
      .limit(4),
    supabase.from("companies")
      .select("id, symbol, company_name, sector, current_price, change_percent")
      .not("change_percent", "is", null)
      .order("change_percent", { ascending: true })
      .limit(4),
  ]);

  const level = idx?.level != null ? Number(idx.level) : null;
  const chg = idx?.change != null ? Number(idx.change) : null;
  const chgPct = idx?.change_percent != null ? Number(idx.change_percent) : null;
  const isUp = chg != null && chg >= 0;
  const idxColor = chg == null ? "text-white" : isUp ? "text-emerald-400" : "text-red-400";

  return (
    <main className="flex-1 bg-black text-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div className="border-b border-gray-800 px-8 pt-14 pb-12">
        <div className="max-w-6xl mx-auto">

          {/* Top row: label + status */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
              Pakistan Stock Exchange · KSE-100
            </p>
            <span className={`text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-widest ${
              status.open
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : status.pre
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-gray-900 text-gray-600 border-gray-800"
            }`}>
              {status.open ? "● " : "○ "}{status.label}
            </span>
          </div>

          {/* Index number */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
            <div>
              <p className={`text-6xl md:text-7xl font-bold tabular-nums tracking-tight ${idxColor}`}>
                {level != null
                  ? level.toLocaleString("en-PK", { minimumFractionDigits: 2 })
                  : "—"}
              </p>
              {chg != null && (
                <p className={`text-lg font-semibold tabular-nums mt-2 ${idxColor}`}>
                  {isUp ? "▲" : "▼"}{" "}
                  {Math.abs(chg).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  {" "}({formatPercent(chgPct)})
                </p>
              )}
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-3 md:ml-10 md:mb-1">
              <StatPill label="Volume"    value={idx?.volume    != null ? formatVolume(idx.volume)       : "—"} />
              <StatPill label="Advances"  value={idx?.advances  != null ? String(idx.advances)           : "—"} positive />
              <StatPill label="Declines"  value={idx?.declines  != null ? String(idx.declines)           : "—"} negative />
              <StatPill label="Unchanged" value={idx?.unchanged != null ? String(idx.unchanged)          : "—"} />
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/market"
              className="text-xs font-mono px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors font-bold uppercase tracking-widest"
            >
              Full Dashboard →
            </Link>
            <Link
              href="/stocks"
              className="text-xs font-mono px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              Stock Screener
            </Link>
          </div>
        </div>
      </div>

      {/* ── MOVERS ────────────────────────────────────────────── */}
      {((gainers && gainers.length > 0) || (losers && losers.length > 0)) && (
        <div className="border-b border-gray-800 px-8 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Gainers */}
            <div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">Top Gainers</p>
              <div className="space-y-1">
                {(gainers ?? []).map((row) => (
                  <Link
                    key={row.id}
                    href={`/stocks/${row.symbol}`}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-gray-950 transition-colors group"
                  >
                    <div>
                      <span className="font-mono font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {row.symbol}
                      </span>
                      <span className="text-gray-600 text-xs font-mono ml-2">{row.sector}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-mono text-sm font-semibold tabular-nums">
                        {formatPercent(row.change_percent)}
                      </span>
                      <span className="text-gray-600 text-xs font-mono ml-3 tabular-nums">
                        {formatPrice(row.current_price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Losers */}
            <div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">Top Losers</p>
              <div className="space-y-1">
                {(losers ?? []).map((row) => (
                  <Link
                    key={row.id}
                    href={`/stocks/${row.symbol}`}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-gray-950 transition-colors group"
                  >
                    <div>
                      <span className="font-mono font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                        {row.symbol}
                      </span>
                      <span className="text-gray-600 text-xs font-mono ml-2">{row.sector}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-red-400 font-mono text-sm font-semibold tabular-nums">
                        {formatPercent(row.change_percent)}
                      </span>
                      <span className="text-gray-600 text-xs font-mono ml-3 tabular-nums">
                        {formatPrice(row.current_price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── MODULE CARDS ──────────────────────────────────────── */}
      <div className="px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono text-gray-700 uppercase tracking-widest mb-5">Platform Modules</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m) => {
              const a = ACCENT[m.accent];
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className={`group bg-gray-950 border border-gray-800 rounded-xl p-6 ${a.border} hover:bg-gray-900/60 transition-all`}
                >
                  <div className={`w-6 h-0.5 ${a.bar} mb-4`} />
                  <h2 className={`text-base font-bold text-white mb-2 ${a.glow} transition-colors`}>
                    {m.title}
                  </h2>
                  <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
                  <p className={`${a.text} text-xs font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Open &rarr;
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FEATURED RESEARCH ─────────────────────────────────── */}
      <div className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono text-gray-700 uppercase tracking-widest mb-4">Latest Research</p>
          <Link
            href="/research/hubc"
            className="group flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl px-6 py-5 hover:border-amber-500/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 uppercase tracking-widest">
                BUY
              </span>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  Hub Power Company (HUBC)
                </p>
                <p className="text-xs text-gray-600 font-mono mt-0.5">
                  Power / IPP · May 2025 · AHM Research Desk
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">Target</p>
              <p className="text-base font-bold text-emerald-400 tabular-nums">PKR 182</p>
            </div>
          </Link>
        </div>
      </div>

    </main>
  );
}

function StatPill({ label, value, positive, negative }: {
  label: string; value: string; positive?: boolean; negative?: boolean;
}) {
  const color = positive ? "text-emerald-400" : negative ? "text-red-400" : "text-gray-400";
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 min-w-24">
      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-sm font-bold tabular-nums font-mono ${color}`}>{value}</p>
    </div>
  );
}
