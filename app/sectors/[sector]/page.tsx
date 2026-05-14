// app/sectors/[sector]/page.tsx
import { notFound } from "next/navigation";
import { sectorMap } from "@/data/sectors";
import SectorShell from "@/components/sectors/SectorShell";
import BankingModule from "@/components/sectors/BankingModule";
import Link from "next/link";

// Sectors that have been redesigned with the new module format
const REDESIGNED = new Set(["banking"]);

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;

  // New-format sectors render their own full module (no wrapper needed)
  if (REDESIGNED.has(slug)) {
    return (
      <div className="bg-base min-h-screen">
        <div className="px-8 py-3 border-b border-border-theme">
          <Link href="/sectors"
            className="text-xs font-mono text-tx-disabled uppercase tracking-widest hover:text-tx-primary transition-colors">
            ← All Sectors
          </Link>
        </div>
        {slug === "banking" && <BankingModule />}
      </div>
    );
  }

  // Legacy sectors still use the old SectorShell + sector.css
  const sector = sectorMap[slug];
  if (!sector) notFound();

  return (
    <div className="sector-root">
      <div
        style={{
          background: "var(--bg2)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 60px",
        }}
      >
        <Link href="/sectors"
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

export async function generateStaticParams() {
  return Object.keys(sectorMap).map((slug) => ({ sector: slug }));
}
