import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureLastDayContent, getLastDayQuiz } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";

export default function LastDayQuizScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { version: contentVersion } = useEnsureContent(ensureLastDayContent);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const questions = useMemo(() => getLastDayQuiz(), [i18n.language, contentVersion]);

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.quizTitle")}
      subtitle={t("lastDay.quizSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
    >
      <Seo path="/last-day/quiz" />
      <Stagger>
        <QuizPlayer
          questions={questions}
          intro={<JannahCallout tone="warning">{t("lastDay.quizIntro")}</JannahCallout>}
          completeActions={
            <Button
              label={t("lastDay.timelineTitle")}
              variant="secondary"
              fullWidth
              onPress={() => router.push("/last-day/timeline" as Href)}
            />
          }
          footer={<JannahDisclaimer textKey="lastDay.disclaimer" />}
        />
      </Stagger>
    </ScreenLayout>
  );
}
