import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useTranslation } from "react-i18next";

import { BattlesTopicContent } from "@/components/battles/topic-content";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { getBattlesTopic, getBattlesTopics } from "@/lib/battles";
import { articleSchema } from "@/lib/seo/structured-data";
import { useEnsureBattlesProgressLoaded } from "@/stores/battles-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getBattlesTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function BattlesTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
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
      onBack={() => (goBackOrReplace(router, "/battles" as Href))}
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
          title={t("battles.notFound")}
          actionLabel={t("battles.title")}
          onAction={() => router.replace("/battles" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="battles">
            <BattlesTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="battles.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
