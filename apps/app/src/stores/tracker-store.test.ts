import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { act, renderHook } from "@testing-library/react-native";

import { PrayerRepository, PreferencesRepository, QazaRepository } from "@/db";
import { onTrackingChanged } from "@/lib/sync/tracking-changes";
import { loadTrackerStore, resetTrackerStore } from "@/test-support/store";

import { preferencesStore } from "./preferences-store";
import {
  trackerStore,
  useAchievementStats,
  useDailySummary,
  useDayExcused,
  useDevotionProgress,
  usePrayerJama,
  usePrayerJamaMap,
  usePrayerStatus,
  useQazaCounters,
  useQazaDailyProgress,
  useQazaSchedule,
  useQazaSummary,
  useRoza,
  useStreak,
  useTodayPrayers,
  useTrackerActions,
  useTrackerReady,
  useZikrCount,
  useZikrCounts,
} from "./tracker-store";

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

  it("continues an active hayd period onto a new day until resumed (NF-1.2)", async () => {
    await trackerStore.getState().setDayExcused("hayd");
    expect(trackerStore.getState().excusedReason).toBe("hayd");
    expect((await PreferencesRepository.get()).activeExcusedReason).toBe("hayd");

    const today = getLocalDateString();
    const yesterday = addDays(today, -1);
    // Seed yesterday as the start of the period, then clear today to simulate
    // a calendar rollover with an active preference still set.
    for (const prayerId of OBLIGATORY_PRAYERS) {
      await PrayerRepository.setFlags(prayerId, yesterday, {
        isExcused: true,
        excusedReason: "hayd",
      });
      await PrayerRepository.setFlags(prayerId, today, { isExcused: false });
    }

    await trackerStore.getState().refresh();
    expect(trackerStore.getState().excusedReason).toBe("hayd");
    const logs = await PrayerRepository.getAll();
    expect(logs.some((log) => log.date === today && log.isExcused)).toBe(true);

    await trackerStore.getState().setDayExcused(null);
    expect(trackerStore.getState().excusedReason).toBeNull();
    expect((await PreferencesRepository.get()).activeExcusedReason).toBeNull();

    await trackerStore.getState().refresh();
    expect(trackerStore.getState().excusedReason).toBeNull();
  });

  it("does not start a period when only a past calendar day is marked excused", async () => {
    const yesterday = addDays(getLocalDateString(), -1);
    await trackerStore.getState().setDayExcusedOnDate(yesterday, "sick");
    expect((await PreferencesRepository.get()).activeExcusedReason).toBeUndefined();
    expect(trackerStore.getState().excusedReason).toBeNull();
  });

  it("bootstraps a legacy overnight hayd period from yesterday when preference is unset", async () => {
    const today = getLocalDateString();
    const yesterday = addDays(today, -1);
    for (const prayerId of OBLIGATORY_PRAYERS) {
      await PrayerRepository.setFlags(prayerId, yesterday, {
        isExcused: true,
        excusedReason: "hayd",
      });
    }

    await trackerStore.getState().refresh();
    expect(trackerStore.getState().excusedReason).toBe("hayd");
    expect((await PreferencesRepository.get()).activeExcusedReason).toBe("hayd");
    expect(
      (await PrayerRepository.getAll()).some((log) => log.date === today && log.isExcused),
    ).toBe(true);
  });

  it("switches the active period reason and updates the preference", async () => {
    await trackerStore.getState().setDayExcused("hayd");
    await trackerStore.getState().setDayExcused("sick");
    expect(trackerStore.getState().excusedReason).toBe("sick");
    expect((await PreferencesRepository.get()).activeExcusedReason).toBe("sick");
  });

  it("writes the excused reason through the repository when preferences are not ready", async () => {
    preferencesStore.setState({ isReady: false });
    await trackerStore.getState().setDayExcused("travel");
    expect((await PreferencesRepository.get()).activeExcusedReason).toBe("travel");
  });

  it("updates the in-memory preferences store once it is ready", async () => {
    await preferencesStore.getState().load();
    await trackerStore.getState().setDayExcused("hayd");
    expect(preferencesStore.getState().prefs.activeExcusedReason).toBe("hayd");
  });
});

describe("trackerStore notes, jama and past days", () => {
  const state = () => trackerStore.getState();
  const yesterday = () => addDays(getLocalDateString(), -1);

  it("setPrayerNotes stores today's note", async () => {
    await state().setPrayerNotes("asr", "at the masjid");
    expect(state().prayerNotes.asr).toBe("at the masjid");
    expect((await PrayerRepository.getLog("asr", getLocalDateString()))?.notes).toBe(
      "at the masjid",
    );
  });

  it("setPrayerJama flags congregation for today", async () => {
    await state().setPrayerJama("maghrib", true);
    expect(state().prayerJama.maghrib).toBe(true);
  });

  it.each([
    ["status", () => state().setPrayerStatusOnDate(yesterday(), "isha", "completed")],
    ["notes", () => state().setPrayerNotesOnDate(yesterday(), "isha", "late")],
    ["jama", () => state().setPrayerJamaOnDate(yesterday(), "isha", true)],
  ])("editing a past day's %s leaves today's view alone", async (_label, edit) => {
    await edit();
    expect(state().prayerStatus.isha).toBeUndefined();
    expect(state().prayerNotes.isha).toBeUndefined();
    expect(state().prayerJama.isha).toBeUndefined();
    expect(await PrayerRepository.getLog("isha", yesterday())).toBeDefined();
  });

  it("setZikrCountOnDate for a past day only touches storage", async () => {
    await state().setZikrCountOnDate(yesterday(), "z1", 5, 10);
    expect(state().zikrCounts.z1).toBeUndefined();
  });

  it("setZikrCount clamps today's optimistic count at zero", async () => {
    await state().setZikrCount("z1", -4, 10);
    expect(state().zikrCounts.z1).toBe(0);
  });

  it("signals cloud sync after every persisted zikr write (per salah included)", async () => {
    const listener = jest.fn();
    const unsubscribe = onTrackingChanged(listener);
    try {
      await state().setZikrCount("after_prayer-tasbih", 5, 33, { prayerId: "fajr" });
      await state().incrementZikr("morning-protection", 3);
      await state().setZikrCounts([
        { zikrId: "after_prayer-tasbih", count: 33, target: 33, prayerId: "asr" },
        { zikrId: "after_prayer-tahmid", count: 33, target: 33, prayerId: "asr" },
      ]);
    } finally {
      unsubscribe();
    }
    expect(listener).toHaveBeenCalledTimes(3);
    expect(state().zikrCounts).toMatchObject({
      "after_prayer-tasbih::fajr": 5,
      "after_prayer-tasbih::asr": 33,
      "after_prayer-tahmid::asr": 33,
      "morning-protection": 1,
    });
  });

  it("clearing today's excuse ends the active period", async () => {
    await state().setDayExcused("travel");
    await state().setDayExcused(null);
    expect(state().excusedReason).toBeNull();
    expect((await PreferencesRepository.get()).activeExcusedReason).toBeNull();
  });
});

describe("trackerStore qaza and roza", () => {
  const state = () => trackerStore.getState();
  const counter = (id: string) => state().qazaCounters.find((c) => c.prayerId === id);

  it("performQaza with nothing remaining changes nothing", async () => {
    await state().performQaza("fajr");
    expect(counter("fajr")).toMatchObject({ remaining: 0, completed: 0 });
  });

  it("undoQaza moves a completed qaza back to remaining", async () => {
    await state().adjustQaza("asr", 2, 0);
    await state().performQaza("asr", 5);
    await state().undoQaza("asr");
    expect(counter("asr")).toMatchObject({ remaining: 1, completed: 1 });
  });

  it("resetQazaCounter zeroes one prayer", async () => {
    await state().adjustQaza("asr", 3, 1);
    await state().adjustQaza("isha", 2, 0);
    await state().resetQazaCounter("asr");
    expect(counter("asr")).toMatchObject({ remaining: 0, completed: 0 });
    expect(counter("isha")?.remaining).toBe(2);
  });

  it("resetAllQazaCounters zeroes every prayer", async () => {
    await state().adjustQaza("asr", 3, 1);
    await state().resetAllQazaCounters();
    expect(state().qazaCounters.every((c) => c.remaining === 0 && c.completed === 0)).toBe(true);
  });

  it("setQazaSchedule stores daily targets", async () => {
    await state().setQazaSchedule({ targets: { fajr: 2 } });
    expect(state().qazaSchedule.targets).toEqual({ fajr: 2 });
  });

  it("setRoza, performRoza and resetRoza drive the fasting debt", async () => {
    await state().setRoza({ remaining: 3, completed: 0 });
    await state().performRoza();
    expect(state().roza).toMatchObject({ remaining: 2, completed: 1 });
    await state().resetRoza();
    expect(state().roza).toMatchObject({ remaining: 0, completed: 0 });
  });

  it("refresh recomputes from storage", async () => {
    await QazaRepository.setCounter("dhuhr", 4, 0);
    await state().refresh();
    expect(counter("dhuhr")?.remaining).toBe(4);
  });
});

describe("tracker hooks", () => {
  function setup() {
    return renderHook(() => ({
      ready: useTrackerReady(),
      summary: useDailySummary(),
      streak: useStreak(),
      stats: useAchievementStats(),
      devotion: useDevotionProgress(),
      today: useTodayPrayers(),
      fajr: usePrayerStatus("fajr"),
      qaza: useQazaCounters(),
      schedule: useQazaSchedule(),
      daily: useQazaDailyProgress(),
      qazaSummary: useQazaSummary(),
      roza: useRoza(),
      zikr: useZikrCount("z1"),
      zikrCounts: useZikrCounts(),
      jama: usePrayerJama("fajr"),
      jamaMap: usePrayerJamaMap(),
      excused: useDayExcused(),
      actions: useTrackerActions(),
    }));
  }

  it("expose defaults for an empty day", async () => {
    const { result } = await setup();
    expect(result.current).toMatchObject({
      ready: true,
      fajr: "pending",
      zikr: 0,
      jama: false,
      excused: null,
      qazaSummary: { remaining: 0, completed: 0 },
    });
  });

  it("reflect every action", async () => {
    const { result } = await setup();
    const { actions } = result.current;
    await act(async () => {
      await actions.load();
      await actions.refresh();
      await actions.setPrayerStatus("fajr", "completed");
      await actions.setPrayerNotes("fajr", "n");
      await actions.setPrayerJama("fajr", true);
      await actions.setZikrCount("z1", 2, 10);
      await actions.incrementZikr("z1", 10);
      await actions.adjustQaza("asr", 5, 0);
      await actions.setQazaCounters({ isha: { remaining: 2, completed: 1 } });
      await actions.performQaza("asr");
      await actions.undoQaza("asr");
      await actions.performQaza("asr", 2);
      await actions.setQazaSchedule({ targets: { asr: 1 } });
      await actions.resetQazaCounter("isha");
      await actions.setRoza({ remaining: 2, completed: 0 });
      await actions.performRoza(1);
      await actions.setDayExcused(null);
    });
    expect(result.current).toMatchObject({
      fajr: "completed",
      today: { status: { fajr: "completed" }, notes: { fajr: "n" } },
      jama: true,
      jamaMap: { fajr: true },
      zikr: 3,
      zikrCounts: { z1: 3 },
      qazaSummary: { remaining: 3, completed: 2 },
      roza: { remaining: 1, completed: 1 },
      schedule: { targets: { asr: 1 } },
      streak: 1,
    });

    await act(async () => {
      await actions.resetAllQazaCounters();
      await actions.resetRoza();
    });
    expect(result.current.qazaSummary).toEqual({ remaining: 0, completed: 0 });
  });
});
