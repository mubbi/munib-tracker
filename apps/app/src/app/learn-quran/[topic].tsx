import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { QuranGuideTopicContent } from "@/components/quran-guide/topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideTopic,
  getQuranGuideTopics,
} from "@/lib/quran-guide";
import { articleSchema } from "@/lib/seo/structured-data";
import { useEnsureQuranGuideProgressLoaded } from "@/stores/quran-guide-progress-store";

export function generateStaticParams(): Array<{ topic: string }> {
  return getQuranGuideTopics().map((tpc) => ({ topic: tpc.id }));
}

export default function LearnQuranTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready: contentReady } = useEnsureContent(ensureQuranGuideContent);
  const topic = getQuranGuideTopic(topicId);
  const reportRef = useGuideContentReportRef("learn_quran", topic, "/learn-quran");
  useEnsureQuranGuideProgressLoaded();

  const detailPath = topic ? `/learn-quran/${topic.id}` : "/learn-quran";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("learnQuran.title"), path: "/learn-quran" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      readingProgress
      eyebrow={t("learnQuran.eyebrow")}
      title={topic?.title ?? t("learnQuran.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
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
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.title")}
          onAction={() => router.replace("/learn-quran" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="learn_quran">
            <QuranGuideTopicContent topic={topic} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="learnQuran.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
