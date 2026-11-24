import type { Ayah, TajweedSegment } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import {
  AnnotatedAyahText,
  AyahNoteActions,
  AyahNoteMarker,
} from "@/components/quran/ayah-annotations";
import { HifzActionButton } from "@/components/quran/hifz-action-button";
import { WordByWord } from "@/components/quran/word-by-word";
import { ThemedText } from "@/components/themed-text";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { isPronunciationCheckPlatformAvailable } from "@/lib/quran-pronunciation/availability";
import { pronunciationCheckHref } from "@/lib/quran-pronunciation/entry";
import type { HifzStatus } from "@/stores/hifz-store";
import {
  AyahContinuePill,
  AyahFocusRingIfNeeded,
  AyahPlayButton,
  AyahStudyCard,
} from "./ayah-row-parts";

/**
 * A single ayah card. Memoized so scrolling the virtualized list only re-renders
 * rows whose props actually change (e.g. the playing/highlighted row), not every
 * mounted row on each parent render.
 */
export type AyahRowProps = {
  ayah: Ayah;
  index: number;
  surahNumber: number;
  locale: string;
  transliteration?: string;
  translation: string;
  translationDir: "ltr" | "rtl";
  showWordByWord?: boolean;
  tajweedSegments?: TajweedSegment[];
  highlighted?: boolean;
  isBookmarked: boolean;
  arabicSize: number;
  translitSize: number;
  translationSize: number;
  hifzStatus?: HifzStatus;
  onHifzAyah: (surahNumber: number, ayahNumber: number) => void;
  secondTranslation?: string;
  secondTranslationDir: "ltr" | "rtl";
  onPlayAtIndex: (index: number) => void;
  onBookmarkAyah: (surahNumber: number, ayahNumber: number) => void;
  onShareAyah: (
    arabic: string,
    translation: string,
    surah: number,
    ayah: number,
    transliteration?: string,
  ) => void;
  onOpenTafsir: (ayahNumber: number) => void;
  isSharing: boolean;
  isGesturePending: boolean;
  /** TV only: Select on the card opens the action sheet (inline actions hidden). */
  onOpenActions?: (index: number) => void;
  /** Phones / narrow web: a few inline actions + "More" (the ayah action sheet). */
  compactActions?: boolean;
  tvPreferredFocus?: boolean;
};

export function ayahRowPropsAreEqual(prev: AyahRowProps, next: AyahRowProps): boolean {
  return (
    prev.ayah === next.ayah &&
    prev.index === next.index &&
    prev.surahNumber === next.surahNumber &&
    prev.locale === next.locale &&
    prev.transliteration === next.transliteration &&
    prev.translation === next.translation &&
    prev.translationDir === next.translationDir &&
    prev.showWordByWord === next.showWordByWord &&
    prev.tajweedSegments === next.tajweedSegments &&
    prev.highlighted === next.highlighted &&
    prev.isBookmarked === next.isBookmarked &&
    prev.arabicSize === next.arabicSize &&
    prev.translitSize === next.translitSize &&
    prev.translationSize === next.translationSize &&
    prev.hifzStatus === next.hifzStatus &&
    prev.secondTranslation === next.secondTranslation &&
    prev.secondTranslationDir === next.secondTranslationDir &&
    prev.onHifzAyah === next.onHifzAyah &&
    prev.onPlayAtIndex === next.onPlayAtIndex &&
    prev.onBookmarkAyah === next.onBookmarkAyah &&
    prev.onShareAyah === next.onShareAyah &&
    prev.onOpenTafsir === next.onOpenTafsir &&
    prev.isSharing === next.isSharing &&
    prev.isGesturePending === next.isGesturePending &&
    prev.onOpenActions === next.onOpenActions &&
    prev.compactActions === next.compactActions &&
    prev.tvPreferredFocus === next.tvPreferredFocus
  );
}

export const AyahRow = memo(function AyahRow({
  ayah,
  index,
  surahNumber,
  locale,
  transliteration,
  translation,
  translationDir,
  showWordByWord,
  tajweedSegments,
  highlighted,
  isBookmarked,
  arabicSize,
  translitSize,
  translationSize,
  hifzStatus,
  onHifzAyah,
  secondTranslation,
  secondTranslationDir,
  onPlayAtIndex,
  onBookmarkAyah,
  onShareAyah,
  onOpenTafsir,
  isSharing,
  isGesturePending,
  onOpenActions,
  compactActions = false,
  tvPreferredFocus,
}: AyahRowProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();

  const handlePlay = useCallback(() => onPlayAtIndex(index), [index, onPlayAtIndex]);
  const handleBookmark = useCallback(
    () => onBookmarkAyah(surahNumber, ayah.ayah),
    [ayah.ayah, onBookmarkAyah, surahNumber],
  );
  const handleShare = useCallback(
    () => onShareAyah(ayah.arabic, translation, surahNumber, ayah.ayah, transliteration),
    [ayah.arabic, ayah.ayah, onShareAyah, surahNumber, translation, transliteration],
  );
  const handleTafsir = useCallback(() => onOpenTafsir(ayah.ayah), [ayah.ayah, onOpenTafsir]);
  const handleOpenActions = useCallback(() => onOpenActions?.(index), [index, onOpenActions]);
  const cardActions = Boolean(tv && onOpenActions);
  const handleHifz = useCallback(
    () => onHifzAyah(surahNumber, ayah.ayah),
    [ayah.ayah, onHifzAyah, surahNumber],
  );
  const practiceRouter = useRouter();
  const showPractise = !tv && isPracticeAvailable();
  // "Practise this ayah": straight into a one-ayah session in the saved default mode.
  const handlePractise = useCallback(
    () =>
      practiceRouter.push({
        pathname: "/quran/practice/session",
        params: {
          surah: String(surahNumber),
          from: String(ayah.ayah),
          to: String(ayah.ayah),
          source: "reader",
        },
      }),
    [ayah.ayah, practiceRouter, surahNumber],
  );

  // NF-3.24 "Check my recitation": a one-ayah pronunciation check.
  const showCheck = showPractise && isPronunciationCheckPlatformAvailable();
  const handleCheck = useCallback(
    () => practiceRouter.push(pronunciationCheckHref(surahNumber, ayah.ayah, ayah.ayah, "reader")),
    [ayah.ayah, practiceRouter, surahNumber],
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
      <AyahStudyCard
        surahNumber={surahNumber}
        ayahNumber={ayah.ayah}
        onSelect={cardActions ? handleOpenActions : undefined}
        preferredFocus={cardActions && tvPreferredFocus}
      >
        <View style={[styles.ayahHeader, tv && styles.ayahHeaderTv]}>
          <View style={styles.ayahIdentity}>
            <View style={[styles.ayahBadge, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText
                type="caption"
                numberOfLines={1}
                style={{ color: colors.accentText, textAlign: "center" }}
              >
                {ayah.ayah}
              </ThemedText>
            </View>
            <AyahContinuePill ayahNumber={ayah.ayah} highlighted={highlighted} />
            <AyahNoteMarker surah={surahNumber} ayah={ayah.ayah} ayahText={ayah.arabic} />
          </View>
          {cardActions ? (
            ayah.sajda ? (
              <Pill label="۩" color={colors.accent} background={tokens.accentSoft} />
            ) : null
          ) : (
            <View style={[styles.ayahActions, tv && styles.ayahActionsTv]}>
              {ayah.sajda ? (
                <Pill label="۩" color={colors.accent} background={tokens.accentSoft} />
              ) : null}
              <AyahPlayButton ayahNumber={ayah.ayah} onPlay={handlePlay} />
              {/* Compact rows keep the hifz toggle inline only once it carries a status. */}
              {!compactActions || hifzStatus ? (
                <HifzActionButton status={hifzStatus} onPress={handleHifz} />
              ) : null}
              {showPractise && !compactActions ? (
                <LabeledIconButton
                  name={{ ios: "mic", android: "mic_none", web: "mic_none" }}
                  label={t("quranCompanion.entry.practise")}
                  tintColor={colors.mutedForeground}
                  labelColor={colors.mutedForeground}
                  accessibilityLabel={t("quranCompanion.entry.practiseAyah", { n: ayah.ayah })}
                  onPress={handlePractise}
                />
              ) : null}
              {showCheck && !compactActions ? (
                <LabeledIconButton
                  name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
                  label={t("quranPronunciation.entry.check")}
                  tintColor={colors.mutedForeground}
                  labelColor={colors.mutedForeground}
                  accessibilityLabel={t("quranPronunciation.entry.checkAyah", { n: ayah.ayah })}
                  onPress={handleCheck}
                />
              ) : null}
              <LabeledIconButton
                name={
                  isBookmarked
                    ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                    : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
                }
                label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
                tintColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
                labelColor={isBookmarked ? tokens.status.warning.color : colors.mutedForeground}
                accessibilityLabel={
                  isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")
                }
                accessibilityState={{ selected: isBookmarked }}
                onPress={handleBookmark}
              />
              <AyahNoteActions surah={surahNumber} ayah={ayah.ayah} noteOnly={compactActions} />
              <LabeledIconButton
                name={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
                label={t("quran.actionTafsir")}
                tintColor={colors.mutedForeground}
                labelColor={colors.mutedForeground}
                accessibilityLabel={t("quran.openTafsir")}
                onPress={handleTafsir}
              />
              {compactActions && onOpenActions ? (
                // Progressive disclosure (HIG / M3): the rest of the ayah's
                // actions live in one sheet instead of two extra rows of icons.
                <LabeledIconButton
                  name={{ ios: "ellipsis.circle", android: "more_horiz", web: "more_horiz" }}
                  label={t("quran.actionMore")}
                  tintColor={colors.mutedForeground}
                  labelColor={colors.mutedForeground}
                  accessibilityLabel={t("quran.moreActionsA11y", { n: ayah.ayah })}
                  onPress={handleOpenActions}
                />
              ) : null}
              {compactActions ? null : (
                <LabeledIconButton
                  name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                  label={
                    isGesturePending
                      ? tTv(t, "share.tapToShare", "share.selectToShare")
                      : t("quran.actionShare")
                  }
                  tintColor={colors.mutedForeground}
                  accessibilityLabel={t("quran.shareAyah")}
                  loading={isSharing}
                  loadingLabel={t("share.preparing")}
                  onPress={handleShare}
                />
              )}
              {compactActions ? null : <ContentReportButton contentRef={reportRef} />}
            </View>
          )}
        </View>

        <AnnotatedAyahText
          surah={surahNumber}
          ayah={ayah.ayah}
          text={ayah.arabic}
          tajweedSegments={tajweedSegments}
          fontSize={arabicSize}
          style={styles.arabic}
        />

        {showWordByWord ? (
          <WordByWord
            ayahNumber={ayah.ayah}
            arabicSize={arabicSize}
            translitSize={translitSize}
            glossSize={translationSize}
          />
        ) : null}

        {transliteration ? (
          <ThemedText
            type="small"
            style={[styles.translit, { color: colors.accentText, fontSize: translitSize }]}
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
      </AyahStudyCard>
      <AyahFocusRingIfNeeded ayahNumber={ayah.ayah} highlighted={highlighted} />
    </View>
  );
}, ayahRowPropsAreEqual);

const styles = StyleSheet.create({
  ayahRow: { position: "relative" },
  ayahHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  ayahHeaderTv: {
    alignItems: "flex-start",
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  ayahIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  ayahBadge: {
    minWidth: 36,
    minHeight: 30,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ayahActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  ayahActionsTv: {
    gap: Spacing.two,
  },
  arabic: {},
  translit: { fontStyle: "italic", marginTop: Spacing.three },
  translation: { marginTop: Spacing.two },
  secondTranslation: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rtl: { writingDirection: "rtl" },
});
