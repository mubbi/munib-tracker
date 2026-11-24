import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { QazaRepository } from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import {
  hijriToGregorian,
  resetHijriAdjustmentCacheForTests,
  setHijriAdjustment,
  setHijriObserver,
} from "@/lib/hijri";
import {
  blockReasonFor,
  buildFastingContext,
  clearFast,
  computeVoluntaryFastingStats,
  fastingDaysForRange,
  isIntendedFast,
  isPilgrimForHijriYear,
  isPilgrimThisSeason,
  markFast,
  pilgrimPrefsPatch,
  resolveVoluntaryFastingPrefs,
  setFastAsQaza,
  toggleEnabledKind,
} from "@/lib/voluntary-fasting";
import { preferencesStore } from "@/stores/preferences-store";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";

const key = (y: number, m: number, d: number) => getLocalDateString(hijriToGregorian(y, m, d));

beforeEach(async () => {
  await AsyncStorage.clear();
  setHijriObserver(null);
  setHijriAdjustment(null);
  resetHijriAdjustmentCacheForTests();
  voluntaryFastingStore.setState({ entries: {}, isReady: false });
  preferencesStore.setState({ prefs: { ...DEFAULT_USER_PREFERENCES, madhhab: "hanafi" } });
});

afterAll(() => {
  setHijriAdjustment(null);
  resetHijriAdjustmentCacheForTests();
});

describe("calendar over the real Hijri engine (Umm al-Qura)", () => {
  it("classifies a full Hijri year: 5 blocked days, Ramadan excluded, seasonal kinds placed", () => {
    const from = key(1448, 1, 1);
    const to = addDays(key(1449, 1, 1), -1);
    const days = fastingDaysForRange(
      from,
      to,
      buildFastingContext(preferencesStore.getState().prefs),
    );
    expect(days.length).toBeGreaterThanOrEqual(354);
    expect(days.filter((d) => d.classification.blocking).map((d) => d.date)).toEqual([
      key(1448, 10, 1),
      key(1448, 12, 10),
      key(1448, 12, 11),
      key(1448, 12, 12),
      key(1448, 12, 13),
    ]);
    const ramadan = days.filter((d) => d.classification.isRamadan);
    expect(ramadan[0]?.date).toBe(key(1448, 9, 1));
    const arafah = days.find((d) => d.classification.kinds.includes("arafah"));
    expect(arafah?.date).toBe(key(1448, 12, 9));
    const ashura = days.find((d) => d.classification.kinds.includes("ashura"));
    expect(ashura?.date).toBe(key(1448, 1, 10));
  });

  it("follows a moon-sighting override (Hijri adjustment, D14)", () => {
    const eidBefore = key(1448, 10, 1);
    setHijriAdjustment({ offsetDays: 1, updatedAt: "2026-11-23T00:00:00.000Z" });
    resetHijriAdjustmentCacheForTests();
    const eidAfter = key(1448, 10, 1);
    expect(eidAfter).not.toBe(eidBefore);
    const [day] = fastingDaysForRange(
      eidAfter,
      eidAfter,
      buildFastingContext(preferencesStore.getState().prefs),
    );
    expect(day?.classification.blocking).toBe(true);
  });

  it("Shafi'i users see late Sha'ban as not permitted; Hanafi as recommended", () => {
    const d = key(1448, 8, 20);
    const ctx = (madhhab: "shafii" | "hanafi") =>
      buildFastingContext({
        ...DEFAULT_USER_PREFERENCES,
        madhhab,
        voluntaryFasting: { ...resolveVoluntaryFastingPrefs(null), enabledKinds: [] },
      });
    expect(fastingDaysForRange(d, d, ctx("shafii"))[0]?.classification.ruling).toBe("prohibited");
    expect(fastingDaysForRange(d, d, ctx("hanafi"))[0]?.classification.ruling).toMatch(
      /recommended|disliked/,
    );
  });
});

describe("prefs", () => {
  it("sanitises malformed prefs and keeps canonical kind order", () => {
    const prefs = resolveVoluntaryFastingPrefs({
      enabledKinds: ["ashura", "bogus", "monday"],
      dawudMode: { startDate: "nope" },
      intentReminderTime: "isha+900",
      suhoorAlarm: "yes",
    });
    expect(prefs.enabledKinds).toEqual(["monday", "ashura"]);
    expect(prefs.dawudMode).toBeNull();
    expect(prefs.intentReminderTime).toBe("isha+240");
    expect(prefs.suhoorAlarm).toBe(false);
    expect(toggleEnabledKind(prefs, "arafah").enabledKinds).toEqual(["monday", "arafah", "ashura"]);
    expect(toggleEnabledKind(prefs, "monday").enabledKinds).toEqual(["ashura"]);
  });
});

describe("pilgrim answer is scoped to one Hijri year", () => {
  it("stores this season's year and expires after that Dhul-Hijjah", () => {
    const during = hijriToGregorian(1448, 12, 5);
    const patch = pilgrimPrefsPatch(true, during);
    expect(patch).toEqual({ isPilgrimThisYear: true, pilgrimHijriYear: 1448 });
    expect(isPilgrimForHijriYear(patch, 1448)).toBe(true);
    expect(isPilgrimThisSeason(patch, during)).toBe(true);
    // After 13 Dhul-Hijjah the season rolls to next year: the answer reads off again.
    expect(isPilgrimThisSeason(patch, hijriToGregorian(1448, 12, 20))).toBe(false);
    expect(isPilgrimForHijriYear(patch, 1449)).toBe(false);
    // Turning it on after the season targets the next Hajj.
    expect(pilgrimPrefsPatch(true, hijriToGregorian(1448, 12, 20)).pilgrimHijriYear).toBe(1449);
    expect(pilgrimPrefsPatch(false)).toEqual({ isPilgrimThisYear: false, pilgrimHijriYear: null });
  });

  it("only this year's Arafah drops the fast kinds", () => {
    const prefs = {
      ...DEFAULT_USER_PREFERENCES,
      voluntaryFasting: {
        ...resolveVoluntaryFastingPrefs(null),
        ...pilgrimPrefsPatch(true, hijriToGregorian(1448, 11, 1)),
      },
    };
    const ctx = buildFastingContext(prefs);
    const [thisYear] = fastingDaysForRange(key(1448, 12, 9), key(1448, 12, 9), ctx);
    const [nextYear] = fastingDaysForRange(key(1449, 12, 9), key(1449, 12, 9), ctx);
    expect(thisYear?.classification.kinds).not.toContain("arafah");
    expect(nextYear?.classification.kinds).toContain("arafah");
  });

  it("resolve keeps an integer year and drops junk", () => {
    expect(resolveVoluntaryFastingPrefs({ pilgrimHijriYear: 1448 }).pilgrimHijriYear).toBe(1448);
    expect(resolveVoluntaryFastingPrefs({ pilgrimHijriYear: "x" }).pilgrimHijriYear).toBeNull();
  });
});

describe("markFast / qaza link", () => {
  const today = "2026-07-01";
  const plainDay = "2026-07-08";

  it("blocks Eid and Tashriq, hayd (fasted only) and Ramadan", () => {
    const blocking = { blocking: true, isRamadan: false };
    const open = { blocking: false, isRamadan: false };
    expect(blockReasonFor("fasted", blocking, null)).toBe("eid_tashriq");
    expect(blockReasonFor("intended", blocking, null)).toBe("eid_tashriq");
    expect(blockReasonFor("broken", blocking, null)).toBeNull();
    expect(blockReasonFor("fasted", open, "hayd")).toBe("hayd");
    expect(blockReasonFor("intended", open, "hayd")).toBeNull();
    // Nifas carries the same ruling as hayd.
    expect(blockReasonFor("fasted", open, "nifas")).toBe("nifas");
    expect(blockReasonFor("intended", open, "nifas")).toBeNull();
    expect(blockReasonFor("fasted", open, "travel")).toBeNull();
    expect(blockReasonFor("fasted", open, "sick")).toBeNull();
    expect(blockReasonFor("fasted", { blocking: false, isRamadan: true }, null)).toBe("ramadan");
  });

  it("refuses to log Eid as fasted", async () => {
    const eid = key(1448, 10, 1);
    const result = await markFast(eid, "fasted", { today });
    expect(result).toEqual({ ok: false, reason: "eid_tashriq" });
    expect(isIntendedFast(eid)).toBe(false);
  });

  it("refuses fasted while the active excused reason is hayd", async () => {
    preferencesStore.setState({
      prefs: { ...DEFAULT_USER_PREFERENCES, activeExcusedReason: "hayd" },
    });
    expect(await markFast(plainDay, "fasted", { today })).toEqual({ ok: false, reason: "hayd" });
    expect((await markFast(plainDay, "intended", { today })).ok).toBe(true);
  });

  it("refuses fasted while the active excused reason is nifas", async () => {
    preferencesStore.setState({
      prefs: { ...DEFAULT_USER_PREFERENCES, activeExcusedReason: "nifas" },
    });
    expect(await markFast(plainDay, "fasted", { today })).toEqual({ ok: false, reason: "nifas" });
    expect(isIntendedFast(plainDay)).toBe(false);
  });

  it("refuses 13 Dhul-Hijjah (Tashriq) even though it is the lunar 13th", async () => {
    const result = await markFast(key(1448, 12, 13), "fasted", { today });
    expect(result).toEqual({ ok: false, reason: "eid_tashriq" });
  });

  it("decrements roza debt once and restores it on undo (idempotent)", async () => {
    await QazaRepository.setRoza({ remaining: 3, completed: 0 });
    await markFast(plainDay, "fasted", { asQaza: true, today });
    await markFast(plainDay, "fasted", { asQaza: true, today });
    expect((await QazaRepository.getRoza()).remaining).toBe(2);
    expect(voluntaryFastingStore.getState().entries[plainDay]?.qazaCounted).toBe(true);

    await setFastAsQaza(plainDay, false);
    expect(await QazaRepository.getRoza()).toMatchObject({ remaining: 3, completed: 0 });

    await setFastAsQaza(plainDay, true);
    expect((await QazaRepository.getRoza()).remaining).toBe(2);
    await markFast(plainDay, "broken", { today });
    expect((await QazaRepository.getRoza()).remaining).toBe(3);

    await markFast(plainDay, "fasted", { today });
    expect((await QazaRepository.getRoza()).remaining).toBe(2);
    await clearFast(plainDay);
    expect((await QazaRepository.getRoza()).remaining).toBe(3);
    const stored = await readJSON<Record<string, { deleted?: boolean; qazaCounted?: boolean }>>(
      DB_KEYS.voluntaryFasting,
      {},
    );
    expect(stored[plainDay]).toMatchObject({ deleted: true });
    expect(stored[plainDay]?.qazaCounted).toBeUndefined();
  });

  it("keeps the qaza flag without decrementing when no debt is owed", async () => {
    await QazaRepository.setRoza({ remaining: 0, completed: 4 });
    await markFast(plainDay, "fasted", { asQaza: true, today });
    expect((await QazaRepository.getRoza()).completed).toBe(4);
    expect(voluntaryFastingStore.getState().entries[plainDay]).toMatchObject({ asQaza: true });
    expect(voluntaryFastingStore.getState().entries[plainDay]?.qazaCounted).toBeUndefined();
  });

  it("stats count kept fasts and qaza fasts", async () => {
    await markFast(plainDay, "fasted", { today });
    await markFast(addDays(plainDay, 1), "intended", { today });
    const entries = voluntaryFastingStore.getState().entries;
    const stats = computeVoluntaryFastingStats(
      entries,
      buildFastingContext(preferencesStore.getState().prefs),
      "2026-07-10",
    );
    expect(stats.totalFasted).toBe(1);
    expect(stats.last30Days).toBe(1);
    expect(stats.qazaFasted).toBe(0);
  });
});
