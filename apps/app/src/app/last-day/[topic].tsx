import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LastDayTopicContent } from "@/components/last-day/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { getLastDayTopic, getLastDayTopics } from "@/lib/last-day";
import { articleSchema } from "@/lib/seo/structured-data";
import { useEnsureLastDayProgressLoaded } from "@/stores/last-day-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getLastDayTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function LastDayTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getLastDayTopic(topicId);
  useEnsureLastDayProgressLoaded();

  const detailPath = topic ? `/last-day/${topic.id}` : "/last-day";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("lastDay.title"), path: "/last-day" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={topic?.title ?? t("lastDay.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (goBackOrReplace(router, "/last-day" as Href))}
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
          title={t("lastDay.notFound")}
          actionLabel={t("lastDay.title")}
          onAction={() => router.replace("/last-day" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="last_day">
            <LastDayTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="lastDay.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
