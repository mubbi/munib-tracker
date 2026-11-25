import {
  DEFAULT_NUMBER_FORMAT,
  isNumberFormatStyle,
  type NumberFormatStyle,
} from "@/lib/format-currency";
import { usePreferences } from "@/stores/preferences-store";

/**
 * The person's number format (Settings › Language & region) for every money
 * field and amount line outside the zakat calculator, which keeps its own saved
 * override. Falls back to `comma_dot`.
 */
export function useMoneyNumberFormat(): NumberFormatStyle {
  const { defaultNumberFormat } = usePreferences();
  return isNumberFormatStyle(defaultNumberFormat) ? defaultNumberFormat : DEFAULT_NUMBER_FORMAT;
}
