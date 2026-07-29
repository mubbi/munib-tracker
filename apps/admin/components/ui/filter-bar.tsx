import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { controlClasses } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  /** Base page path (GET target + the "Clear" destination). */
  action: string;
  /** Filter controls — typically `<FilterField>`s. */
  children: ReactNode;
  /** Show the "Clear" link when any filter is active. */
  active?: boolean;
  /** Hidden params to preserve on submit (e.g. a tab id). `page` is intentionally dropped. */
  hidden?: Record<string, string | undefined>;
  applyLabel?: string;
  title?: string;
};

/** A GET filter form inside a panel: labeled controls + Apply / Clear. Submitting resets `page`. */
export function FilterBar({
  action,
  children,
  active,
  hidden,
  applyLabel = "Apply filters",
  title = "Filters",
}: FilterBarProps) {
  return (
    <section className="glass-card min-w-0 overflow-hidden">
      <div className="flex min-w-0 items-center gap-2 border-b border-line bg-surface-muted/30 px-4 py-3 sm:px-5">
        <SlidersHorizontal className="h-4 w-4 text-fg-faint" aria-hidden />
        <h2 className="text-sm font-semibold text-fg">{title}</h2>
        {active ? (
          <span className="ml-1 rounded-md bg-brand-600/10 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-brand-500/20 dark:text-brand-300">
            Active
          </span>
        ) : null}
      </div>
      <form
        method="get"
        action={action}
        className="flex min-w-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-end sm:px-5"
      >
        {hidden
          ? Object.entries(hidden).map(([key, value]) =>
              value ? <input key={key} type="hidden" name={key} value={value} /> : null,
            )
          : null}
        {children}
        <div className="flex w-full items-center justify-end gap-2 pt-1 sm:ml-auto sm:w-auto">
          {active ? (
            <Link href={action} className={buttonClasses("ghost", undefined, "sm")}>
              Clear
            </Link>
          ) : null}
          <Button type="submit" variant="secondary" size="sm">
            {applyLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}

/** Compact labeled control for a FilterBar (label above a bordered input/select). */
export function FilterField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: children are FilterBar form controls
    <label
      className={cn(
        "flex w-full min-w-0 flex-col gap-1.5 text-sm/6 font-medium text-fg sm:w-auto sm:min-w-[8rem]",
        className,
      )}
    >
      {label}
      {children}
    </label>
  );
}

/** Shared compact sizing for inputs/selects placed inside a FilterBar. */
export const FILTER_CONTROL_CLASS = controlClasses("sm", "sm:w-auto sm:min-w-[8rem]");
