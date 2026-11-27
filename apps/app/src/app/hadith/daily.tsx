import type { HadithItem } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { HadithIsnadChain } from "@/components/hadith/hadith-isnad-chain";
import { HadithSharhBlock } from "@/components/hadith/hadith-sharh-block";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { HadithRepository } from "@/db";
import type { HadithBookmark } from "@/db/repositories/hadith-repository";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { ensureDailyHadithPool, recentDailyHadith } from "@/lib/daily-hadith";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useHadithPrefs } from "@/stores/hadith-store";
import { usePreferences } from "@/stores/preferences-store";

const ARCHIVE_DAYS = 21;

function DailyHadithCard({
  entry,
  featured,
  dateLabel,
}: {
  entry: { date: string; hadith: HadithItem };
  featured: boolean;
  dateLabel: string;
}) {
  const { colors, tokens } = useThemeTokens();
  const prefs = useHadithPrefs();
  const { hadith } = entry;
  const displayTranslation = useHadithTranslation(hadith);
  const showIsnad = prefs.showIsnad && (hadith.isnad?.length ?? 0) > 0;
  const showSharh = prefs.showSharh && Boolean(hadith.sharhArabic);
  const router = useRouter();
  const { t } = useTranslation();
  const { fontPrefs } = usePreferences();
  const sizes = resolveReadingFontSizes("hadith", fontPrefs);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    void HadithRepository.isBookmarked(hadith.id).then((value) => {
      if (active) setSaved(value);
    });
    return () => {
      active = false;
    };
  }, [hadith.id]);
  const tv = isTV();
  const openInCollection = () =>
    router.push({
      pathname: "/hadith/[collection]",
      params: { collection: hadith.collection, q: hadith.reference },
    });
  const undoToast = useUndoToast();
  // Save is instant; un-save offers Undo that restores the exact saved record.
  const toggleSaved = async () => {
    if (!saved) {
      setSaved(await HadithRepository.toggleBookmark(hadith));
      return;
    }
    let removed: HadithBookmark | null = null;
    await undoToast.run({
      do: async () => {
        removed = await HadithRepository.removeBookmark(hadith.id);
        setSaved(false);
      },
      undo: async () => {
        if (removed && (await HadithRepository.restoreBookmark(removed))) setSaved(true);
      },
      messageKey: "hadith.removedFromSaved",
    });
  };
  const headContent = (
    <>
      <Pill
        label={dateLabel}
        compact
        color={featured ? tokens.status.info.text : tokens.accentOnSoft}
        background={featured ? tokens.status.info.soft : tokens.accentSoft}
      />
      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1} style={styles.ref}>
        {hadith.reference}
      </ThemedText>
    </>
  );
  return (
    <Card
      style={
        featured
          ? {
              flexGrow: 1,
              backgroundColor: tokens.status.info.soft,
              borderColor: tokens.status.info.color,
              borderWidth: BorderWidth.hairline,
            }
          : styles.cardFill
      }
    >
      {tv ? (
        // TV: the archive is otherwise pure text — a focusable header per card
        // gives the D-pad stops that scroll the feed (Select opens it in the
        // collection reader).
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={`${dateLabel}, ${hadith.reference}`}
          onPress={() =>
            router.push({
              pathname: "/hadith/[collection]",
              params: { collection: hadith.collection, q: hadith.reference },
            })
          }
          style={[styles.head, styles.headTv]}
        >
          {headContent}
        </PressableScale>
      ) : (
        <View style={styles.head}>{headContent}</View>
      )}

      {hadith.arabic ? (
        <ThemedText
          type="arabic"
          accessibilityLanguage="ar"
          style={[styles.arabic, arabicReadingLayout(sizes.arabic)]}
        >
          {hadith.arabic}
        </ThemedText>
      ) : null}

      {showIsnad && hadith.isnad ? <HadithIsnadChain isnad={hadith.isnad} /> : null}

      {!showIsnad && hadith.narrator ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.narrator}>
          {hadith.narrator}
        </ThemedText>
      ) : null}

      <ThemedText
        type="default"
        style={[
          styles.english,
          { fontSize: sizes.translation, lineHeight: sizes.translation * 1.6 },
        ]}
      >
        {displayTranslation}
      </ThemedText>

      {showSharh && hadith.sharhArabic ? (
        <HadithSharhBlock sharhArabic={hadith.sharhArabic} arabicSize={17} />
      ) : null}

      {/* Touch actions (TV opens the reader from the focusable header). */}
      {tv ? null : (
        <View style={styles.actions}>
          <Button
            label={saved ? t("common.saved") : t("common.save")}
            icon={
              saved
                ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
            }
            labelColor={saved ? colors.accentText : undefined}
            variant="ghost"
            onPress={() => void toggleSaved()}
          />
          <Button
            label={t("dailyHadith.openInCollection")}
            variant="ghost"
            onPress={openInCollection}
          />
        </View>
      )}
    </Card>
  );
}

export default function DailyHadithScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { formatIso } = useFormatCalendarDate();
  const today = getLocalDateString();
  const tv = isTV();
  const [feed, setFeed] = useState<{ date: string; hadith: HadithItem }[] | null>(null);

  useEffect(() => {
    let active = true;
    void ensureDailyHadithPool().then(() => {
      if (active) setFeed(recentDailyHadith(today, ARCHIVE_DAYS));
    });
    return () => {
      active = false;
    };
  }, [today]);

  const formatDate = (iso: string) =>
    iso === today
      ? t("common.today")
      : formatIso(iso, {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

  return (
    <ScreenLayout
      eyebrow={t("dailyHadith.eyebrow")}
      title={t("dailyHadith.title")}
      subtitle={t("dailyHadith.subtitle")}
      onBack={() => goBackOrReplace(router, "/hadith")}
    >
      <Seo path="/hadith/daily" />
      {feed == null ? (
        <ContentState status="loading" skeleton="card" skeletonCount={2} />
      ) : feed.length === 0 ? (
        <EmptyState
          icon={{ ios: "text.book.closed", android: "auto_stories", web: "auto_stories" }}
          title={t("dailyHadith.emptyTitle")}
          description={t("dailyHadith.emptyDesc")}
        />
      ) : (
        /* Wide web / tablets: the archive reads as a two-column feed (TV keeps one). */
        <ResponsiveGrid columns={tv ? 1 : undefined} maxColumns={2}>
          {feed.map((entry, index) => (
            <DailyHadithCard
              key={entry.date}
              entry={entry}
              featured={index === 0}
              dateLabel={formatDate(entry.date)}
            />
          ))}
        </ResponsiveGrid>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardFill: { flexGrow: 1 },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  headTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  ref: { flexShrink: 1 },
  arabic: { marginBottom: Spacing.three },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
  narrator: { marginBottom: Spacing.one },
  english: { marginTop: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/hadith/daily");
