import type { AnnotationColorId, AyahNote } from "@munib-tracker/shared/types";
import { formatNoteRef } from "@munib-tracker/shared/utils";

import { getSurahByNumber } from "@/lib/quran-meta";
import { createFuzzyIndex, type FuzzyField, type FuzzyIndex } from "@/lib/search-fuse";

/**
 * Fuzzy search over the user's own notes (NF-3.21) — used by `/quran/notes` and
 * the "My notes" group of universal search. Local only: note text never leaves
 * the device through search. Built on the shared Fuse plumbing (`search-fuse`),
 * so the project defaults and Arabic-aware `normalize()` apply.
 */
const NOTE_FIELDS: FuzzyField<AyahNote>[] = [
  { key: "body", weight: 0.55, get: (note) => note.body },
  { key: "tags", weight: 0.3, get: (note) => note.tags.join(" ") },
  {
    key: "ref",
    weight: 0.15,
    get: (note) =>
      `${formatNoteRef(note)} ${getSurahByNumber(note.surah)?.nameTransliteration ?? ""}`,
  },
];

export function createQuranNotesSearch(notes: AyahNote[]): FuzzyIndex<AyahNote> {
  return createFuzzyIndex(notes, NOTE_FIELDS);
}

export type NotesFilter = {
  query: string;
  tag: string | null;
  color: AnnotationColorId | null;
};

/** Tag/colour filters, then the fuzzy query (ranked) — or reading order with no query. */
export function filterQuranNotes(
  notes: AyahNote[],
  index: FuzzyIndex<AyahNote> | null,
  filter: NotesFilter,
): AyahNote[] {
  const q = filter.query.trim();
  const base = q && index ? index.search(q) : notes;
  return base.filter(
    (note) =>
      (!filter.tag || note.tags.includes(filter.tag)) &&
      (!filter.color || note.color === filter.color),
  );
}
