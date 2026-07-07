import {
  afterSalahItemProgress,
  afterSalahItemsForPrayer,
  isZikrItemDone,
  zikrCountKey,
} from "./after-salah-adhkar-progress";

describe("after-salah-adhkar-progress", () => {
  it("builds composite count keys when a prayer scope is set", () => {
    expect(zikrCountKey("after_prayer-tasbih")).toBe("after_prayer-tasbih");
    expect(zikrCountKey("after_prayer-tasbih", "fajr")).toBe("after_prayer-tasbih::fajr");
  });

  it("lists universal after-salah items under every fard prayer", () => {
    const fajr = afterSalahItemsForPrayer("fajr");
    const isha = afterSalahItemsForPrayer("isha");
    expect(fajr.some((item) => item.id === "after_prayer-tasbih")).toBe(true);
    expect(isha.some((item) => item.id === "after_prayer-tasbih")).toBe(true);
  });

  it("tracks per-salah completion separately for universal items", () => {
    const item = afterSalahItemsForPrayer("fajr").find(
      (entry) => entry.id === "after_prayer-tasbih",
    );
    expect(item).toBeDefined();
    if (!item) return;

    const counts = {
      [zikrCountKey(item.id, "fajr")]: item.targetCount ?? 33,
    };

    expect(afterSalahItemProgress(item, counts)).toEqual({ completed: 1, total: 5 });
    expect(isZikrItemDone(counts[zikrCountKey(item.id, "fajr")] ?? 0, item.targetCount)).toBe(true);
    expect(isZikrItemDone(counts[zikrCountKey(item.id, "dhuhr")] ?? 0, item.targetCount)).toBe(
      false,
    );
  });
});
