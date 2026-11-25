import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Spacing } from "@/constants/theme";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";

/** Kids Learn tab row → `/kids/recite` (D68). Hidden where practice is unavailable. */
export function KidsReciteEntry() {
  const { t } = useTranslation();
  const router = useRouter();
  if (!isPracticeAvailable()) return null;
  return (
    <Card padding="two" style={styles.gap}>
      <NavRow
        icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
        label={t("kids.recite.entry")}
        onPress={() => router.push("/kids/recite")}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("kids.recite.entryHint")}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.one },
  hint: { paddingHorizontal: Spacing.two, paddingBottom: Spacing.one },
});
