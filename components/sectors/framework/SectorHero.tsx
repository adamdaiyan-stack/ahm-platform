// components/sectors/framework/SectorHero.tsx
// Level-1 hero: sector name, subtitle, and headline stats strip.
// Server-safe — no client state required.

import Link from "next/link";
import type { SectorFrameworkConfig } from "./types";

interface Props {
  config: SectorFrameworkConfig;
}

export default function SectorHero({ config }: Props) {
  return (
    <div className="border-b border-border-theme">
      {/* Accent top stripe */}
      <div className="h-0.5 w-full" style={{ background: config.accentColor }} />

      <div className="px-6 md:px-10 pt-10 pb-8 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-tx-disabled mb-5">
          <Link href="/" className="hover:text-tx-secondary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/sectors" className="hover:text-tx-secondary transition-colors">Sectors</Link>
          <span>/</span>
          <span className="text-tx-primary">{config.name}</span>
        </nav>

        {/* Eyebrow */}
        <p
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: config.accentColor }}
        >
          PSX · Sector Intelligence
        </p>

        {/* Heading + subtitle */}
        <h1 className="text-3xl md:text-4xl font-bold text-tx-primary mb-3 leading-tight">
          Pakistan <em className="not-italic" style={{ color: config.accentColor }}>{config.name}</em> Sector
        </h1>
        <p className="text-tx-secondary text-sm leading-relaxed max-w-2xl mb-8">
          {config.subtitle}
        </p>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {config.stats.map((s, i) => (
            <div
              key={i}
              className="bg-surface border border-border-theme rounded-lg px-4 py-3"
            >
              <p className="text-base font-bold text-tx-primary tabular-nums leading-tight">
                {s.val}
              </p>
              <p className="text-[11px] text-tx-disabled leading-snug mt-1">{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
