import type { PrayerLog } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HadithRepository,
  PrayerRepository,
  PreferencesRepository,
  QazaRepository,
  QuranRepository,
  TombstoneRepository,
  ZikrRepository,
} from "@/db";
import { DB_KEYS } from "@/db/keys";
import { writeJSON } from "@/db/store";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("ZikrRepository", () => {
  it("accumulates via increment and overwrites via setCount", async () => {
    await ZikrRepository.increment("z1", "2026-07-03", 10);
    await ZikrRepository.increment("z1", "2026-07-03", 10, 3);
    let progress = await ZikrRepository.getProgress("z1", "2026-07-03");
    expect(progress?.count).toBe(4);
    expect(progress?.completed).toBe(false);

    await ZikrRepository.setCount("z1", "2026-07-03", 7, 10);
    progress = await ZikrRepository.getProgress("z1", "2026-07-03");
    expect(progress?.count).toBe(7);
  });

  it("flips completed once the count reaches the target", async () => {
    await ZikrRepository.setCount("z1", "2026-07-03", 9, 10);
    expect((await ZikrRepository.getProgress("z1", "2026-07-03"))?.completed).toBe(false);

    await ZikrRepository.increment("z1", "2026-07-03", 10);
    const progress = await ZikrRepository.getProgress("z1", "2026-07-03");
    expect(progress?.count).toBe(10);
    expect(progress?.completed).toBe(true);
  });

  it("never lets the count go negative", async () => {
    await ZikrRepository.increment("z1", "2026-07-03", 10, -5);
    expect((await ZikrRepository.getProgress("z1", "2026-07-03"))?.count).toBe(0);
  });

  it("isolates progress per day for the same zikr", async () => {
    await ZikrRepository.setCount("z1", "2026-07-03", 5, 10);
    await ZikrRepository.setCount("z1", "2026-07-04", 2, 10);

    expect((await ZikrRepository.getProgress("z1", "2026-07-03"))?.count).toBe(5);
    expect((await ZikrRepository.getProgress("z1", "2026-07-04"))?.count).toBe(2);
    expect(await ZikrRepository.getByDate("2026-07-03")).toHaveLength(1);
    expect(await ZikrRepository.getAll()).toHaveLength(2);
  });

  it("isolates after-salah progress per fard prayer on the same day", async () => {
    await ZikrRepository.setCount("after_prayer-tasbih", "2026-07-03", 33, 33, "fajr");
    await ZikrRepository.setCount("after_prayer-tasbih", "2026-07-03", 10, 33, "dhuhr");

    expect(
      (await ZikrRepository.getProgress("after_prayer-tasbih", "2026-07-03", "fajr"))?.count,
    ).toBe(33);
    expect(
      (await ZikrRepository.getProgress("after_prayer-tasbih", "2026-07-03", "dhuhr"))?.count,
    ).toBe(10);
    expect(await ZikrRepository.getByDate("2026-07-03")).toHaveLength(2);
  });
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

  it("round-trips a full log written verbatim via upsertLog", async () => {
    const log: PrayerLog = {
      id: "server-1",
      prayerId: "asr",
      date: "2026-07-03",
      status: "completed",
      notes: "pulled from server",
      updatedAt: "2026-07-03T15:30:00.000Z",
      source: "sync",
    };
    await PrayerRepository.upsertLog(log);
    expect(await PrayerRepository.getLog("asr", "2026-07-03")).toEqual(log);
  });

  it("removes only the targeted prayer/date and records a tombstone", async () => {
    await PrayerRepository.setStatus("fajr", "2026-07-03", "completed");
    await PrayerRepository.setStatus("dhuhr", "2026-07-03", "completed");
    await PrayerRepository.setStatus("fajr", "2026-07-04", "completed");

    await PrayerRepository.remove("fajr", "2026-07-03");

    // Only the targeted entry is gone; the other prayer and other day survive.
    expect(await PrayerRepository.getLog("fajr", "2026-07-03")).toBeUndefined();
    expect(await PrayerRepository.getLog("dhuhr", "2026-07-03")).toBeDefined();
    expect(await PrayerRepository.getLog("fajr", "2026-07-04")).toBeDefined();

    const tombstones = await TombstoneRepository.getAll();
    expect(tombstones).toHaveLength(1);
    expect(tombstones[0]).toMatchObject({ entity: "prayer_logs", id: "fajr::2026-07-03" });
    expect(typeof tombstones[0]?.deletedAt).toBe("string");
  });

  it("skips the tombstone when removing a server-applied deletion", async () => {
    await PrayerRepository.setStatus("isha", "2026-07-03", "completed");
    await PrayerRepository.remove("isha", "2026-07-03", { tombstone: false });

    expect(await PrayerRepository.getLog("isha", "2026-07-03")).toBeUndefined();
    expect(await TombstoneRepository.getAll()).toHaveLength(0);
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

  it("applies a remote counter with last-write-wins on updatedAt", async () => {
    // Seed a local counter with a known timestamp.
    await QazaRepository.applyRemoteCounter("fajr", {
      prayerId: "fajr",
      remaining: 10,
      completed: 2,
      updatedAt: "2026-07-03T12:00:00.000Z",
    });
    expect(await QazaRepository.getCounter("fajr")).toMatchObject({ remaining: 10, completed: 2 });

    // An older remote write is ignored.
    await QazaRepository.applyRemoteCounter("fajr", {
      prayerId: "fajr",
      remaining: 99,
      completed: 99,
      updatedAt: "2026-07-03T11:00:00.000Z",
    });
    expect(await QazaRepository.getCounter("fajr")).toMatchObject({ remaining: 10, completed: 2 });

    // A newer remote write wins.
    await QazaRepository.applyRemoteCounter("fajr", {
      prayerId: "fajr",
      remaining: 3,
      completed: 8,
      updatedAt: "2026-07-03T13:00:00.000Z",
    });
    const counter = await QazaRepository.getCounter("fajr");
    expect(counter.remaining).toBe(3);
    expect(counter.completed).toBe(8);
    expect(counter.updatedAt).toBe("2026-07-03T13:00:00.000Z");
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

describe("QuranRepository bookmark sync", () => {
  it("union-merges remote bookmarks per surah:ayah, keeping newer createdAt", async () => {
    await QuranRepository.toggleBookmark(2, 255);
    const [local] = await QuranRepository.getBookmarks();
    expect(local).toBeDefined();
    await writeJSON(DB_KEYS.quranBookmarksUpdatedAt, "2026-07-02T00:00:00.000Z");
    await QuranRepository.applyRemoteBookmarks(
      [
        { id: "remote-old", surah: 2, ayah: 255, createdAt: "2026-07-01T00:00:00.000Z" },
        { id: "remote-new", surah: 18, ayah: 10, createdAt: "2026-07-05T00:00:00.000Z" },
      ],
      "2026-07-04T00:00:00.000Z",
    );

    const bookmarks = await QuranRepository.getBookmarks();
    expect(bookmarks).toHaveLength(2);
    expect(bookmarks.find((bm) => bm.surah === 2 && bm.ayah === 255)?.id).toBe(local?.id);
    expect(bookmarks.find((bm) => bm.surah === 18 && bm.ayah === 10)?.id).toBe("remote-new");
    expect(await QuranRepository.getBookmarksUpdatedAt()).toBe("2026-07-04T00:00:00.000Z");
  });

  it("keeps the newer local watermark when remote updatedAt is older", async () => {
    await QuranRepository.touchBookmarks();
    const localUpdatedAt = await QuranRepository.getBookmarksUpdatedAt();
    await QuranRepository.applyRemoteBookmarks(
      [{ id: "remote", surah: 1, ayah: 1, createdAt: "2026-07-05T00:00:00.000Z" }],
      "2026-07-03T00:00:00.000Z",
    );
    expect(await QuranRepository.getBookmarksUpdatedAt()).toBe(localUpdatedAt);
  });
});

describe("HadithRepository bookmark sync", () => {
  it("union-merges remote bookmarks per hadithId, keeping newer createdAt", async () => {
    await HadithRepository.toggleBookmark({
      id: "bukhari:1",
      collection: "bukhari",
      number: "1",
    });
    const local = (await HadithRepository.getBookmarks())[0];
    expect(local).toBeDefined();
    await writeJSON(DB_KEYS.hadithBookmarksUpdatedAt, "2026-07-02T00:00:00.000Z");
    await HadithRepository.applyRemoteBookmarks(
      [
        {
          id: "remote-old",
          hadithId: "bukhari:1",
          collection: "bukhari",
          number: "1",
          createdAt: "2026-07-01T00:00:00.000Z",
        },
        {
          id: "remote-new",
          hadithId: "muslim:2",
          collection: "muslim",
          number: "2",
          createdAt: "2026-07-05T00:00:00.000Z",
        },
      ],
      "2026-07-04T00:00:00.000Z",
    );

    const bookmarks = await HadithRepository.getBookmarks();
    expect(bookmarks).toHaveLength(2);
    expect(bookmarks.find((bm) => bm.hadithId === "bukhari:1")?.id).toBe(local?.id);
    expect(bookmarks.find((bm) => bm.hadithId === "muslim:2")?.id).toBe("remote-new");
    expect(await HadithRepository.getBookmarksUpdatedAt()).toBe("2026-07-04T00:00:00.000Z");
  });
});
