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

/**
 * Fetch JSON from a static CDN URL. Returns a cached value when this process
 * has already fetched the same URL. On web, also asks the browser HTTP cache
 * to reuse prior responses (`cache: "force-cache"`).
 *
 * When `context` is provided, failures are reported (deduped) to Sentry and the API.
 */
export async function fetchStaticJson<T>(
  url: string,
  context?: StaticJsonFetchContext,
): Promise<T> {
  const hit = memory.get(url);
  if (hit !== undefined) return hit as T;

  const init: RequestInit = Platform.OS === "web" ? { cache: "force-cache" } : {};

  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const error = new Error(`HTTP ${res.status} for ${url}`);
      if (context) {
        reportOssContentDownloadFailure({
          ...context,
          sourceUrl: url,
          errorCode: "http_error",
          errorMessage: error.message,
          httpStatus: res.status,
          error,
        });
      }
      throw error;
    }

    const data = (await res.json()) as T;
    memory.set(url, data);
    return data;
  } catch (error) {
    if (context && !(error instanceof Error && error.message.startsWith("HTTP "))) {
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
    throw error;
  }
}
