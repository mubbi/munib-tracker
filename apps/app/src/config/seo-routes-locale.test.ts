import { APP_LOCALE_CODES, type AppLocale } from "@munib-tracker/shared/i18n";
import { SEO_ROUTES } from "./seo-routes";
import frPack from "./seo-routes-locale/fr.json";

type SeoRoutesLocale = typeof import("./seo-routes-locale");

/** Fresh module per test — the pack cache and in-flight map are module state. */
function loadSeoRoutesLocale(): SeoRoutesLocale {
  let mod!: SeoRoutesLocale;
  jest.isolateModules(() => {
    mod = require("./seo-routes-locale");
  });
  return mod;
}

const translatedLocales = APP_LOCALE_CODES.filter((code) => code !== "en");

describe("ensureSeoLocale", () => {
  it("needs no pack for English", async () => {
    await expect(loadSeoRoutesLocale().ensureSeoLocale("en")).resolves.toBeUndefined();
  });

  it("resolves nothing for an unknown locale", async () => {
    const { ensureSeoLocale } = loadSeoRoutesLocale();
    await expect(ensureSeoLocale("xx" as AppLocale)).resolves.toBeUndefined();
  });

  it.each(translatedLocales)("loads a %s pack that only overlays known routes", async (locale) => {
    const pack = await loadSeoRoutesLocale().ensureSeoLocale(locale);
    expect(pack).toBeDefined();
    for (const route of Object.keys(pack ?? {})) expect(SEO_ROUTES).toHaveProperty([route]);
  });

  it("shares one in-flight load between concurrent callers", async () => {
    const { ensureSeoLocale } = loadSeoRoutesLocale();
    const first = ensureSeoLocale("fr");
    expect(ensureSeoLocale("fr")).toBe(first);
    await expect(first).resolves.toEqual(frPack);
  });

  it("serves later calls from the cache", async () => {
    const { ensureSeoLocale } = loadSeoRoutesLocale();
    const pack = await ensureSeoLocale("fr");
    await expect(ensureSeoLocale("fr")).resolves.toBe(pack);
  });

  it("forgets a failed load so the next call retries", async () => {
    jest.doMock("./seo-routes-locale/tr.json", () => {
      throw new Error("chunk failed");
    });
    const { ensureSeoLocale } = loadSeoRoutesLocale();
    const failed = ensureSeoLocale("tr");
    await expect(failed).rejects.toThrow("chunk failed");
    const retry = ensureSeoLocale("tr");
    expect(retry).not.toBe(failed);
    await expect(retry).rejects.toThrow("chunk failed");
    jest.dontMock("./seo-routes-locale/tr.json");
  });
});

describe("getRouteSeoForLocale", () => {
  it("returns the English registry entry for a normalised path", () => {
    const { getRouteSeoForLocale } = loadSeoRoutesLocale();
    expect(getRouteSeoForLocale("/achievements/?tab=1")).toEqual(SEO_ROUTES["/achievements"]);
  });

  it("returns undefined for an unknown route", () => {
    const { getRouteSeoForLocale } = loadSeoRoutesLocale();
    expect(getRouteSeoForLocale("/not-a-route", "ar")).toBeUndefined();
  });

  it("overlays the loaded locale's title and description", async () => {
    const { ensureSeoLocale, getRouteSeoForLocale } = loadSeoRoutesLocale();
    await ensureSeoLocale("fr");
    expect(getRouteSeoForLocale("/", "fr")).toEqual({
      ...SEO_ROUTES["/"],
      title: frPack["/"].title,
      description: frPack["/"].description,
    });
  });

  it("falls back to English when the locale pack is not loaded", () => {
    const { getRouteSeoForLocale } = loadSeoRoutesLocale();
    expect(getRouteSeoForLocale("/achievements", "ar")).toEqual(SEO_ROUTES["/achievements"]);
  });
});
