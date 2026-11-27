import { describe, expect, it } from "vitest";
import { AUDIENCE_PAGES, audienceHref } from "@/content/audiences";
import { COMPARE_PAGES, compareHref } from "@/content/compare";
import { FEATURE_PAGES, featureHref } from "@/content/features";
import { ARTICLES, articleHref } from "@/content/resources";
import { categoryHref, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import {
  absolutizeLinks,
  buildLlmsFullTxt,
  buildLlmsTxt,
  markdownPaths,
  markdownUrl,
  pageMarkdown,
} from "@/lib/llms";
import { localizedUrl } from "@/lib/seo";
import { SITE_PATHS, SITE_URL } from "@/lib/site";

const ROUTES = new Set(
  [
    ...Object.values(SITE_PATHS),
    ...FEATURE_PAGES.map((f) => featureHref(f.slug)),
    ...COMPARE_PAGES.map((c) => compareHref(c.slug)),
    ...AUDIENCE_PAGES.map((a) => audienceHref(a.slug)),
    ...RESOURCE_CATEGORIES.map((c) => categoryHref(c.slug)),
    ...ARTICLES.map(articleHref),
  ].map((path) => localizedUrl(path, "en")),
);

/** Every Markdown link target in `text`. */
function linkTargets(text: string): string[] {
  return [...text.matchAll(/\]\((\S+?)\)/g)].map((m) => m[1] ?? "");
}

function siteLinks(text: string): string[] {
  return linkTargets(text).filter((href) => href.startsWith(SITE_URL));
}

describe("llms.txt", () => {
  const txt = buildLlmsTxt();
  const lines = txt.split("\n");

  // The reference parser's structure (https://llmstxt.org/#existing-standards).
  it("follows the llmstxt.org structure", () => {
    expect(lines[0]).toMatch(/^# \S/);
    expect(lines.filter((l) => l.startsWith("# "))).toHaveLength(1);
    expect(lines[2]).toMatch(/^> \S/);
    // Only H1 and H2 headings; nothing but file lists under an H2.
    expect(lines.filter((l) => /^#{3,} /.test(l))).toEqual([]);
    const firstSection = lines.findIndex((l) => l.startsWith("## "));
    expect(firstSection).toBeGreaterThan(2);
    for (const line of lines.slice(firstSection)) {
      if (!line || line.startsWith("## ")) continue;
      expect(line).toMatch(/^- \[[^\]]+\]\(https:\/\/\S+\): \S/);
    }
  });

  it('keeps "Optional" as the last section', () => {
    const sections = lines.filter((l) => l.startsWith("## "));
    expect(sections.at(-1)).toBe("## Optional");
    expect(new Set(sections).size).toBe(sections.length);
  });

  it("lists every content page once, with a real URL", () => {
    const links = siteLinks(lines.filter((l) => l.startsWith("- [")).join("\n"));
    const pages = links.filter((href) => !href.endsWith(".txt") && !/\/(ar|ur)$/.test(href));
    for (const href of pages) expect(ROUTES.has(href), href).toBe(true);
    const listed = lines
      .slice(lines.findIndex((l) => l.startsWith("## ")))
      .flatMap((l) => linkTargets(l));
    expect(new Set(listed).size).toBe(listed.length);
    for (const f of FEATURE_PAGES)
      expect(listed).toContain(localizedUrl(featureHref(f.slug), "en"));
    for (const c of COMPARE_PAGES)
      expect(listed).toContain(localizedUrl(compareHref(c.slug), "en"));
    for (const a of AUDIENCE_PAGES)
      expect(listed).toContain(localizedUrl(audienceHref(a.slug), "en"));
    for (const a of ARTICLES) expect(listed).toContain(localizedUrl(articleHref(a), "en"));
  });

  it("leaves no unfilled catalog arguments", () => {
    expect(txt).not.toMatch(/\{\w+(?:,\s*\w+)?\}/);
    expect(buildLlmsFullTxt()).not.toMatch(/\{(appName|duaCount|license)\b/);
  });
});

describe("llms-full.txt", () => {
  const full = buildLlmsFullTxt();

  it("has one H1 and the text of every content page", () => {
    expect(full.split("\n").filter((l) => l.startsWith("# "))).toHaveLength(1);
    for (const page of [...FEATURE_PAGES, ...COMPARE_PAGES, ...AUDIENCE_PAGES, ...ARTICLES]) {
      expect(full, page.slug).toContain(`### ${page.title}`);
    }
    for (const f of FEATURE_PAGES) {
      expect(full).toContain(`Source: ${localizedUrl(featureHref(f.slug), "en")}`);
    }
  });

  it("only links to real pages on this site", () => {
    for (const href of siteLinks(full)) {
      const page = href.split("#")[0] ?? href;
      if (page.endsWith(".txt") || /\/(ar|ur)$/.test(page)) continue;
      expect(ROUTES.has(page), href).toBe(true);
    }
    // No relative links survive: an assistant reads this file out of context.
    expect(full).not.toMatch(/\]\(\//);
  });
});

describe("per-page Markdown", () => {
  it("has an edition for every feature, audience, comparison and guide page", () => {
    const expected = [
      ...FEATURE_PAGES.map((f) => featureHref(f.slug)),
      ...AUDIENCE_PAGES.map((a) => audienceHref(a.slug)),
      ...COMPARE_PAGES.map((c) => compareHref(c.slug)),
      ...ARTICLES.map(articleHref),
    ];
    expect(markdownPaths().sort()).toEqual(expected.sort());
  });

  it("matches the URLs next.config.ts rewrites", () => {
    // Keep in sync with the `rewrites()` sources in next.config.ts.
    const rewrite =
      /^\/en\/(?:(?:features|compare|for)\/[a-z0-9-]+|resources\/[a-z0-9-]+\/[a-z0-9-]+)\.md$/;
    for (const path of markdownPaths()) {
      expect(markdownUrl(path).slice(SITE_URL.length), path).toMatch(rewrite);
    }
  });

  it("renders one H1, H2 sections and absolute links", () => {
    for (const path of markdownPaths()) {
      const text = pageMarkdown(path) ?? "";
      const lines = text.split("\n");
      expect(
        lines.filter((l) => l.startsWith("# ")),
        path,
      ).toHaveLength(1);
      expect(lines[0], path).toMatch(/^# \S/);
      expect(
        lines.filter((l) => /^#{3,} /.test(l)),
        path,
      ).toEqual([]);
      expect(text, path).not.toMatch(/\]\(\//);
      expect(text, path).toContain(`Source: ${localizedUrl(path, "en")}`);
    }
    expect(pageMarkdown("/features/does-not-exist")).toBeUndefined();
  });
});

describe("absolutizeLinks", () => {
  it("prefixes internal links with the origin and locale, keeping hashes", () => {
    expect(absolutizeLinks("See [credits](/credits) and [FAQ](/faq#data).")).toBe(
      `See [credits](${SITE_URL}/en/credits) and [FAQ](${SITE_URL}/en/faq#data).`,
    );
    expect(absolutizeLinks("[x](https://example.com)")).toBe("[x](https://example.com)");
  });
});
