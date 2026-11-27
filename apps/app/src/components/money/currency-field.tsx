import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  type FieldChromeProps,
  FieldShell,
  fieldRowStyles,
  useFieldA11y,
  useFieldSurface,
} from "@/components/ui/field-chrome";
import { PressableScale } from "@/components/ui/pressable-scale";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { IconSize } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * Currency select for every money form (zakat, sadaqah, fidyah, debts, wasiyyah):
 * the select-field row that opens the searchable `CurrencyPickerSheet` (157
 * currencies need a search, which the plain `SelectField` list does not have).
 */
export function CurrencyField({
  label,
  value,
  onChange,
  helperText,
  optional,
  disabled,
}: Pick<FieldChromeProps, "label" | "helperText" | "optional" | "disabled"> & {
  value: string;
  onChange: (code: string) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const { inputId, messageId, counterId } = useFieldA11y({ label, helperText, disabled });
  const surface = useFieldSurface({ focused });
  const web = Platform.OS === "web";

  return (
    <>
      <FieldShell
        label={label}
        helperText={helperText}
        optional={optional}
        messageId={messageId}
        counterId={counterId}
        inputId={inputId}
      >
        <PressableScale
          role="button"
          accessibilityLabel={`${label}, ${value}`}
          accessibilityHint={helperText ?? t("uiField.choose")}
          accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
          disabled={disabled}
          onPress={() => setOpen(true)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          scaleTo={0.99}
          style={[fieldRowStyles.row, surface, disabled && fieldRowStyles.disabled]}
          {...(web ? ({ id: inputId, "aria-haspopup": "dialog" } as object) : null)}
        >
          <ThemedText style={styles.value} numberOfLines={1}>
            {value}
          </ThemedText>
          <SymbolView
            name={{ ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" }}
            size={IconSize.md}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>
      </FieldShell>
      <CurrencyPickerSheet
        visible={open}
        selectedCode={value}
        onSelect={(code) => {
          onChange(code);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  value: { flex: 1, minWidth: 0 },
});
