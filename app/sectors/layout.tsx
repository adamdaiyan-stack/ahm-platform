// app/sectors/layout.tsx
//
// WHY A NESTED LAYOUT:
// Next.js layouts are hierarchical. This layout wraps every page under /sectors/*.
// By importing sector.css HERE (not in the root layout), the sector styles only
// apply to sector pages — they won't affect /stocks or / pages.
//
// We also load the three fonts the sector modules use (Playfair Display,
// JetBrains Mono, Libre Franklin) via a <link> tag scoped to this layout.

import "./sector.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PSX Sector Intelligence | AHM Platform",
};

export default function SectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google Fonts — loaded only for sector pages */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@300;400;600&family=Libre+Franklin:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
