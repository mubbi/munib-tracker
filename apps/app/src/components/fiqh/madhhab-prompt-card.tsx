import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { MadhhabPromptSheet } from "@/components/fiqh/madhhab-prompt-sheet";
import { SCHOOLS_DIFFER_ICON } from "@/components/fiqh/schools-differ-icon";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { dismissMadhhabPrompt } from "@/lib/fiqh/set-madhhab";
import { usePreferencesReady } from "@/stores/preferences-store";

// The sheet outlives the card's own condition: picking a school makes the
// madhhab "set" while the Asr offer step is still open, so the open flag is
// shared with the home gate to keep the host mounted until the sheet is done.
let sheetOpen = false;
const listeners = new Set<() => void>();
function setSheetOpen(open: boolean) {
  sheetOpen = open;
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
const getSheetOpen = () => sheetOpen;

function usePromptSheetOpen(): boolean {
  return useSyncExternalStore(subscribe, getSheetOpen, getSheetOpen);
}

/** Home gate: the one-time card shows while the madhhab was never asked (`undefined`). */
export function useShowMadhhabPromptCard(): boolean {
  const ready = usePreferencesReady();
  const { isUnset } = useMadhhab();
  const open = usePromptSheetOpen();
  return ready && (isUnset || open);
}

/**
 * One-time home card for existing users who were never asked (NF-3.0a
 * §4.1.1 item 3): "Choose your madhhab for rulings". "Show all views"
 * dismisses it for good (`madhhab: null`); choosing opens the shared sheet.
 * Mount it only when {@link useShowMadhhabPromptCard} is true.
 */
export function MadhhabPromptCard() {
  const { t } = useTranslation();
  const open = usePromptSheetOpen();
  const { isUnset } = useMadhhab();
  // Mounted only while open (the home card renders long before anyone taps it).
  const sheet = open ? <MadhhabPromptSheet visible onDone={() => setSheetOpen(false)} /> : null;

  // The sheet stays a stable sibling so answering (which flips `isUnset`)
  // doesn't remount it mid-flow and lose the Asr offer step.
  return (
    <>
      {isUnset ? (
        <Card padding="three">
          <SectionHeader title={t("fiqhRetrofit.prompt.cardTitle")} icon={SCHOOLS_DIFFER_ICON} />
          <View style={styles.body}>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("fiqhRetrofit.prompt.cardBody")}
            </ThemedText>
            <View style={styles.actions}>
              <Button
                label={t("fiqhRetrofit.prompt.choose")}
                fullWidth
                onPress={() => setSheetOpen(true)}
              />
              <Button
                label={t("fiqh.picker.allViews")}
                variant="ghost"
                fullWidth
                onPress={() => void dismissMadhhabPrompt()}
              />
            </View>
          </View>
        </Card>
      ) : null}
      {sheet}
    </>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three, marginTop: Spacing.two },
  actions: { gap: Spacing.two },
});
