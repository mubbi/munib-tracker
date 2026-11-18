import { setAudioModeAsync } from "expo-audio";

import { PLAYBACK_AUDIO_MODE, RECORDING_AUDIO_MODE } from "@/lib/audio-session-mode";
import { usePlatform } from "@/test-support/platform";

import { enterRecordMode, restorePlaybackMode } from "./audio-mode";

jest.mock("expo-audio", () => ({ setAudioModeAsync: jest.fn(async () => undefined) }));

const setMode = setAudioModeAsync as jest.Mock;

describe.each([
  ["enterRecordMode", enterRecordMode, RECORDING_AUDIO_MODE],
  ["restorePlaybackMode", restorePlaybackMode, PLAYBACK_AUDIO_MODE],
])("%s", (_name, run, mode) => {
  beforeEach(() => setMode.mockClear());

  it("applies the audio mode on native", async () => {
    await run();
    expect(setMode).toHaveBeenCalledWith(mode);
  });

  it("swallows audio session errors", async () => {
    setMode.mockRejectedValueOnce(new Error("busy"));
    await expect(run()).resolves.toBeUndefined();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("does nothing", async () => {
      await run();
      expect(setMode).not.toHaveBeenCalled();
    });
  });
});
