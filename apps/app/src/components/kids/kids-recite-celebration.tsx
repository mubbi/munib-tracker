import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, StyleSheet, View } from "react-native";

import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * End of a kids recite-along: a confetti burst (skipped with reduced motion) and
 * warm words — no score, no grade, no streak. Then: again, or another surah.
 */
export function KidsReciteCelebration({
  surahName,
  onAgain,
  onAnother,
}: {
  surahName: string;
  onAgain: () => void;
  onAnother: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [burst, setBurst] = useState(0);
  const title = t("kids.recite.doneTitle");
  const body = t("kids.recite.doneBody", { surah: surahName });

  useEffect(() => {
    setBurst((n) => n + 1);
    AccessibilityInfo.announceForAccessibility(`${title} ${body}`);
  }, [body, title]);

  return (
    <Card padding="four" style={styles.card}>
      <PartyPopper
        burstKey={burst}
        colors={[colors.accent, tokens.status.success.color, tokens.status.warning.color]}
      />
      <IconWell
        icon={{ ios: "star.fill", android: "star", web: "star" }}
        size={32}
        well={72}
        tint={tokens.status.warning.color}
        background={tokens.status.warning.soft}
      />
      <ThemedText type="title" style={styles.center} accessibilityRole="header">
        {title}
      </ThemedText>
      <ThemedText type="default" themeColor="mutedForeground" style={styles.center}>
        {body}
      </ThemedText>
      <View style={styles.buttons}>
        <Button label={t("kids.recite.again")} variant="primary" onPress={onAgain} />
        <Button label={t("kids.recite.another")} variant="secondary" onPress={onAnother} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", gap: Spacing.three, overflow: "hidden" },
  center: { textAlign: "center" },
  buttons: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
