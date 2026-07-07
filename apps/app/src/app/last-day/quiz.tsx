import { type Href, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getLastDayQuiz } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";

export default function LastDayQuizScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const questions = useMemo(() => getLastDayQuiz(), []);
  const scored = useMemo(
    () => questions.filter((q) => q.type !== "reflection" && q.correctIndex != null),
    [questions],
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const progress = questions.length > 0 ? (index + (finished ? 1 : 0)) / questions.length : 0;

  const advance = useCallback(
    (wasCorrect: boolean) => {
      const nextScore = wasCorrect ? score + 1 : score;
      if (index >= questions.length - 1) {
        setScore(nextScore);
        setFinished(true);
        return;
      }
      setScore(nextScore);
      setIndex((i) => i + 1);
      setSelected(null);
    },
    [index, questions.length, score],
  );

  const onSelect = (optionIndex: number) => {
    if (selected != null || !current) return;
    setSelected(optionIndex);
    if (current.type === "reflection") {
      setTimeout(() => advance(true), 600);
      return;
    }
    const correct = current.correctIndex === optionIndex;
    setTimeout(() => advance(correct), 800);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.quizTitle")}
      subtitle={t("lastDay.quizSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
    >
      <Seo path="/last-day/quiz" />
      <Stagger>
        <JannahCallout tone="warning">{t("lastDay.quizIntro")}</JannahCallout>

        <ProgressBar value={progress} />

        {finished ? (
          <Card padding="three">
            <ThemedText type="title" style={styles.centered}>
              {t("lastDay.quizComplete")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.centered}>
              {t("lastDay.quizScore", { score, total: scored.length })}
            </ThemedText>
            <View style={styles.actions}>
              <Button
                label={t("lastDay.quizRetry")}
                variant="primary"
                fullWidth
                onPress={restart}
              />
              <Button
                label={t("lastDay.timelineTitle")}
                variant="secondary"
                fullWidth
                onPress={() => router.push("/last-day/timeline" as Href)}
              />
            </View>
          </Card>
        ) : current ? (
          <Card padding="three">
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("lastDay.quizProgress", { current: index + 1, total: questions.length })}
            </ThemedText>
            <ThemedText type="smallBold" style={styles.prompt}>
              {current.prompt}
            </ThemedText>
            {current.type === "reflection" ? (
              <Button
                label={t("lastDay.quizReflectContinue")}
                variant="primary"
                fullWidth
                onPress={() => onSelect(0)}
              />
            ) : null}
            {current.options?.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const showResult = selected != null && current.correctIndex != null;
              const isCorrect = current.correctIndex === optionIndex;
              let background = colors.muted;
              if (showResult && isCorrect) background = tokens.status.success.soft;
              if (showResult && isSelected && !isCorrect) background = tokens.status.danger.soft;

              return (
                <PressableScale
                  key={option}
                  haptic="selection"
                  disabled={selected != null}
                  accessibilityRole="button"
                  onPress={() => onSelect(optionIndex)}
                  style={[styles.option, { backgroundColor: background }]}
                >
                  <ThemedText type="small">{option}</ThemedText>
                </PressableScale>
              );
            })}
            {selected != null && current.explanation ? (
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.explanation}>
                {current.explanation}
              </ThemedText>
            ) : null}
          </Card>
        ) : null}

        <JannahDisclaimer textKey="lastDay.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: { textAlign: "center", marginBottom: Spacing.two },
  prompt: { marginVertical: Spacing.three, lineHeight: 22 },
  option: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginBottom: Spacing.two,
  },
  explanation: { marginTop: Spacing.two, lineHeight: 18 },
  actions: { marginTop: Spacing.three, gap: Spacing.two },
});
