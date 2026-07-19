import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";

export default function VoiceShortcutsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isAndroid = Platform.OS === "android";
  const isIos = Platform.OS === "ios";
  const title = t(isAndroid ? "externalCommands.titleAndroid" : "externalCommands.titleIos");
  const subtitle = t(
    isAndroid ? "externalCommands.settingsSubtitleAndroid" : "externalCommands.settingsSubtitleIos",
  );
  const intro = t(isAndroid ? "externalCommands.introAndroid" : "externalCommands.introIos");

  if (Platform.OS === "web") {
    return (
      <ScreenLayout
        eyebrow={t("settings.title")}
        title={title}
        subtitle={t("pinLock.webUnavailable")}
        onBack={() => goBackOrReplace(router, "/settings")}
      >
        <Seo path="/settings/voice-shortcuts" />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={title}
      subtitle={subtitle}
      onBack={() => goBackOrReplace(router, "/settings")}
    >
      <Seo path="/settings/voice-shortcuts" />
      <Stagger>
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {intro}
          </ThemedText>
        </Card>

        {isIos ? (
          <>
            <Card padding="three">
              <SectionHeader
                title={t("externalCommands.siriTitle")}
                icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
              />
              <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
                {t("externalCommands.siriHint")}
              </ThemedText>
            </Card>
            <Card padding="three">
              <SectionHeader
                title={t("externalCommands.watchTitle")}
                icon={{ ios: "applewatch", android: "watch", web: "watch" }}
              />
              <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
                {t("externalCommands.watchHint")}
              </ThemedText>
            </Card>
          </>
        ) : null}

        {isAndroid ? (
          <>
            <Card padding="three">
              <SectionHeader
                title={t("externalCommands.assistantTitle")}
                icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
              />
              <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
                {t("externalCommands.assistantHint")}
              </ThemedText>
            </Card>
            <Card padding="three">
              <SectionHeader
                title={t("externalCommands.wearTitle")}
                icon={{ ios: "applewatch", android: "watch", web: "watch" }}
              />
              <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
                {t("externalCommands.wearHint")}
              </ThemedText>
            </Card>
          </>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: Spacing.two,
  },
});
