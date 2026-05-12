// components/layout/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-900 bg-black mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* Left — branding + data source */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-gray-700 uppercase tracking-widest">AHM Platform</span>
          <span className="w-px h-3 bg-gray-800" />
          <span className="text-xs font-mono text-gray-700">
            Data: PSX · SECP · Company Filings
          </span>
        </div>

        {/* Right — disclaimer */}
        <p className="text-xs text-gray-700 max-w-xl leading-relaxed">
          For informational purposes only. Not financial advice. Data may be delayed or approximate.
          Always verify with official PSX sources before making investment decisions.{" "}
          <span className="text-gray-800">© {year} AHM Platform</span>
        </p>

      </div>
    </footer>
  );
}
