import type { AudioPlayer } from "expo-audio";

import { applyPlaybackRate } from "@/lib/audio-playback-rate";

describe("applyPlaybackRate", () => {
  it("enables pitch correction before changing the rate", () => {
    const player = { shouldCorrectPitch: false, setPlaybackRate: jest.fn() };
    applyPlaybackRate(player as unknown as AudioPlayer, 1.5);
    expect(player.shouldCorrectPitch).toBe(true);
    expect(player.setPlaybackRate).toHaveBeenCalledWith(1.5, "high");
  });
});
