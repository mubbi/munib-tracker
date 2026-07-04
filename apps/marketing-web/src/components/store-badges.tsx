import Link from "next/link";
import { PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";

type StoreBadgesProps = {
  className?: string;
  layout?: "row" | "column";
};

/** App Store and Google Play badges — follow platform branding guidelines. */
export function StoreBadges({ className = "", layout = "row" }: StoreBadgesProps) {
  const flexClass = layout === "row" ? "flex flex-wrap items-center gap-3" : "flex flex-col gap-3";

  return (
    <div className={`${flexClass} ${className}`}>
      <Link
        href={SITE_PATHS.download}
        aria-label="View iOS download options"
        className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]"
        data-analytics-event="download_ios_click"
      >
        <AppStoreBadge />
      </Link>
      <Link
        href={SITE_PATHS.download}
        aria-label="View Android download options"
        className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]"
        data-analytics-event="download_android_click"
      >
        <GooglePlayBadge />
      </Link>
      <Link
        href={PRODUCT_APP_URL}
        aria-label="Try Munib Tracker in your browser"
        className="inline-flex h-10 items-center justify-center rounded-lg border border-border/80 bg-card px-4 text-xs font-semibold transition-colors hover:bg-muted-surface/50"
        data-analytics-event="web_demo_launch"
      >
        Try web app
      </Link>
    </div>
  );
}

function AppStoreBadge() {
  return (
    <svg width="156" height="48" viewBox="0 0 156 48" aria-hidden="true" role="img">
      <rect width="156" height="48" rx="8" fill="#000" />
      <text x="52" y="18" fill="#fff" fontSize="9" fontFamily="system-ui, sans-serif">
        Download on the
      </text>
      <text
        x="52"
        y="34"
        fill="#fff"
        fontSize="14"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        App Store
      </text>
      <path
        d="M24 34c-.2 0-.4-.1-.5-.2-.1-.2-.1-.4 0-.6.8-1.4 1.3-3 1.3-4.7 0-2.5-1-4.7-2.6-6.3-.1-.1-.1-.3 0-.4.1-.1.3-.1.4 0 1.8 1.7 2.9 4.1 2.9 6.7 0 1.8-.5 3.5-1.4 5-.1.1-.1.2-.1.5zM20.5 14.8c0 .1-.1.2-.2.2-1.5.4-2.8 1.4-3.6 2.7-.1.1 0 .3.1.4.1.1.3 0 .4-.1.7-.9 1.7-1.6 2.8-1.9.2 0 .4-.1.5.1v-1.4z"
        fill="#fff"
      />
    </svg>
  );
}

function GooglePlayBadge() {
  return (
    <svg width="168" height="48" viewBox="0 0 168 48" aria-hidden="true" role="img">
      <rect width="168" height="48" rx="8" fill="#000" />
      <text x="52" y="18" fill="#fff" fontSize="9" fontFamily="system-ui, sans-serif">
        GET IT ON
      </text>
      <text
        x="52"
        y="34"
        fill="#fff"
        fontSize="14"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        Google Play
      </text>
      <path d="M16 10l12 14-12 14V10z" fill="#34A853" />
      <path d="M16 10l8 8-8 6V10z" fill="#4285F4" />
      <path d="M28 24l-4 4 8 6-4-10z" fill="#FBBC04" />
      <path d="M16 38l12-14-4-4-8 18z" fill="#EA4335" />
    </svg>
  );
}
