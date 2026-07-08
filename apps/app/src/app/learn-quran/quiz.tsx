import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";
import { getQuranGuideQuiz } from "@/lib/quran-guide";

export default function LearnQuranQuizScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes
  const questions = useMemo(() => getQuranGuideQuiz(), [i18n.language]);

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
        <QuizPlayer
          questions={questions}
          intro={<JannahCallout tone="info">{t("learnQuran.quizIntro")}</JannahCallout>}
          categoryLabel={(question) =>
            question.category
              ? t(`learnQuran.quizCategory.${question.category}` as const)
              : undefined
          }
          completeActions={
            <Button
              label={t("learnQuran.vocabTitle")}
              variant="secondary"
              fullWidth
              onPress={() => router.push("/learn-quran/vocabulary" as Href)}
            />
          }
          footer={<JannahDisclaimer textKey="learnQuran.disclaimer" />}
        />
      </Stagger>
    </ScreenLayout>
  );
}
