import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Linking, Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useLocalizedSiteUrls } from "@/hooks/use-localized-site-urls";

type StorePlatform = "ios" | "android";

type Props = {
  platform: StorePlatform;
  topLine: string;
  bottomLine: string;
  accessibilityLabel: string;
  onPress: () => void;
};

const ICON_BY_PLATFORM: Record<StorePlatform, number> = {
  ios: require("@/assets/brands/apple.svg"),
  android: require("@/assets/brands/google.svg"),
};

/** Standard App Store / Google Play badge layout for web settings. */
export function StoreDownloadBadge({
  platform,
  topLine,
  bottomLine,
  accessibilityLabel,
  onPress,
}: Props) {
  return (
    <PressableScale
      haptic="medium"
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      style={styles.badge}
    >
      <Image source={ICON_BY_PLATFORM[platform]} style={styles.icon} contentFit="contain" />
      <View style={styles.textWrap}>
        <ThemedText type="caption" style={styles.topLine}>
          {topLine}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.bottomLine}>
          {bottomLine}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

/** Web-only section with App Store and Google Play download badges. */
export function DownloadNativeAppsSection() {
  const { t } = useTranslation();
  const { iosAppStoreUrl, androidPlayStoreUrl } = useLocalizedSiteUrls();

  if (Platform.OS !== "web") return null;

  const openStoreUrl = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={styles.section}>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.description}>
        {t("settings.downloadNativeAppsDesc")}
      </ThemedText>
      <View style={styles.badges}>
        <StoreDownloadBadge
          platform="ios"
          topLine={t("settings.downloadIosTopLine")}
          bottomLine={t("settings.downloadIosBottomLine")}
          accessibilityLabel={t("settings.downloadIosA11y")}
          onPress={() => openStoreUrl(iosAppStoreUrl)}
        />
        <StoreDownloadBadge
          platform="android"
          topLine={t("settings.downloadAndroidTopLine")}
          bottomLine={t("settings.downloadAndroidBottomLine")}
          accessibilityLabel={t("settings.downloadAndroidA11y")}
          onPress={() => openStoreUrl(androidPlayStoreUrl)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    backgroundColor: "#000000",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
    ...(Platform.OS === "web" ? { cursor: "pointer" as const } : {}),
  },
  icon: {
    width: 22,
    height: 22,
  },
  textWrap: {
    gap: 1,
  },
  topLine: {
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  bottomLine: {
    color: "#FFFFFF",
    letterSpacing: 0.1,
  },
  section: {
    gap: Spacing.three,
  },
  description: {
    lineHeight: 20,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
});
