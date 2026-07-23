import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type FlatList,
  Keyboard,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import type { PageListEntry } from "@/lib/quran";
import { getPageCount, getPageForAyah, getPageList } from "@/lib/quran";
import { useChevronForward } from "@/lib/rtl";
import { useLastRead } from "@/stores/quran-store";

const PAGE_LIST = getPageList();
const PAGE_COUNT = getPageCount();
/** Shared height for the go-to-page input + Go button so the row stays flush. */
const GO_CONTROL_HEIGHT = 40;
/** Approximate row height for scroll-to-continue (padding + badge + caption). */
const PAGE_ROW_ESTIMATE = 72;
/** Show back-to-top once the list is scrolled past a couple of rows. */
const BACK_TO_TOP_OFFSET = PAGE_ROW_ESTIMATE * 3;

const PageRow = memo(function PageRow({
  entry,
  isContinue,
  isJumpTarget,
  onPress,
}: {
  entry: PageListEntry;
  isContinue: boolean;
  isJumpTarget: boolean;
  onPress: (page: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const highlighted = isContinue || isJumpTarget;

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={
        isContinue
          ? `${t("quran.pageN", { n: entry.page })}, ${t("quran.continueReading")}`
          : t("quran.pageN", { n: entry.page })
      }
      onPress={() => onPress(entry.page)}
      style={[
        styles.row,
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
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
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
      <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
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

  const continuePage = useMemo(() => {
    if (!lastRead) return null;
    return lastRead.page ?? getPageForAyah(lastRead.surah, lastRead.ayah);
  }, [lastRead]);

  useEffect(() => {
    if (continuePage == null || didScrollToContinue.current) return;
    const index = continuePage - 1;
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
    scrollToPageIndex(page - 1, true);
  }, [pageQuery, scrollToPageIndex]);

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
    ({ item }) => (
      <PageRow
        entry={item}
        isContinue={item.page === continuePage}
        isJumpTarget={item.page === jumpTarget}
        onPress={openPage}
      />
    ),
    [continuePage, jumpTarget, openPage],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.goHeader}>
        <View style={styles.goRow}>
          <TextInput
            value={pageQuery}
            onChangeText={onPageQueryChange}
            onSubmitEditing={goToPage}
            keyboardType="number-pad"
            returnKeyType="go"
            placeholder={t("quran.goToPagePlaceholder", { max: PAGE_COUNT })}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("quran.goToPageA11y")}
            accessibilityHint={t("quran.goToPageHint", { max: PAGE_COUNT })}
            style={[
              styles.goInput,
              {
                backgroundColor: colors.muted,
                color: colors.foreground,
                borderColor: goError ? tokens.status.warning.color : tokens.hairline,
              },
            ]}
          />
          <Button
            label={t("quran.goToPageAction")}
            size="sm"
            disabled={pageQuery.trim().length === 0}
            onPress={goToPage}
            accessibilityHint={t("quran.goToPageHint", { max: PAGE_COUNT })}
            style={styles.goButton}
          />
        </View>
        {goError ? (
          <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
            {t("quran.goToPageInvalid", { max: PAGE_COUNT })}
          </ThemedText>
        ) : null}
      </View>
    ),
    [colors, goError, goToPage, onPageQueryChange, pageQuery, t, tokens],
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
            getItemLayout={tv ? undefined : getItemLayout}
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
          {showBackToTop ? (
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
  goRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  goInput: {
    flex: 1,
    height: GO_CONTROL_HEIGHT,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 20,
    textAlignVertical: "center",
  },
  goButton: {
    flexShrink: 0,
    height: GO_CONTROL_HEIGHT,
    minHeight: GO_CONTROL_HEIGHT,
    paddingVertical: 0,
    justifyContent: "center",
  },
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
  rowBody: { flex: 1, gap: 2, minWidth: 0 },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minWidth: 0,
  },
  rowName: { flexShrink: 1, minWidth: 0 },
});
