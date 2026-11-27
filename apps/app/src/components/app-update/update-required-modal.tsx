import type { AppVersionMeta } from "@munib-tracker/api-client";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Sheet } from "@/components/ui/sheet";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { BorderWidth, Radius, Spacing, ZIndex } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useLocalizedSiteUrls } from "@/hooks/use-localized-site-urls";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebPlatform, performAppUpdate } from "@/lib/app/app-update-actions";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { useAppVersion } from "@/providers/app-version-provider";
import { UPDATE_HARD_ICON, UPDATE_SOFT_ICON } from "./update-icons";

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
  const insets = useAppSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const isWeb = isWebPlatform();
  const { locale } = useLocalizedSiteUrls();
  const chevronForward = useChevronForward();
  const tv = isTV();

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
    <View style={[styles.content, tv && styles.contentTv]}>
      <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18` }]}>
        <AppIcon
          icon={isHard ? UPDATE_HARD_ICON : UPDATE_SOFT_ICON}
          size={36}
          tintColor={accentColor}
        />
      </View>

      <Pill
        label={isHard ? t("update.requiredBadge") : t("update.availableBadge")}
        tone={isHard ? "warning" : "accent"}
      />

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
          <AppIcon icon={chevronForward} size={18} tintColor={colors.mutedForeground} />
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
        <ThemedText
          weight="semibold"
          type="caption"
          style={[styles.hardNote, { color: tokens.status.warning.text }]}
        >
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
          // TV: land the remote on the primary action when the prompt opens.
          preferredFocus={tv}
          // A-04: the required update uses the real AA danger variant — no fill override.
          variant={isHard ? "destructive" : "primary"}
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
          // Custom full-screen surface: keep content inside the TV overscan inset.
          tv && { paddingHorizontal: TvLayout.contentPaddingX },
        ]}
        accessibilityViewIsModal
        {...webRootId}
      >
        <TvScrollView
          contentContainerStyle={styles.fullscreenScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </TvScrollView>
      </View>
    );
  }

  return (
    // The Sheet's own close button (not on TV: "Remind me" and remote Back dismiss there)
    // replaces the old invisible 32×8 grabber-zone target (F-50).
    <Sheet
      visible={visible}
      onClose={handleDismiss}
      accessibilityLabel={title}
      showCloseButton={!tv}
      solid
      scrollable={false}
    >
      <TvScrollView
        style={{ maxHeight: windowHeight * 0.75 }}
        contentContainerStyle={styles.sheetScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {inner}
      </TvScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    gap: Spacing.three,
  },
  /** TV: keep the prompt a readable column instead of spanning the screen. */
  contentTv: {
    width: "100%",
    maxWidth: tvDp(640),
    alignSelf: "center",
  },
  sheetScroll: {
    paddingBottom: Spacing.two,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
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
    borderWidth: BorderWidth.hairline,
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
  },
  actions: {
    width: "100%",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  fullscreenRoot: {
    ...StyleSheet.absoluteFill,
    zIndex: ZIndex.gate,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    pointerEvents: "auto",
  },
  fullscreenScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Spacing.four,
  },
});
