import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { BorderWidth, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type MobileWebOs, nativeAppCandidateOs, openInNativeApp } from "@/lib/open-in-app";

/**
 * Web fallback for a shared / QR link (circle or group-khatm invite, child-device
 * QR, TV sign-in QR) that opened in a phone browser instead of the app: one tap
 * hands the same link to the native app, or to its store listing when it isn't
 * installed. Renders nothing on native, desktop, an installed PWA, or during the
 * static export (resolved after mount so hydration matches).
 */
export function OpenInAppBanner({ path }: { path: string }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [os, setOs] = useState<MobileWebOs | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setOs(nativeAppCandidateOs());
  }, []);

  if (!os || dismissed) return null;

  return (
    <Card
      testID="open-in-app-banner"
      style={[
        styles.card,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28),
          borderWidth: BorderWidth.hairline,
        },
      ]}
    >
      <View style={styles.row}>
        <IconWell
          icon={{ ios: "iphone", android: "smartphone", web: "smartphone" }}
          tint={colors.accent}
          background={colors.background}
          well={40}
          size={20}
        />
        <View style={styles.copy}>
          <ThemedText type="smallBold">{t("openInApp.title")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("openInApp.body")}
          </ThemedText>
        </View>
      </View>
      <Button
        label={t("openInApp.action")}
        icon={{ ios: "arrow.up.forward.app", android: "open_in_new", web: "open_in_new" }}
        onPress={() => openInNativeApp(path, os)}
        fullWidth
      />
      <Button
        variant="ghost"
        label={t("openInApp.continueHere")}
        onPress={() => setDismissed(true)}
        fullWidth
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  copy: { flex: 1, gap: Spacing.half },
});
