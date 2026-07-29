/** Readable content module kinds that can be reported. */
export type ContentReportKind =
  | "quran_ayah"
  | "hadith"
  | "dua"
  | "zikr"
  | "durood"
  | "name"
  | "salah_guide"
  | "jannah"
  | "battles"
  | "learn_quran"
  | "learn_dua"
  | "taharah"
  | "prophets"
  | "aqeedah"
  | "zakat"
  | "seerah"
  | "hajj"
  | "travel"
  | "excused"
  | "screen";

export const CONTENT_REPORT_KINDS: readonly ContentReportKind[] = [
  "quran_ayah",
  "hadith",
  "dua",
  "zikr",
  "durood",
  "name",
  "salah_guide",
  "jannah",
  "battles",
  "learn_quran",
  "learn_dua",
  "taharah",
  "prophets",
  "aqeedah",
  "zakat",
  "seerah",
  "hajj",
  "travel",
  "excused",
  "screen",
] as const;

export type ContentReportIssueType =
  | "incorrect_arabic"
  | "incorrect_translation"
  | "incorrect_transliteration"
  | "wrong_reference"
  | "missing_content"
  | "audio_issue"
  | "typo"
  | "other";

export const CONTENT_REPORT_ISSUE_TYPES: readonly ContentReportIssueType[] = [
  "incorrect_arabic",
  "incorrect_translation",
  "incorrect_transliteration",
  "wrong_reference",
  "missing_content",
  "audio_issue",
  "typo",
  "other",
] as const;

/** Server-owned workflow status for a submitted report. */
export type ContentReportStatus =
  | "pending"
  | "in_review"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "spam";

export const CONTENT_REPORT_STATUSES: readonly ContentReportStatus[] = [
  "pending",
  "in_review",
  "in_progress",
  "completed",
  "cancelled",
  "spam",
] as const;

/** Auto-captured excerpt shown to moderators alongside the user's report. */
export type ContentReportSnapshot = {
  title?: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  reference?: string;
};

/** Identifies the reported content within the app. */
export type ContentReportReference = {
  kind: ContentReportKind;
  contentId: string;
  parentId?: string;
  route: string;
  locale: string;
  snapshot?: ContentReportSnapshot;
};

/** Client payload for creating a report (attachments sent separately as multipart). */
export type CreateContentReportPayload = {
  issueType: ContentReportIssueType;
  description: string;
  suggestedCorrection?: string;
  userReference?: string;
  content: ContentReportReference;
  appVersion?: string;
  platform?: string;
};

/** Summary returned when listing a user's reports. */
export type ContentReportSummary = {
  id: string;
  status: ContentReportStatus;
  issueType: ContentReportIssueType;
  description: string;
  content: ContentReportReference;
  attachmentCount: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
};

/** Full report detail (user-facing; excludes adminNotes). */
export type ContentReportDetail = ContentReportSummary & {
  suggestedCorrection?: string | null;
  userReference?: string | null;
  appVersion?: string | null;
  platform?: string | null;
};

/** Paginated list of the caller's reports. */
export type ContentReportListResponse = {
  items: ContentReportSummary[];
  total: number;
  page: number;
  limit: number;
};
