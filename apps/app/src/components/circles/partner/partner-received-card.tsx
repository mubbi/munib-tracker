import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import type { VisibleNudges } from "@/lib/circles/partner";

/**
 * Anonymous nudges I received: "Someone made dua for you" and, after my local
 * Isha only, one fixed gentle reminder. Never says who sent it.
 */
export function PartnerReceivedCard({
  nudges,
  duasToday,
}: {
  nudges: VisibleNudges;
  duasToday: number;
}) {
  const { t } = useTranslation();
  if (!nudges.duas.length && !nudges.reminder) return null;
  return (
    <Card style={styles.card} accessibilityLabel={t("partnerCircle.received.title")}>
      <SectionHeader
        title={t("partnerCircle.received.title")}
        icon={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
      />
      {nudges.duas.length ? (
        <ThemedText type="default" testID="partner-dua-received">
          {duasToday > 0
            ? t("partnerCircle.received.duaToday")
            : t("partnerCircle.received.duaWeek")}
        </ThemedText>
      ) : null}
      {nudges.reminder ? (
        <ThemedText type="small" themeColor="mutedForeground" testID="partner-reminder-received">
          {t("partnerCircle.received.reminder")}
        </ThemedText>
      ) : null}
      {nudges.duas.length ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("partnerCircle.received.returnDua")}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
});
