/**
 * Free mid-market FX via Frankfurter (ECB + open data) — no API key.
 * @see https://frankfurter.dev/
 */

const FRANKFURTER_BASE_URL = "https://api.frankfurter.dev";

type FrankfurterBulkRateRow = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export type FxRatesSnapshot = {
  base: string;
  date: string;
  /** Quote currency → units of quote per 1 unit of base. */
  rates: Record<string, number>;
};

const cache = new Map<string, { snapshot: FxRatesSnapshot; fetchedAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

function normalizeCode(code: string): string | null {
  const trimmed = code.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(trimmed) ? trimmed : null;
}

/**
 * Fetch all latest rates for a base currency (default USD) in one request.
 * Includes fiat quotes plus XAU/XAG (troy oz per 1 USD) when the feed provides them.
 */
export async function fetchFxRates(baseCurrency = "USD"): Promise<FxRatesSnapshot | null> {
  const base = normalizeCode(baseCurrency);
  if (!base) return null;

  const cached = cache.get(base);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.snapshot;
  }

  const url = `${FRANKFURTER_BASE_URL}/v2/rates?base=${encodeURIComponent(base)}`;

  try {
    const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) return null;

    const json = (await res.json()) as FrankfurterBulkRateRow[];
    if (!Array.isArray(json) || json.length === 0) return null;

    const rates: Record<string, number> = { [base]: 1 };
    let marketDate = "";

    for (const row of json) {
      if (row.base !== base) continue;
      const quote = normalizeCode(row.quote);
      if (!quote || !Number.isFinite(row.rate) || row.rate <= 0) continue;
      rates[quote] = row.rate;
      if (!marketDate && row.date) marketDate = row.date;
    }

    if (Object.keys(rates).length <= 1 || !marketDate) return null;

    const snapshot: FxRatesSnapshot = { base, date: marketDate, rates };
    cache.set(base, { snapshot, fetchedAt: Date.now() });
    return snapshot;
  } catch {
    return null;
  }
}

/** Convert an amount from `from` to `to` using a USD-based rates table. */
export function convertWithUsdRates(
  amount: number,
  from: string,
  to: string,
  usdRates: Record<string, number>,
): number | null {
  const source = normalizeCode(from);
  const target = normalizeCode(to);
  if (!source || !target) return null;
  if (source === target) return amount;

  const fromPerUsd = source === "USD" ? 1 : usdRates[source];
  const toPerUsd = target === "USD" ? 1 : usdRates[target];
  if (!fromPerUsd || !toPerUsd || fromPerUsd <= 0 || toPerUsd <= 0) return null;

  // amount_in_from → USD → target
  const inUsd = amount / fromPerUsd;
  return inUsd * toPerUsd;
}

/** Units of `quote` per 1 USD from a USD-based snapshot. */
export function usdQuoteRate(snapshot: FxRatesSnapshot, quote: string): number | null {
  const code = normalizeCode(quote);
  if (!code) return null;
  if (code === snapshot.base) return 1;
  const rate = snapshot.rates[code];
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

/** Test helper — clears in-memory FX cache. */
export function clearFxRatesCacheForTests(): void {
  cache.clear();
}
