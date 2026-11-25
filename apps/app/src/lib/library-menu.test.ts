import { act, renderHook } from "@testing-library/react-native";

import {
  createLibraryMenuSearch,
  filterDestinationsForDevice,
  hiddenFinanceToolForRoute,
  isDestinationHidden,
  LIBRARY_MENU_META,
  LIBRARY_SEARCH_ALIASES,
  libraryMenuForDevice,
  TV_FINANCE_TOOL_IDS,
  useDestinationScope,
} from "@/lib/library-menu";
import {
  DEFAULT_QUICK_ACTION_ORDER,
  QUICK_ACTION_META,
  TV_HIDDEN_QUICK_ACTION_IDS,
} from "@/lib/quick-actions";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { usePlatform } from "@/test-support/platform";

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

  it("only aliases known library menu ids", () => {
    const libraryIds = new Set(LIBRARY_MENU_META.map((entry) => entry.id));
    for (const id of Object.keys(LIBRARY_SEARCH_ALIASES)) {
      expect(libraryIds.has(id)).toBe(true);
    }
  });
});

describe("createLibraryMenuSearch", () => {
  const index = createLibraryMenuSearch(
    LIBRARY_MENU_META.map((entry) => ({
      ...entry,
      // Stable English labels for alias tests (independent of i18n runtime).
      label: entry.id,
    })),
  );

  it.each([
    ["adhkar", "zikr"],
    ["azkar", "zikr"],
    ["zikar", "zikr"],
    ["dhikr", "zikr"],
    ["qadha", "qaza"],
    ["qada", "qaza"],
    ["koran", "quran"],
    ["tasbih", "tasbeeh"],
    ["salat", "salahGuide"],
    ["namaz", "salahGuide"],
    ["hadeeth", "hadith"],
    ["darood", "duroods"],
    ["duaa", "duas"],
    ["wudu", "taharah"],
    ["jumuah", "friday"],
    ["recite", "quranPractice"],
    ["revision", "quranPractice"],
  ] as const)("maps %# %s → %s", (query, expectedId) => {
    const ids = index.search(query).map((entry) => entry.id);
    expect(ids).toContain(expectedId);
  });

  it("returns both zikr destinations for shared adhkar spellings", () => {
    const ids = index.search("azkar").map((entry) => entry.id);
    expect(ids).toEqual(expect.arrayContaining(["zikr", "adhkarBuilder"]));
  });
});

describe("TV lean-back scope (D-UX5)", () => {
  const FINANCE = ["zakat", "sadaqah", "fidyah", "finance", "mirath"];
  const TV_DEFAULT = { tv: true, showFinanceTools: false };
  const TV_FINANCE_ON = { tv: true, showFinanceTools: true };
  const ids = (scope: Parameters<typeof libraryMenuForDevice>[0]) =>
    libraryMenuForDevice(scope).map((entry) => entry.id);

  it("covers exactly the five finance tools", () => {
    expect([...TV_FINANCE_TOOL_IDS].sort()).toEqual([...FINANCE].sort());
  });

  it("drops the finance tools and private records from the TV menu by default", () => {
    const menu = ids(TV_DEFAULT);
    for (const id of [...FINANCE, ...TV_HIDDEN_QUICK_ACTION_IDS]) expect(menu).not.toContain(id);
    expect(menu).toContain("quran");
  });

  it("brings the finance tools back when Show finance tools is on", () => {
    const menu = ids(TV_FINANCE_ON);
    for (const id of FINANCE) expect(menu).toContain(id);
    // Debts and the wasiyyah stay private regardless.
    expect(menu).not.toContain("debts");
    expect(menu).not.toContain("wasiyyah");
  });

  it("excludes the finance tools from the TV menu search", () => {
    const search = createLibraryMenuSearch(
      libraryMenuForDevice(TV_DEFAULT).map((entry) => ({ ...entry, label: entry.id })),
    );
    expect(search.search("zakat").map((entry) => entry.id)).not.toContain("zakat");
    expect(search.search("inheritance").map((entry) => entry.id)).not.toContain("mirath");
  });

  it("leaves phone and web menus unchanged", () => {
    for (const showFinanceTools of [false, true]) {
      expect(libraryMenuForDevice({ tv: false, showFinanceTools })).toEqual(LIBRARY_MENU_META);
      expect(isDestinationHidden("zakat", { tv: false, showFinanceTools })).toBe(false);
    }
  });

  it("filters any destination list (Explore grid) by id", () => {
    const items = [{ id: "zakat" }, { id: "qibla" }, { id: "debts" }];
    expect(filterDestinationsForDevice(items, TV_DEFAULT)).toEqual([{ id: "qibla" }]);
    expect(filterDestinationsForDevice(items, TV_FINANCE_ON)).toEqual([
      { id: "zakat" },
      { id: "qibla" },
    ]);
  });

  it.each([
    ["zakat/index", "zakat"],
    ["/zakat", "zakat"],
    ["sadaqah/index", "sadaqah"],
    ["/fidyah/", "fidyah"],
    ["finance/index", "finance"],
    ["mirath", "mirath"],
  ])("gates the %s route while hidden", (route, id) => {
    expect(hiddenFinanceToolForRoute(route, TV_DEFAULT)?.id).toBe(id);
    expect(hiddenFinanceToolForRoute(route, TV_FINANCE_ON)).toBeNull();
    expect(hiddenFinanceToolForRoute(route, { tv: false, showFinanceTools: false })).toBeNull();
  });

  it.each(["zakat/[topic]", "/zakat/nisab", "finance/[topic]", "(tabs)", "quran/[surah]", "/"])(
    "leaves %s reachable",
    (route) => {
      expect(hiddenFinanceToolForRoute(route, TV_DEFAULT)).toBeNull();
    },
  );

  describe("useDestinationScope on TV", () => {
    usePlatform({ isTV: true });
    afterEach(() => devicePreferencesStore.setState({ prefs: {} }));

    it("follows the device setting", async () => {
      const { result } = await renderHook(() => useDestinationScope());
      expect(result.current).toEqual(TV_DEFAULT);

      await act(async () =>
        devicePreferencesStore.setState({ prefs: { tvShowFinanceTools: true } }),
      );
      expect(result.current).toEqual(TV_FINANCE_ON);
    });
  });
});
