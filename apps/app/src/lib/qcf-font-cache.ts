import {
  deleteAsync,
  documentDirectory,
  downloadAsync,
  getInfoAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
} from "expo-file-system/legacy";
import * as Font from "expo-font";
import { Platform } from "react-native";

import {
  QCF_BSML_FONT_FAMILY,
  qcfBsmlFontRemoteUrl,
  qcfPageFontFamily,
  qcfPageFontRemoteUrl,
} from "@/lib/arabic-fonts";

/**
 * On-demand cache for QCF V2 per-page mushaf fonts (~350 KB each, 604 pages).
 * Fonts download on first mushaf-page view and replay from local storage afterward.
 *
 * Native: persistent files under app documents (`munib-qcf-fonts/`).
 * Web: Cache Storage bucket `munib-qcf-fonts-v1` + in-session `blob:` URLs for
 * `expo-font` (same pattern as {@link resolveCachedAudioUri} in audio-cache.ts).
 */

const QCF_FONT_CACHE_DIR = `${documentDirectory ?? ""}munib-qcf-fonts/`;
const WEB_QCF_FONT_CACHE = "munib-qcf-fonts-v1";

/** How many mushaf page fonts to register ahead of the current page (mirrors audio prefetch). */
const QCF_FONT_PREFETCH_AHEAD = 2;
/** One page behind for Previous / RTL back navigation. */
const QCF_FONT_PREFETCH_BEHIND = 1;
const QCF_PAGE_COUNT = 604;

const inflight = new Map<number, Promise<string>>();
const webInflight = new Map<number, Promise<string>>();
const webObjectUrls = new Map<number, string>();
const loadedPages = new Set<number>();
const fontLoadInflight = new Map<number, Promise<void>>();
/** Last reader page we prefetched bytes for — skips duplicate warm calls. */
let warmedAnchorPage: number | null = null;
const webRegisteredFamilies = new Set<string>();
let bsmlLoaded = false;
let bsmlLoadInflight: Promise<void> | null = null;
let bsmlUriInflight: Promise<string> | null = null;
let webBsmlObjectUrl: string | null = null;

export function isQcfPageFontLoaded(page: number): boolean {
  return loadedPages.has(page);
}

export function isQcfBsmlFontLoaded(): boolean {
  return bsmlLoaded;
}

/** True when the page font (and optional basmala font) is registered for rendering. */
export function isMushafPageFontReady(page: number, needsBsml: boolean): boolean {
  return isQcfPageFontLoaded(page) && (!needsBsml || isQcfBsmlFontLoaded());
}

function nativeStoreAvailable(): boolean {
  return Platform.OS !== "web" && Boolean(documentDirectory);
}

function localPathFor(page: number): string {
  const fileName = qcfPageFontRemoteUrl(page).split("/").pop();
  return `${QCF_FONT_CACHE_DIR}${fileName}`;
}

function webCacheAvailable(): boolean {
  return (
    Platform.OS === "web" &&
    typeof caches !== "undefined" &&
    typeof fetch !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function"
  );
}

async function resolveWebCachedQcfFontUri(page: number): Promise<string> {
  const remoteUri = qcfPageFontRemoteUrl(page);
  if (!webCacheAvailable()) return remoteUri;

  const existing = webObjectUrls.get(page);
  if (existing) return existing;

  const pending = webInflight.get(page);
  if (pending) return pending;

  const task = (async () => {
    try {
      const cache = await caches.open(WEB_QCF_FONT_CACHE);
      let cached = (await cache.match(remoteUri, { ignoreVary: true })) ?? undefined;
      if (cached && cached.type === "opaque") cached = undefined;

      if (!cached) {
        const net = await fetch(remoteUri, { mode: "cors", credentials: "omit" });
        if (!net.ok) return remoteUri;
        try {
          await cache.put(remoteUri, net.clone());
        } catch {
          // Quota or opaque put failure — still register from the fetched response.
        }
        cached = net;
      }

      const blob = await cached.blob();
      if (blob.size === 0) return remoteUri;
      const objectUrl = URL.createObjectURL(blob);
      webObjectUrls.set(page, objectUrl);
      return objectUrl;
    } catch {
      return remoteUri;
    } finally {
      webInflight.delete(page);
    }
  })();

  webInflight.set(page, task);
  return task;
}

/** Resolve a mushaf page font to a locally cached URI when possible. */
export async function resolveCachedQcfFontUri(page: number): Promise<string> {
  if (Platform.OS === "web") return resolveWebCachedQcfFontUri(page);
  if (!nativeStoreAvailable()) return qcfPageFontRemoteUrl(page);

  const localUri = localPathFor(page);
  try {
    const info = await getInfoAsync(localUri);
    if (info.exists) return localUri;
  } catch {
    return qcfPageFontRemoteUrl(page);
  }

  const pending = inflight.get(page);
  if (pending) return pending;

  const remoteUri = qcfPageFontRemoteUrl(page);
  const task = (async () => {
    try {
      await makeDirectoryAsync(QCF_FONT_CACHE_DIR, { intermediates: true });
      const result = await downloadAsync(remoteUri, localUri);
      return result.uri;
    } catch {
      return remoteUri;
    } finally {
      inflight.delete(page);
    }
  })();

  inflight.set(page, task);
  return task;
}

/** Resolve the shared basmala font to a locally cached URI when possible. */
async function resolveCachedQcfBsmlFontUri(): Promise<string> {
  const remoteUri = qcfBsmlFontRemoteUrl();
  if (Platform.OS === "web") {
    if (!webCacheAvailable()) return remoteUri;
    if (webBsmlObjectUrl) return webBsmlObjectUrl;
    if (bsmlUriInflight) return bsmlUriInflight;

    bsmlUriInflight = (async () => {
      try {
        const cache = await caches.open(WEB_QCF_FONT_CACHE);
        let cached = (await cache.match(remoteUri, { ignoreVary: true })) ?? undefined;
        if (cached && cached.type === "opaque") cached = undefined;
        if (!cached) {
          const net = await fetch(remoteUri, { mode: "cors", credentials: "omit" });
          if (!net.ok) return remoteUri;
          try {
            await cache.put(remoteUri, net.clone());
          } catch {
            // Quota or opaque put failure.
          }
          cached = net;
        }
        const blob = await cached.blob();
        if (blob.size === 0) return remoteUri;
        webBsmlObjectUrl = URL.createObjectURL(blob);
        return webBsmlObjectUrl;
      } catch {
        return remoteUri;
      } finally {
        bsmlUriInflight = null;
      }
    })();
    return bsmlUriInflight;
  }

  if (!nativeStoreAvailable()) return remoteUri;
  const localUri = `${QCF_FONT_CACHE_DIR}QCF2BSML.ttf`;
  try {
    const info = await getInfoAsync(localUri);
    if (info.exists) return localUri;
  } catch {
    return remoteUri;
  }

  if (bsmlUriInflight) return bsmlUriInflight;
  bsmlUriInflight = (async () => {
    try {
      await makeDirectoryAsync(QCF_FONT_CACHE_DIR, { intermediates: true });
      const result = await downloadAsync(remoteUri, localUri);
      return result.uri;
    } catch {
      return remoteUri;
    } finally {
      bsmlUriInflight = null;
    }
  })();
  return bsmlUriInflight;
}

/**
 * Register a QCF family with the runtime. On web uses the CSS FontFace API so
 * icon fonts are not torn down by expo-font's global loader (avoids toolbar FOUT).
 */
async function registerQcfFontFamily(family: string, uri: string): Promise<void> {
  if (
    Platform.OS === "web" &&
    typeof FontFace !== "undefined" &&
    typeof document !== "undefined" &&
    !webRegisteredFamilies.has(family)
  ) {
    try {
      const face = new FontFace(family, `url("${uri}")`);
      const loaded = await face.load();
      document.fonts.add(loaded);
      webRegisteredFamilies.add(family);
      return;
    } catch (error) {
      console.warn("[mushaf] FontFace registration failed, falling back to expo-font", error);
    }
  }
  await Font.loadAsync({ [family]: uri });
  if (Platform.OS === "web") webRegisteredFamilies.add(family);
}

/** Download (if needed), register with expo-font, and mark the basmala font ready. */
export async function loadQcfBsmlFont(): Promise<void> {
  if (bsmlLoaded) return;
  if (bsmlLoadInflight) return bsmlLoadInflight;

  bsmlLoadInflight = resolveCachedQcfBsmlFontUri()
    .then((uri) => registerQcfFontFamily(QCF_BSML_FONT_FAMILY, uri))
    .then(() => {
      bsmlLoaded = true;
      bsmlLoadInflight = null;
    })
    .catch((error: unknown) => {
      bsmlLoadInflight = null;
      console.warn("[mushaf] failed to load QCF basmala font", error);
      throw error;
    });
  return bsmlLoadInflight;
}

/** Warm the byte cache for a mushaf page font (no expo-font registration). */
export function prefetchQcfFont(page: number): void {
  if (page < 1 || page > QCF_PAGE_COUNT) return;
  void resolveCachedQcfFontUri(page).catch(() => {});
}

function isValidQcfPage(page: number): boolean {
  return page >= 1 && page <= QCF_PAGE_COUNT;
}

/**
 * Byte-cache mushaf fonts around the reader anchor (no expo-font registration).
 * Registration happens in {@link ensureMushafPageFonts} before a page turn so
 * `Font.loadAsync` never runs over visible chrome mid-read.
 */
export function warmQcfFontsAround(anchorPage: number): void {
  if (!isValidQcfPage(anchorPage)) return;
  if (warmedAnchorPage === anchorPage) return;
  warmedAnchorPage = anchorPage;

  for (let offset = -QCF_FONT_PREFETCH_BEHIND; offset <= QCF_FONT_PREFETCH_AHEAD; offset++) {
    prefetchQcfFont(anchorPage + offset);
  }
}

/** Register the page font (+ basmala when needed). Resolves immediately if already loaded. */
export async function ensureMushafPageFonts(page: number, needsBsml: boolean): Promise<void> {
  const loads: Promise<void>[] = [loadQcfPageFont(page)];
  if (needsBsml) loads.push(loadQcfBsmlFont());
  await Promise.all(loads);
}

/** Download (if needed), register with expo-font, and mark a page font ready for rendering. */
export async function loadQcfPageFont(page: number): Promise<void> {
  if (loadedPages.has(page)) return;
  const pending = fontLoadInflight.get(page);
  if (pending) return pending;

  const family = qcfPageFontFamily(page);
  const task = resolveCachedQcfFontUri(page)
    .then((uri) => registerQcfFontFamily(family, uri))
    .then(() => {
      loadedPages.add(page);
      fontLoadInflight.delete(page);
      prefetchQcfFont(page + QCF_FONT_PREFETCH_AHEAD + 1);
    })
    .catch((error: unknown) => {
      fontLoadInflight.delete(page);
      console.warn(`[mushaf] failed to load QCF page font ${family}`, error);
      throw error;
    });

  fontLoadInflight.set(page, task);
  return task;
}

/** Drop in-memory QCF registrations so the next mushaf view re-fetches/reloads fonts. */
export async function resetQcfFontRuntime(): Promise<void> {
  const pages = [...loadedPages];
  const hadBsml = bsmlLoaded;
  loadedPages.clear();
  fontLoadInflight.clear();
  warmedAnchorPage = null;
  webRegisteredFamilies.clear();
  bsmlLoaded = false;
  bsmlLoadInflight = null;
  const unloads = pages.map((p) => Font.unloadAsync(qcfPageFontFamily(p)).catch(() => undefined));
  if (hadBsml) {
    unloads.push(Font.unloadAsync(QCF_BSML_FONT_FAMILY).catch(() => undefined));
  }
  await Promise.all(unloads);
}

async function getWebQcfFontCacheInfo(): Promise<{ bytes: number; count: number }> {
  if (!webCacheAvailable()) return { bytes: 0, count: 0 };
  try {
    const cache = await caches.open(WEB_QCF_FONT_CACHE);
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
          // Unreadable — counted, size unknown.
        }
      }
    }
    return { bytes, count: requests.length };
  } catch {
    return { bytes: 0, count: 0 };
  }
}

/** On-device size + file count of cached mushaf page fonts. */
export async function getQcfFontCacheInfo(): Promise<{ bytes: number; count: number }> {
  if (Platform.OS === "web") return getWebQcfFontCacheInfo();
  if (!nativeStoreAvailable()) return { bytes: 0, count: 0 };
  try {
    const dirInfo = await getInfoAsync(QCF_FONT_CACHE_DIR);
    if (!dirInfo.exists) return { bytes: 0, count: 0 };
    const files = await readDirectoryAsync(QCF_FONT_CACHE_DIR);
    let total = 0;
    for (const name of files) {
      try {
        const info = await getInfoAsync(`${QCF_FONT_CACHE_DIR}${name}`);
        if (info.exists && typeof info.size === "number") total += info.size;
      } catch {
        // Skip an entry we can't stat.
      }
    }
    return { bytes: total, count: files.length };
  } catch {
    return { bytes: 0, count: 0 };
  }
}

/** Delete every cached mushaf page font (native files or web cache bucket). */
export async function clearQcfFontCache(): Promise<void> {
  await resetQcfFontRuntime();
  inflight.clear();
  webInflight.clear();

  if (Platform.OS === "web") {
    for (const url of webObjectUrls.values()) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Best-effort revoke.
      }
    }
    webObjectUrls.clear();
    if (webBsmlObjectUrl) {
      try {
        URL.revokeObjectURL(webBsmlObjectUrl);
      } catch {
        // Best-effort revoke.
      }
      webBsmlObjectUrl = null;
    }
    if (typeof caches !== "undefined") {
      try {
        await caches.delete(WEB_QCF_FONT_CACHE);
      } catch {
        // Best-effort.
      }
    }
    return;
  }

  if (!nativeStoreAvailable()) return;
  try {
    await deleteAsync(QCF_FONT_CACHE_DIR, { idempotent: true });
  } catch {
    // Best-effort.
  }
}
