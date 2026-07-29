import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { NavRow } from "@/components/ui/nav-row";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { type AppIcon, NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronForward } from "@/lib/rtl";
import { useEnsureDuaFavoritesLoaded, useFavoriteDuaIds } from "@/stores/dua-favorites-store";
import {
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";
import { useEnsureNameFavoritesLoaded, useFavoriteNameIds } from "@/stores/name-favorites-store";
import { useFavoriteZikrIds } from "@/stores/preferences-store";
import { useQuranBookmarks } from "@/stores/quran-store";

type BookmarkSection = "reading" | "saved";

type BookmarkSource = {
  id: string;
  section: BookmarkSection;
  icon: AppIcon;
  labelKey: string;
  exploreLabelKey: string;
  hintKey: string;
  listRoute:
    | "/quran/bookmarks"
    | "/hadith/bookmarks"
    | "/dua/favorites"
    | "/zikr/favorites"
    | "/duroods/favorites"
    | "/names-of-allah/favorites";
  exploreRoute: "/quran" | "/hadith" | "/dua" | "/zikr" | "/duroods" | "/names-of-allah";
};

const BOOKMARK_SOURCES: BookmarkSource[] = [
  {
    id: "quran",
    section: "reading",
    icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
    labelKey: "bookmarks.quran",
    exploreLabelKey: "bookmarks.exploreQuran",
    hintKey: "bookmarks.exploreQuranHint",
    listRoute: "/quran/bookmarks",
    exploreRoute: "/quran",
  },
  {
    id: "hadith",
    section: "reading",
    icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
    labelKey: "bookmarks.hadith",
    exploreLabelKey: "bookmarks.exploreHadith",
    hintKey: "bookmarks.exploreHadithHint",
    listRoute: "/hadith/bookmarks",
    exploreRoute: "/hadith",
  },
  {
    id: "duas",
    section: "saved",
    icon: {
      ios: "hands.and.sparkles.fill",
      android: "volunteer_activism",
      web: "volunteer_activism",
    },
    labelKey: "bookmarks.duas",
    exploreLabelKey: "bookmarks.exploreDuas",
    hintKey: "bookmarks.exploreDuasHint",
    listRoute: "/dua/favorites",
    exploreRoute: "/dua",
  },
  {
    id: "zikr",
    section: "saved",
    icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
    labelKey: "bookmarks.zikr",
    exploreLabelKey: "bookmarks.exploreZikr",
    hintKey: "bookmarks.exploreZikrHint",
    listRoute: "/zikr/favorites",
    exploreRoute: "/zikr",
  },
  {
    id: "duroods",
    section: "saved",
    icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
    labelKey: "bookmarks.duroods",
    exploreLabelKey: "bookmarks.exploreDuroods",
    hintKey: "bookmarks.exploreDuroodsHint",
    listRoute: "/duroods/favorites",
    exploreRoute: "/duroods",
  },
  {
    id: "names",
    section: "saved",
    icon: NAMES_OF_ALLAH_ICON,
    labelKey: "bookmarks.names",
    exploreLabelKey: "bookmarks.exploreNames",
    hintKey: "bookmarks.exploreNamesHint",
    listRoute: "/names-of-allah/favorites",
    exploreRoute: "/names-of-allah",
  },
];

const SECTION_META: Record<
  BookmarkSection,
  { titleKey: string; exploreTitleKey: string; icon: SymbolViewProps["name"] }
> = {
  reading: {
    titleKey: "bookmarks.reading",
    exploreTitleKey: "bookmarks.exploreReading",
    icon: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
  },
  saved: {
    titleKey: "bookmarks.saved",
    exploreTitleKey: "bookmarks.exploreSaved",
    icon: { ios: "star.fill", android: "star", web: "star" },
  },
};

export default function BookmarksHubScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureDuaFavoritesLoaded();
  useEnsureDuroodFavoritesLoaded();
  useEnsureNameFavoritesLoaded();

  const quranBookmarks = useQuranBookmarks();
  const duaFavorites = useFavoriteDuaIds();
  const zikrFavorites = useFavoriteZikrIds();
  const duroodFavorites = useFavoriteDuroodIds();
  const nameFavorites = useFavoriteNameIds();

  const [hadithCount, setHadithCount] = useState(0);
  const [hadithLoaded, setHadithLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void HadithRepository.getBookmarks().then((list) => {
      if (!active) return;
      setHadithCount(list.length);
      setHadithLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      quran: quranBookmarks.length,
      hadith: hadithCount,
      duas: duaFavorites.length,
      zikr: zikrFavorites.length,
      duroods: duroodFavorites.length,
      names: nameFavorites.length,
    }),
    [
      quranBookmarks.length,
      hadithCount,
      duaFavorites.length,
      zikrFavorites.length,
      duroodFavorites.length,
      nameFavorites.length,
    ],
  );

  const total =
    counts.quran + counts.hadith + counts.duas + counts.zikr + counts.duroods + counts.names;
  const loaded = hadithLoaded;
  const isEmpty = loaded && total === 0;

  const subtitle = !loaded
    ? t("bookmarks.subtitle")
    : total > 0
      ? t("bookmarks.subtitleCount", { count: total })
      : t("bookmarks.emptySubtitle");

  const renderSection = (section: BookmarkSection) => {
    const items = BOOKMARK_SOURCES.filter((source) => source.section === section);
    const meta = SECTION_META[section];

    return (
      <Card key={section} padding="three">
        <SectionHeader title={t(isEmpty ? meta.exploreTitleKey : meta.titleKey)} icon={meta.icon} />
        <View style={styles.list}>
          {items.map((source) =>
            isEmpty ? (
              <ExploreRow
                key={source.id}
                icon={source.icon}
                label={t(source.exploreLabelKey)}
                hint={tTv(t, source.hintKey, `${source.hintKey}Tv`)}
                onPress={() => router.push(source.exploreRoute)}
              />
            ) : (
              <NavRow
                key={source.id}
                icon={source.icon}
                label={t(source.labelKey)}
                count={counts[source.id as keyof typeof counts] || undefined}
                onPress={() => router.push(source.listRoute)}
              />
            ),
          )}
        </View>
      </Card>
    );
  };

  return (
    <ScreenLayout
      eyebrow={t("bookmarks.eyebrow")}
      title={t("bookmarks.title")}
      subtitle={subtitle}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/bookmarks" />
      <Stagger>
        {isEmpty ? (
          <Card variant="muted" padding="three">
            <View style={styles.hero}>
              <IconWell
                icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
                well={48}
                size={22}
              />
              <View style={styles.heroText}>
                <ThemedText type="subtitle">{t("bookmarks.emptyTitle")}</ThemedText>
                <ThemedText type="small" themeColor="mutedForeground">
                  {t("bookmarks.emptyDesc")}
                </ThemedText>
              </View>
            </View>
          </Card>
        ) : null}

        {renderSection("reading")}
        {renderSection("saved")}
      </Stagger>
    </ScreenLayout>
  );
}

function ExploreRow({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: AppIcon;
  label: string;
  hint: string;
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${hint}`}
      onPress={onPress}
      style={[styles.exploreRow, { backgroundColor: colors.muted }]}
    >
      <IconWell icon={icon} />
      <View style={styles.exploreBody}>
        <ThemedText type="small">{label}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
          {hint}
        </ThemedText>
      </View>
      <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  heroText: {
    flex: 1,
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  exploreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  exploreBody: {
    flex: 1,
    gap: 2,
  },
});
