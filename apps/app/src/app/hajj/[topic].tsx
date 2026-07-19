import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getHajjGuideTopic, getHajjGuideTopics } from "@/lib/hajj-guide";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getHajjGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function HajjTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getHajjGuideTopic(topicId);

  const detailPath = topic ? `/hajj/${topic.id}` : "/hajj";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("hajj.title"), path: "/hajj" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("hajj.eyebrow")}
      title={topic?.title ?? t("hajj.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/hajj" as Href)}
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
          title={t("hajj.notFound")}
          actionLabel={t("hajj.title")}
          onAction={() => router.replace("/hajj" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent topic={topic} ns="hajj" sectionTitle={t("hajj.title")} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="hajj.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
