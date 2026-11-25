import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURE_PAGES } from "@/content/features";
import { ARTICLES } from "@/content/resources";
import { SITE_URL } from "@/lib/site";
import sitemap from "./sitemap";

describe("sitemap.xml", () => {
  const entries = sitemap();

  it("lists every page once, with absolute URLs", () => {
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url.startsWith(SITE_URL)).toBe(true);
    for (const f of FEATURE_PAGES) expect(urls).toContain(`${SITE_URL}/en/features/${f.slug}`);
    for (const a of ARTICLES)
      expect(urls).toContain(`${SITE_URL}/en/resources/${a.category}/${a.slug}`);
  });

  it("gives every entry a date and hreflang alternates", () => {
    for (const e of entries) {
      expect(e.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const languages = e.alternates?.languages ?? {};
      expect(Object.values(languages)).toContain(e.url);
      expect(languages).toHaveProperty("en");
      expect(languages).toHaveProperty("x-default", languages.en);
    }
  });

  it("only lists images that exist in /public", () => {
    const images = entries.flatMap((e) => e.images ?? []);
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      const path = img.slice(SITE_URL.length);
      expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
    }
  });
});
