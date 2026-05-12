interface StatCardProps {
  label: string;
  value: string;
  /** Optional sub-label below the value */
  sub?: string;
  /** Color the value text */
  positive?: boolean;
  negative?: boolean;
}

export default function StatCard({
  label,
  value,
  sub,
  positive,
  negative,
}: StatCardProps) {
  const valueColor = positive
    ? "text-emerald-400"
    : negative
    ? "text-red-400"
    : "text-white";

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <p className={`text-base font-semibold tabular-nums ${valueColor}`}>
        {value}
      </p>
      {sub && (
        <p className="text-xs text-gray-600 font-mono mt-1">{sub}</p>
      )}
    </div>
  );
}
