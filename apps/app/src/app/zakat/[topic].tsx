import type { ZakatGuideSectionKey } from "@munib-tracker/shared/content/zakat-guide";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { ZakatTopicContent } from "@/components/zakat/zakat-topic-content";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  const { ZAKAT_GUIDE_SECTIONS } = await import("@munib-tracker/shared/content/zakat-guide");
  return ZAKAT_GUIDE_SECTIONS.map((section) => ({ topic: section }));
}

export default function ZakatTopicScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const [sections, setSections] = useState<ZakatGuideSectionKey[] | null>(null);
  useEffect(() => {
    void import("@munib-tracker/shared/content/zakat-guide").then(({ ZAKAT_GUIDE_SECTIONS }) =>
      setSections([...ZAKAT_GUIDE_SECTIONS]),
    );
  }, []);
  const contentReady = sections !== null;
  // Desktop (≥1200): sibling zakat topics in a sticky aside.
  const { maxContentWidth } = useLearnWideLayout();
  const asideTopics = useMemo(
    () => (sections ?? []).map((id) => ({ id, title: t(`zakat.guide.${id}.title`) })),
    [sections, t],
  );
  const valid = contentReady && sections.includes(topicId as ZakatGuideSectionKey);
  const locale = i18n.language?.split("-")[0] ?? "en";
  const reportRef = valid
    ? buildContentReportRef("zakat", topicId, `/zakat/${topicId}`, locale, {
        snapshot: {
          title: t(`zakat.guide.${topicId}.title`),
          translation: t(`zakat.guide.${topicId}.summary`),
        },
      })
    : undefined;

  const detailPath = valid ? `/zakat/${topicId}` : "/zakat";
  const seoTitle = valid ? t(`zakat.guide.${topicId}.title`) : undefined;
  const seoDescription = valid ? t(`zakat.guide.${topicId}.summary`) : undefined;
  const crumbs = valid
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("zakat.title"), path: "/zakat" },
        { name: seoTitle ?? "", path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      eyebrow={t("zakat.eyebrow")}
      title={valid ? t(`zakat.guide.${topicId}.title`) : t("zakat.title")}
      subtitle={valid ? t(`zakat.guide.${topicId}.summary`) : ""}
      onBack={() => goBackOrReplace(router, "/zakat")}
      maxContentWidth={maxContentWidth}
    >
      <Seo
        path={detailPath}
        title={seoTitle}
        description={seoDescription}
        type={valid ? "article" : undefined}
        index={valid}
        breadcrumbs={crumbs}
        jsonLd={
          valid
            ? [
                articleSchema({
                  path: detailPath,
                  headline: seoTitle ?? "",
                  description: seoDescription ?? "",
                  breadcrumbs: crumbs,
                }),
              ]
            : undefined
        }
      />
      {!contentReady ? null : !valid ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("zakat.notFound")}
          actionLabel={t("zakat.title")}
          onAction={() => router.replace("/zakat")}
        />
      ) : (
        <LearnSplitLayout
          aside={
            <ModuleTopicAside
              title={t("zakat.title")}
              basePath="/zakat"
              topics={asideTopics}
              currentId={topicId}
            />
          }
        >
          <Stagger>
            <LearnReadingChrome surface="jannah">
              <ZakatTopicContent topicId={topicId as ZakatGuideSectionKey} />
            </LearnReadingChrome>
            <JannahDisclaimer textKey="zakat.disclaimer" contentRef={reportRef} />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zakat/[topic]");
