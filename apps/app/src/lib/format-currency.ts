import { getCurrencyInfo } from "@/constants/currencies";

/**
 * Currencies pinned near the top of the zakat currency picker — common among
 * Muslim users and Gulf/South Asian locales.
 */
export const ZAKAT_PINNED_CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "SAR",
  "AED",
  "PKR",
  "INR",
  "BDT",
  "MYR",
  "IDR",
  "TRY",
  "EGP",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "JOD",
  "MAD",
  "NGN",
] as const;

/**
 * Number format styles (from Expense Trail settings).
 *
 * "comma_dot"   → 22,000.03  (thousands = comma,   decimal = dot)
 * "dot_comma"   → 22.000,03  (thousands = dot,     decimal = comma)
 * "space_dot"   → 22 000.03  (thousands = space,   decimal = dot)
 * "space_comma" → 22 000,03  (thousands = space,   decimal = comma)
 */
export type NumberFormatStyle = "comma_dot" | "dot_comma" | "space_dot" | "space_comma";

export const DEFAULT_NUMBER_FORMAT: NumberFormatStyle = "comma_dot";

export const NUMBER_FORMAT_OPTIONS: {
  id: NumberFormatStyle;
  label: string;
  example: string;
}[] = [
  { id: "comma_dot", label: "1,000.00", example: "22,000.03" },
  { id: "dot_comma", label: "1.000,00", example: "22.000,03" },
  { id: "space_dot", label: "1 000.00", example: "22 000.03" },
  { id: "space_comma", label: "1 000,00", example: "22 000,03" },
];

const FORMAT_CONFIG: Record<NumberFormatStyle, { thousands: string; decimal: string }> = {
  comma_dot: { thousands: ",", decimal: "." },
  dot_comma: { thousands: ".", decimal: "," },
  space_dot: { thousands: "\u00A0", decimal: "." },
  space_comma: { thousands: "\u00A0", decimal: "," },
};

export function isNumberFormatStyle(value: unknown): value is NumberFormatStyle {
  return (
    value === "comma_dot" ||
    value === "dot_comma" ||
    value === "space_dot" ||
    value === "space_comma"
  );
}

function groupDigits(intStr: string, sep: string): string {
  const len = intStr.length;
  if (len <= 3) return intStr;
  let result = "";
  for (let i = 0; i < len; i++) {
    if (i > 0 && (len - i) % 3 === 0) result += sep;
    result += intStr[i];
  }
  return result;
}

/** Decimal separator for a style (`.` or `,`). */
export function getDecimalSeparator(style: NumberFormatStyle): string {
  return FORMAT_CONFIG[style].decimal;
}

/**
 * Format a number with thousands separator and decimal point for the chosen style.
 */
export function formatAmount(
  value: number,
  style: NumberFormatStyle = DEFAULT_NUMBER_FORMAT,
  decimals = 2,
): string {
  const { thousands, decimal } = FORMAT_CONFIG[style];
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const fixed = abs.toFixed(decimals);
  const [intPart, fracPart] = fixed.split(".");
  const grouped = groupDigits(intPart ?? "0", thousands);
  return fracPart !== undefined ? `${sign}${grouped}${decimal}${fracPart}` : `${sign}${grouped}`;
}

function currencyDisplaySymbol(currencyCode: string): string {
  const info = getCurrencyInfo(currencyCode);
  if (info?.symbol) return info.symbol;
  return `${currencyCode} `;
}

/**
 * Formats a number for display with the catalogue symbol (glyph-safe for SAR/AED)
 * using the user's number-format style for digit grouping.
 */
export function formatMoneyAmount(
  amount: number,
  currencyCode: string,
  numberFormat: NumberFormatStyle = DEFAULT_NUMBER_FORMAT,
): string {
  const decimals = amount % 1 === 0 ? 0 : 2;
  const digits = formatAmount(amount, numberFormat, decimals);
  return `${currencyDisplaySymbol(currencyCode)}${digits}`;
}

/** Strip grouping separators for the active style so a field value can be parsed. */
export function parseNumberInput(
  raw: string,
  style: NumberFormatStyle = DEFAULT_NUMBER_FORMAT,
): number {
  if (!raw.trim()) return 0;
  const { thousands, decimal } = FORMAT_CONFIG[style];
  let cleaned = raw;
  if (thousands === "\u00A0") {
    cleaned = cleaned.replace(/[\s\u00A0]/g, "");
  } else {
    cleaned = cleaned.split(thousands).join("");
  }
  cleaned = cleaned.replace(decimal, ".").replace(/[^\d.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return 0;
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Live-format a typed amount with thousands separators while preserving a trailing
 * decimal point and up to `maxFractionDigits` fractional digits.
 */
export function formatNumberInput(
  raw: string,
  maxFractionDigits = 4,
  style: NumberFormatStyle = DEFAULT_NUMBER_FORMAT,
): string {
  const { thousands, decimal } = FORMAT_CONFIG[style];
  let cleaned = raw;
  if (thousands === "\u00A0") {
    cleaned = cleaned.replace(/[\s\u00A0]/g, "");
  } else {
    cleaned = cleaned.split(thousands).join("");
  }

  if (decimal === ",") {
    cleaned = cleaned.replace(/[^0-9,]/g, "");
  } else {
    cleaned = cleaned.replace(/[^0-9.]/g, "");
  }

  if (!cleaned) return "";

  const endsWithDecimal =
    cleaned.endsWith(decimal) && cleaned.indexOf(decimal) === cleaned.length - 1;
  const [intRaw = "", ...rest] = cleaned.split(decimal);
  const fracRaw = rest.join("").slice(0, maxFractionDigits);
  const intDigits = intRaw.replace(/^0+(?=\d)/, "") || (fracRaw || endsWithDecimal ? "0" : intRaw);
  const grouped = groupDigits(intDigits, thousands);

  if (endsWithDecimal && !fracRaw) return `${grouped}${decimal}`;
  if (rest.length > 0 || fracRaw) return `${grouped}${decimal}${fracRaw}`;
  return grouped;
}

/** Format a finite number for a money/price TextInput (grouped, trimmed zeros). */
export function formatNumberForInput(
  value: number,
  maxFractionDigits = 4,
  style: NumberFormatStyle = DEFAULT_NUMBER_FORMAT,
): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  const fixed = value.toFixed(maxFractionDigits).replace(/\.?0+$/, "");
  // formatNumberInput expects the style's decimal separator in the raw string.
  const { decimal } = FORMAT_CONFIG[style];
  const localized = fixed.replace(".", decimal);
  return formatNumberInput(localized, maxFractionDigits, style);
}

/**
 * Re-parse a stored field with `from` and re-emit it with `to` (used when the
 * user switches number format so existing typed amounts stay correct).
 */
export function reformatNumberString(
  raw: string,
  from: NumberFormatStyle,
  to: NumberFormatStyle,
  maxFractionDigits = 4,
): string {
  if (!raw.trim() || !/\d/.test(raw)) return "";
  const n = parseNumberInput(raw, from);
  if (n === 0) return formatNumberInput("0", maxFractionDigits, to);
  return formatNumberForInput(n, maxFractionDigits, to);
}

/** Compact label for a currency code (code + name). */
export function currencyPickerLabel(code: string): string {
  const info = getCurrencyInfo(code);
  return info ? `${info.code} · ${info.name}` : code;
}
