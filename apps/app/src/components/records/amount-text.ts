import { DEFAULT_NUMBER_FORMAT, parseNumberInput } from "@/lib/format-currency";

/**
 * The debts form stores money as plain `comma_dot` text (what `debtInputFromForm`
 * and `repaymentFromForm` parse); the `NumberField` shows it in the person's own
 * number format. These two convert between the stored text and the field value,
 * so the stored shape is unchanged.
 */
export function amountFromText(text: string): number | undefined {
  const n = parseNumberInput(text, DEFAULT_NUMBER_FORMAT);
  return n > 0 ? n : undefined;
}

export function amountToText(value: number | undefined): string {
  return value == null ? "" : String(value);
}
