import type { TextInputProps } from "react-native";

import { TextField as UiTextField } from "@/components/ui/text-field";

/**
 * Labelled, themed text input for the self-review forms (private, never sent
 * anywhere). A thin adapter over the design-system `TextField` — `hint` is its
 * helper text and `style` styles the input.
 */
export function TextField({
  label,
  hint,
  style,
  ...input
}: TextInputProps & { label: string; hint?: string }) {
  return <UiTextField label={label} helperText={hint} inputStyle={style} {...input} />;
}
