import type { Ayah } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { isRemoteEdition, REMOTE_EDITIONS } from "@/api/quran-remote";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { OptionPickerSheet, SelectTrigger } from "@/components/quran/option-picker-sheet";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Durations } from "@/constants/motion";
import { Radius, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useRemoteEditionSurah } from "@/hooks/use-quran";
import { useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import {
  getBundledEdition,
  getBundledEditions,
  getEditionById,
  getSurahAyahs,
  getSurahByNumber,
  getSurahMeta,
  getTransliteration,
} from "@/lib/quran";
import { ayahTracks, RECITERS } from "@/lib/quran-audio";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { articleSchema } from "@/lib/seo/structured-data";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import {
  type HifzStatus,
  hifzKey,
  useEnsureHifzLoaded,
  useHifzActions,
  useHifzMap,
} from "@/stores/hifz-store";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";

const FALLBACK_TRANSLATION = "en-pickthall";

/** Deep-link focus ring: hold briefly so the user sees the target, then fade out. */
const FOCUS_HIGHLIGHT_HOLD_MS = 2500;
const FOCUS_HIGHLIGHT_FADE_MS = Durations.slow;

const ALL_TRANSLATIONS = [
  ...getBundledEditions().filter((e) => e.kind === "translation"),
  ...REMOTE_EDITIONS,
];

const RECITER_OPTIONS = RECITERS.map((r) => ({ id: r.dir, label: r.name }));
const TRANSLATION_OPTIONS = ALL_TRANSLATIONS.map((e) => ({ id: e.id, label: e.name }));

function editionDirection(id: string): "ltr" | "rtl" {
  return (
    getEditionById(id)?.direction ?? REMOTE_EDITIONS.find((e) => e.id === id)?.direction ?? "ltr"
  );
}

/**
 * Pre-render a static HTML page for every surah (1–114) at web export time, so
 * each has its own crawlable URL, metadata, and Arabic ayah text for search/AI.
 */
export function generateStaticParams(): Array<{ surah: string }> {
  return getSurahMeta().map((s) => ({ surah: String(s.number) }));
}

/** Compose Arabic + translation + "Surah:Ayah" reference for the share sheet. */
export function shareAyah(arabic: string, translation: string, surah: number, ayah: number) {
  const parts = [arabic, translation].filter(Boolean);
  parts.push(`— ${surah}:${ayah}`);
  void Share.share({ message: parts.join("\n\n") });
}

export default function SurahReaderScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ surah: string; ayah?: string }>();
  const surahNumber = Number(params.surah);
  const surah = getSurahByNumber(surahNumber);
  // Optional deep-link target (e.g. from universal search) — scroll to & mark it.
  const focusAyah = params.ayah ? Number(params.ayah) : undefined;

  const { colors } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const prefs = useQuranPrefs();
  const { fontPrefs } = usePreferences();
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const { updatePrefs, setLastRead, toggleBookmark } = useQuranActions();
  useEnsureHifzLoaded();
  const hifzMap = useHifzMap();
  const { cycle: cycleHifz } = useHifzActions();
  const bookmarks = useQuranBookmarks();
  const audio = useAudioPlayerContext();
  const listRef = useRef<FlatList<Ayah>>(null);
  const [reciterPickerOpen, setReciterPickerOpen] = useState(false);
  const [translationPickerOpen, setTranslationPickerOpen] = useState(false);
  const [secondaryPickerOpen, setSecondaryPickerOpen] = useState(false);
  const [focusHighlightAyah, setFocusHighlightAyah] = useState<number | undefined>(focusAyah);
  const focusTargetKey = focusAyah != null ? `${surahNumber}:${focusAyah}` : null;

  // Flash the deep-linked ayah, then drop the highlight so audio playback can own the border.
  useEffect(() => {
    if (!focusTargetKey) {
      setFocusHighlightAyah(undefined);
      return;
    }
    setFocusHighlightAyah(focusAyah);
    const timer = setTimeout(
      () => setFocusHighlightAyah(undefined),
      FOCUS_HIGHLIGHT_HOLD_MS + FOCUS_HIGHLIGHT_FADE_MS,
    );
    return () => clearTimeout(timer);
  }, [focusAyah, focusTargetKey]);

  const ayahs = useMemo(() => (surah ? getSurahAyahs(surahNumber) : []), [surah, surahNumber]);

  // Resolve a `surah:ayah` key to its row index. Ayahs are contiguous starting at
  // 1, so the ayah number maps directly to `index = ayah - 1` — but guard against
  // gaps by validating against the actual data.
  const indexForKey = useCallback(
    (key: string) => {
      const [surahPart, ayahPart] = key.split(":");
      if (Number(surahPart) !== surahNumber) return -1;
      const ayahNumber = Number(ayahPart);
      if (!Number.isFinite(ayahNumber)) return -1;
      const guess = ayahNumber - 1;
      if (ayahs[guess]?.ayah === ayahNumber) return guess;
      return ayahs.findIndex((a) => a.ayah === ayahNumber);
    },
    [ayahs, surahNumber],
  );

  const audioActiveKey =
    audio.current?.id.startsWith(`${surahNumber}:`) === true ? audio.current.id : undefined;
  // Follow the currently-playing card (or a deep-linked ayah) via scrollToIndex.
  const activeKey = audioActiveKey ?? (focusAyah ? `${surahNumber}:${focusAyah}` : undefined);
  const { onScrollToIndexFailed } = useScrollToActiveIndex(listRef, activeKey, indexForKey, {
    viewOffset: Spacing.two,
    itemCount: ayahs.length,
  });

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
  const translationLoading = remoteActive && remoteQuery.isPending;
  const usingFallback = remoteActive && !remoteQuery.data && !translationLoading;
  const translationDir = usingFallback ? "ltr" : editionDirection(knownEdition);

  // ── Second (side-by-side) translation — NF-1.13 ──────────────────────────
  const secondaryId = prefs.secondaryTranslationId;
  const secondaryKnown =
    secondaryId &&
    secondaryId !== knownEdition &&
    ALL_TRANSLATIONS.some((e) => e.id === secondaryId)
      ? secondaryId
      : undefined;
  const secondaryRemoteActive = secondaryKnown ? isRemoteEdition(secondaryKnown) : false;
  const secondaryRemoteQuery = useRemoteEditionSurah(
    secondaryRemoteActive && surah ? (secondaryKnown ?? null) : null,
    surahNumber,
  );
  const secondaryBundled = useMemo(
    () =>
      secondaryKnown && surah
        ? getBundledEdition(
            secondaryRemoteActive ? FALLBACK_TRANSLATION : secondaryKnown,
            surahNumber,
          )
        : {},
    [secondaryKnown, secondaryRemoteActive, surah, surahNumber],
  );
  const secondTranslation = secondaryKnown
    ? secondaryRemoteActive
      ? (secondaryRemoteQuery.data ?? secondaryBundled)
      : secondaryBundled
    : undefined;
  const secondaryDir = secondaryKnown ? editionDirection(secondaryKnown) : "ltr";
  const secondaryEdition = ALL_TRANSLATIONS.find((e) => e.id === secondaryId);

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
      <>
        <Seo
          path={`/quran/${params.surah}`}
          title={t("quran.notFoundTitle")}
          description={t("quran.notFoundDesc")}
          index={false}
        />
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
      </>
    );
  }

  const revelation = surah.revelationPlace === "makkah" ? "Makkah" : "Madinah";
  const surahTitle = `Surah ${surah.nameTransliteration} — ${surah.nameEnglish}`;
  const surahDescription = `Read and listen to Surah ${surah.nameTransliteration} (${surah.nameEnglish}), chapter ${surah.number} of the Qur'an — ${surah.ayahCount} ayahs, revealed in ${revelation}. Arabic text, transliteration, translation, and recitation, offline.`;
  const surahBreadcrumbs = [
    { name: t("tabs.home"), path: "/" },
    { name: t("quran.title"), path: "/quran" },
    { name: surah.nameTransliteration, path: `/quran/${surah.number}` },
  ];

  const reciterDir = prefs.preferredReciterDir;
  const reciter = RECITERS.find((r) => r.dir === reciterDir) ?? RECITERS[0];
  const selectedEdition =
    ALL_TRANSLATIONS.find((e) => e.id === knownEdition) ??
    ALL_TRANSLATIONS.find((e) => e.id === FALLBACK_TRANSLATION) ??
    ALL_TRANSLATIONS[0];

  const playFrom = (index: number) => {
    audio.play(ayahTracks(reciterDir, surah.nameTransliteration, surahNumber, ayahs), index, {
      sourceHref: `/quran/${surahNumber}`,
    });
    void setLastRead(surahNumber, index + 1, { isAudio: true });
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
          <SelectTrigger
            label={reciter.name}
            accessibilityLabel={t("quran.reciter")}
            onPress={() => setReciterPickerOpen(true)}
          />
        </View>

        <View style={[styles.controlRow, styles.translationRow]}>
          <ThemedText type="smallBold">{t("quran.translation")}</ThemedText>
          <SelectTrigger
            label={selectedEdition.name}
            accessibilityLabel={t("quran.translation")}
            onPress={() => setTranslationPickerOpen(true)}
          />
        </View>

        <View style={[styles.controlRow, styles.translationRow]}>
          <ThemedText type="smallBold">{t("quran.secondTranslation")}</ThemedText>
          <SelectTrigger
            label={secondaryEdition?.name ?? t("quran.secondTranslationNone")}
            accessibilityLabel={t("quran.secondTranslation")}
            onPress={() => setSecondaryPickerOpen(true)}
          />
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

        <PrefToggle
          label={t("quran.showTransliteration")}
          enabled={prefs.showTransliteration}
          onToggle={() => updatePrefs({ showTransliteration: !prefs.showTransliteration })}
        />
        <PrefToggle
          label={t("quran.showTranslation")}
          enabled={prefs.showTranslation}
          onToggle={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
        />

        <View style={[styles.controlRow, styles.translationRow]}>
          <ThemedText type="smallBold">{t("reading.textSize")}</ThemedText>
          <ReadingFontControls surface="quran" />
        </View>

        <PlaySurahButton onPress={() => playFrom(0)} />
      </Card>

      {surah.bismillahPre ? (
        <ThemedText
          type="arabic"
          style={[styles.bismillah, arabicReadingLayout(readingSizes.arabic - 2, "center")]}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </ThemedText>
      ) : null}
    </Stagger>
  );

  const locale = i18n.language?.split("-")[0] ?? "en";

  const renderItem = ({ item: ayah, index }: ListRenderItemInfo<Ayah>) => (
    <AyahRow
      ayah={ayah}
      surahNumber={surahNumber}
      locale={locale}
      arabicSize={readingSizes.arabic}
      translitSize={readingSizes.transliteration}
      translationSize={readingSizes.translation}
      hifzStatus={hifzMap[hifzKey(surahNumber, ayah.ayah)]}
      onHifz={() => cycleHifz(surahNumber, ayah.ayah)}
      secondTranslation={
        prefs.showTranslation && secondTranslation
          ? secondTranslation[String(ayah.ayah)]
          : undefined
      }
      secondTranslationDir={secondaryDir}
      transliteration={prefs.showTransliteration ? transliteration[String(ayah.ayah)] : undefined}
      translation={prefs.showTranslation ? (translation[String(ayah.ayah)] ?? "") : ""}
      translationDir={translationDir}
      isPlaying={currentAudioId === `${surahNumber}:${ayah.ayah}`}
      highlighted={ayah.ayah === focusHighlightAyah}
      isBookmarked={bookmarkedSet.has(`${surahNumber}:${ayah.ayah}`)}
      onPlay={() => playFrom(index)}
      onBookmark={() => toggleBookmark(surahNumber, ayah.ayah)}
      onShare={() =>
        shareAyah(ayah.arabic, translation[String(ayah.ayah)] ?? "", surahNumber, ayah.ayah)
      }
    />
  );

  return (
    <>
      <Seo
        path={`/quran/${surah.number}`}
        title={surahTitle}
        description={surahDescription}
        type="article"
        breadcrumbs={surahBreadcrumbs}
        keywords={[
          `Surah ${surah.nameTransliteration}`,
          surah.nameEnglish,
          `surah ${surah.number}`,
          "read Quran online",
        ]}
        jsonLd={[
          articleSchema({
            path: `/quran/${surah.number}`,
            type: "CreativeWork",
            headline: surahTitle,
            description: surahDescription,
            inLanguage: "ar",
            breadcrumbs: surahBreadcrumbs,
          }),
        ]}
      />
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
          ItemSeparatorComponent={AyahSeparator}
          onScrollToIndexFailed={onScrollToIndexFailed}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={12}
          windowSize={9}
          removeClippedSubviews
        />
        <OptionPickerSheet
          visible={reciterPickerOpen}
          title={t("quran.reciter")}
          options={RECITER_OPTIONS}
          selectedId={reciterDir}
          onSelect={(id) => updatePrefs({ preferredReciterDir: id })}
          onClose={() => setReciterPickerOpen(false)}
        />
        <OptionPickerSheet
          visible={translationPickerOpen}
          title={t("quran.translation")}
          options={TRANSLATION_OPTIONS}
          selectedId={knownEdition}
          onSelect={(id) => updatePrefs({ preferredTranslationIds: [id] })}
          onClose={() => setTranslationPickerOpen(false)}
        />
        <OptionPickerSheet
          visible={secondaryPickerOpen}
          title={t("quran.secondTranslation")}
          options={[{ id: "", label: t("quran.secondTranslationNone") }, ...TRANSLATION_OPTIONS]}
          selectedId={secondaryId ?? ""}
          onSelect={(id) => updatePrefs({ secondaryTranslationId: id || undefined })}
          onClose={() => setSecondaryPickerOpen(false)}
        />
      </ScreenLayout>
    </>
  );
}

/** Stable FlatList key for an ayah row (ayah numbers are unique within a surah). */
function ayahKeyExtractor(ayah: Ayah) {
  return String(ayah.ayah);
}

function AyahSeparator() {
  return <View style={styles.ayahSeparator} />;
}

function PrefToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      onPress={onToggle}
      style={[styles.controlRow, styles.toggleRow]}
    >
      <ThemedText type="smallBold">{label}</ThemedText>
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
  surahNumber,
  locale,
  transliteration,
  translation,
  translationDir,
  isPlaying,
  highlighted,
  isBookmarked,
  arabicSize,
  translitSize,
  translationSize,
  hifzStatus,
  onHifz,
  secondTranslation,
  secondTranslationDir,
  onPlay,
  onBookmark,
  onShare,
}: {
  ayah: Ayah;
  surahNumber: number;
  locale: string;
  transliteration?: string;
  translation: string;
  translationDir: "ltr" | "rtl";
  isPlaying: boolean;
  highlighted?: boolean;
  isBookmarked: boolean;
  arabicSize: number;
  translitSize: number;
  translationSize: number;
  hifzStatus?: HifzStatus;
  onHifz: () => void;
  secondTranslation?: string;
  secondTranslationDir: "ltr" | "rtl";
  onPlay: () => void;
  onBookmark: () => void;
  onShare: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const focusBorderOpacity = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(focusBorderOpacity);
    if (isPlaying || !highlighted) {
      focusBorderOpacity.value = 0;
      return;
    }
    focusBorderOpacity.value = 1;
    focusBorderOpacity.value = withDelay(
      FOCUS_HIGHLIGHT_HOLD_MS,
      withTiming(0, { duration: FOCUS_HIGHLIGHT_FADE_MS }),
    );
  }, [highlighted, isPlaying, focusBorderOpacity]);

  const focusBorderStyle = useAnimatedStyle(() =>
    focusBorderOpacity.value > 0 ? { opacity: focusBorderOpacity.value } : { opacity: 0 },
  );

  const reportRef = useMemo(
    () =>
      buildContentReportRef(
        "quran_ayah",
        String(ayah.ayah),
        `/quran/${surahNumber}?ayah=${ayah.ayah}`,
        locale,
        {
          parentId: String(surahNumber),
          snapshot: {
            arabic: ayah.arabic,
            translation,
            reference: `${surahNumber}:${ayah.ayah}`,
          },
        },
      ),
    [ayah.arabic, ayah.ayah, locale, surahNumber, translation],
  );

  return (
    <View style={styles.ayahRow}>
      <Card
        padding="four"
        style={isPlaying ? { borderColor: colors.accent, borderWidth: 1 } : undefined}
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
            <LabeledIconButton
              name={
                isPlaying
                  ? { ios: "pause.circle.fill", android: "pause_circle", web: "pause_circle" }
                  : { ios: "play.circle.fill", android: "play_circle", web: "play_circle" }
              }
              label={isPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
              tintColor={colors.accent}
              labelColor={colors.accent}
              background={tokens.accentSoft}
              accessibilityLabel={
                isPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayah.ayah })
              }
              onPress={onPlay}
            />
            <LabeledIconButton
              name={
                hifzStatus === "memorized"
                  ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
                  : hifzStatus === "review"
                    ? {
                        ios: "arrow.triangle.2.circlepath",
                        android: "sync",
                        web: "sync",
                      }
                    : { ios: "book.closed", android: "menu_book", web: "menu_book" }
              }
              label={
                hifzStatus === "memorized"
                  ? t("quran.actionMemorized")
                  : hifzStatus === "review"
                    ? t("quran.actionReview")
                    : t("hifz.short")
              }
              tintColor={
                hifzStatus === "memorized"
                  ? tokens.status.success.color
                  : hifzStatus === "review"
                    ? tokens.status.warning.color
                    : colors.mutedForeground
              }
              labelColor={
                hifzStatus === "memorized"
                  ? tokens.status.success.color
                  : hifzStatus === "review"
                    ? tokens.status.warning.color
                    : colors.mutedForeground
              }
              accessibilityLabel={
                hifzStatus === "memorized"
                  ? t("hifz.markReview")
                  : hifzStatus === "review"
                    ? t("hifz.clear")
                    : t("hifz.markMemorized")
              }
              accessibilityState={{ selected: !!hifzStatus }}
              haptic="selection"
              onPress={onHifz}
            />
            <LabeledIconButton
              name={
                isBookmarked
                  ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                  : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
              }
              label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
              tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
              labelColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
              accessibilityLabel={isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")}
              accessibilityState={{ selected: isBookmarked }}
              onPress={onBookmark}
            />
            <LabeledIconButton
              name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
              label={t("quran.actionShare")}
              tintColor={colors.mutedForeground}
              accessibilityLabel={t("quran.shareAyah")}
              onPress={onShare}
            />
            <ContentReportButton contentRef={reportRef} />
          </View>
        </View>

        <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(arabicSize)]}>
          {ayah.arabic}
        </ThemedText>

        {transliteration ? (
          <ThemedText
            type="small"
            style={[styles.translit, { color: colors.accent, fontSize: translitSize }]}
          >
            {transliteration}
          </ThemedText>
        ) : null}

        {translation ? (
          <ThemedText
            type="default"
            style={[
              styles.translation,
              { fontSize: translationSize },
              translationDir === "rtl" ? styles.rtl : null,
            ]}
          >
            {translation}
          </ThemedText>
        ) : null}

        {secondTranslation ? (
          <ThemedText
            type="default"
            themeColor="mutedForeground"
            style={[
              styles.secondTranslation,
              { fontSize: translationSize, borderTopColor: tokens.hairline },
              secondTranslationDir === "rtl" ? styles.rtl : null,
            ]}
          >
            {secondTranslation}
          </ThemedText>
        ) : null}
      </Card>
      {!isPlaying ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.focusRing,
            { borderColor: colors.accent, borderRadius: Radius.lg },
            focusBorderStyle,
          ]}
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  // The FlatList owns scrolling (ScreenLayout is scrollable={false}); fill the
  // available height and clear the bottom tab bar the way ScreenLayout normally does.
  list: { flex: 1 },
  listContent: { paddingBottom: 0 },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleRow: { marginTop: Spacing.three },
  translationRow: { marginTop: Spacing.three },
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
  bismillah: { marginBottom: Spacing.two },
  ayahSeparator: { height: Spacing.three },
  ayahRow: { position: "relative" },
  focusRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderCurve: "continuous",
  },
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
  ayahActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flexShrink: 1,
    gap: Spacing.half,
  },
  arabic: {},
  translit: { fontStyle: "italic", marginTop: Spacing.three },
  translation: { marginTop: Spacing.two },
  secondTranslation: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rtl: { writingDirection: "rtl", textAlign: "right" },
});
