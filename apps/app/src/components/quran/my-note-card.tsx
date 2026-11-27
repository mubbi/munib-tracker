import type { AyahNote } from "@munib-tracker/shared/types";
import { detectTextDirection, formatNoteRef } from "@munib-tracker/shared/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { annotationSwatch } from "@/lib/quran-notes/annotation-colors";
import type { NotePreview } from "@/lib/quran-notes/note-preview";

/** Start-edge colour bar: the note's highlight (≥3:1 on the card) or a neutral hairline. */
function useNoteEdge(color: AyahNote["color"] | null, surface: string): string {
  const { tokens } = useThemeTokens();
  return color ? annotationSwatch(color, surface) : tokens.hairline;
}

/** "My note" card — read-only. Used on TV and inside the ayah action sheet. */
export function MyNoteCard({ note, numberOfLines }: { note: AyahNote; numberOfLines?: number }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const edge = useNoteEdge(note.color, colors.muted);
  const dir = detectTextDirection(note.body);
  return (
    <View
      style={[styles.card, { backgroundColor: colors.muted, borderStartColor: edge }]}
      testID={`my-note-${note.id}`}
    >
      <ThemedText type="caption" style={{ color: colors.accentText }}>
        {t("quranNotes.myNote")} · {formatNoteRef(note)}
      </ThemedText>
      {note.body ? (
        <ThemedText
          type="default"
          numberOfLines={numberOfLines}
          style={dir === "rtl" ? styles.rtl : styles.ltr}
        >
          {note.body}
        </ThemedText>
      ) : (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranNotes.highlightOnly")}
        </ThemedText>
      )}
      {note.tags.length ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {note.tags.map((tag) => `#${tag}`).join("  ")}
        </ThemedText>
      ) : null}
    </View>
  );
}

/**
 * Compact note hint (NF-3.21): title line, a short excerpt and up to three tags
 * — the read-only preview in the desktop hover card, the phone peek and the TV
 * focus card. Always labelled "My note" so it can't be mistaken for tafsir.
 */
export function NotePreviewCard({
  preview,
  surface,
  showRef = true,
}: {
  preview: NotePreview;
  /** Background the card sits on (the colour bar keeps ≥3:1 against it). */
  surface?: string;
  showRef?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const background = surface ?? colors.muted;
  const edge = useNoteEdge(preview.color, background);
  const textDir = preview.dir === "rtl" ? styles.rtl : styles.ltr;
  return (
    <View
      style={[styles.preview, { backgroundColor: background, borderStartColor: edge }]}
      testID={`note-preview-${preview.id}`}
    >
      <ThemedText type="caption" style={{ color: colors.accentText }} numberOfLines={1}>
        {showRef ? `${t("quranNotes.myNote")} · ${preview.ref}` : t("quranNotes.myNote")}
      </ThemedText>
      {preview.title ? (
        <ThemedText type="smallBold" numberOfLines={2} style={textDir}>
          {preview.title}
        </ThemedText>
      ) : (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranNotes.highlightOnly")}
        </ThemedText>
      )}
      {preview.excerpt ? (
        <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2} style={textDir}>
          {preview.excerpt}
        </ThemedText>
      ) : null}
      {preview.tags.length ? (
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {preview.tags.map((tag) => `#${tag}`).join("  ")}
          {preview.moreTags ? `  ${t("quranNotes.hint.moreTags", { n: preview.moreTags })}` : ""}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderStartWidth: 3,
  },
  preview: {
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderStartWidth: 3,
  },
  rtl: { writingDirection: "rtl", textAlign: "right" },
  ltr: { writingDirection: "ltr" },
});
