import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";
import { getRuqyahTopic, getRuqyahTopics } from "@/lib/ruqyah";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return getRuqyahTopics().map((topic) => ({ topic: topic.id }));
}

export default function RuqyahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getRuqyahTopic(topicId);

  const detailPath = topic ? `/ruqyah/${topic.id}` : "/ruqyah";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("ruqyah.title"), path: "/ruqyah" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("ruqyah.eyebrow")}
      title={topic?.title ?? t("ruqyah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/ruqyah" as Href)}
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
          title={t("ruqyah.notFound")}
          actionLabel={t("ruqyah.title")}
          onAction={() => router.replace("/ruqyah" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent topic={topic} ns="ruqyah" sectionTitle={t("ruqyah.title")} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="ruqyah.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
