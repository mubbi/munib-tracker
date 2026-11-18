import type { TFunction } from "i18next";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { formatRelativeWhen } from "@/lib/relative-time";

const t = ((key: string, opts?: { count?: number }) =>
  opts?.count != null ? `${key}:${opts.count}` : key) as unknown as TFunction;

const NOW = new Date("2026-03-20T12:00:00.000Z").getTime();
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

beforeEach(() => {
  jest.spyOn(Date, "now").mockReturnValue(NOW);
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("formatRelativeWhen", () => {
  it("returns empty for an invalid timestamp", () => {
    expect(formatRelativeWhen("not-a-date", "en", t)).toBe("");
  });

  it("buckets recent times into just-now / minutes / hours", () => {
    expect(formatRelativeWhen(ago(10_000), "en", t)).toBe("home.continueWhen.justNow");
    // Future timestamps clamp to zero.
    expect(formatRelativeWhen(ago(-5 * MIN), "en", t)).toBe("home.continueWhen.justNow");
    expect(formatRelativeWhen(ago(5 * MIN), "en", t)).toBe("home.continueWhen.minutesAgo:5");
    expect(formatRelativeWhen(ago(59 * MIN), "en", t)).toBe("home.continueWhen.minutesAgo:59");
    expect(formatRelativeWhen(ago(3 * HOUR), "en", t)).toBe("home.continueWhen.hoursAgo:3");
  });

  it("uses yesterday and day counts within a week", () => {
    expect(formatRelativeWhen(ago(DAY + HOUR), "en", t)).toBe("home.continueWhen.yesterday");
    expect(formatRelativeWhen(ago(4 * DAY), "en", t)).toBe("home.continueWhen.daysAgo:4");
  });

  it("falls back to an absolute short date after a week", () => {
    const iso = ago(10 * DAY);
    expect(formatRelativeWhen(iso, "en-US", t)).toBe(
      formatCalendarDateFromIso(iso.slice(0, 10), "gregorian", "en", {
        month: "short",
        day: "numeric",
      }),
    );
    const hijri = formatRelativeWhen(iso, undefined, t, "hijri");
    expect(hijri).toBe(
      formatCalendarDateFromIso(iso.slice(0, 10), "hijri", "en", {
        month: "short",
        day: "numeric",
      }),
    );
    expect(hijri.length).toBeGreaterThan(0);
  });
});
