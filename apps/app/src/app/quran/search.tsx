import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getBundledEdition, getSurahMeta, getTransliteration } from "@/lib/quran";

const SEARCH_EDITION = "en-pickthall";
const MAX_RESULTS = 40;

interface SearchHit {
  surah: number;
  ayah: number;
  surahName: string;
  text: string;
}

export default function QuranSearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [query, setQuery] = useState("");

  const results = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const hits: SearchHit[] = [];
    for (const surah of getSurahMeta()) {
      const translation = getBundledEdition(SEARCH_EDITION, surah.number);
      const translit = getTransliteration(surah.number);
      for (let a = 1; a <= surah.ayahCount; a++) {
        const text = translation[String(a)] ?? "";
        const tr = translit[String(a)] ?? "";
        if (text.toLowerCase().includes(q) || tr.toLowerCase().includes(q)) {
          hits.push({ surah: surah.number, ayah: a, surahName: surah.nameTransliteration, text });
          if (hits.length >= MAX_RESULTS) return hits;
        }
      }
    }
    return hits;
  }, [query]);

  const showEmpty = query.trim().length >= 2 && results.length === 0;

  return (
    <ScreenLayout
      eyebrow={t("quran.title")}
      title={t("quran.searchTitle")}
      subtitle={t("quran.searchSubtitle")}
      onBack={() => router.back()}
    >
      <Card padding="three">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("quran.searchPlaceholder")}
          placeholderTextColor={colors.mutedForeground}
          autoFocus
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {results.length > 0
            ? t("quran.resultsCount", { count: results.length })
            : t("quran.searchHint")}
        </ThemedText>

        {showEmpty ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("quran.noResults")}
          />
        ) : (
          <View style={styles.list}>
            {results.map((hit) => (
              <PressableScale
                key={`${hit.surah}:${hit.ayah}`}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={`${hit.surahName} ${hit.ayah}`}
                onPress={() =>
                  router.push({ pathname: "/quran/[surah]", params: { surah: String(hit.surah) } })
                }
                style={[styles.row, { backgroundColor: colors.muted }]}
              >
                <View style={styles.rowHeader}>
                  <ThemedText type="smallBold">{hit.surahName}</ThemedText>
                  <Pill
                    label={t("quran.ayahRef", { surah: hit.surah, ayah: hit.ayah })}
                    color={colors.accent}
                    background={tokens.accentSoft}
                  />
                </View>
                <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2}>
                  {hit.text}
                </ThemedText>
              </PressableScale>
            ))}
          </View>
        )}
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  hint: { marginTop: Spacing.two },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  row: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
