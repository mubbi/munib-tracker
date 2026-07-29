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
import { articleSchema } from "@/lib/seo/structured-data";
import { getWhiteDaysGuideTopic, getWhiteDaysGuideTopics } from "@/lib/white-days-guide";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getWhiteDaysGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function WhiteDaysTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getWhiteDaysGuideTopic(topicId);

  const detailPath = topic ? `/white-days/${topic.id}` : "/white-days";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("whiteDays.title"), path: "/white-days" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("whiteDays.eyebrow")}
      title={topic?.title ?? t("whiteDays.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/white-days" as Href)}
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
          title={t("whiteDays.notFound")}
          actionLabel={t("whiteDays.title")}
          onAction={() => router.replace("/white-days" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent
              topic={topic}
              ns="whiteDays"
              sectionTitle={t("whiteDays.title")}
            />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="whiteDays.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
