import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AqeedahTopicContent } from "@/components/aqeedah/topic-content";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getAqeedahTopic } from "@/lib/aqeedah";
import { useEnsureAqeedahProgressLoaded } from "@/stores/aqeedah-progress-store";

export default function AqeedahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getAqeedahTopic(topicId);
  const reportRef = useGuideContentReportRef("aqeedah", topic, "/aqeedah");
  useEnsureAqeedahProgressLoaded();

  return (
    <ScreenLayout
      eyebrow={t("aqeedah.eyebrow")}
      title={topic?.title ?? t("aqeedah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/aqeedah" as Href))}
    >
      <Seo path="/aqeedah" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("aqeedah.notFound")}
          actionLabel={t("aqeedah.title")}
          onAction={() => router.replace("/aqeedah" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="aqeedah">
            <AqeedahTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="aqeedah.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
