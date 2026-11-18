import type { GenerateMetadataFunction, Metadata } from "expo-router/server";

import {
  absoluteUrl,
  canonicalUrl,
  formatTitle,
  OG_LOCALE_BY_LOCALE,
  SEO_APP,
  SEO_AUTHOR,
  SEO_DEFAULT_KEYWORDS,
  SEO_DEFAULT_LOCALE,
  SEO_LOCALES,
  SEO_OG_IMAGE,
  SEO_TWITTER,
} from "@/config/seo";
import { getRouteSeo, normalizePath } from "@/config/seo-routes";

/**
 * Static web metadata (Expo Router SDK 58 `generateMetadata`).
 *
 * From SDK 58, static web export renders with the streaming renderer, and tags a
 * component puts into `<Head>` no longer reach the exported HTML. Every route file
 * therefore exports `generateMetadata = routeMetadata("<route template>")`, and
 * Expo Router writes the result into the page's `<head>` at export time.
 *
 * Source of truth is the SEO registry (`src/config/seo-routes.data.json`), the same
 * data `<Seo>` and `scripts/inject-seo-head.mjs` use. Routes that are not in the
 * registry (most dynamic pages: surahs, hadith collections, dua categories…) return
 * `null`; `inject-seo-head.mjs` runs after the export and fills in their richer,
 * content-derived tags, plus hreflang alternates and JSON-LD, which `Metadata` has
 * no field for. The script only adds tags a page is missing, so the two never
 * duplicate each other.
 */

/** Substitute `[param]` / `[...rest]` segments of a route template with real params. */
export function resolveRoutePath(
  template: string,
  params: Record<string, string | string[] | undefined> = {},
): string | null {
  let unresolved = false;
  const path = template
    .split("/")
    // Route groups `(tabs)` are not part of the URL.
    .filter((segment) => !/^\(.*\)$/.test(segment))
    .map((segment) => {
      const match = segment.match(/^\[(?:\.\.\.)?([^\]]+)\]$/);
      if (!match) return segment;
      const value = params[match[1]];
      if (value == null || (Array.isArray(value) && value.length === 0)) {
        unresolved = true;
        return segment;
      }
      return Array.isArray(value)
        ? value.map(encodeURIComponent).join("/")
        : encodeURIComponent(value);
    })
    .join("/");
  return unresolved ? null : normalizePath(path || "/");
}

/** Build `Metadata` for a concrete path from the registry, or `null` if it is not registered. */
export function buildRouteMetadata(path: string): Metadata | null {
  const key = normalizePath(path);
  const entry = getRouteSeo(key);
  if (!entry) return null;

  const isHome = key === "/";
  const index = entry.index ?? true;
  const title = formatTitle(entry.title, { isHome });
  const rawTitle = entry.title ?? title;
  const description = entry.description ?? SEO_APP.description;
  const canonical = canonicalUrl(key, SEO_DEFAULT_LOCALE);
  const imageUrl = absoluteUrl(entry.image ?? SEO_OG_IMAGE.url);
  const imageAlt = entry.imageAlt ?? SEO_OG_IMAGE.alt;
  const keywords = Array.from(new Set([...(entry.keywords ?? []), ...SEO_DEFAULT_KEYWORDS]));

  return {
    title,
    description,
    keywords,
    authors: { name: SEO_AUTHOR.name, url: SEO_AUTHOR.url },
    robots: index
      ? {
          index: true,
          follow: true,
          // Same directives at top level as on googleBot — the pre-58 <Seo> output.
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: SEO_APP.name,
      title: rawTitle,
      description,
      url: canonical,
      locale: OG_LOCALE_BY_LOCALE[SEO_DEFAULT_LOCALE],
      alternateLocale: SEO_LOCALES.filter((l) => l !== SEO_DEFAULT_LOCALE).map(
        (l) => OG_LOCALE_BY_LOCALE[l],
      ),
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
          width: SEO_OG_IMAGE.width,
          height: SEO_OG_IMAGE.height,
        },
      ],
    },
    twitter: {
      card: SEO_TWITTER.card,
      title: rawTitle,
      description,
      images: [{ url: imageUrl, alt: imageAlt }],
      ...(SEO_TWITTER.site ? { site: SEO_TWITTER.site } : null),
      ...(SEO_TWITTER.creator ? { creator: SEO_TWITTER.creator } : null),
    },
  };
}

/**
 * `generateMetadata` for a route file. `template` is the file's route, e.g.
 * `"/quran/[surah]"` or `"/(tabs)/tracker"`.
 */
export function routeMetadata(template: string): GenerateMetadataFunction {
  return (_request, params) => {
    const path = resolveRoutePath(template, params);
    return path ? buildRouteMetadata(path) : null;
  };
}
