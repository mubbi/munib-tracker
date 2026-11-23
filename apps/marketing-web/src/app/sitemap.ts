import type { MetadataRoute } from "next";
import { AUDIENCE_PAGES, audienceHref } from "@/content/audiences";
import { COMPARE_PAGES, compareHref } from "@/content/compare";
import { FEATURE_PAGES, featureHref } from "@/content/features";
import { ARTICLES, articleHref } from "@/content/resources";
import { categoryHref, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import { absoluteUrl } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

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

function latest(dates: readonly string[]): string {
  return [...dates].sort().at(-1) ?? STATIC_PAGES_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, lastModified: string, priority: number) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  });

  return [
    ...Object.values(SITE_PATHS).map((path) =>
      entry(path, STATIC_PAGES_UPDATED, STATIC_PRIORITY[path] ?? 0.5),
    ),
    ...FEATURE_PAGES.map((f) => entry(featureHref(f.slug), f.updated, 0.9)),
    ...AUDIENCE_PAGES.map((a) => entry(audienceHref(a.slug), a.updated, 0.7)),
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
