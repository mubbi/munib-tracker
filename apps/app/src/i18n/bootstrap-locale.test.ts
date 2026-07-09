import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";

import {
  bootstrapAppLocale,
  consumePendingRtlReloadLocale,
  PENDING_APP_LOCALE_KEY,
  RTL_LAYOUT_RETRY_KEY,
} from "@/i18n";

jest.mock("@/lib/i18n/rtl", () => {
  const actual = jest.requireActual<typeof import("@/lib/i18n/rtl")>("@/lib/i18n/rtl");
  return {
    ...actual,
    applyRtlForLocale: jest.fn(async () => true),
    willRequireNativeReloadForLocale: jest.fn((code: string) => code === "ur"),
  };
});

const rtl = jest.requireMock<typeof import("@/lib/i18n/rtl")>("@/lib/i18n/rtl");

describe("bootstrapAppLocale", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    Object.defineProperty(I18nManager, "isRTL", { configurable: true, value: false });
  });

  it("falls back to strings when an RTL reload was already attempted", async () => {
    await AsyncStorage.setItem(PENDING_APP_LOCALE_KEY, "ur");
    await AsyncStorage.setItem(RTL_LAYOUT_RETRY_KEY, "ur");

    const reloaded = await bootstrapAppLocale("en");

    expect(reloaded).toBe(false);
    expect(rtl.applyRtlForLocale).not.toHaveBeenCalled();
    expect(await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY)).toBeNull();
    expect(await AsyncStorage.getItem(RTL_LAYOUT_RETRY_KEY)).toBeNull();
  });

  it("defers native reload on the first RTL mismatch", async () => {
    const reloaded = await bootstrapAppLocale("ur");

    expect(reloaded).toBe(true);
    expect(rtl.applyRtlForLocale).not.toHaveBeenCalled();
    expect(consumePendingRtlReloadLocale()).toBe("ur");
    expect(await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY)).toBe("ur");
    expect(await AsyncStorage.getItem(RTL_LAYOUT_RETRY_KEY)).toBe("ur");
  });
});
