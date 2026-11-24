import { sortNotesByReadingOrder } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MyNoteCard } from "@/components/quran/my-note-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useEnsureQuranNotesLoaded, useQuranNotesIndex } from "@/stores/quran-notes-store";

const MAX_IN_PANEL = 20;

/**
 * Wide-screen reader side pane (NF-3.21): this surah's notes in reading order.
 * Tapping one scrolls the reader to its ayah. Mounted only in the wide tier,
 * next to the reader's filters.
 */
export function QuranNotesSidePanel({
  surah,
  onOpenAyah,
}: {
  surah: number;
  onOpenAyah: (ayah: number) => void;
}) {
  useEnsureQuranNotesLoaded();
  const { t } = useTranslation();
  const router = useRouter();
  const index = useQuranNotesIndex();
  const notes = useMemo(
    () => sortNotesByReadingOrder(index.live.filter((note) => note.surah === surah)),
    [index.live, surah],
  );

  return (
    <Card padding="three">
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          {t("quranNotes.title")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranNotes.count", { count: notes.length })}
        </ThemedText>
      </View>
      {notes.length === 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranNotes.panelEmpty")}
        </ThemedText>
      ) : (
        <View style={styles.list}>
          {notes.slice(0, MAX_IN_PANEL).map((note) => (
            <PressableScale
              key={note.id}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("quranNotes.goToAyah", { ref: `${note.surah}:${note.ayah}` })}
              onPress={() => onOpenAyah(note.ayah)}
            >
              <MyNoteCard note={note} numberOfLines={4} />
            </PressableScale>
          ))}
        </View>
      )}
      <Button
        label={t("quranNotes.viewAll")}
        variant="ghost"
        size="sm"
        onPress={() => router.push("/quran/notes")}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  title: { flex: 1 },
  list: { gap: Spacing.two, marginBottom: Spacing.two },
});
