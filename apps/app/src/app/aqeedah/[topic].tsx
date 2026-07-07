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
import { getAqeedahTopic, getAqeedahTopics } from "@/lib/aqeedah";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";
import { useEnsureAqeedahProgressLoaded } from "@/stores/aqeedah-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getAqeedahTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function AqeedahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getAqeedahTopic(topicId);
  const reportRef = useGuideContentReportRef("aqeedah", topic, "/aqeedah");
  useEnsureAqeedahProgressLoaded();

  const detailPath = topic ? `/aqeedah/${topic.id}` : "/aqeedah";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("aqeedah.title"), path: "/aqeedah" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("aqeedah.eyebrow")}
      title={topic?.title ?? t("aqeedah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/aqeedah" as Href)}
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
