import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideQuiz,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";

export default function LearnQuranQuizScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const questions = useMemo(() => getQuranGuideQuiz(), [i18n.language, contentVersion]);

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
      <LearnContentGate ready={contentReady}>
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
      </LearnContentGate>
    </ScreenLayout>
  );
}
