/**
 * Learn-content overlay registry — loads only the active locale's corpora.
 *
 * Prefer {@link preloadContentOverlays} after locale changes so accessors can
 * resolve synchronously. Until a corpus is cached, overlays fall back to English.
 */
import {
  buildContentOverlay,
  buildContentOverlays,
  type ContentOverlay,
  type ContentOverlays,
  type OverlayLocale,
} from "@munib-tracker/shared/content-i18n";
import { isAppLocale } from "@munib-tracker/shared/i18n";

import {
  CONTENT_OVERLAY_CORPORA,
  CONTENT_OVERLAY_LOADERS,
  type ContentOverlayCorpus,
  OVERLAY_BASE_KEY_CORPUS,
} from "./content-overlay-loaders";

type OverlayModule = Record<string, unknown>;

const moduleCache = new Map<string, OverlayModule>();
const inflight = new Map<string, Promise<OverlayModule>>();
let readyVersion = 0;
const listeners = new Set<() => void>();

function cacheKey(corpus: ContentOverlayCorpus, locale: OverlayLocale): string {
  return `${corpus}.${locale}`;
}

function notifyReady(): void {
  readyVersion += 1;
  for (const listener of listeners) listener();
}

/** Subscribe to overlay preload completion (for React re-render after English flash). */
export function subscribeContentOverlays(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Bumps when a locale corpus finishes loading — use as a memo/effect dependency. */
export function getContentOverlaysReadyVersion(): number {
  return readyVersion;
}

function activeOverlayLocale(): OverlayLocale | undefined {
  // Lazy require avoids a cycle with `i18n/index` (which preloads overlays).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const i18n = require("@/i18n").default as { language?: string };
  const lang = i18n.language?.split("-")[0];
  if (!lang || lang === "en" || !isAppLocale(lang)) return undefined;
  return lang as OverlayLocale;
}

async function loadCorpusModule(
  corpus: ContentOverlayCorpus,
  locale: OverlayLocale,
): Promise<OverlayModule> {
  const key = cacheKey(corpus, locale);
  const cached = moduleCache.get(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const loader = CONTENT_OVERLAY_LOADERS[corpus][locale];
  const promise = loader()
    .then((mod) => {
      // ESM interop: prefer namespace object; some bundlers nest under default.
      const resolved =
        mod && typeof mod === "object" && "default" in mod && Object.keys(mod).length === 1
          ? ((mod as { default: OverlayModule }).default ?? mod)
          : mod;
      moduleCache.set(key, resolved);
      inflight.delete(key);
      return resolved;
    })
    .catch((error) => {
      inflight.delete(key);
      throw error;
    });

  inflight.set(key, promise);
  return promise;
}

/** Prefetch every Learn overlay corpus for `locale` (no-op for English). */
export async function preloadContentOverlays(locale: string | undefined): Promise<void> {
  const code = locale?.split("-")[0];
  if (!code || code === "en" || !isAppLocale(code)) return;
  const overlayLocale = code as OverlayLocale;

  try {
    await Promise.all(
      CONTENT_OVERLAY_CORPORA.map((corpus) => loadCorpusModule(corpus, overlayLocale)),
    );
    notifyReady();
  } catch {
    // Jest (and other non-bundler VMs) may reject dynamic import(); English
    // fallbacks remain correct until a real runtime loads the overlays.
  }
}

function moduleExportsForBaseKey(baseKey: string): Record<string, unknown> {
  const locale = activeOverlayLocale();
  if (!locale) return {};

  const corpus = OVERLAY_BASE_KEY_CORPUS[baseKey];
  if (!corpus) return {};

  const mod = moduleCache.get(cacheKey(corpus, locale));
  if (!mod) {
    // Kick off load; callers re-render via subscribeContentOverlays / preload.
    void loadCorpusModule(corpus, locale)
      .then(() => notifyReady())
      .catch(() => {
        // Ignore — English fallback until a real runtime can load overlays.
      });
    return {};
  }

  const exportName = `${baseKey}_${locale.toUpperCase()}`;
  if (!(exportName in mod)) return {};
  return { [exportName]: mod[exportName] };
}

export function overlayList<T>(baseKey: string): ContentOverlays<T> {
  return buildContentOverlays<T>(baseKey, moduleExportsForBaseKey(baseKey));
}

export function overlayObject<T>(baseKey: string): ContentOverlay<T> {
  return buildContentOverlay<T>(baseKey, moduleExportsForBaseKey(baseKey));
}
