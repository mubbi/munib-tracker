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
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { getQuranGuideQuiz } from "@/lib/quran-guide";

export default function LearnQuranQuizScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const questions = useMemo(() => getQuranGuideQuiz(), []);
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
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.quizTitle")}
      subtitle={t("learnQuran.quizSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/quiz" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.quizIntro")}</JannahCallout>

        <ProgressBar value={progress} />

        {finished ? (
          <Card padding="three">
            <ThemedText type="title" style={styles.centered}>
              {t("learnQuran.quizComplete")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.centered}>
              {t("learnQuran.quizScore", { score, total: scored.length })}
            </ThemedText>
            <View style={styles.actions}>
              <Button
                label={t("learnQuran.quizRetry")}
                variant="primary"
                fullWidth
                onPress={restart}
              />
              <Button
                label={t("learnQuran.vocabTitle")}
                variant="secondary"
                fullWidth
                onPress={() => router.push("/learn-quran/vocabulary" as Href)}
              />
            </View>
          </Card>
        ) : current ? (
          <Card padding="three">
            <View style={styles.metaRow}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("learnQuran.quizProgress", { current: index + 1, total: questions.length })}
              </ThemedText>
              <Pill
                label={t(`learnQuran.quizCategory.${current.category}`)}
                compact
                color={colors.mutedForeground}
                background={colors.muted}
              />
            </View>
            <ThemedText type="smallBold" style={styles.prompt}>
              {current.prompt}
            </ThemedText>
            {current.type === "reflection" ? (
              <Button
                label={t("learnQuran.quizReflectContinue")}
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

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: { textAlign: "center", marginBottom: Spacing.two },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
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
