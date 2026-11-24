import { memo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, type ViewInstance } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { getTajweedRule } from "@/constants/tajweed";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { withArabicJoiningZwj } from "@/lib/arabic-text-join";
import { arabicWordRowStyle } from "@/lib/quran-companion/arabic-row";
import type { TajweedWordRun } from "@/lib/quran-companion/tajweed-word-runs";
import type { WordState } from "@/lib/quran-companion/types";
import type { AssessmentMode, PronunciationWordState } from "@/lib/quran-pronunciation/types";
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
   * NF-3.24 pronunciation check: per-word Clear / Listen again / Not sure. When
   * set it replaces the practice marks, and every checked word can be tapped to
   * hear the reciter. "Listen again" is amber, never red.
   */
  pronunciation?: (PronunciationWordState | null)[];
  pronunciationMode?: AssessmentMode;
  /**
   * Window position of the reciter's active word, reported whenever it moves, so
   * the screen can keep a long ayah's current word in view (§9.2).
   */
  onActiveWordMeasured?: (rect: { y: number; height: number }) => void;
  /**
   * Tajweed colouring per study word (`studyWordTajweedRuns`, memoised by the
   * caller): the row itself is coloured, so the ayah is never shown twice. Word
   * status then moves to the non-colour dot mark, so the two never clash.
   */
  tajweedRuns?: (TajweedWordRun[] | null)[] | null;
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
  pronunciation,
  pronunciationMode = "full",
  tajweedRuns,
}: PracticeWordRowProps) {
  // Letter colours carry tajweed: status must not also be a colour on the glyphs.
  const marks = tajweedRuns ? "dot" : markStyle;
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

  const pronColor = (state: PronunciationWordState): string => {
    if (state === "clear") return tokens.status.success.color;
    if (state === "listen-again") return tokens.status.warning.color;
    return colors.mutedForeground;
  };
  const pronLabel = (state: PronunciationWordState): string => {
    if (state === "clear") {
      return pronunciationMode === "full"
        ? t("quranPronunciation.word.clear")
        : t("quranPronunciation.word.heard");
    }
    if (state === "listen-again") {
      return pronunciationMode === "full"
        ? t("quranPronunciation.word.listenAgain")
        : t("quranPronunciation.word.skippedOrUnclear");
    }
    return t("quranPronunciation.word.notSure");
  };

  // A word's position is its identity inside a fixed ayah; keys stay stable across marks.
  const wordKeys = words.map((word, index) => `${index}:${word}`);

  return (
    <View style={[styles.row, arabicWordRowStyle(rtl)]} accessibilityRole="text">
      {words.map((word, i) => {
        const state = states[i] ?? "idle";
        const pron = pronunciation?.[i] ?? null;
        const isHidden = hidden.has(i);
        const isActive = i === activeIndex || i === hearIndex;
        const color = pron ? pronColor(pron) : markColor(state);
        const underline = isActive ? colors.accent : marks === "underline" ? color : null;
        const label = isHidden
          ? t("quranCompanion.word.hidden", { n: i + 1 })
          : [word, pron ? pronLabel(pron) : stateLabel(state)].filter(Boolean).join(", ");
        const pressable =
          !!onWordPress && (pron != null || state === "confirmedMismatch") && !isHidden;
        const cell = {
          word,
          state,
          isHidden,
          isActive,
          underline,
          dotColor: marks === "dot" && color && !isActive ? color : null,
          fontSize,
          fontFamily,
          runs: tajweedRuns?.[i] ?? null,
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
  runs,
}: {
  word: string;
  state: WordState;
  isHidden: boolean;
  isActive: boolean;
  underline: string | null;
  dotColor: string | null;
  fontSize: number;
  fontFamily?: string;
  runs: TajweedWordRun[] | null;
}) {
  const { colors, tokens } = useThemeTokens();
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
            // Tajweed-coloured words dim (not grey out) while still upcoming.
            ...(runs && state === "upcoming" ? { opacity: 0.6 } : null),
          }}
        >
          {runs ? <TajweedRuns runs={runs} isDark={tokens.isDark} /> : word}
        </ThemedText>
      )}
      <View
        style={[
          styles.underline,
          { backgroundColor: underline ?? "transparent", height: isActive ? 3 : 2 },
        ]}
      />
      {dotColor ? (
        <View testID="word-status-dot" style={[styles.dot, { backgroundColor: dotColor }]} />
      ) : null}
    </View>
  );
}

/** Coloured runs of one word; ZWJ keeps letters joined across runs (Android Fabric / web). */
function TajweedRuns({ runs, isDark }: { runs: TajweedWordRun[]; isDark: boolean }) {
  const texts = withArabicJoiningZwj(runs.map((run) => run.text));
  return (
    <>
      {runs.map((run, i) => {
        const rule = run.rule ? getTajweedRule(run.rule) : undefined;
        return (
          <Text
            // biome-ignore lint/suspicious/noArrayIndexKey: ordered runs of one fixed word
            key={i}
            style={rule ? { color: isDark ? rule.colorDark : rule.colorLight } : undefined}
          >
            {texts[i] ?? run.text}
          </Text>
        );
      })}
    </>
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
