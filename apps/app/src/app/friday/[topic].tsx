import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getFridayGuideTopic, getFridayGuideTopics } from "@/lib/friday-guide";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getFridayGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function FridayTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getFridayGuideTopic(topicId);

  const detailPath = topic ? `/friday/${topic.id}` : "/friday";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("friday.title"), path: "/friday" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("friday.eyebrow")}
      title={topic?.title ?? t("friday.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/friday" as Href)}
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
          title={t("friday.notFound")}
          actionLabel={t("friday.title")}
          onAction={() => router.replace("/friday" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent topic={topic} ns="friday" sectionTitle={t("friday.title")} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="friday.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
