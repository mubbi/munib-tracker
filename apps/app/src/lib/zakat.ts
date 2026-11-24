import type { MadhhabRules, NisabBasis } from "@munib-tracker/shared/fiqh";

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
  /**
   * Women's personal-use jewellery (market value). Counted with gold unless the
   * fiqh options exclude it (only the Hanafi school holds it zakatable; NF-3.0a).
   */
  personalJewellery?: number;
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
  /** How the nisab was assessed (present when `computeZakat` got fiqh options). */
  assessment?: ZakatAssessment;
}

/**
 * How gold, silver and other wealth are put together to reach nisab (NF-3.0a,
 * `MADHHAB_RULES[*].zakat`):
 * - `value`: everything pooled by value against the nisab (Hanafi; also the
 *   app's behaviour before madhhab support).
 * - `parts`: pooled by each holding's share of its own nisab (Maliki, Hanbali).
 * - `separate`: gold and silver are not added to each other (Shafi'i). Cash and
 *   trade goods are measured as the basis metal and pooled with it (app choice).
 */
export type ZakatCombineMethod = "value" | "parts" | "separate";

export interface ZakatFiqhOptions {
  combine: ZakatCombineMethod;
  basis: NisabBasis;
  /** Value of the gold nisab (87.48 g) — 0 when unknown. */
  goldNisab: number;
  /** Value of the silver nisab (612.36 g) — 0 when unknown. */
  silverNisab: number;
  /** Count `personalJewellery` (in the gold pool). Default `true`. */
  includePersonalJewellery?: boolean;
}

/** `all` = one pooled total; `basis` = cash/trade goods + the basis metal (`separate`). */
export type ZakatPoolId = "all" | "basis" | "gold" | "silver";

export interface ZakatPoolAssessment {
  pool: ZakatPoolId;
  /** Net value of the pool after deductions. */
  value: number;
  /** Nisab the pool is measured against (`parts`: 1 = a full nisab share). */
  nisab: number;
  meets: boolean;
  due: number;
}

export interface ZakatAssessment {
  combine: ZakatCombineMethod;
  basis: NisabBasis;
  /** Metal cash/trade goods are measured as (`lower` → the metal with the lower nisab). */
  basisMetal: "gold" | "silver";
  pools: ZakatPoolAssessment[];
  /** `parts` only: Σ holding ÷ its own nisab; nisab is met at ≥ 1. */
  nisabShare?: number;
  jewelleryCounted: boolean;
  jewelleryValue: number;
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

export const NISAB_BASES: readonly NisabBasis[] = ["lower", "gold", "silver"];

/**
 * Nisab for cash / trade goods on the given basis (NF-3.0a):
 * - `lower`: the lower positive of the two (Hanafi, Hanbali — "most beneficial to the poor").
 * - `gold` / `silver`: that metal's nisab. When its price is unknown (0) the other
 *   metal's nisab is used so the calculator still has a threshold; 0 when both are unknown.
 */
export function nisabFor(basis: NisabBasis, goldNisab: number, silverNisab: number): number {
  const gold = Math.max(0, goldNisab);
  const silver = Math.max(0, silverNisab);
  if (basis === "gold") return gold > 0 ? gold : silver;
  if (basis === "silver") return silver > 0 ? silver : gold;
  return lowerNisab(gold, silver);
}

/** The metal cash and trade goods are measured as on `basis` (`lower` → whichever nisab is lower). */
export function basisMetalFor(
  basis: NisabBasis,
  goldNisab: number,
  silverNisab: number,
): "gold" | "silver" {
  if (basis === "gold" || basis === "silver") return basis;
  if (silverNisab > 0 && (goldNisab <= 0 || silverNisab <= goldNisab)) return "silver";
  return goldNisab > 0 ? "gold" : "silver";
}

/** Maps a school's zakat rules to the combining method (`null` ⇒ all views ⇒ pooled by value). */
export function zakatCombineFor(
  zakat: { combineGoldSilver: boolean; combineMethod: "value" | "parts" | null } | null,
): ZakatCombineMethod {
  if (zakat == null) return "value";
  if (!zakat.combineGoldSilver) return "separate";
  return zakat.combineMethod === "parts" ? "parts" : "value";
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

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Takes `amount` off `pools` in order, never below zero; returns the remaining pools. */
function deductInOrder(pools: readonly number[], amount: number): number[] {
  let left = Math.max(0, amount);
  return pools.map((value) => {
    const taken = Math.min(value, left);
    left -= taken;
    return value - taken;
  });
}

export interface ZakatWealthParts {
  gold: number;
  silver: number;
  /** Cash, trade goods, investments … (everything that is neither metal). */
  rest: number;
  deductions: number;
  jewellery: number;
}

/**
 * School-aware nisab assessment of monetary wealth (gold, silver, personal
 * jewellery, cash and trade goods) — NF-3.0a. Deductions come off cash/trade
 * wealth first, then the basis metal, then the other metal (app choice — see
 * the proof log). Personal jewellery counts with gold unless excluded.
 */
export function assessZakatWealth(
  parts: ZakatWealthParts,
  nisab: number,
  options: ZakatFiqhOptions,
): { meetsNisab: boolean; wealthDue: number; assessment: ZakatAssessment } {
  const jewelleryCounted = options.includePersonalJewellery !== false;
  const jewelleryValue = Math.max(0, parts.jewellery);
  const metals = {
    gold: Math.max(0, parts.gold) + (jewelleryCounted ? jewelleryValue : 0),
    silver: Math.max(0, parts.silver),
  };
  const basisMetal = basisMetalFor(options.basis, options.goldNisab, options.silverNisab);
  const otherMetal = basisMetal === "gold" ? "silver" : "gold";
  const [restNet = 0, basisNet = 0, otherNet = 0] = deductInOrder(
    [Math.max(0, parts.rest), metals[basisMetal], metals[otherMetal]],
    parts.deductions,
  );
  const net = { gold: 0, silver: 0 };
  net[basisMetal] = basisNet;
  net[otherMetal] = otherNet;
  const total = restNet + net.gold + net.silver;
  /** A metal's own nisab; falls back to the basis nisab when its price is unknown. */
  const ownNisab = (metal: "gold" | "silver") => {
    const own = metal === "gold" ? options.goldNisab : options.silverNisab;
    return own > 0 ? own : nisab;
  };
  const base = {
    combine: options.combine,
    basis: options.basis,
    basisMetal,
    jewelleryCounted,
    jewelleryValue,
  };
  const pool = (id: ZakatPoolId, value: number, against: number): ZakatPoolAssessment => {
    const meets = against > 0 && value > 0 && value >= against;
    return {
      pool: id,
      value,
      nisab: against,
      meets,
      due: meets ? round2(value * ZAKAT_WEALTH_RATE) : 0,
    };
  };

  if (options.combine === "separate") {
    const pools = [
      pool("basis", restNet + basisNet, nisab),
      pool(otherMetal, otherNet, ownNisab(otherMetal)),
    ];
    return {
      meetsNisab: pools.some((p) => p.meets),
      wealthDue: round2(pools.reduce((sum, p) => sum + p.due, 0)),
      assessment: { ...base, pools },
    };
  }

  if (options.combine === "parts") {
    const share = (value: number, of: number) => (value > 0 && of > 0 ? value / of : 0);
    const nisabShare =
      share(net.gold, ownNisab("gold")) +
      share(net.silver, ownNisab("silver")) +
      share(restNet, nisab);
    const meets = total > 0 && nisabShare >= 1 - 1e-9;
    const due = meets ? round2(total * ZAKAT_WEALTH_RATE) : 0;
    return {
      meetsNisab: meets,
      wealthDue: due,
      assessment: {
        ...base,
        nisabShare,
        pools: [{ pool: "all", value: total, nisab: 1, meets, due }],
      },
    };
  }

  const all = pool("all", total, nisab);
  return { meetsNisab: all.meets, wealthDue: all.due, assessment: { ...base, pools: [all] } };
}

/**
 * Computes net zakatable monetary wealth and the 2.5% due against a nisab
 * threshold. Without `fiqh`, everything (personal jewellery included) is pooled
 * by value — the behaviour before madhhab support. With `fiqh`, the school's
 * combining method and jewellery ruling apply (NF-3.0a).
 */
export function computeZakat(
  assets: ZakatAssets,
  nisab: number,
  extras?: { livestock?: LivestockInput; agriculture?: AgricultureInput },
  fiqh?: ZakatFiqhOptions,
): ZakatResult {
  const jewelleryCounted = fiqh?.includePersonalJewellery !== false;
  const gold = positive(assets.gold);
  const silver = positive(assets.silver);
  const jewellery = positive(assets.personalJewellery);
  const rest =
    positive(assets.cash) +
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
  const gross = rest + gold + silver + (jewelleryCounted ? jewellery : 0);
  const deductions = positive(assets.debts) + positive(assets.livingExpenses);
  const netWealth = Math.max(0, gross - deductions);

  let meetsNisab = nisab > 0 && netWealth >= nisab;
  let wealthDue = meetsNisab ? round2(netWealth * ZAKAT_WEALTH_RATE) : 0;
  let assessment: ZakatAssessment | undefined;
  if (fiqh) {
    ({ meetsNisab, wealthDue, assessment } = assessZakatWealth(
      { gold, silver, rest, deductions, jewellery },
      nisab,
      fiqh,
    ));
  }

  const livestockAnimals = extras?.livestock
    ? computeLivestockAnimals(extras.livestock)
    : emptyLivestockAnimals();
  const livestockCash = extras?.livestock
    ? livestockCashEstimate(livestockAnimals, extras.livestock)
    : 0;
  const agricultureDue = extras?.agriculture ? computeAgricultureDue(extras.agriculture) : 0;
  const totalDue = round2(wealthDue + agricultureDue + livestockCash);

  return {
    netWealth,
    meetsNisab,
    due: wealthDue,
    wealthDue,
    agricultureDue,
    livestockAnimals,
    livestockCashEstimate: round2(livestockCash),
    totalDue,
    ...(assessment && { assessment }),
  };
}

// ── Madhhab setup shared by /zakat and the obligations summary (NF-3.0a) ─────

/** The zakat rules a school (with `fiqhCustom` applied) contributes to the calculation. */
export type ZakatSchoolRules = Pick<
  MadhhabRules["zakat"],
  "nisabBasis" | "combineGoldSilver" | "combineMethod" | "personalJewelleryZakatable"
>;

export interface ZakatFiqhSetup {
  basis: NisabBasis;
  combine: ZakatCombineMethod;
  includePersonalJewellery: boolean;
  /** No school chosen: the headline uses the user's saved basis, else `lower`, pooled by value, jewellery counted. */
  allViews: boolean;
}

/**
 * The basis / combining / jewellery rules for one zakat calculation. `zakat` is
 * the resolved school's rules (`null` ⇒ all views); `customBasis` is
 * `fiqhCustom.nisabBasis`, which only matters in all-views mode (a school's
 * rules already have it applied).
 */
export function resolveZakatFiqhSetup(
  zakat: ZakatSchoolRules | null,
  customBasis: NisabBasis | null,
): ZakatFiqhSetup {
  return {
    basis: zakat?.nisabBasis ?? customBasis ?? "lower",
    combine: zakatCombineFor(zakat),
    includePersonalJewellery: zakat?.personalJewelleryZakatable ?? true,
    allViews: zakat == null,
  };
}

/** The nisab actually used: the manual figure, else the basis nisab, else the manual figure as a fallback. */
export function effectiveZakatNisab(input: {
  basis: NisabBasis;
  goldNisab: number;
  silverNisab: number;
  manual: boolean;
  manualNisab: number;
}): number {
  if (input.manual) return input.manualNisab;
  const suggested = nisabFor(input.basis, input.goldNisab, input.silverNisab);
  return suggested > 0 ? suggested : input.manualNisab;
}

/** Every `ZakatAssets` field the calculator stores in its draft `values` (wealth, then deductions). */
export const ZAKAT_DRAFT_ASSET_FIELDS: readonly (keyof ZakatAssets)[] = [
  "cash",
  "gold",
  "personalJewellery",
  "silver",
  "stocks",
  "business",
  "receivables",
  "rentalIncome",
  "otherAssets",
  "crypto",
  "investmentPlots",
  "installmentPlotsPaid",
  "investmentProperty",
  "tradeVehicles",
  "debts",
  "livingExpenses",
];
