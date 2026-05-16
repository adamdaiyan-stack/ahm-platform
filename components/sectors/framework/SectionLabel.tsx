// components/sectors/framework/SectionLabel.tsx
//
// SHARED SECTOR SECTION LABEL
// ─────────────────────────────────────────────────────────────────────────────
// Standardised section header used by every Level-1 section and Level-2/3
// dividers across all sector modules.
//
// Replaces every ad-hoc:
//   <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">
//
// USAGE
//   <SectionLabel label="Key Drivers" />
//   <SectionLabel label="Sector Snapshot" badge="Live" />
//   <SectionLabel label="Research Layer" badge="Level 3 · Institutional" />
//
// Server-safe — no client state required.

interface Props {
  label:      string;
  badge?:     string;       // right-aligned badge text
  className?: string;       // additional wrapper classes
}

export default function SectionLabel({ label, badge, className = "" }: Props) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <p className="text-[11px] font-mono text-tx-disabled uppercase tracking-widest">
        {label}
      </p>
      {badge && (
        <span className="text-[10px] font-mono text-tx-disabled border border-border-theme rounded px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </div>
  );
}
