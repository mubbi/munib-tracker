import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import type { TFunction } from "i18next";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import {
  acceptAsrOffer,
  type MadhhabChoice,
  type SetMadhhabResult,
  setMadhhab,
} from "@/lib/fiqh/set-madhhab";
import type { MadhabKey } from "@/lib/prayer-times";
import { useToast } from "@/providers/toast-provider";

/** User-facing name of an Asr calculation ("Standard" / "Hanafi"), shared with the location screen. */
export function asrCalculationLabel(key: MadhabKey, t: TFunction): string {
  return t(key === "hanafi" ? "location.madhabHanafi" : "location.madhabShafi");
}

export interface MadhhabChooser {
  /** Saves the choice (toast "Rulings updated across the app") and stages an Asr offer if needed. */
  choose: (choice: MadhhabChoice) => Promise<SetMadhhabResult>;
  /** Pending "Also use … Asr time?" offer, or `null`. */
  offer: { school: MadhhabId; asr: MadhabKey } | null;
  acceptOffer: () => Promise<void>;
  declineOffer: () => void;
}

/**
 * Shared NF-3.0a pick flow for every place that asks (onboarding, home card,
 * lazy sheet, Settings). Wraps `lib/fiqh/set-madhhab` with the toast and the
 * Asr offer state; hosts render {@link AsrOfferCard} inline while `offer` is set.
 */
export function useMadhhabChooser({ quiet = false }: { quiet?: boolean } = {}): MadhhabChooser {
  const { t } = useTranslation();
  const toast = useToast();
  const [offer, setOffer] = useState<MadhhabChooser["offer"]>(null);

  const choose = useCallback(
    async (choice: MadhhabChoice) => {
      const result = await setMadhhab(choice);
      // Onboarding passes `quiet`: nothing has used the old value yet, so no toast.
      if (result.changed && !quiet) toast.success(t("fiqhRetrofit.rulingsUpdated"));
      setOffer(choice != null && result.asrOffer ? { school: choice, asr: result.asrOffer } : null);
      return result;
    },
    [quiet, t, toast],
  );

  const acceptOffer = useCallback(async () => {
    if (!offer) return;
    await acceptAsrOffer(offer.asr);
    setOffer(null);
    if (!quiet) toast.success(t("fiqhRetrofit.asr.updated"));
  }, [offer, quiet, t, toast]);

  const declineOffer = useCallback(() => setOffer(null), []);

  return { choose, offer, acceptOffer, declineOffer };
}

type AsrOfferCardProps = {
  offer: NonNullable<MadhhabChooser["offer"]>;
  /** The device's current Asr calculation (shown so the choice is informed). */
  currentAsr: MadhabKey;
  onAccept: () => void;
  onDecline: () => void;
};

/**
 * "Also use <school> Asr time?" — offered after a pick, never applied
 * automatically (many people pray Asr by their masjid's timetable).
 */
export function AsrOfferCard({ offer, currentAsr, onAccept, onDecline }: AsrOfferCardProps) {
  const { t } = useTranslation();
  const school = t(`fiqh.school.${offer.school}`);
  const target = asrCalculationLabel(offer.asr, t);
  return (
    <Card variant="muted" padding="three" style={styles.card}>
      <ThemedText type="smallBold" heading={3}>
        {t("fiqhRetrofit.asr.offerTitle", { school })}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("fiqhRetrofit.asr.offerBody", {
          current: asrCalculationLabel(currentAsr, t),
          target,
        })}
      </ThemedText>
      <View style={styles.actions}>
        <Button
          label={t("fiqhRetrofit.asr.offerAccept", { target })}
          fullWidth
          preferredFocus
          onPress={onAccept}
        />
        <Button
          label={t("fiqhRetrofit.asr.offerKeep")}
          variant="ghost"
          fullWidth
          onPress={onDecline}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  actions: { gap: Spacing.two, marginTop: Spacing.one },
});
