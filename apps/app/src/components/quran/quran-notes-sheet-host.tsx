import type { AnnotationColorId } from "@munib-tracker/shared/types";
import { highlightColorFor } from "@munib-tracker/shared/utils";
import { useIsFocused } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { AnnotationSwatches } from "@/components/quran/annotation-swatches";
import { AyahNoteSheet } from "@/components/quran/ayah-note-sheet";
import { MyNoteCard } from "@/components/quran/my-note-card";
import { QuranNotePeekHost } from "@/components/quran/note-hints";
import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahByNumber } from "@/lib/quran-meta";
import {
  closeQuranNoteEditor,
  useEnsureQuranNotesLoaded,
  useNotesForAyah,
  useQuranNoteEditorTarget,
  useQuranNotesActions,
} from "@/stores/quran-notes-store";

/**
 * One host per screen for the NF-3.21 sheets, driven by `openQuranNoteEditor`
 * and `openQuranNotePeek`. Phones/web get the editor, the highlight picker and
 * the note hints (hover card / peek / long-press actions); TV is read-only —
 * the same request opens a viewer and editing is never offered (remote text entry).
 */
export function QuranNotesSheetHost() {
  // Stack screens stay mounted underneath (native stack and web): only the
  // focused screen's host may answer, or one request opens two sheets.
  const focused = useIsFocused();
  if (!focused) return null;
  return (
    <>
      <QuranNoteEditorHost />
      <QuranNotePeekHost />
    </>
  );
}

function QuranNoteEditorHost() {
  useEnsureQuranNotesLoaded();
  const target = useQuranNoteEditorTarget();
  const tv = isTV();
  if (!target) return null;
  if (tv) {
    return (
      <AyahNotesViewSheet surah={target.surah} ayah={target.ayah} onClose={closeQuranNoteEditor} />
    );
  }
  if (target.mode === "highlight") {
    return (
      <AyahHighlightSheet surah={target.surah} ayah={target.ayah} onClose={closeQuranNoteEditor} />
    );
  }
  return (
    <AyahNoteSheet
      visible
      surah={target.surah}
      ayah={target.ayah}
      noteId={target.noteId}
      fresh={target.fresh}
      onClose={closeQuranNoteEditor}
    />
  );
}

export function AyahHighlightSheet({
  surah,
  ayah,
  onClose,
}: {
  surah: number;
  ayah: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const notes = useNotesForAyah(surah, ayah);
  const { setAyahHighlight } = useQuranNotesActions();
  const current = highlightColorFor(
    notes?.filter((note) => note.ayah === ayah && note.endAyah == null),
  );
  const choose = (color: AnnotationColorId | null) => {
    void setAyahHighlight(surah, ayah, color);
    onClose();
  };
  return (
    <Sheet
      title={t("quranNotes.highlightTitle", { ref: `${surah}:${ayah}` })}
      visible
      onClose={onClose}
      variant="bottom"
    >
      <View style={styles.header}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranNotes.highlightHint")}
        </ThemedText>
      </View>
      <View style={styles.body}>
        <AnnotationSwatches value={current} onChange={choose} />
      </View>
    </Sheet>
  );
}

function AyahNotesViewSheet({
  surah,
  ayah,
  onClose,
}: {
  surah: number;
  ayah: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const notes = useNotesForAyah(surah, ayah) ?? [];
  return (
    <Sheet
      title={`${getSurahByNumber(surah)?.nameTransliteration ?? ""} · ${surah}:${ayah}`}
      visible
      onClose={onClose}
      variant="bottom"
    >
      <View style={styles.header}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranNotes.notTafsir")}
        </ThemedText>
      </View>
      <View style={styles.body}>
        {notes.length ? (
          notes.map((note) => <MyNoteCard key={note.id} note={note} />)
        ) : (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("quranNotes.noneOnAyah")}
          </ThemedText>
        )}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranNotes.tvReadOnly")}
        </ThemedText>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.half },
  body: { marginTop: Spacing.three, gap: Spacing.two },
});
