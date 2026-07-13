import {
  clearFxRatesCacheForTests,
  convertWithUsdRates,
  type FxRatesSnapshot,
  usdQuoteRate,
} from "@/api/fx-rates";
import {
  clearMetalPricesCacheForTests,
  formatPriceInput,
  metalPriceInCurrency,
  TROY_OUNCE_GRAMS,
} from "@/api/metal-prices";
import { getCurrencyInfo, SUPPORTED_CURRENCIES } from "@/constants/currencies";
import {
  formatMoneyAmount,
  formatNumberForInput,
  formatNumberInput,
  parseNumberInput,
  reformatNumberString,
} from "@/lib/format-currency";

describe("currencies catalogue", () => {
  it("includes SAR and AED with vector glyphs", () => {
    expect(getCurrencyInfo("SAR")?.glyph).toBe("SAR");
    expect(getCurrencyInfo("AED")?.glyph).toBe("AED");
    expect(SUPPORTED_CURRENCIES.length).toBeGreaterThan(100);
  });
});

describe("formatMoneyAmount", () => {
  it("uses catalogue symbols for glyph currencies", () => {
    const sar = formatMoneyAmount(1234.5, "SAR", "comma_dot");
    expect(sar).toContain("ر.س");
    expect(sar).toContain("1,234.50");

    const aed = formatMoneyAmount(50, "AED", "comma_dot");
    expect(aed).toContain("د.إ");
  });

  it("respects number format style", () => {
    expect(formatMoneyAmount(22000.03, "USD", "dot_comma")).toContain("22.000,03");
    expect(formatMoneyAmount(22000.03, "USD", "space_comma")).toMatch(/22\u00A0000,03/);
  });
});

describe("number input formatting", () => {
  it("groups thousands while typing (comma_dot)", () => {
    expect(formatNumberInput("1234567")).toBe("1,234,567");
    expect(formatNumberInput("1234.5")).toBe("1,234.5");
    expect(formatNumberInput("12.")).toBe("12.");
  });

  it("groups with European style", () => {
    expect(formatNumberInput("1234567", 2, "dot_comma")).toBe("1.234.567");
    expect(formatNumberInput("1234,5", 2, "dot_comma")).toBe("1.234,5");
    expect(parseNumberInput("1.234,56", "dot_comma")).toBe(1234.56);
  });

  it("parses grouped input", () => {
    expect(parseNumberInput("1,234.56")).toBe(1234.56);
    expect(parseNumberInput("")).toBe(0);
  });

  it("formats finite numbers for inputs", () => {
    expect(formatNumberForInput(132.4567, 2)).toBe("132.46");
    expect(formatNumberForInput(1234567.8, 2)).toBe("1,234,567.8");
    expect(formatNumberForInput(1234567.8, 2, "dot_comma")).toBe("1.234.567,8");
  });

  it("reformats between styles", () => {
    expect(reformatNumberString("1,234.56", "comma_dot", "dot_comma", 2)).toBe("1.234,56");
    expect(reformatNumberString("1.234,56", "dot_comma", "space_dot", 2)).toBe("1\u00A0234.56");
  });
});

describe("fx helpers", () => {
  afterEach(() => {
    clearFxRatesCacheForTests();
  });

  it("converts via USD rates table", () => {
    const rates = { USD: 1, SAR: 3.75, PKR: 280 };
    expect(convertWithUsdRates(100, "USD", "SAR", rates)).toBe(375);
    expect(convertWithUsdRates(375, "SAR", "USD", rates)).toBe(100);
    expect(convertWithUsdRates(100, "SAR", "PKR", rates)).toBeCloseTo((100 / 3.75) * 280);
  });

  it("reads quote rates from a snapshot", () => {
    const snapshot: FxRatesSnapshot = {
      base: "USD",
      date: "2026-07-13",
      rates: { USD: 1, AED: 3.6725 },
    };
    expect(usdQuoteRate(snapshot, "AED")).toBe(3.6725);
    expect(usdQuoteRate(snapshot, "USD")).toBe(1);
    expect(usdQuoteRate(snapshot, "XYZ")).toBeNull();
  });
});

describe("metal price helpers", () => {
  afterEach(() => {
    clearMetalPricesCacheForTests();
  });

  it("converts USD/gram into local currency", () => {
    const rates = { USD: 1, SAR: 3.75 };
    expect(metalPriceInCurrency(100, "USD", rates)).toBe(100);
    expect(metalPriceInCurrency(100, "SAR", rates)).toBe(375);
  });

  it("formats price inputs stably", () => {
    expect(formatPriceInput(132.4567)).toBe("132.46");
    expect(formatPriceInput(1.23456)).toBe("1.2346");
    expect(formatPriceInput(0)).toBe("");
  });

  it("uses the troy ounce constant", () => {
    expect(TROY_OUNCE_GRAMS).toBeCloseTo(31.1034768);
  });
});
