import type { ReactNode } from "react";
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import type { ThemedTextProps } from "@/components/themed-text";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const NATIVE_MIN_TOUCH = 44;

type ContentInlineLinkProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  /** Wrapped chips for inline copy; stacked rows for explore lists. */
  layout?: "inline" | "list";
  textType?: ThemedTextProps["type"];
  style?: StyleProp<ViewStyle>;
};

/**
 * Underlined in-app link with a generous tap target on native. Web keeps the
 * compact inline look; iOS/Android meet the 44pt minimum touch area.
 */
export function ContentInlineLink({
  label,
  onPress,
  accessibilityLabel,
  layout = "inline",
  textType,
  style,
}: ContentInlineLinkProps) {
  const { colors } = useThemeTokens();
  const resolvedTextType = textType ?? (layout === "list" ? "small" : "caption");

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      hitSlop={layout === "inline" && Platform.OS !== "web" ? 6 : undefined}
      style={[layout === "inline" ? styles.inline : styles.list, style]}
    >
      <ThemedText
        type={resolvedTextType}
        style={{ color: colors.accent, textDecorationLine: "underline" }}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

export function ContentInlineLinkGroup({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function ContentLinkList({
  links,
  style,
}: {
  links: { label: string; onPress: () => void; accessibilityLabel?: string }[];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.linkList, style]}>
      {links.map((link) => (
        <ContentInlineLink key={link.label} layout="list" {...link} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    justifyContent: "center",
    paddingVertical: Platform.OS === "web" ? 0 : Spacing.one + 2,
    paddingHorizontal: Platform.OS === "web" ? 0 : Spacing.two,
    minHeight: Platform.OS === "web" ? undefined : NATIVE_MIN_TOUCH,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  list: {
    justifyContent: "center",
    alignSelf: "stretch",
    paddingVertical: Platform.OS === "web" ? Spacing.half : Spacing.two,
    paddingHorizontal: Spacing.one,
    minHeight: Platform.OS === "web" ? undefined : NATIVE_MIN_TOUCH,
    marginHorizontal: -Spacing.one,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  group: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Platform.OS === "web" ? Spacing.two : Spacing.one,
  },
  linkList: {
    gap: Platform.OS === "web" ? Spacing.two : Spacing.half,
  },
});
