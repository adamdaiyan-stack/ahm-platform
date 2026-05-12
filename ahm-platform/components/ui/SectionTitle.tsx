interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Shrink sizing for sub-sections */
  size?: "lg" | "md" | "sm";
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  size = "lg",
}: SectionTitleProps) {
  const titleClass =
    size === "lg"
      ? "text-3xl font-bold text-white"
      : size === "md"
      ? "text-xl font-bold text-white"
      : "text-base font-semibold text-white";

  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className={titleClass}>{title}</h1>
      {subtitle && (
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}
