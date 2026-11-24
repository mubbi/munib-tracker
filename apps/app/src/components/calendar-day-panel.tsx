import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  AppLocale,
  CalendarMode,
  ExcusedReason,
  PrayerCombineMode,
  PrayerId,
  PrayerStatus,
} from "@munib-tracker/shared/types";
import { aggregateByDate, type DayActivity, getLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect } from "expo-router";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";
import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { ThemedText } from "@/components/themed-text";
import { TrackerDayChecklist } from "@/components/tracker-day-checklist";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { PrayerRepository, ZikrRepository } from "@/db";
import { useAfterSalahAdhkarReminder } from "@/hooks/use-after-salah-adhkar-reminder";
import { usePrayerTimesForDate } from "@/hooks/use-prayer-times-for-date";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { combinedFromLog, type PrayerCombined } from "@/lib/prayer-combining";
import { zikrCountKey } from "@/lib/zikr-count-key";
import { trackerStore } from "@/stores/tracker-store";

/**
 * Loads + edits one day's worship records (status, notes, jama, excused, zikr)
 * for any date. Shared by the `/calendar/[date]` route and the desktop
 * calendar's side panel so both write through the same tracker-store paths.
 */
export function useCalendarDayRecords(date: string) {
  const [status, setStatus] = useState<Record<string, PrayerStatus>>({});
  const [notes, setNotes] = useState<Record<string, string | undefined>>({});
  const [jama, setJama] = useState<Record<string, boolean>>({});
  const [atMasjid, setAtMasjid] = useState<Record<string, boolean>>({});
  const [combined, setCombined] = useState<Record<string, PrayerCombined>>({});
  const [excusedReason, setExcusedReason] = useState<ExcusedReason | null>(null);
  const [zikrCounts, setZikrCounts] = useState<Record<string, number>>({});
  const [activity, setActivity] = useState<Map<string, DayActivity>>(new Map());
  /** True once the first load finished (so callers never publish the empty seed map). */
  const [loaded, setLoaded] = useState(false);
  const remindAfterSalahAdhkar = useAfterSalahAdhkarReminder();

  const reload = useCallback(async () => {
    // Carry an active excused period onto today before reading local logs.
    if (date === getLocalDateString()) {
      await trackerStore.getState().refresh();
    }
    const [logs, allLogs, zikrEntries] = await Promise.all([
      PrayerRepository.getByDate(date),
      PrayerRepository.getAll(),
      ZikrRepository.getByDate(date),
    ]);
    const nextStatus: Record<string, PrayerStatus> = {};
    const nextNotes: Record<string, string | undefined> = {};
    const nextJama: Record<string, boolean> = {};
    const nextAtMasjid: Record<string, boolean> = {};
    const nextCombined: Record<string, PrayerCombined> = {};
    let nextExcused: ExcusedReason | null = null;
    for (const log of logs) {
      nextStatus[log.prayerId] = log.status;
      if (log.notes) nextNotes[log.prayerId] = log.notes;
      if (log.isJama) nextJama[log.prayerId] = true;
      if (log.atMasjid) nextAtMasjid[log.prayerId] = true;
      const flag = combinedFromLog(log);
      if (flag) nextCombined[log.prayerId] = flag;
      if (log.isExcused) nextExcused = log.excusedReason ?? "sick";
    }
    const nextZikrCounts: Record<string, number> = {};
    for (const entry of zikrEntries) {
      nextZikrCounts[zikrCountKey(entry.zikrId, entry.prayerId)] = entry.count;
    }
    setStatus(nextStatus);
    setNotes(nextNotes);
    setJama(nextJama);
    setAtMasjid(nextAtMasjid);
    setCombined(nextCombined);
    setExcusedReason(nextExcused);
    setZikrCounts(nextZikrCounts);
    setActivity(aggregateByDate(allLogs));
    setLoaded(true);
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const applyStatus = async (
    prayerId: PrayerId,
    next: PrayerStatus,
    options?: { addToQaza?: boolean },
  ) => {
    const previous = status[prayerId] ?? "pending";
    await trackerStore.getState().setPrayerStatusOnDate(date, prayerId, next, options);
    await reload();
    remindAfterSalahAdhkar(prayerId, previous, next);
  };

  const applyNotes = async (prayerId: PrayerId, text: string) => {
    await trackerStore.getState().setPrayerNotesOnDate(date, prayerId, text);
    await reload();
  };

  const applyJama = async (prayerId: PrayerId, next: boolean) => {
    await trackerStore.getState().setPrayerJamaOnDate(date, prayerId, next);
    await reload();
  };

  const applyAtMasjid = async (prayerId: PrayerId, masjidId: string | null) => {
    await trackerStore.getState().setPrayerAtMasjidOnDate(date, prayerId, masjidId);
    await reload();
  };

  const applyCombined = async (prayerId: PrayerId, mode: PrayerCombineMode | null) => {
    await trackerStore.getState().setPrayerCombinedOnDate(date, prayerId, mode);
    await reload();
  };

  const applyExcused = async (reason: ExcusedReason | null) => {
    await trackerStore.getState().setDayExcusedOnDate(date, reason);
    await reload();
  };

  const completed = OBLIGATORY_PRAYERS.filter((p) => status[p] === "completed").length;

  return {
    status,
    notes,
    jama,
    atMasjid,
    combined,
    excusedReason,
    zikrCounts,
    activity,
    loaded,
    completed,
    applyStatus,
    applyNotes,
    applyJama,
    applyAtMasjid,
    applyCombined,
    applyExcused,
  };
}

/** Status sheet for the day checklist; keeps the last prayer mounted while it animates out. */
export function CalendarDayStatusSheet({
  activePrayer,
  onClose,
  records,
}: {
  activePrayer: PrayerId | null;
  onClose: () => void;
  records: ReturnType<typeof useCalendarDayRecords>;
}) {
  const { t } = useTranslation();
  const lastActivePrayer = useRef<PrayerId | null>(activePrayer);
  if (activePrayer) lastActivePrayer.current = activePrayer;
  const sheetPrayer = activePrayer ?? lastActivePrayer.current;
  if (!sheetPrayer) return null;
  return (
    <PrayerStatusSheet
      visible={activePrayer != null}
      prayerId={sheetPrayer}
      prayerLabel={t(`prayers.${sheetPrayer}`)}
      currentStatus={records.status[sheetPrayer] ?? "pending"}
      currentNotes={records.notes[sheetPrayer]}
      isJama={records.jama[sheetPrayer] ?? false}
      onToggleJama={(next) => records.applyJama(sheetPrayer, next)}
      combined={records.combined[sheetPrayer] ?? null}
      onSetCombined={(mode) => records.applyCombined(sheetPrayer, mode)}
      atMasjid={records.atMasjid[sheetPrayer] ?? false}
      onToggleAtMasjid={(masjidId) => records.applyAtMasjid(sheetPrayer, masjidId)}
      onSelect={(next, options) => records.applyStatus(sheetPrayer, next, options)}
      onSaveNotes={(text) => records.applyNotes(sheetPrayer, text)}
      onClose={onClose}
    />
  );
}

type CalendarDayPanelProps = {
  date: string;
  calendarMode: CalendarMode;
  locale: AppLocale;
  /** Fresh all-days aggregate after each load/edit, so the month grid re-colours. */
  onActivityChange?: (activity: Map<string, DayActivity>) => void;
  scrollRef?: RefObject<ScrollViewInstance | null>;
  getScrollY?: () => number;
};

/**
 * Desktop calendar side panel: the selected day's checklist, editable in place
 * (same records + sheet as `/calendar/[date]`, minus the week strip — the month
 * grid beside it already does that job).
 */
export function CalendarDayPanel({
  date,
  calendarMode,
  locale,
  onActivityChange,
  scrollRef,
  getScrollY,
}: CalendarDayPanelProps) {
  const { t } = useTranslation();
  const records = useCalendarDayRecords(date);
  const prayerTimes = usePrayerTimesForDate(date);
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);
  const today = getLocalDateString();
  const isToday = date === today;
  const isFuture = date > today;

  useEffect(() => {
    if (records.loaded) onActivityChange?.(records.activity);
  }, [onActivityChange, records.activity, records.loaded]);

  // A different day was picked — never leave the previous day's sheet open.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset keyed on date only
  useEffect(() => {
    setActivePrayer(null);
  }, [date]);

  return (
    <View style={styles.root}>
      <Card padding="three" style={styles.header}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {isToday ? t("calDay.today") : t("calDay.history")}
        </ThemedText>
        <ThemedText type="subtitle" heading={2}>
          {formatCalendarDateFromIso(date, calendarMode, locale)}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {isFuture
            ? t("calDay.futureSubtitle")
            : t("calDay.summary", {
                completed: records.completed,
                total: OBLIGATORY_PRAYERS.length,
              })}
        </ThemedText>
      </Card>

      {isFuture ? (
        <EmptyState
          icon={{ ios: "clock.badge.exclamationmark", android: "schedule", web: "schedule" }}
          title={t("calDay.emptyTitle")}
          description={t("calDay.emptyDesc")}
        />
      ) : (
        <TrackerDayChecklist
          date={date}
          isToday={isToday}
          status={records.status}
          notes={records.notes}
          jama={records.jama}
          combined={records.combined}
          zikrCounts={records.zikrCounts}
          excusedReason={records.excusedReason}
          prayerTimes={prayerTimes}
          onPrayerPress={setActivePrayer}
          onExcusedChange={(reason) => void records.applyExcused(reason)}
          scrollRef={scrollRef}
          getScrollY={getScrollY}
        />
      )}

      <CalendarDayStatusSheet
        activePrayer={activePrayer}
        onClose={() => setActivePrayer(null)}
        records={records}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.half,
  },
});
