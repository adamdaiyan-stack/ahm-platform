// components/ui/charts/PriceChart.tsx
//
// Area + volume overlay chart for a company's daily price history.
// Data source: DailyPrice[] passed as props from server component.
// Never fetch data here — pure presentation.
//
// Layout:
//   • Area series (close price) on left Y-axis
//   • Bar series (volume) on right Y-axis, heavily subdued
//   • Gradient fill beneath area curve fades to transparent
//   • Tooltip shows date, close, volume in monospace

'use client';

import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChartColors } from './ChartWrapper';
import type { DailyPrice } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type PriceChartProps = {
  data: DailyPrice[];
};

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00'); // local parse, avoid UTC offset shift
  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
}

function fmtVolume(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
  return String(v);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

type TooltipPayloadEntry = {
  name:  string;
  value: number;
};

type TooltipProps = {
  active?:    boolean;
  payload?:   TooltipPayloadEntry[];
  label?:     string;
  colors:     ReturnType<typeof useChartColors>;
  lineColor:  string;
};

function PriceTooltip({ active, payload, label, colors, lineColor }: TooltipProps) {
  if (!active || !payload || payload.length === 0 || !label) return null;

  const close  = payload.find((p) => p.name === 'close');
  const volume = payload.find((p) => p.name === 'volume');

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
      <p style={{ color: colors.textSecondary, marginBottom: 4 }}>{fmtDate(label)}</p>
      {close  && <p>Close  <span style={{ color: lineColor }}>PKR {close.value.toFixed(2)}</span></p>}
      {volume && <p>Volume <span style={{ color: colors.textSecondary }}>{fmtVolume(volume.value)}</span></p>}
    </div>
  );
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export default function PriceChart({ data }: PriceChartProps) {
  const colors = useChartColors();

  const chartData = data.map((d) => ({
    date:   d.market_date,
    close:  d.close,
    volume: d.volume ?? 0,
  }));

  // Direction: compare first to last close to determine color
  // A down-trending chart should be red; up-trending green.
  const firstClose = data.length > 0 ? data[0].close : null;
  const lastClose  = data.length > 0 ? data[data.length - 1].close : null;
  const isDown     = firstClose != null && lastClose != null && lastClose < firstClose;
  const lineColor  = isDown ? colors.loss : colors.gain;

  // Domain: add 2% breathing room around close range
  const closes    = data.map((d) => d.close);
  const minClose  = closes.length ? Math.min(...closes) * 0.98 : 0;
  const maxClose  = closes.length ? Math.max(...closes) * 1.02 : 100;

  // Unique gradient ID per direction to avoid conflicts when multiple charts render
  const gradientId = isDown ? "priceAreaGradientDown" : "priceAreaGradientUp";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 8, right: 12, bottom: 0, left: 4 }}
      >
        {/* Gradient fill — color adapts to price direction */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={lineColor} stopOpacity={0.18} />
            <stop offset="95%" stopColor={lineColor} stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 4"
          stroke={colors.bgBorder}
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tickFormatter={fmtDate}
          tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          minTickGap={48}
          dy={4}
        />

        {/* Price — left axis */}
        <YAxis
          yAxisId="price"
          orientation="left"
          domain={[minClose, maxClose]}
          tickFormatter={(v: number) => v.toFixed(0)}
          tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          width={44}
        />

        {/* Volume — right axis, no tick labels (just visual scale) */}
        <YAxis
          yAxisId="volume"
          orientation="right"
          tickFormatter={fmtVolume}
          tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          width={36}
          tickCount={3}
        />

        <Tooltip
          content={<PriceTooltip colors={colors} lineColor={lineColor} />}
          cursor={{ stroke: colors.bgBorder, strokeWidth: 1 }}
        />

        {/* Volume bars — behind price area, very muted */}
        <Bar
          yAxisId="volume"
          dataKey="volume"
          fill={colors.textSecondary}
          opacity={0.20}
          radius={[2, 2, 0, 0]}
          maxBarSize={8}
        />

        {/* Price area — rendered on top, color tracks direction */}
        <Area
          yAxisId="price"
          type="monotone"
          dataKey="close"
          stroke={lineColor}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
