import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { RECITE_ALONG_ICON, ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";
import { isPronunciationCheckPlatformAvailable } from "@/lib/quran-pronunciation/availability";
import { FATIHAH_PASSAGE, fatihahCheckHref } from "@/lib/recite-along/passages";

/**
 * Salah guide "Check my al-Fatihah" (D68): recite 1:1–7 aloud and the on-device
 * listener shows words that sounded skipped or unclear (NF-3.24), or — where
 * that check isn't available on this platform — the practice Check mode. A
 * practice aid only, never a ruling on anyone's salah; audio stays on the device.
 * Hidden where recite-along is unavailable (TV, unsupported runtime).
 */
export function FatihahCheckCard({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();
  const available = useReciteAlongAvailable();
  if (!available) return null;

  return (
    <Card padding="three">
      <SectionHeader title={t("reciteAlong.fatihah.title")} icon={RECITE_ALONG_ICON} />
      <ThemedText type="small" themeColor="mutedForeground" style={styles.body}>
        {compact ? t("reciteAlong.fatihah.short") : t("reciteAlong.fatihah.body")}
      </ThemedText>
      <View style={styles.buttons}>
        <Button
          label={t("reciteAlong.fatihah.cta")}
          icon={RECITE_ALONG_ICON}
          variant="primary"
          accessibilityHint={t("reciteAlong.fatihah.ctaHint")}
          onPress={() => router.push(fatihahCheckHref(isPronunciationCheckPlatformAvailable()))}
        />
        <ReciteAlongButton passage={FATIHAH_PASSAGE} variant="ghost" />
      </View>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
        {t("reciteAlong.fatihah.note")}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: Spacing.two, lineHeight: 20 },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  note: { marginTop: Spacing.two, lineHeight: 18 },
});
