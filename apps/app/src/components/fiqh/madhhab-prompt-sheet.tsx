import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { AsrOfferCard, useMadhhabChooser } from "@/components/fiqh/madhhab-chooser";
import { type MadhhabChoice, MadhhabPicker } from "@/components/fiqh/madhhab-picker";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { dismissMadhhabPrompt } from "@/lib/fiqh/set-madhhab";
import { useLocation } from "@/stores/location-store";

type MadhhabPromptSheetProps = {
  visible: boolean;
  /** Called once the sheet is finished (picked, dismissed, or the Asr offer answered). */
  onDone: () => void;
  /** `screen`: opened lazily by a fiqh-dependent screen; `home`: from the home card. */
  reason?: "home" | "screen";
};

/**
 * "Which madhhab do you follow?" bottom sheet (NF-3.0a §4.1.1 items 3–4).
 * Step 1 is the shared picker; picking a school whose default Asr differs from
 * the device's shows step 2, the Asr offer, inline (no stacked modals).
 * Dismissing without a choice records "Show all views" so it never returns.
 */
export function MadhhabPromptSheet({ visible, onDone, reason = "home" }: MadhhabPromptSheetProps) {
  const { t } = useTranslation();
  const chooser = useMadhhabChooser();
  const location = useLocation();

  const onPick = async (choice: MadhhabChoice) => {
    const result = await chooser.choose(choice);
    if (!result.asrOffer || choice == null) onDone();
  };

  const onClose = () => {
    if (chooser.offer) {
      chooser.declineOffer();
      onDone();
      return;
    }
    void dismissMadhhabPrompt().finally(onDone);
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      {chooser.offer ? (
        <AsrOfferCard
          offer={chooser.offer}
          currentAsr={location.madhab}
          onAccept={() => void chooser.acceptOffer().finally(onDone)}
          onDecline={() => {
            chooser.declineOffer();
            onDone();
          }}
        />
      ) : (
        <View style={styles.body}>
          <ThemedText type="subtitle" heading={2}>
            {t("fiqhRetrofit.prompt.sheetTitle")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t(
              reason === "screen" ? "fiqhRetrofit.prompt.sheetBodyScreen" : "fiqh.picker.subtitle",
            )}
          </ThemedText>
          <MadhhabPicker value={undefined} onChange={(choice) => void onPick(choice)} />
          <Button
            label={t("fiqhRetrofit.prompt.notNow")}
            variant="ghost"
            fullWidth
            onPress={onClose}
          />
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three },
});
