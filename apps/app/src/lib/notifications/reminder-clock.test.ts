import {
  addMinutes,
  isPastFireTime,
  JUST_MISSED_WINDOW_MS,
  nextDailyFireAt,
  wallClockOnDay,
} from "./reminder-clock";

describe("isPastFireTime", () => {
  const now = new Date(2026, 6, 3, 12, 0);

  it("keeps a reminder that fired within the just-missed window", () => {
    expect(isPastFireTime(new Date(now.getTime() - JUST_MISSED_WINDOW_MS + 1), now)).toBe(false);
    expect(isPastFireTime(new Date(now.getTime() + 1), now)).toBe(false);
  });

  it("drops one older than the window", () => {
    expect(isPastFireTime(new Date(now.getTime() - JUST_MISSED_WINDOW_MS), now)).toBe(true);
  });
});

describe("addMinutes", () => {
  it("shifts by whole minutes either way", () => {
    const at = new Date(2026, 6, 3, 12, 0);
    expect(addMinutes(at, 10).getTime() - at.getTime()).toBe(600_000);
    expect(addMinutes(at, -45).getTime() - at.getTime()).toBe(-2_700_000);
  });
});

describe("wallClockOnDay", () => {
  it("uses the device zone without a location zone", () => {
    expect(wallClockOnDay(new Date(2026, 6, 3, 18, 0), "05:30", undefined)).toEqual(
      new Date(2026, 6, 3, 5, 30),
    );
  });

  it("resolves the wall clock in the location's zone", () => {
    // Karachi is UTC+5 with no DST.
    expect(wallClockOnDay(new Date(2026, 6, 3), "09:00", "Asia/Karachi").toISOString()).toBe(
      "2026-07-03T04:00:00.000Z",
    );
  });
});

describe("nextDailyFireAt", () => {
  it("points at today while today's time is still ahead (or just missed)", () => {
    const now = new Date(2026, 6, 3, 20, 0, 30);
    expect(nextDailyFireAt("20:00", now, {})).toEqual(new Date(2026, 6, 3, 20, 0));
  });

  it("rolls to tomorrow once today's time has passed", () => {
    const now = new Date(2026, 6, 3, 21, 0);
    expect(nextDailyFireAt("20:00", now, {})).toEqual(new Date(2026, 6, 4, 20, 0));
  });
});
