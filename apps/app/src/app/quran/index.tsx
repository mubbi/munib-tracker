import type { QuranReaderLayout, Surah } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ListRenderItem, StyleSheet, TextInput, View } from "react-native";
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
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getPageForAyah, getSurahByNumber, getSurahMeta } from "@/lib/quran-meta";
import { useChevronForward } from "@/lib/rtl";
import { type SurahRevelationFilter, searchSurahList } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import {
  useLastRead,
  useQuranActions,
  useQuranBookmarks,
  useQuranPrefs,
} from "@/stores/quran-store";

/** Extra width for list–detail so the surah list and preview pane can sit side by side. */
const LIST_DETAIL_MAX_WIDTH = 1280;

const LAYOUT_OPTIONS: Array<{
  id: QuranReaderLayout;
  labelKey: string;
  icon: SymbolViewProps["name"];
}> = [
  {
    id: "page",
    labelKey: "quran.layoutPage",
    icon: { ios: "book.pages", android: "auto_stories", web: "auto_stories" },
  },
  {
    id: "mushaf",
    labelKey: "quran.layoutMushaf",
    icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
  },
  {
    id: "ayah",
    labelKey: "quran.layoutAyah",
    icon: { ios: "text.alignleft", android: "notes", web: "notes" },
  },
];

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
  isContinue,
  isSelected,
  showContinuePill,
  onPress,
}: {
  surah: Surah;
  isContinue: boolean;
  isSelected: boolean;
  /** List–detail TV already surfaces continue in the detail pane — skip the row pill. */
  showContinuePill: boolean;
  onPress: (n: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const revelation = revelationTone(surah.revelationPlace, tokens);
  const makki = surah.revelationPlace === "makkah";
  const highlighted = isSelected || isContinue;
  const tv = isTV();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={
        isContinue
          ? `${surah.nameEnglish}, ${t("quran.continueReading")}`
          : `${surah.nameEnglish}, ${makki ? t("quran.makki") : t("quran.madani")}`
      }
      onPress={() => onPress(surah.number)}
      style={[
        styles.row,
        tv && styles.rowTv,
        {
          // Selection uses soft fill + hairline — accent border is reserved for
          // the D-pad focus ring from PressableScale (avoids dual green highlights).
          backgroundColor: highlighted ? (tv ? colors.muted : tokens.accentSoft) : colors.card,
          borderColor: tv && isSelected ? withAlpha(colors.accent, 0.35) : tokens.hairline,
          borderWidth: tv && isSelected ? 1.5 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <ListIndexBadge index={surah.number} />
      <View style={styles.rowBody}>
        <ThemedText
          type="smallBold"
          numberOfLines={1}
          style={[styles.rowName, tv && styles.rowNameTv]}
        >
          {surah.nameTransliteration}
        </ThemedText>
        <ThemedText type={tv ? "small" : "caption"} themeColor="mutedForeground" numberOfLines={1}>
          {surah.nameEnglish} · {t("quran.ayahCount", { count: surah.ayahCount })}
        </ThemedText>
        {showContinuePill && isContinue ? (
          <View style={styles.rowContinue}>
            <Pill
              compact
              label={t("quran.continueReading")}
              color={colors.accentText}
              background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
            />
          </View>
        ) : null}
      </View>
      <View style={[styles.rowMeta, tv && styles.rowMetaTv]}>
        <ThemedText type="arabic" style={[styles.rowArabic, tv && styles.rowArabicTv]}>
          {surah.nameArabic}
        </ThemedText>
        <Pill
          label={makki ? t("quran.makki") : t("quran.madani")}
          color={revelation.text}
          background={revelation.soft}
        />
      </View>
      {!tv ? (
        <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
      ) : null}
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
  const tv = isTV();
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
        tv && styles.filterChipTv,
        active
          ? tv
            ? {
                // Outline selected — solid/soft green fill reads as “focused” on TV.
                backgroundColor: colors.muted,
                borderColor: withAlpha(colors.accent, tokens.isDark ? 0.55 : 0.4),
              }
            : { backgroundColor: colors.accent, borderColor: colors.accent }
          : {
              backgroundColor: colors.background,
              borderColor: withAlpha(colors.border, tokens.isDark ? 0.55 : 0.85),
            },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={{
          color: active
            ? tv
              ? colors.accentText
              : colors.accentForeground
            : colors.mutedForeground,
          fontSize: tv ? TvLayout.bodyFontSize : undefined,
        }}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

function ReaderLayoutActions({
  preferredLayout,
  onSelect,
  heading,
  direction = "row",
  preferredFocus,
  onPreferredFocusConsumed,
}: {
  preferredLayout: QuranReaderLayout;
  onSelect: (layout: QuranReaderLayout) => void;
  heading?: string;
  direction?: "row" | "stack";
  /** TV: land D-pad focus on the preferred layout after selecting a surah. */
  preferredFocus?: boolean;
  onPreferredFocusConsumed?: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const stacked = direction === "stack" || tv;

  return (
    <TvFocusGuide
      trapFocusUp={tv}
      trapFocusDown={tv}
      style={tv ? styles.layoutActionsTv : undefined}
    >
      <View style={[styles.layoutActions, tv && { gap: Spacing.three }]}>
        {heading ? (
          <ThemedText
            type={tv ? "smallBold" : "caption"}
            themeColor="mutedForeground"
            style={styles.layoutHeading}
          >
            {heading}
          </ThemedText>
        ) : null}
        <View
          style={[stacked ? styles.layoutStack : styles.layoutRow, tv && { gap: Spacing.three }]}
        >
          {LAYOUT_OPTIONS.map((option) => {
            const active = preferredLayout === option.id;
            const label = t(option.labelKey);
            const landFocus = Boolean(tv && preferredFocus && active);
            return (
              <PressableScale
                key={option.id}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                onPress={() => onSelect(option.id)}
                onFocus={landFocus ? onPreferredFocusConsumed : undefined}
                scaleTo={0.97}
                {...(landFocus ? { hasTVPreferredFocus: true } : {})}
                style={[
                  stacked ? styles.layoutChipStack : styles.layoutChipRow,
                  tv && styles.layoutChipTv,
                  active
                    ? tv
                      ? {
                          // Preferred layout: outline only. Solid/soft fill competed
                          // with the D-pad focus ring (looked like dual focus).
                          backgroundColor: colors.muted,
                          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.5 : 0.35),
                          borderWidth: 1.5,
                        }
                      : { backgroundColor: colors.accent, borderColor: colors.accent }
                    : tv
                      ? {
                          backgroundColor: colors.card,
                          borderColor: tokens.hairline,
                          borderWidth: StyleSheet.hairlineWidth,
                        }
                      : {
                          backgroundColor: tokens.accentSoft,
                          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.35 : 0.22),
                        },
                ]}
              >
                <View style={stacked ? styles.layoutChipContentStack : styles.layoutChipContentRow}>
                  <SymbolView
                    name={option.icon}
                    size={tv ? 22 : stacked ? 16 : 15}
                    tintColor={
                      active
                        ? tv
                          ? colors.accentText
                          : colors.accentForeground
                        : tv
                          ? colors.mutedForeground
                          : colors.accentText
                    }
                  />
                  <ThemedText
                    type={tv ? "smallBold" : "caption"}
                    numberOfLines={1}
                    style={{
                      color: active
                        ? tv
                          ? colors.accentText
                          : colors.accentForeground
                        : tv
                          ? colors.mutedForeground
                          : colors.accentText,
                      textAlign: "center",
                      fontWeight: "600",
                      flexShrink: 1,
                      fontSize: tv ? TvLayout.bodyFontSize : undefined,
                    }}
                  >
                    {label}
                  </ThemedText>
                </View>
              </PressableScale>
            );
          })}
        </View>
      </View>
    </TvFocusGuide>
  );
}

function ContinueReadingCard({
  surahNumber,
  ayah,
  page,
  preferredLayout,
  showLayoutOptions,
  preferredFocus,
  onPress,
  onSelectLayout,
}: {
  surahNumber: number;
  ayah: number;
  page?: number;
  preferredLayout: QuranReaderLayout;
  showLayoutOptions: boolean;
  preferredFocus?: boolean;
  onPress: () => void;
  onSelectLayout: (layout: QuranReaderLayout) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const surah = getSurahByNumber(surahNumber);
  const tv = isTV();

  return (
    <Card
      padding="three"
      onPress={showLayoutOptions ? undefined : onPress}
      accessibilityLabel={t("quran.continueReading")}
      preferredFocus={preferredFocus ?? (tv && !showLayoutOptions)}
      style={[
        styles.continueCard,
        tv && styles.continueCardTv,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: tv ? tokens.hairline : withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28),
          borderWidth: 1,
        },
      ]}
    >
      <View style={[styles.continueTop, tv && styles.continueTopTv]}>
        <View
          style={[
            styles.continueBadge,
            tv && styles.continueBadgeTv,
            { backgroundColor: colors.background },
          ]}
        >
          <ThemedText type="subtitle" style={{ color: colors.accent }}>
            {surahNumber}
          </ThemedText>
        </View>
        <View style={styles.continueCopy}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {surah?.nameTransliteration ?? t("quran.continueAt", { surah: surahNumber, ayah })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {page
              ? t("quran.continueAtPage", { page, surah: surahNumber, ayah })
              : surah
                ? `${surah.nameEnglish} · ${t("quran.continueAt", { surah: surahNumber, ayah })}`
                : t("quran.continueAt", { surah: surahNumber, ayah })}
          </ThemedText>
        </View>
        <View style={styles.continueAside}>
          {surah ? (
            <ThemedText
              type="arabic"
              style={[
                styles.continueArabic,
                tv && styles.continueArabicTv,
                { color: colors.accentText },
              ]}
            >
              {surah.nameArabic}
            </ThemedText>
          ) : null}
          {!tv ? (
            <IconWell
              icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              tint={colors.accent}
              background={withAlpha(colors.accent, tokens.isDark ? 0.22 : 0.12)}
              well={44}
              size={20}
            />
          ) : null}
        </View>
      </View>
      <View
        style={[
          styles.continueFooter,
          showLayoutOptions && styles.continueFooterLayouts,
          tv && !showLayoutOptions && styles.continueFooterTv,
          { borderTopColor: withAlpha(colors.accent, 0.22) },
        ]}
      >
        {showLayoutOptions ? (
          <ReaderLayoutActions
            preferredLayout={preferredLayout}
            onSelect={onSelectLayout}
            heading={t("quran.continueReading")}
          />
        ) : (
          <>
            <ThemedText type="smallBold" style={{ color: colors.accentText }}>
              {t("home.continueAction.quran")}
            </ThemedText>
            <SymbolView
              name={chevronForwardIcon}
              size={tv ? 16 : 14}
              tintColor={colors.accentText}
            />
          </>
        )}
      </View>
    </Card>
  );
}

function SurahDetailPane({
  surah,
  preferredLayout,
  isContinue,
  continueAyah,
  continuePage,
  onSelectLayout,
  preferredFocus,
  onPreferredFocusConsumed,
}: {
  surah: Surah;
  preferredLayout: QuranReaderLayout;
  isContinue: boolean;
  continueAyah?: number;
  continuePage?: number;
  onSelectLayout: (layout: QuranReaderLayout) => void;
  preferredFocus?: boolean;
  onPreferredFocusConsumed?: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const revelation = revelationTone(surah.revelationPlace, tokens);
  const makki = surah.revelationPlace === "makkah";
  const tv = isTV();

  const progressHint =
    isContinue && continueAyah != null
      ? continuePage
        ? t("quran.continueAtPage", {
            page: continuePage,
            surah: surah.number,
            ayah: continueAyah,
          })
        : t("quran.continueAt", { surah: surah.number, ayah: continueAyah })
      : null;

  return (
    <Card padding="four" style={[styles.detailCard, tv && styles.detailCardTv]}>
      <View style={[styles.detailHeader, tv && styles.detailHeaderTv]}>
        <View style={styles.detailCopy}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quran.surahNumber", { number: surah.number })}
          </ThemedText>
          <ThemedText type="title" numberOfLines={2} style={tv ? styles.detailTitleTv : undefined}>
            {surah.nameTransliteration}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground" numberOfLines={1}>
            {surah.nameEnglish}
          </ThemedText>
          {progressHint ? (
            <ThemedText type="caption" style={{ color: colors.accentText }}>
              {progressHint}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText
          type="arabic"
          style={[styles.detailArabic, tv && styles.detailArabicTv, { color: colors.accentText }]}
        >
          {surah.nameArabic}
        </ThemedText>
      </View>
      <View style={styles.detailMeta}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("quran.ayahCount", { count: surah.ayahCount })}
        </ThemedText>
        <Pill
          label={makki ? t("quran.makki") : t("quran.madani")}
          color={revelation.text}
          background={revelation.soft}
        />
      </View>
      <ReaderLayoutActions
        preferredLayout={preferredLayout}
        onSelect={onSelectLayout}
        heading={isContinue ? t("quran.continueReading") : t("quran.openReader")}
        direction="stack"
        preferredFocus={preferredFocus}
        onPreferredFocusConsumed={onPreferredFocusConsumed}
      />
    </Card>
  );
}

export default function QuranHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail } = useLargeScreenLayout();
  const tv = isTV();
  const [query, setQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<SurahRevelationFilter>("all");
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  /** TV: after selecting a surah, land focus on the detail layout actions. */
  const [moveFocusToDetail, setMoveFocusToDetail] = useState(false);
  const lastRead = useLastRead();
  const quranPrefs = useQuranPrefs();
  const quranBookmarks = useQuranBookmarks();
  const { updatePrefs } = useQuranActions();
  const preferredLayout = quranPrefs.readerLayout ?? "ayah";

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
        id: "pages",
        label: t("quran.pages"),
        icon: { ios: "book.pages.fill", android: "menu_book", web: "menu_book" },
        tint: tokens.status.info.color,
        onPress: () => router.push("/quran/pages"),
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

  // Resume at the exact ayah the reader last left off on (ayah 1 needs no param).
  const openSurahAt = useCallback(
    (n: number, ayah: number) =>
      router.push({
        pathname: "/quran/[surah]",
        params: { surah: String(n), ...(ayah > 1 ? { ayah: String(ayah) } : {}) },
      }),
    [router],
  );

  const openWithLayout = useCallback(
    (surah: number, ayah: number, layout: QuranReaderLayout, page?: number) => {
      void updatePrefs({ readerLayout: layout });
      if (layout === "page" || layout === "mushaf") {
        const pageNumber = page ?? getPageForAyah(surah, ayah);
        router.push(`/quran/page/${pageNumber}?surah=${surah}&ayah=${ayah}`);
        return;
      }
      openSurahAt(surah, ayah);
    },
    [openSurahAt, router, updatePrefs],
  );

  const openSurah = useCallback(
    (n: number) => {
      if (isListDetail) {
        setSelectedSurahNumber(n);
        // TV: Select a surah → land on Page / Mushaf / Ayah in the detail pane.
        if (tv) setMoveFocusToDetail(true);
        return;
      }
      if (lastRead && lastRead.surah === n) {
        openSurahAt(n, lastRead.ayah);
        return;
      }
      router.push({ pathname: "/quran/[surah]", params: { surah: String(n) } });
    },
    [isListDetail, tv, lastRead, openSurahAt, router],
  );

  const selectedSurah = selectedSurahNumber != null ? getSurahByNumber(selectedSurahNumber) : null;

  // On wide list–detail layouts, keep a surah selected so the preview pane isn't empty.
  useEffect(() => {
    if (!isListDetail) return;
    setSelectedSurahNumber((current) => {
      const stillVisible = current != null && filtered.some((s) => s.number === current);
      if (stillVisible) return current;
      if (lastRead && filtered.some((s) => s.number === lastRead.surah)) {
        return lastRead.surah;
      }
      return filtered[0]?.number ?? null;
    });
  }, [isListDetail, lastRead, filtered]);

  const keyExtractor = useCallback((surah: Surah) => String(surah.number), []);

  const continueSurah = lastRead?.surah ?? null;

  const openSelectedWithLayout = useCallback(
    (layout: QuranReaderLayout) => {
      if (!selectedSurah) return;
      if (lastRead && lastRead.surah === selectedSurah.number) {
        openWithLayout(selectedSurah.number, lastRead.ayah, layout, lastRead.page);
        return;
      }
      openWithLayout(selectedSurah.number, 1, layout);
    },
    [selectedSurah, lastRead, openWithLayout],
  );

  const continueWithPreferredLayout = useCallback(() => {
    if (!lastRead) return;
    if (isListDetail) setSelectedSurahNumber(lastRead.surah);
    openWithLayout(lastRead.surah, lastRead.ayah, preferredLayout, lastRead.page);
  }, [lastRead, openWithLayout, preferredLayout, isListDetail]);

  const clearMoveFocusToDetail = useCallback(() => setMoveFocusToDetail(false), []);

  const renderItem = useCallback<ListRenderItem<Surah>>(
    ({ item }) => (
      <SurahRow
        surah={item}
        isContinue={item.number === continueSurah}
        isSelected={isListDetail && item.number === selectedSurahNumber}
        showContinuePill={!tv || !isListDetail}
        onPress={openSurah}
      />
    ),
    [continueSurah, isListDetail, openSurah, selectedSurahNumber, tv],
  );

  const bookmarksCard = (
    <SavedNavCard
      title={t("quran.bookmarks")}
      viewLabel={t("quran.viewBookmarks")}
      count={quranBookmarks.length > 0 ? quranBookmarks.length : undefined}
      headerIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
      rowIcon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
      onPress={() => router.push("/quran/bookmarks")}
    />
  );

  const bookmarksAndShortcuts = (
    <View style={styles.chromeStack}>
      {bookmarksCard}
      {/* TV list–detail: skip the dense shortcut grid — Juz/Pages live on Library;
          remote users open readers from the detail pane instead. */}
      {!tv || !isListDetail ? (
        <Card padding="three">
          <QuickActionGrid
            items={shortcuts}
            singleRow={!isListDetail}
            columns={isListDetail ? 3 : undefined}
          />
        </Card>
      ) : null}
    </View>
  );

  // TV list–detail: continue is a single resume CTA; layout pickers live only in
  // the detail pane so Page/Mushaf/Ayah aren't duplicated across columns.
  const showContinueLayoutOptions = isListDetail && !tv;

  // The header (shortcuts, continue card, search + filters) scrolls with the list
  // as the FlatList's header so the surah list owns scrolling.
  // On list–detail, bookmarks + shortcuts move to the secondary pane so the
  // primary column can show continue + search + surahs without burying the list.
  const listHeader = (
    <View style={[styles.header, tv && styles.headerTv]}>
      <Stagger>
        {!isListDetail ? bookmarksAndShortcuts : null}

        {lastRead ? (
          <ContinueReadingCard
            surahNumber={lastRead.surah}
            ayah={lastRead.ayah}
            page={lastRead.page}
            preferredLayout={preferredLayout}
            showLayoutOptions={showContinueLayoutOptions}
            preferredFocus={tv && !showContinueLayoutOptions && !moveFocusToDetail}
            onPress={continueWithPreferredLayout}
            onSelectLayout={(layout) =>
              openWithLayout(lastRead.surah, lastRead.ayah, layout, lastRead.page)
            }
          />
        ) : null}

        <Card padding="three" style={styles.searchCard}>
          <View
            style={[
              styles.searchField,
              tv && styles.searchFieldTv,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <SymbolView
              name={{ ios: "magnifyingglass", android: "search", web: "search" }}
              size={tv ? 20 : 18}
              tintColor={colors.mutedForeground}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={tv ? t("quran.search") : t("quran.searchSurah")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("quran.searchSurah")}
              style={[styles.searchInput, tv && styles.searchInputTv, { color: colors.foreground }]}
            />
            {query.length > 0 ? (
              <IconButton
                name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
                accessibilityLabel={t("search.clear")}
                onPress={() => setQuery("")}
                size={18}
                tintColor={colors.mutedForeground}
                hitTarget={tv ? TvLayout.minFocusTarget : 36}
                haptic="light"
              />
            ) : null}
          </View>

          <TvFocusGuide trapFocusUp trapFocusDown>
            <TvScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.filterRow, tv && styles.filterRowTv]}
            >
              {REVELATION_FILTERS.map((filter) => (
                <RevelationFilterChip
                  key={filter}
                  label={revelationFilterLabel(filter)}
                  active={revelationFilter === filter}
                  onPress={() => setRevelationFilter(filter)}
                />
              ))}
            </TvScrollView>
          </TvFocusGuide>
        </Card>

        <SectionHeader
          title={t("quran.surahList")}
          icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          actionLabel={
            isFiltering
              ? t("quran.surahCount", { shown: filtered.length, total: TOTAL_SURAHS })
              : undefined
          }
        />
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
        onBack={() => goBackOrReplace(router, "/")}
        maxContentWidth={tv ? undefined : isListDetail ? LIST_DETAIL_MAX_WIDTH : undefined}
        contentStyle={tv ? styles.tvScreenContent : undefined}
      >
        <View
          style={
            isListDetail ? [styles.listDetailRoot, tv && styles.listDetailRootTv] : styles.flatList
          }
        >
          {/*
            Keep FlatList a direct row child with flex — wrapping / absolute pane
            sizes collapsed the list viewport on tvOS. Do not wrap in TvFocusGuide.
            Focus handoff uses hasTVPreferredFocus on layout actions.
          */}
          <TvFlatList
            data={filtered}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            extraData={`${continueSurah}-${selectedSurahNumber}`}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              <EmptyState
                icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
                title={t("quran.noResults")}
              />
            }
            style={
              isListDetail
                ? [styles.listDetailPrimary, tv && styles.listDetailPrimaryTv]
                : styles.flatList
            }
            contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={8}
            maxToRenderPerBatch={4}
            windowSize={3}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={!tv}
          />
          {isListDetail ? (
            <View
              style={[
                styles.listDetailSecondary,
                tv ? styles.listDetailSecondaryTv : styles.listDetailSecondaryPhone,
                { borderStartColor: tokens.hairline },
              ]}
            >
              <TvScrollView
                style={styles.listDetailSecondaryScroll}
                contentContainerStyle={[
                  styles.listDetailSecondaryContent,
                  tv && styles.listDetailSecondaryContentTv,
                  { paddingBottom: contentBottomInset },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {selectedSurah ? (
                  <SurahDetailPane
                    surah={selectedSurah}
                    preferredLayout={preferredLayout}
                    isContinue={selectedSurah.number === continueSurah}
                    continueAyah={lastRead?.ayah}
                    continuePage={lastRead?.page}
                    onSelectLayout={openSelectedWithLayout}
                    preferredFocus={tv && moveFocusToDetail}
                    onPreferredFocusConsumed={clearMoveFocusToDetail}
                  />
                ) : (
                  <EmptyState
                    icon={{ ios: "book", android: "menu_book", web: "menu_book" }}
                    title={t("quran.selectSurah")}
                  />
                )}
                {bookmarksAndShortcuts}
              </TvScrollView>
            </View>
          ) : null}
        </View>
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  flatList: { flex: 1, width: "100%", minHeight: 0 },
  /** ScreenLayout centers children by default — stretch so list–detail can fill TV. */
  tvScreenContent: { alignItems: "stretch" },
  listContent: { gap: Spacing.two },
  header: { gap: Spacing.four },
  headerTv: { gap: Spacing.five },
  chromeStack: { gap: Spacing.four, width: "100%" },
  searchCard: { gap: 0 },
  continueCard: { gap: 0, overflow: "hidden" },
  continueCardTv: {
    overflow: "visible",
    marginVertical: TvLayout.focusRingWidth,
  },
  continueTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  continueTopTv: {
    gap: Spacing.four,
  },
  continueBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  continueBadgeTv: {
    width: 56,
    height: 56,
  },
  continueCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
  continueAside: {
    alignItems: "flex-end",
    gap: Spacing.two,
  },
  continueArabic: {
    fontSize: 18,
    writingDirection: "rtl",
  },
  continueArabicTv: {
    fontSize: 26,
  },
  continueFooter: {
    marginTop: Spacing.three,
    paddingTop: Spacing.two + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  continueFooterTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  continueFooterLayouts: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  layoutActions: {
    width: "100%",
    gap: Spacing.one + 2,
  },
  layoutActionsTv: {
    width: "100%",
  },
  layoutHeading: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  layoutRow: {
    flexDirection: "row",
    gap: Spacing.one + 2,
  },
  layoutStack: {
    gap: Spacing.one + 2,
  },
  layoutChipRow: {
    flex: 1,
    minWidth: 0,
    minHeight: 36,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.one + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  layoutChipStack: {
    width: "100%",
    minHeight: 36,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  layoutChipTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
  },
  layoutChipContentRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: Spacing.half,
    width: "100%",
  },
  layoutChipContentStack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  searchFieldTv: {
    minHeight: TvLayout.minFocusTarget,
    marginBottom: Spacing.four,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    width: "100%",
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  searchInputTv: {
    fontSize: TvLayout.bodyFontSize,
    paddingVertical: Spacing.three,
    minWidth: 0,
    flexGrow: 1,
  },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  filterRowTv: {
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  filterChipTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowTv: {
    minHeight: TvLayout.minFocusTarget + 8,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  rowBody: { flex: 1, gap: 2, minWidth: 0 },
  rowName: { flexShrink: 1, minWidth: 0 },
  rowNameTv: { fontSize: TvLayout.bodyFontSize + 2 },
  rowContinue: { flexDirection: "row", marginTop: 2 },
  rowMeta: { alignItems: "flex-end", gap: Spacing.one, maxWidth: "34%" },
  rowMetaTv: { maxWidth: "38%", gap: Spacing.two },
  rowArabic: { fontSize: 20, writingDirection: "rtl" },
  rowArabicTv: { fontSize: 26 },
  listDetailRoot: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    gap: Spacing.four,
    minHeight: 0,
  },
  listDetailRootTv: {
    gap: Spacing.five,
    alignSelf: "stretch",
    width: "100%",
    flex: 1,
    minHeight: 0,
  },
  listDetailPrimary: {
    flex: 1.35,
    minWidth: 0,
    minHeight: 0,
  },
  listDetailPrimaryTv: {
    flex: 1.75,
  },
  listDetailSecondary: {
    flex: 1,
    minWidth: 280,
    borderStartWidth: StyleSheet.hairlineWidth,
    minHeight: 0,
  },
  listDetailSecondaryPhone: {
    maxWidth: 420,
  },
  listDetailSecondaryTv: {
    flex: 1,
    minWidth: TvLayout.detailPaneMinWidth,
    maxWidth: TvLayout.detailPaneMaxWidth,
  },
  listDetailSecondaryScroll: {
    flex: 1,
    minHeight: 0,
  },
  listDetailSecondaryContent: {
    gap: Spacing.three,
    paddingStart: Spacing.four,
    flexGrow: 1,
  },
  listDetailSecondaryContentTv: {
    gap: Spacing.four,
    paddingStart: Spacing.five,
  },
  detailCard: {
    gap: Spacing.four,
  },
  detailCardTv: {
    gap: Spacing.five,
    overflow: "visible",
  },
  detailHeader: {
    gap: Spacing.two,
  },
  detailHeaderTv: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.four,
  },
  detailCopy: {
    flex: 1,
    gap: Spacing.two,
    minWidth: 0,
  },
  detailTitleTv: {
    fontSize: TvLayout.titleFontSize,
  },
  detailArabic: {
    fontSize: 28,
    writingDirection: "rtl",
    marginTop: Spacing.one,
  },
  detailArabicTv: {
    fontSize: 40,
    marginTop: 0,
    flexShrink: 0,
    textAlign: "right",
  },
  detailMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
});
