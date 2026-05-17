// app/sectors/[sector]/page.tsx
//
// Dynamic sector route.
//
// MIGRATION ORDER (per docs/sectors/sector-framework-template.md)
//   Banking    done  → BankingFrameworkPage
//   Cement     done  → CementFrameworkPage
//   Textiles   done  → TextileFrameworkPage
//   Oil & Gas  done  → OilGasFrameworkPage
//   Fertiliser done  → FertiliserFrameworkPage
//   Power      done  → PowerFrameworkPage
//   Automobile      → pending
//
// To add a new sector: import its FrameworkPage and add an `if` branch below.

import { notFound }              from "next/navigation";
import { sectorMap }             from "@/data/sectors";
import SectorShell               from "@/components/sectors/SectorShell";
import BankingFrameworkPage      from "@/components/sectors/banking/BankingFrameworkPage";
import CementFrameworkPage       from "@/components/sectors/cement/CementFrameworkPage";
import TextileFrameworkPage      from "@/components/sectors/textile/TextileFrameworkPage";
import OilGasFrameworkPage       from "@/components/sectors/oil-gas/OilGasFrameworkPage";
import FertiliserFrameworkPage   from "@/components/sectors/fertiliser/FertiliserFrameworkPage";
import PowerFrameworkPage        from "@/components/sectors/power/PowerFrameworkPage";
import Link                      from "next/link";

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;
  const sector = sectorMap[slug];

  if (!sector) notFound();

  // ── Framework routes — migrated sectors ─────────────────────────────────
  if (slug === "banking")    return <BankingFrameworkPage />;
  if (slug === "cement")     return <CementFrameworkPage />;
  if (slug === "textiles")   return <TextileFrameworkPage />;
  if (slug === "oil-gas")    return <OilGasFrameworkPage />;
  if (slug === "fertiliser") return <FertiliserFrameworkPage />;
  if (slug === "power-ipp")  return <PowerFrameworkPage />;

  // ── Legacy SectorShell — all other sectors (pending migration) ───────────
  return (
    <div className="sector-root">
      <div
        style={{
          background:    "var(--bg2)",
          borderBottom:  "1px solid var(--border)",
          padding:       "10px 60px",
        }}
      >
        <Link
          href="/sectors"
          style={{
            fontFamily:     "'JetBrains Mono', monospace",
            fontSize:       "10px",
            letterSpacing:  "0.15em",
            textTransform:  "uppercase",
            color:          "var(--text3)",
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
