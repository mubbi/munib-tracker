import type { AnnotationColorId, MushafPageLayout } from "@munib-tracker/shared/types";
import { noteAyahKey } from "@munib-tracker/shared/utils";
import { type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, type TextStyle } from "react-native";

import { noteHintHandlers, noteUnderlineStyle, webHintProps } from "@/components/quran/note-hints";
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahAyahs } from "@/lib/quran";
import { annotationSwatch, annotationTint } from "@/lib/quran-notes/annotation-colors";
import { mapPageWords, type PageWordToken } from "@/lib/quran-notes/mushaf-word-spans";
import {
  type AyahAnnotation,
  ayahTintColor,
  resolveAyahAnnotation,
  wordSpanAt,
  wordSpanColor,
} from "@/lib/quran-notes/reader-annotations";
import { useQuranNotesIndex } from "@/stores/quran-notes-store";

type Ref = { surah: number; ayah: number };

/** Every ayah a page's text lines touch, from their `verseRange`s. */
export function ayahsOnLayout(layout: MushafPageLayout): Ref[] {
  const out: Ref[] = [];
  const seen = new Set<string>();
  for (const line of layout.lines) {
    if (line.type !== "text" || !line.verseRange) continue;
    const [a, b] = line.verseRange.split("-");
    const [s1, y1] = (a ?? "").split(":").map(Number);
    const [s2, y2] = (b ?? a ?? "").split(":").map(Number);
    if (!s1 || !y1 || !s2 || !y2) continue;
    for (let s = s1; s <= s2; s++) {
      const from = s === s1 ? y1 : 1;
      const to = s === s2 ? y2 : (getSurahAyahs(s).length ?? from);
      for (let y = from; y <= to; y++) {
        const key = noteAyahKey(s, y);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ surah: s, ayah: y });
      }
    }
  }
  return out;
}

export type MushafLineNote = {
  surah: number;
  ayah: number;
  noteId: string;
  /** Underline colour: the note's highlight (≥3:1) or accent text. */
  underline: string;
};

export type MushafAnnotationRender = {
  /** Per-word glyph runs for a line, or null to draw the plain glyph line. */
  renderLineGlyphs: (lineIndex: number) => ReactNode | null;
  /** D24 fallback: whole-line tint on pages that don't map word-exactly. */
  lineTint: (lineIndex: number) => string | null;
  /**
   * The first ayah with a written note that this line carries (a11y "has my
   * note", and on fallback pages the line's dotted underline + hover card).
   */
  lineNote: (lineIndex: number) => MushafLineNote | null;
  /** Fallback page: draw line notes as a whole-line underline (no word runs). */
  lineLevelNotes: boolean;
};

type TokenNote = { id: string; color: AnnotationColorId | null };

const WEB_NOTED = { cursor: "pointer" } as unknown as TextStyle;

/**
 * NF-3.21 highlights and note hints on the 15-line mushaf page (spike N1
 * passed — see docs/proofs/ayah-notes.md). Each glyph token is its own `Text`
 * run, so a word-span tint / note underline is laid out by the text engine
 * together with the glyph: it stays aligned at every font size, in RTL, under
 * page zoom and TV scaling. Words of a written word-span note get a dotted
 * underline; a whole-ayah note marks the ayah-end rosette. Both carry the note
 * hint (desktop hover card, phone tap peek / long-press actions). Pages whose
 * tokens don't map word-exactly fall back to tinting / underlining the lines of
 * the annotated ayahs (D24). Returns null when the page has no annotations, so
 * an unannotated page renders exactly as before.
 */
export function useMushafAnnotations(
  page: number,
  layout: MushafPageLayout,
  enabled: boolean,
): MushafAnnotationRender | null {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const index = useQuranNotesIndex();
  const fineHover = useFinePointerHover();

  return useMemo(() => {
    if (!enabled || index.live.length === 0) return null;
    const annotations = new Map<string, AyahAnnotation>();
    for (const ref of ayahsOnLayout(layout)) {
      const notes = index.byAyah[noteAyahKey(ref.surah, ref.ayah)];
      if (!notes) continue;
      const text = getSurahAyahs(ref.surah)[ref.ayah - 1]?.arabic ?? "";
      const annotation = resolveAyahAnnotation(notes, ref.ayah, text);
      if (annotation.color || annotation.wordSpans.length || annotation.hasNote) {
        annotations.set(noteAyahKey(ref.surah, ref.ayah), annotation);
      }
    }
    if (annotations.size === 0) return null;

    const map = mapPageWords(page, layout);
    const tint = (color: AnnotationColorId | null) =>
      color ? annotationTint(color, tokens.isDark) : null;
    const swatch = (color: AnnotationColorId | null) =>
      color ? annotationSwatch(color, colors.card) : colors.accentText;
    const annotationOf = (token: PageWordToken) =>
      token.surah != null && token.ayah != null
        ? annotations.get(noteAyahKey(token.surah, token.ayah))
        : undefined;

    const colorOf = (token: PageWordToken): AnnotationColorId | null => {
      const a = annotationOf(token);
      if (!a) return null;
      if (token.end) return a.color;
      return wordSpanColor(a.wordSpans, token.word) ?? a.color;
    };
    /** The written note a token hints: its word span's note, or (end marker) the ayah's. */
    const noteOf = (token: PageWordToken): TokenNote | null => {
      const a = annotationOf(token);
      if (!a?.hasNote) return null;
      if (token.end) {
        const id = a.ayahNoteIds[0] ?? a.latestNoteId;
        return id ? { id, color: a.color } : null;
      }
      const span = wordSpanAt(
        a.wordSpans.filter((s) => s.hasNote),
        token.word,
      );
      return span ? { id: span.noteId, color: span.color } : null;
    };

    const lineNote = (lineIndex: number): MushafLineNote | null => {
      const line = layout.lines[lineIndex];
      if (line?.type !== "text" || !line.verseRange) return null;
      for (const ref of ayahsOnLayout({ ...layout, lines: [line] })) {
        const a = annotations.get(noteAyahKey(ref.surah, ref.ayah));
        if (!a?.hasNote || !a.latestNoteId) continue;
        return {
          surah: ref.surah,
          ayah: ref.ayah,
          noteId: a.latestNoteId,
          underline: swatch(ayahTintColor(a)),
        };
      }
      return null;
    };

    if (!map.wordExact) {
      // D24 fallback: tint whole lines that carry a highlighted ayah.
      return {
        renderLineGlyphs: () => null,
        lineLevelNotes: true,
        lineNote,
        lineTint: (lineIndex) => {
          const line = layout.lines[lineIndex];
          if (line?.type !== "text" || !line.verseRange) return null;
          for (const ref of ayahsOnLayout({ ...layout, lines: [line] })) {
            const color = ayahTintColor(annotations.get(noteAyahKey(ref.surah, ref.ayah)));
            if (color) return tint(color);
          }
          return null;
        },
      };
    }

    const tv = isTV();
    const hintA11y = fineHover ? t("quranNotes.hint.a11yOpen") : t("quranNotes.hint.a11yPeek");
    return {
      lineTint: () => null,
      lineLevelNotes: false,
      lineNote,
      renderLineGlyphs: (lineIndex) => {
        const lineTokens = map.lines[lineIndex];
        if (!lineTokens?.some((token) => annotationOf(token))) return null;
        const colorsOnLine = lineTokens.map(colorOf);
        const notesOnLine = lineTokens.map(noteOf);
        return lineTokens.map((token, i) => {
          const color = colorsOnLine[i] ?? null;
          const note = notesOnLine[i] ?? null;
          // The space before a word joins the band / underline only inside one run.
          const gapColor = i > 0 && color && colorsOnLine[i - 1] === color ? color : null;
          const gapNote = i > 0 && note && notesOnLine[i - 1]?.id === note.id ? note : null;
          const hint =
            note && !tv && token.surah != null && token.ayah != null
              ? noteHintHandlers(
                  { surah: token.surah, ayah: token.ayah, noteId: note.id },
                  fineHover,
                )
              : null;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: glyph tokens of one fixed line
            <Text key={`${lineIndex}:${i}`}>
              {i > 0 ? (
                <Text
                  style={[
                    gapColor ? { backgroundColor: tint(gapColor) ?? undefined } : null,
                    gapNote ? noteUnderlineStyle(swatch(gapNote.color)) : null,
                  ]}
                >
                  {" "}
                </Text>
              ) : null}
              <Text
                testID={
                  color
                    ? `mushaf-word-tint-${token.surah}:${token.ayah}:${token.word ?? "end"}`
                    : note
                      ? `mushaf-word-note-${token.surah}:${token.ayah}:${token.word ?? "end"}`
                      : undefined
                }
                accessibilityHint={hint ? hintA11y : undefined}
                suppressHighlighting={hint ? true : undefined}
                onPress={hint?.onPress}
                onLongPress={hint?.onLongPress}
                {...(hint ? webHintProps(hint, { keyboard: true }) : {})}
                style={[
                  color ? { backgroundColor: tint(color) ?? undefined } : null,
                  token.end && note ? { color: colors.accentText } : null,
                  note ? noteUnderlineStyle(swatch(note.color)) : null,
                  hint && Platform.OS === "web" ? WEB_NOTED : null,
                ]}
              >
                {token.text}
              </Text>
            </Text>
          );
        });
      },
    };
  }, [colors.accentText, colors.card, enabled, fineHover, index, layout, page, t, tokens.isDark]);
}
