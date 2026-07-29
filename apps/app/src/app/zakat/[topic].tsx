import type { ZakatGuideSectionKey } from "@munib-tracker/shared/content/zakat-guide";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { ZakatTopicContent } from "@/components/zakat/zakat-topic-content";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { goBackOrReplace } from "@/lib/navigation";
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
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <ZakatTopicContent topicId={topicId as ZakatGuideSectionKey} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="zakat.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
