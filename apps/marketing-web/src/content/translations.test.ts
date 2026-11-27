import { describe, expect, it } from "vitest";
import { internalLinks } from "@/components/content/rich-text";
import { AUDIENCE_PAGES, getAudiencePages } from "@/content/audiences";
import { COMPARE_PAGES, getComparePages } from "@/content/compare";
import { FEATURE_PAGES, getFeaturePages } from "@/content/features";
import { getFeatureInventory, MUNIB_FEATURE_INVENTORY } from "@/content/munib-features";
import { ARTICLES, articleHref, getArticles } from "@/content/resources";
import { getCategories, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/routing";

/**
 * Translated content must mirror its English source field for field: only
 * prose changes. Structural values (slugs, hrefs, dates, icons, screenshot
 * keys, statuses…) and the verbatim Arabic of cited ayat/hadith must match,
 * and inline `[label](/path)` links must point at the same pages in order.
 */
const STRUCTURAL_KEYS = new Set([
  "slug",
  "icon",
  "group",
  "cluster",
  "published",
  "updated",
  "key",
  "href",
  "feature",
  "category",
  "kind",
  "type",
  "tone",
  "arabic",
  "status",
  "nf",
  "frame",
  "related",
  "guides",
  "app",
  "id",
  "verifiedOn",
  "url",
  "device",
]);

/** Arrays whose strings are all structural (app names/developers are brands). */
const STRUCTURAL_ARRAYS = new Set(["apps"]);

/** Optional prose fields a translation may add or drop (scripture meaning rules). */
const OPTIONAL_PROSE = new Set(["translation", "translationLang", "note"]);

type Shape = unknown;

/** Replaces translatable strings with a marker, keeping structure and structural values. */
/** Keys that hold a slug on some pages but a visible label on others (compare tables). */
const SLUG_OR_LABEL = new Set(["feature", "group"]);
const SLUG = /^[a-z0-9-]+$/;

function isStructural(key: string, value: string): boolean {
  if (!STRUCTURAL_KEYS.has(key)) return false;
  return !SLUG_OR_LABEL.has(key) || SLUG.test(value);
}

function shape(value: unknown, key = "", keepAll = false): Shape {
  if (typeof value === "string") return keepAll || isStructural(key, value) ? value : "…";
  if (Array.isArray(value)) {
    const all = keepAll || STRUCTURAL_ARRAYS.has(key);
    return value.map((v) => shape(v, key, all));
  }
  if (value && typeof value === "object") {
    const out: Record<string, Shape> = {};
    for (const [k, v] of Object.entries(value)) {
      if (OPTIONAL_PROSE.has(k)) continue;
      out[k] = shape(v, k, keepAll);
    }
    return out;
  }
  return value;
}

/** Every inline internal link in a value, in document order. */
function links(value: unknown): string[] {
  if (typeof value === "string") return internalLinks(value);
  if (Array.isArray(value)) return value.flatMap(links);
  if (value && typeof value === "object") return Object.values(value).flatMap(links);
  return [];
}

const REGISTRIES = [
  {
    name: "features",
    source: FEATURE_PAGES,
    get: getFeaturePages,
    key: (e: { slug: string }) => e.slug,
  },
  {
    name: "compare",
    source: COMPARE_PAGES,
    get: getComparePages,
    key: (e: { slug: string }) => e.slug,
  },
  {
    name: "audiences",
    source: AUDIENCE_PAGES,
    get: getAudiencePages,
    key: (e: { slug: string }) => e.slug,
  },
  {
    name: "categories",
    source: RESOURCE_CATEGORIES,
    get: getCategories,
    key: (e: { slug: string }) => e.slug,
  },
  {
    name: "articles",
    source: ARTICLES,
    get: getArticles,
    key: articleHref,
  },
  {
    name: "inventory",
    source: MUNIB_FEATURE_INVENTORY,
    get: getFeatureInventory,
    key: (e: { id: string }) => e.id,
  },
] as const;

const OTHER_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

describe.each(OTHER_LOCALES)("%s content translations", (locale) => {
  for (const registry of REGISTRIES) {
    describe(registry.name, () => {
      const source = registry.source as readonly Record<string, unknown>[];
      const localized = (registry.get as (l: typeof locale) => readonly Record<string, unknown>[])(
        locale,
      );
      const key = registry.key as (e: Record<string, unknown>) => string;
      const translated = localized.filter((entry, i) => entry !== source[i]);

      it("keeps the English order and entries", () => {
        expect(localized.map(key)).toEqual(source.map(key));
      });

      it.each(translated.map((entry) => [key(entry), entry] as const))(
        "%s mirrors the English structure",
        (id, entry) => {
          const english = source.find((e) => key(e) === id);
          expect(shape(entry)).toEqual(shape(english));
          expect(links(entry)).toEqual(links(english));
        },
      );
    });
  }

  it("gives translated pages unique SEO titles and primary keywords", () => {
    const pages = [
      ...getFeaturePages(locale),
      ...getComparePages(locale),
      ...getAudiencePages(locale),
      ...getArticles(locale),
    ].filter(
      (p) =>
        !(
          [...FEATURE_PAGES, ...COMPARE_PAGES, ...AUDIENCE_PAGES, ...ARTICLES] as unknown[]
        ).includes(p),
    );
    const titles = pages.map((p) => p.seoTitle);
    expect(new Set(titles).size).toBe(titles.length);
    const keywords = pages.map((p) => p.keywords[0]);
    expect(new Set(keywords).size).toBe(keywords.length);
  });
});
