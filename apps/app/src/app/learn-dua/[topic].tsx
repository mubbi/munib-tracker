import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnDuaTopicContent } from "@/components/learn-dua/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getLearnDuaTopic } from "@/lib/learn-dua";
import { useEnsureLearnDuaProgressLoaded } from "@/stores/learn-dua-progress-store";

export default function LearnDuaTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getLearnDuaTopic(topicId);
  const reportRef = useGuideContentReportRef("learn_dua", topic, "/learn-dua");
  useEnsureLearnDuaProgressLoaded();

  return (
    <ScreenLayout
      eyebrow={t("learnDua.eyebrow")}
      title={topic?.title ?? t("learnDua.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/learn-dua" as Href))}
    >
      <Seo path="/learn-dua" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnDua.notFound")}
          actionLabel={t("learnDua.title")}
          onAction={() => router.replace("/learn-dua" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="learn_dua">
            <LearnDuaTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="learnDua.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
