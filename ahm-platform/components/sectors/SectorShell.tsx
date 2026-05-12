"use client";
// components/sectors/SectorShell.tsx
//
// WHY "use client":
// Tab switching requires React state — which tab is active changes on click.
// State can only live in Client Components. However, notice that the PARENT
// (app/sectors/[sector]/page.tsx) is still a Server Component — it fetches data
// on the server and passes it as props. Only the interactive tab logic is client.
//
// This is the Next.js "composition pattern": Server Component fetches data,
// Client Component handles interactivity. Best of both worlds.

import { useState } from "react";
import type { SectorData } from "@/data/sectors/types";

type Props = { sector: SectorData };

const TAB_LABELS: Record<string, string> = {
  overview:   "Overview",
  economics:  "Economics",
  variables:  "Variables",
  structure:  "Structure",
  companies:  "Companies",
  peers:      "Peer Grid",
  peergrid:   "Peer Grid",
  risks:      "Risks",
  monitor:    "Monitor",
  glossary:   "Glossary",
  summary:    "Summary",
  interpret:  "Interpretation",
  deeppeers:  "Deep Peers",
  metrics:    "Metrics",
};

export default function SectorShell({ sector }: Props) {
  const [activeId, setActiveId] = useState(sector.tabs[0].id);

  const activeTab = sector.tabs.find((t) => t.id === activeId) ?? sector.tabs[0];

  return (
    <>
      {/* ── DISCLAIMER BAR ── */}
      <div className="disclaimer-bar">
        Educational &amp; informational purposes only · No investment advice ·
        No buy/sell/hold recommendations · Based on publicly available secondary sources
      </div>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-label">{sector.volume}</div>
        <h1
          dangerouslySetInnerHTML={{ __html: `Pakistan <em>${sector.name}</em><br/>Sector` }}
        />
        <p className="hero-sub">{sector.subtitle}</p>
        <div className="hero-stats">
          {sector.stats.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-val">{s.val}</span>
              <span className="stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <nav className="nav-tabs">
        {sector.tabs.map((tab, i) => (
          <button
            key={tab.id}
            className={`tab-btn${activeId === tab.id ? " active" : ""}`}
            onClick={() => setActiveId(tab.id)}
          >
            {String(i + 1).padStart(2, "0")} · {TAB_LABELS[tab.id] ?? tab.label}
          </button>
        ))}
      </nav>

      {/* ── ACTIVE TAB CONTENT ── */}
      {/* dangerouslySetInnerHTML is safe here: content is our own static HTML,
          not user-generated input. It lets us render the rich HTML modules
          without rewriting thousands of lines as JSX. */}
      <div
        key={activeId}
        dangerouslySetInnerHTML={{ __html: activeTab.content }}
      />

      {/* ── FOOTER ── */}
      <div className="footer">
        <span className="footer-note">AHM Platform · PSX Sector Intelligence</span>
        <span className="footer-note">
          {sector.volume} · {sector.name} Sector
        </span>
      </div>
    </>
  );
}
