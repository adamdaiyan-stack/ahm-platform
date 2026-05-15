// components/ui/StatCard.tsx — shared metric/stat display card

type StatCardProps = {
  label:     string;
  value:     string;
  sub?:      string;
  positive?: boolean;
  negative?: boolean;
  /**
   * "md" = default compact card (p-4, text-base value)
   * "lg" = larger hero card (p-4, text-xl value) — used in Market Dashboard stats strip
   */
  size?: "md" | "lg";
  className?: string;
};

export default function StatCard({
  label,
  value,
  sub,
  positive,
  negative,
  size      = "md",
  className = "",
}: StatCardProps) {
  const valueColor = positive ? "text-gain" : negative ? "text-loss" : "text-tx-primary";
  const valueSize  = size === "lg" ? "text-xl" : "text-base";

  return (
    <div className={"bg-surface border border-border-theme rounded-xl p-4 " + className}>
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <p className={"font-bold tabular-nums font-mono " + valueSize + " " + valueColor}>
        {value}
      </p>
      {sub && (
        <p className="text-xs text-tx-disabled font-mono mt-1">{sub}</p>
      )}
    </div>
  );
}
