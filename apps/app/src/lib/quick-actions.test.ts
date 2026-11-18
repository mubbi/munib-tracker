import type { TFunction } from "i18next";
import {
  assertLibraryMenuParity,
  buildQuickActionItems,
  DEFAULT_QUICK_ACTION_ORDER,
  orderQuickActions,
  QUICK_ACTION_META,
  QUICK_ACTION_ROUTES,
  resolveQuickActionTint,
  TV_HIDDEN_QUICK_ACTION_IDS,
} from "@/lib/quick-actions";
import { usePlatform } from "@/test-support/platform";

const t = ((key: string) => `t:${key}`) as unknown as TFunction;
const theme = {
  colors: { accent: "#accent" },
  tokens: {
    status: {
      success: { color: "#success" },
      info: { color: "#info" },
      danger: { color: "#danger" },
      warning: { color: "#warning" },
    },
  },
};

describe("quick action catalog", () => {
  it("has a route for every action and unique ids", () => {
    const ids = QUICK_ACTION_META.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => !QUICK_ACTION_ROUTES[id])).toEqual([]);
  });

  it("only lists known ids in the default order", () => {
    const ids = new Set(QUICK_ACTION_META.map((m) => m.id));
    expect(DEFAULT_QUICK_ACTION_ORDER.filter((id) => !ids.has(id))).toEqual([]);
  });
});

describe("resolveQuickActionTint", () => {
  it("uses the accent colour for accent tone and status tokens otherwise", () => {
    expect(resolveQuickActionTint("accent", theme)).toBe("#accent");
    expect(resolveQuickActionTint("danger", theme)).toBe("#danger");
    expect(resolveQuickActionTint("success", theme)).toBe("#success");
  });
});

describe("buildQuickActionItems", () => {
  it("builds translated items whose press navigates to the route", () => {
    const push = jest.fn();
    const items = buildQuickActionItems(t, push, theme);
    expect(items).toHaveLength(QUICK_ACTION_META.length);
    const quran = items.find((i) => i.id === "quran");
    expect(quran?.label).toBe("t:actions.quran");
    expect(quran?.tint).toBe("#accent");
    quran?.onPress();
    expect(push).toHaveBeenCalledWith("/quran");
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("hides mic-dependent actions", () => {
      const items = buildQuickActionItems(t, jest.fn(), theme);
      expect(items.some((i) => TV_HIDDEN_QUICK_ACTION_IDS.has(i.id))).toBe(false);
      expect(items).toHaveLength(QUICK_ACTION_META.length - TV_HIDDEN_QUICK_ACTION_IDS.size);
    });
  });

  it("throws when an action has no route", () => {
    const saved = QUICK_ACTION_ROUTES.qibla;
    delete QUICK_ACTION_ROUTES.qibla;
    try {
      expect(() => buildQuickActionItems(t, jest.fn(), theme)).toThrow(
        "Missing quick action route for qibla",
      );
    } finally {
      QUICK_ACTION_ROUTES.qibla = saved;
    }
  });
});

describe("orderQuickActions", () => {
  it("orders by saved ids and drops unknown ones", () => {
    const all = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(orderQuickActions(all, ["c", "x", "a"])).toEqual([{ id: "c" }, { id: "a" }]);
    expect(orderQuickActions(all, [])).toEqual([]);
  });
});

describe("assertLibraryMenuParity", () => {
  const ids = QUICK_ACTION_META.map((m) => m.id);

  it("passes when the library mirrors quick actions", () => {
    expect(() => assertLibraryMenuParity([...ids])).not.toThrow();
  });

  it("reports missing and extra ids", () => {
    expect(() => assertLibraryMenuParity([...ids.slice(1), "extra"])).toThrow(
      `Missing from library: ${ids[0]}. Extra in library: extra.`,
    );
    expect(() => assertLibraryMenuParity([...ids, "only-extra"])).toThrow(
      "Missing from library: none. Extra in library: only-extra.",
    );
    expect(() => assertLibraryMenuParity(ids.slice(1))).toThrow("Extra in library: none.");
  });
});
