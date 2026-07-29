import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ExcusedGuideContent } from "@/components/excused/excused-guide-content";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";

export default function HaydGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("hayd.eyebrow")}
      title={t("hayd.title")}
      subtitle={t("hayd.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/hayd" />
      <Stagger>
        <LearnQuizNavRow
          quizPath={"/hayd/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />
        <ExcusedGuideContent reason="hayd" />
      </Stagger>
    </ScreenLayout>
  );
}
