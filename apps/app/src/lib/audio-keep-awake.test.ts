import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Platform } from "react-native";

import { setAudioKeepAwake } from "@/lib/audio-keep-awake";

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn().mockResolvedValue(undefined),
  deactivateKeepAwake: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => false,
}));

describe("setAudioKeepAwake", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: originalOS });
    jest.clearAllMocks();
  });

  it("activates keep-awake on iOS while playing", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    await setAudioKeepAwake(true);
    expect(activateKeepAwakeAsync).toHaveBeenCalledWith("munib-audio-playback");
    expect(deactivateKeepAwake).not.toHaveBeenCalled();
  });

  it("deactivates keep-awake when playback stops", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "android" });
    await setAudioKeepAwake(false);
    expect(deactivateKeepAwake).toHaveBeenCalledWith("munib-audio-playback");
    expect(activateKeepAwakeAsync).not.toHaveBeenCalled();
  });

  it("is a no-op on web", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    await setAudioKeepAwake(true);
    expect(activateKeepAwakeAsync).not.toHaveBeenCalled();
    expect(deactivateKeepAwake).not.toHaveBeenCalled();
  });
});
