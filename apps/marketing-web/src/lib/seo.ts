import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

/** Content language of the marketing site. English only today (see docs/I18N_GUIDE.md). */
export const SITE_LOCALE = "en" as const;
export const OG_LOCALE = "en_US" as const;

export type PageSeo = {
  /** Path starting with "/" (no origin). */
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
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** Default social card; a route-level `opengraph-image` file takes priority over this. */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${APP_NAME}: Salah tracker, Zikr and Qur'an app`,
};

/** Titles longer than this skip the " | Munib Tracker" suffix so they aren't truncated in results. */
const MAX_TITLE = 65;

/**
 * Builds consistent per-page metadata: unique title, description, canonical,
 * hreflang (en + x-default — the site is English-only today, so both point at
 * the same URL), Open Graph and X/Twitter cards.
 *
 * Titles that already contain the brand, or would be too long with it, are
 * emitted as `absolute` so the root template does not append the suffix.
 */
export function pageMetadata(seo: PageSeo): Metadata {
  const url = absoluteUrl(seo.path);
  const suffixed = `${seo.title} | ${APP_NAME}`;
  const absolute = seo.title.includes(APP_NAME) || suffixed.length > MAX_TITLE;
  const fullTitle = absolute ? seo.title : suffixed;
  const image = seo.image ?? DEFAULT_OG_IMAGE;

  return {
    title: absolute ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: { [SITE_LOCALE]: url, "x-default": url },
    },
    openGraph: {
      type: seo.type ?? "website",
      locale: OG_LOCALE,
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
