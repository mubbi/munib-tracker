import {
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

  it("maps date-suffixed daily reminders to the correct category", () => {
    expect(resolveNotificationVisual({ reminderKey: "beforeSleep:2026-07-06" }).category).toBe(
      "zikr",
    );
    expect(resolveNotificationVisual({ reminderKey: "morningZikr:2026-07-06" }).category).toBe(
      "zikr",
    );
    expect(resolveNotificationVisual({ reminderKey: "qaza:2026-07-06" }).category).toBe("qaza");
    expect(resolveNotificationVisual({ reminderKey: "friday:2026-07-06" }).category).toBe("zikr");
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
