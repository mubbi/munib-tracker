import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TextField } from "@/components/ui/text-field";
import { BorderWidth, Control, Radius, Spacing } from "@/constants/theme";
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
      <ThemedText type="smallBold" heading={3}>
        {t("profile.deleteAccountSurveyTitle")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.surveyIntro}>
        {t("profile.deleteAccountSurveyIntro")}
      </ThemedText>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t("profile.deleteAccountSurveyTitle")}
        style={styles.reasons}
      >
        {ACCOUNT_CLOSURE_REASONS.map((reason) => {
          const selected = primaryReason === reason;
          return (
            <PressableScale
              key={reason}
              accessibilityRole="radio"
              accessibilityLabel={t(`profile.deleteAccountReasons.${reason}`)}
              accessibilityState={{ checked: selected, selected, disabled }}
              disabled={disabled}
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
                style={[
                  styles.radioOuter,
                  { borderColor: selected ? colors.accent : colors.border },
                ]}
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
      </View>
      <TextField
        label={t("profile.deleteAccountDetailsOptional")}
        value={details}
        onChangeText={(value) => onDetailsChange(value.slice(0, ACCOUNT_CLOSURE_DETAILS_MAX))}
        placeholder={t("profile.deleteAccountDetailsPlaceholder")}
        multiline
        minLines={3}
        maxLength={ACCOUNT_CLOSURE_DETAILS_MAX}
        disabled={disabled}
        style={styles.details}
      />
    </>
  );
}

const styles = StyleSheet.create({
  surveyIntro: {
    marginBottom: Spacing.one,
  },
  reasons: {
    gap: Spacing.two,
  },
  reasonRow: {
    minHeight: Control.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: BorderWidth.thick,
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
  details: {
    marginTop: Spacing.one,
  },
});
