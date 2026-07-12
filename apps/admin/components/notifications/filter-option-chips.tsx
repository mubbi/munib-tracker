"use client";

import type { BroadcastFilterOption } from "@/lib/notifications/broadcastFilterOptions";
import { cn, formatNumber } from "@/lib/utils";

type FilterOptionChipsProps = {
  label: string;
  hint?: string;
  options: BroadcastFilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  emptyMessage?: string;
  compact?: boolean;
};

const chipBase = (active: boolean, disabled?: boolean, compact?: boolean) =>
  cn(
    "inline-flex items-center gap-1 font-medium ring-1 ring-inset transition-colors",
    compact ? "rounded-md px-2 py-0.5 text-xs" : "rounded-lg px-3 py-1.5 text-sm",
    active
      ? "bg-brand-600 text-white ring-brand-600"
      : "bg-surface text-fg-muted ring-line hover:bg-surface-muted hover:text-fg",
    disabled && "pointer-events-none opacity-60",
  );

export function FilterOptionChips({
  label,
  hint,
  options,
  selected,
  onChange,
  disabled,
  emptyMessage = "No options available from app data yet.",
  compact,
}: FilterOptionChipsProps) {
  const toggle = (value: string) => {
    if (disabled) return;
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <div className="sm:col-span-2">
      <p className={cn("font-medium text-fg", compact ? "text-xs" : "text-sm")}>{label}</p>
      {hint && !compact ? <p className="mt-0.5 text-xs text-fg-subtle">{hint}</p> : null}
      {options.length === 0 ? (
        <p className="mt-2 text-sm text-fg-muted">{emptyMessage}</p>
      ) : (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {options.map((option) => {
            const active = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => toggle(option.value)}
                className={chipBase(active, disabled, compact)}
              >
                <span>{option.label}</span>
                {option.count != null ? (
                  <span
                    className={cn(
                      "rounded px-1 text-xs tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-surface-muted text-fg-subtle",
                    )}
                  >
                    {formatNumber(option.count)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
      {selected.length > 0 ? (
        <button
          type="button"
          disabled={disabled}
          className="mt-2 text-xs font-medium text-brand-600 hover:underline disabled:opacity-50"
          onClick={() => onChange([])}
        >
          Clear selection
        </button>
      ) : null}
    </div>
  );
}

type SingleSelectChipsProps = {
  label: string;
  hint?: string;
  options: BroadcastFilterOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  allowClear?: boolean;
  compact?: boolean;
};

export function SingleSelectChips({
  label,
  hint,
  options,
  value,
  onChange,
  disabled,
  allowClear = true,
  compact,
}: SingleSelectChipsProps) {
  return (
    <div className="sm:col-span-2">
      <p className={cn("font-medium text-fg", compact ? "text-xs" : "text-sm")}>{label}</p>
      {hint && !compact ? <p className="mt-0.5 text-xs text-fg-subtle">{hint}</p> : null}
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {allowClear ? (
          <button
            type="button"
            disabled={disabled}
            aria-pressed={value == null}
            onClick={() => onChange(undefined)}
            className={chipBase(value == null, disabled, compact)}
          >
            Any
          </button>
        ) : null}
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onChange(active && allowClear ? undefined : option.value)}
              className={chipBase(active, disabled, compact)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type TriStateChipsProps = {
  label: string;
  hint?: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  yesLabel?: string;
  noLabel?: string;
  disabled?: boolean;
  compact?: boolean;
};

export function TriStateChips({
  label,
  hint,
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
  disabled,
  compact,
}: TriStateChipsProps) {
  const items: { id: "any" | "yes" | "no"; label: string; v: boolean | undefined }[] = [
    { id: "any", label: "Any", v: undefined },
    { id: "yes", label: yesLabel, v: true },
    { id: "no", label: noLabel, v: false },
  ];

  return (
    <div>
      <p className={cn("font-medium text-fg", compact ? "text-xs" : "text-sm")}>{label}</p>
      {hint && !compact ? <p className="mt-0.5 text-xs text-fg-subtle">{hint}</p> : null}
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((item) => {
          const active = value === item.v;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onChange(item.v)}
              className={chipBase(active, disabled, compact)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
