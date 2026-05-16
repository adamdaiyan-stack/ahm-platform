"use client";
// components/sectors/framework/ExpandableSection.tsx
// Accordion wrapper used for ALL Level-2 analytics sections.
// "use client" so the open/close toggle works — content is passed as children.

import { useState } from "react";

interface Props {
  id:          string;
  label:       string;
  badge?:      string;
  defaultOpen?: boolean;
  children:    React.ReactNode;
}

export default function ExpandableSection({
  id,
  label,
  badge,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      id={id}
      className="border border-border-theme rounded-xl overflow-hidden"
    >
      {/* ── Toggle header ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-surface hover:bg-raised transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-tx-primary">{label}</span>
          {badge && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-tx-disabled border border-border-theme bg-raised px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        <span
          className="text-tx-disabled text-sm shrink-0 ml-4 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {/* ── Content ── */}
      {open && (
        <div className="border-t border-border-theme">
          {children}
        </div>
      )}
    </div>
  );
}
