import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JahannamTopicContent } from "@/components/jahannam/topic-content";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getJahannamTopic, getJahannamTopics } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams(): Array<{ topic: string }> {
  return getJahannamTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function JahannamTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getJahannamTopic(topicId);

  const detailPath = topic ? `/jahannam/${topic.id}` : "/jahannam";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("jahannam.title"), path: "/jahannam" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={topic?.title ?? t("jahannam.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
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
          title={t("jahannam.notFound")}
          actionLabel={t("jahannam.title")}
          onAction={() => router.replace("/jahannam" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JahannamTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
