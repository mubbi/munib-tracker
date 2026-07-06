import {
  AFTER_SALAH_ADHKAR_ROUTE,
  afterSalahAdhkarHref,
  afterSalahAdhkarRoute,
  shouldRemindAfterSalahAdhkar,
} from "./after-salah-adhkar-reminder";

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

describe("afterSalahAdhkarRoute", () => {
  it("defaults to the after_prayer category without a prayer filter", () => {
    expect(afterSalahAdhkarRoute()).toEqual({
      pathname: "/zikr/[category]",
      params: { category: "after_prayer" },
    });
    expect(AFTER_SALAH_ADHKAR_ROUTE).toEqual(afterSalahAdhkarRoute());
  });

  it("includes the prayer param when opened from a specific salah", () => {
    expect(afterSalahAdhkarRoute("fajr")).toEqual({
      pathname: "/zikr/[category]",
      params: { category: "after_prayer", prayer: "fajr" },
    });
    expect(afterSalahAdhkarHref("fajr")).toBe("/zikr/after_prayer?prayer=fajr");
  });
});
