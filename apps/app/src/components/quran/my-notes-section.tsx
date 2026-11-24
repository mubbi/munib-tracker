import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { NOTE_ICON } from "@/components/quran/ayah-annotations";
import { MyNoteCard } from "@/components/quran/my-note-card";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useEnsureQuranNotesLoaded, useQuranNotesIndex } from "@/stores/quran-notes-store";

const LATEST = 5;

/** Bookmarks hub "My notes" (NF-3.21): the five most recently edited notes. Hidden when empty. */
export function MyNotesSection() {
  useEnsureQuranNotesLoaded();
  const { t } = useTranslation();
  const router = useRouter();
  const { live } = useQuranNotesIndex();
  if (live.length === 0) return null;
  return (
    <Card padding="three">
      <SectionHeader title={t("quranNotes.title")} icon={NOTE_ICON} />
      <View style={styles.list}>
        {live.slice(0, LATEST).map((note) => (
          <PressableScale
            key={note.id}
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("quranNotes.goToAyah", { ref: `${note.surah}:${note.ayah}` })}
            onPress={() =>
              router.push({
                pathname: "/quran/[surah]",
                params: { surah: String(note.surah), ayah: String(note.ayah) },
              })
            }
          >
            <MyNoteCard note={note} numberOfLines={3} />
          </PressableScale>
        ))}
        <NavRow
          icon={NOTE_ICON}
          label={t("quranNotes.viewAll")}
          count={live.length}
          onPress={() => router.push("/quran/notes")}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, marginTop: Spacing.three },
});
