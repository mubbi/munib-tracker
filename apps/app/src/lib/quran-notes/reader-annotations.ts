import type { AnnotationColorId, AyahNote } from "@munib-tracker/shared/types";
import { resolveNoteWordSpan } from "@munib-tracker/shared/utils";

import { foldArabicWord, splitAyahWords } from "@/lib/quran-companion/align-words";

/**
 * What the reader draws for one ayah: a whole-ayah tint, word-span tints and a
 * note glyph. Word spans whose `textHash` no longer matches the bundled text
 * fall back to a whole-ayah tint (never attached to the wrong words).
 */
export type AyahAnnotation = {
  /** Whole-ayah highlight colour (newest wins), or null. */
  color: AnnotationColorId | null;
  /** Word spans to tint, in `splitAyahWords` indexes. */
  wordSpans: Array<{ start: number; end: number; color: AnnotationColorId }>;
  /** True when at least one note on this ayah has text or tags. */
  hasNote: boolean;
  /** Newest note covering the ayah (opens on glyph tap). */
  latestNoteId: string | null;
};

export const EMPTY_ANNOTATION: AyahAnnotation = {
  color: null,
  wordSpans: [],
  hasNote: false,
  latestNoteId: null,
};

export function resolveAyahAnnotation(
  notes: readonly AyahNote[] | undefined,
  ayah: number,
  ayahText: string,
): AyahAnnotation {
  if (!notes?.length) return EMPTY_ANNOTATION;
  let color: AnnotationColorId | null = null;
  const wordSpans: AyahAnnotation["wordSpans"] = [];
  let wordCount: number | null = null;
  let latestNoteWithText: string | null = null;
  for (const note of notes) {
    if (!latestNoteWithText && (note.body.trim() || note.tags.length)) latestNoteWithText = note.id;
    if (!note.color) continue;
    if (note.words && note.ayah === ayah) {
      wordCount ??= splitAyahWords(ayahText).length;
      const span = resolveNoteWordSpan(note, ayahText, wordCount);
      if (span) {
        wordSpans.push({ ...span, color: note.color });
        continue;
      }
    }
    // Whole ayah (or range) highlight, or a stale word span falling back.
    color ??= note.color;
  }
  return {
    color,
    wordSpans,
    hasNote: latestNoteWithText != null,
    latestNoteId: latestNoteWithText ?? notes[0]?.id ?? null,
  };
}

/** Colour of word `index` under the spans (newest span listed first wins). */
export function wordSpanColor(
  spans: AyahAnnotation["wordSpans"],
  index: number | null,
): AnnotationColorId | null {
  if (index == null) return null;
  for (const span of spans) if (index >= span.start && index <= span.end) return span.color;
  return null;
}

export type AyahTextSegment = { text: string; color: AnnotationColorId | null };

/**
 * Splits the bundled ayah text into runs for an inline word-span tint, keeping
 * every original character (spaces, waqf marks). Marks-only tokens and the
 * spaces between two tinted words take the span colour so the band is unbroken.
 */
export function segmentAyahForSpans(
  text: string,
  spans: AyahAnnotation["wordSpans"],
): AyahTextSegment[] {
  if (!spans.length) return [{ text, color: null }];
  const parts = text.split(/(\s+)/);
  const raw: Array<{ text: string; word: number | null; space: boolean }> = [];
  let w = 0;
  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) raw.push({ text: part, word: null, space: true });
    else if (foldArabicWord(part).length > 0) raw.push({ text: part, word: w++, space: false });
    else raw.push({ text: part, word: null, space: false });
  }
  const segments: AyahTextSegment[] = [];
  raw.forEach((piece, i) => {
    let color = wordSpanColor(spans, piece.word);
    if (piece.word == null) {
      // Join gaps (spaces / waqf marks) only between two words of the same span.
      const before = [...raw.slice(0, i)].reverse().find((p) => p.word != null);
      const after = raw.slice(i + 1).find((p) => p.word != null);
      const a = wordSpanColor(spans, before?.word ?? null);
      const b = wordSpanColor(spans, after?.word ?? null);
      color = a && a === b ? a : null;
    }
    const last = segments[segments.length - 1];
    if (last && last.color === color) last.text += piece.text;
    else segments.push({ text: piece.text, color });
  });
  return segments;
}
