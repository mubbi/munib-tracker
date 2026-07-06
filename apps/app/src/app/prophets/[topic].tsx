import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { ProphetsTopicContent } from "@/components/prophets/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getProphetsTopic } from "@/lib/prophets";
import { useEnsureProphetsProgressLoaded } from "@/stores/prophets-progress-store";

export default function ProphetsTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getProphetsTopic(topicId);
  const reportRef = useGuideContentReportRef("prophets", topic, "/prophets");
  useEnsureProphetsProgressLoaded();

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={topic?.title ?? t("prophets.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/prophets" as Href))}
    >
      <Seo path="/prophets" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("prophets.notFound")}
          actionLabel={t("prophets.title")}
          onAction={() => router.replace("/prophets" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="prophets">
            <ProphetsTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="prophets.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
