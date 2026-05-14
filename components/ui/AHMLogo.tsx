interface AHMLogoProps {
  height?: number;
  className?: string;
  /** Apply grayscale + opacity filter — use for footer / monochrome contexts */
  grayscale?: boolean;
}

/**
 * AHM Securities logo as inline SVG.
 * Uses currentColor for letterforms so it adapts to dark / light theme automatically.
 * Green triangle accent is fixed-colour (brand element).
 */
export default function AHMLogo({
  height = 30,
  className = "",
  grayscale = false,
}: AHMLogoProps) {
  const width = Math.round(height * (196 / 76));
  const style: React.CSSProperties = grayscale
    ? { filter: "grayscale(1) opacity(0.55)" }
    : {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 196 76"
      width={width}
      height={height}
      fill="none"
      style={style}
      className={className}
      aria-label="AHM Securities"
      role="img"
    >
      <defs>
        <linearGradient
          id="ahm-logo-g"
          x1="31" y1="18" x2="31" y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
      </defs>

      {/* Green triangle — rendered behind Λ, visible through the hollow counter */}
      <polygon points="31,8 13,58 49,58" fill="url(#ahm-logo-g)" />

      {/* Λ (A) letterform — non-zero winding creates hollow interior */}
      <path
        d="M 0,62 L 31,4 L 62,62 L 51,62 L 31,18 L 11,62 Z"
        fill="currentColor"
      />

      {/* H */}
      <rect x="72"  y="4"  width="11" height="58" fill="currentColor" />
      <rect x="83"  y="29" width="19" height="8"  fill="currentColor" />
      <rect x="102" y="4"  width="11" height="58" fill="currentColor" />

      {/* M */}
      <rect x="125" y="4"  width="11" height="58" fill="currentColor" />
      <polygon points="136,4 148,4 158,38 146,38"  fill="currentColor" />
      <polygon points="146,38 158,38 179,4 167,4"  fill="currentColor" />
      <rect x="179" y="4"  width="11" height="58" fill="currentColor" />

      {/* SECURITIES wordmark */}
      <text
        x="95"
        y="74"
        textAnchor="middle"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="10"
        fontWeight="500"
        letterSpacing="4"
        fill="currentColor"
      >
        SECURITIES
      </text>
    </svg>
  );
}
