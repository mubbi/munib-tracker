import type { Surah } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type ListRenderItem,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahByNumber, getSurahMeta } from "@/lib/quran";
import { chevronForward } from "@/lib/rtl";
import { type SurahRevelationFilter, searchSurahList } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { useLastRead, useQuranBookmarks } from "@/stores/quran-store";

const TOTAL_SURAHS = 114;

/** All 114 surahs as crawlable ItemList entries (the visual list isn't <a>-based). */
const SURAH_ITEMS = getSurahMeta().map((s) => ({
  name: `${s.number}. ${s.nameTransliteration} (${s.nameEnglish})`,
  path: `/quran/${s.number}`,
}));

const REVELATION_FILTERS: SurahRevelationFilter[] = ["all", "makkah", "madinah"];

function revelationTone(
  place: Surah["revelationPlace"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
) {
  return place === "makkah" ? tokens.status.info : tokens.status.warning;
}

/**
 * Memoized surah row for the virtualized list. Extracted + `memo`'d so scrolling
 * the 114-row list only re-renders rows whose props actually change.
 */
const SurahRow = memo(function SurahRow({
  surah,
  onPress,
}: {
  surah: Surah;
  onPress: (n: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const revelation = revelationTone(surah.revelationPlace, tokens);
  const makki = surah.revelationPlace === "makkah";

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${surah.nameEnglish}, ${makki ? t("quran.makki") : t("quran.madani")}`}
      onPress={() => onPress(surah.number)}
      style={[
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: tokens.hairline,
        },
      ]}
    >
      <ListIndexBadge index={surah.number} />
      <View style={styles.rowBody}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {surah.nameTransliteration}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {surah.nameEnglish} · {t("quran.ayahCount", { count: surah.ayahCount })}
        </ThemedText>
      </View>
      <View style={styles.rowMeta}>
        <ThemedText type="arabic" style={styles.rowArabic}>
          {surah.nameArabic}
        </ThemedText>
        <Pill
          label={makki ? t("quran.makki") : t("quran.madani")}
          color={revelation.text}
          background={revelation.soft}
        />
      </View>
      <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
});

function RevelationFilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.95}
      style={[
        styles.filterChip,
        active
          ? { backgroundColor: colors.accent, borderColor: colors.accent }
          : {
              backgroundColor: colors.background,
              borderColor: withAlpha(colors.border, tokens.isDark ? 0.55 : 0.85),
            },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={{ color: active ? colors.accentForeground : colors.mutedForeground }}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

function ContinueReadingCard({
  surahNumber,
  ayah,
  onPress,
}: {
  surahNumber: number;
  ayah: number;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const surah = getSurahByNumber(surahNumber);

  return (
    <Card
      padding="three"
      onPress={onPress}
      accessibilityLabel={t("quran.continueReading")}
      style={[
        styles.continueCard,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28),
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.continueTop}>
        <View style={[styles.continueBadge, { backgroundColor: colors.background }]}>
          <ThemedText type="subtitle" style={{ color: colors.accent }}>
            {surahNumber}
          </ThemedText>
        </View>
        <View style={styles.continueCopy}>
          <Pill
            label={t("quran.continueReading")}
            color={colors.accentText}
            background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
          />
          <ThemedText type="smallBold" numberOfLines={1}>
            {surah?.nameTransliteration ?? t("quran.continueAt", { surah: surahNumber, ayah })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {surah
              ? `${surah.nameEnglish} · ${t("quran.continueAt", { surah: surahNumber, ayah })}`
              : t("quran.continueAt", { surah: surahNumber, ayah })}
          </ThemedText>
          {surah ? (
            <ThemedText type="arabic" style={[styles.continueArabic, { color: colors.accentText }]}>
              {surah.nameArabic}
            </ThemedText>
          ) : null}
        </View>
        <IconWell
          icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          tint={colors.accent}
          background={withAlpha(colors.accent, tokens.isDark ? 0.22 : 0.12)}
          well={44}
          size={20}
        />
      </View>
      <View style={[styles.continueFooter, { borderTopColor: withAlpha(colors.accent, 0.22) }]}>
        <ThemedText type="smallBold" style={{ color: colors.accentText }}>
          {t("home.continueAction.quran")}
        </ThemedText>
        <SymbolView name={chevronForward} size={14} tintColor={colors.accentText} />
      </View>
    </Card>
  );
}

export default function QuranHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const [query, setQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<SurahRevelationFilter>("all");
  const lastRead = useLastRead();
  const quranBookmarks = useQuranBookmarks();

  const filtered = useMemo(
    () => searchSurahList(query, { revelation: revelationFilter }),
    [query, revelationFilter],
  );

  const isFiltering = query.trim().length > 0 || revelationFilter !== "all";

  const shortcuts = useMemo<QuickActionItem[]>(
    () => [
      {
        id: "search",
        label: t("quran.search"),
        icon: { ios: "magnifyingglass", android: "search", web: "search" },
        tint: tokens.status.info.color,
        onPress: () => router.push("/quran/search"),
      },
      {
        id: "juz",
        label: t("quran.juz"),
        icon: { ios: "square.grid.3x3.fill", android: "grid_view", web: "grid_view" },
        tint: colors.accent,
        onPress: () => router.push("/quran/juz"),
      },
      {
        id: "learn",
        label: t("quran.learn"),
        icon: { ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" },
        tint: tokens.status.warning.color,
        onPress: () => router.push("/learn-quran"),
      },
      {
        id: "khatm",
        label: t("khatm.short"),
        icon: { ios: "chart.line.uptrend.xyaxis", android: "trending_up", web: "trending_up" },
        tint: tokens.status.success.color,
        onPress: () => router.push("/quran/khatm"),
      },
      {
        id: "hifz",
        label: t("hifz.short"),
        icon: { ios: "brain.head.profile", android: "psychology", web: "psychology" },
        tint: tokens.status.danger.color,
        onPress: () => router.push("/quran/hifz"),
      },
    ],
    [t, router, colors.accent, tokens],
  );

  const revelationFilterLabel = useCallback(
    (filter: SurahRevelationFilter) => {
      if (filter === "all") return t("quran.filterAll");
      if (filter === "makkah") return t("quran.makki");
      return t("quran.madani");
    },
    [t],
  );

  const openSurah = useCallback(
    (n: number) => router.push({ pathname: "/quran/[surah]", params: { surah: String(n) } }),
    [router],
  );

  const keyExtractor = useCallback((surah: Surah) => String(surah.number), []);

  const renderItem = useCallback<ListRenderItem<Surah>>(
    ({ item }) => <SurahRow surah={item} onPress={openSurah} />,
    [openSurah],
  );

  // The header (shortcuts, continue card, search + filters) scrolls with the list
  // as the FlatList's header so the surah list owns scrolling.
  const listHeader = (
    <View style={styles.header}>
      <Stagger>
        <SavedNavCard
          title={t("quran.bookmarks")}
          viewLabel={t("quran.viewBookmarks")}
          count={quranBookmarks.length > 0 ? quranBookmarks.length : undefined}
          headerIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
          rowIcon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          onPress={() => router.push("/quran/bookmarks")}
        />

        <Card padding="three">
          <QuickActionGrid items={shortcuts} columns={5} />
        </Card>

        {lastRead ? (
          <ContinueReadingCard
            surahNumber={lastRead.surah}
            ayah={lastRead.ayah}
            onPress={() => openSurah(lastRead.surah)}
          />
        ) : null}

        <Card padding="three">
          <View
            style={[
              styles.searchField,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <SymbolView
              name={{ ios: "magnifyingglass", android: "search", web: "search" }}
              size={18}
              tintColor={colors.mutedForeground}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("quran.searchSurah")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("quran.searchSurah")}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {query.length > 0 ? (
              <IconButton
                name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
                accessibilityLabel={t("search.clear")}
                onPress={() => setQuery("")}
                size={18}
                tintColor={colors.mutedForeground}
                hitTarget={36}
                haptic="light"
              />
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.filterRow}
          >
            {REVELATION_FILTERS.map((filter) => (
              <RevelationFilterChip
                key={filter}
                label={revelationFilterLabel(filter)}
                active={revelationFilter === filter}
                onPress={() => setRevelationFilter(filter)}
              />
            ))}
          </ScrollView>

          <SectionHeader
            title={t("quran.surahList")}
            icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            actionLabel={
              isFiltering
                ? t("quran.surahCount", { shown: filtered.length, total: TOTAL_SURAHS })
                : undefined
            }
          />
        </Card>
      </Stagger>
    </View>
  );

  return (
    <>
      <Seo
        path="/quran"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("quran.title"), path: "/quran" },
        ]}
        jsonLd={[
          collectionPageSchema({
            path: "/quran",
            name: "The Noble Qur'an — All 114 Surahs",
            description:
              "Read and listen to the complete Qur'an offline with Arabic, transliteration, translations, and recitation.",
            items: SURAH_ITEMS,
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("quran.title"), path: "/quran" },
            ],
          }),
        ]}
      />
      <ScreenLayout
        scrollable={false}
        eyebrow={t("quran.eyebrow")}
        title={t("quran.title")}
        subtitle={t("quran.subtitle")}
        onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <EmptyState
              icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
              title={t("quran.noResults")}
            />
          }
          style={styles.flatList}
          contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={12}
          maxToRenderPerBatch={6}
          windowSize={5}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews
        />
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  flatList: { flex: 1, width: "100%" },
  listContent: { gap: Spacing.two },
  header: { gap: Spacing.four },
  continueCard: { gap: 0, overflow: "hidden" },
  continueTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  continueBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  continueCopy: { flex: 1, gap: Spacing.one },
  continueArabic: {
    fontSize: 18,
    writingDirection: "rtl",
    textAlign: "right",
  },
  continueFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.three,
    paddingTop: Spacing.two + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowBody: { flex: 1, gap: 2, minWidth: 0 },
  rowMeta: { alignItems: "flex-end", gap: Spacing.one, maxWidth: "34%" },
  rowArabic: { fontSize: 20, writingDirection: "rtl" },
});
