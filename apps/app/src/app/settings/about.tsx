import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app";
const PRIVACY_URL = `${SITE_URL}/privacy`;
const TERMS_URL = `${SITE_URL}/terms`;

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const openLink = (url: string) => {
    void openBrowserAsync(url);
  };

  return (
    <ScreenLayout
      eyebrow={t("about.eyebrow")}
      title={t("about.title")}
      subtitle={t("about.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/settings/about" />
      <Stagger>
        <Card style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
            <ThemedText type="header" style={{ color: colors.accent }}>
              ﷽
            </ThemedText>
          </View>
          <ThemedText type="subtitle">{APP_NAME}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.tagline}>
            {APP_TAGLINE}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("about.version", { version })}
          </ThemedText>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("about.credits")}
            icon={{ ios: "person.2.fill", android: "group", web: "group" }}
          />
          <View style={styles.creditRows}>
            <Credit label={t("about.authorLabel")} value={APP_AUTHOR} />
            <Credit
              label={t("about.authorWebsiteLabel")}
              value={APP_AUTHOR_URL.replace(/^https?:\/\//, "")}
              onPress={() => openLink(APP_AUTHOR_URL)}
              linkColor={colors.accent}
            />
            <Credit label={t("about.collaboratorsLabel")} value={t("about.collaboratorsValue")} />
          </View>
        </Card>

        <Card variant="muted" padding="three">
          <ThemedText type="smallBold">{t("about.duaTitle")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground" style={styles.dua}>
            {t("about.duaBody")}
          </ThemedText>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("about.authenticityTitle")}
            icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.authenticity}>
            {t("about.authenticityBody")}
          </ThemedText>
        </Card>

        <Card padding="three">
          <View style={styles.links}>
            <SettingsRow
              icon={{ ios: "hand.raised.fill", android: "privacy_tip", web: "privacy_tip" }}
              title={t("about.privacyPolicy")}
              onPress={() => openLink(PRIVACY_URL)}
            />
            <SettingsRow
              icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
              title={t("about.termsOfService")}
              onPress={() => openLink(TERMS_URL)}
            />
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

function Credit({
  label,
  value,
  onPress,
  linkColor,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  linkColor?: string;
}) {
  const valueNode = (
    <ThemedText type="small" style={linkColor ? { color: linkColor } : undefined}>
      {value}
    </ThemedText>
  );

  return (
    <View style={styles.credit}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
      {onPress ? (
        <Pressable accessibilityRole="link" onPress={onPress}>
          {valueNode}
        </Pressable>
      ) : (
        valueNode
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
  },
  tagline: {
    textAlign: "center",
    maxWidth: 280,
  },
  creditRows: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  credit: {
    gap: 2,
  },
  dua: {
    marginTop: Spacing.two,
  },
  authenticity: {
    marginTop: Spacing.three,
  },
  links: {
    gap: Spacing.two,
  },
});
