import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { SalahGuideTopicContent } from "@/components/salah-guide/topic-content";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getSalahGuideTopic, getSalahGuideTopics } from "@/lib/salah-guide";
import { articleSchema } from "@/lib/seo/structured-data";
import { useEnsureSalahGuideProgressLoaded } from "@/stores/salah-guide-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getSalahGuideTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function SalahGuideTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getSalahGuideTopic(topicId);
  const reportRef = useGuideContentReportRef("salah_guide", topic, "/salah-guide");
  useEnsureSalahGuideProgressLoaded();

  const detailPath = topic ? `/salah-guide/${topic.id}` : "/salah-guide";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("salahGuide.title"), path: "/salah-guide" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={topic?.title ?? t("salahGuide.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/salah-guide"))}
    >
      <Seo
        path={detailPath}
        title={topic?.title}
        description={topic?.summary}
        type={topic ? "article" : undefined}
        index={!!topic}
        breadcrumbs={crumbs}
        jsonLd={
          topic
            ? [
                articleSchema({
                  path: detailPath,
                  headline: topic.title,
                  description: topic.summary ?? "",
                  breadcrumbs: crumbs,
                }),
              ]
            : undefined
        }
      />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("salahGuide.notFound")}
          actionLabel={t("salahGuide.title")}
          onAction={() => router.replace("/salah-guide")}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="salah_guide">
            <SalahGuideTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="salahGuide.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
