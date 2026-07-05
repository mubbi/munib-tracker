/**
 * Zakat calculator (NF-2.2). Pure math — no fatwa engine. The user enters their
 * zakatable wealth components and a nisab threshold; if net wealth meets nisab,
 * zakat is 2.5% of it. A disclaimer directs nuanced cases to a scholar.
 */

export const ZAKAT_RATE = 0.025;

export interface ZakatAssets {
  cash?: number;
  gold?: number;
  silver?: number;
  business?: number;
  otherAssets?: number;
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

/** Computes net zakatable wealth and the 2.5% due against a nisab threshold. */
export function computeZakat(assets: ZakatAssets, nisab: number): ZakatResult {
  const gross =
    positive(assets.cash) +
    positive(assets.gold) +
    positive(assets.silver) +
    positive(assets.business) +
    positive(assets.otherAssets);
  const netWealth = Math.max(0, gross - positive(assets.debts));
  const meetsNisab = nisab > 0 && netWealth >= nisab;
  const due = meetsNisab ? Math.round(netWealth * ZAKAT_RATE * 100) / 100 : 0;
  return { netWealth, meetsNisab, due };
}
