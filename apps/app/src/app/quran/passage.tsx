import { resolveIntlLocale } from "@munib-tracker/shared/i18n";
import type { Ayah } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AyahSeparator } from "@/components/quran/ayah-reader";
import {
  parsePassageParams,
  type QuranPassageParams,
  quranPassageSourceHref,
} from "@/components/quran/passage-params";
import { QuranNotesSheetHost } from "@/components/quran/quran-notes-sheet-host";
import {
  type ReaderEditionSheet,
  ReaderEditionSheets,
} from "@/components/quran/reader-edition-sheets";
import { useBookmarkedAyahSet } from "@/components/quran/reader-shared";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { SurahBanner } from "@/components/quran/surah-banner";
import { AyahFocusTrackerContext } from "@/components/quran/surah-reader/ayah-focus-tracker";
import { AyahMoreActions } from "@/components/quran/surah-reader/ayah-more-actions";
import { AyahRow } from "@/components/quran/surah-reader/ayah-row";
import { useAudioFollowAlong } from "@/components/quran/surah-reader/use-audio-follow-along";
import { useAyahActions } from "@/components/quran/surah-reader/use-ayah-actions";
import { useAyahSheetActions } from "@/components/quran/surah-reader/use-ayah-sheet-actions";
import { useSurahEditions } from "@/components/quran/surah-reader/use-surah-editions";
import { useSurahStudyLayers } from "@/components/quran/surah-reader/use-surah-study-layers";
import { TafsirAyahSheet } from "@/components/quran/tafsir-ayah-sheet";
import { QuranWordStudyProviders } from "@/components/quran/word-by-word";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahAyahs, getSurahByNumber, getTransliteration } from "@/lib/quran";
import { ayahTracks } from "@/lib/quran-audio";
import { normalizeRepeatPlan } from "@/lib/quran-repeat";
import { ayahNumberFromKey, surahAudioKey } from "@/lib/quran-surah-reader";
import { resolveReadingFontSizes } from "@/lib/reading-typography";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useTtsVoice } from "@/lib/settings/tts-voice";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";
import { buildAyahSharePayload } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { hifzKey, useEnsureHifzLoaded, useHifzMap } from "@/stores/hifz-store";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranPrefs } from "@/stores/quran-store";

/**
 * A focused passage (e.g. Ayat al-Kursi before sleep, from a Sunnah habit):
 * only `surah:from–to`, drawn with the surah reader's own ayah card — so notes,
 * highlights and the inline "More" actions work exactly as in the reader —
 * with audio queued for just these ayahs, Recite along, and a link into the
 * full surah at `from`. TV: Select on a card opens the ayah action sheet.
 */
export default function QuranPassageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<QuranPassageParams>();
  const parsed = parsePassageParams(params);
  const surahNumber = parsed?.surah ?? 0;
  const fromAyah = parsed?.from ?? 0;
  const toAyah = parsed?.to ?? 0;
  const surah = parsed ? getSurahByNumber(parsed.surah) : undefined;
  const hasSurah = surah != null && parsed != null;
  const tv = isTV();
  const contentBottomInset = useContentBottomInset();
  const chevron = useChevronForward();

  const prefs = useQuranPrefs();
  const { fontPrefs, translationLocale, locale: appLocale } = usePreferences();
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const { toggleBookmark } = useQuranActions();
  const { showTranslation, showTransliteration } = useReadingDisplayToggles();
  useEnsureHifzLoaded();
  const hifzMap = useHifzMap();
  const bookmarkedSet = useBookmarkedAyahSet();
  const showWordByWord = prefs.showWordByWord === true;
  const showTajweed = prefs.showTajweed === true;

  const audio = useAudioPlayerContext();
  const playAudio = audio.play;
  const toggleAudio = audio.toggle;
  const setRepeatPlan = audio.setRepeatPlan;
  const setTranslationAudio = audio.setTranslationAudio;
  const currentAudioId = audio.current?.id;
  const audioIsPlaying = audio.isPlaying;
  const audioIsBuffering = audio.isBuffering && !audio.isLoaded;
  const surahKey = surahAudioKey(currentAudioId, surahNumber);
  const surahPlayingAyah = ayahNumberFromKey(surahKey);
  const playingAyahNumber =
    surahPlayingAyah != null && surahPlayingAyah >= fromAyah && surahPlayingAyah <= toAyah
      ? surahPlayingAyah
      : null;

  const { share, activeShareKey, gesturePendingKey, SnapshotHost } = useShareContentCard();
  const [editionSheet, setEditionSheet] = useState<ReaderEditionSheet | null>(null);
  const [tafsirAyah, setTafsirAyah] = useState<number | null>(null);
  /** TV: row index whose ayah action sheet is open (Select on a card). */
  const [tvActionIndex, setTvActionIndex] = useState<number | null>(null);

  const ayahs = useMemo<Ayah[]>(
    () =>
      hasSurah
        ? getSurahAyahs(surahNumber).filter((a) => a.ayah >= fromAyah && a.ayah <= toAyah)
        : [],
    [fromAyah, hasSurah, surahNumber, toAyah],
  );
  const transliteration = useMemo(
    () => (hasSurah ? getTransliteration(surahNumber) : {}),
    [hasSurah, surahNumber],
  );

  const {
    translation,
    translationDir,
    secondTranslation,
    secondaryDir,
    knownEdition,
    secondaryId,
    activeTafsirId,
    tafsirEdition,
    tafsirMap,
    tafsirLoading,
    tafsirOffline,
    retryTafsir,
  } = useSurahEditions({ surahNumber, hasSurah, prefs, translationLocale, appLocale });
  const { tajweedByAyah, wordByWordByAyah } = useSurahStudyLayers({
    surahNumber,
    hasSurah,
    showTajweed,
    showWordByWord,
    wordLang: translationLocale || appLocale || "en",
  });
  const { ayahFocusRef, activeWordIndex } = useAudioFollowAlong({
    surahNumber,
    playingAyahNumber,
    showWordByWord,
    reciterDir: prefs.preferredReciterDir,
    wordByWordByAyah,
  });

  const openTafsirForAyah = useCallback(
    (ayahNumber: number) => {
      if (!activeTafsirId) {
        setEditionSheet("tafsir");
        return;
      }
      setTafsirAyah(ayahNumber);
    },
    [activeTafsirId],
  );
  const {
    handlers: ayahActionHandlers,
    expandedAyah,
    toggleExpanded,
    hifz: { cancelHifz, confirmHifz, dialog: hifzDialog },
  } = useAyahActions({
    surahNumber,
    surahName: surah?.nameTransliteration,
    hifzMap,
    openTafsir: openTafsirForAyah,
  });
  const closeAyahActions = useCallback(() => setTvActionIndex(null), []);
  const openAyahActions = useCallback((index: number) => setTvActionIndex(index), []);
  const sheetActions = useAyahSheetActions({
    handlers: ayahActionHandlers,
    closeSheet: closeAyahActions,
  });

  // ── Audio: only this passage's ayahs are queued ─────────────────────────────
  const ttsLang = resolveIntlLocale(translationLocale);
  const ttsVoiceId = useTtsVoice(ttsLang);
  const sourceHref = quranPassageSourceHref({ surah: surahNumber, from: fromAyah, to: toAyah });
  const playFrom = useCallback(
    (index: number) => {
      if (!surah || ayahs.length === 0) return;
      // The reader's range repeat counts surah ayahs; for a passage, verse repeat
      // and "repeat all" (the passage loops) carry over, a surah range does not.
      const mode = prefs.repeatMode === "range" ? "off" : prefs.repeatMode;
      setRepeatPlan(normalizeRepeatPlan(mode, undefined, ayahs.length));
      // TV has no speech synthesis — never queue translation TTS there.
      setTranslationAudio(tv ? "off" : (prefs.translationAudio ?? "off"));
      const tracks = ayahTracks(
        prefs.preferredReciterDir,
        surah.nameTransliteration,
        surahNumber,
        ayahs,
        { translations: translation, lang: ttsLang, voice: ttsVoiceId },
      );
      playAudio(tracks, index, { sourceHref });
    },
    [
      ayahs,
      playAudio,
      prefs.preferredReciterDir,
      prefs.repeatMode,
      prefs.translationAudio,
      setRepeatPlan,
      setTranslationAudio,
      sourceHref,
      surah,
      surahNumber,
      translation,
      ttsLang,
      ttsVoiceId,
      tv,
    ],
  );
  const playOrToggleAyah = useCallback(
    (index: number) => {
      const ayah = ayahs[index];
      if (!ayah) return;
      if (currentAudioId === `${surahNumber}:${ayah.ayah}`) {
        toggleAudio();
        return;
      }
      playFrom(index);
    },
    [ayahs, currentAudioId, playFrom, surahNumber, toggleAudio],
  );
  const passageActive = playingAyahNumber != null;
  const passagePlaying = passageActive && audioIsPlaying;

  const handleBookmarkAyah = useCallback(
    (surahNum: number, ayahNum: number) => toggleBookmark(surahNum, ayahNum),
    [toggleBookmark],
  );
  const shareAyah = useCallback(
    (
      arabic: string,
      translationText: string,
      surahNum: number,
      ayahNum: number,
      translit?: string,
    ) => {
      void share({
        ...buildAyahSharePayload(arabic, translationText, surahNum, ayahNum, {
          surahName: surah?.nameTransliteration,
          transliteration: translit,
          sectionTitle: t("share.sectionQuran"),
        }),
        shareKey: `${surahNum}:${ayahNum}`,
      });
    },
    [share, surah?.nameTransliteration, t],
  );

  if (!parsed || !surah || ayahs.length === 0) {
    return (
      <>
        <Seo path="/quran/passage" index={false} />
        <ScreenLayout title={t("quran.title")} onBack={() => goBackOrReplace(router, "/quran")}>
          <EmptyState
            icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
            title={t("quran.notFoundTitle")}
            description={t("quran.notFoundDesc")}
          />
        </ScreenLayout>
      </>
    );
  }

  const single = parsed.from === parsed.to;
  const rangeLabel = single
    ? t("quran.passage.ayah", { n: parsed.from })
    : t("quran.passage.range", { from: parsed.from, to: parsed.to });
  const recitePassage = { surah: parsed.surah, ayahStart: parsed.from, ayahEnd: parsed.to };
  const actionAyah = tvActionIndex != null ? ayahs[tvActionIndex] : undefined;
  const actionKey = actionAyah ? `${surahNumber}:${actionAyah.ayah}` : null;

  return (
    <>
      {SnapshotHost}
      <Seo
        path="/quran/passage"
        title={`${surah.nameTransliteration} · ${rangeLabel}`}
        index={false}
      />
      <ScreenLayout
        eyebrow={t("quran.title")}
        title={surah.nameTransliteration}
        subtitle={`${surah.nameEnglish} · ${rangeLabel}`}
        onBack={() => goBackOrReplace(router, "/quran")}
      >
        <View style={[styles.root, { paddingBottom: contentBottomInset }]}>
          <SurahBanner
            nameArabic={surah.nameArabic}
            nameEnglish={surah.nameEnglish}
            revelationPlace={surah.revelationPlace}
            ayahCount={surah.ayahCount}
          />
          <View style={styles.topActions}>
            <Button
              label={passagePlaying ? t("quran.actionPause") : t("quran.passage.play")}
              icon={passagePlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
              accessibilityHint={t("quran.passage.playHint", { ref: rangeLabel })}
              style={styles.topAction}
              preferredFocus={tv}
              onPress={() => {
                if (passageActive) {
                  toggleAudio();
                  return;
                }
                playFrom(0);
              }}
            />
            <ReciteAlongButton passage={recitePassage} style={styles.topAction} />
          </View>

          <AyahFocusTrackerContext.Provider value={ayahFocusRef}>
            <QuranWordStudyProviders
              wordAudioEnabled={showWordByWord}
              playingAyah={playingAyahNumber}
              audioIsPlaying={audioIsPlaying}
              audioIsBuffering={audioIsBuffering}
              activeWordIndex={activeWordIndex}
              wordsByAyah={wordByWordByAyah}
              surah={surahNumber}
            >
              <View testID="quran-passage-ayahs">
                {ayahs.map((ayah, index) => {
                  const key = String(ayah.ayah);
                  const shareKey = `${surahNumber}:${ayah.ayah}`;
                  return (
                    <View key={key}>
                      {index > 0 ? <AyahSeparator /> : null}
                      <AyahRow
                        ayah={ayah}
                        index={index}
                        surahNumber={surahNumber}
                        arabicSize={readingSizes.arabic}
                        translitSize={readingSizes.transliteration}
                        translationSize={readingSizes.translation}
                        hifzStatus={hifzMap[hifzKey(surahNumber, ayah.ayah)]}
                        secondTranslation={
                          showTranslation && secondTranslation ? secondTranslation[key] : undefined
                        }
                        secondTranslationDir={secondaryDir}
                        transliteration={showTransliteration ? transliteration[key] : undefined}
                        translation={showTranslation ? (translation[key] ?? "") : ""}
                        translationDir={translationDir}
                        showWordByWord={showWordByWord}
                        tajweedSegments={showTajweed ? tajweedByAyah[key] : undefined}
                        isBookmarked={bookmarkedSet.has(shareKey)}
                        onPlayAtIndex={playOrToggleAyah}
                        onBookmarkAyah={handleBookmarkAyah}
                        onShareAyah={shareAyah}
                        isSharing={activeShareKey === shareKey}
                        isGesturePending={gesturePendingKey === shareKey}
                        onOpenActions={openAyahActions}
                        expanded={expandedAyah === ayah.ayah}
                        onToggleExpanded={toggleExpanded}
                        actionHandlers={ayahActionHandlers}
                        tvPreferredFocus={false}
                      />
                    </View>
                  );
                })}
              </View>
            </QuranWordStudyProviders>
          </AyahFocusTrackerContext.Provider>

          <Button
            label={t("quran.passage.openFullSurah")}
            accessibilityHint={t("quran.passage.openFullSurahHint", {
              name: surah.nameTransliteration,
              n: parsed.from,
            })}
            variant="ghost"
            trailingIcon={chevron}
            style={styles.fullSurah}
            onPress={() =>
              router.push({
                pathname: "/quran/[surah]",
                params: { surah: String(parsed.surah), ayah: String(parsed.from) },
              })
            }
          />
        </View>
      </ScreenLayout>

      <ReaderEditionSheets
        open={editionSheet}
        onClose={() => setEditionSheet(null)}
        translationId={knownEdition}
        secondaryId={secondaryId}
        tafsirId={activeTafsirId}
      />
      <TafsirAyahSheet
        visible={tafsirAyah != null}
        onClose={() => setTafsirAyah(null)}
        surah={surahNumber}
        ayah={tafsirAyah ?? parsed.from}
        editionName={tafsirEdition?.name ?? t("quran.tafsir")}
        author={tafsirEdition?.author ?? ""}
        text={tafsirAyah != null ? tafsirMap?.[String(tafsirAyah)] : undefined}
        direction={tafsirEdition?.direction ?? "ltr"}
        loading={tafsirLoading}
        offline={tafsirOffline}
        onRetry={retryTafsir}
      />
      {/* TV: Select on an ayah card (phones / web expand "More" inline instead). */}
      <AyahMoreActions
        ayah={actionAyah}
        surahNumber={surahNumber}
        surahName={surah.nameTransliteration}
        surahNameEnglish={surah.nameEnglish}
        locale={ayahActionHandlers.locale}
        translation={translation}
        isBookmarked={actionKey != null && bookmarkedSet.has(actionKey)}
        isPlaying={actionKey != null && audioIsPlaying && currentAudioId === actionKey}
        hifzStatus={actionAyah ? hifzMap[hifzKey(surahNumber, actionAyah.ayah)] : undefined}
        onClose={closeAyahActions}
        onPlay={() => {
          if (tvActionIndex == null) return;
          const index = tvActionIndex;
          setTvActionIndex(null);
          playOrToggleAyah(index);
        }}
        onBookmark={(ayahNum) => void toggleBookmark(surahNumber, ayahNum)}
        onHifz={sheetActions.onHifz}
        onTafsir={sheetActions.onTafsir}
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
      <QuranNotesSheetHost />
    </>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three, width: "100%" },
  topActions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  topAction: { flexGrow: 1, flexBasis: 140 },
  fullSurah: { alignSelf: "center" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/passage");
