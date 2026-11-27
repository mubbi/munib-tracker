import { QURAN_TOTAL_PAGES } from "@munib-tracker/shared/constants/quran";
import { getTafsirEdition } from "@munib-tracker/shared/i18n";
import type { QuranReaderLayout } from "@munib-tracker/shared/types";
import { useQueries } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { fetchRemoteEditionSurah, hasEditionAyahs, isRemoteEdition } from "@/api/quran-remote";
import { AyahActionSheet } from "@/components/quran/ayah-action-sheet";
import { MushafFontLoading } from "@/components/quran/mushaf-font-loading";
import { MushafLineRenderer } from "@/components/quran/mushaf-line-renderer";
import { OptionPickerSheet } from "@/components/quran/option-picker-sheet";
import { PageLayoutRenderer } from "@/components/quran/page-layout-renderer";
import { PagePickerSheet } from "@/components/quran/page-picker-sheet";
import { PageReaderFooter } from "@/components/quran/page-reader-footer";
import PagerView, { type PagerViewHandle } from "@/components/quran/pager-view";
import { QuranNotesSheetHost } from "@/components/quran/quran-notes-sheet-host";
import {
  type ReaderEditionSheet,
  ReaderEditionSheets,
} from "@/components/quran/reader-edition-sheets";
import {
  RECITER_OPTIONS,
  useBookmarkedAyahSet,
  useReaderLayoutOptions,
  useReaderWebKeys,
} from "@/components/quran/reader-shared";
import { QuranReadingToolbar } from "@/components/quran/reading-toolbar";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { MoreInSettingsLink } from "@/components/settings/more-in-settings-link";
import { IconButton } from "@/components/ui/icon-button";
import { RetryCard } from "@/components/ui/retry-card";
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useQuranReadingRecorder } from "@/hooks/use-quran-reading-recorder";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTvKeyDown, type TvHwEvent } from "@/hooks/use-tv-event-handler";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { runAfterSheetDismiss } from "@/lib/platform/run-after-sheet-dismiss";
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
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { isPronunciationCheckPlatformAvailable } from "@/lib/quran-pronunciation/availability";
import { pronunciationCheckHref } from "@/lib/quran-pronunciation/entry";
import { resolvePreferredTafsirId } from "@/lib/quran-tafsir-options";
import { resolveReadingFontSizes } from "@/lib/reading-typography";
import { mushafPageBackward, mushafPageForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";
import { buildAyahSharePayload } from "@/lib/share";
import { resolveQuranEditionId } from "@/lib/translation-locale";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { openQuranNoteEditor } from "@/stores/quran-notes-store";
import { useQuranActions, useQuranPrefs } from "@/stores/quran-store";

const LAST_READ_FLUSH_MS = 600;
/** Pager siblings kept mounted around the visible page (current ± this window). */
const PAGE_MOUNT_WINDOW = 1;
/** Wide windows: centre the leaf at a print-like measure instead of stretching it. */
const WIDE_PAGE_MIN_WIDTH = 768;
const MUSHAF_PAGE_MAX_WIDTH = 680;
const TRANSLATION_PAGE_MAX_WIDTH = 820;
/** Desktop: large page-turn buttons beside the centred leaf. */
const SIDE_TURN_MIN_WIDTH = 1200;
/**
 * Two facing mushaf pages, like an open printed mushaf: landscape windows at least
 * this wide (an unfolded iPhone Duo, landscape tablets, desktop web). The odd page
 * is on the physical right — the mushaf binding, independent of UI language.
 */
const SPREAD_MIN_WIDTH = 900;

function pageNeedsBasmala(page: number): boolean {
  return getPageLayout(page).lines.some((line) => line.type === "basmala");
}

/** Merge per-surah ayah maps into `surah:ayah` keys so multi-surah pages stay correct. */
function mergeSurahTextMaps(
  surahs: number[],
  getMap: (surah: number) => Record<string, string> | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const surah of surahs) {
    const map = getMap(surah);
    if (!map) continue;
    for (const [ayah, text] of Object.entries(map)) {
      out[`${surah}:${ayah}`] = text;
    }
  }
  return out;
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
  const { colors, tokens } = useThemeTokens();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const prefs = useQuranPrefs();
  const { fontPrefs, translationLocale, locale: appLocale } = usePreferences();
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const defaultEditionId = resolveQuranEditionId({ translationLocale, locale: appLocale });
  const { setLastRead, toggleBookmark, recordProgress } = useQuranActions();
  // D40 reading log: counts settled pages + active time while focused/foreground.
  const readingRecorder = useQuranReadingRecorder();
  // Reader controls are shortcuts to Settings › Qur'an (one write path, §4.5.2).
  const updatePrefs = updateQuranPrefs;
  const { showTranslation, showTransliteration, toggleTranslation, toggleTransliteration } =
    useReadingDisplayToggles();
  const bookmarkedSet = useBookmarkedAyahSet();
  const layoutOptions = useReaderLayoutOptions();
  const audio = useAudioPlayerContext();
  const pagerRef = useRef<PagerViewHandle>(null);
  const readingProgress = useSharedValue((initialPage - 1) / (getPageCount() - 1));

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagePickerOpen, setPagePickerOpen] = useState(false);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [reciterPickerOpen, setReciterPickerOpen] = useState(false);
  const [editionSheet, setEditionSheet] = useState<ReaderEditionSheet | null>(null);
  const [actionAyah, setActionAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const [mushafFontLoading, setMushafFontLoading] = useState(false);
  const navigatingRef = useRef(false);
  const flushRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // First paint of Continue reading / deep link: mount only the visible page so
  // NSATSTypesetter is not asked to layout three justified Arabic pages on the
  // same main-thread pass (iOS AppHang). Expand to ±1 after the first frame.
  const [pageMountWindow, setPageMountWindow] = useState(0);
  const tv = isTV();
  /**
   * TV: page whose first (or deep-linked) item should take D-pad focus. Set on
   * mount and after a D-pad page turn — the focused line unmounts with the old
   * page, so focus must be re-homed on the new one.
   */
  const [tvFocus, setTvFocus] = useState<{
    page: number;
    target: { surah: number; ayah: number } | "first";
  } | null>(() =>
    tv
      ? {
          page: initialPage,
          target:
            focusSurah != null && focusAyah != null
              ? { surah: focusSurah, ayah: focusAyah }
              : "first",
        }
      : null,
  );
  /** TV: true while D-pad focus is on a line / ayah block inside the page body. */
  const pageBodyFocusedRef = useRef(false);
  const onPageItemFocus = useCallback(() => {
    pageBodyFocusedRef.current = true;
  }, []);
  const onPageItemBlur = useCallback(() => {
    pageBodyFocusedRef.current = false;
  }, []);

  const layout = prefs.readerLayout === "mushaf" ? "mushaf" : "page";
  // Folding / unfolding (iPhone Duo) resizes the window in place: the pager is keyed
  // on this so it remounts on the right page/spread without losing `currentPage`.
  const spread =
    layout === "mushaf" && !tv && windowWidth >= SPREAD_MIN_WIDTH && windowWidth > windowHeight;
  const pagesPerItem = spread ? 2 : 1;
  const pagerItemCount = Math.ceil(getPageCount() / pagesPerItem);
  const pagerIndexForPage = (page: number) => Math.floor((page - 1) / pagesPerItem);
  /** First (right-hand) page of the spread holding `page`, or `page` itself. */
  const spreadStart = (page: number) => pagerIndexForPage(page) * pagesPerItem + 1;
  // Tablet / desktop (never TV — its pager owns the full overscan-safe width).
  const widePage = !tv && windowWidth >= WIDE_PAGE_MIN_WIDTH;
  const showSideTurns = !tv && windowWidth >= SIDE_TURN_MIN_WIDTH;
  const pageColumnStyle = widePage
    ? {
        width: "100%" as const,
        maxWidth: layout === "mushaf" ? MUSHAF_PAGE_MAX_WIDTH : TRANSLATION_PAGE_MAX_WIDTH,
        alignSelf: "center" as const,
      }
    : null;
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
  const mountedSurahs = useMemo(() => {
    const surahs = new Set<number>();
    const pageCount = getPageCount();
    for (
      let page = currentPage - PAGE_MOUNT_WINDOW;
      page <= currentPage + PAGE_MOUNT_WINDOW;
      page++
    ) {
      if (page < 1 || page > pageCount) continue;
      for (const ayah of getAyahsOnPage(page)) surahs.add(ayah.surah);
    }
    return [...surahs].sort((a, b) => a - b);
  }, [currentPage]);

  const remoteActive = isRemoteEdition(primaryEditionId);
  const secondaryRemoteActive = secondaryId ? isRemoteEdition(secondaryId) : false;

  const remoteQueries = useQueries({
    queries: mountedSurahs.map((surah) => ({
      queryKey: ["quran-edition", "v2", remoteActive ? primaryEditionId : null, surah],
      enabled: remoteActive,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
      networkMode: "offlineFirst" as const,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      queryFn: () => fetchRemoteEditionSurah(primaryEditionId, surah),
    })),
  });
  const secondaryRemoteQueries = useQueries({
    queries: mountedSurahs.map((surah) => ({
      queryKey: ["quran-edition", "v2", secondaryRemoteActive ? secondaryId : null, surah],
      enabled: Boolean(secondaryRemoteActive && secondaryId),
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
      networkMode: "offlineFirst" as const,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      queryFn: () => fetchRemoteEditionSurah(secondaryId as string, surah),
    })),
  });

  const transliteration = useMemo(
    () => mergeSurahTextMaps(mountedSurahs, getTransliteration),
    [mountedSurahs],
  );
  const bundledTranslation = useMemo(
    () =>
      mergeSurahTextMaps(mountedSurahs, (surah) =>
        getBundledEdition(remoteActive ? "en-pickthall" : primaryEditionId, surah),
      ),
    [mountedSurahs, primaryEditionId, remoteActive],
  );
  const bundledSecond = useMemo(
    () =>
      secondaryId
        ? mergeSurahTextMaps(mountedSurahs, (surah) =>
            getBundledEdition(secondaryRemoteActive ? "en-pickthall" : secondaryId, surah),
          )
        : undefined,
    [mountedSurahs, secondaryId, secondaryRemoteActive],
  );

  const remoteTranslation = useMemo(() => {
    if (!remoteActive) return undefined;
    return mergeSurahTextMaps(mountedSurahs, (surah) => {
      const index = mountedSurahs.indexOf(surah);
      const data = remoteQueries[index]?.data;
      return hasEditionAyahs(data) ? data : undefined;
    });
  }, [mountedSurahs, remoteActive, remoteQueries]);

  const remoteSecondTranslation = useMemo(() => {
    if (!secondaryId || !secondaryRemoteActive) return undefined;
    return mergeSurahTextMaps(mountedSurahs, (surah) => {
      const index = mountedSurahs.indexOf(surah);
      const data = secondaryRemoteQueries[index]?.data;
      return hasEditionAyahs(data) ? data : undefined;
    });
  }, [mountedSurahs, secondaryId, secondaryRemoteActive, secondaryRemoteQueries]);

  const translationText = remoteTranslation ?? bundledTranslation;
  const secondTranslationText = secondaryId
    ? (remoteSecondTranslation ?? bundledSecond)
    : undefined;
  const translationLoading = remoteActive && remoteQueries.some((query) => query.isPending);
  // G-04 / C-02: a loading or failed remote translation is shown, never silently hidden.
  const translationFailed =
    remoteActive && !translationLoading && remoteQueries.some((query) => query.isError);
  const retryTranslation = () => {
    for (const query of remoteQueries) {
      if (query.isError) void query.refetch();
    }
  };
  const translationDir = selectedEdition.direction;
  const secondaryDir = secondaryEdition?.direction ?? "ltr";

  const { share, SnapshotHost } = useShareContentCard();

  const persistPage = useCallback(
    (page: number) => {
      const start = pageToStartAyah(page);
      if (!start) return;
      if (flushRef.current) clearTimeout(flushRef.current);
      flushRef.current = setTimeout(() => {
        readingRecorder.notePage(page);
        void recordProgress(start.surah, start.ayah);
        void setLastRead(start.surah, start.ayah, { page });
      }, LAST_READ_FLUSH_MS);
    },
    [readingRecorder, recordProgress, setLastRead],
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
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setPageMountWindow(PAGE_MOUNT_WINDOW);
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (flushRef.current) clearTimeout(flushRef.current);
    };
  }, []);

  const onPageSelected = useCallback(
    (index: number) => {
      setPageMountWindow(PAGE_MOUNT_WINDOW);
      setCurrentPage(index * pagesPerItem + 1);
    },
    [pagesPerItem],
  );

  const jumpToPage = useCallback(
    (page: number) => {
      pagerRef.current?.setPage(Math.floor((page - 1) / pagesPerItem));
    },
    [pagesPerItem],
  );

  // Spread: the facing (left) page needs its QCF glyph font as well.
  useEffect(() => {
    if (!spread) return;
    const facing = Math.floor((currentPage - 1) / 2) * 2 + 2;
    if (facing > getPageCount()) return;
    const needsBsml = pageNeedsBasmala(facing);
    if (isMushafPageFontReady(facing, needsBsml)) return;
    void ensureMushafPageFonts(facing, needsBsml).catch(() => undefined);
  }, [currentPage, spread]);

  const navigateToPage = useCallback(
    async (page: number) => {
      const clamped = Math.min(getPageCount(), Math.max(1, page));
      setPageMountWindow(PAGE_MOUNT_WINDOW);
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

  // TV: D-pad Left/Right turns pages while focus is in the page body (the
  // body is a vertical stack, so there is no horizontal focus move to steal).
  // A mushaf is bound right-to-left: Left = next page, Right = previous —
  // matching the footer, which puts "Next" on the left in every UI direction.
  const turnPageRef = useRef<(delta: 1 | -1) => void>(() => {});
  turnPageRef.current = (delta) => {
    const target = currentPage + delta;
    if (target < 1 || target > getPageCount()) return;
    setTvFocus({ page: target, target: "first" });
    void navigateToPage(target);
  };
  useEffect(() => {
    if (!tv) return;
    // Listener only — never toggle the Menu key here (TvRemoteBridge owns Back).
    const RN = require("react-native") as {
      TVEventHandler?: {
        addListener: (listener: (event: TvHwEvent) => void) => { remove: () => void } | undefined;
      };
    };
    const subscription = RN.TVEventHandler?.addListener?.((event) => {
      if (!pageBodyFocusedRef.current || !isTvKeyDown(event)) return;
      if (event.eventType === "left") turnPageRef.current(1);
      else if (event.eventType === "right") turnPageRef.current(-1);
    });
    return () => subscription?.remove();
  }, [tv]);

  /** Pause/resume page audio, or start this page. */
  const playPausePage = () => {
    if (audio.current && audio.sourceHref?.startsWith("/quran/")) {
      audio.toggle();
      return;
    }
    playFromPage();
  };
  const pageAudioPlaying =
    audio.isPlaying && audio.current != null && audio.sourceHref?.startsWith("/quran/") === true;

  // Web keyboard — mushaf binding like the TV remote and the footer: ← next
  // page, → previous page; Space play/pause. Off while a sheet is open (typing /
  // unfocused route: built in).
  const anySheetOpen =
    pagePickerOpen ||
    layoutPickerOpen ||
    reciterPickerOpen ||
    editionSheet != null ||
    actionAyah != null;
  useReaderWebKeys(
    {
      onArrow: (key) => {
        const target = currentPage + (key === "ArrowLeft" ? 1 : -1);
        if (target >= 1 && target <= getPageCount()) void navigateToPage(target);
      },
      onSpace: playPausePage,
    },
    !anySheetOpen,
  );

  const openAyahReader = useCallback(() => {
    const start = pageToStartAyah(currentPage);
    if (!start) return;
    void updatePrefs({ readerLayout: "ayah" });
    router.push({
      pathname: "/quran/[surah]",
      params: { surah: String(start.surah), ayah: String(start.ayah) },
    });
  }, [currentPage, router]);

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
    [audio, currentPage, prefs.preferredReciterDir, startSurahMeta],
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

    const key = `${surah}:${ayah}`;
    const translation = translationText[key] ?? "";
    const second = secondTranslationText?.[key];
    const translit = transliteration[key] ?? "";

    return {
      arabic: ayahRow.arabic,
      transliteration: translit,
      translation,
      secondTranslation: second,
      surahName: meta.nameTransliteration,
      surahNameEnglish: meta.nameEnglish,
      juz: ayahRow.juz,
    };
  }, [actionAyah, pageAyahs, secondTranslationText, translationText, transliteration]);

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
    if (page === currentPage) return;
    // TV: the focused line unmounts with the old page — re-home focus on the
    // playing ayah only if the reader was in the page body.
    if (tv && pageBodyFocusedRef.current) setTvFocus({ page, target: playingAyah });
    void navigateToPage(page);
  }, [audio.sourceHref, currentPage, navigateToPage, playingAyah, tv]);

  // Page turns move a whole spread when two pages face each other.
  const nextPage = spreadStart(currentPage) + pagesPerItem;
  const prevPage = spreadStart(currentPage) - pagesPerItem;
  const canTurnForward = nextPage <= getPageCount();
  const canTurnBack = prevPage >= 1;

  /** One mushaf / translation page (a spread renders two side by side). */
  const renderReaderPage = (page: number) => {
    const ayahs = page === currentPage ? pageAyahs : getAyahsOnPage(page);
    const mushaf = page === currentPage ? mushafLayout : getPageLayout(page);
    const pageHighlight = resolvePageHighlight(ayahs);
    // Fixed per page (not the live audio highlight) so playback never
    // drags focus out of the toolbar / footer.
    const tvFocusTarget = tvFocus && page === tvFocus.page ? tvFocus.target : undefined;
    return (
      <TvScrollView
        key={page}
        style={styles.pageScroll}
        contentContainerStyle={[
          styles.pageContent,
          pageColumnStyle,
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
            showAnnotations
            // Unicode Arabic for the screen-reader label of each glyph line (G-01).
            ayahs={ayahs}
            onAyahPress={(surah, ayah) => setActionAyah({ surah, ayah })}
            tvFocusTarget={tvFocusTarget}
            onItemFocus={tv ? onPageItemFocus : undefined}
            onItemBlur={tv ? onPageItemBlur : undefined}
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
            showTransliteration={showTransliteration}
            showTranslation={showTranslation && !translationLoading}
            translationDir={translationDir}
            secondTranslationDir={secondaryDir}
            highlightAyah={pageHighlight}
            showAnnotations
            onAyahPress={(surah, ayah) => setActionAyah({ surah, ayah })}
            tvFocusTarget={tvFocusTarget}
            onItemFocus={tv ? onPageItemFocus : undefined}
            onItemBlur={tv ? onPageItemBlur : undefined}
          />
        )}
      </TvScrollView>
    );
  };

  return (
    <>
      {SnapshotHost}
      <Seo
        path={`/quran/page/${currentPage}`}
        title={t("quran.pageReaderTitle", { page: currentPage, total: QURAN_TOTAL_PAGES })}
        description={t("quran.pageReaderDesc", { page: currentPage })}
        // Mushaf glyph-font pages duplicate /quran/{surah}; noindex in the static
        // HTML too (scripts/lib/seo-route-policy.mjs) — keep both in agreement.
        index={false}
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
            showTransliteration={showTransliteration}
            showTranslation={layout === "page" && showTranslation}
            showTranslationControls={layout === "page"}
            layoutLabel={t(layout === "mushaf" ? "quran.layoutMushaf" : "quran.layoutPage")}
            onOpenLayout={() => setLayoutPickerOpen(true)}
            onOpenReciter={() => setReciterPickerOpen(true)}
            onOpenTranslation={() => setEditionSheet("translation")}
            onOpenSecondary={() => setEditionSheet("secondary")}
            onOpenTafsir={() => setEditionSheet("tafsir")}
            onToggleTransliteration={() => void toggleTransliteration()}
            onToggleTranslation={() => void toggleTranslation()}
          />

          {layout === "page" && showTranslation && translationLoading ? (
            <SkeletonGroup
              accessibilityLabel={t("quran.loadingTranslation")}
              style={styles.translationStatus}
            >
              <Skeleton width="45%" height={12} />
            </SkeletonGroup>
          ) : layout === "page" && showTranslation && translationFailed ? (
            <RetryCard
              message={t("quran.reader.translationFailed")}
              offline
              onRetry={retryTranslation}
              style={styles.translationStatus}
            />
          ) : null}

          {/* The font shield covers only the page text (G-27): toolbar, side
              turns and footer stay usable while a mushaf page font loads. */}
          <View style={styles.pagerArea}>
            <TvPageTurnTrap>
              <PagerView
                key={spread ? "spread" : "single"}
                ref={pagerRef}
                style={styles.pager}
                initialPage={pagerIndexForPage(currentPage)}
                offscreenPageLimit={1}
                onPageSelected={(e) => onPageSelected(e.nativeEvent.position)}
              >
                {Array.from({ length: pagerItemCount }, (_, index) => {
                  const firstPage = index * pagesPerItem + 1;
                  const mounted =
                    Math.abs(firstPage - spreadStart(currentPage)) <=
                    pageMountWindow * pagesPerItem;
                  if (!mounted) {
                    return <View key={firstPage} style={styles.pagePlaceholder} />;
                  }
                  if (!spread) return renderReaderPage(firstPage);
                  const facing = firstPage + 1;
                  return (
                    // Physical right-to-left regardless of UI direction: odd page right.
                    <View key={`spread-${firstPage}`} style={styles.spread}>
                      {renderReaderPage(firstPage)}
                      {facing <= getPageCount() ? (
                        renderReaderPage(facing)
                      ) : (
                        <View style={styles.pagePlaceholder} />
                      )}
                    </View>
                  );
                })}
              </PagerView>
            </TvPageTurnTrap>
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

          {showSideTurns ? (
            <>
              {/* Mushaf binding: "next" is always on the physical left (same as
                  the footer + TV remote), so these are deliberately physical. */}
              <View style={[styles.sideTurn, styles.sideTurnLeft, { pointerEvents: "box-none" }]}>
                <IconButton
                  name={mushafPageForward()}
                  accessibilityLabel={t("quran.nextPage")}
                  onPress={() => void navigateToPage(nextPage)}
                  disabled={!canTurnForward}
                  glass
                  hitTarget={48}
                  size={22}
                  wellRadius={24}
                  tintColor={colors.accentText}
                  background={tokens.accentSoft}
                />
              </View>
              <View style={[styles.sideTurn, styles.sideTurnRight, { pointerEvents: "box-none" }]}>
                <IconButton
                  name={mushafPageBackward()}
                  accessibilityLabel={t("quran.prevPage")}
                  onPress={() => void navigateToPage(prevPage)}
                  disabled={!canTurnBack}
                  glass
                  hitTarget={48}
                  size={22}
                  wellRadius={24}
                  tintColor={colors.accentText}
                  background={tokens.accentSoft}
                />
              </View>
            </>
          ) : null}

          <PageReaderFooter
            currentPage={currentPage}
            totalPages={getPageCount()}
            canGoPrev={canTurnBack}
            canGoNext={canTurnForward}
            onPrev={() => void navigateToPage(prevPage)}
            onNext={() => void navigateToPage(nextPage)}
            // Same toggle as Space / the remote: pause what's playing, else start this page.
            onPlay={playPausePage}
            playing={pageAudioPlaying}
            onOpenPage={() => setPagePickerOpen(true)}
          />
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
        // §4.5.6: the reader's options are shortcuts; the full Qur'an group lives in Settings.
        footer={
          <MoreInSettingsLink
            settingId="quran.reader.layout"
            onNavigate={() => setLayoutPickerOpen(false)}
          />
        }
      />
      <OptionPickerSheet
        visible={reciterPickerOpen}
        title={t("quran.reciter")}
        options={RECITER_OPTIONS}
        selectedId={prefs.preferredReciterDir}
        onSelect={handleReciterSelect}
        onClose={() => setReciterPickerOpen(false)}
      />
      <ReaderEditionSheets
        open={editionSheet}
        onClose={() => setEditionSheet(null)}
        translationId={primaryEditionId}
        secondaryId={secondaryId}
        tafsirId={activeTafsirId}
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
        onPractise={
          isPracticeAvailable()
            ? () => {
                if (!actionAyah) return;
                const target = actionAyah;
                setActionAyah(null);
                router.push({
                  pathname: "/quran/practice/session",
                  params: {
                    surah: String(target.surah),
                    from: String(target.ayah),
                    to: String(target.ayah),
                    source: "reader",
                  },
                });
              }
            : undefined
        }
        onCheckRecitation={
          isPronunciationCheckPlatformAvailable()
            ? () => {
                if (!actionAyah) return;
                const target = actionAyah;
                setActionAyah(null);
                router.push(
                  pronunciationCheckHref(target.surah, target.ayah, target.ayah, "reader"),
                );
              }
            : undefined
        }
        // NF-3.21: editing is phone/web only — TV shows notes read-only in this sheet.
        onNote={
          tv
            ? undefined
            : (noteId?: string) => {
                if (!actionAyah) return;
                const target = actionAyah;
                setActionAyah(null);
                runAfterSheetDismiss(() =>
                  openQuranNoteEditor({ mode: "note", ...target, noteId }),
                );
              }
        }
        onHighlight={
          tv
            ? undefined
            : () => {
                if (!actionAyah) return;
                const target = actionAyah;
                setActionAyah(null);
                runAfterSheetDismiss(() => openQuranNoteEditor({ mode: "highlight", ...target }));
              }
        }
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
      <QuranNotesSheetHost />
    </>
  );
}

/**
 * TV: D-pad Left/Right inside the page turn pages (see the TVEventHandler in
 * the screen) — trap them so focus never also jumps to the footer / toolbar.
 * Phone / web: no wrapper, so the pager hierarchy is unchanged.
 */
function TvPageTurnTrap({ children }: { children: ReactNode }) {
  if (!isTV()) return <>{children}</>;
  return (
    <TvFocusGuide trapFocusLeft trapFocusRight style={styles.pager}>
      {children}
    </TvFocusGuide>
  );
}

const styles = StyleSheet.create({
  readerBody: { flex: 1, position: "relative" },
  loadingShield: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
  pager: { flex: 1, minHeight: 0 },
  // Own stacking context so the font shield never rises above the side turns.
  pagerArea: { flex: 1, minHeight: 0, position: "relative", zIndex: 0 },
  translationStatus: { marginHorizontal: Spacing.three, marginTop: Spacing.two },
  pagePlaceholder: { flex: 1 },
  // Two facing pages: odd (first) page on the physical right in every UI language.
  // RN Web rejects the Yoga `direction` prop; it maps `writingDirection` to CSS `direction`.
  spread: {
    flex: 1,
    flexDirection: "row-reverse",
    ...Platform.select({
      web: { writingDirection: "ltr" } as const,
      default: { direction: "ltr" } as const,
    }),
  },
  pageScroll: { flex: 1 },
  pageContent: { padding: Spacing.three, flexGrow: 1 },
  sideTurn: {
    position: "absolute",
    top: "45%",
    zIndex: 5,
  },
  sideTurnLeft: { left: Spacing.two },
  sideTurnRight: { right: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/page/[page]");
