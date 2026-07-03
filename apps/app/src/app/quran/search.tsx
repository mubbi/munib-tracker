import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Share, StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getBundledEdition, getSurahAyahs, getSurahMeta, getTransliteration } from "@/lib/quran";

const SEARCH_EDITION = "en-pickthall";
const MAX_RESULTS = 40;
const DEBOUNCE_MS = 200;

interface SearchHit {
  surah: number;
  ayah: number;
  surahName: string;
  text: string;
  arabic: string;
}

/** Compose Arabic + translation + "Surah:Ayah" reference for the share sheet. */
function shareAyah(arabic: string, translation: string, surah: number, ayah: number) {
  const parts = [arabic, translation].filter(Boolean);
  parts.push(`— ${surah}:${ayah}`);
  void Share.share({ message: parts.join("\n\n") });
}

export default function QuranSearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the query ~200ms before the full-corpus scan.
  useEffect(() => {
    if (query.trim() === debounced) {
      setPending(false);
      return;
    }
    setPending(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDebounced(query.trim());
      setPending(false);
    }, DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, debounced]);

  const results = useMemo<SearchHit[]>(() => {
    const q = debounced.trim().toLowerCase();
    if (q.length < 2) return [];
    const hits: SearchHit[] = [];
    for (const surah of getSurahMeta()) {
      const translation = getBundledEdition(SEARCH_EDITION, surah.number);
      const translit = getTransliteration(surah.number);
      const ayahs = getSurahAyahs(surah.number);
      for (let a = 1; a <= surah.ayahCount; a++) {
        const text = translation[String(a)] ?? "";
        const tr = translit[String(a)] ?? "";
        if (text.toLowerCase().includes(q) || tr.toLowerCase().includes(q)) {
          hits.push({
            surah: surah.number,
            ayah: a,
            surahName: surah.nameTransliteration,
            text,
            arabic: ayahs[a - 1]?.arabic ?? "",
          });
          if (hits.length >= MAX_RESULTS) return hits;
        }
      }
    }
    return hits;
  }, [debounced]);

  const showEmpty = !pending && debounced.trim().length >= 2 && results.length === 0;

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
          accessibilityLabel={t("quran.searchPlaceholder")}
          autoFocus
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
        />
        {pending ? (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={colors.accent} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quran.searching")}
            </ThemedText>
          </View>
        ) : (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {results.length > 0
              ? t("quran.resultsCount", { count: results.length })
              : t("quran.searchHint")}
          </ThemedText>
        )}

        {showEmpty ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("quran.noResults")}
          />
        ) : !pending ? (
          <View style={styles.list}>
            {results.map((hit) => (
              <View
                key={`${hit.surah}:${hit.ayah}`}
                style={[styles.row, { backgroundColor: colors.muted }]}
              >
                <View style={styles.rowHeader}>
                  <PressableScale
                    haptic="light"
                    accessibilityRole="button"
                    accessibilityLabel={`${hit.surahName} ${hit.ayah}`}
                    onPress={() =>
                      router.push({
                        pathname: "/quran/[surah]",
                        params: { surah: String(hit.surah) },
                      })
                    }
                    style={styles.rowHeaderContent}
                  >
                    <ThemedText type="smallBold" numberOfLines={1} style={styles.rowName}>
                      {hit.surahName}
                    </ThemedText>
                    <Pill
                      label={t("quran.ayahRef", { surah: hit.surah, ayah: hit.ayah })}
                      color={colors.accent}
                      background={tokens.accentSoft}
                    />
                  </PressableScale>
                  <IconButton
                    name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                    size={18}
                    tintColor={colors.mutedForeground}
                    accessibilityLabel={t("quran.shareAyah")}
                    haptic="light"
                    onPress={() => shareAyah(hit.arabic, hit.text, hit.surah, hit.ayah)}
                  />
                </View>
                <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2}>
                  {hit.text}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
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
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  row: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  rowHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowName: { flexShrink: 1 },
});
