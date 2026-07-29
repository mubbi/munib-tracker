"use client";

import {
  ADMIN_BROADCAST_TEMPLATE_GROUP_LABELS,
  ADMIN_BROADCAST_TEMPLATE_GROUPS,
  ADMIN_BROADCAST_TEMPLATES,
  type AdminBroadcastTemplate,
  type AdminBroadcastTemplateGroup,
  adminBroadcastCategoryLabel,
} from "@munib-tracker/shared";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BroadcastTemplatePickerProps = {
  selectedId: string | null;
  onApply: (template: AdminBroadcastTemplate) => void;
  disabled?: boolean;
  hasExistingContent?: boolean;
};

export function BroadcastTemplatePicker({
  selectedId,
  onApply,
  disabled,
  hasExistingContent,
}: BroadcastTemplatePickerProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<AdminBroadcastTemplateGroup | "all">("all");
  const [pending, setPending] = useState<AdminBroadcastTemplate | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ADMIN_BROADCAST_TEMPLATES.filter((template) => {
      if (group !== "all" && template.group !== group) return false;
      if (!query) return true;
      const haystack = [
        template.name,
        template.title,
        template.subtitle ?? "",
        template.body,
        ADMIN_BROADCAST_TEMPLATE_GROUP_LABELS[template.group],
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [group, search]);

  const requestApply = (template: AdminBroadcastTemplate) => {
    if (disabled) return;
    if (hasExistingContent && template.id !== selectedId) {
      setPending(template);
      return;
    }
    onApply(template);
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
          <p className="text-xs font-semibold text-fg">Templates</p>
          <p className="text-[10px] text-fg-subtle">
            {ADMIN_BROADCAST_TEMPLATES.length} ready-made messages
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
              <span className="text-xs font-medium text-fg-subtle">Search templates</span>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Dhikr reminder, Ramadan, inactive…"
                disabled={disabled}
              />
            </label>
            <p className="shrink-0 text-xs text-fg-subtle sm:pb-2">
              {filtered.length} of {ADMIN_BROADCAST_TEMPLATES.length}
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
            {ADMIN_BROADCAST_TEMPLATE_GROUPS.map((value) => (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => setGroup(value)}
                className={chipClass(group === value, disabled)}
              >
                {ADMIN_BROADCAST_TEMPLATE_GROUP_LABELS[value]}
              </button>
            ))}
          </div>

          {pending ? (
            <div className="rounded-lg border border-warning/40 bg-warning/10 p-3">
              <p className="text-sm font-medium text-fg">Replace current message?</p>
              <p className="mt-1 text-xs text-fg-muted">
                Applying &ldquo;{pending.name}&rdquo; will overwrite title, body, and suggested
                audience filters.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={confirmApply}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Replace with template
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
            <p className="text-sm text-fg-muted">No templates match your search.</p>
          ) : (
            <ul className="grid max-h-52 gap-1.5 overflow-y-auto sm:grid-cols-2">
              {filtered.map((template) => {
                const active = template.id === selectedId;
                return (
                  <li key={template.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => requestApply(template)}
                      className={cn(
                        "flex h-full w-full flex-col rounded-lg border p-3 text-left transition-colors",
                        active
                          ? "border-brand-500 bg-brand-600/5 ring-1 ring-brand-500/30"
                          : "border-line bg-surface hover:border-brand-500/40 hover:bg-surface-muted/40",
                        disabled && "pointer-events-none opacity-60",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-fg">{template.name}</span>
                        <span className="shrink-0 rounded bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fg-subtle">
                          {adminBroadcastCategoryLabel(template.category)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs font-medium text-fg-muted">
                        {template.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-fg-subtle">{template.body}</p>
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
