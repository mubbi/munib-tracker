import {
  clearAudioCache,
  clearAudioCacheInflight,
  getAudioCacheSize,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";

// Functional in-memory file store (overrides the empty default in jest.setup.ts).
jest.mock("expo-file-system/legacy", () => {
  const files = new Map<string, number>(); // local uri -> byte size
  const DIR = "file:///document/munib-audio/";
  const FILE_BYTES = 2048;
  return {
    __esModule: true,
    documentDirectory: "file:///document/",
    cacheDirectory: "file:///cache/",
    __reset: () => files.clear(),
    downloadAsync: jest.fn(async (_remote: string, local: string) => {
      files.set(local, FILE_BYTES);
      return { uri: local };
    }),
    getInfoAsync: jest.fn(async (uri: string) => {
      if (uri === DIR) return { exists: files.size > 0, isDirectory: true, uri };
      const size = files.get(uri);
      return size != null
        ? { exists: true, isDirectory: false, uri, size }
        : { exists: false, uri };
    }),
    makeDirectoryAsync: jest.fn(async () => undefined),
    readDirectoryAsync: jest.fn(async (dir: string) =>
      Array.from(files.keys())
        .filter((k) => k.startsWith(dir))
        .map((k) => k.slice(dir.length)),
    ),
    deleteAsync: jest.fn(async (uri: string) => {
      if (uri === DIR) files.clear();
      else files.delete(uri);
    }),
  };
});

const FS = jest.requireMock("expo-file-system/legacy") as {
  __reset: () => void;
  downloadAsync: jest.Mock;
};

const AYAH = "https://everyayah.com/data/Alafasy_128kbps/001001.mp3";
const DUA = "https://cdn.jsdelivr.net/gh/example/audio/dua.mp3";

beforeEach(() => {
  FS.__reset();
  clearAudioCacheInflight();
  FS.downloadAsync.mockClear();
});

describe("audio cache", () => {
  it("returns non-remote URIs untouched, without downloading", async () => {
    expect(await resolveCachedAudioUri("file:///bundled.mp3")).toBe("file:///bundled.mp3");
    expect(FS.downloadAsync).not.toHaveBeenCalled();
  });

  it("downloads a clip once, then replays it from the local file", async () => {
    const first = await resolveCachedAudioUri(AYAH);
    expect(first).toContain("munib-audio/");
    expect(first).not.toBe(AYAH);
    expect(FS.downloadAsync).toHaveBeenCalledTimes(1);

    const second = await resolveCachedAudioUri(AYAH);
    expect(second).toBe(first);
    // Cache hit — no second network download.
    expect(FS.downloadAsync).toHaveBeenCalledTimes(1);
  });

  it("dedupes concurrent downloads of the same clip", async () => {
    const [a, b] = await Promise.all([resolveCachedAudioUri(AYAH), resolveCachedAudioUri(AYAH)]);
    expect(a).toBe(b);
    expect(FS.downloadAsync).toHaveBeenCalledTimes(1);
  });

  it("reports total downloaded size and clears it", async () => {
    expect(await getAudioCacheSize()).toBe(0);

    await resolveCachedAudioUri(AYAH);
    await resolveCachedAudioUri(DUA);
    expect(await getAudioCacheSize()).toBe(4096); // 2 clips × 2048 bytes

    await clearAudioCache();
    expect(await getAudioCacheSize()).toBe(0);
  });
});
