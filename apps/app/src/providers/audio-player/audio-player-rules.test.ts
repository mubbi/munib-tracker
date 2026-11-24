import { act, renderHook } from "@testing-library/react-native";

import { activateLockScreenControls } from "@/lib/audio-lock-screen";
import { buildAudioTrack, buildTtsTrack } from "@/test-support/fixtures/audio";

import { lockScreenQueueContext, syncLockScreenForTrack } from "./lock-screen-sync";
import { looksLikeRefusedPlayback } from "./use-android-focus-reconcile";
import { hasReachedClipEnd } from "./use-loaded-track-sync";
import { pausedStateFromStatusEvent } from "./use-platform-audio-session";
import { clampVolume, isVolumeEcho } from "./use-playback-rate-volume";
import { hasTransitionSettled, useQueueTransition } from "./use-queue-transition";
import {
  NO_STUCK_LOAD_RETRIES,
  planStuckLoadRetry,
  STUCK_LOAD_RETRY_LIMIT,
} from "./use-stuck-load-recovery";
import { shouldSpeakTranslationAfter } from "./use-track-finish-handler";

jest.mock("expo-audio", () => ({
  setAudioModeAsync: jest.fn(async () => undefined),
  useAudioPlayer: jest.fn(),
  useAudioPlayerStatus: jest.fn(),
}));

jest.mock("@/lib/audio-lock-screen", () => ({
  activateLockScreenControls: jest.fn(),
  deactivateLockScreenControls: jest.fn(),
  ensureAndroidMediaNotificationPermission: jest.fn(async () => undefined),
}));

const ayah = (id: string) => buildAudioTrack({ id });

describe("hasTransitionSettled", () => {
  it("settles once the clock reset and the minimum hold elapsed", () => {
    expect(hasTransitionSettled(30, 0.2, 200)).toBe(true);
  });

  it("treats a hop from (near) zero as already reset", () => {
    expect(hasTransitionSettled(0.5, 0.6, 150)).toBe(true);
  });

  it("holds while the engine still reports the outgoing track's time", () => {
    expect(hasTransitionSettled(30, 29.8, 1000)).toBe(false);
  });

  it("holds for the minimum time even after a reset", () => {
    expect(hasTransitionSettled(30, 0, 149)).toBe(false);
  });
});

describe("useQueueTransition", () => {
  it("flags a hop and ends it via the safety timer", async () => {
    jest.useFakeTimers();
    try {
      const { result } = await renderHook(() => useQueueTransition());
      result.current.lastEngineTimeRef.current = 12;
      await act(async () => result.current.beginTransition());
      expect(result.current.isTransitioning).toBe(true);
      expect(result.current.transitionRef.current).toBe(true);
      expect(result.current.fromTimeRef.current).toBe(12);

      await act(async () => {
        jest.advanceTimersByTime(2500);
      });
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.transitionRef.current).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it("clears a hop immediately on clearTransition", async () => {
    const { result } = await renderHook(() => useQueueTransition());
    await act(async () => result.current.beginTransition());
    await act(async () => result.current.clearTransition());
    expect(result.current.isTransitioning).toBe(false);
  });
});

describe("rate / volume rules", () => {
  it("clamps volume into 0–1", () => {
    expect(clampVolume(-0.5)).toBe(0);
    expect(clampVolume(0.4)).toBe(0.4);
    expect(clampVolume(3)).toBe(1);
  });

  it("ignores the slider's own whole-percent rounding echo", () => {
    expect(isVolumeEcho(43, 0.4321)).toBe(true);
    expect(isVolumeEcho(50, 0.4321)).toBe(false);
  });

  it("does not treat a missing stored value as an echo", () => {
    expect(isVolumeEcho(Number.NaN, 1)).toBe(false);
  });
});

describe("pausedStateFromStatusEvent", () => {
  it("un-pauses when the player reports playing", () => {
    expect(pausedStateFromStatusEvent({ playing: true, isLoaded: true }, 3)).toBe(false);
  });

  it("pauses for a loaded idle source with a queue", () => {
    expect(pausedStateFromStatusEvent({ playing: false, isLoaded: true }, 1)).toBe(true);
  });

  it("leaves the state alone for a finish, an unloaded source or an empty queue", () => {
    expect(
      pausedStateFromStatusEvent({ playing: false, isLoaded: true, didJustFinish: true }, 2),
    ).toBeNull();
    expect(pausedStateFromStatusEvent({ playing: false, isLoaded: false }, 2)).toBeNull();
    expect(pausedStateFromStatusEvent({ playing: false, isLoaded: true }, 0)).toBeNull();
  });
});

describe("lock-screen sync", () => {
  const queue = [ayah("1:1"), ayah("1:2"), ayah("1:3")];
  const durations = { "1:1": 4, "1:2": 6, "1:3": 5 };

  it("positions the queue context at the track's start", () => {
    expect(lockScreenQueueContext(queue, 1, durations)).toEqual({
      queueIndex: 1,
      queueLength: 3,
      queuePosition: 4,
      queueDuration: 15,
    });
  });

  it("activates the controls once the notification permission resolves", async () => {
    const player = {} as Parameters<typeof syncLockScreenForTrack>[0];
    syncLockScreenForTrack(player, queue[2], 2, queue, durations);
    await act(async () => {
      await Promise.resolve();
    });
    expect(activateLockScreenControls).toHaveBeenCalledWith(
      player,
      queue[2],
      { queueIndex: 2, queueLength: 3, queuePosition: 10, queueDuration: 15 },
      "1:3",
    );
  });
});

describe("planStuckLoadRetry", () => {
  it("invalidates the cache on the first retry of a remote track", () => {
    expect(planStuckLoadRetry(NO_STUCK_LOAD_RETRIES, "a", "https://cdn.test/a.mp3")).toEqual({
      retries: { trackId: "a", count: 1 },
      reload: true,
      invalidateCache: true,
    });
  });

  it("does not invalidate a local or missing uri", () => {
    expect(planStuckLoadRetry(NO_STUCK_LOAD_RETRIES, "a", "file:///a.mp3").invalidateCache).toBe(
      false,
    );
    expect(planStuckLoadRetry(NO_STUCK_LOAD_RETRIES, "a", undefined).invalidateCache).toBe(false);
  });

  it("retries again without invalidating, then gives up past the limit", () => {
    const second = planStuckLoadRetry({ trackId: "a", count: 1 }, "a", "https://x/a.mp3");
    expect(second).toEqual({
      retries: { trackId: "a", count: 2 },
      reload: true,
      invalidateCache: false,
    });
    const past = planStuckLoadRetry(
      { trackId: "a", count: STUCK_LOAD_RETRY_LIMIT },
      "a",
      "https://x/a.mp3",
    );
    expect(past.reload).toBe(false);
    expect(past.retries.count).toBe(STUCK_LOAD_RETRY_LIMIT + 1);
  });

  it("restarts the count for a different track", () => {
    expect(planStuckLoadRetry({ trackId: "a", count: 5 }, "b", "https://x/b.mp3").retries).toEqual({
      trackId: "b",
      count: 1,
    });
  });
});

describe("looksLikeRefusedPlayback", () => {
  const idle = {
    hasCurrent: true,
    ttsTrackActive: false,
    userPaused: false,
    queueFinished: false,
    isSpeakingTranslation: false,
    isTransitioning: false,
    isLoaded: true,
    playing: false,
    isBuffering: false,
    didJustFinish: false,
  };

  it("flags a loaded, idle source that should be playing", () => {
    expect(looksLikeRefusedPlayback(idle)).toBe(true);
  });

  it.each([
    "ttsTrackActive",
    "userPaused",
    "queueFinished",
    "isSpeakingTranslation",
    "isTransitioning",
    "playing",
    "isBuffering",
    "didJustFinish",
  ] as const)("ignores the state when %s", (key) => {
    expect(looksLikeRefusedPlayback({ ...idle, [key]: true })).toBe(false);
  });

  it("ignores an unloaded source or no track", () => {
    expect(looksLikeRefusedPlayback({ ...idle, isLoaded: false })).toBe(false);
    expect(looksLikeRefusedPlayback({ ...idle, hasCurrent: false })).toBe(false);
  });
});

describe("hasReachedClipEnd", () => {
  it("ends within the tick tolerance before clipEnd", () => {
    expect(hasReachedClipEnd(3, 2.96)).toBe(true);
    expect(hasReachedClipEnd(3, 3.5)).toBe(true);
    expect(hasReachedClipEnd(3, 2.9)).toBe(false);
  });
});

describe("shouldSpeakTranslationAfter", () => {
  const withTts = buildAudioTrack({ id: "2:255", tts: { text: "Allah", lang: "en" } });

  it("speaks an ayah translation in 'after' mode", () => {
    expect(shouldSpeakTranslationAfter("after", withTts, false)).toBe(true);
  });

  it("never speaks on TV (no device TTS)", () => {
    expect(shouldSpeakTranslationAfter("after", withTts, true)).toBe(false);
  });

  it("skips when off, for non-ayah tracks, or without text", () => {
    expect(shouldSpeakTranslationAfter("off", withTts, false)).toBe(false);
    expect(
      shouldSpeakTranslationAfter(
        "after",
        buildAudioTrack({ id: "zikr-1", tts: { text: "x", lang: "en" } }),
        false,
      ),
    ).toBe(false);
    expect(
      shouldSpeakTranslationAfter(
        "after",
        buildAudioTrack({ id: "2:255", tts: { text: "  ", lang: "en" } }),
        false,
      ),
    ).toBe(false);
    expect(shouldSpeakTranslationAfter("after", buildTtsTrack({ id: "2:1" }), false)).toBe(false);
    expect(shouldSpeakTranslationAfter("after", undefined, false)).toBe(false);
  });
});
