import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TaharahTopicContent } from "@/components/taharah/topic-content";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getTaharahTopic } from "@/lib/taharah";
import { useEnsureTaharahProgressLoaded } from "@/stores/taharah-progress-store";

export default function TaharahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getTaharahTopic(topicId);
  const reportRef = useGuideContentReportRef("taharah", topic, "/taharah");
  useEnsureTaharahProgressLoaded();

  return (
    <ScreenLayout
      eyebrow={t("taharah.eyebrow")}
      title={topic?.title ?? t("taharah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/taharah" as Href))}
    >
      <Seo path="/taharah" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("taharah.notFound")}
          actionLabel={t("taharah.title")}
          onAction={() => router.replace("/taharah" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="taharah">
            <TaharahTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="taharah.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
