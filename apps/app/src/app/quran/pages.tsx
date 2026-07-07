import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { getPageList } from "@/lib/quran";
import { chevronForward } from "@/lib/rtl";

const PAGE_LIST = getPageList();

export default function QuranPagesBrowserScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  const openPage = (page: number) => router.push(`/quran/page/${page}`);

  return (
    <ScreenLayout
      eyebrow={t("quran.eyebrow")}
      title={t("quran.pages")}
      subtitle={t("quran.pagesSubtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/pages" />
      <FlatList
        data={PAGE_LIST}
        keyExtractor={(item) => String(item.page)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: entry }) => (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("quran.pageN", { n: entry.page })}
            onPress={() => openPage(entry.page)}
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
        )}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: Spacing.three, gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: { flex: 1, gap: 2 },
});
