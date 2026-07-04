import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  InteractionManager,
  Share,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { searchQuranAyahs } from "@/lib/search";

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

  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);

  // Fuzzy, typo-tolerant search over the shared Qur'an ayah index (translation +
  // transliteration), mapped to this screen's row shape. Building/scanning the
  // 6,236-ayah Fuse index is heavy, so run it off the interaction thread — the
  // spinner stays up until it resolves and typing stays smooth. Every setState is
  // guarded by `cancelled` so nothing lands after a new query or unmount.
  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const handle = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;
      const hits = searchQuranAyahs(debounced, MAX_RESULTS).results.map((hit) => ({
        surah: Number(hit.params?.surah),
        ayah: Number(hit.params?.ayah),
        surahName: hit.title,
        text: hit.subtitle ?? "",
        arabic: hit.arabic ?? "",
      }));
      if (cancelled) return;
      setResults(hits);
      setSearching(false);
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced]);

  // Show the spinner while the debounce is settling OR the deferred scan runs.
  const busy = pending || searching;
  const showEmpty = !busy && debounced.trim().length >= 2 && results.length === 0;

  return (
    <ScreenLayout
      eyebrow={t("quran.title")}
      title={t("quran.searchTitle")}
      subtitle={t("quran.searchSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
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
        {busy ? (
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
        ) : !busy ? (
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
