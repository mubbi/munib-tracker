import { describe, expect, it } from "@jest/globals";

import type { AudioTrack } from "@/providers/audio-player-types";
import { buildAudioTrack, buildTtsTrack } from "@/test-support/fixtures/audio";

import {
  derivePlayerIsPlaying,
  followIndexAfterSwap,
  initialQueueDurations,
  isQuranAyahTrack,
  mergeTrackDuration,
  nextIndexAfterFinish,
  nextLoopMode,
  nextQueueIndex,
  previousQueueIndex,
  smoothQueueTimeline,
  willAutoAdvanceQueue,
} from "./audio-player-queue";

const ayah = buildAudioTrack({ id: "1:2" });
const adhkar = buildAudioTrack({ id: "zikr-3" });

describe("nextLoopMode", () => {
  it("cycles off → all → one → off", () => {
    expect(nextLoopMode("off")).toBe("all");
    expect(nextLoopMode("all")).toBe("one");
    expect(nextLoopMode("one")).toBe("off");
  });
});

describe("isQuranAyahTrack", () => {
  it("matches surah:ayah ids only", () => {
    expect(isQuranAyahTrack(ayah)).toBe(true);
    expect(isQuranAyahTrack(adhkar)).toBe(false);
    expect(isQuranAyahTrack(buildAudioTrack({ id: "" }))).toBe(false);
    expect(isQuranAyahTrack(null)).toBe(false);
    expect(isQuranAyahTrack(undefined)).toBe(false);
  });
});

describe("nextIndexAfterFinish", () => {
  const base = {
    queueLength: 3,
    repeatPlan: { mode: "off" } as const,
    loopMode: "off" as const,
    finishingTrack: ayah,
  };

  it("advances to the next track, and stops after the last", () => {
    expect(nextIndexAfterFinish({ ...base, index: 0 })).toEqual({
      nextIndex: 1,
      consumedLoopOne: false,
    });
    expect(nextIndexAfterFinish({ ...base, index: 2 })).toEqual({
      nextIndex: null,
      consumedLoopOne: false,
    });
  });

  it("wraps to the start when repeating all", () => {
    expect(nextIndexAfterFinish({ ...base, index: 2, loopMode: "all" }).nextIndex).toBe(0);
  });

  it("replays the same track once and reports the loop-one as consumed", () => {
    expect(nextIndexAfterFinish({ ...base, index: 1, loopMode: "one" })).toEqual({
      nextIndex: 1,
      consumedLoopOne: true,
    });
  });

  it("follows the Qur'an repeat plan for ayah tracks before the loop mode", () => {
    expect(
      nextIndexAfterFinish({
        ...base,
        index: 1,
        loopMode: "one",
        repeatPlan: { mode: "verse" },
      }),
    ).toEqual({ nextIndex: 1, consumedLoopOne: false });
    expect(
      nextIndexAfterFinish({ ...base, index: 2, repeatPlan: { mode: "surah" } }).nextIndex,
    ).toBe(0);
  });

  it("ignores the Qur'an repeat plan for non-ayah queues", () => {
    expect(
      nextIndexAfterFinish({
        ...base,
        index: 2,
        repeatPlan: { mode: "surah" },
        finishingTrack: adhkar,
      }).nextIndex,
    ).toBeNull();
  });

  it("handles an empty queue", () => {
    expect(nextIndexAfterFinish({ ...base, index: 0, queueLength: 0 }).nextIndex).toBe(0);
  });
});

describe("nextQueueIndex / previousQueueIndex", () => {
  it("steps within the queue", () => {
    expect(nextQueueIndex(0, 3, "off")).toBe(1);
    expect(previousQueueIndex(2, 3, "off")).toBe(1);
  });

  it("stays put at the ends unless repeating all", () => {
    expect(nextQueueIndex(2, 3, "off")).toBeNull();
    expect(nextQueueIndex(2, 3, "one")).toBeNull();
    expect(previousQueueIndex(0, 3, "off")).toBeNull();
    expect(nextQueueIndex(2, 3, "all")).toBe(0);
    expect(previousQueueIndex(0, 3, "all")).toBe(2);
  });

  it("never wraps an empty queue", () => {
    expect(nextQueueIndex(0, 0, "all")).toBeNull();
    expect(previousQueueIndex(0, 0, "all")).toBeNull();
  });
});

describe("followIndexAfterSwap", () => {
  it("stages the following track mid-queue", () => {
    expect(followIndexAfterSwap(0, 3, "off", { mode: "off" })).toBe(1);
  });

  it("stages the queue start at the end when the queue loops", () => {
    expect(followIndexAfterSwap(2, 3, "all", { mode: "off" })).toBe(0);
    expect(followIndexAfterSwap(2, 3, "off", { mode: "surah" })).toBe(0);
  });

  it("points past the end (nothing to stage) otherwise", () => {
    expect(followIndexAfterSwap(2, 3, "off", { mode: "verse" })).toBe(3);
  });
});

describe("mergeTrackDuration", () => {
  it("adds or replaces a duration", () => {
    expect(mergeTrackDuration({}, "a", 10)).toEqual({ a: 10 });
    expect(mergeTrackDuration({ a: 10 }, "a", 12)).toEqual({ a: 12 });
  });

  it("keeps the same map for sub-quarter-second jitter", () => {
    const prev = { a: 10 };
    expect(mergeTrackDuration(prev, "a", 10.2)).toBe(prev);
    expect(mergeTrackDuration(prev, "a", 10.25)).not.toBe(prev);
  });
});

describe("willAutoAdvanceQueue", () => {
  const base = {
    didJustFinish: true,
    isSpeakingTranslation: false,
    queueLength: 3,
    index: 0,
    loopMode: "off" as const,
    repeatPlan: { mode: "off" } as const,
  };

  it("is true when a finished track has a successor", () => {
    expect(willAutoAdvanceQueue(base)).toBe(true);
  });

  it("is false while nothing finished", () => {
    expect(willAutoAdvanceQueue({ ...base, didJustFinish: false })).toBe(false);
  });

  it("is false at the last track unless looping, repeating or speaking", () => {
    const last = { ...base, index: 2 };
    expect(willAutoAdvanceQueue(last)).toBe(false);
    expect(willAutoAdvanceQueue({ ...last, loopMode: "one" })).toBe(true);
    expect(willAutoAdvanceQueue({ ...last, loopMode: "all" })).toBe(true);
    expect(willAutoAdvanceQueue({ ...last, repeatPlan: { mode: "verse" } })).toBe(true);
    expect(
      willAutoAdvanceQueue({ ...last, didJustFinish: false, isSpeakingTranslation: true }),
    ).toBe(true);
  });

  it("is false for an empty queue", () => {
    expect(willAutoAdvanceQueue({ ...base, queueLength: 0, loopMode: "all" })).toBe(false);
  });
});

describe("derivePlayerIsPlaying", () => {
  const base = {
    ttsTrackActive: false,
    hasCurrent: true,
    userPaused: false,
    queueFinished: false,
    statusPlaying: false,
    isQueueSessionActive: false,
    isTransitioning: false,
    willAutoAdvance: false,
  };

  it("TTS tracks play unless paused or finished", () => {
    expect(derivePlayerIsPlaying({ ...base, ttsTrackActive: true })).toBe(true);
    expect(derivePlayerIsPlaying({ ...base, ttsTrackActive: true, userPaused: true })).toBe(false);
    expect(derivePlayerIsPlaying({ ...base, ttsTrackActive: true, queueFinished: true })).toBe(
      false,
    );
    expect(derivePlayerIsPlaying({ ...base, ttsTrackActive: true, hasCurrent: false })).toBe(false);
  });

  it("a user pause follows the engine", () => {
    expect(derivePlayerIsPlaying({ ...base, userPaused: true, isQueueSessionActive: true })).toBe(
      false,
    );
    expect(derivePlayerIsPlaying({ ...base, userPaused: true, statusPlaying: true })).toBe(true);
  });

  it("an active queue session shows playing across gaps", () => {
    expect(derivePlayerIsPlaying({ ...base, isQueueSessionActive: true })).toBe(true);
  });

  it("otherwise the engine, a hand-off or a pending auto-advance", () => {
    expect(derivePlayerIsPlaying(base)).toBe(false);
    expect(derivePlayerIsPlaying({ ...base, statusPlaying: true })).toBe(true);
    expect(derivePlayerIsPlaying({ ...base, isTransitioning: true })).toBe(true);
    expect(derivePlayerIsPlaying({ ...base, willAutoAdvance: true })).toBe(true);
  });
});

describe("smoothQueueTimeline", () => {
  const queue: AudioTrack[] = [
    buildAudioTrack({ id: "1:1" }),
    buildAudioTrack({ id: "1:2" }),
    buildAudioTrack({ id: "1:3" }),
  ];
  const trackDurations = { "1:1": 10, "1:2": 20, "1:3": 15 };

  it("follows the computed clock when not holding, and remembers it", () => {
    expect(
      smoothQueueTimeline({
        hold: false,
        held: { position: 99, duration: 99 },
        queue,
        index: 1,
        trackDurations,
        computedPosition: 15,
        computedDuration: 45,
      }),
    ).toEqual({
      held: { position: 15, duration: 45 },
      position: 15,
      duration: 45,
      progress: 15 / 45,
    });
  });

  it("clamps a negative computed duration in the held value", () => {
    const result = smoothQueueTimeline({
      hold: false,
      held: { position: 0, duration: 0 },
      queue,
      index: 0,
      trackDurations,
      computedPosition: 0,
      computedDuration: -1,
    });
    expect(result.held.duration).toBe(0);
    expect(result.duration).toBe(-1);
    expect(result.progress).toBe(0);
  });

  it("holds at the incoming track's start boundary during a hand-off", () => {
    // Stale engine clock reports the outgoing track's end (computed 28 s).
    const result = smoothQueueTimeline({
      hold: true,
      held: { position: 9.9, duration: 45 },
      queue,
      index: 1,
      trackDurations,
      computedPosition: 28,
      computedDuration: 48,
    });
    expect(result.position).toBe(10);
    expect(result.duration).toBe(45);
    expect(result.held).toEqual({ position: 10, duration: 45 });
    expect(result.progress).toBeCloseTo(10 / 45);
  });

  it("never moves the held position backwards while holding", () => {
    const result = smoothQueueTimeline({
      hold: true,
      held: { position: 12, duration: 50 },
      queue,
      index: 1,
      trackDurations,
      computedPosition: 0,
      computedDuration: 0,
    });
    expect(result.held).toEqual({ position: 12, duration: 50 });
    expect(result.position).toBe(12);
    expect(result.duration).toBe(50);
  });

  it("falls back to the computed duration while holding with nothing known", () => {
    const result = smoothQueueTimeline({
      hold: true,
      held: { position: 0, duration: 0 },
      queue,
      index: 0,
      trackDurations: {},
      computedPosition: 3,
      computedDuration: 7,
    });
    expect(result.held).toEqual({ position: 0, duration: 0 });
    expect(result.duration).toBe(7);
    expect(result.position).toBe(0);
    expect(result.progress).toBe(0);
  });
});

describe("initialQueueDurations", () => {
  it("estimates TTS tracks at the current rate and skips uncached file tracks", () => {
    const speech = buildTtsTrack({ id: "speech" });
    const durations = initialQueueDurations([speech, buildAudioTrack({ id: "never-seen" })], 1);
    expect(Object.keys(durations)).toEqual(["speech"]);
    expect(durations.speech).toBeGreaterThan(0);
  });

  it("shortens TTS estimates at a faster rate", () => {
    const speech = buildTtsTrack({ id: "speech" });
    const slow = initialQueueDurations([speech], 1).speech;
    const fast = initialQueueDurations([speech], 2).speech;
    expect(fast).toBeLessThan(slow);
  });
});
