// app/sectors/[sector]/page.tsx
//
// Dynamic sector route.
//
// ROUTING STRATEGY
// ─────────────────
// Each migrated sector gets its own FrameworkPage branch below.
// All unmigrated sectors fall through to SectorShell (legacy HTML-tab renderer).
//
// MIGRATION ORDER (per roadmap & docs/sectors/sector-framework-template.md)
//   Banking   done  → BankingFrameworkPage
//   Cement    done  → CementFrameworkPage
//   Oil & Gas       → pending
//   Fertiliser      → pending
//   Power           → pending
//   Automobile      → pending
//   Textiles        → pending
//
// To add a new sector: import its FrameworkPage and add an `if` branch below.

import { notFound }          from "next/navigation";
import { sectorMap }         from "@/data/sectors";
import SectorShell           from "@/components/sectors/SectorShell";
import BankingFrameworkPage  from "@/components/sectors/banking/BankingFrameworkPage";
import CementFrameworkPage   from "@/components/sectors/cement/CementFrameworkPage";
import Link                  from "next/link";

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;
  const sector = sectorMap[slug];

  if (!sector) notFound();

  // ── Framework routes — migrated sectors ─────────────────────────────────
  if (slug === "banking") return <BankingFrameworkPage />;
  if (slug === "cement")  return <CementFrameworkPage />;

  // ── Legacy SectorShell — all other sectors (pending migration) ───────────
  // Back-nav and full tab intelligence preserved unchanged.
  return (
    <div className="sector-root">
      <div
        style={{
          background:   "var(--bg2)",
          borderBottom: "1px solid var(--border)",
          padding:      "10px 60px",
        }}
      >
        <Link
          href="/sectors"
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color:         "var(--text3)",
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
