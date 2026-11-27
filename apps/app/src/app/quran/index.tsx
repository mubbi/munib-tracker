import type { QuranReaderLayout, Surah } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { TFunction } from "i18next";
import { memo, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type LayoutChangeEvent, type ListRenderItem, StyleSheet, View } from "react-native";
import { QuranHubTools } from "@/components/quran/hub/quran-hub-tools";
import { SurahCalligraphyName } from "@/components/quran/surah-calligraphy-name";
import { SurahNumberMedallion } from "@/components/quran/surah-number-medallion";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { BorderWidth, Breakpoints, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { getPageForAyah, getSurahByNumber, getSurahMeta } from "@/lib/quran-meta";
import { isReciteToFindAvailable } from "@/lib/recite-to-find/availability";
import { useChevronForward } from "@/lib/rtl";
import { type SurahRevelationFilter, searchSurahList } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { useEnsureHifzLoaded } from "@/stores/hifz-store";
import { useEnsureCompanionPrefsLoaded } from "@/stores/quran-companion-prefs-store";
import { useDueQueue, useEnsureMemorizationLoaded } from "@/stores/quran-memorization-store";
import { useLastRead, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";

/** Extra width for list–detail so the surah list and preview pane can sit side by side. */
const LIST_DETAIL_MAX_WIDTH = 1280;
/** Desktop (≥1600): match the global wide content column. */
const LIST_DETAIL_MAX_WIDTH_XL = 1320;
/** Surah list column width at which rows pair up into a two-column grid (web / tablet). */
const SURAH_GRID_MIN_WIDTH = 640;
const SURAH_GRID_GAP = Spacing.two;

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

/** Calligraphy sizes for the hub's featured cards (the surah list uses the shared default). */
const CONTINUE_NAME_SIZE = 56;
const CONTINUE_NAME_SIZE_TV = 68;
const DETAIL_NAME_SIZE = 72;
const DETAIL_NAME_SIZE_TV = 88;

/** All 114 surahs as crawlable ItemList entries (the visual list isn't <a>-based). */
const SURAH_ITEMS = getSurahMeta().map((s) => ({
  name: `${s.number}. ${s.nameTransliteration} (${s.nameEnglish})`,
  path: `/quran/${s.number}`,
}));

const REVELATION_FILTERS: SurahRevelationFilter[] = ["all", "makkah", "madinah"];

/**
 * Makki / Madani is a category, not a status (C-09): tint it with the browse
 * hues (sky / dawn), never the info / warning status colours.
 */
function useRevelationHue(place: Surah["revelationPlace"]) {
  return useCategoryHue(place === "makkah" ? "sky" : "dawn");
}

/** Spoken row name (G-18): number, name, meaning, ayah count, revelation. */
function surahRowA11yLabel(surah: Surah, t: TFunction, isContinue: boolean): string {
  return [
    t("quran.surahNumber", { number: surah.number }),
    surah.nameTransliteration,
    surah.nameEnglish,
    t("quran.ayahCount", { count: surah.ayahCount }),
    surah.revelationPlace === "makkah" ? t("quran.makki") : t("quran.madani"),
    isContinue ? t("quran.continueReading") : null,
  ]
    .filter(Boolean)
    .join(", ");
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
  const revelation = useRevelationHue(surah.revelationPlace);
  const makki = surah.revelationPlace === "makkah";
  const highlighted = isSelected || isContinue;
  const tv = isTV();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={surahRowA11yLabel(surah, t, isContinue)}
      onPress={() => onPress(surah.number)}
      // Web: a crawlable `<a href>` to the surah page (click still opens in-app).
      href={`/quran/${surah.number}`}
      style={[
        styles.row,
        tv ? styles.rowTv : styles.rowCompact,
        // Fill the grid cell so both cards in a row share one height.
        styles.rowFill,
        {
          // Selection uses soft fill + hairline — accent border is reserved for
          // the D-pad focus ring from PressableScale (avoids dual green highlights).
          backgroundColor: highlighted ? (tv ? colors.muted : tokens.accentSoft) : colors.card,
          borderColor: tv && isSelected ? withAlpha(colors.accent, 0.35) : tokens.hairline,
          borderWidth: tv && isSelected ? 1.5 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <SurahNumberMedallion number={surah.number} size={tv ? 48 : 42} highlighted={highlighted} />
      <View style={styles.rowBody}>
        {/* "Continue" rides the title line (a compact badge) instead of adding a row,
            so the continue card is the same height as its neighbours. */}
        <View style={styles.rowTitleLine}>
          <ThemedText
            type="smallBold"
            numberOfLines={1}
            style={[styles.rowName, tv && styles.rowNameTv]}
          >
            {surah.nameTransliteration}
          </ThemedText>
          {showContinuePill && isContinue ? (
            <Pill
              compact
              label={t("quran.continueShort")}
              color={colors.accentText}
              background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
            />
          ) : null}
        </View>
        <ThemedText type={tv ? "small" : "caption"} themeColor="mutedForeground" numberOfLines={1}>
          {tv
            ? `${surah.nameEnglish} · ${t("quran.ayahCount", { count: surah.ayahCount })}`
            : surah.nameEnglish}
        </ThemedText>
        {tv ? null : (
          // Ayah count + revelation (a small coloured dot + label) under the meaning.
          <View style={styles.rowFacts}>
            <View style={[styles.revelationDot, { backgroundColor: revelation.text }]} />
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {t("quran.ayahCount", { count: surah.ayahCount })}
              {" · "}
              <ThemedText type="caption" style={{ color: revelation.text }}>
                {makki ? t("quran.makki") : t("quran.madani")}
              </ThemedText>
            </ThemedText>
          </View>
        )}
      </View>
      <View style={[styles.rowMeta, tv ? styles.rowMetaTv : styles.rowMetaCompact]}>
        <SurahCalligraphyName number={surah.number} nameArabic={surah.nameArabic} />
        {tv ? (
          <Pill
            label={makki ? t("quran.makki") : t("quran.madani")}
            color={revelation.text}
            background={revelation.soft}
          />
        ) : null}
      </View>
    </PressableScale>
  );
});

/**
 * Search field + filter chips wrapper. TV keeps a card so the pair reads as one
 * focus group; on touch / pointer the field sits straight on the page — a card
 * around a single input is chrome that pushes the surah list down.
 */
function SearchShell({ children }: { children: ReactNode }) {
  return isTV() ? (
    <Card style={styles.searchCard}>{children}</Card>
  ) : (
    <View style={styles.searchPlain}>{children}</View>
  );
}

function ReaderLayoutActions({
  preferredLayout,
  onSelect,
  heading,
  preferredFocus,
  onPreferredFocusConsumed,
}: {
  preferredLayout: QuranReaderLayout;
  onSelect: (layout: QuranReaderLayout) => void;
  heading?: string;
  /** TV: land D-pad focus on the preferred layout after selecting a surah. */
  preferredFocus?: boolean;
  onPreferredFocusConsumed?: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  // TV stacks full-width rows for D-pad travel; touch / pointer gets a 3-up row.
  const stacked = tv;
  const segmentOptions = useMemo(
    () =>
      LAYOUT_OPTIONS.map((option) => ({
        id: option.id,
        label: t(option.labelKey),
        icon: option.icon,
        accessibilityLabel: t("quran.hub.openIn", { layout: t(option.labelKey) }),
      })),
    [t],
  );

  if (!tv) {
    // Touch / pointer (G-08): the shared segmented control. Every segment opens
    // the reader in that layout — re-pressing the saved one opens it too.
    return (
      <View style={styles.layoutActions}>
        {heading ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.layoutHeading}>
            {heading}
          </ThemedText>
        ) : null}
        <SegmentedControl
          options={segmentOptions}
          value={preferredLayout}
          onChange={onSelect}
          allowReselect
          accessibilityLabel={t("quran.readerLayout")}
        />
      </View>
    );
  }

  return (
    <TvFocusGuide
      // Vertical stack on TV: trap Up only — Down must reach bookmarks/shortcuts
      // below in the detail pane (Left still returns to the surah list).
      trapFocusUp={tv}
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
                          borderWidth: BorderWidth.thick,
                        }
                      : { backgroundColor: colors.accent, borderColor: colors.accent }
                    : tv
                      ? {
                          backgroundColor: colors.card,
                          borderColor: tokens.hairline,
                          borderWidth: BorderWidth.hairline,
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
                    size={tv ? 22 : 18}
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
                    weight="semibold"
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
      onPress={showLayoutOptions ? undefined : onPress}
      accessibilityLabel={t("quran.continueReading")}
      preferredFocus={preferredFocus ?? (tv && !showLayoutOptions)}
      style={[
        styles.continueCard,
        tv && styles.continueCardTv,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: tv ? tokens.hairline : withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28),
          borderWidth: BorderWidth.thin,
        },
      ]}
    >
      <View style={[styles.continueTop, tv && styles.continueTopTv]}>
        <SurahNumberMedallion number={surahNumber} size={tv ? 56 : 48} highlighted />
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
        {surah ? (
          // The surah name as large calligraphy — the card's ornament.
          <SurahCalligraphyName
            number={surah.number}
            nameArabic={surah.nameArabic}
            size={tv ? CONTINUE_NAME_SIZE_TV : CONTINUE_NAME_SIZE}
          />
        ) : null}
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
  const { colors } = useThemeTokens();
  const revelation = useRevelationHue(surah.revelationPlace);
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
      <View style={styles.detailHeader}>
        <View style={styles.detailCopy}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quran.surahNumber", { number: surah.number })}
          </ThemedText>
          <ThemedText
            type={tv ? "title" : "subtitle"}
            numberOfLines={2}
            style={tv ? styles.detailTitleTv : undefined}
          >
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
        <SurahCalligraphyName
          number={surah.number}
          nameArabic={surah.nameArabic}
          size={tv ? DETAIL_NAME_SIZE_TV : DETAIL_NAME_SIZE}
          style={styles.detailArabic}
        />
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
        preferredFocus={preferredFocus}
        onPreferredFocusConsumed={onPreferredFocusConsumed}
      />
    </Card>
  );
}

export default function QuranHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const { isListDetail, width: windowWidth } = useLargeScreenLayout();
  const tv = isTV();
  const [query, setQuery] = useState("");
  // Measured width of the surah list column — drives the 1 → 2 column grid on
  // tablets / desktop web. TV keeps its single focus column.
  const [listWidth, setListWidth] = useState(0);
  const surahColumns = !tv && listWidth >= SURAH_GRID_MIN_WIDTH ? 2 : 1;
  const surahCellWidth =
    surahColumns > 1 ? (listWidth - SURAH_GRID_GAP * (surahColumns - 1)) / surahColumns : undefined;
  const onListLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    setListWidth((prev) => (prev === next ? prev : next));
  }, []);
  const [revelationFilter, setRevelationFilter] = useState<SurahRevelationFilter>("all");
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  /** TV: after selecting a surah, land focus on the detail layout actions. */
  const [moveFocusToDetail, setMoveFocusToDetail] = useState(false);
  const lastRead = useLastRead();
  const quranPrefs = useQuranPrefs();
  const quranBookmarks = useQuranBookmarks();
  // Layout picker is a shortcut to Settings › Qur'an › Reading.
  const updatePrefs = updateQuranPrefs;
  const preferredLayout = quranPrefs.readerLayout ?? "ayah";
  // Qur'an practice: the due count is always on here (never a setting).
  const practiceAvailable = isPracticeAvailable();
  const reciteToFindAvailable = isReciteToFindAvailable();
  useEnsureHifzLoaded();
  useEnsureCompanionPrefsLoaded();
  useEnsureMemorizationLoaded();
  const dueCount = useDueQueue().length;

  const filtered = useMemo(
    () => searchSurahList(query, { revelation: revelationFilter }),
    [query, revelationFilter],
  );

  const isFiltering = query.trim().length > 0 || revelationFilter !== "all";

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
    [openSurahAt, router],
  );

  const openSurah = useCallback(
    (n: number) => {
      if (isListDetail) {
        setSelectedSurahNumber(n);
        // TV: Select a surah → land on Page / Mushaf / Ayah in the detail pane.
        if (tv) setMoveFocusToDetail(true);
        return;
      }
      const resume = lastRead && lastRead.surah === n ? lastRead : null;
      // The list honours the saved reader layout (G-03): page / mushaf readers
      // open at the surah's page, the ayah reader at the surah.
      if (preferredLayout === "page" || preferredLayout === "mushaf") {
        const ayah = resume?.ayah ?? 1;
        const page = resume?.page ?? getPageForAyah(n, ayah);
        router.push(`/quran/page/${page}?surah=${n}&ayah=${ayah}`);
        return;
      }
      if (resume) {
        openSurahAt(n, resume.ayah);
        return;
      }
      router.push({ pathname: "/quran/[surah]", params: { surah: String(n) } });
    },
    [isListDetail, tv, lastRead, openSurahAt, preferredLayout, router],
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
    ({ item }) => {
      const row = (
        <SurahRow
          surah={item}
          isContinue={item.number === continueSurah}
          isSelected={isListDetail && item.number === selectedSurahNumber}
          showContinuePill={!tv || !isListDetail}
          onPress={openSurah}
        />
      );
      // Grid cells get an exact width so a lone last cell keeps the column size.
      return surahCellWidth != null ? <View style={{ width: surahCellWidth }}>{row}</View> : row;
    },
    [continueSurah, isListDetail, openSurah, selectedSurahNumber, surahCellWidth, tv],
  );

  // Every destination, no sideways scroll (C-23). Touch: below the search on
  // phones (hidden while filtering so results sit under the field), in the
  // side pane on list–detail. TV keeps it first (focus order) or in the pane.
  const hubTools = (
    <QuranHubTools
      practiceAvailable={practiceAvailable}
      reciteToFindAvailable={reciteToFindAvailable}
      dueCount={dueCount}
      bookmarkCount={quranBookmarks.length}
    />
  );
  const showInlineTools = !isListDetail && !(isFiltering && !tv);

  // TV list–detail: continue is a single resume CTA; layout pickers live only in
  // the detail pane so Page/Mushaf/Ayah aren't duplicated across columns.
  const showContinueLayoutOptions = isListDetail && !tv;

  // The header (shortcuts, continue card, search + filters) scrolls with the list
  // as the FlatList's header so the surah list owns scrolling.
  // On list–detail, bookmarks + shortcuts move to the secondary pane so the
  // primary column can show continue + search + surahs without burying the list.
  const listHeader = (
    <View style={[styles.header, tv ? styles.headerTv : styles.headerTouch]}>
      <Stagger>
        {/* TV keeps shortcuts first (its focus order); touch leads with resume. */}
        {showInlineTools && tv ? hubTools : null}

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

        {/* Due revision rides with resume — a sibling, never inside the pressable card. */}
        {practiceAvailable && dueCount > 0 ? (
          <View style={styles.dueRow}>
            <Chip
              label={t("quranCompanion.entry.toRevise", { count: dueCount })}
              icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
              selected={false}
              onPress={() => router.push("/quran/revision" as Href)}
            />
          </View>
        ) : null}

        <SearchShell>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder={tv ? t("quran.findSurah") : t("quran.searchSurah")}
            accessibilityLabel={t("quran.searchSurah")}
            style={styles.searchField}
          />

          {/* Horizontal chips: trap sideways only — an Up/Down trap left the
              surah list unreachable from the filters on TV. */}
          <TvFocusGuide trapFocusLeft trapFocusRight>
            <TvScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.filterRow, tv && styles.filterRowTv]}
            >
              {REVELATION_FILTERS.map((filter) => (
                <Chip
                  key={filter}
                  role="radio"
                  variant="solid"
                  label={revelationFilterLabel(filter)}
                  selected={revelationFilter === filter}
                  style={tv ? styles.filterChipTv : undefined}
                  onPress={() => setRevelationFilter(filter)}
                />
              ))}
            </TvScrollView>
          </TvFocusGuide>
        </SearchShell>

        {showInlineTools && !tv ? hubTools : null}

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
        maxContentWidth={
          tv
            ? undefined
            : isListDetail
              ? windowWidth >= Breakpoints.xwide
                ? LIST_DETAIL_MAX_WIDTH_XL
                : LIST_DETAIL_MAX_WIDTH
              : undefined
        }
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
            // numColumns can't change on the fly — remount when the grid reflows.
            key={`surah-cols-${surahColumns}`}
            numColumns={surahColumns}
            columnWrapperStyle={surahColumns > 1 ? styles.surahGridRow : undefined}
            onLayout={onListLayout}
            data={filtered}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            extraData={`${continueSurah}-${selectedSurahNumber}`}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              <EmptyState
                icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
                title={t("quran.noSurahResults")}
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
            // 3 blanked rows on a fast fling (C-31).
            windowSize={7}
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
                {hubTools}
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
  surahGridRow: { gap: SURAH_GRID_GAP },
  header: { gap: Spacing.four },
  headerTv: { gap: Spacing.five },
  headerTouch: { gap: Spacing.three, paddingBottom: Spacing.one },
  searchPlain: { width: "100%" },
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
  continueCopy: { flex: 1, gap: Spacing.one, minWidth: 0 },
  continueFooter: {
    marginTop: Spacing.three,
    paddingTop: Spacing.twoHalf,
    borderTopWidth: BorderWidth.hairline,
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
    gap: Spacing.oneHalf,
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
    gap: Spacing.two,
  },
  layoutStack: {
    gap: Spacing.oneHalf,
  },
  layoutChipRow: {
    flex: 1,
    minWidth: 0,
    // Icon-over-label tile: comfortably above the 44pt touch minimum.
    minHeight: 52,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
  },
  layoutChipStack: {
    width: "100%",
    minHeight: 36,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
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
  searchField: { marginBottom: Spacing.three },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  filterRowTv: {
    gap: Spacing.three,
    paddingVertical: Spacing.one,
    // Don't stretch chips to the scroller's height (rendered as tall ovals on tvOS).
    alignItems: "center",
  },
  filterChipTv: {
    // minHeight already gives the focus target; extra padding made chips taller
    // than wide, so the pill radius turned short labels ("All") into ovals.
    paddingVertical: Spacing.one,
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
  rowCompact: {
    minHeight: 60,
    paddingVertical: Spacing.twoHalf,
  },
  rowBody: { flex: 1, gap: Spacing.half, minWidth: 0 },
  rowName: { flexShrink: 1, minWidth: 0 },
  rowNameTv: { fontSize: TvLayout.bodyFontSize + 2 },
  rowFill: { flexGrow: 1 },
  rowTitleLine: { flexDirection: "row", alignItems: "center", gap: Spacing.oneHalf },
  dueRow: { flexDirection: "row", flexWrap: "wrap" },
  rowMeta: { alignItems: "flex-end", gap: Spacing.one, maxWidth: "34%" },
  rowMetaCompact: { maxWidth: "55%", gap: 0 },
  rowMetaTv: { maxWidth: "38%", gap: Spacing.two },
  rowFacts: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.half,
  },
  revelationDot: { width: 6, height: 6, borderRadius: 3 },
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
    borderStartWidth: BorderWidth.hairline,
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
    flexShrink: 0,
  },
  detailMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran");
