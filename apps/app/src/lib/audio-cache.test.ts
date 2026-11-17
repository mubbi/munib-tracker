import { Platform } from "react-native";
import {
  clearAudioCache,
  clearAudioCacheInflight,
  getAudioCacheInfo,
  getAudioCacheSize,
  invalidateCachedAudioUri,
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
// Mirrors the class-based `expo-file-system` surface `native-file-store.ts` uses.
jest.mock("expo-file-system", () => {
  const files = new Map<string, number>(); // local file uri -> byte size
  const DOCUMENT = "file:///document/";
  const FILE_BYTES = 2048;
  const state = { freeDisk: 10 * 1024 * 1024 * 1024 };
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
    __setFreeDisk: (bytes: number) => {
      state.freeDisk = bytes;
    },
    __deleted: deleted,
  };
});

const FS = jest.requireMock("expo-file-system") as {
  __reset: () => void;
  __set: (uri: string, size: number) => void;
  __setFreeDisk: (bytes: number) => void;
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
  async delete(req: string | { url: string }): Promise<boolean> {
    return this.store.delete(typeof req === "string" ? req : req.url);
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

  it("invalidates a single web clip so peek misses and the next resolve re-fetches", async () => {
    const first = await resolveCachedAudioUri(AYAH);
    expect(peekCachedAudioUri(AYAH)).toBe(first);
    fetchMock.mockClear();

    await invalidateCachedAudioUri(AYAH);
    expect(peekCachedAudioUri(AYAH)).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(first);
    expect(cache.store.has(AYAH)).toBe(false);

    const second = await resolveCachedAudioUri(AYAH);
    expect(second).toMatch(/^blob:mock-/);
    expect(second).not.toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
