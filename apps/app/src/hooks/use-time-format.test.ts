import { renderHook } from "@testing-library/react-native";

import { formatDisplayHhMm, formatDisplayTime, formatStoredTime } from "@/lib/time";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useFormatTime, useTimeFormat } from "./use-time-format";

afterEach(resetPreferences);

describe.each(["12", "24"] as const)("with a %s-hour preference", (timeFormat) => {
  beforeEach(() => setPreferences({ timeFormat }));

  it("reports the preference", async () => {
    const { result } = await renderHook(() => useTimeFormat());
    expect(result.current).toBe(timeFormat);
  });

  it("binds every formatter to it", async () => {
    const { result } = await renderHook(() => useFormatTime());
    const date = new Date(2026, 10, 18, 15, 5);
    expect(result.current.timeFormat).toBe(timeFormat);
    expect(result.current.formatTime(date)).toBe(formatDisplayTime(date, timeFormat));
    expect(result.current.formatHhMm(15, 5)).toBe(formatDisplayHhMm(15, 5, timeFormat));
    expect(result.current.formatStored("15:05")).toBe(formatStoredTime("15:05", timeFormat));
    expect(result.current.formatStored(undefined, { hour: 6, minute: 0 })).toBe(
      formatStoredTime(undefined, timeFormat, { hour: 6, minute: 0 }),
    );
  });
});
