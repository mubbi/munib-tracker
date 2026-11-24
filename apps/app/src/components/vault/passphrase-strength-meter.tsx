import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { VAULT_MIN_PASSPHRASE_LENGTH } from "@/lib/vault/keyring";
import { assessPassphrase } from "@/lib/vault/passphrase-strength";

const SEGMENTS = [1, 2, 3, 4] as const;

/** Four-segment strength meter + label for a vault passphrase (min {@link VAULT_MIN_PASSPHRASE_LENGTH}). */
export function PassphraseStrengthMeter({ passphrase }: { passphrase: string }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { score, strength, length, meetsMinimum } = assessPassphrase(passphrase);
  const tone =
    score <= 1 ? tokens.status.danger : score === 2 ? tokens.status.warning : tokens.status.success;
  const label = t(`vault.strength.${strength}`);

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t("vault.strength.a11y")}
      accessibilityValue={{ min: 0, max: 4, now: score, text: label }}
    >
      <View style={styles.bars}>
        {SEGMENTS.map((segment) => (
          <View
            key={segment}
            style={[
              styles.bar,
              { backgroundColor: passphrase && score >= segment ? tone.color : tokens.track },
            ]}
          />
        ))}
      </View>
      <ThemedText type="caption" style={{ color: passphrase ? tone.text : undefined }}>
        {passphrase
          ? meetsMinimum
            ? label
            : t("vault.strength.minLength", { min: VAULT_MIN_PASSPHRASE_LENGTH, current: length })
          : t("vault.strength.hint", { min: VAULT_MIN_PASSPHRASE_LENGTH })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.one },
  bars: { flexDirection: "row", gap: Spacing.one },
  bar: { flex: 1, height: 4, borderRadius: 2 },
});
