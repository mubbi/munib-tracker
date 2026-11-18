import { act, renderHook, waitFor } from "@testing-library/react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import { AUDIO_KEEP_AWAKE_TAG, setAudioKeepAwake, useAudioKeepAwake } from "@/lib/audio-keep-awake";
import { usePlatform, usePlatformSwitch } from "@/test-support/platform";

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn().mockResolvedValue(undefined),
  deactivateKeepAwake: jest.fn().mockResolvedValue(undefined),
}));

const activateMock = activateKeepAwakeAsync as jest.MockedFunction<typeof activateKeepAwakeAsync>;
const deactivateMock = deactivateKeepAwake as jest.MockedFunction<typeof deactivateKeepAwake>;

describe("setAudioKeepAwake", () => {
  const onPlatform = usePlatformSwitch();

  beforeEach(() => {
    activateMock.mockReset().mockResolvedValue(undefined);
    deactivateMock.mockReset().mockResolvedValue(undefined);
  });

  it("activates keep-awake on iOS while playing", async () => {
    onPlatform({ OS: "ios" });
    await setAudioKeepAwake(true);
    expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("deactivates keep-awake when playback stops", async () => {
    onPlatform({ OS: "android" });
    await setAudioKeepAwake(false);
    expect(deactivateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    expect(activateMock).not.toHaveBeenCalled();
  });

  it("is a no-op on web", async () => {
    onPlatform({ OS: "web" });
    await setAudioKeepAwake(true);
    expect(activateMock).not.toHaveBeenCalled();
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("is a no-op on TV even when the OS would otherwise support wake lock", async () => {
    onPlatform({ OS: "ios", isTV: true });
    await setAudioKeepAwake(true);
    expect(activateMock).not.toHaveBeenCalled();
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("swallows activate failures so playback is never blocked", async () => {
    onPlatform({ OS: "ios" });
    activateMock.mockRejectedValueOnce(new Error("wake-lock unavailable"));
    await expect(setAudioKeepAwake(true)).resolves.toBeUndefined();
  });

  it("swallows deactivate failures so stop is never blocked", async () => {
    onPlatform({ OS: "android" });
    deactivateMock.mockImplementationOnce(() => {
      throw new Error("wake-lock unavailable");
    });
    await expect(setAudioKeepAwake(false)).resolves.toBeUndefined();
  });
});

describe("useAudioKeepAwake", () => {
  usePlatform({ OS: "ios" });

  beforeEach(() => {
    activateMock.mockReset().mockResolvedValue(undefined);
    deactivateMock.mockReset().mockResolvedValue(undefined);
  });

  it("does not activate while idle", async () => {
    await renderHook(() => useAudioKeepAwake(false, false));
    await act(async () => {
      await Promise.resolve();
    });
    expect(activateMock).not.toHaveBeenCalled();
    expect(deactivateMock).not.toHaveBeenCalled();
  });

  it("activates while playing and releases on unmount", async () => {
    const { unmount } = await renderHook(() => useAudioKeepAwake(true));
    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });

    await unmount();
    await waitFor(() => {
      expect(deactivateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });

  it("activates while translation TTS is speaking even if audio is paused", async () => {
    await renderHook(() => useAudioKeepAwake(false, true));
    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });

  it("activates when recitation and translation TTS are both active", async () => {
    await renderHook(() => useAudioKeepAwake(true, true));
    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });

  it("releases keep-awake when playback stops", async () => {
    const { rerender } = await renderHook(
      ({ playing, speaking }: { playing: boolean; speaking: boolean }) =>
        useAudioKeepAwake(playing, speaking),
      { initialProps: { playing: true, speaking: false } },
    );

    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });

    await rerender({ playing: false, speaking: false });
    await waitFor(() => {
      expect(deactivateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });
  });
});
