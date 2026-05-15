// components/ui/Card.tsx
import type { ElementType, ComponentPropsWithoutRef } from "react";

type Variant = "default" | "interactive" | "flat";
type Padding = "none" | "sm" | "md" | "lg";

const PADDING: Record<Padding, string> = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-7",
};

const BASE =
  "rounded-xl border transition-colors";

const VARIANTS: Record<Variant, string> = {
  default:     "bg-surface border-border-theme",
  interactive: "bg-surface border-border-theme hover:border-tx-secondary cursor-pointer",
  flat:        "bg-raised  border-transparent",
};

type CardOwnProps<E extends ElementType = "div"> = {
  /** Visual style of the card */
  variant?: Variant;
  /** Internal padding shorthand */
  padding?: Padding;
  /** Render as a different HTML element or Next.js Link */
  as?: E;
  className?: string;
  children?: React.ReactNode;
};

type CardProps<E extends ElementType = "div"> = CardOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof CardOwnProps<E>>;

/**
 * Shared surface card.
 *
 * @example
 * // Default container card
 * <Card padding="md">…</Card>
 *
 * @example
 * // Hover-interactive card (e.g. a list item)
 * <Card as={Link} href="/stocks/UBL" variant="interactive" padding="md">…</Card>
 *
 * @example
 * // Flat inset card (nested inside another card)
 * <Card variant="flat" padding="sm">…</Card>
 */
export default function Card<E extends ElementType = "div">({
  variant  = "default",
  padding  = "none",
  as,
  className = "",
  children,
  ...rest
}: CardProps<E>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={[BASE, VARIANTS[variant], PADDING[padding], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
