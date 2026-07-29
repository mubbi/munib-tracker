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
