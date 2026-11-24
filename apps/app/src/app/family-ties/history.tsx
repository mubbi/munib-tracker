import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { PhoneOnlyNotice } from "@/components/self-review/phone-only-notice";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { VaultLockGate } from "@/components/vault";
import { Spacing } from "@/constants/theme";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { familyTiesActions, useFamilyTies } from "@/lib/family-ties/family-ties-store";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

function HistoryContent() {
  const { t } = useTranslation();
  const { formatIso } = useFormatCalendarDate();
  const { relatives, logs, status, error } = useFamilyTies();
  const names = useMemo(() => new Map(relatives.map((r) => [r.id, r.name])), [relatives]);

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (status !== "ready") return null;
  if (logs.length === 0) {
    return (
      <EmptyState
        icon={{ ios: "clock.fill", android: "history", web: "history" }}
        title={t("familyTies.history.emptyTitle")}
        description={t("familyTies.history.emptyBody")}
      />
    );
  }

  return (
    <View style={styles.stack}>
      {logs.map((log) => (
        <Card key={log.id} padding="three">
          <View style={styles.row}>
            <View style={styles.flex}>
              <ThemedText type="smallBold">
                {names.get(log.relativeId) ?? t("familyTies.history.removed")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("familyTies.history.line", {
                  kind: t(`familyTies.contact.${log.contact}`),
                  date: formatIso(log.date),
                })}
              </ThemedText>
            </View>
            <Button
              label={t("familyTies.history.remove")}
              variant="ghost"
              size="sm"
              onPress={() => void familyTiesActions.removeLog(log.id)}
            />
          </View>
        </Card>
      ))}
    </View>
  );
}

export default function FamilyTiesHistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("familyTies.eyebrow")}
      title={t("familyTies.history.title")}
      subtitle={t("familyTies.history.subtitle")}
      onBack={() => goBackOrReplace(router, "/family-ties")}
    >
      <Seo path="/family-ties/history" />
      {isTV() ? (
        <PhoneOnlyNotice />
      ) : (
        <VaultLockGate>
          <HistoryContent />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family-ties/history");
