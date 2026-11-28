import { usePathname, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { CALLOUT_ICON, Callout } from "@/components/ui/callout";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  DEFERRED_SETUP_HREF,
  deferredOnboardingStore,
  isSetupNoticePath,
  useOnboardingPending,
} from "@/lib/onboarding/deferred-onboarding";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { useStore } from "@/stores/create-store";

/**
 * True while the "finish setup" attention bar belongs under this screen's title
 * bar: a first-time user who opened a deep link this session (onboarding
 * deferred by the root stack) and is on a regular page. It stays on every
 * screen until onboarding is complete. TV skips it (D-pad focus would land on
 * the bar first; Home has the callout).
 */
export function useShowSetupBar(): boolean {
  const pending = useOnboardingPending();
  const pathname = usePathname();
  const deferred = useStore(deferredOnboardingStore, (s) => s.deferred);
  return pending && deferred && !isTV() && isSetupNoticePath(pathname);
}

/** Below this window width the bar stacks title + body and keeps only a chevron. */
const SETUP_BAR_COMPACT_MAX = 600;

/**
 * Deferred onboarding: slim warning-toned bar rendered by `ScreenLayout` right
 * under the title bar (inside the floating header, so content clears it).
 *
 * Design: one warning accent only — a faint amber wash, a leading accent stripe
 * (flips in RTL), an amber glyph well and an amber "Complete setup ›" link; the
 * copy stays in the regular text colours for contrast. The whole bar is one
 * pressable (big target, one screen-reader stop, web hover from
 * `PressableScale`), so the link is styled text, never a nested button.
 * Compact windows stack title + body and drop the link label for a chevron.
 */
export function PendingOnboardingBar({ contentMaxWidth }: { contentMaxWidth?: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevron = useChevronForward();
  const { width } = useWindowDimensions();
  const compact = width < SETUP_BAR_COMPACT_MAX;
  const warning = tokens.status.warning;
  const title = t("onboarding.pending.barTitle");
  const body = t("onboarding.pending.barBody");
  const action = t("onboarding.pending.action");

  return (
    // Opaque underlay: the floating header is translucent and content scrolls beneath it.
    <View style={{ backgroundColor: colors.background }}>
      <PressableScale
        testID="pending-onboarding-bar"
        onPress={() => router.push(DEFERRED_SETUP_HREF)}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${body}`}
        accessibilityHint={action}
        scaleTo={1}
        dimOnPress
        rippleColor={withAlpha(warning.color, 0.18)}
        rippleRadius={0}
        style={[
          styles.bar,
          {
            backgroundColor: withAlpha(warning.color, 0.1),
            borderBottomColor: withAlpha(warning.color, 0.28),
          },
        ]}
      >
        <View style={[styles.stripe, { backgroundColor: warning.color }]} />
        <View style={[styles.row, contentMaxWidth ? { maxWidth: contentMaxWidth } : null]}>
          <IconWell
            icon={CALLOUT_ICON.warning}
            tint={warning.color}
            background={withAlpha(warning.color, 0.16)}
            well={28}
            radius={Radius.sm}
            size={IconSize.sm}
          />
          {compact ? (
            <View style={styles.copy}>
              <ThemedText type="smallBold" numberOfLines={1}>
                {title}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
                {body}
              </ThemedText>
            </View>
          ) : (
            <ThemedText type="small" style={styles.copy} numberOfLines={1}>
              <ThemedText type="smallBold">{title}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {`  ${body}`}
              </ThemedText>
            </ThemedText>
          )}
          <View style={styles.action}>
            {compact ? null : (
              <ThemedText type="smallBold" style={{ color: warning.text }}>
                {action}
              </ThemedText>
            )}
            <AppIcon icon={chevron} size={IconSize.sm} tintColor={warning.text} />
          </View>
        </View>
      </PressableScale>
    </View>
  );
}

/**
 * Home card for a first-time user who reached Home through a deep link this
 * session: "Finish setting up" with one action into the setup wizard. Renders
 * nothing once onboarding is complete (and never for web crawlers).
 */
export function PendingOnboardingCallout({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pending = useOnboardingPending();
  if (!pending) return null;
  return (
    <Callout
      tone="warning"
      title={t("settingsPanel.setup.title")}
      action={{
        label: t("onboarding.pending.action"),
        onPress: () => router.push(DEFERRED_SETUP_HREF),
      }}
      style={style}
      testID="pending-onboarding-callout"
    >
      {t("onboarding.pending.body")}
    </Callout>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    borderBottomWidth: BorderWidth.hairline,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    minHeight: Control.minTouch,
    justifyContent: "center",
  },
  /** Leading accent stripe — `start` so it moves to the right edge in RTL. */
  stripe: {
    position: "absolute",
    top: 0,
    bottom: 0,
    start: 0,
    width: 3,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
