import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItem, StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import type { PageListEntry } from "@/lib/quran";
import { getPageForAyah, getPageList } from "@/lib/quran";
import { useChevronForward } from "@/lib/rtl";
import { useLastRead } from "@/stores/quran-store";

const PAGE_LIST = getPageList();
/** Approximate row height for scroll-to-continue (padding + badge + caption). */
const PAGE_ROW_ESTIMATE = 72;

const PageRow = memo(function PageRow({
  entry,
  isContinue,
  onPress,
}: {
  entry: PageListEntry;
  isContinue: boolean;
  onPress: (page: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();

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
          backgroundColor: isContinue ? tokens.accentSoft : colors.muted,
          borderColor: isContinue
            ? withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28)
            : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.badge,
          { backgroundColor: isContinue ? colors.background : tokens.accentSoft },
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
  const contentBottomInset = useContentBottomInset();
  const lastRead = useLastRead();
  const listRef = useRef<FlatList<PageListEntry>>(null);
  const didScrollToContinue = useRef(false);

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
      <PageRow entry={item} isContinue={item.page === continuePage} onPress={openPage} />
    ),
    [continuePage, openPage],
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
        <FlatList
          ref={listRef}
          data={PAGE_LIST}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          extraData={continuePage}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={14}
          maxToRenderPerBatch={8}
          windowSize={5}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews
        />
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, width: "100%" },
  listContent: { gap: Spacing.two },
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
