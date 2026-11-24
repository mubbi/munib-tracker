import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { formatNoteRef } from "@munib-tracker/shared/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContentReportButton } from "@/components/content-report/content-report-button";
import { HIGHLIGHT_ICON, NOTE_ICON } from "@/components/quran/ayah-annotations";
import { HifzActionButton } from "@/components/quran/hifz-action-button";
import { MyNoteCard } from "@/components/quran/my-note-card";
import { ThemedText } from "@/components/themed-text";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";
import { arabicReadingLayout } from "@/lib/reading-typography";
import type { HifzStatus } from "@/stores/hifz-store";
import { useNotesForAyah } from "@/stores/quran-notes-store";

type AyahActionSheetProps = {
  visible: boolean;
  surah: number;
  ayah: number;
  surahName?: string;
  surahNameEnglish?: string;
  juz?: number;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  secondTranslation?: string;
  translationDir?: "ltr" | "rtl";
  secondTranslationDir?: "ltr" | "rtl";
  arabicSize?: number;
  transliterationSize?: number;
  translationSize?: number;
  isBookmarked: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onClose: () => void;
  hifzStatus?: HifzStatus;
  onHifz?: () => void;
  /** "Practise this ayah" — opens a one-ayah practice session (omit to hide, e.g. on TV). */
  onPractise?: () => void;
  /** NF-3.24 "Check my recitation" — a one-ayah pronunciation check (omit to hide). */
  onCheckRecitation?: () => void;
  onTafsir?: () => void;
  /**
   * NF-3.21 "Note" — open the My-note editor (omit to hide, e.g. on TV: read-only).
   * Called with a note id when the user taps one of the ayah's notes in the sheet.
   */
  onNote?: (noteId?: string) => void;
  /** NF-3.21 "Highlight" — open the 5-swatch picker (omit to hide). */
  onHighlight?: () => void;
  reportRef?: ContentReportReference;
  isSharing?: boolean;
  isGesturePending?: boolean;
};

export function AyahActionSheet({
  visible,
  surah,
  ayah,
  surahName,
  surahNameEnglish,
  juz,
  arabic,
  transliteration,
  translation,
  secondTranslation,
  translationDir = "ltr",
  secondTranslationDir = "ltr",
  arabicSize = 26,
  transliterationSize = 14,
  translationSize = 16,
  isBookmarked,
  isPlaying,
  onPlay,
  onBookmark,
  onShare,
  onClose,
  hifzStatus,
  onHifz,
  onPractise,
  onCheckRecitation,
  onTafsir,
  onNote,
  onHighlight,
  reportRef,
  isSharing = false,
  isGesturePending = false,
}: AyahActionSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const title = surahName ? `${surahName} ${ayah}` : t("quran.ayahRef", { surah, ayah });
  const metaParts = [
    t("quran.ayahRef", { surah, ayah }),
    juz != null ? t("quran.juzN", { n: juz }) : null,
    surahNameEnglish || null,
  ].filter(Boolean);
  const hasBody = Boolean(arabic || transliteration || translation || secondTranslation);
  // Personal notes are shown (read-only here, and on TV) below the ayah — never
  // inside or styled like the tafsir panel.
  const ayahNotes = useNotesForAyah(surah, ayah);
  const writtenNotes = (ayahNotes ?? []).filter((note) => note.body.trim() || note.tags.length);
  const highlighted = (ayahNotes ?? []).some((note) => note.color);

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <View style={styles.header}>
        <ThemedText type="subtitle">{title}</ThemedText>
        {metaParts.length > 0 ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {metaParts.join(" · ")}
          </ThemedText>
        ) : null}
      </View>

      {hasBody ? (
        <View style={[styles.body, { borderTopColor: tokens.hairline }]}>
          {arabic ? (
            <ThemedText type="arabic" style={arabicReadingLayout(arabicSize)}>
              {arabic}
            </ThemedText>
          ) : null}
          {transliteration ? (
            <ThemedText
              type="small"
              style={[styles.translit, { color: colors.accentText, fontSize: transliterationSize }]}
            >
              {transliteration}
            </ThemedText>
          ) : null}
          {translation ? (
            <ThemedText
              type="default"
              style={[
                styles.translation,
                { fontSize: translationSize, lineHeight: translationSize * 1.5 },
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
                {
                  fontSize: translationSize,
                  lineHeight: translationSize * 1.5,
                  borderTopColor: tokens.hairline,
                },
                secondTranslationDir === "rtl" ? styles.rtl : null,
              ]}
            >
              {secondTranslation}
            </ThemedText>
          ) : null}
        </View>
      ) : null}

      {writtenNotes.length > 0 ? (
        <View style={[styles.notes, { borderTopColor: tokens.hairline }]}>
          {writtenNotes.slice(0, 2).map((note) =>
            onNote ? (
              // Tap a note to open it (the peek → "Open note" step of the note hint).
              <PressableScale
                key={note.id}
                haptic="light"
                scaleTo={0.99}
                accessibilityRole="button"
                accessibilityLabel={t("quranNotes.openNote", { ref: formatNoteRef(note) })}
                onPress={() => onNote(note.id)}
              >
                <MyNoteCard note={note} numberOfLines={4} />
              </PressableScale>
            ) : (
              <MyNoteCard key={note.id} note={note} numberOfLines={isTV() ? undefined : 4} />
            ),
          )}
          {writtenNotes.length > 2 ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranNotes.hint.moreNotes", { count: writtenNotes.length - 2 })}
            </ThemedText>
          ) : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        <LabeledIconButton
          name={isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
          label={isPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
          tintColor={colors.accent}
          labelColor={colors.accent}
          background={tokens.accentSoft}
          accessibilityLabel={isPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayah })}
          onPress={onPlay}
        />
        {onHifz ? <HifzActionButton status={hifzStatus} onPress={onHifz} /> : null}
        {onPractise ? (
          <LabeledIconButton
            name={{ ios: "mic", android: "mic_none", web: "mic_none" }}
            label={t("quranCompanion.entry.practise")}
            tintColor={colors.mutedForeground}
            labelColor={colors.mutedForeground}
            accessibilityLabel={t("quranCompanion.entry.practiseAyah", { n: ayah })}
            onPress={onPractise}
          />
        ) : null}
        {onCheckRecitation ? (
          <LabeledIconButton
            name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            label={t("quranPronunciation.entry.check")}
            tintColor={colors.mutedForeground}
            labelColor={colors.mutedForeground}
            accessibilityLabel={t("quranPronunciation.entry.checkAyah", { n: ayah })}
            onPress={onCheckRecitation}
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
          accessibilityLabel={isBookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")}
          accessibilityState={{ selected: isBookmarked }}
          onPress={onBookmark}
        />
        {onNote ? (
          <LabeledIconButton
            name={NOTE_ICON}
            label={t("quranNotes.actionNote")}
            tintColor={writtenNotes.length ? colors.accent : colors.mutedForeground}
            labelColor={writtenNotes.length ? colors.accent : colors.mutedForeground}
            accessibilityLabel={t("quranNotes.actionNoteA11y", { ref: `${surah}:${ayah}` })}
            accessibilityState={{ selected: writtenNotes.length > 0 }}
            onPress={() => onNote()}
          />
        ) : null}
        {onHighlight ? (
          <LabeledIconButton
            name={HIGHLIGHT_ICON}
            label={t("quranNotes.actionHighlight")}
            tintColor={highlighted ? colors.accent : colors.mutedForeground}
            labelColor={highlighted ? colors.accent : colors.mutedForeground}
            accessibilityLabel={t("quranNotes.actionHighlightA11y", { ref: `${surah}:${ayah}` })}
            accessibilityState={{ selected: highlighted }}
            onPress={onHighlight}
          />
        ) : null}
        {onTafsir ? (
          <LabeledIconButton
            name={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
            label={t("quran.actionTafsir")}
            tintColor={colors.mutedForeground}
            labelColor={colors.mutedForeground}
            accessibilityLabel={t("quran.openTafsir")}
            onPress={onTafsir}
          />
        ) : null}
        {/* No system share sheet on TV (phone-only capability). */}
        {!isTV() ? (
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
            onPress={onShare}
          />
        ) : null}
        {reportRef ? <ContentReportButton contentRef={reportRef} /> : null}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  body: {
    gap: Spacing.three,
    marginTop: Spacing.four,
    paddingTop: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  translit: {
    lineHeight: 22,
  },
  translation: {
    lineHeight: 24,
  },
  secondTranslation: {
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rtl: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  notes: {
    gap: Spacing.two,
    marginTop: Spacing.four,
    paddingTop: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
});
