import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { ProphetsTopicContent } from "@/components/prophets/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureProphetsContent, getProphetsTopic, getProphetsTopics } from "@/lib/prophets";
import { articleSchema } from "@/lib/seo/structured-data";
import { useEnsureProphetsProgressLoaded } from "@/stores/prophets-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getProphetsTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function ProphetsTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready: contentReady } = useEnsureContent(ensureProphetsContent);
  const topic = getProphetsTopic(topicId);
  const reportRef = useGuideContentReportRef("prophets", topic, "/prophets");
  useEnsureProphetsProgressLoaded();

  const detailPath = topic ? `/prophets/${topic.id}` : "/prophets";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("prophets.title"), path: "/prophets" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={topic?.title ?? t("prophets.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
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
