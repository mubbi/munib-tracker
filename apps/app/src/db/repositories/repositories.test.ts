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
