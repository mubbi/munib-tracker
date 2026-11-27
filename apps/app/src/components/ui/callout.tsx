import type { ReactNode } from "react";
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { BorderWidth, IconSize, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";

export type CalloutTone = "info" | "success" | "accent" | "warning" | "danger";

export const CALLOUT_ICON: Record<CalloutTone, AppIconType> = {
  info: { ios: "info.circle.fill", android: "info", web: "info" },
  success: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  accent: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  warning: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  danger: { ios: "exclamationmark.octagon.fill", android: "error", web: "error" },
};

export type CalloutProps = {
  tone?: CalloutTone;
  /** Leading glyph; defaults to the tone's icon. `null` hides it. */
  icon?: AppIconType | null;
  /** Optional bold first line. */
  title?: string;
  /**
   * Body. Strings render as `small` body text; pass an element (e.g. a
   * `LearnProseText`) to control typography yourself.
   */
  children?: ReactNode;
  /** One optional inline action ("Try again", "Open settings"). */
  action?: { label: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * The one inline notice: a tinted banner with an icon, optional title, body and
 * one action. Use it for intros, tips, permission banners, form-level blockers
 * and inline failures. `tone="danger"` is an `alert` (announced immediately —
 * assertive live region on Android / web); `warning` is a polite live region so
 * a blocker that appears after submit is read out too.
 */
export function Callout({
  tone = "info",
  icon,
  title,
  children,
  action,
  style,
  testID,
}: CalloutProps) {
  const { colors, tokens } = useThemeTokens();
  const palette =
    tone === "accent" ? { color: colors.accent, soft: tokens.accentSoft } : tokens.status[tone];
  const glyph = icon === undefined ? CALLOUT_ICON[tone] : icon;
  const body =
    typeof children === "string" || typeof children === "number" ? (
      <ThemedText type="small" style={[styles.bodyText, { color: colors.foreground }]}>
        {children}
      </ThemedText>
    ) : (
      children
    );

  return (
    <View
      testID={testID}
      style={[
        styles.callout,
        { backgroundColor: palette.soft, borderColor: withAlpha(palette.color, 0.25) },
        style,
      ]}
    >
      {glyph ? (
        <IconWell
          icon={glyph}
          tint={palette.color}
          background={withAlpha(palette.color, 0.12)}
          well={36}
          size={IconSize.md}
        />
      ) : null}
      <View style={styles.content}>
        {/* Title + body form one announcement; the action stays its own stop. */}
        <View {...liveRegionProps(tone)} style={styles.text}>
          {title ? (
            <ThemedText type="smallBold" style={{ color: colors.foreground }}>
              {title}
            </ThemedText>
          ) : null}
          {body}
        </View>
        {action ? (
          <Button
            label={action.label}
            onPress={action.onPress}
            variant="secondary"
            size="sm"
            style={styles.action}
          />
        ) : null}
      </View>
    </View>
  );
}

function liveRegionProps(tone: CalloutTone) {
  if (tone === "danger") {
    return {
      accessible: true,
      accessibilityRole: "alert" as const,
      accessibilityLiveRegion: "assertive" as const,
      ...(Platform.OS === "web" ? { role: "alert" as const } : null),
    };
  }
  if (tone === "warning") {
    return {
      accessible: true,
      accessibilityLiveRegion: "polite" as const,
      ...(Platform.OS === "web" ? { role: "status" as const } : null),
    };
  }
  return null;
}

const styles = StyleSheet.create({
  callout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  content: { flex: 1, minWidth: 0, gap: Spacing.one },
  text: { gap: Spacing.one },
  bodyText: { lineHeight: 22 },
  action: { alignSelf: "flex-start", marginTop: Spacing.one },
});
