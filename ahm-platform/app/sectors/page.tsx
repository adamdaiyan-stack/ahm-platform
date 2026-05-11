// app/sectors/page.tsx
//
// The sector listing page — shows all 7 sector modules as cards.
// URL: /sectors
//
// This is a Server Component (no "use client" needed — no interactivity here,
// just rendering static data from our sectorMap).

import Link from "next/link";
import { sectorList } from "@/data/sectors";

export default function SectorsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* TOPBAR */}
      <div className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
          ← Home
        </Link>
        <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">
          PSX Sector Intelligence
        </span>
      </div>

      {/* HEADER */}
      <div className="px-8 pt-12 pb-8 border-b border-gray-800">
        <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-3">
          Sector Modules
        </p>
        <h1 className="text-4xl font-bold text-white mb-3">
          Pakistan Market Sectors
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Deep-dive intelligence modules covering economics, key variables, company
          profiles, peer analysis, and monitoring frameworks for each major PSX sector.
        </p>
      </div>

      {/* SECTOR GRID */}
      <div className="px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {sectorList.map((sector) => (
            <Link
              key={sector.slug}
              href={`/sectors/${sector.slug}`}
              className="group bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-600 hover:bg-gray-900 transition-all duration-200"
            >
              {/* Accent bar */}
              <div
                className="w-8 h-0.5 mb-4"
                style={{ background: sector.accentColor }}
              />

              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-2">
                {sector.volume}
              </p>

              <h2 className="text-xl font-bold text-white mb-2">
                {sector.name}
              </h2>

              <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
                {sector.subtitle}
              </p>

              {/* Quick stats strip */}
              {sector.stats.slice(0, 2).map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-baseline border-t border-gray-800 pt-2 mt-2"
                >
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: sector.accentColor }}
                  >
                    {s.val}
                  </span>
                  <span className="text-xs text-gray-600 font-mono ml-3 text-right leading-tight">
                    {s.lbl}
                  </span>
                </div>
              ))}

              <p
                className="text-xs font-mono mt-4 group-hover:opacity-100 opacity-0 transition-opacity"
                style={{ color: sector.accentColor }}
              >
                Open module →
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* MONITORING FRAMEWORK LINK — special card */}
      <div className="px-8 pb-12">
        <Link
          href="/sectors/monitoring"
          className="group flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl p-6 max-w-6xl hover:border-gray-600 hover:bg-gray-900 transition-all"
        >
          <div>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">
              Cross-Sector
            </p>
            <h2 className="text-lg font-bold text-white">PSX Monitoring Framework</h2>
            <p className="text-gray-500 text-xs mt-1">
              Unified monitoring dashboard across all PSX sectors — indicators, triggers, and signals
            </p>
          </div>
          <span className="text-gray-600 text-2xl group-hover:text-gray-400 transition-colors">→</span>
        </Link>
      </div>
    </main>
  );
}
