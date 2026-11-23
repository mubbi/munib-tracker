import type { MetadataRoute } from "next";
import { AUDIENCE_PAGES, audienceHref } from "@/content/audiences";
import { COMPARE_PAGES, compareHref } from "@/content/compare";
import { FEATURE_PAGES, featureHref } from "@/content/features";
import { ARTICLES, articleHref } from "@/content/resources";
import { categoryHref, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import type { ScreenshotKey, ScreenshotSlot } from "@/content/types";
import { getScreenshot } from "@/lib/screenshots";
import { absoluteUrl, SITE_LOCALE } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

/**
 * `/sitemap.xml` — generated at build time from the content registries, so
 * every new feature, comparison, audience page or guide is listed
 * automatically with its own last-updated date. Each URL carries its
 * hreflang alternates, and pages that show real app screenshots list them as
 * image-sitemap entries for Google Images.
 */

/** Last substantive edit of the static (non-registry) pages. Bump when they change. */
const STATIC_PAGES_UPDATED = "2026-11-23";

const STATIC_PRIORITY: Partial<Record<string, number>> = {
  "/": 1,
  "/features": 0.9,
  "/download": 0.9,
  "/how-it-works": 0.8,
  "/why-munib-tracker": 0.7,
  "/compare": 0.7,
  "/resources": 0.8,
  "/for": 0.7,
  "/learn": 0.8,
  "/faq": 0.6,
  "/about": 0.6,
  "/privacy": 0.4,
  "/terms": 0.3,
  "/credits": 0.4,
};

/** Real screenshots shown on static pages (homepage tour, hubs, how it works). */
const STATIC_IMAGES: Partial<Record<string, readonly ScreenshotKey[]>> = {
  "/": ["home", "tracker", "qaza", "zikr", "quran"],
  "/features": ["home"],
  "/how-it-works": ["home-light", "home", "tracker", "zikr", "qaza", "quran"],
  "/why-munib-tracker": ["offline-data", "tracker"],
};

function latest(dates: readonly string[]): string {
  return [...dates].sort().at(-1) ?? STATIC_PAGES_UPDATED;
}

function images(keys: readonly (ScreenshotKey | undefined)[]): string[] {
  const urls = keys
    .filter((k): k is ScreenshotKey => Boolean(k))
    .map((k) => absoluteUrl(getScreenshot(k).src));
  return [...new Set(urls)];
}

function slotKeys(...slots: (ScreenshotSlot | null | undefined)[]): ScreenshotKey[] {
  return slots.filter((s): s is ScreenshotSlot => Boolean(s)).map((s) => s.key);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    lastModified: string,
    priority: number,
    imageKeys: readonly ScreenshotKey[] = [],
  ): MetadataRoute.Sitemap[number] => {
    const url = absoluteUrl(path);
    const imgs = images(imageKeys);
    return {
      url,
      lastModified,
      changeFrequency: "monthly",
      priority,
      alternates: { languages: { [SITE_LOCALE]: url, "x-default": url } },
      ...(imgs.length ? { images: imgs } : {}),
    };
  };

  return [
    ...Object.values(SITE_PATHS).map((path) =>
      entry(path, STATIC_PAGES_UPDATED, STATIC_PRIORITY[path] ?? 0.5, STATIC_IMAGES[path]),
    ),
    ...FEATURE_PAGES.map((f) =>
      entry(featureHref(f.slug), f.updated, 0.9, slotKeys(f.hero, ...(f.gallery ?? []))),
    ),
    ...AUDIENCE_PAGES.map((a) => entry(audienceHref(a.slug), a.updated, 0.7, slotKeys(a.hero))),
    ...COMPARE_PAGES.map((c) => entry(compareHref(c.slug), c.updated, 0.7)),
    ...RESOURCE_CATEGORIES.map((c) =>
      entry(
        categoryHref(c.slug),
        latest(ARTICLES.filter((a) => a.category === c.slug).map((a) => a.updated)),
        0.6,
      ),
    ),
    ...ARTICLES.map((a) => entry(articleHref(a), a.updated, 0.7)),
  ];
}
