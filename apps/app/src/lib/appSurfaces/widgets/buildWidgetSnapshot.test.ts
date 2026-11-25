import {
  afterSalahTasbeehSteps,
  buildWidgetSnapshot,
  formatUpdatedAgo,
  pickDueAdhkarSet,
} from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import type { WidgetAdhkarSet } from "@/lib/appSurfaces/widgets/types";
import { DEFAULT_LOCATION } from "@/lib/location";

const t = (_key: string, fallback: string, options?: Record<string, unknown>) => {
  if (options) {
    return fallback.replace(/\{\{(\w+)\}\}/g, (_, name) => String(options[name] ?? ""));
  }
  return fallback;
};

const baseInput = {
  locale: "en" as const,
  translationLocale: "en" as const,
  calendar: "hijri" as const,
  timeFormat: "24" as const,
  theme: { isDark: false, primaryColor: "#059669", followsSystem: true },
  salahCompleted: 3,
  salahTotal: 5,
  prayerStatus: { fajr: "completed", dhuhr: "completed", asr: "completed" },
  streakDays: 12,
  qazaRemaining: 15,
  qazaCompletedToday: 1,
  qazaTargetToday: 3,
  khatmPlan: null,
  khatmAyahsRead: 0,
  tasbeehToday: null,
  fridayChecklistDone: {},
  t,
};

describe("buildWidgetSnapshot", () => {
  it("builds a next-prayer snapshot from location and tracker data", () => {
    const snapshot = buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      now: new Date("2026-07-06T09:00:00.000Z"),
    });

    expect(snapshot.version).toBe(1);
    expect(snapshot.locale).toBe("en");
    expect(snapshot.isRtl).toBe(false);
    expect(snapshot.theme.followsSystem).toBe(true);
    expect(snapshot.nextPrayer.prayerName.length).toBeGreaterThan(0);
    expect(snapshot.nextPrayer.minutesUntil).toBeGreaterThanOrEqual(0);
    expect(snapshot.nextPrayer.targetTimeMs).toBeGreaterThan(0);
    expect(snapshot.nextPrayer.accessibilityLabel.length).toBeGreaterThan(0);
    expect(snapshot.nextPrayer.markLabel.length).toBeGreaterThan(0);
    expect(snapshot.schedule.rows.length).toBe(5);
    expect(snapshot.schedule.rows[0]?.statusLabel.length).toBeGreaterThan(0);
    expect(snapshot.progress.progressLabel).toBe("3/5");
    expect(snapshot.progress.progressPercent).toBe(60);
    expect(snapshot.streak.streakDays).toBe(12);
    expect(snapshot.qaza.remaining).toBe(15);
    expect(snapshot.qibla.bearingDegrees).toBeGreaterThanOrEqual(0);
    expect(snapshot.tasbeeh.hasActivity).toBe(false);
    expect(snapshot.friday.total).toBe(6);
  });

  it("keeps streak/qaza/hadith/hijri usable when location is denied", () => {
    const snapshot = buildWidgetSnapshot({
      ...baseInput,
      location: null,
      locationDenied: true,
      locale: "ar",
      translationLocale: "ar",
      theme: { isDark: true, primaryColor: "#059669", followsSystem: false },
    });

    expect(snapshot.locationDenied).toBe(true);
    expect(snapshot.isRtl).toBe(true);
    expect(snapshot.theme.followsSystem).toBe(false);
    expect(snapshot.nextPrayer.deepLink).toContain("location");
    expect(snapshot.qibla.deepLink).toContain("location");
    expect(snapshot.streak.streakDays).toBe(12);
    expect(snapshot.qaza.remaining).toBe(15);
    expect(snapshot.progress.progressLabel).toBe("3/5");
    expect(snapshot.hijriDate.hijriDate.length).toBeGreaterThan(0);
    expect(snapshot.streak.deepLink).toContain("statistics");
    expect(snapshot.qaza.deepLink).toContain("qaza");
  });

  it("includes khatm progress and following salah when available", () => {
    const snapshot = buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      theme: { isDark: false, primaryColor: "#2563EB", followsSystem: true },
      salahCompleted: 1,
      prayerStatus: { fajr: "completed" },
      streakDays: 1,
      qazaRemaining: 0,
      qazaCompletedToday: 0,
      qazaTargetToday: 0,
      khatmPlan: {
        startDate: "2026-07-01",
        days: 30,
        unit: "ayah",
      },
      khatmAyahsRead: 200,
      now: new Date("2026-07-06T09:00:00.000Z"),
    });

    expect(snapshot.khatm.hasPlan).toBe(true);
    expect(snapshot.khatm.progressPercent).toBeGreaterThan(0);
    expect(snapshot.theme.primary).toBe("#2563EB");
  });

  it("builds tasbeeh and Jumu'ah sections", () => {
    // 2026-07-10 is a Friday.
    const friday = buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      tasbeehToday: { title: "Durood Shareef", count: 20, target: 100 },
      fridayChecklistDone: { ghusl: true, prepare: true },
      now: new Date("2026-07-10T09:00:00.000Z"),
    });

    expect(friday.tasbeeh.hasActivity).toBe(true);
    expect(friday.tasbeeh.dhikrTitle).toBe("Durood Shareef");
    expect(friday.tasbeeh.countLabel).toBe("20 / 100");
    expect(friday.tasbeeh.progressPercent).toBe(20);
    expect(friday.friday.isFriday).toBe(true);
    expect(friday.friday.completed).toBe(2);
    expect(friday.friday.daysUntil).toBe(0);

    // 2026-07-06 is a Monday.
    const monday = buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      tasbeehToday: { title: "Istighfar", count: 15, target: 0 },
      fridayChecklistDone: {},
      now: new Date("2026-07-06T09:00:00.000Z"),
    });

    expect(monday.tasbeeh.countLabel).toBe("15");
    expect(monday.tasbeeh.target).toBe(0);
    expect(monday.friday.isFriday).toBe(false);
    expect(monday.friday.daysUntil).toBe(4);
  });
});

describe("buildWidgetSnapshot variations", () => {
  const NOW = new Date("2026-07-06T09:00:00.000Z");
  const build = (overrides: Partial<Parameters<typeof buildWidgetSnapshot>[0]> = {}) =>
    buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      now: NOW,
      ...overrides,
    });

  it("formats prayer times in 12-hour mode", () => {
    expect(build({ timeFormat: "12" }).nextPrayer.prayerTime).toMatch(/AM|PM/i);
  });

  it("marks completed schedule rows", () => {
    const rows = build().schedule.rows;
    expect(rows.find((r) => r.id === "fajr")?.status).toBe("completed");
    expect(rows.find((r) => r.id === "isha")?.status).not.toBe("completed");
  });

  it("returns no schedule rows without a location", () => {
    const snapshot = build({ location: null, locationDenied: false });
    expect(snapshot.schedule.rows).toEqual([]);
  });

  it("normalises theme colours without a leading #", () => {
    expect(
      build({ theme: { isDark: true, primaryColor: "2563EB", followsSystem: false } }).theme,
    ).toMatchObject({
      primary: "#2563EB",
      isDark: true,
      followsSystem: false,
    });
  });

  it("reports 0% progress when there are no Salah to track", () => {
    expect(build({ salahCompleted: 0, salahTotal: 0 }).progress.progressPercent).toBe(0);
  });

  it("caps qaza progress at 100%", () => {
    expect(build({ qazaCompletedToday: 9, qazaTargetToday: 3 }).qaza.progressPercent).toBe(100);
  });

  it("uses Gregorian-first dates and RTL flags for Arabic", () => {
    const snapshot = build({ calendar: "gregorian", locale: "ar", translationLocale: "ar" });
    expect(snapshot.isRtl).toBe(true);
    expect(snapshot.locale).toBe("ar");
    expect(snapshot.hijriDate.weekday.length).toBeGreaterThan(0);
  });

  it("caps tasbeeh progress and labels a finished count", () => {
    const snapshot = build({ tasbeehToday: { title: "", count: 120, target: 100 } });
    expect(snapshot.tasbeeh.progressPercent).toBe(100);
    expect(snapshot.tasbeeh.hasActivity).toBe(true);
  });

  it("celebrates a fully completed Jumu'ah checklist", () => {
    const friday = new Date("2026-07-10T09:00:00.000Z");
    const all = Object.fromEntries(
      require("@munib-tracker/shared/content/friday-checklist").FRIDAY_CHECKLIST.map(
        (item: { id: string }) => [item.id, true],
      ),
    );
    const snapshot = build({ now: friday, fridayChecklistDone: all });
    expect(snapshot.friday.progressPercent).toBe(100);
    expect(JSON.stringify(snapshot.friday)).toMatch(/All done/);
  });

  it.each([
    [0, "Behind"],
    [6236, "Complete"],
  ])("labels khatm pace after %i ayahs as %s", (read, pace) => {
    const snapshot = build({
      khatmPlan: { startDate: "2026-07-06", days: 30 } as never,
      khatmAyahsRead: read,
    });
    expect(snapshot.khatm.paceLabel).toBe(pace);
  });
});

describe("formatUpdatedAgo", () => {
  it.each([
    [-60_000, ""],
    [3 * 3_600_000, "Updated 3h ago"],
  ])("formats an age of %i ms as %p", (ageMs, expected) => {
    expect(formatUpdatedAgo(new Date(Date.now() - ageMs).toISOString(), t as never)).toBe(expected);
  });

  it("returns empty for an invalid timestamp", () => {
    expect(formatUpdatedAgo("nope", t as never)).toBe("");
  });
});

describe("watch / Wear companion contract", () => {
  const now = new Date("2026-07-06T09:00:00.000Z");

  it("stamps the local date and every schedule row's Adhan instant", () => {
    const snapshot = buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      now,
    });

    expect(snapshot.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const times = snapshot.schedule.rows.map((row) => row.atMs);
    expect(times.every((ms) => ms > 0)).toBe(true);
    expect([...times].sort((a, b) => a - b)).toEqual(times);
    // The active row is the next Salah: its Adhan is the next-prayer target.
    const active = snapshot.schedule.rows.find((row) => row.status === "active");
    if (active) expect(active.atMs).toBe(snapshot.nextPrayer.targetTimeMs);
  });

  it("ships the companion labels with the surface strings", () => {
    const snapshot = buildWidgetSnapshot({
      ...baseInput,
      location: null,
      locationDenied: true,
      now,
    });

    expect(snapshot.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(snapshot.strings.markConfirm).toBe("Mark as prayed?");
    expect(snapshot.strings.willSync.length).toBeGreaterThan(0);
    expect(snapshot.strings.cancel).toBe("Cancel");
  });

  it("carries the after-Salah tasbeeh only when every phrase resolves", () => {
    const item = (id: string) => ({
      id,
      categoryId: "after_prayer",
      title: id,
      arabic: `ar-${id}`,
      transliteration: `tr-${id}`,
      translation: "",
    });
    const steps = afterSalahTasbeehSteps((id) => item(id) as never);
    expect(steps.map((s) => s.target)).toEqual([33, 33, 34]);
    expect(steps[0]).toMatchObject({
      zikrId: "after_prayer-tasbih",
      arabic: "ar-after_prayer-tasbih",
    });
    expect(afterSalahTasbeehSteps(() => undefined)).toEqual([]);

    const snapshot = buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      afterSalahSteps: steps,
      now,
    });
    expect(snapshot.afterSalahTasbeeh.steps).toHaveLength(3);
    expect(snapshot.afterSalahTasbeeh.deepLink).toContain("tasbeeh/sequence");
  });
});

describe("time-aware snapshot fields", () => {
  const snapshot = () =>
    buildWidgetSnapshot({
      ...baseInput,
      location: DEFAULT_LOCATION,
      locationDenied: false,
      now: new Date("2026-07-06T09:00:00.000Z"),
    });

  it("carries tomorrow's five obligatory times, all pending, after today's", () => {
    const { schedule, date } = snapshot();
    expect(schedule.tomorrowDate > date).toBe(true);
    expect(schedule.tomorrowRows.map((row) => row.id)).toEqual(schedule.rows.map((row) => row.id));
    expect(schedule.tomorrowRows.every((row) => row.status === "pending")).toBe(true);
    expect(schedule.tomorrowRows[0].atMs).toBeGreaterThan(schedule.rows[4].atMs);
  });

  it("adds tomorrow's Hijri labels and a 0-of-total progress detail", () => {
    const built = snapshot();
    expect(built.hijriDate.tomorrow?.hijriDate.length).toBeGreaterThan(0);
    expect(built.hijriDate.tomorrow?.gregorianDate).not.toBe(built.hijriDate.gregorianDate);
    expect(built.progress.resetDetail).toContain("0 of 5");
  });

  it("keeps Siri answer placeholders for native code to fill", () => {
    const { strings } = snapshot();
    expect(strings.voiceNextSalah).toContain("{{prayer}}");
    expect(strings.voiceNextSalah).toContain("{{time}}");
    expect(strings.voiceSalahTime).toContain("{{prayer}}");
    expect(strings.statusActive.length).toBeGreaterThan(0);
  });

  it("lists the next Islamic events, soonest first, linking to /events", () => {
    const { events } = snapshot();
    expect(events.items.length).toBeGreaterThan(0);
    expect(events.deepLink).toContain("events");
    const dates = events.items.map((item) => item.date);
    expect([...dates].sort()).toEqual(dates);
    expect(events.items[0].relativeLabel.length).toBeGreaterThan(0);
  });
});

describe("pickDueAdhkarSet", () => {
  const set = (key: string, start: number, end: number, completed: number): WidgetAdhkarSet => ({
    key,
    title: key,
    completed,
    total: 3,
    progressLabel: `${completed}/3`,
    startMs: start,
    endMs: end,
    nextLabel: `next ${key}`,
    deepLink: key,
  });

  it("prefers a started open set, then the earliest open one", () => {
    const sets = [set("morning", 0, 100, 0), set("after:dhuhr", 50, 150, 1)];
    expect(pickDueAdhkarSet(sets, 60)).toEqual({ kind: "due", set: sets[1] });
    expect(pickDueAdhkarSet([set("a", 0, 100, 0), set("b", 50, 150, 0)], 60)?.set.key).toBe("a");
  });

  it("skips finished and closed sets and falls back to the next to open", () => {
    const sets = [set("morning", 0, 100, 3), set("evening", 200, 300, 0)];
    expect(pickDueAdhkarSet(sets, 60)).toEqual({ kind: "next", set: sets[1] });
    expect(pickDueAdhkarSet(sets, 400)).toBeNull();
  });
});
