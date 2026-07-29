import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getFidyahGuideTopic, getFidyahGuideTopics } from "@/lib/fidyah-guide";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getFidyahGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function FidyahTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getFidyahGuideTopic(topicId);

  const detailPath = topic ? `/fidyah/${topic.id}` : "/fidyah";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("fidyah.title"), path: "/fidyah" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("fidyah.eyebrow")}
      title={topic?.title ?? t("fidyah.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/fidyah" as Href)}
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
          title={t("fidyah.notFound")}
          actionLabel={t("fidyah.title")}
          onAction={() => router.replace("/fidyah" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent topic={topic} ns="fidyah" sectionTitle={t("fidyah.title")} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="fidyah.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
