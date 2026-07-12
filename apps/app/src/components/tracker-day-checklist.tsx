import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { ExcusedReason, PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { QazaDailyChecklist } from "@/components/qaza-daily-checklist";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { afterSalahProgressForPrayer } from "@/lib/after-salah-adhkar-progress";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { ensureZikrCorpus, zikrCategories } from "@/lib/zikr";

function salahAdhkarCategories() {
  const byId = new Map(zikrCategories().map((category) => [category.id, category]));
  return (["after_azan", "before_prayer", "after_prayer"] as const)
    .map((id) => byId.get(id))
    .filter((category): category is NonNullable<typeof category> => category != null);
}

export type TrackerDayChecklistProps = {
  date: string;
  isToday: boolean;
  status: Record<string, PrayerStatus>;
  notes: Record<string, string | undefined>;
  jama: Record<string, boolean>;
  zikrCounts: Record<string, number>;
  excusedReason?: ExcusedReason | null;
  prayerTimes: Record<PrayerId, string>;
  onPrayerPress: (prayerId: PrayerId) => void;
  /** When omitted, excused chips use the tracker store and guide flow (today tab). */
  onExcusedChange?: (reason: ExcusedReason | null) => void;
};

export function TrackerDayChecklist({
  date,
  isToday,
  status,
  notes,
  jama,
  zikrCounts,
  excusedReason,
  prayerTimes,
  onPrayerPress,
  onExcusedChange,
}: TrackerDayChecklistProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [, setZikrReady] = useState(false);

  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setZikrReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const openAfterSalah = (prayerId: Parameters<typeof afterSalahAdhkarRoute>[0]) => {
    if (!isToday) return;
    router.push(afterSalahAdhkarRoute(prayerId));
  };

  return (
    <View style={styles.stack}>
      <Card padding="three">
        <ExcusedDayPicker
          {...(onExcusedChange ? { excusedReason: excusedReason ?? null, onExcusedChange } : {})}
        />
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("tracker.obligatory")}
          icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
        />
        <View style={styles.rows}>
          {OBLIGATORY_PRAYERS.map((prayerId) => {
            const afterSalahProgress = afterSalahProgressForPrayer(prayerId, zikrCounts);
            return (
              <PrayerTrackerRow
                key={prayerId}
                prayerId={prayerId}
                status={status[prayerId] ?? "pending"}
                time={prayerTimes[prayerId]}
                hasNotes={!!notes[prayerId]}
                isJama={jama[prayerId] ?? false}
                afterSalahProgress={afterSalahProgress}
                onPressAfterSalah={
                  isToday && afterSalahProgress.total > 0
                    ? () => openAfterSalah(prayerId)
                    : undefined
                }
                onPress={() => onPrayerPress(prayerId)}
              />
            );
          })}
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("tracker.witr")}
          icon={{ ios: "moon.fill", android: "dark_mode", web: "dark_mode" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {t("tracker.witrSubtitle")}
        </ThemedText>
        <View style={styles.rows}>
          <PrayerTrackerRow
            prayerId={WITR_PRAYER}
            status={status[WITR_PRAYER] ?? "pending"}
            time={prayerTimes[WITR_PRAYER]}
            hasNotes={!!notes[WITR_PRAYER]}
            afterSalahProgress={afterSalahProgressForPrayer(WITR_PRAYER, zikrCounts)}
            onPressAfterSalah={isToday ? () => openAfterSalah(WITR_PRAYER) : undefined}
            onPress={() => onPrayerPress(WITR_PRAYER)}
          />
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("tracker.salahAdhkar")}
          icon={{
            ios: "hands.and.sparkles.fill",
            android: "volunteer_activism",
            web: "volunteer_activism",
          }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {t("tracker.salahAdhkarSubtitle")}
        </ThemedText>
        <View style={styles.rows}>
          {salahAdhkarCategories().map((category) => (
            <NavRow
              key={category.id}
              icon={category.icon}
              label={t(`zikrCat.${category.id}`)}
              count={category.count}
              onPress={() =>
                router.push({ pathname: "/zikr/[category]", params: { category: category.id } })
              }
            />
          ))}
        </View>
      </Card>

      <QazaDailyChecklist date={date} />

      <Card padding="three">
        <SectionHeader
          title={t("tracker.sunnahOptional")}
          icon={{ ios: "moon.stars", android: "nights_stay", web: "nights_stay" }}
        />
        <View style={styles.rows}>
          {SUNNAH_PRAYERS.map((prayerId) => (
            <PrayerTrackerRow
              key={prayerId}
              prayerId={prayerId}
              status={status[prayerId] ?? "pending"}
              time={prayerTimes[prayerId]}
              hasNotes={!!notes[prayerId]}
              onPress={() => onPrayerPress(prayerId)}
            />
          ))}
          <NavRow
            icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
            label={t("tahajjud.streakRow")}
            onPress={() => router.push("/tahajjud")}
          />
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("journal.title")}
          icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
        />
        <View style={styles.rows}>
          <NavRow
            icon={{ ios: "square.and.pencil", android: "edit", web: "edit" }}
            label={t("journal.navRow")}
            onPress={() => router.push("/journal")}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  // Match Stagger's stack gap so nested cards sit apart the same way top-level ones do.
  stack: {
    width: "100%",
    gap: Spacing.four,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  hint: {
    marginTop: Spacing.two,
  },
});
