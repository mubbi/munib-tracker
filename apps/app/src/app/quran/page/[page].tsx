import { QURAN_TOTAL_PAGES } from "@munib-tracker/shared/constants/quran";
import type { QuranReaderLayout } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { isRemoteEdition } from "@/api/quran-remote";
import { AyahActionSheet } from "@/components/quran/ayah-action-sheet";
import { MushafLineRenderer } from "@/components/quran/mushaf-line-renderer";
import { OptionPickerSheet } from "@/components/quran/option-picker-sheet";
import { PageLayoutRenderer } from "@/components/quran/page-layout-renderer";
import { PagePickerSheet } from "@/components/quran/page-picker-sheet";
import PagerView, { type PagerViewHandle } from "@/components/quran/pager-view";
import { QuranReadingToolbar } from "@/components/quran/reading-toolbar";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useRemoteEditionSurah } from "@/hooks/use-quran";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  getAyahsOnPage,
  getBundledEdition,
  getBundledEditions,
  getEditionById,
  getPageCount,
  getPageLayout,
  getPageList,
  getSurahAyahs,
  getSurahByNumber,
  getTransliteration,
  pageToStartAyah,
} from "@/lib/quran";
import { ayahTracks, RECITERS } from "@/lib/quran-audio";
import { resolveReadingFontSizes } from "@/lib/reading-typography";
import { buildAyahSharePayload } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";

const LAYOUT_OPTIONS: Array<{ id: QuranReaderLayout; labelKey: string }> = [
  { id: "page", labelKey: "quran.layoutPage" },
  { id: "mushaf", labelKey: "quran.layoutMushaf" },
  { id: "ayah", labelKey: "quran.layoutAyah" },
];

const LAST_READ_FLUSH_MS = 600;

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

  const { colors, tokens } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const prefs = useQuranPrefs();
  const { fontPrefs } = usePreferences();
  const readingSizes = resolveReadingFontSizes("quran", fontPrefs);
  const { updatePrefs, setLastRead, toggleBookmark, recordProgress } = useQuranActions();
  const bookmarks = useQuranBookmarks();
  const audio = useAudioPlayerContext();
  const pagerRef = useRef<PagerViewHandle>(null);
  const readingProgress = useSharedValue((initialPage - 1) / (getPageCount() - 1));

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [pagePickerOpen, setPagePickerOpen] = useState(false);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [actionAyah, setActionAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const flushRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const layout = prefs.readerLayout === "mushaf" ? "mushaf" : "page";
  const pageStart = pageToStartAyah(currentPage);
  const pageAyahs = useMemo(() => getAyahsOnPage(currentPage), [currentPage]);
  const mushafLayout = useMemo(() => getPageLayout(currentPage), [currentPage]);
  const pageListEntry = useMemo(
    () => getPageList().find((p) => p.page === currentPage),
    [currentPage],
  );

  const primaryEditionId = prefs.preferredTranslationIds[0] ?? "en-pickthall";
  const fallbackEdition =
    getBundledEditions().find((e) => e.kind === "translation") ?? getBundledEditions()[0];
  const selectedEdition = getEditionById(primaryEditionId) ?? fallbackEdition;
  const secondaryId = prefs.secondaryTranslationId;
  const secondaryEdition = secondaryId ? getEditionById(secondaryId) : undefined;

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

  const translationText = remoteActive
    ? (remoteQuery.data ?? bundledTranslation)
    : bundledTranslation;
  const secondTranslationText = secondaryId
    ? secondaryRemoteActive
      ? (secondaryRemoteQuery.data ?? bundledSecond)
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
    setCurrentPage(page);
  }, []);

  const openAyahReader = useCallback(() => {
    const start = pageToStartAyah(currentPage);
    if (!start) return;
    router.push({
      pathname: "/quran/[surah]",
      params: { surah: String(start.surah), ayah: String(start.ayah) },
    });
  }, [currentPage, router]);

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

  const actionBookmarked = actionAyah
    ? bookmarkedSet.has(`${actionAyah.surah}:${actionAyah.ayah}`)
    : false;
  const actionPlaying =
    actionAyah != null && audio.current?.id === `${actionAyah.surah}:${actionAyah.ayah}`;

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
        headerAccessory={
          <QuranReadingToolbar
            visible={toolbarVisible}
            progress={readingProgress}
            onBackToTop={() => jumpToPage(1)}
            reciterName={RECITERS.find((r) => r.dir === prefs.preferredReciterDir)?.name ?? ""}
            translationName={selectedEdition.name}
            secondTranslationName={secondaryEdition?.name ?? t("quran.secondTranslationNone")}
            showTransliteration={prefs.showTransliteration}
            showTranslation={layout === "page" && prefs.showTranslation}
            layoutLabel={t(layout === "mushaf" ? "quran.layoutMushaf" : "quran.layoutPage")}
            onOpenLayout={() => setLayoutPickerOpen(true)}
            onOpenReciter={() => {}}
            onOpenTranslation={() => {}}
            onOpenSecondary={() => {}}
            onToggleTransliteration={() =>
              updatePrefs({ showTransliteration: !prefs.showTransliteration })
            }
            onToggleTranslation={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
          />
        }
      >
        <View style={styles.toolbarRow}>
          <PressableScale
            haptic="light"
            onPress={() => setPagePickerOpen(true)}
            style={[styles.pageChip, { backgroundColor: colors.muted }]}
          >
            <SymbolView
              name={{ ios: "book.pages", android: "menu_book", web: "menu_book" }}
              size={16}
              tintColor={colors.accent}
            />
            <ThemedText type="smallBold">
              {t("quran.pageOf", { page: currentPage, total: QURAN_TOTAL_PAGES })}
            </ThemedText>
          </PressableScale>
          <PressableScale
            haptic="light"
            onPress={() => setLayoutPickerOpen(true)}
            style={[styles.pageChip, { backgroundColor: tokens.accentSoft }]}
          >
            <ThemedText type="smallBold" style={{ color: colors.accent }}>
              {t(layout === "mushaf" ? "quran.layoutMushaf" : "quran.layoutPage")}
            </ThemedText>
          </PressableScale>
          {layout === "mushaf" ? (
            <Pill
              label={t("quran.mushafOnlyHint")}
              color={colors.mutedForeground}
              background={colors.muted}
            />
          ) : null}
        </View>

        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={initialPage - 1}
          onPageSelected={(e) => onPageSelected(e.nativeEvent.position)}
        >
          {Array.from({ length: getPageCount() }, (_, index) => {
            const page = index + 1;
            const ayahs = page === currentPage ? pageAyahs : getAyahsOnPage(page);
            const mushaf = page === currentPage ? mushafLayout : getPageLayout(page);
            return (
              <ScrollView
                key={page}
                contentContainerStyle={[styles.pageContent, { paddingBottom: contentBottomInset }]}
                onScroll={(e) => setToolbarVisible(e.nativeEvent.contentOffset.y > 80)}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
              >
                {layout === "mushaf" ? (
                  <MushafLineRenderer
                    layout={mushaf}
                    page={page}
                    highlightAyah={
                      focusSurah && focusAyah ? { surah: focusSurah, ayah: focusAyah } : undefined
                    }
                    onAyahPress={(surah, ayah) => setActionAyah({ surah, ayah })}
                  />
                ) : (
                  <PageLayoutRenderer
                    ayahs={ayahs}
                    page={page}
                    arabicSize={readingSizes.arabic}
                    transliteration={transliteration}
                    translation={translationText}
                    secondTranslation={secondTranslationText}
                    showTransliteration={prefs.showTransliteration}
                    showTranslation={prefs.showTranslation && !translationLoading}
                    translationDir={translationDir}
                    secondTranslationDir={secondaryDir}
                    highlightAyah={focusAyah}
                    onAyahPress={(surah, ayah) => setActionAyah({ surah, ayah })}
                  />
                )}
              </ScrollView>
            );
          })}
        </PagerView>

        <View
          style={[styles.footer, { borderTopColor: tokens.hairline, paddingBottom: Spacing.two }]}
        >
          <IconButton
            name={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
            accessibilityLabel={t("quran.prevPage")}
            disabled={currentPage <= 1}
            onPress={() => jumpToPage(currentPage - 1)}
          />
          <PressableScale haptic="light" onPress={playFromPage} style={styles.playBtn}>
            <SymbolView
              name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
              size={28}
              tintColor={colors.accent}
            />
          </PressableScale>
          <IconButton
            name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
            accessibilityLabel={t("quran.nextPage")}
            disabled={currentPage >= getPageCount()}
            onPress={() => jumpToPage(currentPage + 1)}
          />
        </View>

        <PagePickerSheet
          visible={pagePickerOpen}
          selectedPage={currentPage}
          onSelect={jumpToPage}
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
        <AyahActionSheet
          visible={actionAyah != null}
          surah={actionAyah?.surah ?? 1}
          ayah={actionAyah?.ayah ?? 1}
          surahName={getSurahByNumber(actionAyah?.surah ?? 1)?.nameTransliteration}
          isBookmarked={actionBookmarked}
          isPlaying={actionPlaying}
          onClose={() => setActionAyah(null)}
          onPlay={() => {
            if (!actionAyah) return;
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
            if (!actionAyah) return;
            const ayahData = getAyahsOnPage(currentPage).find(
              (a) => a.surah === actionAyah.surah && a.ayah === actionAyah.ayah,
            );
            if (!ayahData) return;
            void share({
              ...buildAyahSharePayload(
                ayahData.arabic,
                translationText[String(actionAyah.ayah)] ?? "",
                actionAyah.surah,
                actionAyah.ayah,
                {
                  surahName: getSurahByNumber(actionAyah.surah)?.nameTransliteration,
                  sectionTitle: t("share.sectionQuran"),
                },
              ),
              shareKey: `${actionAyah.surah}:${actionAyah.ayah}`,
            });
          }}
        />
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  pager: { flex: 1 },
  pageContent: { padding: Spacing.three, flexGrow: 1 },
  toolbarRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  pageChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  playBtn: { padding: Spacing.two },
});
