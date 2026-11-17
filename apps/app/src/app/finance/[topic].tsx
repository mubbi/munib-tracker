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
import { getIslamicFinanceTopic, getIslamicFinanceTopics } from "@/lib/islamic-finance";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return getIslamicFinanceTopics().map((topic) => ({ topic: topic.id }));
}

export default function FinanceTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  // Desktop (≥1200): sibling topics + progress in a sticky aside.
  const { maxContentWidth } = useLearnWideLayout();
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
          title={t("finance.notFound")}
          actionLabel={t("finance.title")}
          onAction={() => router.replace("/finance" as Href)}
        />
      ) : (
        <LearnSplitLayout
          aside={
            <ModuleTopicAside
              title={t("finance.title")}
              basePath="/finance"
              topics={getIslamicFinanceTopics()}
              currentId={topic.id}
            />
          }
        >
          <Stagger>
            <LearnReadingChrome surface="jannah">
              <LearnGuideTopicContent
                topic={topic}
                ns="finance"
                sectionTitle={t("finance.title")}
              />
            </LearnReadingChrome>
            <JannahDisclaimer textKey="finance.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}
