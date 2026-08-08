import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Pressable, Text } from "react-native";

import { AUDIO_KEEP_AWAKE_TAG } from "@/lib/audio-keep-awake";
import { AudioPlayerProvider, useAudioPlayerContext } from "@/providers/audio-player-provider";

jest.mock("expo-audio", () => {
  const createMockPlayer = () => ({
    play: jest.fn(),
    pause: jest.fn(),
    replace: jest.fn(),
    seekTo: jest.fn(async () => undefined),
    setPlaybackRate: jest.fn(),
    isLoaded: true,
    currentTime: 0,
    duration: 0,
    shouldCorrectPitch: true,
    volume: 1,
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  });
  return {
    useAudioPlayer: () => createMockPlayer(),
    useAudioPlayerStatus: () => ({
      playing: false,
      isLoaded: false,
      isBuffering: false,
      didJustFinish: false,
      currentTime: 0,
      duration: 0,
    }),
    setAudioModeAsync: jest.fn(async () => undefined),
    preload: jest.fn(),
    requestNotificationPermissionsAsync: jest.fn(async () => ({ granted: true })),
  };
});

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn().mockResolvedValue(undefined),
  deactivateKeepAwake: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/audio-lock-screen", () => ({
  activateLockScreenControls: jest.fn(),
  deactivateLockScreenControls: jest.fn(),
  ensureAndroidMediaNotificationPermission: jest.fn(async () => undefined),
}));

jest.mock("@/lib/audio-cache", () => ({
  invalidateCachedAudioUri: jest.fn(async () => undefined),
  isAudioLocalCacheEnabled: () => false,
  peekCachedAudioUri: jest.fn(() => null),
  peekNativeCachedAudioUri: jest.fn(async () => null),
  prefetchAudioUri: jest.fn(),
  resolveCachedAudioUri: jest.fn(async (uri: string) => uri),
}));

jest.mock("@/lib/tts", () => ({
  canPauseTts: () => true,
  pauseTts: jest.fn(async () => undefined),
  playerRateToSpeechRate: (rate: number) => rate,
  resumeTts: jest.fn(async () => undefined),
  speak: jest.fn(async () => undefined),
  stopTts: jest.fn(async () => undefined),
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => false,
}));

const activateMock = activateKeepAwakeAsync as jest.MockedFunction<typeof activateKeepAwakeAsync>;
const deactivateMock = deactivateKeepAwake as jest.MockedFunction<typeof deactivateKeepAwake>;

function Probe() {
  const audio = useAudioPlayerContext();
  return (
    <>
      <Text testID="playing">{String(audio.isPlaying)}</Text>
      <Pressable
        testID="play"
        onPress={() =>
          audio.play([
            {
              id: "tts-1",
              title: "Test",
              uri: "",
              ttsPlayback: { text: "Bismillah", lang: "en" },
            },
          ])
        }
      >
        <Text>Play</Text>
      </Pressable>
      <Pressable testID="stop" onPress={() => audio.stop()}>
        <Text>Stop</Text>
      </Pressable>
    </>
  );
}

describe("AudioPlayerProvider keep-awake", () => {
  beforeEach(() => {
    activateMock.mockReset().mockResolvedValue(undefined);
    deactivateMock.mockReset().mockResolvedValue(undefined);
  });

  it("holds the screen awake while TTS playback is active and releases on stop", async () => {
    render(
      <AudioPlayerProvider>
        <Probe />
      </AudioPlayerProvider>,
    );

    expect(screen.getByTestId("playing").props.children).toBe("false");
    expect(activateMock).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("play"));

    await waitFor(() => {
      expect(screen.getByTestId("playing").props.children).toBe("true");
    });
    await waitFor(() => {
      expect(activateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });

    fireEvent.press(screen.getByTestId("stop"));

    await waitFor(() => {
      expect(screen.getByTestId("playing").props.children).toBe("false");
    });
    await waitFor(() => {
      expect(deactivateMock).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
    });

    await act(async () => {
      await Promise.resolve();
    });
  });
});
