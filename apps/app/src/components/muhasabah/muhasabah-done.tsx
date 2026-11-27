import type { MuhasabahConfig, MuhasabahEntry } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useRecordAction } from "@/components/records/use-record-action";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { shouldOfferMuhasabahReminder } from "@/lib/muhasabah/flow";
import { muhasabahActions } from "@/lib/muhasabah/muhasabah-store";
import { useSetting } from "@/lib/settings/use-setting";

/** One-time "remind me nightly?" offer after the first completed review. */
function MuhasabahReminderOffer({ config }: { config: MuhasabahConfig }) {
  const { t } = useTranslation();
  const run = useRecordAction();
  const nightlyReminder = useSetting<boolean>("notifications.personal.muhasabah");

  if (!shouldOfferMuhasabahReminder(config, Boolean(nightlyReminder.value))) return null;

  return (
    <Card padding="four">
      <View style={styles.gap}>
        <ThemedText type="smallBold">{t("muhasabah.offerTitle")}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("muhasabah.offerBody")}
        </ThemedText>
        <View style={styles.row}>
          <Button
            label={t("muhasabah.offerYes")}
            onPress={() => {
              void nightlyReminder.setValue(true);
              void run(muhasabahActions.answerReminderOffer());
            }}
          />
          <Button
            label={t("muhasabah.offerNo")}
            variant="ghost"
            onPress={() => void run(muhasabahActions.answerReminderOffer())}
          />
        </View>
      </View>
    </Card>
  );
}

/** Tonight's review is saved: summary, "edit tonight" and the reminder offer. */
export function MuhasabahDone({
  entry,
  config,
  onEdit,
}: {
  entry: MuhasabahEntry;
  config: MuhasabahConfig;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.stack}>
      <Card padding="four">
        <View style={styles.gap}>
          <ThemedText type="subtitle">{t("muhasabah.doneTitle")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("muhasabah.doneBody")}
          </ThemedText>
          {entry.intention ? (
            <ThemedText type="small">
              {t("muhasabah.doneIntention", { intention: entry.intention })}
            </ThemedText>
          ) : null}
          <Button label={t("muhasabah.editTonight")} variant="secondary" onPress={onEdit} />
        </View>
      </Card>
      <MuhasabahReminderOffer config={config} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two, flexWrap: "wrap" },
});
