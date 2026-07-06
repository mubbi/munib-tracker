import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { QuranGuideTopicContent } from "@/components/quran-guide/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getQuranGuideTopic } from "@/lib/quran-guide";
import { useEnsureQuranGuideProgressLoaded } from "@/stores/quran-guide-progress-store";

export default function LearnQuranTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getQuranGuideTopic(topicId);
  const reportRef = useGuideContentReportRef("learn_quran", topic, "/learn-quran");
  useEnsureQuranGuideProgressLoaded();

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={topic?.title ?? t("learnQuran.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/learn-quran" as Href))}
    >
      <Seo path="/learn-quran" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.title")}
          onAction={() => router.replace("/learn-quran" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="learn_quran">
            <QuranGuideTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="learnQuran.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
