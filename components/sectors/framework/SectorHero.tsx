// components/sectors/framework/SectorHero.tsx
//
// SECTOR HERO — Level 1 header block
// Full-width: accent stripe, breadcrumb, sector identity, headline stats.
// Server-safe — no client state required.

import Link from "next/link";
import type { SectorFrameworkConfig } from "./types";

interface Props {
  config: SectorFrameworkConfig;
}

export default function SectorHero({ config }: Props) {
  return (
    <div className="border-b border-border-theme">

      {/* Accent top stripe — sector identity signal */}
      <div className="h-px w-full" style={{ background: config.accentColor }} />

      <div className="px-6 md:px-10 pt-10 pb-8 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-[11px] font-mono text-tx-disabled mb-6"
          aria-label="Breadcrumb"
        >
          <Link href="/"        className="hover:text-tx-secondary transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <Link href="/sectors" className="hover:text-tx-secondary transition-colors">Sectors</Link>
          <span className="opacity-40">/</span>
          <span className="text-tx-secondary">{config.name}</span>
        </nav>

        {/* Eyebrow */}
        <p
          className="text-[10px] font-mono uppercase tracking-widest mb-3"
          style={{ color: config.accentColor }}
        >
          PSX · Sector Intelligence
        </p>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-tx-primary mb-3 leading-tight tracking-tight">
          Pakistan{" "}
          <em className="not-italic" style={{ color: config.accentColor }}>
            {config.name}
          </em>{" "}
          Sector
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-tx-secondary leading-relaxed max-w-2xl mb-8">
          {config.subtitle}
        </p>

        {/* Headline stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {config.stats.map((s, i) => (
            <div
              key={i}
              className="bg-surface border border-border-theme rounded-lg px-4 py-3"
            >
              <p className="text-[15px] font-bold text-tx-primary tabular-nums leading-tight">
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
