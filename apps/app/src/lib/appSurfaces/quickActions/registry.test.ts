import { IOS_QUICK_ACTION_LIMIT } from "@/lib/appSurfaces/config";
import {
  getActiveQuickActionDefinitions,
  getQuickActionById,
  QUICK_ACTION_REGISTRY,
} from "@/lib/appSurfaces/quickActions/registry";

describe("getActiveQuickActionDefinitions", () => {
  it("leads with Mark Salah outside Ramadan", () => {
    const active = getActiveQuickActionDefinitions(false);
    expect(active[0]?.id).toBe("mark-current");
    expect(active.some((def) => def.id === "ramadan")).toBe(false);
  });

  it("swaps the Ramadan action in while keeping Mark Salah first", () => {
    const active = getActiveQuickActionDefinitions(true);
    expect(active[0]?.id).toBe("mark-current");
    expect(active.some((def) => def.id === "ramadan")).toBe(true);
    expect(active.some((def) => def.id === "tasbeeh")).toBe(false);
  });

  it("keeps the same length whether or not Ramadan is active", () => {
    expect(getActiveQuickActionDefinitions(false).length).toBe(
      getActiveQuickActionDefinitions(true).length,
    );
  });

  it("stays within the iOS quick-action limit after slicing", () => {
    for (const isRamadanActive of [false, true]) {
      const sliced = getActiveQuickActionDefinitions(isRamadanActive).slice(
        0,
        IOS_QUICK_ACTION_LIMIT,
      );
      expect(sliced[0]?.id).toBe("mark-current");
      expect(sliced.length).toBe(IOS_QUICK_ACTION_LIMIT);
    }
  });
});

describe("getQuickActionById", () => {
  it("finds every registered definition, including the seasonal one", () => {
    for (const def of QUICK_ACTION_REGISTRY) {
      expect(getQuickActionById(def.id)).toBe(def);
    }
  });
});
