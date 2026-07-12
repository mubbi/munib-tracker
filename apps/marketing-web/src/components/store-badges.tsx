"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { type DownloadPlacement, trackDownloadClick, trackWebDemoLaunch } from "@/lib/analytics";
import { PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

type StoreBadgesProps = {
  className?: string;
  layout?: "row" | "column";
  placement?: DownloadPlacement;
};

const badge =
  "inline-flex h-[52px] items-center gap-2.5 rounded-xl border border-white/10 bg-neutral-900 px-4 text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]";

/** App Store and Google Play badges — follow platform branding guidelines. */
export function StoreBadges({
  className = "",
  layout = "row",
  placement = "hero",
}: StoreBadgesProps) {
  const flexClass = layout === "row" ? "flex flex-wrap items-center gap-3" : "flex flex-col gap-3";

  return (
    <div className={cn(flexClass, className)}>
      <Link
        href={SITE_PATHS.download}
        aria-label="View iOS download options"
        className={badge}
        data-analytics-event="download_ios_click"
        onClick={() => trackDownloadClick("ios", placement)}
      >
        <AppleLogo className="size-7 shrink-0" />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-medium text-white/70">Download on the</span>
          <span className="mt-1 text-[17px] font-semibold leading-none tracking-tight">
            App Store
          </span>
        </span>
      </Link>

      <Link
        href={SITE_PATHS.download}
        aria-label="View Android download options"
        className={badge}
        data-analytics-event="download_android_click"
        onClick={() => trackDownloadClick("android", placement)}
      >
        <GooglePlayLogo className="size-6 shrink-0" />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/70">
            Get it on
          </span>
          <span className="mt-1 text-[17px] font-semibold leading-none tracking-tight">
            Google Play
          </span>
        </span>
      </Link>

      <a
        href={PRODUCT_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Try Munib Tracker in your browser"
        className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:border-brand/50 hover:bg-muted-surface/50"
        data-analytics-event="web_demo_launch"
        onClick={() => trackWebDemoLaunch(placement)}
      >
        <Globe className="size-[18px] text-brand" />
        Try web app
      </a>
    </div>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.53c-.02-2.03 1.66-3 1.73-3.05-.94-1.38-2.41-1.57-2.93-1.59-1.25-.13-2.44.73-3.07.73-.63 0-1.61-.71-2.65-.69-1.36.02-2.62.79-3.32 2.01-1.42 2.46-.36 6.1 1.02 8.1.67.98 1.47 2.08 2.52 2.04 1.01-.04 1.39-.65 2.61-.65 1.22 0 1.56.65 2.63.63 1.09-.02 1.78-.99 2.44-1.98.77-1.13 1.09-2.23 1.11-2.29-.02-.01-2.13-.82-2.15-3.25zM15.03 6.3c.56-.68.94-1.62.83-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.83-.46 2.39-1.14z" />
    </svg>
  );
}

function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#00C3FF"
        d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z"
      />
      <path fill="#FF3D47" d="M5.864 2.658 16.802 8.99l-2.302 2.302z" />
      <path fill="#00E676" d="M14.499 12.707l2.302 2.302-10.937 6.333 8.635-8.635z" />
      <path
        fill="#FFCE00"
        d="M17.698 9.509l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626-2.399-2.4 2.4-2.582z"
      />
    </svg>
  );
}
