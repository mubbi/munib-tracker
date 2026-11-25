import { Image } from "expo-image";
import { usePathname } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import type { OAuthProvider } from "@/api/endpoints";
import { ThemedText } from "@/components/themed-text";
import { Callout } from "@/components/ui/callout";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, Opacity, Radius, Spacing } from "@/constants/theme";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

import { type SocialAuthErrorKey, socialAuthErrorKey } from "./social-auth-errors";

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

export function SocialLoginButtons({
  onSuccess,
  onAttempt,
}: {
  onSuccess?: () => void;
  /** Runs when a provider is pressed (the login screen clears its return error). */
  onAttempt?: () => void;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { tokens, scheme } = useThemeTokens();
  const { signIn, busy, googleConfigured, appleConfigured, facebookConfigured } = useSocialAuth();
  /** Translated failure + the provider to retry (never the raw `Error.message` — D-01). */
  const [failure, setFailure] = useState<{
    key: SocialAuthErrorKey;
    provider: OAuthProvider;
  } | null>(null);

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
    setFailure(null);
    onAttempt?.();
    try {
      // Persist current route so Android Custom Tab / App Link resume can return
      // here instead of always dumping onto the guest login modal.
      await signIn(provider, { returnTo: pathname || undefined });
      onSuccess?.();
    } catch (e) {
      // A user-dismissed sheet maps to null — not an error worth surfacing.
      const key = socialAuthErrorKey(e);
      if (key) setFailure({ key, provider });
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
        const connecting = busy === id;
        // D-22: while one provider connects, the others are dimmed and disabled.
        const blocked = busy !== null && !connecting;
        return (
          <PressableScale
            key={id}
            haptic="light"
            disabled={busy !== null}
            onPress={() => connect(id)}
            accessibilityRole="button"
            accessibilityLabel={t(`login.${id}`)}
            accessibilityState={{ disabled: busy !== null, busy: connecting }}
            style={[
              styles.providerButton,
              { backgroundColor: brand.background, borderColor: brand.border },
              blocked && { opacity: Opacity.disabled },
            ]}
          >
            {connecting ? (
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

      {failure ? (
        <Callout
          tone="danger"
          action={
            busy === null
              ? { label: t("common.tryAgain"), onPress: () => void connect(failure.provider) }
              : undefined
          }
        >
          {t(failure.key)}
        </Callout>
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
    borderWidth: BorderWidth.hairline,
  },
  providerButton: {
    minHeight: Control.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  providerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    width: "100%",
  },
  providerLogo: {
    width: 20,
    height: 20,
  },
});
