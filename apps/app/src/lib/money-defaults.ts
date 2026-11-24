import * as Localization from "expo-localization";

import { getCurrencyInfo } from "@/constants/currencies";
import {
  DEFAULT_NUMBER_FORMAT,
  isNumberFormatStyle,
  type NumberFormatStyle,
} from "@/lib/format-currency";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Money defaults (Settings › Language & region, NF-3.0b): the user's default
 * currency and number format seed the zakat, fidyah and sadaqah drafts the
 * FIRST time each opens. Once a calculator has a saved draft it keeps its own
 * values (each calculator can still override).
 */

/** The device region's currency, else USD. */
export function deviceCurrencyCode(): string {
  const device = Localization.getLocales()[0]?.currencyCode?.toUpperCase();
  if (device && getCurrencyInfo(device)) return device;
  return "USD";
}

/** Pure resolver: a valid preferred code wins, then the device region, then USD. */
export function resolveDefaultCurrency(preferred: string | undefined, fallback: string): string {
  const code = preferred?.trim().toUpperCase();
  return code && getCurrencyInfo(code) ? code : fallback;
}

/** Currency a new calculator draft starts with. */
export function defaultCurrencyCode(): string {
  return resolveDefaultCurrency(
    preferencesStore.getState().prefs.defaultCurrency,
    deviceCurrencyCode(),
  );
}

/** Number format a new calculator draft starts with. */
export function defaultNumberFormat(): NumberFormatStyle {
  const preferred = preferencesStore.getState().prefs.defaultNumberFormat;
  return isNumberFormatStyle(preferred) ? preferred : DEFAULT_NUMBER_FORMAT;
}
