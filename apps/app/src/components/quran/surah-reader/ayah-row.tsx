import type { Ayah, TajweedSegment } from "@munib-tracker/shared/types";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { AnnotatedAyahText, AyahNoteMarker } from "@/components/quran/ayah-annotations";
import { type AyahActionHandlers, AyahInlineActions } from "@/components/quran/ayah-inline-actions";
import { WordByWord } from "@/components/quran/word-by-word";
import { ThemedText } from "@/components/themed-text";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { BorderWidth, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";
import type { HifzStatus } from "@/stores/hifz-store";
import {
  AyahContinuePill,
  AyahFocusRingIfNeeded,
  AyahHifzPill,
  AyahNumberBadge,
  AyahPlayButton,
  AyahSajdaPill,
  AyahStudyCard,
} from "./ayah-row-parts";

/**
 * A single ayah card. Memoized so scrolling the virtualized list only re-renders
 * rows whose props actually change (e.g. the playing/highlighted row), not every
 * mounted row on each parent render.
 *
 * Layout (P5-28 / C-11, C-14): scripture first — Arabic, word by word,
 * transliteration, translation(s) — then one quiet footer row: the ayah's
 * identity ("Ayah N" badge, sajda / hifz / note markers) and, off TV, exactly
 * four actions in a fixed order on every width: **Play · Save · Share · More**.
 * Everything else (tafsir, note, highlight, hifz, practise, check, report)
 * expands inline under the footer when "More" is tapped ("More" turns into
 * "Less"); the screen keeps one ayah expanded at a time (`expanded` +
 * `onToggleExpanded`). Without `actionHandlers`, "More" opens the ayah action
 * sheet instead. On TV the whole card is the focus target and Select opens
 * that sheet.
 */
export type AyahRowProps = {
  ayah: Ayah;
  index: number;
  surahNumber: number;
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
  isSharing: boolean;
  isGesturePending: boolean;
  /** Opens the ayah action sheet (Select on the card on TV; "More" without `actionHandlers`). */
  onOpenActions: (index: number) => void;
  /** Off TV: this row's extra actions are open inline (one ayah at a time, owned by the screen). */
  expanded?: boolean;
  /** Off TV: "More" / "Less" for this ayah (stable; called with the ayah number). */
  onToggleExpanded?: (ayahNumber: number) => void;
  /** Off TV: the screen's stable per-ayah handlers for the inline row (`useAyahActions`). */
  actionHandlers?: AyahActionHandlers;
  tvPreferredFocus?: boolean;
};

/** The inline actions, in the one order every reader uses (C-11). */
export const AYAH_INLINE_ACTIONS = ["play", "save", "share", "more"] as const;

export function ayahRowPropsAreEqual(prev: AyahRowProps, next: AyahRowProps): boolean {
  return (
    prev.ayah === next.ayah &&
    prev.index === next.index &&
    prev.surahNumber === next.surahNumber &&
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
    prev.onPlayAtIndex === next.onPlayAtIndex &&
    prev.onBookmarkAyah === next.onBookmarkAyah &&
    prev.onShareAyah === next.onShareAyah &&
    prev.isSharing === next.isSharing &&
    prev.isGesturePending === next.isGesturePending &&
    prev.onOpenActions === next.onOpenActions &&
    prev.expanded === next.expanded &&
    prev.onToggleExpanded === next.onToggleExpanded &&
    prev.actionHandlers === next.actionHandlers &&
    prev.tvPreferredFocus === next.tvPreferredFocus
  );
}

export const AyahRow = memo(function AyahRow({
  ayah,
  index,
  surahNumber,
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
  secondTranslation,
  secondTranslationDir,
  onPlayAtIndex,
  onBookmarkAyah,
  onShareAyah,
  isSharing,
  isGesturePending,
  onOpenActions,
  expanded = false,
  onToggleExpanded,
  actionHandlers,
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
  const handleOpenActions = useCallback(() => onOpenActions(index), [index, onOpenActions]);
  const inline = !tv && actionHandlers != null && onToggleExpanded != null;
  const handleMore = useCallback(() => {
    if (inline && onToggleExpanded) onToggleExpanded(ayah.ayah);
    else onOpenActions(index);
  }, [ayah.ayah, index, inline, onOpenActions, onToggleExpanded]);
  const showInline = inline && expanded;

  return (
    <View testID={`ayah-row-${ayah.ayah}`} style={styles.ayahRow}>
      <AyahStudyCard
        surahNumber={surahNumber}
        ayahNumber={ayah.ayah}
        onSelect={tv ? handleOpenActions : undefined}
        preferredFocus={tv && tvPreferredFocus}
        readingLabel={tv ? [ayah.arabic, translation].filter(Boolean).join(". ") : undefined}
      >
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

        <View testID="ayah-row-footer" style={[styles.footer, tv && styles.footerTv]}>
          <View style={styles.ayahIdentity}>
            <AyahNumberBadge ayahNumber={ayah.ayah} />
            {ayah.sajda ? <AyahSajdaPill /> : null}
            <AyahContinuePill ayahNumber={ayah.ayah} highlighted={highlighted} />
            {hifzStatus ? <AyahHifzPill status={hifzStatus} /> : null}
            <AyahNoteMarker surah={surahNumber} ayah={ayah.ayah} ayahText={ayah.arabic} />
          </View>
          {tv ? null : (
            <View testID="ayah-row-actions" style={styles.ayahActions}>
              <AyahPlayButton ayahNumber={ayah.ayah} onPlay={handlePlay} />
              <LabeledIconButton
                name={
                  isBookmarked
                    ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
                    : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
                }
                label={isBookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
                tintColor={isBookmarked ? colors.accentText : colors.mutedForeground}
                labelColor={isBookmarked ? colors.accentText : colors.mutedForeground}
                accessibilityLabel={
                  isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")
                }
                accessibilityState={{ selected: isBookmarked }}
                haptic="selection"
                onPress={handleBookmark}
              />
              <LabeledIconButton
                name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                label={
                  isGesturePending
                    ? tTv(t, "share.tapToShare", "share.selectToShare")
                    : t("quran.actionShare")
                }
                tintColor={colors.mutedForeground}
                labelColor={colors.mutedForeground}
                accessibilityLabel={t("quran.shareAyah")}
                loading={isSharing}
                loadingLabel={t("share.preparing")}
                onPress={handleShare}
              />
              {/* Progressive disclosure (HIG / M3): the rest of the ayah's actions
                  expand inline under this row instead of crowding every card. */}
              <LabeledIconButton
                name={
                  showInline
                    ? { ios: "chevron.up.circle", android: "expand_less", web: "expand_less" }
                    : { ios: "ellipsis.circle", android: "more_horiz", web: "more_horiz" }
                }
                label={showInline ? t("quran.actionLess") : t("quran.actionMore")}
                tintColor={showInline ? colors.accentText : colors.mutedForeground}
                labelColor={showInline ? colors.accentText : colors.mutedForeground}
                accessibilityLabel={
                  showInline
                    ? t("quran.lessActionsA11y", { n: ayah.ayah })
                    : t("quran.moreActionsA11y", { n: ayah.ayah })
                }
                onPress={handleMore}
              />
            </View>
          )}
        </View>
        {showInline && actionHandlers ? (
          <AyahInlineActions
            handlers={actionHandlers}
            ayah={ayah.ayah}
            arabic={ayah.arabic}
            translation={translation}
            hifzStatus={hifzStatus}
          />
        ) : null}
      </AyahStudyCard>
      <AyahFocusRingIfNeeded ayahNumber={ayah.ayah} highlighted={highlighted} />
    </View>
  );
}, ayahRowPropsAreEqual);

const styles = StyleSheet.create({
  ayahRow: { position: "relative" },
  arabic: {},
  translit: { fontStyle: "italic", marginTop: Spacing.three },
  translation: { marginTop: Spacing.two },
  secondTranslation: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: BorderWidth.hairline,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  footerTv: {
    marginTop: Spacing.four,
    gap: Spacing.three,
  },
  ayahIdentity: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 1,
    minWidth: 0,
  },
  ayahActions: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginStart: "auto",
    gap: Spacing.one,
  },
  rtl: { writingDirection: "rtl" },
});
