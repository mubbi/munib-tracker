import { describe, expect, it } from "@jest/globals";

import type { AudioTrack } from "@/providers/audio-player-provider";

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
