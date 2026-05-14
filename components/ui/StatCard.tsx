interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  negative?: boolean;
}

export default function StatCard({ label, value, sub, positive, negative }: StatCardProps) {
  const valueColor = positive ? "text-gain" : negative ? "text-loss" : "text-tx-primary";
  return (
    <div className="bg-surface border border-border-theme rounded-xl p-4">
      <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-1.5">{label}</p>
      <p className={"text-base font-semibold tabular-nums " + valueColor}>{value}</p>
      {sub && <p className="text-xs text-tx-disabled font-mono mt-1">{sub}</p>}
    </div>
  );
}
