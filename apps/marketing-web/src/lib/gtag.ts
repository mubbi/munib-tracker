/**
 * Consent-aware GA4 helpers for the marketing site.
 *
 * Cookie consent uses Google Consent Mode v2 so Google’s Privacy & Messaging
 * (default Google cookie consent popup) can grant/deny storage — no custom banner.
 *
 * Empty `NEXT_PUBLIC_GA_MEASUREMENT_ID` disables GA entirely.
 */

export type GtagEventParams = Record<string, string | number | boolean | undefined>;

type GtagFn = (command: string, ...args: unknown[]) => void;

type BrowserGtagGlobal = typeof globalThis & {
  dataLayer?: unknown[];
  gtag?: GtagFn;
};

function browserGlobal(): BrowserGtagGlobal | null {
  if (typeof globalThis === "undefined") return null;
  return globalThis as BrowserGtagGlobal;
}

/** Resolve measurement ID; empty env string disables GA. */
export function getGaMeasurementId(): string | null {
  const env = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (env === "") return null;
  const id = (env ?? "").trim();
  return id || null;
}

export function isGoogleAnalyticsConfigured(): boolean {
  return Boolean(getGaMeasurementId());
}

export function ensureGtag(): GtagFn | null {
  const g = browserGlobal();
  if (!g) return null;
  if (!g.dataLayer) g.dataLayer = [];
  const dataLayer = g.dataLayer;
  if (!g.gtag) {
    g.gtag = function gtag() {
      // biome-ignore lint/complexity/noArguments: gtag dataLayer requires the Arguments object
      dataLayer.push(arguments);
    } as GtagFn;
  }
  return g.gtag;
}

/** True once the gtag runtime is present (script may still be loading). */
export function isGoogleAnalyticsReady(): boolean {
  return Boolean(getGaMeasurementId() && browserGlobal()?.gtag);
}

export function trackGtagEvent(eventName: string, params?: GtagEventParams): void {
  const id = getGaMeasurementId();
  const gtag = ensureGtag();
  if (!id || !gtag) return;

  const cleaned: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) cleaned[key] = value;
    }
  }
  gtag("event", eventName, cleaned);
}

export function trackGtagPageView(path: string, title?: string): void {
  const id = getGaMeasurementId();
  const gtag = ensureGtag();
  if (!id || !gtag) return;

  gtag("event", "page_view", {
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
    page_location: typeof location !== "undefined" ? location.href : undefined,
  });
  gtag("config", id, { page_path: path });
}
