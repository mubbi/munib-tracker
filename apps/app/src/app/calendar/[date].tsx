import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { AppLocale, PrayerId } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from "react-native";
import { CalendarDayStatusSheet, useCalendarDayRecords } from "@/components/calendar-day-panel";
import { CalendarWeekStrip } from "@/components/calendar-week-strip";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TrackerDayChecklist } from "@/components/tracker-day-checklist";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { usePrayerTimesForDate } from "@/hooks/use-prayer-times-for-date";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { toAppLocale } from "@/lib/locale-bcp47";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

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

  const records = useCalendarDayRecords(date);
  const { status, notes, jama, excusedReason, zikrCounts, activity, completed } = records;
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollYRef = useRef(0);
  const onDayScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  const selectDate = useCallback(
    (nextDate: string) => {
      router.replace({
        pathname: "/calendar/[date]",
        params: { date: nextDate, calendar: calendarMode },
      });
    },
    [calendarMode, router],
  );

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
            onExcusedChange={(reason) => void records.applyExcused(reason)}
            scrollRef={scrollRef}
            getScrollY={() => scrollYRef.current}
          />
        )}
      </Stagger>

      <CalendarDayStatusSheet
        activePrayer={activePrayer}
        onClose={() => setActivePrayer(null)}
        records={records}
      />
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/calendar/[date]");
