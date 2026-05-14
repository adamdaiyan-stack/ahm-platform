"use client";
// components/sectors/SectorShell.tsx

import { useState, useEffect, useRef } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);

  // After each tab renders, turn every "PSX: SYMBOL" ticker div into a clickable link
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const tickers = el.querySelectorAll('[class*="company-ticker"], [class*="co-ticker"]');
    tickers.forEach((node) => {
      const text = node.textContent ?? "";
      const match = text.match(/PSX:\s*([A-Z0-9]+)/);
      if (!match) return;
      const symbol = match[1];
      if (node.querySelector("a")) return;
      const a = document.createElement("a");
      a.href = "/stocks/" + symbol;
      a.style.cssText = "color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:4px;font-weight:700;cursor:pointer;";
      a.innerHTML = "PSX: " + symbol + " <span style=\"font-size:10px;opacity:0.65;\">&#8599;</span>";
      a.addEventListener("mouseover", () => { a.style.textDecoration = "underline"; });
      a.addEventListener("mouseout",  () => { a.style.textDecoration = "none"; });
      node.innerHTML = "";
      node.appendChild(a);
    });
  }, [activeId]);

  const activeTab = sector.tabs.find((t) => t.id === activeId) ?? sector.tabs[0];

  return (
    <div>
      <div className="disclaimer-bar">
        Educational &amp; informational purposes only &middot; No investment advice &middot;
        No buy/sell/hold recommendations &middot; Based on publicly available secondary sources
      </div>

      <div className="hero">
        <div className="hero-label">{sector.volume}</div>
        <h1
          dangerouslySetInnerHTML={{ __html: "Pakistan <em>" + sector.name + "</em><br/>Sector" }}
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

      <nav className="nav-tabs">
        {sector.tabs.map((tab, i) => (
          <button
            key={tab.id}
            className={"tab-btn" + (activeId === tab.id ? " active" : "")}
            onClick={() => setActiveId(tab.id)}
          >
            {String(i + 1).padStart(2, "0")} &middot; {TAB_LABELS[tab.id] ?? tab.label}
          </button>
        ))}
      </nav>

      <div
        key={activeId}
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: activeTab.content }}
      />

      <div className="footer">
        <span className="footer-note">AHM Platform &middot; PSX Sector Intelligence</span>
        <span className="footer-note">
          {sector.volume} &middot; {sector.name} Sector
        </span>
      </div>
    </div>
  );
}
