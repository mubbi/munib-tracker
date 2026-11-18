import { I18nManager } from "react-native";

import { installBrowser } from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

type Rtl = typeof import("./rtl");

const mockPrepareReload = jest.fn(async () => undefined);
jest.mock("@/lib/i18n/prepare-native-app-reload", () => ({
  prepareForNativeAppReload: () => mockPrepareReload(),
}));

/**
 * `src/i18n` (loaded by jest.setup) already imported `./rtl`, so load a fresh
 * copy that picks up the mock above, plus the matching I18nManager / expo.
 */
function setup(isRTL: boolean) {
  let rtl: Rtl | undefined;
  let reloadAppAsync: jest.Mock | undefined;
  // react-native's I18nManager is shared with the isolated registry.
  jest.replaceProperty(I18nManager, "isRTL", isRTL);
  const manager = {
    isRTL,
    allowRTL: jest.spyOn(I18nManager, "allowRTL").mockImplementation(() => {}),
    forceRTL: jest.spyOn(I18nManager, "forceRTL").mockImplementation(() => {}),
  };
  jest.isolateModules(() => {
    reloadAppAsync = require("expo").reloadAppAsync;
    rtl = require("./rtl");
  });
  reloadAppAsync?.mockClear();
  return {
    rtl: rtl as Rtl,
    reloadAppAsync: reloadAppAsync as jest.Mock,
    manager,
  };
}

beforeEach(() => mockPrepareReload.mockClear());
afterEach(() => jest.restoreAllMocks());

describe("on native", () => {
  it.each([
    [false, "ar", true],
    [false, "en", false],
    [true, "en", true],
    [true, "ur", false],
  ] as const)("isRTL=%p → %s needs a reload: %p", (isRTL, locale, expected) => {
    expect(setup(isRTL).rtl.willRequireNativeReloadForLocale(locale)).toBe(expected);
  });

  it("forces RTL and reloads when the direction changes", async () => {
    const { rtl, reloadAppAsync, manager } = setup(false);
    expect(await rtl.applyRtlForLocale("ar")).toBe(true);
    expect(manager.allowRTL).toHaveBeenCalledWith(true);
    expect(manager.forceRTL).toHaveBeenCalledWith(true);
    expect(mockPrepareReload).toHaveBeenCalled();
    expect(reloadAppAsync).toHaveBeenCalledWith("Locale layout direction changed");
  });

  it("does nothing when the direction already matches", async () => {
    const { rtl, reloadAppAsync, manager } = setup(false);
    expect(await rtl.applyRtlForLocale("en")).toBe(false);
    expect(manager.forceRTL).not.toHaveBeenCalled();
    expect(reloadAppAsync).not.toHaveBeenCalled();
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });

  it("never needs a native reload", () => {
    expect(setup(false).rtl.willRequireNativeReloadForLocale("ar")).toBe(false);
  });

  it("sets the document direction and language", async () => {
    const documentElement = { dir: "", lang: "" };
    const restore = installBrowser({ window: { document: { documentElement } } });
    try {
      expect(await setup(false).rtl.applyRtlForLocale("ur")).toBe(false);
      expect(documentElement).toEqual({ dir: "rtl", lang: "ur" });
      await setup(true).rtl.applyRtlForLocale("en");
      expect(documentElement).toEqual({ dir: "ltr", lang: "en" });
    } finally {
      restore();
    }
  });

  it("tolerates a missing document", async () => {
    expect(await setup(false).rtl.applyRtlForLocale("ar")).toBe(false);
  });
});
