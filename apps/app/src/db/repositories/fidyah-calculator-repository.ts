import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrencyInfo } from "@/constants/currencies";
import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, writeJSON } from "@/db/store";
import type { FidyahScenario } from "@/lib/fidyah";

export type FidyahCalculatorDraft = {
  currencyCode: string;
  scenario: FidyahScenario;
  days: string;
  mealCost: string;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asScenario(value: unknown): FidyahScenario {
  return value === "kaffarah" ? "kaffarah" : "fidyah";
}

function normalizeDraft(raw: unknown, fallbackCurrency: string): FidyahCalculatorDraft {
  if (!isRecord(raw)) {
    return {
      currencyCode: fallbackCurrency,
      scenario: "fidyah",
      days: "",
      mealCost: "",
      updatedAt: new Date().toISOString(),
    };
  }
  const currency =
    typeof raw.currencyCode === "string" && getCurrencyInfo(raw.currencyCode)
      ? raw.currencyCode
      : fallbackCurrency;
  return {
    currencyCode: currency,
    scenario: asScenario(raw.scenario),
    days: asString(raw.days),
    mealCost: asString(raw.mealCost),
    updatedAt: asString(raw.updatedAt, new Date().toISOString()),
  };
}

export const FidyahCalculatorRepository = {
  async load(fallbackCurrency: string): Promise<FidyahCalculatorDraft> {
    const raw = await readJSON<unknown>(DB_KEYS.fidyahCalculator, null);
    return normalizeDraft(raw, fallbackCurrency);
  },

  async save(draft: Omit<FidyahCalculatorDraft, "updatedAt">): Promise<void> {
    await writeJSON(DB_KEYS.fidyahCalculator, {
      ...draft,
      updatedAt: new Date().toISOString(),
    } satisfies FidyahCalculatorDraft);
  },

  async clear(): Promise<void> {
    await removeKey(DB_KEYS.fidyahCalculator);
    try {
      await AsyncStorage.removeItem(DB_KEYS.fidyahCalculator);
    } catch {
      // ignore
    }
  },
};
