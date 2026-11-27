import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { scrolledPercent } from "@/components/google-analytics-page-views";
import { FEATURE_PAGES } from "@/content/features";
import { FEATURE_WEB_APP_PATHS } from "@/content/web-app";
import { contentGroup } from "@/lib/gtag";
import { webAppUrl } from "@/lib/site";

/** expo-router screens of the product app. */
const APP_ROUTES = resolve(__dirname, "../../../app/src/app");

/** True when the web-app path has a screen (`/x` → `x.tsx`, `x/index.tsx`, or a tab). */
function hasScreen(path: string): boolean {
  if (path === "/") return true;
  const rel = path.slice(1);
  return [`${rel}.tsx`, `${rel}/index.tsx`, `(tabs)/${rel}.tsx`].some((p) =>
    existsSync(resolve(APP_ROUTES, p)),
  );
}

describe("feature → web app links", () => {
  it("decides for every feature page whether it can be tried in the browser", () => {
    for (const f of FEATURE_PAGES) expect(FEATURE_WEB_APP_PATHS, f.slug).toHaveProperty(f.slug);
  });

  it("only links to screens that exist in the product app", () => {
    for (const [slug, path] of Object.entries(FEATURE_WEB_APP_PATHS)) {
      if (path) expect(hasScreen(path), `${slug} → ${path}`).toBe(true);
    }
  });

  it("keeps the focus lock app-only (it blocks apps on the phone)", () => {
    expect(FEATURE_WEB_APP_PATHS["salah-focus-lock"]).toBeNull();
  });

  it("tags web-app links with the placement and feature, in the page language", () => {
    expect(
      webAppUrl("ur", "/zakat", { placement: "feature_hero", content: "zakat-calculator" }),
    ).toBe(
      "https://my.munibtracker.app/ur/zakat?utm_source=munibtracker.app&utm_medium=referral&utm_campaign=feature_hero&utm_content=zakat-calculator",
    );
    expect(webAppUrl("en")).toBe("https://my.munibtracker.app");
  });
});

describe("journey analytics helpers", () => {
  it("groups pages by type across languages", () => {
    expect(contentGroup("/en")).toEqual({ content_group: "home", page_language: "en" });
    expect(contentGroup("/ar/features/qibla-finder")).toEqual({
      content_group: "feature",
      page_language: "ar",
    });
    expect(contentGroup("/en/features").content_group).toBe("features_hub");
    expect(contentGroup("/ur/compare/best-free-islamic-apps").content_group).toBe("comparison");
    expect(contentGroup("/en/resources/salah/how-to-make-wudu?x=1").content_group).toBe("guide");
    expect(contentGroup("/en/resources/salah").content_group).toBe("guides_hub");
    expect(contentGroup("/en/why-munib-tracker").content_group).toBe("why_munib_tracker");
  });

  it("measures how far down the page the reader is", () => {
    expect(scrolledPercent(0, 800, 3200)).toBe(0);
    expect(scrolledPercent(1200, 800, 3200)).toBe(50);
    expect(scrolledPercent(5000, 800, 3200)).toBe(100);
    expect(scrolledPercent(0, 900, 800)).toBe(100);
  });
});
