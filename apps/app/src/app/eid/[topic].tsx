import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureEidGuideContent, getEidGuideTopic, getEidGuideTopics } from "@/lib/eid-guide";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams(): Array<{ topic: string }> {
  return getEidGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function EidTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready: contentReady } = useEnsureContent(ensureEidGuideContent);
  const topic = getEidGuideTopic(topicId);

  const detailPath = topic ? `/eid/${topic.id}` : "/eid";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("eid.title"), path: "/eid" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("eid.eyebrow")}
      title={topic?.title ?? t("eid.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/eid" as Href)}
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
          title={t("eid.notFound")}
          actionLabel={t("eid.title")}
          onAction={() => router.replace("/eid" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent topic={topic} ns="eid" sectionTitle={t("eid.title")} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="eid.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
