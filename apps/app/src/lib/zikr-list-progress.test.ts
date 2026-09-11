import type { ZikrItem } from "@munib-tracker/shared/types";
import { loadZikrItemsSyncForTests } from "@/lib/search-corpora-test-loader";
import { __setZikrItemsForTests } from "@/lib/zikr";
import { zikrCountKey } from "@/lib/zikr-count-key";
import {
  zikrCategoryBadge,
  zikrCategoryTodayProgress,
  zikrListProgress,
  zikrListRowProgress,
} from "@/lib/zikr-list-progress";

function item(overrides: Partial<ZikrItem> & Pick<ZikrItem, "id" | "categoryId">): ZikrItem {
  return {
    title: overrides.title ?? overrides.id,
    arabic: "",
    transliteration: "",
    translation: "",
    targetCount: 3,
    ...overrides,
  };
}

describe("zikrListRowProgress", () => {
  it("marks a morning zikr done and hides the count once the daily target is met", () => {
    const zikr = item({ id: "morning-bismillah", categoryId: "morning", targetCount: 3 });
    const counts = { [zikr.id]: 3 };

    expect(zikrListRowProgress(zikr, counts)).toEqual({ completed: true });
  });

  it("shows remaining recitations as count/target while in progress", () => {
    const zikr = item({ id: "morning-subhanallah", categoryId: "morning", targetCount: 100 });
    const counts = { [zikr.id]: 40 };

    expect(zikrListRowProgress(zikr, counts)).toEqual({
      completed: false,
      progressLabel: "40/100",
    });
  });

  it("shows 0/target before any recitations so remaining is visible in the list", () => {
    const zikr = item({ id: "evening-ayat-al-kursi", categoryId: "evening", targetCount: 1 });

    expect(zikrListRowProgress(zikr, {})).toEqual({
      completed: false,
      progressLabel: "0/1",
    });
  });

  it("tracks after-salah slots across all prayers on the All filter", () => {
    const zikr = item({
      id: "after_prayer-tasbih",
      categoryId: "after_prayer",
      targetCount: 33,
    });
    const counts = {
      [zikrCountKey(zikr.id, "fajr")]: 33,
      [zikrCountKey(zikr.id, "dhuhr")]: 10,
    };

    expect(zikrListRowProgress(zikr, counts, "all")).toEqual({
      completed: false,
      progressLabel: "1/5",
    });
  });

  it("marks a single-prayer after-salah row done for that salah only", () => {
    const zikr = item({
      id: "after_prayer-tasbih",
      categoryId: "after_prayer",
      targetCount: 33,
    });
    const counts = { [zikrCountKey(zikr.id, "asr")]: 33 };

    expect(zikrListRowProgress(zikr, counts, "asr")).toEqual({ completed: true });
    expect(zikrListRowProgress(zikr, counts, "maghrib")).toEqual({
      completed: false,
      progressLabel: "0/33",
    });
  });

  it("omits a progress label when the item has no recitation target", () => {
    const zikr = item({ id: "open-ended", categoryId: "anytime", targetCount: undefined });

    expect(zikrListRowProgress(zikr, {})).toEqual({ completed: false });
    expect(zikrListRowProgress(zikr, { "open-ended": 1 })).toEqual({ completed: true });
  });
});

describe("zikrListProgress", () => {
  it("counts completed items in a morning list", () => {
    const items = [
      item({ id: "a", categoryId: "morning", targetCount: 3 }),
      item({ id: "b", categoryId: "morning", targetCount: 3 }),
      item({ id: "c", categoryId: "morning", targetCount: 1 }),
    ];
    const counts = { a: 3, b: 1 };

    expect(zikrListProgress(items, counts)).toEqual({ completed: 1, total: 3 });
  });
});

describe("zikrCategoryTodayProgress", () => {
  afterEach(() => {
    __setZikrItemsForTests(loadZikrItemsSyncForTests());
  });

  it("counts remaining morning adhkar from today's map", () => {
    expect(zikrCategoryTodayProgress("morning", {})).toEqual(
      expect.objectContaining({ completed: 0, total: expect.any(Number) }),
    );
    const empty = zikrCategoryTodayProgress("morning", {});
    expect(empty.total).toBeGreaterThan(0);
  });

  it("uses salah-slot totals for after-salah, including Witr", () => {
    const progress = zikrCategoryTodayProgress("after_prayer", {});
    expect(progress.total).toBeGreaterThan(0);
    expect(progress.completed).toBe(0);
  });

  it("labels an unfinished category with remaining counts", () => {
    const badge = zikrCategoryBadge("morning", {}, "Done");
    expect(badge?.completed).toBe(false);
    expect(badge?.label).toMatch(/^\d+\/\d+$/);
  });

  it("labels a finished category as Done", () => {
    __setZikrItemsForTests([item({ id: "only", categoryId: "morning", targetCount: 1 })]);
    expect(zikrCategoryBadge("morning", { only: 1 }, "Done")).toEqual({
      label: "Done",
      completed: true,
    });
  });

  it("omits a badge when the category has no items", () => {
    __setZikrItemsForTests([]);
    expect(zikrCategoryBadge("morning", {}, "Done")).toBeUndefined();
  });
});
