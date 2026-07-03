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

  it("increments the qaza counter when an obligatory prayer is missed", async () => {
    await trackerStore.getState().setPrayerStatus("dhuhr", "missed");
    expect((await QazaRepository.getCounter("dhuhr")).remaining).toBe(1);
  });

  it("reverses the qaza debt when a missed prayer is later completed", async () => {
    await trackerStore.getState().setPrayerStatus("asr", "missed");
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

  it("tracks daily zikr counts and completion", async () => {
    await trackerStore.getState().incrementZikr("zikr-morning", 3);
    await trackerStore.getState().incrementZikr("zikr-morning", 3);
    await trackerStore.getState().incrementZikr("zikr-morning", 3);
    expect(trackerStore.getState().zikrCounts["zikr-morning"]).toBe(3);
    expect(trackerStore.getState().summary.zikrCompleted).toBe(1);
  });

  it("persists prayer status across a reload (offline, no network)", async () => {
    await trackerStore.getState().setPrayerStatus("maghrib", "completed");
    await loadTrackerStore();
    expect(trackerStore.getState().prayerStatus.maghrib).toBe("completed");
  });
});
