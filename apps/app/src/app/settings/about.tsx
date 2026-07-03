import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
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
  const { colors, tokens } = useThemeTokens();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const openLink = (url: string) => {
    void openBrowserAsync(url);
  };

  return (
    <ScreenLayout
      eyebrow="Settings"
      title="About"
      subtitle="Credits, authenticity, and policies"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
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
            Version {version}
          </ThemedText>
        </Card>

        <Card padding="three">
          <SectionHeader
            title="Credits"
            icon={{ ios: "person.2.fill", android: "group", web: "group" }}
          />
          <View style={styles.creditRows}>
            <Credit label="Author" value="The Munib Tracker team" />
            <Credit label="Collaborators" value="Community contributors" />
          </View>
        </Card>

        <Card variant="muted" padding="three">
          <ThemedText type="smallBold">A dua</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground" style={styles.dua}>
            May Allah accept the efforts of everyone who contributed, forgive their shortcomings,
            and have mercy on their marhumeen. Ameen.
          </ThemedText>
        </Card>

        <Card padding="three">
          <SectionHeader
            title="Content authenticity"
            icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.authenticity}>
            Adhkar and supplications are drawn from well-known collections and kept close to widely
            published renderings. Please verify against a trusted scholar or source before relying
            on any specific ruling or count.
          </ThemedText>
        </Card>

        <Card padding="three">
          <View style={styles.links}>
            <SettingsRow
              icon={{ ios: "hand.raised.fill", android: "privacy_tip", web: "privacy_tip" }}
              title="Privacy policy"
              onPress={() => openLink(PRIVACY_URL)}
            />
            <SettingsRow
              icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
              title="Terms of service"
              onPress={() => openLink(TERMS_URL)}
            />
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

function Credit({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.credit}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
      <ThemedText type="small">{value}</ThemedText>
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
