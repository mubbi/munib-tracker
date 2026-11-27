import type { PrayerLog } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PrayerRepository } from "./prayer-repository";

const DAY = "2026-07-03";

const log = (overrides: Partial<PrayerLog> = {}): PrayerLog => ({
  id: "p1",
  prayerId: "fajr",
  date: DAY,
  status: "completed",
  updatedAt: "2026-07-03T05:00:00.000Z",
  source: "manual",
  ...overrides,
});

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("setStatus", () => {
  it("keeps the qaza-debt flag unless the patch sets it", async () => {
    await PrayerRepository.setStatus("asr", DAY, "missed", { qazaDebtAdded: true });
    const next = await PrayerRepository.setStatus("asr", DAY, "completed");
    expect(next.qazaDebtAdded).toBe(true);
    expect(
      (await PrayerRepository.setStatus("asr", DAY, "completed", { qazaDebtAdded: false }))
        .qazaDebtAdded,
    ).toBe(false);
  });
});

describe("setNotes", () => {
  it("creates a pending log with the note", async () => {
    expect(await PrayerRepository.setNotes("isha", DAY, "late")).toMatchObject({
      status: "pending",
      notes: "late",
    });
  });

  it("keeps the existing status", async () => {
    await PrayerRepository.setStatus("isha", DAY, "delayed");
    expect((await PrayerRepository.setNotes("isha", DAY, "n")).status).toBe("delayed");
  });
});

describe("setFlags", () => {
  it("creates a pending log flagged as jama", async () => {
    expect(await PrayerRepository.setFlags("dhuhr", DAY, { isJama: true })).toMatchObject({
      status: "pending",
      isJama: true,
    });
  });

  it("keeps the status and previous flags", async () => {
    await PrayerRepository.setStatus("dhuhr", DAY, "completed", { notes: "n" });
    await PrayerRepository.setFlags("dhuhr", DAY, { isJama: true });
    expect(
      await PrayerRepository.setFlags("dhuhr", DAY, { isExcused: true, excusedReason: "travel" }),
    ).toMatchObject({
      status: "completed",
      notes: "n",
      isJama: true,
      isExcused: true,
      excusedReason: "travel",
    });
  });

  it("clears the reason when the excuse is lifted", async () => {
    await PrayerRepository.setFlags("dhuhr", DAY, { isExcused: true, excusedReason: "sick" });
    expect(await PrayerRepository.setFlags("dhuhr", DAY, { isExcused: false })).toMatchObject({
      isExcused: false,
      excusedReason: undefined,
    });
  });
});

describe("partial updates keep every wave-3 field (regression)", () => {
  const seeded = log({
    prayerId: "dhuhr",
    status: "completed",
    notes: "n",
    isJama: true,
    combinedWith: "asr",
    combineMode: "taqdim",
    rakahs: 4,
    late: true,
  });
  const kept = {
    combinedWith: "asr",
    combineMode: "taqdim",
    rakahs: 4,
    late: true,
    isJama: true,
  };

  beforeEach(async () => {
    await PrayerRepository.upsertLog(seeded);
  });

  it("setStatus keeps rakahs / late / combine fields", async () => {
    expect(await PrayerRepository.setStatus("dhuhr", DAY, "missed")).toMatchObject({
      ...kept,
      status: "missed",
      notes: "n",
    });
  });

  it("setNotes keeps rakahs / late / combine fields", async () => {
    expect(await PrayerRepository.setNotes("dhuhr", DAY, "x")).toMatchObject({
      ...kept,
      status: "completed",
      notes: "x",
    });
  });

  it("setFlags keeps rakahs / late and unrelated flags", async () => {
    expect(
      await PrayerRepository.setFlags("dhuhr", DAY, { isExcused: true, excusedReason: "travel" }),
    ).toMatchObject({ ...kept, isExcused: true, notes: "n" });
  });

  it("setRawatib keeps the note and any other flags", async () => {
    await PrayerRepository.upsertLog(log({ prayerId: "dhuhr_before", notes: "s", rakahs: 4 }));
    expect(await PrayerRepository.setRawatib("dhuhr_before", DAY, false)).toMatchObject({
      status: "pending",
      notes: "s",
      rakahs: 4,
    });
  });
});

describe("applyRemoteLog", () => {
  it("inserts a log the device does not have", async () => {
    await PrayerRepository.applyRemoteLog(log());
    await expect(PrayerRepository.getLog("fajr", DAY)).resolves.toEqual(log());
  });

  it("keeps a newer or equal local log", async () => {
    await PrayerRepository.upsertLog(log({ status: "delayed" }));
    await PrayerRepository.applyRemoteLog(log({ status: "missed" }));
    expect((await PrayerRepository.getLog("fajr", DAY))?.status).toBe("delayed");
  });

  it("replaces an older local log", async () => {
    await PrayerRepository.upsertLog(log({ status: "delayed" }));
    await PrayerRepository.applyRemoteLog(
      log({ status: "missed", updatedAt: "2026-07-03T09:00:00.000Z" }),
    );
    expect((await PrayerRepository.getLog("fajr", DAY))?.status).toBe("missed");
  });
});

describe("clear", () => {
  it("removes every log", async () => {
    await PrayerRepository.upsertLog(log());
    await PrayerRepository.clear();
    await expect(PrayerRepository.getAll()).resolves.toEqual([]);
  });
});
