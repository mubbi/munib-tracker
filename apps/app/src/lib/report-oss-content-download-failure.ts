import type {
  OssContentDownloadFailureMeta,
  OssContentErrorCode,
  OssContentKind,
} from "@munib-tracker/shared/types/oss-content-download-failure";

import { SessionStore } from "@/auth/session-store";
import { resolveAppPlatform } from "@/lib/app/resolve-app-platform";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";
import { submitOssContentDownloadFailure } from "@/lib/oss-content-failure-api";
import { captureAppException } from "@/lib/sentry";
import { preferencesStore } from "@/stores/preferences-store";

const DEDUPE_WINDOW_MS = 15 * 60 * 1000;
const recentKeys = new Map<string, number>();
const PENDING_QUEUE_MAX = 20;
const pendingWithoutSession: ReportOssContentFailureInput[] = [];

export type ReportOssContentFailureInput = {
  contentKind: OssContentKind;
  contentKey: string;
  sourceProvider: string;
  sourceUrl: string;
  contentMeta?: OssContentDownloadFailureMeta;
  errorCode: OssContentErrorCode;
  errorMessage: string;
  httpStatus?: number;
  error?: unknown;
};

function pruneDedupe(now: number): void {
  for (const [key, at] of recentKeys) {
    if (now - at > DEDUPE_WINDOW_MS) recentKeys.delete(key);
  }
}

function shouldReport(contentKey: string, errorCode: string): boolean {
  const dedupeKey = `${contentKey}|${errorCode}`;
  const now = Date.now();
  pruneDedupe(now);
  const last = recentKeys.get(dedupeKey);
  if (last != null && now - last < DEDUPE_WINDOW_MS) return false;
  recentKeys.set(dedupeKey, now);
  return true;
}

/** @internal Test helper — clear in-process dedupe window / pending queue. */
export function clearOssContentFailureDedupe(): void {
  recentKeys.clear();
  pendingWithoutSession.length = 0;
}

async function postFailure(
  accessToken: string,
  input: ReportOssContentFailureInput,
  platform: "ios" | "android" | "web",
): Promise<void> {
  const prefs = preferencesStore.getState().prefs;
  await submitOssContentDownloadFailure(accessToken, {
    contentKind: input.contentKind,
    contentKey: input.contentKey.slice(0, 256),
    sourceProvider: input.sourceProvider.slice(0, 128),
    sourceUrl: input.sourceUrl.slice(0, 2048),
    contentMeta: input.contentMeta ?? {},
    errorCode: input.errorCode,
    errorMessage: input.errorMessage.slice(0, 2000),
    httpStatus: input.httpStatus,
    appVersion: resolveAppVersion(),
    platform,
    locale: prefs.locale,
    translationLocale: prefs.translationLocale,
  });
}

/**
 * Flush failures that happened before a guest/user session existed.
 * Call from auth bootstrap once an access token is available.
 */
export function flushPendingOssContentFailures(): void {
  if (pendingWithoutSession.length === 0) return;
  const queued = pendingWithoutSession.splice(0, pendingWithoutSession.length);
  for (const input of queued) {
    void (async () => {
      try {
        const platform = resolveAppPlatform();
        if (platform !== "ios" && platform !== "android" && platform !== "web") return;
        const session = await SessionStore.get();
        if (!session?.accessToken) {
          if (pendingWithoutSession.length < PENDING_QUEUE_MAX) {
            pendingWithoutSession.push(input);
          }
          return;
        }
        await postFailure(session.accessToken, input, platform);
      } catch {
        // Telemetry must never break scripture / cache UX.
      }
    })();
  }
}

/**
 * Report a failed on-demand OSS CDN download to Sentry and the API.
 * Never throws — callers keep their existing error / fallback UX.
 */
export function reportOssContentDownloadFailure(input: ReportOssContentFailureInput): void {
  if (!shouldReport(input.contentKey, input.errorCode)) return;

  const platform = resolveAppPlatform();
  if (platform !== "ios" && platform !== "android" && platform !== "web") return;

  const error =
    input.error instanceof Error
      ? input.error
      : new Error(input.errorMessage || `OSS download failed: ${input.contentKey}`);

  captureAppException(error, {
    tags: {
      oss_content_kind: input.contentKind,
      oss_error_code: input.errorCode,
      oss_source_provider: input.sourceProvider,
    },
    extra: {
      contentKey: input.contentKey,
      sourceUrl: input.sourceUrl,
      httpStatus: input.httpStatus,
      contentMeta: input.contentMeta ?? {},
    },
    fingerprint: ["oss-content-download", input.contentKind, input.contentKey, input.errorCode],
  });

  void (async () => {
    try {
      const session = await SessionStore.get();
      if (!session?.accessToken) {
        if (pendingWithoutSession.length < PENDING_QUEUE_MAX) {
          pendingWithoutSession.push(input);
        }
        return;
      }
      await postFailure(session.accessToken, input, platform);
    } catch {
      // Telemetry must never break scripture / cache UX.
    }
  })();
}

const HTTP_STATUS_RE = /HTTP\s+(\d{3})\b/i;

/** Parse `HTTP 404 for …` style messages from {@link fetchStaticJson}. */
export function httpStatusFromMessage(message: string): number | undefined {
  const match = HTTP_STATUS_RE.exec(message);
  if (!match?.[1]) return undefined;
  const status = Number(match[1]);
  return Number.isFinite(status) ? status : undefined;
}

export function classifyFetchError(error: unknown): {
  errorCode: OssContentErrorCode;
  errorMessage: string;
  httpStatus?: number;
} {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  const httpStatus = httpStatusFromMessage(message);
  if (httpStatus != null) {
    return { errorCode: "http_error", errorMessage: message, httpStatus };
  }
  if (/network|failed to fetch|timeout|offline|aborted/i.test(message)) {
    return { errorCode: "network_error", errorMessage: message };
  }
  if (/json|unexpected token|syntaxerror/i.test(message)) {
    return { errorCode: "parse_error", errorMessage: message };
  }
  return { errorCode: "download_failed", errorMessage: message };
}
