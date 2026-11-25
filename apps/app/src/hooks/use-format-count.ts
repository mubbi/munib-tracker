import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Formats a whole count in the app locale (grouping, locale digits), so Qaza
 * and calendar numbers never render as raw `toString()` output.
 */
export function useFormatCount(): (value: number) => string {
  const { i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0];
  return useCallback(
    (value: number) => {
      const n = Number(value);
      return (Number.isFinite(n) ? n : 0).toLocaleString(locale);
    },
    [locale],
  );
}
