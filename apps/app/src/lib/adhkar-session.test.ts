import type { ZikrItem } from "@munib-tracker/shared/types";
import {
  adhkarScopeState,
  adhkarSetStatus,
  adhkarWindow,
  afterSalahPrayerForSlot,
  completeAllEntries,
  firstPendingIndex,
  nextPendingIndex,
  type PrayerInstants,
  resolveAfterSalahPrayer,
  sessionItems,
  sessionProgress,
} from "@/lib/adhkar-session";
import { loadZikrItemsSyncForTests } from "@/lib/search-corpora-test-loader";
import { __setZikrItemsForTests } from "@/lib/zikr";
import { zikrCountKey, zikrTarget } from "@/lib/zikr-count-key";

function item(overrides: Partial<ZikrItem> & Pick<ZikrItem, "id" | "categoryId">): ZikrItem {
  return {
    title: overrides.id,
    arabic: "",
    transliteration: "",
    translation: "",
    ...overrides,
  };
}

const MORNING: ZikrItem[] = [
  item({ id: "m-1", categoryId: "morning", targetCount: 1 }),
  item({ id: "m-3", categoryId: "morning", targetCount: 3 }),
  item({ id: "m-100", categoryId: "morning", targetCount: 100 }),
];

const AFTER: ZikrItem[] = [
  item({ id: "a-tasbih", categoryId: "after_prayer", targetCount: 33 }),
  item({ id: "a-fajr-only", categoryId: "after_prayer", targetCount: 1, prayers: ["fajr"] }),
  item({ id: "a-witr", categoryId: "after_prayer", targetCount: 3, prayers: ["witr"] }),
];

const day = (h: number, m = 0) => new Date(2026, 10, 20, h, m);
const TIMES: PrayerInstants = {
  fajr: day(5),
  sunrise: day(6, 30),
  dhuhr: day(12),
  asr: day(15, 30),
  maghrib: day(17, 45),
  isha: day(19, 15),
};

describe("zikrTarget", () => {
  it("defaults a missing or zero target to a single recitation", () => {
    expect(zikrTarget({})).toBe(1);
    expect(zikrTarget({ targetCount: 0 })).toBe(1);
    expect(zikrTarget({ targetCount: 33 })).toBe(33);
  });
});

describe("session ordering", () => {
  beforeEach(() => __setZikrItemsForTests([...MORNING, ...AFTER]));
  afterAll(() => __setZikrItemsForTests(loadZikrItemsSyncForTests()));

  const morning = { categoryId: "morning" as const };

  it("starts at the first pending zikr", () => {
    expect(firstPendingIndex(MORNING, {}, morning)).toBe(0);
    expect(firstPendingIndex(MORNING, { "m-1": 1 }, morning)).toBe(1);
    // Everything done: stay on the first one (review).
    expect(firstPendingIndex(MORNING, { "m-1": 1, "m-3": 3, "m-100": 100 }, morning)).toBe(0);
  });

  it("advances to the next pending zikr and wraps to skipped ones", () => {
    const counts = { "m-1": 1 };
    expect(nextPendingIndex(MORNING, counts, morning, 1)).toBe(2);
    // From the last item, wrap back to a skipped earlier one.
    expect(nextPendingIndex(MORNING, { "m-100": 100 }, morning, 2)).toBe(0);
    expect(nextPendingIndex(MORNING, { "m-1": 1, "m-3": 3, "m-100": 100 }, morning, 0)).toBe(-1);
  });

  it("counts done adhkar and remaining recitations", () => {
    expect(sessionProgress(MORNING, { "m-1": 1, "m-3": 2 }, morning)).toEqual({
      completed: 1,
      total: 3,
      remainingReps: 101,
    });
  });

  it("scopes after-salah adhkar and counts to one salah", () => {
    const fajr = { categoryId: "after_prayer" as const, prayer: "fajr" as const };
    const dhuhr = { categoryId: "after_prayer" as const, prayer: "dhuhr" as const };
    expect(sessionItems(fajr).map((i) => i.id)).toEqual(["a-tasbih", "a-fajr-only"]);
    expect(sessionItems(dhuhr).map((i) => i.id)).toEqual(["a-tasbih"]);
    expect(sessionItems({ categoryId: "after_prayer", prayer: "witr" }).map((i) => i.id)).toEqual([
      "a-witr",
    ]);

    // A Fajr count never satisfies Dhuhr (no shared / unscoped key).
    const counts = { [zikrCountKey("a-tasbih", "fajr")]: 33, "a-tasbih": 33 };
    expect(sessionProgress(sessionItems(fajr), counts, fajr).completed).toBe(1);
    expect(sessionProgress(sessionItems(dhuhr), counts, dhuhr).completed).toBe(0);
  });

  it("builds full-count writes for Mark all as done", () => {
    const fajr = { categoryId: "after_prayer" as const, prayer: "fajr" as const };
    expect(completeAllEntries(sessionItems(fajr), fajr)).toEqual([
      { zikrId: "a-tasbih", count: 33, target: 33, prayerId: "fajr" },
      { zikrId: "a-fajr-only", count: 1, target: 1, prayerId: "fajr" },
    ]);
    expect(completeAllEntries(MORNING.slice(0, 1), morning)).toEqual([
      { zikrId: "m-1", count: 1, target: 1 },
    ]);
  });
});

describe("adhkar windows + status", () => {
  it("opens each after-salah set at its salah and closes it at the next fard", () => {
    expect(adhkarWindow({ categoryId: "after_prayer", prayer: "asr" }, TIMES)).toEqual({
      start: TIMES.asr,
      end: TIMES.maghrib,
    });
    expect(adhkarWindow({ categoryId: "after_prayer", prayer: "isha" }, TIMES)).toEqual({
      start: TIMES.isha,
      end: undefined,
    });
    expect(adhkarWindow({ categoryId: "after_prayer", prayer: "witr" }, TIMES)).toEqual({
      start: TIMES.isha,
    });
    expect(adhkarWindow({ categoryId: "morning" }, TIMES)).toEqual({
      start: TIMES.fajr,
      end: TIMES.dhuhr,
    });
    expect(adhkarWindow({ categoryId: "evening" }, TIMES)).toEqual({
      start: TIMES.asr,
      end: TIMES.isha,
    });
    expect(adhkarWindow({ categoryId: "anytime" }, TIMES)).toEqual({});
  });

  it("reports upcoming → pending → in progress → missed → done", () => {
    const window = { start: TIMES.fajr, end: TIMES.dhuhr };
    const none = { completed: 0, total: 3 };
    const some = { completed: 1, total: 3 };
    expect(adhkarSetStatus(none, window, day(4))).toBe("upcoming");
    expect(adhkarSetStatus(none, window, day(7))).toBe("pending");
    expect(adhkarSetStatus(some, window, day(7))).toBe("inProgress");
    expect(adhkarSetStatus(some, window, day(13))).toBe("missed");
    expect(adhkarSetStatus({ completed: 3, total: 3 }, window, day(13))).toBe("done");
    // No window (situational adhkar, or times unavailable): never "missed".
    expect(adhkarSetStatus(none, {}, day(23))).toBe("pending");
  });

  it("combines progress and status for a scope", () => {
    __setZikrItemsForTests(MORNING);
    const state = adhkarScopeState({ categoryId: "morning" }, { "m-1": 1 }, day(13), TIMES);
    expect(state).toMatchObject({ completed: 1, total: 3, status: "missed" });
    __setZikrItemsForTests(loadZikrItemsSyncForTests());
  });
});

describe("after-salah defaults", () => {
  it("maps the running prayer slot to its after-salah tab", () => {
    expect(afterSalahPrayerForSlot("sunrise")).toBe("fajr");
    expect(afterSalahPrayerForSlot("maghrib")).toBe("maghrib");
    expect(afterSalahPrayerForSlot(undefined)).toBe("fajr");
  });

  it("keeps a requested salah when it applies, else falls back sensibly", () => {
    const universal = {};
    const witrOnly = { prayers: ["witr" as const] };
    expect(resolveAfterSalahPrayer(universal, "asr", "dhuhr")).toBe("asr");
    expect(resolveAfterSalahPrayer(universal, undefined, "dhuhr")).toBe("dhuhr");
    // Witr-only adhkar never log against a fard salah.
    expect(resolveAfterSalahPrayer(witrOnly, "asr", "isha")).toBe("witr");
  });
});

describe("locked content rules", () => {
  const quls = item({
    id: "a-ikhlas",
    categoryId: "after_prayer",
    targetCount: 1,
    prayerTargets: { fajr: 3, maghrib: 3 },
  });
  const weakEverywhere = item({
    id: "a-weak",
    categoryId: "after_prayer",
    targetCount: 7,
    prayers: ["fajr", "maghrib"],
    optional: true,
  });
  const weakAfterFajr = item({
    id: "a-tahlil-ten",
    categoryId: "after_prayer",
    targetCount: 10,
    prayers: ["fajr", "maghrib"],
    optionalPrayers: ["fajr"],
  });

  beforeEach(() => __setZikrItemsForTests([quls, weakEverywhere, weakAfterFajr]));
  afterAll(() => __setZikrItemsForTests(loadZikrItemsSyncForTests()));

  const fajr = { categoryId: "after_prayer" as const, prayer: "fajr" as const };
  const maghrib = { categoryId: "after_prayer" as const, prayer: "maghrib" as const };
  const dhuhr = { categoryId: "after_prayer" as const, prayer: "dhuhr" as const };

  it("recites the Quls three times after Fajr and Maghrib, once otherwise", () => {
    expect(zikrTarget(quls, "fajr")).toBe(3);
    expect(zikrTarget(quls, "maghrib")).toBe(3);
    expect(zikrTarget(quls, "dhuhr")).toBe(1);
    expect(zikrTarget(quls)).toBe(1);
    expect(completeAllEntries(sessionItems(dhuhr), dhuhr)).toEqual([
      { zikrId: "a-ikhlas", count: 1, target: 1, prayerId: "dhuhr" },
    ]);
  });

  it("never requires weak-chain adhkar to complete a set", () => {
    // Fajr: only the Quls are required (both weak items are optional after Fajr).
    expect(sessionProgress(sessionItems(fajr), {}, fajr)).toMatchObject({ total: 1 });
    // Maghrib: the tahlil ×10 is sound (required); ajirni stays optional.
    expect(sessionProgress(sessionItems(maghrib), {}, maghrib)).toMatchObject({ total: 2 });

    const doneFajr = { [zikrCountKey("a-ikhlas", "fajr")]: 3 };
    expect(sessionProgress(sessionItems(fajr), doneFajr, fajr).completed).toBe(1);
    // Auto-advance never lands on optional items, and Mark all leaves them alone.
    expect(nextPendingIndex(sessionItems(fajr), doneFajr, fajr, 0)).toBe(-1);
    expect(completeAllEntries(sessionItems(fajr), fajr).map((e) => e.zikrId)).toEqual(["a-ikhlas"]);
  });
});
