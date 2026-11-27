import type { TajweedSegment } from "@munib-tracker/shared/types";
import { noteAyahKey } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { memo, type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, type TextStyle, View } from "react-native";

import {
  NOTE_WORD_TINT_ALPHA,
  noteHintHandlers,
  noteUnderlineStyle,
  runNoteAction,
  useNoteActions,
  useNoteHintHandlers,
  useNoteHintLabel,
  webHintProps,
} from "@/components/quran/note-hints";
import { TajweedText } from "@/components/quran/tajweed-text";
import { ContextMenu } from "@/components/ui/context-menu";
import { IconButton } from "@/components/ui/icon-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { annotationSwatch, annotationTint } from "@/lib/quran-notes/annotation-colors";
import {
  type AyahAnnotation,
  ayahTintColor,
  EMPTY_ANNOTATION,
  resolveAyahAnnotation,
  segmentAyahForSpans,
} from "@/lib/quran-notes/reader-annotations";
import { arabicReadingLayout, resolveArabicLineHeight } from "@/lib/reading-typography";
import { useIsRTL } from "@/lib/rtl";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";
import {
  openQuranNoteEditor,
  openQuranNotePeek,
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
 * Small "My note" glyph next to the ayah number — the note hint for the ayah.
 * Desktop web: hover / keyboard focus shows a preview card, click opens the
 * note. Phones: tap shows a compact peek, long-press shows the note's actions
 * (iOS: native context menu). TV: decorative — the card itself is the focus
 * target and shows the note inline while focused.
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
  const label = useNoteHintLabel(surah, ayah);
  const handlers = useNoteHintHandlers({ surah, ayah, noteId: annotation.latestNoteId });
  const noteActions = useNoteActions();
  if (!annotation.hasNote) return null;
  const tint = annotation.color ? annotationSwatch(annotation.color, colors.card) : colors.accent;
  if (isTV()) {
    return (
      <View
        accessible
        accessibilityLabel={label ?? t("quranNotes.hasNote")}
        testID="ayah-note-marker"
      >
        <SymbolView name={NOTE_ICON} size={22} tintColor={tint} />
      </View>
    );
  }
  const noteId = annotation.latestNoteId;
  const button = (
    <IconButton
      name={NOTE_ICON}
      size={18}
      tintColor={tint}
      haptic="light"
      accessibilityLabel={label ?? t("quranNotes.openNote", { ref: `${surah}:${ayah}` })}
      accessibilityHint={
        handlers.onPointerEnter ? t("quranNotes.hint.a11yOpen") : t("quranNotes.hint.a11yPeek")
      }
      onPress={handlers.onPress}
      // iOS gets the native context menu below instead.
      onLongPress={Platform.OS === "ios" ? undefined : handlers.onLongPress}
    />
  );
  return (
    <View testID="ayah-note-marker" {...webHintProps(handlers)}>
      {Platform.OS === "ios" && noteId ? (
        <ContextMenu
          title={t("quranNotes.myNote")}
          actions={noteActions.map((action) => ({
            id: action.id,
            title: action.label,
            systemIcon: typeof action.icon === "object" ? action.icon.ios : undefined,
            destructive: action.destructive,
          }))}
          onAction={(id) => {
            const note = { id: noteId, surah, ayah };
            // Delete goes through the confirming action sheet.
            if (id === "delete") openQuranNotePeek({ surah, ayah, noteId, via: "actions" });
            else runNoteAction(id as "open" | "highlight" | "new", note);
          }}
          style={styles.menu}
        >
          {button}
        </ContextMenu>
      ) : (
        button
      )}
    </View>
  );
}

/**
 * "Note" + "Highlight" buttons for the inline ayah action row (hidden on TV —
 * read-only). `noteOnly` (compact phone rows) keeps Highlight in the "More" sheet.
 */
export function AyahNoteActions({
  surah,
  ayah,
  noteOnly = false,
}: {
  surah: number;
  ayah: number;
  noteOnly?: boolean;
}) {
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
      {noteOnly ? null : (
        <LabeledIconButton
          name={HIGHLIGHT_ICON}
          label={t("quranNotes.actionHighlight")}
          tintColor={hasColor ? colors.accent : colors.mutedForeground}
          labelColor={hasColor ? colors.accent : colors.mutedForeground}
          accessibilityLabel={t("quranNotes.actionHighlightA11y", { ref: `${surah}:${ayah}` })}
          accessibilityState={{ selected: hasColor }}
          onPress={() => openQuranNoteEditor({ mode: "highlight", surah, ayah })}
        />
      )}
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
 * size and in RTL). Words with a written note also get an underline in the
 * note's colour (dotted on web, solid + a faint wash on native — see
 * `noteUnderlineStyle`) and the note hint (hover / tap / long-press). A written
 * note on the whole ayah draws a slim bar in the note's colour on the side the
 * Arabic begins (the right edge). With tajweed colouring on, spans show as an
 * ayah tint so the tajweed runs stay intact (and a word note shows as the bar).
 */
export const AnnotatedAyahText = memo(function AnnotatedAyahText({
  surah,
  ayah,
  text,
  tajweedSegments,
  fontSize,
  style,
}: AnnotatedAyahTextProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const fontFamily = useArabicFontFamily();
  const fineHover = useFinePointerHover();
  const uiRtl = useIsRTL();
  const arabicFamilyId = useStore(preferencesStore, (s) => s.prefs.fontPrefs.arabic.family);
  const annotation = useAyahAnnotation(surah, ayah, text);
  const spans = annotation.wordSpans;
  const tajweedOn = Boolean(tajweedSegments?.length);
  const wholeColor = tajweedOn ? ayahTintColor(annotation) : annotation.color;
  // Whole-ayah written note (or, with tajweed on, a word note that can't be underlined).
  const ayahNoted =
    annotation.ayahNoteIds.length > 0 || (tajweedOn && spans.some((span) => span.hasNote));
  const noteBarColor = annotation.color
    ? annotationSwatch(annotation.color, colors.card)
    : colors.accentText;
  const withNoteBar = (node: ReactNode) =>
    ayahNoted ? (
      <View
        testID="annotated-ayah-note"
        style={[
          styles.noteBar,
          // Arabic starts on the right in every UI direction: the bar hugs that edge.
          uiRtl ? styles.noteBarStart : styles.noteBarEnd,
          { borderColor: noteBarColor },
        ]}
      >
        {node}
      </View>
    ) : (
      node
    );

  if (spans.length && !tajweedOn) {
    const lineHeight = resolveArabicLineHeight(fontSize, arabicFamilyId);
    const tv = isTV();
    return withNoteBar(
      <Text
        testID="annotated-ayah-spans"
        accessibilityLanguage="ar"
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
        {segmentAyahForSpans(text, spans).map((segment, index) => {
          const key = `${index}:${segment.color ?? ""}:${segment.noteId ?? ""}:${segment.text}`;
          const tint = segment.color
            ? { backgroundColor: annotationTint(segment.color, tokens.isDark) }
            : null;
          if (!segment.noteId || tv) {
            return (
              <Text key={key} style={tint ?? undefined}>
                {segment.text}
              </Text>
            );
          }
          const handlers = noteHintHandlers({ surah, ayah, noteId: segment.noteId }, fineHover);
          const markColor = segment.color
            ? annotationSwatch(segment.color, colors.card)
            : colors.accentText;
          const underline = noteUnderlineStyle(markColor);
          // Native underlines are hairline-thin under Arabic: a faint wash keeps
          // un-highlighted noted words findable at a glance.
          const wash =
            !tint && Platform.OS !== "web"
              ? { backgroundColor: withAlpha(markColor, NOTE_WORD_TINT_ALPHA) }
              : null;
          return (
            <Text
              key={key}
              testID={`noted-words-${segment.noteId}`}
              // Stays a nested span (no role) — a <button> would split Arabic joining on web.
              accessibilityHint={
                fineHover ? t("quranNotes.hint.a11yOpen") : t("quranNotes.hint.a11yPeek")
              }
              suppressHighlighting
              onPress={handlers.onPress}
              onLongPress={handlers.onLongPress}
              {...webHintProps(handlers, { keyboard: true })}
              style={[tint, wash, underline, Platform.OS === "web" ? styles.webNoted : null]}
            >
              {segment.text}
            </Text>
          );
        })}
      </Text>,
    );
  }

  const body = (
    <TajweedText segments={tajweedSegments} fallback={text} fontSize={fontSize} style={style} />
  );
  if (!wholeColor) return withNoteBar(body);
  return withNoteBar(
    <View
      testID="annotated-ayah-tint"
      style={[styles.tint, { backgroundColor: annotationTint(wholeColor, tokens.isDark) }]}
    >
      {body}
    </View>,
  );
});

const styles = StyleSheet.create({
  arabic: { writingDirection: "rtl", textAlign: "right", width: "100%" },
  tint: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: Spacing.half,
  },
  menu: { alignSelf: "auto", width: "auto" },
  noteBar: { paddingVertical: Spacing.half },
  // Physical right in both UI directions (logical end in LTR, start in RTL).
  noteBarEnd: { borderEndWidth: BorderWidth.thick, paddingEnd: Spacing.two },
  noteBarStart: { borderStartWidth: BorderWidth.thick, paddingStart: Spacing.two },
  webNoted: {
    cursor: "pointer",
    // Keep the run inline so Arabic letters stay joined across it.
    display: "inline",
  } as unknown as TextStyle,
});

export type PageAyahHint = {
  /** Highlight tint for the ayah (whole ayah or its first coloured span), or null. */
  tint: string | null;
  /** The ayah has a written note: underline it and show the hint. */
  noteId: string | null;
  /** Underline colour (the note's colour ≥3:1, or accent text). */
  underline: string | null;
};

/**
 * Level A page (text layout): what each annotated ayah shows, keyed `surah:ayah`
 * — one tint per highlighted ayah (word spans show as the ayah tint here;
 * word-exact spans are drawn in the mushaf (Level B) layout and in ayah mode),
 * and a "has note" underline for ayahs with a written note. Memoised off the
 * notes index: unannotated pages return null and render exactly as before.
 */
export function usePageAyahHints(
  ayahs: ReadonlyArray<{ surah: number; ayah: number; arabic: string }>,
  enabled: boolean,
): Map<string, PageAyahHint> | null {
  const { colors, tokens } = useThemeTokens();
  const index = useQuranNotesIndex();
  return useMemo(() => {
    if (!enabled || index.live.length === 0) return null;
    const out = new Map<string, PageAyahHint>();
    for (const a of ayahs) {
      const key = noteAyahKey(a.surah, a.ayah);
      const notes = index.byAyah[key];
      if (!notes) continue;
      const annotation = resolveAyahAnnotation(notes, a.ayah, a.arabic);
      const color = ayahTintColor(annotation);
      const noteId = annotation.hasNote ? annotation.latestNoteId : null;
      if (!color && !noteId) continue;
      out.set(key, {
        tint: color ? annotationTint(color, tokens.isDark) : null,
        noteId,
        underline: noteId
          ? color
            ? annotationSwatch(color, colors.card)
            : colors.accentText
          : null,
      });
    }
    return out.size ? out : null;
  }, [ayahs, colors.accentText, colors.card, enabled, index, tokens.isDark]);
}
