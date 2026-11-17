import { memo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, type ViewInstance } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicWordRowStyle } from "@/lib/quran-companion/arabic-row";
import type { WordState } from "@/lib/quran-companion/types";
import { useIsRTL } from "@/lib/rtl";

/**
 * The study-word row for practice (§6). Always right-to-left, whatever the app
 * locale — the row direction is forced on the container (like word-by-word).
 * Word state is a parallel array so the row never reflows; colours come from
 * status tokens and state is also in the accessibility label, never colour alone.
 *
 * Mark styles: an underline by default; a small dot under the word when tajweed
 * colouring is on, so practice marks never compete with letter colours (§6).
 */
type PracticeWordRowProps = {
  words: string[];
  states: WordState[];
  hidden: Set<number>;
  /** Word the reciter is on (accent underline). */
  activeIndex: number | null;
  /** Word the reference recitation is on during Hear. */
  hearIndex: number | null;
  fontSize: number;
  fontFamily?: string;
  markStyle: "underline" | "dot";
  /** Tap a "try again" word to hear it. */
  onWordPress?: (index: number) => void;
  /**
   * Window position of the reciter's active word, reported whenever it moves, so
   * the screen can keep a long ayah's current word in view (§9.2).
   */
  onActiveWordMeasured?: (rect: { y: number; height: number }) => void;
};

export const PracticeWordRow = memo(function PracticeWordRow({
  words,
  states,
  hidden,
  activeIndex,
  hearIndex,
  fontSize,
  fontFamily,
  markStyle,
  onWordPress,
  onActiveWordMeasured,
}: PracticeWordRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const rtl = useIsRTL();
  const activeRef = useRef<ViewInstance>(null);

  useEffect(() => {
    if (activeIndex == null || !onActiveWordMeasured) return;
    activeRef.current?.measureInWindow((_x, y, _w, height) => {
      if (height > 0) onActiveWordMeasured({ y, height });
    });
  }, [activeIndex, onActiveWordMeasured]);

  const markColor = (state: WordState): string | null => {
    switch (state) {
      case "matched":
      case "corrected":
        return tokens.status.success.color;
      case "uncertain":
        return tokens.status.warning.color;
      case "confirmedMismatch":
        return tokens.status.danger.color;
      default:
        return null;
    }
  };

  const stateLabel = (state: WordState): string => {
    switch (state) {
      case "matched":
        return t("quranCompanion.word.matched");
      case "corrected":
        return t("quranCompanion.word.corrected");
      case "uncertain":
        return t("quranCompanion.word.notSure");
      case "confirmedMismatch":
        return t("quranCompanion.word.tryAgain");
      case "upcoming":
        return t("quranCompanion.word.notYet");
      default:
        return "";
    }
  };

  // A word's position is its identity inside a fixed ayah; keys stay stable across marks.
  const wordKeys = words.map((word, index) => `${index}:${word}`);

  return (
    <View style={[styles.row, arabicWordRowStyle(rtl)]} accessibilityRole="text">
      {words.map((word, i) => {
        const state = states[i] ?? "idle";
        const isHidden = hidden.has(i);
        const isActive = i === activeIndex || i === hearIndex;
        const color = markColor(state);
        const underline = isActive ? colors.accent : markStyle === "underline" ? color : null;
        const label = isHidden
          ? t("quranCompanion.word.hidden", { n: i + 1 })
          : [word, stateLabel(state)].filter(Boolean).join(", ");
        const pressable = !!onWordPress && state === "confirmedMismatch" && !isHidden;
        const cell = {
          word,
          state,
          isHidden,
          isActive,
          underline,
          dotColor: markStyle === "dot" && color && !isActive ? color : null,
          fontSize,
          fontFamily,
        };
        return pressable ? (
          <PressableScale
            key={wordKeys[i]}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={t("quranCompanion.word.tapToHear")}
            onPress={() => onWordPress?.(i)}
          >
            <WordCell {...cell} />
          </PressableScale>
        ) : (
          <View
            key={wordKeys[i]}
            ref={i === activeIndex ? activeRef : undefined}
            accessible
            accessibilityLabel={label}
          >
            <WordCell {...cell} />
          </View>
        );
      })}
    </View>
  );
});

function WordCell({
  word,
  state,
  isHidden,
  isActive,
  underline,
  dotColor,
  fontSize,
  fontFamily,
}: {
  word: string;
  state: WordState;
  isHidden: boolean;
  isActive: boolean;
  underline: string | null;
  dotColor: string | null;
  fontSize: number;
  fontFamily?: string;
}) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.word}>
      {isHidden ? (
        <View
          style={[
            styles.hidden,
            { backgroundColor: colors.muted, height: fontSize * 1.2, minWidth: fontSize * 1.6 },
          ]}
        />
      ) : (
        <ThemedText
          type="arabic"
          style={{
            fontSize,
            lineHeight: fontSize * 1.9,
            writingDirection: "rtl",
            ...(fontFamily ? { fontFamily } : null),
            color: state === "upcoming" ? colors.mutedForeground : colors.foreground,
          }}
        >
          {word}
        </ThemedText>
      )}
      <View
        style={[
          styles.underline,
          { backgroundColor: underline ?? "transparent", height: isActive ? 3 : 2 },
        ]}
      />
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Arabic reads right-to-left in every locale: force the direction here rather
  // than relying on I18nManager (the same approach as word-by-word.tsx).
  row: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    columnGap: Spacing.two,
    rowGap: Spacing.one,
  },
  word: { alignItems: "center", paddingHorizontal: 2 },
  hidden: { borderRadius: Radius.sm, borderCurve: "continuous" },
  underline: { alignSelf: "stretch", borderRadius: 2, marginTop: -4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 3 },
});
