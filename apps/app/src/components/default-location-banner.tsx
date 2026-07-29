import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useLocation } from "@/stores/location-store";

/** Warns when Salah times still use the seeded Makkah fallback. */
export function DefaultLocationBanner() {
  const router = useRouter();
  const { t } = useTranslation();
  const location = useLocation();

  if (location.source !== "default") return null;

  return (
    <Card variant="muted" padding="three" style={styles.card}>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("location.defaultTimesHint")}
      </ThemedText>
      <Button
        label={t("location.setLocation")}
        variant="secondary"
        onPress={() => router.push("/location")}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
});
