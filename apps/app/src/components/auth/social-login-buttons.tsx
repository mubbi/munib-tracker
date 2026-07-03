import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import type { OAuthProvider } from "@/api/endpoints";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { OAUTH_CANCELLED, useSocialAuth } from "@/hooks/use-social-auth";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * Brand-locked styling for each sign-in button, following the official
 * Google, Apple, and Facebook sign-in guidelines. These colors intentionally
 * do NOT follow the app theme — brand buttons must keep their brand identity in
 * both light and dark mode so they stay instantly recognizable. Logos are the
 * official marks rendered as SVG (multi-color, so no `tintColor`).
 */
type ProviderBrand = {
  background: string;
  foreground: string;
  border: string;
  spinner: string;
  logo: number;
};

const PROVIDERS: { id: OAuthProvider; brand: ProviderBrand }[] = [
  {
    id: "google",
    brand: {
      background: "#FFFFFF",
      foreground: "#1F1F1F",
      border: "#DADCE0",
      spinner: "#4285F4",
      logo: require("@/assets/brands/google.svg"),
    },
  },
  {
    id: "apple",
    brand: {
      background: "#000000",
      foreground: "#FFFFFF",
      border: "rgba(255, 255, 255, 0.24)",
      spinner: "#FFFFFF",
      logo: require("@/assets/brands/apple.svg"),
    },
  },
];

export function SocialLoginButtons({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { signIn, busy } = useSocialAuth();
  const [error, setError] = useState<string | null>(null);

  const connect = async (provider: OAuthProvider) => {
    setError(null);
    try {
      await signIn(provider);
      onSuccess?.();
    } catch (e) {
      // A user-dismissed sheet isn't an error worth surfacing.
      if (e instanceof Error && e.message === OAUTH_CANCELLED) return;
      setError(e instanceof Error && e.message ? e.message : t("login.error"));
    }
  };

  return (
    <View style={styles.root}>
      {PROVIDERS.map(({ id, brand }) => (
        <PressableScale
          key={id}
          haptic="light"
          disabled={busy !== null}
          onPress={() => connect(id)}
          accessibilityRole="button"
          accessibilityLabel={t(`login.${id}`)}
          style={[
            styles.providerButton,
            { backgroundColor: brand.background, borderColor: brand.border },
          ]}
        >
          {busy === id ? (
            <ActivityIndicator color={brand.spinner} />
          ) : (
            <View style={styles.providerContent}>
              <Image
                source={brand.logo}
                style={styles.providerLogo}
                contentFit="contain"
                accessible={false}
              />
              <ThemedText type="smallBold" style={{ color: brand.foreground }}>
                {t(`login.${id}`)}
              </ThemedText>
            </View>
          )}
        </PressableScale>
      ))}

      {error ? (
        <ThemedText
          type="caption"
          style={{ color: tokens.status.danger.text, textAlign: "center" }}
        >
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },
  providerButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  providerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  providerLogo: {
    width: 20,
    height: 20,
  },
});
