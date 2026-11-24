/**
 * Cache-first Quranic Arabic Corpus morphology file (NF-3.22, D22). Fetched only
 * when the person opens root search (or a root chip) and agrees to the
 * one-time download; afterwards everything works offline from the stored copy.
 *
 * The stored copy is kept exactly as downloaded. Every read is verified against
 * the pinned LF-normalised sha256; a mismatch deletes the file and surfaces the
 * typed `morphology-hash` error (never a partially trusted file).
 */
import {
  type CancelSignal,
  type DownloadProgress,
  deleteStoredMorphology,
  downloadMorphologyFrom,
  readStoredMorphology,
} from "@/lib/quran-morphology/raw-store";
import {
  MorphologyError,
  QAC_MORPHOLOGY,
  verifyMorphologyTextChunked,
} from "@/lib/quran-morphology/source";
import { captureAppException } from "@/lib/sentry";

export type { CancelSignal, DownloadProgress };

type Options = {
  yieldToUi: () => Promise<void>;
  onProgress?: (p: DownloadProgress) => void;
  onVerifying?: () => void;
  signal?: CancelSignal;
};

/** Sentry: the error code + mirror index only — never content. */
function reportMorphologyError(error: MorphologyError, mirror: number): void {
  if (error.code === "no-connection" || error.code === "download-cancelled") return;
  captureAppException(error, {
    tags: { area: "quran-roots", code: error.code, mirror: String(mirror) },
  });
}

/**
 * The verified, LF-normalised text from the device copy, or null when there is
 * no copy. A copy that fails the hash is deleted and reported as
 * `morphology-hash` (thrown), so the caller can offer a fresh download.
 */
export async function readCachedMorphology(yieldToUi: () => Promise<void>): Promise<string | null> {
  const stored = await readStoredMorphology();
  if (stored == null) return null;
  try {
    return await verifyMorphologyTextChunked(stored, yieldToUi);
  } catch (error) {
    await deleteStoredMorphology();
    if (error instanceof MorphologyError) reportMorphologyError(error, -1);
    throw error;
  }
}

/**
 * Cache-first fetch: the device copy when it verifies, otherwise each pinned
 * mirror in order. Resolves with the verified, LF-normalised text.
 */
export async function fetchMorphology(options: Options): Promise<string> {
  try {
    const cached = await readCachedMorphology(options.yieldToUi);
    if (cached != null) return cached;
  } catch {
    // A bad copy was deleted above — fall through to a fresh download.
  }

  const signal = options.signal ?? { cancelled: false };
  let lastError: MorphologyError = new MorphologyError("download-failed");
  for (const [mirror, url] of QAC_MORPHOLOGY.sources.entries()) {
    if (signal.cancelled) throw new MorphologyError("download-cancelled");
    try {
      const raw = await downloadMorphologyFrom(url, options.onProgress ?? (() => {}), signal);
      options.onVerifying?.();
      try {
        return await verifyMorphologyTextChunked(raw, options.yieldToUi);
      } catch (error) {
        await deleteStoredMorphology();
        throw error;
      }
    } catch (error) {
      const typed =
        error instanceof MorphologyError
          ? error
          : new MorphologyError("download-failed", (error as Error)?.message);
      if (typed.code === "download-cancelled") throw typed;
      reportMorphologyError(typed, mirror);
      // A hash failure outranks a later network failure in what we tell the person.
      if (lastError.code !== "morphology-hash") lastError = typed;
    }
  }
  throw lastError;
}
