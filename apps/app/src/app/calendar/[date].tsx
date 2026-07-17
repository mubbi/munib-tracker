import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { AppLocale, ExcusedReason, PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { aggregateByDate, type DayActivity, getLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";
import { CalendarWeekStrip } from "@/components/calendar-week-strip";
import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TrackerDayChecklist } from "@/components/tracker-day-checklist";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { PrayerRepository, ZikrRepository } from "@/db";
import { useAfterSalahAdhkarReminder } from "@/hooks/use-after-salah-adhkar-reminder";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { usePrayerTimesForDate } from "@/hooks/use-prayer-times-for-date";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { toAppLocale } from "@/lib/locale-bcp47";
import { goBackOrReplace } from "@/lib/navigation";
import { reconcileQazaDebtForStatusChange } from "@/lib/prayer-qaza-debt";
import { zikrCountKey } from "@/lib/zikr-count-key";
import { trackerStore } from "@/stores/tracker-store";

export default function CalendarDayScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ date: string; calendar?: string }>();
  const defaultCalendar = useDefaultCalendar();
  const date = params.date ?? getLocalDateString();
  const today = getLocalDateString();
  const isToday = date === today;
  const isFuture = date > today;

  const locale: AppLocale = toAppLocale(i18n.language ?? "en");
  const calendarMode =
    params.calendar === "hijri" || params.calendar === "gregorian"
      ? params.calendar
      : defaultCalendar;
  const title = formatCalendarDateFromIso(date, calendarMode, locale);
  const prayerTimes = usePrayerTimesForDate(date);

  const [status, setStatus] = useState<Record<string, PrayerStatus>>({});
  const [notes, setNotes] = useState<Record<string, string | undefined>>({});
  const [jama, setJama] = useState<Record<string, boolean>>({});
  const [excusedReason, setExcusedReason] = useState<ExcusedReason | null>(null);
  const [zikrCounts, setZikrCounts] = useState<Record<string, number>>({});
  const [activity, setActivity] = useState<Map<string, DayActivity>>(new Map());
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const onDayScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
  }, []);
  const lastActivePrayer = useRef<PrayerId | null>(activePrayer);
  if (activePrayer) lastActivePrayer.current = activePrayer;
  const sheetPrayer = activePrayer ?? lastActivePrayer.current;
  const remindAfterSalahAdhkar = useAfterSalahAdhkarReminder();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void PrayerRepository.getAll().then((logs) => {
        if (active) setActivity(aggregateByDate(logs));
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const selectDate = useCallback(
    (nextDate: string) => {
      router.replace({
        pathname: "/calendar/[date]",
        params: { date: nextDate, calendar: calendarMode },
      });
    },
    [calendarMode, router],
  );

  const reload = useCallback(async () => {
    const [logs, allLogs, zikrEntries] = await Promise.all([
      PrayerRepository.getByDate(date),
      PrayerRepository.getAll(),
      ZikrRepository.getByDate(date),
    ]);
    const nextStatus: Record<string, PrayerStatus> = {};
    const nextNotes: Record<string, string | undefined> = {};
    const nextJama: Record<string, boolean> = {};
    let nextExcused: ExcusedReason | null = null;
    for (const log of logs) {
      nextStatus[log.prayerId] = log.status;
      if (log.notes) nextNotes[log.prayerId] = log.notes;
      if (log.isJama) nextJama[log.prayerId] = true;
      if (log.isExcused) nextExcused = log.excusedReason ?? "sick";
    }
    const nextZikrCounts: Record<string, number> = {};
    for (const entry of zikrEntries) {
      nextZikrCounts[zikrCountKey(entry.zikrId, entry.prayerId)] = entry.count;
    }
    setStatus(nextStatus);
    setNotes(nextNotes);
    setJama(nextJama);
    setExcusedReason(nextExcused);
    setZikrCounts(nextZikrCounts);
    setActivity(aggregateByDate(allLogs));
  }, [date]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const applyStatus = async (
    prayerId: PrayerId,
    next: PrayerStatus,
    options?: { addToQaza?: boolean },
  ) => {
    const previous = status[prayerId] ?? "pending";
    const existingLog = await PrayerRepository.getLog(prayerId, date);

    const qazaDebtAdded = await reconcileQazaDebtForStatusChange(
      prayerId,
      previous,
      next,
      existingLog,
      options,
    );

    await PrayerRepository.setStatus(prayerId, date, next, { qazaDebtAdded });
    await reload();
    await trackerStore.getState().refresh();
    remindAfterSalahAdhkar(prayerId, previous, next);
  };

  const applyNotes = async (prayerId: PrayerId, text: string) => {
    await PrayerRepository.setNotes(prayerId, date, text);
    await reload();
    await trackerStore.getState().refresh();
  };

  const applyJama = async (prayerId: PrayerId, next: boolean) => {
    await PrayerRepository.setFlags(prayerId, date, { isJama: next });
    await reload();
    await trackerStore.getState().refresh();
  };

  const applyExcused = async (reason: ExcusedReason | null) => {
    const isExcused = reason != null;
    for (const prayerId of OBLIGATORY_PRAYERS) {
      await PrayerRepository.setFlags(prayerId, date, {
        isExcused,
        excusedReason: reason ?? undefined,
      });
    }
    await reload();
    await trackerStore.getState().refresh();
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
      onBack={() => goBackOrReplace(router, "/")}
      scrollRef={scrollRef}
      onScroll={onDayScroll}
    >
      <Seo
        path={`/calendar/${date}`}
        title={t("calDay.history")}
        description={t("seo.calendarDay.description")}
        index={false}
      />
      <Stagger>
        <CalendarWeekStrip
          date={date}
          calendarMode={calendarMode}
          locale={locale}
          activity={activity}
          onSelectDate={selectDate}
        />

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
            status={status}
            notes={notes}
            jama={jama}
            zikrCounts={zikrCounts}
            excusedReason={excusedReason}
            prayerTimes={prayerTimes}
            onPrayerPress={setActivePrayer}
            onExcusedChange={(reason) => void applyExcused(reason)}
            scrollRef={scrollRef}
            getScrollY={() => scrollYRef.current}
          />
        )}
      </Stagger>

      {sheetPrayer ? (
        <PrayerStatusSheet
          visible={activePrayer != null}
          prayerId={sheetPrayer}
          prayerLabel={t(`prayers.${sheetPrayer}`)}
          currentStatus={status[sheetPrayer] ?? "pending"}
          currentNotes={notes[sheetPrayer]}
          isJama={jama[sheetPrayer] ?? false}
          onToggleJama={(next) => applyJama(sheetPrayer, next)}
          onSelect={(next, options) => applyStatus(sheetPrayer, next, options)}
          onSaveNotes={(text) => applyNotes(sheetPrayer, text)}
          onClose={() => setActivePrayer(null)}
        />
      ) : null}
    </ScreenLayout>
  );
}
