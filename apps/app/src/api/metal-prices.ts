/**
 * Spot gold/silver prices for the zakat calculator.
 *
 * Primary: Minted Metal LBMA feed (CC BY 4.0, no key) — USD per troy oz.
 * Fallback: Frankfurter XAU/XAG (oz per 1 USD inverted to USD/oz).
 *
 * @see https://mintedmetal.com/api/
 * @see https://frankfurter.dev/
 */

import { fetchFxRates } from "@/api/fx-rates";
import { formatNumberForInput, type NumberFormatStyle } from "@/lib/format-currency";

/** Exact grams in one troy ounce (ISO / LBMA convention). */
export const TROY_OUNCE_GRAMS = 31.1034768;

export type MetalSpotPrices = {
  goldUsdPerOz: number;
  silverUsdPerOz: number;
  goldUsdPerGram: number;
  silverUsdPerGram: number;
  updatedAt: string;
  /** Human-readable attribution for the UI. */
  source: "minted-metal" | "frankfurter";
  attribution: string;
};

type MintedMetalPayload = {
  updatedAt?: string;
  metals?: {
    gold?: { price?: number };
    silver?: { price?: number };
  };
};

const MINTED_METAL_URL = "https://mintedmetal.com/api/prices.json";

let memoryCache: { prices: MetalSpotPrices; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000;

function ozToGram(usdPerOz: number): number {
  return usdPerOz / TROY_OUNCE_GRAMS;
}

function roundMoney(n: number): number {
  return Math.round(n * 10000) / 10000;
}

async function fetchMintedMetalSpot(): Promise<MetalSpotPrices | null> {
  try {
    const res = await fetch(MINTED_METAL_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as MintedMetalPayload;
    const goldUsdPerOz = json.metals?.gold?.price;
    const silverUsdPerOz = json.metals?.silver?.price;
    if (
      !Number.isFinite(goldUsdPerOz) ||
      !Number.isFinite(silverUsdPerOz) ||
      (goldUsdPerOz as number) <= 0 ||
      (silverUsdPerOz as number) <= 0
    ) {
      return null;
    }
    return {
      goldUsdPerOz: goldUsdPerOz as number,
      silverUsdPerOz: silverUsdPerOz as number,
      goldUsdPerGram: roundMoney(ozToGram(goldUsdPerOz as number)),
      silverUsdPerGram: roundMoney(ozToGram(silverUsdPerOz as number)),
      updatedAt: json.updatedAt ?? new Date().toISOString(),
      source: "minted-metal",
      attribution: "Minted Metal (LBMA)",
    };
  } catch {
    return null;
  }
}

async function fetchFrankfurterMetalSpot(): Promise<MetalSpotPrices | null> {
  const fx = await fetchFxRates("USD");
  if (!fx) return null;
  const xau = fx.rates.XAU; // troy oz of gold per 1 USD
  const xag = fx.rates.XAG;
  if (!xau || !xag || xau <= 0 || xag <= 0) return null;
  const goldUsdPerOz = 1 / xau;
  const silverUsdPerOz = 1 / xag;
  return {
    goldUsdPerOz,
    silverUsdPerOz,
    goldUsdPerGram: roundMoney(ozToGram(goldUsdPerOz)),
    silverUsdPerGram: roundMoney(ozToGram(silverUsdPerOz)),
    updatedAt: `${fx.date}T12:00:00.000Z`,
    source: "frankfurter",
    attribution: "Frankfurter (XAU/XAG)",
  };
}

/** Cache-first gold/silver spot in USD. */
export async function fetchMetalSpotPrices(): Promise<MetalSpotPrices | null> {
  if (memoryCache && Date.now() - memoryCache.fetchedAt < CACHE_TTL_MS) {
    return memoryCache.prices;
  }

  const primary = await fetchMintedMetalSpot();
  const prices = primary ?? (await fetchFrankfurterMetalSpot());
  if (!prices) return null;

  memoryCache = { prices, fetchedAt: Date.now() };
  return prices;
}

/** Convert USD-per-gram spot into the user's currency. */
export function metalPriceInCurrency(
  usdPerGram: number,
  currencyCode: string,
  usdRates: Record<string, number>,
): number | null {
  const code = currencyCode.trim().toUpperCase();
  if (code === "USD") return roundMoney(usdPerGram);
  const rate = usdRates[code];
  if (!rate || rate <= 0) return null;
  return roundMoney(usdPerGram * rate);
}

/** Format a per-gram price for TextInput prefill (grouped, readable). */
export function formatPriceInput(value: number, numberFormat?: NumberFormatStyle): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  const maxFraction = value >= 10 ? 2 : 4;
  return formatNumberForInput(value, maxFraction, numberFormat);
}

/** Test helper — clears in-memory metal cache. */
export function clearMetalPricesCacheForTests(): void {
  memoryCache = null;
}
