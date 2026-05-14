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
    <main className="min-h-screen bg-black text-white">
      <div className="px-8 pt-12 pb-8 border-b border-gray-800">
        <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-3">Sector Modules</p>
        <h1 className="text-4xl font-bold text-white mb-3">Pakistan Market Sectors</h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Deep-dive intelligence modules — economics, key variables, company profiles,
          peer analysis, and monitoring frameworks for each major PSX sector.
        </p>
      </div>

      <div className="px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {sectorList.map((sector) => {
            const dbSector = SLUG_TO_SECTOR[sector.slug];
            return (
              <div key={sector.slug} className="group bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
                <div className="w-8 h-0.5 mb-4" style={{ background: sector.accentColor }} />
                <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-2">
                  {sector.volume}
                </p>
                <h2 className="text-xl font-bold text-white mb-2">{sector.name}</h2>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                  {sector.subtitle}
                </p>

                {sector.stats.slice(0, 2).map((s, i) => (
                  <div key={i} className="flex justify-between items-baseline border-t border-gray-800 pt-2 mt-2">
                    <span className="text-sm font-bold tabular-nums" style={{ color: sector.accentColor }}>
                      {s.val}
                    </span>
                    <span className="text-xs text-gray-600 font-mono ml-3 text-right leading-tight">
                      {s.lbl}
                    </span>
                  </div>
                ))}

                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-800">
                  <Link
                    href={`/sectors/${sector.slug}`}
                    className="text-xs font-mono px-3 py-1.5 rounded border transition-colors hover:text-white"
                    style={{ borderColor: sector.accentColor + "40", color: sector.accentColor }}
                  >
                    Intelligence Module
                  </Link>
                  {dbSector && (
                    <Link
                      href={`/stocks?sector=${encodeURIComponent(dbSector)}`}
                      className="text-xs font-mono px-3 py-1.5 rounded border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300 transition-colors"
                    >
                      View Stocks
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-8 pb-12">
        <Link
          href="/sectors/monitoring"
          className="group flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl p-6 max-w-6xl hover:border-gray-700 transition-all"
        >
          <div>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">Cross-Sector</p>
            <h2 className="text-lg font-bold text-white">PSX Monitoring Framework</h2>
            <p className="text-gray-500 text-xs mt-1">
              Unified monitoring dashboard — indicators, triggers, and signals across all sectors
            </p>
          </div>
          <span className="text-gray-600 text-2xl group-hover:text-gray-400 transition-colors ml-6">→</span>
        </Link>
      </div>
    </main>
  );
}
