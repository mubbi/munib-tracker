import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LOCALE_META, localizedPath } from "@/i18n/locales";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

export type PageSeo = {
  /** Locale the page is rendered in (`await getLocale()` from `next-intl/server`). */
  locale: Locale;
  /** Path starting with "/" without the locale prefix (no origin). */
  path: string;
  title: string;
  description: string;
  /** "article" adds published/modified times. */
  type?: "website" | "article";
  published?: string;
  modified?: string;
  /** Override the OG image (absolute path or URL). Defaults to the route's opengraph-image. */
  image?: { url: string; width: number; height: number; alt: string };
  noindex?: boolean;
  /** The page has a Markdown edition at its English URL + `.md` (`lib/llms.ts`); linked from English pages. */
  markdown?: boolean;
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** Absolute URL of `path` in `locale` (every locale is prefixed: `/en/features`). */
export function localizedUrl(path: string, locale: Locale): string {
  return absoluteUrl(localizedPath(path, locale));
}

/**
 * hreflang map for `path`: one entry per published locale plus `x-default`
 * (the English page). Used by `pageMetadata()` and the sitemap.
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[LOCALE_META[locale].hreflang] = localizedUrl(path, locale);
  }
  languages["x-default"] = localizedUrl(path, DEFAULT_LOCALE);
  return languages;
}

/** Default social card; a route-level `opengraph-image` file takes priority over this. */
async function defaultOgImage(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    url: localizedPath("/opengraph-image", locale),
    width: 1200,
    height: 630,
    alt: t("defaultImageAlt", { appName: APP_NAME }),
  };
}

/** Titles longer than this skip the " | Munib Tracker" suffix so they aren't truncated in results. */
const MAX_TITLE = 65;

/**
 * Builds consistent per-page metadata: unique title, description, a canonical
 * URL in the page's own locale, hreflang alternates for every published
 * locale + x-default, Open Graph and X/Twitter cards.
 *
 * Titles that already contain the brand, or would be too long with it, are
 * emitted as `absolute` so the root template does not append the suffix.
 */
export async function pageMetadata(seo: PageSeo): Promise<Metadata> {
  const url = localizedUrl(seo.path, seo.locale);
  const suffixed = `${seo.title} | ${APP_NAME}`;
  const absolute = seo.title.includes(APP_NAME) || suffixed.length > MAX_TITLE;
  const fullTitle = absolute ? seo.title : suffixed;
  const image = seo.image ?? (await defaultOgImage(seo.locale));

  return {
    title: absolute ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(seo.path),
      ...(seo.markdown && seo.locale === DEFAULT_LOCALE
        ? { types: { "text/markdown": `${url}.md` } }
        : {}),
    },
    openGraph: {
      type: seo.type ?? "website",
      locale: LOCALE_META[seo.locale].ogLocale,
      url,
      siteName: APP_NAME,
      title: fullTitle,
      description: seo.description,
      images: [image],
      ...(seo.type === "article"
        ? { publishedTime: seo.published, modifiedTime: seo.modified ?? seo.published }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seo.description,
      images: [image.url],
    },
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Rough reading time for a block-based body (≈ 220 wpm). */
export function readingMinutes(texts: readonly string[]): number {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
