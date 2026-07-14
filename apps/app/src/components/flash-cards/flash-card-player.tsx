import { SymbolView } from "expo-symbols";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { StudyMcq } from "@/lib/flash-cards";
import {
  advanceAfterAnswer,
  advanceAfterSkip,
  startFlashDeck,
} from "@/lib/flash-cards/flash-card-deck";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { useChevronForward } from "@/lib/rtl";

type FlashCardPlayerProps = {
  pool: StudyMcq[];
  /** Optional intro above the card. */
  intro?: ReactNode;
  footer?: ReactNode;
};

const LETTERS = ["A", "B", "C", "D"] as const;

/**
 * Endless A/O-style flash cards — pick an answer (or skip), then next.
 * Answered cards do not repeat until the remaining pool is exhausted.
 * Opening (or pool refresh) starts a freshly shuffled random cycle.
 */
export function FlashCardPlayer({ pool, intro, footer }: FlashCardPlayerProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();

  const [deck, setDeck] = useState(() => startFlashDeck(pool));
  const [selected, setSelected] = useState<number | null>(null);
  const [studied, setStudied] = useState(0);
  const [cardKey, setCardKey] = useState(0);

  const remaining = deck.remaining;
  const current = deck.current;

  useEffect(() => {
    setDeck(startFlashDeck(pool));
    setSelected(null);
    setCardKey((k) => k + 1);
  }, [pool]);

  const answered = selected != null;
  const wasCorrect = current != null && selected === current.correctIndex;
  const feedbackPalette = wasCorrect ? tokens.status.success : tokens.status.danger;
  const canSkip = !answered && remaining.length > 1;

  const categoryLabel = useMemo(() => {
    if (!current?.categoryLabelKey) return undefined;
    const label = t(current.categoryLabelKey);
    return label === current.categoryLabelKey ? undefined : label;
  }, [current, t]);

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (answered || !current) return;
      setSelected(optionIndex);
    },
    [answered, current],
  );

  const goNext = useCallback(() => {
    if (!answered || !current) return;
    setDeck(advanceAfterAnswer(remaining, current.id, pool));
    setSelected(null);
    setStudied((n) => n + 1);
    setCardKey((k) => k + 1);
  }, [answered, current, remaining, pool]);

  const skipCard = useCallback(() => {
    if (!canSkip || !current) return;
    setDeck(advanceAfterSkip(remaining, current.id));
    setSelected(null);
    setCardKey((k) => k + 1);
  }, [canSkip, current, remaining]);

  if (!current) {
    return (
      <View style={styles.stack}>
        {intro}
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {t("flashCards.empty")}
          </ThemedText>
        </Card>
        {footer}
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {intro}

      <View style={styles.sessionRow}>
        <Pill
          label={t("flashCards.studiedCount", { count: studied })}
          compact
          color={colors.accent}
          background={tokens.accentSoft}
          icon={{ ios: "rectangle.stack.fill", android: "style", web: "style" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("flashCards.endlessHint")}
        </ThemedText>
      </View>

      <Animated.View key={cardKey} entering={FadeIn.duration(280)} exiting={FadeOut.duration(160)}>
        <Card
          padding="three"
          style={[
            styles.flashCard,
            {
              borderColor: withAlpha(colors.accent, 0.22),
              backgroundColor: colors.card,
            },
          ]}
        >
          <View style={styles.metaRow}>
            {categoryLabel ? (
              <Pill
                label={categoryLabel}
                compact
                color={colors.mutedForeground}
                background={colors.muted}
              />
            ) : (
              <View />
            )}
            {answered ? (
              <Pill
                label={
                  wasCorrect ? t("common.quiz.statusCorrect") : t("common.quiz.statusIncorrect")
                }
                compact
                color={feedbackPalette.text}
                background={feedbackPalette.soft}
                icon={
                  wasCorrect
                    ? { ios: "checkmark", android: "check", web: "check" }
                    : { ios: "xmark", android: "close", web: "close" }
                }
              />
            ) : null}
          </View>

          <ThemedText type="subtitle" style={styles.prompt}>
            {current.prompt}
          </ThemedText>

          {current.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const isCorrectOption = current.correctIndex === optionIndex;
            const letter = LETTERS[optionIndex] ?? String(optionIndex + 1);

            let background = colors.muted;
            let borderColor = "transparent";
            let letterBg = colors.card;
            let letterFg = colors.mutedForeground;
            let labelColor = colors.foreground;
            let trailingIcon: AppIconType | null = null;

            if (answered && isCorrectOption) {
              background = tokens.status.success.soft;
              borderColor = withAlpha(tokens.status.success.color, 0.45);
              letterBg = tokens.status.success.color;
              letterFg = colors.card;
              labelColor = tokens.status.success.text;
              trailingIcon = {
                ios: "checkmark.circle.fill",
                android: "check_circle",
                web: "check_circle",
              };
            } else if (answered && isSelected && !isCorrectOption) {
              background = tokens.status.danger.soft;
              borderColor = withAlpha(tokens.status.danger.color, 0.45);
              letterBg = tokens.status.danger.color;
              letterFg = colors.card;
              labelColor = tokens.status.danger.text;
              trailingIcon = { ios: "xmark.circle.fill", android: "cancel", web: "cancel" };
            } else if (!answered && isSelected) {
              background = tokens.accentSoft;
              borderColor = withAlpha(colors.accent, 0.45);
              letterBg = colors.accent;
              letterFg = colors.accentForeground;
              labelColor = colors.accentText;
            }

            return (
              <PressableScale
                key={`${current.id}-${option}`}
                haptic="selection"
                disabled={answered}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: answered }}
                accessibilityLabel={`${letter}. ${option}`}
                onPress={() => selectOption(optionIndex)}
                style={[styles.option, { backgroundColor: background, borderColor }]}
              >
                <View style={[styles.letterBadge, { backgroundColor: letterBg }]}>
                  <ThemedText type="caption" style={{ color: letterFg }}>
                    {letter}
                  </ThemedText>
                </View>
                <ThemedText type="small" style={[styles.optionLabel, { color: labelColor }]}>
                  {option}
                </ThemedText>
                {trailingIcon ? (
                  <SymbolView
                    name={trailingIcon}
                    size={18}
                    tintColor={
                      isCorrectOption ? tokens.status.success.color : tokens.status.danger.color
                    }
                  />
                ) : null}
              </PressableScale>
            );
          })}

          {answered ? (
            <Animated.View
              entering={FadeInDown.duration(280)}
              style={[
                styles.feedbackCard,
                {
                  backgroundColor: feedbackPalette.soft,
                  borderColor: withAlpha(feedbackPalette.color, 0.28),
                },
              ]}
            >
              <IconWell
                icon={
                  wasCorrect
                    ? {
                        ios: "checkmark.seal.fill",
                        android: "verified",
                        web: "verified",
                      }
                    : {
                        ios: "lightbulb.fill",
                        android: "lightbulb",
                        web: "lightbulb",
                      }
                }
                tint={feedbackPalette.color}
                background={withAlpha(feedbackPalette.color, 0.14)}
                well={36}
                size={16}
              />
              <View style={styles.feedbackCopy}>
                <ThemedText type="smallBold" style={{ color: feedbackPalette.text }}>
                  {wasCorrect ? t("flashCards.correctTitle") : t("flashCards.incorrectTitle")}
                </ThemedText>
                <ThemedText type="small" style={styles.explanationText}>
                  {current.explanation}
                </ThemedText>
              </View>
            </Animated.View>
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
              {t("flashCards.answerHint")}
            </ThemedText>
          )}

          {answered ? (
            <Button
              label={t("flashCards.nextCard")}
              variant="primary"
              fullWidth
              trailingIcon={chevronForward}
              onPress={goNext}
              style={styles.nextButton}
            />
          ) : (
            <Button
              label={t("common.skip")}
              variant="secondary"
              fullWidth
              disabled={!canSkip}
              onPress={skipCard}
              style={styles.nextButton}
              accessibilityHint={
                canSkip ? t("flashCards.skipHint") : t("flashCards.skipDisabledHint")
              }
            />
          )}
        </Card>
      </Animated.View>

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  flashCard: {
    borderWidth: 1.5,
    borderCurve: "continuous",
    minHeight: 320,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  prompt: {
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
    lineHeight: 26,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
    marginBottom: Spacing.two,
    minHeight: 52,
  },
  letterBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLabel: {
    flex: 1,
    lineHeight: 20,
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },
  feedbackCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  explanationText: {
    lineHeight: 20,
  },
  hint: {
    marginBottom: Spacing.two,
    lineHeight: 18,
  },
  nextButton: {
    marginTop: Spacing.two,
  },
});
