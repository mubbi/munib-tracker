import { isRtlLocale } from "@munib-tracker/shared/i18n";
import type { Ayah } from "@munib-tracker/shared/types";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AyahTafsirSheetHost } from "@/components/quran/ayah-tafsir-sheet-host";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { SurahBanner } from "@/components/quran/surah-banner";
import { AyahMoreActions } from "@/components/quran/surah-reader/ayah-more-actions";
import { AyahRow } from "@/components/quran/surah-reader/ayah-row";
import { useAyahActions } from "@/components/quran/surah-reader/use-ayah-actions";
import { useAyahSheetActions } from "@/components/quran/surah-reader/use-ayah-sheet-actions";
import { QuranWordStudyProviders } from "@/components/quran/word-by-word";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { isTV } from "@/lib/platform/is-tv";
import { ayahTracks } from "@/lib/quran-audio";
import {
  loadQuranAyahCardsRanges,
  type QuranAyahCardData,
  type QuranAyahCardsPayload,
} from "@/lib/quran-ayah-range";
import type { Passage } from "@/lib/quran-companion/types";
import { getPageForAyah, juzForAyah } from "@/lib/quran-meta";
import { resolveReadingFontSizes } from "@/lib/reading-typography";
import { passageFromRef } from "@/lib/recite-along/passages";
import { useReadingDisplay } from "@/lib/settings/reading-display";
import { buildAyahSharePayload } from "@/lib/share";
import { resolveQuranEditionId } from "@/lib/translation-locale";
import type { ZikrQuranRange } from "@/lib/zikr-quran";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import type { AudioTrack } from "@/providers/audio-player-types";
import { hifzKey, useEnsureHifzLoaded, useHifzMap } from "@/stores/hifz-store";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";

const BUNDLED_EN_FALLBACK = "en-pickthall";

/**
 * Note editor / peek sheets, loaded on first render of the cards: the editor
 * reads the bundled Qur'an text, which must stay out of the Adhkar screens'
 * first-load graph (docs/PROFILING.md).
 */
const LazyQuranNotesSheetHost = lazy(() =>
  import("@/components/quran/quran-notes-sheet-host").then((m) => ({
    default: m.QuranNotesSheetHost,
  })),
);

type QuranAyahRangeCardsProps = {
  ranges: ZikrQuranRange[];
  /** Continue / player source path (e.g. `/zikr/detail/before_sleep-ikhlas`). */
  sourceHref: string;
  /** Reuse the parent screen's share snapshot host when provided. */
  shareCard?: ReturnType<typeof useShareContentCard>;
};

/** A loaded card as the reader's `Ayah` (bundled metadata, no `@/lib/quran`). */
function cardAyah(surah: number, card: QuranAyahCardData): Ayah {
  return {
    surah,
    ayah: card.ayah,
    global: 0,
    arabic: card.arabic,
    juz: juzForAyah(surah, card.ayah),
    sajda: card.sajda,
    page: getPageForAyah(surah, card.ayah),
    hizb: 0,
  };
}

/**
 * Qur'an ayah cards for one or more short spans (Ayat al-Kursi, last two of
 * Al-Baqarah, the three Quls, …), drawn with the surah reader's own ayah card —
 * Play · Save · Share · More, with tafsir, notes, highlights, hifz, practise and
 * report expanding inline (TV: Select opens the ayah action sheet) — without
 * opening the full surah list. Multi-surah bundles render a SurahBanner between
 * sections; one ayah's "More" row is open at a time across all of them.
 */
export function QuranAyahRangeCards({
  ranges,
  sourceHref,
  shareCard: shareCardProp,
}: QuranAyahRangeCardsProps) {
  const { t } = useTranslation();
  const audio = useAudioPlayerContext();
  const prefs = useQuranPrefs();
  const internalShare = useShareContentCard();
  const shareCard = shareCardProp ?? internalShare;
  const { translationLocale, locale: appLocale } = usePreferences();
  const editionId = resolveQuranEditionId({ translationLocale, locale: appLocale });
  /** `surah:ayah` whose inline "More" row is open (one at a time). */
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const rangesKey = ranges.map((r) => `${r.surah}:${r.ayahFrom}-${r.ayahTo}`).join("|");
  // Recite-along passages (D68), one per span; spans never cross a surah.
  const passages = useMemo(
    () => ranges.map((r) => passageFromRef(r)).filter((p): p is Passage => p != null),
    [ranges],
  );
  const sectionPassages = useMemo(
    () => new Map(passages.map((p) => [p.surah, p] as const)),
    [passages],
  );

  const { data, isPending } = useQuery({
    queryKey: ["quran-ayah-cards-ranges", rangesKey, editionId],
    enabled: ranges.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    networkMode: "offlineFirst",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    queryFn: () => loadQuranAyahCardsRanges(ranges, editionId || BUNDLED_EN_FALLBACK),
  });

  const { sectionOffsets, tracks } = useMemo(() => {
    const sections = data ?? [];
    const offsets: number[] = [];
    const allTracks: AudioTrack[] = [];
    for (const section of sections) {
      offsets.push(allTracks.length);
      allTracks.push(
        ...ayahTracks(
          prefs.preferredReciterDir,
          section.surahName,
          section.surah,
          section.ayahs.map((a) => cardAyah(section.surah, a)),
          {
            translations: Object.fromEntries(
              section.ayahs.map((a) => [String(a.ayah), a.translation]),
            ),
            lang: translationLocale || "en",
          },
        ),
      );
    }
    return { sectionOffsets: offsets, tracks: allTracks };
  }, [data, prefs.preferredReciterDir, translationLocale]);

  const playAudio = audio.play;
  const toggleAudio = audio.toggle;
  const currentAudioId = audio.current?.id;
  const playFrom = useCallback(
    (index: number) => {
      if (tracks.length === 0) return;
      playAudio(tracks, index, { sourceHref });
    },
    [playAudio, sourceHref, tracks],
  );
  /** Per-ayah control: pause / resume the current ayah, else play the range from it. */
  const playOrToggle = useCallback(
    (trackIndex: number) => {
      if (currentAudioId != null && tracks[trackIndex]?.id === currentAudioId) {
        toggleAudio();
        return;
      }
      playFrom(trackIndex);
    },
    [currentAudioId, playFrom, toggleAudio, tracks],
  );

  if (isPending || !data?.length) {
    return null;
  }

  const rangeActive = currentAudioId != null && tracks.some((track) => track.id === currentAudioId);
  const rangePlaying = rangeActive && audio.isPlaying;
  const showSectionHeaders = data.length > 1;
  const singlePassage = showSectionHeaders ? null : (passages[0] ?? null);

  return (
    <View style={styles.root}>
      {shareCardProp ? null : shareCard.SnapshotHost}
      <View style={styles.topActions}>
        <Button
          label={rangePlaying ? t("quran.actionPause") : t("common.play")}
          icon={rangePlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
          style={styles.topAction}
          onPress={() => {
            if (rangeActive) {
              toggleAudio();
              return;
            }
            playFrom(0);
          }}
        />
        {/* One span: recite it along here. Several (the three Quls): one per section. */}
        {singlePassage ? (
          <ReciteAlongButton passage={singlePassage} style={styles.topAction} />
        ) : null}
      </View>

      {data.map((section, sectionIndex) => (
        <RangeSection
          key={section.surah}
          section={section}
          trackOffset={sectionOffsets[sectionIndex] ?? 0}
          showHeader={showSectionHeaders}
          passage={showSectionHeaders ? sectionPassages.get(section.surah) : undefined}
          shareCard={shareCard}
          expandedKey={expandedKey}
          setExpandedKey={setExpandedKey}
          onPlayTrack={playOrToggle}
        />
      ))}
      {isTV() ? null : (
        <Suspense fallback={null}>
          <LazyQuranNotesSheetHost />
        </Suspense>
      )}
    </View>
  );
}

function RangeSection({
  section,
  trackOffset,
  showHeader,
  passage,
  shareCard,
  expandedKey,
  setExpandedKey,
  onPlayTrack,
}: {
  section: QuranAyahCardsPayload;
  /** Index of this section's first ayah in the shared audio queue. */
  trackOffset: number;
  showHeader: boolean;
  /** Multi-surah bundles: this section's recite-along passage. */
  passage?: Passage;
  shareCard: ReturnType<typeof useShareContentCard>;
  expandedKey: string | null;
  setExpandedKey: (update: (current: string | null) => string | null) => void;
  onPlayTrack: (trackIndex: number) => void;
}) {
  const { t } = useTranslation();
  const tv = isTV();
  const surahNumber = section.surah;
  const audio = useAudioPlayerContext();
  const bookmarks = useQuranBookmarks();
  const { toggleBookmark } = useQuranActions();
  const { fontPrefs, translationLocale } = usePreferences();
  const { showTransliteration, showTranslation } = useReadingDisplay();
  const sizes = resolveReadingFontSizes("quran", fontPrefs);
  const translationDir = isRtlLocale(translationLocale) ? "rtl" : "ltr";
  useEnsureHifzLoaded();
  const hifzMap = useHifzMap();

  const ayahs = useMemo(
    () => section.ayahs.map((card) => cardAyah(surahNumber, card)),
    [section.ayahs, surahNumber],
  );
  const translations = useMemo(
    () => Object.fromEntries(section.ayahs.map((a) => [String(a.ayah), a.translation])),
    [section.ayahs],
  );
  const bookmarkedSet = useMemo(
    () => new Set(bookmarks.map((b) => `${b.surah}:${b.ayah}`)),
    [bookmarks],
  );

  const [tafsirAyah, setTafsirAyah] = useState<number | null>(null);
  const [tvActionIndex, setTvActionIndex] = useState<number | null>(null);
  const {
    handlers,
    hifz: { cancelHifz, confirmHifz, dialog: hifzDialog },
  } = useAyahActions({
    surahNumber,
    surahName: section.surahName,
    hifzMap,
    openTafsir: setTafsirAyah,
  });
  const closeTvActions = useCallback(() => setTvActionIndex(null), []);
  const sheetActions = useAyahSheetActions({ handlers, closeSheet: closeTvActions });

  const onToggleExpanded = useCallback(
    (ayah: number) => {
      const key = `${surahNumber}:${ayah}`;
      setExpandedKey((current) => (current === key ? null : key));
    },
    [setExpandedKey, surahNumber],
  );
  const onPlayAtIndex = useCallback(
    (index: number) => onPlayTrack(trackOffset + index),
    [onPlayTrack, trackOffset],
  );
  const onBookmarkAyah = useCallback(
    (surah: number, ayah: number) => void toggleBookmark(surah, ayah),
    [toggleBookmark],
  );
  const shareRef = shareCard.share;
  const onShareAyah = useCallback(
    (arabic: string, translation: string, surah: number, ayah: number, translit?: string) => {
      void shareRef({
        ...buildAyahSharePayload(arabic, translation, surah, ayah, {
          surahName: section.surahName,
          transliteration: translit,
          sectionTitle: t("share.sectionQuran"),
        }),
        shareKey: `${surah}:${ayah}`,
      });
    },
    [section.surahName, shareRef, t],
  );
  const onOpenActions = useCallback((index: number) => setTvActionIndex(index), []);

  const currentId = audio.current?.id;
  const playingAyah =
    currentId?.startsWith(`${surahNumber}:`) &&
    ayahs.some((a) => `${surahNumber}:${a.ayah}` === currentId)
      ? Number(currentId.slice(currentId.indexOf(":") + 1))
      : null;
  const actionAyah = tvActionIndex != null ? ayahs[tvActionIndex] : undefined;
  const actionKey = actionAyah ? `${surahNumber}:${actionAyah.ayah}` : null;

  return (
    <View style={styles.section}>
      {showHeader ? <SectionHeader section={section} /> : null}
      {passage ? (
        <ReciteAlongButton passage={passage} size="sm" style={styles.sectionRecite} />
      ) : null}
      <QuranWordStudyProviders
        wordAudioEnabled={false}
        playingAyah={playingAyah}
        audioIsPlaying={audio.isPlaying}
        audioIsBuffering={Boolean(audio.isBuffering && !audio.isLoaded)}
        activeWordIndex={null}
        surah={surahNumber}
      >
        <View style={styles.section}>
          {section.ayahs.map((card, index) => {
            const ayah = ayahs[index];
            if (!ayah) return null;
            const key = `${surahNumber}:${card.ayah}`;
            return (
              <AyahRow
                key={key}
                ayah={ayah}
                index={index}
                surahNumber={surahNumber}
                arabicSize={sizes.arabic}
                translitSize={sizes.transliteration}
                translationSize={sizes.translation}
                hifzStatus={hifzMap[hifzKey(surahNumber, card.ayah)]}
                secondTranslationDir="ltr"
                transliteration={
                  showTransliteration ? card.transliteration || undefined : undefined
                }
                translation={showTranslation ? card.translation : ""}
                translationDir={translationDir}
                isBookmarked={bookmarkedSet.has(key)}
                onPlayAtIndex={onPlayAtIndex}
                onBookmarkAyah={onBookmarkAyah}
                onShareAyah={onShareAyah}
                isSharing={shareCard.isSharing(key)}
                isGesturePending={shareCard.isGesturePending(key)}
                onOpenActions={onOpenActions}
                expanded={expandedKey === key}
                onToggleExpanded={onToggleExpanded}
                actionHandlers={handlers}
              />
            );
          })}
        </View>
      </QuranWordStudyProviders>

      <AyahTafsirSheetHost
        surah={surahNumber}
        ayah={tafsirAyah}
        onClose={() => setTafsirAyah(null)}
      />
      <ConfirmDialog
        visible={hifzDialog.visible}
        title={t("hifz.confirmTitle")}
        message={hifzDialog.message}
        confirmLabel={hifzDialog.confirmLabel}
        cancelLabel={t("common.cancel")}
        destructive={hifzDialog.destructive}
        onConfirm={() => void confirmHifz()}
        onCancel={cancelHifz}
        onClose={cancelHifz}
      />
      {tv ? (
        // TV: Select on an ayah card (phones / web expand "More" inline instead).
        <AyahMoreActions
          ayah={actionAyah}
          surahNumber={surahNumber}
          surahName={section.surahName}
          surahNameEnglish={section.nameEnglish}
          locale={handlers.locale}
          translation={translations}
          isBookmarked={actionKey != null && bookmarkedSet.has(actionKey)}
          isPlaying={actionKey != null && audio.isPlaying && currentId === actionKey}
          hifzStatus={actionAyah ? hifzMap[hifzKey(surahNumber, actionAyah.ayah)] : undefined}
          onClose={closeTvActions}
          onPlay={() => {
            if (tvActionIndex == null) return;
            const index = tvActionIndex;
            setTvActionIndex(null);
            onPlayAtIndex(index);
          }}
          onBookmark={(ayahNum) => void toggleBookmark(surahNumber, ayahNum)}
          onHifz={sheetActions.onHifz}
          onTafsir={sheetActions.onTafsir}
        />
      ) : null}
    </View>
  );
}

function SectionHeader({ section }: { section: QuranAyahCardsPayload }) {
  if (section.nameArabic) {
    return (
      <SurahBanner
        nameArabic={section.nameArabic}
        nameEnglish={section.nameEnglish || section.surahName}
        revelationPlace={section.revelationPlace}
        ayahCount={section.ayahCount}
      />
    );
  }

  return (
    <ThemedText type="smallBold" style={styles.fallbackTitle}>
      {section.surahName}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
  },
  topActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  topAction: {
    flexGrow: 1,
    flexBasis: 140,
  },
  sectionRecite: {
    alignSelf: "flex-start",
  },
  section: {
    gap: Spacing.three,
  },
  fallbackTitle: {
    marginTop: Spacing.one,
  },
});
