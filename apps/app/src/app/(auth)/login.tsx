import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Stagger } from "@/components/ui/stagger";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { gradientBackground } from "@/lib/gradient";
import { useAuth } from "@/providers/auth-provider";

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isGuest } = useAuth();

  const onSignedIn = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <ScreenLayout
      eyebrow={isGuest ? t("login.eyebrowGuest") : t("login.eyebrowWelcome")}
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
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
          <View style={[styles.badge, { backgroundColor: Brand.onHeroStrongSurface }]}>
            <SymbolView
              name={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
              size={30}
              tintColor={Brand.heroAccent}
            />
          </View>
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
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
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
});
