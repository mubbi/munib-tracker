import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/providers/audio-player-provider", () => ({ AUDIO_SPEEDS: [0.5, 1, 1.5, 2] }));

import { formatTime, nextPlaybackRate, volumeIconForLevel } from "./player-format";

describe("formatTime", () => {
  it("formats M:SS under an hour", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65.9)).toBe("1:05");
    expect(formatTime(59 * 60 + 59)).toBe("59:59");
  });

  it("switches to H:MM:SS when the reference duration reaches an hour", () => {
    expect(formatTime(3_725, 3_725)).toBe("1:02:05");
    expect(formatTime(5, 3_600)).toBe("0:00:05");
  });

  it("shows zero for invalid positions", () => {
    expect(formatTime(Number.NaN)).toBe("0:00");
    expect(formatTime(-3, 120)).toBe("0:00");
    expect(formatTime(Number.POSITIVE_INFINITY, 4_000)).toBe("0:00:00");
  });
});

describe("nextPlaybackRate", () => {
  it("cycles through the speeds and wraps", () => {
    expect(nextPlaybackRate(0.5)).toBe(1);
    expect(nextPlaybackRate(1.5)).toBe(2);
    expect(nextPlaybackRate(2)).toBe(0.5);
  });

  it("starts from the first speed for an unknown rate", () => {
    expect(nextPlaybackRate(1.25)).toBe(0.5);
  });
});

describe("volumeIconForLevel", () => {
  it("picks muted / low / high glyphs", () => {
    expect(volumeIconForLevel(0)).toMatchObject({ android: "volume_off" });
    expect(volumeIconForLevel(0.3)).toMatchObject({ android: "volume_down" });
    expect(volumeIconForLevel(0.5)).toMatchObject({ android: "volume_up" });
  });
});
