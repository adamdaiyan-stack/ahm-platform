// app/sectors/[sector]/page.tsx
import { notFound } from "next/navigation";
import { sectorMap } from "@/data/sectors";
import SectorShell from "@/components/sectors/SectorShell";
import BankingModule from "@/components/sectors/BankingModule";
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
    <div className="sector-root">
      {/* ← Back nav */}
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

      {/* Primary content — static sector intelligence */}
      <SectorShell sector={sector} />

      {/* Banking-only supplement — live data, interactive comparison */}
      {slug === "banking" && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            marginTop: "0",
          }}
        >
          <BankingModule />
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(sectorMap).map((slug) => ({ sector: slug }));
}
