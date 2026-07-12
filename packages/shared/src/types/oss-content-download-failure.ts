/**
 * On-demand open-source CDN content that the Expo app fetches at runtime
 * (Qur'an editions, hadith corpora, QCF fonts, audio). Distinct from
 * {@link ContentReportKind} user scripture-quality reports.
 */

export type OssContentKind =
  | "quran_edition"
  | "hadith_collection"
  | "qcf_font"
  | "quran_audio"
  | "adhan_audio"
  | "content_audio";

export const OSS_CONTENT_KINDS: readonly OssContentKind[] = [
  "quran_edition",
  "hadith_collection",
  "qcf_font",
  "quran_audio",
  "adhan_audio",
  "content_audio",
] as const;

/** Machine-readable failure class for filtering / dashboards. */
export type OssContentErrorCode =
  | "http_error"
  | "network_error"
  | "empty_payload"
  | "unknown_content"
  | "parse_error"
  | "download_failed";

export const OSS_CONTENT_ERROR_CODES: readonly OssContentErrorCode[] = [
  "http_error",
  "network_error",
  "empty_payload",
  "unknown_content",
  "parse_error",
  "download_failed",
] as const;

/**
 * Structured identifying fields for the failed download.
 * Keep values JSON-serializable; prefer strings/numbers for admin searchability.
 */
export type OssContentDownloadFailureMeta = {
  /** App registry id (e.g. `en-saheehintl`, `bukhari`). */
  contentId?: string;
  /** Upstream CDN slug when different from contentId (e.g. fawaz edition slug). */
  sourceSlug?: string;
  /** Human label when known (edition name, collection name, reciter). */
  displayName?: string;
  language?: string;
  kind?: string;
  direction?: string;
  surah?: number;
  ayah?: number;
  page?: number;
  collectionId?: string;
  translationLocale?: string;
  editionSlugs?: string[];
  reciterDir?: string;
  trackId?: string;
  decisionId?: string;
  [key: string]: string | number | boolean | string[] | null | undefined;
};
