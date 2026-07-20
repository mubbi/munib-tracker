import { Image } from "expo-image";
import { usePathname } from "expo-router";
import { useMemo, useState } from "react";
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
 * do NOT follow the app theme accent — brand buttons must keep their brand
 * identity so they stay instantly recognizable. Apple switches black ↔ white
 * with the color scheme (HIG) so the button remains visible on dark UI.
 * Google/Facebook logos are multi-color SVGs (no `tintColor`).
 */
type ProviderBrand = {
  background: string;
  foreground: string;
  border: string;
  spinner: string;
  logo: number;
};

const GOOGLE_BRAND: ProviderBrand = {
  background: "#FFFFFF",
  foreground: "#1F1F1F",
  border: "#DADCE0",
  spinner: "#4285F4",
  logo: require("@/assets/brands/google.svg"),
};

const FACEBOOK_BRAND: ProviderBrand = {
  background: "#1877F2",
  foreground: "#FFFFFF",
  border: "#1877F2",
  spinner: "#FFFFFF",
  logo: require("@/assets/brands/facebook.svg"),
};

/** Apple HIG: white on dark backgrounds, black on light. */
function appleBrand(scheme: "light" | "dark"): ProviderBrand {
  if (scheme === "dark") {
    return {
      background: "#FFFFFF",
      foreground: "#000000",
      border: "#E5E5E5",
      spinner: "#000000",
      logo: require("@/assets/brands/apple-black.svg"),
    };
  }
  return {
    background: "#000000",
    foreground: "#FFFFFF",
    border: "rgba(255, 255, 255, 0.24)",
    spinner: "#FFFFFF",
    logo: require("@/assets/brands/apple.svg"),
  };
}

const PROVIDER_ORDER: OAuthProvider[] = ["google", "apple", "facebook"];

export function SocialLoginButtons({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { tokens, scheme } = useThemeTokens();
  const { signIn, busy, googleConfigured, appleConfigured, facebookConfigured } = useSocialAuth();
  const [error, setError] = useState<string | null>(null);

  const configured: Record<OAuthProvider, boolean> = {
    google: googleConfigured,
    apple: appleConfigured,
    facebook: facebookConfigured,
  };

  const brands = useMemo((): Record<OAuthProvider, ProviderBrand> => {
    return {
      google: GOOGLE_BRAND,
      apple: appleBrand(scheme),
      facebook: FACEBOOK_BRAND,
    };
  }, [scheme]);

  const visibleProviders = PROVIDER_ORDER.filter((id) => configured[id]);

  const connect = async (provider: OAuthProvider) => {
    setError(null);
    try {
      // Persist current route so Android Custom Tab / App Link resume can return
      // here instead of always dumping onto the guest login modal.
      await signIn(provider, { returnTo: pathname || undefined });
      onSuccess?.();
    } catch (e) {
      // A user-dismissed sheet isn't an error worth surfacing.
      if (e instanceof Error && e.message === OAUTH_CANCELLED) return;
      setError(e instanceof Error && e.message ? e.message : t("login.error"));
    }
  };

  if (visibleProviders.length === 0) {
    return (
      <View
        style={[
          styles.unavailable,
          { backgroundColor: tokens.surfaceRaised, borderColor: tokens.hairline },
        ]}
        accessibilityRole="text"
      >
        <ThemedText type="smallBold" style={{ textAlign: "center" }}>
          {t("login.providersUnavailableTitle")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={{ textAlign: "center" }}>
          {t("login.providersUnavailableBody")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {visibleProviders.map((id) => {
        const brand = brands[id];
        return (
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
        );
      })}

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
  unavailable: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  providerButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
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
