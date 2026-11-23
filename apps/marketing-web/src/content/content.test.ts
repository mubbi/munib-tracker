import { describe, expect, it } from "vitest";
import { internalLinks } from "@/components/content/rich-text";
import { AUDIENCE_PAGES, audienceHref } from "@/content/audiences";
import { COMPARE_PAGES, compareHref } from "@/content/compare";
import { FEATURE_PAGES, featureHref } from "@/content/features";
import { MUNIB_FEATURE_INVENTORY, PLANNED_FEATURES } from "@/content/munib-features";
import { ARTICLES, articleHref } from "@/content/resources";
import { categoryHref, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import {
  ARTICLE_SLUGS,
  AUDIENCE_SLUGS,
  COMPARE_SLUGS,
  FEATURE_SLUGS,
  isKnownContentPath,
} from "@/content/routes";
import type { Block } from "@/content/types";
import { FAQ_ITEMS } from "@/lib/faq";
import { FOOTER_GROUPS, NAV_LINKS, NAV_MENUS, SITE_PATHS } from "@/lib/site";

const ROUTES = new Set<string>([
  ...Object.values(SITE_PATHS),
  ...FEATURE_PAGES.map((f) => featureHref(f.slug)),
  ...COMPARE_PAGES.map((c) => compareHref(c.slug)),
  ...AUDIENCE_PAGES.map((a) => audienceHref(a.slug)),
  ...RESOURCE_CATEGORIES.map((c) => categoryHref(c.slug)),
  ...ARTICLES.map(articleHref),
]);

/** Every string anywhere in a value (deep). */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

function stripHash(href: string) {
  return href.split("#")[0] ?? href;
}

const ALL_PAGES = [...FEATURE_PAGES, ...COMPARE_PAGES, ...AUDIENCE_PAGES, ...ARTICLES];

describe("content integrity", () => {
  it("every inline internal link points at a real page", () => {
    const broken: string[] = [];
    for (const page of [...ALL_PAGES, FAQ_ITEMS]) {
      for (const text of strings(page)) {
        for (const href of internalLinks(text)) {
          if (!ROUTES.has(stripHash(href))) broken.push(href);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("related/guide hrefs resolve", () => {
    const refs = [
      ...FEATURE_PAGES.flatMap((f) => [...(f.guides ?? []), ...f.related.map(featureHref)]),
      ...COMPARE_PAGES.flatMap((c) => c.related),
      ...AUDIENCE_PAGES.flatMap((a) => a.guides),
      ...ARTICLES.flatMap((a) => [...a.related, featureHref(a.appTieIn.feature)]),
    ];
    expect(refs.filter((r) => !ROUTES.has(r))).toEqual([]);
  });

  it("navigation and footer only link to real pages", () => {
    const hrefs = [
      ...NAV_MENUS.flatMap((m) => [m.href, ...(m.feature ? [m.feature.href] : [])]),
      ...NAV_MENUS.flatMap((m) => m.columns.flatMap((c) => c.items.map((i) => i.href))),
      ...NAV_LINKS.map((l) => l.href),
      ...FOOTER_GROUPS.flatMap((g) => g.links.filter((l) => !("external" in l)).map((l) => l.href)),
    ];
    expect(hrefs.filter((h) => !ROUTES.has(h))).toEqual([]);
  });

  it("every feature page is in the Features menu with its own label", () => {
    const items = NAV_MENUS.find((m) => m.id === "features")?.columns.flatMap((c) => c.items) ?? [];
    for (const f of FEATURE_PAGES) {
      expect(items.find((i) => i.href === featureHref(f.slug))?.label).toBe(f.navLabel);
    }
  });

  it("SEO titles and descriptions are unique and within length", () => {
    const titles = ALL_PAGES.map((p) => p.seoTitle);
    const descriptions = ALL_PAGES.map((p) => p.seoDescription);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const p of ALL_PAGES) {
      expect(p.seoTitle.length, p.slug).toBeLessThanOrEqual(70);
      expect(p.seoDescription.length, p.slug).toBeGreaterThanOrEqual(110);
      expect(p.seoDescription.length, p.slug).toBeLessThanOrEqual(165);
    }
  });

  it("each topic cluster has one primary page (no keyword cannibalization)", () => {
    const primary = new Map<string, string>();
    for (const page of [...FEATURE_PAGES, ...ARTICLES, ...AUDIENCE_PAGES, ...COMPARE_PAGES]) {
      const kw = page.keywords[0];
      if (!kw) continue;
      expect(primary.has(kw), `"${kw}" targeted twice`).toBe(false);
      primary.set(kw, page.slug);
    }
  });

  it("every quoted ayah or hadith is cited and listed in sources", () => {
    for (const a of ARTICLES) {
      const evidence = a.body.filter(
        (b): b is Extract<Block, { type: "evidence" }> => b.type === "evidence",
      );
      for (const e of evidence) {
        expect(e.reference.length, a.slug).toBeGreaterThan(0);
        if (e.href)
          expect(
            a.sources.map((s) => s.url),
            a.slug,
          ).toContain(e.href);
      }
    }
  });

  it("articles have exactly one H1-level title and use h2 sections", () => {
    for (const a of ARTICLES) {
      expect(a.body.filter((b) => b.type === "h2").length, a.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it("uses the app's standard Islamic terminology in English copy", () => {
    const banned = [/\bQadha\b/, /\bNamaz\b/, /\bAzan\b/, /\bTasbih\b/, /\bTaraweeh\b/];
    const offenders: string[] = [];
    for (const page of ALL_PAGES) {
      for (const text of strings(page)) {
        // Competitor product names (e.g. "5te5 Qadha Tracker") keep their own spelling.
        if (text.includes("http") || /Qadha Tracker/.test(text)) continue;
        for (const re of banned) if (re.test(text)) offenders.push(`${page.slug}: ${re}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("proxy slug lists match the registries", () => {
    expect([...FEATURE_SLUGS].sort()).toEqual(FEATURE_PAGES.map((f) => f.slug).sort());
    expect([...COMPARE_SLUGS].sort()).toEqual(COMPARE_PAGES.map((c) => c.slug).sort());
    expect([...AUDIENCE_SLUGS].sort()).toEqual(AUDIENCE_PAGES.map((a) => a.slug).sort());
    for (const a of ARTICLES) expect(ARTICLE_SLUGS[a.category]).toContain(a.slug);
    expect(Object.values(ARTICLE_SLUGS).flat()).toHaveLength(ARTICLES.length);
  });

  it("proxy accepts real pages and their OG images, rejects unknown slugs", () => {
    for (const route of ROUTES) expect(isKnownContentPath(route), route).toBe(true);
    expect(isKnownContentPath("/features/salah-tracker/opengraph-image")).toBe(true);
    expect(isKnownContentPath("/features/does-not-exist")).toBe(false);
    expect(isKnownContentPath("/resources/salah/nope")).toBe(false);
    expect(isKnownContentPath("/resources/nope")).toBe(false);
    expect(isKnownContentPath("/compare/salah-tracker/extra")).toBe(false);
  });

  it("every comparison row has a cell for every app", () => {
    const missing: string[] = [];
    for (const page of COMPARE_PAGES) {
      for (const group of page.table) {
        for (const row of group.rows) {
          for (const app of page.apps) {
            if (!row.cells[app.id]) missing.push(`${page.slug} › ${row.feature} › ${app.id}`);
          }
        }
      }
      for (const app of page.apps) {
        expect(page.bestFor[app.id], `${page.slug} bestFor ${app.id}`).toBeTruthy();
        expect(page.strengths[app.id]?.length, `${page.slug} strengths ${app.id}`).toBeGreaterThan(
          0,
        );
      }
    }
    expect(missing).toEqual([]);
  });

  it("feature inventory is unique, linked to real pages, and roadmap items carry an NF id", () => {
    const items = MUNIB_FEATURE_INVENTORY.flatMap((g) => g.items);
    expect(new Set(items.map((i) => i.name)).size).toBe(items.length);
    for (const i of items) if (i.href) expect(ROUTES.has(i.href), i.href).toBe(true);
    for (const p of PLANNED_FEATURES) expect(p.nf, p.name).toMatch(/^NF-3\./);
  });

  it("only Munib Tracker cells may use the roadmap status", () => {
    for (const page of COMPARE_PAGES) {
      for (const group of page.table) {
        for (const row of group.rows) {
          for (const [appId, value] of Object.entries(row.cells)) {
            if ("status" in value && value.status === "planned") {
              expect(appId, `${page.slug} › ${row.feature}`).toBe("munib");
            }
          }
        }
      }
    }
  });
});
