import type { AuthSessionResponseDto } from "@munib-tracker/api-client";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { TvQrLoginPanel } from "@/components/auth/tv-qr-login-panel";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Stagger } from "@/components/ui/stagger";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { gradientBackground } from "@/lib/gradient";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useAuth } from "@/providers/auth-provider";
import { usePreferences } from "@/stores/preferences-store";

/** Comfortable CTA column — avoids stretched OAuth buttons on wide web/tablet. */
const AUTH_ACTIONS_MAX_WIDTH = 360;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { isAuthenticated, isGuest, user, session, applySessionDto } = useAuth();
  const prefs = usePreferences();
  const tv = isTV();

  const onContinue = () => {
    goBackOrReplace(router, isAuthenticated ? "/profile" : "/");
  };

  const onTvPaired = useCallback(
    async (dto: AuthSessionResponseDto) => {
      await applySessionDto(dto);
      goBackOrReplace(router, "/");
    },
    [applySessionDto, router],
  );

  const signedInName =
    prefs.displayName?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.trim() ||
    t("common.signedIn");
  const signedInEmail = user?.email?.trim();
  const provider = user?.provider ?? session?.provider;

  return (
    <ScreenLayout
      eyebrow={isGuest ? t("login.eyebrowGuest") : t("login.eyebrowWelcome")}
      title={isAuthenticated ? t("login.titleSignedIn") : t("login.title")}
      subtitle={isAuthenticated ? t("login.subtitleSignedIn") : t("login.subtitle")}
      onBack={onContinue}
      maxContentWidth={AUTH_ACTIONS_MAX_WIDTH + Spacing.four * 2}
    >
      <Seo
        path="/login"
        title={isAuthenticated ? t("login.titleSignedIn") : t("login.title")}
        description={t("seo.login.description")}
        index={false}
      />
      <Stagger>
        <View
          style={[
            styles.hero,
            gradientBackground(
              `linear-gradient(150deg, ${Brand.heroTop} 0%, ${Brand.heroGlow} 55%, ${Brand.heroBottom} 100%)`,
            ),
            { borderColor: Brand.heroBorder },
          ]}
        >
          {/* Branded splash header so the highest-intent screen matches the intro. */}
          <MosqueSilhouette color={Brand.heroBottom} opacity={0.4} scale={1.15} />
          <Image
            style={styles.logo}
            source={require("@/assets/images/munib-logo.png")}
            accessibilityLabel={t("common.appName")}
          />
          <ThemedText type="title" style={[styles.wordmark, { color: Brand.heroText }]}>
            {t("common.appName")}
          </ThemedText>
          <ThemedText type="small" style={[styles.heroText, { color: Brand.heroSubtext }]}>
            {isAuthenticated
              ? t("login.heroSignedIn")
              : isGuest
                ? t("login.heroGuest")
                : t("login.heroUser")}
          </ThemedText>
          {isAuthenticated ? (
            <View style={styles.signedInMeta}>
              <ThemedText type="smallBold" style={{ color: Brand.heroText }}>
                {signedInName}
              </ThemedText>
              {signedInEmail && signedInEmail !== signedInName ? (
                <ThemedText type="caption" style={{ color: Brand.heroSubtext }}>
                  {signedInEmail}
                </ThemedText>
              ) : null}
              {provider ? (
                <ThemedText type="caption" style={{ color: Brand.heroSubtext }}>
                  {t("profile.signedInWith", {
                    provider: t(
                      provider === "google"
                        ? "profile.providerGoogle"
                        : provider === "apple"
                          ? "profile.providerApple"
                          : "profile.providerFacebook",
                    ),
                  })}
                </ThemedText>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          {isAuthenticated ? (
            <Button label={t("login.continueSignedIn")} fullWidth onPress={onContinue} />
          ) : tv ? (
            <>
              <TvQrLoginPanel onSession={onTvPaired} />

              <View
                style={styles.orRow}
                accessibilityRole="text"
                accessibilityLabel={t("login.or")}
              >
                <View style={[styles.orLine, { backgroundColor: tokens.hairline }]} />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.orLabel}>
                  {t("login.or")}
                </ThemedText>
                <View style={[styles.orLine, { backgroundColor: tokens.hairline }]} />
              </View>

              <Button
                label={t("common.continueAsGuest")}
                variant="secondary"
                fullWidth
                preferredFocus
                onPress={() => goBackOrReplace(router, "/")}
              />

              <ThemedText type="caption" themeColor="mutedForeground" style={styles.guestHint}>
                {t("common.tvOauthHint")}
              </ThemedText>
            </>
          ) : (
            <>
              <SocialLoginButtons onSuccess={onContinue} />

              <View
                style={styles.orRow}
                accessibilityRole="text"
                accessibilityLabel={t("login.or")}
              >
                <View style={[styles.orLine, { backgroundColor: tokens.hairline }]} />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.orLabel}>
                  {t("login.or")}
                </ThemedText>
                <View style={[styles.orLine, { backgroundColor: tokens.hairline }]} />
              </View>

              <Button
                label={t("common.continueAsGuest")}
                variant="secondary"
                fullWidth
                onPress={() => goBackOrReplace(router, "/")}
              />

              <ThemedText type="caption" themeColor="mutedForeground" style={styles.guestHint}>
                {t("login.guestHint")}
              </ThemedText>
            </>
          )}
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  wordmark: {
    textAlign: "center",
  },
  logo: {
    width: 168,
    height: 168,
    borderRadius: 36,
  },
  heroText: {
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
  signedInMeta: {
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  actions: {
    width: "100%",
    maxWidth: AUTH_ACTIONS_MAX_WIDTH,
    alignSelf: "center",
    gap: Spacing.three,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  orLabel: {
    textTransform: "lowercase",
  },
  guestHint: {
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: Spacing.two,
  },
});
