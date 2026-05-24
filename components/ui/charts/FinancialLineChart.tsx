// components/ui/charts/FinancialLineChart.tsx
//
// Multi-metric ratio trend line chart over reporting periods.
// Ideal for margins (net_margin, ebitda_margin, gross_margin),
// returns (roe, roa, roce), and banking-specific ratios (nim, casa_ratio).
//
// Usage — single metric:
//   <FinancialLineChart
//     data={history}
//     metrics={[{ key: 'roe', label: 'ROE' }]}
//     unit="%"
//   />
//
// Usage — multi-metric overlay:
//   <FinancialLineChart
//     data={history}
//     metrics={[
//       { key: 'gross_margin', label: 'Gross' },
//       { key: 'ebitda_margin', label: 'EBITDA' },
//       { key: 'net_margin',   label: 'Net' },
//     ]}
//     unit="%"
//   />

'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartColors } from './ChartWrapper';
import type { FinancialMetrics } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MetricConfig = {
  key:    keyof FinancialMetrics;
  label:  string;
  /** Override line color — falls back to LINE_PALETTE by index. */
  color?: string;
};

type FinancialLineChartProps = {
  data:    FinancialMetrics[];
  metrics: MetricConfig[];
  /** Unit appended to axis ticks and tooltip values (default: "%"). */
  unit?:   string;
};

// ─── Palette ──────────────────────────────────────────────────────────────────
// Draw from gain + institutional accent tones. Never warm red (reserved for loss).

const LINE_PALETTE = [
  '#22c55e', // gain green  — primary series
  '#3b82f6', // AHM blue    — secondary
  '#a78bfa', // violet      — tertiary
  '#f59e0b', // amber       — quaternary
  '#67e8f9', // cyan        — quinary
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

type TooltipEntry = { name: string; value: number; color: string };

type TooltipProps = {
  active?:  boolean;
  payload?: TooltipEntry[];
  label?:   string;
  metrics:  MetricConfig[];
  unit:     string;
  colors:   ReturnType<typeof useChartColors>;
};

function LineTooltip({ active, payload, label, metrics, unit, colors }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
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
        lineHeight:      '1.8',
      }}
    >
      <p style={{ color: colors.textSecondary, marginBottom: 4 }}>{label}</p>
      {payload.map((entry) => {
        const cfg = metrics.find((m) => (m.key as string) === entry.name);
        return (
          <p key={entry.name}>
            <span style={{ color: entry.color }}>{cfg?.label ?? entry.name}</span>
            {' '}
            <span style={{ color: colors.textPrimary }}>
              {entry.value.toFixed(2)}{unit}
            </span>
          </p>
        );
      })}
    </div>
  );
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export default function FinancialLineChart({
  data,
  metrics,
  unit = '%',
}: FinancialLineChartProps) {
  const colors = useChartColors();

  // Build flat chart data: one row per period, one key per metric
  const chartData = data
    .filter((d) => metrics.some((m) => (d[m.key] as number | null) != null))
    .slice(-8)
    .map((d) => {
      const row: Record<string, string | number> = { period: d.period };
      metrics.forEach((m) => {
        const val = d[m.key] as number | null;
        if (val != null) row[m.key as string] = val;
      });
      return row;
    });

  if (chartData.length === 0) return null;

  const showLegend = metrics.length > 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 0, left: 4 }}
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
          tickFormatter={(v: number) => `${v.toFixed(1)}${unit}`}
          tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />

        <Tooltip
          content={
            <LineTooltip metrics={metrics} unit={unit} colors={colors} />
          }
          cursor={{ stroke: colors.bgBorder, strokeWidth: 1 }}
        />

        {showLegend && (
          <Legend
            wrapperStyle={{
              fontSize:   '11px',
              fontFamily: 'monospace',
              color:      colors.textSecondary,
              paddingTop: '8px',
            }}
            formatter={(value: string) => {
              const cfg = metrics.find((m) => (m.key as string) === value);
              return cfg?.label ?? value;
            }}
          />
        )}

        {metrics.map((m, i) => {
          const lineColor = m.color ?? LINE_PALETTE[i % LINE_PALETTE.length];
          return (
            <Line
              key={m.key as string}
              type="monotone"
              dataKey={m.key as string}
              stroke={lineColor}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
              connectNulls
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
