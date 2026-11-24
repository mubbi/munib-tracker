import type { TajweedSegment } from "@munib-tracker/shared/types";
import { noteAyahKey } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, type TextStyle, View } from "react-native";

import { TajweedText } from "@/components/quran/tajweed-text";
import { IconButton } from "@/components/ui/icon-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Radius } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { annotationSwatch, annotationTint } from "@/lib/quran-notes/annotation-colors";
import {
  type AyahAnnotation,
  EMPTY_ANNOTATION,
  resolveAyahAnnotation,
  segmentAyahForSpans,
} from "@/lib/quran-notes/reader-annotations";
import { arabicReadingLayout, resolveArabicLineHeight } from "@/lib/reading-typography";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";
import {
  openQuranNoteEditor,
  useNotesForAyah,
  useQuranNotesIndex,
} from "@/stores/quran-notes-store";

/** NF-3.21 reader pieces for one ayah. Each subscribes to its own ayah only. */

export const NOTE_ICON = {
  ios: "note.text",
  android: "sticky_note_2",
  web: "sticky_note_2",
} as const;
export const HIGHLIGHT_ICON = {
  ios: "highlighter",
  android: "format_color_fill",
  web: "format_color_fill",
} as const;

export function useAyahAnnotation(surah: number, ayah: number, ayahText: string): AyahAnnotation {
  const notes = useNotesForAyah(surah, ayah);
  return useMemo(
    () => (notes ? resolveAyahAnnotation(notes, ayah, ayahText) : EMPTY_ANNOTATION),
    [ayah, ayahText, notes],
  );
}

/**
 * Small "My note" glyph next to the ayah number. Tap opens the note (TV: a
 * read-only viewer — the glyph is decorative there because the card itself is
 * the focus target and its action sheet shows the note).
 */
export function AyahNoteMarker({
  surah,
  ayah,
  ayahText,
}: {
  surah: number;
  ayah: number;
  ayahText: string;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const annotation = useAyahAnnotation(surah, ayah, ayahText);
  if (!annotation.hasNote) return null;
  const tint = annotation.color ? annotationSwatch(annotation.color, colors.card) : colors.accent;
  if (isTV()) {
    return (
      <View accessible accessibilityLabel={t("quranNotes.hasNote")} testID="ayah-note-marker">
        <SymbolView name={NOTE_ICON} size={22} tintColor={tint} />
      </View>
    );
  }
  return (
    <View testID="ayah-note-marker">
      <IconButton
        name={NOTE_ICON}
        size={18}
        tintColor={tint}
        haptic="light"
        accessibilityLabel={t("quranNotes.openNote", { ref: `${surah}:${ayah}` })}
        onPress={() =>
          openQuranNoteEditor({
            mode: "note",
            surah,
            ayah,
            noteId: annotation.latestNoteId ?? undefined,
          })
        }
      />
    </View>
  );
}

/** "Note" + "Highlight" buttons for the inline ayah action row (hidden on TV — read-only). */
export function AyahNoteActions({ surah, ayah }: { surah: number; ayah: number }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const notes = useNotesForAyah(surah, ayah);
  if (isTV()) return null;
  const hasText = !!notes?.some((note) => note.body.trim() || note.tags.length);
  const hasColor = !!notes?.some((note) => note.color);
  return (
    <>
      <LabeledIconButton
        name={NOTE_ICON}
        label={t("quranNotes.actionNote")}
        tintColor={hasText ? colors.accent : colors.mutedForeground}
        labelColor={hasText ? colors.accent : colors.mutedForeground}
        accessibilityLabel={t("quranNotes.actionNoteA11y", { ref: `${surah}:${ayah}` })}
        accessibilityState={{ selected: hasText }}
        onPress={() => openQuranNoteEditor({ mode: "note", surah, ayah })}
      />
      <LabeledIconButton
        name={HIGHLIGHT_ICON}
        label={t("quranNotes.actionHighlight")}
        tintColor={hasColor ? colors.accent : colors.mutedForeground}
        labelColor={hasColor ? colors.accent : colors.mutedForeground}
        accessibilityLabel={t("quranNotes.actionHighlightA11y", { ref: `${surah}:${ayah}` })}
        accessibilityState={{ selected: hasColor }}
        onPress={() => openQuranNoteEditor({ mode: "highlight", surah, ayah })}
      />
    </>
  );
}

type AnnotatedAyahTextProps = {
  surah: number;
  ayah: number;
  text: string;
  tajweedSegments?: TajweedSegment[];
  fontSize: number;
  style?: TextStyle;
};

/**
 * The ayah-mode Arabic with its highlight: a whole-ayah tint, or inline word
 * span tints (each word its own text run, so the band follows the glyphs at any
 * size and in RTL). With tajweed colouring on, spans show as an ayah tint so
 * the tajweed runs stay intact.
 */
export const AnnotatedAyahText = memo(function AnnotatedAyahText({
  surah,
  ayah,
  text,
  tajweedSegments,
  fontSize,
  style,
}: AnnotatedAyahTextProps) {
  const { colors, tokens } = useThemeTokens();
  const fontFamily = useArabicFontFamily();
  const arabicFamilyId = useStore(preferencesStore, (s) => s.prefs.fontPrefs.arabic.family);
  const annotation = useAyahAnnotation(surah, ayah, text);
  const spans = annotation.wordSpans;
  const wholeColor =
    annotation.color ?? (tajweedSegments?.length && spans[0] ? spans[0].color : null);

  if (spans.length && !tajweedSegments?.length) {
    const lineHeight = resolveArabicLineHeight(fontSize, arabicFamilyId);
    return (
      <Text
        testID="annotated-ayah-spans"
        style={[
          styles.arabic,
          arabicReadingLayout(fontSize),
          { color: colors.foreground, fontFamily, lineHeight },
          annotation.color
            ? { backgroundColor: annotationTint(annotation.color, tokens.isDark) }
            : null,
          style,
        ]}
      >
        {segmentAyahForSpans(text, spans).map((segment, index) => (
          <Text
            // biome-ignore lint/suspicious/noArrayIndexKey: ordered runs of one fixed ayah
            key={`${index}:${segment.color ?? ""}:${segment.text}`}
            style={
              segment.color
                ? { backgroundColor: annotationTint(segment.color, tokens.isDark) }
                : undefined
            }
          >
            {segment.text}
          </Text>
        ))}
      </Text>
    );
  }

  const body = (
    <TajweedText segments={tajweedSegments} fallback={text} fontSize={fontSize} style={style} />
  );
  if (!wholeColor) return body;
  return (
    <View
      testID="annotated-ayah-tint"
      style={[styles.tint, { backgroundColor: annotationTint(wholeColor, tokens.isDark) }]}
    >
      {body}
    </View>
  );
});

const styles = StyleSheet.create({
  arabic: { writingDirection: "rtl", textAlign: "right", width: "100%" },
  tint: { borderRadius: Radius.md, paddingHorizontal: 6, paddingVertical: 2 },
});

/**
 * Level A page (text layout): one tint per highlighted ayah, keyed `surah:ayah`.
 * Word spans show as the ayah tint here; word-exact spans are drawn in the
 * mushaf (Level B) layout and in ayah mode.
 */
export function usePageAyahTints(
  ayahs: ReadonlyArray<{ surah: number; ayah: number; arabic: string }>,
  enabled: boolean,
): Map<string, string> | null {
  const { tokens } = useThemeTokens();
  const index = useQuranNotesIndex();
  return useMemo(() => {
    if (!enabled || index.live.length === 0) return null;
    const out = new Map<string, string>();
    for (const a of ayahs) {
      const key = noteAyahKey(a.surah, a.ayah);
      const notes = index.byAyah[key];
      if (!notes) continue;
      const annotation = resolveAyahAnnotation(notes, a.ayah, a.arabic);
      const color = annotation.color ?? annotation.wordSpans[0]?.color ?? null;
      if (color) out.set(key, annotationTint(color, tokens.isDark));
    }
    return out.size ? out : null;
  }, [ayahs, enabled, index, tokens.isDark]);
}
