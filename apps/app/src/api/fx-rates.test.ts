import { fakeResponse, mockFetch } from "@/test-support/fetch";

import {
  clearFxRatesCacheForTests,
  convertWithUsdRates,
  type FxRatesSnapshot,
  fetchFxRates,
  usdQuoteRate,
} from "./fx-rates";

const row = (quote: string, rate: number, overrides: Record<string, unknown> = {}) => ({
  date: "2026-07-03",
  base: "USD",
  quote,
  rate,
  ...overrides,
});

beforeEach(() => {
  clearFxRatesCacheForTests();
  jest.restoreAllMocks();
});

describe("fetchFxRates", () => {
  it("requests the bulk feed for the normalised base", async () => {
    const fetchMock = mockFetch(fakeResponse([row("EUR", 0.9, { base: "USD" })]));
    await fetchFxRates(" usd ");
    expect(fetchMock).toHaveBeenCalledWith("https://api.frankfurter.dev/v2/rates?base=USD", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  });

  it("keeps valid quotes for the base and drops the rest", async () => {
    mockFetch(
      fakeResponse([
        row("EUR", 0.9),
        row("GBP", 0.8, { base: "EUR" }),
        row("bad!", 1),
        row("JPY", 0),
        row("XAU", Number.NaN),
        row("PKR", 280, { date: "2026-07-02" }),
      ]),
    );
    await expect(fetchFxRates()).resolves.toEqual({
      base: "USD",
      date: "2026-07-03",
      rates: { USD: 1, EUR: 0.9, PKR: 280 },
    });
  });

  it("caches a snapshot for an hour", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    mockFetch(fakeResponse([row("EUR", 0.9)]));
    const first = await fetchFxRates();
    const fetchMock = mockFetch(fakeResponse([row("EUR", 0.5)]));

    await expect(fetchFxRates()).resolves.toBe(first);
    expect(fetchMock).not.toHaveBeenCalled();

    now.mockReturnValue(1_000_000 + 60 * 60 * 1000);
    await expect(fetchFxRates()).resolves.toMatchObject({ rates: { EUR: 0.5 } });
  });

  it("rejects an invalid base without fetching", async () => {
    const fetchMock = mockFetch();
    await expect(fetchFxRates("dollars")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["an HTTP error", fakeResponse({}, { status: 500 })],
    ["a non-array body", fakeResponse({ rates: {} })],
    ["an empty list", fakeResponse([])],
    ["no usable quotes", fakeResponse([row("EUR", -1)])],
    ["no market date", fakeResponse([row("EUR", 0.9, { date: "" })])],
    ["a network failure", new Error("offline")],
  ])("returns null for %s", async (_label, reply) => {
    mockFetch(reply);
    await expect(fetchFxRates("EUR")).resolves.toBeNull();
  });
});

describe("convertWithUsdRates", () => {
  const rates = { EUR: 0.5, PKR: 250, BAD: 0 };

  it.each([
    [10, "USD", "EUR", 5],
    [10, "EUR", "USD", 20],
    [10, "EUR", "PKR", 5000],
    [10, "eur", "EUR", 10],
  ])("%p %s → %s is %p", (amount, from, to, expected) => {
    expect(convertWithUsdRates(amount, from, to, rates)).toBe(expected);
  });

  it.each([
    ["an invalid code", "EURO", "USD"],
    ["an unknown rate", "USD", "GBP"],
    ["a zero rate", "BAD", "USD"],
  ])("returns null for %s", (_label, from, to) => {
    expect(convertWithUsdRates(1, from, to, rates)).toBeNull();
  });
});

describe("usdQuoteRate", () => {
  const snapshot: FxRatesSnapshot = {
    base: "USD",
    date: "2026-07-03",
    rates: { USD: 1, EUR: 0.9, BAD: -1 },
  };

  it.each([
    ["usd", 1],
    ["EUR", 0.9],
    ["BAD", null],
    ["GBP", null],
    ["??", null],
  ])("usdQuoteRate(%p) is %p", (quote, expected) => {
    expect(usdQuoteRate(snapshot, quote)).toBe(expected);
  });
});
