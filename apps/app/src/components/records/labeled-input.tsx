import type { TextInputProps } from "react-native";

import { TextField } from "@/components/ui/text-field";

/**
 * A labelled text field for the private records screens (debts, wasiyyah) —
 * the shared `TextField` (label above, helper, inline error) under the name the
 * records forms already use. `hint` is the helper line.
 */
export function LabeledInput({
  label,
  hint,
  error,
  ...props
}: Omit<TextInputProps, "style"> & { label: string; hint?: string; error?: string }) {
  return <TextField label={label} helperText={hint} error={error} {...props} />;
}
