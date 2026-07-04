import type { Ayah } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";

import { isRemoteEdition, REMOTE_EDITIONS } from "@/api/quran-remote";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { BottomTabInset, Radius, Spacing } from "@/constants/theme";
import { useRemoteEditionSurah } from "@/hooks/use-quran";
import { useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  getBundledEdition,
  getBundledEditions,
  getEditionById,
  getSurahAyahs,
  getSurahByNumber,
  getTransliteration,
} from "@/lib/quran";
import { ayahTracks, RECITERS } from "@/lib/quran-audio";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useQuranActions, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";

const FALLBACK_TRANSLATION = "en-pickthall";

const ALL_TRANSLATIONS = [
  ...getBundledEditions().filter((e) => e.kind === "translation"),
  ...REMOTE_EDITIONS,
];

function editionDirection(id: string): "ltr" | "rtl" {
  return (
    getEditionById(id)?.direction ?? REMOTE_EDITIONS.find((e) => e.id === id)?.direction ?? "ltr"
  );
}

/** Compose Arabic + translation + "Surah:Ayah" reference for the share sheet. */
export function shareAyah(arabic: string, translation: string, surah: number, ayah: number) {
  const parts = [arabic, translation].filter(Boolean);
  parts.push(`— ${surah}:${ayah}`);
  void Share.share({ message: parts.join("\n\n") });
}

export default function SurahReaderScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ surah: string; ayah?: string }>();
  const surahNumber = Number(params.surah);
  const surah = getSurahByNumber(surahNumber);
  // Optional deep-link target (e.g. from universal search) — scroll to & mark it.
  const focusAyah = params.ayah ? Number(params.ayah) : undefined;

  const { colors, tokens } = useThemeTokens();
  const prefs = useQuranPrefs();
  const { updatePrefs, setLastRead, toggleBookmark } = useQuranActions();
  const bookmarks = useQuranBookmarks();
  const audio = useAudioPlayerContext();
  const listRef = useRef<FlatList<Ayah>>(null);

  const ayahs = useMemo(() => (surah ? getSurahAyahs(surahNumber) : []), [surah, surahNumber]);

  // Resolve a `surah:ayah` key to its row index. Ayahs are contiguous starting at
  // 1, so the ayah number maps directly to `index = ayah - 1` — but guard against
  // gaps by validating against the actual data.
  const indexForKey = useCallback(
    (key: string) => {
      const ayahNumber = Number(key.split(":")[1]);
      if (!Number.isFinite(ayahNumber)) return -1;
      const guess = ayahNumber - 1;
      if (ayahs[guess]?.ayah === ayahNumber) return guess;
      return ayahs.findIndex((a) => a.ayah === ayahNumber);
    },
    [ayahs],
  );

  // Follow the currently-playing card (or a deep-linked ayah) via scrollToIndex.
  const activeKey = audio.current?.id ?? (focusAyah ? `${surahNumber}:${focusAyah}` : undefined);
  const { onScrollToIndexFailed } = useScrollToActiveIndex(listRef, activeKey, indexForKey);

  const requestedEdition = prefs.preferredTranslationIds[0] ?? FALLBACK_TRANSLATION;
  const knownEdition = ALL_TRANSLATIONS.some((e) => e.id === requestedEdition)
    ? requestedEdition
    : FALLBACK_TRANSLATION;
  const remoteActive = isRemoteEdition(knownEdition);

  // Remote editions are fetched cache-first; call the hook unconditionally.
  const remoteQuery = useRemoteEditionSurah(
    remoteActive && surah ? knownEdition : null,
    surahNumber,
  );

  const bundledTranslation = useMemo(
    () =>
      surah
        ? getBundledEdition(remoteActive ? FALLBACK_TRANSLATION : knownEdition, surahNumber)
        : {},
    [surah, surahNumber, knownEdition, remoteActive],
  );
  // Remote data when available, otherwise fall back to a bundled translation.
  const translation = remoteActive ? (remoteQuery.data ?? bundledTranslation) : bundledTranslation;
  const translationLoading = remoteActive && (remoteQuery.isPending || remoteQuery.isFetching);
  const usingFallback = remoteActive && !remoteQuery.data && !translationLoading;
  const translationDir = usingFallback ? "ltr" : editionDirection(knownEdition);

  const transliteration = useMemo(
    () => (surah ? getTransliteration(surahNumber) : {}),
    [surah, surahNumber],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: record entry once per surah open.
  useEffect(() => {
    if (surah) void setLastRead(surahNumber, focusAyah ?? 1);
  }, [surahNumber]);

  if (!surah) {
    return (
      <ScreenLayout
        title={t("quran.title")}
        onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("quran.notFoundTitle")}
          description={t("quran.notFoundDesc")}
        />
      </ScreenLayout>
    );
  }

  const reciterDir = prefs.preferredReciterDir;
  const reciter = RECITERS.find((r) => r.dir === reciterDir) ?? RECITERS[0];

  const playFrom = (index: number) => {
    audio.play(ayahTracks(reciterDir, surah.nameTransliteration, surahNumber, ayahs), index, {
      sourceHref: `/quran/${surahNumber}`,
    });
    void setLastRead(surahNumber, index + 1, { isAudio: true });
  };

  const cycleReciter = () => {
    const idx = RECITERS.findIndex((r) => r.dir === reciterDir);
    const next = RECITERS[(idx + 1) % RECITERS.length];
    void updatePrefs({ preferredReciterDir: next.dir });
  };

  const bookmarkedSet = new Set(bookmarks.map((b) => `${b.surah}:${b.ayah}`));
  const currentAudioId = audio.current?.id;

  // Header card (reciter/translation controls + bismillah) rides above the
  // virtualized list. Kept inside <Stagger> so its entrance matches the previous
  // ScrollView layout exactly.
  const listHeader = (
    <Stagger>
      <Card padding="three">
        <View style={styles.controlRow}>
          <ThemedText type="smallBold">{t("quran.reciter")}</ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("quran.reciter")}
            onPress={cycleReciter}
          >
            <Pill label={reciter.name} color={colors.accent} background={tokens.accentSoft} />
          </Pressable>
        </View>

        <View style={styles.translationPicker}>
          <ThemedText type="smallBold" style={styles.pickerLabel}>
            {t("quran.translation")}
          </ThemedText>
          <View style={styles.chipRow}>
            {ALL_TRANSLATIONS.map((edition) => {
              const selected = edition.id === knownEdition;
              return (
                <PressableScale
                  key={edition.id}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={edition.name}
                  onPress={() => updatePrefs({ preferredTranslationIds: [edition.id] })}
                  style={[
                    styles.chip,
                    { backgroundColor: selected ? colors.accent : colors.muted },
                  ]}
                >
                  <ThemedText
                    type="caption"
                    style={{ color: selected ? colors.accentForeground : colors.mutedForeground }}
                  >
                    {edition.name}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>
          {translationLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.accent} />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quran.loadingTranslation")}
              </ThemedText>
            </View>
          ) : usingFallback ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.offlineNote}>
              {t("quran.offlineTranslation")}
            </ThemedText>
          ) : null}
        </View>

        <TransliterationToggle
          enabled={prefs.showTransliteration}
          onToggle={() => updatePrefs({ showTransliteration: !prefs.showTransliteration })}
        />

        <PlaySurahButton onPress={() => playFrom(0)} />
      </Card>

      {surah.bismillahPre ? (
        <ThemedText type="arabic" style={styles.bismillah}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </ThemedText>
      ) : null}
    </Stagger>
  );

  const renderItem = ({ item: ayah, index }: ListRenderItemInfo<Ayah>) => (
    <AyahRow
      ayah={ayah}
      transliteration={prefs.showTransliteration ? transliteration[String(ayah.ayah)] : undefined}
      translation={translation[String(ayah.ayah)] ?? ""}
      translationDir={translationDir}
      isPlaying={currentAudioId === `${surahNumber}:${ayah.ayah}`}
      highlighted={ayah.ayah === focusAyah}
      isBookmarked={bookmarkedSet.has(`${surahNumber}:${ayah.ayah}`)}
      onPlay={() => playFrom(index)}
      onBookmark={() => toggleBookmark(surahNumber, ayah.ayah)}
      onShare={() =>
        shareAyah(ayah.arabic, translation[String(ayah.ayah)] ?? "", surahNumber, ayah.ayah)
      }
    />
  );

  return (
    <ScreenLayout
      scrollable={false}
      eyebrow={t("quran.title")}
      title={surah.nameTransliteration}
      subtitle={`${surah.nameEnglish} · ${t("quran.ayahCount", { count: surah.ayahCount })}`}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <FlatList
        ref={listRef}
        data={ayahs}
        keyExtractor={ayahKeyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        onScrollToIndexFailed={onScrollToIndexFailed}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        windowSize={9}
        removeClippedSubviews
      />
    </ScreenLayout>
  );
}

/** Stable FlatList key for an ayah row (ayah numbers are unique within a surah). */
function ayahKeyExtractor(ayah: Ayah) {
  return String(ayah.ayah);
}

function TransliterationToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      onPress={onToggle}
      style={[styles.controlRow, styles.toggleRow]}
    >
      <ThemedText type="smallBold">{t("quran.showTransliteration")}</ThemedText>
      <View style={[styles.toggle, { backgroundColor: enabled ? colors.accent : tokens.hairline }]}>
        <View
          style={[
            styles.toggleKnob,
            { backgroundColor: colors.card, alignSelf: enabled ? "flex-end" : "flex-start" },
          ]}
        />
      </View>
    </Pressable>
  );
}

function PlaySurahButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("quran.playSurah")}
      onPress={onPress}
      style={[styles.playSurah, { backgroundColor: tokens.accentSoft }]}
    >
      <SymbolView
        name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
        size={20}
        tintColor={colors.accent}
      />
      <ThemedText type="smallBold" style={{ color: colors.accent }}>
        {t("quran.playSurah")}
      </ThemedText>
    </Pressable>
  );
}

/**
 * A single ayah card. Memoized so scrolling the virtualized list only re-renders
 * rows whose props actually change (e.g. the playing/highlighted row), not every
 * mounted row on each parent render.
 */
const AyahRow = memo(function AyahRow({
  ayah,
  transliteration,
  translation,
  translationDir,
  isPlaying,
  highlighted,
  isBookmarked,
  onPlay,
  onBookmark,
  onShare,
}: {
  ayah: Ayah;
  transliteration?: string;
  translation: string;
  translationDir: "ltr" | "rtl";
  isPlaying: boolean;
  highlighted?: boolean;
  isBookmarked: boolean;
  onPlay: () => void;
  onBookmark: () => void;
  onShare: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <Card
      padding="four"
      style={isPlaying || highlighted ? { borderColor: colors.accent, borderWidth: 1 } : undefined}
    >
      <View style={styles.ayahHeader}>
        <View style={[styles.ayahBadge, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption" style={{ color: colors.accent }}>
            {ayah.ayah}
          </ThemedText>
        </View>
        <View style={styles.ayahActions}>
          {ayah.sajda ? (
            <Pill label="۩" color={colors.accent} background={tokens.accentSoft} />
          ) : null}
          <IconButton
            name={
              isPlaying
                ? { ios: "pause.circle.fill", android: "pause_circle", web: "pause_circle" }
                : { ios: "play.circle", android: "play_circle", web: "play_circle" }
            }
            size={22}
            tintColor={colors.accent}
            accessibilityLabel={
              isPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayah.ayah })
            }
            haptic="light"
            onPress={onPlay}
          />
          <IconButton
            name={
              isBookmarked
                ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
            }
            size={20}
            tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
            accessibilityLabel={isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")}
            accessibilityState={{ selected: isBookmarked }}
            haptic="light"
            onPress={onBookmark}
          />
          <IconButton
            name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            size={20}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("quran.shareAyah")}
            haptic="light"
            onPress={onShare}
          />
        </View>
      </View>

      <ThemedText type="arabic" style={styles.arabic}>
        {ayah.arabic}
      </ThemedText>

      {transliteration ? (
        <ThemedText type="small" style={[styles.translit, { color: colors.accent }]}>
          {transliteration}
        </ThemedText>
      ) : null}

      {translation ? (
        <ThemedText
          type="default"
          style={[styles.translation, translationDir === "rtl" ? styles.rtl : null]}
        >
          {translation}
        </ThemedText>
      ) : null}
    </Card>
  );
});

const styles = StyleSheet.create({
  // The FlatList owns scrolling (ScreenLayout is scrollable={false}); fill the
  // available height and clear the bottom tab bar the way ScreenLayout normally does.
  list: { flex: 1 },
  listContent: { paddingBottom: BottomTabInset + Spacing.four },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleRow: { marginTop: Spacing.three },
  translationPicker: { marginTop: Spacing.three },
  pickerLabel: { marginBottom: Spacing.two },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  offlineNote: { marginTop: Spacing.two },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: "center",
  },
  toggleKnob: { width: 20, height: 20, borderRadius: 10 },
  playSurah: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginTop: Spacing.three,
  },
  bismillah: { textAlign: "center", fontSize: 24, lineHeight: 44 },
  ayahList: { gap: Spacing.three },
  ayahHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  ayahBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  ayahActions: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  arabic: { writingDirection: "rtl", textAlign: "right", fontSize: 26, lineHeight: 48 },
  translit: { fontStyle: "italic", marginTop: Spacing.three },
  translation: { marginTop: Spacing.two },
  rtl: { writingDirection: "rtl", textAlign: "right" },
});
