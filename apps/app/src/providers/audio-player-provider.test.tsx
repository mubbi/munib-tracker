import { act, render, renderHook, screen } from "@testing-library/react-native";
import { preload, setAudioModeAsync } from "expo-audio";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Text } from "react-native";

import {
  invalidateCachedAudioUri,
  peekCachedAudioUri,
  peekNativeCachedAudioUri,
  prefetchAudioUri,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";
import { AUDIO_KEEP_AWAKE_TAG } from "@/lib/audio-keep-awake";
import {
  activateLockScreenControls,
  deactivateLockScreenControls,
  ensureAndroidMediaNotificationPermission,
} from "@/lib/audio-lock-screen";
import { PLAYBACK_AUDIO_MODE } from "@/lib/audio-session-mode";
import { triggerHaptic } from "@/lib/haptics";
import { pauseTts, resumeTts, speak, stopTts } from "@/lib/tts";
import type { AudioContextValue, AudioProgressValue } from "@/providers/audio-player-context";
import {
  AUDIO_SPEEDS,
  AudioPlayerProvider,
  type AudioTrack,
  useAudioPlayerContext,
  useAudioProgressContext,
} from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import { deferred } from "@/test-support/async";
import { buildAudioTrack, buildTtsTrack, TTS_SAMPLE_TEXT } from "@/test-support/fixtures/audio";
import { setPlatform, usePlatform } from "@/test-support/platform";

// ---------------------------------------------------------------------------
// Controllable expo-audio: the provider creates two stable players (A, B).
// Each player's status is published through `useSyncExternalStore`, so tests
// push engine events (loaded / playing / didJustFinish) via `setStatus`.
// ---------------------------------------------------------------------------

type Status = {
  playing: boolean;
  isLoaded: boolean;
  isBuffering: boolean;
  didJustFinish: boolean;
  currentTime: number;
  duration: number;
};

type StatusEvent = { playing?: boolean; isLoaded?: boolean; didJustFinish?: boolean };

type MockPlayer = {
  play: jest.Mock;
  pause: jest.Mock;
  replace: jest.Mock;
  seekTo: jest.Mock;
  setPlaybackRate: jest.Mock;
  addListener: jest.Mock;
  remove: jest.Mock;
  listeners: Array<(event: StatusEvent) => void>;
  isLoaded: boolean;
  playing: boolean;
  isBuffering: boolean;
  currentTime: number;
  shouldCorrectPitch: boolean;
  volume: number;
  status: Status;
};

const mockPlayers: MockPlayer[] = [];
const mockStatusSubs = new Set<() => void>();
const mockEngine = { throwOnCreate: false };

function mockCreatePlayer(): MockPlayer {
  if (mockEngine.throwOnCreate) throw new Error("engine unavailable");
  const listeners: Array<(event: StatusEvent) => void> = [];
  const remove = jest.fn();
  const player: MockPlayer = {
    play: jest.fn(),
    pause: jest.fn(),
    replace: jest.fn(),
    seekTo: jest.fn(async () => undefined),
    setPlaybackRate: jest.fn(),
    addListener: jest.fn((_event: string, cb: (event: StatusEvent) => void) => {
      listeners.push(cb);
      return { remove };
    }),
    remove,
    listeners,
    isLoaded: true,
    playing: false,
    isBuffering: false,
    currentTime: 0,
    shouldCorrectPitch: false,
    volume: 1,
    status: {
      playing: false,
      isLoaded: false,
      isBuffering: false,
      didJustFinish: false,
      currentTime: 0,
      duration: 0,
    },
  };
  mockPlayers.push(player);
  return player;
}

jest.mock("expo-audio", () => {
  const React = require("react");
  return {
    useAudioPlayer: () => {
      const [player] = React.useState(() => mockCreatePlayer());
      return player;
    },
    useAudioPlayerStatus: (player: MockPlayer) =>
      React.useSyncExternalStore(
        (cb: () => void) => {
          mockStatusSubs.add(cb);
          return () => mockStatusSubs.delete(cb);
        },
        () => player.status,
      ),
    setAudioModeAsync: jest.fn(async () => undefined),
    preload: jest.fn(),
  };
});

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn(async () => undefined),
  deactivateKeepAwake: jest.fn(async () => undefined),
}));

const mockCache = { enabled: false };
jest.mock("@/lib/audio-cache", () => ({
  invalidateCachedAudioUri: jest.fn(async () => undefined),
  isAudioLocalCacheEnabled: () => mockCache.enabled,
  peekCachedAudioUri: jest.fn(() => null),
  peekNativeCachedAudioUri: jest.fn(async () => null),
  prefetchAudioUri: jest.fn(),
  resolveCachedAudioUri: jest.fn(async (uri: string) => uri),
}));

jest.mock("@/lib/audio-lock-screen", () => ({
  activateLockScreenControls: jest.fn(),
  deactivateLockScreenControls: jest.fn(),
  ensureAndroidMediaNotificationPermission: jest.fn(async () => undefined),
}));

jest.mock("@/lib/haptics", () => ({ triggerHaptic: jest.fn() }));

const mockTts = { canPause: true };
jest.mock("@/lib/tts", () => ({
  canPauseTts: () => mockTts.canPause,
  pauseTts: jest.fn(async () => undefined),
  playerRateToSpeechRate: (rate: number) => rate,
  resumeTts: jest.fn(async () => undefined),
  speak: jest.fn(async () => undefined),
  stopTts: jest.fn(async () => undefined),
}));

jest.mock("@/lib/audio-queue-timing", () => ({
  ...jest.requireActual("@/lib/audio-queue-timing"),
  prefetchTrackDurations: jest.fn(async () => undefined),
}));

jest.mock("@/stores/continue-store", () => ({ recordContinueActivity: jest.fn() }));

const mockPrefs: {
  ready: boolean;
  prefs: { audioSpeed?: number; audioVolume?: number };
  update: jest.Mock;
} = { ready: true, prefs: {}, update: jest.fn(async () => undefined) };

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: () => ({ prefs: mockPrefs.prefs, update: mockPrefs.update }),
  },
  usePreferencesReady: () => mockPrefs.ready,
}));

const asMock = (fn: unknown) => fn as jest.Mock;

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

const h = {} as { ctx: AudioContextValue; prog: AudioProgressValue };

function Probe() {
  h.ctx = useAudioPlayerContext();
  h.prog = useAudioProgressContext();
  return null;
}

const A = () => mockPlayers[0] as MockPlayer;
const B = () => mockPlayers[1] as MockPlayer;

async function flush() {
  await act(async () => {
    for (let i = 0; i < 20; i++) await Promise.resolve();
  });
}

/** Mounts the provider with a context probe; optionally starts a queue. */
async function renderAudioPlayer(tracks?: AudioTrack[], startIndex = 0) {
  const utils = await render(
    <AudioPlayerProvider>
      <Probe />
      <Text>child</Text>
    </AudioPlayerProvider>,
  );
  await flush();
  if (tracks) await run(() => h.ctx.play(tracks, startIndex));
  return utils;
}

async function run(fn: () => void) {
  await act(async () => {
    fn();
  });
  await flush();
}

async function setStatus(player: MockPlayer, patch: Partial<Status>) {
  await act(async () => {
    player.status = { ...player.status, ...patch };
    for (const cb of [...mockStatusSubs]) cb();
  });
  await flush();
}

async function advance(ms: number) {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
  await flush();
}

async function cycleLoopTo(mode: AudioContextValue["loopMode"]) {
  while (h.ctx.loopMode !== mode) await run(() => h.ctx.cycleLoopMode());
}

function throwing(): never {
  throw new Error("engine error");
}

/** Replaces a player property with a getter that throws (released native object). */
function breakProperty(player: MockPlayer, key: "isLoaded" | "currentTime") {
  Object.defineProperty(player, key, { configurable: true, get: throwing });
}

const track = (id: string, extra: Partial<AudioTrack> = {}) => buildAudioTrack({ id, ...extra });
const tts = (id: string, text?: string) => buildTtsTrack({ id }, text);
const uriOf = (id: string) => `https://cdn.test/${id}.mp3`;

const replacedUris = (player: MockPlayer) =>
  player.replace.mock.calls.map(([arg]) =>
    typeof arg === "object" && arg ? (arg as { uri: string }).uri : arg,
  );

const lastSpeak = () =>
  asMock(speak).mock.calls.at(-1) as [
    string,
    { lang: string; voice?: string; rate?: number; onDone: () => void; onError: () => void },
  ];

const speakCount = () => asMock(speak).mock.calls.length;

beforeEach(() => {
  jest.clearAllMocks();
  mockPlayers.length = 0;
  mockStatusSubs.clear();
  mockEngine.throwOnCreate = false;
  mockCache.enabled = false;
  mockTts.canPause = true;
  mockPrefs.ready = true;
  mockPrefs.prefs = {};
  asMock(peekCachedAudioUri).mockImplementation(() => null);
  asMock(peekNativeCachedAudioUri).mockImplementation(async () => null);
  asMock(resolveCachedAudioUri).mockImplementation(async (uri: string) => uri);
  asMock(invalidateCachedAudioUri).mockImplementation(async () => undefined);
  asMock(preload).mockImplementation(() => undefined);
  asMock(setAudioModeAsync).mockImplementation(async () => undefined);
  asMock(speak).mockImplementation(async () => undefined);
  asMock(stopTts).mockImplementation(async () => undefined);
});

afterEach(() => {
  jest.useRealTimers();
});

// ---------------------------------------------------------------------------
// Shell, context hooks, session setup
// ---------------------------------------------------------------------------

describe("AudioPlayerProvider shell", () => {
  it("exposes the speed presets", () => {
    expect(AUDIO_SPEEDS).toEqual([0.5, 1, 1.5, 2]);
  });

  it("keeps children and the SSR context when the engine fails to start", async () => {
    mockEngine.throwOnCreate = true;
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await renderAudioPlayer();
    expect(screen.getByText("child")).toBeTruthy();
    expect(h.ctx.queue).toEqual([]);
    expect(h.ctx.readPlaybackSeconds()).toBe(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "[AudioPlayerProvider] Engine failed to start:",
      expect.any(Error),
      expect.anything(),
    );
    errorSpy.mockRestore();
  });

  it("throws when the player context is used outside the provider", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useAudioPlayerContext())).rejects.toThrow(
      "useAudioPlayerContext must be used within an AudioPlayerProvider",
    );
    errorSpy.mockRestore();
  });

  it("returns a zeroed progress clock outside the provider", async () => {
    const { result } = await renderHook(() => useAudioProgressContext());
    expect(result.current).toEqual({ position: 0, queuePosition: 0, queueProgress: 0 });
  });

  it("configures the native audio session, tolerating a rejection", async () => {
    asMock(setAudioModeAsync).mockRejectedValueOnce(new Error("session"));
    await renderAudioPlayer();
    expect(setAudioModeAsync).toHaveBeenCalledWith(PLAYBACK_AUDIO_MODE);
  });

  it("releases both players' status listeners on unmount", async () => {
    const { unmount } = await renderAudioPlayer();
    await act(async () => unmount());
    expect(A().remove).toHaveBeenCalled();
    expect(B().remove).toHaveBeenCalled();
  });

  it("applies the saved speed and volume to both players once preferences are ready", async () => {
    mockPrefs.prefs = { audioSpeed: 1.5, audioVolume: 0.4 };
    await renderAudioPlayer();
    expect(A().setPlaybackRate).toHaveBeenCalledWith(1.5, "high");
    expect(B().setPlaybackRate).toHaveBeenCalledWith(1.5, "high");
    expect(A().volume).toBe(0.4);
    expect({ rate: h.ctx.rate, volume: h.ctx.volume }).toEqual({ rate: 1.5, volume: 0.4 });
  });

  it("ignores saved preferences until they are ready", async () => {
    mockPrefs.ready = false;
    mockPrefs.prefs = { audioSpeed: 2 };
    await renderAudioPlayer();
    expect(h.ctx.rate).toBe(1);
    expect(A().setPlaybackRate).not.toHaveBeenCalled();
  });
});

describe("AudioPlayerProvider keep-awake", () => {
  it("holds the screen awake while playback is active", async () => {
    await renderAudioPlayer([tts("t1")]);
    expect(activateKeepAwakeAsync).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
  });

  it("releases the wake lock when playback stops", async () => {
    await renderAudioPlayer([tts("t1")]);
    await run(() => h.ctx.stop());
    expect(deactivateKeepAwake).toHaveBeenCalledWith(AUDIO_KEEP_AWAKE_TAG);
  });
});

// ---------------------------------------------------------------------------
// Remote playback & queue controls
// ---------------------------------------------------------------------------

describe("AudioPlayerProvider remote playback", () => {
  const queue = [track("r1"), track("r2"), track("r3")];

  it("streams the first track on the active player", async () => {
    await renderAudioPlayer(queue);
    expect(A().replace).toHaveBeenCalledWith({ uri: uriOf("r1") });
    expect(A().play).toHaveBeenCalled();
    expect(h.ctx.current?.id).toBe("r1");
  });

  it("stages the next track paused in the idle player", async () => {
    await renderAudioPlayer(queue);
    expect(B().replace).toHaveBeenCalledWith({ uri: uriOf("r2") });
    expect(B().pause).toHaveBeenCalled();
  });

  it("activates lock-screen controls with the queue context", async () => {
    await renderAudioPlayer(queue);
    expect(ensureAndroidMediaNotificationPermission).toHaveBeenCalled();
    expect(activateLockScreenControls).toHaveBeenCalledWith(
      A(),
      queue[0],
      expect.objectContaining({ queueIndex: 0, queueLength: 3 }),
      "r1",
    );
  });

  it("reports an unloaded live track as buffering but playing", async () => {
    await renderAudioPlayer(queue);
    expect({ playing: h.ctx.isPlaying, buffering: h.ctx.isBuffering }).toEqual({
      playing: true,
      buffering: true,
    });
  });

  it("records continue activity for content hrefs", async () => {
    await renderAudioPlayer();
    await run(() => h.ctx.play(queue, 0, { sourceHref: "/quran/1" }));
    expect(h.ctx.sourceHref).toBe("/quran/1");
    expect(recordContinueActivity).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "quran", href: "/quran/1", isAudio: true }),
    );
  });

  it.each([
    ["a non-content href", 0, "/settings"],
    ["an out-of-range start index", 9, "/quran/2"],
  ])("skips continue activity for %s", async (_label, startIndex, sourceHref) => {
    await renderAudioPlayer();
    await run(() => h.ctx.play(queue, startIndex, { sourceHref }));
    expect(recordContinueActivity).not.toHaveBeenCalled();
  });

  it.each([
    ["next advances", "off", 0, "next", 1],
    ["next stays at the end", "off", 2, "next", 2],
    ["next wraps when looping all", "all", 2, "next", 0],
    ["previous steps back", "off", 1, "previous", 0],
    ["previous stays at the start", "off", 0, "previous", 0],
    ["previous wraps when looping all", "all", 0, "previous", 2],
  ] as const)("%s", async (_label, loop, start, action, expected) => {
    await renderAudioPlayer(queue, start);
    await cycleLoopTo(loop);
    await run(() => h.ctx[action]());
    expect(h.ctx.index).toBe(expected);
  });

  it("loads the new track seamlessly on next", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.next());
    expect(h.ctx.isTransitioning).toBe(true);
    expect(replacedUris(A())).toContain(uriOf("r2"));
  });

  it.each([
    ["off", "all"],
    ["all", "one"],
    ["one", "off"],
  ] as const)("cycles loop mode %s → %s", async (from, to) => {
    await renderAudioPlayer();
    await cycleLoopTo(from);
    await run(() => h.ctx.cycleLoopMode());
    expect(h.ctx.loopMode).toBe(to);
  });

  it.each(["next", "previous"] as const)("ignores %s on an empty queue", async (action) => {
    await renderAudioPlayer();
    await cycleLoopTo("all");
    await run(() => h.ctx[action]());
    expect(A().replace).not.toHaveBeenCalled();
  });

  it.each([-1, 9])("ignores jumpTo(%i) outside the queue", async (target) => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.jumpTo(target));
    expect(h.ctx.index).toBe(0);
  });

  it("jumps to a queue index", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.jumpTo(2));
    expect(h.ctx.index).toBe(2);
  });

  it("replays from the start with haptic feedback", async () => {
    await renderAudioPlayer(queue, 2);
    await run(() => h.ctx.replay());
    expect(h.ctx.index).toBe(0);
    expect(triggerHaptic).toHaveBeenCalledWith("light");
  });

  it("pauses on toggle while playing", async () => {
    await renderAudioPlayer([track("r1")]);
    await setStatus(A(), { isLoaded: true, playing: true });
    await run(() => h.ctx.toggle());
    await setStatus(A(), { playing: false });
    expect(A().pause).toHaveBeenCalled();
    expect(h.ctx.isPlaying).toBe(false);
  });

  it("resumes on toggle when loaded and paused", async () => {
    await renderAudioPlayer([track("r1")]);
    await setStatus(A(), { isLoaded: true });
    A().play.mockClear();
    await run(() => h.ctx.toggle());
    expect(A().play).toHaveBeenCalledTimes(1);
  });

  it("reloads a source that never loaded on toggle", async () => {
    await renderAudioPlayer([track("r1")]);
    A().replace.mockClear();
    await run(() => h.ctx.toggle());
    expect(A().replace).toHaveBeenCalledWith({ uri: uriOf("r1") });
  });

  it("swallows engine errors on toggle", async () => {
    await renderAudioPlayer([track("r1")]);
    await setStatus(A(), { isLoaded: true, playing: true });
    A().pause.mockImplementation(throwing);
    await run(() => h.ctx.toggle());
    expect(h.ctx.isPlaying).toBe(true);
  });

  it("seeks the active player and swallows seek rejections", async () => {
    await renderAudioPlayer([track("r1")]);
    A().seekTo.mockRejectedValueOnce(new Error("seek"));
    await run(() => h.ctx.seekTo(12));
    expect(A().seekTo).toHaveBeenCalledWith(12);
  });

  it("treats a queue seek in a single-track queue as a plain seek", async () => {
    await renderAudioPlayer([track("r1")]);
    await run(() => h.ctx.seekToQueuePosition(3));
    expect(A().seekTo).toHaveBeenLastCalledWith(3);
  });

  it("caches the loaded duration and publishes queue progress", async () => {
    await renderAudioPlayer(queue);
    await setStatus(A(), { isLoaded: true, duration: 10, currentTime: 4 });
    expect(h.ctx.trackDurations.r1).toBe(10);
    expect(h.ctx.duration).toBe(10);
    expect(h.prog).toEqual({ position: 4, queuePosition: 4, queueProgress: 0.4 });
  });

  it("seeks within the current track for a queue position inside it", async () => {
    await renderAudioPlayer(queue);
    await setStatus(A(), { isLoaded: true, duration: 10 });
    await run(() => h.ctx.seekToQueuePosition(5));
    expect(A().seekTo).toHaveBeenLastCalledWith(5);
  });

  it("jumps to the right track for a later queue position and seeks after load", async () => {
    await renderAudioPlayer(queue);
    await setStatus(A(), { isLoaded: true, duration: 10 });
    await run(() => h.ctx.seekToQueuePosition(15));
    await setStatus(A(), { isLoaded: false });
    await setStatus(A(), { isLoaded: true });
    expect(h.ctx.index).toBe(1);
    expect(A().seekTo).toHaveBeenCalledWith(5);
  });

  it("seeks to clipStart once the clip loads", async () => {
    await renderAudioPlayer([track("clip", { clipStart: 2, clipEnd: 4 })]);
    await setStatus(A(), { isLoaded: true });
    expect(A().seekTo).toHaveBeenCalledWith(2);
  });

  it("pauses at clipEnd even if the engine pause throws", async () => {
    await renderAudioPlayer([track("clip", { clipStart: 2, clipEnd: 4 })]);
    await setStatus(A(), { isLoaded: true, playing: true, currentTime: 3 });
    expect(A().pause).not.toHaveBeenCalled();
    A().pause.mockImplementation(throwing);
    await setStatus(A(), { currentTime: 4 });
    await setStatus(A(), { playing: false });
    expect(A().pause).toHaveBeenCalled();
    expect(h.ctx.isPlaying).toBe(false);
  });

  it("applies a new rate to both players and persists it", async () => {
    await renderAudioPlayer();
    await run(() => h.ctx.setRate(2));
    expect(A().setPlaybackRate).toHaveBeenCalledWith(2, "high");
    expect(B().setPlaybackRate).toHaveBeenCalledWith(2, "high");
    expect(A().shouldCorrectPitch).toBe(true);
    expect(mockPrefs.update).toHaveBeenCalledWith({ audioSpeed: 2 });
  });

  it.each([
    [1.5, 1],
    [-1, 0],
    [0.3, 0.3],
  ])("clamps volume %d to %d and persists it", async (input, expected) => {
    await renderAudioPlayer();
    await run(() => h.ctx.setVolume(input));
    expect(h.ctx.volume).toBe(expected);
    expect(B().volume).toBe(expected);
    expect(mockPrefs.update).toHaveBeenCalledWith({ audioVolume: expected });
  });

  it("keeps rate and volume state when the players reject them", async () => {
    await renderAudioPlayer();
    for (const p of mockPlayers) {
      p.setPlaybackRate.mockImplementation(throwing);
      Object.defineProperty(p, "volume", { configurable: true, get: () => 1, set: throwing });
    }
    await run(() => h.ctx.setRate(0.5));
    await run(() => h.ctx.setVolume(0.3));
    await run(() => h.ctx.play([track("r1")]));
    expect({ rate: h.ctx.rate, volume: h.ctx.volume }).toEqual({ rate: 0.5, volume: 0.3 });
    expect(A().play).toHaveBeenCalled();
  });

  it("stops playback, releases lock-screen controls and clears the queue", async () => {
    await renderAudioPlayer();
    await run(() => h.ctx.play(queue, 0, { sourceHref: "/dua/1" }));
    await run(() => h.ctx.stop());
    expect(A().pause).toHaveBeenCalled();
    expect(B().pause).toHaveBeenCalled();
    expect(deactivateLockScreenControls).toHaveBeenCalledWith(A());
    expect(deactivateLockScreenControls).toHaveBeenCalledWith(B());
    expect({ queue: h.ctx.queue, current: h.ctx.current, href: h.ctx.sourceHref }).toEqual({
      queue: [],
      current: null,
      href: null,
    });
  });

  it("still clears the queue on stop when pausing throws", async () => {
    await renderAudioPlayer(queue);
    A().pause.mockImplementation(throwing);
    await run(() => h.ctx.stop());
    expect(h.ctx.queue).toEqual([]);
  });

  it("reads the live engine clock", async () => {
    await renderAudioPlayer([track("r1")]);
    A().currentTime = 7;
    expect(h.ctx.readPlaybackSeconds()).toBe(7);
  });

  it("falls back to the status clock when the engine throws", async () => {
    await renderAudioPlayer([track("r1")]);
    await setStatus(A(), { currentTime: 3 });
    breakProperty(A(), "currentTime");
    expect(h.ctx.readPlaybackSeconds()).toBe(3);
  });

  it("plays a bundled source directly", async () => {
    await renderAudioPlayer([{ id: "b1", title: "Bundled", uri: "", source: 42 }]);
    expect(replacedUris(A())).toEqual([42]);
  });

  it.each([
    ["stops when there is no remote uri", "", [7]],
    ["falls back to the remote uri", uriOf("b3"), [7, uriOf("b3")]],
  ])("on a rejected bundled source, %s", async (_label, uri, expected) => {
    await renderAudioPlayer();
    A().replace.mockImplementation((arg: unknown) => {
      if (typeof arg === "number") throwing();
    });
    await run(() => h.ctx.play([{ id: "b", title: "Bundled", uri, source: 7 }]));
    expect(replacedUris(A())).toEqual(expected);
  });
});

describe("AudioPlayerProvider lock-screen status sync", () => {
  async function setup() {
    await renderAudioPlayer([track("r1"), track("r2")]);
    await setStatus(A(), { isLoaded: true, playing: false });
    return { onA: A().listeners[0], onB: B().listeners[0] };
  }

  it("shows paused when the active player reports a loaded idle source", async () => {
    const { onA } = await setup();
    await run(() => onA?.({ isLoaded: true, playing: false }));
    expect(h.ctx.isPlaying).toBe(false);
  });

  it("shows playing when the active player resumes", async () => {
    const { onA } = await setup();
    await run(() => onA?.({ isLoaded: true, playing: false }));
    await run(() => onA?.({ playing: true }));
    expect(h.ctx.isPlaying).toBe(true);
  });

  it.each([
    ["the idle player", "onB", { isLoaded: true, playing: false }],
    ["a just-finished event", "onA", { isLoaded: true, didJustFinish: true }],
  ] as const)("ignores events from %s", async (_label, which, event) => {
    const listeners = await setup();
    await run(() => listeners[which]?.(event));
    expect(h.ctx.isPlaying).toBe(true);
  });

  it("ignores events during a seamless hop", async () => {
    const { onA } = await setup();
    await run(() => h.ctx.next());
    await run(() => onA?.({ isLoaded: true, playing: false }));
    expect(h.ctx.isPlaying).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Native local cache
// ---------------------------------------------------------------------------

describe("AudioPlayerProvider native cache", () => {
  beforeEach(() => {
    mockCache.enabled = true;
  });

  const cachedCopy = (id: string) => `file:///cache/${id}.mp3`;

  it("plays a cached local copy without touching the remote url", async () => {
    asMock(peekNativeCachedAudioUri).mockImplementation(async () => cachedCopy("r1"));
    await renderAudioPlayer([track("r1")]);
    expect(replacedUris(A())).toEqual([cachedCopy("r1")]);
  });

  it("warms upcoming remote clips only", async () => {
    asMock(preload).mockImplementationOnce(() => Promise.reject(new Error("preload")));
    asMock(preload).mockImplementationOnce(throwing);
    await renderAudioPlayer([
      track("r1"),
      track("r2"),
      { id: "src", title: "Bundled", uri: "", source: 3 },
      tts("t1"),
      { id: "empty", title: "Empty", uri: "" },
    ]);
    const warmed = new Set(asMock(prefetchAudioUri).mock.calls.map(([uri]) => uri));
    expect(warmed).toEqual(new Set([uriOf("r1"), uriOf("r2")]));
    expect(preload).toHaveBeenCalledWith({ uri: uriOf("r1") });
  });

  it("stages the next clip from its resolved local copy", async () => {
    asMock(resolveCachedAudioUri).mockImplementation(async (uri: string) =>
      uri.replace("https://cdn.test/", "file:///cache/"),
    );
    await renderAudioPlayer([track("r1"), track("r2")]);
    expect(B().replace).toHaveBeenCalledWith({ uri: cachedCopy("r2") });
  });

  it("stages a bundled next clip directly", async () => {
    await renderAudioPlayer([track("r1"), { id: "src", title: "Bundled", uri: "", source: 3 }]);
    expect(B().replace).toHaveBeenCalledWith(3);
  });

  it("streams and warms the cache when nothing is cached", async () => {
    await renderAudioPlayer([track("r1")]);
    expect(A().replace).toHaveBeenCalledWith({ uri: uriOf("r1") });
    expect(resolveCachedAudioUri).toHaveBeenCalledWith(uriOf("r1"));
  });

  it("stages the remote url when resolving the cache fails", async () => {
    asMock(resolveCachedAudioUri).mockRejectedValue(new Error("download"));
    await renderAudioPlayer([track("r1"), track("r2")]);
    expect(B().replace).toHaveBeenCalledWith({ uri: uriOf("r2") });
  });

  it("streams when the cache peek fails", async () => {
    asMock(peekNativeCachedAudioUri).mockRejectedValue(new Error("peek"));
    await renderAudioPlayer([track("r3")]);
    expect(A().replace).toHaveBeenCalledWith({ uri: uriOf("r3") });
  });

  it.each([
    ["resolves", (d: ReturnType<typeof deferred<string | null>>) => d.resolve(cachedCopy("r1"))],
    ["rejects", (d: ReturnType<typeof deferred<string | null>>) => d.reject(new Error("late"))],
  ])("drops a stale cache peek that %s after stop", async (_label, settle) => {
    const peek = deferred<string | null>();
    asMock(peekNativeCachedAudioUri).mockImplementation(() => peek.promise);
    await renderAudioPlayer([track("r1")]);
    await run(() => h.ctx.stop());
    await run(() => settle(peek));
    expect(A().replace).not.toHaveBeenCalled();
  });

  it("retries the remote url when the local copy is rejected outright", async () => {
    asMock(peekNativeCachedAudioUri).mockImplementation(async () => cachedCopy("r1"));
    await renderAudioPlayer();
    A().replace.mockImplementation((arg: { uri?: string }) => {
      if (arg?.uri?.startsWith("file:")) throwing();
    });
    await run(() => h.ctx.play([track("r1")]));
    expect(replacedUris(A())).toEqual([cachedCopy("r1"), uriOf("r1")]);
  });

  it("invalidates and streams when the local copy never loads", async () => {
    jest.useFakeTimers();
    asMock(peekNativeCachedAudioUri).mockImplementation(async () => cachedCopy("r1"));
    asMock(invalidateCachedAudioUri).mockRejectedValue(new Error("invalidate"));
    await renderAudioPlayer();
    A().isLoaded = false;
    await run(() => h.ctx.play([track("r1")]));
    await advance(4100);
    expect(invalidateCachedAudioUri).toHaveBeenCalledWith(uriOf("r1"));
    expect(replacedUris(A())).toEqual([cachedCopy("r1"), uriOf("r1")]);
  });

  it("keeps a newer track when a stale local copy times out", async () => {
    jest.useFakeTimers();
    asMock(peekNativeCachedAudioUri).mockImplementation(async (uri: string) =>
      uri.includes("r1") ? cachedCopy("r1") : null,
    );
    await renderAudioPlayer();
    A().isLoaded = false;
    B().replace.mockImplementation(throwing);
    await run(() => h.ctx.play([track("r1"), track("r2")]));
    await run(() => h.ctx.next());
    await advance(4100);
    expect(invalidateCachedAudioUri).not.toHaveBeenCalledWith(uriOf("r1"));
  });

  it("does not hand off to an idle player that never became ready", async () => {
    jest.useFakeTimers();
    await renderAudioPlayer();
    breakProperty(B(), "isLoaded");
    await run(() => h.ctx.play([track("r1"), track("r2")]));
    await advance(12100);
    await setStatus(A(), { isLoaded: true, didJustFinish: true });
    expect(B().play).not.toHaveBeenCalled();
    expect(replacedUris(A())).toContain(uriOf("r2"));
  });
});

// ---------------------------------------------------------------------------
// Auto-advance on finish
// ---------------------------------------------------------------------------

describe("AudioPlayerProvider auto-advance", () => {
  const queue = [track("r1"), track("r2"), track("r3")];

  async function finish(player: MockPlayer, duration = 10) {
    await setStatus(player, { isLoaded: true, duration, didJustFinish: true });
  }

  it("hands off to the staged idle player", async () => {
    await renderAudioPlayer(queue);
    await finish(A());
    expect(B().play).toHaveBeenCalled();
    expect(A().pause).toHaveBeenCalled();
    expect(h.ctx.index).toBe(1);
    expect(h.ctx.trackDurations.r1).toBe(10);
  });

  it("moves lock-screen controls to the incoming player", async () => {
    await renderAudioPlayer(queue);
    await finish(A());
    expect(activateLockScreenControls).toHaveBeenLastCalledWith(
      B(),
      queue[1],
      expect.objectContaining({ queueIndex: 1 }),
      "r2",
    );
  });

  it("stages the following track into the now-idle player", async () => {
    await renderAudioPlayer(queue);
    await finish(A());
    expect(A().replace).toHaveBeenLastCalledWith({ uri: uriOf("r3") });
  });

  it("marks the queue finished after the last track", async () => {
    await renderAudioPlayer(queue);
    await finish(A());
    await setStatus(A(), { didJustFinish: false });
    await finish(B());
    await setStatus(B(), { didJustFinish: false });
    await finish(A());
    expect(h.ctx.index).toBe(2);
    expect(h.ctx.isQueueFinished).toBe(true);
  });

  it("wraps to the start when looping all, even if the engines throw", async () => {
    await renderAudioPlayer();
    await cycleLoopTo("all");
    await run(() => h.ctx.play([track("r1"), track("r2")]));
    B().play.mockImplementation(throwing);
    A().pause.mockImplementation(throwing);
    await finish(A());
    expect(A().replace).toHaveBeenLastCalledWith({ uri: uriOf("r1") });
    await setStatus(A(), { didJustFinish: false });
    await finish(B());
    expect(h.ctx.index).toBe(0);
  });

  it("falls back to a fresh load when the next track is not staged", async () => {
    await renderAudioPlayer([track("r1"), track("r2")]);
    B().isLoaded = false;
    await finish(A());
    expect(B().play).not.toHaveBeenCalled();
    expect(h.ctx.isTransitioning).toBe(true);
    expect(replacedUris(A())).toContain(uriOf("r2"));
  });

  it("moves the queue cursor when it falls back to a fresh load", async () => {
    await renderAudioPlayer(queue);
    B().isLoaded = false;
    await finish(A());
    expect(h.ctx.index).toBe(1);
  });

  it("keeps advancing after a fresh-load fallback instead of replaying it", async () => {
    await renderAudioPlayer(queue);
    B().isLoaded = false;
    await finish(A());
    await setStatus(A(), { didJustFinish: false });
    A().replace.mockClear();
    await finish(A());
    expect(h.ctx.index).toBe(2);
    expect(replacedUris(A())).not.toContain(uriOf("r2"));
  });

  it("repeats once in loop 'one' mode, then resets loop to off", async () => {
    await renderAudioPlayer();
    await cycleLoopTo("one");
    await run(() => h.ctx.play([track("r1")]));
    A().replace.mockClear();
    await finish(A());
    expect(h.ctx.loopMode).toBe("off");
    expect(A().replace).toHaveBeenCalledWith({ uri: uriOf("r1") });
  });

  it.each([
    ["verse", 0, ["1:1"]],
    ["surah", 1, ["1:1"]],
  ] as const)("follows the '%s' repeat plan for ayah queues", async (mode, from, expected) => {
    await renderAudioPlayer();
    await run(() => h.ctx.setRepeatPlan({ mode }));
    await run(() => h.ctx.play([track("1:1"), track("1:2")], from));
    A().replace.mockClear();
    await finish(A());
    expect(h.ctx.repeatPlan).toEqual({ mode });
    expect(replacedUris(A())).toEqual(expected.map(uriOf));
  });

  describe("translation audio", () => {
    const ayahs = [
      track("2:1", { tts: { text: "Meaning", lang: "en", voice: "v" } }),
      track("2:2"),
    ];

    async function setup() {
      await renderAudioPlayer();
      await run(() => h.ctx.setTranslationAudio("after"));
      await run(() => h.ctx.play(ayahs));
      await finish(A());
    }

    it("speaks the translation before advancing", async () => {
      await setup();
      expect(speak).toHaveBeenCalledWith("Meaning", expect.objectContaining({ voice: "v" }));
      expect(h.ctx.isSpeakingTranslation).toBe(true);
      expect(h.ctx.isPlaying).toBe(true);
      expect(h.ctx.index).toBe(0);
    });

    it.each(["onDone", "onError"] as const)("advances when speech fires %s", async (cb) => {
      await setup();
      await run(() => lastSpeak()[1][cb]());
      expect(h.ctx.isSpeakingTranslation).toBe(false);
      expect(h.ctx.index).toBe(1);
    });

    it("stops speech when translation audio is turned off", async () => {
      await setup();
      asMock(stopTts).mockClear();
      await run(() => h.ctx.setTranslationAudio("off"));
      expect(stopTts).toHaveBeenCalled();
      expect(h.ctx.isSpeakingTranslation).toBe(false);
    });

    it("never waits for translation speech on TV", async () => {
      const restore = setPlatform({ isTV: true });
      await setup();
      restore();
      expect(speak).not.toHaveBeenCalled();
      expect(h.ctx.index).toBe(1);
    });
  });
});

// ---------------------------------------------------------------------------
// Timers: stuck loads, transitions, Android focus reconcile
// ---------------------------------------------------------------------------

describe("AudioPlayerProvider timers", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  async function setupStuck() {
    await renderAudioPlayer();
    A().isLoaded = false;
    B().replace.mockImplementation(throwing);
    await run(() => h.ctx.play([track("r1"), track("r2")]));
  }

  /** A seamless re-jump re-arms the stuck-load timer once the transition lapses. */
  async function rearm() {
    await run(() => h.ctx.jumpTo(0));
    await advance(2500);
  }

  it("reloads a stuck source after invalidating its cache entry", async () => {
    await setupStuck();
    await advance(8000);
    expect(invalidateCachedAudioUri).toHaveBeenCalledWith(uriOf("r1"));
    expect(A().replace).toHaveBeenCalledTimes(2);
  });

  it("retries a second time without invalidating again", async () => {
    await setupStuck();
    await advance(8000);
    await rearm();
    const before = A().replace.mock.calls.length;
    await advance(8000);
    expect(A().replace.mock.calls.length).toBe(before + 1);
    expect(invalidateCachedAudioUri).toHaveBeenCalledTimes(1);
  });

  it("gives up after the retry limit", async () => {
    await setupStuck();
    await advance(8000);
    await rearm();
    await advance(8000);
    await rearm();
    const before = A().replace.mock.calls.length;
    await advance(8000);
    expect(A().replace.mock.calls.length).toBe(before);
  });

  it("lifts the transition via its safety timer", async () => {
    await setupStuck();
    await run(() => h.ctx.jumpTo(0));
    expect(h.ctx.isTransitioning).toBe(true);
    await advance(2500);
    expect(h.ctx.isTransitioning).toBe(false);
  });

  it("resets the retry budget once the source loads", async () => {
    await renderAudioPlayer();
    A().isLoaded = false;
    await run(() => h.ctx.play([track("r1")]));
    await advance(8000);
    await setStatus(A(), { isLoaded: true });
    await setStatus(A(), { isLoaded: false });
    await advance(8000);
    expect(invalidateCachedAudioUri).toHaveBeenCalledTimes(2);
  });

  it("skips the retry when the engine reports loaded", async () => {
    await renderAudioPlayer([track("r1")]);
    await advance(8000);
    expect(A().replace).toHaveBeenCalledTimes(1);
  });

  it("retries a bundled source without cache invalidation when the engine throws", async () => {
    await renderAudioPlayer();
    breakProperty(A(), "isLoaded");
    await run(() => h.ctx.play([{ id: "s1", title: "Bundled", uri: "", source: 5 }]));
    await advance(8000);
    expect(invalidateCachedAudioUri).not.toHaveBeenCalled();
    expect(replacedUris(A())).toEqual([5, 5]);
  });

  describe("seamless transition", () => {
    async function setup(currentTime: number) {
      await renderAudioPlayer();
      B().replace.mockImplementation(throwing);
      await run(() => h.ctx.play([track("r1"), track("r2")]));
      await setStatus(A(), { isLoaded: true, currentTime, duration: 31 });
      await run(() => h.ctx.next());
      await advance(200);
    }

    it("holds while the engine still reports the outgoing track's time", async () => {
      await setup(30);
      await setStatus(A(), { currentTime: 30.2 });
      expect(h.ctx.isTransitioning).toBe(true);
    });

    it.each([
      ["the clock resets below the outgoing time", 30, 0.1],
      ["there was no meaningful prior time", 0, 0.3],
    ])("clears once %s", async (_label, from, now) => {
      await setup(from);
      await setStatus(A(), { currentTime: now });
      expect(h.ctx.isTransitioning).toBe(false);
    });
  });

  describe("on Android", () => {
    usePlatform({ OS: "android" });

    async function setup() {
      await renderAudioPlayer();
      B().replace.mockImplementation(throwing);
      await run(() => h.ctx.play([track("r1"), track("r2")]));
      await setStatus(A(), { isLoaded: true, playing: false });
    }

    it("shows paused when audio focus was refused", async () => {
      await setup();
      await advance(1600);
      expect(h.ctx.isPlaying).toBe(false);
    });

    it("keeps playing when the engine is actually playing", async () => {
      await setup();
      A().playing = true;
      await setStatus(A(), { isBuffering: true });
      await setStatus(A(), { isBuffering: false });
      await advance(1600);
      expect(h.ctx.isPlaying).toBe(true);
    });

    it("skips the reconcile when the player throws", async () => {
      await setup();
      breakProperty(A(), "isLoaded");
      await setStatus(A(), { isBuffering: true });
      await setStatus(A(), { isBuffering: false });
      await advance(1600);
      expect(h.ctx.isPlaying).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Text-to-speech queue tracks
// ---------------------------------------------------------------------------

describe("AudioPlayerProvider TTS tracks", () => {
  const SECOND_TEXT = "Second segment here";
  const queue = [tts("t1"), tts("t2", SECOND_TEXT)];

  it("pauses both engines and speaks the first segment", async () => {
    await renderAudioPlayer(queue);
    expect(A().pause).toHaveBeenCalled();
    expect(B().pause).toHaveBeenCalled();
    expect(speak).toHaveBeenCalledWith(TTS_SAMPLE_TEXT, expect.objectContaining({ rate: 1 }));
  });

  it("reports a loaded, playing, non-buffering track with an estimated duration", async () => {
    await renderAudioPlayer(queue);
    expect(h.ctx).toMatchObject({ isPlaying: true, isLoaded: true, isBuffering: false });
    expect(h.ctx.duration).toBeGreaterThan(0);
    expect(h.ctx.readPlaybackSeconds()).toBe(0);
  });

  it.each(["onDone", "onError"] as const)("advances to the next segment on %s", async (cb) => {
    await renderAudioPlayer(queue);
    await run(() => lastSpeak()[1][cb]());
    expect(h.ctx.index).toBe(1);
    expect(lastSpeak()[0]).toBe(SECOND_TEXT);
  });

  it("ignores callbacks from a superseded utterance", async () => {
    await renderAudioPlayer(queue);
    const first = lastSpeak()[1];
    await run(() => first.onDone());
    const count = speakCount();
    await run(() => first.onDone());
    await run(() => first.onError());
    expect(speakCount()).toBe(count);
  });

  it("finishes the queue after the last segment", async () => {
    await renderAudioPlayer(queue, 1);
    await run(() => lastSpeak()[1].onDone());
    expect(h.ctx.isQueueFinished).toBe(true);
    expect(h.ctx.isPlaying).toBe(false);
  });

  it.each([
    ["wraps to the start when looping all", "all", 1, 0, "all"],
    ["repeats once when looping one", "one", 0, 0, "off"],
  ] as const)("%s", async (_label, loop, start, expectedIndex, expectedLoop) => {
    await renderAudioPlayer();
    await cycleLoopTo(loop);
    await run(() => h.ctx.play(queue, start));
    await run(() => lastSpeak()[1].onDone());
    expect(h.ctx.index).toBe(expectedIndex);
    expect(h.ctx.loopMode).toBe(expectedLoop);
    expect(speakCount()).toBe(2);
  });

  it("follows the repeat plan for ayah TTS tracks", async () => {
    await renderAudioPlayer();
    await run(() => h.ctx.setRepeatPlan({ mode: "verse" }));
    await run(() => h.ctx.play([tts("3:1"), tts("3:2")]));
    await run(() => lastSpeak()[1].onDone());
    expect(h.ctx.index).toBe(0);
    expect(speakCount()).toBe(2);
  });

  it("drops an utterance superseded before speech starts", async () => {
    const pendingStop = deferred<void>();
    // play() calls stopTts first; the deferred one belongs to the playIndex load.
    asMock(stopTts)
      .mockImplementationOnce(async () => undefined)
      .mockImplementationOnce(() => pendingStop.promise);
    await renderAudioPlayer(queue);
    await run(() => h.ctx.play([tts("t3")]));
    await run(() => pendingStop.resolve());
    expect(speak).toHaveBeenCalledTimes(1);
  });

  it("ignores completion while paused", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.toggle());
    await run(() => lastSpeak()[1].onDone());
    expect(h.ctx.index).toBe(0);
  });

  it("pauses speech on toggle when the engine supports it", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.toggle());
    expect(pauseTts).toHaveBeenCalled();
    expect(h.ctx.isPlaying).toBe(false);
  });

  it("resumes paused speech on the next toggle", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.toggle());
    await run(() => h.ctx.toggle());
    expect(resumeTts).toHaveBeenCalled();
    expect(h.ctx.isPlaying).toBe(true);
  });

  it("stops and restarts speech when pausing is unsupported", async () => {
    mockTts.canPause = false;
    await renderAudioPlayer(queue);
    asMock(stopTts).mockClear();
    await run(() => h.ctx.toggle());
    expect(stopTts).toHaveBeenCalled();
    await run(() => h.ctx.toggle());
    expect(pauseTts).not.toHaveBeenCalled();
    expect(resumeTts).not.toHaveBeenCalled();
    expect(speakCount()).toBe(2);
  });

  it("ticks the synthetic clock while speaking", async () => {
    jest.useFakeTimers();
    await renderAudioPlayer(queue);
    await advance(1000);
    expect(h.prog.position).toBeGreaterThan(0.5);
    expect(h.ctx.readPlaybackSeconds()).toBe(h.prog.position);
  });

  it("freezes the synthetic clock while paused", async () => {
    jest.useFakeTimers();
    await renderAudioPlayer(queue);
    await advance(400);
    await run(() => h.ctx.toggle());
    const paused = h.prog.position;
    await advance(1000);
    expect(h.prog.position).toBe(paused);
  });

  it("restarts speech from a later word when seeking while playing", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.seekTo(h.ctx.duration / 2));
    const [sliced] = lastSpeak();
    expect(sliced.length).toBeLessThan(TTS_SAMPLE_TEXT.length);
    expect(TTS_SAMPLE_TEXT.endsWith(sliced)).toBe(true);
  });

  it.each([
    [1, 1],
    [-5, 0],
  ])("moves the paused clock to %d (clamped %d) without speaking", async (to, expected) => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.toggle());
    const count = speakCount();
    await run(() => h.ctx.seekTo(to));
    expect(speakCount()).toBe(count);
    expect(h.prog.position).toBe(expected);
  });

  it("restarts speech from the seek position on resume", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.toggle());
    await run(() => h.ctx.seekTo(1));
    const count = speakCount();
    await run(() => h.ctx.toggle());
    expect(speakCount()).toBe(count + 1);
  });

  it("skips to the next segment when seeking to the end", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.seekTo(h.ctx.duration));
    expect(h.ctx.index).toBe(1);
  });

  it("finishes immediately when a queue seek lands at the end of the last segment", async () => {
    await renderAudioPlayer([tts("t1")]);
    await run(() => h.ctx.seekToQueuePosition(h.ctx.duration));
    expect(h.ctx.isQueueFinished).toBe(true);
  });

  it("restarts speech at a new rate", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.setRate(2));
    expect(lastSpeak()[1].rate).toBe(2);
  });

  it("keeps paused speech paused on a rate change", async () => {
    await renderAudioPlayer(queue);
    await run(() => h.ctx.toggle());
    const count = speakCount();
    await run(() => h.ctx.setRate(1.5));
    expect(speakCount()).toBe(count);
  });

  describe("setTtsVoice", () => {
    const mixed = [tts("t1"), track("r1")];

    it("is a no-op without TTS tracks", async () => {
      await renderAudioPlayer([track("r1")]);
      const before = h.ctx.queue;
      await run(() => h.ctx.setTtsVoice("voice"));
      expect(h.ctx.queue).toBe(before);
    });

    it("updates TTS tracks only and restarts speech with the voice", async () => {
      await renderAudioPlayer(mixed);
      await run(() => h.ctx.setTtsVoice("voice-1"));
      expect(h.ctx.queue[0]?.ttsPlayback?.voice).toBe("voice-1");
      expect(h.ctx.queue[1]?.ttsPlayback).toBeUndefined();
      expect(lastSpeak()[1].voice).toBe("voice-1");
    });

    it("does not restart paused speech", async () => {
      await renderAudioPlayer(mixed);
      await run(() => h.ctx.toggle());
      const count = speakCount();
      await run(() => h.ctx.setTtsVoice("voice-2"));
      expect(speakCount()).toBe(count);
      expect(h.ctx.queue[0]?.ttsPlayback?.voice).toBe("voice-2");
    });

    it("updates the queue without restarting when the current track is not TTS", async () => {
      await renderAudioPlayer(mixed, 1);
      await run(() => h.ctx.setTtsVoice("voice-3"));
      expect(h.ctx.queue[0]?.ttsPlayback?.voice).toBe("voice-3");
      expect(speak).not.toHaveBeenCalled();
    });
  });
});

// ---------------------------------------------------------------------------
// Web build
// ---------------------------------------------------------------------------

describe("AudioPlayerProvider on web", () => {
  usePlatform({ OS: "web" });

  type Handler = ((...args: unknown[]) => void) | null;
  const handlers: Record<string, Handler> = {};
  const mediaSession = { setActionHandler: jest.fn(), setPositionState: jest.fn() };
  const windowListeners: Record<string, (event: unknown) => void> = {};
  const g = globalThis as unknown as Record<string, unknown>;
  const originals = {
    navigator: g.navigator,
    addEventListener: g.addEventListener,
    removeEventListener: g.removeEventListener,
  };
  let playResult: unknown;
  const originalPlay = jest.fn(() => playResult);
  const mediaProto = () => (g.HTMLMediaElement as { prototype: { play: () => unknown } }).prototype;

  beforeEach(() => {
    for (const key of Object.keys(handlers)) delete handlers[key];
    mediaSession.setActionHandler.mockImplementation((action: string, handler: Handler) => {
      handlers[action] = handler;
    });
    mediaSession.setPositionState.mockImplementation(() => {});
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: { mediaSession } });
    class FakeMedia {}
    (FakeMedia.prototype as unknown as { play: unknown }).play = originalPlay;
    g.HTMLMediaElement = FakeMedia;
    g.addEventListener = jest.fn((type: string, cb: (event: unknown) => void) => {
      windowListeners[type] = cb;
    });
    g.removeEventListener = jest.fn();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originals.navigator,
    });
    delete g.HTMLMediaElement;
    // RNTL unmounts after this hook, so keep callable listeners around.
    g.addEventListener = originals.addEventListener ?? (() => {});
    g.removeEventListener = originals.removeEventListener ?? (() => {});
  });

  it("mounts the engine after hydration without native session setup", async () => {
    await renderAudioPlayer();
    expect(mockPlayers).toHaveLength(2);
    expect(setAudioModeAsync).not.toHaveBeenCalled();
    expect(A().addListener).not.toHaveBeenCalled();
  });

  it("removes the rejection listener and restores media play() on unmount", async () => {
    const { unmount } = await renderAudioPlayer();
    await act(async () => unmount());
    expect(g.removeEventListener).toHaveBeenCalledWith("unhandledrejection", expect.any(Function));
    expect(mediaProto().play).toBe(originalPlay);
  });

  it("patches media play() once", async () => {
    await renderAudioPlayer();
    expect(mediaProto().play).not.toBe(originalPlay);
    expect((mediaProto().play as { __munibPatched?: boolean }).__munibPatched).toBe(true);
  });

  it("swallows a benign AbortError from play()", async () => {
    await renderAudioPlayer();
    playResult = Promise.reject(Object.assign(new Error("interrupted"), { name: "AbortError" }));
    await expect(mediaProto().play.call({})).resolves.toBeUndefined();
  });

  it("re-throws other play() rejections", async () => {
    await renderAudioPlayer();
    playResult = Promise.reject(new Error("NotAllowed"));
    await expect(mediaProto().play.call({})).rejects.toThrow("NotAllowed");
  });

  it("passes through a non-promise play() result", async () => {
    await renderAudioPlayer();
    playResult = undefined;
    expect(mediaProto().play.call({})).toBeUndefined();
  });

  it.each([
    ["an interrupted play() AbortError", { name: "AbortError", message: "The play() request" }, 1],
    ["another error", { name: "TypeError" }, 0],
    ["an AbortError without a message", { name: "AbortError" }, 0],
    ["a missing reason", undefined, 0],
  ])("handles an unhandled rejection from %s", async (_label, reason, prevented) => {
    await renderAudioPlayer();
    const event = { reason, preventDefault: jest.fn() };
    windowListeners.unhandledrejection?.(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(prevented);
  });

  it("clears Media Session queue handlers for a single track", async () => {
    await renderAudioPlayer([track("1:1")]);
    expect(mediaSession.setActionHandler).toHaveBeenCalledWith("nexttrack", null);
    expect(mediaSession.setActionHandler).toHaveBeenCalledWith("previoustrack", null);
  });

  it.each([
    ["nexttrack", 0, 1],
    ["previoustrack", 1, 0],
  ])("navigates the queue from the Media Session %s action", async (action, from, to) => {
    await renderAudioPlayer([track("1:1"), track("1:2")], from);
    await run(() => handlers[action]?.());
    expect(h.ctx.index).toBe(to);
  });

  it("publishes the grouped ayah queue position to the Media Session", async () => {
    await renderAudioPlayer([track("1:1"), track("1:2")]);
    await setStatus(A(), { isLoaded: true, duration: 6, currentTime: 2 });
    expect(mediaSession.setPositionState).toHaveBeenLastCalledWith({
      duration: 6,
      playbackRate: 1,
      position: 2,
    });
  });

  it("tolerates Media Session APIs that throw", async () => {
    mediaSession.setActionHandler.mockImplementation(throwing);
    mediaSession.setPositionState.mockImplementation(throwing);
    await renderAudioPlayer([track("1:1"), track("1:2")]);
    await setStatus(A(), { isLoaded: true, duration: 6, currentTime: 2 });
    await run(() => h.ctx.play([track("x1")]));
    await run(() => h.ctx.stop());
    expect(h.ctx.queue).toEqual([]);
  });

  describe("with the session cache", () => {
    beforeEach(() => {
      mockCache.enabled = true;
    });

    const blob = (id: string) => `blob:${uriOf(id)}`;

    it("plays and stages session blob copies", async () => {
      asMock(peekCachedAudioUri).mockImplementation((uri: string) => `blob:${uri}`);
      asMock(preload).mockImplementation(() => Promise.resolve());
      await renderAudioPlayer([track("r1"), track("r2")]);
      expect(A().replace).toHaveBeenCalledWith({ uri: blob("r1") });
      expect(B().replace).toHaveBeenCalledWith({ uri: blob("r2") });
      expect(preload).toHaveBeenCalledWith({ uri: blob("r2") });
    });

    it("streams and warms the cache without a session copy", async () => {
      await renderAudioPlayer([track("r3")]);
      expect(A().replace).toHaveBeenCalledWith({ uri: uriOf("r3") });
      expect(resolveCachedAudioUri).toHaveBeenCalledWith(uriOf("r3"));
    });

    it("stages the remote url when resolving the cache fails", async () => {
      asMock(resolveCachedAudioUri).mockRejectedValue(new Error("download"));
      await renderAudioPlayer([track("r3"), track("r4")]);
      expect(B().replace).toHaveBeenCalledWith({ uri: uriOf("r4") });
    });
  });
});
