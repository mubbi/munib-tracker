import {
  ANNOTATION_COLOR_IDS,
  type AnnotationColorId,
  type AyahNote,
  type AyahWordSpan,
  QURAN_NOTE_BODY_MAX,
  QURAN_NOTE_TAG_MAX_LENGTH,
  QURAN_NOTE_TAGS_MAX,
  QURAN_NOTE_TOMBSTONE_TTL_DAYS,
  QURAN_NOTES_MAX_BYTES,
  type QuranNotesMap,
} from "../types/quran-notes";

/**
 * Pure logic for NF-3.21 personal ayah notes: tag normalisation, coercion of
 * stored / pulled values, the per-note sync merge, indexes for the reader, the
 * word-span `textHash` fallback and the share-sheet export. Kept framework-free
 * so the app (Jest) and the API (payload guard) share one implementation.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_SURAH = 114;
/** Longest surah (Al-Baqarah) — bounds ayah numbers without loading surah meta. */
const MAX_AYAH = 286;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isInt(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

function isIso(value: unknown): value is string {
  return typeof value === "string" && value.length >= 10 && Number.isFinite(Date.parse(value));
}

export function isAnnotationColorId(value: unknown): value is AnnotationColorId {
  return typeof value === "string" && (ANNOTATION_COLOR_IDS as readonly string[]).includes(value);
}

/** Trim, drop a leading `#`, collapse whitespace, lower-case, cap length. "" when nothing is left. */
export function normalizeNoteTag(raw: string): string {
  return raw
    .trim()
    .replace(/^#+/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, QURAN_NOTE_TAG_MAX_LENGTH)
    .trim();
}

/** Normalised, de-duplicated (first wins), at most {@link QURAN_NOTE_TAGS_MAX} tags. */
export function normalizeNoteTags(tags: readonly unknown[]): string[] {
  const out: string[] = [];
  for (const tag of tags) {
    if (typeof tag !== "string") continue;
    const clean = normalizeNoteTag(tag);
    if (!clean || out.includes(clean)) continue;
    out.push(clean);
    if (out.length >= QURAN_NOTE_TAGS_MAX) break;
  }
  return out;
}

/** Last ayah a note covers (inclusive). */
export function noteEndAyah(note: Pick<AyahNote, "ayah" | "endAyah">): number {
  return note.endAyah != null && note.endAyah > note.ayah ? note.endAyah : note.ayah;
}

export function noteCoversAyah(note: AyahNote, surah: number, ayah: number): boolean {
  return note.surah === surah && ayah >= note.ayah && ayah <= noteEndAyah(note);
}

export function isLiveNote(note: AyahNote): boolean {
  return !note.deletedAt;
}

/** `2:255` or `2:255–257` — the header of a note everywhere it is listed or exported. */
export function formatNoteRef(note: Pick<AyahNote, "surah" | "ayah" | "endAyah">): string {
  const end = noteEndAyah(note);
  return end > note.ayah ? `${note.surah}:${note.ayah}–${end}` : `${note.surah}:${note.ayah}`;
}

function sanitizeWords(value: unknown): AyahWordSpan | undefined {
  if (!isRecord(value)) return undefined;
  const { start, end } = value;
  if (!isInt(start, 0, 10_000) || !isInt(end, 0, 10_000) || end < start) return undefined;
  return { start, end };
}

/**
 * Coerce one stored or pulled note. Returns null for anything that is not a
 * recognisable note (so a corrupt row can never crash the reader); clamps the
 * body and normalises tags so every device holds the same canonical shape.
 */
export function sanitizeAyahNote(value: unknown): AyahNote | null {
  if (!isRecord(value)) return null;
  const { id, surah, ayah, createdAt, updatedAt } = value;
  if (typeof id !== "string" || !id || id.length > 128) return null;
  if (!isInt(surah, 1, MAX_SURAH) || !isInt(ayah, 1, MAX_AYAH)) return null;
  if (!isIso(createdAt) || !isIso(updatedAt)) return null;

  const note: AyahNote = {
    id,
    surah,
    ayah,
    body: typeof value.body === "string" ? value.body.slice(0, QURAN_NOTE_BODY_MAX) : "",
    tags: Array.isArray(value.tags) ? normalizeNoteTags(value.tags) : [],
    createdAt,
    updatedAt,
  };
  if (isInt(value.endAyah, 1, MAX_AYAH) && value.endAyah > ayah) note.endAyah = value.endAyah;
  if (isAnnotationColorId(value.color)) note.color = value.color;
  const words = sanitizeWords(value.words);
  if (words && note.endAyah == null) {
    note.words = words;
    if (typeof value.textHash === "string" && value.textHash.length <= 64) {
      note.textHash = value.textHash;
    }
  }
  if (isIso(value.deletedAt)) note.deletedAt = value.deletedAt;
  return note;
}

/** Coerce a stored / remote blob into a map keyed by note id. Unknown shapes become `{}`. */
export function asQuranNotesMap(value: unknown): QuranNotesMap {
  if (!isRecord(value)) return {};
  const out: QuranNotesMap = {};
  for (const raw of Object.values(value)) {
    const note = sanitizeAyahNote(raw);
    if (note) out[note.id] = note;
  }
  return out;
}

/** The moment a note was last established: its edit time, or its deletion time if later. */
function noteStamp(note: AyahNote): string {
  return note.deletedAt && note.deletedAt > note.updatedAt ? note.deletedAt : note.updatedAt;
}

/** Deterministic, order-independent serialisation used only to break exact ties. */
function tieKey(note: AyahNote): string {
  return JSON.stringify(Object.entries(note).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/** Pick the surviving copy of one note seen on two devices. */
export function pickNewerNote(a: AyahNote, b: AyahNote): AyahNote {
  const sa = noteStamp(a);
  const sb = noteStamp(b);
  if (sa !== sb) return sa > sb ? a : b;
  // Same instant: a tombstone beats an edit, so a delete is never undone by a tie.
  if (!!a.deletedAt !== !!b.deletedAt) return a.deletedAt ? a : b;
  return tieKey(a) >= tieKey(b) ? a : b;
}

/** Drop tombstones older than {@link QURAN_NOTE_TOMBSTONE_TTL_DAYS} days. */
export function gcQuranNoteTombstones(
  map: QuranNotesMap,
  now: Date = new Date(),
  ttlDays = QURAN_NOTE_TOMBSTONE_TTL_DAYS,
): QuranNotesMap {
  const cutoff = now.getTime() - ttlDays * DAY_MS;
  let changed = false;
  const out: QuranNotesMap = {};
  for (const [id, note] of Object.entries(map)) {
    if (note.deletedAt && Date.parse(note.deletedAt) < cutoff) {
      changed = true;
      continue;
    }
    out[id] = note;
  }
  return changed ? out : map;
}

/**
 * Sync merge for the `quran_notes` blob: union by id; for a note on both sides
 * the later of `updatedAt` / `deletedAt` wins, a tombstone wins a tie, and old
 * tombstones are garbage-collected. Pure and symmetric, so two devices converge
 * after one round trip each.
 */
export function mergeQuranNotes(
  local: unknown,
  remote: unknown,
  now: Date = new Date(),
): QuranNotesMap {
  const l = asQuranNotesMap(local);
  const r = asQuranNotesMap(remote);
  const out: QuranNotesMap = { ...l };
  for (const [id, remoteNote] of Object.entries(r)) {
    const localNote = out[id];
    out[id] = localNote ? pickNewerNote(localNote, remoteNote) : remoteNote;
  }
  return gcQuranNoteTombstones(out, now);
}

export interface CappedQuranNotesMerge {
  /** The map to keep locally. It is within the cap unless the local live notes alone are over it. */
  value: QuranNotesMap;
  /**
   * Remote live notes (new notes or newer edits) left out because they didn't
   * fit. When this is above 0, the caller parks the remote and pauses pushes.
   */
  pending: number;
  /** Tombstones dropped to fit, oldest first. */
  droppedTombstones: number;
}

/** Bytes `"id":{…}` adds inside the serialized map (without the separating comma). */
function noteEntryBytes(id: string, note: AyahNote): number {
  return utf8ByteLength(JSON.stringify(id)) + 1 + utf8ByteLength(JSON.stringify(note));
}

/** `{` + entries joined by `,` + `}`. This equals `JSON.stringify(map)` byte for byte. */
function mapBytes(entryTotal: number, count: number): number {
  return 2 + entryTotal + Math.max(0, count - 1);
}

function byStampThenId(a: AyahNote, b: AyahNote): number {
  const sa = noteStamp(a);
  const sb = noteStamp(b);
  if (sa !== sb) return sa < sb ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * {@link mergeQuranNotes} with the {@link QURAN_NOTES_MAX_BYTES} sync cap
 * enforced. The server rejects a larger record, so an uncapped union of two
 * near-full devices could never be pushed. Policy:
 *
 * 1. The plain merge fits: return it. This is the normal case.
 * 2. Otherwise drop tombstones, oldest deletion first (ties by id), until it
 *    fits. Both devices make the same choice, so they still converge. The
 *    cost: a device that still holds one of those very old notes live could
 *    bring it back.
 * 3. Still too big: a live note is **never** dropped. Every live note on this
 *    device is kept. Remote deletions of those notes still apply. Remote new
 *    notes and newer edits are added newest first while they fit, and the
 *    rest are counted in `pending`. The caller parks the remote, pauses this
 *    entity's pushes (the server copy stays intact) and shows "notes full",
 *    and retries once the user has made room.
 */
export function mergeQuranNotesCapped(
  local: unknown,
  remote: unknown,
  now: Date = new Date(),
  maxBytes: number = QURAN_NOTES_MAX_BYTES,
): CappedQuranNotesMerge {
  const merged = mergeQuranNotes(local, remote, now);
  let total = 0;
  let count = 0;
  for (const [id, note] of Object.entries(merged)) {
    total += noteEntryBytes(id, note);
    count += 1;
  }
  if (mapBytes(total, count) <= maxBytes)
    return { value: merged, pending: 0, droppedTombstones: 0 };

  // 2. Tombstones first, oldest deletion first.
  const tombstones = Object.values(merged)
    .filter((note) => note.deletedAt)
    .sort(byStampThenId);
  const trimmed: QuranNotesMap = { ...merged };
  let dropped = 0;
  for (const note of tombstones) {
    if (mapBytes(total, count) <= maxBytes) break;
    delete trimmed[note.id];
    total -= noteEntryBytes(note.id, note);
    count -= 1;
    dropped += 1;
  }
  if (mapBytes(total, count) <= maxBytes) {
    return { value: trimmed, pending: 0, droppedTombstones: dropped };
  }

  // 3. Keep every local live note; take remote changes only while they fit.
  const l = gcQuranNoteTombstones(asQuranNotesMap(local), now);
  const r = asQuranNotesMap(remote);
  const out: QuranNotesMap = {};
  total = 0;
  count = 0;
  for (const [id, note] of Object.entries(l)) {
    if (note.deletedAt) continue;
    out[id] = note;
    total += noteEntryBytes(id, note);
    count += 1;
  }
  const deletions: AyahNote[] = [];
  const additions: AyahNote[] = [];
  for (const [id, remoteNote] of Object.entries(r)) {
    const mine = out[id];
    if (mine) {
      if (pickNewerNote(mine, remoteNote) !== remoteNote) continue;
      (remoteNote.deletedAt ? deletions : additions).push(remoteNote);
    } else if (!remoteNote.deletedAt && !l[id]) {
      additions.push(remoteNote);
    } else if (!remoteNote.deletedAt && l[id]?.deletedAt) {
      // Deleted here, edited there. The newer side wins, as in the plain merge.
      const localTombstone = l[id] as AyahNote;
      if (pickNewerNote(localTombstone, remoteNote) === remoteNote) additions.push(remoteNote);
    }
  }
  // Deletions only free space: apply them all. The tombstone itself is not
  // kept (all tombstones are already gone at this stage), and re-merging the
  // parked remote later re-applies it.
  for (const note of deletions) {
    const mine = out[note.id];
    if (!mine) continue;
    total -= noteEntryBytes(note.id, mine);
    count -= 1;
    delete out[note.id];
  }
  let pending = 0;
  for (const note of additions.sort(byStampThenId).reverse()) {
    const mine = out[note.id];
    const delta = noteEntryBytes(note.id, note) - (mine ? noteEntryBytes(note.id, mine) : 0);
    const nextCount = mine ? count : count + 1;
    if (mapBytes(total + delta, nextCount) <= maxBytes) {
      out[note.id] = note;
      total += delta;
      count = nextCount;
    } else {
      pending += 1;
    }
  }
  return { value: out, pending, droppedTombstones: tombstones.length };
}

export interface QuranNotesIndex {
  /** Live notes, newest edit first. */
  live: AyahNote[];
  /** `surah:ayah` → live notes covering that ayah (newest first). */
  byAyah: Record<string, AyahNote[]>;
  /** tag → live notes carrying it (newest first). */
  byTag: Record<string, AyahNote[]>;
  /** Every tag in use, most used first, then alphabetical. */
  tags: string[];
}

export function noteAyahKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

/** Builds the reader / list indexes from a notes map (tombstones excluded). */
export function buildQuranNotesIndex(map: QuranNotesMap): QuranNotesIndex {
  const live = Object.values(map)
    .filter(isLiveNote)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
  const byAyah: Record<string, AyahNote[]> = {};
  const byTag: Record<string, AyahNote[]> = {};
  for (const note of live) {
    const end = noteEndAyah(note);
    for (let a = note.ayah; a <= end; a++) {
      const key = noteAyahKey(note.surah, a);
      const list = byAyah[key] ?? [];
      list.push(note);
      byAyah[key] = list;
    }
    for (const tag of note.tags) {
      const list = byTag[tag] ?? [];
      list.push(note);
      byTag[tag] = list;
    }
  }
  const tags = Object.keys(byTag).sort((a, b) => {
    const diff = (byTag[b]?.length ?? 0) - (byTag[a]?.length ?? 0);
    return diff !== 0 ? diff : a < b ? -1 : a > b ? 1 : 0;
  });
  return { live, byAyah, byTag, tags };
}

/** Live notes sorted in reading order (surah, ayah, then newest first). */
export function sortNotesByReadingOrder(notes: readonly AyahNote[]): AyahNote[] {
  return [...notes].sort((a, b) => {
    if (a.surah !== b.surah) return a.surah - b.surah;
    if (a.ayah !== b.ayah) return a.ayah - b.ayah;
    return a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0;
  });
}

/** Highlight colour shown for an ayah: the newest coloured note covering it. */
export function highlightColorFor(
  notes: readonly AyahNote[] | undefined,
): AnnotationColorId | null {
  if (!notes) return null;
  for (const note of notes) if (note.color && !note.words) return note.color;
  return null;
}

/** Tag suggestions for the editor: tags in use starting with (or containing) the draft. */
export function suggestNoteTags(
  allTags: readonly string[],
  draft: string,
  exclude: readonly string[] = [],
  limit = 6,
): string[] {
  const q = normalizeNoteTag(draft);
  const pool = allTags.filter((tag) => !exclude.includes(tag));
  if (!q) return pool.slice(0, limit);
  const starts = pool.filter((tag) => tag.startsWith(q));
  const contains = pool.filter((tag) => !tag.startsWith(q) && tag.includes(q));
  return [...starts, ...contains].slice(0, limit);
}

// ---------------------------------------------------------------------------
// Word spans: textHash fallback
// ---------------------------------------------------------------------------

/** FNV-1a (32-bit) of the ayah text plus its length — detects any change to the bundled text. */
export function hashAyahText(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `f1:${(h >>> 0).toString(16).padStart(8, "0")}:${text.length}`;
}

/**
 * The word span to draw for a note, or null to fall back to a whole-ayah
 * highlight: when the note has no span, when the bundled ayah text changed
 * since the span was chosen (`textHash` mismatch), or when the span no longer
 * fits the word count. Nothing is ever attached to the wrong words.
 */
export function resolveNoteWordSpan(
  note: Pick<AyahNote, "words" | "textHash" | "endAyah">,
  ayahText: string,
  wordCount: number,
): AyahWordSpan | null {
  const words = note.words;
  if (!words || note.endAyah != null) return null;
  if (!note.textHash || note.textHash !== hashAyahText(ayahText)) return null;
  if (words.start < 0 || words.end < words.start || words.end >= wordCount) return null;
  return words;
}

// ---------------------------------------------------------------------------
// Direction, size and payload guard
// ---------------------------------------------------------------------------

const RTL_CHAR = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
const LTR_CHAR = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿऀ-ॿঀ-৿]/;

/** Writing direction from the first strong character (Urdu/Arabic/Persian → rtl). */
export function detectTextDirection(text: string, fallback: "ltr" | "rtl" = "ltr"): "ltr" | "rtl" {
  for (const char of text) {
    if (RTL_CHAR.test(char)) return "rtl";
    if (LTR_CHAR.test(char)) return "ltr";
  }
  return fallback;
}

/** UTF-8 byte length without TextEncoder (Hermes-safe). */
export function utf8ByteLength(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code < 0x80) bytes += 1;
    else if (code < 0x800) bytes += 2;
    else if (code >= 0xd800 && code <= 0xdbff) {
      bytes += 4;
      i += 1;
    } else bytes += 3;
  }
  return bytes;
}

/** Serialized size of the notes map as it is stored and synced. */
export function quranNotesPayloadBytes(map: QuranNotesMap): number {
  return utf8ByteLength(JSON.stringify(map));
}

/**
 * Server-side guard for the `quran_notes` sync record: `{ value: map | null }`,
 * at most {@link QURAN_NOTES_MAX_BYTES} (plus a little envelope), and every entry
 * a recognisable note. Values are never echoed by callers.
 */
export function isValidQuranNotesPayload(data: unknown): boolean {
  if (!isRecord(data) || !("value" in data)) return false;
  if (Object.keys(data).some((key) => key !== "value")) return false;
  if (data.value === null) return true;
  if (!isRecord(data.value)) return false;
  let bytes: number;
  try {
    bytes = utf8ByteLength(JSON.stringify(data.value));
  } catch {
    return false;
  }
  if (bytes > QURAN_NOTES_MAX_BYTES) return false;
  for (const [key, raw] of Object.entries(data.value)) {
    const note = sanitizeAyahNote(raw);
    if (!note || note.id !== key) return false;
    if (isRecord(raw) && typeof raw.body === "string" && raw.body.length > QURAN_NOTE_BODY_MAX) {
      return false;
    }
    if (isRecord(raw) && Array.isArray(raw.tags) && raw.tags.length > QURAN_NOTE_TAGS_MAX) {
      return false;
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Export (share sheet)
// ---------------------------------------------------------------------------

export type QuranNotesExportFormat = "markdown" | "text";

export interface QuranNotesExportOptions {
  format: QuranNotesExportFormat;
  /** Localised labels — the caller owns i18n. */
  labels: {
    title: string;
    /** "My note" — the copy rule: a note is never presented as tafsir. */
    myNote: string;
    tags: string;
  };
  /** Display name for a surah heading, e.g. "Al-Baqarah". */
  surahName: (surah: number) => string;
  /**
   * Optional ayah text from the bundled corpus. When given, each note's ayah
   * text is included (never re-typed) and {@link credit} is appended once.
   */
  ayahText?: (surah: number, ayah: number) => string | undefined;
  /** Edition credit line for the included ayah text. */
  credit?: string;
}

/** Unicode isolates keep RTL note/ayah bodies readable inside an LTR document. */
const RLI = "⁧";
const LRI = "⁦";
const PDI = "⁩";

function isolate(text: string): string {
  const dir = detectTextDirection(text);
  return text
    .split("\n")
    .map((line) => (line ? `${dir === "rtl" ? RLI : LRI}${line}${PDI}` : line))
    .join("\n");
}

/**
 * Markdown or plain text for the share sheet: notes grouped by surah in reading
 * order, each headed by its ref (`2:255`). Ayah text, when requested, comes from
 * the bundled corpus through `ayahText` with the edition credit at the end.
 */
export function formatQuranNotesExport(
  notes: readonly AyahNote[],
  options: QuranNotesExportOptions,
): string {
  const md = options.format === "markdown";
  const live = sortNotesByReadingOrder(notes.filter(isLiveNote));
  const out: string[] = [md ? `# ${options.labels.title}` : options.labels.title, ""];
  let includedAyahText = false;
  let currentSurah = -1;

  for (const note of live) {
    if (note.surah !== currentSurah) {
      currentSurah = note.surah;
      const heading = `${note.surah}. ${options.surahName(note.surah)}`;
      out.push(md ? `## ${heading}` : heading.toUpperCase(), "");
    }
    const ref = formatNoteRef(note);
    out.push(md ? `### ${ref}` : `[${ref}]`);

    if (options.ayahText) {
      const end = noteEndAyah(note);
      const lines: string[] = [];
      for (let a = note.ayah; a <= end; a++) {
        const text = options.ayahText(note.surah, a);
        if (text) lines.push(`${isolate(text)} (${a})`);
      }
      if (lines.length) {
        includedAyahText = true;
        out.push(...lines.map((line) => (md ? `> ${line}` : line)), "");
      }
    }

    if (note.body.trim()) {
      out.push(md ? `**${options.labels.myNote}:**` : `${options.labels.myNote}:`);
      out.push(isolate(note.body.trim()));
    }
    if (note.tags.length) {
      const tags = note.tags.map((tag) => `#${tag.replace(/\s+/g, "-")}`).join(" ");
      out.push(md ? `_${options.labels.tags}: ${tags}_` : `${options.labels.tags}: ${tags}`);
    }
    out.push("");
  }

  if (includedAyahText && options.credit) {
    out.push(md ? "---" : "—", md ? `_${options.credit}_` : options.credit, "");
  }
  return `${out.join("\n").trimEnd()}\n`;
}
