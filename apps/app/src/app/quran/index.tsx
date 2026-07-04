import { useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItem, StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { BottomTabInset, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSurahMeta } from "@/lib/quran";
import { searchSurahList } from "@/lib/search";
import { useLastRead } from "@/stores/quran-store";

type Surah = ReturnType<typeof getSurahMeta>[number];

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
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={surah.nameEnglish}
      onPress={() => onPress(surah.number)}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="caption" style={{ color: colors.accent }}>
          {surah.number}
        </ThemedText>
      </View>
      <View style={styles.rowBody}>
        <ThemedText type="small" numberOfLines={1}>
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
          label={surah.revelationPlace === "makkah" ? t("quran.makki") : t("quran.madani")}
          color={colors.mutedForeground}
          background={colors.card}
        />
      </View>
    </PressableScale>
  );
});

export default function QuranHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [query, setQuery] = useState("");
  const lastRead = useLastRead();
  const surahs = getSurahMeta();

  // Fuzzy, typo-tolerant surah filter (name / English / number / Arabic); the
  // full list shows when the query is empty.
  const filtered = useMemo(() => (query.trim() ? searchSurahList(query) : surahs), [query, surahs]);

  const openSurah = useCallback(
    (n: number) => router.push({ pathname: "/quran/[surah]", params: { surah: String(n) } }),
    [router],
  );

  const keyExtractor = useCallback((surah: Surah) => String(surah.number), []);

  const renderItem = useCallback<ListRenderItem<Surah>>(
    ({ item }) => <SurahRow surah={item} onPress={openSurah} />,
    [openSurah],
  );

  // The header (screen actions, continue card, search input + section header)
  // scrolls with the list as the FlatList's header so the surah list owns
  // scrolling (ScreenLayout is `scrollable={false}`).
  const listHeader = (
    <View style={styles.header}>
      <Stagger>
        <View style={styles.headerActions}>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("quran.search")}
            onPress={() => router.push("/quran/search")}
            style={[styles.iconButton, { backgroundColor: colors.muted }]}
          >
            <ThemedText type="small" themeColor="mutedForeground">
              {t("quran.search")}
            </ThemedText>
          </PressableScale>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("quran.bookmarks")}
            onPress={() => router.push("/quran/bookmarks")}
            style={[styles.iconButton, { backgroundColor: colors.muted }]}
          >
            <ThemedText type="small" themeColor="mutedForeground">
              {t("quran.bookmarks")}
            </ThemedText>
          </PressableScale>
        </View>

        {lastRead ? (
          <Card
            variant="muted"
            style={styles.continueCard}
            onPress={() => openSurah(lastRead.surah)}
          >
            <View style={[styles.continueIcon, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="subtitle" style={{ color: colors.accent }}>
                {lastRead.surah}
              </ThemedText>
            </View>
            <View style={styles.continueText}>
              <ThemedText type="smallBold">{t("quran.continueReading")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quran.continueAt", { surah: lastRead.surah, ayah: lastRead.ayah })}
              </ThemedText>
            </View>
          </Card>
        ) : null}

        <Card padding="three">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("quran.searchSurah")}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
          <SectionHeader
            title={t("quran.surahList")}
            icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          />
        </Card>
      </Stagger>
    </View>
  );

  return (
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  flatList: { flex: 1, width: "100%" },
  listContent: { gap: Spacing.two, paddingBottom: BottomTabInset + Spacing.four },
  header: { gap: Spacing.four },
  headerActions: { flexDirection: "row", gap: Spacing.two },
  iconButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  continueCard: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: { flex: 1, gap: 2 },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.three,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  number: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: { flex: 1, gap: 2 },
  rowMeta: { alignItems: "flex-end", gap: Spacing.one },
  rowArabic: { fontSize: 20, lineHeight: 32 },
});
