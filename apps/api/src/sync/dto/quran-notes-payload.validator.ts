import {
  ANNOTATION_COLOR_IDS,
  QURAN_NOTE_BODY_MAX,
  QURAN_NOTE_TAGS_MAX,
  QURAN_NOTES_MAX_BYTES,
} from "@munib-tracker/shared/types/quran-notes";

/**
 * Server-side guard for the `quran_notes` blob entity (NF-3.21, D15 — normal
 * sync, not the vault). `data` must be `{ value: Record<id, AyahNote> | null }`
 * of at most ~1 MB (≈ 2,000 notes), every entry a recognisable note with a body
 * ≤ 5,000 chars and ≤ 10 tags. Mirrors `isValidQuranNotesPayload` in
 * `@munib-tracker/shared/utils` (that module uses bundler-style imports the API's
 * `nodenext` resolution can't load, so only the dependency-free constants are
 * shared). Note text is user content: it is never logged or echoed in messages.
 */
export const QURAN_NOTES_ENTITY = "quran_notes";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isInt(value: unknown, min: number, max: number): boolean {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

function isIso(value: unknown): boolean {
  return typeof value === "string" && value.length >= 10 && Number.isFinite(Date.parse(value));
}

function isNote(key: string, value: unknown): boolean {
  if (!isRecord(value)) return false;
  const { id, surah, ayah, body, tags, color, endAyah, words, deletedAt } = value;
  if (typeof id !== "string" || id !== key || id.length > 128) return false;
  if (!isInt(surah, 1, 114) || !isInt(ayah, 1, 286)) return false;
  if (!isIso(value.createdAt) || !isIso(value.updatedAt)) return false;
  if (body != null && (typeof body !== "string" || body.length > QURAN_NOTE_BODY_MAX)) return false;
  if (tags != null) {
    if (!Array.isArray(tags) || tags.length > QURAN_NOTE_TAGS_MAX) return false;
    if (!tags.every((tag) => typeof tag === "string" && tag.length <= 64)) return false;
  }
  if (color != null && !(ANNOTATION_COLOR_IDS as readonly unknown[]).includes(color)) return false;
  if (endAyah != null && !isInt(endAyah, 1, 286)) return false;
  if (
    words != null &&
    !(isRecord(words) && isInt(words.start, 0, 10_000) && isInt(words.end, 0, 10_000))
  ) {
    return false;
  }
  if (deletedAt != null && !isIso(deletedAt)) return false;
  return true;
}

export function isValidQuranNotesRecord(entity: unknown, data: unknown): boolean {
  if (entity !== QURAN_NOTES_ENTITY) return true;
  if (!isRecord(data) || !("value" in data) || Object.keys(data).some((k) => k !== "value")) {
    return false;
  }
  if (data.value === null) return true;
  if (!isRecord(data.value)) return false;
  let bytes: number;
  try {
    bytes = Buffer.byteLength(JSON.stringify(data.value), "utf8");
  } catch {
    return false;
  }
  if (bytes > QURAN_NOTES_MAX_BYTES) return false;
  return Object.entries(data.value).every(([key, note]) => isNote(key, note));
}
