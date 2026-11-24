import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { getHijriObserver } from "@/lib/hijri";
import { hijriBasisFingerprint, hijriBasisMismatch } from "@/lib/hijri-adjustment";
import {
  clearHijriMonthStarts,
  keepHijriCorrectionsForCurrentPlace,
} from "@/lib/hijri-adjustment-actions";
import { isTV } from "@/lib/platform/is-tv";
import { useLocation } from "@/stores/location-store";

/**
 * One-time card after a move: "Your Hijri corrections were made for <old
 * place>. Keep or clear?" Corrections are never cleared silently. "Keep"
 * re-stamps them with the current basis, so the card does not come back.
 */
export function HijriBasisMovedCard() {
  const { t } = useTranslation();
  const adjustment = useHijriAdjustment();
  // Subscribing to the location re-renders the card when the observer changes.
  useLocation();
  const [busy, setBusy] = useState(false);
  const currentBasis = hijriBasisFingerprint(getHijriObserver());

  if (isTV() || !hijriBasisMismatch(adjustment, currentBasis)) return null;

  const place = adjustment?.basisPlace ?? t("hijriAdjust.previousPlace");
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card padding="three" style={styles.card}>
      <ThemedText type="smallBold">{t("hijriAdjust.movedTitle", { place })}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("hijriAdjust.movedBody")}
      </ThemedText>
      <View style={styles.actions}>
        <Button
          size="sm"
          variant="ghost"
          label={t("hijriAdjust.movedClear")}
          disabled={busy}
          onPress={() => void run(clearHijriMonthStarts)}
        />
        <Button
          size="sm"
          label={t("hijriAdjust.movedKeep")}
          disabled={busy}
          onPress={() => void run(keepHijriCorrectionsForCurrentPlace)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
  },
});
