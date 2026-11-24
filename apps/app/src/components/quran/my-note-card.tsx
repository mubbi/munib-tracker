import type { AyahNote } from "@munib-tracker/shared/types";
import { detectTextDirection, formatNoteRef } from "@munib-tracker/shared/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { annotationSwatch } from "@/lib/quran-notes/annotation-colors";

/** "My note" card — read-only. Used on TV and inside the ayah action sheet. */
export function MyNoteCard({ note, numberOfLines }: { note: AyahNote; numberOfLines?: number }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const dir = detectTextDirection(note.body);
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.muted,
          borderStartColor: note.color
            ? annotationSwatch(note.color, colors.muted)
            : tokens.hairline,
        },
      ]}
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

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderStartWidth: 3,
  },
  rtl: { writingDirection: "rtl", textAlign: "right" },
  ltr: { writingDirection: "ltr" },
});
