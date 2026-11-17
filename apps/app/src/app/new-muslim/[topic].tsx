import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";
import { getNewMuslimTopic, getNewMuslimTopics } from "@/lib/new-muslim";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return getNewMuslimTopics().map((topic) => ({ topic: topic.id }));
}

export default function NewMuslimTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  // Desktop (≥1200): sibling topics + progress in a sticky aside.
  const { maxContentWidth } = useLearnWideLayout();
  const topic = getNewMuslimTopic(topicId);

  const detailPath = topic ? `/new-muslim/${topic.id}` : "/new-muslim";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("newMuslim.title"), path: "/new-muslim" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("newMuslim.eyebrow")}
      title={topic?.title ?? t("newMuslim.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/new-muslim" as Href)}
      maxContentWidth={maxContentWidth}
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
          title={t("newMuslim.notFound")}
          actionLabel={t("newMuslim.title")}
          onAction={() => router.replace("/new-muslim" as Href)}
        />
      ) : (
        <LearnSplitLayout
          aside={
            <ModuleTopicAside
              title={t("newMuslim.title")}
              basePath="/new-muslim"
              topics={getNewMuslimTopics()}
              currentId={topic.id}
            />
          }
        >
          <Stagger>
            <LearnReadingChrome surface="jannah">
              <LearnGuideTopicContent
                topic={topic}
                ns="newMuslim"
                sectionTitle={t("newMuslim.title")}
              />
            </LearnReadingChrome>
            <JannahDisclaimer textKey="newMuslim.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}
