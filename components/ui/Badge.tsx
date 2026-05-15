// components/ui/Badge.tsx

type Variant = "gain" | "loss" | "neutral" | "warning" | "info" | "sector";
type Size    = "sm" | "md";

const VARIANT_CLASSES: Record<Variant, string> = {
  gain:    "text-gain    bg-gain/10    border-gain/30    hover:bg-gain/20    hover:border-gain/60",
  loss:    "text-loss    bg-loss/10    border-loss/30    hover:bg-loss/20    hover:border-loss/60",
  neutral: "text-tx-secondary bg-raised border-border-theme",
  warning: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  info:    "text-blue-400  bg-blue-400/10  border-blue-400/30",
  sector:  "text-gain    bg-gain/10    border-gain/30    hover:bg-gain/20    hover:border-gain/60",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-[10px] px-2   py-0.5 gap-1",
  md: "text-xs     px-3   py-1.5 gap-1",
};

type BadgeProps = {
  label: string;
  variant?: Variant;
  size?: Size;
  /** Optional arrow/icon suffix — pass true for ↗, or a custom string */
  arrow?: boolean | string;
  className?: string;
};

/**
 * Shared badge / pill chip.
 *
 * @example
 * <Badge label="+2.41%" variant="gain" />
 * <Badge label="High Risk" variant="warning" size="sm" />
 * <Badge label="Automobile" variant="sector" arrow />
 */
export default function Badge({
  label,
  variant  = "neutral",
  size     = "md",
  arrow,
  className = "",
}: BadgeProps) {
  const arrowStr =
    arrow === true ? "↗" : typeof arrow === "string" ? arrow : null;

  return (
    <span
      className={[
        "inline-flex items-center font-semibold font-mono rounded-full border transition-all select-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
      {arrowStr && (
        <span style={{ fontSize: "10px", opacity: 0.8 }}>{arrowStr}</span>
      )}
    </span>
  );
}
