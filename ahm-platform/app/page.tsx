import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatPercent, formatVolume, formatPrice } from "@/lib/formatters";

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
  { href: "/market",   accent: "violet",  title: "Market Dashboard",    desc: "KSE-100 index, top gainers, losers, most active, and sector heatmap." },
  { href: "/stocks",   accent: "emerald", title: "Stock Screener",      desc: "Browse all listed companies — price, P/E, dividend yield, volume." },
  { href: "/sectors",  accent: "blue",    title: "Sector Intelligence", desc: "Deep-dive modules for Banking, Oil & Gas, Power, Cement, and more." },
  { href: "/research", accent: "amber",   title: "Research",            desc: "Equity notes, macro outlook, sector reports, and earnings calendar." },
  { href: "/learn",    accent: "gray",    title: "Learn",               desc: "PSX basics, financial statements, valuation, and sector analysis." },
];

const ACCENT: Record<string, { bar: string; text: string; border: string; glow: string }> = {
  violet:  { bar: "bg-violet-500",  text: "text-violet-500",  border: "hover:border-violet-500/30",  glow: "group-hover:text-violet-500"  },
  emerald: { bar: "bg-emerald-500", text: "text-emerald-500", border: "hover:border-emerald-500/30", glow: "group-hover:text-emerald-500" },
  blue:    { bar: "bg-blue-500",    text: "text-blue-500",    border: "hover:border-blue-500/30",    glow: "group-hover:text-blue-500"    },
  amber:   { bar: "bg-amber-500",   text: "text-amber-500",   border: "hover:border-amber-500/30",   glow: "group-hover:text-amber-500"   },
  gray:    { bar: "bg-tx-secondary",text: "text-tx-secondary",border: "hover:border-border-theme",   glow: "group-hover:text-tx-primary"  },
};

const WA_LINK = "https://wa.me/923001234567?text=Hi%2C%20I%27d%20like%20to%20get%20daily%20PSX%20updates%20on%20WhatsApp";

export default async function Home() {
  const status = getMarketStatus();

  const [{ data: idx }, { data: gainers }, { data: losers }] = await Promise.all([
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

  const level  = idx?.level          != null ? Number(idx.level)          : null;
  const chg    = idx?.change         != null ? Number(idx.change)         : null;
  const chgPct = idx?.change_percent != null ? Number(idx.change_percent) : null;
  const isUp   = chg != null && chg >= 0;
  const idxColor = chg == null ? "text-tx-primary" : isUp ? "text-gain" : "text-loss";

  return (
    <main className="flex-1 bg-base text-tx-primary">

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="border-b border-border-theme px-8 pt-14 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">
              Pakistan Stock Exchange · KSE-100
            </p>
            <span className={`text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-widest ${
              status.open ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
              : status.pre ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
              : "bg-surface text-tx-disabled border-border-theme"
            }`}>
              {status.open ? "● " : "○ "}{status.label}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
            <div>
              <p className={"text-6xl md:text-7xl font-bold tabular-nums tracking-tight " + idxColor}>
                {level != null ? level.toLocaleString("en-PK", { minimumFractionDigits: 2 }) : "—"}
              </p>
              {chg != null && (
                <p className={"text-lg font-semibold tabular-nums mt-2 " + idxColor}>
                  {isUp ? "▲" : "▼"}{" "}
                  {Math.abs(chg).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  {" "}({formatPercent(chgPct)})
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 md:ml-10 md:mb-1">
              <StatPill label="Volume"    value={idx?.volume    != null ? formatVolume(idx.volume)  : "—"} />
              <StatPill label="Advances"  value={idx?.advances  != null ? String(idx.advances)      : "—"} positive />
              <StatPill label="Declines"  value={idx?.declines  != null ? String(idx.declines)      : "—"} negative />
              <StatPill label="Unchanged" value={idx?.unchanged != null ? String(idx.unchanged)     : "—"} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/market" className="text-xs font-mono px-4 py-2 rounded-lg bg-tx-primary text-base hover:opacity-90 transition-opacity font-bold uppercase tracking-widest">
              Full Dashboard →
            </Link>
            <Link href="/stocks" className="text-xs font-mono px-4 py-2 rounded-lg border border-border-theme text-tx-secondary hover:border-tx-secondary hover:text-tx-primary transition-colors uppercase tracking-widest">
              Stock Screener
            </Link>
          </div>
        </div>
      </div>

      {/* ── WHATSAPP CAPTURE ──────────────────────────────── */}
      <div className="border-b border-border-theme bg-emerald-500/5 px-8 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-tx-primary">Get daily PSX updates on WhatsApp</p>
            <p className="text-xs text-tx-secondary mt-0.5">Pre-market briefing · Top movers · AHM picks — every trading day at 9 AM</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono font-bold px-4 py-2.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors uppercase tracking-widest">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.863L.057 23.886a.5.5 0 0 0 .609.61l6.101-1.526A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.511-5.188-1.402l-.373-.22-3.87.968.999-3.793-.242-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Join WhatsApp
            </a>
            <Link href="/open-account" className="text-xs font-mono px-4 py-2.5 rounded-lg border border-border-theme text-tx-secondary hover:border-tx-secondary hover:text-tx-primary transition-colors uppercase tracking-widest">
              Open Account
            </Link>
          </div>
        </div>
      </div>

      {/* ── MOVERS ────────────────────────────────────────── */}
      {((gainers && gainers.length > 0) || (losers && losers.length > 0)) && (
        <div className="border-b border-border-theme px-8 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">Top Gainers</p>
              <div className="space-y-1">
                {(gainers ?? []).map((row) => (
                  <Link key={row.id} href={"/stocks/" + row.symbol}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-surface transition-colors group">
                    <div>
                      <span className="font-mono font-bold text-tx-primary text-sm group-hover:text-gain transition-colors">{row.symbol}</span>
                      <span className="text-tx-disabled text-xs font-mono ml-2">{row.sector}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gain font-mono text-sm font-semibold tabular-nums">{formatPercent(row.change_percent)}</span>
                      <span className="text-tx-disabled text-xs font-mono ml-3 tabular-nums">{formatPrice(row.current_price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">Top Losers</p>
              <div className="space-y-1">
                {(losers ?? []).map((row) => (
                  <Link key={row.id} href={"/stocks/" + row.symbol}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-surface transition-colors group">
                    <div>
                      <span className="font-mono font-bold text-tx-primary text-sm group-hover:text-loss transition-colors">{row.symbol}</span>
                      <span className="text-tx-disabled text-xs font-mono ml-2">{row.sector}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-loss font-mono text-sm font-semibold tabular-nums">{formatPercent(row.change_percent)}</span>
                      <span className="text-tx-disabled text-xs font-mono ml-3 tabular-nums">{formatPrice(row.current_price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE CARDS ──────────────────────────────────── */}
      <div className="px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-5">Platform Modules</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m) => {
              const a = ACCENT[m.accent];
              return (
                <Link key={m.href} href={m.href}
                  className={"group bg-surface border border-border-theme rounded-xl p-6 " + a.border + " hover:bg-raised transition-all"}>
                  <div className={"w-6 h-0.5 " + a.bar + " mb-4"} />
                  <h2 className={"text-base font-bold text-tx-primary mb-2 " + a.glow + " transition-colors"}>{m.title}</h2>
                  <p className="text-tx-secondary text-xs leading-relaxed">{m.desc}</p>
                  <p className={"" + a.text + " text-xs font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity"}>Open &rarr;</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FEATURED RESEARCH ─────────────────────────────── */}
      <div className="px-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">Latest Research</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/research/ubl"
              className="group flex items-center justify-between bg-surface border border-border-theme rounded-xl px-6 py-5 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border bg-emerald-500/10 text-emerald-500 border-emerald-500/30 uppercase tracking-widest">BUY</span>
                <div>
                  <p className="text-sm font-bold text-tx-primary group-hover:text-emerald-500 transition-colors">United Bank Limited (UBL)</p>
                  <p className="text-xs text-tx-disabled font-mono mt-0.5">Banking · May 2026 · AHM Research</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">Target</p>
                <p className="text-base font-bold text-gain tabular-nums">PKR 310</p>
              </div>
            </Link>
            <Link href="/research/hubc"
              className="group flex items-center justify-between bg-surface border border-border-theme rounded-xl px-6 py-5 hover:border-amber-500/20 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border bg-emerald-500/10 text-emerald-500 border-emerald-500/30 uppercase tracking-widest">BUY</span>
                <div>
                  <p className="text-sm font-bold text-tx-primary group-hover:text-amber-500 transition-colors">Hub Power Company (HUBC)</p>
                  <p className="text-xs text-tx-disabled font-mono mt-0.5">Power / IPP · May 2025 · AHM Research</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest">Target</p>
                <p className="text-base font-bold text-gain tabular-nums">PKR 182</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA STRIP ──────────────────────────────── */}
      <div className="px-8 py-10 border-t border-border-theme">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
          <Link href="/open-account"
            className="flex-1 group bg-surface border border-border-theme hover:border-emerald-500/30 rounded-xl p-6 transition-all">
            <p className="text-xs font-mono text-emerald-500/70 uppercase tracking-widest mb-2">Brokerage</p>
            <h3 className="text-tx-primary font-bold text-base mb-1 group-hover:text-emerald-500 transition-colors">Open a PSX Account →</h3>
            <p className="text-tx-disabled text-xs">Start investing in KSE-100 stocks. Account ready in 48 hours.</p>
          </Link>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="flex-1 group bg-surface border border-border-theme hover:border-emerald-500/30 rounded-xl p-6 transition-all">
            <p className="text-xs font-mono text-emerald-500/70 uppercase tracking-widest mb-2">Daily Briefing</p>
            <h3 className="text-tx-primary font-bold text-base mb-1 group-hover:text-emerald-500 transition-colors">Join WhatsApp Group →</h3>
            <p className="text-tx-disabled text-xs">Pre-market briefing every trading day at 9 AM PKT. Free.</p>
          </a>
        </div>
      </div>

    </main>
  );
}

function StatPill({ label, value, positive, negative }: {
  label: string; value: string; positive?: boolean; negative?: boolean;
}) {
  const color = positive ? "text-gain" : negative ? "text-loss" : "text-tx-secondary";
  return (
    <div className="bg-surface border border-border-theme rounded-lg px-4 py-2 min-w-24">
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-0.5">{label}</p>
      <p className={"text-sm font-bold tabular-nums font-mono " + color}>{value}</p>
    </div>
  );
}
