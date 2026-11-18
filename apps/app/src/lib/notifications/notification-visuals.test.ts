import {
  extractReminderKey,
  parseReminderKey,
  resolveNotificationVisual,
} from "@/lib/notifications/notification-visuals";

describe("notification-visuals", () => {
  it("maps prayer reminders to salah visuals with prayer icons", () => {
    const parsed = parseReminderKey("prayer:fajr:2026-07-04");
    expect(parsed).toEqual({ kind: "prayer", prayerId: "fajr" });

    const visual = resolveNotificationVisual({ reminderKey: "prayer:fajr:2026-07-04" });
    expect(visual.category).toBe("salah");
  });

  it("maps after-adhan reminders to zikr visuals", () => {
    const visual = resolveNotificationVisual({ reminderKey: "afterAzan:isha:2026-07-04" });
    expect(visual.category).toBe("zikr");
  });

  it("maps qaza daily reminders to qaza visuals", () => {
    const visual = resolveNotificationVisual({ reminderKey: "qaza" });
    expect(visual.category).toBe("qaza");
  });

  it("extracts reminder keys from os- and web- inbox ids", () => {
    expect(extractReminderKey("inbox:os-qaza", "os-qaza")).toBe("qaza");
    expect(extractReminderKey("inbox:web-qaza", "web-qaza")).toBe("qaza");
    expect(extractReminderKey("scheduled:morningZikr")).toBe("morningZikr");
  });

  it("maps date-suffixed daily reminders to the correct category", () => {
    expect(resolveNotificationVisual({ reminderKey: "beforeSleep:2026-07-06" }).category).toBe(
      "zikr",
    );
    expect(resolveNotificationVisual({ reminderKey: "morningZikr:2026-07-06" }).category).toBe(
      "zikr",
    );
    expect(resolveNotificationVisual({ reminderKey: "qaza:2026-07-06" }).category).toBe("qaza");
    expect(resolveNotificationVisual({ reminderKey: "friday:2026-07-06" }).category).toBe("zikr");
    expect(resolveNotificationVisual({ reminderKey: "whiteDays:2026-07-27" }).icon).toEqual({
      ios: "moon.circle.fill",
      android: "brightness_3",
      web: "brightness_3",
    });
    expect(resolveNotificationVisual({ reminderKey: "whiteDays:2026-07-27" }).category).toBe(
      "zikr",
    );
    expect(resolveNotificationVisual({ reminderKey: "dailyContent:2026-07-06" }).category).toBe(
      "zikr",
    );
  });

  it("maps unknown reminders to system visuals", () => {
    const visual = resolveNotificationVisual({ reminderKey: "unknown:2026-07-06" });
    expect(visual.category).toBe("system");
  });

  it("maps achievements to milestone visuals", () => {
    const visual = resolveNotificationVisual({ kind: "achievement" });
    expect(visual.category).toBe("milestone");
  });
});

describe("notification-visuals edge cases", () => {
  it.each([
    ["beforePrayer:asr:2026-07-04", { kind: "beforePrayer", prayerId: "asr" }],
    ["afterPrayer:isha:2026-07-04", { kind: "afterPrayer", prayerId: "isha" }],
    ["afterAzan:fajr", { kind: "afterAzan", prayerId: "fajr" }],
    ["friday", { kind: "daily", id: "friday" }],
  ])("parses %s", (key, expected) => {
    expect(parseReminderKey(key)).toEqual(expected);
  });

  it.each(["prayer:unknown", "mystery:fajr", "prayer"])("rejects %s", (key) => {
    expect(parseReminderKey(key)).toBeNull();
  });

  it.each([
    ["afterPrayer:isha", "zikr"],
    ["beforePrayer:asr", "zikr"],
  ])("maps %s to the %s category", (reminderKey, category) => {
    expect(resolveNotificationVisual({ reminderKey }).category).toBe(category);
  });

  it.each([
    ["admin_announcement", "announcement"],
    ["system", "system"],
  ] as const)("maps %s notifications to %s", (kind, category) => {
    expect(resolveNotificationVisual({ kind }).category).toBe(category);
  });

  it("extracts a key from scheduled row ids and ignores others", () => {
    expect(extractReminderKey("scheduled:qaza")).toBe("qaza");
    expect(extractReminderKey("row-1", "inbox-1")).toBeUndefined();
  });
});
