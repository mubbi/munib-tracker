import { captureAppException } from "@/lib/sentry";

import type { PracticeErrorCode } from "./types";

/**
 * Stable practice error codes → i18n keys (§9.5 "Needs another try" copy). The
 * same code is the Sentry `code` tag. Never put ayah text, a transcript, phoneme
 * strings, PCM, or the model path in a report (§10 Privacy).
 */
export const PRACTICE_ERROR_COPY: Record<PracticeErrorCode, string> = {
  "no-connection": "quranCompanion.error.noConnection",
  "not-enough-space": "quranCompanion.error.notEnoughSpace",
  "checksum-mismatch": "quranCompanion.error.checksum",
  "download-failed": "quranCompanion.error.downloadFailed",
  "download-cancelled": "quranCompanion.error.downloadCancelled",
  "model-missing": "quranCompanion.error.modelMissing",
  "engine-init-failed": "quranCompanion.error.didNotStart",
  "out-of-memory": "quranCompanion.error.outOfMemory",
  "runtime-unsupported": "quranCompanion.error.unsupported",
  "mic-denied": "quranCompanion.error.micDenied",
  "mic-unavailable": "quranCompanion.error.micUnavailable",
  "capture-failed": "quranCompanion.error.captureFailed",
  interrupted: "quranCompanion.error.interrupted",
  "engine-runtime": "quranCompanion.error.listeningStopped",
  unknown: "quranCompanion.error.unknown",
};

export class PracticeError extends Error {
  readonly code: PracticeErrorCode;
  constructor(code: PracticeErrorCode, message?: string) {
    super(message ?? code);
    this.name = "PracticeError";
    this.code = code;
  }
}

/** Best-effort classification of a thrown value into a stable code. */
export function toPracticeErrorCode(
  error: unknown,
  fallback: PracticeErrorCode = "unknown",
): PracticeErrorCode {
  if (error instanceof PracticeError) return error.code;
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error ?? "").toLowerCase();
  if (/out of memory|oom|bad_alloc|allocation failed/.test(message)) return "out-of-memory";
  if (/network|failed to fetch|offline|connection/.test(message)) return "no-connection";
  if (/no space|enospc|quota|storage full/.test(message)) return "not-enough-space";
  if (/permission|notallowed|denied/.test(message)) return "mic-denied";
  if (/wasm|webassembly|not supported|unsupported/.test(message)) return "runtime-unsupported";
  return fallback;
}

/** Report a practice failure. Tags only — no ayah text, transcript or audio. */
export function reportPracticeError(error: unknown, code: PracticeErrorCode, phase: string): void {
  if (code === "download-cancelled" || code === "mic-denied") return;
  captureAppException(error instanceof Error ? error : new PracticeError(code), {
    tags: { area: "quran-practice", code, phase },
  });
}
