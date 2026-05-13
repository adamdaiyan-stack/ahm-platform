export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-theme bg-base mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-tx-disabled uppercase tracking-widest">AHM Platform</span>
          <span className="w-px h-3 bg-border-theme" />
          <span className="text-xs font-mono text-tx-disabled">Data: PSX · SECP · Company Filings</span>
        </div>
        <p className="text-xs text-tx-disabled max-w-xl leading-relaxed">
          For informational purposes only. Not financial advice. Data may be delayed or approximate.
          Always verify with official PSX sources before making investment decisions.{" "}
          © {year} AHM Platform
        </p>
      </div>
    </footer>
  );
}
