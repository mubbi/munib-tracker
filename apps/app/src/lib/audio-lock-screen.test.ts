import { buildLockScreenMetadata } from "@/lib/audio-lock-screen";

jest.mock("expo-audio", () => ({
  requestNotificationPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
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

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Image: {
    resolveAssetSource: () => ({ uri: "file:///icon.png" }),
  },
}));

describe("buildLockScreenMetadata", () => {
  it("maps title and subtitle to lock-screen fields", () => {
    const meta = buildLockScreenMetadata({
      title: "Evening Adhkar",
      subtitle: "Hisnul Muslim",
    });
    expect(meta.title).toBe("Evening Adhkar");
    expect(meta.artist).toBe("Hisnul Muslim");
    expect(meta.albumTitle).toBe("Now Playing");
    expect(meta.artworkUrl).toBe("file:///icon.png");
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
});
