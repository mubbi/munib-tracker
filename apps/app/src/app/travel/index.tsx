import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useLearnHubLayout } from "@/components/jannah/hub-layout";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { QasrCalculatorCard } from "@/components/travel/qasr-calculator";
import { TravelGuideContent } from "@/components/travel/travel-guide-content";
import { Stagger } from "@/components/ui/stagger";
import { useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function TravelGuideScreen() {
  // §4.1.1 item 4: once per session while the madhhab was never chosen.
  const madhhabPrompt = useMadhhabPrompt();
  const router = useRouter();
  const { t } = useTranslation();
  const wide = useLearnHubLayout();

  return (
    <ScreenLayout
      eyebrow={t("travel.eyebrow")}
      title={t("travel.title")}
      subtitle={t("travel.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={wide.twoPane ? wide.maxContentWidth : undefined}
    >
      <Seo path="/travel" />
      {madhhabPrompt.sheet}
      <LearnReadingChrome surface="jannah">
        <Stagger>
          <LearnQuizNavRow
            quizPath={"/travel/quiz" as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />
          <QasrCalculatorCard />
          <TravelGuideContent />
        </Stagger>
      </LearnReadingChrome>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/travel");
