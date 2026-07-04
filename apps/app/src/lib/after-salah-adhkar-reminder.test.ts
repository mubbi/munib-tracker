import { shouldRemindAfterSalahAdhkar } from "./after-salah-adhkar-reminder";

describe("shouldRemindAfterSalahAdhkar", () => {
  it("reminds when an obligatory prayer is newly completed", () => {
    expect(shouldRemindAfterSalahAdhkar("fajr", "pending", "completed")).toBe(true);
    expect(shouldRemindAfterSalahAdhkar("isha", "missed", "completed")).toBe(true);
  });

  it("does not remind when toggling off or for non-obligatory prayers", () => {
    expect(shouldRemindAfterSalahAdhkar("fajr", "completed", "pending")).toBe(false);
    expect(shouldRemindAfterSalahAdhkar("fajr", "completed", "completed")).toBe(false);
    expect(shouldRemindAfterSalahAdhkar("witr", "pending", "completed")).toBe(false);
    expect(shouldRemindAfterSalahAdhkar("tahajjud", "pending", "completed")).toBe(false);
  });
});
