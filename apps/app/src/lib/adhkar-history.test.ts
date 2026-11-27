import type { ZikrItem, ZikrProgress } from "@munib-tracker/shared/types";

import {
  adhkarSetHistory,
  adhkarSetKey,
  adhkarSetsForDay,
  zikrCountsByDate,
} from "@/lib/adhkar-history";
import { loadZikrItemsSyncForTests } from "@/lib/search-corpora-test-loader";
import { __setZikrItemsForTests } from "@/lib/zikr";

function item(overrides: Partial<ZikrItem> & Pick<ZikrItem, "id" | "categoryId">): ZikrItem {
  return { title: overrides.id, arabic: "", transliteration: "", translation: "", ...overrides };
}

const ITEMS: ZikrItem[] = [
  item({ id: "m-1", categoryId: "morning", targetCount: 3 }),
  item({ id: "a-tasbih", categoryId: "after_prayer", targetCount: 33 }),
  item({ id: "a-weak", categoryId: "after_prayer", targetCount: 7, optional: true }),
  item({ id: "w-1", categoryId: "after_prayer", targetCount: 3, prayers: ["witr"] }),
];

function entry(
  zikrId: string,
  date: string,
  count: number,
  prayerId?: ZikrProgress["prayerId"],
): ZikrProgress {
  return { id: `${zikrId}-${date}`, zikrId, date, count, target: count, completed: true, prayerId };
}

beforeEach(() => __setZikrItemsForTests(ITEMS));
afterAll(() => __setZikrItemsForTests(loadZikrItemsSyncForTests()));

const set = (rows: ReturnType<typeof adhkarSetsForDay>, key: string) =>
  rows.find((row) => adhkarSetKey(row.scope) === key);

describe("adhkar history (per date, per salah)", () => {
  it("never credits one salah's adhkar to another", () => {
    const counts =
      zikrCountsByDate([
        entry("a-tasbih", "2026-11-20", 33, "fajr"),
        entry("a-tasbih", "2026-11-20", 10, "dhuhr"),
        // Legacy record from before per-salah logging: belongs to no salah.
        entry("a-tasbih", "2026-11-20", 33),
      ]).get("2026-11-20") ?? {};
    const day = adhkarSetsForDay(counts);
    expect(set(day, "after_prayer:fajr")).toMatchObject({ done: true, started: true });
    expect(set(day, "after_prayer:dhuhr")).toMatchObject({ done: false, started: true });
    expect(set(day, "after_prayer:asr")).toMatchObject({ done: false, started: false });
    // Optional weak-chain adhkar never block a set.
    expect(set(day, "after_prayer:fajr")?.total).toBe(1);
  });

  it("counts done and partial days per set across a range", () => {
    const history = adhkarSetHistory(
      [
        entry("a-tasbih", "2026-11-18", 33, "fajr"),
        entry("a-tasbih", "2026-11-19", 33, "fajr"),
        entry("a-tasbih", "2026-11-20", 5, "fajr"),
        entry("m-1", "2026-11-19", 3),
        entry("w-1", "2026-11-20", 3, "witr"),
        // Outside the range — ignored.
        entry("a-tasbih", "2026-11-10", 33, "fajr"),
      ],
      "2026-11-18",
      "2026-11-20",
    );
    const row = (key: string) => history.find((h) => adhkarSetKey(h.scope) === key);
    expect(row("after_prayer:fajr")).toMatchObject({ doneDays: 2, partialDays: 1, days: 3 });
    expect(row("morning")).toMatchObject({ doneDays: 1, partialDays: 0, days: 3 });
    expect(row("after_prayer:witr")).toMatchObject({ doneDays: 1 });
    expect(row("after_prayer:isha")).toMatchObject({ doneDays: 0, partialDays: 0 });
  });
});
