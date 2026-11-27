import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { changedSince, INDEXNOW_KEY, indexNowPayload, parseSitemap } from "../../scripts/indexnow";

const XML = `<?xml version="1.0"?><urlset>
<url><loc>https://munibtracker.app/en/features/qibla-finder</loc><lastmod>2026-11-27</lastmod>
<xhtml:link rel="alternate" hreflang="ar" href="https://munibtracker.app/ar/features/qibla-finder"/></url>
<url><loc>https://munibtracker.app/en/about</loc><lastmod>2026-11-20T00:00:00.000Z</lastmod></url>
<url><loc>https://munibtracker.app/en/faq</loc></url>
</urlset>`;

describe("IndexNow ping", () => {
  it("serves its key file from the site root", () => {
    const file = resolve(__dirname, `../../public/${INDEXNOW_KEY}.txt`);
    expect(readFileSync(file, "utf8").trim()).toBe(INDEXNOW_KEY);
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
  });

  it("reads page URLs and dates from the sitemap, not alternate links", () => {
    expect(parseSitemap(XML)).toEqual([
      { loc: "https://munibtracker.app/en/features/qibla-finder", lastmod: "2026-11-27" },
      { loc: "https://munibtracker.app/en/about", lastmod: "2026-11-20T00:00:00.000Z" },
      { loc: "https://munibtracker.app/en/faq" },
    ]);
  });

  it("submits only pages changed since the last ping (undated pages always)", () => {
    const entries = parseSitemap(XML);
    expect(changedSince(entries, "2026-11-25")).toEqual([
      "https://munibtracker.app/en/features/qibla-finder",
      "https://munibtracker.app/en/faq",
    ]);
    expect(changedSince(entries, null)).toHaveLength(3);
  });

  it("builds a request for this host only, with the hosted key location", () => {
    const body = indexNowPayload("https://munibtracker.app", [
      "https://munibtracker.app/en/faq",
      "https://elsewhere.example/x",
    ]);
    expect(body).toEqual({
      host: "munibtracker.app",
      key: INDEXNOW_KEY,
      keyLocation: `https://munibtracker.app/${INDEXNOW_KEY}.txt`,
      urlList: ["https://munibtracker.app/en/faq"],
    });
  });

  it("can read every URL of the real sitemap with its date", () => {
    const entries = sitemap();
    const xml = `<urlset>${entries
      .map((e) => `<url><loc>${e.url}</loc><lastmod>${e.lastModified}</lastmod></url>`)
      .join("")}</urlset>`;
    expect(parseSitemap(xml)).toHaveLength(entries.length);
  });
});
