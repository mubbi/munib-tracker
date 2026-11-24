import { openBrowserAsync } from "expo-web-browser";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { CHILD_CONSENT_POLICY_VERSION, PRIVACY_POLICY_URL } from "@/lib/circles/consent";
import { isTV } from "@/lib/platform/is-tv";

/**
 * Parental consent text + confirmation switch for a child profile (D7). The
 * server records `{ parent, consentedAt, policyVersion }`. The wording is
 * factual (what is stored, who sees it, how to delete) and never claims legal
 * compliance — the COPPA / GDPR Art. 8 / UK AADC review is an open owner item.
 */
export function ParentalConsent({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.muted }]}>
      <ThemedText type="smallBold">{t("family.consent.title")}</ThemedText>
      {(["stored", "visible", "device", "delete"] as const).map((point) => (
        <ThemedText key={point} type="small" themeColor="mutedForeground">
          {`• ${t(`family.consent.${point}`)}`}
        </ThemedText>
      ))}
      {!isTV() ? (
        <ThemedText
          type="small"
          themeColor="accent"
          accessibilityRole="link"
          onPress={() => void openBrowserAsync(PRIVACY_POLICY_URL)}
        >
          {t("family.consent.policyLink", { version: CHILD_CONSENT_POLICY_VERSION })}
        </ThemedText>
      ) : null}
      <View style={styles.row}>
        <ThemedText type="small" style={styles.label}>
          {t("family.consent.confirm")}
        </ThemedText>
        <ThemedSwitch
          value={value}
          onValueChange={onChange}
          accessibilityLabel={t("family.consent.confirm")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two, marginTop: Spacing.one },
  label: { flex: 1 },
});
