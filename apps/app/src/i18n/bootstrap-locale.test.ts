import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";

import {
  bootstrapAppLocale,
  consumePendingRtlReloadLocale,
  PENDING_APP_LOCALE_KEY,
  RTL_LAYOUT_RETRY_KEY,
} from "@/i18n";

// `@/i18n` is preloaded by jest.setup.ts, so a `jest.mock("@/lib/i18n/rtl")` here
// would never reach it — spy on the real export it calls instead.
import * as rtl from "@/lib/i18n/rtl";

describe("bootstrapAppLocale", () => {
  let applyRtlForLocale: jest.SpiedFunction<typeof rtl.applyRtlForLocale>;

  beforeEach(async () => {
    applyRtlForLocale = jest.spyOn(rtl, "applyRtlForLocale").mockResolvedValue(true);
    await AsyncStorage.clear();
    Object.defineProperty(I18nManager, "isRTL", { configurable: true, value: false });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("applies layout direction directly when no native reload is needed", async () => {
    const result = await bootstrapAppLocale("en");

    expect(applyRtlForLocale).toHaveBeenCalledWith("en");
    expect(result).toBe(true);
  });

  it("falls back to strings when an RTL reload was already attempted", async () => {
    await AsyncStorage.setItem(PENDING_APP_LOCALE_KEY, "ur");
    await AsyncStorage.setItem(RTL_LAYOUT_RETRY_KEY, "ur");

    const reloaded = await bootstrapAppLocale("en");

    expect(reloaded).toBe(false);
    expect(applyRtlForLocale).not.toHaveBeenCalled();
    expect(await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY)).toBeNull();
    expect(await AsyncStorage.getItem(RTL_LAYOUT_RETRY_KEY)).toBeNull();
  });

  it("defers native reload on the first RTL mismatch", async () => {
    const reloaded = await bootstrapAppLocale("ur");

    expect(reloaded).toBe(true);
    expect(applyRtlForLocale).not.toHaveBeenCalled();
    expect(consumePendingRtlReloadLocale()).toBe("ur");
    expect(await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY)).toBe("ur");
    expect(await AsyncStorage.getItem(RTL_LAYOUT_RETRY_KEY)).toBe("ur");
  });
});
