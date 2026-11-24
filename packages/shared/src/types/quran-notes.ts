/**
 * NF-3.21 — personal ayah notes, highlights and tags (tadabbur). A note is the
 * user's OWN reflection: it is always labelled "My note" in the UI and never
 * styled like, or shown inside, the tafsir panel.
 *
 * Synced as the normal blob entity `quran_notes` (decision D15 — not the vault):
 * a `Record<id, AyahNote>` merged per note (LWW on `updatedAt`, tombstones win
 * over older edits, GC after {@link QURAN_NOTE_TOMBSTONE_TTL_DAYS} days).
 */

/** Highlight colours. Resolved through theme hues, never stored as raw hex. */
export const ANNOTATION_COLOR_IDS = ["gold", "green", "blue", "rose", "violet"] as const;
export type AnnotationColorId = (typeof ANNOTATION_COLOR_IDS)[number];

/** A word span inside the start ayah: indexes into `splitAyahWords` of that ayah (inclusive). */
export interface AyahWordSpan {
  start: number;
  end: number;
}

export interface AyahNote {
  /** uuid */
  id: string;
  surah: number;
  ayah: number;
  /** Inclusive range end within the same surah. */
  endAyah?: number;
  /** Plain text, ≤ {@link QURAN_NOTE_BODY_MAX} chars; "" for a highlight-only annotation. */
  body: string;
  /** User tags — trimmed + lower-cased, ≤ {@link QURAN_NOTE_TAGS_MAX} per note. */
  tags: string[];
  /** Highlight colour; resolved through theme tokens, never a raw hex. */
  color?: AnnotationColorId;
  /** Optional word span (indexes into `splitAyahWords` of `ayah`). */
  words?: AyahWordSpan;
  /** Hash of the bundled ayah text when `words` was set (stale → whole-ayah fallback). */
  textHash?: string;
  createdAt: string;
  updatedAt: string;
  /** Tombstone: set when deleted (kept for sync, GC'd after 90 days). */
  deletedAt?: string;
}

/** Stored value of `DB_KEYS.quranNotes` and the `quran_notes` sync payload. */
export type QuranNotesMap = Record<string, AyahNote>;

export const QURAN_NOTE_BODY_MAX = 5000;
export const QURAN_NOTE_TAGS_MAX = 10;
export const QURAN_NOTE_TAG_MAX_LENGTH = 32;
/** Tombstones older than this are dropped by the merge / on load. */
export const QURAN_NOTE_TOMBSTONE_TTL_DAYS = 90;
/** Serialized payload cap (UTF-8 bytes, ≈ 2,000 notes) — enforced client- and server-side. */
export const QURAN_NOTES_MAX_BYTES = 1_000_000;
/** Show a "nearly full" warning from this fraction of {@link QURAN_NOTES_MAX_BYTES}. */
export const QURAN_NOTES_WARN_RATIO = 0.8;
