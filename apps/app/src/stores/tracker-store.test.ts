import { QazaRepository } from "@/db";
import { loadTrackerStore, resetTrackerStore } from "@/test-support/store";

import { trackerStore } from "./tracker-store";

beforeEach(resetTrackerStore);

describe("trackerStore", () => {
  it("becomes ready after load", () => {
    expect(trackerStore.getState().isReady).toBe(true);
  });

  it("marks a prayer completed and updates the daily summary + streak", async () => {
    await trackerStore.getState().setPrayerStatus("fajr", "completed");
    const state = trackerStore.getState();
    expect(state.prayerStatus.fajr).toBe("completed");
    expect(state.summary.salahCompleted).toBe(1);
    expect(state.streakDays).toBe(1);
  });

  it("increments the qaza counter when an obligatory prayer is missed and confirmed", async () => {
    await trackerStore.getState().setPrayerStatus("dhuhr", "missed", { addToQaza: true });
    expect((await QazaRepository.getCounter("dhuhr")).remaining).toBe(1);
  });

  it("does not increment qaza when missed without confirmation", async () => {
    await trackerStore.getState().setPrayerStatus("dhuhr", "missed", { addToQaza: false });
    expect((await QazaRepository.getCounter("dhuhr")).remaining).toBe(0);
  });

  it("increments the qaza counter when an obligatory prayer is marked qaza and confirmed", async () => {
    await trackerStore.getState().setPrayerStatus("isha", "qaza", { addToQaza: true });
    expect((await QazaRepository.getCounter("isha")).remaining).toBe(1);
  });

  it("does not double-increment when switching between missed and qaza with qaza linked", async () => {
    await trackerStore.getState().setPrayerStatus("maghrib", "missed", { addToQaza: true });
    await trackerStore.getState().setPrayerStatus("maghrib", "qaza");
    expect((await QazaRepository.getCounter("maghrib")).remaining).toBe(1);
  });

  it("reverses the qaza debt when a missed prayer is later completed", async () => {
    await trackerStore.getState().setPrayerStatus("asr", "missed", { addToQaza: true });
    await trackerStore.getState().setPrayerStatus("asr", "completed");
    expect((await QazaRepository.getCounter("asr")).remaining).toBe(0);
  });

  it("performs qaza: remaining decreases and completed increases", async () => {
    await trackerStore.getState().adjustQaza("isha", 3, 0);
    await trackerStore.getState().performQaza("isha");
    const counter = await QazaRepository.getCounter("isha");
    expect(counter.remaining).toBe(2);
    expect(counter.completed).toBe(1);
  });

  it("applies calculator counters in one shot and updates the store immediately", async () => {
    const applyPromise = trackerStore.getState().setQazaCounters({
      fajr: { remaining: 100, completed: 1 },
      dhuhr: { remaining: 100, completed: 0 },
      asr: { remaining: 100, completed: 0 },
      maghrib: { remaining: 100, completed: 0 },
      isha: { remaining: 100, completed: 0 },
      witr: { remaining: 100, completed: 0 },
    });
    // Flush the mutation queue microtask so the optimistic set() runs.
    await Promise.resolve();

    const optimistic = trackerStore.getState().qazaCounters;
    expect(optimistic.find((c) => c.prayerId === "fajr")).toMatchObject({
      remaining: 100,
      completed: 1,
    });
    expect(optimistic.reduce((sum, c) => sum + c.remaining, 0)).toBe(600);

    await applyPromise;
    expect((await QazaRepository.getCounter("fajr")).remaining).toBe(100);
    expect(trackerStore.getState().qazaCounters.find((c) => c.prayerId === "witr")?.remaining).toBe(
      100,
    );
  });

  it("optimistically reflects a single adjustQaza before refresh settles", async () => {
    const promise = trackerStore.getState().adjustQaza("fajr", 42, 3);
    await Promise.resolve();
    expect(trackerStore.getState().qazaCounters.find((c) => c.prayerId === "fajr")).toMatchObject({
      remaining: 42,
      completed: 3,
    });
    await promise;
    expect(await QazaRepository.getCounter("fajr")).toMatchObject({ remaining: 42, completed: 3 });
  });

  it("tracks daily zikr counts and completion", async () => {
    await trackerStore.getState().incrementZikr("zikr-morning", 3);
    await trackerStore.getState().incrementZikr("zikr-morning", 3);
    await trackerStore.getState().incrementZikr("zikr-morning", 3);
    expect(trackerStore.getState().zikrCounts["zikr-morning"]).toBe(3);
    expect(trackerStore.getState().summary.zikrCompleted).toBe(1);
  });

  it("tracks after-salah adhkar separately per fard prayer", async () => {
    await trackerStore.getState().setZikrCount("after_prayer-tasbih", 33, 33, { prayerId: "fajr" });
    await trackerStore
      .getState()
      .setZikrCount("after_prayer-tasbih", 10, 33, { prayerId: "dhuhr" });

    expect(trackerStore.getState().zikrCounts["after_prayer-tasbih::fajr"]).toBe(33);
    expect(trackerStore.getState().zikrCounts["after_prayer-tasbih::dhuhr"]).toBe(10);
    expect(trackerStore.getState().summary.zikrCompleted).toBe(1);
  });

  it("reverses achievement stats when a completed prayer is undone", async () => {
    await trackerStore.getState().setPrayerStatus("fajr", "completed");
    expect(trackerStore.getState().achievementStats.prayersCompleted).toBe(1);
    const noorBefore = trackerStore.getState().devotionProgress.noor;

    await trackerStore.getState().setPrayerStatus("fajr", "pending");
    expect(trackerStore.getState().achievementStats.prayersCompleted).toBe(0);
    expect(trackerStore.getState().devotionProgress.noor).toBeLessThan(noorBefore);
  });

  it("reverses zikr completion in achievement stats when count drops below target", async () => {
    await trackerStore.getState().setZikrCount("zikr-morning", 3, 3);
    expect(trackerStore.getState().achievementStats.zikrCompleted).toBe(1);

    await trackerStore.getState().setZikrCount("zikr-morning", 2, 3);
    expect(trackerStore.getState().achievementStats.zikrCompleted).toBe(0);
  });

  it("persists prayer status across a reload (offline, no network)", async () => {
    await trackerStore.getState().setPrayerStatus("maghrib", "completed");
    await loadTrackerStore();
    expect(trackerStore.getState().prayerStatus.maghrib).toBe("completed");
  });
});
