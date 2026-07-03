import { buildHijriMonthGrid } from "@/lib/calendar";
import { gregorianToHijri, hijriMonthLength } from "@/lib/hijri";

describe("buildHijriMonthGrid", () => {
  it("covers exactly the requested Hijri month with Gregorian-keyed cells", () => {
    const hYear = 1447;
    const hMonth = 9; // Ramadan
    const weeks = buildHijriMonthGrid(hYear, hMonth, "2020-01-01");

    // Sunday-first, whole weeks.
    for (const week of weeks) {
      expect(week).toHaveLength(7);
    }

    const inMonth = weeks.flat().filter((d) => d.inMonth);
    expect(inMonth).toHaveLength(hijriMonthLength(hYear, hMonth));

    // Every in-month cell really belongs to that Hijri month, and its `date`
    // stays a Gregorian ISO string (so activity lookups keep working).
    for (const day of inMonth) {
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const h = gregorianToHijri(new Date(`${day.date}T00:00:00`));
      expect(h.month).toBe(hMonth);
      expect(h.year).toBe(hYear);
      expect(day.day).toBe(h.day);
    }
  });

  it("marks today when it falls inside the month", () => {
    // Find the Hijri month containing a known Gregorian day.
    const today = "2023-03-25"; // within Ramadan 1444
    const h = gregorianToHijri(new Date("2023-03-25T00:00:00"));
    const weeks = buildHijriMonthGrid(h.year, h.month, today);
    const todays = weeks.flat().filter((d) => d.isToday);
    expect(todays).toHaveLength(1);
    expect(todays[0].date).toBe(today);
  });
});
