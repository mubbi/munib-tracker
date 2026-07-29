import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const HEADER_LOGO = require("@/assets/images/icon-192.png");

export function ShareProofHeader() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Image source={HEADER_LOGO} style={styles.logo} accessibilityLabel={APP_NAME} />
      <ThemedText type="subtitle" style={styles.brandName}>
        {APP_NAME}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.tagline}>
        {t("share.proofTagline", { defaultValue: APP_TAGLINE })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
  },
  brandName: {
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
    lineHeight: 18,
  },
});
