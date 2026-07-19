import { Platform } from "react-native";
import {
  clearAudioCache,
  clearAudioCacheInflight,
  getAudioCacheInfo,
  getAudioCacheSize,
  isAudioLocalCacheEnabled,
  peekCachedAudioUri,
  peekNativeCachedAudioUri,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";

const mockPrefs = { cacheAudioLocally: true };

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: () => ({ prefs: mockPrefs }),
  },
}));

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
    __set: (uri: string, size: number) => {
      files.set(uri, size);
    },
    downloadAsync: jest.fn(async (_remote: string, local: string) => {
      files.set(local, FILE_BYTES);
      return { uri: local, status: 200 };
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
    // Plenty of headroom by default so caching proceeds; tests override to
    // simulate a nearly-full device.
    getFreeDiskStorageAsync: jest.fn(async () => 10 * 1024 * 1024 * 1024),
  };
});

const FS = jest.requireMock("expo-file-system/legacy") as {
  __reset: () => void;
  __set: (uri: string, size: number) => void;
  downloadAsync: jest.Mock;
  deleteAsync: jest.Mock;
  getFreeDiskStorageAsync: jest.Mock;
};

const AYAH = "https://everyayah.com/data/Alafasy_128kbps/001001.mp3";
const DUA = "https://cdn.jsdelivr.net/gh/example/audio/dua.mp3";

beforeEach(() => {
  FS.__reset();
  clearAudioCacheInflight();
  FS.downloadAsync.mockClear();
  FS.deleteAsync.mockClear();
  mockPrefs.cacheAudioLocally = true;
  // Restore the default "plenty of room" implementation (tests override per-case).
  FS.getFreeDiskStorageAsync.mockReset();
  FS.getFreeDiskStorageAsync.mockResolvedValue(10 * 1024 * 1024 * 1024);
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

  it("streams instead of caching when the user disabled local audio storage", async () => {
    mockPrefs.cacheAudioLocally = false;
    expect(isAudioLocalCacheEnabled()).toBe(false);

    const resolved = await resolveCachedAudioUri(AYAH);
    expect(resolved).toBe(AYAH);
    expect(FS.downloadAsync).not.toHaveBeenCalled();
  });

  it("streams instead of caching when the device is low on disk", async () => {
    // Only 10 MB free — below the 250 MB safety threshold.
    FS.getFreeDiskStorageAsync.mockResolvedValueOnce(10 * 1024 * 1024);

    const resolved = await resolveCachedAudioUri(AYAH);
    // Falls back to the remote URL (streamed), nothing written to disk.
    expect(resolved).toBe(AYAH);
    expect(FS.downloadAsync).not.toHaveBeenCalled();
  });

  it("still serves an already-cached clip even when disk is low", async () => {
    // Cache it while there's room.
    const cached = await resolveCachedAudioUri(AYAH);
    expect(cached).toContain("munib-audio/");
    clearAudioCacheInflight(); // reset the free-disk reading

    // Now the device is full — an existing file is still returned from disk.
    FS.getFreeDiskStorageAsync.mockResolvedValue(1 * 1024 * 1024);
    const again = await resolveCachedAudioUri(AYAH);
    expect(again).toBe(cached);
  });

  it("reports total downloaded size and clears it", async () => {
    expect(await getAudioCacheSize()).toBe(0);

    await resolveCachedAudioUri(AYAH);
    await resolveCachedAudioUri(DUA);
    expect(await getAudioCacheSize()).toBe(4096); // 2 clips × 2048 bytes

    await clearAudioCache();
    expect(await getAudioCacheSize()).toBe(0);
  });

  it("uses a short hashed filename for long adhan CDN URLs (NAME_MAX-safe)", async () => {
    const adhan =
      "https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/" +
      encodeURIComponent(
        "Adhan_Al_Haram_Al_Madani_-_Al_Madinah_1_(أذان_الحرم_المدني_-_المدينة_المنورة).mp3",
      );
    // Previous encodeURIComponent scheme produced 400+ char filenames.
    expect(encodeURIComponent(adhan).replace(/%/g, "_").length).toBeGreaterThan(255);

    const cached = await resolveCachedAudioUri(adhan);
    const fileName = cached.split("/").pop() ?? "";
    expect(cached).toContain("munib-audio/");
    expect(fileName.length).toBeLessThanOrEqual(255);
    expect(fileName).toMatch(/^[0-9a-f]{16}\.mp3$/);
    expect(FS.downloadAsync).toHaveBeenCalledWith(adhan, cached);
  });

  it("peeks a native cached file without starting a download", async () => {
    expect(await peekNativeCachedAudioUri(AYAH)).toBeNull();
    const cached = await resolveCachedAudioUri(AYAH);
    FS.downloadAsync.mockClear();

    expect(await peekNativeCachedAudioUri(AYAH)).toBe(cached);
    expect(FS.downloadAsync).not.toHaveBeenCalled();
  });

  it("deletes an empty cache entry and re-downloads", async () => {
    const cached = await resolveCachedAudioUri(AYAH);
    FS.__set(cached, 0); // simulate a truncated / failed prior write
    FS.downloadAsync.mockClear();
    clearAudioCacheInflight();

    const again = await resolveCachedAudioUri(AYAH);
    expect(again).toBe(cached);
    expect(FS.deleteAsync).toHaveBeenCalledWith(cached, { idempotent: true });
    expect(FS.downloadAsync).toHaveBeenCalledTimes(1);
  });
});

// ── Web: Cache Storage + blob URLs ───────────────────────────────────────────

const CLIP_BODY = "x".repeat(1500);

class FakeResponse {
  ok = true;
  type: "basic" | "opaque";
  private readonly body: string;
  headers: { get: (key: string) => string | null };
  constructor(body: string, opts?: { type?: "basic" | "opaque" }) {
    this.body = body;
    this.type = opts?.type ?? "basic";
    this.headers = {
      get: (key) => (key.toLowerCase() === "content-length" ? String(body.length) : null),
    };
  }
  clone(): FakeResponse {
    const clone = new FakeResponse(this.body, { type: this.type });
    clone.ok = this.ok;
    return clone;
  }
  async blob(): Promise<{ size: number }> {
    return { size: this.body.length };
  }
  async arrayBuffer(): Promise<ArrayBuffer> {
    return new ArrayBuffer(this.body.length);
  }
}

class FakeCache {
  store = new Map<string, FakeResponse>();
  async match(req: string | { url: string }): Promise<FakeResponse | undefined> {
    return this.store.get(typeof req === "string" ? req : req.url);
  }
  async put(req: string | { url: string }, res: FakeResponse): Promise<void> {
    this.store.set(typeof req === "string" ? req : req.url, res);
  }
  async keys(): Promise<{ url: string }[]> {
    return Array.from(this.store.keys()).map((url) => ({ url }));
  }
}

describe("audio cache (web)", () => {
  const originalOS = Platform.OS;
  let cache: FakeCache;
  let fetchMock: jest.Mock;
  let objectUrlCounter: number;

  beforeEach(async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test-time platform override.
    (Platform as any).OS = "web";
    mockPrefs.cacheAudioLocally = true;
    cache = new FakeCache();
    objectUrlCounter = 0;
    fetchMock = jest.fn(async () => new FakeResponse(CLIP_BODY));

    (globalThis as unknown as { caches: unknown }).caches = {
      open: async () => cache,
      delete: async () => {
        cache = new FakeCache();
        return true;
      },
    };
    (globalThis as unknown as { fetch: unknown }).fetch = fetchMock;
    URL.createObjectURL = jest.fn(() => `blob:mock-${objectUrlCounter++}`);
    URL.revokeObjectURL = jest.fn();

    await clearAudioCache();
    fetchMock.mockClear();
    (URL.createObjectURL as jest.Mock).mockClear();
  });

  afterEach(() => {
    // biome-ignore lint/suspicious/noExplicitAny: restore platform.
    (Platform as any).OS = originalOS;
    (globalThis as unknown as { caches?: unknown }).caches = undefined;
    (globalThis as unknown as { fetch?: unknown }).fetch = undefined;
  });

  it("resolves a clip to a blob URL, downloading it only once", async () => {
    const first = await resolveCachedAudioUri(AYAH);
    expect(first).toMatch(/^blob:mock-/);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Replay: served from the in-memory object URL — no second network call.
    const second = await resolveCachedAudioUri(AYAH);
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("peeks a resolved clip synchronously for gesture-safe replays", async () => {
    expect(peekCachedAudioUri(AYAH)).toBeNull();
    const resolved = await resolveCachedAudioUri(AYAH);
    expect(peekCachedAudioUri(AYAH)).toBe(resolved);
  });

  it("reuses a Cache Storage hit without re-fetching (persists across reloads)", async () => {
    // Bucket populated in a prior session; no in-memory object URL yet (reload).
    cache.store.set(AYAH, new FakeResponse(CLIP_BODY));
    expect(peekCachedAudioUri(AYAH)).toBeNull();

    const resolved = await resolveCachedAudioUri(AYAH);
    expect(resolved).toMatch(/^blob:mock-/);
    // Served from the persisted cache — no network download at all.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-fetches an opaque cached body as CORS so it yields a playable blob", async () => {
    cache.store.set(AYAH, new FakeResponse(CLIP_BODY, { type: "opaque" }));

    const resolved = await resolveCachedAudioUri(AYAH);
    expect(resolved).toMatch(/^blob:mock-/);
    // Opaque bodies read back empty, so a readable CORS copy is fetched once.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("streams instead of caching when the user disabled local audio storage", async () => {
    mockPrefs.cacheAudioLocally = false;

    const resolved = await resolveCachedAudioUri(AYAH);
    expect(resolved).toBe(AYAH);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports size + count and clears the bucket", async () => {
    await resolveCachedAudioUri(AYAH);
    await resolveCachedAudioUri(DUA);
    const info = await getAudioCacheInfo();
    expect(info.count).toBe(2);
    expect(info.bytes).toBe(CLIP_BODY.length * 2);

    await clearAudioCache();
    const cleared = await getAudioCacheInfo();
    expect(cleared).toEqual({ bytes: 0, count: 0 });
  });
});
