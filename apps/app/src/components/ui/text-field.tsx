import { forwardRef, type ReactNode, useState } from "react";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";

import {
  type FieldChromeProps,
  FieldShell,
  fieldRowStyles,
  useFieldA11y,
  useFieldSurface,
} from "@/components/ui/field-chrome";
import { Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

export type TextFieldProps = FieldChromeProps &
  Omit<TextInputProps, "style" | "editable" | "accessibilityLabel"> & {
    /** Slot before the text (icon, currency prefix). Wrap pressables yourself. */
    leading?: ReactNode;
    /** Slot after the text (clear button, unit, show/hide toggle). */
    trailing?: ReactNode;
    /** Shows "n/max" under the field and enforces `maxLength`. */
    maxLength?: number;
    /** Min height for `multiline` (default 4 lines). */
    minLines?: number;
    style?: StyleProp<ViewStyle>;
    /** Extra style for the inner TextInput. */
    inputStyle?: TextInputProps["style"];
  };

/**
 * The one general text field: label above, helper, inline error (surface + icon,
 * announced), counter, leading / trailing slots, multiline, secure, disabled.
 * Forwards its ref to the underlying `TextInput`.
 *
 * Validate on blur / submit (design-system §Forms) — this component only shows
 * the `error` it is given.
 */
export const TextField = forwardRef<TextInputInstance, TextFieldProps>(function TextField(
  {
    label,
    helperText,
    error,
    required,
    optional,
    disabled,
    leading,
    trailing,
    maxLength,
    minLines = 4,
    multiline,
    style,
    inputStyle,
    onFocus,
    onBlur,
    value,
    ...inputProps
  },
  ref,
) {
  const { colors } = useThemeTokens();
  const [focused, setFocused] = useState(false);
  const tv = isTV();
  const hasCounter = maxLength != null;
  const { inputId, messageId, counterId, inputA11y } = useFieldA11y({
    label,
    helperText,
    error,
    required,
    disabled,
    hasCounter,
  });
  const surface = useFieldSurface({ focused, error });
  const lineHeight = tv ? tvDp(TvLayout.bodyFontSize) * 1.4 : 22;

  return (
    <View style={style}>
      <FieldShell
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        optional={optional}
        messageId={messageId}
        counterId={counterId}
        inputId={inputId}
        counter={hasCounter ? { current: (value ?? "").length, max: maxLength } : undefined}
      >
        <View
          style={[
            fieldRowStyles.row,
            multiline && fieldRowStyles.rowMultiline,
            surface,
            disabled && fieldRowStyles.disabled,
          ]}
        >
          {leading}
          <TextInput
            ref={ref}
            value={value}
            maxLength={maxLength}
            multiline={multiline}
            editable={!disabled}
            placeholderTextColor={colors.mutedForeground}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...inputA11y}
            {...inputProps}
            style={[
              styles.input,
              tv && { fontSize: tvDp(TvLayout.bodyFontSize) },
              multiline && { minHeight: lineHeight * minLines, textAlignVertical: "top" },
              Platform.OS === "web" && ({ outlineStyle: "none" } as object),
              { color: colors.foreground },
              inputStyle,
            ]}
          />
          {trailing}
        </View>
      </FieldShell>
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
});
