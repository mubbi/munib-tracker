import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type FlatList,
  Keyboard,
  type LayoutChangeEvent,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { NumberField } from "@/components/ui/number-field";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { responsiveColumns } from "@/components/ui/responsive-grid";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import type { PageListEntry } from "@/lib/quran-meta";
import { getPageForAyah, getPageList, QURAN_TOTAL_PAGES } from "@/lib/quran-meta";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useLastRead } from "@/stores/quran-store";

const PAGE_LIST = getPageList();
const PAGE_COUNT = QURAN_TOTAL_PAGES;
/** Approximate row height for scroll-to-continue (padding + badge + caption). */
const PAGE_ROW_ESTIMATE = 72;
/** Show back-to-top once the list is scrolled past a couple of rows. */
const BACK_TO_TOP_OFFSET = PAGE_ROW_ESTIMATE * 3;
/** TV: 604 single-column rows waste the landscape width — tile them. */
const TV_COLUMNS = 3;
/** Tablet / desktop: up to four page tiles per row (width-based). */
const WIDE_MAX_COLUMNS = 4;
const GRID_GAP = Spacing.two;
/** Keep the go-to-page field a sensible width on desktop. */
const GO_ROW_MAX_WIDTH = 480;

const PageRow = memo(function PageRow({
  entry,
  isContinue,
  isJumpTarget,
  preferredFocus,
  onPress,
}: {
  entry: PageListEntry;
  isContinue: boolean;
  isJumpTarget: boolean;
  /** TV: land D-pad focus here (continue / jump target). */
  preferredFocus?: boolean;
  onPress: (page: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const highlighted = isContinue || isJumpTarget;
  const tv = isTV();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      // Full spoken row (G-18): page, where it starts, juz, resume state.
      accessibilityLabel={[
        t("quran.pageN", { n: entry.page }),
        entry.surahNameTransliteration,
        t("quran.ayahRef", { surah: entry.surah, ayah: entry.ayah }),
        t("quran.juzN", { n: entry.juz }),
        isContinue ? t("quran.continueReading") : null,
      ]
        .filter(Boolean)
        .join(", ")}
      onPress={() => onPress(entry.page)}
      {...(preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.row,
        tv && styles.rowTv,
        {
          backgroundColor: highlighted ? tokens.accentSoft : colors.muted,
          borderColor: highlighted
            ? withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28)
            : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.badge,
          { backgroundColor: highlighted ? colors.background : tokens.accentSoft },
        ]}
      >
        <ThemedText type="smallBold" style={{ color: colors.accentText }}>
          {entry.page}
        </ThemedText>
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTitle}>
          <ThemedText type="small" numberOfLines={1} style={styles.rowName}>
            {t("quran.pageN", { n: entry.page })}
          </ThemedText>
          {isContinue ? (
            <Pill
              compact
              label={t("quran.continueReading")}
              color={colors.accentText}
              background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
            />
          ) : null}
        </View>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {entry.surahNameTransliteration} · {entry.surah}:{entry.ayah} ·{" "}
          {t("quran.juzN", { n: entry.juz })}
        </ThemedText>
      </View>
      {!tv ? (
        <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
      ) : null}
    </PressableScale>
  );
});

export default function QuranPagesBrowserScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const contentBottomInset = useContentBottomInset();
  const lastRead = useLastRead();
  const listRef = useRef<FlatList<PageListEntry>>(null);
  const didScrollToContinue = useRef(false);
  const [pageQuery, setPageQuery] = useState("");
  const [goError, setGoError] = useState(false);
  const [jumpTarget, setJumpTarget] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  // TV keeps its fixed 3-up grid; phones stay a single list; tablet / desktop
  // tile 2–4 pages per row by window width.
  const columns = tv ? TV_COLUMNS : responsiveColumns(windowWidth, { max: WIDE_MAX_COLUMNS });
  const columnsRef = useRef(columns);
  columnsRef.current = columns;
  // Measured list width → exact cell width so a lone last tile keeps its size.
  const [listWidth, setListWidth] = useState(0);
  const cellWidth =
    !tv && columns > 1 && listWidth > 0
      ? (listWidth - GRID_GAP * (columns - 1)) / columns
      : undefined;
  const onListLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    setListWidth((prev) => (prev === next ? prev : next));
  }, []);

  const continuePage = useMemo(() => {
    if (!lastRead) return null;
    return lastRead.page ?? getPageForAyah(lastRead.surah, lastRead.ayah);
  }, [lastRead]);

  useEffect(() => {
    if (continuePage == null || didScrollToContinue.current) return;
    // Grid: FlatList indices are rows of `columns` pages.
    const index = Math.floor((continuePage - 1) / columnsRef.current);
    if (index <= 0) {
      didScrollToContinue.current = true;
      return;
    }
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0.15 });
      didScrollToContinue.current = true;
    }, 60);
    return () => clearTimeout(timer);
  }, [continuePage]);

  const openPage = useCallback(
    (page: number) => {
      router.push({
        pathname: "/quran/page/[page]",
        params: { page: String(page) },
      });
    },
    [router],
  );

  const scrollToPageIndex = useCallback((index: number, animated: boolean) => {
    listRef.current?.scrollToIndex({ index, animated, viewPosition: 0.15 });
  }, []);

  const goToPage = useCallback(() => {
    const trimmed = pageQuery.trim();
    const page = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(page) || page < 1 || page > PAGE_COUNT) {
      setGoError(true);
      return;
    }
    setGoError(false);
    setJumpTarget(page);
    Keyboard.dismiss();
    scrollToPageIndex(Math.floor((page - 1) / columns), true);
  }, [columns, pageQuery, scrollToPageIndex]);

  const onPageQueryChange = useCallback((text: string) => {
    setPageQuery(text.replace(/[^0-9]/g, "").slice(0, String(PAGE_COUNT).length));
    setGoError(false);
  }, []);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowBackToTop(y > BACK_TO_TOP_OFFSET);
  }, []);

  const scrollBackToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const keyExtractor = useCallback((entry: PageListEntry) => String(entry.page), []);

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      listRef.current?.scrollToOffset({
        offset: Math.max(0, info.averageItemLength * info.index),
        animated: false,
      });
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: info.index,
          animated: false,
          viewPosition: 0.15,
        });
      }, 80);
    },
    [],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<PageListEntry> | null | undefined, index: number) => ({
      length: PAGE_ROW_ESTIMATE + Spacing.two,
      offset: (PAGE_ROW_ESTIMATE + Spacing.two) * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback<ListRenderItem<PageListEntry>>(
    ({ item }) => {
      const row = (
        <PageRow
          entry={item}
          isContinue={item.page === continuePage}
          isJumpTarget={item.page === jumpTarget}
          preferredFocus={
            tv &&
            (jumpTarget != null ? item.page === jumpTarget : item.page === (continuePage ?? 1))
          }
          onPress={openPage}
        />
      );
      return cellWidth != null ? <View style={{ width: cellWidth }}>{row}</View> : row;
    },
    [cellWidth, continuePage, jumpTarget, openPage, tv],
  );

  const listHeader = useMemo(
    () => (
      <View style={[styles.goHeader, !tv && styles.goRowWide]}>
        {/* The shared number field (P6-01): label, helper and an announced
            inline error instead of a warning-tinted border + loose caption. */}
        <NumberField
          label={t("quran.goToPageA11y")}
          helperText={goError ? undefined : t("quran.goToPageHint", { max: PAGE_COUNT })}
          error={goError ? t("quran.goToPageInvalid", { max: PAGE_COUNT }) : undefined}
          value={pageQuery ? Number(pageQuery) : undefined}
          onChangeValue={(value) => onPageQueryChange(value == null ? "" : String(value))}
          onSubmitEditing={goToPage}
          returnKeyType="go"
          placeholder={t("quran.goToPagePlaceholder", { max: PAGE_COUNT })}
          trailing={
            <Button
              label={t("quran.goToPageAction")}
              size="sm"
              disabled={pageQuery.trim().length === 0}
              onPress={goToPage}
              accessibilityHint={t("quran.goToPageHint", { max: PAGE_COUNT })}
              style={styles.goButton}
            />
          }
        />
      </View>
    ),
    [goError, goToPage, onPageQueryChange, pageQuery, t, tv],
  );

  return (
    <>
      <Seo path="/quran/pages" />
      <ScreenLayout
        scrollable={false}
        eyebrow={t("quran.eyebrow")}
        title={t("quran.pages")}
        subtitle={t("quran.pagesSubtitle")}
        onBack={() => goBackOrReplace(router, "/quran")}
      >
        <View style={styles.listWrap}>
          <TvFlatList
            ref={listRef}
            data={PAGE_LIST}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={listHeader}
            extraData={`${continuePage}-${jumpTarget}`}
            // Changing numColumns requires a remount — key on it.
            key={tv ? "tv-grid" : `grid-${columns}`}
            numColumns={columns}
            columnWrapperStyle={
              tv ? styles.gridRowTv : columns > 1 ? styles.gridRowWide : undefined
            }
            // Rows are a fixed height in every column count (index = row).
            getItemLayout={tv ? undefined : getItemLayout}
            onLayout={onListLayout}
            onScrollToIndexFailed={onScrollToIndexFailed}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            style={styles.list}
            contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
            showsVerticalScrollIndicator={false}
            initialNumToRender={14}
            maxToRenderPerBatch={8}
            windowSize={5}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={!tv}
          />
          {/* TV: no floating back-to-top (an overlaid focus target the D-pad
              can't reach predictably) — Up walks the grid back to the top. */}
          {showBackToTop && !tv ? (
            <View
              style={[styles.backToTop, { bottom: contentBottomInset, pointerEvents: "box-none" }]}
            >
              <IconButton
                name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
                accessibilityLabel={t("quran.backToTop")}
                onPress={scrollBackToTop}
                tintColor={colors.accent}
                background={tokens.accentSoft}
                glass
              />
            </View>
          ) : null}
        </View>
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  listWrap: { flex: 1, width: "100%", minHeight: 0 },
  list: { flex: 1, width: "100%", minHeight: 0 },
  listContent: { gap: Spacing.two },
  goHeader: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  goButton: { flexShrink: 0 },
  backToTop: {
    position: "absolute",
    end: Spacing.three,
    zIndex: 5,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTv: {
    flex: 1,
    minWidth: 0,
    minHeight: TvLayout.minFocusTarget + 8,
    padding: Spacing.three,
  },
  gridRowTv: { gap: Spacing.three },
  gridRowWide: { gap: GRID_GAP },
  goRowWide: { maxWidth: GO_ROW_MAX_WIDTH, width: "100%" },
  rowBody: { flex: 1, gap: 2, minWidth: 0 },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minWidth: 0,
  },
  rowName: { flexShrink: 1, minWidth: 0 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/pages");
