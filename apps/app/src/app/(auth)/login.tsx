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

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isGuest } = useAuth();

  const onSignedIn = () => {
    goBackOrReplace(router, "/");
  };

  return (
    <ScreenLayout
      eyebrow={isGuest ? t("login.eyebrowGuest") : t("login.eyebrowWelcome")}
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/login"
        title={t("login.title")}
        description="Sign in to sync your worship data across devices."
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
            {isGuest ? t("login.heroGuest") : t("login.heroUser")}
          </ThemedText>
        </View>

        <SocialLoginButtons onSuccess={onSignedIn} />

        <Button
          label={t("common.continueAsGuest")}
          variant="ghost"
          fullWidth
          onPress={() => goBackOrReplace(router, "/")}
        />
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
});
