import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContentReportButton } from "@/components/content-report/content-report-button";
import { AyahNoteActions } from "@/components/quran/ayah-annotations";
import { HifzActionButton } from "@/components/quran/hifz-action-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { BorderWidth, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildContentReportRef } from "@/lib/content-report-ref";
import type { HifzStatus } from "@/stores/hifz-store";

/**
 * Per-ayah handlers for the actions behind an ayah card's "More": the same set
 * the TV action sheet offers. One stable object per screen (see
 * `useAyahActions`), so memoised ayah rows never re-render because of it.
 * Practise / check recitation are `undefined` where the feature is unavailable.
 */
export type AyahActionHandlers = {
  surahNumber: number;
  /** UI language (report snapshot locale). */
  locale: string;
  onTafsir: (ayah: number) => void;
  onHifz: (ayah: number) => void;
  onPractise?: (ayah: number) => void;
  onCheckRecitation?: (ayah: number) => void;
  /** Opens the note editor (optionally on one existing note). */
  onNote: (ayah: number, noteId?: string) => void;
  onHighlight: (ayah: number) => void;
};

/** The content-report reference for one ayah (reader deep link + text snapshot). */
export function ayahReportRef(
  surah: number,
  ayah: { ayah: number; arabic: string },
  translation: string,
  locale: string,
): ContentReportReference {
  return buildContentReportRef(
    "quran_ayah",
    String(ayah.ayah),
    `/quran/${surah}?ayah=${ayah.ayah}`,
    locale,
    {
      parentId: String(surah),
      snapshot: {
        arabic: ayah.arabic,
        translation,
        reference: `${surah}:${ayah.ayah}`,
      },
    },
  );
}

/** Stable order of the inline "More" row (after Play · Save · Share). */
export const AYAH_MORE_ACTIONS = [
  "tafsir",
  "note",
  "highlight",
  "hifz",
  "practise",
  "check",
  "report",
] as const;

/**
 * The rest of an ayah's actions, expanded inline under the card's footer when
 * "More" is tapped (phones / web — TV keeps the action sheet): Tafsir · Note ·
 * Highlight · Hifz · Practise · Check recitation · Report, in the same
 * labelled-icon style as Play · Save · Share. Wraps onto a second line on
 * narrow cards.
 */
export const AyahInlineActions = memo(function AyahInlineActions({
  handlers,
  ayah,
  arabic,
  translation,
  hifzStatus,
}: {
  handlers: AyahActionHandlers;
  ayah: number;
  arabic: string;
  /** Shown translation (report snapshot). */
  translation: string;
  hifzStatus?: HifzStatus;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { surahNumber, locale } = handlers;
  const reportRef = useMemo(
    () => ayahReportRef(surahNumber, { ayah, arabic }, translation, locale),
    [arabic, ayah, locale, surahNumber, translation],
  );
  const { onTafsir, onHifz, onPractise, onCheckRecitation } = handlers;

  return (
    <View testID="ayah-inline-actions" style={[styles.row, { borderTopColor: tokens.hairline }]}>
      <LabeledIconButton
        name={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
        label={t("quran.actionTafsir")}
        tintColor={colors.mutedForeground}
        labelColor={colors.mutedForeground}
        accessibilityLabel={t("quran.openTafsir")}
        onPress={() => onTafsir(ayah)}
      />
      <AyahNoteActions surah={surahNumber} ayah={ayah} />
      <HifzActionButton status={hifzStatus} onPress={() => onHifz(ayah)} />
      {onPractise ? (
        <LabeledIconButton
          name={{ ios: "mic", android: "mic_none", web: "mic_none" }}
          label={t("quranCompanion.entry.practise")}
          tintColor={colors.mutedForeground}
          labelColor={colors.mutedForeground}
          accessibilityLabel={t("quranCompanion.entry.practiseAyah", { n: ayah })}
          onPress={() => onPractise(ayah)}
        />
      ) : null}
      {onCheckRecitation ? (
        <LabeledIconButton
          name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
          label={t("quranPronunciation.entry.check")}
          tintColor={colors.mutedForeground}
          labelColor={colors.mutedForeground}
          accessibilityLabel={t("quranPronunciation.entry.checkAyah", { n: ayah })}
          onPress={() => onCheckRecitation(ayah)}
        />
      ) : null}
      <ContentReportButton contentRef={reportRef} />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: Spacing.one,
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: BorderWidth.hairline,
  },
});
