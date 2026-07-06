import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { DEFAULT_LOCATION } from "@/lib/location";

const t = (_key: string, fallback: string, options?: Record<string, unknown>) => {
  if (options) {
    return fallback.replace(/\{\{(\w+)\}\}/g, (_, name) => String(options[name] ?? ""));
  }
  return fallback;
};

describe("buildWidgetSnapshot", () => {
  it("builds a next-prayer snapshot from location and tracker data", () => {
    const snapshot = buildWidgetSnapshot({
      location: DEFAULT_LOCATION,
      locationDenied: false,
      locale: "en",
      calendar: "hijri",
      timeFormat: "24",
      theme: { isDark: false, primaryColor: "#059669" },
      salahCompleted: 3,
      salahTotal: 5,
      prayerStatus: { fajr: "completed", dhuhr: "completed", asr: "completed" },
      now: new Date("2026-07-06T09:00:00.000Z"),
      t,
    });

    expect(snapshot.version).toBe(1);
    expect(snapshot.nextPrayer.prayerName.length).toBeGreaterThan(0);
    expect(snapshot.nextPrayer.minutesUntil).toBeGreaterThanOrEqual(0);
    expect(snapshot.schedule.rows.length).toBeGreaterThan(0);
    expect(snapshot.progress.progressLabel).toBe("3/5");
    expect(snapshot.progress.progressPercent).toBe(60);
  });

  it("shows set-location state when location is denied", () => {
    const snapshot = buildWidgetSnapshot({
      location: null,
      locationDenied: true,
      locale: "en",
      calendar: "hijri",
      timeFormat: "24",
      theme: { isDark: true, primaryColor: "#059669" },
      salahCompleted: 0,
      salahTotal: 5,
      prayerStatus: {},
      t,
    });

    expect(snapshot.locationDenied).toBe(true);
    expect(snapshot.nextPrayer.deepLink).toContain("location");
    expect(snapshot.nextPrayer.prayerName).toBe("Set location");
  });
});
