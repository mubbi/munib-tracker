"use client";

import {
  ADMIN_BROADCAST_FILTER_PRESET_GROUP_LABELS,
  ADMIN_BROADCAST_FILTER_PRESET_GROUPS,
  ADMIN_BROADCAST_FILTER_PRESETS,
  type AdminBroadcastFilterPreset,
  type AdminBroadcastFilterPresetGroup,
} from "@munib-tracker/shared";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatBroadcastFilterSummary } from "@/lib/notifications/broadcastFilterUtils";
import { cn } from "@/lib/utils";

type BroadcastFilterPresetPickerProps = {
  selectedId: string | null;
  onApply: (preset: AdminBroadcastFilterPreset) => void;
  disabled?: boolean;
  hasCustomFilters?: boolean;
};

export function BroadcastFilterPresetPicker({
  selectedId,
  onApply,
  disabled,
  hasCustomFilters,
}: BroadcastFilterPresetPickerProps) {
  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<AdminBroadcastFilterPresetGroup | "all">("all");
  const [pending, setPending] = useState<AdminBroadcastFilterPreset | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ADMIN_BROADCAST_FILTER_PRESETS.filter((preset) => {
      if (group !== "all" && preset.group !== group) return false;
      if (!query) return true;
      const summary = formatBroadcastFilterSummary(preset.filters).join(" ");
      const haystack = [
        preset.name,
        preset.description,
        ADMIN_BROADCAST_FILTER_PRESET_GROUP_LABELS[preset.group],
        summary,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [group, search]);

  const requestApply = (preset: AdminBroadcastFilterPreset) => {
    if (disabled) return;
    if (hasCustomFilters && preset.id !== selectedId) {
      setPending(preset);
      return;
    }
    onApply(preset);
  };

  const confirmApply = () => {
    if (!pending) return;
    onApply(pending);
    setPending(null);
  };

  return (
    <div className="rounded-md border border-line/70 bg-surface-muted/15">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left disabled:opacity-60"
        aria-expanded={expanded}
      >
        <div>
          <p className="text-xs font-semibold text-fg">Audience presets</p>
          <p className="text-[10px] text-fg-subtle">
            {ADMIN_BROADCAST_FILTER_PRESETS.length} ready-made filter combinations
          </p>
        </div>
        <span className="text-fg-subtle" aria-hidden>
          {expanded ? "▾" : "▸"}
        </span>
      </button>

      {expanded ? (
        <div className="space-y-3 border-t border-line/60 px-3 pb-3 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Input is a native <input> via component */}
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-xs font-medium text-fg-subtle">Search presets</span>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Arabic, iOS, inactive 30d…"
                disabled={disabled}
              />
            </label>
            <p className="shrink-0 text-xs text-fg-subtle sm:pb-2">
              {filtered.length} of {ADMIN_BROADCAST_FILTER_PRESETS.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setGroup("all")}
              className={chipClass(group === "all", disabled)}
            >
              All
            </button>
            {ADMIN_BROADCAST_FILTER_PRESET_GROUPS.map((value) => (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => setGroup(value)}
                className={chipClass(group === value, disabled)}
              >
                {ADMIN_BROADCAST_FILTER_PRESET_GROUP_LABELS[value]}
              </button>
            ))}
          </div>

          {pending ? (
            <div className="rounded-lg border border-warning/40 bg-warning/10 p-3">
              <p className="text-sm font-medium text-fg">Replace current filters?</p>
              <p className="mt-1 text-xs text-fg-muted">
                Applying &ldquo;{pending.name}&rdquo; will overwrite all audience filters.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={confirmApply}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Apply preset
                </button>
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-fg-muted ring-1 ring-inset ring-line hover:bg-surface-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <p className="text-sm text-fg-muted">No presets match your search.</p>
          ) : (
            <ul className="grid max-h-60 gap-1.5 overflow-y-auto sm:grid-cols-2">
              {filtered.map((preset) => {
                const active = preset.id === selectedId;
                const summary = formatBroadcastFilterSummary(preset.filters);
                return (
                  <li key={preset.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => requestApply(preset)}
                      className={cn(
                        "flex h-full w-full flex-col rounded-lg border p-3 text-left transition-colors",
                        active
                          ? "border-brand-500 bg-brand-600/5 ring-1 ring-brand-500/30"
                          : "border-line bg-surface hover:border-brand-500/40 hover:bg-surface-muted/40",
                        disabled && "pointer-events-none opacity-60",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-fg">{preset.name}</span>
                        <span className="shrink-0 rounded bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fg-subtle">
                          {ADMIN_BROADCAST_FILTER_PRESET_GROUP_LABELS[preset.group]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-fg-subtle">{preset.description}</p>
                      {summary.length > 0 ? (
                        <p className="mt-2 line-clamp-2 text-[10px] font-medium text-brand-600 dark:text-brand-300">
                          {summary.join(" · ")}
                        </p>
                      ) : (
                        <p className="mt-2 text-[10px] font-medium text-fg-muted">No filters</p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function chipClass(active: boolean, disabled?: boolean): string {
  return cn(
    "rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors",
    active
      ? "bg-brand-600 text-white ring-brand-600"
      : "bg-surface text-fg-muted ring-line hover:bg-surface-muted hover:text-fg",
    disabled && "pointer-events-none opacity-60",
  );
}
