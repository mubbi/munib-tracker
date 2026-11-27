/**
 * Service worker for Munib Tracker's web build / installed PWA:
 *  1. Offline app shell — precaches the core routes' HTML + bundles at install
 *     (list injected by scripts/generate-sw-precache.mjs after `expo export`),
 *     network-first navigations with an offline fallback, cache-first for
 *     content-hashed static files, stale-while-revalidate for icons/manifest.
 *  2. Offline audio cache — cache-first storage for streamed recitation/audio so
 *     the PWA replays clips from local storage instead of re-downloading from the
 *     CDN. Managed from Settings → Offline data via postMessage.
 *  3. Web Push — show notifications and route notification clicks.
 *
 * Follows the web.dev / Chrome service-worker lifecycle guidance: old shell
 * caches are pruned in `activate`, hashed files are never re-fetched, and every
 * failure path degrades to a plain network fetch (never worse than no SW).
 */
const ICON_URL = "/assets/images/icon-192.png";
const BADGE_URL = "/assets/images/icon-192.png";

// ── Offline app shell ────────────────────────────────────────────────────────
// Both values are rewritten in dist/ by scripts/generate-sw-precache.mjs, so each
// deploy changes the SW bytes (= the browser installs the update). Under
// `expo start` they stay empty: dev only gets the runtime caches below.
const BUILD_ID = "dev";
const PRECACHE_URLS = [];

const SHELL_CACHE_PREFIX = "munib-shell-";
const SHELL_CACHE = `${SHELL_CACHE_PREFIX}${BUILD_ID}`;
/** Visited pages (network-first copies) for offline navigations. */
const PAGES_CACHE = "munib-pages-v1";
/** Content-hashed bundles / fonts / images — immutable, cache-first. */
const STATIC_CACHE = "munib-static-v1";
/** Icons + manifest — stale-while-revalidate. */
const RUNTIME_CACHE = "munib-runtime-v1";
const MAX_PAGES = 60;
const MAX_STATIC = 400;
const MAX_RUNTIME = 80;
/** Large on-device ML assets manage their own caching — never copy them here. */
const BYPASS_PREFIXES = ["/recitation-models/", "/ort/", "/.well-known/"];
/** Metro/Expo content hash in a file name (`name-<32 hex>.js`, `name.<32 hex>.ttf`). */
const HASHED_FILE = /[.-][0-9a-f]{20,}\.[a-z0-9]+$/i;

const OFFLINE_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  "<title>Munib Tracker — offline</title><style>:root{color-scheme:light dark}" +
  "body{margin:0;min-height:100vh;display:grid;place-items:center;" +
  "font:16px/1.5 system-ui,sans-serif;background:#F5F0E6;color:#152921;" +
  "text-align:center;padding:24px}@media (prefers-color-scheme:dark){" +
  "body{background:#152921;color:#EEE4D2}}button{font:inherit;padding:10px 20px;" +
  "border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;" +
  "cursor:pointer;min-height:44px}</style>" +
  "</head><body><main><h1>You are offline</h1>" +
  "<p>Munib Tracker will open as soon as you are back online.</p>" +
  '<button type="button" onclick="location.reload()">Try again</button></main></body></html>';

function sameOriginUrl(request) {
  try {
    const url = new URL(request.url);
    return url.origin === self.location.origin ? url : null;
  } catch {
    return null;
  }
}

/** Keep a cache to roughly `max` entries (oldest inserted first out). */
async function trimCache(cacheName, max) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
  } catch {
    // Best effort.
  }
}

/** Precache one URL; failures are tolerated so push/audio still install. */
async function precacheOne(cache, url) {
  try {
    // no-cache = revalidate with the server (a cheap 304 for files the page
    // just loaded) instead of trusting a possibly stale HTTP-cache entry.
    const response = await fetch(
      new Request(url, { cache: "no-cache", credentials: "same-origin" }),
    );
    if (response.ok && !response.redirected) await cache.put(url, response);
  } catch {
    // Offline during install — the runtime caches fill in later.
  }
}

/** Parallel downloads during install (~300 small files; don't flood the network). */
const PRECACHE_CONCURRENCY = 8;

async function precacheShell() {
  if (PRECACHE_URLS.length === 0) return;
  const cache = await caches.open(SHELL_CACHE);
  const queue = [...PRECACHE_URLS];
  const worker = async () => {
    while (queue.length > 0) await precacheOne(cache, queue.shift());
  };
  await Promise.all(Array.from({ length: PRECACHE_CONCURRENCY }, worker));
}

/** Network-first page load; offline → last copy of this page → app shell → offline page. */
async function handleNavigation(event) {
  const { request } = event;
  try {
    const preloaded = await event.preloadResponse;
    const response = preloaded || (await fetch(request));
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      event.waitUntil(
        caches
          .open(PAGES_CACHE)
          .then((cache) => cache.put(request.url, copy))
          .then(() => trimCache(PAGES_CACHE, MAX_PAGES))
          .catch(() => {}),
      );
    }
    return response;
  } catch {
    const url = new URL(request.url);
    // The static export has no server-rendered body, so any route's HTML (or
    // the root shell) boots the client router on the requested URL.
    const cached =
      (await caches.match(request.url, { ignoreSearch: true, ignoreVary: true })) ||
      (await caches.match(url.pathname, { ignoreVary: true })) ||
      (await caches.match("/", { ignoreVary: true }));
    if (cached) return cached;
    return new Response(OFFLINE_HTML, {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}

/** Cache-first for immutable (content-hashed) same-origin files. */
async function handleHashedStatic(event) {
  const { request } = event;
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    const copy = response.clone();
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then((cache) => cache.put(request, copy))
        .then(() => trimCache(STATIC_CACHE, MAX_STATIC))
        .catch(() => {}),
    );
  }
  return response;
}

/** Stale-while-revalidate for un-hashed icons / manifest. */
async function handleRevalidatedStatic(event) {
  const { request } = event;
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request, { ignoreVary: true });
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone());
        await trimCache(RUNTIME_CACHE, MAX_RUNTIME);
      }
      return response;
    })
    .catch(() => null);
  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return (await network) || fetch(request);
}

/** Which shell strategy (if any) applies to a same-origin GET. */
function shellStrategy(request, url) {
  if (request.mode === "navigate") return "navigate";
  if (BYPASS_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return null;
  // Media streams use Range requests — leave them to the network/audio cache.
  if (request.headers.has("range")) return null;
  if (url.pathname.startsWith("/_expo/static/") || HASHED_FILE.test(url.pathname)) {
    return "hashed";
  }
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/favicon.ico" ||
    url.pathname === "/apple-touch-icon.png"
  ) {
    return "revalidate";
  }
  return null;
}

// ── Offline audio cache ──────────────────────────────────────────────────────
const AUDIO_CACHE = "munib-audio-v1";
// Hosts that serve the app's audio (see lib/quran-audio.ts, lib/adhan-audio.ts,
// shared content). Any `.mp3` request is also treated as audio.
const AUDIO_HOSTS = ["everyayah.com", "download.quranicaudio.com", "cdn.jsdelivr.net"];

function isAudioRequest(request) {
  if (request.method !== "GET") return false;
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname;
  const knownHost = AUDIO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  return knownHost || url.pathname.toLowerCase().endsWith(".mp3");
}

/** Slice a full cached response into a 206 for a media `Range` request. */
async function buildRangeResponse(fullResponse, rangeHeader) {
  const buffer = await fullResponse.arrayBuffer();
  const size = buffer.byteLength;
  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader || "");
  let start = match?.[1] ? Number.parseInt(match[1], 10) : 0;
  let end = match?.[2] ? Number.parseInt(match[2], 10) : size - 1;
  if (Number.isNaN(start)) start = 0;
  if (Number.isNaN(end) || end >= size) end = size - 1;
  if (start > end || start >= size) {
    return new Response(null, {
      status: 416,
      statusText: "Range Not Satisfiable",
      headers: { "Content-Range": `bytes */${size}` },
    });
  }
  const slice = buffer.slice(start, end + 1);
  const headers = new Headers(fullResponse.headers);
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(slice.byteLength));
  headers.set("Accept-Ranges", "bytes");
  return new Response(slice, { status: 206, statusText: "Partial Content", headers });
}

/** Cache-first audio: serve the local copy, downloading the full clip on a miss. */
async function handleAudio(request) {
  const rangeHeader = request.headers.get("range");
  let cache;
  try {
    cache = await caches.open(AUDIO_CACHE);
  } catch {
    return fetch(request);
  }
  // Range-less key so every range of a clip shares one cached full body.
  const cacheKey = new Request(request.url, { method: "GET" });

  // ignoreVary so a `Vary: Accept-Encoding` (some CDNs) can't cause a false miss.
  const cached = await cache.match(cacheKey, { ignoreVary: true });
  if (cached) {
    if (rangeHeader && cached.type !== "opaque" && cached.status === 200) {
      try {
        return await buildRangeResponse(cached.clone(), rangeHeader);
      } catch {
        // Fall through to returning the full cached body.
      }
    }
    return cached.clone();
  }

  // Miss — fetch the FULL clip (no Range) so the whole file is cached for replay.
  // Prefer a CORS fetch (readable, sizeable); fall back to no-cors (opaque) for
  // hosts without CORS so recitation still caches and plays.
  let full = null;
  try {
    full = await fetch(new Request(request.url, { mode: "cors", credentials: "omit" }));
    if (!full.ok) full = null;
  } catch {
    full = null;
  }
  if (!full) {
    try {
      full = await fetch(new Request(request.url, { mode: "no-cors", credentials: "omit" }));
    } catch {
      full = null;
    }
  }

  if (full && (full.ok || full.type === "opaque")) {
    try {
      await cache.put(cacheKey, full.clone());
    } catch {
      // Quota or opaque-put failure — playback still proceeds from the response.
    }
    if (rangeHeader && full.type !== "opaque" && full.status === 200) {
      try {
        return await buildRangeResponse(full.clone(), rangeHeader);
      } catch {
        // Fall through.
      }
    }
    return full;
  }

  // Everything failed — behave exactly as if this SW weren't here.
  return fetch(request);
}

/** Bytes (readable clips) + total file count in the audio cache. */
async function audioCacheStats() {
  let cache;
  try {
    cache = await caches.open(AUDIO_CACHE);
  } catch {
    return { bytes: 0, count: 0 };
  }
  const requests = await cache.keys();
  let bytes = 0;
  for (const req of requests) {
    const res = await cache.match(req);
    if (!res) continue;
    const len = res.headers.get("content-length");
    if (len) {
      bytes += Number.parseInt(len, 10) || 0;
    } else if (res.type !== "opaque") {
      try {
        bytes += (await res.clone().arrayBuffer()).byteLength;
      } catch {
        // Unreadable — counted below, size unknown.
      }
    }
  }
  return { bytes, count: requests.length };
}

self.addEventListener("install", (event) => {
  // Take over as soon as the new SW is ready (don't wait for all tabs to close):
  // push + audio fixes ship immediately, and pages are network-first, so a
  // running tab keeps working (hashed chunks of older builds stay cached).
  self.skipWaiting();
  event.waitUntil(precacheShell().catch(() => {}));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith(SHELL_CACHE_PREFIX) && name !== SHELL_CACHE)
          .map((name) => caches.delete(name)),
      );
      // Navigation preload starts the page request while the SW boots
      // (Chromium, Firefox, Safari 15.4+). Feature-detected.
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {
          // Unsupported — handleNavigation falls back to fetch().
        }
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Chrome DevTools quirk: only-if-cached is only valid with same-origin mode.
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;

  if (isAudioRequest(request)) {
    // Any unexpected failure degrades to a plain network fetch — never worse than
    // having no service worker at all.
    event.respondWith(handleAudio(request).catch(() => fetch(request)));
    return;
  }

  if (request.method !== "GET") return;
  const url = sameOriginUrl(request);
  if (!url) return; // Cross-origin (API, CDN JSON, maps): untouched.

  const strategy = shellStrategy(request, url);
  if (strategy === "navigate") {
    event.respondWith(handleNavigation(event));
  } else if (strategy === "hashed") {
    event.respondWith(handleHashedStatic(event).catch(() => fetch(request)));
  } else if (strategy === "revalidate") {
    event.respondWith(handleRevalidatedStatic(event).catch(() => fetch(request)));
  }
  // Everything else falls through to the network untouched.
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  const port = event.ports?.[0];
  if (data.type === "CLEAR_AUDIO_CACHE") {
    event.waitUntil(
      caches.delete(AUDIO_CACHE).then((ok) => {
        if (port) port.postMessage({ ok });
      }),
    );
  } else if (data.type === "GET_AUDIO_CACHE_SIZE") {
    event.waitUntil(
      audioCacheStats().then((stats) => {
        if (port) port.postMessage(stats);
      }),
    );
  }
});

function buildBody(primary, subtitle) {
  const s = typeof subtitle === "string" ? subtitle.trim() : "";
  if (s && primary) return `${s}\n\n${primary}`;
  return primary || s || "";
}

self.addEventListener("push", (event) => {
  let title = "Munib Tracker";
  let body = "";
  let subtitle = "";
  let data = {};
  let actions = [];
  let tag = "munib-tracker";
  if (event.data) {
    try {
      const payload = event.data.json();
      title = payload.title ?? title;
      body = payload.body ?? "";
      subtitle = payload.subtitle ?? "";
      data = payload.data && typeof payload.data === "object" ? payload.data : {};
      if (Array.isArray(payload.actions) && payload.actions.length > 0) {
        actions = payload.actions.slice(0, 2).map((a) => ({
          action: String(a.action || "open"),
          title: String(a.title || "Open"),
        }));
      }
      if (typeof payload.tag === "string" && payload.tag.length > 0) tag = payload.tag;
      else if (typeof payload.collapseId === "string" && payload.collapseId.length > 0) {
        tag = payload.collapseId;
      }
    } catch {
      body = event.data.text?.() ?? "";
    }
  }
  const combinedBody = buildBody(body, subtitle);
  const options = {
    body: combinedBody,
    icon: ICON_URL,
    badge: BADGE_URL,
    data: { ...data, title, subtitle },
    tag,
    renotify: true,
    timestamp: Date.now(),
    requireInteraction: false,
    silent: false,
    vibrate: [120, 80, 120],
  };
  if (actions.length > 0) options.actions = actions;
  event.waitUntil(self.registration.showNotification(title, options));
});

const ORIGIN = self.location?.origin ?? "";

/** Only honor same-origin paths from push payloads (never external URLs). */
function safeSameOriginPath(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.length === 0) return null;
  try {
    const resolved = new URL(rawUrl, ORIGIN || undefined);
    if (ORIGIN && resolved.origin !== ORIGIN) return null;
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return null;
  }
}

function resolveTargetUrl(payload, actionId) {
  if (actionId === "open_notifications" || payload.screen === "notifications") {
    return `${ORIGIN}/notifications`;
  }
  if (actionId === "open_tracker" || payload.screen === "tracker" || payload.tab === "tracker") {
    return `${ORIGIN}/tracker`;
  }
  if (
    actionId === "open_settings_notifications" ||
    payload.screen === "settings-notifications" ||
    payload.focus === "notifications"
  ) {
    return `${ORIGIN}/settings/notifications`;
  }
  if (
    payload.type === "prayer" ||
    payload.type === "qaza" ||
    payload.type === "reminder" ||
    payload.type === "salah_phase"
  ) {
    if (typeof payload.url === "string" && payload.url.startsWith("/")) {
      const safePath = safeSameOriginPath(payload.url);
      if (safePath) return ORIGIN + safePath;
    }
    if (typeof payload.href === "string" && payload.href.startsWith("/")) {
      const safePath = safeSameOriginPath(payload.href);
      if (safePath) return ORIGIN + safePath;
    }
    return `${ORIGIN}/tracker`;
  }

  const safePath = safeSameOriginPath(payload.url);
  if (safePath) return ORIGIN + safePath;

  return `${ORIGIN}/`;
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const action = event.action;
  if (action === "dismiss") return;

  const data = event.notification.data || {};
  const url = resolveTargetUrl(data, action);
  event.waitUntil(focusOrOpen(url).catch(() => self.clients.openWindow?.(url)));
});

/** Focus an open app window on `url` (navigating it if needed), else open one. */
async function focusOrOpen(url) {
  const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  const sameOrigin = clientList.filter((client) => client.url?.startsWith(ORIGIN));
  const exact = sameOrigin.find((client) => client.url === url);
  if (exact && "focus" in exact) return exact.focus();
  for (const client of sameOrigin) {
    if (!("focus" in client)) continue;
    try {
      // navigate() rejects for a window this SW doesn't control yet.
      const navigated = typeof client.navigate === "function" ? await client.navigate(url) : null;
      return (navigated ?? client).focus();
    } catch {
      // Try the next window, then open a new one.
    }
  }
  if (self.clients.openWindow) return self.clients.openWindow(url);
  return undefined;
}
