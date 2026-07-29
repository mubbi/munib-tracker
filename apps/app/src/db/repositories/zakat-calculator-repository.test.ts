import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { ZakatCalculatorRepository } from "@/db/repositories/zakat-calculator-repository";

describe("ZakatCalculatorRepository", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("round-trips a full calculator draft", async () => {
    await ZakatCalculatorRepository.set({
      currencyCode: "pkr",
      numberFormat: "dot_comma",
      values: { cash: "1.250.000", gold: "50.000", investmentPlots: "2.000.000" },
      nisab: "",
      nisabManual: false,
      goldWeight: "10",
      goldUnit: "tola",
      goldKarat: 22,
      goldPrice: "35.000,5",
      silverWeight: "",
      silverUnit: "g",
      silverPurity: 999,
      silverPrice: "1.200",
      nisabGoldPrice: "35.000,5",
      nisabSilverPrice: "1.200",
      pricesManual: true,
      sheepCount: "40",
      cattleCount: "",
      camelCount: "",
      sheepValue: "25.000",
      cattleValue: "",
      camelValue: "",
      harvestValue: "100.000",
      irrigation: "natural",
    });

    const draft = await ZakatCalculatorRepository.get();
    expect(draft).toMatchObject({
      currencyCode: "PKR",
      numberFormat: "dot_comma",
      values: { cash: "1.250.000", gold: "50.000", investmentPlots: "2.000.000" },
      goldWeight: "10",
      goldUnit: "tola",
      goldKarat: 22,
      pricesManual: true,
      sheepCount: "40",
      harvestValue: "100.000",
      irrigation: "natural",
    });
    expect(draft?.updatedAt).toBeTruthy();
  });

  it("defaults numberFormat for legacy drafts", async () => {
    await AsyncStorage.setItem(
      DB_KEYS.zakatCalculator,
      JSON.stringify({
        currencyCode: "USD",
        values: { cash: "1,000" },
        nisab: "",
        nisabManual: false,
        goldGrams: "12.5",
        silverGrams: "100",
        goldPrice: "80",
        silverPrice: "1",
        nisabGoldPrice: "80",
        nisabSilverPrice: "1",
        pricesManual: false,
        updatedAt: new Date().toISOString(),
      }),
    );
    const draft = await ZakatCalculatorRepository.get();
    expect(draft?.numberFormat).toBe("comma_dot");
    expect(draft?.goldWeight).toBe("12.5");
    expect(draft?.silverWeight).toBe("100");
  });

  it("migrates a legacy currency-only key", async () => {
    await AsyncStorage.setItem(DB_KEYS.zakatCurrency, "SAR");
    const draft = await ZakatCalculatorRepository.get();
    expect(draft?.currencyCode).toBe("SAR");
    expect(draft?.numberFormat).toBe("comma_dot");
    expect(draft?.values).toEqual({});
  });

  it("rejects unknown currency codes on write", async () => {
    await ZakatCalculatorRepository.set({
      currencyCode: "ZZZ",
      numberFormat: "comma_dot",
      values: {},
      nisab: "",
      nisabManual: false,
      goldWeight: "",
      goldUnit: "g",
      goldKarat: 24,
      goldPrice: "",
      silverWeight: "",
      silverUnit: "g",
      silverPurity: 999,
      silverPrice: "",
      nisabGoldPrice: "",
      nisabSilverPrice: "",
      pricesManual: false,
      sheepCount: "",
      cattleCount: "",
      camelCount: "",
      sheepValue: "",
      cattleValue: "",
      camelValue: "",
      harvestValue: "",
      irrigation: "natural",
    });
    expect(await ZakatCalculatorRepository.get()).toBeNull();
  });
});
