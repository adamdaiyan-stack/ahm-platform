// components/ui/AHMLogo.tsx
// Uses the real brand SVGs extracted from AHM_logo.ai.
// Dark mode (default) → logo-dark.svg (white lettering on transparent)
// Light mode          → logo-light.svg (dark navy lettering on transparent)
// Theme switching is handled in globals.css via [data-theme="light"].

interface AHMLogoProps {
  height?: number;
  className?: string;
  /** Apply grayscale + opacity filter — use for footer / monochrome contexts */
  grayscale?: boolean;
}

// Aspect ratio from the AI file viewBox: 143.843 × 75.2464
const ASPECT = 143.843 / 75.2464; // ≈ 1.912

export default function AHMLogo({
  height = 30,
  className = "",
  grayscale = false,
}: AHMLogoProps) {
  const width  = Math.round(height * ASPECT);
  const filter = grayscale ? "grayscale(1) opacity(0.55)" : undefined;

  const imgProps = {
    width,
    height,
    style: { filter, display: "block" } as React.CSSProperties,
    alt:   "AHM Securities",
    draggable: false as const,
  };

  return (
    <span
      className={["inline-flex items-center", className].filter(Boolean).join(" ")}
      style={{ width, height, flexShrink: 0 }}
    >
      {/* Dark mode logo — white letterforms (shown by default) */}
      <img
        {...imgProps}
        src="/logo-dark.svg"
        className="ahm-logo-dark"
      />
      {/* Light mode logo — dark navy letterforms */}
      <img
        {...imgProps}
        src="/logo-light.svg"
        className="ahm-logo-light"
      />
    </span>
  );
}
