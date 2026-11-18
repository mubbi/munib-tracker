import {
  FRIDAY_CHECKLIST_FOCUS,
  fridayChecklistHref,
  isFriday,
  isFridayDateString,
} from "@/lib/friday";

describe("isFriday", () => {
  it.each([
    [new Date(2026, 6, 3), true],
    [new Date(2026, 6, 4), false],
  ])("%p → %p", (date, expected) => {
    expect(isFriday(date)).toBe(expected);
  });

  it("defaults to today", () => {
    expect(isFriday()).toBe(new Date().getDay() === 5);
  });
});

describe("isFridayDateString", () => {
  it.each([
    ["2026-07-03", true],
    ["2026-07-04", false],
    ["03/07/2026", false],
    ["", false],
  ])("%p → %p", (date, expected) => {
    expect(isFridayDateString(date)).toBe(expected);
  });
});

describe("fridayChecklistHref", () => {
  it("focuses the Jumu'ah checklist on the tracker", () => {
    expect(fridayChecklistHref()).toBe(`/tracker?focus=${FRIDAY_CHECKLIST_FOCUS}`);
  });
});
