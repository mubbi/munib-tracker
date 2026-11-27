import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import {
  EMPTY_QASR_ANSWERS,
  type QasrAnswers,
  QasrQuestions,
  QasrVerdict,
  qasrInputFrom,
  useFullDaysHint,
} from "@/components/travel/qasr-calculator";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { computeQasr } from "@/lib/qasr-calculator";

type TravelModeSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Turns on the travel excused period (never blocked by the answers). */
  onConfirm: () => void;
};

/**
 * "Turn on travel mode" asks the qasr calculator's two questions (distance +
 * intended stay) first, so the user sees whether their school counts the trip
 * as travel. Answers are not saved; the user can always continue.
 */
export function TravelModeSheet({ visible, onClose, onConfirm }: TravelModeSheetProps) {
  const { t } = useTranslation();
  const { rules } = useMadhhab();
  const [answers, setAnswers] = useState<QasrAnswers>(EMPTY_QASR_ANSWERS);
  const fullDaysHint = useFullDaysHint();

  useEffect(() => {
    if (visible) setAnswers(EMPTY_QASR_ANSWERS);
  }, [visible]);

  const travelRules = rules("travel");
  const notTraveller = useMemo(() => {
    const input = qasrInputFrom(answers);
    if (!input || !travelRules) return false;
    return computeQasr(input, travelRules).traveller === "no";
  }, [answers, travelRules]);

  return (
    <Sheet
      accessibilityLabel={t("travel.qasrCalc.sheetTitle")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
      solid
    >
      <ThemedText type="subtitle">{t("travel.qasrCalc.sheetTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("travel.qasrCalc.sheetHint")}
      </ThemedText>
      <QasrQuestions answers={answers} onChange={setAnswers} fullDaysHint={fullDaysHint} />
      <QasrVerdict answers={answers} />
      {notTraveller ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {t("travel.qasrCalc.notTravellerNote")}
        </ThemedText>
      ) : null}
      <View style={styles.actions}>
        <Button label={t("travel.qasrCalc.confirm")} fullWidth onPress={onConfirm} />
        <Button label={t("common.cancel")} variant="ghost" fullWidth onPress={onClose} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  note: { marginTop: Spacing.two },
  actions: { gap: Spacing.two, marginTop: Spacing.three },
});
