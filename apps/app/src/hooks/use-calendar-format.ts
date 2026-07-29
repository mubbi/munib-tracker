import type { AppLocale, CalendarMode } from "@munib-tracker/shared/types";
import { useMemo } from "react";

import { formatCalendarDate, formatCalendarDateFromIso } from "@/lib/calendar-format";
import { usePreferences } from "@/stores/preferences-store";

export function useDefaultCalendar(): CalendarMode {
  return usePreferences().defaultCalendar;
}

/** Bound formatters that follow the user's default calendar preference. */
export function useFormatCalendarDate() {
  const { defaultCalendar, locale } = usePreferences();

  return useMemo(
    () => ({
      defaultCalendar,
      formatDate: (
        date: Date,
        options?: Intl.DateTimeFormatOptions,
        calendar: CalendarMode = defaultCalendar,
        timeZone?: string,
      ) => formatCalendarDate(date, calendar, locale as AppLocale, options, timeZone),
      formatIso: (
        iso: string,
        options?: Intl.DateTimeFormatOptions,
        calendar: CalendarMode = defaultCalendar,
      ) => formatCalendarDateFromIso(iso, calendar, locale as AppLocale, options),
    }),
    [defaultCalendar, locale],
  );
}
