import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { asrCalculationLabel } from "@/components/fiqh/madhhab-chooser";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { acceptAsrOffer, asrKeyForMadhhab, hasAsrMismatch } from "@/lib/fiqh/set-madhhab";
import { useToast } from "@/providers/toast-provider";
import { useLocation } from "@/stores/location-store";

/**
 * Neutral hint for the location / prayer-times screen (NF-3.0a §4.1.1): shown
 * only when "My madhhab" is a school whose default Asr differs from the
 * device's Asr calculation. It explains, offers a one-tap switch, and never
 * changes anything on its own — following the masjid's timetable is valid.
 */
export function AsrMismatchHint() {
  const { t } = useTranslation();
  const toast = useToast();
  const { madhhab } = useMadhhab();
  const { madhab: currentAsr } = useLocation();

  if (!hasAsrMismatch(madhhab, currentAsr)) return null;
  const target = asrKeyForMadhhab(madhhab);
  const targetLabel = asrCalculationLabel(target, t);

  return (
    <Card variant="muted" padding="three" style={styles.card}>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("fiqhRetrofit.asr.mismatchHint", {
          school: t(`fiqh.school.${madhhab}`),
          current: asrCalculationLabel(currentAsr, t),
        })}
      </ThemedText>
      <Button
        label={t("fiqhRetrofit.asr.offerAccept", { target: targetLabel })}
        variant="secondary"
        onPress={() =>
          void acceptAsrOffer(target).then(() => toast.success(t("fiqhRetrofit.asr.updated")))
        }
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
});
