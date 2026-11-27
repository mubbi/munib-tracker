/**
 * Consent-aware GA4 helpers for the marketing site.
 *
 * Cookie consent uses Google Consent Mode v2: defaults deny storage, then the
 * first-party banner calls `gtag('consent','update')` when the visitor chooses.
 *
 * Empty `NEXT_PUBLIC_GA_MEASUREMENT_ID` disables GA entirely.
 */

import type { ConsentPreferences } from "@/lib/consent-storage";

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

const GA_MEASUREMENT_ID_RE = /^G-[A-Z0-9]{1,20}$/i;

/** Resolve measurement ID; empty (or malformed) env value disables GA. */
export function getGaMeasurementId(): string | null {
  const env = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (env === "") return null;
  const id = (env ?? "").trim();
  // The id is interpolated into inline <script> bodies and the gtag.js URL in
  // `components/analytics.tsx`; accept only the GA4 `G-XXXX` shape so a
  // mis-set env value can never inject script.
  return GA_MEASUREMENT_ID_RE.test(id) ? id : null;
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

/** Apply Consent Mode v2 from cookie preferences (ads always denied). */
export function applyAnalyticsFromCookiePreferences(prefs: ConsentPreferences): void {
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
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

/**
 * GA4 content group for a page path (`/en/features/x` → "feature"), so
 * reports and path explorations can compare page types across languages.
 */
export function contentGroup(path: string): { content_group: string; page_language: string } {
  const [locale = "", section = "", ...rest] = path.split("?")[0]?.split("/").filter(Boolean) ?? [];
  const page_language = /^[a-z]{2}$/.test(locale) ? locale : "";
  const groups: Record<string, string> = {
    features: rest.length ? "feature" : "features_hub",
    compare: rest.length ? "comparison" : "compare_hub",
    for: rest.length ? "audience" : "audience_hub",
    resources: rest.length >= 2 ? "guide" : "guides_hub",
  };
  const content_group = section ? (groups[section] ?? section.replace(/-/g, "_")) : "home";
  return { content_group, page_language };
}

export function trackGtagPageView(path: string, title?: string): void {
  const id = getGaMeasurementId();
  const gtag = ensureGtag();
  if (!id || !gtag) return;

  // Set once so every later event on this page carries the same group.
  gtag("set", contentGroup(path));
  gtag("event", "page_view", {
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
    page_location: typeof location !== "undefined" ? location.href : undefined,
  });
  gtag("config", id, { page_path: path });
}
