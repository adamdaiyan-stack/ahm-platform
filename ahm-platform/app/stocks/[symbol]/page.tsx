import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatVolume,
  formatMarketCap,
} from "@/lib/formatters";
import { Company } from "@/types";

const SECTOR_TO_SLUG: Record<string, string> = {
  "Banking":          "banking",
  "Automobile":       "auto",
  "Auto":             "auto",
  "Cement":           "cement",
  "Fertiliser":       "fertiliser",
  "Fertilizer":       "fertiliser",
  "Oil & Gas":        "oil-gas",
  "Oil and Gas":      "oil-gas",
  "E&P":              "oil-gas",
  "Power":            "power-ipp",
  "Power Generation": "power-ipp",
  "IPP":              "power-ipp",
  "Textiles":         "textiles",
  "Textile":          "textiles",
};

type Dividend = {
  id: number;
  symbol: string;
  financial_year: string;
  period: string | null;
  amount: number;
  announced_date: string | null;
  book_closure: string | null;
};

type Announcement = {
  id: number;
  symbol: string;
  title: string;
  category: string | null;
  published_at: string;
  url: string | null;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const sym = symbol.toUpperCase();

  // Fetch company first (needed for sector to fetch peers)
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("symbol", sym)
    .single<Company>();

  if (!company) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <p className="text-gray-400">Company not found: {symbol}</p>
        <Link href="/stocks" className="text-emerald-400 hover:underline mt-4 inline-block">
          Back to all stocks
        </Link>
      </main>
    );
  }

  // Parallel fetch: peers, dividends, announcements
  const [{ data: peers }, { data: dividends }, { data: announcements }] =
    await Promise.all([
      supabase
        .from("companies")
        .select(
          "id, symbol, company_name, current_price, change_percent, market_cap, pe_ratio"
        )
        .eq("sector", company.sector)
        .neq("symbol", sym)
        .order("market_cap", { ascending: false })
        .limit(6),
      supabase
        .from("dividends")
        .select("*")
        .eq("symbol", sym)
        .order("financial_year", { ascending: false })
        .limit(8),
      supabase
        .from("announcements")
        .select("*")
        .eq("symbol", sym)
        .order("published_at", { ascending: false })
        .limit(5),
    ]);

  const sectorSlug = SECTOR_TO_SLUG[company.sector] ?? null;
  const isPositive = company.change != null && company.change >= 0;
  const isNegative = company.change != null && company.change < 0;
  const hasChange = company.change != null;
  const arrow = isPositive ? "▲" : isNegative ? "▼" : "";

  const priceColor = hasChange
    ? isPositive
      ? "text-emerald-400"
      : "text-red-400"
    : "text-white";

  const changePillClass = hasChange
    ? isPositive
      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
      : "bg-red-500/15 text-red-400 border border-red-500/30"
    : "bg-gray-800 text-gray-400 border border-gray-700";

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── 1. PRICE SUMMARY + DAILY CHANGE ─────────────────── */}
      <div className="px-8 pt-10 pb-8 border-b border-gray-800">
        <div className="max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-5xl font-bold tracking-tight">{company.symbol}</h1>
              <Link
                href={`/stocks?sector=${encodeURIComponent(company.sector)}`}
                className="text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded-full px-3 py-1.5 hover:border-gray-600 transition-colors"
              >
                {company.sector}
              </Link>
            </div>
            <p className="text-gray-400 text-lg">{company.company_name}</p>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-400 font-mono mt-1 inline-block transition-colors"
              >
                {company.website.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-mono">
              Last Price (PKR)
            </p>
            <p className={`text-5xl font-bold tabular-nums ${priceColor}`}>
              {formatPrice(company.current_price)}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg tabular-nums ${changePillClass}`}
            >
              {arrow} {formatChange(company.change)} (
              {formatPercent(company.change_percent)})
            </span>
          </div>
        </div>
      </div>

      {/* ── KEY STATS ROW ────────────────────────────────────── */}
      <div className="px-8 py-6 border-b border-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 max-w-6xl">
          <StatCard label="Market Cap"  value={formatMarketCap(company.market_cap)} />
          <StatCard label="Volume"      value={formatVolume(company.volume)} />
          <StatCard label="P/E Ratio"   value={company.pe_ratio != null ? company.pe_ratio.toFixed(2) : "—"} />
          <StatCard label="EPS (PKR)"   value={company.eps != null ? company.eps.toFixed(2) : "—"} />
          <StatCard label="Div Yield"   value={company.dividend_yield != null ? `${company.dividend_yield.toFixed(2)}%` : "—"} />
          <StatCard label="52W High"    value={company.week_52_high != null ? formatPrice(company.week_52_high) : "—"} />
          <StatCard label="52W Low"     value={company.week_52_low != null ? formatPrice(company.week_52_low) : "—"} />
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="px-8 py-8 max-w-6xl space-y-8">

        {/* ── 3. COMPANY PROFILE ───────────────────────────── */}
        <section>
          <SectionLabel>Company Profile</SectionLabel>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {company.description ??
                `${company.company_name} is listed on the Pakistan Stock Exchange under the ${company.sector} sector. A detailed company profile will be added in a future update.`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-800 pt-5">
              <MetaItem
                label="Founded"
                value={company.founded_year ? String(company.founded_year) : "—"}
              />
              <MetaItem label="CEO" value={company.ceo ?? "—"} />
              <MetaItem
                label="Employees"
                value={
                  company.employees != null
                    ? company.employees.toLocaleString()
                    : "—"
                }
              />
              <MetaItem label="Exchange" value="PSX (KSE)" />
            </div>
          </div>
        </section>

        {/* ── 4. VALUATION RATIOS ──────────────────────────── */}
        <section>
          <SectionLabel>Valuation Ratios</SectionLabel>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <RatioItem
                label="P/E Ratio"
                value={company.pe_ratio != null ? company.pe_ratio.toFixed(2) : "—"}
              />
              <RatioItem
                label="EPS (PKR)"
                value={company.eps != null ? company.eps.toFixed(2) : "—"}
              />
              <RatioItem
                label="Div Yield"
                value={
                  company.dividend_yield != null
                    ? `${company.dividend_yield.toFixed(2)}%`
                    : "—"
                }
              />
              <RatioItem label="P/B Ratio"    value="—" muted />
              <RatioItem label="ROE"           value="—" muted />
              <RatioItem label="Debt / Equity" value="—" muted />
            </div>
            <p className="text-xs text-gray-700 font-mono mt-5">
              P/B · ROE · Debt/Equity — pending data pipeline integration
            </p>
          </div>
        </section>

        {/* ── 5. PRICE CHART PLACEHOLDER ───────────────────── */}
        <section>
          <SectionLabel>Price History</SectionLabel>
          <div
            className="bg-gray-950 border border-gray-800 rounded-xl flex flex-col items-center justify-center p-8"
            style={{ minHeight: "200px" }}
          >
            <svg
              width="100%"
              height="80"
              viewBox="0 0 600 80"
              className="mb-5 opacity-10"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,70 80,52 160,58 240,35 300,40 380,22 460,18 540,12 600,6"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-gray-600 text-sm font-mono">Price chart integration pending</p>
            <p className="text-gray-700 text-xs mt-1">
              Historical OHLCV data pipeline in progress
            </p>
          </div>
        </section>

        {/* ── TWO-COL: DIVIDENDS + ANNOUNCEMENTS ───────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── 6. DIVIDEND HISTORY ──────────────────────── */}
          <section>
            <SectionLabel>Dividend History</SectionLabel>
            <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
              {dividends && dividends.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-mono text-gray-600 uppercase tracking-widest">
                        Year
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-mono text-gray-600 uppercase tracking-widest">
                        Period
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest">
                        PKR/Share
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-mono text-gray-600 uppercase tracking-widest">
                        Announced
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dividends as Dividend[]).map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-gray-900 hover:bg-gray-900 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono text-white text-xs">
                          {d.financial_year}
                        </td>
                        <td className="px-4 py-2.5 text-gray-400 text-xs">
                          {d.period ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                          {Number(d.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-600 text-xs font-mono">
                          {fmtDate(d.announced_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-600 text-sm font-mono">
                    No dividend history on record
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ── 7. LATEST ANNOUNCEMENTS ──────────────────── */}
          <section>
            <SectionLabel>Latest Announcements</SectionLabel>
            <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
              {announcements && announcements.length > 0 ? (
                <div className="divide-y divide-gray-900">
                  {(announcements as Announcement[]).map((a) => (
                    <div
                      key={a.id}
                      className="px-4 py-4 hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {a.category && (
                          <span className="text-xs font-mono text-gray-500 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded">
                            {a.category}
                          </span>
                        )}
                        <span className="text-xs text-gray-700 font-mono">
                          {fmtDate(a.published_at)}
                        </span>
                      </div>
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-300 hover:text-white transition-colors leading-snug"
                        >
                          {a.title}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-300 leading-snug">
                          {a.title}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-600 text-sm font-mono">
                    No announcements on record
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── 8. AHM ANALYST NOTE ──────────────────────────── */}
        <section>
          <SectionLabel>AHM Analyst Note</SectionLabel>
          <div className="bg-gray-950 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-mono text-amber-500/60 uppercase tracking-widest mb-1">
                  Internal Research
                </p>
                <h3 className="text-white font-semibold">
                  {company.symbol} — Coverage Note
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-500/50 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                PENDING
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-800 pt-4 italic">
              Analyst coverage note for {company.company_name} will be published
              after the next AHM research review cycle. This section will include
              our investment thesis, key risks, valuation framework, and price
              target.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="bg-gray-900 rounded-lg p-3 text-center">
                <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">
                  Rating
                </p>
                <p className="text-gray-700 font-bold">—</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 text-center">
                <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">
                  Target Price
                </p>
                <p className="text-gray-700 font-bold">—</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 text-center">
                <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">
                  Upside
                </p>
                <p className="text-gray-700 font-bold">—</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── SECTOR PEERS ─────────────────────────────────────── */}
      {peers && peers.length > 0 && (
        <div className="px-8 py-8 border-t border-gray-800">
          <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-gray-600 uppercase tracking-widest font-mono">
                {company.sector} — Sector Peers
              </p>
              <Link
                href={`/stocks?sector=${encodeURIComponent(company.sector)}`}
                className="text-xs font-mono text-gray-500 hover:text-white transition-colors"
              >
                View all {company.sector} stocks
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm border-collapse"
                style={{ minWidth: "600px" }}
              >
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-3 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">Symbol</th>
                    <th className="text-left px-3 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">Company</th>
                    <th className="text-right px-3 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">Price</th>
                    <th className="text-right px-3 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">Chg %</th>
                    <th className="text-right px-3 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">Mkt Cap</th>
                    <th className="text-right px-3 py-2 text-xs font-mono text-gray-600 uppercase tracking-widest">P/E</th>
                  </tr>
                </thead>
                <tbody>
                  {peers.map((peer) => {
                    const peerPos =
                      peer.change_percent != null && peer.change_percent >= 0;
                    const peerColor =
                      peer.change_percent == null
                        ? "text-gray-600"
                        : peerPos
                        ? "text-emerald-400"
                        : "text-red-400";
                    return (
                      <tr
                        key={peer.id}
                        className="border-b border-gray-900 hover:bg-gray-950 transition-colors"
                      >
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/stocks/${peer.symbol}`}
                            className="font-mono font-bold text-white hover:text-emerald-400 transition-colors text-sm"
                          >
                            {peer.symbol}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-gray-400 text-xs">
                          {peer.company_name}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-sm text-white tabular-nums">
                          {formatPrice(peer.current_price)}
                        </td>
                        <td
                          className={`px-3 py-2.5 text-right font-mono text-xs tabular-nums ${peerColor}`}
                        >
                          {formatPercent(peer.change_percent)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-xs text-gray-500 tabular-nums">
                          {formatMarketCap(peer.market_cap)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-xs text-gray-500 tabular-nums">
                          {peer.pe_ratio != null
                            ? peer.pe_ratio.toFixed(1)
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ── SUB-COMPONENTS ────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-600 uppercase tracking-widest mb-1.5 font-mono">
        {label}
      </p>
      <p className="text-white text-base font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-300">{value}</p>
    </div>
  );
}

function RatioItem({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="border border-gray-800 rounded-lg p-3 text-center">
      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <p
        className={`text-base font-bold tabular-nums ${
          muted ? "text-gray-700" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
