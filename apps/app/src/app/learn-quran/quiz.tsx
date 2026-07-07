import { type Href, useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useTranslation } from "react-i18next";

import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";

export default function LearnQuranQuizScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.quizTitle")}
      subtitle={t("learnQuran.quizSubtitle")}
      onBack={() => (goBackOrReplace(router, "/learn-quran" as Href))}
    >
      <Seo path="/learn-quran/quiz" />
      <Stagger>
        <JannahCallout tone="warning">{t("learnQuran.quizComingSoon")}</JannahCallout>
        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}
