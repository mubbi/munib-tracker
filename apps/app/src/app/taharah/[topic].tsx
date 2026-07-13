import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TaharahTopicContent } from "@/components/taharah/topic-content";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";
import { ensureTaharahContent, getTaharahTopic, getTaharahTopics } from "@/lib/taharah";
import { useEnsureTaharahProgressLoaded } from "@/stores/taharah-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getTaharahTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function TaharahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready: contentReady } = useEnsureContent(ensureTaharahContent);
  const topic = getTaharahTopic(topicId);
  const reportRef = useGuideContentReportRef("taharah", topic, "/taharah");
  useEnsureTaharahProgressLoaded();

  const detailPath = topic ? `/taharah/${topic.id}` : "/taharah";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("taharah.title"), path: "/taharah" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("taharah.eyebrow")}
      title={topic?.title ?? t("taharah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/taharah" as Href)}
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
      {!contentReady ? null : !topic ? (
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
