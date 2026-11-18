import { renderHook } from "@testing-library/react-native";

import { formatCalendarDate, formatCalendarDateFromIso } from "@/lib/calendar-format";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useDefaultCalendar, useFormatCalendarDate } from "./use-calendar-format";

const DATE = new Date("2026-11-18T12:00:00Z");
const OPTIONS: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

beforeEach(() => setPreferences({ defaultCalendar: "hijri", locale: "en" }));
afterEach(resetPreferences);

async function formatter() {
  const { result } = await renderHook(() => useFormatCalendarDate());
  return result.current;
}

describe("useDefaultCalendar", () => {
  it("returns the preferred calendar", async () => {
    const { result } = await renderHook(() => useDefaultCalendar());
    expect(result.current).toBe("hijri");
  });
});

describe("useFormatCalendarDate", () => {
  it("formats dates in the default calendar", async () => {
    const f = await formatter();
    expect(f.defaultCalendar).toBe("hijri");
    expect(f.formatDate(DATE, OPTIONS)).toBe(formatCalendarDate(DATE, "hijri", "en", OPTIONS));
  });

  it("formats dates in an explicit calendar and time zone", async () => {
    const f = await formatter();
    expect(f.formatDate(DATE, OPTIONS, "gregorian", "UTC")).toBe(
      formatCalendarDate(DATE, "gregorian", "en", OPTIONS, "UTC"),
    );
  });

  it("formats ISO dates in the default or an explicit calendar", async () => {
    const f = await formatter();
    expect(f.formatIso("2026-11-18")).toBe(
      formatCalendarDateFromIso("2026-11-18", "hijri", "en", undefined),
    );
    expect(f.formatIso("2026-11-18", OPTIONS, "gregorian")).toBe(
      formatCalendarDateFromIso("2026-11-18", "gregorian", "en", OPTIONS),
    );
  });
});
