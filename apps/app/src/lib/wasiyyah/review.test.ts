import {
  addMonthsToDate,
  clampReviewInterval,
  debtsChangedSignificantly,
  isReviewDue,
  wasiyyahReviewDueOn,
  wasiyyahReviewReminderDates,
} from "./review";

describe("wasiyyah review schedule", () => {
  it("adds months, clamping to the month's last day", () => {
    expect(addMonthsToDate("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonthsToDate("2026-11-23", 12)).toBe("2027-11-23");
  });

  it("clamps the interval (default 12)", () => {
    expect(clampReviewInterval(undefined)).toBe(12);
    expect(clampReviewInterval(0)).toBe(1);
    expect(clampReviewInterval(500)).toBe(60);
  });

  it("is due N months after the last review, or earlier when debts changed", () => {
    expect(wasiyyahReviewDueOn(undefined, undefined)).toBeNull();
    expect(wasiyyahReviewDueOn({ reviewIntervalMonths: 6 }, "2026-01-15T10:00:00")).toBe(
      "2026-07-15",
    );
    expect(
      wasiyyahReviewDueOn(
        {
          reviewIntervalMonths: 12,
          lastReviewedAt: "2026-03-01T10:00:00",
          debtsChangeNoticedOn: "2026-05-02",
        },
        "2026-01-01T10:00:00",
      ),
    ).toBe("2026-05-02");
  });

  it("flags a debts change above 20%", () => {
    expect(debtsChangedSignificantly(undefined, 500)).toBe(false);
    expect(debtsChangedSignificantly(1000, 1200)).toBe(false);
    expect(debtsChangedSignificantly(1000, 1201)).toBe(true);
    expect(debtsChangedSignificantly(1000, 700)).toBe(true);
    expect(debtsChangedSignificantly(0, 10)).toBe(true);
  });

  it("nudges on the due day, then weekly while overdue — never daily", () => {
    expect(wasiyyahReviewReminderDates("2026-11-25", "2026-11-23", 14)).toEqual([
      "2026-11-25",
      "2026-12-02",
    ]);
    expect(wasiyyahReviewReminderDates("2026-11-01", "2026-11-23", 7)).toEqual(["2026-11-29"]);
    expect(wasiyyahReviewReminderDates(null, "2026-11-23", 14)).toEqual([]);
    expect(isReviewDue("2026-11-23", "2026-11-23")).toBe(true);
  });
});
