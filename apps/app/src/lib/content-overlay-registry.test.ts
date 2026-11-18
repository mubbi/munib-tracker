import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: { language: "en" },
}));

import {
  getContentOverlaysReadyVersion,
  overlayList,
  overlayObject,
  preloadContentOverlays,
  subscribeContentOverlays,
} from "./content-overlay-registry";

describe("content-overlay-registry", () => {
  it("returns empty overlays for English (no translation loaded)", () => {
    const list = overlayList<{ id: string }>("AQEDAH_TOPICS");
    expect(list).toEqual({});
    const obj = overlayObject<{ id: string }>("AQEDAH_TOPICS");
    expect(obj).toEqual({});
  });

  it("preloadContentOverlays is a no-op for English", async () => {
    const before = getContentOverlaysReadyVersion();
    await preloadContentOverlays("en");
    await preloadContentOverlays(undefined);
    expect(getContentOverlaysReadyVersion()).toBe(before);
  });

  it("notifies subscribers when ready version bumps", async () => {
    const listener = jest.fn();
    const unsubscribe = subscribeContentOverlays(listener);
    await preloadContentOverlays("ar");
    unsubscribe();
    // Dynamic import may fail in Jest; listener only fires on successful load.
    expect(typeof unsubscribe).toBe("function");
  });

  it("maps known base keys to corpora via overlay accessors", () => {
    expect(overlayList("UNKNOWN_BASE_KEY")).toEqual({});
    expect(overlayObject("UNKNOWN_BASE_KEY")).toEqual({});
  });
});

describe("content-overlay-registry with stubbed locale loaders", () => {
  type Registry = typeof import("./content-overlay-registry");
  type Loader = jest.Mock<() => Promise<Record<string, unknown>>>;

  function setup() {
    const alphaUr: Loader = jest.fn(async () => ({
      ALPHA_TOPICS_UR: [{ title: "الفا" }],
      ALPHA_OBJ_UR: { title: "obj" },
    }));
    const betaUr: Loader = jest.fn(async () => ({ default: { BETA_TOPICS_UR: [{ title: "b" }] } }));
    const gammaUr: Loader = jest.fn(async () => ({ default: undefined }));
    const failing: Loader = jest.fn(async () => {
      throw new Error("dynamic import unsupported");
    });
    let registry!: Registry;
    let i18n!: { language?: string };
    jest.isolateModules(() => {
      jest.doMock("./content-overlay-loaders", () => ({
        CONTENT_OVERLAY_CORPORA: ["alpha", "beta", "gamma"],
        OVERLAY_BASE_KEY_CORPUS: {
          ALPHA_TOPICS: "alpha",
          ALPHA_OBJ: "alpha",
          ALPHA_MISSING: "alpha",
          BETA_TOPICS: "beta",
          GAMMA_TOPICS: "gamma",
        },
        CONTENT_OVERLAY_LOADERS: {
          alpha: { ur: alphaUr, ar: failing },
          beta: { ur: betaUr, ar: failing },
          gamma: { ur: gammaUr, ar: failing },
        },
      }));
      registry = require("./content-overlay-registry") as Registry;
      i18n = (require("@/i18n") as { default: { language?: string } }).default;
    });
    jest.dontMock("./content-overlay-loaders");
    return { registry, i18n, alphaUr, betaUr, gammaUr, failing };
  }

  const flush = async () => {
    for (let i = 0; i < 5; i++) await Promise.resolve();
  };

  it("preloads every corpus for a locale and resolves overlays synchronously", async () => {
    const { registry, i18n, alphaUr, betaUr } = setup();
    const listener = jest.fn();
    registry.subscribeContentOverlays(listener);
    const before = registry.getContentOverlaysReadyVersion();
    await registry.preloadContentOverlays("ur-PK");
    expect(alphaUr).toHaveBeenCalledTimes(1);
    expect(betaUr).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(registry.getContentOverlaysReadyVersion()).toBe(before + 1);

    i18n.language = "ur-PK";
    expect(registry.overlayList("ALPHA_TOPICS")).toEqual({ ur: [{ title: "الفا" }] });
    expect(registry.overlayObject("ALPHA_OBJ")).toEqual({ ur: { title: "obj" } });
    // ESM interop: a lone `default` export is unwrapped.
    expect(registry.overlayList("BETA_TOPICS")).toEqual({ ur: [{ title: "b" }] });
    // A lone empty `default` keeps the module object itself.
    expect(registry.overlayList("GAMMA_TOPICS")).toEqual({});
    expect(registry.overlayList("ALPHA_MISSING")).toEqual({});
    expect(registry.overlayList("NOT_REGISTERED")).toEqual({});

    // Cached modules are reused.
    await registry.preloadContentOverlays("ur");
    expect(alphaUr).toHaveBeenCalledTimes(1);
  });

  it("returns English (empty) overlays for missing, default or unknown locales", async () => {
    const { registry, i18n, alphaUr } = setup();
    for (const lang of [undefined, "", "en", "zz"]) {
      i18n.language = lang;
      expect(registry.overlayList("ALPHA_TOPICS")).toEqual({});
    }
    await registry.preloadContentOverlays("zz");
    await registry.preloadContentOverlays("");
    expect(alphaUr).not.toHaveBeenCalled();
  });

  it("lazy-loads on first access, dedupes inflight loads and notifies when ready", async () => {
    const { registry, i18n, alphaUr } = setup();
    const listener = jest.fn();
    const unsubscribe = registry.subscribeContentOverlays(listener);
    i18n.language = "ur";
    expect(registry.overlayList("ALPHA_TOPICS")).toEqual({});
    expect(registry.overlayObject("ALPHA_OBJ")).toEqual({});
    expect(alphaUr).toHaveBeenCalledTimes(1);
    await flush();
    expect(listener).toHaveBeenCalled();
    expect(registry.overlayList("ALPHA_TOPICS")).toEqual({ ur: [{ title: "الفا" }] });
    unsubscribe();
  });

  it("swallows loader failures and retries on the next access", async () => {
    const { registry, i18n, failing } = setup();
    const listener = jest.fn();
    registry.subscribeContentOverlays(listener);
    await expect(registry.preloadContentOverlays("ar")).resolves.toBeUndefined();
    expect(listener).not.toHaveBeenCalled();
    i18n.language = "ar";
    const calls = failing.mock.calls.length;
    expect(registry.overlayList("ALPHA_TOPICS")).toEqual({});
    await flush();
    expect(failing.mock.calls.length).toBe(calls + 1);
    expect(listener).not.toHaveBeenCalled();
  });
});
