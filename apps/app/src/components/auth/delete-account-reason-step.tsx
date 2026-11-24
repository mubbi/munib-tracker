import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ACCOUNT_CLOSURE_DETAILS_MAX,
  ACCOUNT_CLOSURE_REASONS,
  type AccountClosureReasonCode,
} from "@/lib/auth/account-closure-reasons";
import { isTV } from "@/lib/platform/is-tv";

type DeleteAccountReasonStepProps = {
  reason: AccountClosureReasonCode | null;
  onReasonChange: (reason: AccountClosureReasonCode) => void;
  details: string;
  onDetailsChange: (details: string) => void;
  disabled: boolean;
};

/** Step 2: closure survey — one required reason (radio list) + optional free-text details. */
export function DeleteAccountReasonStep({
  reason: primaryReason,
  onReasonChange,
  details,
  onDetailsChange,
  disabled,
}: DeleteAccountReasonStepProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  /** TV: selected reason = soft fill + hairline; the accent ring is D-pad focus. */
  const selectedBorder = isTV() ? tokens.accentBorder : colors.accent;

  return (
    <>
      <ThemedText type="small" style={styles.blockTitle}>
        {t("profile.deleteAccountSurveyTitle")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.surveyIntro}>
        {t("profile.deleteAccountSurveyIntro")}
      </ThemedText>
      {ACCOUNT_CLOSURE_REASONS.map((reason) => {
        const selected = primaryReason === reason;
        return (
          <PressableScale
            key={reason}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            haptic="selection"
            onPress={() => onReasonChange(reason)}
            style={[
              styles.reasonRow,
              {
                borderColor: selected ? selectedBorder : colors.border,
                backgroundColor: selected ? tokens.accentSoft : "transparent",
              },
            ]}
          >
            <View
              style={[styles.radioOuter, { borderColor: selected ? colors.accent : colors.border }]}
            >
              {selected ? (
                <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
              ) : null}
            </View>
            <ThemedText type="small" style={styles.reasonLabel}>
              {t(`profile.deleteAccountReasons.${reason}`)}
            </ThemedText>
          </PressableScale>
        );
      })}
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.detailsLabel}>
        {t("profile.deleteAccountDetailsOptional")}
      </ThemedText>
      <TextInput
        value={details}
        onChangeText={(value) => onDetailsChange(value.slice(0, ACCOUNT_CLOSURE_DETAILS_MAX))}
        placeholder={t("profile.deleteAccountDetailsPlaceholder")}
        placeholderTextColor={colors.mutedForeground}
        multiline
        editable={!disabled}
        style={[styles.detailsInput, tokens.inputSurface, { color: colors.foreground }]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  blockTitle: {
    fontWeight: "700",
  },
  surveyIntro: {
    marginBottom: Spacing.one,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  reasonLabel: {
    flex: 1,
  },
  detailsLabel: {
    marginTop: Spacing.one,
  },
  detailsInput: {
    minHeight: 72,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    textAlignVertical: "top",
  },
});
