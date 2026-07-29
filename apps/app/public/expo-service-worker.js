/**
 * Service worker for Munib Tracker's web build. Two responsibilities:
 *  1. Web Push — show notifications and route notification clicks.
 *  2. Offline audio cache — cache-first storage for streamed recitation/audio so
 *     the PWA replays clips from local storage instead of re-downloading from the
 *     CDN. Managed from Settings → Offline data via postMessage.
 */
const ICON_URL = "/assets/images/icon-192.png";
const BADGE_URL = "/assets/images/icon-192.png";

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

self.addEventListener("install", () => {
  // Take over as soon as the caching SW is ready (don't wait for all tabs to close).
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (isAudioRequest(event.request)) {
    // Any unexpected failure degrades to a plain network fetch — never worse than
    // having no service worker at all.
    event.respondWith(handleAudio(event.request).catch(() => fetch(event.request)));
  }
  // All other requests fall through to the network untouched.
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
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    }),
  );
});
