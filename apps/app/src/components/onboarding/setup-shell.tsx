import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronBack } from "@/lib/rtl";

/** Readable single column on tablets / wide web (phones use the full width). */
export const SETUP_COLUMN_MAX_WIDTH = 560;

export interface SetupAction {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: AppIcon;
}

/** Wizard chrome shared by every step (progress + Back). */
export interface SetupChrome {
  position: number;
  total: number;
  /** The closing summary screen: the bar is full and no step count is read out. */
  done: boolean;
  onBack: () => void;
}

/**
 * One setup step: Back + "Step 2 of 5" progress, a scrollable centred column
 * (icon, title, short body, the step's controls) and a fixed footer with one
 * primary action and an optional secondary one. Uses theme tokens only, so it
 * follows light/dark and the user's accent; logical layout mirrors in RTL.
 */
export function SetupShell({
  chrome,
  icon,
  title,
  body,
  primary,
  secondary,
  primaryFocus = true,
  children,
}: {
  chrome: SetupChrome;
  icon: AppIcon;
  title: string;
  body?: string;
  primary: SetupAction;
  secondary?: SetupAction;
  /** TV: start D-pad focus on the primary action (steps with a picker focus it instead). */
  primaryFocus?: boolean;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const insets = useAppSafeAreaInsets();
  const chevronBack = useChevronBack();
  const tv = isTV();
  const column = tv ? styles.columnTv : styles.column;
  const progress = chrome.done ? 1 : chrome.position / Math.max(1, chrome.total);
  const stepLabel = chrome.done
    ? t("setupFlow.allSet")
    : t("setupFlow.stepOf", { current: chrome.position, total: chrome.total });

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, tv ? styles.headerTv : null]}>
        <View style={[styles.headerRow, column]}>
          <IconButton
            name={chevronBack}
            accessibilityLabel={t("common.back")}
            onPress={chrome.onBack}
            tintColor={colors.foreground}
          />
          <View style={styles.progress}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {stepLabel}
            </ThemedText>
            <ProgressBar value={progress} height={6} />
          </View>
        </View>
      </View>

      <TvScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, tv ? styles.scrollContentTv : null]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.body, column]}>
          <IconWell
            icon={icon}
            size={tv ? 28 : 24}
            well={56}
            tint={colors.accent}
            background={tokens.accentSoft}
          />
          <ThemedText type="title" heading={1}>
            {title}
          </ThemedText>
          {body ? (
            <ThemedText type="default" themeColor="mutedForeground">
              {body}
            </ThemedText>
          ) : null}
          {children ? <View style={styles.content}>{children}</View> : null}
        </View>
      </TvScrollView>

      <TvFocusGuide
        autoFocus={tv && primaryFocus}
        style={[
          styles.footer,
          {
            borderTopColor: tokens.hairline,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + Spacing.three,
          },
        ]}
      >
        <View style={[styles.actions, column, tv ? styles.actionsTv : null]}>
          <Button
            label={primary.label}
            icon={primary.icon}
            fullWidth
            disabled={primary.disabled}
            preferredFocus={tv && primaryFocus}
            onPress={primary.onPress}
            style={tv ? styles.actionTv : undefined}
          />
          {secondary ? (
            <Button
              label={secondary.label}
              variant="ghost"
              fullWidth
              disabled={secondary.disabled}
              onPress={secondary.onPress}
              style={tv ? styles.actionTv : undefined}
            />
          ) : null}
        </View>
      </TvFocusGuide>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  headerTv: { paddingHorizontal: TvLayout.contentPaddingX },
  headerRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  progress: { flex: 1, gap: Spacing.one, paddingEnd: Spacing.two },
  column: { width: "100%", maxWidth: SETUP_COLUMN_MAX_WIDTH, alignSelf: "center" },
  columnTv: { width: "100%", maxWidth: tvDp(720), alignSelf: "center" },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
  scrollContentTv: { paddingHorizontal: TvLayout.contentPaddingX },
  body: { gap: Spacing.two },
  content: { gap: Spacing.three, marginTop: Spacing.two },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  actions: { gap: Spacing.two },
  actionsTv: { flexDirection: "row", gap: Spacing.three },
  actionTv: { flex: 1 },
});
