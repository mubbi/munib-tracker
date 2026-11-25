import { useMoneyNumberFormat } from "@/components/money/use-number-format";
import { NumberField } from "@/components/ui/number-field";

/**
 * A money field for the records screens: the shared `NumberField` in the user's
 * number format. Reports the parsed value; empty or 0 reports `undefined`.
 */
export function AmountInput({
  label,
  hint,
  value,
  onChange,
  max,
  currency,
  error,
}: {
  label: string;
  hint?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  max?: number;
  /** Currency code shown after the digits. */
  currency?: string;
  error?: string;
}) {
  const numberFormat = useMoneyNumberFormat();
  return (
    <NumberField
      label={label}
      helperText={hint}
      error={error}
      value={value}
      onChangeValue={onChange}
      numberFormat={numberFormat}
      maxFractionDigits={2}
      max={max}
      suffix={currency}
    />
  );
}
