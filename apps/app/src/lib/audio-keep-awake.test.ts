import { act, renderHook, waitFor } from "@testing-library/react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Platform } from "react-native";

import { AUDIO_KEEP_AWAKE_TAG, setAudioKeepAwake, useAudioKeepAwake } from "@/lib/audio-keep-awake";
import { isTV } from "@/lib/platform/is-tv";

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn().mockResolvedValue(undefined),
  deactivateKeepAwake: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: jest.fn(() => false),
}));

const isTVMock = isTV as jest.MockedFunction<typeof isTV>;
const activateMock = activateKeepAwakeAsync as jest.MockedFunction<typeof activateKeepAwakeAsync>;
const deactivateMock = deactivateKeepAwake as jest.MockedFunction<typeof deactivateKeepAwake>;

describe("setAudioKeepAwake", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    isTVMock.mockReturnValue(false);
    activateMock.mockReset().mockResolvedValue(undefined);
    deactivateMock.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: originalOS });
  });

  it("activates keep-awake on iOS while playing", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    await setAudioKeepAwake(true);
    expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("deactivates keep-awake when playback stops", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "android" });
    await setAudioKeepAwake(false);
    expect(deactivateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    expect(activateMock).not.toHaveBeenCalled();
  });

  it("is a no-op on web", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
    await setAudioKeepAwake(true);
    expect(activateMock).not.toHaveBeenCalled();
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("is a no-op on TV even when the OS would otherwise support wake lock", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    isTVMock.mockReturnValue(true);
    await setAudioKeepAwake(true);
    expect(activateMock).not.toHaveBeenCalled();
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("swallows activate failures so playback is never blocked", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    activateMock.mockRejectedValueOnce(new Error("wake-lock unavailable"));
    await expect(setAudioKeepAwake(true)).resolves.toBeUndefined();
  });

  it("swallows deactivate failures so stop is never blocked", async () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "android" });
    deactivateMock.mockImplementationOnce(() => {
      throw new Error("wake-lock unavailable");
    });
    await expect(setAudioKeepAwake(false)).resolves.toBeUndefined();
  });
});

describe("useAudioKeepAwake", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
    isTVMock.mockReturnValue(false);
    activateMock.mockReset().mockResolvedValue(undefined);
    deactivateMock.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: originalOS });
  });

  it("does not activate while idle", async () => {
    renderHook(() => useAudioKeepAwake(false, false));
    await act(async () => {
      await Promise.resolve();
    });
    expect(activateMock).not.toHaveBeenCalled();
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("activates while playing and releases on unmount", async () => {
    const { unmount } = renderHook(() => useAudioKeepAwake(true));
    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });

    unmount();
    await waitFor(() => {
      expect(deactivateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });

  it("activates while translation TTS is speaking even if audio is paused", async () => {
    renderHook(() => useAudioKeepAwake(false, true));
    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });

  it("activates when recitation and translation TTS are both active", async () => {
    renderHook(() => useAudioKeepAwake(true, true));
    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });

  it("releases keep-awake when playback stops", async () => {
    const { rerender } = renderHook(
      ({ playing, speaking }: { playing: boolean; speaking: boolean }) =>
        useAudioKeepAwake(playing, speaking),
      { initialProps: { playing: true, speaking: false } },
    );

    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });

    rerender({ playing: false, speaking: false });
    await waitFor(() => {
      expect(deactivateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });
});
