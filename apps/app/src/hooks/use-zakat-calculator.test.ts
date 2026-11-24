import { act, renderHook } from "@testing-library/react-native";
import { PreferencesRepository } from "@/db/repositories/preferences-repository";
import { ZakatCalculatorRepository } from "@/db/repositories/zakat-calculator-repository";
import { preferencesStore } from "@/stores/preferences-store";
import { deferred } from "@/test-support/async";
import {
  resetMockDeviceLocales,
  setMockDeviceLocales,
} from "@/test-support/mocks/expo-localization";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useZakatCalculator, ZAKAT_ASSET_GROUPS } from "./use-zakat-calculator";

jest.mock("@/db/repositories/zakat-calculator-repository", () => ({
  ZakatCalculatorRepository: {
    get: jest.fn(async () => null),
    set: jest.fn(async () => undefined),
  },
}));

jest.mock("@/hooks/use-zakat-market-data", () => ({
  useZakatMarketData: () => mockMarket,
}));

let mockMarket: {
  data: { goldInput: string; silverInput: string } | undefined;
  refetch: jest.Mock;
};

const repoGet = ZakatCalculatorRepository.get as jest.Mock;
const repoSet = ZakatCalculatorRepository.set as jest.Mock;

const FULL_DRAFT = {
  currencyCode: "EUR",
  numberFormat: "dot_comma",
  values: { cash: "1.000", debts: "100" },
  nisab: "500",
  nisabManual: true,
  goldWeight: "",
  goldGrams: "10",
  goldUnit: "tola",
  goldKarat: "22",
  goldPrice: "60",
  silverWeight: "",
  silverGrams: "",
  silverUnit: "kg",
  silverPurity: 925,
  silverPrice: "1",
  nisabGoldPrice: "60",
  nisabSilverPrice: "1",
  pricesManual: true,
  sheepCount: "40",
  cattleCount: "30",
  camelCount: "5",
  sheepValue: "100",
  cattleValue: "500",
  camelValue: "900",
  harvestValue: "1000",
  irrigation: "irrigated",
};

async function setup() {
  const hook = await renderHook(() => useZakatCalculator());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  repoGet.mockResolvedValue(null);
  mockMarket = { data: undefined, refetch: jest.fn(async () => undefined) };
});

afterEach(() => {
  jest.useRealTimers();
  resetMockDeviceLocales();
});

describe("useZakatCalculator", () => {
  it("exposes the asset groups", () => {
    expect(ZAKAT_ASSET_GROUPS.map((g) => g.id)).toEqual(["liquid", "investments", "property"]);
  });

  it("starts empty in USD and becomes hydrated", async () => {
    const { result, unmount } = await setup();
    expect(result.current.currencyCode).toBe("USD");
    expect(result.current.numberFormat).toBe("comma_dot");
    expect(result.current.hydrated).toBe(true);
    expect(result.current.hasInput).toBe(false);
    expect(result.current.effectiveNisab).toBe(0);
    expect(result.current.currency?.code ?? result.current.currencyCode).toBe("USD");
    await unmount();
  });

  it("uses a supported device currency", async () => {
    setMockDeviceLocales([{ languageCode: "en", currencyCode: "gbp" }]);
    const { result, unmount } = await setup();
    expect(result.current.currencyCode).toBe("GBP");
    await unmount();
  });

  it("falls back to USD for an unknown device currency or no locales", async () => {
    setMockDeviceLocales([{ languageCode: "en", currencyCode: "ZZZ" }]);
    let hook = await setup();
    expect(hook.result.current.currencyCode).toBe("USD");
    await hook.unmount();
    setMockDeviceLocales([]);
    hook = await setup();
    expect(hook.result.current.currencyCode).toBe("USD");
    await hook.unmount();
  });

  it("restores a saved draft, normalising legacy fields", async () => {
    repoGet.mockResolvedValueOnce(FULL_DRAFT);
    const { result, unmount } = await setup();
    const r = result.current;
    expect(r.currencyCode).toBe("EUR");
    expect(r.numberFormat).toBe("dot_comma");
    expect(r.values).toEqual({ cash: "1.000", debts: "100" });
    expect(r.nisabManual).toBe(true);
    expect(r.effectiveNisab).toBe(500);
    expect(r.goldWeight).toBe("10");
    expect(r.goldGrams).toBe("10");
    expect(r.goldUnit).toBe("tola");
    expect(r.goldKarat).toBe(22);
    expect(r.silverWeight).toBe("");
    expect(r.silverUnit).toBe("kg");
    expect(r.silverPurity).toBe(925);
    expect(r.pricesManual).toBe(true);
    expect(r.sheepCount).toBe("40");
    expect(r.irrigation).toBe("irrigated");
    expect(r.goldFromWeight).toBeGreaterThan(0);
    expect(r.hasInput).toBe(true);
    expect(r.result).toBeDefined();
    await unmount();
  });

  it("defaults invalid or missing draft fields", async () => {
    repoGet.mockResolvedValueOnce({
      ...FULL_DRAFT,
      numberFormat: "bogus",
      goldWeight: "",
      goldGrams: undefined,
      silverWeight: "",
      silverGrams: undefined,
      goldUnit: "lb",
      goldKarat: 7,
      silverPurity: "x",
      sheepCount: undefined,
      cattleCount: undefined,
      camelCount: undefined,
      sheepValue: undefined,
      cattleValue: undefined,
      camelValue: undefined,
      harvestValue: undefined,
      irrigation: "rain",
    });
    const { result, unmount } = await setup();
    const r = result.current;
    expect(r.numberFormat).toBe("comma_dot");
    expect(r.goldWeight).toBe("");
    expect(r.silverWeight).toBe("");
    expect(r.goldUnit).toBe("g");
    expect(r.goldKarat).toBe(24);
    expect(r.silverPurity).toBe(999);
    expect(r.sheepCount).toBe("");
    expect(r.harvestValue).toBe("");
    expect(r.irrigation).toBe("natural");
    await unmount();
  });

  it("accepts every metal unit, karat and purity value", async () => {
    for (const [unit, karat, purity] of [
      ["oz", 21, "900"],
      ["g", "18", 800],
      ["tola", 14, 999],
      ["kg", 10, 925],
    ] as const) {
      repoGet.mockResolvedValueOnce({
        ...FULL_DRAFT,
        goldUnit: unit,
        silverUnit: unit,
        goldKarat: karat,
        silverPurity: purity,
      });
      const { result, unmount } = await setup();
      expect(result.current.goldUnit).toBe(unit);
      expect(result.current.goldKarat).toBe(Number(karat));
      expect(result.current.silverPurity).toBe(Number(purity));
      await unmount();
    }
  });

  it("keeps defaults when loading the draft fails", async () => {
    repoGet.mockRejectedValueOnce(new Error("db"));
    const { result, unmount } = await setup();
    expect(result.current.hydrated).toBe(true);
    expect(result.current.currencyCode).toBe("USD");
    await unmount();
  });

  it("does not apply a draft that resolves after unmount", async () => {
    const draft = deferred<typeof FULL_DRAFT>();
    repoGet.mockReturnValueOnce(draft.promise);
    const { result, unmount } = await renderHook(() => useZakatCalculator());
    await unmount();
    await act(async () => {
      draft.resolve(FULL_DRAFT);
    });
    expect(result.current.hydrated).toBe(false);
    expect(result.current.currencyCode).toBe("USD");
  });

  it("debounces persistence of the draft", async () => {
    jest.useFakeTimers();
    const { result, unmount } = await setup();
    await act(async () => {
      result.current.setField("cash", "1,000");
    });
    await act(async () => {
      result.current.setField("cash", "2,000");
    });
    expect(repoSet).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(repoSet).toHaveBeenCalledTimes(1);
    expect(repoSet).toHaveBeenCalledWith(
      expect.objectContaining({ currencyCode: "USD", values: { cash: "2,000" } }),
    );
    await unmount();
  });

  it("changes currency only to supported codes and resets manual prices", async () => {
    const { result, unmount } = await setup();
    await act(async () => {
      result.current.setGoldPrice("70");
    });
    expect(result.current.pricesManual).toBe(true);
    await act(async () => {
      result.current.setCurrencyCode(" xyz ");
    });
    expect(result.current.currencyCode).toBe("USD");
    expect(result.current.pricesManual).toBe(true);
    await act(async () => {
      result.current.setCurrencyCode(" eur ");
    });
    expect(result.current.currencyCode).toBe("EUR");
    expect(result.current.pricesManual).toBe(false);
    await unmount();
  });

  it("reformats every input when the number format changes", async () => {
    const { result, unmount } = await setup();
    const r = () => result.current;
    await act(async () => {
      r().setField("cash", "1,234.5");
      r().setNisab("10,000");
      r().setGoldWeight("1,000.25");
      r().setGoldPrice("65.5");
      r().setSilverWeight("2,000");
      r().setSilverPrice("0.8");
      r().setNisabGoldPrice("65.5");
      r().setNisabSilverPrice("0.8");
      r().setSheepCount("1,234");
      r().setCattleCount("50");
      r().setCamelCount("5");
      r().setSheepValue("1,500");
      r().setCattleValue("2,500");
      r().setCamelValue("3,500");
      r().setHarvestValue("4,500");
    });
    await act(async () => {
      r().setNumberFormat("comma_dot");
    });
    expect(r().values.cash).toBe("1,234.5");
    await act(async () => {
      r().setNumberFormat("dot_comma");
    });
    expect(r().numberFormat).toBe("dot_comma");
    expect(r().values.cash).toBe("1.234,5");
    expect(r().nisab).toBe("10.000");
    expect(r().goldWeight).toBe("1.000,25");
    expect(r().sheepCount).toBe("1.234");
    expect(r().harvestValue).toBe("4.500");
    await unmount();
  });

  it("prefills live prices once hydrated unless prices are manual", async () => {
    mockMarket.data = { goldInput: "80", silverInput: "1" };
    const { result, rerender, unmount } = await setup();
    expect(result.current.goldPrice).toBe("80");
    expect(result.current.silverPrice).toBe("1");
    expect(result.current.nisabGoldPrice).toBe("80");
    expect(result.current.nisabSilverPrice).toBe("1");
    expect(result.current.suggestedNisab).toBeGreaterThan(0);
    expect(result.current.effectiveNisab).toBe(result.current.suggestedNisab);

    await act(async () => {
      result.current.setSilverPrice("2");
      result.current.setNisabGoldPrice("90");
      result.current.setNisabSilverPrice("3");
    });
    mockMarket.data = { goldInput: "81", silverInput: "1.1" };
    await rerender({});
    expect(result.current.silverPrice).toBe("2");
    expect(result.current.nisabGoldPrice).toBe("90");

    await act(async () => {
      result.current.applyLivePrices();
    });
    expect(mockMarket.refetch).toHaveBeenCalled();
    expect(result.current.pricesManual).toBe(false);
    expect(result.current.goldPrice).toBe("81");
    await unmount();
  });

  type Calc = ReturnType<typeof useZakatCalculator>;

  async function withInput(fill: (calc: Calc) => void) {
    const hook = await setup();
    await act(async () => {
      fill(hook.result.current);
    });
    return hook;
  }

  it("values gold by weight, karat and price", async () => {
    const { result, unmount } = await withInput((c) => {
      c.setGoldWeight("100");
      c.setGoldPrice("50");
      c.setGoldUnit("g");
      c.setGoldKarat(24);
    });
    expect(result.current.goldFromWeight).toBe(5000);
    await unmount();
  });

  it("values silver by weight, purity and price", async () => {
    const { result, unmount } = await withInput((c) => {
      c.setSilverGrams("100");
      c.setSilverPrice("1");
      c.setSilverUnit("g");
      c.setSilverPurity(999);
    });
    expect(result.current.silverFromWeight).toBeCloseTo(99.9);
    await unmount();
  });

  it.each<[string, (c: Calc) => void]>([
    ["cash", (c) => c.setField("cash", "10")],
    ["camels", (c) => c.setCamelCount("5")],
    ["cattle", (c) => c.setCattleCount("30")],
    ["sheep", (c) => c.setSheepCount("40")],
    ["crops", (c) => c.setHarvestValue("1000")],
    ["a typed nisab", (c) => c.setNisab("300")],
  ])("reports input once %s is entered", async (_label, fill) => {
    const { result, unmount } = await withInput(fill);
    expect(result.current.hasInput).toBe(true);
    await unmount();
  });

  it("uses the typed nisab when no live nisab is known", async () => {
    const { result, unmount } = await withInput((c) => c.setNisab("300"));
    expect(result.current.effectiveNisab).toBe(300);
    await unmount();
  });

  it("formats money in the selected currency and format", async () => {
    const { result, unmount } = await setup();
    expect(result.current.money(1234.5)).toContain("1,234.50");
    await unmount();
  });

  it("clears every input on reset", async () => {
    const { result, unmount } = await withInput((c) => {
      c.setGoldWeight("1");
      c.setHarvestValue("1000");
      c.setIrrigation("irrigated");
      c.setNisabManual(true);
    });
    expect(result.current.irrigation).toBe("irrigated");
    await act(async () => {
      result.current.resetForm();
    });
    expect(result.current.hasInput).toBe(false);
    expect(result.current.goldWeight).toBe("");
    expect(result.current.nisabManual).toBe(false);
    expect(result.current.irrigation).toBe("natural");
    await unmount();
  });
});

describe("useZakatCalculator — madhhab (NF-3.0a)", () => {
  afterEach(resetPreferences);

  async function withPrices(fill?: (c: ReturnType<typeof useZakatCalculator>) => void) {
    const hook = await setup();
    await act(async () => {
      // Gold nisab = 87.48 × 100 = 8748; silver nisab = 612.36 × 1 = 612.36.
      hook.result.current.setNisabGoldPrice("100");
      hook.result.current.setNisabSilverPrice("1");
      fill?.(hook.result.current);
    });
    return hook;
  }

  it("Hanafi: lower nisab, personal jewellery counted, pooled by value", async () => {
    await setPreferences({ madhhab: "hanafi" });
    const { result, unmount } = await withPrices((c) => c.setField("personalJewellery", "700"));
    expect(result.current.zakatSchool).toBe("hanafi");
    expect(result.current.nisabBasis).toBe("lower");
    expect(result.current.effectiveNisab).toBe(612.36);
    expect(result.current.combineMethod).toBe("value");
    expect(result.current.personalJewelleryCounted).toBe(true);
    expect(result.current.result.wealthDue).toBe(17.5);
    expect(result.current.basisRows).toEqual([]);
    await unmount();
  });

  it("Shafi'i: gold basis flagged contested, jewellery excluded, metals separate", async () => {
    await setPreferences({ madhhab: "shafii" });
    const { result, unmount } = await withPrices((c) => c.setField("personalJewellery", "700"));
    expect(result.current.nisabBasis).toBe("gold");
    expect(result.current.nisabBasisContested).toBe(true);
    expect(result.current.effectiveNisab).toBe(8748);
    expect(result.current.combineMethod).toBe("separate");
    expect(result.current.personalJewelleryCounted).toBe(false);
    expect(result.current.result.wealthDue).toBe(0);
    await unmount();
  });

  it("saves the basis override to fiqhCustom without touching other custom values", async () => {
    const prefs = { madhhab: "shafii", fiqhCustom: { qasrDistanceKm: 80 } } as const;
    // `update()` persists then reloads from the repository — seed both.
    await PreferencesRepository.update(prefs);
    await setPreferences(prefs);
    const { result, unmount } = await withPrices();
    await act(async () => {
      await result.current.setNisabBasisOverride("silver");
    });
    expect(preferencesStore.getState().prefs.fiqhCustom).toEqual({
      qasrDistanceKm: 80,
      nisabBasis: "silver",
    });
    expect(result.current.nisabBasis).toBe("silver");
    expect(result.current.nisabBasisCustom).toBe(true);
    expect(result.current.nisabBasisContested).toBe(false);
    expect(result.current.effectiveNisab).toBe(612.36);
    await act(async () => {
      await result.current.setNisabBasisOverride(null);
    });
    expect(preferencesStore.getState().prefs.fiqhCustom).toEqual({ qasrDistanceKm: 80 });
    expect(result.current.nisabBasis).toBe("gold");
    await unmount();
    await PreferencesRepository.update({ madhhab: undefined, fiqhCustom: undefined });
  });

  it("all views: one row per basis, with and without personal jewellery", async () => {
    await setPreferences({ madhhab: null, fiqhCustom: { nisabBasis: "gold" } });
    const { result, unmount } = await withPrices((c) => {
      c.setField("cash", "9000");
      c.setField("personalJewellery", "1000");
    });
    expect(result.current.zakatSchool).toBeNull();
    expect(result.current.basisRows.map((r) => [r.basis, r.totalDue, r.selected])).toEqual([
      ["lower", 250, false],
      ["gold", 250, true],
      ["silver", 250, false],
    ]);
    expect(result.current.basisRows[0]?.totalDueWithoutJewellery).toBe(225);
    expect(result.current.nisabBasis).toBe("gold");
    await unmount();
  });

  it("loads an older draft that has no personal jewellery field", async () => {
    repoGet.mockResolvedValue({ ...FULL_DRAFT, values: { cash: "1.000" } });
    const { result, unmount } = await setup();
    expect(result.current.values.personalJewellery).toBeUndefined();
    expect(result.current.personalJewelleryValue).toBe(0);
    await unmount();
  });
});
