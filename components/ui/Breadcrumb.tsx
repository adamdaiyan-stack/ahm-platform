// components/ui/Breadcrumb.tsx
// Reusable breadcrumb navigation component.
// Renders a hierarchical path — last item is the current page (no link).

import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={["flex items-center gap-1.5 text-xs font-mono text-tx-disabled", className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="opacity-40">/</span>}
            {isLast || !item.href ? (
              <span className={isLast ? "text-tx-secondary" : ""}>{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-tx-secondary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
