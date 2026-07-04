import type { TimeFormat } from "@munib-tracker/shared/types";
import { useMemo } from "react";

import { formatDisplayHhMm, formatDisplayTime, formatStoredTime } from "@/lib/time";
import { usePreferences } from "@/stores/preferences-store";

export function useTimeFormat(): TimeFormat {
  return usePreferences().timeFormat;
}

/** Bound formatters that follow the user's 12/24-hour preference. */
export function useFormatTime() {
  const timeFormat = useTimeFormat();

  return useMemo(
    () => ({
      timeFormat,
      formatTime: (date: Date) => formatDisplayTime(date, timeFormat),
      formatHhMm: (hour: number, minute: number) => formatDisplayHhMm(hour, minute, timeFormat),
      formatStored: (hhMm: string | undefined, fallback?: { hour: number; minute: number }) =>
        formatStoredTime(hhMm, timeFormat, fallback),
    }),
    [timeFormat],
  );
}
