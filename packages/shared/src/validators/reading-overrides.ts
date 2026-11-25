/*
 * Structural copy of `ReadingSurface` / `READING_SURFACE_IDS` and
 * `ReadingSizeOverride` (`../types/preferences`) — kept local and
 * dependency-free so the API (nodenext resolution) can import this file without
 * pulling the shared type graph. `reading-overrides.test.ts` asserts the list
 * stays identical to the original.
 */
type ReadingSurface =
  | "quran"
  | "hadith"
  | "dua_zikr"
  | "salah_guide"
  | "jannah"
  | "jahannam"
  | "battles"
  | "taharah"
  | "prophets"
  | "aqeedah"
  | "last_day"
  | "learn_dua"
  | "learn_quran"
  | "finance";

interface ReadingSizeOverride {
  arabicDelta?: number;
  textDelta?: number;
}

export const SYNC_READING_SURFACES: readonly ReadingSurface[] = [
  "quran",
  "hadith",
  "dua_zikr",
  "salah_guide",
  "jannah",
  "jahannam",
  "battles",
  "taharah",
  "prophets",
  "aqeedah",
  "last_day",
  "learn_dua",
  "learn_quran",
  "finance",
];

/**
 * Largest accepted |delta| in points. The app clamps the resolved sizes to
 * Arabic 14–48 / text 12–28, so a real delta never exceeds 34; the margin keeps
 * sync tolerant of future bound changes while rejecting absurd values.
 */
export const SYNC_READING_DELTA_LIMIT = 64;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isValidDelta(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Math.abs(value) <= SYNC_READING_DELTA_LIMIT
  );
}

export function isReadingSurface(value: unknown): value is ReadingSurface {
  return typeof value === "string" && (SYNC_READING_SURFACES as readonly string[]).includes(value);
}

/**
 * Keeps only known surfaces whose value is an object with finite, in-range
 * deltas (other fields dropped; an entry with no valid delta is dropped).
 * `undefined` when `raw` is not an object.
 */
export function sanitizeReadingOverrides(
  raw: unknown,
): Partial<Record<ReadingSurface, ReadingSizeOverride>> | undefined {
  if (!isPlainObject(raw)) return undefined;
  const out: Partial<Record<ReadingSurface, ReadingSizeOverride>> = {};
  for (const surface of SYNC_READING_SURFACES) {
    if (!Object.hasOwn(raw, surface)) continue;
    const entry = raw[surface];
    if (!isPlainObject(entry)) continue;
    const clean: ReadingSizeOverride = {};
    if (isValidDelta(entry.arabicDelta)) clean.arabicDelta = entry.arabicDelta;
    if (isValidDelta(entry.textDelta)) clean.textDelta = entry.textDelta;
    if (clean.arabicDelta !== undefined || clean.textDelta !== undefined) out[surface] = clean;
  }
  return out;
}

/**
 * Returns `data` with `fontPrefs.readingOverrides` cleaned (unknown surfaces and
 * malformed deltas removed; dropped entirely when not an object). Never rejects
 * the record; returns `data` itself when there is nothing to clean. Older blobs
 * without a `finance` entry pass through — readers fall back to the global sizes.
 */
export function sanitizeReadingOverridesField(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const fontPrefs = data.fontPrefs;
  if (!isPlainObject(fontPrefs) || !("readingOverrides" in fontPrefs)) return data;
  const { readingOverrides, ...restFont } = fontPrefs;
  const clean = sanitizeReadingOverrides(readingOverrides);
  return { ...data, fontPrefs: clean ? { ...restFont, readingOverrides: clean } : restFont };
}
