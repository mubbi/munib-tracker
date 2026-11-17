import type {
  OssContentDownloadFailureMeta,
  OssContentKind,
} from "@munib-tracker/shared/types/oss-content-download-failure";
import { Platform } from "react-native";

import { LruMap } from "@/lib/lru-map";
import {
  classifyFetchError,
  reportOssContentDownloadFailure,
} from "@/lib/report-oss-content-download-failure";

/**
 * In-memory cache for immutable CDN JSON (Qur'an editions, hadith corpora).
 * Scripture data never changes — once fetched in-process, skip the network.
 * Capped so browsing many editions cannot grow RAM without bound.
 */

const MAX_CACHED_URLS = 48;
const memory = new LruMap<string, unknown>(MAX_CACHED_URLS);

/** Optional identifying context so CDN failures can be reported to Sentry + API. */
export type StaticJsonFetchContext = {
  contentKind: OssContentKind;
  contentKey: string;
  sourceProvider: string;
  contentMeta?: OssContentDownloadFailureMeta;
};

/** @internal Test helper — reset the in-memory JSON cache. */
export function clearStaticJsonCache(): void {
  memory.clear();
}

const JSDELIVR_GH_RE =
  /^https:\/\/(?:cdn|fastly|gcore)\.jsdelivr\.net\/gh\/([^/]+)\/([^/@]+)@([^/]+)\/(.+)$/;

/**
 * Fallback URLs for a jsDelivr GitHub URL.
 *
 * jsDelivr refuses files from repos over its 50 MB package limit until it has
 * warmed them (`403 Package size exceeded …`, sometimes 404), and it is
 * DNS-blocked on some networks. fawazahmed0/quran-api, hadith-api and
 * spa5k/tafsir_api are all such repos, so any uncached surah/collection could
 * fail. GitHub raw serves the same file at the same ref (with
 * `Access-Control-Allow-Origin: *`), so it is a drop-in mirror.
 */
export function staticJsonMirrorUrls(url: string): string[] {
  const match = JSDELIVR_GH_RE.exec(url);
  if (!match) return [];
  const [, owner, repo, ref, path] = match;
  return [`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`];
}

class StaticJsonHttpError extends Error {
  constructor(
    readonly status: number,
    url: string,
  ) {
    super(`HTTP ${status} for ${url}`);
    this.name = "StaticJsonHttpError";
  }
}

async function fetchJsonOnce<T>(url: string): Promise<T> {
  const init: RequestInit = Platform.OS === "web" ? { cache: "force-cache" } : {};
  const res = await fetch(url, init);
  if (!res.ok) throw new StaticJsonHttpError(res.status, url);
  return (await res.json()) as T;
}

/**
 * Fetch JSON from a static CDN URL. Returns a cached value when this process
 * has already fetched the same URL. On web, also asks the browser HTTP cache
 * to reuse prior responses (`cache: "force-cache"`).
 *
 * jsDelivr GitHub URLs fall back to GitHub raw ({@link staticJsonMirrorUrls})
 * on any HTTP / network failure, so a transient jsDelivr 403/404 is invisible.
 *
 * When `context` is provided, failures (after every mirror) are reported
 * (deduped) to Sentry and the API.
 */
export async function fetchStaticJson<T>(
  url: string,
  context?: StaticJsonFetchContext,
): Promise<T> {
  const hit = memory.get(url);
  if (hit !== undefined) return hit as T;

  const candidates = [url, ...staticJsonMirrorUrls(url)];
  let firstError: unknown;
  for (const candidate of candidates) {
    try {
      const data = await fetchJsonOnce<T>(candidate);
      memory.set(url, data);
      return data;
    } catch (error) {
      firstError ??= error;
      // A 2xx body that isn't JSON is a content problem — the mirror serves the
      // same bytes, so don't bother retrying it.
      if (error instanceof SyntaxError) break;
    }
  }

  const error = firstError;
  if (context) {
    if (error instanceof StaticJsonHttpError) {
      reportOssContentDownloadFailure({
        ...context,
        sourceUrl: url,
        errorCode: "http_error",
        errorMessage: error.message,
        httpStatus: error.status,
        error,
      });
    } else {
      const classified = classifyFetchError(error);
      // Prefer parse_error when JSON body is unreadable after a successful HTTP status.
      const errorCode =
        classified.errorCode === "download_failed" && error instanceof SyntaxError
          ? "parse_error"
          : classified.errorCode;
      reportOssContentDownloadFailure({
        ...context,
        sourceUrl: url,
        ...classified,
        errorCode,
        error,
      });
    }
  }
  throw error;
}
