import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { BorderWidth, IconSize, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Shared shell of the PWA install banners: title, a 44px dismiss button, body. */
export function PwaBannerCard({
  title,
  onDismiss,
  children,
}: {
  title: string;
  onDismiss: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <Card style={[styles.card, { borderColor: tokens.accentBorder }]}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" style={styles.title}>
          {title}
        </ThemedText>
        <IconButton
          name={{ ios: "xmark", android: "close", web: "close" }}
          size={IconSize.md}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("pwa.installDismiss")}
          onPress={onDismiss}
          haptic={false}
        />
      </View>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    borderWidth: BorderWidth.thin,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    // The 44px dismiss target sits in the card padding instead of growing the row.
    marginVertical: -Spacing.twoHalf,
    marginEnd: -Spacing.twoHalf,
  },
  title: {
    flex: 1,
  },
});
