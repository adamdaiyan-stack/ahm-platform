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
//
// STICKY MECHANICS:
//   The <aside> itself carries `sticky top-20 self-start` — NOT an inner div.
//   `self-start` overrides any `align-items: stretch` from the flex parent,
//   giving <aside> the natural content height so it can stick within the full
//   page scroll height rather than stopping when it hits its own bottom edge.

import { useState, useEffect, useCallback, useRef } from "react";

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

  // Set-based IntersectionObserver — tracks ALL currently-intersecting sections.
  // The callback only receives CHANGED entries, so we maintain a persistent Set
  // via useRef. After each update we pick the topmost item (first in `items`
  // order) that is currently intersecting — this prevents the active state from
  // freezing when a section exits before the next one enters.
  const intersectingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!items.length) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersectingRef.current.add(entry.target.id);
        } else {
          intersectingRef.current.delete(entry.target.id);
        }
      });

      // Pick the first item (by nav order) that is currently visible
      const firstActive = items.find((item) =>
        intersectingRef.current.has(item.id)
      );
      if (firstActive) {
        setActiveId(firstActive.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      // Top 10% of viewport triggers entry; bottom 50% of viewport is dead zone.
      // This gives a wide "active" band without jumping too aggressively.
      rootMargin: "0px 0px -50% 0px",
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
      {/*
        sticky + self-start on <aside> itself — NOT on an inner div.
        self-start: gives <aside> its natural content height so it can stick
        within the full-page scroll container rather than being stretched to the
        flex row height (which would make it stop sticking at content bottom).
        top-20: clears the 80px app header.
        max-h + overflow-y-auto: sidebar scrolls independently if it's taller
        than the viewport (e.g., many nav items on a short screen).
      */}
      <aside className="hidden lg:block w-48 shrink-0 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar">
        <div className="space-y-0.5 pr-6 border-r border-border-theme pb-10">

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
              <div cl