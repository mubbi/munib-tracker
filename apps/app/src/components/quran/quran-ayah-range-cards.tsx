import type { AppLocale } from "@munib-tracker/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { SurahBanner } from "@/components/quran/surah-banner";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Pill } from "@/components/ui/pill";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { ayahTracks } from "@/lib/quran-audio";
import {
  loadQuranAyahCardsRanges,
  type QuranAyahCardData,
  type QuranAyahCardsPayload,
} from "@/lib/quran-ayah-range";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { buildAyahSharePayload } from "@/lib/share";
import { resolveQuranEditionId } from "@/lib/translation-locale";
import type { ZikrQuranRange } from "@/lib/zikr-quran";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import type { AudioTrack } from "@/providers/audio-player-types";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranActions, useQuranBookmarks, useQuranPrefs } from "@/stores/quran-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";

const BUNDLED_EN_FALLBACK = "en-pickthall";

type FlatAyah = {
  surah: number;
  surahName: string;
  ayah: QuranAyahCardData;
  trackIndex: number;
};

type QuranAyahRangeCardsProps = {
  ranges: ZikrQuranRange[];
  /** Continue / player source path (e.g. `/zikr/detail/before_sleep-ikhlas`). */
  sourceHref: string;
  /** Reuse the parent screen's share snapshot host when provided. */
  shareCard?: ReturnType<typeof useShareContentCard>;
};

/**
 * Qur'an ayah cards for one or more short spans (Ayat al-Kursi, last two of
 * Al-Baqarah, the three Quls, …). Matches the surah reader card chrome — play /
 * bookmark / share — without opening the full surah list. Multi-surah bundles
 * render a SurahBanner between sections.
 */
export function QuranAyahRangeCards({
  ranges,
  sourceHref,
  shareCard: shareCardProp,
}: QuranAyahRangeCardsProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const audio = useAudioPlayerContext();
  const prefs = useQuranPrefs();
  const bookmarks = useQuranBookmarks();
  const { toggleBookmark } = useQuranActions();
  const internalShare = useShareContentCard();
  const shareCard = shareCardProp ?? internalShare;
  const { fontPrefs, translationLocale, locale: appLocale } = usePreferences();
  const { showTransliteration, showTranslation } = useReadingTextVisibility();
  const sizes = resolveReadingFontSizes("quran", fontPrefs);
  const editionId = resolveQuranEditionId({ translationLocale, locale: appLocale });

  const rangesKey = ranges.map((r) => `${r.surah}:${r.ayahFrom}-${r.ayahTo}`).join("|");

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

  const { flatAyahs, tracks } = useMemo(() => {
    const sections = data ?? [];
    const flat: FlatAyah[] = [];
    const allTracks: AudioTrack[] = [];

    for (const section of sections) {
      const sectionTracks = ayahTracks(
        prefs.preferredReciterDir,
        section.surahName,
        section.surah,
        section.ayahs.map((a) => ({
          surah: section.surah,
          ayah: a.ayah,
          global: 0,
          arabic: a.arabic,
          juz: 0,
          sajda: a.sajda,
          page: 0,
          hizb: 0,
        })),
        {
          translations: Object.fromEntries(
            section.ayahs.map((a) => [String(a.ayah), a.translation]),
          ),
          lang: translationLocale || "en",
        },
      );
      for (let i = 0; i < section.ayahs.length; i++) {
        const ayah = section.ayahs[i];
        if (!ayah) continue;
        flat.push({
          surah: section.surah,
          surahName: section.surahName,
          ayah,
          trackIndex: allTracks.length + i,
        });
      }
      allTracks.push(...sectionTracks);
    }

    return { flatAyahs: flat, tracks: allTracks };
  }, [data, prefs.preferredReciterDir, translationLocale]);

  const playFrom = useCallback(
    (index: number) => {
      if (tracks.length === 0) return;
      audio.play(tracks, index, { sourceHref });
    },
    [audio, sourceHref, tracks],
  );

  const playOrToggle = useCallback(
    (trackIndex: number, surah: number, ayah: number) => {
      if (audio.current?.id === `${surah}:${ayah}`) {
        audio.toggle();
        return;
      }
      playFrom(trackIndex);
    },
    [audio, playFrom],
  );

  const bookmarkedSet = useMemo(
    () => new Set(bookmarks.map((b) => `${b.surah}:${b.ayah}`)),
    [bookmarks],
  );

  if (isPending || !data?.length) {
    return null;
  }

  const rangeActive =
    audio.current != null && tracks.some((track) => track.id === audio.current?.id);
  const rangePlaying = rangeActive && audio.isPlaying;
  const locale = i18n.language?.split("-")[0] ?? "en";
  const showSectionHeaders = data.length > 1;

  let flatCursor = 0;

  return (
    <View style={styles.root}>
      {shareCardProp ? null : shareCard.SnapshotHost}
      <Button
        label={rangePlaying ? t("quran.actionPause") : t("common.play")}
        icon={rangePlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
        fullWidth
        onPress={() => {
          if (rangeActive) {
            audio.toggle();
            return;
          }
          playFrom(0);
        }}
      />

      {data.map((section) => {
        const sectionStart = flatCursor;
        const sectionRows = flatAyahs.slice(sectionStart, sectionStart + section.ayahs.length);
        flatCursor += section.ayahs.length;

        return (
          <View key={section.surah} style={styles.section}>
            {showSectionHeaders ? <SectionHeader section={section} /> : null}
            {sectionRows.map((row) => {
              const trackId = `${row.surah}:${row.ayah.ayah}`;
              const isActive = audio.current?.id === trackId;
              const isPlaying = isActive && audio.isPlaying;
              const isBookmarked = bookmarkedSet.has(trackId);

              return (
                <RangeAyahCard
                  key={trackId}
                  surah={row.surah}
                  ayah={row.ayah}
                  locale={locale}
                  translationLocale={translationLocale}
                  isActive={isActive}
                  isPlaying={isPlaying}
                  isBookmarked={isBookmarked}
                  arabicSize={sizes.arabic}
                  translitSize={sizes.transliteration}
                  translationSize={sizes.translation}
                  showTransliteration={showTransliteration}
                  showTranslation={showTranslation}
                  accent={colors.accent}
                  accentSoft={tokens.accentSoft}
                  mutedForeground={colors.mutedForeground}
                  warning={tokens.status.warning.color}
                  onPlay={() => playOrToggle(row.trackIndex, row.surah, row.ayah.ayah)}
                  onBookmark={() => void toggleBookmark(row.surah, row.ayah.ayah)}
                  onShare={() => {
                    void shareCard.share({
                      ...buildAyahSharePayload(
                        row.ayah.arabic,
                        row.ayah.translation,
                        row.surah,
                        row.ayah.ayah,
                        {
                          surahName: row.surahName,
                          transliteration: row.ayah.transliteration,
                          sectionTitle: t("share.sectionQuran"),
                        },
                      ),
                      shareKey: trackId,
                    });
                  }}
                  isSharing={shareCard.isSharing(trackId)}
                  playLabel={isPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
                  playA11y={
                    isPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: row.ayah.ayah })
                  }
                  bookmarkLabel={
                    isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")
                  }
                  bookmarkA11y={isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")}
                  shareLabel={
                    shareCard.isGesturePending(trackId)
                      ? t("share.tapToShare")
                      : t("quran.actionShare")
                  }
                  shareA11y={t("quran.shareAyah")}
                  preparingLabel={t("share.preparing")}
                />
              );
            })}
          </View>
        );
      })}
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

function RangeAyahCard({
  surah,
  ayah,
  locale,
  translationLocale,
  isActive,
  isPlaying,
  isBookmarked,
  arabicSize,
  translitSize,
  translationSize,
  showTransliteration,
  showTranslation,
  accent,
  accentSoft,
  mutedForeground,
  warning,
  onPlay,
  onBookmark,
  onShare,
  isSharing,
  playLabel,
  playA11y,
  bookmarkLabel,
  bookmarkA11y,
  shareLabel,
  shareA11y,
  preparingLabel,
}: {
  surah: number;
  ayah: QuranAyahCardData;
  locale: string;
  translationLocale: AppLocale;
  isActive: boolean;
  isPlaying: boolean;
  isBookmarked: boolean;
  arabicSize: number;
  translitSize: number;
  translationSize: number;
  showTransliteration: boolean;
  showTranslation: boolean;
  accent: string;
  accentSoft: string;
  mutedForeground: string;
  warning: string;
  onPlay: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isSharing: boolean;
  playLabel: string;
  playA11y: string;
  bookmarkLabel: string;
  bookmarkA11y: string;
  shareLabel: string;
  shareA11y: string;
  preparingLabel: string;
}) {
  const reportRef = buildContentReportRef(
    "quran_ayah",
    String(ayah.ayah),
    `/quran/${surah}?ayah=${ayah.ayah}`,
    locale,
    {
      parentId: String(surah),
      snapshot: {
        arabic: ayah.arabic,
        translation: ayah.translation,
        reference: `${surah}:${ayah.ayah}`,
      },
    },
  );

  return (
    <Card padding="four" style={isActive ? { borderColor: accent, borderWidth: 1 } : undefined}>
      <View style={styles.ayahHeader}>
        <View style={[styles.ayahBadge, { backgroundColor: accentSoft }]}>
          <ThemedText type="caption" style={{ color: accent }}>
            {ayah.ayah}
          </ThemedText>
        </View>
        <View style={styles.ayahActions}>
          {ayah.sajda ? <Pill label="۩" color={accent} background={accentSoft} /> : null}
          <LabeledIconButton
            name={isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
            label={playLabel}
            tintColor={accent}
            labelColor={accent}
            background={accentSoft}
            accessibilityLabel={playA11y}
            onPress={onPlay}
          />
          <LabeledIconButton
            name={
              isBookmarked
                ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
            }
            label={bookmarkLabel}
            tintColor={isBookmarked ? warning : mutedForeground}
            labelColor={isBookmarked ? warning : mutedForeground}
            accessibilityLabel={bookmarkA11y}
            accessibilityState={{ selected: isBookmarked }}
            onPress={onBookmark}
          />
          <LabeledIconButton
            name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            label={shareLabel}
            tintColor={mutedForeground}
            accessibilityLabel={shareA11y}
            loading={isSharing}
            loadingLabel={preparingLabel}
            onPress={onShare}
          />
          <ContentReportButton contentRef={reportRef} />
        </View>
      </View>

      {ayah.arabic ? (
        <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(arabicSize)]}>
          {ayah.arabic}
        </ThemedText>
      ) : null}

      {showTransliteration && ayah.transliteration ? (
        <ThemedText
          type="small"
          style={[styles.translit, { color: accent, fontSize: translitSize }]}
        >
          {ayah.transliteration}
        </ThemedText>
      ) : null}

      {showTranslation && ayah.translation ? (
        <ThemedText
          type="default"
          style={[styles.translation, translationReadingStyle(translationLocale, translationSize)]}
        >
          {ayah.translation}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.three,
  },
  fallbackTitle: {
    marginTop: Spacing.one,
  },
  ayahHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  ayahBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.one + 2,
  },
  ayahActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.one,
    flex: 1,
  },
  arabic: {
    marginBottom: Spacing.two,
  },
  translit: {
    marginBottom: Spacing.two,
  },
  translation: {
    marginTop: Spacing.one,
  },
});
