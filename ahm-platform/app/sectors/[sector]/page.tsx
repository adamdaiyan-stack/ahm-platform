// app/sectors/[sector]/page.tsx
//
// Dynamic route — one page for all sectors.
// URL: /sectors/banking, /sectors/auto, /sectors/cement, etc.
//
// This is a Server Component. It looks up the sector data (a pure JS object,
// no database needed — the content is static) and passes it to the
// SectorShell client component for rendering.
//
// DATA FLOW:
// URL param → sectorMap lookup → SectorData object → SectorShell renders it

import { notFound } from "next/navigation";
import { sectorMap } from "@/data/sectors";
import SectorShell from "@/Components/sectors/SectorShell";
import Link from "next/link";

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;
  const sector = sectorMap[slug];

  if (!sector) notFound();

  return (
    // sector-root is the CSS scope wrapper — all sector.css rules are prefixed
    // with .sector-root so they don't bleed into the rest of the app.
    <div className="sector-root">
      {/* Back nav — outside the shell so it always shows above the hero */}
      <div
        style={{
          background: "var(--bg2)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 60px",
        }}
      >
        <Link
          href="/sectors"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text3)",
            textDecoration: "none",
          }}
        >
          ← All Sectors
        </Link>
      </div>

      <SectorShell sector={sector} />
    </div>
  );
}

// Tell Next.js which slugs to pre-render at build time (optional but good practice)
export async function generateStaticParams() {
  return Object.keys(sectorMap).map((slug) => ({ sector: slug }));
}
