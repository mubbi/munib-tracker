import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ExcusedGuideContent } from "@/components/excused/excused-guide-content";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";

export default function SickGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("sick.eyebrow")}
      title={t("sick.title")}
      subtitle={t("sick.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/sick" />
      <Stagger>
        <LearnQuizNavRow
          quizPath={"/sick/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />
        <ExcusedGuideContent reason="sick" />
      </Stagger>
    </ScreenLayout>
  );
}
