import type { Ayah, MushafLine, MushafPageLayout } from "@munib-tracker/shared/types";
import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { BISMILLAH } from "@/components/quran/basmala";
import { useMushafAnnotations } from "@/components/quran/mushaf-annotations";
import { MushafFontError, MushafFontLoading } from "@/components/quran/mushaf-font-loading";
import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import {
  noteHintHandlers,
  noteUnderlineStyle,
  TvNoteFocusPreview,
  webHintProps,
} from "@/components/quran/note-hints";
import { SurahBanner } from "@/components/quran/surah-banner";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover";
import { useQcfPageFont } from "@/hooks/use-qcf-page-font";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahByNumber, parseVerseRange } from "@/lib/quran";
import { DEFAULT_ARABIC_SIZE } from "@/lib/reading-typography";

type MushafLineRendererProps = {
  layout: MushafPageLayout;
  page: number;
  /** Reading Arabic size; scales the glyph lines so the A−/A+ control affects this layout too. */
  arabicSize?: number;
  highlightAyah?: { surah: number; ayah: number };
  onAyahPress?: (surah: number, ayah: number) => void;
  /**
   * TV: request D-pad focus on mount — the line holding this ayah, or the first
   * text line when `"first"` / not on the page.
   */
  tvFocusTarget?: { surah: number; ayah: number } | "first";
  /** TV: lets the reader know focus is inside the page body (D-pad Left/Right turns pages). */
  onItemFocus?: () => void;
  onItemBlur?: () => void;
  /**
   * Draw a text line's glyphs yourself (Qur'an practice colours, hides and
   * reveals single words). Return null to fall back to the plain glyph run.
   */
  renderLineGlyphs?: (lineIndex: number, glyphs: string) => ReactNode | null;
  /**
   * NF-3.21: draw the user's highlights (word spans, or an ayah/line tint on
   * pages that don't map word-exactly). Off for practice, which owns the glyphs.
   */
  showAnnotations?: boolean;
  /**
   * The page's ayahs in Unicode Arabic (G-01). QCF page glyphs are private-use
   * code points a screen reader cannot read, so each line's label carries the
   * Unicode text of the ayahs that start on it (each ayah is read once).
   */
  ayahs?: Ayah[];
};

/** Line index → Unicode Arabic of the ayahs whose first glyph line it is. */
function readableTextByLine(lines: MushafLine[], ayahs: Ayah[] | undefined): Map<number, string[]> {
  const out = new Map<number, string[]>();
  if (!ayahs?.length) return out;
  const arabicByRef = new Map(ayahs.map((a) => [`${a.surah}:${a.ayah}`, a.arabic]));
  const seen = new Set<string>();
  lines.forEach((line, index) => {
    if (line.type !== "text") return;
    for (const ref of parseVerseRange(line.verseRange)) {
      const key = `${ref.surah}:${ref.ayah}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const arabic = arabicByRef.get(key);
      if (!arabic) continue;
      const list = out.get(index) ?? [];
      list.push(arabic);
      out.set(index, list);
    }
  });
  return out;
}

/**
 * Base glyph metrics tuned for the QCF V2 page font at the default reading size.
 * The line-height is a tight glyph box (just enough for harakat/waqf marks) — the
 * airy inter-line spacing of a real leaf comes from vertically justifying the
 * lines (space-between), so a full 15-line page fits one screen without scrolling.
 */
const BASE_MUSHAF_SIZE = 22;
const BASE_MUSHAF_LINE_HEIGHT = 38;
const BASE_BASMALA_SIZE = 20;
const BASE_BASMALA_LINE_HEIGHT = 32;

/**
 * At/above this many text lines a page is "full" and its lines are spread to
 * fill the leaf edge-to-edge (a real 15-line mushaf page). Sparse pages (surah
 * openings, short closings) are centered instead so gaps never gape.
 */
const DENSE_LINE_THRESHOLD = 13;

/** QCF V2 page fonts ship a single regular master; medium weight triggers web fallback. */
const MUSHAF_GLYPH_STYLE = {
  fontWeight: "400" as const,
  writingDirection: "rtl" as const,
};

function mushafLineKey(page: number, line: MushafLine): string {
  switch (line.type) {
    case "surah_name":
      return `${page}:surah:${line.surah}:${line.text}`;
    case "basmala":
      return `${page}:basmala:${line.glyphs}`;
    case "text":
      return `${page}:text:${line.verseRange ?? "x"}:${line.alignment}:${line.glyphs}`;
  }
}

function lineHighlightsAyah(
  refs: Array<{ surah: number; ayah: number }>,
  highlightAyah?: { surah: number; ayah: number },
): boolean {
  if (!highlightAyah) return false;
  return refs.some((ref) => ref.surah === highlightAyah.surah && ref.ayah === highlightAyah.ayah);
}

/**
 * Level B — the 15-line Madani mushaf rendered with the QPC V2 per-page glyph
 * font. Lines are vertically justified to fill the illuminated leaf so the page
 * reads like a printed mushaf, each glyph line spanning the column width.
 */
export function MushafLineRenderer({
  layout,
  page,
  arabicSize,
  highlightAyah,
  onAyahPress,
  tvFocusTarget,
  onItemFocus,
  onItemBlur,
  renderLineGlyphs,
  showAnnotations = false,
  ayahs,
}: MushafLineRendererProps) {
  const { t } = useTranslation();
  const readableByLine = useMemo(
    () => readableTextByLine(layout.lines, ayahs),
    [ayahs, layout.lines],
  );
  const { colors, tokens } = useThemeTokens();

  const scale = (arabicSize ?? DEFAULT_ARABIC_SIZE) / DEFAULT_ARABIC_SIZE;
  const mushafTextStyle = {
    fontSize: Math.round(BASE_MUSHAF_SIZE * scale),
    lineHeight: Math.round(BASE_MUSHAF_LINE_HEIGHT * scale),
    color: colors.foreground,
  };
  const basmalaStyle = {
    fontSize: Math.round(BASE_BASMALA_SIZE * scale),
    lineHeight: Math.round(BASE_BASMALA_LINE_HEIGHT * scale),
    color: colors.foreground,
  };

  const textLineCount = layout.lines.filter((line) => line.type === "text").length;
  const dense = textLineCount >= DENSE_LINE_THRESHOLD;
  const hasGlyphLines = layout.lines.some(
    (line) => line.type === "basmala" || line.type === "text",
  );
  const hasBasmala = layout.lines.some((line) => line.type === "basmala");
  const { ready, failed, retry, fontFamily, basmalaFontFamily } = useQcfPageFont(page, hasBasmala);
  const annotations = useMushafAnnotations(page, layout, showAnnotations && !renderLineGlyphs);
  const fineHover = useFinePointerHover();
  // NF-3.21 TV note hint: the focused line's note shows read-only over the page foot.
  const tv = isTV();
  const [tvFocusedLine, setTvFocusedLine] = useState<number | null>(null);
  const tvNote =
    tv && tvFocusedLine != null ? (annotations?.lineNote(tvFocusedLine) ?? null) : null;

  // TV: which text line should take initial D-pad focus (by line index).
  let tvFocusLineIndex = -1;
  if (isTV() && tvFocusTarget) {
    const textLines = layout.lines
      .map((line, index) => ({ line, index }))
      .filter((entry) => entry.line.type === "text");
    const targeted =
      tvFocusTarget === "first"
        ? undefined
        : textLines.find(
            ({ line }) =>
              line.type === "text" &&
              lineHighlightsAyah(parseVerseRange(line.verseRange), tvFocusTarget),
          );
    tvFocusLineIndex = (targeted ?? textLines[0])?.index ?? -1;
  }

  return (
    <MushafPageFrame page={page} fill>
      <View style={[styles.lines, dense ? styles.linesDense : styles.linesSparse]}>
        {layout.lines.map((line, lineIndex) => {
          const lineKey = mushafLineKey(page, line);
          if (line.type === "surah_name") {
            const meta = getSurahByNumber(line.surah);
            return (
              <SurahBanner
                key={lineKey}
                nameArabic={line.text}
                nameEnglish={meta?.nameEnglish}
                revelationPlace={meta?.revelationPlace}
                ayahCount={meta?.ayahCount}
              />
            );
          }
          if (!ready) return null;
          if (line.type === "basmala") {
            return (
              <Text
                key={lineKey}
                // Glyph codes are unreadable; speak the Unicode basmala instead.
                accessibilityLabel={BISMILLAH}
                accessibilityLanguage="ar"
                style={[
                  styles.basmala,
                  basmalaStyle,
                  MUSHAF_GLYPH_STYLE,
                  { fontFamily: basmalaFontFamily },
                ]}
              >
                {line.glyphs}
              </Text>
            );
          }
          const refs = parseVerseRange(line.verseRange);
          const primary = refs[0];
          const highlighted = lineHighlightsAyah(refs, highlightAyah);
          const annotationTint = highlighted ? null : (annotations?.lineTint(lineIndex) ?? null);
          const lineNote = annotations?.lineNote(lineIndex) ?? null;
          const baseLabel = primary
            ? t("quran.ayahRef", { surah: primary.surah, ayah: primary.ayah })
            : t("quran.pageN", { n: page });
          // Fallback pages (no word map): the whole line carries the note hint.
          const lineHint =
            lineNote && annotations?.lineLevelNotes && fineHover
              ? webHintProps(
                  noteHintHandlers(
                    { surah: lineNote.surah, ayah: lineNote.ayah, noteId: lineNote.noteId },
                    true,
                  ),
                )
              : {};
          return (
            <PressableScale
              key={lineKey}
              haptic="light"
              scaleTo={0.997}
              accessibilityRole="button"
              accessibilityLabel={[
                baseLabel,
                ...(readableByLine.get(lineIndex) ?? []),
                lineNote ? t("quranNotes.hasNote") : null,
              ]
                .filter(Boolean)
                .join(", ")}
              accessibilityHint={
                primary && onAyahPress ? t("quran.reader.opensActions") : undefined
              }
              onPress={() => primary && onAyahPress?.(primary.surah, primary.ayah)}
              onFocus={() => {
                onItemFocus?.();
                if (tv) setTvFocusedLine(lineIndex);
              }}
              onBlur={() => {
                onItemBlur?.();
                if (tv) setTvFocusedLine((prev) => (prev === lineIndex ? null : prev));
              }}
              {...(lineIndex === tvFocusLineIndex ? { hasTVPreferredFocus: true } : {})}
              {...lineHint}
              style={[
                styles.textLine,
                highlighted ? { backgroundColor: tokens.mushaf.highlight } : null,
                annotationTint ? { backgroundColor: annotationTint } : null,
              ]}
            >
              <Text
                style={[
                  styles.mushafText,
                  mushafTextStyle,
                  MUSHAF_GLYPH_STYLE,
                  { fontFamily },
                  line.alignment === "centered" ? styles.centeredText : styles.justifiedText,
                  lineNote && annotations?.lineLevelNotes
                    ? noteUnderlineStyle(lineNote.underline)
                    : null,
                ]}
              >
                {renderLineGlyphs?.(lineIndex, line.glyphs) ??
                  annotations?.renderLineGlyphs(lineIndex) ??
                  line.glyphs}
              </Text>
            </PressableScale>
          );
        })}
        {!ready && hasGlyphLines ? (
          failed ? (
            <MushafFontError onRetry={retry} />
          ) : (
            <MushafFontLoading />
          )
        ) : null}
        {tvNote ? (
          // Overlay, not an inserted row: the 15-line leaf keeps its layout.
          <View style={[styles.tvNoteOverlay, { pointerEvents: "none" }]}>
            <TvNoteFocusPreview surah={tvNote.surah} ayah={tvNote.ayah} />
          </View>
        ) : null}
      </View>
    </MushafPageFrame>
  );
}

const styles = StyleSheet.create({
  lines: { flexGrow: 1 },
  tvNoteOverlay: { position: "absolute", start: 0, end: 0, bottom: 0 },
  // Full page → spread lines edge-to-edge; sparse page → center the block.
  linesDense: { justifyContent: "space-between" },
  linesSparse: { justifyContent: "center", gap: Spacing.two },
  basmala: {
    alignSelf: "stretch",
    textAlign: "center",
    marginVertical: Spacing.one,
  },
  textLine: {
    width: "100%",
    paddingVertical: Spacing.half,
    borderRadius: 4,
  },
  mushafText: {
    width: "100%",
  },
  centeredText: { textAlign: "center" },
  justifiedText: { textAlign: "justify" },
});
