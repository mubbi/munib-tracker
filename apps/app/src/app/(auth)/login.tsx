import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import type { OAuthProvider } from "@/api/endpoints";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useAuth } from "@/providers/auth-provider";

const PROVIDERS: { id: OAuthProvider; label: string; icon: SymbolViewProps["name"] }[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: { ios: "g.circle.fill", android: "login", web: "login" },
  },
  {
    id: "apple",
    label: "Continue with Apple",
    icon: { ios: "apple.logo", android: "login", web: "login" },
  },
  {
    id: "facebook",
    label: "Continue with Facebook",
    icon: { ios: "f.circle.fill", android: "login", web: "login" },
  },
];

export default function LoginScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const { isGuest, linkProvider, signInWithProvider } = useAuth();
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async (provider: OAuthProvider) => {
    setBusy(provider);
    setError(null);
    try {
      // Real provider tokens (via expo-auth-session) would be passed here when
      // client IDs are configured; the API completes the exchange server-side.
      if (isGuest) await linkProvider(provider);
      else await signInWithProvider(provider);
      if (router.canGoBack()) router.back();
    } catch {
      setError(
        "Couldn't sign in. Make sure the API server is running and this provider is configured.",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <ScreenLayout
      eyebrow={isGuest ? "Save your progress" : "Welcome"}
      title="Sign in"
      subtitle="Sync your worship across devices"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
            <SymbolView
              name={{ ios: "icloud.fill", android: "cloud", web: "cloud" }}
              size={30}
              tintColor={colors.accent}
            />
          </View>
          <ThemedText type="small" themeColor="mutedForeground" style={styles.heroText}>
            {isGuest
              ? "You're using a guest account. Link a provider to back up and sync your data — nothing is lost."
              : "Sign in to keep your prayers, qaza, and zikr safe in the cloud."}
          </ThemedText>
        </Card>

        <View style={styles.providers}>
          {PROVIDERS.map((provider) => (
            <PressableScale
              key={provider.id}
              haptic="light"
              disabled={busy !== null}
              onPress={() => connect(provider.id)}
              style={[
                styles.providerButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {busy === provider.id ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <SymbolView name={provider.icon} size={20} tintColor={colors.foreground} />
              )}
              <ThemedText type="smallBold">{provider.label}</ThemedText>
            </PressableScale>
          ))}
        </View>

        {error ? (
          <ThemedText
            type="caption"
            style={{ color: tokens.status.danger.color, textAlign: "center" }}
          >
            {error}
          </ThemedText>
        ) : null}

        <Button
          label="Continue as guest"
          variant="ghost"
          fullWidth
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    textAlign: "center",
    maxWidth: 300,
  },
  providers: {
    gap: Spacing.two,
  },
  providerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
