/**
 * Zakat calculator (NF-2.2). Pure math — no fatwa engine. The user enters their
 * zakatable wealth components and a nisab threshold; if net wealth meets nisab,
 * zakat is 2.5% of it. A disclaimer directs nuanced cases to a scholar.
 */

import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  ZAKAT_WEALTH_RATE,
} from "@munib-tracker/shared/content";

export { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, ZAKAT_WEALTH_RATE as ZAKAT_RATE };

export interface ZakatAssets {
  cash?: number;
  gold?: number;
  silver?: number;
  stocks?: number;
  business?: number;
  receivables?: number;
  rentalIncome?: number;
  otherAssets?: number;
  /** Immediate debts due — deducted from gross zakatable wealth. */
  debts?: number;
}

export interface ZakatResult {
  /** Zakatable wealth after subtracting debts (never negative). */
  netWealth: number;
  /** Whether net wealth meets the nisab threshold. */
  meetsNisab: boolean;
  /** Zakat due (2.5% of net wealth) — 0 when below nisab. */
  due: number;
}

const positive = (value: number | undefined): number => Math.max(0, value ?? 0);

/** Market value from weight × spot price per gram. */
export function metalValue(grams: number, pricePerGram: number): number {
  return Math.max(0, grams) * Math.max(0, pricePerGram);
}

/** Nisab threshold from the current gold price per gram. */
export function nisabFromGoldPrice(pricePerGram: number): number {
  return Math.round(metalValue(GOLD_NISAB_GRAMS, pricePerGram) * 100) / 100;
}

/** Nisab threshold from the current silver price per gram. */
export function nisabFromSilverPrice(pricePerGram: number): number {
  return Math.round(metalValue(SILVER_NISAB_GRAMS, pricePerGram) * 100) / 100;
}

/** Returns the lower of two positive nisab values (0 when both are unset). */
export function lowerNisab(goldNisab: number, silverNisab: number): number {
  const candidates = [goldNisab, silverNisab].filter((n) => n > 0);
  if (candidates.length === 0) return 0;
  return Math.min(...candidates);
}

/** Computes net zakatable wealth and the 2.5% due against a nisab threshold. */
export function computeZakat(assets: ZakatAssets, nisab: number): ZakatResult {
  const gross =
    positive(assets.cash) +
    positive(assets.gold) +
    positive(assets.silver) +
    positive(assets.stocks) +
    positive(assets.business) +
    positive(assets.receivables) +
    positive(assets.rentalIncome) +
    positive(assets.otherAssets);
  const netWealth = Math.max(0, gross - positive(assets.debts));
  const meetsNisab = nisab > 0 && netWealth >= nisab;
  const due = meetsNisab ? Math.round(netWealth * ZAKAT_WEALTH_RATE * 100) / 100 : 0;
  return { netWealth, meetsNisab, due };
}
