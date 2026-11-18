import AsyncStorage from "@react-native-async-storage/async-storage";

import * as overlays from "@/lib/content-overlay-registry";
import * as rtl from "@/lib/i18n/rtl";

import i18n, {
  bootstrapAppLocale,
  changeAppLocale,
  consumePendingRtlReloadLocale,
  getSupportedLocales,
  PENDING_APP_LOCALE_KEY,
  RTL_LAYOUT_RETRY_KEY,
} from "./index";
import { LOCALE_SYNC_LOADERS } from "./locale-sync-loaders";

// jest.setup.ts initialises this module, so collaborators are spied on in place.
const applyRtl = jest.spyOn(rtl, "applyRtlForLocale");
const needsReload = jest.spyOn(rtl, "willRequireNativeReloadForLocale");
jest.spyOn(overlays, "preloadContentOverlays").mockResolvedValue(undefined as never);

beforeEach(async () => {
  await AsyncStorage.clear();
  applyRtl.mockReset().mockResolvedValue(false);
  needsReload.mockReset().mockReturnValue(false);
  consumePendingRtlReloadLocale();
});

afterAll(async () => {
  await changeAppLocale("en");
  jest.restoreAllMocks();
});

describe("getSupportedLocales", () => {
  it("lists English and the translated catalogs", () => {
    expect(getSupportedLocales()).toEqual(expect.arrayContaining(["en", "ar", "ur", "fr"]));
  });
});

describe("changeAppLocale (no native reload)", () => {
  it("loads the catalog, applies direction and switches language", async () => {
    await AsyncStorage.setItem(PENDING_APP_LOCALE_KEY, "ur");
    applyRtl.mockResolvedValue(true);

    await expect(changeAppLocale("fr")).resolves.toBe(true);

    expect(i18n.language).toBe("fr");
    expect(i18n.hasResourceBundle("fr", "translation")).toBe(true);
    expect(applyRtl).toHaveBeenCalledWith("fr");
    expect(await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY)).toBeNull();
  });

  it("is a no-op language switch when already active", async () => {
    await changeAppLocale("tr");
    const change = jest.spyOn(i18n, "changeLanguage");
    await changeAppLocale("tr");
    expect(change).not.toHaveBeenCalled();
    change.mockRestore();
  });
});

describe("changeAppLocale (native RTL reload)", () => {
  beforeEach(() => needsReload.mockReturnValue(true));

  it("applies strings, stashes the locale and reloads immediately", async () => {
    applyRtl.mockResolvedValue(true);
    await expect(changeAppLocale("ar")).resolves.toBe(true);
    expect(i18n.language).toBe("ar");
    expect(applyRtl).toHaveBeenCalledWith("ar");
    expect(await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY)).toBe("ar");
    expect(consumePendingRtlReloadLocale()).toBeNull();
  });

  it("queues the reload for after first paint when deferred", async () => {
    await expect(changeAppLocale("fa", { deferReload: true })).resolves.toBe(true);
    expect(applyRtl).not.toHaveBeenCalled();
    expect(consumePendingRtlReloadLocale()).toBe("fa");
    expect(consumePendingRtlReloadLocale()).toBeNull();
  });
});

describe("bootstrapAppLocale", () => {
  it("ignores an unsupported pending locale", async () => {
    await AsyncStorage.setItem(PENDING_APP_LOCALE_KEY, "xx");
    await AsyncStorage.setItem(RTL_LAYOUT_RETRY_KEY, "xx");
    await bootstrapAppLocale("ms");
    expect(i18n.language).toBe("ms");
  });
});

describe("LOCALE_SYNC_LOADERS", () => {
  it.each(Object.entries(LOCALE_SYNC_LOADERS))("loads the %s catalog", (_code, load) => {
    const catalog = load() as Record<string, unknown>;
    expect(Object.keys(catalog).length).toBeGreaterThan(0);
  });
});
