import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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

function encouragementKey(progress: number): string {
  if (progress >= 1) return "tracker.allDone";
  if (progress === 0) return "tracker.freshStart";
  if (progress < 0.5) return "tracker.keepGoingShort";
  return "tracker.almostThere";
}

export default function TrackerScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const summary = useDailySummary();
  const streak = useStreak();
  const { status, notes } = useTodayPrayers();
  const { setPrayerStatus, setPrayerNotes } = useTrackerActions();
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);

  const progress = summary.salahTotal ? summary.salahCompleted / summary.salahTotal : 0;

  const shortcuts: QuickActionItem[] = [
    {
      id: "zikr",
      label: t("actions.zikr"),
      icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
      onPress: () => router.push("/zikr"),
    },
    {
      id: "tasbeeh",
      label: t("actions.tasbeeh"),
      icon: { ios: "circle.hexagongrid.fill", android: "hive", web: "hive" },
      onPress: () => router.push("/tasbeeh/free"),
    },
    {
      id: "qaza",
      label: t("actions.qaza"),
      icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
      onPress: () => router.push("/qaza"),
    },
    {
      id: "calendar",
      label: t("actions.calendar"),
      icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
      onPress: () => router.push("/calendar"),
    },
  ];

  return (
    <ScreenLayout
      eyebrow={t("tracker.eyebrow")}
      title={t("tracker.title")}
      subtitle={t("tracker.subtitle")}
    >
      <Stagger>
        <Card>
          <View style={styles.summaryRow}>
            <ProgressRing
              progress={progress}
              size={100}
              stroke={11}
              caption={t("tracker.salahCaption")}
            />
            <View style={styles.summaryCopy}>
              <ThemedText type="subtitle">{t(encouragementKey(progress))}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {t("tracker.summaryLogged", {
                  completed: summary.salahCompleted,
                  total: summary.salahTotal,
                })}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("tracker.streakLine", { count: streak })}
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("tracker.obligatory")}
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
            title={t("tracker.sunnahOptional")}
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
            title={t("tracker.keepGoing")}
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
          prayerLabel={t(`prayers.${activePrayer}`)}
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
