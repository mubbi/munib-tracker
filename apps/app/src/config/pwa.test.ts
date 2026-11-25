import { APP_DESCRIPTION, APP_NAME } from "@munib-tracker/shared/constants";
import { resolveTheme } from "@munib-tracker/theme/resolve";

import appJson from "../../app.json";
import publicManifest from "../../public/manifest.json";
import {
  PWA_THEME_COLOR,
  PWA_THEME_COLOR_DARK,
  PWA_THEME_COLOR_LIGHT,
  pwaWebManifest,
  resolvePwaManifestForLocale,
} from "./pwa";

const LIGHT_BACKGROUND = resolveTheme("light", "light").background;

/** Loads a fresh copy of the module against a substitute `app.json`. */
function loadWithAppJson(expo: Record<string, unknown>): typeof import("./pwa") {
  let mod!: typeof import("./pwa");
  jest.isolateModules(() => {
    jest.doMock("../../app.json", () => ({ expo }));
    mod = require("./pwa");
  });
  return mod;
}

describe("pwaWebManifest", () => {
  it("is built from the app's web config", () => {
    expect(pwaWebManifest).toMatchObject({
      name: "Munib Tracker",
      display: "standalone",
    });
  });

  it("takes its colours from the light theme base (no dark first paint)", () => {
    expect(pwaWebManifest.theme_color).toBe(LIGHT_BACKGROUND);
    expect(pwaWebManifest.background_color).toBe(LIGHT_BACKGROUND);
    expect(PWA_THEME_COLOR).toBe(LIGHT_BACKGROUND);
    expect(PWA_THEME_COLOR_LIGHT).toBe(LIGHT_BACKGROUND);
    expect(PWA_THEME_COLOR_DARK).toBe(resolveTheme("dark", "dark").background);
  });

  it("keeps app.json and the committed manifest in step with the theme", () => {
    // `scripts/sync-pwa-manifest.mjs` writes public/manifest.json from app.json.
    expect(appJson.expo.web).toMatchObject({
      themeColor: LIGHT_BACKGROUND,
      backgroundColor: LIGHT_BACKGROUND,
    });
    expect(publicManifest).toMatchObject({
      theme_color: LIGHT_BACKGROUND,
      background_color: LIGHT_BACKGROUND,
    });
  });

  it("falls back to the app name, theme colour and shared description", () => {
    const { pwaWebManifest: manifest } = loadWithAppJson({ name: "Fallback" });
    expect(manifest).toMatchObject({
      name: "Fallback",
      description: APP_DESCRIPTION,
      theme_color: LIGHT_BACKGROUND,
      background_color: LIGHT_BACKGROUND,
    });
  });

  it("uses the shared app name when Expo has none", () => {
    expect(loadWithAppJson({}).pwaWebManifest.short_name).toBe(APP_NAME);
  });
});

describe("resolvePwaManifestForLocale", () => {
  it("defaults to English left-to-right", () => {
    expect(resolvePwaManifestForLocale()).toMatchObject({ lang: "en", dir: "ltr" });
  });

  it("switches language and direction for Arabic", () => {
    expect(resolvePwaManifestForLocale("ar")).toMatchObject({
      dir: "rtl",
      lang: expect.stringMatching(/^ar/),
    });
  });
});
