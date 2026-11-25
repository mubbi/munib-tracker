/**
 * Behaviour of public/expo-service-worker.js (app shell, navigation fallback,
 * notification clicks), run in a `vm` sandbox with in-memory Cache Storage,
 * a fake `fetch` and fake window clients — no browser, no network.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import vm from "node:vm";

const APP_DIR = join(__dirname, "..", "..", "..");
const SW_SOURCE = readFileSync(join(APP_DIR, "public", "expo-service-worker.js"), "utf8");
const ORIGIN = "https://app.test";

type Handler = (event: Record<string, unknown>) => void;
type FakeRequest = { url: string; method: string; mode: string; cache: string; headers: Headers };

const abs = (input: string | { url: string }) =>
  new URL(typeof input === "string" ? input : input.url, ORIGIN).href;

/** Minimal Cache Storage keyed by absolute URL. */
function createCacheStorage() {
  const stores = new Map<string, Map<string, Response>>();
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name) as Map<string, Response>;
    return {
      put: async (req: string | { url: string }, res: Response) => {
        store.set(abs(req), res);
      },
      match: async (req: string | { url: string }, opts?: { ignoreSearch?: boolean }) => {
        const key = abs(req);
        const hit = store.get(key);
        if (hit || !opts?.ignoreSearch) return hit?.clone();
        const bare = key.split("?")[0];
        return [...store.entries()].find(([url]) => url.split("?")[0] === bare)?.[1].clone();
      },
      keys: async () => [...store.keys()].map((url) => ({ url })),
      delete: async (req: string | { url: string }) => store.delete(abs(req)),
    };
  };
  return {
    stores,
    open,
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    match: async (req: string | { url: string }, opts?: { ignoreSearch?: boolean }) => {
      for (const name of stores.keys()) {
        const hit = await (await open(name)).match(req, opts);
        if (hit) return hit;
      }
      return undefined;
    },
  };
}

/** A same-origin network response (`type: "basic"`, like a real fetch). */
function basic(body: string, status = 200): Response {
  const res = new Response(body, { status });
  Object.defineProperty(res, "type", { value: "basic" });
  return res;
}

function request(path: string, init: Partial<FakeRequest> = {}): FakeRequest {
  return {
    url: abs(path),
    method: "GET",
    mode: "cors",
    cache: "default",
    headers: new Headers(),
    ...init,
  };
}

function loadWorker({
  precache = [] as string[],
  buildId = "dev",
  online = true,
  windows = [] as Record<string, unknown>[],
} = {}) {
  const handlers = new Map<string, Handler>();
  const caches = createCacheStorage();
  const network = new Map<string, string>();
  const fetch = jest.fn(async (input: string | { url: string }) => {
    if (!state.online) throw new TypeError("Failed to fetch");
    const body = network.get(abs(input));
    return body === undefined ? basic("missing", 404) : basic(body);
  });
  const state = { online };
  const self = {
    location: { origin: ORIGIN },
    registration: { navigationPreload: { enable: jest.fn(async () => undefined) } },
    clients: {
      claim: jest.fn(async () => undefined),
      matchAll: jest.fn(async () => windows),
      openWindow: jest.fn(async () => null),
    },
    skipWaiting: jest.fn(),
    addEventListener: (type: string, fn: Handler) => handlers.set(type, fn),
  };
  class TestRequest extends Request {
    constructor(input: string, init?: RequestInit) {
      super(abs(input), init);
    }
  }
  const source = SW_SOURCE.replace(
    'const BUILD_ID = "dev";',
    `const BUILD_ID = ${JSON.stringify(buildId)};`,
  ).replace("const PRECACHE_URLS = [];", `const PRECACHE_URLS = ${JSON.stringify(precache)};`);
  vm.runInNewContext(source, {
    self,
    caches,
    fetch,
    Request: TestRequest,
    Response,
    Headers,
    URL,
  });

  /** Dispatch an event; resolves with respondWith's value (if any) after waitUntil settles. */
  async function dispatch(type: string, extra: Record<string, unknown> = {}) {
    const waits: Promise<unknown>[] = [];
    let responded: Promise<Response> | undefined;
    const event = {
      waitUntil: (p: Promise<unknown>) => waits.push(p),
      respondWith: (p: Promise<Response>) => {
        responded = p;
      },
      preloadResponse: Promise.resolve(undefined),
      ...extra,
    };
    handlers.get(type)?.(event);
    const response = responded ? await responded : undefined;
    await Promise.all(waits);
    return { response, responded: responded !== undefined };
  }

  return { self, caches, fetch, network, state, dispatch };
}

describe("service worker — app shell", () => {
  it("precaches the injected URLs on install and activates immediately", async () => {
    const sw = loadWorker({ precache: ["/", "/tracker"], buildId: "b1" });
    sw.network.set(abs("/"), "<html>home</html>");
    sw.network.set(abs("/tracker"), "<html>tracker</html>");

    await sw.dispatch("install");

    expect(sw.self.skipWaiting).toHaveBeenCalled();
    const shell = sw.caches.stores.get("munib-shell-b1");
    expect([...(shell?.keys() ?? [])]).toEqual([abs("/"), abs("/tracker")]);
  });

  it("still installs when the precache can't be fetched", async () => {
    const sw = loadWorker({ precache: ["/"], online: false });
    await expect(sw.dispatch("install")).resolves.toBeDefined();
    expect(sw.self.skipWaiting).toHaveBeenCalled();
  });

  it("drops old shell caches on activate and keeps audio + runtime caches", async () => {
    const sw = loadWorker({ buildId: "new" });
    for (const name of [
      "munib-shell-old",
      "munib-shell-new",
      "munib-audio-v1",
      "munib-static-v1",
    ]) {
      await sw.caches.open(name);
    }

    await sw.dispatch("activate");

    expect(await sw.caches.keys()).toEqual([
      "munib-shell-new",
      "munib-audio-v1",
      "munib-static-v1",
    ]);
    expect(sw.self.registration.navigationPreload.enable).toHaveBeenCalled();
    expect(sw.self.clients.claim).toHaveBeenCalled();
  });

  it("serves navigations from the network and keeps a copy for offline", async () => {
    const sw = loadWorker();
    sw.network.set(abs("/qibla"), "<html>qibla</html>");

    const { response } = await sw.dispatch("fetch", {
      request: request("/qibla", { mode: "navigate" }),
    });

    expect(await response?.text()).toBe("<html>qibla</html>");
    expect(sw.caches.stores.get("munib-pages-v1")?.has(abs("/qibla"))).toBe(true);
  });

  it("uses the navigation preload response when there is one", async () => {
    const sw = loadWorker();
    const { response } = await sw.dispatch("fetch", {
      request: request("/", { mode: "navigate" }),
      preloadResponse: Promise.resolve(basic("<html>preloaded</html>")),
    });
    expect(await response?.text()).toBe("<html>preloaded</html>");
    expect(sw.fetch).not.toHaveBeenCalled();
  });

  it("falls back offline: this page, then the app shell, then an offline page", async () => {
    const sw = loadWorker({ precache: ["/"], buildId: "b1" });
    sw.network.set(abs("/"), "<html>shell</html>");
    sw.network.set(abs("/tracker"), "<html>tracker</html>");
    await sw.dispatch("install");
    await sw.dispatch("fetch", { request: request("/tracker", { mode: "navigate" }) });
    sw.state.online = false;

    const page = await sw.dispatch("fetch", {
      request: request("/tracker?tab=today", { mode: "navigate" }),
    });
    expect(await page.response?.text()).toBe("<html>tracker</html>");

    const shell = await sw.dispatch("fetch", { request: request("/hadith", { mode: "navigate" }) });
    expect(await shell.response?.text()).toBe("<html>shell</html>");

    const empty = loadWorker({ online: false });
    const offline = await empty.dispatch("fetch", { request: request("/", { mode: "navigate" }) });
    expect(offline.response?.status).toBe(503);
    expect(await offline.response?.text()).toContain("You are offline");
  });

  it("serves content-hashed bundles cache-first", async () => {
    const sw = loadWorker();
    const url = "/_expo/static/js/web/tracker-0b7ca4b50e87f658beb670e1f220ec1f.js";
    sw.network.set(abs(url), "bundle");

    await sw.dispatch("fetch", { request: request(url) });
    sw.state.online = false;
    const { response } = await sw.dispatch("fetch", { request: request(url) });

    expect(await response?.text()).toBe("bundle");
    expect(sw.fetch).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["a cross-origin API call", "https://api.example.com/v1/sync"],
    ["on-device ML models", "/recitation-models/model.onnx"],
    ["an unknown same-origin path", "/sitemap.xml"],
  ])("leaves %s to the network", async (_label, url) => {
    const sw = loadWorker();
    const { responded } = await sw.dispatch("fetch", { request: request(url) });
    expect(responded).toBe(false);
  });

  it("ignores non-GET requests", async () => {
    const sw = loadWorker();
    const { responded } = await sw.dispatch("fetch", {
      request: request("/assets/images/icon-192.png", { method: "POST" }),
    });
    expect(responded).toBe(false);
  });
});

describe("service worker — notification clicks", () => {
  const click = (data: Record<string, unknown>) => ({
    notification: { close: jest.fn(), data },
    action: "",
  });

  it("navigates and focuses an open app window", async () => {
    const focused = { focus: jest.fn(async () => undefined) };
    const win = {
      url: `${ORIGIN}/`,
      focus: jest.fn(),
      navigate: jest.fn(async () => focused),
    };
    const sw = loadWorker({ windows: [win] });

    await sw.dispatch("notificationclick", click({ type: "prayer" }));

    expect(win.navigate).toHaveBeenCalledWith(`${ORIGIN}/tracker`);
    expect(focused.focus).toHaveBeenCalled();
    expect(sw.self.clients.openWindow).not.toHaveBeenCalled();
  });

  it("opens a new window when the open one can't be navigated", async () => {
    const win = {
      url: `${ORIGIN}/`,
      focus: jest.fn(),
      navigate: jest.fn(async () => Promise.reject(new TypeError("not controlled"))),
    };
    const sw = loadWorker({ windows: [win] });

    await sw.dispatch("notificationclick", click({ url: "/qibla" }));

    expect(sw.self.clients.openWindow).toHaveBeenCalledWith(`${ORIGIN}/qibla`);
  });

  it("never follows an off-site URL from a push payload", async () => {
    const sw = loadWorker();
    await sw.dispatch("notificationclick", click({ url: "https://evil.example/" }));
    expect(sw.self.clients.openWindow).toHaveBeenCalledWith(`${ORIGIN}/`);
  });
});

describe("scripts/generate-sw-precache.mjs", () => {
  let dist: string;

  beforeEach(() => {
    dist = mkdtempSync(join(tmpdir(), "munib-sw-"));
    const page = (bundle: string) =>
      `<html><head><link rel="preload" href="/_expo/static/js/web/__common-abc.js"></head>` +
      `<body><script src="/_expo/static/js/web/${bundle}"></script></body></html>`;
    writeFileSync(join(dist, "index.html"), page("index-111.js"));
    writeFileSync(join(dist, "tracker.html"), page("tracker-222.js"));
    mkdirSync(join(dist, "qibla"));
    writeFileSync(join(dist, "qibla", "index.html"), page("qibla-333.js"));
    // A non-core page: its entry chunk is precached, its HTML is not.
    mkdirSync(join(dist, "hadith"));
    writeFileSync(join(dist, "hadith", "bukhari.html"), page("collection-444.js"));
    writeFileSync(join(dist, "manifest.json"), "{}");
    writeFileSync(join(dist, "expo-service-worker.js"), SW_SOURCE);
  });
  afterEach(() => rmSync(dist, { recursive: true, force: true }));

  function run(): string {
    execFileSync(process.execPath, [join(APP_DIR, "scripts", "generate-sw-precache.mjs"), dist], {
      stdio: "pipe",
    });
    return readFileSync(join(dist, "expo-service-worker.js"), "utf8");
  }

  it("injects the shell routes, every page's entry bundles and a content build id", () => {
    const output = run();
    const urls = JSON.parse(/const PRECACHE_URLS = (\[[^\]]*\]);/.exec(output)?.[1] ?? "[]");
    expect(urls).toEqual([
      "/",
      "/tracker",
      "/qibla",
      "/_expo/static/js/web/__common-abc.js",
      "/_expo/static/js/web/collection-444.js",
      "/_expo/static/js/web/index-111.js",
      "/_expo/static/js/web/qibla-333.js",
      "/_expo/static/js/web/tracker-222.js",
      "/manifest.json",
    ]);
    expect(output).toMatch(/const BUILD_ID = "[0-9a-f]{16}";/);
    // The rest of the worker is untouched and still valid JavaScript.
    expect(() => new vm.Script(output)).not.toThrow();
  });

  it("changes the build id when a page changes (so browsers install the update)", () => {
    const first = /const BUILD_ID = "([^"]+)"/.exec(run())?.[1];
    writeFileSync(join(dist, "expo-service-worker.js"), SW_SOURCE);
    writeFileSync(join(dist, "tracker.html"), "<html>changed</html>");
    const second = /const BUILD_ID = "([^"]+)"/.exec(run())?.[1];
    expect(second).not.toBe(first);
  });
});
