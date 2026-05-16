"use client";
// components/sectors/framework/ExpandableSection.tsx
//
// Accordion section for Level-2 advanced analytics.
//
// STRUCTURE:
//   ┌─ Header (always visible, click to toggle) ──────────────────┐
//   │  [badge]  Label                                    [▾ / ▴]  │
//   │  ─────────────────────────────────────────────────────────  │
//   │  Key Takeaway: "..." (always visible — the section headline) │
//   └─────────────────────────────────────────────────────────────┘
//   ┌─ Body (shown only when expanded) ───────────────────────────┐
//   │  [full content passed as children]                           │
//   │  [Collapse ↑] footer                                         │
//   └─────────────────────────────────────────────────────────────┘
//
// The takeaway is the key insight from the section — always visible even when
// collapsed so users can scan the page and understand every section at a glance
// without having to open it.

import { useState, useRef } from "react";

interface Props {
  id:           string;
  label:        string;
  badge?:       string;
  takeaway?:    string;   // Always-visible key insight (shown even when collapsed)
  defaultOpen?: boolean;
  children:     React.ReactNode;
}

export default function ExpandableSection({
  id,
  label,
  badge,
  takeaway,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLDivElement>(null);

  function handleToggle() {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      // After React re-renders and the section expands, scroll so the header
      // stays visible rather than disappearing behind the sticky nav bar.
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  return (
    <div
      id={id}
      ref={sectionRef}
      className="scroll-anchor border border-border-theme rounded-xl overflow-hidden"
    >
      {/* ── Toggle header ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-start justify-between gap-4 px-6 pt-4 pb-3 bg-surface hover:bg-raised transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          {/* Label row */}
          <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
            {badge && (
              <span className="text-[9px] font-mono uppercase tracking-widest text-tx-disabled border border-border-theme bg-raised px-1.5 py-0.5 rounded">
                {badge}
              </span>
            )}
            <span className="text-sm font-semibold text-tx-primary">
              {label}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <span
          className="text-tx-disabled text-sm shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {/* ── Takeaway — always visible ──────────────────────────────── */}
      {takeaway && (
        <div
          className="px-6 pb-4 bg-surface border-t border-border-theme/50"
          onClick={handleToggle}
          style={{ cursor: "pointer" }}
        >
          <p className="text-[11px] text-tx-secondary leading-relaxed">
            <span className="text-tx-disabled font-mono mr-1.5">→</span>
            {takeaway}
          </p>
          {!open && (
            <p className="text-[10px] font-mono text-tx-disabled mt-2 hover:text-tx-secondary transition-colors">
              Expand full analysis ↓
            </p>
          )}
        </div>
      )}

      {/* ── Full content — shown only when expanded ────────────────── */}
      {open && (
        <div className="border-t border-border-theme">
          {