import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useLocalizedSiteUrls } from "@/hooks/use-localized-site-urls";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebPlatform, performAppUpdate } from "@/lib/app/app-update-actions";
import { isTV } from "@/lib/platform/is-tv";
import { useAppVersion } from "@/providers/app-version-provider";
import { UPDATE_HARD_ICON, UPDATE_SOFT_ICON } from "./update-icons";

/** Window width at which the update actions sit side by side. */
const WIDE_MIN_WIDTH = 768;

export function AppUpdateSection() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { versionMeta, clientVersion, hasPendingUpdate, updatePromptDismissed, openUpdatePrompt } =
    useAppVersion();
  const { locale } = useLocalizedSiteUrls();
  const { width } = useWindowDimensions();
  // Wide web / tablets: buttons side by side in a compact row instead of two
  // full-width bars stretched across the settings column.
  const wide = !isTV() && width >= WIDE_MIN_WIDTH;

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
    <Card variant="outline" style={[styles.card, { borderColor: `${accent}55` }]}>
      <SectionHeader
        title={t("settings.appUpdate")}
        icon={{ ios: "arrow.down.circle.fill", android: "download", web: "download" }}
      />
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
          <AppIcon
            icon={isHard ? UPDATE_HARD_ICON : UPDATE_SOFT_ICON}
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
      <View style={[styles.actions, wide && styles.actionsWide]}>
        <Button
          label={isWeb ? t("update.webReloadButton") : t("settings.updateNow")}
          onPress={() => performAppUpdate(versionMeta, { isHard, locale })}
          fullWidth
          style={wide ? styles.actionWide : undefined}
        />
        {!isHard ? (
          <Button
            label={t("settings.viewUpdateDetails")}
            onPress={openUpdatePrompt}
            variant="secondary"
            fullWidth
            style={wide ? styles.actionWide : undefined}
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
    borderRadius: Radius.sm,
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
  actionsWide: {
    flexDirection: "row",
    maxWidth: 560,
  },
  actionWide: {
    flex: 1,
  },
  webHint: {
    textAlign: "center",
  },
});
