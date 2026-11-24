import type { AnnotationColorId, AyahNote } from "@munib-tracker/shared/types";
import { resolveNoteWordSpan } from "@munib-tracker/shared/utils";

import { foldArabicWord, splitAyahWords } from "@/lib/quran-companion/align-words";

/**
 * What the reader draws for one ayah: a whole-ayah tint, word-span tints / note
 * underlines and a note glyph. Word spans whose `textHash` no longer matches the
 * bundled text fall back to a whole-ayah tint (never attached to the wrong words).
 */
export type AyahWordSpanMark = {
  start: number;
  end: number;
  /** Highlight colour, or null for a written note on these words without a colour. */
  color: AnnotationColorId | null;
  /** The note that owns the span (opens on hover / tap). */
  noteId: string;
  /** The note has text or tags (draw the "has note" underline). */
  hasNote: boolean;
};

export type AyahAnnotation = {
  /** Whole-ayah highlight colour (newest wins), or null. */
  color: AnnotationColorId | null;
  /** Word spans to tint / underline, in `splitAyahWords` indexes, newest first. */
  wordSpans: AyahWordSpanMark[];
  /** True when at least one note on this ayah has text or tags. */
  hasNote: boolean;
  /** Newest note covering the ayah (opens on glyph tap). */
  latestNoteId: string | null;
  /** Written notes covering the whole ayah (not a word span), newest first. */
  ayahNoteIds: string[];
};

export const EMPTY_ANNOTATION: AyahAnnotation = {
  color: null,
  wordSpans: [],
  hasNote: false,
  latestNoteId: null,
  ayahNoteIds: [],
};

function hasText(note: AyahNote): boolean {
  return note.body.trim().length > 0 || note.tags.length > 0;
}

export function resolveAyahAnnotation(
  notes: readonly AyahNote[] | undefined,
  ayah: number,
  ayahText: string,
): AyahAnnotation {
  if (!notes?.length) return EMPTY_ANNOTATION;
  let color: AnnotationColorId | null = null;
  const wordSpans: AyahWordSpanMark[] = [];
  const ayahNoteIds: string[] = [];
  let wordCount: number | null = null;
  let latestNoteWithText: string | null = null;
  for (const note of notes) {
    const written = hasText(note);
    if (!latestNoteWithText && written) latestNoteWithText = note.id;
    if (!note.color && !written) continue;
    if (note.words && note.ayah === ayah) {
      wordCount ??= splitAyahWords(ayahText).length;
      const span = resolveNoteWordSpan(note, ayahText, wordCount);
      if (span) {
        wordSpans.push({ ...span, color: note.color ?? null, noteId: note.id, hasNote: written });
        continue;
      }
    }
    // Whole ayah (or range) note / highlight, or a stale word span falling back.
    if (written) ayahNoteIds.push(note.id);
    if (note.color) color ??= note.color;
  }
  return {
    color,
    wordSpans,
    hasNote: latestNoteWithText != null,
    latestNoteId: latestNoteWithText ?? notes[0]?.id ?? null,
    ayahNoteIds,
  };
}

/** The first highlight colour on an ayah: its whole-ayah colour, else its newest coloured span. */
export function ayahTintColor(annotation: AyahAnnotation | undefined): AnnotationColorId | null {
  if (!annotation) return null;
  return annotation.color ?? annotation.wordSpans.find((span) => span.color)?.color ?? null;
}

/** The newest span covering word `index`, or null. */
export function wordSpanAt(
  spans: readonly AyahWordSpanMark[],
  index: number | null,
): AyahWordSpanMark | null {
  if (index == null) return null;
  for (const span of spans) if (index >= span.start && index <= span.end) return span;
  return null;
}

/** Colour of word `index` under the spans (newest span listed first wins). */
export function wordSpanColor(
  spans: readonly Pick<AyahWordSpanMark, "start" | "end" | "color">[],
  index: number | null,
): AnnotationColorId | null {
  if (index == null) return null;
  for (const span of spans) {
    if (span.color && index >= span.start && index <= span.end) return span.color;
  }
  return null;
}

/** The newest written note on word `index` (its span has text or tags), or null. */
export function wordNoteId(
  spans: readonly AyahWordSpanMark[],
  index: number | null,
): string | null {
  if (index == null) return null;
  for (const span of spans) {
    if (span.hasNote && index >= span.start && index <= span.end) return span.noteId;
  }
  return null;
}

export type AyahTextSegment = {
  text: string;
  color: AnnotationColorId | null;
  /** Written note on these words (draw the "has note" underline; hover / tap previews it). */
  noteId?: string | null;
};

/**
 * Splits the bundled ayah text into runs for inline word-span tints and note
 * underlines, keeping every original character (spaces, waqf marks).
 * Marks-only tokens and the spaces between two words of the same span take its
 * colour / note so the band is unbroken.
 */
export function segmentAyahForSpans(
  text: string,
  spans: readonly AyahWordSpanMark[],
): AyahTextSegment[] {
  if (!spans.length) return [{ text, color: null }];
  const parts = text.split(/(\s+)/);
  const raw: Array<{ text: string; word: number | null }> = [];
  let w = 0;
  for (const part of parts) {
    if (!part) continue;
    const isWord = !/^\s+$/.test(part) && foldArabicWord(part).length > 0;
    raw.push({ text: part, word: isWord ? w++ : null });
  }
  // Nearest word before / after each piece, for joining gaps inside one span.
  const prevWord: Array<number | null> = [];
  let last: number | null = null;
  for (const piece of raw) {
    prevWord.push(last);
    if (piece.word != null) last = piece.word;
  }
  const nextWord: Array<number | null> = new Array(raw.length).fill(null);
  let next: number | null = null;
  for (let i = raw.length - 1; i >= 0; i--) {
    nextWord[i] = next;
    const word = raw[i]?.word;
    if (word != null) next = word;
  }
  const segments: AyahTextSegment[] = [];
  raw.forEach((piece, i) => {
    let color = wordSpanColor(spans, piece.word);
    let noteId = wordNoteId(spans, piece.word);
    if (piece.word == null) {
      const before = prevWord[i] ?? null;
      const after = nextWord[i] ?? null;
      const a = wordSpanColor(spans, before);
      color = a && a === wordSpanColor(spans, after) ? a : null;
      const n = wordNoteId(spans, before);
      noteId = n && n === wordNoteId(spans, after) ? n : null;
    }
    const tail = segments[segments.length - 1];
    if (tail && tail.color === color && (tail.noteId ?? null) === noteId) tail.text += piece.text;
    else segments.push(noteId ? { text: piece.text, color, noteId } : { text: piece.text, color });
  });
  return segments;
}
