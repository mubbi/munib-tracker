import type { MushafLine, MushafPageLayout } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import { SurahBanner } from "@/components/quran/surah-banner";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useQcfPageFont } from "@/hooks/use-qcf-page-font";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber, parseVerseRange } from "@/lib/quran";
import { DEFAULT_ARABIC_SIZE } from "@/lib/reading-typography";

type MushafLineRendererProps = {
  layout: MushafPageLayout;
  page: number;
  /** Reading Arabic size; scales the glyph lines so the A−/A+ control affects this layout too. */
  arabicSize?: number;
  highlightAyah?: { surah: number; ayah: number };
  onAyahPress?: (surah: number, ayah: number) => void;
};

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
}: MushafLineRendererProps) {
  const { t } = useTranslation();
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
  const { ready, fontFamily, basmalaFontFamily } = useQcfPageFont(page, hasBasmala);

  return (
    <MushafPageFrame page={page} fill>
      <View style={[styles.lines, dense ? styles.linesDense : styles.linesSparse]}>
        {layout.lines.map((line) => {
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
          return (
            <PressableScale
              key={lineKey}
              haptic="light"
              scaleTo={0.997}
              accessibilityRole="button"
              accessibilityLabel={
                primary
                  ? t("quran.ayahRef", { surah: primary.surah, ayah: primary.ayah })
                  : t("quran.pageN", { n: page })
              }
              onPress={() => primary && onAyahPress?.(primary.surah, primary.ayah)}
              style={[
                styles.textLine,
                highlighted ? { backgroundColor: tokens.mushaf.highlight } : null,
              ]}
            >
              <Text
                style={[
                  styles.mushafText,
                  mushafTextStyle,
                  MUSHAF_GLYPH_STYLE,
                  { fontFamily },
                  line.alignment === "centered" ? styles.centeredText : styles.justifiedText,
                ]}
              >
                {line.glyphs}
              </Text>
            </PressableScale>
          );
        })}
        {!ready && hasGlyphLines ? (
          <View style={styles.fontLoading}>
            <ActivityIndicator color={tokens.mushaf.ink} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quran.loadingMushafFont")}
            </ThemedText>
          </View>
        ) : null}
      </View>
    </MushafPageFrame>
  );
}

const styles = StyleSheet.create({
  fontLoading: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  lines: { flexGrow: 1 },
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
