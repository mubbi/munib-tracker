import { webcrypto } from "node:crypto";

import { type FakeResponse as FetchReply, mockFetch } from "@/test-support/fetch";
import {
  RECITATION_FIXTURE_BYTES,
  RECITATION_FIXTURE_FILES,
} from "@/test-support/mocks/recitation-models";

import type { RecitationModelManifest } from "./types";

jest.mock(
  "@/constants/recitation-models",
  () => require("@/test-support/mocks/recitation-models").recitationModelsMock,
);

const MODEL_BYTES = RECITATION_FIXTURE_BYTES["m.onnx"];
const JSON_BYTES = RECITATION_FIXTURE_BYTES["c.json"];
const TEXT_BYTES = RECITATION_FIXTURE_BYTES["l.txt"];

import {
  createRecitationModelStore,
  deleteRecitationModelFiles,
  MODEL_CACHE,
  recitationModelBytesOnDisk,
} from "./model-store.web";

const KEY = (name: string) => `https://munib.local/recitation-models/${name}`;

type Entry = { body: Uint8Array; headers: Map<string, string> };

class FakeResponse {
  readonly headers: { get: (k: string) => string | null };
  constructor(
    private readonly bytes: Uint8Array,
    init?: { headers?: Record<string, string> },
  ) {
    const map = new Map(Object.entries(init?.headers ?? {}));
    this.headers = { get: (k) => map.get(k) ?? null };
  }
  async arrayBuffer() {
    return this.bytes.buffer.slice(0);
  }
  async json() {
    return JSON.parse(new TextDecoder().decode(this.bytes));
  }
}

function makeCache() {
  const store = new Map<string, Entry | FakeResponse>();
  const cache = {
    store,
    keys: jest.fn(async () => [...store.keys()].map((url) => ({ url }))),
    match: jest.fn(async (key: string | { url: string }) => {
      const k = typeof key === "string" ? key : key.url;
      return store.get(k);
    }),
    put: jest.fn(async (key: string, res: FakeResponse) => {
      store.set(key, res);
    }),
    delete: jest.fn(async (key: { url: string }) => store.delete(key.url)),
  };
  return cache;
}

function streamResponse(
  chunks: Uint8Array[],
  opts: { ok?: boolean; status?: number; failAt?: number } = {},
): FetchReply {
  let i = 0;
  return {
    ok: opts.ok ?? true,
    status: opts.status ?? 200,
    body: {
      getReader: () => ({
        read: async () => {
          if (opts.failAt === i) throw new Error("stream reset");
          if (i >= chunks.length) return { done: true, value: undefined };
          return { done: false, value: chunks[i++] };
        },
      }),
    },
  } as unknown as FetchReply;
}

/** A reply whose reader runs `onRead` (e.g. flips the cancel signal) and then throws. */
function failingRead(onRead: () => void): FetchReply {
  return {
    ok: true,
    status: 200,
    body: {
      getReader: () => ({
        read: async () => {
          onRead();
          throw new Error("aborted");
        },
      }),
    },
  } as unknown as FetchReply;
}

const httpReply = (status: number, body: unknown) =>
  ({ ok: status < 400, status, body }) as unknown as FetchReply;

const g = globalThis as Record<string, unknown>;
const originals = {
  caches: g.caches,
  crypto: g.crypto,
  Response: g.Response,
  storage: (globalThis.navigator as { storage?: unknown } | undefined)?.storage,
};

let cache: ReturnType<typeof makeCache>;
let cachesApi: { open: jest.Mock; delete: jest.Mock };

function setStorage(storage: unknown) {
  Object.defineProperty(globalThis.navigator, "storage", {
    configurable: true,
    value: storage,
  });
}

beforeEach(() => {
  cache = makeCache();
  cachesApi = { open: jest.fn(async () => cache), delete: jest.fn(async () => true) };
  g.caches = cachesApi;
  g.crypto = webcrypto;
  g.Response = FakeResponse;
  setStorage({ estimate: jest.fn(async () => ({ quota: 1e9, usage: 0 })), persist: jest.fn() });
});

afterAll(() => {
  g.caches = originals.caches;
  g.crypto = originals.crypto;
  g.Response = originals.Response;
  setStorage(originals.storage);
});

const manifest = (names: string[]): RecitationModelManifest => ({
  engine: "tilawa-zipformer",
  version: "v1",
  files: names.map((fileName) => ({ fileName, bytes: 1, sha256: "", md5: "" })),
  downloadedAt: "2026-01-01T00:00:00.000Z",
});

describe("model-store.web without Cache Storage", () => {
  beforeEach(() => {
    delete g.caches;
  });

  it("reports nothing and refuses to download", async () => {
    const store = createRecitationModelStore();
    expect(await store.sizeOnDisk()).toBe(0);
    expect(await store.isPresent(manifest(["m.onnx"]))).toBe(false);
    await expect(
      store.download("tilawa-zipformer", jest.fn(), { cancelled: false }),
    ).rejects.toMatchObject({
      code: "runtime-unsupported",
    });
    await expect(store.deleteAll()).resolves.toBeUndefined();
    await expect(store.cleanupOrphans(null)).resolves.toBeUndefined();
    await expect(deleteRecitationModelFiles()).resolves.toBeUndefined();
    expect(store.canResume()).toBe(false);
  });
});

describe("model-store.web sizeOnDisk / isPresent", () => {
  it("sums content-length headers and ignores non-numeric ones", async () => {
    cache.store.set(
      KEY("a"),
      new FakeResponse(new Uint8Array(), { headers: { "content-length": "10" } }),
    );
    cache.store.set(
      KEY("b"),
      new FakeResponse(new Uint8Array(), { headers: { "content-length": "abc" } }),
    );
    cache.store.set(KEY("c"), new FakeResponse(new Uint8Array()));
    expect(await recitationModelBytesOnDisk()).toBe(10);
    expect(cachesApi.open).toHaveBeenCalledWith(MODEL_CACHE);
  });

  it("returns 0 when the cache throws", async () => {
    cachesApi.open.mockRejectedValueOnce(new Error("denied"));
    expect(await createRecitationModelStore().sizeOnDisk()).toBe(0);
  });

  it("is present only when every manifest file is cached", async () => {
    const store = createRecitationModelStore();
    cache.store.set(KEY("m.onnx"), new FakeResponse(MODEL_BYTES));
    expect(await store.isPresent(manifest(["m.onnx"]))).toBe(true);
    expect(await store.isPresent(manifest(["m.onnx", "c.json"]))).toBe(false);
    cachesApi.open.mockRejectedValueOnce(new Error("x"));
    expect(await store.isPresent(manifest(["m.onnx"]))).toBe(false);
  });
});

describe("model-store.web freeBytes", () => {
  it("computes quota minus usage", async () => {
    setStorage({ estimate: async () => ({ quota: 100, usage: 40 }) });
    expect(await createRecitationModelStore().freeBytes()).toBe(60);
  });

  it("returns null when the estimate is unknown or unavailable", async () => {
    const store = createRecitationModelStore();
    setStorage({ estimate: async () => ({ quota: 100 }) });
    expect(await store.freeBytes()).toBeNull();
    setStorage(undefined);
    expect(await store.freeBytes()).toBeNull();
    setStorage({
      estimate: async () => {
        throw new Error("nope");
      },
    });
    expect(await store.freeBytes()).toBeNull();
  });
});

describe("model-store.web download", () => {
  type Signal = { cancelled: boolean; onCancel?: () => void };
  const TOTAL = MODEL_BYTES.length + JSON_BYTES.length + TEXT_BYTES.length;

  function download(
    engine: "tilawa-zipformer" | "tilawa-fastconformer" = "tilawa-zipformer",
    signal: Signal = { cancelled: false },
  ) {
    const onProgress = jest.fn();
    const result = createRecitationModelStore().download(engine, onProgress, signal);
    return { result, onProgress };
  }

  /** Serves the three files in download order (model streamed in two chunks). */
  const serveAll = () =>
    mockFetch(
      streamResponse([MODEL_BYTES.slice(0, 3), MODEL_BYTES.slice(3)]),
      streamResponse([JSON_BYTES]),
      streamResponse([TEXT_BYTES]),
    );

  it("reports per-chunk and final progress", async () => {
    serveAll();
    const { result, onProgress } = download();
    await result;
    expect(onProgress).toHaveBeenCalledWith({ bytesDone: 3, bytesTotal: TOTAL });
    expect(onProgress).toHaveBeenLastCalledWith({ bytesDone: TOTAL, bytesTotal: TOTAL });
  });

  it("fetches the same-origin copy without the HTTP cache", async () => {
    const fetchMock = serveAll();
    await download().result;
    expect(fetchMock).toHaveBeenCalledWith(
      "/models/tilawa-zipformer/m.onnx",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("caches each file with its content type and length", async () => {
    serveAll();
    await download().result;
    const model = cache.store.get(KEY("m.onnx")) as FakeResponse;
    expect(model.headers.get("content-type")).toBe("application/octet-stream");
    expect(model.headers.get("content-length")).toBe(String(MODEL_BYTES.length));
    expect((cache.store.get(KEY("c.json")) as FakeResponse).headers.get("content-type")).toBe(
      "application/json",
    );
  });

  it("asks the browser to persist the bucket", async () => {
    serveAll();
    const persist = jest.fn(async () => true);
    setStorage({ estimate: async () => ({ quota: 1e6, usage: 0 }), persist });
    await download().result;
    expect(persist).toHaveBeenCalled();
  });

  it("returns a manifest without source URLs", async () => {
    serveAll();
    const manifest = await download().result;
    expect(manifest).toMatchObject({ engine: "tilawa-zipformer", version: "v1" });
    const { url: _url, kind: _kind, ...expected } = RECITATION_FIXTURE_FILES[0];
    expect(manifest.files[0]).toEqual(expected);
  });

  it("skips files that are already cached and tolerates a persist refusal", async () => {
    const fetchMock = mockFetch(streamResponse([JSON_BYTES]), streamResponse([TEXT_BYTES]));
    cache.store.set(KEY("m.onnx"), new FakeResponse(MODEL_BYTES));
    setStorage({
      estimate: async () => ({ quota: 1e6, usage: 0 }),
      persist: async () => {
        throw new Error("refused");
      },
    });
    const { result, onProgress } = download();
    await result;
    expect(onProgress.mock.calls[0][0]).toEqual({ bytesDone: 6, bytesTotal: TOTAL });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("proceeds when free space is unknown", async () => {
    serveAll();
    setStorage(undefined);
    await expect(download().result).resolves.toMatchObject({ engine: "tilawa-zipformer" });
  });

  it("rejects engines that are not web hosted", async () => {
    await expect(download("tilawa-fastconformer").result).rejects.toMatchObject({
      code: "runtime-unsupported",
    });
  });

  it("rejects when there is less than twice the download free", async () => {
    setStorage({ estimate: async () => ({ quota: 10, usage: 0 }) });
    await expect(download().result).rejects.toMatchObject({ code: "not-enough-space" });
  });

  it("stops before fetching when already cancelled", async () => {
    const fetchMock = mockFetch();
    await expect(download("tilawa-zipformer", { cancelled: true }).result).rejects.toMatchObject({
      code: "download-cancelled",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [
      "a network failure",
      () => new Error("offline"),
      { code: "no-connection", message: "offline" },
    ],
    ["an HTTP error", () => httpReply(404, {}), { code: "download-failed", message: "HTTP 404" }],
    ["a missing body", () => httpReply(200, null), { code: "download-failed" }],
    [
      "an oversize stream",
      () => streamResponse([MODEL_BYTES, MODEL_BYTES]),
      { code: "checksum-mismatch" },
    ],
    [
      "an undersize stream",
      () => streamResponse([MODEL_BYTES.slice(0, 2)]),
      { code: "checksum-mismatch" },
    ],
    ["a wrong digest", () => streamResponse([new Uint8Array(6)]), { code: "checksum-mismatch" }],
    [
      "a stream read failure",
      () => streamResponse([MODEL_BYTES], { failAt: 0 }),
      { code: "no-connection", message: "stream reset" },
    ],
  ])("maps %s to a PracticeError", async (_label, reply, expected) => {
    mockFetch(reply());
    await expect(download().result).rejects.toMatchObject(expected);
  });

  it("aborts the request and reports cancelled when cancelled during fetch", async () => {
    const signal: Signal = { cancelled: false };
    const fetchMock = mockFetch();
    fetchMock.mockImplementationOnce(async () => {
      signal.cancelled = true;
      signal.onCancel?.();
      throw new Error("aborted");
    });
    await expect(download("tilawa-zipformer", signal).result).rejects.toMatchObject({
      code: "download-cancelled",
    });
  });

  it("reports cancelled when cancelled between chunks", async () => {
    const signal: Signal = { cancelled: false };
    const fetchMock = mockFetch();
    fetchMock.mockImplementationOnce(async () => {
      signal.cancelled = true;
      return streamResponse([MODEL_BYTES]);
    });
    await expect(download("tilawa-zipformer", signal).result).rejects.toMatchObject({
      code: "download-cancelled",
    });
  });

  it("reports cancelled when a read fails after cancelling", async () => {
    const signal: Signal = { cancelled: false };
    mockFetch(failingRead(() => (signal.cancelled = true)));
    await expect(download("tilawa-zipformer", signal).result).rejects.toMatchObject({
      code: "download-cancelled",
    });
  });

  it("maps a cache.put failure to not-enough-space", async () => {
    serveAll();
    cache.put.mockRejectedValueOnce(new Error("QuotaExceededError"));
    await expect(download().result).rejects.toMatchObject({
      code: "not-enough-space",
      message: "QuotaExceededError",
    });
  });
});

describe("model-store.web delete / cleanup / load", () => {
  it("deletes the whole bucket and swallows failures", async () => {
    const store = createRecitationModelStore();
    await store.deleteAll();
    expect(cachesApi.delete).toHaveBeenCalledWith(MODEL_CACHE);
    cachesApi.delete.mockRejectedValueOnce(new Error("x"));
    await expect(store.deleteAll()).resolves.toBeUndefined();
    cachesApi.delete.mockRejectedValueOnce(new Error("x"));
    await expect(deleteRecitationModelFiles()).resolves.toBeUndefined();
    expect(cachesApi.delete).toHaveBeenCalledTimes(3);
  });

  it("removes cached entries the manifest does not reference", async () => {
    cache.store.set(KEY("m.onnx"), new FakeResponse(MODEL_BYTES));
    cache.store.set(KEY("stale.bin"), new FakeResponse(MODEL_BYTES));
    await createRecitationModelStore().cleanupOrphans(manifest(["m.onnx"]));
    expect([...cache.store.keys()]).toEqual([KEY("m.onnx")]);
  });

  it("removes everything when there is no manifest and ignores errors", async () => {
    cache.store.set(KEY("m.onnx"), new FakeResponse(MODEL_BYTES));
    const store = createRecitationModelStore();
    await store.cleanupOrphans(null);
    expect(cache.store.size).toBe(0);
    cachesApi.open.mockRejectedValueOnce(new Error("x"));
    await expect(store.cleanupOrphans(null)).resolves.toBeUndefined();
  });

  it("loads model bytes and parsed JSON, skipping text files", async () => {
    cache.store.set(KEY("m.onnx"), new FakeResponse(MODEL_BYTES));
    cache.store.set(KEY("c.json"), new FakeResponse(JSON_BYTES));
    cache.store.set(KEY("l.txt"), new FakeResponse(TEXT_BYTES));
    const loaded = await createRecitationModelStore().load(manifest([]));
    expect(new Uint8Array(loaded.modelBytes as ArrayBuffer)).toEqual(MODEL_BYTES);
    expect(loaded.json).toEqual({ "c.json": { a: 1 } });
  });

  it("throws model-missing when a file was evicted", async () => {
    cache.store.set(KEY("m.onnx"), new FakeResponse(MODEL_BYTES));
    await expect(createRecitationModelStore().load(manifest([]))).rejects.toMatchObject({
      code: "model-missing",
    });
  });
});
