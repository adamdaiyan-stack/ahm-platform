"use client";
// components/sectors/framework/SectorSideNav.tsx
//
// Responsive section navigation for the Banking / sector pages.
//
// DESKTOP (≥1024px): sticky left sidebar, 192px wide, vertical list.
//   Groups: L1 overview items | L2 analytics (indented) | L3 research
//   Active item highlighted with a coloured left-bar indicator.
//   IntersectionObserver drives the active state as user scrolls.
//
// MOBILE (<1024px): sticky horizontal tab strip at the top.
//   Same items, horizontal scroll, pill buttons, no scrollbar.
//
// Rendered INSIDE the flex container. The container uses `flex-col lg:flex-row`
// so on mobile this component becomes a full-width top bar, and on desktop
// a left sidebar column.

import { useState, useEffect, useCallback } from "react";

export type NavItem = {
  id:    string;   // must match the `id` on the section DOM element
  label: string;   // short display label (≤12 chars ideal)
  group: "l1" | "l2" | "l3";  // visual grouping
};

interface Props {
  items:       NavItem[];
  accentColor: string;
}

export default function SectorSideNav({ items, accentColor }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  // IntersectionObserver — highlights the section currently in view
  useEffect(() => {
    if (!items.length) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the entry closest to the top of the viewport
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-15% 0px -75% 0px",
      threshold: 0,
    });

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const l1 = items.filter((i) => i.group === "l1");
  const l2 = items.filter((i) => i.group === "l2");
  const l3 = items.filter((i) => i.group === "l3");

  return (
    <>
      {/* ── MOBILE: sticky horizontal tab strip ──────────────────── */}
      <div className="lg:hidden sticky top-0 z-40 bg-base/[0.97] backdrop-blur-sm border-b border-border-theme">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 py-2.5">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={[
                  "shrink-0 text-[10px] font-mono uppercase tracking-wide px-3 py-1.5 rounded-full",
                  "transition-all duration-150",
                  isActive
                    ? "text-white shadow-sm"
                    : "text-tx-disabled bg-surface border border-border-theme hover:text-tx-primary",
                ].join(" ")}
                style={isActive ? { background: accentColor } : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP: sticky left sidebar ─────────────────────────── */}
      <aside className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-20 space-y-0.5 pr-6 border-r border-border-theme min-h-[60vh]">

          {/* L1 — Overview items */}
          {l1.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              accentColor={accentColor}
              onClick={() => scrollTo(item.id)}
            />
          ))}

          {/* L2 — Analytics items */}
          {l2.length > 0 && (
            <>
              <div className="py-3 px-2">
                <div className="h-px bg-border-theme mb-2" />
                <p className="text-[9px] font-mono uppercase tracking-widest text-tx-disabled">
                  Analytics
                </p>
              </div>
              {l2.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  accentColor={accentColor}
                  onClick={() => scrollTo(item.id)}
                  indent
                />
              ))}
            </>
          )}

          {/* L3 — Research */}
          {l3.length > 0 && (
            <>
              <div className="py-3 px-2">
                <div className="h-px bg-border-theme" />
              </div>
              {l3.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  accentColor={accentColor}
                  onClick={() => scrollTo(item.id)}
                />
              ))}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

// ── Reusable nav button ────────────────────────────────────────────────────

function NavButton({
  item,
  isActive,
  accentColor,
  onClick,
  indent = false,
}: {
  item:        NavItem;
  isActive:    boolean;
  accentColor: string;
  onClick:     () => void;
  indent?:     boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={item.label}
      className={[
        "w-full text-left flex items-center gap-2 py-1.5 rounded transition-colors duration-150",
        indent ? "pl-4 pr-2" : "px-2",
        isActive
          ? "text-tx-primary"
          : "text-tx-disabled hover:text-tx-secondary",
      ].join(" ")}
    >
      {/* Active indicator bar */}
      <span
        className="w-0.5 h-3.5 rounded-full shrink-0 transition-opacity duration-150"
        style={{
          background:  isActive ? accentColor : "transparent",
          opacity:     isActive ? 1 : 0,
        }}
        aria-hidden
      />
      <span className="text-[11px] font-mono truncate">{item.label}</span>
    </button>
  );
}
