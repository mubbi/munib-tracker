import type { AuthSessionResponseDto } from "@munib-tracker/api-client";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, useWindowDimensions, View } from "react-native";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { TvQrLoginPanel } from "@/components/auth/tv-qr-login-panel";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Stagger } from "@/components/ui/stagger";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { gradientBackground } from "@/lib/gradient";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useAuth } from "@/providers/auth-provider";
import { usePreferences } from "@/stores/preferences-store";

/** Comfortable CTA column — avoids stretched OAuth buttons on wide web/tablet. */
const AUTH_ACTIONS_MAX_WIDTH = 360;
/** Desktop / tablet web: brand art beside the sign-in panel at this width. */
const WIDE_SPLIT_MIN_WIDTH = 900;
/** Wide split: art column + form panel. */
const WIDE_SPLIT_MAX_WIDTH = 1040;
const WIDE_FORM_PANEL_WIDTH = 400;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { isAuthenticated, isGuest, user, session, applySessionDto } = useAuth();
  const prefs = usePreferences();
  const tv = isTV();
  const { width } = useWindowDimensions();
  // Wide (non-TV) windows: split screen — hero art on the start side, sign-in
  // panel on the end side — instead of a phone column floating in the canvas.
  const wide = !tv && width >= WIDE_SPLIT_MIN_WIDTH;

  const onContinue = useCallback(() => {
    goBackOrReplace(router, isAuthenticated ? "/profile" : "/");
  }, [router, isAuthenticated]);

  // TV has no header back button: route remote Back / Menu through onContinue so
  // a login opened via replace (onboarding) lands on Home instead of exiting.
  useFocusEffect(
    useCallback(() => {
      if (!tv) return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        onContinue();
        return true;
      });
      return () => sub.remove();
    }, [tv, onContinue]),
  );

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

  const hero = (
    <View
      style={[
        styles.hero,
        wide ? styles.heroWide : null,
        gradientBackground(
          `linear-gradient(150deg, ${Brand.heroTop} 0%, ${Brand.heroGlow} 55%, ${Brand.heroBottom} 100%)`,
        ),
        { borderColor: Brand.heroBorder },
      ]}
    >
      {/* Branded splash header so the highest-intent screen matches the intro. */}
      <MosqueSilhouette color={Brand.heroBottom} opacity={0.4} scale={wide ? 1.6 : 1.15} />
      <Image
        style={[styles.logo, tv && styles.logoTv, wide && styles.logoWide]}
        source={require("@/assets/images/munib-logo.png")}
        accessibilityLabel={t("common.appName")}
      />
      <ThemedText type="title" style={[styles.wordmark, { color: Brand.heroText }]}>
        {t("common.appName")}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.heroText, wide && styles.heroTextWide, { color: Brand.heroSubtext }]}
      >
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
  );

  const actions = (
    <View style={[styles.actions, wide && styles.actionsWide]}>
      {isAuthenticated ? (
        <Button
          label={t("login.continueSignedIn")}
          fullWidth
          preferredFocus={tv}
          onPress={onContinue}
        />
      ) : (
        <>
          <SocialLoginButtons onSuccess={onContinue} />

          <View style={styles.orRow} accessibilityRole="text" accessibilityLabel={t("login.or")}>
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
  );

  return (
    <ScreenLayout
      eyebrow={isGuest ? t("login.eyebrowGuest") : t("login.eyebrowWelcome")}
      title={isAuthenticated ? t("login.titleSignedIn") : t("login.title")}
      subtitle={isAuthenticated ? t("login.subtitleSignedIn") : t("login.subtitle")}
      onBack={onContinue}
      maxContentWidth={
        tv && !isAuthenticated
          ? undefined
          : wide
            ? WIDE_SPLIT_MAX_WIDTH
            : AUTH_ACTIONS_MAX_WIDTH + Spacing.four * 2
      }
    >
      <Seo
        path="/login"
        title={isAuthenticated ? t("login.titleSignedIn") : t("login.title")}
        description={t("seo.login.description")}
        index={false}
      />
      {tv && !isAuthenticated ? (
        // 10-foot: QR panel beside the brand + guest column so the code is
        // visible without scrolling on a 960×540 landscape screen.
        <View style={styles.tvRow}>
          <View style={styles.tvQrCol}>
            <TvQrLoginPanel onSession={onTvPaired} />
          </View>
          <View style={styles.tvSideCol}>
            {hero}
            <Button
              label={t("common.continueAsGuest")}
              variant="secondary"
              fullWidth
              preferredFocus
              onPress={() => goBackOrReplace(router, "/")}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.guestHint}>
              {tTv(t, "common.tvOauthHint", "login.guestHintTv")}
            </ThemedText>
          </View>
        </View>
      ) : wide ? (
        <View style={styles.splitRow}>
          <View style={styles.splitArt}>{hero}</View>
          {actions}
        </View>
      ) : (
        <Stagger>
          {hero}
          {actions}
        </Stagger>
      )}
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
  /** Wide split: the hero fills the art column top to bottom. */
  heroWide: {
    flex: 1,
    minHeight: 480,
    justifyContent: "center",
    paddingVertical: Spacing.six,
  },
  logoWide: {
    width: 200,
    height: 200,
    borderRadius: 44,
  },
  heroTextWide: {
    maxWidth: 380,
  },
  splitRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing.six,
  },
  splitArt: {
    flex: 1,
    minWidth: 0,
  },
  actionsWide: {
    width: WIDE_FORM_PANEL_WIDTH,
    maxWidth: WIDE_FORM_PANEL_WIDTH,
    alignSelf: "center",
    flexShrink: 0,
  },
  logoTv: {
    width: tvDp(96),
    height: tvDp(96),
    borderRadius: tvDp(22),
  },
  tvRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.five,
  },
  tvQrCol: {
    flex: 1,
    minWidth: 0,
  },
  tvSideCol: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(auth)/login");
