import { describe, expect, it, jest } from "@jest/globals";

import { DB_KEYS } from "@/db/keys";
import type { AudioTrack } from "@/providers/audio-player-provider";
import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { buildAudioTrack, buildTtsTrack } from "@/test-support/fixtures/audio";

import {
  bitrateFromUri,
  getCachedTrackDuration,
  locateQueuePosition,
  queueDuration,
  queueDurationForProgress,
  queuePosition,
  queueStartBoundary,
} from "./audio-queue-timing";

const tracks: AudioTrack[] = [
  { id: "1:1", title: "Al-Fatihah", subtitle: "Ayah 1", uri: "a.mp3" },
  { id: "1:2", title: "Al-Fatihah", subtitle: "Ayah 2", uri: "b.mp3" },
  { id: "1:3", title: "Al-Fatihah", subtitle: "Ayah 3", uri: "c.mp3" },
];

const durations = { "1:1": 10, "1:2": 20, "1:3": 15 };

describe("queueDuration", () => {
  it("sums all track durations", () => {
    expect(queueDuration(tracks, durations)).toBe(45);
  });
});

describe("queueDurationForProgress", () => {
  it("uses live position when it exceeds the cached estimate for the active track", () => {
    expect(queueDurationForProgress(tracks, 0, 12, { "1:1": 10, "1:2": 20, "1:3": 15 })).toBe(47);
  });

  it("uses the cached duration when it exceeds the live position", () => {
    expect(queueDurationForProgress(tracks, 1, 5, durations)).toBe(45);
  });
});

describe("queuePosition", () => {
  it("adds completed tracks to the current position", () => {
    expect(queuePosition(tracks, 2, 5, durations)).toBe(35);
  });

  it("returns the current position on the first track", () => {
    expect(queuePosition(tracks, 0, 4, durations)).toBe(4);
  });
});

describe("queueStartBoundary", () => {
  it("sums durations of every prior track (ignoring live position)", () => {
    expect(queueStartBoundary(tracks, 2, durations)).toBe(30);
  });

  it("is zero for the first track", () => {
    expect(queueStartBoundary(tracks, 0, durations)).toBe(0);
  });
});

describe("locateQueuePosition", () => {
  it("finds the track and offset for a queue-wide seek", () => {
    expect(locateQueuePosition(tracks, 25, durations)).toEqual({ index: 1, offset: 15 });
  });

  it("clamps to the last track when seeking past the end", () => {
    expect(locateQueuePosition(tracks, 100, durations)).toEqual({ index: 2, offset: 15 });
  });
});

describe("bitrateFromUri", () => {
  it("parses kbps from everyayah reciter paths", () => {
    expect(bitrateFromUri("https://everyayah.com/data/Alafasy_128kbps/001001.mp3")).toBe(128_000);
    expect(
      bitrateFromUri("https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/001001.mp3"),
    ).toBe(192_000);
  });
});

describe("getCachedTrackDuration", () => {
  it("returns undefined when no estimate has been stored yet", () => {
    expect(
      getCachedTrackDuration("https://everyayah.com/data/Alafasy_128kbps/001001.mp3"),
    ).toBeUndefined();
  });
});

describe("empty and partial queues", () => {
  it("treats tracks without a cached duration as zero", () => {
    expect(queueDuration(tracks, {})).toBe(0);
    expect(queueDurationForProgress(tracks, 0, 3, {})).toBe(3);
    expect(queueStartBoundary(tracks, 2, { "1:2": 4 })).toBe(4);
    expect(queuePosition(tracks, 2, 1, { "1:1": 2 })).toBe(3);
  });

  it("tolerates an index past the end of the queue", () => {
    expect(queueStartBoundary(tracks, 5, durations)).toBe(45);
    expect(queuePosition(tracks, 5, 1, durations)).toBe(46);
  });

  it.each([
    ["an empty queue", [], 10, durations, { index: 0, offset: 0 }],
    ["a negative seek", tracks, -5, durations, { index: 0, offset: 0 }],
    ["an exact boundary", tracks, 10, durations, { index: 0, offset: 10 }],
    ["an unknown duration", tracks, 12, { "1:1": 10 }, { index: 1, offset: 2 }],
  ] as const)("locates %s", (_label, queue, seconds, known, expected) => {
    expect(locateQueuePosition([...queue], seconds, known)).toEqual(expected);
  });

  it("defaults to 128 kbps when the URI has no bitrate", () => {
    expect(bitrateFromUri("https://cdn.test/clip.mp3")).toBe(128_000);
  });
});

/**
 * The duration cache is module state hydrated once from AsyncStorage, so each
 * test loads a fresh copy (with its own in-memory AsyncStorage).
 */
async function setup(stored: Record<string, number> = {}) {
  let subject!: typeof import("./audio-queue-timing");
  let store!: typeof import("@/db/store");
  let storage!: { setItem: jest.Mock };
  jest.isolateModules(() => {
    storage = require("@react-native-async-storage/async-storage").default;
    store = require("@/db/store");
    subject = require("./audio-queue-timing");
  });
  await store.writeJSON(DB_KEYS.audioDurationCache, stored);
  return { ...subject, store, storage };
}

const CLIP = "https://everyayah.com/data/Alafasy_64kbps/001001.mp3";
/** 64 kbps → 8000 bytes per second. */
const headWithLength = (bytes: string) =>
  fakeResponse("", { headers: { "content-length": bytes } });

describe("estimateDurationFromUri", () => {
  it("ignores non-http URIs", async () => {
    const fetchMock = mockFetch();
    const { estimateDurationFromUri } = await setup();
    await expect(estimateDurationFromUri("file:///clip.mp3")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("estimates from Content-Length and the bitrate in the URI", async () => {
    const fetchMock = mockFetch(headWithLength("80000"));
    const { estimateDurationFromUri } = await setup();
    await expect(estimateDurationFromUri(CLIP)).resolves.toBe(10);
    expect(fetchMock).toHaveBeenCalledWith(CLIP, { method: "HEAD" });
  });

  it("remembers the estimate in memory and storage", async () => {
    mockFetch(headWithLength("80000"));
    const { estimateDurationFromUri, getCachedTrackDuration, store } = await setup();
    await estimateDurationFromUri(CLIP);
    await new Promise((resolve) => setImmediate(resolve));
    expect(getCachedTrackDuration(CLIP)).toBe(10);
    await expect(store.readJSON(DB_KEYS.audioDurationCache, {})).resolves.toEqual({ [CLIP]: 10 });
  });

  it("serves a persisted estimate without a HEAD request", async () => {
    const fetchMock = mockFetch();
    const { estimateDurationFromUri } = await setup({ [CLIP]: 7, "https://bad": -1 });
    await expect(estimateDurationFromUri(CLIP)).resolves.toBe(7);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips persisted entries that are not positive", async () => {
    const fetchMock = mockFetch(headWithLength("8000"));
    const { estimateDurationFromUri } = await setup({ [CLIP]: 0 });
    await expect(estimateDurationFromUri(CLIP)).resolves.toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["a non-OK response", fakeResponse("", { status: 404 })],
    ["a missing Content-Length", fakeResponse("")],
    ["a zero Content-Length", headWithLength("0")],
    ["a non-numeric Content-Length", headWithLength("lots")],
    ["a network error", new Error("offline")],
  ])("returns null for %s", async (_label, reply) => {
    mockFetch(reply);
    const { estimateDurationFromUri, getCachedTrackDuration } = await setup();
    await expect(estimateDurationFromUri(CLIP)).resolves.toBeNull();
    expect(getCachedTrackDuration(CLIP)).toBeUndefined();
  });

  it("keeps the in-memory estimate when persisting fails", async () => {
    mockFetch(headWithLength("80000"));
    const { estimateDurationFromUri, getCachedTrackDuration, store, storage } = await setup();
    storage.setItem.mockRejectedValueOnce(new Error("quota") as never);
    await estimateDurationFromUri(CLIP);
    await new Promise((resolve) => setImmediate(resolve));
    expect(storage.setItem).toHaveBeenCalled();
    expect(getCachedTrackDuration(CLIP)).toBe(10);
    await expect(store.readJSON(DB_KEYS.audioDurationCache, {})).resolves.toEqual({});
  });
});

describe("prefetchTrackDurations", () => {
  it("reports estimates for downloadable tracks only", async () => {
    mockFetch(headWithLength("16000"));
    const { prefetchTrackDurations } = await setup();
    const onDuration = jest.fn();
    await prefetchTrackDurations(
      [
        buildAudioTrack({ id: "a", uri: CLIP }),
        buildAudioTrack({ id: "bundled", source: 1 }),
        buildTtsTrack({ id: "tts" }),
        buildAudioTrack({ id: "no-uri", uri: "" }),
        buildAudioTrack({ id: "local", uri: "file:///x.mp3" }),
      ],
      onDuration,
    );
    expect(onDuration.mock.calls).toEqual([["a", 2]]);
  });

  it("estimates queues larger than one batch", async () => {
    mockFetch(headWithLength("8000"));
    const { prefetchTrackDurations } = await setup();
    const onDuration = jest.fn();
    const queue = Array.from({ length: 10 }, (_, i) =>
      buildAudioTrack({ id: `t${i}`, uri: `https://everyayah.com/data/R_64kbps/${i}.mp3` }),
    );
    await prefetchTrackDurations(queue, onDuration);
    expect(onDuration).toHaveBeenCalledTimes(10);
  });
});
