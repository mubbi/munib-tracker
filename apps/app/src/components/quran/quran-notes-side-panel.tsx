import type { AyahNote } from "@munib-tracker/shared/types";
import { formatNoteRef, noteEndAyah, sortNotesByReadingOrder } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MyNoteCard } from "@/components/quran/my-note-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useEnsureQuranNotesLoaded,
  useQuranNotesIndex,
  useQuranReaderViewport,
} from "@/stores/quran-notes-store";

const MAX_IN_PANEL = 20;

/** Window of up to `max` notes that keeps the first in-view note visible (with 2 before it). */
export function panelWindow<T>(items: readonly T[], firstActive: number, max: number): T[] {
  if (items.length <= max || firstActive < 0) return items.slice(0, max);
  const start = Math.max(0, Math.min(firstActive - 2, items.length - max));
  return items.slice(start, start + max);
}

/**
 * Wide-screen reader side pane (NF-3.21): this surah's notes in reading order.
 * Stays in sync with the reader — notes on the ayahs in view are highlighted
 * ("In view") and the list window follows them. Tapping one scrolls the reader
 * to its ayah. Mounted only in the wide tier, next to the reader's filters.
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
  const { colors, tokens } = useThemeTokens();
  const router = useRouter();
  const index = useQuranNotesIndex();
  const viewport = useQuranReaderViewport();
  const notes = useMemo(
    () => sortNotesByReadingOrder(index.live.filter((note) => note.surah === surah)),
    [index.live, surah],
  );
  const inView = (note: AyahNote) =>
    viewport != null &&
    viewport.surah === surah &&
    note.ayah <= viewport.to &&
    noteEndAyah(note) >= viewport.from;
  const firstActive = notes.findIndex(inView);
  const shown = panelWindow(notes, firstActive, MAX_IN_PANEL);

  return (
    <Card>
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
          {shown.map((note) => {
            const active = inView(note);
            return (
              <PressableScale
                key={note.id}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={
                  active
                    ? `${t("quranNotes.goToAyah", { ref: formatNoteRef(note) })}, ${t("quranNotes.hint.inView")}`
                    : t("quranNotes.goToAyah", { ref: formatNoteRef(note) })
                }
                accessibilityState={{ selected: active }}
                onPress={() => onOpenAyah(note.ayah)}
                style={[
                  styles.item,
                  active
                    ? { borderColor: colors.accent, backgroundColor: tokens.accentSoft }
                    : { borderColor: "transparent" },
                ]}
                testID={`notes-panel-item-${note.id}`}
              >
                {active ? (
                  <ThemedText
                    weight="semibold"
                    type="caption"
                    style={[styles.inView, { color: colors.accentText }]}
                  >
                    {t("quranNotes.hint.inView")}
                  </ThemedText>
                ) : null}
                <MyNoteCard note={note} numberOfLines={4} />
              </PressableScale>
            );
          })}
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
  item: { borderWidth: BorderWidth.thick, borderRadius: Radius.md + 2, padding: Spacing.half },
  inView: { paddingHorizontal: Spacing.two, paddingTop: Spacing.half },
});
