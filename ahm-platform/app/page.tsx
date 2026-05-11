import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-8 pt-16 pb-12 border-b border-gray-800">
        <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-4">
          AHM Platform
        </p>
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          PSX Investor Intelligence
        </h1>
        <p className="text-gray-400 text-sm max-w-md">
          Pakistan Stock Exchange — company data, sector analysis, and market intelligence.
        </p>
      </div>

      <div className="px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <Link
          href="/stocks"
          className="group bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/40 hover:bg-gray-900 transition-all"
        >
          <div className="w-6 h-0.5 bg-emerald-500 mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Stock Listings</h2>
          <p className="text-gray-500 text-xs leading-relaxed">
            Browse all listed companies with live price, change, volume, P/E, and dividend data.
          </p>
          <p className="text-emerald-500 text-xs font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            View stocks &rarr;
          </p>
        </Link>

        <Link
          href="/sectors"
          className="group bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-blue-500/40 hover:bg-gray-900 transition-all"
        >
          <div className="w-6 h-0.5 bg-blue-500 mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Sector Intelligence</h2>
          <p className="text-gray-500 text-xs leading-relaxed">
            Deep-dive modules for Banking, Auto, Cement, Fertiliser, Oil &amp; Gas, Power, and Textiles.
          </p>
          <p className="text-blue-400 text-xs font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            Explore sectors &rarr;
          </p>
        </Link>
      </div>
    </main>
  );
}
