"use client";

import {
  ADMIN_BROADCAST_BODY_MAX,
  ADMIN_BROADCAST_SUBTITLE_MAX,
  ADMIN_BROADCAST_TITLE_MAX,
  BROADCAST_PREVIEW_SURFACE_SPECS,
  BROADCAST_PREVIEW_SURFACES,
  type BroadcastPreviewSurface,
  type BroadcastPreviewSurfaceSpec,
  broadcastFieldUsage,
  splitAtDisplayLimit,
} from "@munib-tracker/shared";
import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type BroadcastNotificationPreviewProps = {
  title: string;
  subtitle?: string;
  body: string;
  appName?: string;
  className?: string;
  compact?: boolean;
};

function TruncatedLine({
  text,
  limit,
  placeholder,
  className,
  truncatedClassName,
}: {
  text: string;
  limit: number;
  placeholder: string;
  className?: string;
  truncatedClassName?: string;
}) {
  const value = text.trim() || placeholder;
  const { visible, truncated, overLimit } = splitAtDisplayLimit(value, limit);

  return (
    <span className={className}>
      {visible}
      {overLimit ? (
        <span className={cn("opacity-45 line-through decoration-danger/50", truncatedClassName)}>
          {truncated}
        </span>
      ) : null}
    </span>
  );
}

function PreviewLimitStrip({
  surface,
  title,
  subtitle,
  body,
}: {
  surface: BroadcastPreviewSurface;
  title: string;
  subtitle?: string;
  body: string;
}) {
  const spec = BROADCAST_PREVIEW_SURFACE_SPECS[surface];
  const usage = useMemo(
    () => broadcastFieldUsage(surface, { title, subtitle, body }),
    [surface, title, subtitle, body],
  );

  return (
    <div className="rounded-md border border-line/80 bg-surface-muted/30 px-3 py-2.5">
      <p className="text-[11px] font-medium text-fg-muted">{spec.note}</p>
      <dl className="mt-2 space-y-1.5">
        {usage.map((row) => (
          <div key={row.field} className="flex items-baseline justify-between gap-3 text-xs">
            <dt className="shrink-0 text-fg-subtle">{row.label}</dt>
            <dd className="text-right tabular-nums">
              <span className={cn("font-semibold", row.overLimit ? "text-warning" : "text-fg")}>
                {row.length}
              </span>
              <span className="text-fg-subtle"> / {row.visibleLimit} visible</span>
              {row.overLimit ? (
                <span className="ml-1.5 text-[11px] font-medium text-warning">
                  +{row.hiddenCount} hidden
                </span>
              ) : (
                <span className="ml-1.5 text-[11px] text-success">fits</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function IosPushPreview({
  appName,
  title,
  subtitle,
  body,
  limits,
}: {
  appName: string;
  title: string;
  subtitle?: string;
  body: string;
  limits: BroadcastPreviewSurfaceSpec;
}) {
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-2xl bg-zinc-900/95 p-3 shadow-lg ring-1 ring-white/10">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Bell className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              {appName}
            </p>
            <p className="shrink-0 text-[11px] text-zinc-500">now</p>
          </div>
          <p className="mt-1 text-sm font-semibold leading-snug text-white">
            <TruncatedLine text={title} limit={limits.title} placeholder="Notification title" />
          </p>
          {subtitle?.trim() ? (
            <p className="mt-0.5 text-xs font-medium text-zinc-300">
              <TruncatedLine text={subtitle} limit={limits.subtitle ?? 50} placeholder="Subtitle" />
            </p>
          ) : null}
          <p className="mt-1 text-sm leading-snug text-zinc-300">
            <TruncatedLine text={body} limit={limits.body} placeholder="Notification body" />
          </p>
        </div>
      </div>
    </div>
  );
}

function AndroidPushPreview({
  appName,
  title,
  body,
  limits,
}: {
  appName: string;
  title: string;
  body: string;
  limits: BroadcastPreviewSurfaceSpec;
}) {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-xl bg-zinc-800 p-3 shadow-lg ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-brand-600">
          <Bell className="h-3 w-3 text-white" aria-hidden />
        </div>
        <span className="font-medium uppercase">{appName}</span>
        <span>·</span>
        <span>now</span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug text-white">
        <TruncatedLine text={title} limit={limits.title} placeholder="Notification title" />
      </p>
      <p className="mt-1 text-sm leading-snug text-zinc-300">
        <TruncatedLine text={body} limit={limits.body} placeholder="Notification body" />
      </p>
    </div>
  );
}

function WebPushPreview({
  appName,
  title,
  body,
  limits,
}: {
  appName: string;
  title: string;
  body: string;
  limits: BroadcastPreviewSurfaceSpec;
}) {
  return (
    <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-lg border border-line bg-surface shadow-md">
      <div className="flex items-start gap-3 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white">
          <Bell className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-fg-subtle">{appName}</p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-fg">
            <TruncatedLine text={title} limit={limits.title} placeholder="Notification title" />
          </p>
          <p className="mt-1 text-sm leading-snug text-fg-muted">
            <TruncatedLine text={body} limit={limits.body} placeholder="Notification body" />
          </p>
        </div>
      </div>
    </div>
  );
}

function InAppPreview({
  title,
  subtitle,
  body,
  limits,
}: {
  title: string;
  subtitle?: string;
  body: string;
  limits: BroadcastPreviewSurfaceSpec;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex gap-3 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600 ring-1 ring-brand-500/20">
          <Bell className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug text-fg">
              <TruncatedLine text={title} limit={limits.title} placeholder="Notification title" />
            </p>
            <span className="shrink-0 text-[11px] text-fg-subtle">now</span>
          </div>
          {subtitle?.trim() ? (
            <p className="mt-0.5 text-sm font-medium leading-snug text-fg-muted">
              <TruncatedLine text={subtitle} limit={limits.subtitle ?? 50} placeholder="Subtitle" />
            </p>
          ) : null}
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">
            <TruncatedLine text={body} limit={limits.body} placeholder="Notification body" />
          </p>
        </div>
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden />
      </div>
    </div>
  );
}

export function BroadcastNotificationPreview({
  title,
  subtitle,
  body,
  appName = "Munib Tracker",
  className,
  compact = false,
}: BroadcastNotificationPreviewProps) {
  const [surface, setSurface] = useState<BroadcastPreviewSurface>("ios_push");

  const tabs = BROADCAST_PREVIEW_SURFACES.map((id) => ({
    id,
    label: BROADCAST_PREVIEW_SURFACE_SPECS[id].label,
  }));

  const hasContent = title.trim().length > 0 || body.trim().length > 0;
  const spec = BROADCAST_PREVIEW_SURFACE_SPECS[surface];

  return (
    <div className={cn(compact ? "space-y-3" : "space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-fg">Preview</h3>
        <div
          className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface-muted/40 p-1 sm:grid-cols-4"
          role="tablist"
          aria-label="Notification preview surface"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={surface === tab.id}
              onClick={() => setSurface(tab.id)}
              className={cn(
                "min-h-[2.25rem] rounded-md px-2 py-2 text-center text-xs font-semibold transition-colors sm:text-sm",
                surface === tab.id
                  ? "bg-surface text-fg shadow-sm ring-1 ring-line"
                  : "text-fg-muted hover:bg-surface/60 hover:text-fg",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PreviewLimitStrip surface={surface} title={title} subtitle={subtitle} body={body} />

      <div
        className={cn(
          "rounded-xl border border-line p-4",
          compact ? "min-h-[120px]" : "min-h-[150px]",
          surface === "in_app" || surface === "web_push"
            ? "bg-surface-muted/20"
            : "bg-gradient-to-b from-zinc-700/40 to-zinc-900/60",
        )}
        role="tabpanel"
      >
        {!hasContent ? (
          <p className="flex min-h-[100px] items-center justify-center text-center text-sm text-fg-subtle">
            Type a title or body to preview truncation
          </p>
        ) : surface === "ios_push" ? (
          <IosPushPreview
            appName={appName}
            title={title}
            subtitle={subtitle}
            body={body}
            limits={spec}
          />
        ) : surface === "android_push" ? (
          <AndroidPushPreview appName={appName} title={title} body={body} limits={spec} />
        ) : surface === "web_push" ? (
          <WebPushPreview appName={appName} title={title} body={body} limits={spec} />
        ) : (
          <InAppPreview title={title} subtitle={subtitle} body={body} limits={spec} />
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-fg-subtle">
        Faded strikethrough text is cut off on {spec.label.toLowerCase()}. Compose max: title{" "}
        {ADMIN_BROADCAST_TITLE_MAX}, subtitle {ADMIN_BROADCAST_SUBTITLE_MAX}, body{" "}
        {ADMIN_BROADCAST_BODY_MAX}.
      </p>
    </div>
  );
}
