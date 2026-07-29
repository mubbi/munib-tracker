import {
  APP_AUTHOR,
  APP_AUTHOR_URL,
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
} from "@munib-tracker/shared/constants";
import { SORTED_LOCALE_REGISTRY } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";

import { PWA_THEME_COLOR } from "@/config/pwa";
import { normalizePath } from "@/config/seo-routes";
import { localizedUrl as buildLocalizedUrl, prependLocalePath } from "@/lib/locale-path";

/**
 * Centralized SEO configuration for the Expo **web** build.
 *
 * Everything that traditional search engines (Google, Bing) and AI answer
 * engines (ChatGPT, Gemini, Claude, Perplexity, Copilot, Google AI Overviews)
 * read about a page is derived from the values here plus the per-route registry
 * in `seo-routes.ts`. Keep this the single source of truth — screens never
 * hard-code URLs, titles, or social images.
 *
 * The tags themselves are emitted by `<Seo>` (`components/seo/seo.tsx`) into the
 * document `<head>` via `expo-router/head` (react-helmet-async under the hood),
 * so each statically-exported route ships its own unique, crawlable metadata.
 */

/** Strip a trailing slash so we can safely template `${ORIGIN}${path}`. */
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

/**
 * Canonical origin of the deployed web app (Expo static export).
 *
 * `EXPO_PUBLIC_APP_URL` overrides per environment (preview deploys, staging).
 * Note: `EXPO_PUBLIC_SITE_URL` is intentionally the *marketing* origin
 * (munibtracker.app) — used below only for cross-linking, never for canonicals.
 */
export const SEO_ORIGIN = trimTrailingSlash(
  process.env.EXPO_PUBLIC_APP_URL ?? "https://my.munibtracker.app",
);

/** Marketing site origin — used for Organization `sameAs` / publisher links. */
export const MARKETING_ORIGIN = trimTrailingSlash(
  process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app",
);

/** Locales the content is available in (via the in-app language switcher). */
export const SEO_LOCALES = SORTED_LOCALE_REGISTRY.map(
  (entry) => entry.code,
) as readonly AppLocale[];
export type SeoLocale = AppLocale;
export const SEO_DEFAULT_LOCALE: SeoLocale = "en";

/** Maps our short locale codes to the region-qualified codes Open Graph expects. */
export const OG_LOCALE_BY_LOCALE = Object.fromEntries(
  SORTED_LOCALE_REGISTRY.map((entry) => [entry.code, entry.ogLocale]),
) as Record<SeoLocale, string>;

/** BCP-47 tags for `hreflang` alternates and `<html lang>`. */
export const HREFLANG_BY_LOCALE = Object.fromEntries(
  SORTED_LOCALE_REGISTRY.map((entry) => [entry.code, entry.hreflang]),
) as Record<SeoLocale, string>;

/** Default social share image (Open Graph / Twitter). Lives under `public/`. */
export const SEO_OG_IMAGE = {
  url: "/assets/images/icon-512.png",
  width: 512,
  height: 512,
  alt: `${APP_NAME} — ${APP_TAGLINE}`,
  type: "image/png",
} as const;

/** Twitter/X card defaults. `site`/`creator` are optional handles (add when live). */
export const SEO_TWITTER = {
  card: "summary_large_image" as const,
  site: undefined as string | undefined,
  creator: undefined as string | undefined,
};

export const SEO_THEME_COLOR = PWA_THEME_COLOR;

/**
 * Broad, honest keyword set shared as a baseline. Per-route keywords in the
 * registry extend (not stuff) these — titles/descriptions stay human-written.
 */
export const SEO_DEFAULT_KEYWORDS = [
  "Islamic app",
  "salah tracker",
  "prayer times",
  "dhikr counter",
  "qaza tracker",
  "Quran",
  "hadith",
  "duas",
  "qibla direction",
  "Muslim prayer app",
] as const;

/** Publisher / author metadata reused across pages and structured data. */
export const SEO_AUTHOR = {
  name: APP_AUTHOR,
  url: APP_AUTHOR_URL,
} as const;

export const SEO_APP = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  description: APP_DESCRIPTION,
} as const;

/** Absolute URL for a route path (canonical, OG url, sitemap, JSON-LD `@id`). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path === "/" || path === "" ? "" : `/${path.replace(/^\/+/, "")}`;
  return `${SEO_ORIGIN}${normalized}`;
}

/**
 * Localized path for SEO hreflang/canonical. Default locale (`en`) stays unprefixed;
 * others use `/{locale}/…` so alternates resolve to distinct URLs.
 */
export function localizedUrl(path: string, locale: SeoLocale): string {
  return buildLocalizedUrl(path, locale);
}

/** Canonical absolute URL for a route in the given locale. */
export function canonicalUrl(path: string, locale: SeoLocale = SEO_DEFAULT_LOCALE): string {
  return absoluteUrl(prependLocalePath(normalizePath(path), locale));
}

export { LOCALE_PATH_DEFAULT, prependLocalePath, stripLocalePrefix } from "@/lib/locale-path";

/** Compose a full document title. The home page uses the brand title verbatim. */
export function formatTitle(title: string | undefined, { isHome = false } = {}): string {
  if (!title || isHome) return title ?? `${APP_NAME} — ${APP_TAGLINE}`;
  return `${title} · ${APP_NAME}`;
}
