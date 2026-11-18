import type { AudioPlayer } from "expo-audio";

import { applyVolume, supportsProgrammaticVolume } from "@/lib/audio-volume";
import {
  type BrowserOptions,
  DESKTOP_CHROME_UA,
  IPHONE_SAFARI_UA,
  installBrowser,
} from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

const buildPlayer = () => ({ volume: 0.5 }) as AudioPlayer;

describe("on native", () => {
  it("supports programmatic volume", () => {
    expect(supportsProgrammaticVolume()).toBe(true);
  });

  it.each([
    [0.3, 0.3],
    [1.7, 1],
    [-1, 0],
  ])("clamps volume %p → %p", (volume, expected) => {
    const player = buildPlayer();
    applyVolume(player, volume);
    expect(player.volume).toBe(expected);
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });
  let restore: () => void = () => {};
  afterEach(() => restore());

  it.each<[string, BrowserOptions, boolean]>([
    ["desktop Chrome", { userAgent: DESKTOP_CHROME_UA }, true],
    ["iPhone Safari", { userAgent: IPHONE_SAFARI_UA }, false],
    ["iPadOS desktop mode", { platform: "MacIntel", maxTouchPoints: 5 }, false],
    ["a Mac without touch", { platform: "MacIntel", maxTouchPoints: 0 }, true],
    ["UA client hints for iOS", { userAgentData: { platform: "iOS" } }, false],
  ])("%s → %p", (_label, browser, expected) => {
    restore = installBrowser(browser);
    expect(supportsProgrammaticVolume()).toBe(expected);
  });

  it("leaves the volume alone where the browser blocks it", () => {
    restore = installBrowser({ userAgent: IPHONE_SAFARI_UA });
    const player = buildPlayer();
    applyVolume(player, 1);
    expect(player.volume).toBe(0.5);
  });
});
