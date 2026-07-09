import type { AppVersionMeta } from "@munib-tracker/api-client";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useLocalizedSiteUrls } from "@/hooks/use-localized-site-urls";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebPlatform, performAppUpdate } from "@/lib/app/app-update-actions";
import { chevronForward } from "@/lib/rtl";
import { useAppVersion } from "@/providers/app-version-provider";

type UpdateRequiredModalProps = {
  visible: boolean;
  meta: AppVersionMeta;
  isHard: boolean;
  presentation?: "modal" | "fullscreen";
};

export function UpdateRequiredModal({
  visible,
  meta,
  isHard,
  presentation = "modal",
}: UpdateRequiredModalProps) {
  const { clientVersion, dismissUpdatePrompt } = useAppVersion();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const isWeb = isWebPlatform();
  const { locale } = useLocalizedSiteUrls();

  const handleUpdate = () => {
    performAppUpdate(meta, { isHard, locale });
  };

  const handleDismiss = () => {
    dismissUpdatePrompt();
  };

  const bodyText = meta.message
    ? meta.message
    : isHard
      ? t("update.hardBody", { version: meta.latestVersion })
      : t("update.body", { version: meta.latestVersion });
  const title = isHard ? t("update.hardTitle") : t("update.title");
  const accentColor = isHard ? tokens.status.warning.color : colors.accent;
  const showVersionRow = clientVersion !== meta.latestVersion;
  const useFullscreen = presentation === "fullscreen" || isHard;

  const inner = (
    <View style={styles.content}>
      <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18` }]}>
        <AppIcon
          icon={isHard ? "exclamationmark.triangle.fill" : "arrow.down.circle.fill"}
          size={36}
          tintColor={accentColor}
        />
      </View>

      <ThemedText
        type="caption"
        style={[styles.badge, { color: accentColor, backgroundColor: `${accentColor}14` }]}
      >
        {isHard ? t("update.requiredBadge") : t("update.availableBadge")}
      </ThemedText>

      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>

      {showVersionRow ? (
        <View style={[styles.versionRow, { borderColor: colors.border }]}>
          <View style={styles.versionCol}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("update.yourVersion")}
            </ThemedText>
            <ThemedText type="smallBold" themeColor="mutedForeground">
              v{clientVersion}
            </ThemedText>
          </View>
          <AppIcon icon={chevronForward()} size={18} tintColor={colors.mutedForeground} />
          <View style={styles.versionCol}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("update.latestVersion")}
            </ThemedText>
            <ThemedText type="smallBold">v{meta.latestVersion}</ThemedText>
          </View>
        </View>
      ) : null}

      <ThemedText type="default" themeColor="mutedForeground" style={styles.body}>
        {bodyText}
      </ThemedText>

      {isWeb ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.webHint}>
          {isHard ? t("update.webHardRefreshHint") : t("update.webSoftRefreshHint")}
        </ThemedText>
      ) : null}

      {isHard ? (
        <ThemedText type="caption" style={[styles.hardNote, { color: accentColor }]}>
          {t("update.hardNote")}
        </ThemedText>
      ) : null}

      <View style={styles.actions}>
        {!isHard ? (
          <Button
            label={t("settings.remindInSettings")}
            onPress={handleDismiss}
            variant="secondary"
            fullWidth
          />
        ) : null}
        <Button
          label={isWeb ? t("update.webReloadButton") : t("update.updateButton")}
          onPress={handleUpdate}
          fullWidth
          labelColor={isHard ? undefined : colors.accentForeground}
          style={isHard ? { backgroundColor: accentColor } : undefined}
        />
      </View>
    </View>
  );

  if (!visible) return null;

  if (useFullscreen) {
    const webRootId = Platform.OS === "web" ? { nativeID: "hard-update-block-root" as const } : {};
    return (
      <View
        style={[
          styles.fullscreenRoot,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, Spacing.four),
          },
        ]}
        pointerEvents="auto"
        accessibilityViewIsModal
        {...webRootId}
      >
        <ScrollView
          contentContainerStyle={styles.fullscreenScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      </View>
    );
  }

  return (
    <Sheet visible={visible} onClose={handleDismiss} solid scrollable={false}>
      <ScrollView
        style={{ maxHeight: windowHeight * 0.75 }}
        contentContainerStyle={styles.sheetScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {!isHard ? (
          <Pressable
            onPress={handleDismiss}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
            style={styles.closeHit}
          />
        ) : null}
        {inner}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    gap: Spacing.three,
  },
  sheetScroll: {
    paddingBottom: Spacing.two,
  },
  closeHit: {
    alignSelf: "flex-end",
    width: 32,
    height: 8,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  title: {
    textAlign: "center",
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    width: "100%",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
  },
  versionCol: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one,
  },
  body: {
    textAlign: "center",
  },
  webHint: {
    textAlign: "center",
    maxWidth: 320,
  },
  hardNote: {
    textAlign: "center",
    fontWeight: "600",
  },
  actions: {
    width: "100%",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  fullscreenRoot: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  fullscreenScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Spacing.four,
  },
});
