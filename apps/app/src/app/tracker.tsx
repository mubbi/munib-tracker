import { PRAYER_NAMES, TRACKER_CATEGORIES } from "@munib-tracker/shared/constants";
import type { TrackerCategory } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { SectionHeader } from "@/components/ui/section-header";
import { TrackerRow } from "@/components/ui/tracker-row";
import { Spacing } from "@/constants/theme";

const categoryItems: Record<TrackerCategory, string[]> = {
  salah: [...PRAYER_NAMES],
  dhikr: ["Morning adhkar", "Evening adhkar", "Istighfar"],
  qadha: ["Missed Fajr", "Missed Dhuhr", "Missed Asr"],
};

const categoryIcons = {
  salah: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  dhikr: { ios: "heart.fill", android: "favorite", web: "favorite" },
  qadha: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
} as const satisfies Record<TrackerCategory, SymbolViewProps["name"]>;

export default function TrackerScreen() {
  return (
    <ScreenLayout title="Tracker" subtitle="Log salah, dhikr, and qadha" notificationCount={1}>
      <ThemedText themeColor="mutedForeground">
        Tap an item to mark it complete. Your progress is saved locally on this device.
      </ThemedText>

      {TRACKER_CATEGORIES.map((category) => (
        <View key={category} style={styles.section}>
          <SectionHeader title={category} icon={categoryIcons[category]} />
          <View style={styles.items}>
            {categoryItems[category].map((item, index) => (
              <TrackerRow key={item} label={item} completed={category === "salah" && index === 0} />
            ))}
          </View>
        </View>
      ))}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.one,
  },
  items: {
    gap: Spacing.two,
  },
});
