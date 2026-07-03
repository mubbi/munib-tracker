import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS } from "@munib-tracker/shared/constants";
import type { AppLocale, PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { PrayerRepository, QazaRepository } from "@/db";
import { formatHijriDate } from "@/lib/hijri";
import { trackerStore } from "@/stores/tracker-store";

export default function CalendarDayScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ date: string; calendar?: string }>();
  const date = params.date ?? getLocalDateString();
  const today = getLocalDateString();
  const isFuture = date > today;

  const base = i18n.language?.split("-")[0];
  const locale: AppLocale = base === "ar" || base === "ur" ? base : "en";
  // Map the app locale to a BCP-47 tag so the Gregorian header follows the
  // active language rather than the device locale (matches the Hijri path).
  const bcp47 = locale === "ar" ? "ar" : locale === "ur" ? "ur" : "en-US";
  // Mirror the calendar view the user came from: show the Hijri date in the
  // header when they tapped a day in the Hijri calendar.
  const title =
    params.calendar === "hijri"
      ? formatHijriDate(new Date(`${date}T00:00:00`), locale)
      : new Date(`${date}T00:00:00`).toLocaleDateString(bcp47, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });

  const [status, setStatus] = useState<Record<string, PrayerStatus>>({});
  const [notes, setNotes] = useState<Record<string, string | undefined>>({});
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);

  const reload = useCallback(async () => {
    const logs = await PrayerRepository.getByDate(date);
    const nextStatus: Record<string, PrayerStatus> = {};
    const nextNotes: Record<string, string | undefined> = {};
    for (const log of logs) {
      nextStatus[log.prayerId] = log.status;
      if (log.notes) nextNotes[log.prayerId] = log.notes;
    }
    setStatus(nextStatus);
    setNotes(nextNotes);
  }, [date]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const applyStatus = async (prayerId: PrayerId, next: PrayerStatus) => {
    const previous = status[prayerId] ?? "pending";
    await PrayerRepository.setStatus(prayerId, date, next);
    if (isObligatoryPrayer(prayerId)) {
      const wasMissed = previous === "missed";
      const isMissed = next === "missed";
      if (isMissed && !wasMissed) await QazaRepository.incrementRemaining(prayerId, 1);
      else if (wasMissed && !isMissed) await QazaRepository.incrementRemaining(prayerId, -1);
    }
    await reload();
    if (date === today) await trackerStore.getState().refresh();
  };

  const applyNotes = async (prayerId: PrayerId, text: string) => {
    await PrayerRepository.setNotes(prayerId, date, text);
    await reload();
    if (date === today) await trackerStore.getState().refresh();
  };

  const completed = OBLIGATORY_PRAYERS.filter((p) => status[p] === "completed").length;

  return (
    <ScreenLayout
      eyebrow={date === today ? t("calDay.today") : t("calDay.history")}
      title={title}
      subtitle={
        isFuture
          ? t("calDay.futureSubtitle")
          : t("calDay.summary", { completed, total: OBLIGATORY_PRAYERS.length })
      }
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      {isFuture ? (
        <EmptyState
          icon={{ ios: "clock.badge.exclamationmark", android: "schedule", web: "schedule" }}
          title={t("calDay.emptyTitle")}
          description={t("calDay.emptyDesc")}
        />
      ) : (
        <Stagger>
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
        </Stagger>
      )}

      {activePrayer ? (
        <PrayerStatusSheet
          visible
          prayerLabel={t(`prayers.${activePrayer}`)}
          currentStatus={status[activePrayer] ?? "pending"}
          currentNotes={notes[activePrayer]}
          onSelect={(next) => applyStatus(activePrayer, next)}
          onSaveNotes={(text) => applyNotes(activePrayer, text)}
          onClose={() => setActivePrayer(null)}
        />
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
