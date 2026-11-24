import * as Haptics from "expo-haptics";

import { isHapticsEnabled, syncHapticsEnabled, triggerHaptic } from "./haptics";

describe("haptics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    syncHapticsEnabled(true);
  });

  it("fires native feedback when enabled", () => {
    triggerHaptic("light");
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);

    triggerHaptic("selection");
    expect(Haptics.selectionAsync).toHaveBeenCalled();

    triggerHaptic("success");
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
  });

  it("no-ops every haptic type when disabled in settings", () => {
    syncHapticsEnabled(false);
    expect(isHapticsEnabled()).toBe(false);

    triggerHaptic("light");
    triggerHaptic("medium");
    triggerHaptic("heavy");
    triggerHaptic("selection");
    triggerHaptic("success");
    triggerHaptic("warning");
    triggerHaptic("error");

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });
});

describe("haptic types", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    syncHapticsEnabled(true);
  });

  it.each([
    ["light", Haptics.ImpactFeedbackStyle.Light],
    ["medium", Haptics.ImpactFeedbackStyle.Medium],
    ["heavy", Haptics.ImpactFeedbackStyle.Heavy],
  ] as const)("%s → an impact of that style", (type, style) => {
    triggerHaptic(type);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(style);
  });

  it.each([
    ["warning", Haptics.NotificationFeedbackType.Warning],
    ["error", Haptics.NotificationFeedbackType.Error],
  ] as const)("%s → a notification of that type", (type, feedback) => {
    triggerHaptic(type);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(feedback);
  });

  it("tick falls back to a selection tick off Android", () => {
    triggerHaptic("tick");
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it("detent falls back to a medium impact off Android", () => {
    triggerHaptic("detent");
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it.each([
    ["tick", "segment-tick"],
    ["detent", "clock-tick"],
  ] as const)("%s uses the Android %s primitive when available", (type, primitive) => {
    const restore = require("@/test-support/platform").setPlatform({ OS: "android" });
    const perform = jest.fn().mockResolvedValue(undefined);
    Object.assign(Haptics, { performAndroidHapticsAsync: perform });
    try {
      triggerHaptic(type);
      expect(perform).toHaveBeenCalledWith(primitive);
      expect(Haptics.selectionAsync).not.toHaveBeenCalled();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    } finally {
      delete (Haptics as { performAndroidHapticsAsync?: unknown }).performAndroidHapticsAsync;
      restore();
    }
  });

  it("defaults to a light impact", () => {
    triggerHaptic();
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it("swallows a throwing haptics module", () => {
    jest.mocked(Haptics.selectionAsync).mockImplementationOnce(() => {
      throw new Error("no engine");
    });
    expect(() => triggerHaptic("selection")).not.toThrow();
  });
});

describe.each([
  ["web", { OS: "web" as const }],
  ["TV", { isTV: true }],
])("on %s", (_label, platform) => {
  /** `supported` is computed at import, so load a fresh copy for the platform. */
  function setup() {
    let subject!: typeof import("./haptics");
    let haptics!: typeof Haptics;
    jest.isolateModules(() => {
      require("@/test-support/platform").setPlatform(platform);
      haptics = require("expo-haptics");
      subject = require("./haptics");
    });
    return { ...subject, haptics };
  }

  it("never fires haptics", () => {
    const { isHapticsEnabled: enabled, triggerHaptic: trigger, haptics } = setup();
    trigger("heavy");
    expect(enabled()).toBe(false);
    expect(haptics.impactAsync).not.toHaveBeenCalled();
  });
});
