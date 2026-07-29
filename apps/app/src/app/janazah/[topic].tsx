import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getJanazahGuideTopic, getJanazahGuideTopics } from "@/lib/janazah-guide";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getJanazahGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function JanazahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getJanazahGuideTopic(topicId);

  const detailPath = topic ? `/janazah/${topic.id}` : "/janazah";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("janazah.title"), path: "/janazah" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("janazah.eyebrow")}
      title={topic?.title ?? t("janazah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/janazah" as Href)}
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
          title={t("janazah.notFound")}
          actionLabel={t("janazah.title")}
          onAction={() => router.replace("/janazah" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent topic={topic} ns="janazah" sectionTitle={t("janazah.title")} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="janazah.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
