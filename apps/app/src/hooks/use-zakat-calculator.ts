import {
  isNisabBasis,
  MADHHAB_RULES,
  type MadhhabId,
  type NisabBasis,
} from "@munib-tracker/shared/fiqh";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCurrencyInfo } from "@/constants/currencies";
import { ZakatCalculatorRepository } from "@/db/repositories/zakat-calculator-repository";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useZakatMarketData } from "@/hooks/use-zakat-market-data";
import {
  DEFAULT_NUMBER_FORMAT,
  formatMoneyAmount,
  isNumberFormatStyle,
  type NumberFormatStyle,
  parseNumberInput,
  reformatNumberString,
} from "@/lib/format-currency";
import { defaultCurrencyCode, defaultNumberFormat } from "@/lib/money-defaults";
import { setFiqhCustomValue } from "@/lib/settings/fiqh-settings";
import {
  type CropIrrigation,
  computeZakat,
  effectiveZakatNisab,
  type GoldKarat,
  goldValueFromWeight,
  type MetalWeightUnit,
  NISAB_BASES,
  nisabFor,
  nisabFromGoldPrice,
  nisabFromSilverPrice,
  resolveZakatFiqhSetup,
  type SilverPurity,
  silverValueFromWeight,
  type ZakatAssets,
  type ZakatCombineMethod,
  type ZakatFiqhOptions,
} from "@/lib/zakat";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

type AssetFieldKey = keyof ZakatAssets;

/** Draft `values` key for women's personal-use jewellery (NF-3.0a; older drafts simply lack it). */
export const PERSONAL_JEWELLERY_FIELD = "personalJewellery" satisfies AssetFieldKey;

/** One all-views result row (madhhab = "Show all views"): the due amount on each nisab basis. */
export interface ZakatBasisRow {
  basis: NisabBasis;
  nisab: number;
  totalDue: number;
  meetsNisab: boolean;
  /** Due when personal jewellery is NOT counted; `null` when no jewellery was entered. */
  totalDueWithoutJewellery: number | null;
  /** The user's saved custom basis (`fiqhCustom.nisabBasis`). */
  selected: boolean;
}

/**
 * Saves (or, with `null`, clears) the calculator's nisab-basis override in
 * `fiqhCustom.nisabBasis`, leaving every other custom value untouched.
 */
export function setNisabBasisOverride(basis: NisabBasis | null): Promise<void> {
  // Same write path as Settings › Fiqh & madhhab › Advanced (single write, §4.5.4).
  return setFiqhCustomValue("nisabBasis", basis ?? undefined);
}

const WEALTH_FIELDS: AssetFieldKey[] = [
  "cash",
  "gold",
  PERSONAL_JEWELLERY_FIELD,
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
];

const DEDUCTION_FIELDS: AssetFieldKey[] = ["debts", "livingExpenses"];

export const ZAKAT_ASSET_GROUPS = [
  { id: "liquid", fieldKeys: ["cash", "gold", "silver", "crypto"] as AssetFieldKey[] },
  {
    id: "investments",
    fieldKeys: [
      "stocks",
      "business",
      "receivables",
      "rentalIncome",
      "otherAssets",
    ] as AssetFieldKey[],
  },
  {
    id: "property",
    fieldKeys: [
      "investmentPlots",
      "installmentPlotsPaid",
      "investmentProperty",
      "tradeVehicles",
    ] as AssetFieldKey[],
  },
] as const;

const PERSIST_DEBOUNCE_MS = 350;

/** Settings default currency (first open only — a saved draft wins), else the device region. */
function resolveDefaultCurrency(): string {
  return defaultCurrencyCode();
}

function asMetalUnit(value: unknown): MetalWeightUnit {
  return value === "tola" || value === "oz" || value === "kg" ? value : "g";
}

function asGoldKarat(value: unknown): GoldKarat {
  const n = typeof value === "number" ? value : Number(value);
  return n === 22 || n === 21 || n === 18 || n === 14 || n === 10 ? n : 24;
}

function asSilverPurity(value: unknown): SilverPurity {
  const n = typeof value === "number" ? value : Number(value);
  return n === 925 || n === 900 || n === 800 ? n : 999;
}

function asIrrigation(value: unknown): CropIrrigation {
  return value === "irrigated" ? "irrigated" : "natural";
}

function asNumberFormat(value: unknown): NumberFormatStyle {
  return isNumberFormatStyle(value) ? value : DEFAULT_NUMBER_FORMAT;
}

export function useZakatCalculator() {
  const [currencyCode, setCurrencyCodeState] = useState(resolveDefaultCurrency);
  const [numberFormat, setNumberFormatState] = useState<NumberFormatStyle>(defaultNumberFormat);
  const [values, setValues] = useState<Record<string, string>>({});
  const [nisab, setNisab] = useState("");
  const [nisabManual, setNisabManual] = useState(false);
  const [goldWeight, setGoldWeight] = useState("");
  const [goldUnit, setGoldUnit] = useState<MetalWeightUnit>("g");
  const [goldKarat, setGoldKarat] = useState<GoldKarat>(24);
  const [goldPrice, setGoldPrice] = useState("");
  const [silverWeight, setSilverWeight] = useState("");
  const [silverUnit, setSilverUnit] = useState<MetalWeightUnit>("g");
  const [silverPurity, setSilverPurity] = useState<SilverPurity>(999);
  const [silverPrice, setSilverPrice] = useState("");
  const [nisabGoldPrice, setNisabGoldPrice] = useState("");
  const [nisabSilverPrice, setNisabSilverPrice] = useState("");
  const [pricesManual, setPricesManual] = useState(false);
  const [sheepCount, setSheepCount] = useState("");
  const [cattleCount, setCattleCount] = useState("");
  const [camelCount, setCamelCount] = useState("");
  const [sheepValue, setSheepValue] = useState("");
  const [cattleValue, setCattleValue] = useState("");
  const [camelValue, setCamelValue] = useState("");
  const [harvestValue, setHarvestValue] = useState("");
  const [irrigation, setIrrigation] = useState<CropIrrigation>("natural");
  const [hydrated, setHydrated] = useState(false);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const market = useZakatMarketData(currencyCode, numberFormat);
  const num = useCallback((v: string) => parseNumberInput(v, numberFormat), [numberFormat]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const draft = await ZakatCalculatorRepository.get();
        if (cancelled || !draft) return;
        setCurrencyCodeState(draft.currencyCode);
        setNumberFormatState(asNumberFormat(draft.numberFormat));
        setValues(draft.values);
        setNisab(draft.nisab);
        setNisabManual(draft.nisabManual);
        setGoldWeight(draft.goldWeight || draft.goldGrams || "");
        setGoldUnit(asMetalUnit(draft.goldUnit));
        setGoldKarat(asGoldKarat(draft.goldKarat));
        setGoldPrice(draft.goldPrice);
        setSilverWeight(draft.silverWeight || draft.silverGrams || "");
        setSilverUnit(asMetalUnit(draft.silverUnit));
        setSilverPurity(asSilverPurity(draft.silverPurity));
        setSilverPrice(draft.silverPrice);
        setNisabGoldPrice(draft.nisabGoldPrice);
        setNisabSilverPrice(draft.nisabSilverPrice);
        setPricesManual(draft.pricesManual);
        setSheepCount(draft.sheepCount ?? "");
        setCattleCount(draft.cattleCount ?? "");
        setCamelCount(draft.camelCount ?? "");
        setSheepValue(draft.sheepValue ?? "");
        setCattleValue(draft.cattleValue ?? "");
        setCamelValue(draft.camelValue ?? "");
        setHarvestValue(draft.harvestValue ?? "");
        setIrrigation(asIrrigation(draft.irrigation));
      } catch {
        // Device default is fine.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      void ZakatCalculatorRepository.set({
        currencyCode,
        numberFormat,
        values,
        nisab,
        nisabManual,
        goldWeight,
        goldUnit,
        goldKarat,
        goldPrice,
        silverWeight,
        silverUnit,
        silverPurity,
        silverPrice,
        nisabGoldPrice,
        nisabSilverPrice,
        pricesManual,
        sheepCount,
        cattleCount,
        camelCount,
        sheepValue,
        cattleValue,
        camelValue,
        harvestValue,
        irrigation,
      });
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [
    hydrated,
    currencyCode,
    numberFormat,
    values,
    nisab,
    nisabManual,
    goldWeight,
    goldUnit,
    goldKarat,
    goldPrice,
    silverWeight,
    silverUnit,
    silverPurity,
    silverPrice,
    nisabGoldPrice,
    nisabSilverPrice,
    pricesManual,
    sheepCount,
    cattleCount,
    camelCount,
    sheepValue,
    cattleValue,
    camelValue,
    harvestValue,
    irrigation,
  ]);

  const setCurrencyCode = (code: string) => {
    const next = code.trim().toUpperCase();
    if (!getCurrencyInfo(next)) return;
    setCurrencyCodeState(next);
    setPricesManual(false);
  };

  const setNumberFormat = (next: NumberFormatStyle) => {
    if (next === numberFormat) return;
    const from = numberFormat;
    setValues((prev) => {
      const out: Record<string, string> = {};
      for (const [key, value] of Object.entries(prev)) {
        out[key] = reformatNumberString(value, from, next, 2);
      }
      return out;
    });
    setNisab((v) => reformatNumberString(v, from, next, 2));
    setGoldWeight((v) => reformatNumberString(v, from, next, 4));
    setGoldPrice((v) => reformatNumberString(v, from, next, 4));
    setSilverWeight((v) => reformatNumberString(v, from, next, 4));
    setSilverPrice((v) => reformatNumberString(v, from, next, 4));
    setNisabGoldPrice((v) => reformatNumberString(v, from, next, 4));
    setNisabSilverPrice((v) => reformatNumberString(v, from, next, 4));
    setSheepCount((v) => reformatNumberString(v, from, next, 0));
    setCattleCount((v) => reformatNumberString(v, from, next, 0));
    setCamelCount((v) => reformatNumberString(v, from, next, 0));
    setSheepValue((v) => reformatNumberString(v, from, next, 2));
    setCattleValue((v) => reformatNumberString(v, from, next, 2));
    setCamelValue((v) => reformatNumberString(v, from, next, 2));
    setHarvestValue((v) => reformatNumberString(v, from, next, 2));
    setNumberFormatState(next);
  };

  useEffect(() => {
    if (!hydrated) return;
    const data = market.data;
    if (!data || pricesManual) return;
    setGoldPrice(data.goldInput);
    setSilverPrice(data.silverInput);
    setNisabGoldPrice(data.goldInput);
    setNisabSilverPrice(data.silverInput);
  }, [hydrated, market.data, pricesManual]);

  const goldFromWeight = useMemo(
    () => goldValueFromWeight(num(goldWeight), goldUnit, goldKarat, num(goldPrice)),
    [goldWeight, goldUnit, goldKarat, goldPrice, num],
  );
  const silverFromWeight = useMemo(
    () => silverValueFromWeight(num(silverWeight), silverUnit, silverPurity, num(silverPrice)),
    [silverWeight, silverUnit, silverPurity, silverPrice, num],
  );

  const goldNisab = useMemo(() => nisabFromGoldPrice(num(nisabGoldPrice)), [nisabGoldPrice, num]);
  const silverNisab = useMemo(
    () => nisabFromSilverPrice(num(nisabSilverPrice)),
    [nisabSilverPrice, num],
  );
  // NF-3.0a: the school's basis / combining / jewellery rules (custom basis applied).
  const { resolve } = useMadhhab();
  const fiqh = resolve("zakat");
  const school: MadhhabId | null = fiqh.school;
  const rawCustomBasis = useStore(preferencesStore, (s) => s.prefs.fiqhCustom?.nisabBasis);
  const customBasis: NisabBasis | null = isNisabBasis(rawCustomBasis) ? rawCustomBasis : null;
  /** The school's own default (before the user's override); `null` in all-views mode. */
  const schoolBasis: NisabBasis | null = school ? MADHHAB_RULES[school].zakat.nisabBasis : null;
  // All views: the user's saved basis, else "lower" (the app's behaviour before
  // madhhab support) — labelled, with a row per basis so no school is implied.
  // Shared with the debts / wasiyyah obligations summary (`resolveZakatFiqhSetup`).
  const setup = resolveZakatFiqhSetup(fiqh.rules?.zakat ?? null, customBasis);
  const nisabBasis: NisabBasis = setup.basis;
  const nisabBasisContested = fiqh.rules?.zakat.nisabBasisContested ?? false;
  const combine: ZakatCombineMethod = setup.combine;
  const personalJewelleryCounted = setup.includePersonalJewellery;
  const nisabBasisCustom = customBasis != null;

  const suggestedNisab = useMemo(
    () => nisabFor(nisabBasis, goldNisab, silverNisab),
    [nisabBasis, goldNisab, silverNisab],
  );

  const effectiveNisab = effectiveZakatNisab({
    basis: nisabBasis,
    goldNisab,
    silverNisab,
    manual: nisabManual,
    manualNisab: num(nisab),
  });

  const livestock = useMemo(
    () => ({
      sheep: num(sheepCount),
      cattle: num(cattleCount),
      camels: num(camelCount),
      sheepValue: num(sheepValue),
      cattleValue: num(cattleValue),
      camelValue: num(camelValue),
    }),
    [sheepCount, cattleCount, camelCount, sheepValue, cattleValue, camelValue, num],
  );

  const agriculture = useMemo(
    () => ({ harvestValue: num(harvestValue), irrigation }),
    [harvestValue, irrigation, num],
  );

  const assets = useMemo(() => {
    const out: ZakatAssets = {};
    for (const field of [...WEALTH_FIELDS, ...DEDUCTION_FIELDS]) {
      out[field] = num(values[field] ?? "");
    }
    out.gold = num(values.gold ?? "") + goldFromWeight;
    out.silver = num(values.silver ?? "") + silverFromWeight;
    return out;
  }, [values, goldFromWeight, silverFromWeight, num]);

  const fiqhOptions = useMemo(
    (): ZakatFiqhOptions => ({
      combine,
      basis: nisabBasis,
      goldNisab,
      silverNisab,
      includePersonalJewellery: personalJewelleryCounted,
    }),
    [combine, nisabBasis, goldNisab, silverNisab, personalJewelleryCounted],
  );

  const result = useMemo(
    () => computeZakat(assets, effectiveNisab, { livestock, agriculture }, fiqhOptions),
    [assets, effectiveNisab, livestock, agriculture, fiqhOptions],
  );

  const personalJewelleryValue = assets.personalJewellery ?? 0;

  /** All-views mode only: one row per nisab basis (pooled by value). */
  const basisRows = useMemo((): ZakatBasisRow[] => {
    if (school != null) return [];
    const extras = { livestock, agriculture };
    return NISAB_BASES.map((basis) => {
      const nisabValue = nisabFor(basis, goldNisab, silverNisab) || num(nisab);
      const options: ZakatFiqhOptions = { combine: "value", basis, goldNisab, silverNisab };
      const withJewellery = computeZakat(assets, nisabValue, extras, options);
      const withoutJewellery =
        personalJewelleryValue > 0
          ? computeZakat(assets, nisabValue, extras, {
              ...options,
              includePersonalJewellery: false,
            }).totalDue
          : null;
      return {
        basis,
        nisab: nisabValue,
        totalDue: withJewellery.totalDue,
        meetsNisab: withJewellery.meetsNisab,
        totalDueWithoutJewellery: withoutJewellery,
        selected: basis === customBasis,
      };
    });
  }, [
    school,
    assets,
    livestock,
    agriculture,
    goldNisab,
    silverNisab,
    nisab,
    num,
    personalJewelleryValue,
    customBasis,
  ]);

  const money = (n: number) => formatMoneyAmount(n, currencyCode, numberFormat);

  const setField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const setGoldPriceManual = (v: string) => {
    setPricesManual(true);
    setGoldPrice(v);
  };
  const setSilverPriceManual = (v: string) => {
    setPricesManual(true);
    setSilverPrice(v);
  };
  const setNisabGoldPriceManual = (v: string) => {
    setPricesManual(true);
    setNisabGoldPrice(v);
  };
  const setNisabSilverPriceManual = (v: string) => {
    setPricesManual(true);
    setNisabSilverPrice(v);
  };

  const applyLivePrices = () => {
    setPricesManual(false);
    void market.refetch();
  };

  /** Clears asset inputs; keeps currency + number format. Live prices refill. */
  const resetForm = () => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    setValues({});
    setNisab("");
    setNisabManual(false);
    setGoldWeight("");
    setGoldUnit("g");
    setGoldKarat(24);
    setGoldPrice("");
    setSilverWeight("");
    setSilverUnit("g");
    setSilverPurity(999);
    setSilverPrice("");
    setNisabGoldPrice("");
    setNisabSilverPrice("");
    setPricesManual(false);
    setSheepCount("");
    setCattleCount("");
    setCamelCount("");
    setSheepValue("");
    setCattleValue("");
    setCamelValue("");
    setHarvestValue("");
    setIrrigation("natural");
  };

  const hasInput = useMemo(() => {
    const hasValues = Object.values(values).some((v) => num(v) > 0);
    const hasWeights = goldFromWeight > 0 || silverFromWeight > 0;
    const hasNisab = effectiveNisab > 0;
    const hasLivestock = num(sheepCount) > 0 || num(cattleCount) > 0 || num(camelCount) > 0;
    const hasCrops = num(harvestValue) > 0;
    return hasValues || hasWeights || hasNisab || hasLivestock || hasCrops;
  }, [
    values,
    goldFromWeight,
    silverFromWeight,
    effectiveNisab,
    sheepCount,
    cattleCount,
    camelCount,
    harvestValue,
    num,
  ]);

  const currency = getCurrencyInfo(currencyCode);

  return {
    currencyCode,
    setCurrencyCode,
    numberFormat,
    setNumberFormat,
    currency,
    values,
    setField,
    nisab,
    setNisab,
    nisabManual,
    setNisabManual,
    goldWeight,
    setGoldWeight,
    goldUnit,
    setGoldUnit,
    goldKarat,
    setGoldKarat,
    goldPrice,
    setGoldPrice: setGoldPriceManual,
    silverWeight,
    setSilverWeight,
    silverUnit,
    setSilverUnit,
    silverPurity,
    setSilverPurity,
    silverPrice,
    setSilverPrice: setSilverPriceManual,
    nisabGoldPrice,
    setNisabGoldPrice: setNisabGoldPriceManual,
    nisabSilverPrice,
    setNisabSilverPrice: setNisabSilverPriceManual,
    goldFromWeight,
    silverFromWeight,
    goldNisab,
    silverNisab,
    suggestedNisab,
    effectiveNisab,
    /** School governing zakat (`null` ⇒ show all views). */
    zakatSchool: school,
    /** Basis in effect for the headline result. */
    nisabBasis,
    /** The school's own default basis (before the user's override). */
    schoolNisabBasis: schoolBasis,
    /** `fiqhCustom.nisabBasis`, if the user saved one. */
    customNisabBasis: customBasis,
    nisabBasisCustom,
    /** Shafi'i / Maliki: classical texts don't settle the basis for currency ("scholars differ"). */
    nisabBasisContested,
    setNisabBasisOverride,
    combineMethod: combine,
    personalJewelleryCounted,
    personalJewelleryValue,
    basisRows,
    sheepCount,
    setSheepCount,
    cattleCount,
    setCattleCount,
    camelCount,
    setCamelCount,
    sheepValue,
    setSheepValue,
    cattleValue,
    setCattleValue,
    camelValue,
    setCamelValue,
    harvestValue,
    setHarvestValue,
    irrigation,
    setIrrigation,
    result,
    money,
    hasInput,
    pricesManual,
    applyLivePrices,
    resetForm,
    market,
    hydrated,
    // Back-compat aliases used by older weight UI bindings.
    goldGrams: goldWeight,
    setGoldGrams: setGoldWeight,
    silverGrams: silverWeight,
    setSilverGrams: setSilverWeight,
  };
}

export type ZakatCalculatorState = ReturnType<typeof useZakatCalculator>;
