import { openBrowserAsync } from "expo-web-browser";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Control, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

// Same public pages as Settings › Help & about (about-panel.tsx).
const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app";
const PRIVACY_URL = `${SITE_URL}/privacy`;
const TERMS_URL = `${SITE_URL}/terms`;

/**
 * One-line terms / privacy note under the sign-in buttons (D-45). Not shown on
 * TV (no in-app browser there; Help & about offers the pages as QR codes).
 */
export function LegalLinks() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();

  const link = (label: string, url: string) => (
    <PressableScale
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={() => void openBrowserAsync(url).catch(() => undefined)}
      style={styles.link}
    >
      <ThemedText type="caption" style={{ color: colors.accentText }}>
        {label}
      </ThemedText>
    </PressableScale>
  );

  return (
    <View style={styles.root}>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
        {t("login.legalNote")}
      </ThemedText>
      <View style={styles.links}>
        {link(t("about.termsOfService"), TERMS_URL)}
        <ThemedText type="caption" themeColor="mutedForeground" accessible={false}>
          ·
        </ThemedText>
        {link(t("about.privacyPolicy"), PRIVACY_URL)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
  },
  note: {
    textAlign: "center",
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
  },
  link: {
    minHeight: Control.minTouch,
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
  },
});
