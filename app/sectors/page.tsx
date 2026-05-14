import Link from "next/link";
import { sectorList } from "@/data/sectors";

const SLUG_TO_SECTOR: Record<string, string> = {
  "banking":    "Banking",
  "auto":       "Automobile",
  "cement":     "Cement",
  "fertiliser": "Fertiliser",
  "oil-gas":    "Oil & Gas",
  "power-ipp":  "Power",
  "textiles":   "Textiles",
};

export default function SectorsPage() {
  return (
    <main className="min-h-screen bg-base text-tx-primary">

      {/* ── HEADER ──────────────────────────────────────── */}
      <div className="px-8 pt-12 pb-8 border-b border-border-theme">
        <p className="text-xs text-tx-disabled font-mono uppercase tracking-widest mb-3">
          Sector Modules
        </p>
        <h1 className="text-4xl font-bold text-tx-primary mb-3">
          Pakistan Market Sectors
        </h1>
        <p className="text-tx-secondary text-sm max-w-xl leading-relaxed">
          Deep-dive intelligence modules — economics, key variables, company profiles,
          peer analysis, and monitoring frameworks for each major PSX sector.
        </p>
      </div>

      {/* ── SECTOR CARDS ────────────────────────────────── */}
      <div className="px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {sectorList.map((sector) => {
            const dbSector = SLUG_TO_SECTOR[sector.slug];
            return (
              <div
                key={sector.slug}
                className="group bg-surface border border-border-theme rounded-xl p-6 hover:border-tx-secondary transition-all flex flex-col"
              >
                {/* Accent bar */}
                <div className="w-8 h-0.5 mb-4 flex-shrink-0" style={{ background: sector.accentColor }} />

                <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-2">
                  {sector.volume}
                </p>
                <h2 className="text-xl font-bold text-tx-primary mb-2">{sector.name}</h2>
                <p className="text-tx-secondary text-xs leading-relaxed line-clamp-2 mb-4">
                  {sector.subtitle}
                </p>

                {/* Key stats */}
                <div className="flex-1">
                  {sector.stats.slice(0, 2).map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-baseline border-t border-border-theme pt-2 mt-2"
                    >
                      <span
                        className="text-sm font-bold tabular-nums"
                        style={{ color: sector.accentColor }}
                      >
                        {s.val}
                      </span>
                      <span className="text-xs text-tx-disabled font-mono ml-3 text-right leading-tight">
                        {s.lbl}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex gap-2 mt-5 pt-4 border-t border-border-theme">
                  {/* Intelligence Module — accent-coloured, clearly primary */}
                  <Link
                    href={`/sectors/${sector.slug}`}
                    className="flex-1 text-center text-xs font-mono font-semibold px-3 py-2 rounded-lg border transition-all hover:opacity-90"
                    style={{
                      borderColor: sector.accentColor + "55",
                      color: sector.accentColor,
                      backgroundColor: sector.accentColor + "14",
                    }}
                  >
                    Intelligence Module
                  </Link>

                  {/* View Stocks — solid secondary button, not invisible */}
                  {dbSector && (
                    <Link
                      href={`/stocks?sector=${encodeURIComponent(dbSector)}`}
                      className="text-xs font-mono font-semibold px-3 py-2 rounded-lg border border-border-theme bg-raised text-tx-primary hover:bg-surface hover:border-tx-secondary transition-all whitespace-nowrap"
                    >
                      View Stocks →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MONITORING FRAMEWORK BANNER ─────────────────── */}
      <div className="px-8 pb-12">
        <Link
          href="/sectors/monitoring"
          className="group flex items-center justify-between bg-surface border border-border-theme rounded-xl p-6 max-w-6xl hover:border-tx-secondary transition-all"
        >
          <div>
            <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1">
              Cross-Sector
            </p>
            <h2 className="text-lg font-bold text-tx-primary">PSX Monitoring Framework</h2>
            <p className="text-tx-secondary text-xs mt-1">
              Unified monitoring dashboard — indicators, triggers, and signals across all sectors
            </p>
          </div>
          <span className="text-tx-disabled text-2xl group-hover:text-tx-primary transition-colors ml-6">→</span>
        </Link>
      </div>
    </main>
  );
}
