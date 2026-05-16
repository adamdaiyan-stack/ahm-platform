// app/sectors/[sector]/page.tsx
//
// Dynamic sector route.
//
// ROUTING STRATEGY
// ─────────────────
// Banking → BankingFrameworkPage (new 3-level framework — pilot/gold standard)
// All others → SectorShell (existing HTML-tab renderer — pending progressive migration)
//
// As each sector is migrated to the new framework, add a branch here.
// The migration order per roadmap: Banking (done) → Cement → Oil & Gas → others.

import { notFound }             from "next/navigation";
import { sectorMap }            from "@/data/sectors";
import SectorShell              from "@/components/sectors/SectorShell";
import BankingFrameworkPage     from "@/components/sectors/banking/BankingFrameworkPage";
import Link                     from "next/link";

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;
  const sector = sectorMap[slug];

  if (!sector) notFound();

  // ── Banking: new framework (pilot) ──────────────────────────────────────
  if (slug === "banking") {
    return <BankingFrameworkPage />;
  }

  // ── All other sectors: existing SectorShell (to be migrated progressively) ──
  // The back-nav and SectorShell remain unchanged — no intelligence is removed.
  return (
    <div className="sector-root">
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

      {/* Full sector intelligence — all tabs preserved */}
      <SectorShell sector={sector} />
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(sectorMap).map((slug) => ({ sector: slug }));
}
