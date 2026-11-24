import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { methodSuggestionFor } from "@/lib/prayer-method-suggestion";
import { acceptMethodSuggestion, dismissMethodSuggestion } from "@/lib/settings/method-suggestion";
import { useSettingsSelector } from "@/lib/settings/use-setting";
import { useToast } from "@/providers/toast-provider";

/**
 * "Suggested for Pakistan: University of Islamic Sciences, Karachi" — shown
 * under the calculation method (Settings › Salah times and the setup wizard)
 * only while the country's usual method differs from the current one. One tap
 * applies it; "Keep current" hides it for this country. Never automatic.
 */
export function MethodSuggestionCard() {
  const { t } = useTranslation();
  const toast = useToast();
  const location = useSettingsSelector((s) => s.location);
  const dismissed = useSettingsSelector((s) => s.device.methodSuggestionDismissed);
  const suggested = methodSuggestionFor(location, dismissed);
  if (!suggested || !location.countryCode) return null;
  const countryCode = location.countryCode;
  const method = t(`location.methods.${suggested}`);

  return (
    <Card variant="muted" padding="three" style={styles.card}>
      <ThemedText type="smallBold">
        {t("prayerMethodSuggestion.title", { country: location.country ?? countryCode })}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("prayerMethodSuggestion.body", { method })}
      </ThemedText>
      <View style={styles.actions}>
        <Button
          label={t("prayerMethodSuggestion.use")}
          variant="secondary"
          size="sm"
          onPress={() =>
            void acceptMethodSuggestion(suggested).then(() =>
              toast.success(t("prayerMethodSuggestion.updated")),
            )
          }
        />
        <Button
          label={t("prayerMethodSuggestion.keep")}
          variant="ghost"
          size="sm"
          onPress={() => void dismissMethodSuggestion(countryCode, suggested)}
        />
      </View>
    </Card>
  );
}

/** Registry editor wrapper (`prayer-times.methodSuggestion`). */
export function MethodSuggestionHint() {
  return <MethodSuggestionCard />;
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
