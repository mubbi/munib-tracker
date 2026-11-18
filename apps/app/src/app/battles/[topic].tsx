import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { BattlesTopicContent } from "@/components/battles/topic-content";
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
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureBattlesContent,
  getBattlesTopic,
  getBattlesTopics,
  isBattlesContentReady,
} from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";
import {
  battlesProgressStore,
  useEnsureBattlesProgressLoaded,
} from "@/stores/battles-progress-store";
import { useStore } from "@/stores/create-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getBattlesTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function BattlesTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  // Desktop (≥1200): sibling topics + progress in a sticky aside.
  const { maxContentWidth } = useLearnWideLayout();
  const completedIds = useStore(battlesProgressStore, (s) => s.completedTopicIds);
  const { ready: contentReady } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const topic = getBattlesTopic(topicId);
  const reportRef = useGuideContentReportRef("battles", topic, "/battles");
  useEnsureBattlesProgressLoaded();

  const detailPath = topic ? `/battles/${topic.id}` : "/battles";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("battles.title"), path: "/battles" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={topic?.title ?? t("battles.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
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
          title={t("battles.notFound")}
          actionLabel={t("battles.title")}
          onAction={() => router.replace("/battles" as Href)}
        />
      ) : (
        <LearnSplitLayout
          aside={
            <ModuleTopicAside
              title={t("battles.title")}
              basePath="/battles"
              topics={getBattlesTopics()}
              currentId={topic.id}
              completedIds={completedIds}
            />
          }
        >
          <Stagger>
            <LearnReadingChrome surface="battles">
              <BattlesTopicContent topic={topic} />
            </LearnReadingChrome>
            <JannahDisclaimer textKey="battles.disclaimer" contentRef={reportRef} />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles/[topic]");
