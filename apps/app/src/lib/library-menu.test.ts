import { LIBRARY_MENU_META } from "@/lib/library-menu";
import { DEFAULT_QUICK_ACTION_ORDER, QUICK_ACTION_META } from "@/lib/quick-actions";

describe("library menu catalog", () => {
  it("matches quick-action meta ids 1:1", () => {
    const libraryIds = LIBRARY_MENU_META.map((entry) => entry.id).sort();
    const metaIds = QUICK_ACTION_META.map((entry) => entry.id).sort();
    expect(libraryIds).toEqual(metaIds);
  });

  it("includes every default home Explore shortcut", () => {
    const libraryIds = new Set(LIBRARY_MENU_META.map((entry) => entry.id));
    for (const id of DEFAULT_QUICK_ACTION_ORDER) {
      expect(libraryIds.has(id)).toBe(true);
    }
  });
});
