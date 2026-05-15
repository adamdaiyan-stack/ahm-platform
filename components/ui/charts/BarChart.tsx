// components/ui/charts/BarChart.tsx
// Horizontal bar chart using CSS — no external chart library required.
// Follows AHM design tokens for consistent axis, tooltip, and color theming.

type BarChartItem = {
  /** Display label on the left axis */
  label: string;
  /** Numeric value — bar width is proportional to the max value in the dataset */
  value: number;
  /** Override bar color — defaults to accent-gain */
  color?: string;
  /** Highlight this bar (bolder label, slightly different bar color) */
  highlight?: boolean;
};

type BarChartProps = {
  items: BarChartItem[];
  /** Unit suffix appended to the value in the tooltip/label (e.g. "%", "B") */
  unit?: string;
  /** Fixed max value — if omitted, derived from the dataset */
  max?: number;
  /** Show numeric value label at the end of each bar */
  showValues?: boolean;
  /** Height of each bar row in px (default 28) */
  rowHeight?: number;
  className?: string;
};

/**
 * Shared horizontal bar chart using CSS proportional widths.
 *
 * @example
 * <BarChart
 *   items={BANK_PROFILES.map(p => ({ label: p.sym, value: p.casa, highlight: selected.includes(p.sym) }))}
 *   unit="%"
 *   showValues
 * />
 */
export default function BarChart({
  items,
  unit       = "",
  max,
  showValues = true,
  rowHeight  = 28,
  className  = "",
}: BarChartProps) {
  const peak = max ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={"flex flex-col gap-1 " + className} role="img" aria-label="Bar chart">
      {items.map((item) => {
        const pct = Math.min((item.value / peak) * 100, 100);
        const barColor = item.color
          ?? (item.highlight ? "var(--color-gain)" : "var(--color-gain, #16a34a)");
        const opacity  = item.highlight ? 1 : 0.45;

        return (
          <div
            key={item.label}
            className="flex items-center gap-3"
            style={{ height: rowHeight }}
          >
            {/* Label */}
            <span
              className={
                "text-xs font-mono w-12 flex-shrink-0 text-right transition-colors " +
                (item.highlight ? "text-tx-primary font-semibold" : "text-tx-disabled")
              }
            >
              {item.label}
            </span>

            {/* Track + bar */}
            <div className="flex-1 relative h-2 bg-raised rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                style={{
                  width:           pct + "%",
                  backgroundColor: barColor,
                  opacity,
                }}
              />
            </div>

            {/* Value label */}
            {showValues && (
              <span
                className={
                  "text-xs font-mono tabular-nums w-12 flex-shrink-0 " +
                  (item.highlight ? "text-tx-primary font-semibold" : "text-tx-disabled")
                }
              >
                {item.value}{unit}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
