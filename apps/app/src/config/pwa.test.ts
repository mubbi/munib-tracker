import { APP_DESCRIPTION, APP_NAME } from "@munib-tracker/shared/constants";

import { pwaWebManifest, resolvePwaManifestForLocale } from "./pwa";

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
      theme_color: "#152921",
      background_color: "#152921",
      display: "standalone",
    });
  });

  it("falls back to the app name, brand colour and shared description", () => {
    const { pwaWebManifest: manifest } = loadWithAppJson({ name: "Fallback" });
    expect(manifest).toMatchObject({
      name: "Fallback",
      description: APP_DESCRIPTION,
      theme_color: "#152921",
      background_color: "#152921",
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
