import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Stagger } from "@/components/ui/stagger";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { gradientBackground } from "@/lib/gradient";
import { goBackOrReplace } from "@/lib/navigation";
import { useAuth } from "@/providers/auth-provider";
import { usePreferences } from "@/stores/preferences-store";

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isGuest, user, session } = useAuth();
  const prefs = usePreferences();

  const onContinue = () => {
    goBackOrReplace(router, isAuthenticated ? "/profile" : "/");
  };

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

        {isAuthenticated ? (
          <Button label={t("login.continueSignedIn")} fullWidth onPress={onContinue} />
        ) : (
          <>
            <SocialLoginButtons onSuccess={onContinue} />

            <Button
              label={t("common.continueAsGuest")}
              variant="ghost"
              fullWidth
              onPress={() => goBackOrReplace(router, "/")}
            />
          </>
        )}
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
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  wordmark: {
    textAlign: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 18,
  },
  heroText: {
    textAlign: "center",
    maxWidth: 300,
  },
  signedInMeta: {
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
