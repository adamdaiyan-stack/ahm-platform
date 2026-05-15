// components/ui/AHMLogo.tsx
// Renders the AHM Securities brand logo using real SVGs from /public/branding/.
//
// ahm-logo-light.svg — dark navy letterforms (for light mode / light backgrounds)
// ahm-logo-dark.svg  — white letterforms    (for dark mode / dark backgrounds)
//
// Theme switching via globals.css .ahm-logo-dark / .ahm-logo-light rules.
// All consumers must go through this component — never reference logo files directly.

interface AHMLogoProps {
  height?: number;
  className?: string;
  /** Apply grayscale + reduced opacity — for footer / monochrome contexts */
  grayscale?: boolean;
}

// Source viewBox: 143.843 × 75.2464 pt  →  aspect ratio ≈ 1.912
const ASPECT = 143.843 / 75.2464;

export default function AHMLogo({
  height = 30,
  className = "",
  grayscale = false,
}: AHMLogoProps) {
  const width  = Math.round(height * ASPECT);
  const filter = grayscale ? "grayscale(1) opacity(0.45)" : undefined;

  const imgProps = {
    width,
    height,
    style: { filter } as React.CSSProperties,
    alt:   "AHM Securities",
    draggable: false as const,
  };

  return (
    <span
      className={["inline-flex items-center shrink-0", className]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height }}
    >
      {/* Dark mode: white letterforms on dark backgrounds (default theme) */}
      <img
        {...imgProps}
        src="/branding/ahm-logo-dark.svg"
        className="ahm-logo-dark"
      />
      {/* Light mode: dark navy letterforms on light backgrounds */}
      <img
        {...imgProps}
        src="/branding/ahm-logo-light.svg"
        className="ahm-logo-light"
      />
    </span>
  );
}
