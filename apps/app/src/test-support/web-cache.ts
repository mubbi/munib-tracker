import { type FakeResponse, fakeResponse } from "@/test-support/fetch";

/**
 * Fake web Cache Storage (`caches`) + `URL.createObjectURL` for lib code that
 * persists remote bytes in a bucket and plays/registers them via `blob:` URLs
 * (qcf-font-cache, audio-cache …). Pair with `usePlatform({ OS: "web" })` and
 * `mockFetch(fakeCacheResponse())`.
 *
 *   const web = installWebCache(); … web.restore();
 */

export type FakeCacheResponse = FakeResponse & {
  /** `"opaque"` models a no-cors entry whose body reads back empty. */
  type: string;
  blob: () => Promise<{ size: number }>;
  clone: () => FakeCacheResponse;
};

/** A cacheable fetch/Cache Storage response; `body` length is the blob size. */
export function fakeCacheResponse(
  options: {
    body?: string;
    status?: number;
    type?: string;
    headers?: Record<string, string>;
    /** Make `arrayBuffer()` reject (unreadable body). */
    unreadable?: boolean;
  } = {},
): FakeCacheResponse {
  const body = options.body ?? "font-bytes";
  const base = fakeResponse(body, { status: options.status, headers: options.headers });
  const res: FakeCacheResponse = {
    ...base,
    type: options.type ?? "basic",
    blob: async () => ({ size: body.length }),
    clone: () => res,
    arrayBuffer: options.unreadable
      ? async () => {
          throw new Error("unreadable body");
        }
      : base.arrayBuffer,
  };
  return res;
}

export type WebCacheFake = {
  /** Backing store of the single bucket, keyed by request URL. */
  store: Map<string, FakeCacheResponse>;
  cache: { match: jest.Mock; put: jest.Mock; keys: jest.Mock; delete: jest.Mock };
  caches: { open: jest.Mock; delete: jest.Mock };
  /** Returns `blob:fake-1`, `blob:fake-2`, … */
  createObjectURL: jest.Mock;
  revokeObjectURL: jest.Mock;
  restore: () => void;
};

/** Installs `globalThis.caches` and `URL.{create,revoke}ObjectURL`; returns handles + restore. */
export function installWebCache(): WebCacheFake {
  const store = new Map<string, FakeCacheResponse>();
  const cache = {
    match: jest.fn(async (key: string) => store.get(key)),
    put: jest.fn(async (key: string, res: FakeCacheResponse) => {
      store.set(key, res);
    }),
    keys: jest.fn(async () => [...store.keys()]),
    delete: jest.fn(async (key: string) => store.delete(key)),
  };
  const caches = {
    open: jest.fn(async () => cache),
    delete: jest.fn(async () => {
      store.clear();
      return true;
    }),
  };
  let counter = 0;
  const createObjectURL = jest.fn(() => `blob:fake-${++counter}`);
  const revokeObjectURL = jest.fn();

  const g = globalThis as Record<string, unknown>;
  const previousCaches = Object.getOwnPropertyDescriptor(g, "caches");
  const previousCreate = URL.createObjectURL;
  const previousRevoke = URL.revokeObjectURL;
  Object.defineProperty(g, "caches", { configurable: true, writable: true, value: caches });
  URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;

  return {
    store,
    cache,
    caches,
    createObjectURL,
    revokeObjectURL,
    restore: () => {
      if (previousCaches) Object.defineProperty(g, "caches", previousCaches);
      else delete g.caches;
      URL.createObjectURL = previousCreate;
      URL.revokeObjectURL = previousRevoke;
    },
  };
}
