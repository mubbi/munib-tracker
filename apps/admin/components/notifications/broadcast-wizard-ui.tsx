"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";

type CharCountFieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
  compact?: boolean;
};

export function CharCountField({
  label,
  hint,
  required,
  maxLength,
  value,
  onChange,
  multiline = false,
  rows = 2,
  disabled,
  placeholder,
  compact = false,
}: CharCountFieldProps) {
  const remaining = maxLength - value.length;
  const nearLimit = remaining <= Math.ceil(maxLength * 0.15);

  const inputClass = cn(
    "w-full rounded-md border border-line bg-surface text-fg shadow-xs",
    "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60",
    compact ? "px-2.5 py-1.5 text-sm" : "rounded-lg px-3 py-2 text-sm",
  );

  const control = multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      maxLength={maxLength}
      required={required}
      disabled={disabled}
      rows={rows}
      placeholder={placeholder}
      className={inputClass}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      maxLength={maxLength}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={inputClass}
    />
  );

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: control is a native input/textarea assigned above
    <label className="flex flex-col gap-1">
      <span className={cn("font-medium text-fg", compact ? "text-xs" : "text-sm/6")}>
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {control}
      <div className="flex items-center justify-between gap-2">
        {hint && !compact ? (
          <p className="text-[11px] leading-snug text-fg-subtle">{hint}</p>
        ) : (
          <span />
        )}
        <p
          className={cn(
            "ml-auto shrink-0 text-[11px] tabular-nums",
            nearLimit ? "font-medium text-warning" : "text-fg-subtle",
          )}
          aria-live="polite"
        >
          {value.length}/{maxLength}
        </p>
      </div>
    </label>
  );
}

type WizardStepIndicatorProps = {
  steps: readonly { id: string; label: string }[];
  currentIndex: number;
};

export function WizardStepIndicator({ steps, currentIndex }: WizardStepIndicatorProps) {
  return (
    <nav aria-label="Broadcast wizard progress" className="mb-4">
      <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-muted/30 p-1">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div
              key={step.id}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-center transition-colors",
                active && "bg-surface text-fg shadow-sm ring-1 ring-line",
                done && !active && "text-fg-muted",
                !done && !active && "text-fg-subtle",
              )}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  done
                    ? "bg-brand-600 text-white"
                    : active
                      ? "bg-brand-600/15 text-brand-600 dark:text-brand-300"
                      : "bg-surface-muted text-fg-subtle",
                )}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className={cn("truncate text-xs font-medium", active && "font-semibold")}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-center text-[11px] text-fg-subtle sm:hidden">
        Step {currentIndex + 1} of {steps.length}
      </p>
    </nav>
  );
}

export function WizardPanel({
  title,
  description,
  children,
  compact,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  if (!title) {
    return <section className="space-y-3">{children}</section>;
  }
  return (
    <section className={cn(compact ? "space-y-3" : "space-y-4")}>
      {(title || description) && (
        <header className="space-y-0.5">
          <h2 className="text-sm font-semibold text-fg">{title}</h2>
          {description ? <p className="text-xs text-fg-muted">{description}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}

export function CollapsibleSection({
  title,
  badge,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: ReactNode;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="overflow-hidden rounded-lg border border-line/70 bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-surface-muted/40"
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-fg-subtle transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-fg">{title}</span>
            {badge}
          </span>
          {!open && summary ? (
            <span className="mt-0.5 block truncate text-[11px] text-fg-subtle">{summary}</span>
          ) : null}
        </span>
      </button>
      {open ? (
        <div id={panelId} className="border-t border-line/60 px-3 pb-3 pt-2.5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function ToggleChip({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex flex-1 items-center gap-2 rounded-md border px-2.5 py-2 text-left transition-colors",
        checked
          ? "border-brand-500/60 bg-brand-600/5 ring-1 ring-brand-500/20"
          : "border-line bg-surface hover:bg-surface-muted/50",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold",
          checked ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface",
        )}
        aria-hidden
      >
        {checked ? "✓" : ""}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-fg">{label}</span>
        {description ? (
          <span className="block text-[10px] leading-snug text-fg-subtle">{description}</span>
        ) : null}
      </span>
    </button>
  );
}

export function WizardFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 mt-4 border-t border-line bg-canvas/90 px-1 py-3 backdrop-blur-sm">
      {children}
    </div>
  );
}

export function ReachBadge({
  count,
  loading,
  filterCount,
}: {
  count: number | null;
  loading?: boolean;
  filterCount: number;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-fg-subtle">
        Calculating…
      </span>
    );
  }
  if (count == null) {
    return (
      <span className="inline-flex items-center rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-fg-subtle">
        Reach not previewed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-600/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-brand-700 dark:text-brand-300">
      {formatNumber(count)} users
      {filterCount > 0 ? (
        <span className="font-normal text-fg-subtle">· {filterCount} filters</span>
      ) : null}
    </span>
  );
}
