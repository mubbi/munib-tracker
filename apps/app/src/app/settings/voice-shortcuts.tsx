import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useSettingsFormMaxWidth } from "@/components/settings/settings-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getIntentsForPlatform } from "@/lib/appSurfaces/intents/registry";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function VoiceShortcutsScreen() {
  const formMaxWidth = useSettingsFormMaxWidth();
  const router = useRouter();
  const { t } = useTranslation();
  const isAndroid = Platform.OS === "android";
  const isIos = Platform.OS === "ios";
  const title = t(isAndroid ? "externalCommands.titleAndroid" : "externalCommands.titleIos");
  const subtitle = t(
    isAndroid ? "externalCommands.settingsSubtitleAndroid" : "externalCommands.settingsSubtitleIos",
  );
  const intro = t(isAndroid ? "externalCommands.introAndroid" : "externalCommands.introIos");
  const availableIntents = useMemo(
    () => getIntentsForPlatform(isAndroid ? "android" : "ios"),
    [isAndroid],
  );

  if (isTV()) {
    return (
      <ScreenLayout
        maxContentWidth={formMaxWidth}
        eyebrow={t("settings.title")}
        title={title}
        onBack={() => goBackOrReplace(router, "/settings")}
      >
        <Seo path="/settings/voice-shortcuts" />
        <EmptyState
          icon={{ ios: "tv", android: "tv", web: "tv" }}
          title={t("common.tvUnavailableTitle")}
          description={t("common.tvUnavailableBody")}
        />
      </ScreenLayout>
    );
  }

  if (Platform.OS === "web") {
    return (
      <ScreenLayout
        maxContentWidth={formMaxWidth}
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
      maxContentWidth={formMaxWidth}
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
          <Card padding="three">
            <SectionHeader
              title={t("externalCommands.siriTitle")}
              icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
            />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
              {t("externalCommands.siriHint")}
            </ThemedText>
          </Card>
        ) : null}
        {isIos ? (
          <Card padding="three">
            <SectionHeader
              title={t("externalCommands.watchTitle")}
              icon={{ ios: "applewatch", android: "watch", web: "watch" }}
            />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
              {t("externalCommands.watchHint")}
            </ThemedText>
          </Card>
        ) : null}

        {isAndroid ? (
          <Card padding="three">
            <SectionHeader
              title={t("externalCommands.assistantTitle")}
              icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
            />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
              {t("externalCommands.assistantHint")}
            </ThemedText>
          </Card>
        ) : null}
        {isAndroid ? (
          <Card padding="three">
            <SectionHeader
              title={t("externalCommands.wearTitle")}
              icon={{ ios: "applewatch", android: "watch", web: "watch" }}
            />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
              {t("externalCommands.wearHint")}
            </ThemedText>
          </Card>
        ) : null}

        <Card padding="three">
          <SectionHeader
            title={t("externalCommands.forceQuitTitle")}
            icon={{ ios: "bolt.slash.fill", android: "phonelink_off", web: "phonelink_off" }}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
            {t("externalCommands.forceQuitBody")}
          </ThemedText>
        </Card>

        {(isIos || isAndroid) && availableIntents.length > 0 ? (
          <Card padding="three">
            <SectionHeader
              title={t("externalCommands.moreShortcutsTitle")}
              icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
            />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
              {t("externalCommands.moreShortcutsHint")}
            </ThemedText>
            <View style={styles.shortcutList}>
              {availableIntents.map((intent) => (
                <View key={intent.id} style={styles.shortcutRow}>
                  <ThemedText type="small">{t(intent.titleKey, intent.titleFallback)}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {intent.siriPhraseEn}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: Spacing.two,
  },
  shortcutList: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  shortcutRow: {
    gap: 2,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/voice-shortcuts");
