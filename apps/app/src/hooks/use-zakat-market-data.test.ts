import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";

import { fetchFxRates } from "@/api/fx-rates";
import { fetchMetalSpotPrices } from "@/api/metal-prices";
import { queryOptionsOf } from "@/test-support/mocks/tanstack-query";

import { useZakatMarketData } from "./use-zakat-market-data";

jest.mock(
  "@tanstack/react-query",
  () => require("@/test-support/mocks/tanstack-query").tanstackQueryOptionsMock,
);

jest.mock("@/api/fx-rates", () => ({
  fetchFxRates: jest.fn(),
  usdQuoteRate: (fx: { rates: Record<string, number> }, code: string) =>
    code === "USD" ? 1 : (fx.rates[code] ?? null),
}));

jest.mock("@/api/metal-prices", () => ({
  fetchMetalSpotPrices: jest.fn(),
  formatPriceInput: (n: number, style: string) => `${style}:${n}`,
  metalPriceInCurrency: (usd: number, code: string, rates: Record<string, number>) =>
    code === "USD" ? usd : rates[code] == null ? null : usd * rates[code],
}));

const metals = { goldUsdPerGram: 100, silverUsdPerGram: 1 };
const fx = { date: "2026-11-18", rates: { EUR: 0.5 } };

async function optionsFor(currency: string, format?: "dot_comma") {
  const { result } = await renderHook(() => useZakatMarketData(currency, format));
  return queryOptionsOf(result.current);
}

beforeEach(() => {
  jest.clearAllMocks();
  (fetchMetalSpotPrices as jest.Mock).mockResolvedValue(metals);
  (fetchFxRates as jest.Mock).mockResolvedValue(fx);
});

describe("useZakatMarketData", () => {
  it("keys the query by currency and format with the default format", async () => {
    const options = await optionsFor("EUR");
    expect(useQuery).toHaveBeenCalled();
    expect(options.queryKey).toEqual(["zakat-market", "EUR", "comma_dot"]);
    expect(options.staleTime).toBe(15 * 60 * 1000);
    expect(options.retry).toBe(2);
  });

  it("converts spot prices into the selected currency", async () => {
    const options = await optionsFor(" eur ", "dot_comma");
    await expect(options.queryFn()).resolves.toEqual({
      goldPerGram: 50,
      silverPerGram: 0.5,
      goldInput: "dot_comma:50",
      silverInput: "dot_comma:0.5",
      metals,
      fxDate: "2026-11-18",
      currencyCode: "EUR",
      hasFxRate: true,
    });
    expect(fetchFxRates).toHaveBeenCalledWith("USD");
  });

  it("treats a blank currency as USD", async () => {
    const options = await optionsFor("  ");
    await expect(options.queryFn()).resolves.toEqual(
      expect.objectContaining({ currencyCode: "USD", goldPerGram: 100, hasFxRate: true }),
    );
  });

  it("falls back to USD spots for an unsupported currency", async () => {
    const options = await optionsFor("PKR");
    await expect(options.queryFn()).resolves.toEqual({
      goldPerGram: 100,
      silverPerGram: 1,
      goldInput: "comma_dot:100",
      silverInput: "comma_dot:1",
      metals,
      fxDate: "2026-11-18",
      currencyCode: "USD",
      hasFxRate: false,
    });
  });

  it("returns null when either feed is unavailable", async () => {
    const options = await optionsFor("USD");
    (fetchMetalSpotPrices as jest.Mock).mockResolvedValueOnce(null);
    await expect(options.queryFn()).resolves.toBeNull();
    (fetchFxRates as jest.Mock).mockResolvedValueOnce(null);
    await expect(options.queryFn()).resolves.toBeNull();
  });
});
