import type { AnnotationColorId, MushafPageLayout } from "@munib-tracker/shared/types";
import { noteAyahKey } from "@munib-tracker/shared/utils";
import { type ReactNode, useMemo } from "react";
import { Text } from "react-native";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahAyahs } from "@/lib/quran";
import { annotationTint } from "@/lib/quran-notes/annotation-colors";
import { mapPageWords, type PageWordToken } from "@/lib/quran-notes/mushaf-word-spans";
import {
  type AyahAnnotation,
  resolveAyahAnnotation,
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

export type MushafAnnotationRender = {
  /** Per-word glyph runs for a line, or null to draw the plain glyph line. */
  renderLineGlyphs: (lineIndex: number) => ReactNode | null;
  /** D24 fallback: whole-line tint on pages that don't map word-exactly. */
  lineTint: (lineIndex: number) => string | null;
};

/**
 * NF-3.21 highlights on the 15-line mushaf page (spike N1 passed — see
 * docs/proofs/ayah-notes.md). Each glyph token is its own `Text` run, so a
 * word-span tint is laid out by the text engine together with the glyph: it
 * stays aligned at every font size, in RTL, under page zoom and TV scaling.
 * Pages whose tokens don't map word-exactly fall back to tinting the lines of
 * the highlighted ayahs (D24). Returns null when the page has no annotations,
 * so an unannotated page renders exactly as before.
 */
export function useMushafAnnotations(
  page: number,
  layout: MushafPageLayout,
  enabled: boolean,
): MushafAnnotationRender | null {
  const { colors, tokens } = useThemeTokens();
  const index = useQuranNotesIndex();

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

    if (!map.wordExact) {
      // D24 fallback: tint whole lines that carry an annotated ayah.
      return {
        renderLineGlyphs: () => null,
        lineTint: (lineIndex) => {
          const line = layout.lines[lineIndex];
          if (line?.type !== "text" || !line.verseRange) return null;
          const single = { ...layout, lines: [line] };
          for (const ref of ayahsOnLayout(single)) {
            const a = annotations.get(noteAyahKey(ref.surah, ref.ayah));
            const color = a?.color ?? a?.wordSpans[0]?.color ?? null;
            if (color) return tint(color);
          }
          return null;
        },
      };
    }

    return {
      lineTint: () => null,
      renderLineGlyphs: (lineIndex) => {
        const lineTokens = map.lines[lineIndex];
        if (!lineTokens?.some((token) => annotationOf(token))) return null;
        const colorsOnLine = lineTokens.map(colorOf);
        return lineTokens.map((token, i) => {
          const color = colorsOnLine[i] ?? null;
          // The space before a word joins the band only inside one colour run.
          const gapColor = i > 0 && color && colorsOnLine[i - 1] === color ? color : null;
          const marksNote = token.end && annotationOf(token)?.hasNote;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: glyph tokens of one fixed line
            <Text key={`${lineIndex}:${i}`}>
              {i > 0 ? (
                <Text
                  style={gapColor ? { backgroundColor: tint(gapColor) ?? undefined } : undefined}
                >
                  {" "}
                </Text>
              ) : null}
              <Text
                testID={
                  color
                    ? `mushaf-word-tint-${token.surah}:${token.ayah}:${token.word ?? "end"}`
                    : undefined
                }
                style={[
                  color ? { backgroundColor: tint(color) ?? undefined } : null,
                  marksNote ? { color: colors.accent } : null,
                ]}
              >
                {token.text}
              </Text>
            </Text>
          );
        });
      },
    };
  }, [colors.accent, enabled, index, layout, page, tokens.isDark]);
}
