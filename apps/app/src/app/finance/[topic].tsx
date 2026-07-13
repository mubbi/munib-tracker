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
import {
  ensureIslamicFinanceContent,
  getIslamicFinanceTopic,
  getIslamicFinanceTopics,
} from "@/lib/islamic-finance";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  await ensureIslamicFinanceContent();
  return getIslamicFinanceTopics().map((topic) => ({ topic: topic.id }));
}

export default function FinanceTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { ready: contentReady } = useEnsureContent(ensureIslamicFinanceContent);
  const topic = getIslamicFinanceTopic(topicId);

  const detailPath = topic ? `/finance/${topic.id}` : "/finance";
  const crumbs = topic
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("finance.title"), path: "/finance" },
        { name: topic.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("finance.eyebrow")}
      title={topic?.title ?? t("finance.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/finance" as Href)}
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
          title={t("finance.notFound")}
          actionLabel={t("finance.title")}
          onAction={() => router.replace("/finance" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <LearnGuideTopicContent topic={topic} ns="finance" sectionTitle={t("finance.title")} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="finance.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
