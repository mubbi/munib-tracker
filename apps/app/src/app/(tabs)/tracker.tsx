import { OBLIGATORY_PRAYERS, PRAYER_LABELS, SUNNAH_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { ProgressRing } from "@/components/ui/progress-ring";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import {
  useDailySummary,
  useStreak,
  useTodayPrayers,
  useTrackerActions,
} from "@/stores/tracker-store";

function encouragement(progress: number): string {
  if (progress >= 1) return "MashaAllah — all done";
  if (progress === 0) return "A fresh start";
  if (progress < 0.5) return "Keep going";
  return "Almost there";
}

export default function TrackerScreen() {
  const router = useRouter();
  const summary = useDailySummary();
  const streak = useStreak();
  const { status, notes } = useTodayPrayers();
  const { setPrayerStatus, setPrayerNotes } = useTrackerActions();
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);

  const progress = summary.salahTotal ? summary.salahCompleted / summary.salahTotal : 0;

  const shortcuts: QuickActionItem[] = [
    {
      id: "zikr",
      label: "Zikr",
      icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
      onPress: () => router.push("/zikr"),
    },
    {
      id: "tasbeeh",
      label: "Tasbeeh",
      icon: { ios: "circle.hexagongrid.fill", android: "hive", web: "hive" },
      onPress: () => router.push("/tasbeeh/free"),
    },
    {
      id: "qaza",
      label: "Qaza",
      icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
      onPress: () => router.push("/qaza"),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
      onPress: () => router.push("/calendar"),
    },
  ];

  return (
    <ScreenLayout
      eyebrow="Track & log"
      title="Tracker"
      subtitle="Tap a prayer to set its status — saved on this device."
    >
      <Stagger>
        <Card>
          <View style={styles.summaryRow}>
            <ProgressRing progress={progress} size={100} stroke={11} caption="salah" />
            <View style={styles.summaryCopy}>
              <ThemedText type="subtitle">{encouragement(progress)}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {summary.salahCompleted} of {summary.salahTotal} obligatory prayers logged today.
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                🔥 {streak}-day streak
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title="Obligatory"
            icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
          />
          <View style={styles.rows}>
            {OBLIGATORY_PRAYERS.map((prayerId) => (
              <PrayerTrackerRow
                key={prayerId}
                prayerId={prayerId}
                status={status[prayerId] ?? "pending"}
                hasNotes={!!notes[prayerId]}
                onPress={() => setActivePrayer(prayerId)}
              />
            ))}
          </View>
        </Card>

        <Card padding="three">
          <CollapsibleSection
            title="Sunnah & optional"
            icon={{ ios: "moon.stars", android: "nights_stay", web: "nights_stay" }}
          >
            <View style={styles.rows}>
              {SUNNAH_PRAYERS.map((prayerId) => (
                <PrayerTrackerRow
                  key={prayerId}
                  prayerId={prayerId}
                  status={status[prayerId] ?? "pending"}
                  hasNotes={!!notes[prayerId]}
                  onPress={() => setActivePrayer(prayerId)}
                />
              ))}
            </View>
          </CollapsibleSection>
        </Card>

        <Card padding="three">
          <SectionHeader
            title="Keep going"
            icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
          />
          <View style={styles.shortcuts}>
            <QuickActionGrid items={shortcuts} columns={4} />
          </View>
        </Card>
      </Stagger>

      {activePrayer ? (
        <PrayerStatusSheet
          visible
          prayerLabel={PRAYER_LABELS[activePrayer]}
          currentStatus={status[activePrayer] ?? "pending"}
          currentNotes={notes[activePrayer]}
          onSelect={(next) => setPrayerStatus(activePrayer, next)}
          onSaveNotes={(text) => setPrayerNotes(activePrayer, text)}
          onClose={() => setActivePrayer(null)}
        />
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
  },
  summaryCopy: {
    flex: 1,
    gap: Spacing.one + 2,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  shortcuts: {
    marginTop: Spacing.three,
  },
});
