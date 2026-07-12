import type { ReactNode } from "react";
import { MiniTrend } from "@/components/ui/charts";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  /** Small change indicator, e.g. "+12%". */
  delta?: { value: string; direction?: "up" | "down" | "flat" };
  /** Optional sparkline series rendered along the bottom. */
  trend?: number[];
  /** Accent colour for the icon + trend (CSS colour, e.g. var(--chart-2)). */
  accent?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  delta,
  trend,
  accent = "var(--chart-1)",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "glass-card group relative overflow-hidden p-5 transition-shadow duration-150 hover:shadow-md",
        className,
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <p className="text-xs font-medium text-fg-subtle">{label}</p>
        {icon ? (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-line/50"
            style={{
              color: accent,
              background: "color-mix(in oklab, currentColor 10%, var(--surface))",
            }}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-2">
        <p className="min-w-0 break-words text-2xl font-semibold tracking-tight text-fg tabular-nums sm:text-3xl">
          {value}
        </p>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
              delta.direction === "down"
                ? "bg-danger-bg text-danger ring-danger-line/40"
                : delta.direction === "flat"
                  ? "bg-surface-muted text-fg-subtle ring-line/50"
                  : "bg-success-bg text-success ring-success-line/40",
            )}
          >
            {delta.value}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1.5 font-mono text-xs text-fg-subtle">{hint}</p> : null}
      {trend && trend.length > 1 ? (
        <MiniTrend data={trend} color={accent} className="mt-4" />
      ) : null}
    </div>
  );
}

type PageShellProps = {
  title: string;
  description?: string;
  moduleLabel?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  title,
  description,
  moduleLabel,
  icon,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl animate-fade-in space-y-6">
      <div className="border-b border-line pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            {icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600 ring-1 ring-inset ring-brand-500/20 sm:h-11 sm:w-11 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-400/20">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0">
              {moduleLabel ? (
                <p className="text-xs font-medium text-fg-subtle">Module {moduleLabel}</p>
              ) : null}
              <h1 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl lg:text-3xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-3xl text-sm/6 text-fg-muted">{description}</p>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  /** Stable per-row key (avoids index keys so re-sorted/filtered tables reconcile correctly). */
  rowKey?: (row: T, index: number) => string | number;
};

export function DataTable<T>({
  columns,
  rows,
  emptyMessage = "No rows",
  rowKey,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface-muted/30 px-6 py-12 text-center">
        <p className="text-sm font-medium text-fg-muted">{emptyMessage}</p>
        <p className="mt-1 text-xs text-fg-faint">Nothing to show for the current filters.</p>
      </div>
    );
  }
  return (
    <div className="flow-root min-w-0 max-w-full">
      <div className="-mx-4 overflow-x-auto overscroll-x-contain sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-line/80">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-surface-muted/70">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={cn(
                        "px-4 py-3.5 text-left text-xs font-semibold text-fg-subtle",
                        col.className,
                      )}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {rows.map((row, index) => (
                  <tr
                    key={rowKey ? rowKey(row, index) : index}
                    className="transition-colors hover:bg-surface-hover/60"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("whitespace-nowrap px-4 py-3.5 text-fg-muted", col.className)}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

type SectionCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  description,
  icon,
  action,
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  return (
    <section className={cn("glass-card overflow-hidden", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface-muted/30 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {icon ? (
            <span className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden>
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-fg">{title}</h2>
            {description ? <p className="mt-0.5 text-sm text-fg-subtle">{description}</p> : null}
          </div>
        </div>
        {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
      </div>
      <div className={cn("px-4 py-5 sm:px-6 sm:py-6", contentClassName)}>{children}</div>
    </section>
  );
}
