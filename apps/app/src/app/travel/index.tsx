import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TravelGuideContent } from "@/components/travel/travel-guide-content";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";

export default function TravelGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("travel.eyebrow")}
      title={t("travel.title")}
      subtitle={t("travel.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/travel" />
      <LearnReadingChrome surface="jannah">
        <Stagger>
          <LearnQuizNavRow
            quizPath={"/travel/quiz" as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />
          <TravelGuideContent />
        </Stagger>
      </LearnReadingChrome>
    </ScreenLayout>
  );
}
