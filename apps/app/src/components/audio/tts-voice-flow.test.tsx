/**
 * End-to-end TTS voice flow through the REAL audio provider, mini-player,
 * voice control and voice sheet: Listen → pick a named voice → the queue plays
 * in the mini-player → re-pick a voice from the player. Regression for the
 * app-wide "Something went wrong" after choosing a specific voice.
 */
import { act, fireEvent, screen } from "@testing-library/react-native";
import { Component, type ReactNode } from "react";
import { Text } from "react-native";

import { MiniPlayer } from "@/components/audio/mini-player";
import { ReadingTtsButton } from "@/components/content/reading-tts-button";
import { resetTtsVoicesCache } from "@/lib/tts";
import { AudioPlayerProvider, useAudioPlayerContext } from "@/providers/audio-player-provider";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { usePlatform } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";

const SAMANTHA = {
  identifier: "com.apple.voice.compact.en-US.Samantha",
  name: "Samantha",
  language: "en-US",
  quality: "Default",
};

jest.mock("expo-speech", () => ({
  getAvailableVoicesAsync: jest.fn(async () => [
    {
      identifier: "com.apple.voice.compact.en-US.Samantha",
      name: "Samantha",
      language: "en-US",
      quality: "Default",
    },
    {
      identifier: "com.apple.voice.compact.en-GB.Daniel",
      name: "Daniel",
      language: "en-GB",
      quality: "Default",
    },
  ]),
  speak: jest.fn(),
  stop: jest.fn(async () => undefined),
  pause: jest.fn(async () => undefined),
  resume: jest.fn(async () => undefined),
  isSpeakingAsync: jest.fn(async () => false),
}));

jest.mock("expo-audio", () => {
  const React = require("react");
  const makePlayer = () => ({
    play: jest.fn(),
    pause: jest.fn(),
    replace: jest.fn(),
    seekTo: jest.fn(async () => undefined),
    setPlaybackRate: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    remove: jest.fn(),
    setActiveForLockScreen: jest.fn(),
    updateLockScreenMetadata: jest.fn(),
    clearLockScreenControls: jest.fn(),
    isLoaded: true,
    playing: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    shouldCorrectPitch: false,
  });
  const status = {
    playing: false,
    isLoaded: false,
    isBuffering: false,
    didJustFinish: false,
    currentTime: 0,
    duration: 0,
  };
  return {
    useAudioPlayer: () => React.useState(makePlayer)[0],
    useAudioPlayerStatus: () => status,
    setAudioModeAsync: jest.fn(async () => undefined),
    preload: jest.fn(),
  };
});

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn(async () => undefined),
  deactivateKeepAwake: jest.fn(async () => undefined),
}));

jest.mock("@/lib/audio-lock-screen", () => ({
  activateLockScreenControls: jest.fn(),
  deactivateLockScreenControls: jest.fn(),
  ensureAndroidMediaNotificationPermission: jest.fn(async () => undefined),
}));

jest.mock("@/hooks/use-content-bottom-inset", () => ({
  ...jest.requireActual("@/hooks/use-content-bottom-inset"),
  useSetMiniPlayerInset: () => () => {},
  useTabBarOffset: () => 64,
}));

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "expo-glass-effect",
  () => require("@/test-support/mocks/expo-glass-effect").expoGlassEffectMock,
);
jest.mock("@/components/ui/glass-surface", () =>
  require("@/test-support/mocks/glass-surface").glassSurfaceWithComponentMock(),
);

const caught: unknown[] = [];
const probe: { current?: unknown; queue?: unknown } = {};
function Probe() {
  const ctx = useAudioPlayerContext();
  probe.current = ctx.current?.id ?? null;
  probe.queue = ctx.queue.length;
  return null;
}

class Boundary extends Component<{ children: ReactNode }, { error: unknown }> {
  state = { error: null as unknown };
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  componentDidCatch(error: unknown) {
    caught.push(error);
  }
  render() {
    return this.state.error ? <Text>ROOT FALLBACK</Text> : this.props.children;
  }
}

const unhandled: unknown[] = [];
const onUnhandled = (reason: unknown) => unhandled.push(reason);

async function settle() {
  await act(async () => {
    for (let i = 0; i < 30; i += 1) await Promise.resolve();
  });
}

async function renderFlow() {
  await renderWithProviders(
    <Boundary>
      <AudioPlayerProvider>
        <ReadingTtsButton
          id="custom-1"
          title="My adhkar"
          arabic=""
          transliteration="Subhan Allah"
          translation="Glory be to Allah. Praise be to Allah."
        />
        <MiniPlayer />
        <Probe />
      </AudioPlayerProvider>
    </Boundary>,
  );
  await settle();
}

async function pickVoiceFromListen(name: string) {
  await fireEvent.press(screen.getByLabelText("Listen to article"));
  await settle();
  await fireEvent.press(await screen.findByText(name));
  await settle();
}

beforeEach(() => {
  // The mini-player's progress loop runs on requestAnimationFrame (real timers
  // under the RN preset): hold the frames so it never ticks outside act().
  captureAnimationFrames();
  caught.length = 0;
  unhandled.length = 0;
  resetTtsVoicesCache();
  devicePreferencesStore.setState({ prefs: {}, isReady: true });
  process.on("unhandledRejection", onUnhandled);
});

afterEach(() => {
  process.off("unhandledRejection", onUnhandled);
  jest.restoreAllMocks();
});

function expectNoCrash() {
  expect(caught).toEqual([]);
  expect(unhandled).toEqual([]);
  expect(screen.queryByText("ROOT FALLBACK")).toBeNull();
}

async function repickFromPlayer(name: string) {
  const controls = screen.getAllByLabelText("Voice");
  const control = controls.at(-1);
  if (!control) throw new Error("no voice control");
  await fireEvent.press(control);
  await settle();
  const rows = await screen.findAllByText(name);
  const row = rows.at(-1);
  if (!row) throw new Error(`no ${name} row`);
  await fireEvent.press(row);
  await settle();
}

describe.each([
  { label: "iOS, no Liquid Glass", os: "ios" as const, glass: false },
  { label: "iOS 26 Liquid Glass", os: "ios" as const, glass: true },
  { label: "Android", os: "android" as const, glass: false },
])("TTS voice flow — real provider + mini-player ($label)", ({ os, glass }) => {
  usePlatform({ OS: os });
  beforeEach(() => setMockLiquidGlass(glass));
  afterEach(() => setMockLiquidGlass(false));

  it("plays with a named voice without tripping the root boundary", async () => {
    await renderFlow();
    await pickVoiceFromListen(SAMANTHA.name);

    expectNoCrash();
    expect(probe.current).toBe("custom-1:tts:0");
    expect(devicePreferencesStore.getState().prefs.ttsVoiceByLang).toMatchObject({
      "en-US": SAMANTHA.identifier,
    });
    expect(screen.getAllByLabelText("Voice").length).toBeGreaterThan(0);
  });

  it("re-picks a voice from the compact and the expanded player", async () => {
    await renderFlow();
    await pickVoiceFromListen(SAMANTHA.name);
    await repickFromPlayer("Daniel");
    expectNoCrash();

    await fireEvent.press(screen.getByLabelText("My adhkar"));
    await settle();
    await repickFromPlayer(SAMANTHA.name);
    expectNoCrash();
    expect(probe.current).toBe("custom-1:tts:0");
  });

  it("System default also plays cleanly", async () => {
    await renderFlow();
    await pickVoiceFromListen("System default");
    expectNoCrash();
  });
});

describe("TTS start never escapes as an unhandled rejection", () => {
  it("reports and toasts when starting playback throws", async () => {
    const speech = jest.requireMock("expo-speech") as { getAvailableVoicesAsync: jest.Mock };
    await renderFlow();
    await fireEvent.press(screen.getByLabelText("Listen to article"));
    await settle();
    // The voice list is cached; break the next lookup (resolveTtsVoice → play).
    resetTtsVoicesCache();
    const original = speech.getAvailableVoicesAsync.getMockImplementation();
    speech.getAvailableVoicesAsync.mockImplementation(async () => {
      throw new Error("voices gone");
    });
    await fireEvent.press(await screen.findByText(SAMANTHA.name));
    await settle();
    if (original) speech.getAvailableVoicesAsync.mockImplementation(original);

    expectNoCrash();
  });
});
