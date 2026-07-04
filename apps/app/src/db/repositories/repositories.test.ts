import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PrayerRepository, PreferencesRepository, QazaRepository } from "@/db";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("PrayerRepository", () => {
  it("upserts one log per prayer per day", async () => {
    await PrayerRepository.setStatus("fajr", "2026-07-03", "completed");
    await PrayerRepository.setStatus("fajr", "2026-07-03", "delayed");
    const logs = await PrayerRepository.getByDate("2026-07-03");
    expect(logs).toHaveLength(1);
    expect(logs[0]?.status).toBe("delayed");
  });

  it("keeps notes when only the status changes", async () => {
    await PrayerRepository.setNotes("dhuhr", "2026-07-03", "at the masjid");
    await PrayerRepository.setStatus("dhuhr", "2026-07-03", "completed");
    const log = await PrayerRepository.getLog("dhuhr", "2026-07-03");
    expect(log?.notes).toBe("at the masjid");
    expect(log?.status).toBe("completed");
  });
});

describe("QazaRepository", () => {
  it("returns a counter for every obligatory prayer", async () => {
    const counters = await QazaRepository.getCounters();
    expect(counters).toHaveLength(6);
  });

  it("never lets remaining go negative", async () => {
    await QazaRepository.setCounter("fajr", 1, 0);
    await QazaRepository.performQaza("fajr", 5);
    const counter = await QazaRepository.getCounter("fajr");
    expect(counter.remaining).toBe(0);
    expect(counter.completed).toBe(1);
  });

  it("persists a recurring schedule and daily progress", async () => {
    await QazaRepository.setSchedule({ targets: { fajr: 2, dhuhr: 1 } });
    const schedule = await QazaRepository.getSchedule();
    expect(schedule.targets.fajr).toBe(2);
    expect(schedule.targets.dhuhr).toBe(1);

    await QazaRepository.setCounter("fajr", 5, 0);
    await QazaRepository.performQaza("fajr");
    const progress = await QazaRepository.getDailyProgress(getLocalDateString());
    expect(progress.completed.fajr).toBe(1);
  });

  it("resets one or all counters", async () => {
    await QazaRepository.setCounter("fajr", 3, 2);
    await QazaRepository.setCounter("dhuhr", 1, 4);
    await QazaRepository.resetCounter("fajr");
    expect(await QazaRepository.getCounter("fajr")).toMatchObject({
      remaining: 0,
      completed: 0,
    });
    expect((await QazaRepository.getCounter("dhuhr")).remaining).toBe(1);

    const counters = await QazaRepository.resetAllCounters();
    expect(counters.every((counter) => counter.remaining === 0 && counter.completed === 0)).toBe(
      true,
    );
  });
});

describe("PreferencesRepository", () => {
  it("merges stored preferences over defaults", async () => {
    const prefs = await PreferencesRepository.update({ locale: "ur" });
    expect(prefs.locale).toBe("ur");
    expect(prefs.notificationPrefs.prayer).toBe(true);
  });

  it("toggles favorites idempotently", async () => {
    await PreferencesRepository.toggleFavorite("z1");
    let prefs = await PreferencesRepository.get();
    expect(prefs.favoriteZikrIds).toContain("z1");
    prefs = await PreferencesRepository.toggleFavorite("z1");
    expect(prefs.favoriteZikrIds).not.toContain("z1");
  });
});
