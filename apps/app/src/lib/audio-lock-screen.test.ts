import type { AudioPlayer } from "expo-audio";
import { Image } from "react-native";

import {
  activateLockScreenControls,
  buildLockScreenMetadata,
  buildLockScreenOptions,
  deactivateLockScreenControls,
  updateLockScreenControls,
} from "@/lib/audio-lock-screen";
import { PLAYER_SEEK_STEP_SECONDS } from "@/lib/audio-seek-step";
import { usePlatform } from "@/test-support/platform";

// Shared across module registries: the subject is reloaded per permission test.
const mockRequestNotificationPermissionsAsync = jest.fn();

jest.mock("expo-audio", () => ({
  requestNotificationPermissionsAsync: mockRequestNotificationPermissionsAsync,
}));

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: {
    t: (key: string, opts?: { current?: number; total?: number }) => {
      if (key === "common.appName") return "Munib Tracker";
      if (key === "player.nowPlaying") return "Now Playing";
      if (key === "player.trackOf" && opts) {
        return `Track ${opts.current} of ${opts.total}`;
      }
      return key;
    },
  },
}));

// The bundled icon resolves to a file URI the lock-screen APIs can load.
jest
  .spyOn(Image, "resolveAssetSource")
  .mockReturnValue({ uri: "file:///icon.png", width: 1024, height: 1024, scale: 1 });

describe("buildLockScreenMetadata", () => {
  it("maps title and subtitle, with the app name on the album line for one track", () => {
    const meta = buildLockScreenMetadata({
      title: "Evening Adhkar",
      subtitle: "Hisnul Muslim",
    });
    expect(meta.title).toBe("Evening Adhkar");
    expect(meta.artist).toBe("Hisnul Muslim");
    expect(meta.albumTitle).toBe("Munib Tracker");
    expect(meta.artworkUrl).toBe("file:///icon.png");
  });

  it('never repeats the OS "Now Playing" label', () => {
    const single = buildLockScreenMetadata({ title: "Dua" });
    const queued = buildLockScreenMetadata({ title: "Dua" }, { queueIndex: 0, queueLength: 2 });
    expect(single.albumTitle).not.toBe("Now Playing");
    expect(queued.albumTitle).not.toBe("Now Playing");
  });

  it("falls back to app name when subtitle is missing", () => {
    const meta = buildLockScreenMetadata({ title: "Al-Fatiha" });
    expect(meta.artist).toBe("Munib Tracker");
  });

  it("shows queue position in album title for multi-track queues", () => {
    const meta = buildLockScreenMetadata(
      { title: "Ayah 1", subtitle: "Al-Baqarah" },
      { queueIndex: 2, queueLength: 5 },
    );
    expect(meta.albumTitle).toBe("Track 3 of 5");
  });

  it("uses the playlist name when there is no subtitle", () => {
    expect(buildLockScreenMetadata({ title: "x", playlistPrimary: " Juz 1 " }).artist).toBe(
      "Juz 1",
    );
  });
});

describe("buildLockScreenMetadata for reciter tracks", () => {
  it("shows the reciter as artist and the ayah with its queue position as album", () => {
    const meta = buildLockScreenMetadata(
      { title: "Al-Fatihah", subtitle: "Ayah 2", lockScreenArtist: "Mishary Alafasy" },
      { queueIndex: 1, queueLength: 7 },
    );
    expect(meta).toMatchObject({
      title: "Al-Fatihah",
      artist: "Mishary Alafasy",
      albumTitle: "Ayah 2 · Track 2 of 7",
    });
  });

  it("shows only the ayah for a single reciter track", () => {
    const meta = buildLockScreenMetadata({
      title: "Al-Fatihah",
      subtitle: "Ayah 2",
      lockScreenArtist: "Mishary Alafasy",
    });
    expect(meta.albumTitle).toBe("Ayah 2");
  });
});

describe("buildLockScreenOptions", () => {
  it("uses the in-app skip interval for the lock-screen skip buttons", () => {
    expect(buildLockScreenOptions(true)).toEqual({
      showSeekForward: true,
      showSeekBackward: true,
      seekForwardIntervalSeconds: PLAYER_SEEK_STEP_SECONDS,
      seekBackwardIntervalSeconds: PLAYER_SEEK_STEP_SECONDS,
    });
  });

  it("hides skip buttons for a single track and never enables native next/previous", () => {
    const options = buildLockScreenOptions(false);
    expect(options.showSeekForward).toBe(false);
    expect(options.showSeekBackward).toBe(false);
    expect(options.showNextTrack).toBeUndefined();
    expect(options.showPreviousTrack).toBeUndefined();
  });
});

/** A fake expo-audio player recording lock-screen calls. */
function buildPlayer(overrides: Partial<Record<string, jest.Mock>> = {}) {
  return {
    setActiveForLockScreen: jest.fn(),
    updateLockScreenMetadata: jest.fn(),
    clearLockScreenControls: jest.fn(),
    ...overrides,
  } as unknown as AudioPlayer & Record<string, jest.Mock>;
}

const throwing = () =>
  jest.fn(() => {
    throw new Error("native");
  });

describe("lock-screen controls on native", () => {
  it("activates Qur'an controls with seek buttons for a queue", () => {
    const player = buildPlayer();
    activateLockScreenControls(
      player,
      { title: "Al-Baqarah", subtitle: "Ayah 3", lockScreenArtist: "Al-Husary" },
      { queueIndex: 2, queueLength: 5, queueDuration: 100 },
    );
    expect(player.setActiveForLockScreen).toHaveBeenCalledWith(
      true,
      expect.objectContaining({
        title: "Al-Baqarah",
        artist: "Al-Husary",
        albumTitle: "Ayah 3 · Track 3 of 5",
      }),
      buildLockScreenOptions(true),
    );
  });

  it("activates per-track controls without seek buttons for a single track", () => {
    const player = buildPlayer();
    activateLockScreenControls(player, { title: "Dua" }, { queueIndex: 0, queueLength: 1 });
    expect(player.setActiveForLockScreen).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ title: "Dua", albumTitle: "Munib Tracker" }),
      buildLockScreenOptions(false),
    );
  });

  it("swallows activation errors", () => {
    const player = buildPlayer({ setActiveForLockScreen: throwing() });
    expect(() =>
      activateLockScreenControls(player, { title: "x" }, { queueIndex: 0, queueLength: 1 }),
    ).not.toThrow();
  });

  it("updates metadata with the new queue position", () => {
    const player = buildPlayer();
    updateLockScreenControls(
      player,
      { title: "t" },
      { queueIndex: 1, queueLength: 3, queueDuration: 10 },
    );
    expect(player.updateLockScreenMetadata).toHaveBeenCalledWith(
      expect.objectContaining({ albumTitle: "Track 2 of 3" }),
    );
  });

  it("swallows update errors", () => {
    const player = buildPlayer({ updateLockScreenMetadata: throwing() });
    expect(() =>
      updateLockScreenControls(player, { title: "x" }, { queueIndex: 0, queueLength: 1 }),
    ).not.toThrow();
  });

  it("deactivates controls", () => {
    const player = buildPlayer();
    deactivateLockScreenControls(player);
    expect(player.setActiveForLockScreen).toHaveBeenCalledWith(false);
    expect(player.clearLockScreenControls).not.toHaveBeenCalled();
  });

  it("clears controls when deactivation throws, ignoring a second failure", () => {
    const player = buildPlayer({
      setActiveForLockScreen: throwing(),
      clearLockScreenControls: throwing(),
    });
    expect(() => deactivateLockScreenControls(player)).not.toThrow();
    expect(player.clearLockScreenControls).toHaveBeenCalled();
  });
});

describe.each([
  ["web", { OS: "web" as const }],
  ["TV", { isTV: true }],
])("lock-screen controls on %s", (_label, platform) => {
  usePlatform(platform);

  it("never touches the player", () => {
    const player = buildPlayer();
    const queue = { queueIndex: 0, queueLength: 2 };
    activateLockScreenControls(player, { title: "x" }, queue);
    updateLockScreenControls(player, { title: "x" }, queue);
    deactivateLockScreenControls(player);
    expect(player.setActiveForLockScreen).not.toHaveBeenCalled();
    expect(player.updateLockScreenMetadata).not.toHaveBeenCalled();
  });
});

const mockPermissions = {
  readNotificationPermissionUiState: jest.fn(),
  requestNotificationPermission: jest.fn(),
};
jest.mock("@/lib/notifications/permissions", () => mockPermissions);

describe("ensureAndroidMediaNotificationPermission", () => {
  let restorePlatform: () => void = () => {};
  afterEach(() => restorePlatform());

  /** Fresh module (the "already requested" flag is module state) on the given platform. */
  function setup(os: "android" | "ios", { isTV = false, status = "undetermined" } = {}) {
    jest.resetModules();
    restorePlatform = require("@/test-support/platform").setPlatform({ OS: os, isTV });
    mockPermissions.readNotificationPermissionUiState.mockReset().mockResolvedValue(status);
    mockPermissions.requestNotificationPermission.mockReset().mockResolvedValue({ granted: true });
    const fallback = mockRequestNotificationPermissionsAsync.mockReset();
    const ensure = require("@/lib/audio-lock-screen")
      .ensureAndroidMediaNotificationPermission as () => Promise<void>;
    return { ensure, prompt: mockPermissions.requestNotificationPermission, fallback };
  }

  it("prompts once on Android while permission is undetermined", async () => {
    const { ensure, prompt } = setup("android");
    await ensure();
    await ensure();
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it.each(["granted", "denied"])("never prompts once the user has %s", async (status) => {
    const { ensure, prompt } = setup("android", { status });
    await ensure();
    expect(prompt).not.toHaveBeenCalled();
  });

  it("falls back to expo-audio when the notifications module fails", async () => {
    const { ensure, fallback } = setup("android");
    mockPermissions.readNotificationPermissionUiState.mockRejectedValue(new Error("no module"));
    await ensure();
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it("swallows a failing fallback request", async () => {
    const { ensure, fallback } = setup("android");
    mockPermissions.readNotificationPermissionUiState.mockRejectedValue(new Error("no module"));
    fallback.mockRejectedValueOnce(new Error("no activity"));
    await expect(ensure()).resolves.toBeUndefined();
  });

  it.each([
    ["iOS", "ios", false],
    ["Android TV", "android", true],
  ] as const)("does nothing on %s", async (_label, os, isTV) => {
    const { ensure, prompt, fallback } = setup(os, { isTV });
    await ensure();
    expect(prompt).not.toHaveBeenCalled();
    expect(fallback).not.toHaveBeenCalled();
  });
});
