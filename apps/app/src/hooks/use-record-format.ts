import type { AppLocale } from "@munib-tracker/shared/types";
import { parseLocalDateString } from "@munib-tracker/shared/utils";
import * as Localization from "expo-localization";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getCurrencyInfo } from "@/constants/currencies";
import { DEFAULT_NUMBER_FORMAT, formatMoneyAmount } from "@/lib/format-currency";
import { RTL_LOCALES } from "@/lib/i18n/rtl-locale";
import { localeToBcp47 } from "@/lib/locale-bcp47";

/** Device currency when supported, else USD (same rule as the sadaqah / zakat screens). */
export function deviceCurrency(): string {
  const device = Localization.getLocales()[0]?.currencyCode?.toUpperCase();
  return device && getCurrencyInfo(device) ? device : "USD";
}

/** Formatting shared by the debts and wasiyyah screens and their printable exports. */
export function useRecordFormat() {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  return useMemo(() => {
    const bcp47 = localeToBcp47(lang);
    return {
      lang,
      dir: RTL_LOCALES.has(lang as AppLocale) ? ("rtl" as const) : ("ltr" as const),
      money: (amount: number, currency: string) =>
        formatMoneyAmount(amount, currency, DEFAULT_NUMBER_FORMAT),
      formatDate: (day: string) => {
        try {
          return parseLocalDateString(day).toLocaleDateString(bcp47, { dateStyle: "medium" });
        } catch {
          return day;
        }
      },
    };
  }, [lang]);
}
