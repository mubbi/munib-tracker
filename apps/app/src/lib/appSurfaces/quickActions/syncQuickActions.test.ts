import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Platform } from "react-native";

import { ANDROID_QUICK_ACTION_LIMIT, IOS_QUICK_ACTION_LIMIT } from "@/lib/appSurfaces/config";

const mockSetItems = jest.fn<(items: unknown[]) => Promise<void>>();
const mockIsSupported = jest.fn<() => Promise<boolean>>();

jest.mock("expo-quick-actions", () => ({
  isSupported: () => mockIsSupported(),
  setItems: (items: unknown[]) => mockSetItems(items),
  maxCount: undefined,
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => false,
}));

jest.mock("@/lib/ramadan", () => ({
  getRamadanInfo: () => ({ isRamadan: false }),
}));

jest.mock("@/lib/sentry", () => ({
  captureAppException: jest.fn(),
}));

jest.mock("@/stores/location-store", () => ({
  locationStore: { getState: () => ({ location: null }) },
}));

import { QUICK_ACTION_REGISTRY } from "@/lib/appSurfaces/quickActions/registry";
import {
  definitionToAction,
  isLegacyAndroidQuickActionCastError,
  resolveQuickActionLimit,
  syncAppQuickActions,
} from "@/lib/appSurfaces/quickActions/syncQuickActions";
import { captureAppException } from "@/lib/sentry";

const t = ((key: string, options?: { defaultValue?: string } | string) => {
  if (typeof options === "string") return options;
  return options?.defaultValue ?? key;
}) as import("i18next").TFunction;

describe("definitionToAction", () => {
  const def = QUICK_ACTION_REGISTRY[0];
  if (!def) throw new Error("expected a registered quick action");

  it("omits subtitle on Android so the native Record converter never sees null", () => {
    const action = definitionToAction(def, t, false);
    expect(action).toEqual({
      id: def.id,
      title: def.titleFallback,
      icon: def.androidIcon,
      params: { href: def.href },
    });
    expect(Object.hasOwn(action, "subtitle")).toBe(false);
  });

  it("includes subtitle on iOS", () => {
    const action = definitionToAction(def, t, true);
    expect(action.subtitle).toBe(def.subtitleFallback);
    expect(action.icon).toBe(def.iosSymbol);
  });

  it("uses the fallback label when i18n returns an empty string", () => {
    const empty = (() => "   ") as import("i18next").TFunction;
    const action = definitionToAction(def, empty, true);
    expect(action.title).toBe(def.titleFallback);
    expect(action.subtitle).toBe(def.subtitleFallback);
  });
});

describe("resolveQuickActionLimit", () => {
  it("uses the iOS haptic-touch cap", () => {
    expect(resolveQuickActionLimit(true, 15)).toBe(IOS_QUICK_ACTION_LIMIT);
  });

  it("uses the device-reported Android cap when present", () => {
    expect(resolveQuickActionLimit(false, 15)).toBe(15);
  });

  it("falls back to the Android recommendation when maxCount is missing", () => {
    expect(resolveQuickActionLimit(false)).toBe(ANDROID_QUICK_ACTION_LIMIT);
  });

  it("ignores a non-positive or non-finite Android maxCount", () => {
    expect(resolveQuickActionLimit(false, 0)).toBe(ANDROID_QUICK_ACTION_LIMIT);
    expect(resolveQuickActionLimit(false, -3)).toBe(ANDROID_QUICK_ACTION_LIMIT);
    expect(resolveQuickActionLimit(false, Number.NaN)).toBe(ANDROID_QUICK_ACTION_LIMIT);
  });
});

describe("syncAppQuickActions", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsSupported.mockResolvedValue(true);
    mockSetItems.mockResolvedValue(undefined);
    Platform.OS = "android";
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("sends Android items without undefined optional keys", async () => {
    await syncAppQuickActions(t);
    expect(mockSetItems).toHaveBeenCalledTimes(1);
    const items = mockSetItems.mock.calls[0]?.[0] as Record<string, unknown>[];
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(Object.hasOwn(item, "subtitle")).toBe(false);
      expect(typeof item.id).toBe("string");
      expect(typeof item.title).toBe("string");
      expect(typeof item.icon).toBe("string");
      expect(item.params).toEqual({ href: expect.any(String) });
    }
  });

  it("swallows native setItems rejections so they stay off the error boundary", async () => {
    mockSetItems.mockRejectedValue(
      new Error("Call to function 'ExpoQuickActions.setItems' has been rejected."),
    );
    await expect(syncAppQuickActions(t)).resolves.toBeUndefined();
    expect(captureAppException).toHaveBeenCalledTimes(1);
  });

  it("skips native work on web", async () => {
    Platform.OS = "web";
    await syncAppQuickActions(t);
    expect(mockIsSupported).not.toHaveBeenCalled();
    expect(mockSetItems).not.toHaveBeenCalled();
  });

  it("skips setItems when the device reports no shortcut support", async () => {
    mockIsSupported.mockResolvedValue(false);
    await syncAppQuickActions(t);
    expect(mockSetItems).not.toHaveBeenCalled();
  });

  it("does not report the legacy Android ActionObject cast NPE to Sentry", async () => {
    mockSetItems.mockRejectedValue(
      new Error(
        "Call to function 'ExpoQuickActions.setItems' has been rejected. → Caused by: Cannot cast 'class com.facebook.react.bridge.ReadableNativeMap' to 'class expo.modules.quickactions.ActionObject'",
      ),
    );
    await expect(syncAppQuickActions(t)).resolves.toBeUndefined();
    expect(captureAppException).not.toHaveBeenCalled();
  });
});

describe("isLegacyAndroidQuickActionCastError", () => {
  it("matches the production Sentry payload", () => {
    expect(
      isLegacyAndroidQuickActionCastError(
        new Error(
          "Call to function 'ExpoQuickActions.setItems' has been rejected. → Caused by: The 1st argument cannot be cast to type interface java.util.List<class expo.modules.quickactions.ActionObject>",
        ),
      ),
    ).toBe(true);
  });

  it("does not match unrelated setItems failures", () => {
    expect(
      isLegacyAndroidQuickActionCastError(
        new Error("Call to function 'ExpoQuickActions.setItems' has been rejected."),
      ),
    ).toBe(false);
  });
});
