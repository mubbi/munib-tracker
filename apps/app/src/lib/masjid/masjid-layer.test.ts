import { masjidKey } from "@munib-tracker/shared/masjid";
import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { masjidPrayerStats } from "@/lib/masjid/masjid-stats";
import { nextIqamah } from "@/lib/masjid/next-iqamah";
import {
  mergeImportedTimes,
  saveImportedTimetable,
  TIMETABLE_IMPORT_ROUTE,
} from "@/lib/masjid/timetable-import";
import { homeMasjidTimesActions, homeMasjidTimesStore } from "@/stores/home-masjid-times-store";
import { trackerStore } from "@/stores/tracker-store";
import { resetTrackerStore } from "@/test-support/store";
import { makePrayerLog as log } from "../../../../../packages/shared/src/test-support/factories";

const HOME = { osmType: "node" as const, osmId: "42", lat: 51.5, lon: -0.12 };
const KEY = masjidKey(HOME);

describe("NF-3.12 import slot", () => {
  beforeEach(async () => {
    await resetTrackerStore();
    await homeMasjidTimesStore.getState().load();
  });

  it("routes the 'Import from a photo' button to the OCR screen", () => {
    expect(TIMETABLE_IMPORT_ROUTE).toBe("/masjids/import");
  });

  it("merges a monthly import into existing times without dropping other months", () => {
    const merged = mergeImportedTimes(
      {
        daily: { fajr: "06:00" },
        monthly: { "2026-10-01": { fajr: "05:40" } },
        jumuah: [{ iqamahAt: "13:15" }],
        updatedAt: "2026-10-01T00:00:00Z",
      },
      { monthly: { "2026-11-01": { fajr: "06:30" } } },
    );
    expect(merged).toEqual({
      daily: { fajr: "06:00" },
      monthly: { "2026-10-01": { fajr: "05:40" }, "2026-11-01": { fajr: "06:30" } },
      jumuah: [{ iqamahAt: "13:15" }],
    });
  });

  it("saves the reviewed import as private OCR times", async () => {
    await homeMasjidTimesActions.save(KEY, { daily: { isha: "20:00" }, origin: "manual" });
    await expect(
      saveImportedTimetable(KEY, { monthly: { "2026-11-02": { dhuhr: "12:45" } } }),
    ).resolves.toBe(true);
    expect(homeMasjidTimesStore.getState().times[KEY]).toMatchObject({
      origin: "ocr",
      daily: { isha: "20:00" },
      monthly: { "2026-11-02": { dhuhr: "12:45" } },
    });
  });
});

describe("PrayerLog atMasjid (NF-3.11)", () => {
  beforeEach(async () => {
    await resetTrackerStore();
  });

  it("sets and clears the flag with the masjid ref, preserving every other field", async () => {
    const date = trackerStore.getState().date;
    await trackerStore.getState().setPrayerStatusOnDate(date, "dhuhr", "completed");
    await trackerStore.getState().setPrayerJamaOnDate(date, "dhuhr", true);
    await trackerStore.getState().setPrayerAtMasjidOnDate(date, "dhuhr", KEY);
    let saved = await PrayerRepository.getLog("dhuhr", date);
    expect(saved).toMatchObject({
      status: "completed",
      isJama: true,
      atMasjid: true,
      masjidId: KEY,
    });
    expect(trackerStore.getState().prayerAtMasjid.dhuhr).toBe(true);

    await trackerStore.getState().setPrayerAtMasjidOnDate(date, "dhuhr", null);
    saved = await PrayerRepository.getLog("dhuhr", date);
    expect(saved).toMatchObject({ status: "completed", isJama: true });
    expect(saved?.atMasjid).toBeUndefined();
    expect(saved?.masjidId).toBeUndefined();
    expect(trackerStore.getState().prayerAtMasjid.dhuhr).toBeFalsy();
  });

  it("keeps atMasjid when another flag or the status changes", async () => {
    const date = trackerStore.getState().date;
    await trackerStore.getState().setPrayerAtMasjidOnDate(date, "asr", KEY);
    await trackerStore.getState().setPrayerStatusOnDate(date, "asr", "completed");
    await trackerStore.getState().setPrayerJamaOnDate(date, "asr", false);
    expect(await PrayerRepository.getLog("asr", date)).toMatchObject({
      atMasjid: true,
      masjidId: KEY,
      status: "completed",
    });
  });
});

describe("masjidPrayerStats", () => {
  it("counts prayed obligatory Salah at the masjid per week, skipping excused and sunnah", () => {
    const logs = [
      log("2026-11-02", "fajr", "completed", { atMasjid: true }),
      log("2026-11-02", "isha", "delayed", { atMasjid: true }),
      log("2026-11-03", "dhuhr", "missed", { atMasjid: true }),
      log("2026-11-04", "maghrib", "completed", { atMasjid: true, isExcused: true }),
      log("2026-11-05", "fajr_before", "completed", { atMasjid: true }),
      log("2026-11-06", "asr", "completed"),
      log("2026-11-20", "asr", "completed", { atMasjid: true }),
    ];
    expect(masjidPrayerStats(logs, "2026-11-01", "2026-11-14")).toEqual({
      count: 2,
      perWeek: 1,
      days: 1,
    });
    expect(masjidPrayerStats(logs, "2026-11-01", "2026-11-07").perWeek).toBe(2);
  });
});

describe("nextIqamah (home hero countdown)", () => {
  const timetable = {
    daily: { fajr: "06:30", dhuhr: "12:45", asr: "14:30", maghrib: "16:25", isha: "19:00" },
    jumuah: [{ iqamahAt: "13:15" }],
    source: { id: "private" as const },
  };

  it("finds the next iqamah within the horizon", () => {
    // Tuesday 24 Nov 2026, 12:20 UTC (London = UTC in winter).
    const now = new Date(Date.UTC(2026, 10, 24, 12, 20));
    expect(nextIqamah(timetable, now, "Europe/London")).toMatchObject({
      prayer: "dhuhr",
      minutes: 25,
    });
  });

  it("uses Jumu'ah for Dhuhr on Friday and rolls over to tomorrow's Fajr", () => {
    const friday = new Date(Date.UTC(2026, 10, 27, 12, 50));
    expect(nextIqamah(timetable, friday, "Europe/London")).toMatchObject({
      prayer: "dhuhr",
      minutes: 25,
    });
    const night = new Date(Date.UTC(2026, 10, 24, 4, 0));
    expect(nextIqamah(timetable, night, "Europe/London")).toMatchObject({ prayer: "fajr" });
  });

  it("shows nothing without times or when the next iqamah is far away", () => {
    expect(nextIqamah(null, new Date())).toBeNull();
    const late = new Date(Date.UTC(2026, 10, 24, 20, 0));
    expect(nextIqamah(timetable, late, "Europe/London")).toBeNull();
  });
});
