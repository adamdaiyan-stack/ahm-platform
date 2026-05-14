interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  size?: "lg" | "md" | "sm";
}

export default function SectionTitle({ eyebrow, title, subtitle, size = "lg" }: SectionTitleProps) {
  const titleClass =
    size === "lg" ? "text-3xl font-bold text-tx-primary"
    : size === "md" ? "text-xl font-bold text-tx-primary"
    : "text-base font-semibold text-tx-primary";

  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-2">{eyebrow}</p>
      )}
      <h1 className={titleClass}>{title}</h1>
      {subtitle && <p className="text-tx-secondary text-sm mt-2 max-w-xl">{subtitle}</p>}
    </div>
  );
}
