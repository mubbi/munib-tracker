import { forwardRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TextInputInstance } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { TextField, type TextFieldProps } from "@/components/ui/text-field";
import {
  DEFAULT_NUMBER_FORMAT,
  formatNumberForInput,
  formatNumberInput,
  type NumberFormatStyle,
  parseNumberInput,
} from "@/lib/format-currency";
import { isTV } from "@/lib/platform/is-tv";

/** Eastern Arabic / Persian digits and Arabic separators → the ASCII the formatter reads. */
export function asciiNumberInput(raw: string, style: NumberFormatStyle): string {
  const decimal = style.endsWith("comma") ? "," : ".";
  return raw
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/٫/g, decimal) // Arabic decimal separator
    .replace(/٬/g, ""); // Arabic thousands separator
}

function numberToText(
  v: number | undefined,
  allowZero: boolean,
  maxFractionDigits: number,
  style: NumberFormatStyle,
): string {
  if (v == null || v < 0 || (v === 0 && !allowZero)) return "";
  return v === 0 ? "0" : formatNumberForInput(v, maxFractionDigits, style);
}

/**
 * Whether `value` lies within the optional `min` / `max`. `NumberField` never
 * clamps what was typed (B-03): it reports the raw number and shows a range
 * error, so callers gate their own writes / validation with this helper.
 */
export function isNumberInRange(value: number | undefined, min?: number, max?: number): boolean {
  if (value == null) return true;
  if (max != null && value > max) return false;
  if (min != null && value < min) return false;
  return true;
}

export type NumberFieldProps = Omit<
  TextFieldProps,
  "value" | "onChangeText" | "keyboardType" | "inputMode" | "secureTextEntry" | "multiline"
> & {
  /** Parsed value; `undefined` for empty. */
  value: number | undefined;
  /**
   * Reports the parsed value exactly as typed — never clamped to `min` / `max`
   * (check it with {@link isNumberInRange}). Empty (or 0 when `allowZero` is
   * false) reports `undefined`.
   */
  onChangeValue: (value: number | undefined) => void;
  /** The user's number format (default `comma_dot`). */
  numberFormat?: NumberFormatStyle;
  /** 0 for integers, 2 for money. */
  maxFractionDigits?: number;
  /**
   * Valid range. A typed value outside it is kept and reported as typed, and the
   * field shows a range error (unless the caller passes its own `error`). The TV
   * − / + buttons stay within it.
   */
  max?: number;
  min?: number;
  /** Treat 0 as a real value (default: 0 reads as empty, as money fields do). */
  allowZero?: boolean;
  /** Currency symbol / unit before the digits. */
  prefix?: string;
  /** Currency code / unit after the digits. */
  suffix?: string;
  /** TV: step of the − / + buttons (a D-pad cannot type reliably). */
  step?: number;
};

/**
 * Number / money field. Keeps the typed text ("10." and "1,000" stay as typed),
 * live-groups by the user's number format, accepts locale digits, shows a
 * decimal keyboard for money and a numeric one for integers. Out-of-range input
 * is never clamped or replaced: it stays as typed, is reported as typed and
 * shows an error, so the caller's validation sees the real number (B-03).
 */
export const NumberField = forwardRef<TextInputInstance, NumberFieldProps>(function NumberField(
  {
    value,
    onChangeValue,
    numberFormat = DEFAULT_NUMBER_FORMAT,
    maxFractionDigits = 2,
    max,
    min,
    allowZero = false,
    prefix,
    suffix,
    step = 1,
    error,
    label,
    trailing,
    leading,
    placeholder = "0",
    ...rest
  },
  ref,
) {
  const { t } = useTranslation();
  const tv = isTV();
  const toText = (v: number | undefined) =>
    numberToText(v, allowZero, maxFractionDigits, numberFormat);
  const [text, setText] = useState(() => toText(value));
  const lastEmitted = useRef<number | undefined>(value);
  const lastFormat = useRef({ numberFormat, maxFractionDigits });

  // External changes (reset, load) re-seed the text; our own emissions don't.
  // A number-format switch re-formats the text too, or the old separators would
  // be re-read in the new format on the next keystroke (B-15).
  useEffect(() => {
    const formatChanged =
      lastFormat.current.numberFormat !== numberFormat ||
      lastFormat.current.maxFractionDigits !== maxFractionDigits;
    lastFormat.current = { numberFormat, maxFractionDigits };
    if (value !== lastEmitted.current || formatChanged) {
      lastEmitted.current = value;
      setText(numberToText(value, allowZero, maxFractionDigits, numberFormat));
    }
  }, [value, numberFormat, maxFractionDigits, allowZero]);

  const commit = (nextText: string) => {
    setText(nextText);
    let n: number | undefined =
      nextText === "" ? undefined : parseNumberInput(nextText, numberFormat);
    if (n != null && n === 0 && !allowZero) n = undefined;
    lastEmitted.current = n;
    onChangeValue(n);
  };

  // Range error for what is on screen (a typed 0 counts even when it reports
  // `undefined`, so "0" in a 1–31 field is flagged rather than silently dropped).
  const shown = text === "" ? undefined : parseNumberInput(text, numberFormat);
  const formatBound = (bound: number) =>
    formatNumberForInput(bound, maxFractionDigits, numberFormat) || "0";
  const rangeError =
    shown == null || isNumberInRange(shown, min, max)
      ? undefined
      : min != null && max != null
        ? t("uiFeedback.numberBetween", { min: formatBound(min), max: formatBound(max) })
        : max != null
          ? t("uiFeedback.numberAtMost", { max: formatBound(max) })
          : t("uiFeedback.numberAtLeast", { min: formatBound(min ?? 0) });

  const onChangeText = (raw: string) =>
    commit(formatNumberInput(asciiNumberInput(raw, numberFormat), maxFractionDigits, numberFormat));

  const stepBy = (delta: number) => {
    const next = Math.max(min ?? 0, Math.min(max ?? Number.MAX_SAFE_INTEGER, (value ?? 0) + delta));
    commit(toText(next) || (allowZero ? "0" : ""));
  };

  const integer = maxFractionDigits === 0;
  const prefixNode = prefix ? (
    <ThemedText type="default" themeColor="mutedForeground">
      {prefix}
    </ThemedText>
  ) : null;
  const suffixNode = suffix ? (
    <ThemedText type="default" themeColor="mutedForeground">
      {suffix}
    </ThemedText>
  ) : null;
  // TV: at a bound the − / + stay focusable (disabling the focused button
  // would drop D-pad focus) but report disabled and do nothing.
  const current = value ?? 0;
  const atMin = current <= (min ?? 0);
  const atMax = max != null && current >= max;
  const tvButtons = tv ? (
    <>
      <IconButton
        name={{ ios: "minus", android: "remove", web: "remove" }}
        accessibilityLabel={t("common.decrease", { label })}
        accessibilityState={{ disabled: atMin }}
        onPress={() => {
          if (!atMin) stepBy(-step);
        }}
        disabled={rest.disabled}
      />
      <IconButton
        name={{ ios: "plus", android: "add", web: "add" }}
        accessibilityLabel={t("common.increase", { label })}
        accessibilityState={{ disabled: atMax }}
        onPress={() => {
          if (!atMax) stepBy(step);
        }}
        disabled={rest.disabled}
      />
    </>
  ) : null;

  return (
    <TextField
      ref={ref}
      label={label}
      {...rest}
      error={error ?? rangeError}
      value={text}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={integer ? "number-pad" : "decimal-pad"}
      inputMode={integer ? "numeric" : "decimal"}
      autoCorrect={false}
      leading={
        <>
          {leading}
          {prefixNode}
        </>
      }
      trailing={
        <>
          {suffixNode}
          {trailing}
          {tvButtons}
        </>
      }
    />
  );
});
