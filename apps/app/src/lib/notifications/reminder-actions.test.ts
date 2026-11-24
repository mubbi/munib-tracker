import { isObligatoryPrayerId, markCommandFromReminderData } from "./reminder-actions";

describe("isObligatoryPrayerId", () => {
  it.each(["fajr", "dhuhr", "asr", "maghrib", "isha"])("accepts %s", (id) => {
    expect(isObligatoryPrayerId(id)).toBe(true);
  });

  it.each(["witr", "tahajjud", "", undefined])("rejects %p", (id) => {
    expect(isObligatoryPrayerId(id)).toBe(false);
  });
});

describe("markCommandFromReminderData", () => {
  it("marks the named fard when the reminder carried its id and day", () => {
    expect(markCommandFromReminderData({ prayerId: "asr", prayerDate: "2026-07-03" })).toEqual({
      type: "mark-prayer",
      prayerId: "asr",
      date: "2026-07-03",
      source: "notification",
    });
  });

  it.each([
    ["no data", undefined],
    ["no day", { prayerId: "asr" }],
    ["a non-fard id", { prayerId: "witr", prayerDate: "2026-07-03" }],
  ])("falls back to the current fard with %s", (_label, data) => {
    expect(markCommandFromReminderData(data)).toEqual({
      type: "mark-current-obligatory",
      source: "notification",
    });
  });
});
