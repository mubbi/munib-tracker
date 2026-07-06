import { ZAKAT_GUIDE_SECTIONS, type ZakatGuideSectionKey } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { ZakatTopicContent } from "@/components/zakat/zakat-topic-content";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { articleSchema } from "@/lib/seo/structured-data";

function isZakatTopic(value: string | undefined): value is ZakatGuideSectionKey {
  return ZAKAT_GUIDE_SECTIONS.includes(value as ZakatGuideSectionKey);
}

export function generateStaticParams(): Array<{ topic: string }> {
  return ZAKAT_GUIDE_SECTIONS.map((section) => ({ topic: section }));
}

export default function ZakatTopicScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const valid = isZakatTopic(topicId);
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
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/zakat"))}
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
      {!valid ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("zakat.notFound")}
          actionLabel={t("zakat.title")}
          onAction={() => router.replace("/zakat")}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="jannah">
            <ZakatTopicContent topicId={topicId} />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="zakat.disclaimer" contentRef={reportRef} />
        </Stagger>
      )}
    </ScreenLayout>
  );
}
