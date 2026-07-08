import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItem, StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import type { PageListEntry } from "@/lib/quran";
import { getPageList } from "@/lib/quran";
import { chevronForward } from "@/lib/rtl";

const PAGE_LIST = getPageList();

const PageRow = memo(function PageRow({
  entry,
  onPress,
}: {
  entry: PageListEntry;
  onPress: (page: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={t("quran.pageN", { n: entry.page })}
      onPress={() => onPress(entry.page)}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {entry.page}
        </ThemedText>
      </View>
      <View style={styles.rowBody}>
        <ThemedText type="small" numberOfLines={1}>
          {t("quran.pageN", { n: entry.page })}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {entry.surahNameTransliteration} · {entry.surah}:{entry.ayah} ·{" "}
          {t("quran.juzN", { n: entry.juz })}
        </ThemedText>
      </View>
      <SymbolView name={chevronForward()} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
});

export default function QuranPagesBrowserScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const contentBottomInset = useContentBottomInset();

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

  const renderItem = useCallback<ListRenderItem<PageListEntry>>(
    ({ item }) => <PageRow entry={item} onPress={openPage} />,
    [openPage],
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
          data={PAGE_LIST}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
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
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: { flex: 1, gap: 2 },
});
