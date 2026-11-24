import {
  clearAudioCache,
  clearAudioCacheInflight,
  getAudioCacheInfo,
  getAudioCacheSize,
  invalidateCachedAudioUri,
  isAudioLocalCacheEnabled,
  peekCachedAudioUri,
  peekNativeCachedAudioUri,
  prefetchAudioUri,
  resolveCachedAudioUri,
} from "@/lib/audio-cache";
import { mockFetch } from "@/test-support/fetch";
import { usePlatform } from "@/test-support/platform";
import { fakeCacheResponse, installWebCache, type WebCacheFake } from "@/test-support/web-cache";

const mockPrefs = { cacheAudioLocally: true };

// The cache toggle is read through `lib/cache-prefs` (already loaded by
// jest.setup's module graph), so mock that seam rather than the store.
jest.mock("@/lib/cache-prefs", () => ({
  shouldCacheAudio: () => mockPrefs.cacheAudioLocally !== false,
}));

// Functional in-memory file store (overrides the empty default in jest.setup.ts).
// Mirrors the class-based `expo-file-system` surface `native-file-store.ts` uses.
jest.mock("expo-file-system", () => {
  const files = new Map<string, number>(); // local file uri -> byte size
  const DOCUMENT = "file:///document/";
  const FILE_BYTES = 2048;
  const state: { freeDisk: number | Error } = { freeDisk: 10 * 1024 * 1024 * 1024 };
  const deleted = jest.fn((_uri: string) => undefined);

  const withSlash = (uri: string) => (uri.endsWith("/") ? uri : `${uri}/`);
  const under = (dir: string) => Array.from(files.keys()).filter((k) => k.startsWith(dir));

  class MockFile {
    readonly uri: string;
    constructor(uri: string) {
      this.uri = uri;
    }
    get name(): string {
      return this.uri.split("/").pop() ?? "";
    }
    get exists(): boolean {
      return files.has(this.uri);
    }
    get size(): number | null {
      return files.get(this.uri) ?? null;
    }
    info() {
      const size = files.get(this.uri);
      return size != null
        ? { exists: true, uri: this.uri, size }
        : { exists: false, uri: this.uri };
    }
    delete(): void {
      if (!files.has(this.uri)) throw new Error(`${this.uri} does not exist`);
      files.delete(this.uri);
      deleted(this.uri);
    }
    static downloadFileAsync = jest.fn(async (_remote: string, destination: MockFile) => {
      files.set(destination.uri, FILE_BYTES);
      return destination;
    });
  }

  class MockDirectory {
    readonly uri: string;
    constructor(uri: string) {
      this.uri = withSlash(uri);
    }
    get name(): string {
      return this.uri.slice(0, -1).split("/").pop() ?? "";
    }
    get exists(): boolean {
      return this.uri === DOCUMENT || under(this.uri).length > 0;
    }
    get size(): number | null {
      return null;
    }
    create(): void {}
    list(): MockFile[] {
      return under(this.uri).map((k) => new MockFile(k));
    }
    delete(): void {
      for (const k of under(this.uri)) files.delete(k);
      deleted(this.uri);
    }
  }

  return {
    __esModule: true,
    File: MockFile,
    Directory: MockDirectory,
    Paths: {
      get document() {
        return new MockDirectory(DOCUMENT);
      },
      get cache() {
        return new MockDirectory("file:///cache/");
      },
      // Plenty of headroom by default so caching proceeds; tests lower it to
      // simulate a nearly-full device.
      get availableDiskSpace() {
        if (state.freeDisk instanceof Error) throw state.freeDisk;
        return state.freeDisk;
      },
      info(uri: string) {
        if (files.has(uri)) return { exists: true, isDirectory: false };
        if (under(withSlash(uri)).length > 0) return { exists: true, isDirectory: true };
        return { exists: false, isDirectory: null };
      },
    },
    __reset: () => {
      files.clear();
      state.freeDisk = 10 * 1024 * 1024 * 1024;
    },
    __set: (uri: string, size: number) => {
      files.set(uri, size);
    },
    __setFreeDisk: (bytes: number | Error) => {
      state.freeDisk = bytes;
    },
    __deleted: deleted,
  };
});

const FS = jest.requireMock("expo-file-system") as {
  __reset: () => void;
  __set: (uri: string, size: number) => void;
  __setFreeDisk: (bytes: number | Error) => void;
  __deleted: jest.Mock;
  File: { downloadFileAsync: jest.Mock };
};
const download = FS.File.downloadFileAsync;

const AYAH = "https://everyayah.com/data/Alafasy_128kbps/001001.mp3";
const DUA = "https://cdn.jsdelivr.net/gh/example/audio/dua.mp3";

beforeEach(() => {
  // Clears files and restores the default "plenty of room" free space.
  FS.__reset();
  clearAudioCacheInflight();
  download.mockClear();
  FS.__deleted.mockClear();
  mockPrefs.cacheAudioLocally = true;
});

describe("audio cache", () => {
  it("returns non-remote URIs untouched, without downloading", async () => {
    expect(await resolveCachedAudioUri("file:///bundled.mp3")).toBe("file:///bundled.mp3");
    expect(download).not.toHaveBeenCalled();
  });

  it("downloads a clip once, then replays it from the local file", async () => {
    const first = await resolveCachedAudioUri(AYAH);
    expect(first).toContain("munib-audio/");
    expect(first).not.toBe(AYAH);
    expect(download).toHaveBeenCalledTimes(1);

    const second = await resolveCachedAudioUri(AYAH);
    expect(second).toBe(first);
    // Cache hit — no second network download.
    expect(download).toHaveBeenCalledTimes(1);
  });

  it("dedupes concurrent downloads of the same clip", async () => {
    const [a, b] = await Promise.all([resolveCachedAudioUri(AYAH), resolveCachedAudioUri(AYAH)]);
    expect(a).toBe(b);
    expect(download).toHaveBeenCalledTimes(1);
  });

  it("streams instead of caching when the user disabled local audio storage", async () => {
    mockPrefs.cacheAudioLocally = false;
    expect(isAudioLocalCacheEnabled()).toBe(false);

    const resolved = await resolveCachedAudioUri(AYAH);
    expect(resolved).toBe(AYAH);
    expect(download).not.toHaveBeenCalled();
  });

  it("streams instead of caching when the device is low on disk", async () => {
    // Only 10 MB free — below the 250 MB safety threshold.
    FS.__setFreeDisk(10 * 1024 * 1024);

    const resolved = await resolveCachedAudioUri(AYAH);
    // Falls back to the remote URL (streamed), nothing written to disk.
    expect(resolved).toBe(AYAH);
    expect(download).not.toHaveBeenCalled();
  });

  it("still serves an already-cached clip even when disk is low", async () => {
    // Cache it while there's room.
    const cached = await resolveCachedAudioUri(AYAH);
    expect(cached).toContain("munib-audio/");
    clearAudioCacheInflight(); // reset the free-disk reading

    // Now the device is full — an existing file is still returned from disk.
    FS.__setFreeDisk(1 * 1024 * 1024);
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
    expect(download).toHaveBeenCalledWith(
      adhan,
      expect.objectContaining({ uri: cached }),
      expect.objectContaining({ idempotent: true }),
    );
  });

  it("peeks a native cached file without starting a download", async () => {
    expect(await peekNativeCachedAudioUri(AYAH)).toBeNull();
    const cached = await resolveCachedAudioUri(AYAH);
    download.mockClear();

    expect(await peekNativeCachedAudioUri(AYAH)).toBe(cached);
    expect(download).not.toHaveBeenCalled();
  });

  it("deletes an empty cache entry and re-downloads", async () => {
    const cached = await resolveCachedAudioUri(AYAH);
    FS.__set(cached, 0); // simulate a truncated / failed prior write
    download.mockClear();
    clearAudioCacheInflight();

    const again = await resolveCachedAudioUri(AYAH);
    expect(again).toBe(cached);
    expect(FS.__deleted).toHaveBeenCalledWith(cached);
    expect(download).toHaveBeenCalledTimes(1);
  });

  it("invalidates a single native cache entry so the next resolve re-downloads", async () => {
    const cached = await resolveCachedAudioUri(AYAH);
    download.mockClear();
    clearAudioCacheInflight();

    await invalidateCachedAudioUri(AYAH);
    expect(FS.__deleted).toHaveBeenCalledWith(cached);
    expect(await peekNativeCachedAudioUri(AYAH)).toBeNull();

    const again = await resolveCachedAudioUri(AYAH);
    expect(again).toBe(cached);
    expect(download).toHaveBeenCalledTimes(1);
  });

  it("streams the remote URL when the server answers with an HTTP error", async () => {
    // The class-based API rejects on non-2xx instead of resolving with a status.
    download.mockRejectedValueOnce(new Error("Unable to download a file: response has status 404"));

    expect(await resolveCachedAudioUri(AYAH)).toBe(AYAH);
    expect(await peekNativeCachedAudioUri(AYAH)).toBeNull();
  });

  it("retries a 416 (Range Not Satisfiable) once without cache, then caches the clip", async () => {
    download.mockRejectedValueOnce(new Error("Unable to download a file: response has status 416"));

    const resolved = await resolveCachedAudioUri(AYAH);
    expect(resolved).toContain("munib-audio/");
    expect(download).toHaveBeenCalledTimes(2);
    expect(download).toHaveBeenLastCalledWith(
      AYAH,
      expect.objectContaining({ uri: resolved }),
      expect.objectContaining({ headers: { "Cache-Control": "no-cache" } }),
    );
  });
});

describe("audio cache (native edge cases)", () => {
  /** Let a fire-and-forget prefetch settle. */
  const settle = () => new Promise((resolve) => setImmediate(resolve));

  it("streams the remote URL and leaves no partial file when the download throws", async () => {
    download.mockRejectedValueOnce(new Error("Network request failed"));
    expect(await resolveCachedAudioUri(AYAH)).toBe(AYAH);
    expect(await getAudioCacheInfo()).toEqual({ bytes: 0, count: 0 });
  });

  it.each([
    ["unknown (NaN)", Number.NaN],
    ["unreadable", new Error("statfs")],
  ])("still caches when free disk space is %s", async (_label, freeDisk) => {
    FS.__setFreeDisk(freeDisk);
    expect(await resolveCachedAudioUri(AYAH)).toContain("munib-audio/");
  });

  it("reuses a recent free-space reading", async () => {
    await resolveCachedAudioUri(AYAH);
    FS.__setFreeDisk(1);
    expect(await resolveCachedAudioUri(DUA)).toContain("munib-audio/");
  });

  it("peeks nothing for non-remote or uncached clips", async () => {
    expect(await peekNativeCachedAudioUri("file:///x.mp3")).toBeNull();
    expect(await peekNativeCachedAudioUri(AYAH)).toBeNull();
  });

  it("never peeks a blob URL on native", () => {
    expect(peekCachedAudioUri(AYAH)).toBeNull();
  });

  it("prefetches a remote clip into the cache", async () => {
    prefetchAudioUri(AYAH);
    await settle();
    expect(await peekNativeCachedAudioUri(AYAH)).toContain("munib-audio/");
  });

  it.each([
    ["a non-remote URI", "file:///x.mp3", true],
    ["a remote clip when caching is disabled", AYAH, false],
  ])("does not prefetch %s", async (_label, uri, enabled) => {
    mockPrefs.cacheAudioLocally = enabled;
    prefetchAudioUri(uri);
    await settle();
    expect(download).not.toHaveBeenCalled();
  });

  it("ignores invalidation of non-remote URIs and missing files", async () => {
    await expect(invalidateCachedAudioUri("file:///x.mp3")).resolves.toBeUndefined();
    await expect(invalidateCachedAudioUri(AYAH)).resolves.toBeUndefined();
  });

  it("reports the cache size in bytes", async () => {
    await resolveCachedAudioUri(AYAH);
    expect(await getAudioCacheSize()).toBe(2048);
  });
});

// ── Web: Cache Storage + blob URLs ───────────────────────────────────────────

describe("audio cache (web)", () => {
  usePlatform({ OS: "web" });
  const CLIP_BODY = "x".repeat(1500);
  let web: WebCacheFake;
  let fetchMock: jest.Mock;

  beforeEach(async () => {
    mockPrefs.cacheAudioLocally = true;
    web = installWebCache();
    await clearAudioCache();
    web.revokeObjectURL.mockClear();
    fetchMock = mockFetch(fakeCacheResponse({ body: CLIP_BODY }));
  });

  afterEach(() => web.restore());

  it("resolves a clip to a blob URL, downloading it only once", async () => {
    const first = await resolveCachedAudioUri(AYAH);
    expect(first).toMatch(/^blob:fake-/);
    // Replay: served from the in-memory object URL — no second network call.
    expect(await resolveCachedAudioUri(AYAH)).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("dedupes concurrent resolves of the same clip", async () => {
    const [a, b] = await Promise.all([resolveCachedAudioUri(AYAH), resolveCachedAudioUri(AYAH)]);
    expect(a).toBe(b);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("peeks a resolved clip synchronously for gesture-safe replays", async () => {
    expect(peekCachedAudioUri(AYAH)).toBeNull();
    const resolved = await resolveCachedAudioUri(AYAH);
    expect(peekCachedAudioUri(AYAH)).toBe(resolved);
  });

  it("reuses a Cache Storage hit without re-fetching (persists across reloads)", async () => {
    web.store.set(AYAH, fakeCacheResponse({ body: CLIP_BODY }));
    expect(await resolveCachedAudioUri(AYAH)).toMatch(/^blob:fake-/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-fetches an opaque cached body as CORS so it yields a playable blob", async () => {
    web.store.set(AYAH, fakeCacheResponse({ type: "opaque" }));
    expect(await resolveCachedAudioUri(AYAH)).toMatch(/^blob:fake-/);
    expect(fetchMock).toHaveBeenCalledWith(AYAH, { mode: "cors", credentials: "omit" });
  });

  it("still plays from the fetched response when caching it fails", async () => {
    web.cache.put.mockRejectedValueOnce(new Error("quota"));
    expect(await resolveCachedAudioUri(AYAH)).toMatch(/^blob:fake-/);
  });

  it.each([
    ["an HTTP error", fakeCacheResponse({ status: 404 })],
    ["an empty body", fakeCacheResponse({ body: "" })],
    ["a network error", new Error("Failed to fetch")],
  ])("streams the remote URL after %s", async (_label, reply) => {
    mockFetch(reply);
    expect(await resolveCachedAudioUri(AYAH)).toBe(AYAH);
    expect(peekCachedAudioUri(AYAH)).toBeNull();
  });

  it("streams instead of caching when the user disabled local audio storage", async () => {
    mockPrefs.cacheAudioLocally = false;
    expect(await resolveCachedAudioUri(AYAH)).toBe(AYAH);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("revokes the least recently used blob URL beyond 512 clips", async () => {
    for (let i = 0; i <= 512; i++) await resolveCachedAudioUri(`${DUA}?n=${i}`);
    expect(web.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(web.revokeObjectURL).toHaveBeenCalledWith("blob:fake-1");
    expect(peekCachedAudioUri(`${DUA}?n=0`)).toBeNull();
  });

  it("prefetches a clip to a blob URL once", async () => {
    prefetchAudioUri(AYAH);
    await resolveCachedAudioUri(AYAH);
    prefetchAudioUri(AYAH);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(peekCachedAudioUri(AYAH)).toMatch(/^blob:fake-/);
  });

  it("reports size + count and clears the bucket", async () => {
    await resolveCachedAudioUri(AYAH);
    await resolveCachedAudioUri(DUA);
    expect(await getAudioCacheInfo()).toEqual({ bytes: CLIP_BODY.length * 2, count: 2 });

    await clearAudioCache();
    expect(await getAudioCacheInfo()).toEqual({ bytes: 0, count: 0 });
  });

  it("sizes entries by content-length, then body, skipping opaque, unreadable and missing ones", async () => {
    web.store.set("a", fakeCacheResponse({ headers: { "content-length": "100" } }));
    web.store.set("b", fakeCacheResponse({ headers: { "content-length": "junk" } }));
    web.store.set("c", fakeCacheResponse({ body: "x".repeat(50) }));
    web.store.set("d", fakeCacheResponse({ type: "opaque" }));
    web.store.set("e", fakeCacheResponse({ unreadable: true }));
    web.store.set("f", fakeCacheResponse());
    web.cache.match.mockImplementation(async (key: string) =>
      key === "f" ? undefined : web.store.get(key),
    );
    expect(await getAudioCacheInfo()).toEqual({ bytes: 150, count: 6 });
  });

  it("reports an empty cache when the bucket cannot be opened", async () => {
    web.caches.open.mockRejectedValueOnce(new Error("SecurityError"));
    expect(await getAudioCacheInfo()).toEqual({ bytes: 0, count: 0 });
  });

  it("invalidates a single web clip so peek misses and the next resolve re-fetches", async () => {
    const first = await resolveCachedAudioUri(AYAH);
    await invalidateCachedAudioUri(AYAH);
    expect(peekCachedAudioUri(AYAH)).toBeNull();
    expect(web.revokeObjectURL).toHaveBeenCalledWith(first);
    expect(web.store.has(AYAH)).toBe(false);

    const second = await resolveCachedAudioUri(AYAH);
    expect(second).not.toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("swallows revoke and bucket failures when invalidating and clearing", async () => {
    await resolveCachedAudioUri(AYAH);
    await resolveCachedAudioUri(DUA);
    web.revokeObjectURL.mockImplementation(() => {
      throw new Error("revoke");
    });
    web.caches.open.mockRejectedValueOnce(new Error("open"));
    web.caches.delete.mockRejectedValueOnce(new Error("delete"));
    await expect(invalidateCachedAudioUri(AYAH)).resolves.toBeUndefined();
    await expect(clearAudioCache()).resolves.toBeUndefined();
  });

  describe("without Cache Storage", () => {
    beforeEach(() => web.restore());

    it("streams remote clips and reports an empty cache", async () => {
      expect(await resolveCachedAudioUri(AYAH)).toBe(AYAH);
      prefetchAudioUri(AYAH);
      await invalidateCachedAudioUri(AYAH);
      await clearAudioCache();
      expect(await getAudioCacheInfo()).toEqual({ bytes: 0, count: 0 });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
