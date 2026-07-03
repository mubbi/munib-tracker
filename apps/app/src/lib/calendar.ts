import { getLocalDateString } from "@munib-tracker/shared/utils";

export interface CalendarDay {
  date: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAYS = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

function toDateString(year: number, month: number, day: number): string {
  const m = `${month + 1}`.padStart(2, "0");
  const d = `${day}`.padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/** Builds a Sunday-first grid of weeks covering the given month, with adjacent-month padding. */
export function buildMonthGrid(
  year: number,
  month: number,
  today: string = getLocalDateString(),
): CalendarDay[][] {
  const startWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((startWeekday + daysInMonth) / 7);

  const weeks: CalendarDay[][] = [];
  const cursor = new Date(year, month, 1 - startWeekday);

  for (let week = 0; week < weekCount; week += 1) {
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = toDateString(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      days.push({
        date,
        day: cursor.getDate(),
        inMonth: cursor.getMonth() === month,
        isToday: date === today,
        isFuture: date > today,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(days);
  }

  return weeks;
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}
