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
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureDailyHadithPool, recentDailyHadith } from "@/lib/daily-hadith";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useHadithPrefs } from "@/stores/hadith-store";

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
  const tv = isTV();
  const headContent = (
    <>
      <Pill
        label={dateLabel}
        compact
        color={featured ? tokens.status.info.text : colors.accent}
        background={featured ? tokens.status.info.soft : tokens.accentSoft}
      />
      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1} style={styles.ref}>
        {hadith.reference}
      </ThemedText>
    </>
  );
  return (
    <Card
      padding="three"
      style={
        featured
          ? {
              flexGrow: 1,
              backgroundColor: tokens.status.info.soft,
              borderColor: tokens.status.info.color,
              borderWidth: StyleSheet.hairlineWidth,
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
        <ThemedText type="arabic" style={styles.arabic}>
          {hadith.arabic}
        </ThemedText>
      ) : null}

      {showIsnad && hadith.isnad ? <HadithIsnadChain isnad={hadith.isnad} /> : null}

      {!showIsnad && hadith.narrator ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.narrator}>
          {hadith.narrator}
        </ThemedText>
      ) : null}

      <ThemedText type="default" style={styles.english}>
        {displayTranslation}
      </ThemedText>

      {showSharh && hadith.sharhArabic ? (
        <HadithSharhBlock sharhArabic={hadith.sharhArabic} arabicSize={17} />
      ) : null}
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
      {feed == null ? null : feed.length === 0 ? (
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
  ref: { flexShrink: 1, textAlign: "right" },
  arabic: { marginBottom: Spacing.three },
  narrator: { marginBottom: Spacing.one },
  english: { marginTop: Spacing.one },
});
