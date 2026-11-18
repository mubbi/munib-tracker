import { fakeResponse, mockFetch, mockFetchByUrl } from "@/test-support/fetch";

import { clearFxRatesCacheForTests } from "./fx-rates";
import {
  clearMetalPricesCacheForTests,
  fetchMetalSpotPrices,
  formatPriceInput,
  metalPriceInCurrency,
  TROY_OUNCE_GRAMS,
} from "./metal-prices";

const minted = (gold: unknown, silver: unknown, updatedAt?: string) =>
  fakeResponse({ updatedAt, metals: { gold: { price: gold }, silver: { price: silver } } });

const frankfurter = (rates: Record<string, number>) =>
  fakeResponse(
    Object.entries(rates).map(([quote, rate]) => ({
      date: "2026-07-03",
      base: "USD",
      quote,
      rate,
    })),
  );

beforeEach(() => {
  clearMetalPricesCacheForTests();
  clearFxRatesCacheForTests();
  jest.restoreAllMocks();
});

describe("fetchMetalSpotPrices", () => {
  it("uses the Minted Metal LBMA feed", async () => {
    mockFetch(minted(TROY_OUNCE_GRAMS * 100, TROY_OUNCE_GRAMS, "2026-07-03T09:00:00Z"));
    await expect(fetchMetalSpotPrices()).resolves.toEqual({
      goldUsdPerOz: TROY_OUNCE_GRAMS * 100,
      silverUsdPerOz: TROY_OUNCE_GRAMS,
      goldUsdPerGram: 100,
      silverUsdPerGram: 1,
      updatedAt: "2026-07-03T09:00:00Z",
      source: "minted-metal",
      attribution: "Minted Metal (LBMA)",
    });
  });

  it("stamps the fetch time when the feed has no timestamp", async () => {
    mockFetch(minted(2000, 25));
    const prices = await fetchMetalSpotPrices();
    expect(Number.isNaN(Date.parse(prices?.updatedAt ?? ""))).toBe(false);
  });

  it("caches prices for 15 minutes", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(5_000_000);
    mockFetch(minted(2000, 25));
    const first = await fetchMetalSpotPrices();
    const fetchMock = mockFetch(minted(1, 1));
    await expect(fetchMetalSpotPrices()).resolves.toBe(first);
    expect(fetchMock).not.toHaveBeenCalled();

    now.mockReturnValue(5_000_000 + 15 * 60 * 1000);
    await expect(fetchMetalSpotPrices()).resolves.toMatchObject({ goldUsdPerOz: 1 });
  });

  it.each([
    ["an HTTP error", fakeResponse({}, { status: 503 })],
    ["a missing silver price", minted(2000, undefined)],
    ["a zero gold price", minted(0, 25)],
    ["a network failure", new Error("offline")],
  ])("falls back to Frankfurter XAU/XAG after %s", async (_label, reply) => {
    mockFetchByUrl({
      mintedmetal: reply,
      frankfurter: frankfurter({ XAU: 0.0005, XAG: 0.04 }),
    });
    await expect(fetchMetalSpotPrices()).resolves.toMatchObject({
      goldUsdPerOz: 2000,
      silverUsdPerOz: 25,
      updatedAt: "2026-07-03T12:00:00.000Z",
      source: "frankfurter",
    });
  });

  it.each([
    ["no FX feed", fakeResponse({}, { status: 500 })],
    ["no metal quotes", frankfurter({ EUR: 0.9 })],
  ])("returns null when both sources fail (%s)", async (_label, fxReply) => {
    mockFetchByUrl({ mintedmetal: new Error("offline"), frankfurter: fxReply });
    await expect(fetchMetalSpotPrices()).resolves.toBeNull();
  });
});

describe("metalPriceInCurrency", () => {
  it.each([
    [" usd ", 1.23456, 1.2346],
    ["EUR", 2, 1],
    ["GBP", 2, null],
    ["BAD", 2, null],
  ])("converts to %p", (code, usdPerGram, expected) => {
    expect(metalPriceInCurrency(usdPerGram, code, { EUR: 0.5, BAD: -1 })).toBe(expected);
  });
});

describe("formatPriceInput", () => {
  it.each([
    [0, ""],
    [Number.NaN, ""],
    [-3, ""],
  ])("blanks %p", (value, expected) => {
    expect(formatPriceInput(value)).toBe(expected);
  });

  it("keeps two decimals at or above 10 and four below", () => {
    expect(formatPriceInput(1234.5678)).toBe("1,234.57");
    expect(formatPriceInput(1.234567)).toBe("1.2346");
  });
});
