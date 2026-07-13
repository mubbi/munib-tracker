import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getLaylatAlQadrTopic, getLaylatAlQadrTopics } from "@/lib/laylat-al-qadr";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return getLaylatAlQadrTopics().map((topic) => ({ topic: topic.id }));
}

export default function LaylatAlQadrTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getLaylatAlQadrTopic(topicId);

  const detailPath = topic ? `/laylat-al-qadr/${topic.id}` : "/laylat-al-qadr";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("laylatAlQadr.title"), path: "/laylat-al-qadr" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("laylatAlQadr.eyebrow")}
      title={topic?.title ?? t("laylatAlQadr.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/laylat-al-qadr" as Href)}
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
          title={t("laylatAlQadr.notFound")}
          actionLabel={t("laylatAlQadr.title")}
          onAction={() => router.replace("/laylat-al-qadr" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent
              topic={topic}
              ns="laylatAlQadr"
              sectionTitle={t("laylatAlQadr.title")}
            />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="laylatAlQadr.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
