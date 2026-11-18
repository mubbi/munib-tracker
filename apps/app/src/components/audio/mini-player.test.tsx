import { act, fireEvent, screen } from "@testing-library/react-native";
import { BackHandler, FlatList } from "react-native";

import { MiniPlayer } from "@/components/audio/mini-player";
import { supportsProgrammaticVolume } from "@/lib/audio-volume";
import type { AudioContextValue, AudioProgressValue } from "@/providers/audio-player-context";
import type { AudioTrack } from "@/providers/audio-player-types";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { buildAudioTrack } from "@/test-support/fixtures/audio";
import { mockRouter, resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import {
  pressWebKey,
  resetWebKeyHandlerMock,
  webKeyHandlerState,
} from "@/test-support/mocks/web-key-handler";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// ── Module mocks ─────────────────────────────────────────────────────────────

const mockAudio = {} as AudioContextValue;
const mockProgress: AudioProgressValue = { position: 0, queuePosition: 0, queueProgress: 0 };
const mockPrefs: { cacheAudioLocally?: boolean } = {};
const mockSetInset = jest.fn();
const mockTheme = { dark: false };

jest.mock("@/providers/audio-player-provider", () => ({
  AUDIO_SPEEDS: [0.5, 1, 1.5, 2],
  useAudioPlayerContext: () => mockAudio,
  useAudioProgressContext: () => mockProgress,
}));

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

// Shared key-handler capture, also wired to the lower-level `useWebKeyHandler`.
jest.mock("@/hooks/use-web-key-handler", () => {
  const { webKeyHandlerMock } = require("@/test-support/mocks/web-key-handler");
  return { ...webKeyHandlerMock, useWebKeyHandler: webKeyHandlerMock.useWebScreenKeyHandler };
});

// Shared Liquid Glass flag plus passthrough chrome components.
jest.mock("@/components/ui/glass-surface", () => {
  const { createElement } = require("react");
  const { View } = require("react-native");
  const { glassSurfaceMock } = require("@/test-support/mocks/glass-surface");
  return Object.defineProperties(
    {
      GlassSurface: ({ children, style }: { children?: unknown; style?: unknown }) =>
        createElement(View, { style }, children),
      GlassControl: ({ children }: { children?: unknown }) => children,
    },
    Object.getOwnPropertyDescriptors(glassSurfaceMock),
  );
});

jest.mock("@/stores/preferences-store", () => ({
  ...jest.requireActual("@/stores/preferences-store"),
  usePreferences: () => mockPrefs,
}));

jest.mock("@/hooks/use-content-bottom-inset", () => ({
  useSetMiniPlayerInset: () => mockSetInset,
  useTabBarOffset: () => 64,
}));

jest.mock("@/hooks/use-theme-tokens", () => {
  const actual = jest.requireActual("@/hooks/use-theme-tokens");
  return {
    ...actual,
    useThemeTokens: () => {
      const result = actual.useThemeTokens();
      return mockTheme.dark ? { ...result, tokens: { ...result.tokens, isDark: true } } : result;
    },
  };
});

jest.mock("@/lib/audio-volume", () => ({
  supportsProgrammaticVolume: jest.fn(() => true),
}));

// Sibling controls have their own suites.
jest.mock("@/components/quran/quran-playback-settings-control", () => ({
  QuranPlaybackSettingsControl: () => null,
}));
jest.mock("@/components/audio/tts-voice-control", () => ({
  TtsVoiceControl: () => null,
}));

// Hover is gated on a real pointer having been seen; treat it as available.
jest.mock("react-native/Libraries/Pressability/HoverState", () => ({
  isHoverEnabled: () => true,
}));

// Run animated-style worklets inline with render-stable shared values so the
// buffering shimmer's geometry is observable.
jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View } = require("react-native");
  const AnimatedView = React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
    React.createElement(View, { ...props, ref }),
  );
  const passthrough = (value: unknown) => value;
  return {
    __esModule: true,
    default: { View: AnimatedView, createAnimatedComponent: passthrough },
    useSharedValue: (initial: unknown) => React.useRef({ value: initial }).current,
    useAnimatedStyle: (worklet: () => unknown) => worklet(),
    useReducedMotion: () => false,
    withSpring: passthrough,
    withTiming: passthrough,
    withRepeat: passthrough,
    withDelay: (_delay: unknown, animation: unknown) => animation,
    withSequence: (...animations: unknown[]) => animations.at(-1),
    cancelAnimation: () => {},
    interpolate: () => 0,
    interpolateColor: () => "#000000",
    Easing: new Proxy({}, { get: () => () => 0 }),
  };
});

const volumeSupported = supportsProgrammaticVolume as jest.MockedFunction<
  typeof supportsProgrammaticVolume
>;

// ── Arrange helpers ──────────────────────────────────────────────────────────

const SURAH = "Al-Fatiha";

function defaultAudio(): AudioContextValue {
  const current = buildAudioTrack({ id: "a", subtitle: SURAH });
  return {
    current,
    queue: [current],
    index: 0,
    trackDurations: {},
    isPlaying: false,
    isBuffering: false,
    isTransitioning: false,
    isLoaded: true,
    duration: 120,
    queueDuration: 0,
    isQueueFinished: false,
    rate: 1,
    volume: 0.5,
    loopMode: "off",
    repeatPlan: { mode: "off" },
    translationAudio: "off",
    isSpeakingTranslation: false,
    sourceHref: null,
    play: jest.fn(),
    toggle: jest.fn(),
    seekTo: jest.fn(),
    seekToQueuePosition: jest.fn(),
    next: jest.fn(),
    previous: jest.fn(),
    jumpTo: jest.fn(),
    replay: jest.fn(),
    setRate: jest.fn(),
    setVolume: jest.fn(),
    setTtsVoice: jest.fn(),
    cycleLoopMode: jest.fn(),
    setRepeatPlan: jest.fn(),
    setTranslationAudio: jest.fn(),
    stop: jest.fn(),
    readPlaybackSeconds: jest.fn(() => 0),
  };
}

/** A three-track queue playing its middle track. */
function queueAudio(overrides: Partial<AudioContextValue> = {}): Partial<AudioContextValue> {
  const queue = ["a", "b", "c"].map((id) => buildAudioTrack({ id, subtitle: SURAH }));
  return { current: queue[1], queue, index: 1, ...overrides };
}

type Setup = { audio?: Partial<AudioContextValue>; progress?: Partial<AudioProgressValue> };

async function renderMiniPlayer({ audio = {}, progress = {} }: Setup = {}) {
  Object.assign(mockAudio, defaultAudio(), audio);
  Object.assign(mockProgress, { position: 0, queuePosition: 0, queueProgress: 0 }, progress);
  return await renderWithTheme(<MiniPlayer />);
}

async function renderExpanded(setup: Setup = {}) {
  const view = await renderMiniPlayer(setup);
  await fireEvent.press(screen.getByLabelText((mockAudio.current as AudioTrack).title));
  return view;
}

const audioFn = (name: keyof AudioContextValue) => mockAudio[name] as jest.Mock;

type HostNode = ReturnType<typeof screen.getByText>;

function closestWithProp(node: HostNode | null, prop: string): HostNode {
  let current = node;
  while (current && current.props[prop] == null) current = current.parent as HostNode | null;
  if (!current) throw new Error(`no ancestor with ${prop}`);
  return current;
}

/** Synthetic touch carrying the `touchHistory` PanResponder reads. */
function touch(x: number, y: number, timestamp: number) {
  return {
    nativeEvent: { locationX: x, locationY: y, pageX: x, pageY: y, timestamp, touches: [] },
    touchHistory: {
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: timestamp,
      touchBank: [
        {
          touchActive: true,
          startPageX: 0,
          startPageY: 0,
          startTimeStamp: 0,
          currentPageX: x,
          currentPageY: y,
          currentTimeStamp: timestamp,
          previousPageX: 0,
          previousPageY: 0,
          previousTimeStamp: 0,
        },
      ],
    },
  };
}

const layoutEvent = (width: number, height: number) => ({
  nativeEvent: { layout: { width, height, x: 0, y: 0 } },
});

const a11yAction = (actionName: string) => ({ nativeEvent: { actionName } });

function queryVolumeSlider() {
  return (
    screen.queryAllByLabelText("Volume").find((n) => n.props.accessibilityRole === "adjustable") ??
    null
  );
}

function volumeSlider() {
  const slider = queryVolumeSlider();
  if (!slider) throw new Error("volume slider is closed");
  return slider;
}

function volumeButton() {
  return screen.getAllByLabelText("Volume").find((n) => n.props.accessibilityRole === "button");
}

const seekBar = () => screen.getByLabelText("Playback position");
const seekValue = () => seekBar().props.accessibilityValue;

let frames: ReturnType<typeof captureAnimationFrames>;

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  resetWebKeyHandlerMock();
  resetMockWindowSize();
  setMockLiquidGlass(false);
  mockTheme.dark = false;
  delete mockPrefs.cacheAudioLocally;
  volumeSupported.mockReturnValue(true);
  frames = captureAnimationFrames();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

// ── Compact bar ──────────────────────────────────────────────────────────────

describe("MiniPlayer — compact bar", () => {
  it("renders nothing and clears the inset without a current track", async () => {
    await renderMiniPlayer({ audio: { current: null } });
    expect(screen.queryByLabelText("Close player")).toBeNull();
    expect(mockSetInset).toHaveBeenCalledWith(0);
  });

  it("reports its measured height as the content inset", async () => {
    await renderMiniPlayer();
    const bar = closestWithProp(screen.getByText("Track a"), "onLayout");
    await fireEvent(bar, "layout", layoutEvent(400, 96));
    expect(mockSetInset).toHaveBeenCalledWith(96);
  });

  it.each<[string, Setup, string]>([
    ["a single track", { progress: { position: 65 } }, `${SURAH} · 1:05 / 2:00`],
    [
      "an hour-long queue",
      { audio: queueAudio({ queueDuration: 3700 }), progress: { queuePosition: 3661 } },
      `${SURAH} · 1:01:01 / 1:01:40`,
    ],
    [
      "a queue of unknown length (falls back to the track)",
      { audio: queueAudio({ duration: 90 }), progress: { queuePosition: 30 } },
      `${SURAH} · 0:30 / 1:30`,
    ],
    [
      "an unknown duration without subtitle",
      { audio: { current: buildAudioTrack({ id: "z" }), duration: Number.NaN } },
      "0:00 / 0:00",
    ],
  ])("shows elapsed / total time for %s", async (_case, setup, text) => {
    await renderMiniPlayer(setup);
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("shows a buffering label while loading", async () => {
    await renderMiniPlayer({ audio: { isBuffering: true } });
    expect(screen.getByText(`${SURAH} · Buffering…`)).toBeTruthy();
  });

  it("notes when audio is streamed without caching", async () => {
    mockPrefs.cacheAudioLocally = false;
    await renderMiniPlayer();
    expect(screen.getByText("Streaming only — audio is not saved on this device")).toBeTruthy();
  });

  it("hides the skip buttons without a queue", async () => {
    await renderMiniPlayer();
    expect(screen.queryByLabelText("Next track")).toBeNull();
    expect(screen.queryByLabelText("Previous track")).toBeNull();
  });

  it.each<[string, keyof AudioContextValue]>([
    ["Next track", "next"],
    ["Previous track", "previous"],
  ])("skips with %s in a queue", async (label, action) => {
    await renderMiniPlayer({ audio: queueAudio() });
    await fireEvent.press(screen.getByLabelText(label));
    expect(audioFn(action)).toHaveBeenCalled();
  });

  it("hides the volume control where the platform cannot set volume", async () => {
    volumeSupported.mockReturnValue(false);
    await renderMiniPlayer();
    expect(screen.queryByLabelText("Volume")).toBeNull();
  });

  it.each([
    ["phone", 400, true],
    ["desktop", 1400, false],
  ])("places the close button %s-style", async (_case, width, closeFirst) => {
    setMockWindowSize(width);
    await renderMiniPlayer();
    const labels = queryHostsByRole("button").map((n) => n.props.accessibilityLabel);
    expect(labels.indexOf("Close player") < labels.indexOf("Speed 1×")).toBe(closeFirst);
  });

  it.each([
    ["above the tab bar on tab screens", "/", 64],
    ["flush to the bottom on stack screens", "/quran/1", 0],
  ])("docks %s", async (_case, pathname, bottom) => {
    setMockPathname(pathname);
    await renderMiniPlayer();
    const bar = closestWithProp(screen.getByText("Track a"), "onLayout");
    expect(flattenStyle(bar.props.style).bottom).toBe(bottom);
  });

  it("advances the time from the engine clock while playing", async () => {
    await renderMiniPlayer({
      audio: { isPlaying: true, readPlaybackSeconds: jest.fn(() => 75) },
    });
    await frames.flush(16);
    expect(screen.getByText(`${SURAH} · 1:15 / 2:00`)).toBeTruthy();
  });

  it("advances the queue-wide time from the engine clock while playing", async () => {
    await renderMiniPlayer({
      audio: queueAudio({
        isPlaying: true,
        queueDuration: 300,
        trackDurations: { a: 100, b: 100, c: 100 },
        readPlaybackSeconds: jest.fn(() => 20),
      }),
    });
    await frames.flush(16);
    expect(screen.getByText(`${SURAH} · 2:00 / 5:00`)).toBeTruthy();
  });

  it("clamps a negative engine time on a track of unknown length", async () => {
    await renderMiniPlayer({
      audio: { isPlaying: true, duration: 0, readPlaybackSeconds: jest.fn(() => -3) },
    });
    await frames.flush(16);
    expect(screen.getByText(`${SURAH} · 0:00 / 0:00`)).toBeTruthy();
  });

  it("stops the progress clock on unmount", async () => {
    const view = await renderMiniPlayer({ audio: { isPlaying: true } });
    await view.unmount();
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("sizes the buffering shimmer bands to the measured track", async () => {
    const view = await renderMiniPlayer({ audio: { isBuffering: true, isTransitioning: true } });
    const [band] = screen.container.queryAll(
      (node) =>
        typeof node.props.onLayout === "function" &&
        node.children.length === 2 &&
        node.children.every(
          (child) => typeof child !== "string" && flattenStyle(child.props.style).opacity === 0,
        ),
    );
    await fireEvent(band, "layout", layoutEvent(300, 3));
    await view.rerender(<MiniPlayer />);

    const [first, second] = band.children as HostNode[];
    expect(flattenStyle(first.props.style).width).toBeCloseTo(84);
    expect(flattenStyle(first.props.style).opacity).toBeCloseTo(0.5);
    expect(flattenStyle(second.props.style).opacity).toBeCloseTo(0.35);
  });
});

// ── Transport controls (shared by both layouts) ──────────────────────────────

describe.each([
  ["compact", renderMiniPlayer],
  ["expanded", renderExpanded],
])("MiniPlayer — %s transport", (_layout, renderLayout) => {
  it.each<[string, Partial<AudioContextValue>, keyof AudioContextValue]>([
    ["Play", {}, "toggle"],
    ["Pause", { isPlaying: true }, "toggle"],
    ["Replay", { isQueueFinished: true }, "replay"],
  ])("%s button calls %p", async (label, audio, action) => {
    await renderLayout({ audio });
    await fireEvent.press(screen.getByLabelText(label));
    expect(audioFn(action)).toHaveBeenCalledTimes(1);
  });

  it("marks the play button busy while buffering", async () => {
    mockTheme.dark = true;
    setMockLiquidGlass(true);
    await renderLayout({ audio: { isBuffering: true } });
    expect(screen.getByLabelText("Play").props.accessibilityState).toEqual(
      expect.objectContaining({ busy: true }),
    );
  });

  it.each([
    ["off", "Repeat off", false],
    ["all", "Repeat all", true],
    ["one", "Repeat once", true],
  ] as const)("labels loop mode %s", async (loopMode, label, selected) => {
    await renderLayout({ audio: { loopMode } });
    expect(screen.getByLabelText(label).props.accessibilityState).toEqual(
      expect.objectContaining({ selected }),
    );
  });

  it("cycles the loop mode", async () => {
    await renderLayout();
    await fireEvent.press(screen.getByLabelText("Repeat off"));
    expect(audioFn("cycleLoopMode")).toHaveBeenCalledTimes(1);
  });

  it.each([
    [1, 1.5],
    [2, 0.5],
    [1.25, 0.5],
  ])("steps speed %p× to %p×", async (rate, next) => {
    await renderLayout({ audio: { rate } });
    await fireEvent.press(screen.getByLabelText(`Speed ${rate}×`));
    expect(audioFn("setRate")).toHaveBeenCalledWith(next);
  });

  it("stops playback once closing is confirmed", async () => {
    await renderLayout();
    await fireEvent.press(screen.getByLabelText("Close player"));
    await fireEvent.press(screen.getByText("Stop"));
    expect(audioFn("stop")).toHaveBeenCalledTimes(1);
  });

  it("keeps playing when closing is cancelled", async () => {
    await renderLayout();
    await fireEvent.press(screen.getByLabelText("Close player"));
    await fireEvent.press(screen.getByText("Cancel"));
    expect(audioFn("stop")).not.toHaveBeenCalled();
  });
});

// ── Volume popover ───────────────────────────────────────────────────────────

describe("MiniPlayer — volume popover", () => {
  it("opens and closes from the volume button", async () => {
    await renderMiniPlayer();
    await fireEvent.press(volumeButton() as HostNode);
    expect(volumeSlider()).toBeTruthy();
    await fireEvent.press(volumeButton() as HostNode);
    expect(queryVolumeSlider()).toBeNull();
  });

  it.each([
    [0, "Volume 0%"],
    [0.3, "Volume 30%"],
    [0.8, "Volume 80%"],
  ])("announces volume %p as %p", async (volume, text) => {
    await renderMiniPlayer({ audio: { volume } });
    await fireEvent.press(volumeButton() as HostNode);
    expect(volumeSlider().props.accessibilityValue).toEqual(expect.objectContaining({ text }));
  });

  it("renders the popover on Liquid Glass", async () => {
    setMockLiquidGlass(true);
    await renderMiniPlayer();
    await fireEvent.press(volumeButton() as HostNode);
    expect(volumeSlider()).toBeTruthy();
  });

  it.each([
    ["increment", 0.6],
    ["decrement", 0.4],
  ])("steps the volume on %s", async (action, expected) => {
    await renderMiniPlayer();
    await fireEvent.press(volumeButton() as HostNode);
    await fireEvent(volumeSlider(), "accessibilityAction", a11yAction(action));
    expect(audioFn("setVolume").mock.calls[0][0]).toBeCloseTo(expected);
  });

  it("ignores unrelated accessibility actions", async () => {
    await renderMiniPlayer();
    await fireEvent.press(volumeButton() as HostNode);
    await fireEvent(volumeSlider(), "accessibilityAction", a11yAction("activate"));
    expect(audioFn("setVolume")).not.toHaveBeenCalled();
  });

  it.each([
    ["startShouldSetResponderCapture", true],
    ["moveShouldSetResponderCapture", true],
    ["startShouldSetResponder", true],
    ["moveShouldSetResponder", true],
    ["responderTerminationRequest", false],
  ])("answers %s with %p so drags stay on the slider", async (event, expected) => {
    await renderMiniPlayer();
    await fireEvent.press(volumeButton() as HostNode);
    expect(await fireEvent(volumeSlider(), event, touch(0, 5, 10))).toBe(expected);
  });

  it("sets the volume from the drag position along the track", async () => {
    await renderMiniPlayer();
    await fireEvent.press(volumeButton() as HostNode);
    await fireEvent(volumeSlider(), "layout", layoutEvent(52, 104));
    // Default track window: y = 0, height = 88 → pageY 22 is 75%.
    await fireEvent(volumeSlider(), "responderGrant", touch(0, 22, 1));
    expect(audioFn("setVolume")).toHaveBeenLastCalledWith(0.75);
  });

  it("clamps dragging below and above the track", async () => {
    await renderMiniPlayer();
    await fireEvent.press(volumeButton() as HostNode);
    await fireEvent(volumeSlider(), "responderGrant", touch(0, 22, 1));
    await fireEvent(volumeSlider(), "responderMove", touch(0, 200, 2));
    expect(audioFn("setVolume")).toHaveBeenLastCalledWith(0);
    await fireEvent(volumeSlider(), "responderRelease", touch(0, 200, 3));
    await fireEvent(volumeSlider(), "responderGrant", touch(0, -50, 4));
    expect(audioFn("setVolume")).toHaveBeenLastCalledWith(1);
  });

  it("previews the dragged level until the gesture is cancelled", async () => {
    await renderMiniPlayer({ audio: { volume: 0.2 } });
    await fireEvent.press(volumeButton() as HostNode);
    await fireEvent(volumeSlider(), "responderGrant", touch(0, 22, 1));
    expect(volumeSlider().props.accessibilityValue.now).toBe(75);
    await fireEvent(volumeSlider(), "responderTerminate", touch(0, 22, 2));
    expect(volumeSlider().props.accessibilityValue.now).toBe(20);
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    const anchor = () => closestWithProp(volumeButton()?.parent as HostNode, "onMouseEnter");
    const hover = (event: "mouseEnter" | "mouseLeave") => fireEvent(anchor(), event, {});
    const waitPastCloseDelay = () =>
      act(async () => {
        jest.advanceTimersByTime(200);
      });

    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("opens on hover", async () => {
      await renderMiniPlayer();
      await hover("mouseEnter");
      expect(volumeSlider()).toBeTruthy();
    });

    it("closes shortly after the pointer leaves", async () => {
      mockTheme.dark = true;
      await renderMiniPlayer();
      await hover("mouseEnter");
      await hover("mouseLeave");
      await waitPastCloseDelay();
      expect(queryVolumeSlider()).toBeNull();
    });

    it("stays open when the pointer returns before the close delay", async () => {
      await renderMiniPlayer();
      await hover("mouseEnter");
      await hover("mouseLeave");
      await hover("mouseEnter");
      await waitPastCloseDelay();
      expect(volumeSlider()).toBeTruthy();
    });

    it("drops a pending close on unmount", async () => {
      const view = await renderMiniPlayer();
      await hover("mouseEnter");
      await hover("mouseLeave");
      const clearSpy = jest.spyOn(globalThis, "clearTimeout");
      await view.unmount();
      expect(clearSpy).toHaveBeenCalled();
    });
  });
});

// ── Expanded player ──────────────────────────────────────────────────────────

describe("MiniPlayer — expanded", () => {
  it("opens from the compact bar and releases the inset", async () => {
    await renderExpanded();
    expect(screen.getByText("Now Playing")).toBeTruthy();
    expect(mockSetInset).toHaveBeenLastCalledWith(0);
  });

  it("minimizes back to the compact bar", async () => {
    await renderExpanded();
    await fireEvent.press(screen.getByLabelText("Minimize"));
    expect(screen.queryByText("Now Playing")).toBeNull();
  });

  it("minimizes on Escape", async () => {
    await renderExpanded();
    expect(await pressWebKey("Escape")).toBe(true);
    expect(screen.queryByText("Now Playing")).toBeNull();
  });

  it("ignores other keys", async () => {
    await renderExpanded();
    expect(await pressWebKey("a")).toBeUndefined();
    expect(screen.getByText("Now Playing")).toBeTruthy();
  });

  it("notes when audio is streamed without caching", async () => {
    mockPrefs.cacheAudioLocally = false;
    await renderExpanded();
    expect(screen.getByText("Streaming only — audio is not saved on this device")).toBeTruthy();
  });

  it("shows the queue position", async () => {
    await renderExpanded({ audio: queueAudio() });
    expect(screen.getByText("2 of 3 · 1 remaining")).toBeTruthy();
  });

  it("hides the source link without a source screen", async () => {
    await renderExpanded();
    expect(screen.queryByLabelText("Go to reading view")).toBeNull();
  });

  it("opens the source screen and minimizes", async () => {
    await renderExpanded({ audio: { sourceHref: "/quran/1" } });
    await fireEvent.press(screen.getByLabelText("Go to reading view"));
    expect(mockRouter.push).toHaveBeenCalledWith("/quran/1");
    expect(screen.queryByText("Now Playing")).toBeNull();
  });

  it("centres the content column on desktop", async () => {
    setMockWindowSize(1400);
    await renderExpanded();
    const [sheet] = screen.container.queryAll((n) => flattenStyle(n.props.style).zIndex === 50);
    // (window 1400 − column 760) / 2
    expect(flattenStyle(sheet.props.style).paddingHorizontal).toBe(320);
  });
});

describe("MiniPlayer — expanded seek bar", () => {
  const measureSeekBar = () =>
    fireEvent(seekBar().children[0] as HostNode, "layout", layoutEvent(200, 6));

  it("shows elapsed and remaining time", async () => {
    await renderExpanded({ progress: { position: 30 } });
    expect(screen.getByText("0:30")).toBeTruthy();
    expect(screen.getByText("-1:30")).toBeTruthy();
  });

  it.each(["startShouldSetResponder", "moveShouldSetResponder"])(
    "claims the %s gesture",
    async (event) => {
      await renderExpanded();
      expect(await fireEvent(seekBar(), event, touch(5, 0, 10))).toBe(true);
    },
  );

  it("previews the scrubbed position while dragging", async () => {
    await renderExpanded({ progress: { position: 30 } });
    await measureSeekBar();
    await fireEvent(seekBar(), "responderGrant", touch(100, 0, 1));
    expect(seekValue()).toEqual(expect.objectContaining({ now: 60, max: 120 }));
    await fireEvent(seekBar(), "responderMove", touch(400, 0, 2));
    expect(seekValue()).toEqual(expect.objectContaining({ now: 120 }));
  });

  it("seeks to the release position", async () => {
    await renderExpanded();
    await measureSeekBar();
    await fireEvent(seekBar(), "responderGrant", touch(100, 0, 1));
    await fireEvent(seekBar(), "responderRelease", touch(50, 0, 2));
    expect(audioFn("seekTo")).toHaveBeenCalledWith(30);
  });

  it("snaps back to playback when the drag is cancelled", async () => {
    await renderExpanded({ progress: { position: 30 } });
    await measureSeekBar();
    await fireEvent(seekBar(), "responderGrant", touch(10, 0, 1));
    await fireEvent(seekBar(), "responderTerminate", touch(10, 0, 2));
    expect(seekValue()).toEqual(expect.objectContaining({ now: 30 }));
    expect(audioFn("seekTo")).not.toHaveBeenCalled();
  });

  it("seeks to the start before the bar is measured", async () => {
    await renderExpanded();
    await fireEvent(seekBar(), "responderGrant", touch(100, 0, 1));
    await fireEvent(seekBar(), "responderRelease", touch(100, 0, 2));
    expect(audioFn("seekTo")).toHaveBeenCalledWith(0);
  });

  it.each([
    ["increment", 40],
    ["decrement", 20],
  ])("steps the position on %s", async (action, expected) => {
    await renderExpanded({ progress: { position: 30 } });
    await fireEvent(seekBar(), "accessibilityAction", a11yAction(action));
    expect(audioFn("seekTo")).toHaveBeenCalledWith(expected);
  });

  it.each<[string, Partial<AudioContextValue>, string]>([
    ["an unrelated action", {}, "magicTap"],
    ["an unknown duration", { duration: 0 }, "increment"],
  ])("ignores %s", async (_case, audio, action) => {
    await renderExpanded({ audio });
    await fireEvent(seekBar(), "accessibilityAction", a11yAction(action));
    expect(audioFn("seekTo")).not.toHaveBeenCalled();
  });

  it("seeks across the whole queue when one is playing", async () => {
    await renderExpanded({
      audio: queueAudio({ queueDuration: 300 }),
      progress: { queuePosition: 100 },
    });
    await fireEvent(seekBar(), "accessibilityAction", a11yAction("increment"));
    expect(audioFn("seekToQueuePosition")).toHaveBeenCalledWith(110);
  });
});

describe("MiniPlayer — expanded playlist", () => {
  const playlist: AudioTrack[] = [
    buildAudioTrack({ id: "a", playlistPrimary: "بِسْمِ اللَّهِ", playlistPrimaryRtl: true }),
    buildAudioTrack({ id: "b", subtitle: "Ayah 2", preview: "الْحَمْدُ لِلَّهِ" }),
    buildAudioTrack({ id: "c", playlistSecondary: "Secondary line" }),
    buildAudioTrack({ id: "d" }),
  ];

  const renderPlaylist = () =>
    renderExpanded({
      audio: { current: playlist[1], queue: playlist, index: 1, queueDuration: 400 },
    });

  it("hides the playlist for a single track", async () => {
    await renderExpanded();
    expect(screen.queryByText("Up next")).toBeNull();
  });

  it.each([
    ["an Arabic primary line", "بِسْمِ اللَّهِ"],
    ["subtitle and preview", "Ayah 2. الْحَمْدُ لِلَّهِ"],
    ["title and secondary line", "Track c. Secondary line"],
    ["the title alone", "Track d"],
  ])("labels a row from %s", async (_case, label) => {
    await renderPlaylist();
    expect(screen.getByLabelText(label)).toBeTruthy();
  });

  it("marks the playing row selected", async () => {
    await renderPlaylist();
    expect(screen.getByLabelText("Ayah 2. الْحَمْدُ لِلَّهِ").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it("jumps to a tapped row", async () => {
    await renderPlaylist();
    await fireEvent.press(screen.getByLabelText("Track d"));
    expect(audioFn("jumpTo")).toHaveBeenCalledWith(3);
  });

  it("scrolls the playing row to the top once laid out", async () => {
    jest.useFakeTimers();
    const scrollSpy = jest.spyOn(FlatList.prototype, "scrollToOffset").mockImplementation(() => {});
    await renderPlaylist();
    const [list] = screen.container.queryAll(
      (node) =>
        node.props.contentContainerStyle != null && typeof node.props.onLayout === "function",
    );
    await fireEvent(list, "layout", layoutEvent(300, 400));
    await act(async () => {
      jest.advanceTimersByTime(20);
    });
    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ animated: false, offset: expect.any(Number) }),
    );
  });
});

// ── TV ───────────────────────────────────────────────────────────────────────

describe("MiniPlayer — TV", () => {
  usePlatform({ isTV: true });

  let backPress: (() => boolean | null | undefined) | undefined;
  const removeBackHandler = jest.fn();

  beforeEach(() => {
    backPress = undefined;
    jest.spyOn(BackHandler, "addEventListener").mockImplementation((_event, handler) => {
      backPress = handler;
      return { remove: removeBackHandler };
    });
  });

  it("hides the drag-only volume control", async () => {
    await renderMiniPlayer();
    expect(screen.queryByLabelText("Volume")).toBeNull();
  });

  it("disables the web Escape shortcut", async () => {
    await renderExpanded();
    expect(webKeyHandlerState.enabled).toBe(false);
  });

  it.each([
    ["Forward 10 seconds", 300],
    ["Back 10 seconds", 285],
  ])("%s steps the queue position", async (label, expected) => {
    await renderExpanded({
      audio: queueAudio({ queueDuration: 300 }),
      progress: { queuePosition: 295 },
    });
    await fireEvent.press(screen.getByLabelText(label));
    expect(audioFn("seekToQueuePosition")).toHaveBeenCalledWith(expected);
  });

  it("ignores seek steps when the duration is unknown", async () => {
    await renderExpanded({ audio: { duration: 0 } });
    await fireEvent.press(screen.getByLabelText("Forward 10 seconds"));
    expect(audioFn("seekTo")).not.toHaveBeenCalled();
  });

  it("collapses the expanded player on remote Back", async () => {
    await renderExpanded({ audio: queueAudio() });
    let handled: boolean | null | undefined;
    await act(async () => {
      handled = backPress?.();
    });
    expect(handled).toBe(true);
    expect(screen.queryByText("Now Playing")).toBeNull();
  });

  it("stops listening for Back once collapsed", async () => {
    await renderExpanded();
    await fireEvent.press(screen.getByLabelText("Minimize"));
    expect(removeBackHandler).toHaveBeenCalled();
  });
});
