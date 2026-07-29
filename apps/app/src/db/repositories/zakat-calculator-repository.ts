import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrencyInfo } from "@/constants/currencies";
import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, writeJSON } from "@/db/store";
import {
  DEFAULT_NUMBER_FORMAT,
  isNumberFormatStyle,
  type NumberFormatStyle,
} from "@/lib/format-currency";
import type { CropIrrigation, GoldKarat, MetalWeightUnit, SilverPurity } from "@/lib/zakat";

export type ZakatCalculatorDraft = {
  currencyCode: string;
  numberFormat: NumberFormatStyle;
  values: Record<string, string>;
  nisab: string;
  nisabManual: boolean;
  goldWeight: string;
  /** @deprecated Prefer goldWeight. */
  goldGrams?: string;
  goldUnit: MetalWeightUnit;
  goldKarat: GoldKarat;
  goldPrice: string;
  silverWeight: string;
  /** @deprecated Prefer silverWeight. */
  silverGrams?: string;
  silverUnit: MetalWeightUnit;
  silverPurity: SilverPurity;
  silverPrice: string;
  nisabGoldPrice: string;
  nisabSilverPrice: string;
  pricesManual: boolean;
  sheepCount: string;
  cattleCount: string;
  camelCount: string;
  sheepValue: string;
  cattleValue: string;
  camelValue: string;
  harvestValue: string;
  irrigation: CropIrrigation;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringRecord(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") out[key] = entry;
  }
  return out;
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

function emptyDraft(currencyCode: string): ZakatCalculatorDraft {
  return {
    currencyCode,
    numberFormat: DEFAULT_NUMBER_FORMAT,
    values: {},
    nisab: "",
    nisabManual: false,
    goldWeight: "",
    goldUnit: "g",
    goldKarat: 24,
    goldPrice: "",
    silverWeight: "",
    silverUnit: "g",
    silverPurity: 999,
    silverPrice: "",
    nisabGoldPrice: "",
    nisabSilverPrice: "",
    pricesManual: false,
    sheepCount: "",
    cattleCount: "",
    camelCount: "",
    sheepValue: "",
    cattleValue: "",
    camelValue: "",
    harvestValue: "",
    irrigation: "natural",
    updatedAt: new Date().toISOString(),
  };
}

function normalizeDraft(raw: unknown): ZakatCalculatorDraft | null {
  if (!isRecord(raw)) return null;
  const currencyCode = asString(raw.currencyCode).trim().toUpperCase();
  if (!getCurrencyInfo(currencyCode)) return null;

  return {
    currencyCode,
    numberFormat: asNumberFormat(raw.numberFormat),
    values: asStringRecord(raw.values),
    nisab: asString(raw.nisab),
    nisabManual: asBoolean(raw.nisabManual),
    goldWeight: asString(raw.goldWeight) || asString(raw.goldGrams),
    goldGrams: asString(raw.goldGrams),
    goldUnit: asMetalUnit(raw.goldUnit),
    goldKarat: asGoldKarat(raw.goldKarat),
    goldPrice: asString(raw.goldPrice),
    silverWeight: asString(raw.silverWeight) || asString(raw.silverGrams),
    silverGrams: asString(raw.silverGrams),
    silverUnit: asMetalUnit(raw.silverUnit),
    silverPurity: asSilverPurity(raw.silverPurity),
    silverPrice: asString(raw.silverPrice),
    nisabGoldPrice: asString(raw.nisabGoldPrice),
    nisabSilverPrice: asString(raw.nisabSilverPrice),
    pricesManual: asBoolean(raw.pricesManual),
    sheepCount: asString(raw.sheepCount),
    cattleCount: asString(raw.cattleCount),
    camelCount: asString(raw.camelCount),
    sheepValue: asString(raw.sheepValue),
    cattleValue: asString(raw.cattleValue),
    camelValue: asString(raw.camelValue),
    harvestValue: asString(raw.harvestValue),
    irrigation: asIrrigation(raw.irrigation),
    updatedAt: asString(raw.updatedAt, new Date().toISOString()),
  };
}

/**
 * Persists the zakat calculator form so refresh / revisit restores currency,
 * number format, asset fields, metal weights/prices, livestock, crops, and nisab.
 */
export const ZakatCalculatorRepository = {
  async get(): Promise<ZakatCalculatorDraft | null> {
    const draft = normalizeDraft(await readJSON<unknown>(DB_KEYS.zakatCalculator, null));
    if (draft) return draft;

    try {
      const legacy = await AsyncStorage.getItem(DB_KEYS.zakatCurrency);
      const code = legacy?.trim().toUpperCase();
      if (code && getCurrencyInfo(code)) return emptyDraft(code);
    } catch {
      // Ignore legacy read failures.
    }
    return null;
  },

  async set(
    draft: Omit<ZakatCalculatorDraft, "updatedAt" | "goldGrams" | "silverGrams">,
  ): Promise<void> {
    const currencyCode = draft.currencyCode.trim().toUpperCase();
    if (!getCurrencyInfo(currencyCode)) return;

    try {
      await writeJSON(DB_KEYS.zakatCalculator, {
        ...draft,
        currencyCode,
        numberFormat: asNumberFormat(draft.numberFormat),
        updatedAt: new Date().toISOString(),
      } satisfies ZakatCalculatorDraft);
      await removeKey(DB_KEYS.zakatCurrency).catch(() => {});
    } catch {
      // Quota / private mode — keep in-memory state for this session.
    }
  },

  async clear(): Promise<void> {
    await Promise.all([removeKey(DB_KEYS.zakatCalculator), removeKey(DB_KEYS.zakatCurrency)]);
  },
};
