import { SymbolView } from "expo-symbols";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar, SegmentedProgress } from "@/components/ui/progress-bar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";

export type QuizPlayerQuestion = {
  id: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  type: string;
  /** Optional topic chip (e.g. Learn Qur'an categories). */
  category?: string;
};

type QuizPlayerProps = {
  questions: QuizPlayerQuestion[];
  intro?: ReactNode;
  /** Optional category chip for the current question. */
  categoryLabel?: (question: QuizPlayerQuestion) => string | undefined;
  /** Extra actions under Retry on the results card (e.g. related lesson link). */
  completeActions?: ReactNode;
  footer?: ReactNode;
};

function isScoredQuestion(question: QuizPlayerQuestion): boolean {
  return question.type !== "reflection" && question.correctIndex != null;
}

function isCorrectAnswer(question: QuizPlayerQuestion, selected: number | null): boolean {
  if (selected == null || !isScoredQuestion(question)) return false;
  return question.correctIndex === selected;
}

function encouragementKey(score: number, total: number): string {
  if (total <= 0) return "common.quiz.encouragementSteady";
  const ratio = score / total;
  if (ratio >= 1) return "common.quiz.encouragementPerfect";
  if (ratio >= 0.7) return "common.quiz.encouragementStrong";
  if (ratio >= 0.4) return "common.quiz.encouragementSteady";
  return "common.quiz.encouragementKeepGoing";
}

/**
 * Learn-first quiz shell: answer → see correct/wrong + explanation → navigate
 * freely with previous/next → review a calm results summary.
 */
export function QuizPlayer({
  questions,
  intro,
  categoryLabel,
  completeActions,
  footer,
}: QuizPlayerProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronBackward = useChevronBackward();
  const chevronForward = useChevronForward();

  const scored = useMemo(() => questions.filter(isScoredQuestion), [questions]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const selected = answers[index] ?? null;
  const answered = selected != null;
  const answeredCount = answers.filter((a) => a != null).length;
  const isLast = index >= questions.length - 1;
  const canGoNext = answered;
  const score = useMemo(
    () =>
      questions.reduce((sum, question, i) => {
        const answer = answers[i];
        if (answer == null || !isScoredQuestion(question)) return sum;
        return sum + (isCorrectAnswer(question, answer) ? 1 : 0);
      }, 0),
    [answers, questions],
  );

  const progress = questions.length > 0 ? answeredCount / questions.length : 0;
  const category = current && categoryLabel ? categoryLabel(current) : undefined;

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (!current || answers[index] != null) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = optionIndex;
        return next;
      });
    },
    [answers, current, index],
  );

  const markReflection = useCallback(() => {
    if (!current || answers[index] != null) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = 0;
      return next;
    });
  }, [answers, current, index]);

  const goPrevious = () => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setAnswers(questions.map(() => null));
    setFinished(false);
  };

  const reviewFrom = (questionIndex: number) => {
    setIndex(questionIndex);
    setFinished(false);
  };

  if (finished) {
    const ratio = scored.length > 0 ? score / scored.length : 1;
    const ringColor =
      ratio >= 0.7
        ? tokens.status.success.color
        : ratio >= 0.4
          ? colors.accent
          : tokens.status.warning.color;

    return (
      <View style={styles.stack}>
        {intro}
        <ProgressBar value={1} color={ringColor} />
        <Card padding="three">
          <View style={styles.resultsHero}>
            <ProgressRing
              progress={scored.length > 0 ? ratio : 1}
              size={128}
              stroke={10}
              color={ringColor}
              surfaceColor={colors.card}
              caption={t("common.quiz.scoreCaption")}
              valueFontSize={28}
            />
            <ThemedText type="title" style={styles.centered}>
              {t("common.quiz.complete")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.centered}>
              {t("common.quiz.scoreDetail", { score, total: scored.length })}
            </ThemedText>
            <ThemedText type="small" style={[styles.centered, styles.encouragement]}>
              {t(encouragementKey(score, scored.length))}
            </ThemedText>
          </View>

          {scored.length > 0 ? (
            <View style={styles.reviewBlock}>
              <ThemedText type="smallBold" style={styles.reviewHeading}>
                {t("common.quiz.reviewTitle")}
              </ThemedText>
              {questions.map((question, questionIndex) => {
                const answer = answers[questionIndex];
                const scoredQ = isScoredQuestion(question);
                const correct = isCorrectAnswer(question, answer);
                const status: "correct" | "incorrect" | "reflection" | "skipped" = !scoredQ
                  ? "reflection"
                  : answer == null
                    ? "skipped"
                    : correct
                      ? "correct"
                      : "incorrect";
                const palette =
                  status === "correct"
                    ? tokens.status.success
                    : status === "incorrect"
                      ? tokens.status.danger
                      : status === "skipped"
                        ? tokens.status.warning
                        : tokens.status.info;
                const statusLabel =
                  status === "correct"
                    ? t("common.quiz.statusCorrect")
                    : status === "incorrect"
                      ? t("common.quiz.statusIncorrect")
                      : status === "skipped"
                        ? t("common.quiz.statusSkipped")
                        : t("common.quiz.statusReflection");
                const statusIcon: AppIconType =
                  status === "correct"
                    ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
                    : status === "incorrect"
                      ? { ios: "xmark.circle.fill", android: "cancel", web: "cancel" }
                      : status === "skipped"
                        ? {
                            ios: "exclamationmark.circle.fill",
                            android: "error",
                            web: "error",
                          }
                        : { ios: "heart.fill", android: "favorite", web: "favorite" };

                return (
                  <PressableScale
                    key={question.id}
                    haptic="selection"
                    accessibilityRole="button"
                    accessibilityLabel={`${t("common.quiz.progress", {
                      current: questionIndex + 1,
                      total: questions.length,
                    })}. ${statusLabel}. ${question.prompt}`}
                    onPress={() => reviewFrom(questionIndex)}
                    style={[
                      styles.reviewRow,
                      {
                        backgroundColor: palette.soft,
                        borderColor: withAlpha(palette.color, 0.28),
                      },
                    ]}
                  >
                    <IconWell
                      icon={statusIcon}
                      tint={palette.color}
                      background={withAlpha(palette.color, 0.14)}
                      well={34}
                      size={16}
                    />
                    <View style={styles.reviewCopy}>
                      <ThemedText type="caption" style={{ color: palette.text }}>
                        {t("common.quiz.progress", {
                          current: questionIndex + 1,
                          total: questions.length,
                        })}{" "}
                        · {statusLabel}
                      </ThemedText>
                      <ThemedText type="small" numberOfLines={2}>
                        {question.prompt}
                      </ThemedText>
                    </View>
                    <SymbolView
                      name={chevronForward}
                      size={14}
                      tintColor={colors.mutedForeground}
                    />
                  </PressableScale>
                );
              })}
            </View>
          ) : null}

          <View style={styles.actions}>
            <Button label={t("common.quiz.retry")} variant="primary" fullWidth onPress={restart} />
            {completeActions}
          </View>
        </Card>
        {footer}
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.stack}>
        {intro}
        {footer}
      </View>
    );
  }

  const showResult = answered && isScoredQuestion(current);
  const wasCorrect = isCorrectAnswer(current, selected);
  const feedbackPalette = wasCorrect ? tokens.status.success : tokens.status.danger;
  const allAnswered = answeredCount === questions.length;
  const nextLabel = isLast ? t("common.quiz.seeResults") : t("common.next");

  return (
    <View style={styles.stack}>
      {intro}

      <View style={styles.progressBlock}>
        <View style={styles.metaRow}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("common.quiz.progress", { current: index + 1, total: questions.length })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("common.quiz.answeredCount", {
              count: answeredCount,
              total: questions.length,
            })}
          </ThemedText>
        </View>
        {questions.length <= 10 ? (
          <SegmentedProgress total={questions.length} completed={answeredCount} />
        ) : (
          <ProgressBar value={progress} />
        )}
      </View>

      <Card padding="three">
        <View style={styles.metaRow}>
          {category ? (
            <Pill
              label={category}
              compact
              color={colors.mutedForeground}
              background={colors.muted}
            />
          ) : (
            <View />
          )}
          {showResult ? (
            <Pill
              label={wasCorrect ? t("common.quiz.statusCorrect") : t("common.quiz.statusIncorrect")}
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

        {current.type === "reflection" ? (
          <View style={styles.reflectionBlock}>
            {!answered ? (
              <Button
                label={t("common.quiz.reflectMark")}
                variant="primary"
                fullWidth
                onPress={markReflection}
              />
            ) : (
              <Animated.View
                entering={FadeInDown.duration(280)}
                style={[
                  styles.feedbackCard,
                  {
                    backgroundColor: tokens.status.info.soft,
                    borderColor: withAlpha(tokens.status.info.color, 0.28),
                  },
                ]}
              >
                <IconWell
                  icon={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
                  tint={tokens.status.info.color}
                  background={withAlpha(tokens.status.info.color, 0.14)}
                  well={36}
                  size={16}
                />
                <View style={styles.feedbackCopy}>
                  <ThemedText type="smallBold" style={{ color: tokens.status.info.text }}>
                    {t("common.quiz.reflectionNoted")}
                  </ThemedText>
                  <ThemedText type="small" style={styles.explanationText}>
                    {current.explanation}
                  </ThemedText>
                </View>
              </Animated.View>
            )}
          </View>
        ) : null}

        {current.options?.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrectOption = current.correctIndex === optionIndex;
          const ordinal = optionIndex + 1;

          let background = colors.muted;
          let borderColor = "transparent";
          let letterBg = colors.card;
          let letterFg = colors.mutedForeground;
          let labelColor = colors.foreground;
          let trailingIcon: AppIconType | null = null;

          if (showResult && isCorrectOption) {
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
          } else if (showResult && isSelected && !isCorrectOption) {
            background = tokens.status.danger.soft;
            borderColor = withAlpha(tokens.status.danger.color, 0.45);
            letterBg = tokens.status.danger.color;
            letterFg = colors.card;
            labelColor = tokens.status.danger.text;
            trailingIcon = { ios: "xmark.circle.fill", android: "cancel", web: "cancel" };
          } else if (!showResult && isSelected) {
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
              accessibilityLabel={`${ordinal}. ${option}`}
              onPress={() => selectOption(optionIndex)}
              style={[
                styles.option,
                {
                  backgroundColor: background,
                  borderColor,
                },
              ]}
            >
              <View style={[styles.letterBadge, { backgroundColor: letterBg }]}>
                <ThemedText type="caption" style={{ color: letterFg }}>
                  {ordinal}
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

        {showResult ? (
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
                {wasCorrect ? t("common.quiz.correctTitle") : t("common.quiz.incorrectTitle")}
              </ThemedText>
              <ThemedText type="small" style={styles.explanationText}>
                {current.explanation}
              </ThemedText>
            </View>
          </Animated.View>
        ) : null}

        {!answered ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {current.type === "reflection"
              ? t("common.quiz.reflectHint")
              : t("common.quiz.answerHint")}
          </ThemedText>
        ) : null}

        <View style={styles.navRow}>
          <Button
            label={t("common.previous")}
            variant="secondary"
            size="sm"
            disabled={index === 0}
            icon={chevronBackward}
            onPress={goPrevious}
            style={styles.navButton}
          />
          <Button
            label={nextLabel}
            variant="primary"
            size="sm"
            disabled={!canGoNext}
            trailingIcon={isLast ? undefined : chevronForward}
            onPress={goNext}
            style={styles.navButton}
          />
        </View>

        {allAnswered && !isLast ? (
          <Button
            label={t("common.quiz.seeResults")}
            variant="ghost"
            fullWidth
            onPress={() => setFinished(true)}
          />
        ) : null}
      </Card>

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  progressBlock: {
    gap: Spacing.two,
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
  reflectionBlock: {
    marginBottom: Spacing.two,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  navButton: {
    flex: 1,
  },
  centered: {
    textAlign: "center",
  },
  encouragement: {
    marginTop: Spacing.one,
    lineHeight: 20,
  },
  resultsHero: {
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  reviewBlock: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  reviewHeading: {
    marginBottom: Spacing.half,
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  reviewCopy: {
    flex: 1,
    gap: 2,
  },
  actions: {
    gap: Spacing.two,
  },
});
