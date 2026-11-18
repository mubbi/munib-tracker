import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";

import { absoluteUrl, canonicalUrl, formatTitle, localizedUrl, SEO_ORIGIN } from "./seo";

describe("absoluteUrl", () => {
  it.each([
    [undefined, SEO_ORIGIN],
    ["", SEO_ORIGIN],
    ["/", SEO_ORIGIN],
    ["quran", `${SEO_ORIGIN}/quran`],
    ["//quran", `${SEO_ORIGIN}/quran`],
    ["https://example.com/x", "https://example.com/x"],
  ])("absoluteUrl(%p) is %p", (path, expected) => {
    expect(absoluteUrl(path)).toBe(expected);
  });
});

describe("canonicalUrl", () => {
  it("leaves English unprefixed and normalises the path", () => {
    expect(canonicalUrl("/quran/")).toBe(`${SEO_ORIGIN}/quran`);
  });

  it("prefixes other locales", () => {
    expect(canonicalUrl("/quran", "ar")).toBe(`${SEO_ORIGIN}/ar/quran`);
  });
});

describe("localizedUrl", () => {
  it("delegates to the locale path builder", () => {
    expect(localizedUrl("/quran", "ur")).toContain("/ur/quran");
  });
});

describe("formatTitle", () => {
  it.each([
    [undefined, false, `${APP_NAME} — ${APP_TAGLINE}`],
    ["Home", true, "Home"],
    ["Qur'an", false, `Qur'an · ${APP_NAME}`],
  ])("formatTitle(%p, home=%p)", (title, isHome, expected) => {
    expect(formatTitle(title, { isHome })).toBe(expected);
  });
});

describe("origins", () => {
  const saved = { app: process.env.EXPO_PUBLIC_APP_URL, site: process.env.EXPO_PUBLIC_SITE_URL };

  afterEach(() => {
    process.env.EXPO_PUBLIC_APP_URL = saved.app;
    process.env.EXPO_PUBLIC_SITE_URL = saved.site;
    if (saved.app === undefined) delete process.env.EXPO_PUBLIC_APP_URL;
    if (saved.site === undefined) delete process.env.EXPO_PUBLIC_SITE_URL;
  });

  function load(): typeof import("./seo") {
    let mod!: typeof import("./seo");
    jest.isolateModules(() => {
      mod = require("./seo");
    });
    return mod;
  }

  it("honours per-environment origins and strips trailing slashes", () => {
    process.env.EXPO_PUBLIC_APP_URL = "https://preview.example.com///";
    process.env.EXPO_PUBLIC_SITE_URL = "https://site.example.com/";
    const mod = load();
    expect(mod.SEO_ORIGIN).toBe("https://preview.example.com");
    expect(mod.MARKETING_ORIGIN).toBe("https://site.example.com");
  });

  it("falls back to the production origins", () => {
    delete process.env.EXPO_PUBLIC_APP_URL;
    delete process.env.EXPO_PUBLIC_SITE_URL;
    const mod = load();
    expect(mod.SEO_ORIGIN).toBe("https://my.munibtracker.app");
    expect(mod.MARKETING_ORIGIN).toBe("https://munibtracker.app");
  });
});
