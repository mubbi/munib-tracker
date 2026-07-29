import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useLocalizedSiteUrls } from "@/hooks/use-localized-site-urls";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebPlatform, performAppUpdate } from "@/lib/app/app-update-actions";
import { useAppVersion } from "@/providers/app-version-provider";

export function AppUpdateSection() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { versionMeta, clientVersion, hasPendingUpdate, updatePromptDismissed, openUpdatePrompt } =
    useAppVersion();
  const { locale } = useLocalizedSiteUrls();

  if (!hasPendingUpdate || !versionMeta) return null;
  if (versionMeta.updateRequired === "soft" && !updatePromptDismissed) return null;

  const isHard = versionMeta.updateRequired === "hard";
  const isWeb = isWebPlatform();
  const accent = isHard ? tokens.status.warning.color : colors.accent;

  const title = isHard ? t("settings.updateRequiredTitle") : t("settings.updateAvailableTitle");
  const description = isHard
    ? t("settings.updateRequiredDesc", { latest: versionMeta.latestVersion })
    : t("settings.updateAvailableDesc", {
        current: clientVersion,
        latest: versionMeta.latestVersion,
      });

  return (
    <Card variant="outline" padding="three" style={[styles.card, { borderColor: `${accent}55` }]}>
      <SectionHeader
        title={t("settings.appUpdate")}
        icon={{ ios: "arrow.down.circle.fill", android: "download", web: "download" }}
      />
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
          <AppIcon
            icon={isHard ? "exclamationmark.triangle.fill" : "arrow.down.circle.fill"}
            size={22}
            tintColor={accent}
          />
        </View>
        <View style={styles.copy}>
          <ThemedText type="smallBold">{title}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {versionMeta.message ?? description}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          label={isWeb ? t("update.webReloadButton") : t("settings.updateNow")}
          onPress={() => performAppUpdate(versionMeta, { isHard, locale })}
          fullWidth
        />
        {!isHard ? (
          <Button
            label={t("settings.viewUpdateDetails")}
            onPress={openUpdatePrompt}
            variant="secondary"
            fullWidth
          />
        ) : null}
      </View>
      {isWeb ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.webHint}>
          {isHard ? t("update.webHardRefreshHint") : t("update.webSoftRefreshHint")}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  actions: {
    gap: Spacing.two,
  },
  webHint: {
    textAlign: "center",
  },
});
