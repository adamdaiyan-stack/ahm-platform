// components/ui/charts/FinancialBarChart.tsx
//
// Period-over-period bar chart for a single FinancialMetrics field.
// Renders up to 8 periods (most recent first) on the X-axis.
// Bars are gain-colored when value ≥ 0, loss-colored when negative.
//
// Usage:
//   <FinancialBarChart data={history} metric="revenue" label="Revenue (PKR B)" />
//   <FinancialBarChart data={history} metric="eps"     label="EPS (PKR)" formatter={(v) => v.toFixed(2)} />

'use client';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChartColors } from './ChartWrapper';
import type { FinancialMetrics } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type FinancialBarChartProps = {
  data:       FinancialMetrics[];
  /** FinancialMetrics field to chart — must resolve to number | null. */
  metric:     keyof FinancialMetrics;
  /** Human-readable label shown in tooltip. */
  label:      string;
  /** Value formatter for axis ticks and tooltip (default: auto-scale to B/M/K). */
  formatter?: (v: number) => string;
};

// ─── Formatters ───────────────────────────────────────────────────────────────

function defaultFmt(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + 'B';
  if (abs >= 1_000_000)     return (v / 1_000_000).toFixed(1) + 'M';
  if (abs >= 1_000)         return (v / 1_000).toFixed(1) + 'K';
  return v.toFixed(2);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

type TooltipEntry = { name: string; value: number };

type TooltipProps = {
  active?:  boolean;
  payload?: TooltipEntry[];
  label?:   string;
  chartLabel: string;
  formatter:  (v: number) => string;
  colors:     ReturnType<typeof useChartColors>;
};

function BarTooltip({ active, payload, label, chartLabel, formatter, colors }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const val = payload[0]?.value;
  if (val == null) return null;
  return (
    <div
      style={{
        backgroundColor: colors.bgRaised,
        border:          `1px solid ${colors.bgBorder}`,
        borderRadius:    '8px',
        padding:         '8px 12px',
        fontFamily:      'monospace',
        fontSize:        '12px',
        color:           colors.textPrimary,
        lineHeight:      '1.6',
      }}
    >
      <p style={{ color: colors.textSecondary, marginBottom: 4 }}>{label}</p>
      <p>
        {chartLabel}{' '}
        <span style={{ color: val >= 0 ? colors.gain : colors.loss }}>
          {formatter(val)}
        </span>
      </p>
    </div>
  );
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export default function FinancialBarChart({
  data,
  metric,
  label,
  formatter = defaultFmt,
}: FinancialBarChartProps) {
  const colors = useChartColors();

  // Filter to periods that have data for this metric, take last 8 chronologically
  const chartData = data
    .filter((d) => (d[metric] as number | null) != null)
    .slice(-8)
    .map((d) => ({
      period: d.period,
      value:  d[metric] as number,
    }));

  if (chartData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 0, left: 4 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 4"
          stroke={colors.bgBorder}
          vertical={false}
        />

        <XAxis
          dataKey="period"
          tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          dy={4}
        />

        <YAxis
          tickFormatter={formatter}
          tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />

        <Tooltip
          content={
            <BarTooltip
              chartLabel={label}
              formatter={formatter}
              colors={colors}
            />
          }
          cursor={{ fill: colors.bgBorder, opacity: 0.4 }}
        />

        <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={40}>
          {chartData.map((entry) => (
            <Cell
              key={entry.period}
              fill={entry.value >= 0 ? colors.gain : colors.loss}
              fillOpacity={0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
