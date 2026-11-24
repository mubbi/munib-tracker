import { useState } from "react";

import { DEFAULT_NUMBER_FORMAT, formatNumberInput, parseNumberInput } from "@/lib/format-currency";

import { LabeledInput } from "./labeled-input";

/**
 * A money / number field that keeps the typed text (so "10." or "1,000" stay
 * as typed) and reports the parsed value; empty or 0 reports `undefined`.
 */
export function AmountInput({
  label,
  hint,
  value,
  onChange,
  max,
}: {
  label: string;
  hint?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  max?: number;
}) {
  const [text, setText] = useState(value != null && value > 0 ? String(value) : "");
  return (
    <LabeledInput
      label={label}
      hint={hint}
      value={text}
      keyboardType="decimal-pad"
      placeholder="0"
      onChangeText={(raw) => {
        const next = formatNumberInput(raw, 2, DEFAULT_NUMBER_FORMAT);
        setText(next);
        const n = parseNumberInput(next, DEFAULT_NUMBER_FORMAT);
        onChange(n > 0 ? (max != null ? Math.min(max, n) : n) : undefined);
      }}
    />
  );
}
