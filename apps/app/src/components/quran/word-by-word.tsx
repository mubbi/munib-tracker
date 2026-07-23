import type { QuranWord } from "@munib-tracker/shared/types";
import { useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { arabicReadingLayout } from "@/lib/reading-typography";

export { activeWordIndexAt } from "@/lib/quran-word-timing";

type WordByWordProps = {
  words: QuranWord[];
  /** 0-based index of the word currently being recited (highlight follow). */
  activeWordIndex?: number | null;
  arabicSize: number;
  translitSize: number;
  glossSize: number;
};

/**
 * Word-by-word breakdown for ayah study. Tap a word to hear its audio; the
 * active word is highlighted while the full ayah recitation plays (when
 * timing segments are available).
 */
export function WordByWord({
  words,
  activeWordIndex = null,
  arabicSize,
  translitSize,
  glossSize,
}: WordByWordProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const player = useAudioPlayer();
  const playingUriRef = useRef<string | null>(null);

  // Audio-driven highlight wins over a prior tap once recitation is progressing.
  useEffect(() => {
    if (activeWordIndex != null) setTappedIndex(null);
  }, [activeWordIndex]);

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {
        // ignore
      }
    };
  }, [player]);

  const playWord = useCallback(
    async (index: number, uri: string | undefined) => {
      if (!uri) return;
      setTappedIndex(index);
      try {
        if (playingUriRef.current === uri) {
          player.seekTo(0);
          player.play();
          return;
        }
        playingUriRef.current = uri;
        await player.replace({ uri });
        player.play();
      } catch {
        playingUriRef.current = null;
      }
    },
    [player],
  );

  if (words.length === 0) return null;

  const wordArabicSize = Math.max(tv ? 22 : 18, arabicSize - (tv ? 2 : 4));
  const wordTranslitSize = Math.max(
    tv ? TvLayout.bodyFontSize - 2 : 12,
    translitSize - (tv ? 0 : 2),
  );
  const wordGlossSize = Math.max(tv ? 14 : 11, glossSize - (tv ? 0 : 2));

  // RTL reading order: render words right-to-left via row-reverse.
  return (
    <View style={[styles.section, tv && styles.sectionTv]}>
      <ThemedText
        type="caption"
        style={[
          styles.heading,
          { color: colors.mutedForeground, fontSize: tv ? TvLayout.bodyFontSize - 2 : undefined },
        ]}
      >
        {t("quran.wordByWord.title")}
      </ThemedText>
      <View style={[styles.grid, tv && styles.gridTv]}>
        {words.map((word, index) => {
          const isActive = activeWordIndex === index || tappedIndex === index;
          return (
            <PressableScale
              // biome-ignore lint/suspicious/noArrayIndexKey: ayah word order is fixed; arabic can repeat
              key={`${word.arabic}-${index}`}
              haptic="selection"
              accessibilityRole="button"
              accessibilityLabel={`${word.arabic}. ${word.translit}. ${word.gloss}`}
              accessibilityHint={
                word.audioUrl ? t("quran.wordByWord.playWord") : t("quran.wordByWord.noAudio")
              }
              disabled={!word.audioUrl}
              onPress={() => void playWord(index, word.audioUrl)}
              style={[
                styles.wordCard,
                tv && styles.wordCardTv,
                {
                  backgroundColor: isActive
                    ? withAlpha(colors.accent, tokens.isDark ? 0.22 : 0.12)
                    : colors.muted,
                  borderColor: isActive ? colors.accent : "transparent",
                },
              ]}
            >
              <ThemedText
                type="arabic"
                style={[
                  styles.arabic,
                  arabicReadingLayout(wordArabicSize, "center"),
                  { color: isActive ? colors.accent : colors.foreground },
                ]}
              >
                {word.arabic}
              </ThemedText>
              {word.translit ? (
                <ThemedText
                  type="small"
                  style={[styles.meta, { color: colors.accent, fontSize: wordTranslitSize }]}
                >
                  {word.translit}
                </ThemedText>
              ) : null}
              {word.gloss ? (
                <ThemedText
                  type="caption"
                  style={[styles.meta, { color: colors.mutedForeground, fontSize: wordGlossSize }]}
                >
                  {word.gloss}
                </ThemedText>
              ) : null}
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  sectionTv: {
    marginTop: Spacing.four,
    gap: Spacing.three,
  },
  heading: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  /**
   * Content-height tiles: `alignItems`/`alignContent: flex-start` stops Yoga from
   * stretching wrapped `%`-width PressableScale hosts to the nearest flex:1
   * ancestor (which made cards fill the viewport and clip the next row).
   */
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: Spacing.two,
    justifyContent: "flex-start",
  },
  gridTv: {
    gap: Spacing.three,
  },
  wordCard: {
    // ~3 columns with gap; no flexGrow so leftover width doesn't inflate tiles.
    width: "30%",
    maxWidth: 128,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "flex-start",
    alignItems: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  wordCardTv: {
    width: "22%",
    maxWidth: 180,
    minHeight: TvLayout.chipMinHeight,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
    borderRadius: Radius.lg,
  },
  arabic: {
    textAlign: "center",
    alignSelf: "stretch",
  },
  meta: {
    textAlign: "center",
    alignSelf: "stretch",
  },
});
