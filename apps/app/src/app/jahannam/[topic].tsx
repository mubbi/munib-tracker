import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JahannamTopicContent } from "@/components/jahannam/topic-content";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureJahannamContent,
  getJahannamTopic,
  getJahannamTopics,
  isJahannamContentReady,
} from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams(): Array<{ topic: string }> {
  return getJahannamTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function JahannamTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  // Desktop (≥1200): sibling topics + progress in a sticky aside.
  const { maxContentWidth } = useLearnWideLayout();
  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
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
      {!contentReady ? (
        <LearnContentLoading />
      ) : !topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("jahannam.notFound")}
          actionLabel={t("jahannam.title")}
          onAction={() => router.replace("/jahannam" as Href)}
        />
      ) : (
        <LearnSplitLayout
          aside={
            <ModuleTopicAside
              title={t("jahannam.title")}
              basePath="/jahannam"
              topics={getJahannamTopics()}
              currentId={topic.id}
            />
          }
        >
          <Stagger>
            <LearnReadingChrome surface="jahannam">
              <JahannamTopicContent topic={topic} />
            </LearnReadingChrome>
            <JannahDisclaimer textKey="jahannam.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jahannam/[topic]");
