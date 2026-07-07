import { DUA_ITEMS, getDuaById } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { buildDuaActivity } from "@/lib/continue-activity";
import { goBackOrReplace } from "@/lib/navigation";
import { articleSchema } from "@/lib/seo/structured-data";
import { formatReadingShare } from "@/lib/share";
import { recordContinueActivity } from "@/stores/continue-store";
import {
  useDuaFavoritesActions,
  useEnsureDuaFavoritesLoaded,
  useIsFavoriteDua,
} from "@/stores/dua-favorites-store";

/** Pre-render a static HTML page for every bundled dua at web export time. */
export function generateStaticParams(): Array<{ id: string }> {
  return DUA_ITEMS.map((dua) => ({ id: dua.id }));
}

export default function DuaDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const item = params.id ? getDuaById(params.id) : undefined;
  useEnsureDuaFavoritesLoaded();
  const isFavorite = useIsFavoriteDua(item?.id ?? "");
  const { toggle } = useDuaFavoritesActions();
  const shareCard = useShareContentCard();

  useEffect(() => {
    if (item) recordContinueActivity(buildDuaActivity(item));
  }, [item]);

  if (!item) {
    return (
      <ScreenLayout title={t("dua.detailEyebrow")} onBack={() => goBackOrReplace(router, "/")}>
        <Seo
          path={`/dua/detail/${params.id ?? ""}`}
          title={t("dua.notFoundTitle")}
          description={t("dua.notFoundDesc")}
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("dua.notFoundTitle")}
          description={t("dua.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const onShare = async () => {
    await shareCard.share({
      message: formatReadingShare(item),
      sectionTitle: t("share.sectionReading"),
      contentLabel: item.title ?? item.reference,
      filenameSlug: "dua",
      shareKey: item.id,
      content: { kind: "reading", item },
    });
  };

  const duaTitle = item.title;
  const duaDescription = `${item.translation}${item.reference ? ` — ${item.reference}` : ""}`.slice(
    0,
    155,
  );
  const duaBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("dua.title"), path: "/dua" },
    { name: duaTitle, path: `/dua/detail/${item.id}` },
  ];
  const locale = i18n.language?.split("-")[0] ?? "en";
  const contentRef = buildContentReportRef("dua", item.id, `/dua/detail/${item.id}`, locale, {
    snapshot: {
      title: item.title,
      arabic: item.arabic,
      transliteration: item.transliteration,
      translation: item.translation,
      reference: item.reference,
    },
  });

  return (
    <ScreenLayout
      eyebrow={t("dua.detailEyebrow")}
      title={item.title}
      onBack={() => goBackOrReplace(router, "/")}
    >
      {shareCard.SnapshotHost}
      <Seo
        path={`/dua/detail/${item.id}`}
        title={duaTitle}
        description={duaDescription}
        type="article"
        breadcrumbs={duaBreadcrumbs}
        jsonLd={[
          articleSchema({
            path: `/dua/detail/${item.id}`,
            headline: duaTitle,
            description: duaDescription,
            type: "CreativeWork",
            inLanguage: "ar",
            breadcrumbs: duaBreadcrumbs,
          }),
        ]}
      />
      <Stagger>
        <ReadingCard
          item={item}
          shareCard={shareCard}
          sourceHref={`/dua/detail/${item.id}`}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggle(item.id)}
          contentRef={contentRef}
        />
        <Button
          label={
            shareCard.isSharing(item.id)
              ? t("share.preparing")
              : shareCard.isGesturePending(item.id)
                ? t("share.tapToShare")
                : t("dua.share")
          }
          variant="secondary"
          icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
          fullWidth
          disabled={shareCard.isSharing(item.id)}
          onPress={onShare}
        />
      </Stagger>
    </ScreenLayout>
  );
}
