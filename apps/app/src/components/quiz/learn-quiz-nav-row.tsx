import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahNavRow } from "@/components/jannah/primitives";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type LearnQuizNavRowProps = {
  quizPath: Href;
  /** Optional hub-specific title/hint keys; falls back to common.learnQuiz. */
  titleKey?: string;
  subtitleKey?: string;
};

/** Shared quiz entry row for Learn hub screens. */
export function LearnQuizNavRow({
  quizPath,
  titleKey = "common.learnQuiz.title",
  subtitleKey = "common.learnQuiz.hint",
}: LearnQuizNavRowProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();

  return (
    <JannahNavRow
      icon={{ ios: "questionmark.circle.fill", android: "quiz", web: "quiz" }}
      title={t(titleKey)}
      subtitle={t(subtitleKey)}
      tint={colors.accent}
      onPress={() => router.push(quizPath)}
    />
  );
}
