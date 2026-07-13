import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnDuaTopicContent } from "@/components/learn-dua/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { ensureLearnDuaContent, getLearnDuaTopic, getLearnDuaTopics } from "@/lib/learn-dua";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";
import { useEnsureLearnDuaProgressLoaded } from "@/stores/learn-dua-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getLearnDuaTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function LearnDuaTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready: contentReady } = useEnsureContent(ensureLearnDuaContent);
  const topic = getLearnDuaTopic(topicId);
  const reportRef = useGuideContentReportRef("learn_dua", topic, "/learn-dua");
  useEnsureLearnDuaProgressLoaded();

  const detailPath = topic ? `/learn-dua/${topic.id}` : "/learn-dua";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("learnDua.title"), path: "/learn-dua" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      readingProgress
      eyebrow={t("learnDua.eyebrow")}
      title={topic?.title ?? t("learnDua.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/learn-dua" as Href)}
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
      {!contentReady ? null : !topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnDua.notFound")}
          actionLabel={t("learnDua.title")}
          onAction={() => router.replace("/learn-dua" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="learn_dua">
            <LearnDuaTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="learnDua.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
