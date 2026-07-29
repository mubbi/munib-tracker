/**
 * Zakat calculator (NF-2.2). Pure math + educational estimates — not a fatwa engine.
 * Wealth zakat is 2.5% above nisab. Crops (ushr) and livestock follow separate
 * Sunnah scales. Personal-use dwellings and cars are generally exempt; investment
 * / trade assets may be included. Always consult a qualified scholar.
 */

/** Canonical nisab / rate (mirrored from zakat-guide content; keep in sync). */
export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;
export const ZAKAT_RATE = 0.025;
const ZAKAT_WEALTH_RATE = ZAKAT_RATE;

/** 1 tola (South Asia jewellery trade) ≈ 11.6638038 g. */
export const GRAMS_PER_TOLA = 11.6638038;
/** 1 troy ounce (LBMA / API spot) = 31.1034768 g. */
export const GRAMS_PER_TROY_OZ = 31.1034768;
export const GRAMS_PER_KG = 1000;

export type MetalWeightUnit = "g" | "tola" | "oz" | "kg";
export type GoldKarat = 24 | 22 | 21 | 18 | 14 | 10;
export type SilverPurity = 999 | 925 | 900 | 800;
export type CropIrrigation = "natural" | "irrigated";

export const METAL_WEIGHT_UNITS: readonly MetalWeightUnit[] = ["g", "tola", "oz", "kg"];
export const GOLD_KARATS: readonly GoldKarat[] = [24, 22, 21, 18, 14, 10];
export const SILVER_PURITIES: readonly SilverPurity[] = [999, 925, 900, 800];

export interface ZakatAssets {
  cash?: number;
  gold?: number;
  silver?: number;
  stocks?: number;
  business?: number;
  receivables?: number;
  rentalIncome?: number;
  otherAssets?: number;
  crypto?: number;
  /** Plots / land held for investment or sale (market value). */
  investmentPlots?: number;
  /** Amount already paid on installment investment plots. */
  installmentPlotsPaid?: number;
  /** Houses / buildings held for investment or trade (not a personal dwelling). */
  investmentProperty?: number;
  /** Vehicles held for sale or as trade goods (not personal-use cars). */
  tradeVehicles?: number;
  debts?: number;
  livingExpenses?: number;
}

export interface LivestockInput {
  sheep?: number;
  cattle?: number;
  camels?: number;
  /** Optional cash value per head — used only for a cash-equivalent estimate. */
  sheepValue?: number;
  cattleValue?: number;
  camelValue?: number;
}

export interface AgricultureInput {
  /** Market value of this season's harvest (crops/fruit). */
  harvestValue?: number;
  /** Natural water → 10% ushr; irrigated/costly water → 5%. */
  irrigation?: CropIrrigation;
}

export interface LivestockAnimalsDue {
  sheep: number;
  cattleTabi: number;
  cattleMusinnah: number;
  camelSheep: number;
  camelBintMakhad: number;
  camelBintLabun: number;
  camelHiqqah: number;
  camelJadhah: number;
}

export interface ZakatResult {
  netWealth: number;
  meetsNisab: boolean;
  /** 2.5% wealth zakat (0 when below nisab). */
  due: number;
  wealthDue: number;
  agricultureDue: number;
  livestockAnimals: LivestockAnimalsDue;
  livestockCashEstimate: number;
  /** Wealth + agriculture + optional livestock cash estimate. */
  totalDue: number;
}

const positive = (value: number | undefined): number => Math.max(0, value ?? 0);

const emptyLivestockAnimals = (): LivestockAnimalsDue => ({
  sheep: 0,
  cattleTabi: 0,
  cattleMusinnah: 0,
  camelSheep: 0,
  camelBintMakhad: 0,
  camelBintLabun: 0,
  camelHiqqah: 0,
  camelJadhah: 0,
});

/** Grams per one unit of weight. */
export function gramsPerMetalUnit(unit: MetalWeightUnit): number {
  switch (unit) {
    case "tola":
      return GRAMS_PER_TOLA;
    case "oz":
      return GRAMS_PER_TROY_OZ;
    case "kg":
      return GRAMS_PER_KG;
    default:
      return 1;
  }
}

/** Convert a metal weight into grams. */
export function toGrams(amount: number, unit: MetalWeightUnit): number {
  return Math.max(0, amount) * gramsPerMetalUnit(unit);
}

/** Pure-gold grams from jewellery weight and karat (24k = pure). */
export function goldPureGrams(weight: number, unit: MetalWeightUnit, karat: GoldKarat): number {
  return toGrams(weight, unit) * (karat / 24);
}

/** Fine-silver grams from weight and millesimal purity (999 ≈ pure). */
export function silverFineGrams(
  weight: number,
  unit: MetalWeightUnit,
  purity: SilverPurity,
): number {
  return toGrams(weight, unit) * (purity / 1000);
}

/** Market value from weight × spot price per gram. */
export function metalValue(grams: number, pricePerGram: number): number {
  return Math.max(0, grams) * Math.max(0, pricePerGram);
}

/** Gold market value using live 24k spot × karat purity. */
export function goldValueFromWeight(
  weight: number,
  unit: MetalWeightUnit,
  karat: GoldKarat,
  pricePerGram24k: number,
): number {
  return metalValue(goldPureGrams(weight, unit, karat), pricePerGram24k);
}

/** Silver market value using live ~999 spot × purity. */
export function silverValueFromWeight(
  weight: number,
  unit: MetalWeightUnit,
  purity: SilverPurity,
  pricePerGramFine: number,
): number {
  return metalValue(silverFineGrams(weight, unit, purity), pricePerGramFine);
}

/** Spot price per local unit from a 24k/fine per-gram price. */
export function pricePerUnitFromGramPrice(
  pricePerGram: number,
  unit: MetalWeightUnit,
  purityRatio = 1,
): number {
  return Math.max(0, pricePerGram) * gramsPerMetalUnit(unit) * Math.max(0, purityRatio);
}

/** Nisab threshold from the current gold price per gram (24k). */
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

/**
 * Sheep/goats (ghanam) — Bukhari/Abu Dawud scales for free-grazing flocks.
 * Returns number of sheep due.
 */
export function sheepZakatDue(count: number): number {
  const n = Math.floor(positive(count));
  if (n < 40) return 0;
  if (n <= 120) return 1;
  if (n <= 200) return 2;
  if (n <= 399) return 3;
  return Math.floor(n / 100);
}

/**
 * Cattle (baqar) — for every 30: one tabi' (1 yr); for every 40: one musinnah (2 yr).
 * Chooses the combination that covers the most animals under the Sunnah brackets.
 */
export function cattleZakatDue(count: number): { tabi: number; musinnah: number } {
  const n = Math.floor(positive(count));
  if (n < 30) return { tabi: 0, musinnah: 0 };

  let best = { tabi: 0, musinnah: 0 };
  let bestCovered = 0;
  for (let musinnah = 0; musinnah <= Math.floor(n / 40); musinnah++) {
    for (let tabi = 0; tabi <= Math.floor((n - 40 * musinnah) / 30); tabi++) {
      if (musinnah === 0 && tabi === 0) continue;
      const covered = 40 * musinnah + 30 * tabi;
      if (covered > n) continue;
      const bestCount = best.musinnah + best.tabi;
      const nextCount = musinnah + tabi;
      if (
        covered > bestCovered ||
        (covered === bestCovered && nextCount < bestCount) ||
        (covered === bestCovered && nextCount === bestCount && musinnah > best.musinnah)
      ) {
        best = { tabi, musinnah };
        bestCovered = covered;
      }
    }
  }
  if (bestCovered === 0) return { tabi: 1, musinnah: 0 };
  return best;
}

/**
 * Camels — abbreviated Sunnah scale (sheep for 5–24, then age-class camels).
 * Higher brackets are simplified; for large herds consult a scholar.
 */
export function camelZakatDue(count: number): {
  sheep: number;
  bintMakhad: number;
  bintLabun: number;
  hiqqah: number;
  jadhah: number;
} {
  const n = Math.floor(positive(count));
  if (n < 5) return { sheep: 0, bintMakhad: 0, bintLabun: 0, hiqqah: 0, jadhah: 0 };
  if (n <= 9) return { sheep: 1, bintMakhad: 0, bintLabun: 0, hiqqah: 0, jadhah: 0 };
  if (n <= 14) return { sheep: 2, bintMakhad: 0, bintLabun: 0, hiqqah: 0, jadhah: 0 };
  if (n <= 19) return { sheep: 3, bintMakhad: 0, bintLabun: 0, hiqqah: 0, jadhah: 0 };
  if (n <= 24) return { sheep: 4, bintMakhad: 0, bintLabun: 0, hiqqah: 0, jadhah: 0 };
  if (n <= 35) return { sheep: 0, bintMakhad: 1, bintLabun: 0, hiqqah: 0, jadhah: 0 };
  if (n <= 45) return { sheep: 0, bintMakhad: 0, bintLabun: 1, hiqqah: 0, jadhah: 0 };
  if (n <= 60) return { sheep: 0, bintMakhad: 0, bintLabun: 0, hiqqah: 1, jadhah: 0 };
  if (n <= 75) return { sheep: 0, bintMakhad: 0, bintLabun: 0, hiqqah: 0, jadhah: 1 };
  if (n <= 90) return { sheep: 0, bintMakhad: 0, bintLabun: 2, hiqqah: 0, jadhah: 0 };
  if (n <= 120) return { sheep: 0, bintMakhad: 0, bintLabun: 0, hiqqah: 2, jadhah: 0 };
  // Above 120: 1 hiqqah per 40 or 1 jadhah per 50 — use hiqqah-per-40 estimate.
  return {
    sheep: 0,
    bintMakhad: 0,
    bintLabun: 0,
    hiqqah: Math.floor(n / 40),
    jadhah: 0,
  };
}

export function computeLivestockAnimals(input: LivestockInput): LivestockAnimalsDue {
  const cattle = cattleZakatDue(input.cattle ?? 0);
  const camels = camelZakatDue(input.camels ?? 0);
  return {
    sheep: sheepZakatDue(input.sheep ?? 0) + camels.sheep,
    cattleTabi: cattle.tabi,
    cattleMusinnah: cattle.musinnah,
    camelSheep: camels.sheep,
    camelBintMakhad: camels.bintMakhad,
    camelBintLabun: camels.bintLabun,
    camelHiqqah: camels.hiqqah,
    camelJadhah: camels.jadhah,
  };
}

/** Optional cash estimate when the user supplies per-head market values. */
export function livestockCashEstimate(animals: LivestockAnimalsDue, input: LivestockInput): number {
  const sheepValue = positive(input.sheepValue);
  const cattleValue = positive(input.cattleValue);
  const camelValue = positive(input.camelValue);
  const sheepHeads = animals.sheep; // includes camel-bracket sheep dues
  const cattleHeads = animals.cattleTabi + animals.cattleMusinnah;
  const camelHeads =
    animals.camelBintMakhad + animals.camelBintLabun + animals.camelHiqqah + animals.camelJadhah;
  return sheepHeads * sheepValue + cattleHeads * cattleValue + camelHeads * camelValue;
}

/** Ushr on harvest value: 10% natural water, 5% irrigated (Qur'an / Sunnah). */
export function computeAgricultureDue(input: AgricultureInput): number {
  const value = positive(input.harvestValue);
  if (value <= 0) return 0;
  const rate = input.irrigation === "irrigated" ? 0.05 : 0.1;
  return Math.round(value * rate * 100) / 100;
}

/** Computes net zakatable monetary wealth and the 2.5% due against a nisab threshold. */
export function computeZakat(
  assets: ZakatAssets,
  nisab: number,
  extras?: { livestock?: LivestockInput; agriculture?: AgricultureInput },
): ZakatResult {
  const gross =
    positive(assets.cash) +
    positive(assets.gold) +
    positive(assets.silver) +
    positive(assets.stocks) +
    positive(assets.business) +
    positive(assets.receivables) +
    positive(assets.rentalIncome) +
    positive(assets.otherAssets) +
    positive(assets.crypto) +
    positive(assets.investmentPlots) +
    positive(assets.installmentPlotsPaid) +
    positive(assets.investmentProperty) +
    positive(assets.tradeVehicles);
  const deductions = positive(assets.debts) + positive(assets.livingExpenses);
  const netWealth = Math.max(0, gross - deductions);
  const meetsNisab = nisab > 0 && netWealth >= nisab;
  const wealthDue = meetsNisab ? Math.round(netWealth * ZAKAT_WEALTH_RATE * 100) / 100 : 0;

  const livestockAnimals = extras?.livestock
    ? computeLivestockAnimals(extras.livestock)
    : emptyLivestockAnimals();
  const livestockCash = extras?.livestock
    ? livestockCashEstimate(livestockAnimals, extras.livestock)
    : 0;
  const agricultureDue = extras?.agriculture ? computeAgricultureDue(extras.agriculture) : 0;
  const totalDue = Math.round((wealthDue + agricultureDue + livestockCash) * 100) / 100;

  return {
    netWealth,
    meetsNisab,
    due: wealthDue,
    wealthDue,
    agricultureDue,
    livestockAnimals,
    livestockCashEstimate: Math.round(livestockCash * 100) / 100,
    totalDue,
  };
}
