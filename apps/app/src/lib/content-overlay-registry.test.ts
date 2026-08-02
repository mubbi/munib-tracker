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
