import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AudioPlayer } from "expo-audio";

import { buildAudioTrack, buildTtsTrack } from "@/test-support/fixtures/audio";
import { usePlatform } from "@/test-support/platform";

const mockPreload = jest.fn<(source: { uri: string }) => Promise<void> | void>();
jest.mock("expo-audio", () => ({
  preload: (source: { uri: string }) => mockPreload(source),
}));

const mockCache = { enabled: true };
const mockPeekCached = jest.fn<(uri: string) => string | null>(() => null);
const mockPrefetch = jest.fn<(uri: string) => void>();
const mockResolveCached = jest.fn<(uri: string) => Promise<string>>(async (uri) => uri);
jest.mock("@/lib/audio-cache", () => ({
  isAudioLocalCacheEnabled: () => mockCache.enabled,
  peekCachedAudioUri: (uri: string) => mockPeekCached(uri),
  prefetchAudioUri: (uri: string) => mockPrefetch(uri),
  resolveCachedAudioUri: (uri: string) => mockResolveCached(uri),
}));

import {
  isLocalPlaybackUri,
  PREFETCH_AHEAD,
  preloadTrackUri,
  resolveTrackSource,
  waitForPlayerReady,
  warmUpcomingTrackUris,
} from "./audio-track-source";

beforeEach(() => {
  mockCache.enabled = true;
  mockPreload.mockReset();
  mockPeekCached.mockReset();
  mockPeekCached.mockReturnValue(null);
  mockPrefetch.mockReset();
  mockResolveCached.mockReset();
  mockResolveCached.mockImplementation(async (uri) => uri);
});

describe("isLocalPlaybackUri", () => {
  it.each([
    "file:///a.mp3",
    "blob:https://app/1",
    "content://media/1",
    "asset:/a.mp3",
    "/data/a.mp3",
  ])("treats %s as local", (uri) => {
    expect(isLocalPlaybackUri(uri)).toBe(true);
  });

  it("treats http(s) as remote", () => {
    expect(isLocalPlaybackUri("https://cdn.test/a.mp3")).toBe(false);
    expect(isLocalPlaybackUri("http://cdn.test/a.mp3")).toBe(false);
  });
});

describe("resolveTrackSource", () => {
  it("prefers a bundled asset", async () => {
    await expect(resolveTrackSource(buildAudioTrack({ source: 7 }))).resolves.toBe(7);
    expect(mockResolveCached).not.toHaveBeenCalled();
  });

  it("uses the cached copy on native", async () => {
    mockResolveCached.mockResolvedValue("file:///cache/a.mp3");
    await expect(resolveTrackSource(buildAudioTrack())).resolves.toEqual({
      uri: "file:///cache/a.mp3",
    });
  });

  it("falls back to the remote URL when the cache fails", async () => {
    mockResolveCached.mockRejectedValue(new Error("disk full"));
    const track = buildAudioTrack();
    await expect(resolveTrackSource(track)).resolves.toEqual({ uri: track.uri });
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("returns a session blob without resolving again", async () => {
      mockPeekCached.mockReturnValue("blob:https://app/1");
      await expect(resolveTrackSource(buildAudioTrack())).resolves.toEqual({
        uri: "blob:https://app/1",
      });
      expect(mockResolveCached).not.toHaveBeenCalled();
    });
  });
});

describe("preloadTrackUri", () => {
  it("swallows a rejected native preload", async () => {
    mockPreload.mockRejectedValue(new Error("network"));
    await expect(preloadTrackUri("https://cdn.test/a.mp3")).resolves.toBeUndefined();
    expect(mockPreload).toHaveBeenCalledWith({ uri: "https://cdn.test/a.mp3" });
  });

  it("handles the web build's void return and a throwing preload", async () => {
    mockPreload.mockReturnValue(undefined);
    await expect(preloadTrackUri("a")).resolves.toBeUndefined();
    mockPreload.mockImplementation(() => {
      throw new Error("boom");
    });
    await expect(preloadTrackUri("a")).resolves.toBeUndefined();
  });
});

describe("warmUpcomingTrackUris", () => {
  const tracks = Array.from({ length: 8 }, (_, i) => buildAudioTrack({ id: `t${i}` }));

  it("warms the current clip plus PREFETCH_AHEAD more", () => {
    warmUpcomingTrackUris(tracks, 2);
    expect(mockPrefetch.mock.calls.map(([uri]) => uri)).toEqual(
      tracks.slice(2, 2 + PREFETCH_AHEAD + 1).map((t) => t.uri),
    );
    expect(mockPreload).toHaveBeenCalledTimes(PREFETCH_AHEAD + 1);
  });

  it("skips bundled, TTS and uri-less tracks", () => {
    warmUpcomingTrackUris(
      [
        buildAudioTrack({ id: "bundled", source: 1 }),
        buildTtsTrack(),
        buildAudioTrack({ id: "empty", uri: "" }),
        buildAudioTrack({ id: "remote" }),
      ],
      0,
    );
    expect(mockPrefetch.mock.calls).toEqual([["https://cdn.test/remote.mp3"]]);
  });

  it("does nothing when local caching is off", () => {
    mockCache.enabled = false;
    warmUpcomingTrackUris(tracks, 0);
    expect(mockPrefetch).not.toHaveBeenCalled();
    expect(mockPreload).not.toHaveBeenCalled();
  });
});

describe("waitForPlayerReady", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const playerWith = (isLoaded: () => boolean) =>
    ({
      get isLoaded() {
        return isLoaded();
      },
    }) as unknown as AudioPlayer;

  it("resolves immediately for a loaded player", async () => {
    await expect(waitForPlayerReady(playerWith(() => true))).resolves.toBe(true);
  });

  it("polls until the player loads", async () => {
    let loaded = false;
    const pending = waitForPlayerReady(
      playerWith(() => loaded),
      1000,
    );
    await jest.advanceTimersByTimeAsync(100);
    loaded = true;
    await jest.advanceTimersByTimeAsync(25);
    await expect(pending).resolves.toBe(true);
  });

  it("gives up after the timeout", async () => {
    const pending = waitForPlayerReady(
      playerWith(() => false),
      100,
    );
    await jest.advanceTimersByTimeAsync(200);
    await expect(pending).resolves.toBe(false);
  });

  it("treats a throwing player as not ready", async () => {
    const pending = waitForPlayerReady(
      playerWith(() => {
        throw new Error("released");
      }),
      50,
    );
    await jest.advanceTimersByTimeAsync(100);
    await expect(pending).resolves.toBe(false);
  });
});
