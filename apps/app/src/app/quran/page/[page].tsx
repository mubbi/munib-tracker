import { QURAN_TOTAL_PAGES } from "@munib-tracker/shared/constants/quran";
import { getTafsirEdition } from "@munib-tracker/shared/i18n";
import type { QuranReaderLayout } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { hasEditionAyahs, isRemoteEdition } from "@/api/quran-remote";
import { AyahActionSheet } from "@/components/quran/ayah-action-sheet";
import { MushafFontLoading } from "@/components/quran/mushaf-font-loading";
import { MushafLineRenderer } from "@/components/quran/mushaf-line-renderer";
import { OptionPickerSheet } from "@/components/quran/option-picker-sheet";
import { PageLayoutRenderer } from "@/components/quran/page-layout-renderer";
import { PagePickerSheet } from "@/components/quran/page-picker-sheet";
import { PageReaderFooter } from "@/components/quran/page-reader-footer";
import PagerView, { type PagerViewHandle } from "@/components/quran/pager-view";
import { QuranReadingToolbar } from "@/components/quran/reading-toolbar";
import { TafsirPickerSheet } from "@/components/quran/tafsir-picker-sheet";
import { TranslationPickerSheet } from "@/components/quran/translation-picker-sheet";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useRemoteEditionSurah } from "@/hooks/use-quran";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureMushafPageFonts,
  isMushafPageFontReady,
  prefetchQcfFont,
  warmQcfFontsAround,
} from "@/lib/qcf-font-cache";
import {
  getAyahsOnPage,
  getBundledEdition,
  getBundledEditions,
  getEditionById,
  getPageCount,
  getPageForAyah,
  getPageLayout,
  getPageList,
  getSurahAyahs,
  getSurahByNumber,
  getTransliteration,
  pageToStartAyah,
} from "@/lib/quran";
import { ayahTracks, RECITERS } from "@/lib/quran-audio";
import { resolvePreferredTafsirId } from "@/lib/quran-tafsir-options";
import { resolveReadingFontSizes } from "@/lib/reading-typography";
import { buildAyahSharePayload } from "@/lib/share";
import { resolveQuranEditionId } from "@/lib/translation-locale";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";

const LAYOUT_OPTIONS: Array<{ id: QuranReaderLayout; labelKey: string }> = [
  { id: "page", labelKey: "quran.layoutPage" },
  { id: "mushaf", labelKey: "quran.layoutMushaf" },
  { id: "ayah", labelKey: "quran.layoutAyah" },
];

const RECITER_OPTIONS = RECITERS.map((r) => ({ id: r.dir, label: r.name }));

const LAST_READ_FLUSH_MS = 600;
/** Pager siblings kept mounted around the visible page (current ± this window). */
const PAGE_MOUNT_WINDOW = 1;

function pageNeedsBasmala(page: number): boolean {
  return getPageLayout(page).lines.some((line) => line.type === "basmala");
}

export function generateStaticParams(): Array<{ page: string }> {
  return Array.from({ length: getPageCount() }, (_, i) => ({ page: String(i + 1) }));
}

export default function QuranPageReaderScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ page: string; ayah?: string; surah?: string }>();
  const initialPage = Math.min(
    getPageCount(),
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
  );
  const focusSurah = params.surah ? Number(params.surah) : undefined;
  const focusAyah = params.ayah ? Number(params.ayah) : undefined;

  const contentBottomInset = useContentBottomInset();
  const { colors } = useThemeTokens();
  const prefs = useQuranPrefs();
  const { fontPrefs, translationLocale, locale: appLocale } = usePreferences();
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const defaultEditionId = resolveQuranEditionId({ translationLocale, locale: appLocale });
  const { updatePrefs, setLastRead, toggleBookmark, recordProgress } = useQuranActions();
  const bookmarks = useQuranBookmarks();
  const audio = useAudioPlayerContext();
  const pagerRef = useRef<PagerViewHandle>(null);
  const readingProgress = useSharedValue((initialPage - 1) / (getPageCount() - 1));

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagePickerOpen, setPagePickerOpen] = useState(false);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [reciterPickerOpen, setReciterPickerOpen] = useState(false);
  const [translationPickerOpen, setTranslationPickerOpen] = useState(false);
  const [secondaryPickerOpen, setSecondaryPickerOpen] = useState(false);
  const [tafsirPickerOpen, setTafsirPickerOpen] = useState(false);
  const [actionAyah, setActionAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const [mushafFontLoading, setMushafFontLoading] = useState(false);
  const navigatingRef = useRef(false);
  const flushRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const layout = prefs.readerLayout === "mushaf" ? "mushaf" : "page";
  const pageStart = pageToStartAyah(currentPage);
  const pageAyahs = useMemo(() => getAyahsOnPage(currentPage), [currentPage]);
  const mushafLayout = useMemo(() => getPageLayout(currentPage), [currentPage]);
  const currentPageHasBasmala = useMemo(
    () => mushafLayout.lines.some((line) => line.type === "basmala"),
    [mushafLayout],
  );
  const showMushafLoading = layout === "mushaf" && mushafFontLoading;
  const pageListEntry = useMemo(
    () => getPageList().find((p) => p.page === currentPage),
    [currentPage],
  );

  const primaryEditionId = prefs.preferredTranslationIds[0] ?? defaultEditionId;
  const fallbackEdition =
    getBundledEditions().find((e) => e.kind === "translation") ?? getBundledEditions()[0];
  const selectedEdition = getEditionById(primaryEditionId) ?? fallbackEdition;
  const secondaryId = prefs.secondaryTranslationId;
  const secondaryEdition = secondaryId ? getEditionById(secondaryId) : undefined;
  const activeTafsirId = resolvePreferredTafsirId(
    prefs.preferredTafsirId,
    translationLocale,
    appLocale,
  );
  const tafsirEdition = activeTafsirId ? getTafsirEdition(activeTafsirId) : undefined;

  const startSurah = pageStart?.surah ?? pageAyahs[0]?.surah ?? 1;
  const startSurahMeta = getSurahByNumber(startSurah);
  const remoteActive = isRemoteEdition(primaryEditionId);
  const remoteQuery = useRemoteEditionSurah(remoteActive ? primaryEditionId : null, startSurah);
  const secondaryRemoteActive = secondaryId ? isRemoteEdition(secondaryId) : false;
  const secondaryRemoteQuery = useRemoteEditionSurah(
    secondaryRemoteActive && secondaryId ? secondaryId : null,
    startSurah,
  );
  const transliteration = useMemo(() => getTransliteration(startSurah), [startSurah]);
  const bundledTranslation = useMemo(
    () => getBundledEdition(remoteActive ? "en-pickthall" : primaryEditionId, startSurah),
    [primaryEditionId, remoteActive, startSurah],
  );
  const bundledSecond = useMemo(
    () =>
      secondaryId
        ? getBundledEdition(secondaryRemoteActive ? "en-pickthall" : secondaryId, startSurah)
        : {},
    [secondaryId, secondaryRemoteActive, startSurah],
  );

  const translationText =
    remoteActive && hasEditionAyahs(remoteQuery.data) ? remoteQuery.data : bundledTranslation;
  const secondTranslationText = secondaryId
    ? secondaryRemoteActive && hasEditionAyahs(secondaryRemoteQuery.data)
      ? secondaryRemoteQuery.data
      : bundledSecond
    : undefined;
  const translationLoading = remoteActive && remoteQuery.isPending;
  const translationDir = selectedEdition.direction;
  const secondaryDir = secondaryEdition?.direction ?? "ltr";

  const { share, SnapshotHost } = useShareContentCard();
  const bookmarkedSet = useMemo(
    () => new Set(bookmarks.map((b) => `${b.surah}:${b.ayah}`)),
    [bookmarks],
  );

  const persistPage = useCallback(
    (page: number) => {
      const start = pageToStartAyah(page);
      if (!start) return;
      if (flushRef.current) clearTimeout(flushRef.current);
      flushRef.current = setTimeout(() => {
        void recordProgress(start.surah, start.ayah);
        void setLastRead(start.surah, start.ayah, { page });
      }, LAST_READ_FLUSH_MS);
    },
    [recordProgress, setLastRead],
  );

  useEffect(() => {
    if (layout !== "mushaf") return;
    warmQcfFontsAround(currentPage);
  }, [currentPage, layout]);

  // First paint / layout switch / native swipe — ensure the visible page font before showing glyphs.
  useEffect(() => {
    if (layout !== "mushaf") return;
    if (navigatingRef.current) return;
    if (isMushafPageFontReady(currentPage, currentPageHasBasmala)) return;

    let cancelled = false;
    setMushafFontLoading(true);
    void ensureMushafPageFonts(currentPage, currentPageHasBasmala)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setMushafFontLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentPage, currentPageHasBasmala, layout]);

  useEffect(() => {
    persistPage(currentPage);
    readingProgress.value = (currentPage - 1) / Math.max(1, getPageCount() - 1);
  }, [currentPage, persistPage, readingProgress]);

  useEffect(() => {
    return () => {
      if (flushRef.current) clearTimeout(flushRef.current);
    };
  }, []);

  const onPageSelected = useCallback((index: number) => {
    setCurrentPage(index + 1);
  }, []);

  const jumpToPage = useCallback((page: number) => {
    pagerRef.current?.setPage(page - 1);
  }, []);

  const navigateToPage = useCallback(
    async (page: number) => {
      const clamped = Math.min(getPageCount(), Math.max(1, page));
      setCurrentPage(clamped);
      if (layout !== "mushaf") {
        jumpToPage(clamped);
        return;
      }

      prefetchQcfFont(clamped);
      prefetchQcfFont(clamped + 1);
      prefetchQcfFont(clamped - 1);

      const needsBsml = pageNeedsBasmala(clamped);
      const ready = isMushafPageFontReady(clamped, needsBsml);

      navigatingRef.current = true;
      try {
        if (!ready) {
          setMushafFontLoading(true);
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          });
        }

        try {
          await ensureMushafPageFonts(clamped, needsBsml);
        } catch {
          // Fall through — show the page even if the font failed.
        }

        jumpToPage(clamped);
      } finally {
        navigatingRef.current = false;
        if (!ready) {
          setMushafFontLoading(false);
        }
      }
    },
    [jumpToPage, layout],
  );

  const openAyahReader = useCallback(() => {
    const start = pageToStartAyah(currentPage);
    if (!start) return;
    void updatePrefs({ readerLayout: "ayah" });
    router.push({
      pathname: "/quran/[surah]",
      params: { surah: String(start.surah), ayah: String(start.ayah) },
    });
  }, [currentPage, router, updatePrefs]);

  const layoutOptions = LAYOUT_OPTIONS.map((o) => ({ id: o.id, label: t(o.labelKey) }));

  const handleLayoutSelect = (id: string) => {
    const next = id as QuranReaderLayout;
    if (next === "ayah") {
      openAyahReader();
      return;
    }
    void updatePrefs({ readerLayout: next });
  };

  const playFromPage = useCallback(() => {
    const start = pageToStartAyah(currentPage);
    if (!start || !startSurahMeta) return;
    const ayahs = getAyahsOnPage(currentPage).filter((a) => a.surah === start.surah);
    const index = ayahs.findIndex((a) => a.ayah === start.ayah);
    if (index < 0) return;
    audio.play(
      ayahTracks(prefs.preferredReciterDir, startSurahMeta.nameTransliteration, start.surah, ayahs),
      index,
      { sourceHref: `/quran/page/${currentPage}` },
    );
    void setLastRead(start.surah, start.ayah, { page: currentPage, isAudio: true });
  }, [audio, currentPage, prefs.preferredReciterDir, setLastRead, startSurahMeta]);

  /** Persist the choice and reload the active queue when this page's audio is playing. */
  const handleReciterSelect = useCallback(
    (id: string) => {
      void updatePrefs({ preferredReciterDir: id });
      if (id === prefs.preferredReciterDir) return;

      const currentId = audio.current?.id;
      if (!currentId || !/^\d+:\d+$/.test(currentId)) return;
      const colon = currentId.indexOf(":");
      const surahNum = Number(currentId.slice(0, colon));
      const ayahNum = Number(currentId.slice(colon + 1));

      // Full-surah session (started from ayah reader) — keep the whole surah queue.
      if (audio.sourceHref === `/quran/${surahNum}`) {
        const meta = getSurahByNumber(surahNum);
        const allAyahs = getSurahAyahs(surahNum);
        const index = allAyahs.findIndex((a) => a.ayah === ayahNum);
        if (!meta || index < 0) return;
        audio.play(ayahTracks(id, meta.nameTransliteration, surahNum, allAyahs), index, {
          sourceHref: `/quran/${surahNum}`,
        });
        return;
      }

      // Page-scoped session for the visible page.
      if (audio.sourceHref !== `/quran/page/${currentPage}`) return;
      const start = pageToStartAyah(currentPage);
      if (!start || !startSurahMeta || surahNum !== start.surah) return;
      const ayahs = getAyahsOnPage(currentPage).filter((a) => a.surah === start.surah);
      const index = ayahs.findIndex((a) => a.ayah === ayahNum);
      if (index < 0) return;
      audio.play(ayahTracks(id, startSurahMeta.nameTransliteration, start.surah, ayahs), index, {
        sourceHref: `/quran/page/${currentPage}`,
      });
    },
    [audio, currentPage, prefs.preferredReciterDir, startSurahMeta, updatePrefs],
  );

  const actionBookmarked = actionAyah
    ? bookmarkedSet.has(`${actionAyah.surah}:${actionAyah.ayah}`)
    : false;
  const actionPlaying =
    actionAyah != null &&
    audio.current?.id === `${actionAyah.surah}:${actionAyah.ayah}` &&
    audio.isPlaying;

  /** Verse body for the ayah action sheet — always resolved for the selected surah. */
  const actionAyahDetail = useMemo(() => {
    if (!actionAyah) return null;
    const { surah, ayah } = actionAyah;
    const meta = getSurahByNumber(surah);
    const ayahRow =
      pageAyahs.find((a) => a.surah === surah && a.ayah === ayah) ??
      getSurahAyahs(surah).find((a) => a.ayah === ayah);
    if (!ayahRow || !meta) return null;

    const key = String(ayah);
    const translation =
      surah === startSurah
        ? (translationText[key] ?? "")
        : (getBundledEdition(remoteActive ? "en-pickthall" : primaryEditionId, surah)[key] ?? "");
    const second = !secondaryId
      ? undefined
      : surah === startSurah
        ? secondTranslationText?.[key]
        : getBundledEdition(secondaryRemoteActive ? "en-pickthall" : secondaryId, surah)[key];
    const translit =
      surah === startSurah ? (transliteration[key] ?? "") : (getTransliteration(surah)[key] ?? "");

    return {
      arabic: ayahRow.arabic,
      transliteration: translit,
      translation,
      secondTranslation: second,
      surahName: meta.nameTransliteration,
      surahNameEnglish: meta.nameEnglish,
      juz: ayahRow.juz,
    };
  }, [
    actionAyah,
    pageAyahs,
    primaryEditionId,
    remoteActive,
    secondaryId,
    secondaryRemoteActive,
    secondTranslationText,
    startSurah,
    translationText,
    transliteration,
  ]);

  const playingAyah = useMemo(() => {
    const id = audio.current?.id;
    if (!id?.includes(":")) return undefined;
    const [surah, ayah] = id.split(":").map(Number);
    if (!Number.isFinite(surah) || !Number.isFinite(ayah)) return undefined;
    return { surah, ayah };
  }, [audio.current?.id]);

  const resolvePageHighlight = useCallback(
    (pageAyahsList: ReturnType<typeof getAyahsOnPage>) => {
      if (playingAyah) {
        const playingOnPage = pageAyahsList.some(
          (a) => a.surah === playingAyah.surah && a.ayah === playingAyah.ayah,
        );
        if (playingOnPage) return playingAyah;
      }
      if (focusSurah != null && focusAyah != null) {
        const focusOnPage = pageAyahsList.some(
          (a) => a.surah === focusSurah && a.ayah === focusAyah,
        );
        if (focusOnPage) return { surah: focusSurah, ayah: focusAyah };
      }
      return undefined;
    },
    [focusAyah, focusSurah, playingAyah],
  );

  // Follow the playing ayah across pages when audio was started from this reader.
  useEffect(() => {
    const href = audio.sourceHref;
    if (!href?.startsWith("/quran/page/") || !playingAyah) return;
    const page = getPageForAyah(playingAyah.surah, playingAyah.ayah);
    if (page !== currentPage) void navigateToPage(page);
  }, [audio.sourceHref, currentPage, navigateToPage, playingAyah]);

  return (
    <>
      {SnapshotHost}
      <Seo
        path={`/quran/page/${currentPage}`}
        title={t("quran.pageReaderTitle", { page: currentPage, total: QURAN_TOTAL_PAGES })}
        description={t("quran.pageReaderDesc", { page: currentPage })}
      />
      <ScreenLayout
        scrollable={false}
        eyebrow={t("quran.title")}
        title={t("quran.pageN", { n: currentPage })}
        subtitle={
          pageListEntry
            ? `${pageListEntry.surahNameTransliteration} · ${t("quran.juzN", { n: pageListEntry.juz })}`
            : undefined
        }
        onBack={() => goBackOrReplace(router, "/quran")}
      >
        <View style={styles.readerBody}>
          <QuranReadingToolbar
            visible
            progress={readingProgress}
            showBackToTop={layout === "mushaf"}
            onBackToTop={() => void navigateToPage(1)}
            reciterName={RECITERS.find((r) => r.dir === prefs.preferredReciterDir)?.name ?? ""}
            translationName={selectedEdition.name}
            secondTranslationName={secondaryEdition?.name ?? t("quran.secondTranslationNone")}
            tafsirName={tafsirEdition?.name ?? t("quran.tafsirNone")}
            showTransliteration={prefs.showTransliteration}
            showTranslation={layout === "page" && prefs.showTranslation}
            showTranslationControls={layout === "page"}
            layoutLabel={t(layout === "mushaf" ? "quran.layoutMushaf" : "quran.layoutPage")}
            onOpenLayout={() => setLayoutPickerOpen(true)}
            onOpenReciter={() => setReciterPickerOpen(true)}
            onOpenTranslation={() => setTranslationPickerOpen(true)}
            onOpenSecondary={() => setSecondaryPickerOpen(true)}
            onOpenTafsir={() => setTafsirPickerOpen(true)}
            onToggleTransliteration={() =>
              updatePrefs({ showTransliteration: !prefs.showTransliteration })
            }
            onToggleTranslation={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
          />

          <PagerView
            ref={pagerRef}
            style={styles.pager}
            initialPage={initialPage - 1}
            offscreenPageLimit={1}
            onPageSelected={(e) => onPageSelected(e.nativeEvent.position)}
          >
            {Array.from({ length: getPageCount() }, (_, index) => {
              const page = index + 1;
              const mounted = Math.abs(page - currentPage) <= PAGE_MOUNT_WINDOW;
              if (!mounted) {
                return <View key={page} style={styles.pagePlaceholder} />;
              }

              const ayahs = page === currentPage ? pageAyahs : getAyahsOnPage(page);
              const mushaf = page === currentPage ? mushafLayout : getPageLayout(page);
              const pageHighlight = resolvePageHighlight(ayahs);
              return (
                <TvScrollView
                  key={page}
                  style={styles.pageScroll}
                  contentContainerStyle={[
                    styles.pageContent,
                    { paddingBottom: contentBottomInset },
                  ]}
                  showsVerticalScrollIndicator={false}
                >
                  {layout === "mushaf" ? (
                    <MushafLineRenderer
                      layout={mushaf}
                      page={page}
                      arabicSize={readingSizes.arabic}
                      highlightAyah={pageHighlight}
                      onAyahPress={(surah, ayah) => setActionAyah({ surah, ayah })}
                    />
                  ) : (
                    <PageLayoutRenderer
                      ayahs={ayahs}
                      page={page}
                      arabicSize={readingSizes.arabic}
                      transliterationSize={readingSizes.transliteration}
                      translationSize={readingSizes.translation}
                      transliteration={transliteration}
                      translation={translationText}
                      secondTranslation={secondTranslationText}
                      showTransliteration={prefs.showTransliteration}
                      showTranslation={prefs.showTranslation && !translationLoading}
                      translationDir={translationDir}
                      secondTranslationDir={secondaryDir}
                      highlightAyah={pageHighlight}
                      onAyahPress={(surah, ayah) => setActionAyah({ surah, ayah })}
                    />
                  )}
                </TvScrollView>
              );
            })}
          </PagerView>

          <PageReaderFooter
            currentPage={currentPage}
            totalPages={getPageCount()}
            canGoPrev={currentPage > 1}
            canGoNext={currentPage < getPageCount()}
            onPrev={() => void navigateToPage(currentPage - 1)}
            onNext={() => void navigateToPage(currentPage + 1)}
            onPlay={playFromPage}
            onOpenPage={() => setPagePickerOpen(true)}
          />

          {showMushafLoading ? (
            <View
              style={[
                styles.loadingShield,
                { backgroundColor: colors.background, pointerEvents: "auto" },
              ]}
            >
              <MushafFontLoading />
            </View>
          ) : null}
        </View>
      </ScreenLayout>

      {/* Sheets live outside ScreenLayout so they never participate in its column gap. */}
      <PagePickerSheet
        visible={pagePickerOpen}
        selectedPage={currentPage}
        onSelect={(page) => void navigateToPage(page)}
        onClose={() => setPagePickerOpen(false)}
      />
      <OptionPickerSheet
        visible={layoutPickerOpen}
        title={t("quran.readerLayout")}
        options={layoutOptions}
        selectedId={layout}
        onSelect={handleLayoutSelect}
        onClose={() => setLayoutPickerOpen(false)}
      />
      <OptionPickerSheet
        visible={reciterPickerOpen}
        title={t("quran.reciter")}
        options={RECITER_OPTIONS}
        selectedId={prefs.preferredReciterDir}
        onSelect={handleReciterSelect}
        onClose={() => setReciterPickerOpen(false)}
      />
      <TranslationPickerSheet
        visible={translationPickerOpen}
        title={t("quran.translation")}
        selectedId={primaryEditionId}
        preferredLanguages={[translationLocale, appLocale]}
        onSelect={(id) => updatePrefs({ preferredTranslationIds: [id] })}
        onClose={() => setTranslationPickerOpen(false)}
      />
      <TranslationPickerSheet
        visible={secondaryPickerOpen}
        title={t("quran.secondTranslation")}
        allowNone
        selectedId={secondaryId ?? ""}
        preferredLanguages={[translationLocale, appLocale]}
        onSelect={(id) => updatePrefs({ secondaryTranslationId: id || undefined })}
        onClose={() => setSecondaryPickerOpen(false)}
      />
      <TafsirPickerSheet
        visible={tafsirPickerOpen}
        title={t("quran.tafsir")}
        allowNone
        selectedId={activeTafsirId ?? ""}
        preferredLanguages={[translationLocale, appLocale]}
        onSelect={(id) => updatePrefs({ preferredTafsirId: id })}
        onClose={() => setTafsirPickerOpen(false)}
      />
      <AyahActionSheet
        visible={actionAyah != null}
        surah={actionAyah?.surah ?? 1}
        ayah={actionAyah?.ayah ?? 1}
        surahName={actionAyahDetail?.surahName}
        surahNameEnglish={actionAyahDetail?.surahNameEnglish}
        juz={actionAyahDetail?.juz}
        arabic={actionAyahDetail?.arabic}
        transliteration={actionAyahDetail?.transliteration}
        translation={actionAyahDetail?.translation}
        secondTranslation={actionAyahDetail?.secondTranslation}
        translationDir={translationDir}
        secondTranslationDir={secondaryDir}
        arabicSize={readingSizes.arabic}
        transliterationSize={readingSizes.transliteration}
        translationSize={readingSizes.translation}
        isBookmarked={actionBookmarked}
        isPlaying={actionPlaying}
        onClose={() => setActionAyah(null)}
        onPlay={() => {
          if (!actionAyah) return;
          if (audio.current?.id === `${actionAyah.surah}:${actionAyah.ayah}`) {
            audio.toggle();
            return;
          }
          const meta = getSurahByNumber(actionAyah.surah);
          const ayahs = getSurahAyahs(actionAyah.surah);
          const index = ayahs.findIndex((a) => a.ayah === actionAyah.ayah);
          if (index < 0 || !meta) return;
          audio.play(
            ayahTracks(
              prefs.preferredReciterDir,
              meta.nameTransliteration,
              actionAyah.surah,
              ayahs,
            ),
            index,
            { sourceHref: `/quran/page/${currentPage}` },
          );
        }}
        onBookmark={() => actionAyah && void toggleBookmark(actionAyah.surah, actionAyah.ayah)}
        onShare={() => {
          if (!actionAyah || !actionAyahDetail) return;
          void share({
            ...buildAyahSharePayload(
              actionAyahDetail.arabic,
              actionAyahDetail.translation,
              actionAyah.surah,
              actionAyah.ayah,
              {
                surahName: actionAyahDetail.surahName,
                sectionTitle: t("share.sectionQuran"),
              },
            ),
            shareKey: `${actionAyah.surah}:${actionAyah.ayah}`,
          });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  readerBody: { flex: 1, position: "relative" },
  loadingShield: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
  pager: { flex: 1, minHeight: 0 },
  pagePlaceholder: { flex: 1 },
  pageScroll: { flex: 1 },
  pageContent: { padding: Spacing.three, flexGrow: 1 },
});
