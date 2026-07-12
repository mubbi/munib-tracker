import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Dependency-free, theme-aware SVG charts. Every colour is sourced from the
 * `--chart-*` CSS variables (see globals.css) so charts flip with light/dark
 * automatically. All components are server-renderable (no client JS).
 */

/** Categorical palette — resolves to the live theme value at render time. */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
] as const;

export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

function defaultFormat(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Shared track + fill used by BarList and ProgressRow. */
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-track">
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* BarList — horizontal, ranked bars with inline values                       */
/* -------------------------------------------------------------------------- */

export type BarDatum = { label: string; value: number; hint?: string };

type BarListProps = {
  data: BarDatum[];
  /** Single accent colour for every bar (default: brand green). */
  color?: string;
  /** Colour each bar by its index using the categorical palette. */
  colorByIndex?: boolean;
  valueFormatter?: (n: number) => string;
  emptyMessage?: string;
  className?: string;
  maxRows?: number;
};

export function BarList({
  data,
  color = "var(--chart-1)",
  colorByIndex = false,
  valueFormatter = defaultFormat,
  emptyMessage = "No data",
  className,
  maxRows,
}: BarListProps) {
  const rows = maxRows ? data.slice(0, maxRows) : data;
  if (rows.length === 0) {
    return <EmptyChart message={emptyMessage} />;
  }
  const max = Math.max(...rows.map((d) => d.value), 1);

  return (
    <div className={cn("space-y-2.5", className)}>
      {rows.map((row, i) => {
        const pct = Math.max((row.value / max) * 100, row.value > 0 ? 2 : 0);
        return (
          <div key={row.label} className="group">
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-fg-muted" title={row.hint ?? row.label}>
                {row.label}
              </span>
              <span className="shrink-0 font-mono text-[13px] tabular-nums text-fg">
                {valueFormatter(row.value)}
              </span>
            </div>
            <Bar pct={pct} color={colorByIndex ? chartColor(i) : color} />
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DonutChart — ring segments with a centred total + legend                   */
/* -------------------------------------------------------------------------- */

export type DonutDatum = { label: string; value: number };

type DonutChartProps = {
  data: DonutDatum[];
  /** Centre headline value (defaults to the sum). */
  centerValue?: ReactNode;
  centerLabel?: string;
  valueFormatter?: (n: number) => string;
  emptyMessage?: string;
  size?: number;
  thickness?: number;
  className?: string;
};

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  valueFormatter = defaultFormat,
  emptyMessage = "No data",
  size = 168,
  thickness = 18,
  className,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (data.length === 0 || total === 0) {
    return <EmptyChart message={emptyMessage} />;
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const gap = data.length > 1 ? 2 : 0; // px gap between segments

  const fractions = data.map((d) => d.value / total);
  // Cumulative fraction *before* each segment, computed without mutation.
  const startFraction = (i: number) => fractions.slice(0, i).reduce((sum, f) => sum + f, 0);
  const segments = fractions.map((fraction, i) => {
    const len = Math.max(fraction * circumference - gap, 0);
    return {
      label: data[i]?.label ?? `segment-${i}`,
      color: chartColor(i),
      dasharray: `${len} ${circumference - len}`,
      dashoffset: -startFraction(i) * circumference,
    };
  });

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6",
        className,
      )}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--track)"
            strokeWidth={thickness}
          />
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.dashoffset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-semibold tracking-tight text-fg">
            {centerValue ?? valueFormatter(total)}
          </span>
          {centerLabel ? (
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
              {centerLabel}
            </span>
          ) : null}
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: chartColor(i) }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-fg-muted" title={d.label}>
              {d.label}
            </span>
            <span className="shrink-0 font-mono text-[13px] tabular-nums text-fg">
              {valueFormatter(d.value)}
            </span>
            <span className="w-11 shrink-0 text-right font-mono text-xs tabular-nums text-fg-subtle">
              {((d.value / total) * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MiniTrend — compact area sparkline (e.g. inside a StatCard)                */
/* -------------------------------------------------------------------------- */

type MiniTrendProps = {
  data: number[];
  color?: string;
  className?: string;
  height?: number;
};

export function MiniTrend({
  data,
  color = "var(--chart-1)",
  className,
  height = 40,
}: MiniTrendProps) {
  if (data.length < 2) return null;
  const width = 120;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const y = (v: number) => height - 4 - ((v - min) / range) * (height - 8);
  const points = data.map((v, i) => `${i * stepX},${y(v)}`);
  const line = `M ${points.join(" L ")}`;
  const area = `${line} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ color }}
      aria-hidden="true"
    >
      <path d={area} fill="currentColor" fillOpacity={0.12} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* ProgressRow — labelled single metric with a percent bar                    */
/* -------------------------------------------------------------------------- */

type ProgressRowProps = {
  label: string;
  value: number;
  total: number;
  color?: string;
  className?: string;
};

export function ProgressRow({
  label,
  value,
  total,
  color = "var(--chart-1)",
  className,
}: ProgressRowProps) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-fg-muted">{label}</span>
        <span className="shrink-0 font-mono text-[13px] tabular-nums text-fg">
          {pct.toFixed(1)}%
        </span>
      </div>
      <Bar pct={pct} color={color} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RadialGauge — circular percentage indicator                               */
/* -------------------------------------------------------------------------- */

type RadialGaugeProps = {
  value: number;
  total: number;
  label?: string;
  color?: string;
  size?: number;
  thickness?: number;
  className?: string;
};

export function RadialGauge({
  value,
  total,
  label,
  color = "var(--chart-1)",
  size = 132,
  thickness = 12,
  className,
}: RadialGaugeProps) {
  const pct = total > 0 ? Math.min(value / total, 1) : 0;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const filled = pct * circumference;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ? `${label}: ${(pct * 100).toFixed(0)}%` : `${(pct * 100).toFixed(0)}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--track)"
          strokeWidth={thickness}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-semibold tracking-tight text-fg">
          {(pct * 100).toFixed(0)}%
        </span>
        {label ? (
          <span className="mt-0.5 px-2 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-line px-6 py-8 text-center text-sm text-fg-subtle">
      {message}
    </div>
  );
}
