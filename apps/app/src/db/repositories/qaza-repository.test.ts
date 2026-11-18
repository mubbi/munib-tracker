import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "../keys";
import { readJSON, writeJSON } from "../store";
import { QazaRepository } from "./qaza-repository";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

const today = () => getLocalDateString();

describe("counters", () => {
  it("coerces polluted stored counts to non-negative integers", async () => {
    await writeJSON(DB_KEYS.qazaCounters, {
      fajr: { remaining: "4.6", completed: "abc" },
      isha: { remaining: -3, completed: 2 },
    });
    expect(await QazaRepository.getCounter("fajr")).toMatchObject({ remaining: 5, completed: 0 });
    expect(await QazaRepository.getCounter("isha")).toMatchObject({ remaining: 0, completed: 2 });
  });

  it("incrementRemaining adds owed qaza and never drops below zero", async () => {
    await QazaRepository.incrementRemaining("asr", 2);
    expect((await QazaRepository.incrementRemaining("asr", -5)).remaining).toBe(0);
    expect((await QazaRepository.incrementRemaining("asr")).remaining).toBe(1);
  });

  it("performQaza with nothing owed records no progress", async () => {
    await QazaRepository.performQaza("dhuhr");
    expect(await QazaRepository.getDailyProgress(today())).toEqual({
      date: today(),
      completed: {},
    });
  });

  it("performQaza moves at most the remaining count and logs today's progress", async () => {
    await QazaRepository.setCounter("dhuhr", 2, 0);
    expect(await QazaRepository.performQaza("dhuhr", 5)).toMatchObject({
      remaining: 0,
      completed: 2,
    });
    expect((await QazaRepository.getDailyProgress(today())).completed.dhuhr).toBe(2);
  });

  it("performQaza rolls the counter back when daily progress cannot be saved", async () => {
    await QazaRepository.setCounter("maghrib", 3, 1);
    jest.spyOn(QazaRepository, "incrementDailyProgress").mockRejectedValueOnce(new Error("disk"));

    await expect(QazaRepository.performQaza("maghrib")).rejects.toThrow("disk");

    expect(await QazaRepository.getCounter("maghrib")).toMatchObject({
      remaining: 3,
      completed: 1,
    });
  });
});

describe("undoQaza", () => {
  it("does nothing when no qaza was completed", async () => {
    await QazaRepository.undoQaza("fajr");
    expect(await QazaRepository.getCounter("fajr")).toMatchObject({ remaining: 0, completed: 0 });
  });

  it("debits the most recent days that still have progress", async () => {
    await QazaRepository.setCounter("isha", 0, 3);
    await QazaRepository.incrementDailyProgress("isha", "2026-07-01", 2);
    await QazaRepository.incrementDailyProgress("isha", "2026-07-02", 1);
    await QazaRepository.incrementDailyProgress("fajr", "2026-07-03", 1);

    expect(await QazaRepository.undoQaza("isha", 2)).toMatchObject({ remaining: 2, completed: 1 });

    const progress = await QazaRepository.getAllDailyProgress();
    expect(progress["2026-07-02"]?.completed.isha).toBe(0);
    expect(progress["2026-07-01"]?.completed.isha).toBe(1);
  });

  it("debits today for completions that have no logged day", async () => {
    await QazaRepository.setCounter("asr", 0, 2);
    await QazaRepository.undoQaza("asr", 2);
    expect((await QazaRepository.getDailyProgress(today())).completed.asr).toBe(0);
  });
});

describe("daily progress", () => {
  it("normalises stored progress and defaults missing days", async () => {
    await writeJSON(DB_KEYS.qazaDailyProgress, {
      "2026-07-01": { date: "2026-07-01", completed: { fajr: 2.4, zuhr: 9 } },
    });
    expect(await QazaRepository.getDailyProgress("2026-07-01")).toEqual({
      date: "2026-07-01",
      completed: { fajr: 2 },
    });
    expect(await QazaRepository.getDailyProgress("2026-07-02")).toEqual({
      date: "2026-07-02",
      completed: {},
    });
  });

  it("increment and decrement clamp at zero", async () => {
    await QazaRepository.incrementDailyProgress("fajr", "2026-07-01", -2);
    expect(
      (await QazaRepository.decrementDailyProgress("fajr", "2026-07-01", 5)).completed.fajr,
    ).toBe(0);
    expect((await QazaRepository.decrementDailyProgress("asr", "2026-07-09")).completed.asr).toBe(
      0,
    );
  });
});

describe("schedule and plans", () => {
  it("clamps schedule targets to 0–999", async () => {
    expect(
      await QazaRepository.setSchedule({ targets: { fajr: 1500, asr: -2, isha: 2.6 } }),
    ).toEqual({ targets: { fajr: 999, asr: 0, isha: 3 } });
    expect(await QazaRepository.getSchedule()).toEqual({ targets: { fajr: 999, asr: 0, isha: 3 } });
  });

  it("falls back to the latest legacy daily plan", async () => {
    await QazaRepository.setPlan({ date: "2026-07-01", targets: { fajr: 1 } } as never);
    await QazaRepository.setPlan({ date: "2026-07-05", targets: { asr: 4 } } as never);
    expect(await QazaRepository.getPlan("2026-07-01")).toMatchObject({ targets: { fajr: 1 } });
    expect(await QazaRepository.getSchedule()).toEqual({ targets: { asr: 4 } });
  });

  it("returns an empty schedule when nothing is stored", async () => {
    expect(await QazaRepository.getSchedule()).toEqual({ targets: {} });
  });

  it("tolerates a legacy plan without targets", async () => {
    await writeJSON(DB_KEYS.qazaDailyPlans, { "2026-07-01": { date: "2026-07-01" } });
    expect(await QazaRepository.getSchedule()).toEqual({ targets: {} });
  });
});

describe("roza", () => {
  it("setRoza rounds counts and stamps a time unless one is supplied", async () => {
    const local = await QazaRepository.setRoza({ remaining: 2.6, completed: -1 });
    expect(local).toMatchObject({ remaining: 3, completed: 0, updatedAt: expect.any(String) });
    const remote = await QazaRepository.setRoza({
      remaining: 1,
      completed: 1,
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(remote.updatedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("performRoza moves at most the remaining days", async () => {
    await QazaRepository.setRoza({ remaining: 2, completed: 0, estimatedMissed: 10 });
    expect(await QazaRepository.performRoza(5)).toMatchObject({
      remaining: 0,
      completed: 2,
      estimatedMissed: 10,
    });
    expect((await QazaRepository.performRoza()).completed).toBe(2);
  });

  it("resetRoza zeroes the counter", async () => {
    await QazaRepository.setRoza({ remaining: 2, completed: 3 });
    expect(await QazaRepository.resetRoza()).toMatchObject({ remaining: 0, completed: 0 });
  });

  it("applyRemoteRoza keeps a newer local value", async () => {
    await QazaRepository.setRoza({ remaining: 5, completed: 0, updatedAt: "2026-07-02T00:00:00Z" });
    await QazaRepository.applyRemoteRoza({
      remaining: 1,
      completed: 1,
      updatedAt: "2026-07-01T00:00:00Z",
    });
    expect((await QazaRepository.getRoza()).remaining).toBe(5);
  });

  it("applyRemoteRoza writes a newer remote value", async () => {
    await QazaRepository.applyRemoteRoza({
      remaining: 1.4,
      completed: -2,
      estimatedMissed: 30,
      updatedAt: "2026-07-03T00:00:00Z",
    });
    expect(await readJSON(DB_KEYS.qazaRoza, null)).toEqual({
      remaining: 1,
      completed: 0,
      estimatedMissed: 30,
      updatedAt: "2026-07-03T00:00:00Z",
    });
  });
});
